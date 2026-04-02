export interface CompetitorFeature {
  name: string;
  competitor: boolean | string;
  reddix: boolean | string;
}

export interface Competitor {
  slug: string;
  name: string;
  tagline: string;
  status: 'active' | 'shutdown';
  statusNote?: string;
  description: string;
  weakness: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  whyReddixWins: string[];
  features: CompetitorFeature[];
  verdict: { competitor: string; reddix: string };
}

export const competitors: Competitor[] = [
  {
    slug: 'gummysearch',
    name: 'GummySearch',
    tagline: 'Audience research tool (Shut down Nov 2025)',
    status: 'shutdown',
    statusNote: 'Shut down in November 2025',
    description: 'GummySearch was a popular Reddit audience research tool that helped marketers explore subreddits and find discussions. It shut down in November 2025, leaving thousands of users looking for a replacement.',
    weakness: 'No longer available — shut down permanently',
    metaTitle: 'Reddix vs GummySearch — Best GummySearch Alternative in 2026',
    metaDescription: 'GummySearch shut down in 2025. Reddix is the best alternative with AI-powered lead scoring, autonomous scanning, and smart reply drafts. Migrate in 2 minutes.',
    heroSubtitle: 'GummySearch shut down. Reddix picks up where it left off — with 10x more power. AI lead scoring, autonomous 24/7 scanning, and reply drafts that actually convert.',
    whyReddixWins: [
      'GummySearch shut down in Nov 2025 — Reddix is actively developed and growing',
      'AI-powered intent scoring (0–100) identifies real buyers, not just mentions',
      'Autonomous 24/7 scanning means you never miss a high-intent thread',
      'Smart reply drafts help you engage naturally without sounding salesy',
      'One-click subreddit discovery finds communities you didn\'t know existed',
    ],
    features: [
      { name: 'Currently available', competitor: false, reddix: true },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'Autonomous 24/7 scanning', competitor: false, reddix: true },
      { name: 'AI reply drafts', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: true, reddix: true },
      { name: 'Keyword monitoring', competitor: true, reddix: true },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Duplicate filtering', competitor: false, reddix: true },
      { name: 'Audience research', competitor: true, reddix: true },
    ],
    verdict: { competitor: '💀 Shut down', reddix: '🚀 Active & growing' },
  },
  {
    slug: 'redreach',
    name: 'RedReach',
    tagline: 'Manual Reddit outreach tool',
    status: 'active',
    description: 'RedReach is a Reddit outreach tool that helps marketers find and engage with Reddit conversations. However, it relies heavily on manual workflows and lacks autonomous scanning capabilities.',
    weakness: 'No autonomous scanning — requires constant manual effort',
    metaTitle: 'Reddix vs RedReach — Why SaaS Founders Switch to Reddix',
    metaDescription: 'Compare Reddix vs RedReach for Reddit lead generation. Reddix offers autonomous AI scanning, intent scoring, and reply drafts. RedReach requires manual work.',
    heroSubtitle: 'RedReach makes you do the heavy lifting. Reddix runs on autopilot — scanning, scoring, and drafting replies while you focus on closing deals.',
    whyReddixWins: [
      'Fully autonomous scanning — Reddix works 24/7, RedReach needs you online',
      'AI intent scoring separates hot leads from noise automatically',
      'Smart reply drafts save 3+ hours per day on outreach',
      'Built-in lead CRM tracks every conversation from discovery to conversion',
      'Subreddit discovery AI finds hidden communities RedReach can\'t surface',
    ],
    features: [
      { name: 'Autonomous 24/7 scanning', competitor: false, reddix: true },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'AI reply drafts', competitor: false, reddix: true },
      { name: 'Keyword search', competitor: true, reddix: true },
      { name: 'Subreddit discovery', competitor: 'Manual', reddix: 'AI-powered' },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Duplicate filtering', competitor: false, reddix: true },
      { name: 'Scheduled scans', competitor: false, reddix: true },
      { name: 'Time to first lead', competitor: '2–4 hours', reddix: '2 minutes' },
    ],
    verdict: { competitor: '😓 Manual grind', reddix: '🚀 Autopilot' },
  },
  {
    slug: 'redditor-ai',
    name: 'Redditor AI',
    tagline: 'Auto-posting bot for Reddit',
    status: 'active',
    description: 'Redditor AI focuses on automated Reddit posting and commenting. While it automates engagement, its bot-like approach risks account bans and violates Reddit\'s terms of service.',
    weakness: 'Auto-posting risks bans — violates Reddit TOS',
    metaTitle: 'Reddix vs Redditor AI — Lead Gen Without Getting Banned',
    metaDescription: 'Redditor AI auto-posts and risks bans. Reddix finds leads and drafts human-sounding replies you post yourself. Safe, effective Reddit lead generation.',
    heroSubtitle: 'Redditor AI auto-posts for you and risks your account. Reddix finds the leads and drafts replies — you stay in control and keep your reputation intact.',
    whyReddixWins: [
      'No ban risk — Reddix drafts replies for you to review and post manually',
      'Intent scoring finds actual buyers, not random threads to spam',
      'Human-in-the-loop approach builds trust instead of destroying it',
      'AI replies sound natural and context-aware, not templated',
      'Focus on quality leads, not volume of posts that get downvoted',
    ],
    features: [
      { name: 'Ban-safe approach', competitor: false, reddix: true },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'Human-in-the-loop replies', competitor: false, reddix: true },
      { name: 'Auto-posting', competitor: true, reddix: false },
      { name: 'Lead scoring', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: false, reddix: true },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Context-aware AI drafts', competitor: 'Templates', reddix: 'AI-generated' },
      { name: 'Reddit TOS compliant', competitor: false, reddix: true },
    ],
    verdict: { competitor: '🚫 Ban risk', reddix: '✅ Safe & effective' },
  },
  {
    slug: 'subredditsignals',
    name: 'SubredditSignals',
    tagline: 'Reddit monitoring & alerts',
    status: 'active',
    description: 'SubredditSignals monitors subreddits for keyword mentions and sends alerts. It\'s monitoring-only — no lead scoring, no AI replies, and no way to prioritize which threads actually matter.',
    weakness: 'Monitoring only — no AI replies or lead scoring',
    metaTitle: 'Reddix vs SubredditSignals — Beyond Simple Monitoring',
    metaDescription: 'SubredditSignals monitors keywords. Reddix goes further with AI intent scoring, lead ranking, reply drafts, and autonomous scanning. Full Reddit lead gen stack.',
    heroSubtitle: 'SubredditSignals tells you something happened. Reddix tells you what matters, scores the intent, and drafts your reply — all before your coffee gets cold.',
    whyReddixWins: [
      'Goes beyond monitoring — AI scores every lead for buying intent',
      'Smart reply drafts turn alerts into conversations automatically',
      'Lead CRM tracks your pipeline from first mention to conversion',
      'AI-powered subreddit discovery finds communities you\'re missing',
      'Duplicate filtering means you never waste time on seen posts',
    ],
    features: [
      { name: 'Keyword monitoring', competitor: true, reddix: true },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'AI reply drafts', competitor: false, reddix: true },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: false, reddix: 'AI-powered' },
      { name: 'Duplicate filtering', competitor: false, reddix: true },
      { name: 'Scheduled 24/7 scans', competitor: 'Basic alerts', reddix: 'Full automation' },
      { name: 'Lead prioritization', competitor: false, reddix: true },
      { name: 'Email alerts', competitor: true, reddix: true },
    ],
    verdict: { competitor: '📡 Monitoring only', reddix: '🚀 Full lead gen' },
  },
  {
    slug: 'communitytracker',
    name: 'CommunityTracker',
    tagline: 'Reddit analytics & insights',
    status: 'active',
    description: 'CommunityTracker provides analytics and insights for Reddit communities. Great for research, but it focuses on data and trends rather than actionable lead generation.',
    weakness: 'Analytics-heavy — limited lead scoring and no reply assistance',
    metaTitle: 'Reddix vs CommunityTracker — Analytics to Action',
    metaDescription: 'CommunityTracker shows Reddit analytics. Reddix turns Reddit data into qualified leads with AI scoring, reply drafts, and autonomous scanning.',
    heroSubtitle: 'CommunityTracker gives you charts. Reddix gives you customers. Turn Reddit analytics into a qualified lead pipeline with AI that actually converts.',
    whyReddixWins: [
      'Action-oriented — every feature drives toward converting leads',
      'AI intent scoring turns data points into ranked opportunities',
      'Reply drafts transform insights into conversations',
      'Autonomous scanning means insights arrive, not just reports',
      'Built for SaaS founders who need revenue, not dashboards',
    ],
    features: [
      { name: 'Community analytics', competitor: true, reddix: 'Focused' },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'AI reply drafts', competitor: false, reddix: true },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: true, reddix: 'AI-powered' },
      { name: 'Trend analysis', competitor: true, reddix: 'Lead-focused' },
      { name: 'Autonomous scanning', competitor: false, reddix: true },
      { name: 'Actionable outputs', competitor: 'Reports', reddix: 'Qualified leads' },
      { name: 'Time to value', competitor: 'Hours of analysis', reddix: '2 minutes' },
    ],
    verdict: { competitor: '📊 Analytics', reddix: '🎯 Revenue' },
  },
  {
    slug: 'replyagent',
    name: 'ReplyAgent',
    tagline: 'Managed Reddit engagement service',
    status: 'active',
    description: 'ReplyAgent offers managed Reddit engagement where their team handles outreach for you. It\'s a done-for-you service model — effective but expensive and slow to scale.',
    weakness: 'Managed service model — expensive and hard to scale',
    metaTitle: 'Reddix vs ReplyAgent — Self-Service Reddit Lead Gen',
    metaDescription: 'ReplyAgent is a managed service that\'s expensive. Reddix gives you the same results with AI automation at a fraction of the cost. Start free.',
    heroSubtitle: 'ReplyAgent charges agency prices for manual work. Reddix gives you AI-powered autonomy at a fraction of the cost — and you keep full control.',
    whyReddixWins: [
      '10x more affordable than managed service pricing',
      'Full control — you approve every reply before it goes live',
      'AI works 24/7 without billable hours or timezone delays',
      'Scales instantly — no waiting for account managers',
      'Self-serve setup in 2 minutes, not weeks of onboarding',
    ],
    features: [
      { name: 'Setup time', competitor: '1–2 weeks', reddix: '2 minutes' },
      { name: 'AI intent scoring (0–100)', competitor: 'Manual review', reddix: 'Automated AI' },
      { name: 'Reply generation', competitor: 'Human writers', reddix: 'AI + your review' },
      { name: 'Full user control', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: 'Manual research', reddix: 'AI-powered' },
      { name: 'Lead CRM & tracking', competitor: 'External', reddix: 'Built-in' },
      { name: 'Scales without cost increase', competitor: false, reddix: true },
      { name: '24/7 autonomous scanning', competitor: 'Business hours', reddix: 'Always on' },
      { name: 'Cost per month', competitor: '$500–2000+', reddix: 'From $0' },
    ],
    verdict: { competitor: '💸 Expensive', reddix: '⚡ 10x cheaper' },
  },
  {
    slug: 'reddleads',
    name: 'ReddLeads',
    tagline: 'Basic Reddit keyword tracker',
    status: 'active',
    description: 'ReddLeads provides basic keyword matching for Reddit threads. It finds mentions but lacks AI-powered intent detection, so you spend hours sifting through low-quality matches.',
    weakness: 'Basic keyword matching — no AI intent detection',
    metaTitle: 'Reddix vs ReddLeads — AI Intent vs Basic Keywords',
    metaDescription: 'ReddLeads does basic keyword matching. Reddix uses AI to score buying intent, rank leads, and draft context-aware replies. Smarter Reddit lead generation.',
    heroSubtitle: 'ReddLeads finds keyword matches. Reddix finds buyers. AI intent scoring cuts through the noise so you only see leads that are ready to convert.',
    whyReddixWins: [
      'AI intent scoring (0–100) separates buyers from browsers',
      'Context-aware reply drafts that match each thread\'s tone',
      'Autonomous scanning means leads arrive without manual search',
      'Lead CRM tracks the full journey from mention to conversion',
      'Smart subreddit discovery uncovers communities keyword tools miss',
    ],
    features: [
      { name: 'Keyword matching', competitor: true, reddix: true },
      { name: 'AI intent scoring (0–100)', competitor: false, reddix: true },
      { name: 'AI reply drafts', competitor: false, reddix: true },
      { name: 'Lead CRM & tracking', competitor: false, reddix: true },
      { name: 'Subreddit discovery', competitor: false, reddix: 'AI-powered' },
      { name: 'Duplicate filtering', competitor: false, reddix: true },
      { name: 'Autonomous 24/7 scanning', competitor: false, reddix: true },
      { name: 'Lead prioritization', competitor: false, reddix: true },
      { name: 'Context-aware scoring', competitor: 'Keyword only', reddix: 'Full AI analysis' },
    ],
    verdict: { competitor: '🔤 Keywords only', reddix: '🧠 AI-powered' },
  },
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
