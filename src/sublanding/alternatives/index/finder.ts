/** The fit finder's filter, over the same data as the directory. */
import { REDDIX_ROW, TOOLS, type Stop, type Tool } from './directory';

export type Reach = 'reddit' | 'many';
export type Hands = 'me' | 'tool';
export type Budget = 'free' | 'under50' | 'any';
export type Answers = { reach: Reach; hands: Hands; budget: Budget };

const YOURS: Stop[] = ['watch', 'find'];

export function fits(t: Pick<Tool, 'stop' | 'reddit' | 'from' | 'freePlan' | 'gone'>, a: Answers): boolean {
  if (t.gone) return false;
  if (a.reach === 'many' && t.reddit !== 'among others') return false;
  if ((a.hands === 'me') !== YOURS.includes(t.stop)) return false;
  if (a.budget === 'free') return t.freePlan;
  if (a.budget === 'under50') return t.freePlan || (t.from !== null && t.from < 50);
  return true;
}

/** Reddix as a candidate: Reddit only, you post, $45 a month, no free plan. */
const REDDIX = { stop: REDDIX_ROW.stop, reddit: 'only' as const, from: 45, freePlan: false };

export function shortlist(a: Answers) {
  return { tools: TOOLS.filter((t) => fits(t, a)), reddix: fits(REDDIX, a) };
}
