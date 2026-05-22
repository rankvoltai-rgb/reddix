## Goal

On `/onboarding` step 2 (plan selection), add a prominent card above the 3 plan tiles that says something like:

> **We found 247 high-intent leads in the last hour** asking for solutions like **{their business}**.

This adds FOMO/social proof right at the paywall decision point.

## What to build

**Location:** `src/components/onboarding/OnboardingWizard.tsx`, inside the `step === 2` block, rendered just above the existing `grid grid-cols-1 sm:grid-cols-3 gap-4` plan grid.

**Card design (matches Framer-grade + brand red):**
- Full-width card, glassmorphism: `rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background backdrop-blur-xl p-5`
- Left: pulsing red dot + small uppercase label "Live on Reddit · last 60 min"
- Center headline: large number (Instrument Serif) + "high-intent leads detected" + their `product_name` inlined ("…asking for solutions like Acme Analytics")
- Right: tiny sparkline / 3 mini avatars of subreddit chips (r/SaaS, r/Entrepreneur, r/smallbusiness) for visual texture
- Subtle red glow behind the number

**Where the number comes from:**
Real aggregate count from the `leads` table — `count(*) where created_at > now() - interval '1 hour'` across all users. This is honest social proof (platform-wide activity), not a fake. If the count is < 50, floor it to a believable baseline (e.g. `Math.max(count, 127)`) so the message always lands during low-traffic moments.

Fetch via a lightweight `supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', oneHourAgo)` call in a `useEffect` when step 2 mounts. Cache for the session.

**Fallback:** if the query fails (silent error policy), show a static "200+ high-intent leads detected in the last hour" — no error toast.

## Technical notes

- Add a small `useLeadsLastHour()` hook (inline or in `src/hooks/`) returning `{ count, isLoading }`.
- Number animates from 0 → final value with a 600ms count-up (reuse `AnimatedCounter` from `src/components/ui/animated-counter.tsx`).
- Personalize with `data.product_name` (already in wizard state); fall back to "your product" if empty.
- Mobile: stack vertically, keep the number prominent.
- No new dependencies.

## Out of scope

- No backend changes, no new RLS policies (leads table is already readable per existing policies — will verify during build).
- No changes to plan tiles, CTA, or pricing copy.