## Problem

From `/dashboard`, clicking **Scanner**, **Leads**, or **Settings** in the sidebar does nothing visible. Root cause:

1. Each of those pages has a guard: if `!subscribed && onboarding_completed`, it calls `navigate('/onboarding')`.
2. `/onboarding` runs `resolveDestination`, sees `onboarding_completed=true`, and immediately sends the user back to `/dashboard`.
3. Net effect: click → flash → back on dashboard.

`/dashboard` does NOT bounce unsubscribed users — it relies on its own hard-paywall overlay. Scanner/Leads/Settings should follow the same pattern (server-side edge functions are already the real gate for premium actions).

## Fix

Align Scanner, Leads, and Settings with Dashboard's gating model: only redirect for missing auth or incomplete onboarding. Drop the `!subscribed` redirect.

Use the shared helper for consistency.

### Files

- `src/pages/Scanner.tsx` — replace the manual auth/onboarding/subscription `useEffect` with `resolveDestination` + `safeNavigate` (same shape as Dashboard). Keep `isFreePlan = !subscribed` so the in-page paywall UI still renders.
- `src/pages/Leads.tsx` — same replacement.
- `src/pages/Settings.tsx` — same replacement. Settings should remain reachable for unsubscribed users so they can manage their account.

### Notes

- No backend changes. Premium edge functions already verify subscription server-side via `_shared/subscription.ts`, so removing the client redirect does not weaken security.
- Dashboard's paywall overlay continues to be the primary purchase prompt. Scanner already has inline paywall UI gated on `isFreePlan`; Leads/Settings will simply be viewable.
- No changes to `resolveDestination` itself — its behavior (onboarded → `/dashboard`) is correct for `/` and `/onboarding`, and we only invoke it from the three pages to enforce auth + onboarding, not to redirect off the current page.

### Verification

- From `/dashboard`, sidebar links to `/scanner`, `/leads`, `/settings` navigate successfully whether subscribed or not.
- Unauthenticated user hitting any of those routes still gets sent to `/auth`.
- User with `onboarding_completed=false` still gets sent to `/onboarding`.
