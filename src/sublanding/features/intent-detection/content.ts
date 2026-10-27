/**
 * Every word on /features/intent-detection. Pure data: the page renders it,
 * and scripts/prerender.ts turns it into the HTML crawlers read, so both say
 * the same thing.
 *
 * Every number here comes from the scanner's code (see BRIEF.md, "Truth").
 * Pipewell, the competitor in every example, is fictional.
 */

export const PATH = '/features/intent-detection';

export const META = {
  query: 'reddit intent detection',
  title: 'Reddit Intent Detection: Find Buyers, Not Mentions | Reddix',
  description:
    'How Reddix reads Reddit posts for buying intent: the four-step pipeline, the 0–100 rubric, the phrases that add points, and a checker you can try.',
};

export const HERO = {
  pill: 'Feature · Intent detection',
  h1: 'Reddit intent detection that tells buyers from browsers',
  /** The end of the H1, set in red. */
  accent: 'buyers from browsers',
  answer:
    'Reddit intent detection reads a post for signs its author is about to choose a product, then scores how close they are to buying. Reddix scores every post it finds from 0 to 100 against your product, so the people asking for a tool like yours come first.',
  cta: 'Find buyers on Reddit',
  secondary: 'Try the signal checker',
};

/** The hero's annotated post: an example AI score, then the points the
 *  scanner's own rules add for its phrases (computed, not typed). */
export const HERO_POST = {
  subreddit: 'r/smallbusiness',
  title: 'Paying $49/month for Pipewell and we only use the contacts tab. Anything cheaper for a 3-person team?',
  body: 'Mostly need shared notes and follow-up reminders. Happy to move this month.',
  aiScore: 44,
  competitors: ['Pipewell'],
  note: 'Illustrative post. The AI’s score is an example; the points after it are the scanner’s rules.',
};

export const INTENTS = {
  pill: 'Same word, four intents',
  title: 'A keyword alert can’t tell these apart',
  body: 'All four posts mention “CRM”. A keyword alert sends you every one of them. Intent detection ranks them by how close the writer is to choosing a tool.',
  note: 'Illustrative posts and scores.',
  posts: [
    {
      level: 'low',
      score: 8,
      text: 'Our CRM migration finally finished. Here’s what I learned after three months of it.',
      why: 'A finished project. There’s nothing left to choose.',
    },
    {
      level: 'research',
      score: 31,
      text: 'How do small teams usually keep track of deals? Spreadsheets, or is a CRM worth it?',
      why: 'An early, open question. Worth a helpful answer, not a pitch.',
    },
    {
      level: 'warm',
      score: 58,
      text: 'Our sales notes live in five different places. Is a CRM overkill for a 4-person agency?',
      why: 'A clear problem a CRM solves, and the writer is weighing it.',
    },
    {
      level: 'hot',
      score: 86,
      text: 'Looking for an alternative to Pipewell, budget under $30/month. What do you all use?',
      why: 'A direct ask, a tool they want to leave, and a budget.',
    },
  ],
} as const;

export const STAGES = {
  pill: 'How it works',
  title: 'From search to saved lead, in four passes',
  body: 'Each scan runs the same four passes. The cheap ones go first, so the AI only reads posts worth reading.',
  steps: [
    {
      title: 'Search like a buyer',
      body: 'From your product profile, the AI writes the phrases a customer types when they have the problem you solve, and Reddix searches Reddit with them.',
      facts: ['6–8 buyer phrases', 'Up to 7 searches per scan'],
    },
    {
      title: 'Throw out the obvious noise',
      body: 'Rules run before any AI: posts already scored this week, posts too short to judge, launches, hiring threads, giveaways and AMAs. A buying phrase or a competitor’s name rescues a post from those rules. Posts that name a competitor or ask directly go to the front.',
      facts: ['7-day memory', 'Up to 30 posts go on'],
    },
    {
      title: 'Score against your product',
      body: 'The AI reads each post next to your product description, features and competitors, and returns a score from 0 to 100, a level, a one-line reason and how confident it is.',
      facts: ['Batches of 10', 'Score, reason, confidence'],
    },
    {
      title: 'Add what the words prove',
      body: 'Some phrases are harder evidence than any model’s guess, so they add points after the AI. Posts that finish at 35 or above are saved as leads, best first.',
      facts: ['Saved at 35+', 'Top 25 per scan'],
    },
  ],
};

export const BANDS = {
  pill: 'Reading the score',
  title: 'What each score band means, and what to do',
  body: 'The AI scores against this rubric. The level you see on a lead is set by the final score, after the signal points are added.',
  bands: [
    { level: 'hot', range: [70, 100], name: 'Hot', looks: 'Asks for a tool, names a product they want to leave, or talks budget.', act: 'Reply today, while the thread is still active.' },
    { level: 'warm', range: [40, 69], name: 'Warm', looks: 'Describes a problem you solve, or is comparing options.', act: 'Answer the problem first. Mention your product if it fits.' },
    { level: 'research', range: [25, 39], name: 'Research', looks: 'Exploring, curious, not choosing yet.', act: 'Reddix keeps the ones at 35 and up. Help if you can add something.' },
    { level: 'low', range: [0, 24], name: 'Low', looks: 'Off-topic, already solved, self-promotion or news.', act: 'Not saved, and not scored again for 7 days.' },
  ],
  boostsTitle: 'Signals that add points after the AI',
  boosts: [
    { key: 'competitor', name: 'A competitor you named', example: '“moving off Pipewell”' },
    { key: 'pricing', name: 'Pricing language', example: '“budget”, “per month”, “how much”, “cheaper”' },
    { key: 'alt', name: '“Alternative to”', example: '“an alternative to Pipewell”' },
  ],
  boostsNote: 'Points are added to the AI’s score and capped at 100.',
} as const;

export const CHECKER = {
  pill: 'Signal checker',
  title: 'Paste a post and watch the first pass',
  body: 'This runs the same rules the scanner uses, in your browser. The AI score comes from Reddix during a scan; here you set it with the slider to see how the signals move the result.',
  competitorsLabel: 'Competitors to watch for',
  competitorsHint: 'Comma-separated, as you’d list them in your profile.',
  postLabel: 'Reddit post',
  sliderLabel: 'AI score',
  samples: [
    { label: 'Asking for an alternative', text: 'Looking for an alternative to Pipewell. We’re a 3-person team and the budget is about $30 per month. What do you all use?' },
    { label: 'Venting about a tool', text: 'Is anyone else stuck with Pipewell? The reporting is a mess and support takes days. Thinking about switching but not sure to what.' },
    { label: 'A launch post', text: 'I built a simple CRM for freelancers after years of spreadsheets. Check out my landing page and tell me what you think!' },
    { label: 'Just sharing', text: 'Our team finally cleaned up the shared inbox this week. Took a few evenings, but here’s the folder setup we landed on.' },
  ],
  defaultCompetitors: 'Pipewell',
};

export const LIMITS = {
  pill: 'Limits',
  title: 'What intent detection doesn’t do',
  items: [
    { title: 'It runs when you start a scan', body: 'Reddix doesn’t watch Reddit in the background. Each scan is a fresh look at the subreddits you chose, at most once every 5 minutes.' },
    { title: 'It reads public posts only', body: 'It sees what Reddit search can reach. Private communities, removed posts and messages are out of reach.' },
    { title: 'It never posts for you', body: 'Reddix finds the thread and drafts a reply. You read it, edit it and post it from your own account.' },
    { title: 'It can be wrong', body: 'Reddix saves the AI’s one-line reason and confidence with every lead. Leads it was sure about show the reason on the card; Analyze gives the rest a second read before you spend time on them.' },
    { title: 'It’s only as sharp as your profile', body: 'The AI scores against your description, features and competitors. A vague profile gets vaguer scores. You can sharpen the description and audience in Settings.' },
  ],
};

export const FAQ = [
  {
    q: 'What is Reddit intent detection?',
    a: 'It’s reading a Reddit post for signs its author is about to choose a product: asking for recommendations, comparing options, naming a tool they want to leave, or mentioning a budget. Reddix scores each post from 0 to 100 on how likely it is to become a customer for your product.',
  },
  {
    q: 'How is it different from keyword alerts?',
    a: 'A keyword alert fires on any post that contains the word, so a launch announcement and a buyer asking for help look the same. Intent detection reads what the post is asking for and scores it against your product, so the buyer comes first and the announcement is skipped.',
  },
  {
    q: 'Which phrases count as buying signals?',
    a: 'Requests and comparisons such as “recommend”, “looking for”, “alternative to”, “switching from” and “what do you use” send a post to the AI first. Three signals also add points after the AI scores it: a competitor you named (+25), pricing words such as budget or per month (+15), and “alternative to” (+10).',
  },
  {
    q: 'Why did a post score lower than I expected?',
    a: 'Open the lead: confident leads show the AI’s one-line reason, and Analyze gives the rest a second read. The usual causes are a post that’s already solved, one that asks about a different problem, or a thin product profile. A clearer product description and audience in Settings give the AI more to match against; competitors and features come from the analysis of your website.',
  },
  {
    q: 'Does Reddix scan Reddit automatically?',
    a: 'No. A scan runs when you start one from the Scanner, at most once every 5 minutes, and looks at the subreddits you chose. Every post it saves lands in your lead list with its score and level.',
  },
];

export const NEXT = {
  title: 'Keep going',
  links: [
    { to: '/features/lead-scoring', title: 'Lead scoring', body: 'How saved leads are ranked and worked.' },
    { to: '/features/ai-replies', title: 'AI replies', body: 'Drafts that answer the post before they mention you.' },
    { to: '/features/subreddit-discovery', title: 'Subreddit discovery', body: 'Where to point the scanner in the first place.' },
    { to: '/blog/reddit-lead-generation', title: 'Reddit lead generation guide', body: 'A full system, with a rubric you can use by hand.' },
  ],
  cta: {
    title: 'See which posts are asking for you',
    body: 'Add your site. Reddix builds your product profile, picks subreddits, and scores the first posts when you run a scan.',
    button: 'Find buyers on Reddit',
  },
};
