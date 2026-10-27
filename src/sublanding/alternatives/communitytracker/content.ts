/**
 * Every word on /alternatives/communitytracker. Pure data: the page renders it
 * and crawler.ts turns it into the HTML crawlers read.
 *
 * CommunityTracker facts come only from RESEARCH.md (vendor pages opened
 * 2026-10-27); Reddix facts only from ../reddix.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/communitytracker';
export const NAME = 'CommunityTracker';
export const CHECKED = `Checked ${CHECKED_LABEL}`;

const LIFETIME = REDDIX.pricing.lifetime.price;
const PREMIUM = REDDIX.pricing.premium.price;

export const META = {
  query: 'communitytracker alternative',
  title: 'CommunityTracker Alternative for Reddit Leads | Reddix',
  description:
    'CommunityTracker watches 10+ platforms and runs outbound; Reddix goes deep on Reddit alone. Plans, scoring, alerts and a cost calculator, checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · CommunityTracker',
  h1: 'CommunityTracker vs Reddix: ten platforms, or one done closely',
  accent: 'or one done closely',
  answer: `CommunityTracker is a B2B sales platform that monitors Reddit and nine other communities, enriches the people who post, and runs LinkedIn and email outreach. Reddix does one job: it finds Reddit posts from likely buyers, scores them 0–100 against your product and drafts replies you post yourself. If your buyers live across many communities, CommunityTracker covers more ground. If Reddit is the channel, Reddix costs less for that one job: $${PREMIUM} a month or $${LIFETIME} once.`,
  cta: 'Try Reddix on Reddit',
  secondary: 'Price your setup',
};

export type PlanId = 'free' | 'starter' | 'pro' | 'advanced';

/** Platforms by the first CommunityTracker plan that includes them (pricing page). */
export const PLATFORMS: { name: string; from: PlanId }[] = [
  { name: 'Reddit', from: 'free' },
  { name: 'LinkedIn', from: 'starter' },
  { name: 'Hacker News', from: 'starter' },
  { name: 'GitHub', from: 'starter' },
  { name: 'X', from: 'pro' },
  { name: 'Stack Overflow', from: 'pro' },
  { name: 'Dev.to', from: 'pro' },
  { name: 'Indie Hackers', from: 'pro' },
  { name: 'Slack', from: 'pro' },
  { name: 'Discord', from: 'pro' },
];

export const COVERAGE = {
  them: { label: `${NAME} watches`, note: 'Which ones you get depends on the plan.' },
  reddix: {
    label: 'Reddix watches',
    note: 'Reddit only, and nothing else.',
    depth: [
      'Buyer search phrases written from your product profile',
      'Subreddit suggestions from your website',
      'A 0–100 score with points for competitors, pricing words and “alternative to”',
      'Three reply drafts per thread',
    ],
  },
};

export const JOBS = {
  pill: 'Workflow',
  title: 'Two tools, two different jobs',
  body: 'They overlap on one step: spotting a Reddit post where someone wants a product like yours. What happens before and after that step is where they part.',
  them: {
    name: NAME,
    lead: 'A signal-to-pipeline tool for sales teams.',
    steps: [
      { t: 'Watch keywords across communities', d: 'Reddit plus up to nine others, by plan. You choose keywords, competitors and problems.' },
      { t: 'Score each post Hot or Warm', d: 'Against your ICP, with a number and a reason. AI scoring and filtering are listed from Pro.' },
      { t: 'Find the person behind it', d: 'It looks for the author’s work email and LinkedIn profile, where available.' },
      { t: 'Reach out off-platform', d: 'LinkedIn and email sequences, sent after you approve each message or automatically.' },
      { t: 'Hand it to the CRM', d: 'Hot and Warm posts can become HubSpot deals.' },
    ],
    footnote: 'In communities, it drafts a reply for you to post. Its monitoring page says it never posts on your behalf there.',
  },
  reddix: {
    name: 'Reddix',
    lead: 'A Reddit lead finder for people who reply themselves.',
    steps: [
      { t: 'Start from your website', d: 'Reddix builds a product profile and suggests subreddits.' },
      { t: 'Press Scan when you’re ready', d: 'It searches your subreddits with buyer phrases. At most one scan every 5 minutes.' },
      { t: 'Read a ranked list', d: 'Every post scored 0–100 against your product, with a level from Hot to Low.' },
      { t: 'Pick one of three drafts', d: 'Direct, Story or Expert. Edit it to sound like you.' },
      { t: 'Reply on Reddit yourself', d: 'Reddix never posts, votes or messages, and never connects your Reddit account.' },
    ],
    footnote: 'Reddix doesn’t look up who wrote a post, and it doesn’t send email or LinkedIn messages.',
  },
};

export const PLANS: { id: PlanId; name: string; price: number; keywords: number; unlocks: string[] }[] = [
  { id: 'free', name: 'Free', price: 0, keywords: 1, unlocks: ['1 keyword on Reddit', 'Daily alerts', 'Basic analytics'] },
  { id: 'starter', name: 'Starter', price: 39, keywords: 4, unlocks: ['4 keywords', 'Reddit, LinkedIn, Hacker News, GitHub', '5,000 mentions', 'Up to 100 warm emails a month', 'Reply drafts for posts'] },
  { id: 'pro', name: 'Pro', price: 99, keywords: 10, unlocks: ['10 keywords on all 10+ platforms', 'AI intent scoring and filtering', 'AI reply drafts', 'Share of voice', '3 community intelligence searches a month', 'Daily Slack alerts'] },
  { id: 'advanced', name: 'Advanced', price: 199, keywords: 20, unlocks: ['20 keywords', '5 community intelligence searches a month', 'Visibility gaps and action plan', 'Share-of-voice PDF export'] },
];

export const LADDER = {
  pill: 'Plans',
  title: 'What each CommunityTracker plan unlocks',
  body: 'Billed monthly with no contract; annual billing is available on request. Pro comes with a 3-day trial, and new subscriptions have a 14-day money-back guarantee.',
  marker: 'AI intent scoring starts here',
  alerts: 'Every listed plan describes its alerts as daily. Real-time alerting isn’t mentioned on its site, and it doesn’t state how often it scans.',
  credits: 'Contact lookups use credits; new accounts start with 100. The pricing page doesn’t say how many each plan includes.',
};

export const CALC = {
  pill: 'Calculator',
  title: 'Price your setup on each',
  body: 'Set what you need. The calculator picks the cheapest CommunityTracker plan that covers it and prices twelve months of each tool at list price.',
  keywordsLabel: 'Keywords to track',
  keywordsHint: 'Reddix doesn’t sell by keyword: its AI writes the search phrases from your product profile.',
  platformsLabel: 'Communities besides Reddit',
  toggles: [
    { id: 'ai', label: 'AI intent scoring', them: 'pro' as PlanId, reddix: true },
    { id: 'slack', label: 'Slack alerts', them: 'pro' as PlanId, reddix: false },
    { id: 'pdf', label: 'Share-of-voice PDF report', them: 'advanced' as PlanId, reddix: false },
  ],
  over: 'More than 20 keywords is above Advanced; CommunityTracker offers volume pricing on request.',
  reddixPlatforms: 'Reddix covers Reddit only, so it can’t cover',
  note: 'List prices only. Trials, the money-back guarantee, annual discounts on request and contact-lookup credits aren’t included.',
};

export const REDDIX_YEAR = { premium: PREMIUM * 12, lifetime: LIFETIME, premiumMonthly: PREMIUM };

export const FITS = {
  pill: 'Verdict',
  title: 'Which one fits your team',
  them: {
    title: `${NAME} is the better choice when`,
    items: [
      'Your buyers talk in several places, such as Hacker News, GitHub, Stack Overflow or Discord, not just Reddit.',
      'You sell outbound and want the person’s work email or LinkedIn after spotting their post.',
      'You want sequences, a shared inbox and HubSpot deals in the same tool.',
      'Marketing needs share-of-voice reports against competitors.',
      'You want to start free: one Reddit keyword costs nothing.',
    ],
  },
  reddix: {
    title: 'Reddix is the better choice when',
    items: [
      'Reddit is the channel, and you want to join threads rather than move people to email.',
      `You want AI intent scoring without a $99 plan: Reddix includes it at $${PREMIUM} a month or $${LIFETIME} once.`,
      'You don’t want to manage a keyword list or its cap.',
      'You want three drafted replies per thread to choose from.',
      'You prefer to work through a ranked list when you sit down, rather than a daily alert.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Is Reddix an alternative to CommunityTracker?',
    a: 'For Reddit, yes. Both find Reddit posts where someone wants a product like yours and draft a reply you post yourself. CommunityTracker also covers nine other communities, finds authors’ contact details and runs LinkedIn and email outreach. Reddix does none of that, so it replaces CommunityTracker only if Reddit is the part you use.',
  },
  {
    q: 'Which CommunityTracker plan has AI intent scoring?',
    a: 'Its pricing page lists AI intent scoring and filtering from Pro, at $99 a month, which includes 10 keywords across all platforms. Free and Starter list keyword monitoring, daily alerts and reply drafts, without the AI filter. Reddix scores every post 0–100 on both of its plans.',
  },
  {
    q: 'Does CommunityTracker have a free plan?',
    a: 'Yes. Its Free plan tracks one keyword on Reddit, with daily alerts and basic analytics. Reddix has no free plan; Premium has a 7-day free trial, and Lifetime is a one-time payment.',
  },
  {
    q: 'Does either tool post on Reddit?',
    a: 'No. CommunityTracker’s monitoring page says it never posts on your behalf in a community, though it can send LinkedIn and email outreach automatically if you turn that on. Reddix never posts, votes or messages anywhere, and never connects your Reddit account.',
  },
  {
    q: 'How quickly does each one surface a new Reddit post?',
    a: 'CommunityTracker lists daily alerts on its plans, with daily Slack alerts on Pro, and doesn’t state how often it scans. Reddix shows new posts when you press Scan, at most once every 5 minutes. If minutes matter, test both: CommunityTracker’s Pro trial is 3 days and Reddix Premium’s is 7.',
  },
];

export const SOURCES = [
  { label: 'CommunityTracker homepage', url: 'https://communitytracker.ai' },
  { label: 'CommunityTracker pricing', url: 'https://communitytracker.ai/pricing' },
  { label: 'CommunityTracker social monitoring', url: 'https://communitytracker.ai/social-monitoring-tool' },
  { label: 'CommunityTracker blog', url: 'https://communitytracker.ai/blog' },
];

export const CLOSE = {
  title: 'If Reddit is the channel, start there',
  body: 'Paste your website. Reddix builds your profile, suggests subreddits and ranks the first posts when you press Scan.',
  button: HERO.cta,
  related: [
    { to: '/alternatives/subredditsignals', label: 'Subreddit Signals vs Reddix' },
    { to: '/alternatives/reddleads', label: 'ReddLeads vs Reddix' },
    { to: '/features/subreddit-discovery', label: 'How Reddix picks subreddits' },
  ],
};
