

# Fix: Scan Edge Function Failures and "Works Then Stops" Pattern

## Root Cause Analysis

There are **four distinct failure modes** causing the scan to break:

### Problem 1: CORS Headers Incomplete (Intermittent Failures)
**File:** `supabase/functions/scan-reddit/index.ts` (line 6)

The CORS `Access-Control-Allow-Headers` is missing required Supabase client headers (`x-supabase-client-platform`, `x-supabase-client-platform-version`, `x-supabase-client-runtime`, `x-supabase-client-runtime-version`). Modern Supabase JS SDK versions send these headers, and when the browser sends a preflight OPTIONS request, the edge function rejects it because the headers aren't listed. This causes **intermittent** failures -- it works in some browsers/sessions but not others, and can start failing after the SDK auto-refreshes the session.

**Fix:** Update CORS headers to include all required Supabase client headers.

### Problem 2: Strategy 0 (Latest Posts) Always 403s -- Wasted Time + API Credits
**File:** `supabase/functions/scan-reddit/index.ts` (lines 40-125)

Every single log shows `[Latest:X] Scrape failed: 403`. Reddit blocks Firecrawl's scraper from accessing `/new` pages. This strategy **never works** but adds 3 parallel HTTP requests every scan that waste time and could contribute to rate limiting on the Firecrawl side.

**Fix:** Replace the direct `/new` scrape with a **Firecrawl search** using `site:reddit.com/r/{subreddit}` with `tbs: 'qdr:d'` (past 24 hours). This achieves the same goal (finding the freshest posts) but actually works because it goes through Google's index rather than scraping Reddit directly.

### Problem 3: "Works Then Stops" -- All Posts Already Seen
**File:** `supabase/functions/scan-reddit/index.ts` (lines 676-693)

This is the core "stops working" bug. Here's the exact sequence:
1. Scan 1: Finds 90 posts, marks all in `seen_posts`, inserts leads. Works.
2. Scan 2: Same search queries return the same 90 posts from Firecrawl/Google. All 90 are in `seen_posts`. Result: "0 new unique posts". No leads.
3. Scan 3, 4, 5...: Same result. Zero leads forever until Google indexes new Reddit posts.

The search queries use `qdr:w` (past week), but the same posts keep appearing because Google's index doesn't change that fast. The deduplication is too aggressive -- once you've seen a URL, it's blocked forever.

**Fix:** Two changes:
- Use a time-based expiry on seen posts (only deduplicate posts seen in the last 7 days, not forever)
- Vary the search queries between scans by rotating which AI terms are used (term rotation)

### Problem 4: Edge Function Timeout on Heavy Scans
**File:** `supabase/functions/scan-reddit/index.ts` (lines 608-671)

The function fires 3 scrape requests (Strategy 0) + 1 fresh search + 1 competitor search + up to 5 subreddit searches + fallback searches, then runs Pass 1 + Pass 2 AI calls. That's potentially 10+ Firecrawl calls and 10+ AI calls. Edge functions have a ~60 second timeout. On a bad day, this times out silently and the client gets a generic error.

**Fix:** Add a timeout guard that stops processing and returns partial results before the edge function times out. Also cap total Firecrawl calls.

## Technical Changes

| File | Change |
|------|--------|
| `supabase/functions/scan-reddit/index.ts` | Fix CORS headers, replace broken Strategy 0 with time-scoped search, add seen-post expiry, add timeout guard, cap API calls |

### Detailed Implementation

**1. CORS Fix (line 6)**
```text
Add: x-supabase-client-platform, x-supabase-client-platform-version,
     x-supabase-client-runtime, x-supabase-client-runtime-version
```

**2. Replace Strategy 0**
Instead of scraping reddit.com/r/X/new (which 403s), use Firecrawl search with `tbs: 'qdr:d'` (last 24 hours):
```text
fetchLatestPosts() -> replaced with:
  runSearch(`site:reddit.com/r/{sub}`, `Latest:{sub}`, 'qdr:d', firecrawlKey)
```
This finds the most recently indexed posts in each subreddit without hitting Reddit's anti-bot wall.

**3. Seen-Post Expiry**
Change the deduplication query from "all seen posts ever" to "posts seen in the last 7 days":
```text
Before: .select('post_url').eq('user_id', userId)
After:  .select('post_url').eq('user_id', userId)
        .gte('last_seen_at', sevenDaysAgo)
```
This ensures posts naturally cycle back into consideration after a week.

**4. Timeout Guard**
Wrap the main processing in a race against a 50-second timer. If the timer wins, return whatever results have been gathered so far instead of crashing:
```text
const TIMEOUT_MS = 50_000;
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)
);
// Race against processing, catch timeout, return partial results
```

**5. Cap Total API Calls**
Limit Strategy 0 (now search-based) to 2 subreddits, Strategy C to 3 subreddits, and skip fallback if we already have 10+ posts. This keeps total Firecrawl calls to ~7 max.

