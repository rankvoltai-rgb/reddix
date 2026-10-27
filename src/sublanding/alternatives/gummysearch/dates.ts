/** Date logic for the shutdown clock and the phase marker. Dates are the
 *  vendor's calendar days, compared in UTC so every visitor sees the same day. */
import { DATES } from './content';

const DAY = 86_400_000;
const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const today = (now: Date) => Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

/** Whole days from today until the shutdown day; 0 on the day, negative after. */
export function daysUntilShutdown(now: Date): number {
  return Math.round((day(DATES.shutdown) - today(now)) / DAY);
}

export type Urgency = 'calm' | 'soon' | 'urgent' | 'gone';

export function urgency(days: number): Urgency {
  if (days <= 0) return 'gone';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'soon';
  return 'calm';
}

/** How far through the closed period today is, 0–1, for the rail. */
export function railProgress(now: Date): number {
  const start = day(DATES.closed);
  const end = day(DATES.shutdown);
  return Math.min(1, Math.max(0, (today(now) - start) / (end - start)));
}

/** Which phase today falls in, by index into PHASES.phases. */
export function phaseIndex(now: Date, phases: { from: string | null; to: string | null }[]): number {
  const t = today(now);
  const i = phases.findIndex((p) => (p.from === null || t >= day(p.from)) && (p.to === null || t <= day(p.to)));
  return i === -1 ? phases.length - 1 : i;
}

/** Lifetime-deal access ends the day before the shutdown. */
export function lifetimeActive(now: Date): boolean {
  return today(now) <= day(DATES.lifetimeEnds);
}

export function formatDay(iso: string): string {
  return new Date(day(iso)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
