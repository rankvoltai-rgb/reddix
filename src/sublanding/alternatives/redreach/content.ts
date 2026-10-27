/**
 * Every word on /alternatives/redreach. Redreach facts come only from
 * RESEARCH.md (checked 2026-10-27); Reddix facts only from ../reddix.
 * The product spells itself "Redreach"; the slug keeps the old spelling.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/redreach';
export const CHECKED = CHECKED_LABEL;

export const META = {
  query: 'redreach alternative',
  title: 'Redreach Alternative: Redreach vs Reddix Compared | Reddix',
  description:
    'Redreach and Reddix both find Reddit threads where people want a product like yours. How they differ on scoring, DMs, alerts and price, checked October 2026.',
};

export const HERO = {
  pill: 'Comparison · Redreach',
  h1: 'Redreach vs Reddix: the same threads, a different next step',
  accent: 'a different next step',
  answer:
    'Redreach and Reddix both start from your website and surface Reddit threads where people want a product like yours. Redreach favours threads that already rank on Google, sends alerts, and adds a Chrome extension that sends Reddit DMs in bulk. Reddix scores each post 0–100 against your product and drafts three replies that you post yourself.',
  cta: 'Try Reddix free for 7 days',
};

/** The fork diagram under the hero: what both do, then where each goes. */
export const FORK = {
  shared: 'Both read your website, then find Reddit threads where someone is asking for a product like yours.',
  redreach: {
    name: 'Redreach',
    steps: ['Ranks threads by Google visibility and AI relevance', 'Alerts by email, Telegram, Slack or webhook', 'Suggests replies you post', 'Outbound: bulk DMs from your browser'],
  },
  reddix: {
    name: 'Reddix',
    steps: ['Scores each post 0–100 against your product', 'You press Scan when you’re ready to reply', 'Drafts three replies you edit and post', 'Saves leads to a list with statuses'],
  },
};

export const GLANCE = {
  title: 'Side by side',
  intro: 'What each product does, from Redreach’s own site and Reddix’s product code.',
  rows: [
    { label: 'Setup', redreach: 'Your website and up to 3 competitors (more on higher plans). No keyword list needed.', reddix: REDDIX.setup },
    { label: 'Which threads come first', redreach: 'Threads that rank on Google for your topics, each with an AI relevance score.', reddix: 'Posts with the highest 0–100 score against your product.' },
    { label: 'How often new leads arrive', redreach: 'Weekly on Startup; daily on Growth and Professional.', reddix: `${REDDIX.scanning}.` },
    { label: 'Replies', redreach: 'AI reply suggestions: 100, 300 or 500 by plan. You post them.', reddix: `${REDDIX.replies}.` },
    { label: 'Direct messages', redreach: 'Outbound Chrome extension sends 30, 100 or 500 DMs a day by plan.', reddix: 'None.' },
    { label: 'Alerts', redreach: 'Email; Telegram from Growth; Slack and webhook on Professional.', reddix: `${REDDIX.alerts}.` },
    { label: 'Brand and competitor mentions', redreach: 'Tracked, with sentiment.', reddix: 'A named competitor in a post adds points to its score.' },
    { label: 'Seats', redreach: '1, 2 or 3 by plan; more through sales.', reddix: 'Not compared here.' },
    { label: 'Free trial', redreach: 'None. A $12 three-day pass, and a refund window of 48 hours.', reddix: `${REDDIX.pricing.premium.trial} on Premium.` },
    { label: 'Platforms', redreach: 'Reddit only.', reddix: 'Reddit only.' },
  ],
};

export const PLANS = {
  title: 'Redreach plans, as listed on its site in October 2026',
  note: 'The pricing table loads in the browser, and the site’s code includes a hook for price experiments, so some visitors may see different figures.',
  plans: [
    { id: 'startup', name: 'Startup', monthly: 19, yearly: 180, seats: 1, competitors: 3, keywords: 20, replies: 100, cadence: 'weekly', dms: 30, alerts: ['Email'], api: false },
    { id: 'growth', name: 'Growth', monthly: 39, yearly: 372, seats: 2, competitors: 6, keywords: 40, replies: 300, cadence: 'daily', dms: 100, alerts: ['Email', 'Telegram'], api: true },
    { id: 'professional', name: 'Professional', monthly: 79, yearly: 756, seats: 3, competitors: 8, keywords: 60, replies: 500, cadence: 'daily', dms: 500, alerts: ['Email', 'Telegram', 'Slack', 'Webhook'], api: true },
  ],
  pass: { price: 12, days: 3, note: 'Pro features except daily mention tracking, plus a report of ranking posts and mentions so far.' },
} as const;

export const DIFFERENCES = {
  pill: 'Where they differ',
  title: 'Four differences that decide it',
  items: [
    {
      title: 'What “a good thread” means',
      body: [
        'Redreach puts threads that rank on Google first. A thread that ranks keeps getting read for months, so a useful reply there can keep sending visitors long after the conversation goes quiet. Its API calls these “SERP opportunities”.',
        'Reddix asks a different question: how close is this person to choosing a product like yours? Each post gets a 0–100 score against your product description, with extra points when it names a competitor, mentions price or asks for an alternative. A brand-new post from someone comparing tools can outrank an old thread with more traffic.',
      ],
    },
    {
      title: 'Public replies or private messages',
      body: [
        'Both tools stop short of posting public replies for you. Redreach says it doesn’t auto-post because of Reddit’s bot detection and removed comments, and Reddix never posts, comments, votes or messages at all.',
        'The difference is Outbound. Redreach’s Chrome extension types and sends Reddit DMs from your logged-in browser to subreddit members, thread commenters or a list you upload, at 30 to 500 a day depending on the plan. It adds random delays and limits based on account age and karma, and suggests 10–20 a day for newer accounts. Reddix has no messaging feature.',
      ],
    },
    {
      title: 'Being told vs going to look',
      body: [
        'Redreach comes to you: email on every plan, Telegram from Growth, and Slack and webhooks on Professional. On Startup, new leads and competitor tracking refresh weekly; daily updates start at Growth.',
        'Reddix has no alerts. You open it and press Scan, at most once every 5 minutes, when you have time to reply. That suits people who answer threads in a set block of time; it doesn’t suit a team that wants a Slack ping the moment a thread appears.',
      ],
    },
    {
      title: 'How you pay',
      body: [
        'Redreach is cheaper to start: $19 a month, or $12 for a three-day pass to try it. There’s no free trial, and refunds are offered in the first 48 hours after payment. Features and limits climb by tier, so what you need decides the plan.',
        'Reddix has one paid plan with everything in it: $45 a month after a 7-day free trial, or $150 once for lifetime access.',
      ],
    },
  ],
};

export const DMS = {
  pill: 'Before you automate DMs',
  title: 'What Reddit says about unsolicited messages',
  vendor: {
    label: 'What Redreach says Outbound does',
    points: [
      'Sends DMs by automating the clicking and typing in your logged-in Chrome session.',
      'Targets subreddit members, thread commenters, or usernames from a CSV.',
      'Adds random 1–60 second delays and prevents duplicates.',
      'Limits sending by account age and karma, and suggests 10–20 a day for newer accounts.',
    ],
  },
  reddit: {
    label: 'What Reddit’s spam policy says',
    points: [
      'Spam is repeated or unsolicited actions, automated or manual, that harm users or communities.',
      'Sending large amounts of unsolicited chat or private messages is listed as an example.',
      'So is using tools, including bots, that may facilitate spam.',
      'Accounts can be flagged for spam or inauthentic activity, which hides what they post.',
    ],
  },
  close: 'Whether a campaign counts as spam depends on who you message, how many and what you send. Read the policy and decide before switching it on. Reddix leaves this out entirely: it has no messaging.',
};

export const CALCULATOR = {
  pill: 'Plan finder',
  title: 'Which Redreach plan would you need?',
  body: 'Tick what you need. This picks the cheapest Redreach plan that covers it, from the plans listed on its site, and shows what a year costs next to Reddix.',
  needs: [
    { id: 'daily', label: 'New leads every day, not weekly' },
    { id: 'telegram', label: 'Alerts in Telegram' },
    { id: 'slack', label: 'Alerts in Slack or by webhook' },
    { id: 'api', label: 'API or MCP access' },
    { id: 'dms', label: 'More than 100 automated DMs a day' },
    { id: 'seats3', label: 'Three team seats' },
  ],
  reddixMissing: {
    daily: 'Reddix has no schedule: you scan when you choose, up to once every 5 minutes.',
    api: 'API access isn’t compared on this page.',
    telegram: 'Reddix has no alerts.',
    slack: 'Reddix has no alerts.',
    dms: 'Reddix has no messaging.',
    seats3: 'Seats aren’t compared on this page.',
  } as Record<string, string>,
};

export const VERDICT = {
  title: 'Redreach or Reddix: matching the tool to your next step',
  redreach: {
    label: 'Redreach is the better fit if',
    points: [
      'Long-lived Google traffic from Reddit threads matters most to you.',
      'You want alerts pushed to email, Telegram, Slack or a webhook.',
      'Outbound DMs are part of your plan, and you’ve read Reddit’s spam policy.',
      'You want to start under $20 a month, or test it for $12.',
      'Your team needs API or MCP access to the leads.',
    ],
  },
  reddix: {
    label: 'Reddix is the better fit if',
    points: [
      'You want posts ranked by how close the writer is to buying your kind of product.',
      'You prefer to scan when you have time to reply, not be pinged.',
      'You want three reply drafts per thread and a lead list with statuses.',
      'You’d rather have a free trial, or pay once with the $150 lifetime plan.',
      'You don’t want messaging in your workflow at all.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Is Redreach the same as RedReach or RedReplier?',
    a: 'Redreach spells its name with a lower-case second r, at redreach.ai. RedReplier is a different product that shows up in the same searches. This page compares Redreach.',
  },
  {
    q: 'Does Redreach post replies on Reddit for you?',
    a: 'No. Redreach suggests replies and you post them; its FAQ says it doesn’t auto-post because of Reddit’s bot detection. Its separate Outbound extension does send direct messages automatically from your browser.',
  },
  {
    q: 'Does Reddix send Reddit DMs?',
    a: 'No. Reddix never posts, comments, votes or sends messages on Reddit, and it never connects to your Reddit account. It finds and scores posts and drafts replies for you to post.',
  },
  {
    q: 'Which is cheaper, Redreach or Reddix?',
    a: 'Redreach starts lower, at $19 a month, with a $12 three-day pass. Reddix is $45 a month after a 7-day free trial, or $150 once. Over a year, Redreach’s Startup plan billed yearly is $180, and Reddix’s lifetime plan is $150.',
  },
  {
    q: 'Can I get Slack alerts from either tool?',
    a: 'Redreach offers Slack and webhook alerts on its Professional plan ($79 a month). Reddix has no alerts of any kind; you run a scan when you want new posts.',
  },
];

export const SOURCES = [
  { label: 'Redreach homepage: product, setup, FAQ, refund window', url: 'https://redreach.ai' },
  { label: 'Redreach changelog', url: 'https://redreach.ai/changelog' },
  { label: 'Redreach Outbound: Reddit DM automation', url: 'https://redreach.ai/feature/reddit-dm-automation-tool' },
  { label: 'Redreach alerts', url: 'https://redreach.ai/alerts/reddit' },
  { label: 'Redreach API', url: 'https://redreach.ai/reddit-api' },
  { label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
  { label: 'Reddit Help: My account was flagged for spam or inauthentic activity', url: 'https://support.reddithelp.com/hc/en-us/articles/360045309012-My-account-was-flagged-for-spam-or-inauthentic-activity' },
];

export const CLOSING = {
  title: 'See which Reddit posts are asking for you',
  body: 'Add your website. Reddix builds your product profile, suggests subreddits, and scores the first posts when you run a scan.',
  button: 'Start your 7-day trial',
};
