/**
 * Every word on /features/website-analysis. Pure data: the page renders it
 * and crawler.ts turns it into the HTML crawlers read.
 *
 * Facts come from analyze-website, the onboarding wizard and the functions
 * that read the profile afterwards (see BRIEF.md, "Truth"). Tallyfold and
 * Billcraft are fictional.
 */

export const PATH = '/features/website-analysis';

export const META = {
  query: 'website analysis',
  title: 'Website Analysis: From Your URL to a Product Profile | Reddix',
  description:
    'What Reddix reads from your website, the product profile it writes, and where each field is used: search phrases, lead scoring, subreddits and replies.',
};

export const HERO = {
  pill: 'Feature · Website analysis',
  h1: 'Website analysis that turns one URL into a product profile',
  accent: 'a product profile',
  answer:
    'Website analysis is the first thing Reddix does with your account: it reads the page at your URL and writes a short product profile, covering what you sell, who it’s for, its main features and any competitors the page names. Every scan, lead score, subreddit suggestion and reply draft starts from that profile.',
  fieldLabel: 'Your website URL',
  placeholder: 'yourproduct.com',
  cta: 'Analyze my site',
  helper: 'You’ll sign in first. The analysis runs during setup.',
};

/** The hero's example: a fictional homepage and the profile written from it.
 *  Each passage lights up with the field it becomes. */
export const SPECIMEN = {
  domain: 'tallyfold.com',
  brand: 'Tallyfold',
  note: 'Illustrative example. Tallyfold and Billcraft are fictional.',
  passages: [
    { id: 'description', text: 'Invoices that get freelance designers paid on time.', as: 'h' },
    { id: 'audience', text: 'Built for independent designers and small studios.', as: 'p' },
    { id: 'features', text: 'Branded templates · Payment reminders · Client portal', as: 'list' },
    { id: 'competitors', text: 'Switching from Billcraft? Import your clients in one click.', as: 'p' },
    { id: 'pricing', text: 'Free for 3 clients. Pro is $12 a month.', as: 'p' },
  ],
  fields: [
    { id: 'description', label: 'Description', value: 'Invoicing software for freelance designers and small studios.' },
    { id: 'audience', label: 'Target audience', value: 'Independent designers and small design studios' },
    { id: 'features', label: 'Key features', value: ['Branded invoice templates', 'Payment reminders', 'Client portal'] },
    { id: 'competitors', label: 'Competitors', value: ['Billcraft'] },
    { id: 'pricing', label: 'Pricing model', value: 'Freemium' },
  ],
} as const;

export const READ = {
  pill: 'What happens to the URL',
  title: 'Five steps between your URL and your profile',
  body: 'The analysis runs once, while you set up your account. It takes your word for the product name and reads everything else from the page.',
  steps: [
    { title: 'Your URL is tidied', body: 'If it doesn’t start with http:// or https://, Reddix adds https:// in front.', fact: 'https://' },
    { title: 'One page is read', body: 'Reddix fetches the page at that address and keeps its main content as text, leaving out menus and footers. It doesn’t crawl the rest of your site.', fact: '1 page' },
    { title: 'Thin pages stop here', body: 'If the page has under 50 characters of readable text, there’s nothing to analyze. Setup carries on and you can fill the profile in by hand.', fact: '50 characters' },
    { title: 'The AI reads the start', body: 'The first 8,000 characters go to the AI, which fills in a fixed set of fields. It leaves a field blank when the page doesn’t say.', fact: '8,000 characters' },
    { title: 'The profile is saved', body: 'Fields the AI filled are saved to your account. Then Reddix suggests subreddits from the new profile and saves your first five.', fact: '5 subreddits' },
  ],
};

export type Use = 'phrases' | 'scoring' | 'subreddits' | 'replies';

export const USES: { id: Use; label: string; short: string }[] = [
  { id: 'phrases', label: 'Search phrases', short: 'Phrases' },
  { id: 'scoring', label: 'Lead scoring', short: 'Scoring' },
  { id: 'subreddits', label: 'Subreddit suggestions', short: 'Subreddits' },
  { id: 'replies', label: 'Reply drafts', short: 'Replies' },
];

export type Field = {
  id: string;
  name: string;
  /** Where the value comes from. */
  source: string;
  /** Size or allowed values. */
  shape: string;
  editable: boolean;
  uses: Partial<Record<Use, string>>;
  ifEmpty: string;
};

export const MAP = {
  pill: 'Field map',
  title: 'Pick a field to see where it goes',
  body: 'The profile isn’t a summary you read once. Each field is passed to specific parts of Reddix, and an empty one changes what they can do.',
  note: 'Based on how Reddix uses each field today.',
  fields: [
    {
      id: 'name',
      name: 'Product name',
      source: 'You type it at setup',
      shape: 'Text',
      editable: true,
      uses: {
        phrases: 'Tells the AI what the product is. The search phrases themselves never include it, so they read like a customer wrote them.',
        scoring: 'Names the product each post is scored against.',
        subreddits: 'Part of the brief the AI suggests communities from.',
        replies: 'The product a draft may mention.',
      },
      ifEmpty: 'Setup asks for it, so it’s never empty.',
    },
    {
      id: 'description',
      name: 'Description',
      source: 'Read from the page',
      shape: '1–2 sentences',
      editable: true,
      uses: {
        phrases: 'The main input for the buyer phrases each scan searches with.',
        scoring: 'Tells the AI what problem a post has to be about to score well.',
        subreddits: 'Points the AI at communities where that problem comes up.',
        replies: 'Lets a draft explain the product in a line.',
      },
      ifEmpty: 'Scoring falls back to the word “Software”, and every step gets much vaguer.',
    },
    {
      id: 'audience',
      name: 'Target audience',
      source: 'Read from the page',
      shape: 'Text',
      editable: true,
      uses: { subreddits: 'Decides whose communities get suggested: designers, founders, studio owners.' },
      ifEmpty: 'Subreddit suggestions lean on the description alone.',
    },
    {
      id: 'value',
      name: 'Value proposition',
      source: 'Read from the page',
      shape: 'Text',
      editable: true,
      uses: {
        subreddits: 'Adds the outcome customers want to the discovery brief.',
        replies: 'What a draft leans on when the profile has no differentiators.',
      },
      ifEmpty: 'Drafts have less to say about why the product helps.',
    },
    {
      id: 'features',
      name: 'Key features',
      source: 'Read from the page',
      shape: '3–5 items',
      editable: false,
      uses: {
        phrases: 'Turned into the problems a customer would describe.',
        scoring: 'Lets the AI match a post to something the product actually does.',
        subreddits: 'Part of the discovery brief.',
        replies: 'Gives a draft something specific to point to.',
      },
      ifEmpty: 'Scoring and replies get no feature list and judge on the description alone.',
    },
    {
      id: 'competitors',
      name: 'Competitors',
      source: 'Read from the page, only if it names them',
      shape: 'Up to 5',
      editable: false,
      uses: {
        phrases: 'Tells the AI which tools your buyers may be leaving.',
        scoring: 'A post naming one gets +25 after the AI scores it, and each scan runs a Reddit-wide search for “alternative to” and “switching from” the first two.',
        subreddits: 'Points the AI at communities where they get discussed.',
        replies: 'Tells a draft which tools the reader may already use.',
      },
      ifEmpty: 'No competitor search, no +25 for naming one. Most homepages don’t name competitors, so this is often empty.',
    },
    {
      id: 'pricing',
      name: 'Pricing model',
      source: 'Read from the page',
      shape: 'Free, freemium, free trial, paid, enterprise or unknown',
      editable: false,
      uses: {
        subreddits: 'Part of the discovery brief.',
        replies: 'If it’s free, freemium or a free trial, a draft can say so in a few words.',
      },
      ifEmpty: 'Drafts don’t mention price.',
    },
    {
      id: 'differentiators',
      name: 'What sets it apart',
      source: 'Read from the page',
      shape: 'Text',
      editable: false,
      uses: { replies: 'The point a draft makes when it compares you with the usual options.' },
      ifEmpty: 'Drafts use the value proposition instead.',
    },
    {
      id: 'tone',
      name: 'Reply tone',
      source: 'Read from the page',
      shape: 'Professional, casual, friendly, technical or witty',
      editable: true,
      uses: { replies: 'Sets how every draft sounds.' },
      ifEmpty: 'Drafts default to friendly.',
    },
    {
      id: 'extras',
      name: 'Objections and success stories',
      source: 'Read from the page',
      shape: 'Up to 5 objections, one text field',
      editable: false,
      uses: {},
      ifEmpty: 'Nothing changes: they’re kept with your profile, but scans and replies don’t read them today.',
    },
  ] satisfies Field[],
};

export const LIMITS = {
  pill: 'Blind spots',
  title: 'What the analysis can’t see',
  items: [
    { title: 'Anything past the first page', body: 'It reads the URL you give it, not your docs, blog or pricing page. Give it the page that explains the product best.' },
    { title: 'Competitors your site doesn’t name', body: 'It only lists competitors the page mentions. If yours doesn’t, the competitor search and the +25 for naming one stay off.' },
    { title: 'Pages that are mostly script', body: 'Some sites render their text in the browser. If fewer than 50 characters come back, setup continues and you fill the profile in yourself.' },
    { title: 'Text past 8,000 characters', body: 'Long pages are cut. What’s near the top counts most.' },
    { title: 'A second run', body: 'It runs once, during setup. Afterwards you change the profile in Settings: name, description, audience, value proposition and reply tone.' },
  ],
};

export const FAQ = [
  {
    q: 'What does Reddix’s website analysis read?',
    a: 'The main text of the single page at the URL you enter, without menus or footers. It sends the first 8,000 characters to the AI, which writes your product profile from them.',
  },
  {
    q: 'Which URL should I give it?',
    a: 'The page that says most plainly what the product does, who it’s for and what it replaces. For most products that’s the homepage. A page that names the tools you compete with gives the profile competitors to watch for.',
  },
  {
    q: 'What happens if the analysis fails?',
    a: 'Setup carries on. Your product name and URL are saved, Reddix still suggests subreddits from them, and you can write the description, audience and value proposition yourself in Settings.',
  },
  {
    q: 'Can I edit what it learned?',
    a: 'Yes, in Settings: product name, description, target audience, value proposition and reply tone. When you change product details, the search phrases are rewritten on your next scan. Features, competitors and pricing model keep the values from the analysis.',
  },
  {
    q: 'Does Reddix post on my website or my Reddit account?',
    a: 'No. The analysis only reads one public page. Reddix never posts anywhere for you: it finds threads and drafts replies that you edit and post yourself.',
  },
];

export const NEXT = {
  links: [
    { to: '/features/subreddit-discovery', title: 'Subreddit discovery', body: 'How the profile becomes a list of communities.' },
    { to: '/features/intent-detection', title: 'Intent detection', body: 'How posts are scored against the profile.' },
    { to: '/features/ai-replies', title: 'AI replies', body: 'Drafts written from the profile and the thread.' },
  ],
  cta: {
    title: 'Start with your URL',
    body: 'Reddix reads it during setup, shows you what it learned, and picks your first subreddits from it.',
    button: 'Analyze my site',
  },
};
