/**
 * Every word on /features/natural-tone. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * The rules, tone lines and pricing hooks are the ones in
 * supabase/functions/generate-reply/index.ts (see BRIEF.md, "Truth"). If the
 * prompt changes, change them here. Tallyfold, the product in the examples,
 * is fictional.
 */

export const PATH = '/features/natural-tone';

export const META = {
  query: 'reddit reply tone',
  title: 'Natural Tone: Reddit Replies That Don’t Read Like Ads | Reddix',
  description:
    'The six writing rules behind every Reddix reply draft, the five tones you can choose, and what each one does to keep your replies welcome on Reddit.',
};

export const HERO = {
  pill: 'Feature · Natural tone',
  h1: 'Reddit replies that read like a person, not an ad',
  /** The end of the H1, set in red. */
  accent: 'not an ad',
  answer:
    'Natural tone is the set of writing rules every Reddix reply draft follows: help first, answer in the writer’s own words, stay short, mention your product the way a person recommends something, and fit the subreddit. You also choose the voice, from professional to witty.',
  cta: 'Write replies people read',
};

/** The hero's before/after. Both are illustrative. */
export const COMPARE = {
  post: 'r/freelance · “How do you keep track of who owes you money?”',
  ad: {
    label: 'Reads like an ad',
    text: '🚀 Tired of chasing invoices?? Tallyfold is the #1 invoicing platform for freelancers! Sign up today and get paid faster!!! 👉 tallyfold.example',
    faults: ['Answers nothing', 'Hype and capitals', 'Pitch before help'],
  },
  reply: {
    label: 'Reads like a reply',
    /** Each part tagged with the rule it follows (1-based, see RULES). */
    parts: [
      { text: 'A sheet with a due-date column and a 10-minute check every Friday works up to about 10 clients.', rule: 1 },
      { text: ' Past that, use a tool that sends the reminders for you.', rule: 2 },
      { text: ' Tallyfold does that, and there’s a free tier to try.', rule: 3 },
    ],
    link: 'tallyfold.example',
  },
  note: 'Illustrative replies. Tallyfold is fictional.',
};

export const RULES = {
  pill: 'The rules',
  title: 'Six rules every draft is written to',
  body: 'These go to the AI with every post, in this order. The wording here is ours; the rules are the ones in the prompt.',
  items: [
    {
      rule: 'Help first',
      prompt: 'Be genuinely helpful first.',
      why: 'A reply that answers the question is worth reading even if your product didn’t exist. That’s the difference between a recommendation and spam, to readers and to moderators.',
    },
    {
      rule: 'Answer in their words',
      prompt: 'Mirror the writer’s language and technical level.',
      why: 'A beginner asking about “a spreadsheet” doesn’t want “a reconciliation workflow”. Matching their words shows you read the post rather than pasting a reply.',
    },
    {
      rule: 'Mention it like a person would',
      prompt: 'If mentioning the product, do it naturally, never salesy.',
      why: 'One plain sentence that says what your product does for this problem. No superlatives, no “sign up today”, no exclamation marks.',
    },
    {
      rule: 'Keep it short',
      prompt: '120–250 characters per reply, not counting the link.',
      why: 'Two or three sentences. Short replies get read to the end, and leave room for the writer to ask a follow-up.',
    },
    {
      rule: 'Write for the room',
      prompt: 'Match the subreddit’s culture.',
      why: 'r/freelance, r/sysadmin and r/smallbusiness answer the same question very differently. The draft knows which subreddit the post is in.',
    },
    {
      rule: 'Link on its own line',
      prompt: 'End with your website on its own line, outside the character count.',
      why: 'The link is easy to see, and easy to delete. Some subreddits don’t allow links in comments; there, delete the last line before you post.',
    },
  ],
};

export const VOICE = {
  pill: 'Voice',
  title: 'Choose a voice, see what the AI is told',
  body: 'Your reply tone and pricing model live in your product profile. Change them here to see the exact lines Reddix adds to the instructions, and an example reply in that voice.',
  toneLabel: 'Reply tone',
  pricingLabel: 'Your pricing model',
  instructionsLabel: 'Added to the instructions',
  exampleLabel: 'Example reply',
  note: 'The instruction lines are the product’s own. The example replies are ours, written to the same rules; real drafts are written fresh for each post.',
  /** Tone lines, word for word from the prompt. Friendly is the default. */
  tones: [
    { value: 'professional', name: 'Professional', line: 'Formal, polished, business-appropriate', lead: 'For six clients, set a fixed reminder schedule: on the due date, then 3 and 10 days after. Put payment terms on every invoice.', mention: 'Tallyfold automates those reminders' },
    { value: 'casual', name: 'Casual', line: 'Relaxed, conversational, like talking to a friend', lead: 'Six clients is right where the spreadsheet stops working, honestly. Set a reminder for 3 days after each due date and stop trusting memory.', mention: 'Tallyfold does the reminding' },
    { value: 'friendly', name: 'Friendly', line: 'Warm, helpful, approachable', lead: 'Such a common spot to be in. What helped me most was a reminder 3 days after each due date, so nothing slips through quietly.', mention: 'Tallyfold sends those for you' },
    { value: 'technical', name: 'Technical', line: 'Precise, detailed, use industry terms', lead: 'Track status per invoice (sent, due, overdue) and trigger reminders at due+3 and due+10. A sheet can do it with conditional formatting.', mention: 'Tallyfold runs that schedule automatically' },
    { value: 'witty', name: 'Witty', line: 'Clever, engaging, subtle humor', lead: 'Clients have a sixth sense for the invoice you forgot to chase. Beat them to it with a reminder 3 days after every due date.', mention: 'Tallyfold remembers so you don’t have to' },
  ],
  defaultTone: 'friendly',
  /** Pricing hooks, word for word from the prompt. Paid plans get none. */
  pricing: [
    { value: 'free', name: 'Free', hook: "it's free to use" },
    { value: 'freemium', name: 'Freemium', hook: "there's a free tier to try" },
    { value: 'free-trial', name: 'Free trial', hook: 'you can try it free' },
    { value: 'paid', name: 'Paid only', hook: '' },
  ],
  defaultPricing: 'freemium',
  url: 'tallyfold.example',
};

export const ON_YOU = {
  pill: 'Your part',
  title: 'What the drafts leave to you',
  body: 'The rules make a draft easy to post. These four make it right to post, and only you can do them.',
  items: [
    { title: 'Say you built it', body: 'The drafts mention your product as a recommendation; they don’t say it’s yours. Add “I built this” or “I work on this”. Many subreddits require it, and readers trust it more.' },
    { title: 'Check the link rule', body: 'Every draft ends with your link. Read the subreddit’s rules first, and delete the line where links aren’t allowed.' },
    { title: 'Read the thread', body: 'The AI sees the post, not the comments. If someone already gave the same answer, add to theirs or skip it.' },
    { title: 'Never paste twice', body: 'Each draft is written for one post. Posting the same text across threads is the pattern Reddit treats as spam.' },
  ],
};

export const FAQ = [
  {
    q: 'What does natural tone mean in Reddix?',
    a: 'It’s the set of rules every reply draft is written to: help first, mirror the writer’s words and technical level, mention your product naturally rather than as a pitch, keep it to 120–250 characters, match the subreddit, and put your link on its own last line.',
  },
  {
    q: 'Can I change the tone of my reply drafts?',
    a: 'Yes. In Settings, choose Professional, Casual, Friendly, Technical or Witty; Friendly is the default. New drafts use the new tone. Drafts already written for a lead are kept for 7 days, so press Regenerate to rewrite them in the new voice.',
  },
  {
    q: 'Do the drafts say that I built the product?',
    a: 'No. They mention your product the way a person recommends something, without saying it’s yours. Add that yourself before you post. Many subreddits require it, and an open “I built this” reads better than a recommendation that turns out to be yours.',
  },
  {
    q: 'Why does every draft end with a link?',
    a: 'The reply rules put your website on its own last line, outside the character count, so it’s easy to see and easy to remove. Some subreddits don’t allow links in comments; there, delete the line before you post.',
  },
  {
    q: 'Will these replies keep my Reddit account safe?',
    a: 'No tool can promise that. Short, helpful, specific replies are far less likely to be removed than pitches, but what keeps an account in good standing is how you use it: follow each subreddit’s rules, disclose that you built the product, and don’t post the same reply twice.',
  },
];

export const CLOSE = {
  title: 'Replies worth reading, in your voice',
  body: 'Add your site. Reddix builds your profile, finds the threads asking for something like it, and drafts replies that follow these rules.',
  button: 'Write replies people read',
  related: [
    { to: '/features/ai-replies', title: 'AI replies' },
    { to: '/blog/reddit-self-promotion-rules', title: 'Reddit self-promotion rules' },
    { to: '/features/intent-detection', title: 'Intent detection' },
  ],
};
