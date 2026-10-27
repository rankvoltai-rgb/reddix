# /features/lead-scoring — brief

## The page's one job

Someone searched **reddit lead scoring**. They want to know how a tool decides which Reddit lead to work first, and what happens to a lead after that. The page shows what happens after a post is saved: how it's ranked, what each mark on it means, when it gets a second read, and the statuses it moves through. Then it asks them to start (`/auth`).

## Concept

**"The order is the work."** The hero is a ranked stack of leads that re-sorts itself into Reddix's order. The interactive piece is a working triage list that uses the app's own sort, filter, card and status rules.

## Section plan

1. **Hero**: centred copy with the plain-text answer, and below it a full-width ranked stack that settles into final-score order (motion `layout`, static under reduced motion).
2. **Anatomy of a lead**: one analyzed lead card in the centre, numbered callouts on either side.
3. **Second read**: before → Analyze → after strip.
4. **Triage** (`#triage`): the Scanner list and the lead list side by side; filter, save, dismiss, analyze, change status, delete, reset.
5. **Statuses**: a rail from New to Converted, with Archived branching off.
6. **Questions**: 5 Q&A cells plus a sixth cell linking to intent detection.
7. **Close**: ink band with the CTA and related links.

## Truth (from the code, 2026-10-27)

- Final score = clamp(AI score + signal boost); level from the final score: `supabase/functions/scan-reddit/index.ts:474-476`, `analyze-lead/index.ts:172-183`.
- Marked analyzed at scan time only when confidence ≥ 0.8: `scan-reddit/index.ts:17, 479, 500`.
- Unanalyzed card hides level, score and reason; an analyzed card shows `intent_score` (the AI score), a competitor badge, `~x% conf` when confidence < 0.6, and the reason: `src/components/scanner/LeadCard.tsx:80-141`.
- Analyze reads the top 5 comments, re-runs heuristics on post + comments, re-scores and sets deep_analyzed, and needs a subscription: `analyze-lead/index.ts:13, 137-183`.
- Scanner list: excludes archived, sorted by quality_score then intent_score, level tabs with counts, opens on Hot if any hot, page sizes 15/25/50: `src/components/scanner/LeadsSection.tsx:68-127`.
- Save → engaged (`LeadsSection.tsx:200-217`); dismiss → archived (`:241-254`); generating a reply also sets engaged (`generate-reply/index.ts:266-273`).
- Lead list: status ≠ new, sorted by updated_at desc, search by title/subreddit/author, filter by status and intent, delete: `src/pages/Leads.tsx:86-146, 119-134`.
- **Never said:** notes (the column exists but no UI uses it), engagement/recency/subreddit weighting, real-time, CSV.

## How it differs from other pages

- **intent-detection** explains how a post is scored; this page explains what you do with scored leads. It links there instead of repeating the rubric.
- **analytics-dashboard** covers the summary screen; this page covers the list and the lifecycle.
- Layout: centred hero over a full-width stack (not two columns); anatomy callouts; side-by-side triage; rail timeline; FAQ cells; ink close.
