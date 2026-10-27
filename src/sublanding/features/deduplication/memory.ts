/**
 * The scanner's memory, replayed over days. Mirrors scan-reddit
 * (supabase/functions/scan-reddit/index.ts): a link seen in the last 7 days is
 * skipped first; then short posts are dropped without being remembered; junk
 * is remembered at score 0; everything scored is remembered; posts at 35+ are
 * saved. A memory hit doesn't refresh the date. Promotion is decided by the
 * scanner's own first-pass rules.
 */
import { buildHeuristics } from '../../../../supabase/functions/_shared/intent-heuristics';

/** SEEN_WINDOW_DAYS */
export const WINDOW_DAYS = 7;
/** INSERT_THRESHOLD */
export const SAVE_AT = 35;
/** MIN_CONTENT_LENGTH */
export const MIN_LENGTH = 40;

export interface SimPost {
  id: string;
  title: string;
  body: string;
  /** The final score a scan would give it. Illustrative. */
  score: number;
  /** The day it's posted; searches find it from then on. */
  day: number;
  /** How many of one scan's searches return it. */
  copies: number;
}

export type Outcome =
  | { kind: 'saved'; score: number; copies: number }
  | { kind: 'saved-again'; score: number; copies: number }
  | { kind: 'low'; score: number; copies: number }
  | { kind: 'junk'; copies: number }
  | { kind: 'short'; copies: number }
  | { kind: 'remembered'; since: number; until: number; copies: number };

/** Outcomes keyed by post id, then by scan day. */
export type Replay = Record<string, Record<number, Outcome>>;

/** Whether the first-pass rules skip a post as promotion or noise. */
export function isJunk(post: SimPost, competitors: string[]): boolean {
  return buildHeuristics(competitors)(post.title, post.body).skip;
}

export function replay(posts: SimPost[], scanDays: number[], competitors: string[]): Replay {
  const out: Replay = Object.fromEntries(posts.map((p) => [p.id, {}]));
  const lastSeen = new Map<string, number>();
  const saves = new Map<string, number>();

  for (const day of [...scanDays].sort((a, b) => a - b)) {
    // One entry per link however many searches returned it (seenInScan).
    for (const p of posts) {
      if (p.day > day) continue;
      const copies = p.copies;
      const seen = lastSeen.get(p.id);
      if (seen !== undefined && day - seen < WINDOW_DAYS) {
        out[p.id][day] = { kind: 'remembered', since: seen, until: seen + WINDOW_DAYS, copies };
        continue;
      }
      if (p.body.length < MIN_LENGTH) {
        out[p.id][day] = { kind: 'short', copies };
        continue;
      }
      lastSeen.set(p.id, day);
      if (isJunk(p, competitors)) {
        out[p.id][day] = { kind: 'junk', copies };
        continue;
      }
      if (p.score < SAVE_AT) {
        out[p.id][day] = { kind: 'low', score: p.score, copies };
        continue;
      }
      const n = (saves.get(p.id) ?? 0) + 1;
      saves.set(p.id, n);
      out[p.id][day] = { kind: n > 1 ? 'saved-again' : 'saved', score: p.score, copies };
    }
  }
  return out;
}

/** AI reads with the memory, and what they'd be if every scan re-read every
 *  post the rules let through. */
export function aiReads(posts: SimPost[], scanDays: number[], result: Replay, competitors: string[]) {
  let withMemory = 0;
  let without = 0;
  for (const p of posts) {
    for (const day of scanDays) {
      if (p.day > day || p.body.length < MIN_LENGTH || isJunk(p, competitors)) continue;
      without++;
      const o = result[p.id][day];
      if (o && (o.kind === 'saved' || o.kind === 'saved-again' || o.kind === 'low')) withMemory++;
    }
  }
  return { withMemory, without };
}
