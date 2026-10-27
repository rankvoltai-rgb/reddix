/**
 * Every word on /alternatives/redditor-ai. Competitor facts come from
 * RESEARCH.md (checked 2026-10-27), Reddit's rules from ../REDDIT-POLICY.md,
 * Reddix's facts from ../reddix. Quotes stay under 15 words.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/redditor-ai';

const { premium, lifetime } = REDDIX.pricing;
const REDDIX_PRICE = `$${premium.price} a month with a ${premium.trial}, or $${lifetime.price} one-time`;

export const META = {
  query: 'redditor ai alternative',
  title: 'Redditor AI vs Reddix: Who Posts Your Reddit Comments? | Reddix',
  description:
    'Redditor AI posts comments for you from its own accounts. Reddix drafts replies you post yourself. Models, prices and Reddit’s rules, checked October 2026.',
};

export const HERO = {
  pill: 'Alternative · Redditor AI',
  h1: 'Redditor AI vs Reddix: who posts your comments?',
  accent: 'who posts your comments?',
  answer:
    'Redditor AI is a done-for-you service: it finds Reddit threads where your product fits and posts comments about it from its own pool of accounts. Reddix finds the threads and drafts replies, and you post them from your own account. The real difference is who holds the pen, and whose account carries the history.',
  cta: 'Find threads with Reddix',
  checked: `Checked ${CHECKED_LABEL}`,
};

/** Source ids, numbered in the order of SOURCES. */
export type SourceId = 'home' | 'blog' | 'rules' | 'spam' | 'disrupt' | 'flagged';

export const SOURCES: { id: SourceId; label: string; url: string }[] = [
  { id: 'home', label: 'Redditor AI homepage, pricing and FAQ', url: 'https://www.redditor.ai/' },
  { id: 'blog', label: 'Redditor AI blog', url: 'https://www.redditor.ai/blog' },
  { id: 'rules', label: 'Reddit Rules', url: 'https://redditinc.com/policies/reddit-rules' },
  { id: 'spam', label: 'Reddit Help: Spam', url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam' },
  { id: 'disrupt', label: 'Reddit Help: Disrupting Communities', url: 'https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities' },
  {
    id: 'flagged',
    label: 'Reddit Help: My account was flagged for spam or inauthentic activity',
    url: 'https://support.reddithelp.com/hc/en-us/articles/360045309012-My-account-was-flagged-for-spam-or-inauthentic-activity',
  },
];

export const GLANCE = {
  title: 'The two, side by side',
  rows: [
    {
      label: 'What you buy',
      them: 'A done-for-you service: the vendor finds threads, writes comments and posts them',
      us: 'Software: Reddix finds threads and drafts replies; you post',
      src: 'home',
    },
    {
      label: 'Who posts',
      them: 'Its own pool of managed, warmed-up accounts; never your personal account',
      us: 'You, from your own account. Reddix uses no Reddit accounts',
      src: 'home',
    },
    { label: 'Price', them: '$39 a month, one plan', us: REDDIX_PRICE, src: 'home' },
    {
      label: 'Trial',
      them: 'None. The pricing card says 100% money-back; the FAQ says 48 hours',
      us: 'The monthly plan has a 7-day free trial; there’s no free plan',
      src: 'home',
    },
    {
      label: 'What the plan covers',
      them: '24/7 monitoring of 5 subreddits, 30 posted comments and 300 reply suggestions a month',
      us: 'The subreddits you choose, searched when you press Scan, at most once every 5 minutes',
      src: 'home',
    },
    {
      label: 'Votes and visibility',
      them: 'Its FAQ lists engagement pods and upvote boosts as extras',
      us: 'None. Reddix never votes, comments or messages',
      src: 'home',
    },
    {
      label: 'Can you buy it today?',
      them: 'Every buy button led to a waitlist form when we checked',
      us: 'Yes, from the sign-up page',
      src: 'home',
    },
  ],
} as const;

export const STRENGTHS = {
  title: 'What Redditor AI saves you',
  body: 'It’s worth being clear about what a done-for-you model offers, because for some teams it’s the whole point.',
  items: [
    {
      title: 'Your time',
      body: 'You give it a URL and the vendor does the rest: finding threads, writing comments and posting them. With Reddix you still read, edit and post every reply yourself.',
    },
    {
      title: 'Needing an account',
      body: 'You don’t need a Reddit account with karma and history. Its comments go out from the vendor’s accounts.',
    },
    {
      title: 'Speed, by its own account',
      body: 'Its FAQ says relevant threads are found within 5 minutes and first comments go live within a few hours. We haven’t tested that.',
    },
    {
      title: 'Price of entry',
      body: `$39 a month buys 30 posted comments. Reddix’s monthly plan is $${premium.price}, and it posts nothing.`,
    },
  ],
};

export type Actor = 'vendor' | 'reddix' | 'you' | 'none' | 'unstated';

export const ACTOR_LABEL: Record<Actor, string> = {
  vendor: 'The vendor',
  reddix: 'Reddix',
  you: 'You',
  none: 'Nobody',
  unstated: 'Not stated',
};

export const WALK = {
  pill: 'Follow one comment',
  title: 'Seven steps from your website to a reply on Reddit',
  body: 'Pick a step to see who does it with each tool. The tally counts the steps you do yourself, and the steps the vendor does for you.',
  steps: [
    {
      title: 'Read your website',
      them: { who: 'vendor', text: 'Analyzes your site for your product, ideal customer and value proposition.' },
      us: { who: 'reddix', text: 'Reads your URL and builds a product profile. You can adjust the description and audience in Settings.' },
    },
    {
      title: 'Find the thread',
      them: { who: 'vendor', text: 'Monitors the 5 subreddits on its plan and picks threads where your product fits.' },
      us: { who: 'reddix', text: 'Searches the subreddits you chose when you press Scan, and scores every post 0–100 against your product.' },
    },
    {
      title: 'Write the comment',
      them: { who: 'vendor', text: 'AI writes a comment that names your brand, usually without a link.' },
      us: { who: 'reddix', text: 'Drafts three replies: Direct, Story and Expert. Each ends with your link; delete it where a subreddit bans links.' },
    },
    {
      title: 'Approve it',
      them: { who: 'unstated', text: 'A review step before comments go out isn’t mentioned on its site.' },
      us: { who: 'you', text: 'You read each draft and change whatever you like. Nothing leaves Reddix on its own.' },
    },
    {
      title: 'Post it',
      them: { who: 'vendor', text: 'Posted automatically from one of the vendor’s managed accounts.' },
      us: { who: 'you', text: 'You paste it into the thread from your own account.' },
    },
    {
      title: 'Push it up',
      them: { who: 'vendor', text: 'Its FAQ offers engagement pods and upvote boosts as extras.' },
      us: { who: 'none', text: 'Nothing. Reddix doesn’t vote or ask anyone to.' },
    },
    {
      title: 'Keep the history',
      them: { who: 'vendor', text: 'Replies, karma and reputation build up on accounts the vendor controls.' },
      us: { who: 'you', text: 'They build up on your account, under your username.' },
    },
  ],
} as const;

export const WORDS = {
  pill: 'In its own words',
  title: 'What Redditor AI says, beside what Reddit says',
  body: 'Reddit decides how its rules apply to any account. Below are Redditor AI’s own words about how it works, each next to the part of Reddit’s rules that covers the same ground. Read both and judge for yourself.',
  pairs: [
    {
      topic: 'Whose accounts',
      them: { quote: 'its own pool of AI agents & warmed-up accounts', where: 'Redditor AI FAQ', src: 'home' },
      reddit: { quote: 'participate authentically in communities where you have a personal interest', where: 'Reddit Rules, Rule 2', src: 'rules' },
    },
    {
      topic: 'Votes',
      them: { quote: 'engagement pods, upvote boosts, and other features', where: 'Redditor AI FAQ', src: 'home' },
      reddit: {
        quote: 'Do not manipulate votes, evade enforcement, or otherwise disrupt Reddit communities.',
        where: 'Reddit Help, Disrupting Communities',
        src: 'disrupt',
        note: 'The page lists voting services, and coordinated voting by groups of people or bots, as vote manipulation.',
      },
    },
    {
      topic: 'Detection',
      them: { quote: 'smart rotation to avoid detection', where: 'Redditor AI FAQ', src: 'home' },
      reddit: {
        quote: 'repeated or unsolicited actions (whether automated or manual)',
        where: 'Reddit Help, Spam',
        src: 'spam',
        note: 'Its examples include a bot that keeps promoting products across communities.',
      },
    },
    {
      topic: 'Links',
      them: { quote: 'to stay under Reddit’s radar', where: 'Redditor AI FAQ, on leaving links out', src: 'home' },
      reddit: {
        where: 'Reddit Help, flagged accounts',
        src: 'flagged',
        note: 'Reddit can flag an account for spam or inauthentic activity, after which its posts and comments stop showing as expected. There’s an appeal form.',
      },
    },
  ],
} as const;

export const INSTEAD = {
  pill: 'With Reddix',
  title: 'What you get, and what you give up',
  items: [
    { title: 'You do the posting', body: `${REDDIX.posting}. Every reply goes out under your name, when you decide.` },
    {
      title: 'Scans when you ask',
      body: 'Reddix doesn’t watch Reddit in the background. You press Scan, at most once every 5 minutes, and it searches the subreddits you chose. Redditor AI advertises round-the-clock monitoring of five.',
    },
    { title: 'A score before you spend time', body: `${REDDIX.scoring}. You start with the posts most likely to want your product.` },
    {
      title: 'Drafts, not finished comments',
      body: `${REDDIX.replies}. Drafts end with your link. Reddit’s rules and each subreddit’s rules apply to whatever you post; Reddix doesn’t make a reply acceptable.`,
    },
    { title: 'What it costs', body: `${REDDIX_PRICE}. There’s no free plan, and no plan that posts for you.` },
  ],
};

export const FIT = {
  title: 'Which one fits',
  them: {
    name: 'Redditor AI may suit you if',
    items: [
      'You want comments placed without spending your own time on Reddit.',
      'You don’t have a Reddit account, or don’t want to use yours.',
      'You’re comfortable with your brand being recommended from accounts you don’t control.',
      'Five subreddits and 30 comments a month cover what you need.',
    ],
  },
  us: {
    name: 'Reddix may suit you if',
    items: [
      'You want to be the one talking, under your own name.',
      'You’d rather build history and karma on an account you own.',
      'You want to read every reply before anything goes out.',
      'You can spend a few minutes a day reading threads and posting.',
    ],
  },
};

export const FAQ = [
  {
    q: 'Does Redditor AI post from my Reddit account?',
    a: 'No. Its FAQ says it won’t post from your personal account and uses its own pool of managed, warmed-up accounts instead. Reddix doesn’t post at all: it drafts replies, and you post them from your own account.',
  },
  {
    q: 'Can I sign up for Redditor AI right now?',
    a: 'When we checked in October 2026, the pricing card and every “Get Started” button led to a waitlist form rather than a checkout, so availability was unclear. Its blog was still publishing that month, and its site lists one plan at $39 a month.',
  },
  {
    q: 'Is there a free trial of either?',
    a: `Redditor AI’s FAQ says it doesn’t offer one because of its running costs, and mentions a 48-hour money-back guarantee; its pricing card says 100% money-back. Reddix’s monthly plan has a 7-day free trial, then costs $${premium.price} a month. There’s no free plan.`,
  },
  {
    q: 'Does Reddix monitor Reddit around the clock?',
    a: 'No. Reddix scans when you press Scan, at most once every 5 minutes, and sends no email or Slack alerts. Redditor AI advertises 24/7 monitoring of the five subreddits on its plan.',
  },
  {
    q: 'Does using Reddix keep me within Reddit’s rules?',
    a: 'That depends on what you post, not on the tool. Reddix never posts, votes or messages and uses no Reddit accounts, but every reply you post is yours under Reddit’s rules and each subreddit’s rules on self-promotion and links. Drafts end with your link, so remove it where links aren’t welcome.',
  },
];

export const CLOSING = {
  title: 'Find the threads. Say it yourself.',
  body: 'Add your site, pick your subreddits and run a scan. Reddix ranks what it finds and drafts replies for you to post.',
  button: 'Start with Reddix',
};
