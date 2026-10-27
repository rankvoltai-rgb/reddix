/**
 * Every word on /features/scheduled-scans. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Reddix has no scheduled scans. This page says so and explains the
 * on-demand scan instead; every limit here comes from scan-reddit (BRIEF.md).
 */

export const PATH = '/features/scheduled-scans';

export const META = {
  query: 'scheduled reddit scans',
  title: 'Scheduled Reddit Scans? How Reddix Scans on Demand | Reddix',
  description:
    'Reddix doesn’t scan Reddit on a timer. You press Scan: see what one scan searches, how long it takes, the 5-minute rule, and why it works this way.',
};

export const HERO = {
  pill: 'Feature · Scanning',
  h1: 'Reddit scans that run when you’re ready to reply',
  /** The end of the H1, set in red. */
  accent: 'when you’re ready to reply',
  answer:
    'Reddix doesn’t scan Reddit on a schedule. You press Scan, and in under a minute it searches your subreddits, scores what it finds against your product, and saves the posts worth answering. You can scan again after 5 minutes.',
  cta: 'Start scanning Reddit',
  timeline: {
    scan: 'Scan · up to 50 s',
    rest: 'Rest · 5 min from the press',
    press: 'You press Scan',
    next: 'Next scan',
  },
};

export const ANSWER = {
  pill: 'The short answer',
  title: 'No timer, on purpose',
  does: {
    label: 'Reddix does',
    items: [
      'Scan when you press Scan, from the Scanner page',
      'Search a new slice of your subreddits each time',
      'Save the posts worth answering to your lead list',
      'Draft a reply when you ask for one',
    ],
  },
  doesnt: {
    label: 'Reddix doesn’t',
    items: [
      'Scan on a timer, overnight or in the background',
      'Offer a scan frequency setting',
      'Send you leads you didn’t scan for',
      'Post anything to Reddit for you',
    ],
  },
  why: {
    title: 'Why scanning on demand fits Reddit',
    paragraphs: [
      'A Reddit thread is worth answering while its author is still reading replies. A lead that sits in a list for hours waits behind everyone who answered first.',
      'When you start the scan, you’re there when the results land. You read the post, open a draft, edit it and reply from your own account while the thread is still moving.',
    ],
  },
};

export const ANATOMY = {
  pill: 'Inside one scan',
  title: 'What one press of Scan does',
  body: 'The same steps run on every scan, in this order. The right-hand column is the limit the scanner enforces at each step.',
  rows: [
    {
      title: 'Checks it can run',
      body: 'Your plan is active, you have at least one subreddit switched on, and 5 minutes have passed since your last scan. If not, the scan is refused and nothing is searched.',
      limit: '1 scan per 5 min',
    },
    {
      title: 'Picks this scan’s slice',
      body: 'The order of your subreddits, the buyer phrases and the time range (past day, week or month) all rotate every 5 minutes, so no two scans search exactly the same way.',
      limit: '3 subreddits per scan',
    },
    {
      title: 'Searches Reddit',
      body: 'The latest posts in two of your subreddits, your buyer phrases in three of them, and, if you’ve listed competitors, posts asking for an alternative to them. Only links to Reddit posts are kept.',
      limit: 'Up to 7 searches · 15 results each',
    },
    {
      title: 'Drops what you’ve seen',
      body: 'Repeats inside the scan, posts already looked at in the past 7 days, posts too short to judge and obvious promotion are set aside before any AI runs.',
      limit: '7-day memory',
      link: { to: '/features/deduplication', label: 'How deduplication works' },
    },
    {
      title: 'Scores against your product',
      body: 'The AI reads the posts that are left next to your product profile and scores each one from 0 to 100, ten at a time.',
      limit: 'Up to 30 posts',
      link: { to: '/features/intent-detection', label: 'How posts are scored' },
    },
    {
      title: 'Saves the ones worth answering',
      body: 'Posts that finish at 35 or above go to your lead list, best first, and the Scanner tells you how many leads it saved and how many posts it scored.',
      limit: 'Up to 25 leads',
    },
  ],
  footnote:
    'A scan stops at 50 seconds. If it gets there, it keeps the leads it has already found. The buyer phrases are written from your product profile, kept for 24 hours, and rewritten as soon as you edit your product details.',
};

export const PLANNER = {
  pill: 'Plan a few scans',
  title: 'See what each press would search',
  body: 'This runs the scanner’s rotation and its 5-minute rule in your browser. Press Scan, move the clock, press again, and watch which subreddits and phrases each scan reaches.',
  note: 'Illustrative setup. In Reddix, the subreddits are the ones you switch on, and the AI writes the buyer phrases from your product profile.',
  defaults: {
    subreddits: ['smallbusiness', 'SaaS', 'startups', 'Entrepreneur', 'sales', 'freelance', 'agency'],
    phrases: [
      'tracking deals in spreadsheets',
      'simple crm for small team',
      'follow up reminders for clients',
      'too many tools for sales',
      'losing track of leads',
      'cheap pipeline tool',
    ],
    competitors: 'Pipewell, Tallyfold',
  },
};

export const FAQ = [
  {
    q: 'Can Reddix scan Reddit on a schedule?',
    a: 'No. Reddix scans when you press Scan on the Scanner page. There’s no timer, frequency setting or background scanning, so every lead you see came from a scan you started.',
  },
  {
    q: 'How often can I scan?',
    a: 'Once every 5 minutes. A scan started sooner is refused before it searches anything. Each scan you’re allowed to run falls in a new 5-minute rotation, so it searches a different mix of subreddits, phrases and time ranges.',
  },
  {
    q: 'How long does a scan take?',
    a: 'Under a minute. The scanner stops at 50 seconds, and if it reaches that limit it keeps the leads it has already found rather than throwing the scan away.',
  },
  {
    q: 'Why didn’t one scan cover all my subreddits?',
    a: 'Each scan searches 3 of your active subreddits, picked by a rotation that changes every 5 minutes. With more than 3 switched on, it takes scans at different times to reach them all, and the rotation doesn’t share them out evenly: some come up far more often than others.',
  },
  {
    q: 'Will scanning again show me the same posts?',
    a: 'Not within 7 days. Reddix remembers every post it has looked at for a week and skips it on later scans, so a new scan only spends time on posts you haven’t seen.',
  },
];

export const CLOSE = {
  title: 'Press Scan when you have ten minutes to reply',
  body: 'Add your site. Reddix builds your product profile and picks subreddits, and your first scan is one press away.',
  button: 'Start scanning Reddit',
  links: [
    { to: '/features/deduplication', title: 'Deduplication' },
    { to: '/features/intent-detection', title: 'Intent detection' },
    { to: '/features/subreddit-discovery', title: 'Subreddit discovery' },
  ],
};
