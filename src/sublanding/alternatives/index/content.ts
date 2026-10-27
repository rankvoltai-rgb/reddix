/**
 * Every word on /alternatives. Pure data: the page renders it and crawler.ts
 * turns it into the HTML crawlers read. Tool facts live in directory.ts.
 */
import { CHECKED_LABEL } from '../reddix';

export const PATH = '/alternatives';

export const META = {
  query: 'reddix alternatives',
  title: 'Reddix Alternatives: A Field Guide to Reddit Lead Tools | Reddix',
  description:
    '15 Reddit lead and monitoring tools sorted by what they do on Reddit, from alerts to posting for you. Prices and status checked October 2026.',
};

export const HERO = {
  pill: 'Alternatives',
  h1: 'Reddix alternatives: a field guide to Reddit lead tools',
  accent: 'a field guide',
  answer:
    'The tools that find customers on Reddit differ most in one thing: what they do on Reddit for you. Some only send alerts, some rank threads and draft replies for you to post, and some message, comment or sell engagement on your behalf. This guide puts 15 of them on that line, with prices and status checked against each tool’s own site.',
  checked: `Checked ${CHECKED_LABEL}`,
  cta: 'Try Reddix free for 7 days',
  secondary: 'Find the right fit',
};

export const LINE = {
  pill: 'The one question',
  title: 'Who acts on Reddit: you, or the tool?',
  body: 'Features overlap across this category, so feature lists don’t sort it. What does: how far the tool goes on Reddit itself. Each step to the right saves you more time, and moves more of what’s said in your name out of your hands.',
  rules: {
    title: 'What Reddit’s own rules say',
    items: [
      {
        text: 'Reddit defines spam as repeated or unsolicited actions, automated or manual, that harm users or communities. Its examples include mass unsolicited messages and bots that keep promoting products.',
        source: 'Reddit Help: Spam',
        url: 'https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam',
      },
      {
        text: 'Using multiple accounts, voting services or automation to change vote counts is vote manipulation.',
        source: 'Reddit Help: Disrupting Communities',
        url: 'https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities',
      },
      {
        text: 'Each subreddit adds its own rules on self-promotion and links, enforced by its moderators.',
        source: 'Reddit Help: Disrupting Communities',
        url: 'https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities',
      },
    ],
    note: 'These rules apply to what gets posted, whoever or whatever posts it. That includes replies you write with Reddix.',
  },
};

export const FINDER = {
  pill: 'Fit finder',
  title: 'Three questions, a short list',
  body: 'Answer for your team, not for a vendor. The list updates from the same data as the directory below.',
  questions: {
    reach: {
      label: 'Where do you need to listen?',
      options: [
        { id: 'reddit', label: 'Reddit is enough' },
        { id: 'many', label: 'Reddit and other platforms' },
      ],
    },
    hands: {
      label: 'Who should post?',
      options: [
        { id: 'me', label: 'Me, from my own account' },
        { id: 'tool', label: 'The tool or a service' },
      ],
    },
    budget: {
      label: 'Monthly budget',
      options: [
        { id: 'free', label: 'Free' },
        { id: 'under50', label: 'Under $50' },
        { id: 'any', label: 'Whatever fits' },
      ],
    },
  },
  empty: 'Nothing on the list matches all three. Loosen the budget, or the platforms.',
};

export const DIRECTORY = {
  pill: 'Directory',
  title: 'All 15, by what they do on Reddit',
  body: 'Each name opens a full comparison with Reddix: what the tool does well, where it differs, and the sources behind every claim.',
};

export const GONE = {
  pill: 'Gone from Reddit',
  title: 'Three tools that no longer serve Reddit',
  body: 'If you used one of these, your workflow needs a new home. Each page covers what to move, and what Reddix does and doesn’t replace.',
};

export const ALSO_SECTION = {
  title: 'Also in the category',
  body: 'Tools we haven’t compared in depth yet. Each line comes from the tool’s own site, checked October 2026.',
};

export const METHOD = {
  title: 'How this guide was made',
  items: [
    'Every fact about another tool comes from that tool’s own site, pricing page, docs or announcements, opened in October 2026. Each comparison page lists its sources.',
    'Prices change. Where a vendor’s page contradicted itself, the comparison says so rather than picking a number.',
    'Tools we couldn’t confirm exist, or whose site no longer loads, were left out.',
    'Reddix makes this guide, so read it with that in mind. Each comparison says where the other tool is the better choice.',
  ],
};

export const FAQ = [
  {
    q: 'What is the best alternative to Reddix?',
    a: 'It depends on the job. For keyword alerts, F5Bot and Syften do what Reddix doesn’t: Reddix sends no alerts. For Reddit plus other platforms, CommunityTracker and Syften cover more ground. The closest tools to Reddix, which find threads and draft replies you post yourself, are ReplyDaddy, SubredditSignals and ReddLeads.',
  },
  {
    q: 'Is there a free alternative?',
    a: 'Yes. F5Bot’s free plan sends keyword alerts for personal use, CommunityTracker’s free plan tracks one Reddit keyword, and ReplyDaddy has a free plan. Reddix has no free plan; Premium comes with a 7-day free trial.',
  },
  {
    q: 'What happened to GummySearch?',
    a: 'GummySearch closed to new users in November 2025 and shuts down on December 1, 2026, when user data is deleted. It said it couldn’t get a commercial licence for Reddit’s API. Export anything you need before that date.',
  },
  {
    q: 'Are tools that post for you against Reddit’s rules?',
    a: 'Reddit’s spam policy covers repeated or unsolicited actions whether automated or manual, and its rules on disrupting communities cover vote manipulation through multiple accounts or automation. Whether a given tool’s use breaks them depends on what gets posted and how. Subreddit rules apply on top. Read each tool’s own description next to Reddit’s rules and judge for yourself.',
  },
  {
    q: 'How current is this information?',
    a: 'Every tool was checked against its own site in October 2026, and each comparison page lists the pages it relied on. Vendors change prices and plans, so confirm on their site before you buy.',
  },
];

export const CLOSE = {
  title: 'If you want to post every reply yourself',
  body: 'Reddix scores Reddit threads against your product and drafts three replies for each one. You choose, edit and post. Nothing goes up without you.',
  button: 'Try Reddix free for 7 days',
};
