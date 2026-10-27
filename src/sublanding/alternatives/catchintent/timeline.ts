/** Which platforms CatchIntent watched on a given day, from its changelog. */
import { PLATFORMS, type Platform } from './content';

export type Status = 'none' | 'pilot' | 'live' | 'legacy';

const DAY = 86_400_000;
export const toDay = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
export const toIso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** The explorer's range: the first changelog entry to today. */
export function range(now: Date) {
  const start = toDay(PLATFORMS[0].pilot ?? PLATFORMS[0].live);
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return { start, end, days: Math.max(0, Math.round((end - start) / DAY)) };
}

export const addDays = (start: number, n: number) => start + n * DAY;
export const daysBetween = (a: number, b: number) => Math.round((b - a) / DAY);

/** A platform's status for a new buyer on day t. After closing, it ran on
 *  only for customers who already had it. */
export function statusOn(t: number, p: (typeof PLATFORMS)[number]): Status {
  if (p.closed && t >= toDay(p.closed)) return 'legacy';
  if (t >= toDay(p.live)) return 'live';
  if (p.pilot && t >= toDay(p.pilot)) return 'pilot';
  return 'none';
}

/** What a new buyer could get on day t. */
export function availableOn(t: number): Platform[] {
  return PLATFORMS.filter((p) => statusOn(t, p) === 'live').map((p) => p.name);
}

export function formatDay(t: number) {
  return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
