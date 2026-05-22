## Deep-Dive: Why Leads Aren't Showing

I traced the full backend pipeline (`scan-reddit` → DB → frontend) and cross-referenced live data, edge logs, and `scan_history`. The dashboard isn't the problem — **the scan pipeline has been inserting zero leads since the last refactor.**

### Hard evidence from the database

| Signal | Value |
|---|---|
| Most recent lead inserted (any user) | `2026-05-04` (18 days ago) |
| Recent `scan_history` rows | 9 of last 10 = `completed`, `leads_found = 0` |
| Latest scan for current user | `30 posts_scanned`, `0 leads_found` |
| Scan before that | `0 posts_scanned`, `0 leads_found` (seen-posts dedupe) |
| `seen_posts` cache for current user | 45 URLs in last 7 days |

So scans **do complete**, **do find posts**, and **do not crash** — they just never insert anything. That isolates the failure to the Pass-1 / insertion segment.

---

### Root causes (ranked by impact)

#### 1. Pass 1 hangs and hits the 50s timeout — primary culprit
Edge logs for the 08:46 scan:

```text
T+0s    "30 posts pass content threshold"
T+0s    "=== PASS 1: Batch Fast Filter ==="
T+47s   "⏰ Scan hit 50s timeout — returning partial results"
```

The expected log line `"Pass 1: N posts kept (>= 25)"` is **missing** — meaning `await Promise.all(pass1Promises)` never resolved before the timeout race fired. Five parallel `gemini-2.5-flash-lite` tool-calls (one per batch of 6 posts) are stalling on the AI gateway.

Because the timeout rejects the whole `doScan()` promise, the `pass1Qualified` array is never built, `leadsCollected` stays empty, and `completeScan()` writes 0 rows.

#### 2. `seen_posts` cache poisoning — secondary cause
On every subsequent scan within 7 days, the same ~46 Firecrawl URLs come back and are filtered out at the dedupe step:

```text
"0 new unique posts (46 dupes/seen removed)"
```

So even if Pass 1 worked, repeat scans (the user is clicking Scan Now rapidly) find nothing new. The seen-window is 7 days and the candidate pool per scan is tiny (~30–50 URLs from 7 capped Firecrawl calls).

#### 3. `hot_leads` / `warm_leads` metric is structurally wrong
All new inserts use `intent_level: 'research'` (provisional). `completeScan` then counts `hot`/`warm` from that same array, so those counters will always be 0 by construction — even when leads do exist. Misleading for analytics and for the dashboard "Hot leads" stat.

#### 4. No fallback when Pass 1 hangs
If the AI batch promise hangs, the loop has no per-batch timeout and no fallback insert. Combined with the 50s outer race, a single slow Gemini call = entire scan loses all candidates.

#### 5. Provisional-only inserts inflate the bar
With the deep-analysis removed and threshold at 25, raw Pass-1 scores from `gemini-2.5-flash-lite` cluster low for generic subreddit posts. Historical data confirms: the last batch ever inserted had scores 25–60, with most at 25–35. A flaky Pass 1 plus a strict threshold leaves nothing.

---

### Frontend is fine
`useDashboardStats` and `LeadsSection` query without intent filtering. Old users with pre-refactor leads (e.g. 590, 576, 440 rows) still see them. Provisional `research` leads render via `LeadCard`'s "Unanalyzed" path added last turn. So the UI surfaces whatever the DB contains — the DB just contains nothing new.

---

### Proposed fix (next loop, build mode)

**A. Make Pass 1 robust (the real fix)**
1. Wrap each `batchScorePass1` call in a per-batch `Promise.race` with a 12s timeout that resolves to default scores instead of rejecting.
2. Lower batch concurrency cap or chunk sequentially with `Promise.allSettled` so one stuck batch can't drag the rest down.
3. Add a `console.log` of pass1 score distribution to make this debuggable going forward.
4. Add a hard floor: if Pass 1 returns zero qualifiers but there are ≥10 content-passing posts, insert the top 10 by content length as provisional `research` leads with score = 20. Better to show "go analyze these" than nothing.

**B. Soften seen_posts dedupe**
- Drop the seen window from 7 days → 48 hours, OR only mark a post "seen" after it's actually qualified (not after every search hit). Current behavior burns the candidate pool.

**C. Fix `completeScan` metrics**
- Drop `hot_leads`/`warm_leads` from the immediate insert tally (they'll always be 0). Compute them from `leads` table at scan completion via a single `count` query grouped by `intent_level` for that user.

**D. Add scan diagnostics**
- Persist Pass-1 score histogram and timing per scan into `scan_history.error_message` (rename to `notes` later) for transparency.

**Out of scope:** No frontend changes, no schema migrations, no AI model swap.

**Files touched (next loop):** `supabase/functions/scan-reddit/index.ts` only.
