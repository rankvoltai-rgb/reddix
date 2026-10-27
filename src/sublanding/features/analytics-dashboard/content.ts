/**
 * Every word on /features/analytics-dashboard. Pure data: the page renders it
 * and crawler.ts turns it into the HTML crawlers read.
 *
 * The page describes the dashboard as it is (see BRIEF.md, "Truth"): four
 * counts, the last scan, the five newest leads and achievement badges. Leads
 * in the examples are fictional.
 */

export const PATH = '/features/analytics-dashboard';

export const META = {
  query: 'reddit lead dashboard',
  title: 'Reddit Lead Dashboard: Your Leads at a Glance | Reddix',
  description:
    'What the Reddix dashboard shows: lead, hot lead, reply draft and subreddit counts, your last scan, your five newest leads, and what each number counts.',
};

export const HERO = {
  pill: 'Feature · Dashboard',
  h1: 'A Reddit lead dashboard that answers “what now?”',
  accent: '“what now?”',
  answer:
    'The Reddix dashboard is the first screen after you sign in. It shows four counts (your leads, hot leads, reply drafts and the subreddits you monitor), when you last ran a scan, your five newest leads and your achievement badges. It’s a status board for picking the next step, not a reporting tool.',
  cta: 'Open your dashboard',
  secondary: 'Try the sandbox',
  caption: 'Illustrative account.',
};

/** The hero's account, and the sandbox's starting point. */
export const SAMPLE_NAME = 'Sam';

export const COUNTS = {
  pill: 'The numbers',
  title: 'What each number on the dashboard counts',
  body: 'Each figure is a plain count from your account, read when you open the dashboard. Here is exactly what goes into each.',
  rows: [
    {
      name: 'Leads',
      counts: 'Every lead a scan has saved for you.',
      includes: 'New, saved, replied, converted and archived leads.',
      excludes: 'Leads you deleted.',
    },
    {
      name: 'Hot',
      counts: 'Leads whose final score is 70 or more.',
      includes: 'Hot leads in any status, archived ones too.',
      excludes: 'Warm, Research and Low leads.',
    },
    {
      name: 'Replies ready',
      counts: 'Reply drafts Reddix has written for your leads.',
      includes: 'One per draft you generate, regenerated drafts included.',
      excludes: 'Replies you write yourself, outside Reddix.',
    },
    {
      name: 'Subreddits',
      counts: 'Subreddits your scans cover.',
      includes: 'Every subreddit you’ve added in the Scanner or during setup.',
      excludes: 'Subreddits you’ve removed.',
    },
    {
      name: 'Last scan',
      counts: 'How long ago your last scan ran.',
      includes: 'A green dot when it was within the last hour.',
      excludes: 'Nothing runs in the background: it’s the last scan you started.',
    },
    {
      name: 'Recent leads',
      counts: 'Your five newest leads, newest first.',
      includes: 'Each one’s subreddit, age and level, with a link to the thread.',
      excludes: 'Older leads, which are in your lead list.',
    },
  ],
};

export const STATES = {
  pill: 'Next step',
  title: 'The dashboard changes with where you are',
  body: 'Until there’s something to show, the main panel tells you the one thing to do next.',
  states: [
    { when: 'No subreddits yet', title: 'No subreddits configured', body: 'Set up your first subreddit and keywords to start discovering leads.', action: 'Configure scanner' },
    { when: 'Subreddits, no leads yet', title: 'Ready to find leads', body: 'You have 4 subreddits configured. Run a scan to discover potential buyers.', action: 'Run first scan' },
    { when: 'Leads found', title: 'Recent leads', body: 'Your five newest leads, each a link to its thread on Reddit.', action: 'View all' },
  ],
};

export const SANDBOX = {
  pill: 'Sandbox',
  title: 'Run an account and watch the numbers move',
  body: 'Start from an empty account. Add subreddits, run scans, save leads and draft replies, and the dashboard on the right updates with the same rules as the real one, including the 5-minute wait between scans.',
  note: 'Illustrative leads. The counts, states, scan wait and badge rules are the app’s own.',
};

export const BADGES = {
  pill: 'Achievements',
  title: 'Five badges for working your leads',
  body: 'Badges count the leads that are Engaged right now: ones you’ve saved or drafted a reply for. A badge shows as unlocked while you have at least its number, so moving a lead on to Replied takes it out of the count.',
  list: [
    { threshold: 1, name: 'First Contact' },
    { threshold: 10, name: 'Lead Hunter' },
    { threshold: 25, name: 'Rising Star' },
    { threshold: 50, name: 'Power Player' },
    { threshold: 100, name: 'Lead Legend' },
  ],
};

export const NOT_HERE = {
  pill: 'Limits',
  title: 'What the dashboard doesn’t show',
  items: [
    { title: 'Charts or trends over time', body: 'There are no graphs, date ranges or week-on-week comparisons. The lead list, sorted by last change, is the history.' },
    { title: 'Results after you reply', body: 'Reddix never posts for you, so it can’t see clicks, upvotes or replies to your comment. Mark a lead Replied or Converted to keep track.' },
    { title: 'Per-subreddit numbers', body: 'The dashboard totals your account. To see one subreddit’s leads, search for it in your lead list.' },
    { title: 'Exports', body: 'There’s no download or report. Each lead links to its Reddit thread.' },
    { title: 'Live updates', body: 'Counts are read when you open the dashboard, and scans run only when you start one from the Scanner.' },
  ],
};

export const FAQ = [
  {
    q: 'What does the Reddix dashboard show?',
    a: 'Four counts (leads, hot leads, reply drafts and the subreddits you monitor), how long ago your last scan ran, your five newest leads with their levels, and achievement badges. Until you have leads, it shows the next setup step instead.',
  },
  {
    q: 'Does the lead count include archived leads?',
    a: 'Yes. Leads counts every lead a scan has saved for you, in any status, and Hot counts every hot lead the same way. Only deleting a lead removes it from the counts.',
  },
  {
    q: 'What does “Replies ready” count?',
    a: 'The reply drafts Reddix has written for your leads. Each time you generate or regenerate a draft, it adds one. Reddix never posts them for you; you post from your own Reddit account.',
  },
  {
    q: 'Why hasn’t my dashboard changed since yesterday?',
    a: 'Reddix scans when you start a scan, not on a schedule, so new leads only appear after you run one from the Scanner. The “Last scan” label shows when that was.',
  },
  {
    q: 'Can I see charts, trends or export my data?',
    a: 'Not today. The dashboard is a status board, and the lead list is where you search, filter by status and level, and update each lead.',
  },
];

export const NEXT = {
  title: 'See where your Reddit leads stand',
  body: 'Add your site, pick subreddits and run your first scan. The dashboard fills in from there.',
  button: 'Open your dashboard',
  links: [
    { to: '/features/lead-scoring', title: 'Lead scoring', body: 'How leads are ranked and worked.' },
    { to: '/features/intent-detection', title: 'Intent detection', body: 'What makes a lead Hot.' },
    { to: '/features/ai-replies', title: 'AI replies', body: 'Where reply drafts come from.' },
  ],
};
