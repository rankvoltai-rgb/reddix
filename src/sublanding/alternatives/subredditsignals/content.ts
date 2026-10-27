/**
 * Every word on /alternatives/subredditsignals. Pure data: the page renders it
 * and crawler.ts turns it into the HTML crawlers read.
 *
 * Subreddit Signals facts come only from RESEARCH.md (vendor pages opened
 * 2026-10-27); Reddix facts only from ../reddix.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/subredditsignals';
export const NAME = 'Subreddit Signals';
export const CHECKED = `Checked ${CHECKED_LABEL}`;

const LIFETIME = REDDIX.pricing.lifetime.price;
const PREMIUM = REDDIX.pricing.premium.price;

export const META = {
  query: 'subreddit signals alternative',
  title: 'Subreddit Signals Alternative: Reddix Compared | Reddix',
  description:
    'Subreddit Signals and Reddix both find Reddit buyers and draft replies you post yourself. Scoring, alerts, limits and pricing compared, checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · Subreddit Signals',
  h1: 'Subreddit Signals vs Reddix: same promise, different machinery',
  accent: 'different machinery',
  answer: `Subreddit Signals and Reddix both look for Reddit posts from people likely to buy, draft a reply for you to edit, and never post on your behalf. They differ in how posts reach you: Subreddit Signals watches up to 10 or 25 subreddits you choose and says matches arrive about five minutes after posting, while Reddix scans when you press Scan and scores each post 0–100 against your product. Reddix can also be bought once, for $${LIFETIME}.`,
  cta: 'Try Reddix on your product',
  secondary: 'Check your must-haves',
};

/** The hero's overlap map. Left: Reddix lacks it. Right: Subreddit Signals' pages don't mention it. */
export const OVERLAP = {
  left: {
    title: 'Subreddit Signals has, Reddix doesn’t',
    items: [
      'Email digests, plus Slack alerts on Pro',
      'Matches about five minutes after posting, by its own measure',
      'An authenticity score for spammy or automated posts',
      'Pain-point clustering and Reddit-to-AI traffic attribution',
      'Annual billing',
      'A done-for-you service from $2,000 a month',
    ],
  },
  both: {
    title: 'Both',
    items: [
      'Reddit only',
      'AI scoring for buying intent',
      'Subreddit suggestions from your product',
      'Reply drafts you edit',
      'Never post for you',
    ],
  },
  right: {
    title: 'Reddix has, Subreddit Signals’ pages don’t mention',
    items: [
      'A product profile built from your website URL',
      'Points added for named competitors, pricing words and “alternative to”',
      'Three drafts per thread: Direct, Story and Expert',
      `A one-time Lifetime plan at $${LIFETIME}`,
    ],
  },
};

export const SCORING = {
  pill: 'Scoring',
  title: 'How each one decides a post deserves your time',
  body: 'Both tools use AI to rank posts, and both say a score is a guide rather than a promise. The models are built differently, which changes what you look at first.',
  them: {
    name: NAME,
    lead: 'Five scores per post, each from 1 to 10.',
    dimensions: ['Lead Gen', 'Fit', 'Engagement Opportunity', 'Relevance', 'Authenticity'],
    points: [
      'A post is flagged HOT when Lead Gen or Engagement Opportunity reaches 7 or more.',
      'Each post is also placed in one of four buying stages: Problem Aware, Solution Seeking, Comparing Options, Purchase Ready.',
      'Your keywords, competitor names and pain phrases feed the Relevance score only.',
      'Authenticity tries to flag spam, self-promotion and automation. The vendor notes it can’t verify who someone is.',
    ],
    note: 'The vendor publishes its dimensions and thresholds, but not its model weights or accuracy figures.',
  },
  reddix: {
    name: 'Reddix',
    lead: 'One score per post, from 0 to 100.',
    points: [
      'The AI reads each post next to your product description, features and competitors.',
      'Points are then added for a competitor you named, pricing words and the phrase “alternative to”.',
      'The final score sets the level: Hot, Warm, Research or Low.',
      'Each saved lead keeps the AI’s one-line reason and its confidence.',
    ],
    note: 'The full rubric, and a checker that runs the scanner’s own rules, are on the intent detection page.',
    link: { to: '/features/intent-detection', label: 'See how Reddix scores a post' },
  },
};

export const DELIVERY = {
  pill: 'Delivery',
  title: 'How a new post reaches you',
  body: 'This is the largest practical difference between the two, and it should decide most comparisons.',
  them: {
    name: NAME,
    steps: [
      { label: 'Someone posts in a subreddit you watch', detail: 'Up to 10 subreddits on Starter, 25 on Pro.' },
      { label: 'About five minutes later, it’s scored', detail: 'The vendor’s figure. It says its earlier polling took about 3.3 hours.' },
      { label: 'It lands in your feed and email digest', detail: 'Slack alerts for high scorers on Pro, by webhook.' },
    ],
  },
  reddix: {
    name: 'Reddix',
    steps: [
      { label: 'You open Reddix and press Scan', detail: 'At most one scan every 5 minutes. Nothing runs in the background.' },
      { label: 'It searches your subreddits with buyer phrases', detail: 'Written by the AI from your product profile.' },
      { label: 'You get a ranked list with drafts', detail: 'No email, Slack or webhook alerts.' },
    ],
  },
  takeaway:
    'If you want to hear about a post within minutes without opening anything, Subreddit Signals is built for that and Reddix isn’t. If you’d rather sit down once or twice a day and work through a ranked list, the scan-when-ready model costs you nothing.',
};

type Row = { plan: string; price: string; year: number; yearNote: string; limits: string; who: 'them' | 'reddix' };

export const PRICING = {
  pill: 'Pricing',
  title: 'What a year costs, plan by plan',
  body: 'Prices from each vendor’s own pricing page. Year totals are list price times twelve, or the annual price where one is published.',
  rows: [
    { who: 'them', plan: 'Starter, monthly', price: '$29/month', year: 29 * 12, yearNote: 'billed monthly', limits: '1 brand, 10 subreddits, 15 weekly lead tokens' },
    { who: 'them', plan: 'Starter, annual', price: '$24/month', year: 288, yearNote: 'billed yearly', limits: 'Same as Starter' },
    { who: 'them', plan: 'Pro, monthly', price: '$59/month', year: 59 * 12, yearNote: 'billed monthly', limits: '5 brands, 25 subreddits, 25 weekly lead tokens, Slack' },
    { who: 'them', plan: 'Pro, annual', price: '$49.17/month', year: 590, yearNote: 'billed yearly', limits: 'Same as Pro' },
    { who: 'them', plan: 'Managed service', price: 'From $2,000/month', year: 24000, yearNote: 'from', limits: 'Done for you; fit confirmed on a call' },
    { who: 'reddix', plan: 'Premium', price: `$${PREMIUM}/month`, year: PREMIUM * 12, yearNote: 'billed monthly', limits: 'Plans aren’t sold by subreddit or lead count' },
    { who: 'reddix', plan: 'Lifetime', price: `$${LIFETIME} once`, year: LIFETIME, yearNote: 'one payment', limits: 'Same product as Premium' },
  ] as Row[],
  trials: [
    { who: NAME, text: '14-day trial on Starter and Pro. A card is required at sign-up; you aren’t charged during the trial.' },
    { who: 'Reddix', text: `${REDDIX.pricing.premium.trial} on Premium. No free plan.` },
  ],
  caveatTitle: 'Read the plan contents in the trial',
  caveat:
    'Subreddit Signals’ pricing page lists both “Unlimited subreddits” and “Up to 25 subreddits” for Pro, and its FAQ says neither plan is unlimited. Its Starter list also includes features the comparison table places in Pro. The page doesn’t explain what a weekly lead token is spent on. Confirm all three before you compare cost per lead.',
};

export type Plan = 'starter' | 'pro' | 'managed';
export type Need = {
  id: string;
  label: string;
  them: { ok: boolean; plan?: Plan; text: string };
  reddix: { ok: boolean; text: string };
};

export const PLAN_NAME: Record<Plan, string> = { starter: 'Starter', pro: 'Pro', managed: 'Managed service' };
export const PLAN_PRICE: Record<Plan, string> = { starter: '$29/month', pro: '$59/month', managed: 'from $2,000/month' };

export const FIT = {
  pill: 'Fit check',
  title: 'Tick what you can’t do without',
  body: 'Each answer comes from the vendors’ own pages, checked in October 2026. The result names the cheapest Subreddit Signals plan that covers what you ticked.',
  needs: [
    { id: 'slack', label: 'A Slack message when a strong post appears', them: { ok: true, plan: 'pro', text: 'Pro, for high-scoring leads, by webhook.' }, reddix: { ok: false, text: 'No Slack or webhook alerts.' } },
    { id: 'email', label: 'Matches sent to my inbox', them: { ok: true, plan: 'starter', text: 'Email digests on every plan.' }, reddix: { ok: false, text: 'No email alerts. You check the app.' } },
    { id: 'fast', label: 'Hear about a post within minutes, without opening anything', them: { ok: true, plan: 'starter', text: 'About five minutes after posting, by its own measure. Instant pings need Slack on Pro.' }, reddix: { ok: false, text: 'Only when you press Scan.' } },
    { id: 'brands', label: 'Several brands or clients under one plan', them: { ok: true, plan: 'pro', text: 'Up to 5 brands on Pro.' }, reddix: { ok: false, text: 'One product profile per account.' } },
    { id: 'dfy', label: 'Someone else does the monitoring', them: { ok: true, plan: 'managed', text: 'Managed service from $2,000 a month.' }, reddix: { ok: false, text: 'Not offered. Enterprise is custom, by email.' } },
    { id: 'painpoints', label: 'Recurring pain points grouped across threads', them: { ok: true, plan: 'pro', text: 'Pain Points Radar. Its pricing page places it in both Starter and Pro; we’ve assumed Pro.' }, reddix: { ok: false, text: 'Not a feature.' } },
    { id: 'once', label: 'Pay once instead of every month', them: { ok: false, text: 'Monthly or annual subscriptions only.' }, reddix: { ok: true, text: `Lifetime, $${LIFETIME} one-time.` } },
    { id: 'drafts', label: 'Several reply drafts to choose from', them: { ok: true, plan: 'starter', text: 'Drafts a reply in your Voice Profile. How many per post isn’t stated.' }, reddix: { ok: true, text: 'Three per thread: Direct, Story and Expert.' } },
    { id: 'url', label: 'Set up from my website URL alone', them: { ok: false, text: 'Builds suggestions from your product description; reading a URL isn’t mentioned.' }, reddix: { ok: true, text: 'Paste a URL; it builds the profile and suggests subreddits.' } },
    { id: 'trial', label: 'Two weeks to try it', them: { ok: true, plan: 'starter', text: '14-day trial; card required.' }, reddix: { ok: false, text: `${REDDIX.pricing.premium.trial}.` } },
  ] as Need[],
  empty: 'Tick one or more needs to see how each tool answers.',
};

export const BETTER = {
  pill: 'Honest verdict',
  title: 'When each one is the better pick',
  them: {
    title: `Choose ${NAME} if`,
    items: [
      'You want posts brought to you, by email or Slack, minutes after they appear.',
      'You run several brands or clients and want them under one $59 plan.',
      'You value its published scoring rubric and the authenticity score.',
      'You want pain-point and traffic reports alongside the leads.',
      'You’d rather pay someone to do the work, and the budget fits $2,000 a month.',
    ],
  },
  reddix: {
    title: 'Choose Reddix if',
    items: [
      'You work Reddit in sittings and want a ranked list when you sit down, not pings all day.',
      'You want three differently angled drafts for each thread.',
      `You’d rather pay $${LIFETIME} once than subscribe.`,
      'You want setup to start from your website URL.',
      'You want a tool that never connects to your Reddit account.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Is Reddix a good Subreddit Signals alternative?',
    a: `It is if you’re happy to start scans yourself. Both find Reddit posts with buying intent, score them with AI and draft replies you post by hand. Reddix has no alerts, so it suits people who work through a list in sittings. Subreddit Signals suits people who want new posts pushed to them within minutes.`,
  },
  {
    q: 'Does either tool post on Reddit for me?',
    a: 'No. Subreddit Signals’ homepage says it does not auto-post replies, and you post from your own account. Reddix never posts, comments, votes or messages, and never connects to your Reddit account. With both, every reply is yours to edit and send.',
  },
  {
    q: 'Which one finds new posts faster?',
    a: 'Subreddit Signals, if you want posts brought to you. It says matches arrive about five minutes after posting, with Slack alerts on Pro. Reddix only looks when you press Scan, at most once every 5 minutes, so how fresh your list is depends on when you scan.',
  },
  {
    q: 'How do their prices compare over a year?',
    a: `Subreddit Signals Starter is $348 a year monthly or $288 billed annually, and Pro is $708 or $590. Reddix Premium is $${PREMIUM * 12} a year at $${PREMIUM} a month, or $${LIFETIME} once for Lifetime. Subreddit Signals also has a managed service from $2,000 a month; Reddix has no managed option.`,
  },
  {
    q: 'Why does Subreddit Signals list different subreddit limits?',
    a: 'Its pricing page lists both “Unlimited subreddits” and “Up to 25 subreddits” for Pro, while its FAQ says neither plan is unlimited. Starter is listed at 10 subreddits. We’d treat 10 and 25 as the limits and confirm in the 14-day trial.',
  },
];

export const SOURCES = [
  { label: 'Subreddit Signals homepage', url: 'https://www.subredditsignals.com' },
  { label: 'Subreddit Signals pricing', url: 'https://www.subredditsignals.com/pricing' },
  { label: 'Subreddit Signals lead scoring', url: 'https://www.subredditsignals.com/how-it-works/lead-scoring' },
  { label: 'Subreddit Signals keyword alerts', url: 'https://www.subredditsignals.com/reddit-keyword-alerts' },
  { label: 'Subreddit Signals blog', url: 'https://www.subredditsignals.com/blog' },
];

export const CLOSE = {
  title: 'Score a few posts against your own product',
  body: 'Paste your website. Reddix builds the profile, suggests subreddits, and ranks the first posts when you press Scan.',
  button: HERO.cta,
  related: [
    { to: '/alternatives/communitytracker', label: 'CommunityTracker vs Reddix' },
    { to: '/alternatives/reddleads', label: 'ReddLeads vs Reddix' },
    { to: '/features/ai-replies', label: 'How Reddix drafts replies' },
  ],
};
