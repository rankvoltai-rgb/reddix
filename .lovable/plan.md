## Problem

Two things to address:

1. **Scans often return 0 (or partial) leads.** The most recent `scan-reddit` invocation hit the 50s edge-function timeout. Pass 1 (batch score) + Pass 2 (deep per-post Gemini analysis, up to 15 sequential-ish calls) burns the budget — when timeout fires, partial results are saved but the deep-analysis step usually never runs, so very few or zero leads land in the DB.
2. **AI costs scale with every scan**, even on posts the user never opens. The user wants control: scan should be cheap and broad, and deep analysis should happen only when the user clicks a button on a lead card.

## Plan

### 1. Make `scan-reddit` cheap and fast (remove Pass 2)

In `supabase/functions/scan-reddit/index.ts`:
- Keep Firecrawl search + dedupe + seen-posts logic as-is.
- Keep Pass 1 batch scoring (cheap, `gemini-2.5-flash-lite`, ~5 batches of 6 posts) to filter obvious junk.
- **Remove Pass 2 entirely** from the scan path.
- Insert every Pass-1-qualified post (score ≥ `PASS1_THRESHOLD`, e.g. lower it back to 25 so we surface more candidates) as a lead with:
  - `intent_score` = pass-1 score
  - `intent_level` = `'research'` (provisional, neutral)
  - `relevance_notes` = `null`
  - new flag `deep_analyzed = false`
- Drop `PASS2_MAX_POSTS` cap; raise candidate pool to ~40 posts.
- Result: scan completes in ~15–20s instead of timing out, and consistently returns a populated lead list.

### 2. New `analyze-lead` edge function (per-card deep analysis)

Create `supabase/functions/analyze-lead/index.ts`:
- POST `{ lead_id }`, auth required, validates the lead belongs to caller.
- Loads the lead's stored `thread_title` + `thread_content` + caller's profile.
- Calls existing `deepAnalyzePost` logic (Gemini 2.5 flash-lite, tool-calling) — exactly one AI call.
- Updates the lead row: `intent_score`, `intent_level` (hot/warm/research/low), `relevance_notes`, `deep_analyzed = true`, `analyzed_at = now()`.
- Returns 200 with `{ success: true, lead: {...} }` or `{ success: false, error }` per the silent-error contract.

### 3. Schema migration

Add two columns to `public.leads`:
- `deep_analyzed boolean DEFAULT false`
- `analyzed_at timestamptz`

(RLS unchanged — user-scoped policies already cover it.)

### 4. LeadCard UI: "Analyze" button

In `src/components/scanner/LeadCard.tsx`:
- When `lead.deep_analyzed === false`: hide the score badge, show provisional `🔍 Unanalyzed` intent label, add an **Analyze** button (Sparkles icon) alongside Reply/Save.
- When clicked: call `supabase.functions.invoke('analyze-lead', { body: { lead_id } })`, show spinner, then invalidate the leads query so the card re-renders with the real intent label, score, and `relevance_notes`.
- When `deep_analyzed === true`: render the badge/score exactly as today, and surface `relevance_notes` as a small italic line under the content preview.

### 5. Scanner copy tweak

Tiny meta line above the leads list: "Scans surface candidates fast — click **Analyze** on any card to spend 1 AI credit and get a full intent score + notes." Reinforces the cost model.

## Out of scope

- No changes to `generate-reply`, billing, onboarding, Stripe, or subreddit preseed.
- No changes to scan rate limit, search strategies, or Firecrawl quotas.
- Existing leads in the DB simply behave as `deep_analyzed = false` (default) and get an Analyze button.

## Files touched

- `supabase/functions/scan-reddit/index.ts` (remove Pass 2, lower threshold, insert as provisional)
- `supabase/functions/analyze-lead/index.ts` (new)
- `src/components/scanner/LeadCard.tsx` (Analyze button, provisional state, notes display)
- `src/components/scanner/LeadsSection.tsx` (wire `onAnalyze` mutation)
- `src/pages/Scanner.tsx` (one-line helper copy above leads)
- Migration: `leads.deep_analyzed`, `leads.analyzed_at`
