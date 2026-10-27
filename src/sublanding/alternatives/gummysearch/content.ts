/**
 * Every word on /alternatives/gummysearch. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * GummySearch facts come only from RESEARCH.md (vendor pages, checked
 * 2026-10-27); Reddix facts only from ../reddix.
 */
import { REDDIX } from '../reddix';

export const PATH = '/alternatives/gummysearch';

/** The vendor's dates (RESEARCH.md §1, sources 2 and 3). */
export const DATES = {
  closed: '2025-11-30',
  lifetimeEnds: '2026-11-30',
  shutdown: '2026-12-01',
};

export const META = {
  query: 'gummysearch alternative',
  title: 'GummySearch Alternative: Move Before Dec 1, 2026 | Reddix',
  description:
    'GummySearch shuts down and deletes user data on December 1, 2026. What to save first, what Reddix covers, and what it doesn’t.',
};

export const HERO = {
  pill: 'GummySearch alternative',
  h1: 'Moving off GummySearch before December 1',
  accent: 'before December 1',
  answer:
    'GummySearch closed to new users on November 30, 2025. On December 1, 2026 it shuts down completely and deletes all user data; the company says it couldn’t agree a commercial licence for Reddit’s Data API. If you used it to find people asking for a product like yours, Reddix covers that job. If you used it for audience research, Reddix doesn’t.',
  cta: 'Start your 7-day trial',
  secondary: 'Go to the checklist',
};

export const PHASES = {
  pill: 'The timeline',
  title: 'What GummySearch has said will happen, and when',
  body: 'From GummySearch’s own closure notice and the founder’s closing post. The phase you’re in is marked from today’s date.',
  phases: [
    {
      from: null,
      to: '2025-11-30',
      label: 'Until November 30, 2025',
      title: 'Open as normal',
      body: 'Full access. Sign-ups, purchases and day passes were still available.',
    },
    {
      from: '2025-12-01',
      to: '2026-11-30',
      label: 'December 1, 2025 to November 30, 2026',
      title: 'Closed to new users',
      body: 'No new sign-ups, purchases or renewals. Paid customers keep access until their billing period ends, and lifetime-deal access runs to November 30, 2026. Free users can only view, download or delete their data.',
    },
    {
      from: '2026-12-01',
      to: null,
      label: 'From December 1, 2026',
      title: 'Shut down, data deleted',
      body: 'All services stop and all user data is deleted. Anything you haven’t saved by then is gone.',
    },
  ],
};

export const CHECKLIST = {
  pill: 'Before December 1',
  title: 'Five things to save while you still can',
  body: 'These are the parts of a GummySearch setup that took the most time to build. Tick them off as you go; your progress stays in this browser.',
  items: [
    {
      id: 'audiences',
      title: 'Write down each audience and its subreddits',
      body: 'Audiences were GummySearch’s groups of subreddits, and they’re the slowest thing to rebuild. A plain list per audience is enough.',
      next: 'In Reddix, these become your subreddit list.',
    },
    {
      id: 'keywords',
      title: 'Copy your tracked keywords',
      body: 'Your brand, competitor and category keywords. The competitor names matter most if you’re looking for buyers.',
      next: 'Reddix finds competitors from your website; check its list against yours.',
    },
    {
      id: 'themes',
      title: 'Note which themes you actually opened',
      body: 'Pain Points, Solution Requests, Money Talk, Hot Discussions or Seeking Alternatives. The ones you used tell you what kind of tool you need next.',
      next: 'Solution Requests and Seeking Alternatives map to Reddix; the others don’t.',
    },
    {
      id: 'searches',
      title: 'Save the searches you re-run',
      body: 'The questions you kept asking of Reddit: the phrasing, the filters, the subreddits. They’re easy to forget and hard to recreate.',
      next: 'Useful for judging any replacement against your real use.',
    },
    {
      id: 'download',
      title: 'Download your data',
      body: 'GummySearch’s closure notice says users can view, download or delete their data until the shutdown. After December 1 there’s nothing to download.',
      next: 'Keep the files somewhere that isn’t GummySearch.',
    },
  ],
};

export type Verdict = 'covered' | 'partly' | 'not';

export const MAPPING = {
  pill: 'What carries over',
  title: 'GummySearch features, one by one, against Reddix',
  body: 'Reddix is a lead tool, not a research tool, so some of this maps across cleanly and some of it doesn’t at all.',
  rows: [
    {
      gummy: 'Audiences',
      what: 'Groups of subreddits you built, then searched within.',
      reddix: 'A subreddit list, suggested from your website and edited by you.',
      verdict: 'covered',
    },
    {
      gummy: 'Solution Requests and Seeking Alternatives',
      what: 'Conversations where someone asks for a product, or for a replacement.',
      reddix: 'Every post found is scored 0–100 for buying intent against your product. Naming a competitor or saying “alternative to” adds points.',
      verdict: 'covered',
    },
    {
      gummy: 'Tracked keywords',
      what: 'Notifications about brand, competitor and category mentions.',
      reddix: 'Competitors from your profile raise a post’s score, but there are no keyword alerts. You see results when you run a scan.',
      verdict: 'partly',
    },
    {
      gummy: 'Pain Points, Money Talk, Hot Discussions',
      what: 'Research buckets for what a market complains about, spends on and argues over.',
      reddix: 'Not offered. Reddix ranks posts by how close the writer is to buying, not by topic.',
      verdict: 'not',
    },
    {
      gummy: 'Search across all of Reddit',
      what: 'Conversation search over one audience or the whole site, with charts.',
      reddix: 'Not offered. Reddix searches the subreddits on your list when you press Scan.',
      verdict: 'not',
    },
    {
      gummy: 'Idea validation and content ideas',
      what: 'Two of the four use cases on GummySearch’s homepage.',
      reddix: 'Not what Reddix is built for.',
      verdict: 'not',
    },
    {
      gummy: 'Replying to threads',
      what: 'GummySearch’s product page recommends a Reddit account for joining conversations; it doesn’t describe drafting replies.',
      reddix: 'Three drafts per thread (Direct, Story, Expert) for you to edit and post yourself. Reddix never posts.',
      verdict: 'covered',
    },
  ] satisfies { gummy: string; what: string; reddix: string; verdict: Verdict }[],
  legend: { covered: 'Covered', partly: 'Partly', not: 'Not in Reddix' } satisfies Record<Verdict, string>,
};

export const PRICES = {
  pill: 'Prices',
  title: 'What it cost, and what Reddix costs',
  body: 'GummySearch’s pricing page still lists its old plans, but none of them can be bought.',
  gummy: [
    { name: 'Free', price: '$0/month', note: '50 keyword searches' },
    { name: 'Starter', price: '$29/month', note: 'Unlimited keyword searches' },
    { name: 'Pro', price: '$59/month', note: 'No numeric limits listed' },
    { name: 'Mega', price: '$199/month', note: '“Enterprise” limits, not specified' },
  ],
  reddix: [
    { name: 'Premium', price: `$${REDDIX.pricing.premium.price}/month`, note: `${REDDIX.pricing.premium.trial}, then monthly` },
    { name: 'Lifetime', price: `$${REDDIX.pricing.lifetime.price} once`, note: 'One payment, no renewals' },
    { name: 'Enterprise', price: 'Custom', note: REDDIX.pricing.enterprise.note },
  ],
  footnote: 'Reddix has no free plan. GummySearch also sold annual billing at a discount and day passes; those prices weren’t captured.',
};

export const FIT = {
  pill: 'Who should move',
  title: 'Move to Reddix, or look elsewhere',
  move: {
    title: 'Reddix fits if you mostly',
    items: [
      'opened Solution Requests or Seeking Alternatives to find people to talk to',
      'tracked competitor names to catch people unhappy with them',
      'want the posts ranked, so the likeliest buyers come first',
      'reply yourself and want a draft to start from',
    ],
  },
  elsewhere: {
    title: 'Look for a research tool if you mostly',
    items: [
      'validated startup ideas or sized audiences',
      'mined Pain Points and Money Talk for positioning or content',
      'searched across all of Reddit rather than a set of communities',
      'needed alerts the moment a keyword appeared',
    ],
    note: 'GummySearch’s own alternatives page groups replacement tools by job, including research and lead generation. It says some of its links may be affiliate links.',
  },
};

export const FAQ = [
  {
    q: 'When does GummySearch shut down?',
    a: 'On December 1, 2026 all services stop and all user data is deleted. It has been closed to new users since November 30, 2025; paid customers keep access until their billing period ends, and lifetime-deal access runs to November 30, 2026.',
  },
  {
    q: 'Why is GummySearch closing?',
    a: 'The company says it couldn’t reach a commercial licence agreement for Reddit’s Data API. The founder’s closing post says it is shutting down to comply with Reddit’s API policies.',
  },
  {
    q: 'Can I still sign up for or renew GummySearch?',
    a: 'No. Sign-ups, purchases and renewals stopped after November 30, 2025. Existing users can still download their data until the shutdown.',
  },
  {
    q: 'Does Reddix do audience research like GummySearch?',
    a: 'No. Reddix finds posts where someone may want a product like yours, scores them 0–100 and drafts replies for you to post. It doesn’t group conversations into research themes, size audiences or search all of Reddit.',
  },
  {
    q: 'How does Reddix pricing compare to GummySearch’s old plans?',
    a: `GummySearch listed $0, $29, $59 and $199 a month. Reddix has no free plan: Premium is $${REDDIX.pricing.premium.price} a month after a 7-day trial, or $${REDDIX.pricing.lifetime.price} once for Lifetime.`,
  },
];

export const CLOSE = {
  title: 'Bring your buyer-finding over, before December 1',
  body: 'Paste your website. Reddix builds a product profile, suggests subreddits, and scores the posts it finds when you run a scan.',
  button: 'Start your 7-day trial',
};

export const SOURCES = [
  { label: 'GummySearch homepage (closure banner)', url: 'https://gummysearch.com/' },
  { label: 'GummySearch: “GummySearch is now closed” (timeline and reason)', url: 'https://gummysearch.com/docs/articles/gummysearch-is-now-closed-6533h' },
  { label: 'GummySearch: founder’s closing post', url: 'https://gummysearch.com/closing-time/' },
  { label: 'GummySearch product page (audiences, themes, keywords)', url: 'https://gummysearch.com/product/' },
  { label: 'GummySearch pricing page (historical plans)', url: 'https://gummysearch.com/pricing/' },
  { label: 'GummySearch alternatives page (with affiliate disclosure)', url: 'https://gummysearch.com/gummysearch-alternatives/' },
];
