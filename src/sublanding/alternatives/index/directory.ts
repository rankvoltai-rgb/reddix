/**
 * Every tool on /alternatives, from the RESEARCH.md beside each comparison
 * page (checked 2026-10-27). Pure data: the page, the fit finder and the
 * crawler HTML all read it.
 */

/** What the tool itself does on Reddit, from least to most. */
export type Stop = 'watch' | 'find' | 'message' | 'post' | 'sell';

export const STOPS: { id: Stop; name: string; line: string }[] = [
  { id: 'watch', name: 'Watches', line: 'Alerts or reports on mentions. You decide whether to show up.' },
  { id: 'find', name: 'Finds and drafts', line: 'Ranks threads worth answering and drafts replies. You post them.' },
  { id: 'message', name: 'Messages for you', line: 'Sends direct messages from your account through automation.' },
  { id: 'post', name: 'Posts for you', line: 'Comments or posts through software or a service, on your accounts or theirs.' },
  { id: 'sell', name: 'Sells engagement', line: 'Sells accounts, upvotes or paid comments.' },
];

export type Tool = {
  slug: string;
  name: string;
  stop: Stop;
  /** One plain sentence on what it is. */
  what: string;
  /** Reddit only, or the other places it covers. */
  reddit: 'only' | 'among others';
  /** Lowest listed paid price in USD per month, or null if not published. */
  from: number | null;
  /** How the price reads on the page. */
  price: string;
  freePlan: boolean;
  /** Set when the tool no longer serves Reddit. */
  gone?: string;
};

export const TOOLS: Tool[] = [
  {
    slug: 'f5bot',
    name: 'F5Bot',
    stop: 'watch',
    what: 'Email keyword alerts for Reddit, Hacker News and Lobsters.',
    reddit: 'among others',
    from: 12.99,
    price: 'Free for personal use; business use from $49.99/mo',
    freePlan: true,
  },
  {
    slug: 'syften',
    name: 'Syften',
    stop: 'watch',
    what: 'Filtered keyword monitoring across about 17 communities plus the open web.',
    reddit: 'among others',
    from: 29.95,
    price: 'From $29.95/mo; 14-day trial',
    freePlan: false,
  },
  {
    slug: 'brandwatch',
    name: 'Brandwatch',
    stop: 'watch',
    what: 'Enterprise social listening and analytics, owned by Cision.',
    reddit: 'among others',
    from: null,
    price: 'Not published; sold through a demo',
    freePlan: false,
  },
  {
    slug: 'communitytracker',
    name: 'CommunityTracker',
    stop: 'watch',
    what: 'B2B sales monitoring across 10+ platforms, with AI intent scoring from its Pro plan.',
    reddit: 'among others',
    from: 39,
    price: 'Free plan (1 Reddit keyword); paid from $39/mo',
    freePlan: true,
  },
  {
    slug: 'subredditsignals',
    name: 'SubredditSignals',
    stop: 'find',
    what: 'Reddit lead monitoring that drafts replies and never posts; also sells a managed service.',
    reddit: 'only',
    from: 29,
    price: 'From $29/mo; 14-day trial',
    freePlan: false,
  },
  {
    slug: 'reddleads',
    name: 'ReddLeads',
    stop: 'find',
    what: 'A young Reddit lead finder that never posts or sends messages.',
    reddit: 'only',
    from: 19.99,
    price: 'From $19.99/mo; 7-day trial',
    freePlan: false,
  },
  {
    slug: 'replydaddy',
    name: 'ReplyDaddy',
    stop: 'find',
    what: 'Finds threads and drafts replies without connecting your Reddit account.',
    reddit: 'only',
    from: 49,
    price: 'Free plan; paid from $49/mo',
    freePlan: true,
  },
  {
    slug: 'redreach',
    name: 'Redreach',
    stop: 'message',
    what: 'A Reddit lead finder whose Chrome extension automates bulk direct messages.',
    reddit: 'only',
    from: 19,
    price: 'From $19/mo, or a $12 three-day pass',
    freePlan: false,
  },
  {
    slug: 'replyagent',
    name: 'ReplyAgent',
    stop: 'post',
    what: 'AI reply drafting, plus an optional service that posts from its own aged accounts per comment.',
    reddit: 'only',
    from: 79,
    price: '$79/mo for drafting; posting priced per comment',
    freePlan: false,
  },
  {
    slug: 'promotee',
    name: 'Promotee',
    stop: 'post',
    what: 'Automates up to 10 of your own accounts: warm-up, AI comments and DM sequences.',
    reddit: 'only',
    from: 9,
    price: 'From $9/mo on credits; 7-day trial',
    freePlan: false,
  },
  {
    slug: 'redditor-ai',
    name: 'Redditor AI',
    stop: 'post',
    what: 'A done-for-you service that comments from its own pool of accounts; sign-up currently leads to a waitlist.',
    reddit: 'only',
    from: 39,
    price: '$39/mo (waitlist)',
    freePlan: false,
  },
  {
    slug: 'redaccs',
    name: 'REDAccs',
    stop: 'sell',
    what: 'Sells Reddit accounts, upvotes and paid comments, plus a pay-per-use thread finder.',
    reddit: 'only',
    from: null,
    price: 'Pay per use; comments from $10',
    freePlan: false,
  },
  {
    slug: 'gummysearch',
    name: 'GummySearch',
    stop: 'watch',
    what: 'Reddit audience research. Closed to new users; shuts down and deletes user data on December 1, 2026.',
    reddit: 'only',
    from: null,
    price: 'No longer sold',
    freePlan: false,
    gone: 'Shuts down December 1, 2026',
  },
  {
    slug: 'catchintent',
    name: 'CatchIntent',
    stop: 'watch',
    what: 'Started as a Reddit monitor; since May 2026 it covers LinkedIn only.',
    reddit: 'among others',
    from: null,
    price: 'No Reddit plan',
    freePlan: false,
    gone: 'LinkedIn-only since May 2026',
  },
  {
    slug: 'linkeddit',
    name: 'Linkeddit',
    stop: 'find',
    what: 'Was a Reddit lead finder; now sells competitor intelligence, and its Reddit lead pages are gone.',
    reddit: 'only',
    from: null,
    price: 'No Reddit plan',
    freePlan: false,
    gone: 'Moved away from Reddit leads in 2026',
  },
];

/** Reddix on the same line, from ../reddix.ts. */
export const REDDIX_ROW = {
  name: 'Reddix',
  stop: 'find' as Stop,
  what: 'Scores Reddit posts 0–100 against your product and drafts three replies; never posts, votes or messages.',
  price: '$45/mo with a 7-day trial, or $150 once',
};

/** Tools in the category without a comparison page yet: one line each, from MARKET.md. */
export const ALSO = [
  { name: 'Octolens', url: 'https://octolens.com/', what: 'AI mention monitoring across the web, including Reddit, with an API, webhooks and an MCP server.' },
  { name: 'KWatch.io', url: 'https://kwatch.io/', what: 'Keyword alerts for Reddit, LinkedIn, X, Facebook, YouTube and Hacker News.' },
  { name: 'SnitchFeed', url: 'https://snitchfeed.com/', what: 'Buying-intent monitoring across Reddit, LinkedIn, X, Bluesky and Hacker News.' },
  { name: 'Brand24', url: 'https://brand24.com/', what: 'Brand monitoring across social, news, blogs, forums and reviews.' },
  { name: 'Awario', url: 'https://awario.com/', what: 'Brand monitoring with a Reddit page and sales teams among its audiences.' },
];
