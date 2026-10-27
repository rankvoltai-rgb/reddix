# /features/scheduled-scans — brief

## The page's one job

Someone searched for **scheduled reddit scans** (or "automatic reddit monitoring", "how often does reddix scan"). The honest answer is that Reddix doesn't scan on a schedule: you press Scan. The page says so in its first lines, then shows exactly what one press does, why scans work this way, and lets the visitor plan a few presses to see what each one would search. Then it asks them to start (`/auth`).

The URL stays because people search for it. The page must never say or hint that scheduling exists or is coming.

## Concept

**"One press, one look."** A scan is a single, bounded event: at most 50 seconds of work, then a 5-minute rest before the next one. Every press lands in a new 5-minute rotation window, so each scan searches a different slice of your subreddits, phrases and time ranges.

**Hero visual:** a proportional timeline. A short red segment (the scan, up to 50 s) followed by a long hatched one (the 5-minute rest), with a playhead running along it.

## Section plan

1. **Hero:** wide, left-aligned type (no side card). The plain answer and the CTA sit in a row under the H1, and the timeline closes the hero.
2. **No timer, on purpose:** a two-column ledger of "Reddix does / Reddix doesn't", then why on-demand fits replying on Reddit.
3. **Inside one scan:** rows with the real limits in a right-hand column: the checks, the searches, the filtering (link to /features/deduplication), the scoring (link to /features/intent-detection), the saving, and what you get back.
4. **Plan a few scans (interactive):** an illustrative setup of subreddits, buyer phrases and competitors, plus a clock. Pressing Scan runs the scanner's rotation (reimplemented in `rotation.ts`) and its 5-minute rule, then lists the searches that press would run and tracks which subreddits have been covered so far.
5. **Questions:** five, laid out as a numbered list.
6. **Close:** an ink band with the CTA, plus related links.

## Truth (from the code, 2026-10-27)

- Scans start only from the Scan button (`src/pages/Scanner.tsx:181`, `firecrawlApi.scanForLeads('manual')`). Every scan_history row is `scan_type: 'manual'` (`scan-reddit/index.ts:281`). No cron or scheduler exists, and `scan_frequency_hours` is never read. Autopilot defaults to off (`migrations/20260522080922…sql:1`).
- A scan needs an active subscription (`index.ts:271`) and at least one active subreddit (`index.ts:315`).
- There's one scan per 5 minutes, measured from `last_scan_at` (`index.ts:299–311`, `RATE_LIMIT_MINUTES = 5`). The button also rests for 10 s after a scan (`Scanner.tsx:214–231`).
- A scan runs for at most 50 s (`TIMEOUT_MS`). If it hits that limit, it saves what it has (`index.ts:520–530`). AI scoring is skipped if under 15 s remain (`index.ts:435`). Each AI batch gets 12 s.
- Rotation: `rot = floor(now / 5 min)` reshuffles the subreddit order, rotates the buyer phrases and cycles the time ranges (past day/week/month) (`index.ts:359–374`). Each scan searches 3 subreddits: the latest posts in the first 2, plus phrase searches in the first 3.
- Searches per scan: 2 "latest" + 1 phrase-and-subreddit + 1 competitor (only if competitors are set) + 3 per-subreddit phrase searches, capped at 7 (`MAX_FIRECRAWL_CALLS`). Up to 15 results each, keeping only links to Reddit posts.
- Buyer phrases: 6–8, written from the profile and kept 24 h (`index.ts:87–99`), then rewritten. Editing product details clears them (`useProfile.tsx:40–45`).
- Up to 30 posts scored, up to 25 saved, at 35+.
- What you get back: a count of leads saved and posts scored. New leads go to the lead list.
- **Not true, so never said:** scheduled, automatic, background, overnight, 24/7, "set and forget", any frequency setting, "coming soon".

## Known quirks (not stated as features)

- A refused scan (inside the 5 minutes) returns an error message, but the Scanner page doesn't show it (`Scanner.tsx:205–210`). The page says the scan "is refused" without promising a message.
- The "(N hot)" in the scan toast counts all of the user's hot leads, not this scan's (`index.ts:229–233`).

## How it differs from sibling pages

- /features/intent-detection explains scoring. This page links there and doesn't repeat the rubric.
- /features/deduplication explains the 7-day memory. This page mentions it in one row and links there.
- Its layout uses no cell grid in the hero, a row ledger instead of step cells, and an ink close instead of a soft red one.
