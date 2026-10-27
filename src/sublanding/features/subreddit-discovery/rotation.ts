/**
 * Which subreddits a scan reads and what it searches for: a copy of the plan
 * in supabase/functions/scan-reddit/index.ts (doScan, "Rotation" through the
 * competitor and per-subreddit searches). That code isn't in a shared module,
 * so this mirrors it line for line; if the scanner changes, change this too.
 */

/** A scan's rotation slot: it moves on every 5 minutes. */
export const SLOT_MS = 300_000;
/** MAX_FIRECRAWL_CALLS: searches per scan. */
export const MAX_SEARCHES = 7;

const FRESHNESS = ['qdr:d', 'qdr:w', 'qdr:m'] as const;
export const FRESHNESS_LABEL: Record<(typeof FRESHNESS)[number], string> = {
  'qdr:d': 'Past day',
  'qdr:w': 'Past week',
  'qdr:m': 'Past month',
};

export const slotAt = (time: number) => Math.floor(time / SLOT_MS);

function shuffled<T>(arr: T[], rot: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor((((rot * 9301 + 49297 + i * 233) % 233280) / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Search = {
  kind: 'latest' | 'phrases' | 'competitors' | 'sub-phrases';
  query: string;
  freshness: (typeof FRESHNESS)[number];
  /** Subreddits this search is limited to; empty means all of Reddit. */
  subs: string[];
};

export type Plan = { picked: string[]; searches: Search[] };

/** The searches one scan would run in rotation slot `rot`. */
export function planScan(subreddits: string[], phrases: string[], competitors: string[], rot: number): Plan {
  if (!subreddits.length) return { picked: [], searches: [] };
  const subs = shuffled(subreddits, rot);
  const topics = phrases.length ? [...phrases.slice(rot % phrases.length), ...phrases.slice(0, rot % phrases.length)] : phrases;
  const [freshA, freshB, freshC] = [FRESHNESS[rot % 3], FRESHNESS[(rot + 1) % 3], FRESHNESS[(rot + 2) % 3]];

  const searches: Search[] = [];
  for (const sub of subs.slice(0, 2)) {
    searches.push({ kind: 'latest', query: `site:reddit.com/r/${sub}`, freshness: freshA, subs: [sub] });
  }
  const scope = subs.slice(0, 3);
  searches.push({
    kind: 'phrases',
    query: `site:reddit.com (${topics.slice(0, 3).join(' OR ')}) (${scope.map((s) => `r/${s}`).join(' OR ')})`,
    freshness: freshB,
    subs: scope,
  });
  if (competitors.length > 0) {
    const cq = competitors
      .slice(0, 2)
      .map((c) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`)
      .join(' OR ');
    searches.push({ kind: 'competitors', query: `site:reddit.com (${cq})`, freshness: freshC, subs: [] });
  }
  const top2 = topics.slice(0, 2).join(' OR ');
  for (const sub of subs.slice(0, 3)) {
    searches.push({ kind: 'sub-phrases', query: `site:reddit.com/r/${sub} ${top2}`, freshness: freshB, subs: [sub] });
  }
  return { picked: scope, searches: searches.slice(0, MAX_SEARCHES) };
}

/** A subreddit name as the Scanner's add field stores it. */
export function cleanName(value: string): string {
  return value.trim().replace(/^r\//, '').trim().toLowerCase();
}

/** Reddit's own rule for community names. */
export const VALID_NAME = /^[a-z0-9_]{2,21}$/;
