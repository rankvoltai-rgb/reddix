/**
 * The dashboard's rules as pure functions, so the page's sandbox shows what
 * the real dashboard would. Each rule names its source.
 */
import { formatDistanceToNow } from 'date-fns';
import { BADGES } from './content';

export type Level = 'hot' | 'warm' | 'research' | 'low';
export type Status = 'new' | 'engaged' | 'replied' | 'converted' | 'archived';

export interface Lead {
  id: number;
  title: string;
  subreddit: string;
  level: Level;
  status: Status;
  /** Minutes on the sandbox clock when a scan found it (discovered_at). */
  foundAt: number;
}

export interface Account {
  subreddits: string[];
  leads: Lead[];
  drafts: number;
  /** Minutes on the sandbox clock; null before the first scan (profiles.last_scan_at). */
  lastScanAt: number | null;
  now: number;
  /** How many illustrative posts the sandbox has handed out. */
  served: number;
}

/** Minimum wait between scans (scan-reddit/index.ts:14, 298-301). */
export const SCAN_WAIT_MINUTES = 5;
/** The last-scan dot is green within the hour (pages/Dashboard.tsx:104). */
export const RECENT_SCAN_MINUTES = 60;

/** The four counts (hooks/useDashboardStats.tsx:29-56). */
export function stats(a: Account) {
  return {
    leads: a.leads.length,
    hot: a.leads.filter((l) => l.level === 'hot').length,
    drafts: a.drafts,
    subreddits: a.subreddits.length,
  };
}

/** Which panel the dashboard shows (pages/Dashboard.tsx:100-101, 187-203). */
export function panel(a: Account): 'setup' | 'ready' | 'leads' {
  if (a.subreddits.length === 0) return 'setup';
  if (a.leads.length === 0) return 'ready';
  return 'leads';
}

/** The five newest leads (hooks/useDashboardStats.tsx:66-71). */
export function recent(a: Account): Lead[] {
  return [...a.leads].sort((x, y) => y.foundAt - x.foundAt || y.id - x.id).slice(0, 5);
}

/** "Last scan …" in the app's words, from date-fns as the app uses it. */
export function lastScanLabel(a: Account, realNow = Date.now()): { text: string; recent: boolean } | null {
  if (a.lastScanAt === null) return null;
  const minutes = a.now - a.lastScanAt;
  return {
    text: `Last scan ${formatDistanceToNow(new Date(realNow - minutes * 60_000), { addSuffix: true })}`,
    recent: minutes < RECENT_SCAN_MINUTES,
  };
}

/** Badges count leads that are Engaged now (hooks/useBadges.ts:13-42). */
export function badges(a: Account) {
  const engaged = a.leads.filter((l) => l.status === 'engaged').length;
  return { engaged, list: BADGES.list.map((b) => ({ ...b, unlocked: engaged >= b.threshold })) };
}

/** Why a scan can't run yet, or null if it can. */
export function scanBlocked(a: Account): string | null {
  if (a.subreddits.length === 0) return 'Add a subreddit first: a scan needs at least one.';
  if (a.lastScanAt !== null && a.now - a.lastScanAt < SCAN_WAIT_MINUTES) {
    return `Scans are 5 minutes apart. Wait ${Math.ceil(SCAN_WAIT_MINUTES - (a.now - a.lastScanAt))} more minute${SCAN_WAIT_MINUTES - (a.now - a.lastScanAt) > 1 ? 's' : ''}.`;
  }
  return null;
}

/* ---------- the sandbox's fictional world ---------- */

export const SUBREDDIT_POOL = ['r/smallbusiness', 'r/sales', 'r/startups', 'r/agency', 'r/Entrepreneur', 'r/freelance'];

const POSTS: { title: string; level: Level }[] = [
  { title: 'Looking for an alternative to Pipewell for a 3-person team', level: 'hot' },
  { title: 'Is a CRM overkill for a 4-person agency?', level: 'warm' },
  { title: 'How do small teams usually keep track of deals?', level: 'research' },
  { title: 'What do you use for follow-up reminders?', level: 'warm' },
  { title: 'Stuck with Pipewell’s reporting, thinking about switching', level: 'hot' },
  { title: 'Spreadsheet or CRM for a freelance studio?', level: 'research' },
  { title: 'Need a simple pipeline tool, budget is tight', level: 'hot' },
  { title: 'Our sales notes live in five different places', level: 'warm' },
  { title: 'Anyone tried moving deals out of a shared inbox?', level: 'warm' },
  { title: 'What tools did you use for your first 50 customers?', level: 'research' },
  { title: 'Best way to track follow-ups for a two-person shop?', level: 'warm' },
  { title: 'Switching from Pipewell this month, what should I check?', level: 'hot' },
];

export const PER_SCAN = 3;

export const EMPTY: Account = { subreddits: [], leads: [], drafts: 0, lastScanAt: null, now: 0, served: 0 };

/** A settled account for the hero. */
export const SAMPLE: Account = (() => {
  let a: Account = { ...EMPTY, subreddits: SUBREDDIT_POOL.slice(0, 4) };
  a = scan(a);
  a = { ...a, now: a.now + 180 };
  a = scan(a);
  a = { ...a, now: a.now + 26 };
  const [newest] = recent(a);
  a = draftReply(a, newest.id);
  return a;
})();

export function scan(a: Account): Account {
  if (scanBlocked(a)) return a;
  const batch = POSTS.slice(a.served, a.served + PER_SCAN).map((p, i) => ({
    id: a.served + i + 1,
    title: p.title,
    level: p.level,
    subreddit: a.subreddits[(a.served + i) % a.subreddits.length],
    status: 'new' as Status,
    foundAt: a.now,
  }));
  return { ...a, leads: [...a.leads, ...batch], served: a.served + batch.length, lastScanAt: a.now };
}

export const morePosts = (a: Account) => a.served < POSTS.length;

/** Saving a lead marks it Engaged (components/scanner/LeadsSection.tsx:200-217). */
export function save(a: Account, id: number): Account {
  return { ...a, leads: a.leads.map((l) => (l.id === id ? { ...l, status: 'engaged' } : l)) };
}

/** Drafting a reply writes a draft and marks the lead Engaged (generate-reply/index.ts:266-284). */
export function draftReply(a: Account, id: number): Account {
  return { ...a, drafts: a.drafts + 1, leads: a.leads.map((l) => (l.id === id ? { ...l, status: 'engaged' } : l)) };
}

/** Dismissing archives a lead; it still counts (LeadsSection.tsx:241-254). */
export function dismiss(a: Account, id: number): Account {
  return { ...a, leads: a.leads.map((l) => (l.id === id ? { ...l, status: 'archived' } : l)) };
}

export function markReplied(a: Account, id: number): Account {
  return { ...a, leads: a.leads.map((l) => (l.id === id ? { ...l, status: 'replied' } : l)) };
}
