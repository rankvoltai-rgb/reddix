/**
 * Every word on /alternatives/replyagent. ReplyAgent facts come only from
 * RESEARCH.md (checked 2026-10-27); Reddix facts only from ../reddix; Reddit's
 * rules from ../REDDIT-POLICY.md and the Reddit pages cited in RESEARCH.md.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/replyagent';
export const CHECKED = CHECKED_LABEL;

export const META = {
  query: 'replyagent alternative',
  title: 'ReplyAgent Alternative: ReplyAgent vs Reddix Compared | Reddix',
  description:
    'ReplyAgent drafts Reddit comments and can post them from its own accounts. Reddix only drafts. How the two compare on posting, price and rules, October 2026.',
};

export const HERO = {
  pill: 'Comparison · ReplyAgent',
  h1: 'ReplyAgent vs Reddix: who posts the comment?',
  accent: 'who posts the comment?',
  answer:
    'ReplyAgent finds Reddit threads and writes comments that mention your product. You can post them yourself, or pay ReplyAgent to post them from its own pool of aged Reddit accounts. Reddix also finds threads and drafts replies, but it never posts: every reply goes out from your own account, written or edited by you.',
  cta: 'Try Reddix free for 7 days',
};

export const LANES = {
  you: {
    title: 'You post, from your account',
    who: 'ReplyAgent in manual mode, and Reddix always',
    points: ['The tool finds threads and drafts a reply', 'You read it, edit it and post it yourself', 'Your account, your name, your call on each thread'],
  },
  them: {
    title: 'Their accounts post for you',
    who: 'ReplyAgent’s posting service only',
    points: ['Comments go out from its pool of aged accounts (100–10k karma)', '$4 a comment or $8 a post, from prepaid credits', 'An approval step, or an auto-posting option'],
  },
};

export const MODES = {
  pill: 'What you’d be buying',
  title: 'ReplyAgent is three products in one',
  items: [
    {
      name: 'Manual mode',
      price: 'No subscription',
      body: 'Find threads and write comments yourself, then post them free from your own Reddit account, or pay per comment for its posting service. This is the closest thing to how Reddix works, minus the AI.',
    },
    {
      name: 'The AI plan',
      price: '$79 a month, or $699 a year',
      body: 'Monitors your subreddits around the clock, according to its site, with priority on threads that rank on Google. It scores posts on upvotes, comment velocity and growth, rates relevance from 0 to 1, emails a daily list of opportunities and writes comments that mention your product. Up to 3 products per plan; a 3-day free trial.',
    },
    {
      name: 'The posting service',
      price: '$4 a comment, $8 a post',
      body: 'ReplyAgent publishes the content from accounts it provides and manages. If a moderator removes a comment before its 24-hour check (48 hours for posts), it refunds 70% of the price and keeps 30%, which it calls shared risk. You can approve each comment first or switch on auto-posting.',
    },
  ],
  reddix: `Reddix is one product: it scores posts 0–100 against your product, drafts three replies per thread, and stops there. ${REDDIX.posting}.`,
};

export const RULES = {
  pill: 'Before you use a posting service',
  title: 'Reddit’s rules, next to what the service says',
  vendor: {
    label: 'What ReplyAgent’s pages say',
    points: [
      'Its homepage says it provides and manages Reddit accounts for you.',
      'Its posting page describes a pool of aged accounts with 100 to 10,000 karma.',
      'Its sample comment, from an account named u/tech_enthusiast_42, recommends ReplyAgent; the sample shows no disclosure.',
      'Its homepage claims “100% Undetected” and “No account bans” without saying how these are measured.',
      'Its refund policy expects some comments to be removed, and refunds 70% when they are.',
    ],
  },
  reddit: {
    label: 'What Reddit’s rules say',
    points: [
      'The Reddit Rules ask people to participate authentically in communities where they have a personal interest, and not to mislead others.',
      'The User Agreement says users won’t license, sell or transfer their accounts without Reddit’s written approval.',
      'The spam policy covers repeated actions, automated or manual, for exposure or financial gain, and tools such as bots that may facilitate spam.',
      'Reddit lists using multiple seemingly unconnected accounts to influence an outcome as misleading behaviour.',
    ],
  },
  close: 'This isn’t a ruling on ReplyAgent; it’s what each side has published. If you use a tool that posts from someone else’s accounts, read Reddit’s rules first. With a draft-only tool, the account is yours and so is each decision to post. That doesn’t make any reply automatically fine: subreddit rules and Reddit’s spam policy still apply to what you write.',
};

export const BUDGET = {
  pill: 'Posting budget',
  title: 'What would a month of ReplyAgent cost?',
  body: 'Set how much you’d have it post and how many you expect to be removed. This applies its listed prices and 70% refund, and puts a year next to Reddix, where posting costs nothing extra because you do it.',
  rates: [
    { id: 'cards', label: '$4 / $8', note: 'The prices on its pricing cards', comment: 4, post: 8 },
    { id: 'faq', label: '$5 / $10', note: 'The amounts in its billing FAQ', comment: 5, post: 10 },
  ],
  plans: [
    { id: 'none', label: 'No AI plan', monthly: 0, yearly: 0 },
    { id: 'monthly', label: 'AI plan, monthly', monthly: 79, yearly: 79 * 12 },
    { id: 'annual', label: 'AI plan, yearly', monthly: 699 / 12, yearly: 699 },
  ],
  refund: 0.7,
  removalNote: 'ReplyAgent doesn’t publish a removal rate. Set your own guess; only removals found at its 24-hour (comments) or 48-hour (posts) check are refunded.',
} as const;

export const FIT = {
  pill: 'Where it fits better',
  title: 'When ReplyAgent is the better choice',
  points: [
    { title: 'You will not post yourself', body: 'If nobody on your team will post on Reddit, a done-for-you service does something a draft tool can’t. Weigh that against the rules above.' },
    { title: 'Google-ranked threads matter most', body: 'It prioritizes threads that already rank on Google, which can keep sending readers long after the thread goes quiet.' },
    { title: 'You want a daily email', body: 'It emails a daily list of opportunities. Reddix has no alerts; you open it and press Scan.' },
    { title: 'You track clicks', body: 'It offers UTM tracking and conversion attribution.' },
    { title: 'You run several products', body: 'One AI plan covers up to 3 products; 10 or more moves to a custom plan.' },
    { title: 'You want an API', body: 'Its REST API imports threads and approves comments for immediate or scheduled posting.' },
  ],
};

export const CONFLICTS = {
  title: 'Where its pricing page disagrees with itself',
  intro: 'We found these on ReplyAgent’s own pages in October 2026. Its pricing page lists both figures in each case; ask before you buy credits.',
  items: [
    'Credits: the pricing cards say $4 a comment and $8 a post; the billing FAQ says $5 and $10.',
    'Refund timing: elsewhere it checks at 24 hours (comments) and 48 hours (posts); the billing FAQ says removal “within 1 hour”.',
    'Refund amount for posts: one line says $7; the refund policy works out to $5.60.',
    'Typical spend: its posting page lists 30 comments at $90; its pricing page lists 30 comments at $120.',
  ],
};

export const FAQ = [
  {
    q: 'Does ReplyAgent post comments for you?',
    a: 'It can. Its optional posting service publishes comments ($4 each) and posts ($8 each) from accounts it provides and manages. In manual mode you post from your own account instead.',
  },
  {
    q: 'Does Reddix post anything on Reddit?',
    a: 'No. Reddix never posts, comments, votes or messages, and it never connects to your Reddit account. It finds and scores threads and drafts three replies for you to edit and post.',
  },
  {
    q: 'How much does ReplyAgent cost?',
    a: 'The AI plan is $79 a month or $699 a year, with a 3-day free trial. Posting is extra: $4 a comment and $8 a post on its pricing cards, though its billing FAQ lists $5 and $10. Manual mode has no subscription.',
  },
  {
    q: 'What happens if a posted comment is removed?',
    a: 'If a moderator removes it before ReplyAgent’s check (24 hours for comments, 48 for posts), it refunds 70% of the price. Content removed after the check isn’t refunded.',
  },
  {
    q: 'Is Reddix cheaper than ReplyAgent?',
    a: `Reddix is $${REDDIX.pricing.premium.price} a month after a 7-day trial, or $${REDDIX.pricing.lifetime.price} once, with no per-comment charges because you post yourself. ReplyAgent’s AI plan alone is $79 a month; manual mode without the AI is free.`,
  },
];

export const SOURCES = [
  { label: 'ReplyAgent homepage', url: 'https://www.replyagent.ai/' },
  { label: 'ReplyAgent pricing', url: 'https://www.replyagent.ai/pricing' },
  { label: 'ReplyAgent posting service', url: 'https://www.replyagent.ai/buy-reddit-comments' },
  { label: 'ReplyAgent API docs', url: 'https://www.replyagent.ai/docs' },
  { label: 'Reddit Rules', url: 'https://redditinc.com/policies/reddit-rules' },
  { label: 'Reddit User Agreement', url: 'https://redditinc.com/policies/user-agreement' },
  { label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
  { label: 'Reddit Help: Manipulated Content and Misleading Behavior', url: 'https://support.reddithelp.com/hc/en-us/articles/41180423371156-Manipulated-Content-and-Misleading-Behavior' },
];

export const CLOSING = {
  title: 'Keep every reply on your own account',
  body: 'Reddix finds the threads worth answering and drafts three replies. You choose one, make it yours and post it.',
  button: 'Start your 7-day trial',
};
