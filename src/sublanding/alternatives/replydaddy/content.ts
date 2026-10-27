/**
 * Every word on /alternatives/replydaddy. ReplyDaddy facts come only from
 * RESEARCH.md (checked 2026-10-27); Reddix facts only from ../reddix.
 * ReplyDaddy works the same way Reddix does (draft-only), so this page leads
 * with what they share and is careful about where they differ.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/replydaddy';
export const CHECKED = CHECKED_LABEL;

export const META = {
  query: 'replydaddy alternative',
  title: 'ReplyDaddy Alternative: ReplyDaddy vs Reddix Compared | Reddix',
  description:
    'ReplyDaddy and Reddix both draft Reddit replies you post yourself. Where they differ on finding posts, scoring, writing and price, checked October 2026.',
};

export const HERO = {
  pill: 'Comparison · ReplyDaddy',
  h1: 'ReplyDaddy vs Reddix: two draft-only tools, compared fairly',
  accent: 'compared fairly',
  answer:
    'ReplyDaddy and Reddix work the same way: they find Reddit posts, score them with AI and draft replies, and you post from your own account. Neither connects to your Reddit account. The differences are in how posts are found and scored, what gets written, and how you pay: ReplyDaddy has a free plan and usage tiers, Reddix one paid plan.',
  cta: 'Try Reddix free for 7 days',
};

export const VENN = {
  left: {
    name: 'Only ReplyDaddy',
    items: ['A free plan', 'Drafts new posts, with subreddit rule checks', 'Scheduled scans as well as on-demand', 'Learns your voice from writing samples', 'MCP server for Claude and Cursor', 'An agency tier with 5 projects'],
  },
  both: {
    name: 'Both',
    items: ['Find Reddit posts and score them with AI', 'Suggest subreddits to watch', 'Draft replies for you to edit', 'You post from your own account', 'Never connect your Reddit account', 'Reddit only'],
  },
  right: {
    name: 'Only Reddix',
    items: ['Builds your profile from your website', 'A 0–100 score with points for competitor, price and “alternative to”', 'Three drafts per thread: Direct, Story, Expert', 'A lead list with statuses', 'A one-time lifetime plan with no API key to supply'],
  },
};

export const SAME = {
  pill: 'What’s the same',
  title: 'The same workflow, so the risk sits in the same place',
  body: [
    'With both tools, nothing reaches Reddit until you paste it in yourself. ReplyDaddy’s FAQ says it never connects your Reddit account and doesn’t auto-post; its own assistant integration says nothing is posted to Reddit. Reddix never posts, comments, votes or messages, and never connects your account either.',
    'That makes the choice simpler than with tools that post for you: you’re not weighing account risk, you’re weighing which tool finds better posts, writes better drafts, and costs less for how you work.',
    'It also means Reddit’s rules apply to you, not the tool. Reddit’s spam policy asks people to post authentic content in communities where they have a personal interest, and to be thoughtful about how often they post links to their own business. Subreddits add their own rules on self-promotion. A draft is a starting point; whether it belongs in a thread is your call.',
  ],
};

export const DIFF = {
  pill: 'Where they differ',
  title: 'Five places the two tools part ways',
  groups: [
    {
      title: 'Finding posts',
      replydaddy: 'You add subreddits, picked by its AI or by hand, plus keywords, phrases and competitor names. It scans hot, rising and new posts, on demand or on a schedule, starting with the last 24–48 hours and widening to 3–7 days when matches are thin.',
      reddix: 'You paste your website; Reddix builds a product profile, suggests subreddits, and writes buyer-style search phrases from the profile. You press Scan when you’re ready, at most once every 5 minutes. There’s no schedule.',
    },
    {
      title: 'Scoring',
      replydaddy: 'Each match is scored by AI against an Analysis Prompt you can edit. Its FAQ says relevance carries 70% of the weight.',
      reddix: 'Each post gets a 0–100 score against your product, then extra points when it names a competitor, mentions price or asks for an alternative. Posts that finish at 35 or above are saved, sorted best first.',
    },
    {
      title: 'Writing',
      replydaddy: 'Replies follow a reply prompt and a persona built from your details, writing style and samples, which it can fetch from a Reddit username. A Post Generator checks a subreddit’s eligibility and rules, then drafts a new post. You can also scan and draft from Claude or Cursor through its MCP server.',
      reddix: 'Reddix drafts replies, not new posts: three per thread, in Direct, Story and Expert voices, in the tone you set. You edit one and post it.',
    },
    {
      title: 'After you reply',
      replydaddy: 'Daily engagement goals, a momentum tracker and a 90-day plan generator, built to keep a posting habit going.',
      reddix: 'Every saved post sits in a lead list with a status (new, engaged, replied, converted, archived), so you can see which conversations are still open.',
    },
    {
      title: 'Paying',
      replydaddy: 'A free plan, then $49, $199 or $799 a month (or $490, $1,990 and $7,990 a year), with caps on subreddits, keywords, scans and generated posts per project. A lifetime deal is offered for each tier, where you supply your own Anthropic API key; its price isn’t published on the pages we could read.',
      reddix: `One paid plan: $${REDDIX.pricing.premium.price} a month after a ${REDDIX.pricing.premium.trial}, or $${REDDIX.pricing.lifetime.price} once for lifetime access. No free plan.`,
    },
  ],
};

export const AHEAD = {
  pill: 'Credit where it’s due',
  title: 'Where ReplyDaddy is ahead',
  items: [
    { title: 'You can start for free', body: 'Its free plan begins with 5 subreddits and 10 keywords. Its terms describe the free plan as discovery only, so check what it includes. Reddix has a 7-day trial, not a free plan.' },
    { title: 'It writes new posts', body: 'The Post Generator checks a subreddit’s eligibility and posting rules before drafting. Reddix only drafts replies to existing threads.' },
    { title: 'Scans can run on a schedule', body: 'ReplyDaddy can scan on a schedule as well as on demand. Reddix scans only when you press Scan.' },
    { title: 'Drafts in your own voice', body: 'It builds a persona from your writing samples. Reddix uses a tone setting and your product profile.' },
    { title: 'Works inside your AI assistant', body: 'Its MCP server lets Claude or Cursor run scans and drafts without opening the app.' },
    { title: 'Agencies get five projects', body: 'The $799 tier covers 5 projects on one plan.' },
  ],
};

/** Plan limits from its pricing section (per project). */
export const TIERS = [
  { id: 'solo', name: 'Solopreneur', monthly: 49, yearly: 490, projects: 1, subreddits: 5, keywords: 10, scans: 30, posts: 60 },
  { id: 'growing', name: 'Growing Business', monthly: 199, yearly: 1990, projects: 1, subreddits: 15, keywords: 30, scans: 60, posts: 300 },
  { id: 'teams', name: 'Marketing Teams & Agencies', monthly: 799, yearly: 7990, projects: 5, subreddits: 15, keywords: 30, scans: 60, posts: 300 },
] as const;

export const CALCULATOR = {
  pill: 'Cost at your usage',
  title: 'What would a year cost at your usage?',
  body: 'Set how you’d use it. This finds the ReplyDaddy tier that fits, from the limits on its pricing page, and puts a year’s cost next to Reddix.',
  fields: [
    { id: 'subreddits', label: 'Subreddits per project', min: 1, max: 30, step: 1, initial: 5 },
    { id: 'keywords', label: 'Keywords per project', min: 1, max: 60, step: 1, initial: 10 },
    { id: 'scans', label: 'Scans a month', min: 1, max: 120, step: 1, initial: 20 },
    { id: 'posts', label: 'New posts drafted a month', min: 0, max: 400, step: 10, initial: 0 },
    { id: 'projects', label: 'Products or clients', min: 1, max: 8, step: 1, initial: 1 },
  ],
  freeNote: 'Its free plan starts at 5 subreddits and 10 keywords, but its terms call it discovery only and its scan limits aren’t listed, so it isn’t priced here.',
  customNote: 'Above these limits, ReplyDaddy offers a custom plan by contact.',
  reddixNotes: {
    scans: 'Reddix limits scans to one every 5 minutes rather than a monthly count.',
    posts: 'Reddix doesn’t draft new posts, only replies.',
    projects: 'Projects aren’t compared here.',
  },
} as const;

export const PRICE_NOTE = {
  title: 'If you’ve seen other ReplyDaddy prices',
  body: 'Search results may show $99, $299 and $799 tiers named Starter, Growth and Scale. Those come from older data in its page code, marked valid until the end of 2025. The pricing section its site shows today lists $49, $199 and $799. This page uses the live section.',
};

export const FAQ = [
  {
    q: 'Does ReplyDaddy post to Reddit for you?',
    a: 'No. Its FAQ says it doesn’t auto-post and never connects your Reddit account; you copy drafts and post them yourself. Reddix works the same way.',
  },
  {
    q: 'Does ReplyDaddy have a free plan?',
    a: 'Yes. It starts with 5 subreddits and 10 keywords, and its terms describe it as discovery only. Its sign-up page also lists a 7-day free trial. Reddix has no free plan; Premium has a 7-day free trial.',
  },
  {
    q: 'Can Reddix write new Reddit posts like ReplyDaddy’s Post Generator?',
    a: 'No. Reddix drafts replies to existing threads, three per thread. If drafting new posts with subreddit rule checks matters to you, ReplyDaddy covers that and Reddix doesn’t.',
  },
  {
    q: 'What is ReplyDaddy’s lifetime deal?',
    a: 'A one-time payment for one of its three tiers. Lifetime users supply their own Anthropic API key and pay their own AI costs. The price wasn’t published on the pages we could read. Reddix’s lifetime plan is $150 once, with no key to supply.',
  },
  {
    q: 'Which one is cheaper?',
    a: 'It depends on use. ReplyDaddy’s free plan costs nothing and its first paid tier is $49 a month. Reddix is $45 a month or $150 once. If your use needs ReplyDaddy’s $199 tier, Reddix’s price is lower, so compare what each covers for you; if the free plan covers you, ReplyDaddy costs nothing.',
  },
];

export const SOURCES = [
  { label: 'ReplyDaddy homepage: pricing, FAQ, features', url: 'https://replydaddy.com/' },
  { label: 'ReplyDaddy: how to use', url: 'https://replydaddy.com/how-to-use' },
  { label: 'ReplyDaddy: lifetime deal FAQ', url: 'https://replydaddy.com/ltd-faq' },
  { label: 'ReplyDaddy: terms of service', url: 'https://replydaddy.com/terms' },
  { label: 'ReplyDaddy: sign-up page', url: 'https://replydaddy.com/signup' },
  { label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
];

export const CLOSING = {
  title: 'Try the other draft-only tool',
  body: 'Seven days free on Premium. Add your website, run a scan, and compare the posts and drafts for yourself.',
  button: 'Start your 7-day trial',
};
