

# Supercharge the Lead Engine

## Problem Summary

The current pipeline has several bottlenecks that limit lead quality and scan speed:

1. Posts are analyzed one-by-one (30 sequential AI calls per scan)
2. The intent scoring prompt is too generic -- it misses nuanced buying signals
3. No comment/thread context is captured (the richest intent signals are in replies)
4. The intent threshold is too low (score >= 10), flooding results with noise
5. Scheduled scans require the `keywords` table to have entries, but the autonomous scanner bypasses it -- so background scans silently skip many users
6. Search terms are regenerated from scratch every scan with no learning

## What Changes

### 1. Batch AI Analysis (Speed)

Instead of 30 individual AI calls (one per post), batch 5-8 posts into a single AI call. This cuts scan time from ~60s to ~15s. The AI receives a numbered list of posts and returns a JSON array of scores.

### 2. Two-Pass Scoring (Quality)

- **Pass 1 (Fast Filter):** Use `gemini-2.5-flash-lite` to quickly score all posts in batches. Discard anything below 25.
- **Pass 2 (Deep Analysis):** Only posts scoring 25+ get a thorough analysis with `gemini-2.5-flash` using a richer prompt that considers subreddit culture, post age, comment count signals, and competitor mentions.

This means fewer AI credits wasted on junk posts, and higher-quality scoring on promising ones.

### 3. Smarter Intent Prompt (Accuracy)

Replace the current generic prompt with a structured scoring rubric:

- **Direct Ask (70-100):** "Can anyone recommend...", "looking for a tool that..."
- **Problem + Frustration (40-69):** "I'm struggling with...", mentions competitor pain
- **Research/Exploration (20-39):** "How do you handle...", comparing approaches
- **Casual/Off-topic (0-19):** General discussion, memes, already solved

Also include negative signals (already found a solution, post is a self-promotion, post is very old).

### 4. Fix Scheduled Scan Gate (Reliability)

The `scheduled-scan` function currently checks for keywords in the `keywords` table before triggering a scan. Since the autonomous scanner generates search terms dynamically (not from the keywords table), most users with auto-pilot get silently skipped.

Fix: Remove the keywords check from `scheduled-scan` -- only require subreddits to be configured.

### 5. Raise Quality Threshold

Increase the minimum score from 10 to 25 so only genuinely relevant posts become leads. This reduces noise significantly.

### 6. Smarter Search Term Caching

Cache AI-generated search terms for 24 hours in `localStorage`-style persistence (via a new `cached_search_terms` column on the `profiles` table). Only regenerate when the profile changes or the cache expires. This saves an AI call per scan.

## Files to Modify

- **`supabase/functions/scan-reddit/index.ts`** -- Batch analysis, two-pass scoring, improved prompts, higher threshold, search term caching
- **`supabase/functions/scheduled-scan/index.ts`** -- Remove keywords gate so autonomous scanning works for all configured users

## Database Changes

- Add `cached_search_terms` (JSONB, nullable) and `search_terms_cached_at` (timestamptz, nullable) columns to the `profiles` table for caching dynamic search terms

## What Stays the Same

- All UI components remain untouched
- The lead card display, intent filters, reply generation pipeline, and badge system are unchanged
- Subreddit configuration and discovery features stay as-is
- The Firecrawl search integration approach remains the same

## Technical Details

### Batch Analysis Format

```text
Analyze these Reddit posts for purchase intent. Return a JSON array.

Posts:
[1] Title: "Best CRM for small team?" | Content: "We're a 5-person startup..."
[2] Title: "Anyone tried Hubspot?" | Content: "Thinking of switching..."
...

Return: [{"post": 1, "score": 85, "level": "hot", "notes": "..."}, ...]
```

### Search Term Cache Schema

```text
profiles.cached_search_terms: ["lead generation tool", "reddit marketing", ...]
profiles.search_terms_cached_at: 2026-02-25T08:00:00Z
```

Cache expires after 24 hours or when product_name/company_description changes.

### Scheduled Scan Fix

Remove lines 56-65 in `scheduled-scan/index.ts` that check for keywords, replacing with a subreddits-only check.

