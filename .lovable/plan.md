## Root cause

The onboarding wizard pops up randomly because of two compounding bugs in the routing logic:

### Bug 1 — `resolveDestination` sends paid users back to `/onboarding` on every subscription glitch

`src/lib/routing.ts` line 43:
```ts
if (!subscribed) return '/onboarding';
```

This treats "no active subscription" as "needs onboarding". A user who has `onboarding_completed = true` will still get routed to `/onboarding` whenever `subscribed` is `false` — even momentarily.

### Bug 2 — `useSubscription` collapses every error to `subscribed = false`

`src/hooks/useSubscription.tsx` lines 63-72: any network error, edge-function cold-start hiccup, expired-token race, or `check-subscription` 5xx flips `subscribed` to `false`. Combined with Bug 1, the wizard pops up.

### Bug 3 — Wizard restarts at step 1 regardless of completion

`OnboardingWizard.tsx` line 30: `useState(1)` always starts at the business-details step. So when the user is wrongly bounced, they see the full form again (including fields they already filled), making it feel like onboarding "randomly re-opened".

### When this fires in practice
- After a tab is backgrounded and session refresh races with check-subscription
- Right after Stripe webhook lag (paid, but DB hasn't synced yet)
- During edge-function cold starts (5-10s of `subscribed=false`)
- On any temporary network blip

## Fix — frontend only, no schema changes

### A. Separate "needs onboarding" from "needs to subscribe"
`src/lib/routing.ts`:
- If `profile.onboarding_completed === true`, NEVER return `/onboarding`. Always send paid-required users to `/dashboard` (the dashboard already has a hard-paywall overlay per project memory), or to a dedicated `/checkout` route.
- The check becomes:
  ```ts
  if (!profile.onboarding_completed) return '/onboarding';
  return '/dashboard'; // dashboard handles paywall gating itself
  ```

### B. Don't downgrade `subscribed` on transient errors
`src/hooks/useSubscription.tsx`:
- Track the last known-good value. On error / network failure, KEEP the previous `subscribed` value rather than forcing `false`.
- Only set `subscribed = false` when the server explicitly returns `{ subscribed: false }`.
- Add an `unknown` state (or simply leave loading=true on error so navigation logic doesn't make a decision).

### C. Guard `Onboarding.tsx` from rendering the wizard for completed users
`src/pages/Onboarding.tsx`:
- If `profile.onboarding_completed === true`, immediately redirect to `/dashboard` and render the loader instead of the wizard. Belt-and-suspenders so even if routing logic ever mis-fires, the wizard never appears for completed users.

### D. (Defensive) `OnboardingWizard.tsx`
- On mount, if `profile.onboarding_completed === true`, `return null` and trigger a redirect. Prevents any future regression from showing the form.

## Out of scope
- No backend changes
- No schema migrations
- No changes to the paywall itself (it already exists on `/dashboard`)
- No changes to `useProfile`

## Files to touch
1. `src/lib/routing.ts` — drop the `!subscribed → /onboarding` rule
2. `src/hooks/useSubscription.tsx` — preserve last-known-good on error
3. `src/pages/Onboarding.tsx` — hard guard against rendering wizard when completed
4. `src/components/onboarding/OnboardingWizard.tsx` — early-return guard

## Validation
1. Set `onboarding_completed = true` and force `subscribed = false` (block the check-subscription edge function) — confirm user lands on `/dashboard` (with paywall) and never sees the wizard.
2. Background the tab for 10 min, return — confirm no wizard flash.
3. Hard-refresh `/dashboard` 10 times — confirm wizard never appears.
