/**
 * The app's lead-list rules, as pure functions, so the page's triage list
 * behaves the way the Scanner and Leads pages do. Each rule names its source.
 * Final scores and levels come from the scanner's own heuristics.
 */
import { buildHeuristics, clampScore, levelFromScore } from '../../../../supabase/functions/_shared/intent-heuristics';
import { COMPETITORS } from './content';

export type Level = ReturnType<typeof levelFromScore>;
export type Status = 'new' | 'engaged' | 'replied' | 'converted' | 'archived';
export type LevelFilter = 'all' | Level;

const evaluate = buildHeuristics(COMPETITORS);

/** Final score: the AI's score plus signal points, capped (scan-reddit/index.ts:474-475). */
export function finalScore(title: string, ai: number) {
  const h = evaluate(title, '');
  const quality = clampScore(ai + h.boost);
  return { quality, level: levelFromScore(quality), competitor: h.hasCompetitor };
}

export interface Lead {
  id: string;
  title: string;
  subreddit: string;
  /** intent_score: the AI's own score, shown on the card. */
  ai: number;
  /** quality_score: the AI's score plus signal points; sets level and order. */
  quality: number;
  level: Level;
  competitor: boolean;
  confidence: number;
  deepAnalyzed: boolean;
  reason: string;
  status: Status;
  /** Stands in for updated_at: higher is more recent. */
  touched: number;
  /** What Analyze would return for this fictional lead. */
  secondRead?: { ai: number; confidence: number; reason: string };
}

type Seed = Omit<Lead, 'quality' | 'level' | 'competitor' | 'deepAnalyzed' | 'status' | 'touched'>;

/* Fictional leads. Scans mark a lead analyzed when confidence is 0.8 or more
   (scan-reddit/index.ts:17, 479, 500). */
const SEEDS: Seed[] = [
  {
    id: 'a',
    title: 'Looking for an alternative to Pipewell for a 3-person team',
    subreddit: 'r/smallbusiness',
    ai: 51,
    confidence: 0.86,
    reason: 'Asks for a replacement for a competitor you listed.',
  },
  {
    id: 'b',
    title: 'Stuck with Pipewell’s reporting, thinking about switching',
    subreddit: 'r/sales',
    ai: 49,
    confidence: 0.7,
    reason: 'Unhappy with a competitor, not yet asking for options.',
    secondRead: { ai: 57, confidence: 0.9, reason: 'Comments show the writer is comparing two replacements this week.' },
  },
  {
    id: 'c',
    title: 'Is a CRM overkill for a 4-person agency?',
    subreddit: 'r/agency',
    ai: 58,
    confidence: 0.82,
    reason: 'Weighing whether a CRM is worth it for a small team.',
  },
  {
    id: 'd',
    title: 'What do you use for follow-up reminders?',
    subreddit: 'r/Entrepreneur',
    ai: 44,
    confidence: 0.72,
    reason: 'Open question about a problem you solve.',
    secondRead: { ai: 63, confidence: 0.88, reason: 'The writer says reminders are slipping and asks for a tool by Friday.' },
  },
  {
    id: 'e',
    title: 'How do small teams usually keep track of deals?',
    subreddit: 'r/startups',
    ai: 37,
    confidence: 0.81,
    reason: 'Early research, not choosing yet.',
  },
  {
    id: 'f',
    title: 'Spreadsheet or CRM for a freelance studio?',
    subreddit: 'r/freelance',
    ai: 38,
    confidence: 0.64,
    reason: 'Curious about options, no urgency.',
    secondRead: { ai: 31, confidence: 0.55, reason: 'Comments suggest the writer has settled on a spreadsheet.' },
  },
];

export function seedLeads(): Lead[] {
  return SEEDS.map((s) => ({
    ...s,
    ...finalScore(s.title, s.ai),
    deepAnalyzed: s.confidence >= 0.8,
    status: 'new',
    touched: 0,
  }));
}

/** The Scanner's list: everything but archived, by final score then AI score
 *  (components/scanner/LeadsSection.tsx:75-81). */
export function scannerList(leads: Lead[], filter: LevelFilter): Lead[] {
  return leads
    .filter((l) => l.status !== 'archived')
    .filter((l) => filter === 'all' || l.level === filter)
    .sort((a, b) => b.quality - a.quality || b.ai - a.ai);
}

/** Counts per level on the Scanner's filter tabs (LeadsSection.tsx:95-102). */
export function levelCounts(leads: Lead[]): Record<LevelFilter, number> {
  const live = leads.filter((l) => l.status !== 'archived');
  const c: Record<LevelFilter, number> = { all: live.length, hot: 0, warm: 0, research: 0, low: 0 };
  for (const l of live) c[l.level]++;
  return c;
}

/** The lead list: everything you've saved, last changed first (pages/Leads.tsx:86-94). */
export function savedList(leads: Lead[]): Lead[] {
  return leads.filter((l) => l.status !== 'new').sort((a, b) => b.touched - a.touched);
}

/** Analyze: a second read, re-scored and marked analyzed (analyze-lead/index.ts:172-183). */
export function analyze(lead: Lead): Lead {
  const read = lead.secondRead ?? { ai: lead.ai, confidence: lead.confidence, reason: lead.reason };
  return { ...lead, ...finalScore(lead.title, read.ai), ai: read.ai, confidence: read.confidence, reason: read.reason, deepAnalyzed: true };
}

/** The card shows a confidence note under 60% (scanner/LeadCard.tsx:105). */
export const LOW_CONFIDENCE = 0.6;
