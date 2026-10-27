/**
 * Every word on /alternatives/linkeddit. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Linkeddit facts come only from RESEARCH.md: its live pages and Internet
 * Archive copies of its own pages, checked 2026-10-27. Reddix facts only from
 * ../reddix. No announcement of the change was found, so the page states the
 * window it happened in, never a date.
 */
import { REDDIX } from '../reddix';

export const PATH = '/alternatives/linkeddit';

export const META = {
  query: 'linkeddit alternative',
  title: 'Linkeddit Alternative for Reddit Leads | Reddix',
  description:
    'Linkeddit no longer sells Reddit lead finding; its Reddit pages now return 410 Gone. What changed, what it sells now, and an alternative.',
};

export const HERO = {
  pill: 'Linkeddit alternative',
  h1: 'Linkeddit’s Reddit lead features are gone. What now?',
  accent: 'are gone.',
  answer:
    'As of October 27, 2026, Linkeddit sells competitive intelligence for SaaS teams, not Reddit lead finding. Its Reddit lead, Chrome extension and lifetime-deal pages return “410 Gone”, and no announcement explains the change. If you used it to find people on Reddit asking for a product like yours, Reddix does that part.',
  cta: 'Find Reddit leads with Reddix',
};

/** What a request to each page returned on 2026-10-27. */
export const RESPONSES = [
  { path: '/reddit-leads', code: 410, text: 'Gone' },
  { path: '/chrome-extension', code: 410, text: 'Gone' },
  { path: '/lifetime-deal', code: 410, text: 'Gone' },
  { path: '/pricing', code: 200, text: 'One plan: Compete, $60/month. No Reddit lead features.' },
];

export type Mark = 'listed' | 'absent' | 'unknown';

export const FEATURES = ['Reddit lead pipelines', 'Reddit monitors', 'AI reply suggestions', 'DM and comment extension', 'Reddit content writer and CMS'] as const;

/** Snapshots of Linkeddit's own pages. "unknown" means that copy doesn't
 *  record it either way. */
export const SNAPSHOTS: {
  date: string;
  kind: 'archive' | 'live';
  title: string;
  price: string;
  marks: Record<(typeof FEATURES)[number], Mark>;
  url: string;
}[] = [
  {
    date: '2025-12-02',
    kind: 'archive',
    title: '“#1 AI powered Reddit Lead Generation Tool”',
    price: 'Pro Lifetime, $69.99 one-time',
    marks: { 'Reddit lead pipelines': 'listed', 'Reddit monitors': 'unknown', 'AI reply suggestions': 'listed', 'DM and comment extension': 'unknown', 'Reddit content writer and CMS': 'unknown' },
    url: 'https://web.archive.org/web/20251202205926/https://linkeddit.com/',
  },
  {
    date: '2026-04-15',
    kind: 'archive',
    title: '“The Reddit Marketing Platform”',
    price: 'Pro Monthly, $49/month',
    marks: { 'Reddit lead pipelines': 'listed', 'Reddit monitors': 'unknown', 'AI reply suggestions': 'unknown', 'DM and comment extension': 'unknown', 'Reddit content writer and CMS': 'unknown' },
    url: 'https://web.archive.org/web/20260415213919/https://linkeddit.com/',
  },
  {
    date: '2026-06-09',
    kind: 'archive',
    title: 'Reddit lead generation, monitoring and a Chrome extension in the menu',
    price: 'Not recorded in this copy',
    marks: { 'Reddit lead pipelines': 'listed', 'Reddit monitors': 'listed', 'AI reply suggestions': 'unknown', 'DM and comment extension': 'listed', 'Reddit content writer and CMS': 'unknown' },
    url: 'https://web.archive.org/web/20260609153359/https://linkeddit.com/',
  },
  {
    date: '2026-07-10',
    kind: 'archive',
    title: 'Retitled “AI Demand & Competitor Intelligence Platform”; Reddit features still in the menu',
    price: 'Pro $49/month, Compete $99/month, Enterprise custom',
    marks: { 'Reddit lead pipelines': 'listed', 'Reddit monitors': 'listed', 'AI reply suggestions': 'listed', 'DM and comment extension': 'listed', 'Reddit content writer and CMS': 'unknown' },
    url: 'https://web.archive.org/web/20260710204514/https://linkeddit.com/',
  },
  {
    date: '2026-09-15',
    kind: 'archive',
    title: 'Pricing still sells Reddit lead pipelines, monitors and the DM extension',
    price: 'Pro $49/month, Compete $99/month, Pro Lifetime $450 one-time',
    marks: { 'Reddit lead pipelines': 'listed', 'Reddit monitors': 'listed', 'AI reply suggestions': 'listed', 'DM and comment extension': 'listed', 'Reddit content writer and CMS': 'listed' },
    url: 'https://web.archive.org/web/20260915022434/https://linkeddit.com/pricing',
  },
  {
    date: '2026-10-27',
    kind: 'live',
    title: '“Competitive Intelligence for Small SaaS Teams”',
    price: 'Compete, $60/month',
    marks: { 'Reddit lead pipelines': 'absent', 'Reddit monitors': 'absent', 'AI reply suggestions': 'absent', 'DM and comment extension': 'absent', 'Reddit content writer and CMS': 'absent' },
    url: 'https://linkeddit.com/pricing',
  },
];

export const ARCHIVE = {
  pill: 'The record',
  title: 'Linkeddit’s Reddit features, copy by copy',
  body: 'Step through saved copies of Linkeddit’s own pages, from the Internet Archive, up to the live site today. A dash means that copy doesn’t say either way.',
  marks: { listed: 'On the site', absent: 'Not on the site', unknown: 'Not recorded' } satisfies Record<Mark, string>,
};

export const FORMER = {
  pill: 'What it did',
  title: 'What Linkeddit’s Reddit product did',
  body: 'From archived copies of Linkeddit’s pages and its Chrome Web Store listing. Described here as it was, not as it is.',
  items: [
    { title: 'AI lead pipelines', body: 'You described your product in plain language, and AI pipelines searched Reddit for people who seemed to need it. Each lead came with a buying-intent score, activity context and thread links, ready to export.' },
    { title: 'Reddit monitors', body: 'Scheduled keyword scans with AI reply suggestions: five on the $49 Pro plan, unlimited on Enterprise.' },
    { title: 'Content tools', body: 'A Reddit content writer, a Reddit CMS with kanban and calendar views, subreddit research and post scheduling.' },
    {
      title: 'The Outreach extension',
      body: 'A Chrome side panel that sent AI-drafted DMs and comments from your own Reddit account, paced 60 seconds to 5 minutes apart and capped at 30 actions a day per mode. It never held your Reddit password. It’s still listed on the Chrome Web Store (v0.3.0, updated May 19, 2026, beta, 15 users) and needs Linkeddit Pro.',
    },
  ],
};

export const NOW = {
  pill: 'What it sells now',
  title: 'Linkeddit today: competitive intelligence',
  body: 'A different job from Reddit lead finding, and a reasonable one if it’s what you need.',
  plan: { name: 'Compete', price: '$60/month', billing: 'Billed monthly, cancel anytime' },
  items: [
    'A weekly, graded brief on up to 12 competitors',
    'Review monitoring on G2, Capterra, TrustRadius and Trustpilot',
    'Google rankings and Search Console data',
    'Answer Radar: whether ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews recommend you',
    'A connector for Claude and other AI agents, with 47 tools',
  ],
  note: 'The homepage offers a free account with no credit card; the pricing page doesn’t say what it includes. More than 12 competitors or a team setup means contacting sales.',
};

export type Fit = 'same' | 'different' | 'none';

export const LINEUP = {
  pill: 'Side by side',
  title: 'The old Reddit features, lined up against Reddix',
  body: 'Some carry over closely, one works differently, and some Reddix doesn’t do at all.',
  legend: { same: 'Close match', different: 'Works differently', none: 'Not in Reddix' } satisfies Record<Fit, string>,
  rows: [
    { old: 'AI lead pipelines with intent scores', reddix: 'Each post found is scored 0–100 for buying intent against a profile built from your website.', fit: 'same' },
    { old: 'AI reply suggestions', reddix: 'Three drafts per thread, Direct, Story and Expert, for you to edit and post.', fit: 'same' },
    { old: 'Scheduled Reddit monitors', reddix: `${REDDIX.scanning}. Nothing runs on a schedule.`, fit: 'different' },
    { old: 'DMs and comments sent from your account', reddix: 'Reddix never sends DMs, comments or votes, and never connects your Reddit account.', fit: 'none' },
    { old: 'Content writer, CMS and post scheduling', reddix: 'Not offered.', fit: 'none' },
    { old: 'Lifetime deal ($69.99, later $450)', reddix: `Lifetime is $${REDDIX.pricing.lifetime.price} once; Premium is $${REDDIX.pricing.premium.price} a month after a 7-day trial.`, fit: 'same' },
  ] satisfies { old: string; reddix: string; fit: Fit }[],
};

export const LIFETIME = {
  title: 'If you bought a Linkeddit lifetime deal',
  body: 'Nothing we could find says what lifetime buyers of the Reddit product get now: no sunset notice in the blog or help centre, and the lifetime-deal page returns 410 Gone. Linkeddit is a product of Pavado Technologies Inc.; ask them directly, and keep your receipt.',
};

export const FAQ = [
  {
    q: 'Does Linkeddit still find Reddit leads?',
    a: 'Not on its live site. As of October 27, 2026 Linkeddit sells competitive intelligence and AI-search visibility, and its Reddit lead page returns 410 Gone, which means permanently removed.',
  },
  {
    q: 'When did Linkeddit drop its Reddit features?',
    a: 'No announcement was found. An archived copy of its pricing page still sold Reddit lead pipelines, monitors and the DM extension on September 15, 2026; by October 27 they were gone from the site.',
  },
  {
    q: 'What does Linkeddit cost now?',
    a: 'One plan, Compete, at $60 a month billed monthly, covering up to 12 competitors. The homepage mentions a free account with no credit card, but the pricing page doesn’t describe what it includes.',
  },
  {
    q: 'Does the Linkeddit Chrome extension still work?',
    a: 'We can’t say. The Linkeddit Outreach extension is still listed on the Chrome Web Store (v0.3.0, updated May 19, 2026, in beta) and needs Linkeddit Pro, but Linkeddit’s own page for it returns 410 Gone.',
  },
  {
    q: 'How is Reddix different from Linkeddit’s old Reddit product?',
    a: 'Reddix also finds Reddit posts, scores them for buying intent and drafts replies. It differs in that scans run only when you press Scan, there are no monitors, content writer or CMS, and it never sends DMs, comments or votes for you.',
  },
];

export const CLOSE = {
  title: 'Pick up where your Reddit pipeline stopped',
  body: 'Paste your website. Reddix builds a product profile, suggests subreddits, and scores the posts it finds when you run a scan.',
  button: 'Find Reddit leads with Reddix',
};

export const SOURCES = [
  { label: 'Linkeddit homepage (live)', url: 'https://linkeddit.com' },
  { label: 'Linkeddit pricing (live): Compete, $60/month', url: 'https://linkeddit.com/pricing' },
  { label: 'linkeddit.com/reddit-leads (410 Gone)', url: 'https://linkeddit.com/reddit-leads' },
  { label: 'Linkeddit blog (no sunset notice)', url: 'https://linkeddit.com/blog' },
  { label: 'Linkeddit help centre (no Reddit docs)', url: 'https://linkeddit.com/help' },
  { label: 'Linkeddit Outreach, Chrome Web Store', url: 'https://chromewebstore.google.com/detail/foklfdajgigmbfnbachjfcjocnppdbmp' },
  { label: 'Archived homepage, December 2, 2025', url: 'https://web.archive.org/web/20251202205926/https://linkeddit.com/' },
  { label: 'Archived homepage, July 10, 2026', url: 'https://web.archive.org/web/20260710204514/https://linkeddit.com/' },
  { label: 'Archived pricing, July 13, 2026', url: 'https://web.archive.org/web/20260713034748/https://linkeddit.com/pricing' },
  { label: 'Archived pricing, September 15, 2026', url: 'https://web.archive.org/web/20260915022434/https://linkeddit.com/pricing' },
];
