/**
 * Every word on /alternatives/redaccs. Competitor facts come from RESEARCH.md
 * (checked 2026-10-27), Reddit's rules from ../REDDIT-POLICY.md and the Reddit
 * pages other research notes opened, Reddix's facts from ../reddix. Quotes
 * under 15 words.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/redaccs';

const { premium, lifetime } = REDDIX.pricing;
const REDDIX_PRICE = `$${premium.price} a month with a ${premium.trial}, or $${lifetime.price} one-time`;

export const META = {
  query: 'redaccs alternative',
  title: 'REDAccs vs Reddix: Buying Reddit Engagement or Earning It | Reddix',
  description:
    'REDAccs sells Reddit accounts, upvotes and paid comments, plus a pay-per-use Thread Finder. How that compares with Reddix, with prices checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · REDAccs',
  h1: 'REDAccs vs Reddix: buying Reddit engagement, or earning it',
  accent: 'or earning it',
  answer:
    'REDAccs is mainly a marketplace for Reddit accounts and paid engagement: upvotes, comments its staff post from its own accounts, and posts. Since February 2026 it has also sold a pay-per-use lead finder called Thread Finder. Reddix only finds threads and drafts replies for you to post yourself; it sells no accounts, votes or placements.',
  cta: 'Find threads with Reddix',
  checked: `Prices checked ${CHECKED_LABEL}`,
};

export type SourceId =
  | 'home'
  | 'upvotes'
  | 'comments'
  | 'comments2'
  | 'posts'
  | 'blank'
  | 'finder'
  | 'leads'
  | 'disrupt'
  | 'spam'
  | 'multiple'
  | 'agreement';

export const SOURCES: { id: SourceId; label: string; url: string }[] = [
  { id: 'home', label: 'REDAccs homepage', url: 'https://redaccs.com/' },
  { id: 'upvotes', label: 'REDAccs: buy Reddit upvotes', url: 'https://redaccs.com/buy-reddit-upvotes/' },
  { id: 'comments', label: 'REDAccs: buy Reddit comments', url: 'https://redaccs.com/buy-reddit-comments/' },
  { id: 'comments2', label: 'REDAccs: Reddit comments service', url: 'https://redaccs.com/reddit-comments/' },
  { id: 'posts', label: 'REDAccs: buy Reddit posts', url: 'https://redaccs.com/buy-reddit-posts/' },
  { id: 'blank', label: 'REDAccs: blank Reddit accounts', url: 'https://redaccs.com/blank-reddit-accounts/' },
  { id: 'finder', label: 'REDAccs: Reddit lead finder (Thread Finder)', url: 'https://redaccs.com/reddit-lead-finder/' },
  { id: 'leads', label: 'REDAccs: Reddit Leads dashboard sign-in', url: 'https://leads.redaccs.com/' },
  { id: 'disrupt', label: 'Reddit Help: Disrupting Communities', url: 'https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities' },
  { id: 'spam', label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
  { id: 'multiple', label: 'Reddit Help: Is it ok to create multiple accounts?', url: 'https://support.reddithelp.com/hc/en-us/articles/204535759-Is-it-ok-to-create-multiple-accounts' },
  { id: 'agreement', label: 'Reddit User Agreement (effective July 1, 2026)', url: 'https://redditinc.com/policies/user-agreement' },
];

/** The hero's price list, as REDAccs publishes it. */
export const CATALOGUE = {
  title: 'What REDAccs sells',
  lines: [
    { item: 'Custom comment', detail: 'Posted by REDAccs staff from its accounts', price: '$10', src: 'comments' },
    { item: 'Comment with a link', detail: 'Same, with a hyperlink', price: '$15', src: 'comments' },
    { item: 'Post', detail: 'Placed by hand, delivered in 24–72 hours', price: '$30', src: 'posts' },
    { item: 'Upvotes', detail: 'Credit packs, $10 to $5,000', price: 'from ~$0.04', src: 'upvotes' },
    { item: 'Blank account', detail: 'Its pages give different starting prices', price: '$0.30–$2.00', src: 'blank' },
    { item: 'Thread Finder', detail: '7-day free trial, then wallet top-ups', price: 'not published', src: 'finder' },
  ],
} as const;

export const BUSINESSES = {
  pill: 'Two businesses, one name',
  title: 'A marketplace first, a lead finder second',
  body: 'Most of REDAccs’ site sells accounts and engagement. The lead finder arrived in February 2026. They answer different questions, so they’re worth looking at one at a time.',
  market: {
    name: 'The marketplace',
    items: [
      { title: 'Accounts', text: 'Aged, karma and blank Reddit accounts. Login details are emailed after payment, by card or crypto.', src: 'home' },
      { title: 'Upvotes', text: 'Sold as credits, one credit per vote, with checkout on a separate site, upvote.net.', src: 'upvotes' },
      { title: 'Comments', text: 'Written and posted by its staff from REDAccs accounts it describes as a year old or more with 200+ karma. You supply the thread.', src: 'comments' },
      { title: 'Posts', text: 'Placed by hand from selected aged accounts, or from your own account on request.', src: 'posts' },
    ],
  },
  finder: {
    name: 'Thread Finder',
    items: [
      { title: 'Input', text: 'A URL, keyword, competitor or product description, mapped to likely subreddits. It claims an index of 100,000+ subreddits.', src: 'finder' },
      { title: 'Matching', text: 'AI that tries to tell a passing mention from someone looking for a solution. Each lead shows a “lead potential” score, a traffic estimate and subreddit fit; the method isn’t explained.', src: 'finder' },
      { title: 'Alerts', text: 'Email digest, Slack, webhook, Telegram and Web Push.', src: 'finder' },
      { title: 'Replies', text: 'Starter reply templates. The page says it “is not an auto-comment bot”, while the dashboard sign-in lists “One-Click Comments”.', src: 'leads' },
    ],
  },
} as const;

export const OWN_WORDS = {
  pill: 'In its own words',
  title: 'REDAccs on Reddit’s rules, in two places',
  body: 'REDAccs’ pages don’t agree with each other about Reddit’s rules. Here is what each says, then what Reddit’s own pages say about the same services. Reddit decides how its rules apply.',
  vendor: [
    { quote: 'Paid engagement is not permitted under Reddit’s rules.', where: 'REDAccs comments page', src: 'comments' },
    { quote: 'consistently adheres to Reddit’s guidelines', where: 'REDAccs upvotes page, about its service', src: 'upvotes' },
    { quote: 'does not promise risk-free placement', where: 'REDAccs posts page', src: 'posts' },
  ],
  reddit: [
    {
      quote: 'Creating and employing multiple accounts, voting services, or any automation to manipulate vote counts',
      where: 'Disrupting Communities, listed as vote manipulation',
      src: 'disrupt',
    },
    { quote: 'Mass-posting repetitive content for the purpose of exposure or financial gain.', where: 'Spam, listed as something that may violate the policy', src: 'spam' },
    { note: 'Multiple accounts are allowed, but voting on the same post or comment from more than one of yours counts as vote manipulation.', where: 'Is it ok to create multiple accounts?', src: 'multiple' },
    { note: 'Users agree not to license, sell or transfer their account without Reddit’s written approval.', where: 'Reddit User Agreement', src: 'agreement' },
  ],
} as const;

/** Published prices the receipt builder uses (checked 2026-10-27). */
export const PRICES = { comment: 10, linkComment: 15, post: 30 } as const;
export const UPVOTE_PACKS = [
  { price: 10, votes: 50 },
  { price: 50, votes: 310 },
  { price: 500, votes: 5000 },
  { price: 1000, votes: 13330 },
  { price: 2000, votes: 40000 },
  { price: 5000, votes: 125000 },
] as const;

export const RECEIPT = {
  pill: 'Build an order',
  title: 'Price a month of bought engagement',
  body: 'Add what you’d order and the receipt totals it at REDAccs’ published prices. The small print comes from REDAccs’ own pages. Thread Finder isn’t on it, because its per-action prices aren’t published.',
  fine: [
    { text: 'Finding or choosing a thread is not included in this service.', src: 'comments2' },
    { text: 'Paid engagement is not permitted under Reddit’s rules.', src: 'comments' },
    { text: 'does not promise risk-free placement', src: 'posts' },
  ],
  packNote: 'The $10 pack lists 50 votes on the page and 100 in its structured data; we use 50.',
};

export const SIDE = {
  pill: 'Finding threads',
  title: 'Thread Finder and Reddix, side by side',
  body: 'This is the part of REDAccs that does the same job as Reddix, so it deserves a fair comparison. Thread Finder is ahead on alerts and has no subscription.',
  rows: [
    { label: 'Where it looks', them: 'Reddit; claims an index of 100,000+ subreddits', us: 'Reddit; the subreddits you choose, suggested from your site', edge: 'even' },
    { label: 'What you give it', them: 'A URL, keyword, competitor or product description', us: 'Your website URL; Reddix builds a product profile', edge: 'even' },
    { label: 'How it ranks posts', them: 'A “lead potential” score, traffic estimate and subreddit fit; method not explained', us: REDDIX.scoring, edge: 'even' },
    { label: 'When it looks', them: 'Watches for matches; the vendor says many surface within minutes', us: REDDIX.scanning, edge: 'them' },
    { label: 'How it tells you', them: 'Email digest, Slack, webhook, Telegram, Web Push', us: 'In the app only; Reddix sends no alerts', edge: 'them' },
    { label: 'Replies', them: 'Starter reply templates', us: REDDIX.replies, edge: 'us' },
    { label: 'Posting', them: 'Says it isn’t an auto-comment bot; the dashboard lists “One-Click Comments”', us: REDDIX.posting, edge: 'even' },
    { label: 'Paying', them: 'Free for 7 days, then wallet top-ups; per-action prices not published', us: REDDIX_PRICE, edge: 'even' },
  ],
} as const;

export const FIT = {
  them: {
    name: 'REDAccs may suit you if',
    items: [
      'You want lead alerts in Slack, Telegram or by webhook.',
      'You’d rather pay per use than hold a subscription.',
      'You’ve weighed what its own pages say about paid engagement and still want it.',
    ],
  },
  us: {
    name: 'Reddix may suit you if',
    items: [
      'You want replies that come from you, on an account with your history.',
      'You want posts ranked against your product before you spend time on them.',
      'You want a fixed price you can see before you start.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Is REDAccs a lead-generation tool?',
    a: 'Partly. Most of its site sells Reddit accounts, upvotes, comments and posts. Since February 2026 it has also offered Thread Finder, which watches Reddit for threads where people ask for recommendations and scores them as leads.',
  },
  {
    q: 'What does Thread Finder cost?',
    a: 'There’s a free 7-day trial, then you top up a wallet and pay per action. When we checked in October 2026, REDAccs didn’t publish the per-action prices or a minimum top-up, and the page’s description also called it free to use.',
  },
  {
    q: 'Does REDAccs say buying comments is allowed on Reddit?',
    a: 'Its comments page says paid engagement is not permitted under Reddit’s rules. Its upvotes page says the service consistently adheres to Reddit’s guidelines. Reddit’s Disrupting Communities page lists voting services and multiple accounts used to manipulate votes as vote manipulation.',
  },
  {
    q: 'Does Reddix sell upvotes, accounts or comments?',
    a: 'No. Reddix finds threads, scores each post against your product and drafts replies. It never posts, comments, votes or messages, and uses no Reddit accounts. You post what you choose from your own account, under Reddit’s rules and each subreddit’s.',
  },
  {
    q: 'Does Reddix send alerts like Thread Finder?',
    a: `No. Reddix has no email, Slack or webhook alerts; you run a scan when you’re ready to reply, at most once every 5 minutes. If instant alerts matter most to you, Thread Finder is ahead there. Reddix is ${REDDIX_PRICE}.`,
  },
];

export const CLOSING = {
  title: 'Earn the reply, from your own account',
  body: 'Reddix shows you the threads worth answering and drafts what to say. The account, the history and the decision stay yours.',
  button: 'Start with Reddix',
};
