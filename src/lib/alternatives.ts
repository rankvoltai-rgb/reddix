import { TOOLS } from '@/sublanding/alternatives/index/directory';

/**
 * The tools Reddix is compared with, for the nav and footer. Each has a page
 * of its own in src/sublanding/alternatives/<slug>/; the facts live in that
 * folder's RESEARCH.md and in alternatives/index/directory.ts.
 */
export interface Competitor {
  slug: string;
  name: string;
}

/** Most-searched first: the nav shows five, the footer eight. */
const ORDER = [
  'gummysearch',
  'subredditsignals',
  'replydaddy',
  'f5bot',
  'syften',
  'redreach',
  'reddleads',
  'communitytracker',
  'replyagent',
  'brandwatch',
  'promotee',
  'redditor-ai',
  'catchintent',
  'linkeddit',
  'redaccs',
];

export const competitors: Competitor[] = ORDER.map((slug) => {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`No directory entry for ${slug}`);
  return { slug: t.slug, name: t.name };
});

/** Comparisons removed in October 2026 because the product couldn't be
 *  confirmed or no longer exists; their URLs redirect to /alternatives. */
export const RETIRED_COMPARISONS = ['redditflow', 'reddar', 'leadhunter', 'redditmonitor'];
