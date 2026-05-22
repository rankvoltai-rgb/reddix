## Goal

Make onboarding reliably set the app up for scanning:
1. The website URL analysis on Step 1 should populate every profile field the scanner uses.
2. By the time the user lands on the Scanner, 5 relevant subreddits are already monitored — no manual selection.

## Current behavior

- Step 1 (`OnboardingWizard.handleAnalyzeAndContinue`) already calls `firecrawlApi.analyzeWebsite` and writes the returned fields to `profiles`. If Firecrawl/Qwen fails, the failure is swallowed and the user advances to Step 2 with empty product fields, which makes later scans poor or empty.
- Subreddit preselection only happens in `triggerAutoSetup`, which runs **after** the paywall completes (post-Stripe redirect). It also calls `scanForLeads('auto')`, which contradicts the manual-only constraint. If `discover-subreddits` fails silently, the user reaches Scanner with zero monitored subreddits and has to add them by hand.

## Changes

### 1. `src/components/onboarding/OnboardingWizard.tsx` — Step 1 analyze flow

- In `handleAnalyzeAndContinue`:
  - If `analyzeWebsite` returns `success: false` or no usable fields, surface a toast ("We couldn't read your site — you can refine details later") and still let the user continue, but log which fields are empty.
  - After the profile update succeeds, kick off `firecrawlApi.discoverSubreddits()` **in the background** (no await blocking the UI) and upsert the top 5 into `monitored_subreddits`. This uses the freshly-analyzed profile, so suggestions are good, and it runs in parallel with the user picking a plan + paying.
  - Also kick off `autoGenerateKeywords()` at the same time so keywords are ready.

### 2. `triggerAutoSetup` (called after paywall completes)

- Remove `await firecrawlApi.scanForLeads('auto')` — violates manual-scan-only constraint.
- Keep the subreddit + keywords calls as a safety net (idempotent upsert), in case Step 1's background tasks didn't finish before Stripe checkout.
- Make subreddit preselection robust: if `discoverSubreddits` returns `< 5` good suggestions, top up from a static fallback list (`SaaS`, `Entrepreneur`, `smallbusiness`, `startups`, `marketing`) so the user always lands on Scanner with 5 active subreddits.

### 3. `supabase/functions/discover-subreddits/index.ts`

- Return HTTP 200 with `{ success: false, error: '...' }` on logical errors (currently 401/404/500) so the client can handle gracefully and the fallback list can fill in.
- No prompt changes.

### 4. UX copy on Step 1

- Update the helper text under Website URL: "We'll analyze your site and preselect 5 subreddits to monitor."

## Out of scope

- No DB schema changes.
- No changes to the paywall, Stripe flow, or `scan-reddit` itself.
- No changes to the Scanner page UI.

## Confirm before I build

1. **Fallback subreddit list** — OK with `SaaS, Entrepreneur, smallbusiness, startups, marketing`, or do you want a different default set?
2. **Block vs background on Step 1** — should subreddit discovery run in the background (user is not blocked, faster) or block "Analyze & Continue" until subreddits are saved (slower step 1, but guaranteed ready)? My recommendation: background.
3. **Re-running on re-analyze** — if a returning user re-enters onboarding with an updated URL, should we clear their existing monitored subreddits and re-discover, or only top up to 5?
