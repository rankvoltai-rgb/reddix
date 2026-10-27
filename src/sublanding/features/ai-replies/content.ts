/**
 * Every word on /features/ai-replies. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Facts come from supabase/functions/generate-reply/index.ts and the reply
 * dialog (src/components/scanner/ReplyDialog.tsx); see BRIEF.md, "Truth".
 * Tallyfold, the product in the examples, is fictional.
 */

export const PATH = '/features/ai-replies';

export const META = {
  query: 'ai reddit reply generator',
  title: 'AI Reddit Reply Drafts You Edit and Post Yourself | Reddix',
  description:
    'Reddix reads a Reddit thread and your product, then drafts three replies: direct, story and expert. You pick one, edit it, and post it from your own account.',
};

export const HERO = {
  pill: 'Feature · AI replies',
  h1: 'AI reply drafts for Reddit threads, posted by you',
  /** The end of the H1, set in red. */
  accent: 'posted by you',
  answer:
    'Reddix’s AI replies read a Reddit thread next to your product profile and write three short drafts in different voices. You choose one, edit it, copy it, and post it from your own Reddit account. Reddix never posts, comments or votes for you.',
  cta: 'Draft your first reply',
  secondary: 'Try the draft editor',
};

/** The hero's figure: what goes in, the one pass, what comes out. */
export const FLOW = [
  { label: 'In', title: 'A thread and your product', body: 'The post’s subreddit, title and text, next to your product profile.' },
  { label: 'One pass', title: 'The AI reads the writer', body: 'How technical they are, where they are in choosing, how they feel, how well your product fits.' },
  { label: 'Out', title: 'Three drafts to choose from', body: 'Direct, Story and Expert, ranked by the AI. Nothing is posted.' },
];

export const INPUTS = {
  pill: 'What it reads',
  title: 'What the AI reads before it writes',
  body: 'A draft is only as specific as what goes into it. This is everything the AI sees, and nothing else: it doesn’t browse your site or the rest of the thread while it writes.',
  post: {
    title: 'From the Reddit post',
    rows: [
      { name: 'Subreddit', value: 'So it can write for that community.' },
      { name: 'Title', value: 'The question as the writer put it.' },
      { name: 'Post text', value: 'The first 1,500 characters of the body.' },
    ],
  },
  profile: {
    title: 'From your product profile',
    rows: [
      { name: 'Name and description', value: 'What you make, in your words.' },
      { name: 'Key features', value: 'What the draft can point to.' },
      { name: 'Competitors', value: 'So it knows what you’re compared with.' },
      { name: 'What makes you different', value: 'The reason to pick you over them.' },
      { name: 'Website', value: 'The link at the end of every draft.' },
      { name: 'Pricing model', value: 'Free, freemium or a free trial becomes a short line such as “there’s a free tier to try”.' },
      { name: 'Reply tone', value: 'Professional, casual, friendly, technical or witty. Friendly unless you change it.' },
    ],
  },
  readsTitle: 'What it notes about the writer, in the same pass',
  reads: ['How much pain they’re in', 'How technical they are', 'Whether they’re learning, comparing or deciding', 'Whether they sound frustrated, curious, desperate or casual', 'How well your product fits the question'],
  profileNote: 'Reddix fills your profile in from your website when you sign up. You can change any of it in Settings.',
};

export const VARIANTS = {
  pill: 'Draft editor',
  title: 'Three ways into the same thread',
  body: 'Each draft takes a different angle on the same answer. Pick the one that sounds like you, then make it yours. The editor below counts characters the way the drafts are written: without the link line.',
  note: 'Illustrative drafts written for this example, in the format Reddix returns. Tallyfold is fictional.',
  post: {
    subreddit: 'r/freelance',
    title: 'How do you keep track of who owes you money?',
    body: 'Six clients now and I keep forgetting to chase late invoices. Spreadsheet isn’t cutting it anymore.',
  },
  url: 'tallyfold.example',
  drafts: [
    {
      type: 'direct',
      name: 'Direct',
      angle: 'A straight, practical answer.',
      text: 'A sheet with a due-date column and a 10-minute check every Friday works up to about 10 clients. Past that, use a tool that sends the reminders for you. Tallyfold does that, and there’s a free tier to try.\ntallyfold.example',
    },
    {
      type: 'story',
      name: 'Story',
      angle: 'A short “I had this too” that earns the advice.',
      text: 'Had the same thing at five clients and lost a month of income to invoices I forgot to chase. What fixed it was an automatic reminder 3 days after the due date. Tallyfold does that, free tier if you want it.\ntallyfold.example',
    },
    {
      type: 'expert',
      name: 'Expert',
      angle: 'Teaches the why, for readers who want it.',
      text: 'Late payment is usually a follow-up problem, not a client problem. Put the due date in the subject line, remind at +3 and +10 days, and add a late fee to new contracts. Tallyfold sends those reminders.\ntallyfold.example',
    },
  ],
  min: 120,
  max: 250,
};

export const HANDOFF = {
  pill: 'From draft to thread',
  title: 'You post it, from your account',
  body: 'Drafting happens inside Reddix. Everything after that happens on Reddit, by you.',
  steps: [
    { title: 'Press Reply on a lead', body: 'On any lead from a scan. The three drafts come back in one call, ranked by the AI, and the top one is saved to the lead.' },
    { title: 'Pick and edit', body: 'Switch between Direct, Story and Expert, and edit the text in place. A character count sits under the box.' },
    { title: 'Copy & Go', body: 'Copies your edited reply and opens the thread in a new tab, ready to paste.' },
    { title: 'Post it yourself', body: 'From your own Reddit account, after reading the thread once more. Reddix never sees your Reddit login.' },
  ],
  extras: [
    { title: 'Drafts are kept for 7 days', body: 'Open the same lead again within a week and you get the same drafts back instantly, without a new AI call.' },
    { title: 'Regenerate for fresh ones', body: 'Want a different take? Regenerate writes three new drafts and replaces the saved ones.' },
    { title: 'The lead moves to Engaged', body: 'Drafting a reply marks the lead as Engaged in your lead list, so you can see which threads you’ve worked.' },
  ],
};

export const NEVER = {
  title: 'What AI replies never do',
  items: ['Post, comment or send messages for you', 'Upvote, or ask anyone else to', 'Log in to your Reddit account', 'Reply again on their own after you post'],
};

export const FAQ = [
  {
    q: 'Does Reddix post replies to Reddit for me?',
    a: 'No. Reddix writes drafts and stops there. You copy the one you want, open the thread, and post it from your own Reddit account. Reddix never has your Reddit login and never posts, comments, messages or votes.',
  },
  {
    q: 'Why three drafts instead of one?',
    a: 'Different threads reward different openings. Direct answers the question head-on, Story starts from a shared problem, and Expert explains the why. The AI ranks the three for the post, but you know the community better, so you choose.',
  },
  {
    q: 'What does the AI know about my product?',
    a: 'Your product profile: name, description, key features, competitors, what makes you different, your website, your pricing model and your reply tone. Reddix builds it from your website when you sign up, and you can edit every field in Settings.',
  },
  {
    q: 'Can I edit a draft before I post it?',
    a: 'Yes. Every draft opens in an editable box. Change as much as you like; Copy and Copy & Go take your edited version. If none of the three fit, Regenerate writes three new ones.',
  },
  {
    q: 'Do I need a paid plan for reply drafts?',
    a: 'Yes. Drafting replies needs an active Premium subscription, including its free trial, or a Lifetime plan. See the pricing section on the home page for what each plan includes.',
  },
];

export const CLOSE = {
  title: 'Find a thread worth answering, then answer it well',
  body: 'Add your site. Reddix builds your product profile, finds the posts asking for something like it, and drafts the reply when you’re ready.',
  button: 'Draft your first reply',
  related: [
    { to: '/features/natural-tone', title: 'Natural tone', body: 'The writing rules every draft follows.' },
    { to: '/features/intent-detection', title: 'Intent detection', body: 'How Reddix finds the threads worth a reply.' },
    { to: '/blog/reddit-self-promotion-rules', title: 'Reddit self-promotion rules', body: 'What you can post, and where.' },
  ],
};
