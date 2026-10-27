/**
 * The scanner's first pass, run in the browser. Verdicts and points come from
 * the scanner's own module; this file only adds where each phrase sits in the
 * text, so the page can light it up.
 */
import {
  ALT_RE,
  BLACKLIST,
  buildHeuristics,
  clampScore,
  levelFromScore,
  PRICING_RE,
  WHITELIST,
  type HeuristicResult,
} from '../../../../supabase/functions/_shared/intent-heuristics';

export { clampScore, levelFromScore };
export type Level = ReturnType<typeof levelFromScore>;

/** The scanner skips post text shorter than this (MIN_CONTENT_LENGTH). */
export const MIN_LENGTH = 40;
/** Final scores at or above this are saved as leads (INSERT_THRESHOLD). */
export const SAVE_AT = 35;

export type Kind = 'competitor' | 'alt' | 'pricing' | 'ask' | 'junk';

/** Earlier wins where two phrases overlap. */
const ORDER: Kind[] = ['competitor', 'alt', 'pricing', 'ask', 'junk'];

export type Segment = { text: string; kind?: Kind };

const global = (re: RegExp) => new RegExp(re.source, 'gi');

function competitorRegex(names: string[]): RegExp | null {
  const clean = names
    .map((n) => n.trim())
    .filter((n) => n.length >= 2 && n.length <= 40)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return clean.length ? new RegExp(`\\b(${clean.join('|')})\\b`, 'gi') : null;
}

/** Splits text into plain runs and matched phrases, tagged by signal. */
export function segment(text: string, competitors: string[]): Segment[] {
  const patterns: [Kind, RegExp | null][] = [
    ['competitor', competitorRegex(competitors)],
    ['alt', global(ALT_RE)],
    ['pricing', global(PRICING_RE)],
    ['ask', global(WHITELIST)],
    ['junk', global(BLACKLIST)],
  ];
  const owner: (Kind | undefined)[] = new Array(text.length);
  for (const [kind, re] of patterns) {
    if (!re) continue;
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (owner.slice(start, end).some(Boolean)) continue;
      owner.fill(kind, start, end);
    }
  }
  const out: Segment[] = [];
  for (let i = 0; i < text.length; ) {
    const kind = owner[i];
    let j = i + 1;
    while (j < text.length && owner[j] === kind) j++;
    out.push({ text: text.slice(i, j), kind });
    i = j;
  }
  return out;
}

export type FirstPass =
  | { state: 'empty' }
  | { state: 'short'; length: number }
  | { state: 'skipped'; result: HeuristicResult; junk: string[] }
  | { state: 'front' | 'queue'; result: HeuristicResult };

/** What the scanner's first pass does with a post, before any AI. */
export function firstPass(text: string, competitors: string[]): FirstPass {
  const trimmed = text.trim();
  if (!trimmed) return { state: 'empty' };
  if (trimmed.length < MIN_LENGTH) return { state: 'short', length: trimmed.length };
  const result = buildHeuristics(competitors)('', trimmed);
  if (result.skip) {
    const junk = [...new Set([...trimmed.matchAll(global(BLACKLIST))].map((m) => m[0].toLowerCase()))];
    return { state: 'skipped', result, junk };
  }
  return { state: result.hasCompetitor || result.hasDirectAsk ? 'front' : 'queue', result };
}

/** The points each signal adds after the AI, read off the scanner's rules so
 *  the page can't drift from them. */
const probe = (competitors: string[], text: string) => buildHeuristics(competitors)('', text).boost;
export const POINTS = {
  competitor: probe(['Pipewell'], 'Pipewell'),
  pricing: probe([], 'budget'),
  alt: probe([], 'alternative to'),
};

export function splitCompetitors(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
