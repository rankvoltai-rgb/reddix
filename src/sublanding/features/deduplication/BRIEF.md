# /features/deduplication — brief

## The page's one job

Someone searched for **reddit lead deduplication** (or "never see the same reddit post twice", "duplicate leads reddit tool"). They have been burned by alert tools that show the same thread every day. The page explains exactly how Reddix avoids repeats, where the memory ends, and lets them replay two weeks of scans to watch it work. Then it asks them to start (`/auth`).

## Concept

**"One look a week."** Reddix remembers every post it looks at, by its link, for 7 days. That covers posts it saved, posts it scored low and posts it skipped as promotion. A post found by several searches in one scan is read once.

**Hero visual:** three copies of the same post, each found by a different search, slide into one card, which is stamped "Read once · remembered for 7 days".

## Section plan

1. **Hero:** centered copy, then the merging-copies visual below it, inside the same frame.
2. **Three places a repeat gets caught:** a sticky heading on the left, three layers on the right (inside a scan, across scans, junk remembered too).
3. **Replay two weeks (interactive):** six illustrative posts and 14 days. The visitor toggles scan days, and every cell is worked out by the scanner's real rules (`memory.ts`). A counter compares AI reads with and without the memory.
4. **Remembered or checked again:** a two-column table of what goes into the 7-day memory and what is looked at again next scan.
5. **Where a repeat can still get through:** the honest limits.
6. **Questions:** five, in a single centered column.
7. **Close:** split. The CTA sits on the left on the panel tone, with related links on the right.

## Truth (from the code, 2026-10-27)

- Inside one scan, links are deduplicated with a Set of exact URLs (`scan-reddit/index.ts:398–405`).
- Across scans, any URL in `seen_posts` with `last_seen_at` in the last 7 days is skipped before any rule or AI (`index.ts:345–355`, `:403`). The comment at `:351` confirms that both low scorers and saved leads are skipped.
- Written to memory:
  - junk-rule skips, with score 0 (`:416–419`)
  - scored posts under 35 (`:480–484`)
  - every post that clears 35 (`:503`), including any ranked below the top 25 that are not saved (`:505–507`)
- Not written to memory:
  - posts under 40 characters (`:414`)
  - candidates past the 30-post scoring cap (`:430`)
  - posts the AI returned no score for (`:472`)
  - memory hits themselves, which don't refresh `last_seen_at`, so the 7 days run from when a post was last processed
- Memory is per account: unique on `(user_id, post_url)` (`migrations/20260110094856…sql:11`, `20260301131756…sql:1–2`).
- The `leads` table has no unique constraint on `thread_url` (`migrations/20251221064746…sql:48`). A post found again after 7 days that scores 35+ is saved a second time.
- Matching is exact on the URL string. There's no normalization, so the same post under a different link form counts as new.
- `LOWSCORE_SKIP_THRESHOLD` (`:23`) is declared but unused. Whatever its comment says, the skip applies to every seen post.

## How it differs from sibling pages

- /features/scheduled-scans explains the scan. This page links to it and covers only memory.
- /features/intent-detection owns scoring. Scores here are illustrative inputs to the replay.
- Its layout uses a centered hero with a merge visual (not a side card or a wide-type hero), a sticky-left layer list, a full-width replay table, a single-column FAQ and a split close.
