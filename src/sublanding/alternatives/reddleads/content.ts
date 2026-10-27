/**
 * Every word on /alternatives/reddleads. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * ReddLeads facts come only from RESEARCH.md (vendor pages opened
 * 2026-10-27); Reddix facts only from ../reddix.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/reddleads';
export const NAME = 'ReddLeads';
export const CHECKED = `Checked ${CHECKED_LABEL}`;

const LIFETIME = REDDIX.pricing.lifetime.price;
const PREMIUM = REDDIX.pricing.premium.price;

export const META = {
  query: 'reddleads alternative',
  title: 'ReddLeads Alternative: Scheduled vs On-Demand Scans | Reddix',
  description:
    'ReddLeads scans your subreddits on a timer; Reddix scans when you press Scan. Timing, alerts, plans and a 24-hour timeline compared, checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · ReddLeads',
  h1: 'ReddLeads vs Reddix: a scanner that never stops, or one you start',
  accent: 'or one you start',
  answer: `ReddLeads and Reddix both start from your website, score Reddit posts for buying intent and draft openers you send yourself; neither posts or DMs for you. ReddLeads scans the subreddits you pick on a timer, every 30, 15 or 5 minutes by plan, with instant alerts from its Pro plan. Reddix scans when you press Scan, has no alerts, and can be bought once for $${LIFETIME} instead of monthly.`,
  cta: 'Try Reddix on your site',
  secondary: 'Play out a day',
};

/** The hero's split: the shared first step, then where the two part. */
export const SPLIT = {
  shared: { title: 'Same first step', body: 'Give it your website. Each tool works out what you sell and who buys it, then picks subreddits to watch.' },
  them: { title: NAME, body: 'Then scans those subreddits on a timer, all day, and keeps a feed of scored leads. Pro and Max ping you on Discord, Telegram or Slack.' },
  reddix: { title: 'Reddix', body: 'Then waits for you. Press Scan and it searches your subreddits with buyer phrases and ranks what it finds, 0–100.' },
};

export type PlanId = 'starter' | 'pro' | 'max';

export const RL_PLANS: Record<PlanId, { name: string; price: number; every: number; subreddits: number; perDay: string; alerts: boolean }> = {
  starter: { name: 'Starter', price: 19.99, every: 30, subreddits: 7, perDay: 'up to 200', alerts: false },
  pro: { name: 'Pro', price: 29.99, every: 15, subreddits: 15, perDay: 'up to 2,000', alerts: true },
  max: { name: 'Max', price: 59.99, every: 5, subreddits: 35, perDay: 'up to 10,000', alerts: true },
};

export const DAY = {
  pill: 'A day, played out',
  title: 'When would you first see a buyer’s post?',
  body: 'Pick a ReddLeads plan, set when you’d sit down to scan with Reddix, and move the post through the day. The timeline uses ReddLeads’ published scan intervals and Reddix’s rule of one scan per 5 minutes at most.',
  postLabel: 'A buyer posts at',
  scansLabel: 'Your Reddix scans',
  addScan: 'Add a scan',
  defaultScans: [9 * 60, 13 * 60, 17 * 60 + 30],
  assumption:
    'Assumes each scan finds the post. ReddLeads’ intervals are its published plan figures, laid on the clock from midnight; real timing depends on its system. Reddix finds posts through search phrases, so one scan won’t necessarily catch every post.',
  alertYes: 'An instant alert goes to Discord, Telegram or Slack.',
  alertNo: 'Starter has no instant alerts: it waits in the in-app feed until you open it.',
  reddixNone: 'No scan after this today, so it waits for your first scan tomorrow.',
};

export const PLANS_TABLE = {
  pill: 'Plans',
  title: 'Every plan, side by side',
  body: 'ReddLeads sells three monthly plans, each with a 7-day free trial and no annual option listed. Reddix sells a monthly plan with a 7-day trial and a one-time Lifetime plan.',
  rows: [
    { label: 'Price', starter: '$19.99/mo', pro: '$29.99/mo', max: '$59.99/mo', premium: `$${PREMIUM}/mo`, lifetime: `$${LIFETIME} once` },
    { label: 'One year', starter: '$239.88', pro: '$359.88', max: '$719.88', premium: `$${PREMIUM * 12}`, lifetime: `$${LIFETIME}` },
    { label: 'Scanning', starter: 'Every 30 min', pro: 'Every 15 min', max: 'Every 5 min', premium: 'When you press Scan', lifetime: 'When you press Scan' },
    { label: 'Subreddits', starter: 'Up to 7', pro: 'Up to 15', max: 'Up to 35', premium: 'Suggested from your site', lifetime: 'Suggested from your site' },
    { label: 'Posts evaluated a day', starter: 'Up to 200', pro: 'Up to 2,000', max: 'Up to 10,000', premium: 'Not sold by volume', lifetime: 'Not sold by volume' },
    { label: 'Alerts', starter: 'In-app feed', pro: 'Discord, Telegram, Slack, email digest', max: 'Discord, Telegram, Slack, email digest', premium: 'None', lifetime: 'None' },
    { label: 'Reply help', starter: 'Opener suggestions', pro: 'Opener suggestions', max: 'Opener suggestions', premium: 'Three drafts per thread', lifetime: 'Three drafts per thread' },
    { label: 'Trial', starter: '7 days', pro: '7 days', max: '7 days', premium: '7 days', lifetime: 'None' },
  ],
};

export const STYLE = {
  pill: 'Working style',
  title: 'Pings all day, or a list when you sit down',
  them: {
    title: 'What a timer gives you',
    body: [
      'Reddit threads move on quickly, so replying while a thread is still active matters. A scanner on a 5- or 15-minute timer, with an alert to your phone, gets you there first without you thinking about it.',
      'The cost is attention. Every alert is an interruption, and a busy set of subreddits can produce many. ReddLeads lets you adjust score thresholds, which is the lever for keeping the pings to the posts that matter.',
    ],
  },
  reddix: {
    title: 'What pressing Scan gives you',
    body: [
      'You decide when Reddit gets your attention. Open Reddix once or twice a day, press Scan, and work down a list ranked 0–100, with three drafted replies for each thread.',
      'The cost is timing. Nothing reaches you between scans, so a post that appears just after you scan waits until the next one. If being first matters more than focus, that’s a real gap.',
    ],
  },
};

export const BETTER = {
  pill: 'Verdict',
  title: 'Who each one is for',
  them: {
    title: `${NAME} fits if you`,
    items: [
      'Want posts found for you all day, as often as every 5 minutes.',
      'Want alerts in Discord, Telegram or Slack, or a daily or weekly digest email.',
      'Want the lowest monthly entry price: $19.99 for Starter.',
      'Know your 7 to 35 subreddits and want them watched continuously.',
    ],
  },
  reddix: {
    title: 'Reddix fits if you',
    items: [
      'Prefer to work Reddit in sittings and keep alerts off your phone.',
      `Would rather pay $${LIFETIME} once than every month.`,
      'Want three differently angled drafts for each thread, not a single opener.',
      'Want scores that add points for named competitors, pricing words and “alternative to”.',
    ],
  },
};

export const TRIAL = {
  pill: 'Before you pay',
  title: 'What to test in the two 7-day trials',
  steps: [
    { t: 'Point both at the same subreddits', d: 'Use the subreddits each one suggests from your site, then line them up so you’re comparing like with like.' },
    { t: 'Count the posts you’d really answer', d: 'Not the lead count: the number of threads where you’d write a reply today. That’s the only number that turns into customers.' },
    { t: 'Check the daily caps against your subreddits', d: 'ReddLeads Starter evaluates up to 200 posts a day across 7 subreddits. Busy communities can use that up.' },
    { t: 'Read the drafts as a moderator would', d: 'Would you post the opener or draft as written? Edit until it helps first and mentions your product second.' },
    { t: 'Read the terms in the browser', d: 'ReddLeads’ terms and refund pages load in the browser rather than as plain pages. Read both before you pay.' },
  ],
};

export const FAQ = [
  {
    q: 'Is Reddix a ReddLeads alternative?',
    a: 'Yes, for the same job: finding Reddit posts from likely buyers, scoring them and drafting what to say. Both start from your website and neither posts for you. The difference is timing: ReddLeads scans on a timer and can alert you, while Reddix scans when you press Scan and has no alerts.',
  },
  {
    q: 'Do ReddLeads or Reddix post or DM on Reddit for me?',
    a: 'No. ReddLeads’ homepage says it never auto-replies or auto-DMs. Reddix never posts, comments, votes or messages, and never connects to your Reddit account. With either one, you send every reply yourself.',
  },
  {
    q: 'How often does each one scan Reddit?',
    a: 'ReddLeads scans every 30 minutes on Starter, every 15 on Pro and every 5 on Max, according to its pricing page. Reddix scans only when you press Scan, at most once every 5 minutes, and runs nothing in the background.',
  },
  {
    q: 'How do ReddLeads and Reddix prices compare?',
    a: `ReddLeads is $19.99, $29.99 or $59.99 a month, which is $239.88, $359.88 or $719.88 over a year; no annual plan is listed. Reddix is $${PREMIUM} a month ($${PREMIUM * 12} a year) or $${LIFETIME} once for Lifetime. Both monthly options start with a 7-day free trial.`,
  },
  {
    q: 'Is ReddLeads a new tool?',
    a: 'Fairly. Its AlternativeTo listing dates from March 2026, and its homepage mentions more than 50 beta testers. Young tools often change plans and limits quickly, so check its pricing page on the day you sign up.',
  },
];

export const SOURCES = [
  { label: 'ReddLeads homepage', url: 'https://reddleads.com' },
  { label: 'ReddLeads pricing', url: 'https://reddleads.com/pricing' },
  { label: 'ReddLeads features', url: 'https://reddleads.com/features' },
  { label: 'ReddLeads on AlternativeTo', url: 'https://alternativeto.net/software/reddleads/about' },
];

export const CLOSE = {
  title: 'See what one scan finds for your site',
  body: 'Paste your website, let Reddix suggest subreddits, and press Scan when you’re ready. You get a ranked list with drafts for each thread.',
  button: HERO.cta,
  related: [
    { to: '/alternatives/subredditsignals', label: 'Subreddit Signals vs Reddix' },
    { to: '/alternatives/communitytracker', label: 'CommunityTracker vs Reddix' },
    { to: '/features/scheduled-scans', label: 'Why Reddix scans on demand' },
  ],
};
