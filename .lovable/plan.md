# Performance Plan — Landing First, Then App

Goal: measurably faster first paint and interaction, without changing any features, auth flow, routing logic, or backend behavior.

## Phase 1 — Landing page (highest-impact, lowest-risk)

**1. Fix font loading (currently render-blocking, ~3 sequential CSS imports)**
- Remove the three `@import url('fonts.googleapis...')` lines at the top of `src/index.css` (Inter, Instrument Serif, Playfair Display).
- Consolidate into a single `<link rel="stylesheet">` in `index.html` with all three families combined into one `fonts.googleapis.com/css2?...&display=swap` request.
- Remove the unused **Open Sans** `<link>` in `index.html` (the app uses Inter, not Open Sans).
- Result: one font request instead of four, no CSS-side blocking import, swap fallback.

**2. Route-based code splitting in `src/App.tsx`**
- Keep `Index` (landing) as a static import so it ships in the initial bundle (it's the LCP route).
- Convert every other route (`Auth`, `Onboarding`, `Dashboard`, `Scanner`, `Leads`, `Settings`, `Alternatives`, `AlternativeDetail`, `Glossary`, `GlossaryTerm`, `FeatureDetail`, `RefundPolicy`, `Terms`, `UseCaseDetail`, `NotFound`) to `React.lazy(...)`.
- Wrap `<Routes>` in a single `<Suspense fallback={<Loader2 spinner />}>` matching the existing Index loader style.
- Result: landing visitors no longer download Scanner/Settings/Auth/Dashboard code (Settings alone is 571 lines + heavy deps).

**3. Lazy-load below-the-fold landing sections**
- In `src/pages/Index.tsx`, keep `Navbar` + `HeroSection` eager.
- Lazy-load `LogoBar`, `ProductDemo`, `StatsBar`, `HowItWorks`, `FeatureShowcase`, `FeaturesGrid`, `Testimonials`, `ComparisonSection`, `PricingSection`, `FAQSection`, `FinalCTA`, `Footer` via `React.lazy` inside a single `<Suspense fallback={null}>`.
- Result: hero is interactive sooner; remaining sections stream in.

**4. Vite vendor chunking (`vite.config.ts`)**
- Add `build.rollupOptions.output.manualChunks` to split: `react`/`react-dom`/`react-router-dom` → `react-vendor`; all `@radix-ui/*` → `radix`; `@tanstack/react-query` + `@supabase/supabase-js` → `data`; `lucide-react` → `icons`; `recharts` (only used in dashboard area) stays in its own chunk so it's tree-shaken out of landing.
- Result: better browser caching across deploys, smaller initial parse.

## Phase 2 — App-wide (after Phase 1 lands cleanly)

**5. React Query defaults in `src/App.tsx`**
- Configure `QueryClient` with `defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } }`. Avoids redundant refetches when users tab back. Existing per-query overrides are preserved.

**6. Auth/Subscription provider gating**
- Verify `AuthProvider` + `SubscriptionProvider` don't fire network calls on the landing page when there is no session. If `useSubscription` polls or calls `check-subscription` for anonymous visitors, short-circuit when `user` is null. Read-only check first; only change if a wasted call is confirmed.

**7. Heavy dashboard pages**
- `Scanner.tsx` (500 lines), `Settings.tsx` (571), `Leads.tsx` (339): once lazy-loaded via Phase-1 step 2 they no longer hurt landing. No internal refactor in this pass — avoid risk.

## Out of scope (intentionally)
- No SSR/prerender, no service worker, no image format conversion (assets are already small: favicon 78KB, logo 78KB — acceptable, can revisit).
- No business-logic refactor, no auth/routing changes, no schema changes, no removal of any feature.
- No changes to edge functions.

## Verification
- After Phase 1: rebuild, check that `/` still renders identically and that the network panel shows fewer route chunks on initial load. Click through to Auth/Dashboard to confirm lazy chunks load on demand.
- After Phase 2: confirm signed-in flows (onboarding gate, paywall overlay) still behave exactly as before.

## Files touched
- `src/index.css` (remove 3 @import lines)
- `index.html` (consolidate font link, drop Open Sans)
- `src/App.tsx` (lazy routes, Suspense, QueryClient defaults)
- `src/pages/Index.tsx` (lazy below-fold sections)
- `vite.config.ts` (manualChunks)
- `src/hooks/useSubscription.tsx` (only if a wasted anonymous call is confirmed)
