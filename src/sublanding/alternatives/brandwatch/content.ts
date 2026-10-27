/**
 * Every word on /alternatives/brandwatch. Pure data: the page renders it and
 * crawler.ts turns it into the HTML crawlers read.
 *
 * Brandwatch facts come only from RESEARCH.md (checked 2026-10-27), mostly its
 * own help centre; Reddix facts only from ../reddix. Uncertain items in the
 * research (the 1.7 trillion archive figure, any Cision–Reddit extension, whether
 * the 2023 partnership terms still apply) are not used.
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';

export const PATH = '/alternatives/brandwatch';

export const META = {
  query: 'brandwatch alternative for reddit',
  title: 'Brandwatch Alternative for Reddit Leads (2026 Changes) | Reddix',
  description:
    'Brandwatch is an enterprise listening suite whose Reddit data changed in August 2026. Reddix finds Reddit posts ready to buy. Who each fits, checked October 2026.',
};

export const HERO = {
  pill: `Reddix vs Brandwatch · Checked ${CHECKED_LABEL}`,
  h1: 'Brandwatch is for studying a market. Reddix is for answering one thread.',
  accent: 'answering one thread.',
  answer:
    'Brandwatch, part of Cision, is an enterprise suite for social listening, analytics, publishing and influencer marketing across dozens of networks, sold through a sales demo with no published prices. Reddix is a self-serve tool for one job on one network: it finds Reddit posts from people looking for a product like yours, scores them 0–100 and drafts replies you post yourself. Since August 28, 2026, Brandwatch’s own help centre says Reddit content can reach it hours late, which matters if the goal is to reply while a thread is active.',
  cta: 'Find buyers on Reddit',
};

/** The hero's fact card. */
export const DOSSIER = [
  { k: 'Owner', v: 'Cision, since June 2021' },
  { k: 'Pricing', v: 'Not published; sold through a demo' },
  { k: 'Covers', v: 'Dozens of networks, news, blogs, forums and reviews' },
  { k: 'Reddit since Aug 28, 2026', v: 'About 55% of content within an hour; some up to about 30 hours' },
  { k: 'Reddit history', v: '13 months in Consumer Research; 12 in Listen (24 with an add-on)' },
];

export const BUYERS = {
  title: 'Built for different buyers',
  body: 'The two rarely compete for the same budget line. This is the shape of each.',
  rows: [
    { k: 'Who buys it', brandwatch: 'Brand, insights, PR, research and social teams at larger companies and agencies.', reddix: 'Founders, marketers and small teams who sell a product and want customers from Reddit.' },
    { k: 'How you buy', brandwatch: 'Book a demo. Its plans page names “standard to enterprise plans” without prices.', reddix: `Sign up and pay online. ${REDDIX.pricing.premium.trial}.` },
    { k: 'Price', brandwatch: 'Not published.', reddix: `$${REDDIX.pricing.premium.price}/month, or $${REDDIX.pricing.lifetime.price} once for Lifetime.` },
    { k: 'Networks', brandwatch: 'Dozens of social networks plus news, broadcast, blogs, forums and reviews.', reddix: 'Reddit only.' },
    { k: 'What it gives you', brandwatch: 'Dashboards, trend and sentiment analysis, audience panels, alerts, plus publishing, an engagement inbox, ads and influencer tools.', reddix: `A ranked list of Reddit posts with a 0–100 score, and three reply drafts per thread.` },
    { k: 'Reddit posting', brandwatch: 'Its suite publishes to social networks; posting or replying on Reddit specifically isn’t mentioned on its site.', reddix: `${REDDIX.posting}.` },
  ],
};

/** Brandwatch and Reddit, from its press releases and help centre. */
export const TIMELINE = {
  title: 'What changed in Brandwatch’s Reddit data',
  body: 'Brandwatch has carried Reddit data since 2017. A help-centre article sets out changes that took effect on August 28, 2026. It gives no reason for them.',
  events: [
    { when: 'June 2017', what: 'Brandwatch adds Reddit data to its product.' },
    { when: 'January 2023', what: 'Joins Reddit’s official partner programme, per its May 2023 release, which also announced Reddit audience panels.' },
    { when: 'August 28, 2026', what: 'New Reddit coverage: content arrives over hours rather than minutes, history is capped, and several Reddit fields are removed.' },
    { when: 'September 30, 2026', what: 'Legacy Reddit history stops being available.' },
    { when: 'Q1 2027', what: 'A new Potential Audience metric for Reddit is planned.' },
  ],
  removedTitle: 'Reddit fields removed in the change',
  removed: ['Reddit Score', 'Upvote percentage', 'Post and author flair', 'NSFW flag', 'Subreddit subscribers and topics', 'Engagement Score for Reddit', 'Potential Audience'],
  kept: 'Kept: Reddit Social Panels, sentiment and emotion analysis, subreddit queries, alerts and API access. Comment counts now count root-post comments only, and complete subreddit coverage isn’t guaranteed.',
};

/** Brandwatch's published arrival figures for Reddit content since Aug 28, 2026. */
export const ARRIVAL = [
  { hours: 1, share: 55 },
  { hours: 2, share: 81 },
  { hours: 3, share: 89 },
] as const;
export const ARRIVAL_TAIL_HOURS = 30;

export const CLOCK = {
  title: 'How late is too late to reply?',
  body: 'Set how soon after a Reddit post you’d want to be in the thread. The clock reads Brandwatch’s own published arrival figures for Reddit content, and says only what those figures support.',
  label: 'You want to reply within',
  reddix: 'Reddix has no data feed to wait for: it searches Reddit when you press Scan, so it finds what that search returns at that moment, and nothing until you scan.',
  note: 'Brandwatch publishes three points (1, 2 and 3 hours) and a tail of up to about 30 hours. Between those points the share is only known to be at least the last published figure.',
};

export const RIGHT_CHOICE = {
  title: 'When Brandwatch is the right choice',
  items: [
    { title: 'You study markets, not threads', body: 'Trend analysis, sentiment and emotion, and audience segmentation across years of conversation are what it’s built for.' },
    { title: 'Reddit is one network of many', body: 'If you need TikTok, Instagram, X, LinkedIn, news and reviews in the same dashboard, a Reddit-only tool can’t do that job.' },
    { title: 'You run social, not just listening', body: 'Publishing calendars, a shared engagement inbox, ad management and influencer marketing come in the same suite.' },
    { title: 'You need enterprise process', body: 'Custom classifiers, exports, APIs and a sales-led contract suit organisations that buy that way.' },
  ],
};

export const ALREADY = {
  title: 'Already paying for Brandwatch?',
  body: 'You may not need anything else for basic Reddit monitoring. Its help centre says alerts still include Reddit content, subject to the new latency, and Listen keeps a subreddit operator. Where Reddix adds something is the narrow job of finding Reddit posts from people ready to choose a tool, ranking them, and drafting a reply you post yourself. Some teams keep Brandwatch for research and add Reddix for that.',
};

export const FAQ = [
  {
    q: 'How much does Brandwatch cost?',
    a: 'Brandwatch doesn’t publish prices. Its plans page lists “standard to enterprise plans” for each product and offers a demo; no free trial is mentioned (checked October 2026).',
  },
  {
    q: 'Does Brandwatch still have Reddit data?',
    a: 'Yes. Its help centre says Reddit is still ingested in Consumer Research and Social Media Management Listen. Since August 28, 2026 content can take hours to arrive, history is capped at 12–13 months, and several Reddit fields, including score, were removed.',
  },
  {
    q: 'Is Reddix a social listening tool?',
    a: 'Not in Brandwatch’s sense. Reddix doesn’t chart trends, sentiment or share of voice, and it covers only Reddit. It finds individual posts from likely buyers, scores them 0–100 against your product and drafts replies.',
  },
  {
    q: 'Can Reddix replace Brandwatch?',
    a: 'Only if all you used Brandwatch for was finding Reddit threads to answer. For cross-network research, publishing or influencer work, it can’t.',
  },
  {
    q: 'Does Reddix get Reddit posts in real time?',
    a: 'No. Reddix has no live feed or alerts. It searches Reddit when you run a scan, at most once every 5 minutes, and saves the posts worth answering.',
  },
];

export const SOURCES = [
  { label: 'Brandwatch help centre: Overview of changes to Brandwatch’s Reddit coverage (August 2026)', url: 'https://social-media-management-help.brandwatch.com/en/articles/16414214-overview-of-changes-to-brandwatch-s-reddit-coverage-august-2026' },
  { label: 'Brandwatch: plans', url: 'https://www.brandwatch.com/plans/' },
  { label: 'Brandwatch: our suite', url: 'https://www.brandwatch.com/suite/' },
  { label: 'Brandwatch: data networks', url: 'https://www.brandwatch.com/datanetworks/' },
  { label: 'Brandwatch: Cision closes Brandwatch acquisition (2021)', url: 'https://www.brandwatch.com/press/press-releases/cision-closes-brandwatch-acquisition/' },
  { label: 'Brandwatch: first social intelligence provider to offer Reddit data (2017)', url: 'https://www.brandwatch.com/press/press-releases/brandwatch-becomes-first-social-intelligence-provider-compliantly-offer-access-reddit-data/' },
  { label: 'PR Newswire: Brandwatch boosts audience analysis with Reddit data (May 2023)', url: 'https://www.prnewswire.co.uk/news-releases/brandwatch-further-boosts-its-deep-audience-analysis--intelligence-capabilities-with-reddit-data-301834252.html' },
];

export const CLOSING = {
  title: 'For the thread that’s open right now',
  body: 'Add your site, pick subreddits and run a scan. Reddix ranks the posts and drafts the replies.',
  cta: 'Find buyers on Reddit',
};
