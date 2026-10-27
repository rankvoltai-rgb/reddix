/**
 * Every word on /alternatives/catchintent. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * CatchIntent facts come only from RESEARCH.md (vendor pages and changelog,
 * checked 2026-10-27); Reddix facts only from ../reddix.
 */
import { REDDIX } from '../reddix';

export const PATH = '/alternatives/catchintent';

export const META = {
  query: 'catchintent alternative',
  title: 'CatchIntent Alternative for Reddit Monitoring | Reddix',
  description:
    'CatchIntent stopped selling Reddit monitoring on May 13, 2026 and is now LinkedIn-only. What changed, and what to use for Reddit instead.',
};

export const HERO = {
  pill: 'CatchIntent alternative',
  h1: 'A CatchIntent alternative for Reddit, now that it’s LinkedIn-only',
  accent: 'now that it’s LinkedIn-only',
  answer:
    'CatchIntent began as a Reddit monitor in December 2025. On May 13, 2026 it stopped selling Reddit, Hacker News and Bluesky monitoring to new buyers, and on May 25 it went LinkedIn-only; its Reddit page now says it doesn’t watch Reddit. If you need Reddit covered, Reddix finds and scores Reddit posts for buying intent. If your buyers are on LinkedIn, CatchIntent’s current product does a job Reddix doesn’t.',
  cta: 'Try Reddix on Reddit',
  before: {
    label: 'CatchIntent until May 2026',
    items: [
      'Watched Reddit, Hacker News and Bluesky, later X and LinkedIn',
      'Relevance scores from 0 to 100',
      'Alerts by email, Slack, Discord or Telegram',
      'Reply suggestions as a comment or a DM, sent by you',
      'SEO Opportunities: Reddit threads that rank on Google',
    ],
  },
  after: {
    label: 'CatchIntent since May 2026',
    items: [
      'Watches LinkedIn and company events: job changes, funding, hiring',
      'Scores leads on signal strength, ICP fit and recency',
      'A ranked account book, rebuilt every business day',
      'Drafted openers you send from LinkedIn or email',
      'Pushes leads to your CRM or sequencer',
    ],
  },
};

export type Platform = 'Reddit' | 'Hacker News' | 'Bluesky' | 'X' | 'LinkedIn';

/** From CatchIntent's public changelog. Undated entries are left out. */
export const PLATFORMS: { name: Platform; pilot?: string; live: string; closed?: string }[] = [
  { name: 'Reddit', pilot: '2025-12-13', live: '2026-01-11', closed: '2026-05-13' },
  { name: 'Hacker News', live: '2026-01-11', closed: '2026-05-13' },
  { name: 'Bluesky', live: '2026-01-11', closed: '2026-05-13' },
  { name: 'X', live: '2026-01-13', closed: '2026-05-25' },
  { name: 'LinkedIn', live: '2026-01-15' },
];

export const EVENTS = [
  { date: '2025-12-13', version: 'v0.1.0', text: 'Reddit monitoring ships as the proof of concept.' },
  { date: '2026-01-11', version: 'Launch', text: 'Goes live covering Reddit, Hacker News and Bluesky.' },
  { date: '2026-01-13', version: '', text: 'X added.' },
  { date: '2026-01-15', version: '', text: 'LinkedIn added.' },
  { date: '2026-04-08', version: 'v2.7.0', text: 'SEO Opportunities: Reddit threads that rank on Google.' },
  { date: '2026-05-13', version: 'v3.0.0', text: 'One product. Reddit, Hacker News and Bluesky monitoring closed to new buyers.' },
  { date: '2026-05-25', version: 'v3.1.0', text: 'X closed too. LinkedIn-only from here on.' },
];

export const EXPLORER = {
  pill: 'The changelog',
  title: 'What CatchIntent watched, day by day',
  body: 'Pick a date, or jump to a release, to see which platforms a new buyer could get then. Every date comes from CatchIntent’s public changelog.',
  status: {
    none: 'Not yet',
    pilot: 'Proof of concept',
    live: 'Watched',
    legacy: 'Existing customers only',
  },
};

export const LEGACY = {
  pill: 'Still on a Reddit plan?',
  title: 'If you kept your Reddit listeners',
  body: 'CatchIntent’s May 2026 announcement says existing customers keep their listeners and signals on their current plan, without repricing. Those legacy products now get bug fixes and infrastructure work only; new features go to the LinkedIn product.',
  items: [
    { title: 'Nothing switches off today', body: 'By the vendor’s account, your Reddit listeners keep running on the plan you have.' },
    { title: 'Nothing new is coming', body: 'No new Reddit features. If your use depends on something CatchIntent hasn’t built, it won’t arrive.' },
    { title: 'Keep a copy of your setup', body: 'Write down your listener keywords and settings somewhere outside the product, so moving later isn’t starting from nothing.' },
  ],
};

export const COMPARE = {
  pill: 'Two different jobs',
  title: 'CatchIntent today next to Reddix',
  body: 'They don’t replace each other. One finds accounts on LinkedIn for outbound; the other finds Reddit posts from people asking for a product like yours.',
  rows: [
    { label: 'Where it looks', ci: 'LinkedIn plus company events: job changes, funding, hiring, competitor engagement', reddix: 'Reddit posts in the subreddits on your list' },
    { label: 'What it ranks', ci: 'Accounts and leads, by signal strength, ICP fit and recency', reddix: 'Posts, 0–100 for buying intent against your product' },
    { label: 'How often', ci: 'Account book rebuilt each business day; signals refreshed twice a day on Growth, four times on Scale', reddix: 'When you press Scan, at most once every 5 minutes' },
    { label: 'What it drafts', ci: 'An opener that cites the signal', reddix: 'Three reply drafts per thread' },
    { label: 'Where you send from', ci: 'Your LinkedIn, through a browser extension, or email; leads push to a CRM or sequencer', reddix: 'You post on Reddit yourself. Reddix never posts, messages or votes.' },
    { label: 'Alerts', ci: 'Not described on its current product pages', reddix: 'None' },
    {
      label: 'Price',
      ci: 'Growth $99/month and Scale $249/month per its May 2026 announcement (the live pricing page didn’t show these figures when checked); Enterprise custom; done-for-you from $1,999/month, 3-month minimum',
      reddix: `Premium $${REDDIX.pricing.premium.price}/month, Lifetime $${REDDIX.pricing.lifetime.price} once, Enterprise custom`,
    },
    { label: 'Trial and free plan', ci: '7-day trial with a card on file and 50 trial leads; no free plan; monthly billing only', reddix: '7-day trial on Premium; no free plan' },
  ],
};

export const GAPS = {
  pill: 'What Reddix doesn’t bring back',
  title: 'Old CatchIntent features Reddix doesn’t have',
  body: 'If these were why you chose CatchIntent, Reddix isn’t a like-for-like replacement.',
  items: [
    { title: 'Alerts', body: 'CatchIntent sent matches to email, Slack, Discord or Telegram. Reddix has no alerts; you see new posts when you run a scan.' },
    { title: 'Other platforms', body: 'Hacker News, Bluesky and X were all covered at some point. Reddix covers Reddit only.' },
    { title: 'SEO Opportunities', body: 'Finding Reddit threads that rank on Google, with country targeting. Reddix doesn’t look at search rankings.' },
    { title: 'DM replies', body: 'CatchIntent drafted replies for direct messages as well as public comments. Reddix drafts public replies only, and never sends anything.' },
  ],
  same: 'What does carry over: a 0–100 score on each post, and drafts you edit and send yourself.',
};

export const BOTH = {
  title: 'Using both',
  body: 'If your buyers show up on LinkedIn and on Reddit, the two can sit side by side: CatchIntent for account-level LinkedIn signals and outbound, Reddix for Reddit threads where someone is asking for a tool. CatchIntent itself says it isn’t a social listening tool, and that it suits teams with someone actively running outbound.',
};

export const FAQ = [
  {
    q: 'Does CatchIntent still monitor Reddit?',
    a: 'Not for new buyers. Since May 13, 2026 CatchIntent has been a LinkedIn-first outbound tool, and its Reddit page says it doesn’t watch Reddit. Customers who already had Reddit listeners kept them on their current plan.',
  },
  {
    q: 'When did CatchIntent stop monitoring Reddit?',
    a: 'Version 3.0.0 on May 13, 2026 closed Reddit, Hacker News and Bluesky monitoring to new buyers. Version 3.1.0 on May 25, 2026 closed X too and made the product LinkedIn-only.',
  },
  {
    q: 'What happened to existing CatchIntent Reddit customers?',
    a: 'The vendor says they keep their listeners and signals on their current plan without repricing. Legacy products get bug fixes and infrastructure work only; new features go to the LinkedIn product.',
  },
  {
    q: 'What does CatchIntent cost now?',
    a: 'Its May 2026 announcement lists Growth at $99 a month and Scale at $249 a month; the live pricing page didn’t show those figures when we checked. Enterprise is custom and done-for-you starts at $1,999 a month with a 3-month minimum. There’s a 7-day trial with a card on file, no free plan and no annual billing.',
  },
  {
    q: 'Is Reddix a replacement for CatchIntent?',
    a: 'For Reddit, partly: Reddix finds Reddit posts, scores them 0–100 and drafts replies, but it has no alerts and doesn’t cover Hacker News, Bluesky or X. For LinkedIn outbound, no; that’s what CatchIntent does now.',
  },
];

export const CLOSE = {
  title: 'Get Reddit covered again',
  body: 'Paste your website. Reddix builds a product profile, suggests subreddits, and scores what it finds each time you scan.',
  button: 'Try Reddix on Reddit',
};

export const SOURCES = [
  { label: 'CatchIntent homepage (positioning, trial, fit)', url: 'https://catchintent.com' },
  { label: 'CatchIntent changelog (dated releases, legacy features)', url: 'https://catchintent.com/changelog/' },
  { label: 'CatchIntent: “Introducing the intent layer” (May 13, 2026, updated May 25)', url: 'https://catchintent.com/blog/introducing-the-intent-layer/' },
  { label: 'CatchIntent Reddit platform page (“does not watch… Reddit”)', url: 'https://catchintent.com/platforms/reddit/' },
  { label: 'CatchIntent pricing page (tiers, trial, billing)', url: 'https://catchintent.com/pricing/' },
  { label: 'CatchIntent docs', url: 'https://catchintent.com/docs/' },
];
