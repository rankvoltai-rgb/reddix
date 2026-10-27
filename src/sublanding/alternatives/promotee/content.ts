/**
 * Every word on /alternatives/promotee. Competitor facts come from RESEARCH.md
 * (checked 2026-10-27), Reddit's rules from ../REDDIT-POLICY.md and the
 * RESEARCH sources it cites, Reddix's facts from ../reddix. Quotes under 15 words.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/promotee';

const { premium, lifetime } = REDDIX.pricing;
const REDDIX_PRICE = `$${premium.price} a month with a ${premium.trial}, or $${lifetime.price} one-time`;

export const META = {
  query: 'promotee alternative',
  title: 'Promotee vs Reddix: Automate Your Reddit Accounts or Not? | Reddix',
  description:
    'Promotee automates comments, DMs and warm-up on the Reddit accounts you connect. Reddix drafts replies you post. Plans, credits and trade-offs, checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · Promotee',
  h1: 'Promotee vs Reddix: should software run your Reddit accounts?',
  accent: 'run your Reddit accounts?',
  answer:
    'Promotee is Reddit automation software. You connect up to ten of your own Reddit accounts, and it warms them up, posts AI comments, sends DM sequences and scrapes lead lists. Reddix finds threads and drafts replies for you to post by hand, and never touches an account. The trade is reach against control.',
  cta: 'Try the drafting approach',
  checked: `Checked ${CHECKED_LABEL}`,
};

export type SourceId = 'home' | 'pricing' | 'features' | 'rules' | 'agreement' | 'spam' | 'disrupt' | 'flagged';

export const SOURCES: { id: SourceId; label: string; url: string }[] = [
  { id: 'home', label: 'Promotee homepage', url: 'https://www.promotee.io/' },
  { id: 'pricing', label: 'Promotee pricing and FAQ', url: 'https://www.promotee.io/pricing' },
  { id: 'features', label: 'Promotee features', url: 'https://www.promotee.io/features' },
  { id: 'rules', label: 'Reddit Rules', url: 'https://redditinc.com/policies/reddit-rules' },
  { id: 'agreement', label: 'Reddit User Agreement (effective July 1, 2026)', url: 'https://redditinc.com/policies/user-agreement' },
  { id: 'spam', label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
  { id: 'disrupt', label: 'Reddit Help: Disrupting Communities', url: 'https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities' },
  {
    id: 'flagged',
    label: 'Reddit Help: My account was flagged for spam or inauthentic activity',
    url: 'https://support.reddithelp.com/hc/en-us/articles/360045309012-My-account-was-flagged-for-spam-or-inauthentic-activity',
  },
];

/** Promotee's published plans (pricing page, 2026-10-27). */
export const PLANS = [
  { id: 'engage', name: 'Engage', monthly: 9, annual: 90, credits: 100, accounts: 1, commentCapPerDay: 10, dms: false },
  { id: 'grow', name: 'Grow', monthly: 49, annual: 490, credits: 1000, accounts: 5, commentCapPerDay: null, dms: true },
  { id: 'scale', name: 'Scale', monthly: 99, annual: 990, credits: 5000, accounts: 10, commentCapPerDay: null, dms: true },
] as const;

/** Credits per action (pricing page). */
export const COST = { lead: 1, comment: 2, dm: 3 } as const;

export const FACTS = {
  title: 'Promotee at a glance',
  items: [
    { label: 'Plans', value: '$9, $49 or $99 a month', sub: 'or $90, $490, $990 a year', src: 'pricing' },
    { label: 'Trial', value: '7 days, no card', sub: 'on every plan', src: 'pricing' },
    { label: 'Accounts', value: '1, 5 or 10', sub: 'your own, connected', src: 'pricing' },
    { label: 'Credits', value: '100 to 5,000', sub: 'a month, spent per action', src: 'pricing' },
  ],
} as const;

export const LOOP = {
  pill: 'What it runs',
  title: 'Six jobs, one engine, your accounts',
  body: 'Promotee calls itself “The Reddit Engine” and says it replaces six separate tools. Three of its jobs act on Reddit as the accounts you connect; the others watch, collect and sort.',
  stages: [
    { name: 'Listnr', job: 'Watch', text: 'Tracks keywords and hashtags across Reddit posts and comments.', acts: false, src: 'features' },
    { name: 'Warmup', job: 'Warm up', text: 'Has connected accounts browse, upvote, comment, post and handle DMs, “like a real person”.', acts: true, src: 'features' },
    { name: 'Mentionr', job: 'Comment', text: 'Finds posts your buyers read and leaves what it calls a “relevant, human-sounding AI comment”.', acts: true, src: 'features' },
    { name: 'Campaigns', job: 'Message', text: 'Multi-step DM sequences with branching and A/B tests: “outreach that runs itself”.', acts: true, src: 'features' },
    { name: 'Scrapr', job: 'Collect', text: 'Pulls lists of subreddit members, commenters, upvoters and search results, or imports a CSV.', acts: false, src: 'features' },
    { name: 'Inbox', job: 'Sort', text: 'Replies from every connected account arrive in one keyboard-first inbox.', acts: false, src: 'home' },
  ],
} as const;

export const STRENGTHS = {
  title: 'Where Promotee does more than Reddix',
  body: 'If any of these is the heart of your outreach, Reddix won’t replace Promotee. Better to know that now.',
  items: [
    { title: 'Private outreach', body: 'Automated DM sequences and an inbox for the replies. Reddix doesn’t send messages at all.' },
    { title: 'Lists of people', body: 'Scrapr turns subreddit members, commenters and upvoters into lead lists. Reddix surfaces threads, not people.' },
    { title: 'Many accounts at once', body: 'Up to ten accounts in one workspace, yours or your clients’, which is how agencies use it.' },
    { title: 'A cheap first month', body: `$9 a month, and a 7-day trial without a card. Reddix starts at $${premium.price} a month or $${lifetime.price} once, with no free plan.` },
  ],
};

export const PLANNER = {
  pill: 'Plan a month',
  title: 'What a month of Promotee would do from your accounts',
  body: 'Set what you’d want it to do. The planner prices it with Promotee’s published credits and plans, flags what a plan doesn’t allow, and counts the actions your connected accounts would take on Reddit. Assumes a 30-day month; warm-up activity isn’t priced in credits, so it isn’t counted.',
  leadsLabel: 'Leads scraped a month',
  commentsLabel: 'AI comments a day',
  dmsLabel: 'DMs a month',
};

export const TRADE = {
  pill: 'The trade',
  title: 'What lands on the accounts you connect',
  body: 'Everything Promotee does on Reddit, it does as your accounts. If Reddit or a subreddit’s moderators act, that’s where it lands. Here is each activity, as Promotee describes it, next to what Reddit says about the same thing. Reddit decides how its rules apply.',
  rows: [
    {
      activity: 'Automated DM sequences',
      them: 'Campaigns: multi-step DMs with branching and A/B tests.',
      reddit: { quote: 'sending large amounts of unsolicited chat or private messages', where: 'Reddit Help, Spam: listed as something that may violate the policy', src: 'spam' },
    },
    {
      activity: 'Warm-up that upvotes',
      them: 'Warmup has accounts browse, upvote, comment and post.',
      reddit: { quote: 'any automation to manipulate vote counts', where: 'Reddit Help, Disrupting Communities: listed under vote manipulation', src: 'disrupt' },
    },
    {
      activity: 'AI comments posted for you',
      them: 'Mentionr leaves an AI comment on posts your buyers read.',
      reddit: { quote: 'Using tools (e.g., bots, generative AI tools) that may break Reddit', where: 'Reddit Help, Spam: tools that may facilitate spam', src: 'spam' },
    },
    {
      activity: 'Acting “like a real person”',
      them: 'Promotee says warm-up behaves “like a real person”.',
      reddit: { quote: 'participate authentically in communities where you have a personal interest', where: 'Reddit Rules, Rule 2', src: 'rules' },
    },
    {
      activity: 'Scraping members and upvoters',
      them: 'Scrapr collects subreddit members, commenters and upvoters.',
      reddit: { note: 'The User Agreement says scraping Reddit without Reddit’s prior written consent is prohibited.', where: 'Reddit User Agreement', src: 'agreement' },
    },
  ],
  after:
    'If an account is flagged for spam or inauthentic activity, Reddit says its posts and comments stop showing as expected, and there’s an appeal form. The Reddit Rules list account suspension among enforcement options. Promotee’s site says it is “not affiliated with, sponsored by, or endorsed by Reddit”.',
  afterSrc: ['flagged', 'rules', 'home'] as SourceId[],
};

export const THREAD = {
  title: 'One thread, two tools',
  rows: [
    { label: 'Finding it', them: 'Keyword and hashtag tracking; posts your buyers read', us: 'Search phrases written from your website; every post scored 0–100' },
    { label: 'Writing', them: 'AI comments and DM scripts', us: 'Three reply drafts per thread: Direct, Story, Expert' },
    { label: 'Checking it first', them: 'A review step before comments or DMs go out isn’t mentioned on its site', us: 'You read and edit each draft; nothing goes out without you' },
    { label: 'Posting', them: 'Automatic, from your connected accounts', us: 'By you, by hand, from your own account' },
    { label: 'Private messages', them: 'Automated sequences on Grow and Scale', us: 'None' },
    { label: 'Accounts involved', them: '1 to 10, yours or your clients’', us: 'None. Reddix never connects to Reddit as you' },
    { label: 'Price', them: '$9–$99 a month on credits; 7-day trial, no card', us: REDDIX_PRICE },
  ],
};

export const FIT = {
  them: {
    name: 'Promotee fits when',
    items: [
      'Direct messages are a core part of how you sell.',
      'You manage several accounts, or clients’ accounts, and want one inbox.',
      'You want volume and accept that automation runs on those accounts.',
    ],
  },
  us: {
    name: 'Reddix fits when',
    items: [
      'You want a person, you, to write and post every public reply.',
      'You’d rather no software ever acts as your Reddit account.',
      'Finding and ranking the right threads is the hard part for you.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Does Promotee use my Reddit account?',
    a: 'Yes. You connect the Reddit accounts you want it to run, one to ten depending on the plan, and its FAQ says it handles warm-up, proxying, personas and per-account limits for them. Reddix never connects to a Reddit account; you post its drafts yourself.',
  },
  {
    q: 'How much does Promotee cost?',
    a: 'Engage is $9 a month with 100 credits and one account; Grow is $49 with 1,000 credits and up to five; Scale is $99 with 5,000 credits and up to ten. Annual plans are $90, $490 and $990. A lead costs 1 credit, an AI comment 2 and a DM 3, and DMs aren’t included on Engage.',
  },
  {
    q: 'Can Reddix send DMs or build lead lists like Promotee?',
    a: 'No. Reddix finds threads, scores them and drafts public replies. It doesn’t message anyone or collect lists of users. If private outreach is central to how you sell, Reddix doesn’t cover it.',
  },
  {
    q: 'Can I approve Promotee’s comments before they go out?',
    a: 'An approval step before comments or DMs post isn’t mentioned on its site, so ask during the trial. With Reddix, every reply is reviewed by definition, because you’re the one who posts it.',
  },
  {
    q: 'Which is cheaper?',
    a: `Promotee starts lower, at $9 a month, and its trial needs no card. Reddix is $${premium.price} a month after a 7-day trial, or $${lifetime.price} once, with no free plan. They also do different work: Promotee acts on Reddit for you, Reddix helps you decide where to speak and what to say.`,
  },
];

export const CLOSING = {
  title: 'Keep your accounts in your hands',
  body: 'Reddix finds the threads worth answering and drafts the reply. You decide what gets posted, and post it yourself.',
  button: 'Start with Reddix',
};
