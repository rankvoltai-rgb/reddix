/**
 * Every word on /features/deduplication. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Every rule here comes from scan-reddit and the seen_posts table (BRIEF.md).
 * Pipewell and the replay's posts are fictional.
 */

export const PATH = '/features/deduplication';

export const META = {
  query: 'reddit lead deduplication',
  title: 'Reddit Lead Deduplication: Why Posts Don’t Repeat | Reddix',
  description:
    'How Reddix keeps the same Reddit post out of your leads: one read per scan, a 7-day memory across scans, and the cases where a repeat can still appear.',
};

export const HERO = {
  pill: 'Feature · Deduplication',
  h1: 'Every Reddit post gets one look a week',
  /** The end of the H1, set in red. */
  accent: 'one look a week',
  answer:
    'Reddix remembers every Reddit post it looks at for 7 days. A post that turns up in several searches is read once, and a post it has already saved, scored or skipped doesn’t come back on your later scans that week, so each scan spends its time on posts that are new to you.',
  cta: 'Find new buyers on Reddit',
  merge: {
    post: 'Anything simpler than Pipewell for a 3-person team?',
    subreddit: 'r/smallbusiness',
    sources: ['Latest posts', 'Phrase search', 'Competitor search'],
    stamp: 'Read once · remembered for 7 days',
    note: 'Illustrative post.',
  },
};

export const LAYERS = {
  pill: 'How it works',
  title: 'Three places a repeat gets caught',
  body: 'All three run before any AI reads a post, so a repeat costs nothing and never reaches your lead list.',
  items: [
    {
      title: 'Inside a scan',
      body: 'A scan runs up to 7 searches, and the same thread often turns up in two or three of them. Reddix keeps one copy of each link and drops the rest.',
      tag: 'Same scan',
    },
    {
      title: 'Across scans',
      body: 'Before anything else, every link is checked against the posts you’ve looked at in the past 7 days. A match is skipped, whether that post was saved, scored low or set aside, and it doesn’t reset its clock.',
      tag: '7 days',
    },
    {
      title: 'Promotion is remembered too',
      body: 'Launch posts, giveaways and other promotion caught by the first-pass rules are remembered with a score of 0, so the next scans that week don’t spend time on them again.',
      tag: 'Score 0',
    },
  ],
};

export const REPLAY = {
  pill: 'Replay two weeks',
  title: 'Turn scans on and off, watch the memory work',
  body: 'Each column is a day. Pick the days you scan, and every cell is worked out by the scanner’s own rules: 7 days of memory, short posts checked again, promotion remembered, 35 and up saved.',
  note: 'Illustrative posts and scores. Real scores come from the AI reading each post against your product.',
  days: 14,
  competitors: ['Pipewell'],
  defaultScans: [1, 2, 5, 9, 10],
  presets: [
    { label: 'Every day', days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    { label: 'Weekdays', days: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12] },
    { label: 'Twice a week', days: [1, 4, 8, 11] },
  ],
  posts: [
    {
      id: 'a',
      title: 'Anything simpler than Pipewell for a 3-person team?',
      body: 'We pay for seats we never use. Need contacts, notes and reminders, that’s it.',
      score: 78,
      day: 1,
      copies: 3,
    },
    {
      id: 'b',
      title: 'How do you keep track of client follow-ups?',
      body: 'I keep forgetting to follow up after calls and it’s costing me work. What do you use?',
      score: 44,
      day: 2,
      copies: 1,
    },
    {
      id: 'c',
      title: 'Our CRM migration is finally done',
      body: 'Three months, two spreadsheets and one very long weekend later, here’s what we learned.',
      score: 12,
      day: 1,
      copies: 1,
    },
    {
      id: 'd',
      title: 'I built a tiny CRM for freelancers',
      body: 'Check out my landing page and tell me what you think, launching this week!',
      score: 0,
      day: 3,
      copies: 2,
    },
    {
      id: 'e',
      title: 'CRM?',
      body: 'Which one?',
      score: 0,
      day: 2,
      copies: 1,
    },
    {
      id: 'f',
      title: 'Moving off spreadsheets, budget is about $20 a month',
      body: 'Five of us share one sheet for every deal and it breaks weekly. Recommendations welcome.',
      score: 66,
      day: 6,
      copies: 2,
    },
  ],
};

export const LEDGER = {
  pill: 'The rules',
  title: 'What’s remembered, and what’s checked again',
  remembered: {
    label: 'Remembered for 7 days',
    items: [
      'Posts saved to your leads',
      'Posts scored under 35',
      'Promotion skipped by the first-pass rules, at a score of 0',
      'Posts that scored 35 or more but fell outside a scan’s top 25',
    ],
  },
  again: {
    label: 'Checked again next scan',
    items: [
      'Posts too short to judge (under 40 characters)',
      'Posts past the 30 the AI can score in one scan',
      'Posts the AI didn’t return a score for',
    ],
  },
  footnote:
    'The 7 days run from the last time a post was read, scored or set aside. Skipping a remembered post doesn’t restart its clock.',
};

export const LIMITS = {
  pill: 'Limits',
  title: 'Where a repeat can still get through',
  items: [
    {
      title: 'After 7 days',
      body: 'Once the week is up, a post can be found and scored again. If it still scores 35 or more, it’s saved a second time, so an older lead can reappear in your list.',
    },
    {
      title: 'A different link to the same post',
      body: 'Memory matches posts by their link. If a search returns the same thread under a different form of its address, it’s treated as new.',
    },
    {
      title: 'Memory is per account',
      body: 'Each account keeps its own memory. Two teammates on separate accounts can each be shown the same thread.',
    },
  ],
};

export const FAQ = [
  {
    q: 'Will Reddix show me the same Reddit post twice?',
    a: 'Not within 7 days. Every post a scan reads, saves or sets aside is remembered for a week, and later scans skip it before any AI runs. After the week is up, a post can be scored again, and if it still qualifies it can be saved a second time.',
  },
  {
    q: 'How long does Reddix remember a post?',
    a: 'Seven days from the last time a scan read, scored or set it aside. Skipping a remembered post on a later scan doesn’t restart the clock.',
  },
  {
    q: 'Does deduplication drop posts I’d want to see?',
    a: 'It only skips posts you’ve already been through. One case to know: if a single scan finds more than 25 posts worth saving, it keeps the top 25, and the rest are remembered without being saved, so they won’t come back that week.',
  },
  {
    q: 'What happens when the same post shows up in several searches?',
    a: 'A scan runs up to 7 searches, and a busy thread can appear in more than one of them. Reddix keeps one copy of each link, so the post is read and scored once.',
  },
  {
    q: 'Do short or deleted posts count?',
    a: 'Posts with under 40 characters of text are skipped as too short to judge, and they aren’t remembered, so a later scan looks at them again. Posts Reddit search no longer returns simply don’t appear.',
  },
];

export const CLOSE = {
  title: 'Spend your scans on posts you haven’t seen',
  body: 'Add your site and run your first scan. Every one after it skips what you’ve already been through.',
  button: 'Find new buyers on Reddit',
  links: [
    { to: '/features/scheduled-scans', title: 'How a scan works', body: 'What one press of Scan searches.' },
    { to: '/features/intent-detection', title: 'Intent detection', body: 'How each new post is scored.' },
    { to: '/features/lead-scoring', title: 'Lead scoring', body: 'How saved leads are ranked.' },
  ],
};
