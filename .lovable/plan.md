# Fix glitchy onboarding flow + excessive refreshes

## What's actually broken

After tracing the auth/profile/subscription flow across `Index.tsx`, `Onboarding.tsx`, `Dashboard.tsx`, `useAuth.tsx`, and `useSubscription.tsx`, there are three real bugs producing the symptoms you're seeing.

### Bug 1 — Onboarding ↔ Dashboard ping-pong (the "goes to dashboard then back" glitch)

The three gatekeeper effects don't agree on what completed means:

- `Onboarding.tsx` redirects to `/dashboard` as soon as `profile.onboarding_completed === true`.
- `Dashboard.tsx` redirects to `/onboarding` if `!subscribed` (even when onboarding is completed).
- `Index.tsx` sends any logged-in user with `onboarding_completed` to `/dashboard`.

If a user ever finishes onboarding but doesn't have an active subscription (e.g. checkout abandoned, Stripe webhook delay, free tier, refund, returning user), they get bounced: Dashboard → Onboarding → Dashboard → Onboarding... That's the glitchy back-and-forth you saw, and every bounce is a new page view in analytics.

### Bug 2 — `OnboardingWizard` checkout-success effect has stale-closure deps

```ts
useEffect(() => {
  const checkout = searchParams.get('checkout');
  if (checkout === 'success') { ... refreshSubscription(); updateProfile(...); navigate(...) }
}, []);  // empty deps but reads searchParams, refreshSubscription, updateProfile, navigate, toast
```

It fires once with stale references, can re-run on hot reload, and never clears the `?checkout=success` query param — so a refresh re-triggers the same "Setup complete!" flow, updates the profile again, kicks off another auto-setup, and navigates again.

### Bug 3 — Subscription + profile refetch storm (the "high page views for no reason")

Network log shows ~3 `GET /profiles` and ~5 `POST /check-subscription` calls within 2 seconds for one page load. Root cause:

- `useAuth` calls `setUser(session?.user ?? null)` inside every `onAuthStateChange` event (INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED…). Each event creates a new user object reference.
- `useSubscription.checkSubscription` is `useCallback([user])`, and its `useEffect` depends on it. So every auth event → new user reference → new callback → re-run → another `check-subscription` invoke.
- `useProfile` is keyed on `user?.id`, but the same chain re-evaluates it.
- Combined with the redirect loop above, each bounce remounts pages and fires another round of these calls. That's why analytics shows inflated page views and your edge function logs show `[CHECK-SUBSCRIPTION]` running over and over for the same user.

## The fix

### 1. Single source of truth for routing gates

Introduce a small helper (e.g. `src/lib/routing.ts`) that, given `{ user, profile, subscribed }`, returns the canonical destination: `/auth`, `/onboarding`, or `/dashboard`. Use it in all three pages so they agree:

- Logged out → `/auth`
- Logged in, profile not loaded → render loader (don't navigate)
- Logged in, `!onboarding_completed` → `/onboarding`
- Logged in, `onboarding_completed && !subscribed` → stay on `/onboarding` step 2 (plan selection), **not** Dashboard. Don't push them to Dashboard until subscription is active.
- Otherwise → `/dashboard`

In `Onboarding.tsx`, only redirect to `/dashboard` when `profile.onboarding_completed && subscribed`. In `Dashboard.tsx`, only redirect to `/onboarding` when truly required, and never while `subLoading || profileLoading`. Guard every `navigate(...)` with `if (location.pathname !== target)` to avoid replacing the same route in a loop.

### 2. Stabilize the user reference in `useAuth`

Only call `setUser`/`setSession` when the user id or access token actually changed:

```ts
onAuthStateChange((_event, newSession) => {
  setSession(prev => prev?.access_token === newSession?.access_token ? prev : newSession);
  setUser(prev => prev?.id === newSession?.user?.id ? prev : (newSession?.user ?? null));
  setLoading(false);
});
```

This stops downstream `useCallback`/`useEffect` chains in `useSubscription` and `useProfile` from re-firing on every TOKEN_REFRESHED event.

### 3. Gate `useSubscription` so it doesn't thrash

- Make `checkSubscription` depend on `user?.id` (a primitive), not the user object.
- Add a small in-flight guard so two simultaneous invocations collapse into one.
- Remove the manual `supabase.auth.refreshSession()` block — `supabase-js` already auto-refreshes, and forcing a refresh on every check is one of the things multiplying the calls.

### 4. Fix the checkout-success effect in `OnboardingWizard`

- Add proper deps OR pull the logic into a one-shot ref-guarded handler (mirror the `hasRefreshedRef` pattern already used in `Dashboard.tsx`).
- Immediately strip `?checkout=success` from the URL with `setSearchParams({}, { replace: true })` so a refresh can't re-trigger the flow.
- Don't call `updateProfile` + `navigate('/dashboard')` until `refreshSubscription()` actually returns `subscribed: true`. If it returns false, stay on the plan step and surface a quiet retry (no error toast — matches the silent-error policy).

### 5. Belt-and-braces: stop redirect spam

In all three pages' navigation effects, early-return if the destination equals the current path. This is cheap insurance against any future regression that would otherwise show up as inflated page views.

## Files to change

- `src/hooks/useAuth.tsx` — stabilize setUser/setSession
- `src/hooks/useSubscription.tsx` — depend on user?.id, drop forced refresh, add in-flight guard
- `src/pages/Index.tsx` — use shared routing helper, guard against same-path navigate
- `src/pages/Onboarding.tsx` — only leave when `onboarding_completed && subscribed`
- `src/pages/Dashboard.tsx` — only redirect when truly required, guard same-path
- `src/components/onboarding/OnboardingWizard.tsx` — fix checkout-success effect, clear query param, gate completion on real subscription
- `src/lib/routing.ts` (new) — `resolveDestination({ user, profile, subscribed })`

## Out of scope (let me know if you want these too)

- The "tt" / "hfyf" test data sitting in your profile from earlier — I won't touch the DB unless you ask.
- The Scanner/Leads/Settings pages have their own gate effects; I'll only audit them if you confirm they also misbehave.
- Analytics tooling itself — once the loop is gone, the page-view counts should drop on their own.
