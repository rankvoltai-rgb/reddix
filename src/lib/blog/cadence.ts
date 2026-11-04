/**
 * How fast the blog publishes.
 *
 * Posts are written in batches (a phase of docs/blog/content-roadmap.md) and
 * released a few at a time. Google has no rule against volume. The risk is how
 * a small site looks when it gains many similar pages in days, which is the
 * pattern its scaled-content policy describes, and it can't crawl and judge
 * them any faster anyway. A steady cadence lets each post be indexed and judged
 * on its own, and keeps a reserve to release while the next phase is written.
 *
 * `npm run blog:schedule` fills the calendar. The caps leave a little room over
 * the pattern for a timely post pinned to a date with `pin:` in its frontmatter.
 */

/** Scheduled dates start here; posts dated before it went live without the scheduler. */
export const SCHEDULE_START = '2026-11-01';

/** Posts per day of the week (UTC), Sunday first: Monday, Wednesday, Friday. */
export const POSTS_PER_WEEKDAY = [0, 1, 0, 1, 0, 1, 0] as const;

/** The most posts on one day. */
export const MAX_PER_DAY = 1;

/** The most posts in any seven consecutive days. */
export const MAX_PER_WEEK = 4;

/** Days between two posts from one cluster, so a topic arrives over weeks, not as a wall of near-neighbours. */
export const CLUSTER_GAP_DAYS = 3;

/** A post that waits longer than this between writing and release gets its facts re-checked first. */
export const STALE_AFTER_DAYS = 30;
