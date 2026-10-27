/**
 * Every word on /features/subreddit-discovery. Pure data: the page renders it
 * and crawler.ts turns it into the HTML crawlers read.
 *
 * Facts come from discover-subreddits, the onboarding wizard, the Scanner page
 * and scan-reddit (see BRIEF.md, "Truth"). Tallyfold and Billcraft are
 * fictional; the subreddits are real communities used as examples.
 */

export const PATH = '/features/subreddit-discovery';

export const META = {
  query: 'find subreddits for your product',
  title: 'Subreddit Discovery: Find Where Your Buyers Post | Reddix',
  description:
    'How Reddix suggests subreddits from your product profile, how you shape the list, and which of them each scan actually searches. With a planner you can try.',
};

export const HERO = {
  pill: 'Feature · Subreddit discovery',
  h1: 'Subreddit discovery that finds where your buyers ask for help',
  accent: 'where your buyers ask for help',
  answer:
    'Subreddit discovery suggests the Reddit communities where people who need your product are most likely to post. Reddix reads your product profile, suggests ten subreddits with a reason for each, and you decide which ones the scanner searches.',
  cta: 'Find my subreddits',
  secondary: 'Plan a scan',
};

export type Tier = 'primary' | 'secondary' | 'niche';
export type Activity = 'high' | 'medium' | 'low';

/** The hero's example: suggestions for a fictional invoicing tool. */
export const EXAMPLE = {
  product: 'Tallyfold, invoicing for freelance designers',
  note: 'Illustrative: 7 of the 10 suggestions for Tallyfold, a fictional invoicing tool.',
  tiers: [
    { id: 'primary', name: 'Primary', body: 'Where the buyer is the whole audience.' },
    { id: 'secondary', name: 'Secondary', body: 'Broad communities where they show up often.' },
    { id: 'niche', name: 'Niche', body: 'Small, specific, sometimes the best threads.' },
  ] as { id: Tier; name: string; body: string }[],
  suggestions: [
    { name: 'freelance', tier: 'primary', score: 94, activity: 'high', reason: 'Freelancers ask how to invoice and chase late payments here every week.' },
    { name: 'graphic_design', tier: 'primary', score: 86, activity: 'high', reason: 'Working designers talk about clients, rates and getting paid.' },
    { name: 'smallbusiness', tier: 'secondary', score: 74, activity: 'high', reason: 'Owners compare invoicing and accounting tools.' },
    { name: 'Entrepreneur', tier: 'secondary', score: 63, activity: 'high', reason: 'Solo founders ask which tools to start with.' },
    { name: 'web_design', tier: 'niche', score: 61, activity: 'medium', reason: 'Freelance web designers share their client and billing setups.' },
    { name: 'Bookkeeping', tier: 'niche', score: 57, activity: 'medium', reason: 'Questions about tracking what clients owe.' },
    { name: 'sidehustle', tier: 'niche', score: 52, activity: 'medium', reason: 'People billing their first clients ask what to use.' },
  ] as { name: string; tier: Tier; score: number; activity: Activity; reason: string }[],
};

export const ANATOMY = {
  pill: 'Anatomy of a suggestion',
  title: 'Every suggestion comes with its reasons',
  body: 'Discovery reads your product profile and suggests the ten best subreddits it can find for it. Communities you already monitor are left out, so running it again only brings up new ones.',
  readsTitle: 'What it reads',
  reads: ['Product name', 'Description', 'Target audience', 'Value proposition', 'Key features', 'Competitors', 'Pricing model'],
  readsNote: 'All from the profile that website analysis writes.',
  card: {
    name: 'freelance',
    score: 94,
    activity: 'high' as Activity,
    tier: 'primary' as Tier,
    reason: 'Freelancers ask how to invoice and chase late payments here every week.',
    signals: ['how do I invoice', 'client won’t pay', 'what do you use'],
  },
  parts: [
    { id: 'score', label: 'Relevance', body: 'How well the AI thinks the community fits your product, 0 to 100. Suggestions come in this order.' },
    { id: 'reason', label: 'Reason', body: 'One or two sentences on why it fits, so you can disagree with it.' },
    { id: 'signals', label: 'Intent signals', body: 'The kind of posts there that tend to mean someone is choosing a tool.' },
    { id: 'activity', label: 'Activity', body: 'High, medium or low. It’s the AI’s estimate, not a live count of members or posts.' },
    { id: 'tier', label: 'Category', body: 'Primary, secondary or niche, so you can add a whole tier at once.' },
  ],
};

export const LIST = {
  pill: 'Your list',
  title: 'The list is yours to shape',
  moments: [
    {
      when: 'At setup',
      title: 'Five to start',
      body: 'Right after website analysis, Reddix saves the top five suggestions so your first scan has somewhere to look. If it finds fewer, it fills the gap from five general communities: SaaS, Entrepreneur, smallbusiness, startups and marketing.',
    },
    {
      when: 'In the Scanner',
      title: 'Discover more',
      body: 'Open Discover to get ten fresh suggestions. Add one at a time, add every primary pick, or add them all.',
    },
    {
      when: 'Any time',
      title: 'Add and remove by hand',
      body: 'Type any subreddit name to add it, or remove one with its ×. The app doesn’t cap the list; the scan plan below is the reason to keep it short.',
    },
  ],
};

export const PLANNER = {
  pill: 'Scan planner',
  title: 'See which subreddits your next scan reads',
  body: 'Each scan searches three of your subreddits, and which three can change every 5 minutes. This runs the scanner’s own plan in your browser. Edit the list to see how the searches change.',
  listLabel: 'Monitored subreddits',
  addLabel: 'Add a subreddit',
  competitorLabel: 'Watch a competitor (Billcraft)',
  slotsLabel: 'Start the scan',
  slots: ['Now', 'In 5 min', 'In 10 min', 'In 15 min'],
  /** Stand-ins for the buyer phrases the AI writes from your profile. */
  phrases: ['client won’t pay invoice', 'simple invoicing for freelancers', 'chasing late payments', 'invoice template for designers'],
  competitor: 'Billcraft',
  startList: ['freelance', 'graphic_design', 'smallbusiness', 'web_design', 'bookkeeping'],
  note: 'The buyer phrases are examples. In a real scan the AI writes them from your profile and reuses them for 24 hours.',
  kinds: {
    latest: 'Recent posts in one',
    phrases: 'Buyer phrases across three',
    competitors: 'Competitor, all of Reddit',
    'sub-phrases': 'Buyer phrases in one',
  },
};

export const CHOOSING = {
  pill: 'Choosing well',
  title: 'Four things to know before you add twenty',
  rules: [
    { title: 'Three per scan', body: 'However long the list, a scan reads three of your subreddits. The more you add, the less often each one is searched, so keep the ones where people ask for tools.' },
    { title: 'Competitors don’t need a subreddit', body: 'If your profile names competitors, every scan also searches all of Reddit for people leaving the first two. You don’t need a subreddit per competitor to catch those posts.' },
    { title: 'Check before you add', body: 'Suggestions come from the AI’s knowledge of Reddit, and activity is an estimate. Open the subreddit and read its rules and recent threads first. Some ban any mention of products.' },
    { title: 'Results move between scans', body: 'Each search looks back over the past day, week or month, and which window applies rotates along with the subreddits. Two scans a few minutes apart can find different threads.' },
  ],
};

export const FAQ = [
  {
    q: 'How does Reddix find subreddits for my product?',
    a: 'It sends your product profile (name, description, target audience, value proposition, features, competitors and pricing model) to the AI, which suggests the ten communities where your buyers are most likely to post. Subreddits you already monitor are left out.',
  },
  {
    q: 'Are the suggested subreddits checked?',
    a: 'Each suggestion comes from the AI’s knowledge of Reddit, with a relevance score, a reason and an activity estimate. Reddix doesn’t count members or posts, so open a subreddit and read its rules and recent threads before you add it.',
  },
  {
    q: 'How many subreddits should I monitor?',
    a: 'Each scan searches three of your subreddits, and which three can change every 5 minutes. A short list of communities where people ask for recommendations gets searched more often than a long one.',
  },
  {
    q: 'Can I add a subreddit that wasn’t suggested?',
    a: 'Yes. Type any subreddit name into the Scanner to add it, and remove one with its × button. Suggestions are a starting point, not a limit.',
  },
  {
    q: 'Does Reddix post in these subreddits?',
    a: 'No. Reddix reads public posts through search and never posts, comments or votes. When you reply to a thread, you edit the draft and post it from your own account.',
  },
];

export const NEXT = {
  title: 'Where next',
  links: [
    { to: '/features/website-analysis', title: 'Website analysis', body: 'The profile discovery reads.' },
    { to: '/features/intent-detection', title: 'Intent detection', body: 'How found posts are scored.' },
    { to: '/features/lead-scoring', title: 'Lead scoring', body: 'How saved leads are ranked.' },
  ],
  cta: {
    title: 'Start with five communities that fit',
    body: 'Add your site. Reddix writes your profile, suggests subreddits, and saves the first five before your first scan.',
    button: 'Find my subreddits',
  },
};
