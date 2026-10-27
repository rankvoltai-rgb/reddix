/**
 * Every word on /features/lead-scoring. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Every rule here is in the code (see BRIEF.md, "Truth"). The leads in the
 * examples are fictional; Pipewell, the competitor, is made up.
 */

export const PATH = '/features/lead-scoring';

export const META = {
  query: 'reddit lead scoring',
  title: 'Reddit Lead Scoring: Rank, Triage and Track Leads | Reddix',
  description:
    'How Reddix ranks saved Reddit leads: two scores per lead, confidence and a second read, the order of the list, and the statuses a lead moves through.',
};

export const HERO = {
  pill: 'Feature · Lead scoring',
  h1: 'Reddit lead scoring that puts the next reply first',
  accent: 'the next reply first',
  answer:
    'Reddit lead scoring ranks the posts Reddix saved so the one most worth a reply sits at the top. Each lead carries the AI’s score, a final score with signal points added, and a confidence. The list is sorted by the final score, and you move each lead from new to engaged, replied, converted or archived.',
  cta: 'Score your first leads',
  secondary: 'Try the triage list',
  caption: 'Illustrative leads, in the order Reddix would list them.',
};

/** The hero's ranked stack. Only the AI's score is typed here: the final
 *  score, level and order are worked out by the scanner's own rules. */
export const HERO_ROWS = [
  { title: 'Spreadsheet or CRM for a freelance studio?', subreddit: 'r/freelance', ai: 36 },
  { title: 'Is a CRM overkill for a 4-person agency?', subreddit: 'r/agency', ai: 58 },
  { title: 'Looking for an alternative to Pipewell for a 3-person team', subreddit: 'r/smallbusiness', ai: 51 },
  { title: 'What do you use for follow-up reminders?', subreddit: 'r/Entrepreneur', ai: 44 },
  { title: 'Stuck with Pipewell’s reporting, thinking about switching', subreddit: 'r/sales', ai: 49 },
];

/** The competitor every example watches for. */
export const COMPETITORS = ['Pipewell'];

export const ANATOMY = {
  pill: 'Anatomy of a lead',
  title: 'What each mark on a lead means',
  body: 'A saved lead shows only what Reddix is sure of. Here is one fully analyzed lead, and what every mark on it tells you.',
  note: 'Illustrative lead.',
  marks: [
    { label: 'Hot', title: 'The level', body: 'Hot, Warm, Research or Low, set by the final score: the AI’s score plus the points for competitor, pricing and “alternative to” signals.' },
    { label: 'Score: 51', title: 'The AI’s own score', body: 'The number on the card is the AI’s read of the post against your product, before signal points. So a lead can say 51 and still be Hot.' },
    { label: 'Competitor', title: 'A competitor you listed', body: 'The post names one of the competitors in your profile. It’s the strongest signal there is, and it adds 25 points.' },
    { label: '~55% conf', title: 'Low confidence', body: 'Appears when the AI was less than 60% sure of its read. Treat the level as a hint and read the post yourself.' },
    { label: 'Reason', title: 'Why it scored that way', body: 'A one-line note from the AI on what the writer wants and how it relates to your product.' },
  ],
};

export const SECOND_READ = {
  pill: 'Analyze',
  title: 'Unsure leads get a second read',
  body: 'When the AI is at least 80% sure during a scan, the lead is marked analyzed and shows its level and reason. Below that, it’s saved as “Unanalyzed” so you don’t act on a guess.',
  before: {
    label: 'Before',
    points: ['Marked “Unanalyzed”', 'No level or reason shown', 'Still ranked by its scan score'],
  },
  steps: [
    'Reads the post with its top 5 comments',
    'Scores it again against your product profile',
    'Re-checks competitor, pricing and “alternative to” signals across the comments',
  ],
  after: {
    label: 'After',
    points: ['Level, score and reason shown', 'New final score, so it may move up or down the list', 'A confidence note if the AI is still under 60% sure'],
  },
  note: 'Analyze is part of Premium.',
};

export const TRIAGE = {
  pill: 'Triage',
  title: 'Work a list the way Reddix orders it',
  body: 'Six illustrative leads, run through the same rules as the app: sorted by final score, then the AI’s score; filtered by level; saved, dismissed or analyzed. Saved leads appear in your lead list, newest change first.',
  note: 'Illustrative leads and analysis results. The sorting, filters and status changes are the app’s own.',
  scannerLabel: 'Scanner · Discovered leads',
  crmLabel: 'Leads · Saved',
};

export const LIFECYCLE = {
  pill: 'Statuses',
  title: 'From new to converted, or archived',
  body: 'A lead’s status is how you keep track of it. Reddix sets the first two; the rest are yours.',
  steps: [
    { status: 'New', who: 'Set by a scan', body: 'Found and scored. It waits in the Scanner’s list, ranked against the others.' },
    { status: 'Engaged', who: 'When you save it or draft a reply', body: 'It moves into your lead list, where the most recently changed leads come first.' },
    { status: 'Replied', who: 'You', body: 'You posted a reply on Reddit, from your own account.' },
    { status: 'Converted', who: 'You', body: 'The conversation turned into a customer.' },
  ],
  archived: { status: 'Archived', who: 'When you dismiss it', body: 'Gone from the Scanner. It stays in your lead list under Archived until you delete it.' },
};

export const FAQ = [
  {
    q: 'How does Reddix score Reddit leads?',
    a: 'Each post gets an AI score from 0 to 100 against your product, then points for naming a competitor you listed, talking about price, or asking for an alternative. That final score sets the level and the lead’s place in the list. The intent detection page explains the scoring itself.',
  },
  {
    q: 'Why does a lead say “Unanalyzed”?',
    a: 'The AI was less than 80% sure of its read during the scan, so Reddix hides the level and reason rather than show a guess. Analyze runs a second read that includes the post’s top 5 comments; it’s part of Premium.',
  },
  {
    q: 'Why is the number on a lead different from its level?',
    a: 'The number on the card is the AI’s own score. The level and the order of the list use the final score, which adds the signal points. A lead showing 51 can be Hot because it named a competitor and asked for an alternative.',
  },
  {
    q: 'What happens when I save, dismiss or reply to a lead?',
    a: 'Saving it, or drafting a reply for it, marks it Engaged and adds it to your lead list. Dismissing marks it Archived: it leaves the Scanner but stays in your lead list until you delete it. Deleting removes it for good.',
  },
  {
    q: 'Can I sort and filter my leads?',
    a: 'In the Scanner, leads are sorted by final score, then by AI score, and you can filter by level; the list opens on Hot when there are hot leads. In your lead list, you can search by title, subreddit or author and filter by status and level.',
  },
];

export const NEXT = {
  title: 'Start with the lead at the top',
  body: 'Add your site and run a scan. Reddix scores what it finds and puts the best lead first.',
  button: 'Score your first leads',
  linksTitle: 'Related',
  links: [
    { to: '/features/intent-detection', title: 'Intent detection', body: 'How the 0–100 score is worked out.' },
    { to: '/features/ai-replies', title: 'AI replies', body: 'Drafting the reply to a lead.' },
    { to: '/features/analytics-dashboard', title: 'Dashboard', body: 'Your leads and drafts at a glance.' },
  ],
};
