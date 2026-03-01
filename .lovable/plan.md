

# Fix: Scan Finding Zero Leads for New Users

## Root Cause Analysis

From the live logs, here's exactly what's happening:

1. **AI generates bad search terms**: The prompt asks for terms users would search, but the AI returns terms *about* the product ("Reddit lead generation", "AI Reddit marketing") instead of what the product's *customers* would say ("need help with social media", "looking for marketing tool")
2. **Overly specific quoted searches return 0 results**: Queries like `site:reddit.com/r/saas ("Reddit lead generation" OR "AI Reddit marketing")` are too narrow -- almost no Reddit posts contain these exact phrases
3. **No "latest posts" strategy**: The scan ONLY uses Firecrawl search (Google-indexed results). It never fetches the *newest posts* from monitored subreddits directly. For time-sensitive lead gen, this is the biggest gap
4. **Edge function times out**: The sequential search strategy (5 subreddit searches + 2 fallbacks) with `await` delays causes the function to exceed the timeout before reaching Pass 1/2

## Proposed Fixes

### Fix 1: Add a "Latest Posts" Strategy (Most Important)

Add a new Strategy 0 that fetches the most recent posts from each subreddit by scraping the subreddit's "new" page directly via Firecrawl scrape (not search). This guarantees fresh content regardless of search term quality.

```
For each monitored subreddit:
  Scrape reddit.com/r/{subreddit}/new -> extract post links
  Scrape top 5-10 posts for content
```

This uses Firecrawl's `scrape` endpoint on `reddit.com/r/{subreddit}/new` to get the latest post URLs, then processes them through the same Pass 1/2 pipeline. This ensures time-sensitive leads are caught even when search terms are suboptimal.

### Fix 2: Fix the Search Term Prompt

The current prompt says "generate search terms that someone on Reddit would use when looking for this type of solution" -- but the AI interprets this as terms *describing* the product. 

Change to explicitly instruct: "Generate pain-point phrases and questions that a potential CUSTOMER would write in a Reddit post. These are NOT about the product, they are about the PROBLEM the product solves. Examples: 'struggling with email deliverability', 'need better project management', 'how to automate invoicing'."

### Fix 3: Remove Exact-Match Quoting from Subreddit Searches

Currently Strategy C wraps terms in quotes: `"Reddit lead generation"`. This requires an exact phrase match which almost never hits. Change to unquoted terms so partial matches work:

Before: `site:reddit.com/r/saas ("Reddit lead generation" OR "AI Reddit marketing")`
After: `site:reddit.com/r/saas Reddit lead generation OR AI Reddit marketing`

### Fix 4: Run Searches in Parallel

Currently all searches run sequentially with delays between them. Run Strategy A, B, and all Strategy C searches concurrently using `Promise.all` to stay well within the edge function timeout.

### Fix 5: Clear Stale Cached Terms on Profile Update

When a user updates their product info (name, description, features), invalidate the cached search terms so the next scan generates fresh, relevant ones. Currently bad terms persist for 24 hours.

## Technical Changes

| File | Change |
|------|--------|
| `supabase/functions/scan-reddit/index.ts` | Add latest-posts scraping strategy, fix search term prompt, remove excessive quoting, parallelize searches |
| `src/hooks/useProfile.tsx` | Clear `cached_search_terms` when profile product info changes |

## Implementation Details

### Latest Posts Strategy (new `fetchLatestPosts` function)

```text
1. Scrape reddit.com/r/{subreddit}/new via Firecrawl scrape (markdown format)
2. Extract post URLs from the scraped markdown using regex
3. For each URL not in seen_posts, scrape the individual post
4. Feed into the same Pass 1 -> Pass 2 pipeline
5. Run for up to 3 subreddits in parallel
```

### Parallelized Search

```text
Before (sequential, ~8s):
  Fresh -> wait -> Competitor -> wait -> Sub1 -> wait -> Sub2 -> ...

After (parallel, ~2s):
  Promise.all([Fresh, Competitor, Sub1, Sub2, Sub3])
```

### Search Term Prompt Fix

Add explicit negative examples and reframe the prompt to focus on customer pain points, not product features. Also add a guard: if any generated term contains the product name, filter it out.

