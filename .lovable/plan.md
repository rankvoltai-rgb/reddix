## Smarter, cheaper Reddit lead generation

### Goals
- Cut AI spend ~50–65% per scan.
- Surface higher-converting leads first (competitor mentions, budget talk, direct asks).
- Stop polluting the CRM with provisional low-score noise.

### Changes

**1. Heuristic prefilter (zero AI cost)**
New `supabase/functions/_shared/intent-heuristics.ts`:
- Whitelist regex: `recommend|suggest|looking for|best .* for|alternative to|vs\.?|switching from|tired of|stuck with|budget|pricing|anyone use|worth it`.
- Blacklist regex: `i built|i made|check out my|launching|showcase|\[OC\]|hiring|for sale|giveaway`.
- Competitor matcher built from `profile.competitor_names`.
- Returns `{ skip: boolean, boost: number, hasCompetitor: boolean }`.

**2. Two-tier Firecrawl**
- Search calls drop `scrapeOptions` → titles + descriptions only (cheaper + faster).
- Top 8 prefiltered candidates get a single targeted Firecrawl scrape for full markdown.

**3. Collapse Pass 1 + Pass 2 into one batched call**
- Batch size 10 (was 6), model `google/gemini-3.1-flash-lite-preview`.
- Returns `{ score, intent_level, notes, confidence }`.
- Confidence ≥ 0.8 → write final with `deep_analyzed=true`.
- Lower confidence → write provisional; "Analyze" button does the second pass.

**4. Heuristic boosters applied after AI**
- +25 competitor mention, +15 pricing/budget, +10 "alternative to". Stored in new `quality_score`.

**5. Comment-aware deep analysis**
- `analyze-lead` fetches `${thread_url}.json` from Reddit (free, no Firecrawl) and feeds top 5 comments into the prompt for richer qualification.

**6. Stop polluting the leads table**
- Remove fallback-floor insert.
- Raise insert threshold to score ≥ 35.
- Sub-threshold posts only land in `seen_posts` with their score.

**7. Post-quality cache**
- `seen_posts` gains `last_score` + `last_scored_at`; rotation skips low-scoring posts for 7 days.

**8. UI**
- Sort leads by `quality_score DESC`.
- New competitor-mention badge on `LeadCard`.
- Confidence indicator on provisional leads.

### Database migration

```text
ALTER TABLE seen_posts
  ADD COLUMN last_score INTEGER,
  ADD COLUMN last_scored_at TIMESTAMPTZ;

ALTER TABLE leads
  ADD COLUMN quality_score INTEGER DEFAULT 0,
  ADD COLUMN confidence NUMERIC(3,2),
  ADD COLUMN has_competitor_mention BOOLEAN DEFAULT false;

CREATE INDEX idx_leads_user_quality
  ON leads (user_id, quality_score DESC);
```

### Files

- new: `supabase/functions/_shared/intent-heuristics.ts`
- new: `supabase/migrations/<ts>_lead_quality.sql`
- edit: `supabase/functions/scan-reddit/index.ts`
- edit: `supabase/functions/analyze-lead/index.ts`
- edit: `src/components/scanner/LeadsSection.tsx`
- edit: `src/components/scanner/LeadCard.tsx`

### Expected impact
- AI cost: −50 to −65% per scan.
- Lead quality: hot/warm pre-qualified, competitor leads surfaced first.
- Scan latency: ~−30% (no scrapeOptions on initial search).
