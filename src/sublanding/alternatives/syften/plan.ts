/** The planner's logic: which sources each tool covers, and the smallest
 *  Syften plan that fits, from Syften's published limits (content.ts). */
import { ADDONS, SOURCES_WATCHED, SYFTEN_PLANS, type Source } from './content';

export type Needs = { sources: string[]; filters: number; ai: boolean; slack: boolean };

export type PlanFit =
  | { kind: 'plan'; name: string; base: number; addons: { name: string; price: number }[]; total: number }
  | { kind: 'custom' };

export function syftenPlan({ sources, filters, ai, slack }: Needs): PlanFit {
  const addons = sources
    .filter((s): s is keyof typeof ADDONS => s in ADDONS)
    .map((name) => ({ name, price: ADDONS[name] }));
  const plan = SYFTEN_PLANS.find(
    (p) => filters <= p.filters && (!ai || p.ai) && (!slack || p.slack) && (addons.length === 0 || p.name !== 'Entry'),
  );
  if (!plan) return { kind: 'custom' };
  const total = Math.round((plan.price + addons.reduce((a, x) => a + x.price, 0)) * 100) / 100;
  return { kind: 'plan', name: plan.name, base: plan.price, addons, total };
}

export function coverage(sources: string[]) {
  const picked = SOURCES_WATCHED.filter((s) => sources.includes(s.name));
  const syften = picked.filter((s) => s.syften !== 'no');
  const reddix = picked.filter((s) => s.name === 'Reddit');
  const neither = picked.filter((s) => s.syften === 'no');
  return { picked, syften, reddix, neither };
}

export type Verdict = { title: string; body: string };

/** The plain-language read on a set of sources. */
export function verdict(sources: string[]): Verdict | null {
  const { picked, syften, reddix, neither } = coverage(sources);
  if (!picked.length) return null;
  const others = picked.filter((s: Source) => s.name !== 'Reddit' && s.syften !== 'no');
  const linkedIn = neither.length ? ' Neither tool monitors LinkedIn.' : '';
  if (reddix.length && !others.length)
    return {
      title: 'Both cover it. Pick by the job.',
      body: `All your buyers are on Reddit, which both watch. Syften alerts you to keyword matches; Reddix ranks posts by buying intent and drafts replies.${linkedIn}`,
    };
  if (reddix.length)
    return {
      title: `Syften covers ${syften.length} of ${picked.length}; Reddix covers 1.`,
      body: `Reddix only reads Reddit. If the other ${others.length} matter, Syften covers more of your list. Some teams run Syften for coverage and Reddix for Reddit leads.${linkedIn}`,
    };
  if (others.length)
    return {
      title: `Syften covers ${syften.length} of ${picked.length}; Reddix covers none.`,
      body: `You didn’t pick Reddit, and Reddix doesn’t watch anything else. For these sources, Syften is the one of the two that fits.${linkedIn}`,
    };
  return { title: 'Neither covers this.', body: 'Syften says it doesn’t monitor LinkedIn, and Reddix covers only Reddit.' };
}
