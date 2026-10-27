/**
 * Every word on /alternatives/f5bot. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * F5Bot facts come only from RESEARCH.md (checked 2026-10-27); Reddix facts
 * only from ../reddix. Pipewell and the alert posts are fictional.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/f5bot';

export const META = {
  query: 'f5bot alternative',
  title: 'F5Bot Alternative: Keyword Alerts vs Buying Intent | Reddix',
  description:
    'F5Bot emails you every Reddit mention of a keyword. Reddix scores Reddit posts for buying intent. Plans, limits and when each one fits, checked October 2026.',
};

export const HERO = {
  pill: `Reddix vs F5Bot · Checked ${CHECKED_LABEL}`,
  h1: 'F5Bot vs Reddix: every mention, or the ones ready to buy',
  accent: 'the ones ready to buy',
  answer:
    'F5Bot is a keyword alert service: it emails you whenever a word you track appears on Reddit, Hacker News or Lobsters, from a free personal plan up to API access. Reddix does a different job. It searches Reddit for people describing the problem your product solves, scores each post 0–100 for buying intent and drafts replies you post yourself. If you want every mention, F5Bot fits. If you want a short list of threads worth answering, Reddix does.',
  cta: 'Find buyers on Reddit',
};

/** The two loops, side by side: what goes in, what happens, what comes out. */
export const LOOPS = {
  title: 'Two tools, two different loops',
  body: 'Both start from Reddit. They differ in what you give them, what they do with each post and what lands in front of you.',
  rows: [
    {
      label: 'You give it',
      f5bot: 'Keywords: a brand, a competitor, a niche phrase. Up to 5 on the free plan, 200 on Gold.',
      reddix: 'Your website URL. Reddix builds a product profile and suggests subreddits from it.',
    },
    {
      label: 'It watches',
      f5bot: 'New Reddit posts and comments (titles, linked URLs and comment text), plus Hacker News and Lobsters. It checks every few minutes.',
      reddix: `Reddit only, when you press Scan. ${REDDIX.scanning}.`,
    },
    {
      label: 'It decides with',
      f5bot: 'Case-insensitive keyword matching, with flags for whole words, subreddits and include/exclude terms. No regular expressions or wildcards. Gold adds plain-language AI filters.',
      reddix: 'An AI score from 0 to 100 against your product, plus points for a named competitor, pricing words and “alternative to”.',
    },
    {
      label: 'You get',
      f5bot: 'An alert per match: email on every plan, then RSS/JSON and Slack or Discord on Gold, and API and webhooks on Platinum.',
      reddix: `A ranked lead list and three reply drafts per thread. ${REDDIX.alerts}.`,
    },
    {
      label: 'On Reddit itself',
      f5bot: 'Nothing. Its site describes monitoring and alerts only.',
      reddix: `${REDDIX.posting}.`,
    },
  ],
};

/** F5Bot's tiers as published on f5bot.com/tiers. */
export const F5_TIERS = [
  { name: 'Free', price: '$0', keywords: '5', alerts: '10 per keyword, 20 a day', delay: 'Up to 2 hours', use: 'Personal use only', business: false },
  { name: 'Silver', price: '$12.99/mo', keywords: '20', alerts: '30 per keyword, 100 a day', delay: 'Up to 5 minutes', use: 'Personal, non-commercial', business: false },
  { name: 'Gold', price: '$49.99/mo', keywords: '200', alerts: '100 per keyword, 5,000 a day', delay: 'Instant or scheduled', use: 'Business and client monitoring', business: true },
  { name: 'Platinum', price: '$214.99/mo', keywords: '300', alerts: '500 per keyword, 200,000 a day', delay: 'Instant or scheduled', use: 'Adds API and webhooks', business: true },
  { name: 'Diamond', price: 'From $500/mo', keywords: 'Custom', alerts: 'Custom', delay: 'Instant or scheduled', use: 'Enterprise, via sales', business: true },
] as const;

export const PRICING = {
  title: 'The plan a business would actually be on',
  body: 'F5Bot’s free plan is real and generous for one person. But its tiers page labels Free as personal use and Silver as non-commercial, and points business or client monitoring to Gold. So for a company tracking leads, the comparison starts at $49.99 a month.',
  f5Note: 'Annual billing is offered at roughly one month free. AI filters on Gold include the first $10 a month of model usage; more is billed on top.',
  reddixTitle: 'Reddix plans',
  reddixNote: `${REDDIX.pricing.premium.trial} on Premium. There’s no free plan, and no alert channel to pay for.`,
};

/** The inbox demo: what a keyword alert for “invoice reminders” might deliver. */
export const INBOX = {
  title: 'Six alerts, one keyword: which would you answer first?',
  body: 'Say you sell an invoicing tool and track the phrase “invoice reminders”. A keyword alert sends you all six of these, in the order they were posted. Switch to Reddix’s order to see what its first pass does with the same posts, using the scanner’s real rules.',
  keyword: 'invoice reminders',
  competitor: 'Pipewell',
  note: 'Fictional posts. Reddix doesn’t read your alerts; it runs its own Reddit search. This shows only its rule-based first pass, before the AI scores a post.',
  posts: [
    { sub: 'r/freelance', age: '3m', text: 'Launching our new invoice reminders feature on Product Hunt today, would love your feedback and upvotes!' },
    { sub: 'r/smallbusiness', age: '11m', text: 'TIL you can schedule invoice reminders in Google Sheets with a short Apps Script. Sharing the script below.' },
    { sub: 'r/Entrepreneur', age: '26m', text: 'Switching from Pipewell because their invoice reminders keep landing in spam folders. What do you use?' },
    { sub: 'r/Notion', age: '41m', text: 'I built a free invoice reminder template in Notion, check out my blog post for the download link.' },
    { sub: 'r/graphic_design', age: '58m', text: 'Is a paid tool for invoice reminders worth it for a two-person design studio, or is that overkill?' },
    { sub: 'r/smallbusiness', age: '1h', text: 'Any recommendations for an app that sends invoice reminders automatically? Budget is around $20 per month.' },
  ],
};

export const BETTER = {
  title: 'When F5Bot is the better choice',
  items: [
    { title: 'You want every mention', body: 'Brand monitoring, press, support issues: if missing a single mention matters more than ranking them, a keyword alert is the right tool.' },
    { title: 'You want alerts at all', body: 'F5Bot pushes matches to email, and to Slack, Discord, feeds or webhooks on higher plans. Reddix has no alerts: it finds posts when you run a scan.' },
    { title: 'Hacker News matters to you', body: 'F5Bot also watches Hacker News and Lobsters, where a lot of developer-tool conversation happens. Reddix covers Reddit only.' },
    { title: 'You’re one person on a budget', body: 'For personal tracking of a few uncommon terms, the free plan costs nothing and needs almost no setup.' },
    { title: 'You’re feeding your own pipeline', body: 'Platinum’s API and webhooks with up to 200,000 alerts a day can feed your own tooling.' },
  ],
};

export const BOTH = {
  title: 'Running both',
  body: 'They don’t overlap much, so some teams use both.',
  steps: [
    { title: 'F5Bot for names', body: 'Track your brand and your competitors’ names, so nothing said about you slips past.' },
    { title: 'Reddix for problems', body: 'Scan the subreddits where people describe the problem you solve, often without naming any product.' },
    { title: 'Reply from your own account', body: 'Whichever tool surfaced the thread, answer it yourself, within the subreddit’s rules.' },
  ],
};

export const FAQ = [
  {
    q: 'Is F5Bot free?',
    a: 'F5Bot has a free plan with 5 keywords, alerts delayed up to 2 hours and a 7-day match history, and its tiers page labels it personal use only. Silver is $12.99 a month and non-commercial; business use starts at Gold, $49.99 a month (checked October 2026).',
  },
  {
    q: 'Does F5Bot find leads?',
    a: 'It finds mentions of the keywords you choose. On Gold and above you can add up to 2 or 5 plain-language AI filters to screen them. Ranking leads, drafting replies and tracking lead status aren’t described on its site.',
  },
  {
    q: 'Does Reddix send keyword alerts like F5Bot?',
    a: 'No. Reddix has no email, Slack or webhook alerts. You run a scan, at most once every 5 minutes, and Reddix searches Reddit, scores what it finds and saves the posts worth answering to your lead list.',
  },
  {
    q: 'Can F5Bot track phrases like “looking for a tool”?',
    a: 'Its FAQ says it’s designed for fairly uncommon keywords, doesn’t support regular expressions or wildcards, and that free accounts can’t monitor very common words. Broad buying phrases produce a lot of matches, and keywords that exceed their daily cap are disabled.',
  },
  {
    q: 'Which is cheaper, F5Bot or Reddix?',
    a: `For personal tracking, F5Bot: its free plan costs nothing. For business use, F5Bot Gold is $49.99 a month and Reddix Premium is $${REDDIX.pricing.premium.price} a month, or $${REDDIX.pricing.lifetime.price} once for Lifetime. They do different jobs, so compare against what you need done.`,
  },
];

export const SOURCES = [
  { label: 'F5Bot: plans and limits (f5bot.com/tiers)', url: 'https://f5bot.com/tiers' },
  { label: 'F5Bot: FAQ', url: 'https://f5bot.com/faq' },
  { label: 'F5Bot: Reddit keyword alerts guide', url: 'https://f5bot.com/guides/reddit-keyword-alerts' },
  { label: 'F5Bot: AI filtering docs', url: 'https://f5bot.com/docs-semantic' },
  { label: 'F5Bot: paid features docs', url: 'https://f5bot.com/docs-power' },
  { label: 'F5Bot: About', url: 'https://f5bot.com/about' },
];

export const CLOSING = {
  title: 'Get a short list instead of an inbox',
  body: 'Add your site, pick subreddits and run a scan. Reddix ranks what it finds and drafts the first replies.',
  cta: 'Find buyers on Reddit',
};
