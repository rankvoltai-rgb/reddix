/** The reply clock's logic: what Brandwatch's published Reddit arrival
 *  figures (content.ts) support for a given delay, and nothing more. */
import { ARRIVAL, ARRIVAL_TAIL_HOURS } from './content';

/** Slider stops, in hours. */
export const STOPS = [0.25, 0.5, 1, 1.5, 2, 3, 6, 12, 24, 30, 48];

export function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} minutes`;
  if (h === 1) return '1 hour';
  return `${h % 1 ? h.toFixed(1) : h} hours`;
}

export type Reading =
  | { kind: 'unknown'; next: number }
  | { kind: 'atLeast'; share: number; since: number }
  | { kind: 'nearlyAll' };

/** The share of Reddit content Brandwatch says has arrived by `h` hours. */
export function arrivedBy(h: number): Reading {
  if (h >= ARRIVAL_TAIL_HOURS) return { kind: 'nearlyAll' };
  const known = [...ARRIVAL].reverse().find((p) => h >= p.hours);
  if (!known) return { kind: 'unknown', next: ARRIVAL[0].share };
  return { kind: 'atLeast', share: known.share, since: known.hours };
}

/** Where a time sits on the clock's log scale, 0–100. */
export function position(h: number): number {
  const lo = STOPS[0];
  const hi = STOPS[STOPS.length - 1];
  return (Math.log(h / lo) / Math.log(hi / lo)) * 100;
}
