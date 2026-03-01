

# Bug Fix + Lead Quality Upgrade Plan

## Bug 1 (CRITICAL): Deep Analysis Scores are Always `undefined`

**File:** `supabase/functions/scan-reddit/index.ts`

The `deepAnalyzePost` function prompts the AI to return JSON with field `intent_score`, but the return type and all consuming code reference `.score`. The AI responds with `{"intent_score": 75, "intent_level": "hot", "relevance_notes": "...", "author": "..."}`, but the code reads `.score` which is `undefined`.

Evidence from logs:
```
Deep: "Practice owners — how often do you revie..." => Score: undefined
Deep: "How are you handling professional headsh..." => Score: undefined
Inserting 0 qualified leads   <-- everything dropped!
```

**Fix:** Map the AI response fields to the expected return shape:
```typescript
const parsed = JSON.parse(jsonMatch[0]);
return {
  score: parsed.intent_score ?? parsed.score ?? 0,
  level: parsed.intent_level ?? parsed.level ?? 'low',
  notes: parsed.relevance_notes ?? parsed.notes ?? '',
  author: parsed.author ?? 'unknown',
};
```

## Bug 2 (HIGH): `seen_posts` upsert fails silently

The upsert uses `onConflict: 'user_id,post_url'` but there is no unique constraint on `(user_id, post_url)` in the `seen_posts` table. This means deduplication doesn't work -- the same posts get re-analyzed on every scan, wasting API credits.

**Fix:** Add a unique index via migration:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS seen_posts_user_url_unique
ON public.seen_posts (user_id, post_url);
```

## Improvement 1: Smarter Search Queries

Currently the intent modifier list is static and bloated (8 quoted phrases ORed together makes the Firecrawl query too broad). The search often returns irrelevant Reddit threads.

**Fix:** Instead of cramming all modifiers into one query, run **focused search strategies**:
- Strategy A (Fresh): Use AI-generated terms + subreddit scoping, no intent modifiers (let the AI scoring handle relevance)
- Strategy B (Competitor): Keep as-is but limit to 2 competitors max
- Strategy C (Subreddit): Search within each subreddit using the top 2 AI terms only
- Remove the broad intent modifier concatenation that dilutes results

## Improvement 2: Filter Non-Reddit URLs

Firecrawl `site:reddit.com` sometimes returns non-Reddit URLs or Reddit URLs that aren't actual posts (e.g., subreddit homepages, wiki pages, user profiles). These waste AI credits in Pass 1/2.

**Fix:** Add a URL validation step after search:
```typescript
const isRedditPost = (url: string) =>
  /reddit\.com\/r\/\w+\/comments\//.test(url);

const validPosts = uniquePosts.filter(p => isRedditPost(p.url));
```

## Improvement 3: Post Freshness Signal

Currently there's no way to know if a post is 1 hour old or 6 months old. Old posts are worthless for engagement but still get scored and inserted as leads.

**Fix:** Add freshness detection in the deep analysis prompt. Instruct the AI to check for date signals in the post content and penalize old posts. Also reduce the fallback search window from `qdr:m` (month) to `qdr:w` (week).

## Improvement 4: Minimum Content Threshold

Posts with no content (title only, or very short descriptions) produce unreliable scores. The AI hallucinates intent from vague titles.

**Fix:** Skip posts with less than 50 characters of content in Pass 1:
```typescript
const postsToAnalyze = uniquePosts
  .filter(p => (p.markdown || p.description || '').length >= 50)
  .slice(0, 30);
```

## Improvement 5: Use Tool Calling for Structured Output

The current approach of asking the AI to "return only JSON" and then regex-parsing `\{[\s\S]*\}` is fragile. It sometimes fails when the AI wraps JSON in markdown code fences or adds explanatory text.

**Fix:** Switch both Pass 1 and Pass 2 to use tool calling (function calling) for structured output extraction. This guarantees valid JSON and eliminates parsing failures.

## Summary of Changes

| File | Change |
|------|--------|
| `supabase/functions/scan-reddit/index.ts` | Fix score field mapping, add URL validation, content threshold, tighter searches, tool calling |
| Database migration | Add unique index on `seen_posts(user_id, post_url)` |

