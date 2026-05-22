## Root cause analysis

I traced the full `scan-reddit` pipeline against live data, edge logs, and `scan_history`. The previous fixes (per-batch timeout, fallback floor, 2-day seen window) are deployed and working — but lead generation is still **0 every scan**. The real blocker has shifted.

### The smoking gun

Edge logs (08:53 + 09:00 scans):
```
Found 46 total posts from all strategies
0 new unique posts (46 dupes/seen removed)
```

Database confirms it:
- `seen_posts` for the user: **45 rows, ALL marked at the 08:00 hour**
- `scan_history`: last 4 scans completed with `posts_scanned = 0`, `leads_found = 0`

The flow halts at line 635 (`if (uniquePosts.length === 0) return;`) — Pass 1, fallback floor, and inserts **never run**.

### Why every scan returns the same 46 URLs

1. `cached_search_terms` is reused for 24h → the same 8 queries fire every time.
2. Firecrawl + Google's `tbs:qdr:w/d` returns the same ranked Reddit URLs on repeat calls.
3. The 08:46 scan was the one that successfully ran Pass 1 (30 posts) but produced 0 leads — and in doing so, **marked all 30 + 15 others as seen**. Every subsequent scan now finds those same URLs and filters 100% of them out.
4. The 2-day seen window does nothing here because the cache is fresh (<2h old) and Firecrawl keeps returning the same URLs.

### Secondary issues found

- **`postsScannedCount` is set inside `doScan()` at line 649**, but the 08:46 scan that processed 30 posts still wrote `leads_found = 0`. That means Pass 1 returned 0 qualifiers AND the fallback floor didn't insert — likely the deployment timing: that scan ran before the floor logic was live. New scans never get that far now because of issue #1.
- **`pass1Qualified` fallback** is good but unreachable when `uniquePosts === 0`.
- **Mark-seen at line 734 marks EVERY content-passing post**, including ones that scored 0 in Pass 1. This poisons the pool for unqualified posts that might score higher in a different context (different product profile, retry).
- **Search query diversity is low**: only `topics.slice(0, 3)` and `subreddits.slice(0, 2-3)` are ever used. The user has 21 subreddits configured, but only 5 are ever searched.

## Proposed fix (frontend untouched, edge function only)

### A. Only mark QUALIFIED leads as seen
Move the `seen_posts` upsert to mark **only `pass1Qualified` posts** (the ones inserted as leads). Unqualified posts stay eligible for re-evaluation on the next scan — Firecrawl will keep returning them, but they may get a different score or be qualified once content evolves.

### B. Rotate searched subreddits + topics each scan
- Shuffle `subreddits` before slicing so different subreddits are queried each run.
- Rotate which `topics` slice is used (e.g., `topics.slice(scanIndex % topics.length, ...)`).
- Use scan count (or a random offset) to pick which 2-3 of 21 subs to hit.

### C. Add a "different freshness" rotation
Alternate `tbs` between `qdr:d`, `qdr:w`, `qdr:m` across scans so Google returns different SERPs.

### D. Reduce seen window for unqualified posts to 12h, keep 7d for qualified
Optional. If we keep marking all posts as seen (instead of A), use shorter window for unqualified.

### E. Diagnostic log: post-dedupe count + which URLs were filtered
Add `console.log` of first 5 filtered URLs so future debugging shows whether dedupe or AI is the blocker.

### F. One-time cleanup
Provide a SQL note to clear stale `seen_posts` for this user so the next scan has a clean slate to validate the fix.

## Technical changes — single file

`supabase/functions/scan-reddit/index.ts`:
- **Line 734-743**: change `postsToMark` to iterate `pass1Qualified` only (not all `postsToAnalyze`).
- **Line 574-607**: shuffle `subreddits` and rotate `topics` slice using a per-scan seed.
- **Line 578, 586, 595, 604**: rotate `freshness` parameter.
- **Line 633**: log first 5 dedupe-filtered URLs for diagnostics.
- No schema changes. No frontend changes. No new env vars.

## Out of scope
- No UI changes.
- No model swap.
- No new tables.
- No changes to Pass 2 / deep analysis.

## Validation steps after deploy
1. Run a manual scan.
2. Confirm log shows `N new unique posts` with N > 0.
3. Confirm `scan_history.leads_found > 0`.
4. Confirm `leads` table receives rows with `intent_level = 'research'`.
5. Run a second scan within 5 minutes → should still find new unique posts (different subs/topics rotated).
