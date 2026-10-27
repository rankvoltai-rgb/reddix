/**
 * What one scan would search, worked out the way scan-reddit does it
 * (supabase/functions/scan-reddit/index.ts, "Rotation" and the searches after
 * it). The edge function keeps this logic inline, so it's mirrored here line
 * for line; if the scanner's rotation changes, change this with it.
 */

/** RATE_LIMIT_MINUTES: one scan per this many minutes. */
export const RATE_LIMIT_MINUTES = 5;
/** MAX_FIRECRAWL_CALLS: searches per scan. */
export const MAX_SEARCHES = 7;
/** The rotation advances every 5 minutes. */
const WINDOW_MS = 300_000;

export type Freshness = 'qdr:d' | 'qdr:w' | 'qdr:m';
export const FRESHNESS_LABEL: Record<Freshness, string> = {
  'qdr:d': 'Past day',
  'qdr:w': 'Past week',
  'qdr:m': 'Past month',
};

export type SearchKind = 'latest' | 'phrases' | 'competitors' | 'subreddit';
export const KIND_LABEL: Record<SearchKind, string> = {
  latest: 'Latest posts',
  phrases: 'Phrases across subreddits',
  competitors: 'Competitor alternatives',
  subreddit: 'Phrases in one subreddit',
};

export interface Search {
  kind: SearchKind;
  query: string;
  freshness: Freshness;
  subreddits: string[];
}

export interface ScanPlan {
  rot: number;
  searches: Search[];
  covered: string[];
}

export function planScan(at: number, subreddits: string[], phrases: string[], competitors: string[]): ScanPlan {
  const rot = Math.floor(at / WINDOW_MS);
  const shuffled = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor((((rot * 9301 + 49297 + i * 233) % 233280) / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const subs = shuffled(subreddits);
  const topics = phrases.length > 0 ? [...phrases.slice(rot % phrases.length), ...phrases.slice(0, rot % phrases.length)] : phrases;
  const cycle: Freshness[] = ['qdr:d', 'qdr:w', 'qdr:m'];
  const [freshA, freshB, freshC] = [cycle[rot % 3], cycle[(rot + 1) % 3], cycle[(rot + 2) % 3]];

  const searches: Search[] = [];
  const push = (s: Search) => {
    if (searches.length < MAX_SEARCHES) searches.push(s);
  };

  for (const sub of subs.slice(0, 2)) {
    push({ kind: 'latest', query: `site:reddit.com/r/${sub}`, freshness: freshA, subreddits: [sub] });
  }
  const topicTerms = topics.slice(0, 3).join(' OR ');
  const scope = subs.slice(0, 3);
  push({
    kind: 'phrases',
    query: `site:reddit.com (${topicTerms}) (${scope.map((s) => `r/${s}`).join(' OR ')})`,
    freshness: freshB,
    subreddits: scope,
  });
  if (competitors.length > 0) {
    const cq = competitors
      .slice(0, 2)
      .map((c) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`)
      .join(' OR ');
    push({ kind: 'competitors', query: `site:reddit.com (${cq})`, freshness: freshC, subreddits: [] });
  }
  const topTerms = topics.slice(0, 2).join(' OR ');
  for (const sub of subs.slice(0, 3)) {
    push({ kind: 'subreddit', query: `site:reddit.com/r/${sub} ${topTerms}`, freshness: freshB, subreddits: [sub] });
  }

  return { rot, searches, covered: subs.slice(0, 3) };
}

/** Minutes left before another scan is allowed, or 0 if it can run now. */
export function waitMinutes(at: number, lastScanAt: number | null): number {
  if (lastScanAt === null) return 0;
  const diff = (at - lastScanAt) / 60_000;
  return diff < RATE_LIMIT_MINUTES ? Math.ceil(RATE_LIMIT_MINUTES - diff) : 0;
}

export function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
