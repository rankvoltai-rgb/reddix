/**
 * Every word on /alternatives/syften. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Syften facts come only from RESEARCH.md (checked 2026-10-27); Reddix facts
 * only from ../reddix.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/syften';

export const META = {
  query: 'syften alternative',
  title: 'Syften Alternative for Reddit Leads: Coverage vs Depth | Reddix',
  description:
    'Syften monitors about 17 communities plus the web and alerts on keyword matches. Reddix scores Reddit posts for buying intent. Which fits, checked October 2026.',
};

export const HERO = {
  pill: `Reddix vs Syften · Checked ${CHECKED_LABEL}`,
  h1: 'Syften watches the whole internet. Reddix reads Reddit for buyers.',
  accent: 'Reddix reads Reddit for buyers.',
  answer:
    'Syften is a keyword monitor for online communities and the public web: you write filters, and it sends matching posts from Reddit, Hacker News, GitHub, Product Hunt, Bluesky and a dozen more to email, Slack, feeds or webhooks. Reddix covers only Reddit, and does something else with it: it scores each post 0–100 for buying intent against your product and drafts replies for you to post. If your buyers talk in many places, Syften covers more of them. If they’re on Reddit, Reddix goes deeper there.',
  cta: 'Find buyers on Reddit',
};

/** Where each one looks. Syften's list is from its homepage and pricing view. */
export type Source = { name: string; syften: 'yes' | 'addon' | 'no'; note?: string };
export const SOURCES_WATCHED: Source[] = [
  { name: 'Reddit', syften: 'yes', note: 'Posts and comments, aiming for under a minute' },
  { name: 'Hacker News', syften: 'yes' },
  { name: 'Indie Hackers', syften: 'yes' },
  { name: 'GitHub', syften: 'yes' },
  { name: 'Product Hunt', syften: 'yes' },
  { name: 'Stack Exchange', syften: 'yes' },
  { name: 'Dev.to', syften: 'yes' },
  { name: 'Lobsters', syften: 'yes' },
  { name: 'Bluesky', syften: 'yes' },
  { name: 'Mastodon', syften: 'yes' },
  { name: 'Forums', syften: 'yes' },
  { name: 'Slack communities', syften: 'yes' },
  { name: 'Newsletters', syften: 'yes' },
  { name: 'Podcasts', syften: 'yes' },
  { name: 'Steemit', syften: 'yes' },
  { name: 'The public web', syften: 'yes', note: 'Articles, docs, changelogs, competitor blogs' },
  { name: 'X / Twitter', syften: 'addon', note: '+$40/mo add-on, Standard or PRO' },
  { name: 'YouTube', syften: 'addon', note: '+$20/mo add-on, Standard or PRO' },
  { name: 'LinkedIn', syften: 'no', note: 'Not monitored, per Syften’s FAQ' },
];

export const QUESTIONS = {
  title: 'They answer different questions',
  syften: { q: 'Where was this mentioned?', body: 'Syften is built to catch a keyword wherever it appears, soon after it’s posted, and push it to where your team works. An optional AI rule accepts or rejects each match before it reaches you.' },
  reddix: { q: 'Who on Reddit is ready to buy something like mine?', body: 'Reddix starts from your product, not a keyword list. It searches Reddit for people describing the problem you solve, ranks them by how close they are to choosing a tool and drafts a reply for each.' },
};

/** The path from a post to a reply, in each tool. */
export const LANES = {
  title: 'From a match to a reply',
  syften: [
    { step: 'You write filters', body: 'Exact phrases, * wildcards, NOT, and operators like site:, title: and author:. Subreddits via site:reddit.com/r/name/.' },
    { step: 'It matches', body: 'Reddit posts and comments as a logged-out user sees them. Edits aren’t tracked.' },
    { step: 'AI accepts or rejects', body: 'On Standard and PRO, a per-filter rule you write. It’s a yes/no verdict with a reason, not a score.' },
    { step: 'You get an alert', body: 'Email, feeds and API on every plan; Slack from Standard; webhooks and MCP on PRO. Prioritising and replying are up to you.' },
  ],
  reddix: [
    { step: 'You add your site', body: REDDIX.setup + '.' },
    { step: 'You run a scan', body: `${REDDIX.scanning}. The AI writes buyer-style search phrases from your profile.` },
    { step: 'It scores every post', body: REDDIX.scoring + '.' },
    { step: 'You get leads and drafts', body: `${REDDIX.replies}. ${REDDIX.posting}.` },
  ],
};

/** Syften's published plans. */
export const SYFTEN_PLANS = [
  { name: 'Entry', price: 29.95, filters: 3, results: 100, webFilters: 1, webResults: 5, archive: '7 days', slack: false, ai: false, hooks: false },
  { name: 'Standard', price: 49.95, filters: 20, results: 200, webFilters: 5, webResults: 20, archive: '30 days', slack: true, ai: true, hooks: false },
  { name: 'PRO', price: 119.95, filters: 100, results: 500, webFilters: 20, webResults: 50, archive: 'Full available history', slack: true, ai: true, hooks: true },
] as const;

export const ADDONS = { 'X / Twitter': 40, YouTube: 20 } as const;

export const PLANNER = {
  title: 'Where do your buyers talk?',
  body: 'Tick the places your customers ask for help, and say how many keyword filters you’d need. The planner checks each source against Syften’s and Reddix’s published coverage, and picks the Syften plan that fits, add-ons included.',
  filtersLabel: 'Keyword filters you’d need',
  aiLabel: 'I want AI to screen matches',
  slackLabel: 'Alerts must go to Slack',
  note: 'Plan limits from Syften’s pricing, checked October 2026: Entry 3 filters, Standard 20, PRO 100; AI filtering and Slack from Standard; X and YouTube only as add-ons on Standard or PRO.',
};

export const PLANS = {
  title: 'Plans, line by line',
  body: 'Syften prices by filters and results per day. It offers a 14-day PRO trial with no card; there’s no free plan. Annual pricing wasn’t shown on its pricing page.',
  reddix: `Reddix: Premium $${REDDIX.pricing.premium.price}/month with a ${REDDIX.pricing.premium.trial}, or Lifetime $${REDDIX.pricing.lifetime.price} once. Scans and subreddits aren’t metered by filter count. Reddix has no alerts to deliver.`,
};

export const CHOOSE = {
  title: 'Which one to pick',
  syften: {
    title: 'Pick Syften if',
    items: [
      'Your buyers talk on Hacker News, GitHub, Product Hunt, Bluesky or the open web, not just Reddit.',
      'You want alerts in Slack or email within minutes of a post.',
      'You’re piping mentions into your own CRM or agents through its API, webhooks or MCP.',
      'You care about every mention of a brand or competitor, not just the buying ones.',
    ],
  },
  reddix: {
    title: 'Pick Reddix if',
    items: [
      'Reddit is where your customers ask for recommendations.',
      'You’d rather not write and maintain keyword filters and AI rules.',
      'You want posts ranked by how close the writer is to buying, with a reason.',
      'You want reply drafts to edit, and a lead list to work through.',
    ],
  },
};

export const FAQ = [
  {
    q: 'What does Syften monitor?',
    a: 'Reddit, Hacker News, Indie Hackers, GitHub, Product Hunt, Stack Exchange, Dev.to, Lobsters, Bluesky, Mastodon, forums, Slack communities, newsletters, podcasts and the public web, with X and YouTube as paid add-ons. Its FAQ says LinkedIn isn’t monitored.',
  },
  {
    q: 'Does Syften score leads?',
    a: 'Its AI filtering, on Standard and PRO, accepts or rejects each keyword match against a rule you write, and keeps the verdict and reason. Its AI page doesn’t describe a numeric score or reply drafting.',
  },
  {
    q: 'Is Reddix a multi-platform monitor like Syften?',
    a: 'No. Reddix covers Reddit only. It has no alerts either: you run a scan, at most once every 5 minutes, and it saves the posts worth answering with a score from 0 to 100.',
  },
  {
    q: 'How fast is each one?',
    a: 'Syften says it aims to deliver Reddit matches within a minute of posting. Reddix finds posts when you run a scan, so a post is as fresh as your last scan.',
  },
  {
    q: 'Can I try them first?',
    a: `Syften offers a 14-day trial of its PRO plan with no card. Reddix Premium comes with a ${REDDIX.pricing.premium.trial}.`,
  },
];

export const SOURCES = [
  { label: 'Syften: homepage and FAQ', url: 'https://syften.com/' },
  { label: 'Syften: pricing and plan limits', url: 'https://syften.com/?redirect=false' },
  { label: 'Syften: documentation (filters, AI rules, channels, Reddit)', url: 'https://syften.com/documentation' },
  { label: 'Syften: AI social listening', url: 'https://syften.com/ai-social-listening' },
  { label: 'Syften: changelog', url: 'https://syften.com/changelog' },
];

export const CLOSING = {
  title: 'If Reddit is where they ask, start there',
  body: 'Add your site and run your first scan. Reddix ranks what it finds and drafts replies for you to post.',
  cta: 'Find buyers on Reddit',
};
