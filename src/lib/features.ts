import {
  Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield,
  type LucideIcon,
} from 'lucide-react';

export interface FeatureBenefit {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface FeatureUseCase {
  persona: string;
  scenario: string;
  outcome: string;
}

export interface FeatureFAQ {
  q: string;
  a: string;
}

export interface FeatureData {
  slug: string;
  title: string;
  tagline: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  demoHeadline: string;
  demoDescription: string;
  demoStats: { label: string; value: string }[];
  benefits: FeatureBenefit[];
  useCases: FeatureUseCase[];
  faq: FeatureFAQ[];
  relatedSlugs: string[];
}

export const features: FeatureData[] = [
  {
    slug: 'intent-detection',
    title: 'Intent Detection',
    tagline: 'AI spots buying signals, not vanity mentions',
    heroSubtitle: 'Stop wasting time on casual mentions. Our NLP engine reads between the lines to surface posts where people are actively looking to buy, switch, or evaluate tools like yours.',
    metaTitle: 'Reddit Intent Detection Tool — Find Buyers, Not Browsers | Reddix',
    metaDescription: 'Reddix uses AI-powered intent detection to surface Reddit posts with genuine buying signals. Find users actively seeking tools like yours.',
    icon: Zap,
    demoHeadline: 'See intent signals in real time',
    demoDescription: 'Our AI analyzes every post for language patterns that indicate purchase readiness — phrases like "looking for," "need a tool that," "switching from," and "any recommendations." Each signal is highlighted and categorized.',
    demoStats: [
      { label: 'Signals tracked', value: '140+' },
      { label: 'Accuracy rate', value: '94%' },
      { label: 'Avg. detection time', value: '<2s' },
      { label: 'Languages', value: 'EN' },
    ],
    benefits: [
      { title: 'Beyond keyword matching', desc: 'Our NLP engine understands context, sarcasm, and implicit needs — not just exact-match keywords.', icon: Zap },
      { title: 'Real-time processing', desc: 'Posts are analyzed within seconds of being published, so you never miss a time-sensitive opportunity.', icon: Clock },
      { title: 'Signal categorization', desc: 'Each detected intent is tagged: comparison shopping, pain point, recommendation request, or migration signal.', icon: Target },
      { title: 'Noise reduction', desc: 'Filters out rants, memes, and off-topic mentions that waste your time, letting only actionable posts through.', icon: Shield },
    ],
    useCases: [
      { persona: 'SaaS Founder', scenario: 'A user posts "frustrated with [competitor], need something simpler." Reddix flags it as a migration signal with high intent.', outcome: 'Replied within 10 minutes, booked a demo call the same day.' },
      { persona: 'Marketing Agency', scenario: 'Multiple posts in a niche subreddit ask "what tools do you use for X?" Reddix surfaces all of them in one scan.', outcome: 'Generated 12 qualified leads from a single subreddit in one week.' },
      { persona: 'Indie Hacker', scenario: 'Someone describes the exact problem your product solves without naming any tool. Reddix detects the implicit buying signal.', outcome: 'First paying customer acquired through a helpful Reddit reply.' },
    ],
    faq: [
      { q: 'How does intent detection differ from keyword monitoring?', a: 'Keyword monitoring finds posts containing specific words. Intent detection understands the meaning behind the words — detecting purchase readiness, comparison shopping, and pain points even when your keywords aren\'t explicitly mentioned.' },
      { q: 'What types of intent signals does Reddix detect?', a: 'We detect recommendation requests ("what tool should I use"), comparison shopping ("X vs Y"), pain points ("frustrated with"), migration signals ("switching from"), and explicit purchase intent ("looking to buy").' },
      { q: 'Can I customize what counts as a buying signal?', a: 'Your product profile, keywords, and competitor names all feed into the detection model. The more context you provide during setup, the more precisely Reddix can identify relevant intent.' },
      { q: 'How accurate is the intent detection?', a: 'Our models achieve 94% accuracy on categorizing intent levels. Hot leads (clear buying signals) have a 3-5x higher engagement rate compared to generic keyword matches.' },
    ],
    relatedSlugs: ['lead-scoring', 'ai-replies', 'natural-tone'],
  },
  {
    slug: 'lead-scoring',
    title: 'Lead Scoring',
    tagline: 'Every lead scored 0–100 for purchase readiness',
    heroSubtitle: 'Not all Reddit mentions are created equal. Our scoring algorithm weighs intent strength, recency, engagement, and subreddit relevance to rank every lead so you focus on the ones most likely to convert.',
    metaTitle: 'Reddit Lead Scoring — Prioritize High-Intent Leads | Reddix',
    metaDescription: 'Score every Reddit lead 0-100 based on buying intent, engagement, and relevance. Focus on what converts with Reddix lead scoring.',
    icon: Target,
    demoHeadline: 'Prioritize leads that convert',
    demoDescription: 'Each lead gets a composite score based on intent strength, post recency, subreddit authority, engagement level, and keyword relevance. Sort and filter by score to focus your energy where it matters most.',
    demoStats: [
      { label: 'Scoring factors', value: '8+' },
      { label: 'Hot lead threshold', value: '80+' },
      { label: 'Avg. hot leads/scan', value: '12' },
      { label: 'Conversion lift', value: '3.5x' },
    ],
    benefits: [
      { title: 'Multi-factor scoring', desc: 'Combines intent strength, recency, engagement patterns, subreddit relevance, and author history for a comprehensive score.', icon: Target },
      { title: 'Visual prioritization', desc: 'Color-coded labels — Hot, Warm, Research, Low — make it instant to identify high-value opportunities at a glance.', icon: BarChart3 },
      { title: 'Score explanations', desc: 'Each score comes with a breakdown so you understand why a lead ranks high and how to approach the conversation.', icon: MessageSquare },
      { title: 'Continuous learning', desc: 'The scoring model improves as you engage with leads — learning what converts for your specific product and audience.', icon: Zap },
    ],
    useCases: [
      { persona: 'Growth Marketer', scenario: 'Scans reveal 47 leads across 8 subreddits. Lead scoring surfaces the 6 hot leads (score 85+) with clear buying intent.', outcome: 'Focused on 6 leads instead of 47 — converted 3 into trials in one week.' },
      { persona: 'B2B Sales Rep', scenario: 'A lead scores 92 because the author is asking for enterprise features your product offers, in a high-authority subreddit.', outcome: 'Personalized reply led to a $12K ARR enterprise deal.' },
      { persona: 'Solo Founder', scenario: 'Limited time means replying to every lead isn\'t feasible. Lead scoring identifies the top 5 highest-potential posts daily.', outcome: 'Spent 20 minutes/day on Reddit, generated 8 signups in the first month.' },
    ],
    faq: [
      { q: 'What factors go into the lead score?', a: 'Intent signal strength, post age, subreddit relevance to your product, engagement (upvotes/comments), author activity patterns, keyword density, competitor mentions, and content depth.' },
      { q: 'What score indicates a hot lead?', a: 'Leads scoring 80+ are labeled "Hot" — these show clear buying intent. 60-79 is "Warm," 40-59 is "Research," and below 40 is "Low." Focus your energy on Hot and Warm leads for the best ROI.' },
      { q: 'Can I adjust the scoring weights?', a: 'The scoring algorithm adapts based on your product profile and engagement history. The more you use Reddix, the better it understands what a high-quality lead looks like for your specific product.' },
    ],
    relatedSlugs: ['intent-detection', 'analytics-dashboard', 'deduplication'],
  },
  {
    slug: 'ai-replies',
    title: 'AI Replies',
    tagline: 'Context-aware drafts that match subreddit culture',
    heroSubtitle: 'Generate Reddit replies that sound like a helpful community member, not a marketer. Our AI reads the full thread context, matches the subreddit tone, and weaves in your product naturally.',
    metaTitle: 'AI Reddit Reply Generator — Human-Sounding, Context-Aware | Reddix',
    metaDescription: 'Generate context-aware Reddit replies that match subreddit culture. AI drafts that sound human, add value, and mention your product naturally.',
    icon: MessageSquare,
    demoHeadline: 'Replies that sound human',
    demoDescription: 'Our AI reads the entire thread — original post, existing comments, subreddit rules, and community norms. It generates a reply that addresses the user\'s specific pain point while naturally positioning your product as a solution.',
    demoStats: [
      { label: 'Avg. generation time', value: '3s' },
      { label: 'Engagement rate', value: '4.2x' },
      { label: 'Tone options', value: '5' },
      { label: 'Spam flags', value: '0%' },
    ],
    benefits: [
      { title: 'Full context awareness', desc: 'Reads the original post, all comments, subreddit rules, and community culture before generating a reply.', icon: MessageSquare },
      { title: 'Tone matching', desc: 'Choose from professional, casual, friendly, technical, or witty — the AI adapts language, emoji usage, and formality level.', icon: Shield },
      { title: 'Natural product mentions', desc: 'Your product is woven into the reply as a genuine recommendation, never a sales pitch. Reads like a real user sharing what they use.', icon: Globe },
      { title: 'One-click editing', desc: 'Every draft is editable. Add personal touches, adjust the angle, then copy-paste directly into Reddit.', icon: Zap },
    ],
    useCases: [
      { persona: 'Dev Tool Founder', scenario: 'Technical subreddit post asks for CLI tools with specific features. AI generates a technically detailed reply that demonstrates domain expertise.', outcome: 'Reply got 23 upvotes and drove 15 signups from a single comment.' },
      { persona: 'Marketing Manager', scenario: 'Need to respond to 20+ leads per day across different subreddits with different cultures. AI adapts tone per subreddit.', outcome: 'Reduced reply time from 15 minutes to 2 minutes per lead.' },
      { persona: 'E-commerce Seller', scenario: 'Casual subreddit post asks for product recommendations. AI generates a friendly, relatable reply with social proof.', outcome: '5x increase in referral traffic from Reddit in one month.' },
    ],
    faq: [
      { q: 'Will my replies get flagged as spam?', a: 'No. Our AI is specifically trained to avoid promotional language patterns that trigger Reddit spam filters. Replies read like genuine community contributions, not marketing copy.' },
      { q: 'Can I edit the AI-generated replies?', a: 'Absolutely. Every reply is presented as a draft you can customize. Add personal anecdotes, adjust emphasis, or refine the wording before posting.' },
      { q: 'Does the AI post replies automatically?', a: 'No. Reddix generates drafts — you review, edit, and choose when to post. You maintain full control over what goes on your Reddit account.' },
      { q: 'What tone options are available?', a: 'Professional, casual, friendly, technical, and witty. Set a default tone in your profile, or switch per reply based on the subreddit culture.' },
    ],
    relatedSlugs: ['natural-tone', 'intent-detection', 'lead-scoring'],
  },
  {
    slug: 'subreddit-discovery',
    title: 'Subreddit Discovery',
    tagline: 'AI finds communities where your ICP hangs out',
    heroSubtitle: 'Stop guessing which subreddits matter. Our AI analyzes your product, audience, and keywords to recommend communities you didn\'t even know existed — where your ideal customers are actively discussing problems you solve.',
    metaTitle: 'AI Subreddit Discovery — Find Your ICP\'s Communities | Reddix',
    metaDescription: 'Discover subreddits where your ideal customers hang out. AI-powered community discovery based on your product and audience.',
    icon: Compass,
    demoHeadline: 'Discover untapped communities',
    demoDescription: 'Enter your product URL or describe your target audience. Our AI scans Reddit\'s ecosystem to find subreddits where your ideal customer profile is actively discussing relevant topics — including niche communities with high intent.',
    demoStats: [
      { label: 'Subreddits indexed', value: '2M+' },
      { label: 'Avg. discoveries', value: '15-30' },
      { label: 'Relevance accuracy', value: '91%' },
      { label: 'Analysis time', value: '<10s' },
    ],
    benefits: [
      { title: 'Beyond obvious subreddits', desc: 'Finds niche communities and adjacent interest groups where your ICP hangs out — places your competitors haven\'t discovered.', icon: Compass },
      { title: 'Relevance scoring', desc: 'Each suggested subreddit comes with a relevance score, subscriber count, and activity level so you can prioritize monitoring.', icon: Target },
      { title: 'Competitor mapping', desc: 'See which subreddits your competitors are being discussed in — and whether the sentiment is positive or negative.', icon: BarChart3 },
      { title: 'One-click monitoring', desc: 'Found a promising subreddit? Add it to your monitoring list with a single click and start receiving leads immediately.', icon: Zap },
    ],
    useCases: [
      { persona: 'Early-Stage Startup', scenario: 'New product with no existing user base. Subreddit discovery identifies 22 relevant communities from just a product URL.', outcome: 'Found first 50 users by engaging in 3 previously unknown niche subreddits.' },
      { persona: 'Competitor Analysis', scenario: 'Discovered 5 subreddits where a main competitor is frequently mentioned negatively.', outcome: 'Positioned product as the alternative in these communities, capturing churning customers.' },
      { persona: 'Market Expansion', scenario: 'Already monitoring r/SaaS and r/startups. Discovery reveals adjacent communities in specific industry verticals.', outcome: 'Expanded lead pipeline by 60% by monitoring industry-specific subreddits.' },
    ],
    faq: [
      { q: 'How does subreddit discovery work?', a: 'Our AI analyzes your product description, keywords, and target audience to map relevant topic clusters on Reddit. It then scores each subreddit for relevance, activity level, and intent density.' },
      { q: 'Can I discover subreddits without a website?', a: 'Yes. You can describe your product and audience manually, or provide keywords. The website analysis feature is optional but provides the most accurate results.' },
      { q: 'How many subreddits will it suggest?', a: 'Typically 15-30 subreddits ranked by relevance. Premium users can monitor unlimited subreddits from the discovered list.' },
    ],
    relatedSlugs: ['website-analysis', 'scheduled-scans', 'intent-detection'],
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    tagline: 'Track leads, replies, and conversion rates',
    heroSubtitle: 'See exactly how your Reddit lead generation is performing. Track leads discovered, replies sent, engagement rates, and conversion trends — all in one clean dashboard built for growth teams.',
    metaTitle: 'Reddit Lead Analytics Dashboard — Track & Optimize | Reddix',
    metaDescription: 'Track Reddit leads, replies, and conversions in one dashboard. Visualize your Reddit marketing performance with Reddix analytics.',
    icon: BarChart3,
    demoHeadline: 'Your Reddit pipeline, visualized',
    demoDescription: 'Real-time metrics on leads discovered, scan history, intent distribution, top-performing subreddits, and reply engagement. Filter by date range, intent level, or subreddit to drill into what\'s working.',
    demoStats: [
      { label: 'Metrics tracked', value: '12+' },
      { label: 'Update frequency', value: 'Real-time' },
      { label: 'Date range filters', value: '7/30/90d' },
      { label: 'Export formats', value: 'CSV' },
    ],
    benefits: [
      { title: 'Lead pipeline overview', desc: 'See total leads, hot/warm/research breakdown, and conversion funnel at a glance with real-time numbers.', icon: BarChart3 },
      { title: 'Subreddit performance', desc: 'Identify which subreddits produce the highest-quality leads and highest engagement rates for your product.', icon: Target },
      { title: 'Scan history', desc: 'Full log of every scan with posts analyzed, leads found, and timing — so you can optimize scan frequency.', icon: Clock },
      { title: 'Trend tracking', desc: 'Week-over-week and month-over-month trends show whether your Reddit pipeline is growing or needs adjustment.', icon: Zap },
    ],
    useCases: [
      { persona: 'VP of Marketing', scenario: 'Needs to report Reddit channel performance to the executive team with concrete numbers.', outcome: 'Dashboard data showed Reddit became the #2 lead source, justifying budget increase.' },
      { persona: 'Growth Team', scenario: 'A/B testing different reply tones and subreddit strategies. Dashboard tracks performance per approach.', outcome: 'Identified that technical tone in niche subreddits converts 2.3x better.' },
      { persona: 'Solo Founder', scenario: 'Wants a quick daily check on new leads without digging through Reddit.', outcome: 'Checks dashboard each morning, replies to hot leads in 5 minutes, moves on.' },
    ],
    faq: [
      { q: 'What metrics does the dashboard track?', a: 'Total leads, leads by intent level, scan history, top subreddits, reply count, engagement rates, daily/weekly/monthly trends, and conversion funnel stages.' },
      { q: 'Can I export dashboard data?', a: 'Yes. Premium users can export lead data and analytics as CSV for further analysis or reporting.' },
      { q: 'How often is the dashboard updated?', a: 'Metrics update in real-time as new scans complete and leads are discovered. No manual refresh needed.' },
    ],
    relatedSlugs: ['lead-scoring', 'scheduled-scans', 'intent-detection'],
  },
  {
    slug: 'scheduled-scans',
    title: 'Scheduled Scans',
    tagline: 'Auto-pilot scans Reddit 24/7 on your schedule',
    heroSubtitle: 'Set your scan frequency and let Reddix work while you sleep. Auto-pilot mode scans your configured subreddits and keywords on a schedule — surfacing fresh leads with AI replies ready to go.',
    metaTitle: 'Scheduled Reddit Scans — Auto-Pilot Lead Generation | Reddix',
    metaDescription: 'Schedule automatic Reddit scans every 6, 12, or 24 hours. Wake up to fresh leads with AI replies ready to post.',
    icon: Clock,
    demoHeadline: 'Set it and forget it',
    demoDescription: 'Choose your scan frequency — every 6 hours, 12 hours, or daily. Reddix automatically scans your selected subreddits and keywords, applies intent detection, scores each lead, and generates reply drafts. All waiting in your dashboard.',
    demoStats: [
      { label: 'Scan frequencies', value: '6/12/24h' },
      { label: 'Avg. posts/scan', value: '200+' },
      { label: 'Lead prep time', value: '0 min' },
      { label: 'Uptime', value: '99.9%' },
    ],
    benefits: [
      { title: 'Zero-effort monitoring', desc: 'Once configured, scans run automatically. No manual triggering needed — leads appear in your dashboard on schedule.', icon: Clock },
      { title: 'Fresh leads daily', desc: 'Morning check-in reveals overnight leads already scored and with reply drafts generated. Start your day with warm opportunities.', icon: Zap },
      { title: 'Frequency flexibility', desc: 'Scan every 6 hours for high-volume monitoring or daily for a lighter touch. Adjust anytime based on your capacity.', icon: Repeat },
      { title: 'Scan history log', desc: 'Every automated scan is logged with stats — posts scanned, leads found, hot/warm breakdown — for performance tracking.', icon: BarChart3 },
    ],
    useCases: [
      { persona: 'Time-Strapped Founder', scenario: 'Can\'t spend hours browsing Reddit. Sets up daily auto-pilot scans and checks leads each morning.', outcome: 'Went from 0 Reddit leads to 15/week with just 10 minutes of daily effort.' },
      { persona: 'Agency Managing Multiple Clients', scenario: 'Sets different scan frequencies for different client products. Each runs independently.', outcome: 'Scaled Reddit lead gen across 5 clients without additional headcount.' },
      { persona: 'Global Team', scenario: 'Team in different time zones. Scheduled scans ensure leads are always fresh regardless of who\'s online.', outcome: 'Reduced lead response time from 12 hours to 2 hours across time zones.' },
    ],
    faq: [
      { q: 'What scan frequencies are available?', a: 'Every 6 hours, every 12 hours, or once daily. Premium users can set any frequency. Free users get manual scans only.' },
      { q: 'Will I get duplicate leads from overlapping scans?', a: 'No. Reddix\'s deduplication engine ensures you never see the same Reddit post twice, even across multiple scheduled scans.' },
      { q: 'Can I pause scheduled scans?', a: 'Yes. Toggle auto-pilot on/off from your settings page at any time. Your configuration is saved so you can resume instantly.' },
    ],
    relatedSlugs: ['deduplication', 'analytics-dashboard', 'subreddit-discovery'],
  },
  {
    slug: 'deduplication',
    title: 'Deduplication',
    tagline: 'Smart filtering — never see the same post twice',
    heroSubtitle: 'Reddix remembers every post you\'ve already seen. Our deduplication engine uses URL matching and content hashing to ensure your lead feed stays clean, fresh, and free of repeats.',
    metaTitle: 'Reddit Lead Deduplication — Clean, Fresh Lead Feed | Reddix',
    metaDescription: 'Never see the same Reddit post twice. Smart deduplication keeps your lead feed clean with URL matching and content hashing.',
    icon: Repeat,
    demoHeadline: 'A clean feed, every time',
    demoDescription: 'Every scan checks discovered posts against your history using URL matching and content fingerprinting. Crossposted, edited, or reposted content is caught and filtered — so your lead feed only shows genuinely new opportunities.',
    demoStats: [
      { label: 'Dedup accuracy', value: '99.7%' },
      { label: 'Methods used', value: '3' },
      { label: 'Avg. dupes filtered', value: '30%' },
      { label: 'History retention', value: '∞' },
    ],
    benefits: [
      { title: 'URL-based matching', desc: 'Every Reddit post URL is tracked per user. If you\'ve seen it before, it won\'t appear again — regardless of which scan found it.', icon: Globe },
      { title: 'Content fingerprinting', desc: 'Content hashing catches crossposts, reposts, and slightly edited duplicates that share the same core content.', icon: Shield },
      { title: 'Permanent history', desc: 'Your seen-post history is stored indefinitely. Even if you scan the same subreddits months later, old posts stay filtered.', icon: Clock },
      { title: 'Cleaner analytics', desc: 'Deduplication means your lead counts and scoring stats reflect genuinely unique opportunities — no inflated numbers.', icon: BarChart3 },
    ],
    useCases: [
      { persona: 'Daily Scanner', scenario: 'Runs scans daily across 10 subreddits. Without dedup, 30%+ of leads would be repeats from yesterday.', outcome: 'Every morning\'s leads are fresh and actionable — zero time wasted on repeats.' },
      { persona: 'Multi-Keyword User', scenario: 'Monitors 15 keywords that often match the same Reddit posts. Dedup ensures each post appears only once.', outcome: 'Lead count reflects unique opportunities, not keyword overlap.' },
      { persona: 'Long-Term User', scenario: 'Has been using Reddix for 6 months. Dedup history means ancient posts never resurface.', outcome: 'Lead quality stays consistently high over months of use.' },
    ],
    faq: [
      { q: 'How does deduplication work?', a: 'Three layers: URL matching (exact post URL tracking), content hashing (fingerprinting post content to catch reposts), and user-level history (your personal seen-post database that persists indefinitely).' },
      { q: 'What if a post is edited after I\'ve seen it?', a: 'URL matching will still catch it since the post URL doesn\'t change. Only entirely new posts from different authors will appear in your feed.' },
      { q: 'Can I reset my dedup history?', a: 'Currently, dedup history is permanent to maintain feed quality. If you need to revisit old posts, you can search for them directly on Reddit.' },
    ],
    relatedSlugs: ['scheduled-scans', 'lead-scoring', 'analytics-dashboard'],
  },
  {
    slug: 'website-analysis',
    title: 'Website Analysis',
    tagline: 'Drop your URL, extract keywords automatically',
    heroSubtitle: 'Paste your website URL and let our AI analyze your product — extracting keywords, understanding your value proposition, and configuring your monitoring automatically. Setup takes 2 minutes, not 2 hours.',
    metaTitle: 'Website Analysis for Reddit Keywords — Auto-Extract | Reddix',
    metaDescription: 'Drop your URL and let AI extract keywords, value propositions, and target audience for Reddit lead generation. 2-minute setup.',
    icon: Globe,
    demoHeadline: 'From URL to leads in 2 minutes',
    demoDescription: 'Our crawler visits your website, analyzes your copy, features, and positioning. It then generates optimized search terms, identifies your target audience, and suggests subreddits — all from a single URL input.',
    demoStats: [
      { label: 'Pages analyzed', value: 'Up to 5' },
      { label: 'Keywords extracted', value: '10-20' },
      { label: 'Analysis time', value: '<30s' },
      { label: 'Accuracy', value: '92%' },
    ],
    benefits: [
      { title: 'Instant keyword generation', desc: 'No brainstorming needed. AI reads your website and generates the search terms most likely to find your ideal customers on Reddit.', icon: Globe },
      { title: 'Value prop extraction', desc: 'Understands your product\'s core value proposition and uses it to tailor intent detection and reply generation.', icon: Zap },
      { title: 'Competitor identification', desc: 'Spots competitor mentions on your site and adds them to monitoring — so you catch comparison discussions.', icon: Target },
      { title: 'Continuous refinement', desc: 'Re-analyze anytime as your product evolves. Updated copy means updated keywords and monitoring.', icon: Repeat },
    ],
    useCases: [
      { persona: 'New User', scenario: 'First time setting up Reddix. Pastes their SaaS landing page URL.', outcome: 'In 30 seconds, had 15 keywords, 3 competitors, and 12 subreddit suggestions — ready to scan.' },
      { persona: 'Product Pivot', scenario: 'Product messaging changed after a pivot. Re-runs website analysis to update all monitoring parameters.', outcome: 'New keywords aligned with updated positioning, immediately finding relevant leads.' },
      { persona: 'Non-Technical Founder', scenario: 'Doesn\'t know which keywords to monitor or which subreddits to target. Website analysis handles everything.', outcome: 'Fully configured and finding leads within 5 minutes of signing up.' },
    ],
    faq: [
      { q: 'What does website analysis extract?', a: 'Product name, description, key features, value proposition, target audience, competitor names, and search keywords — all from your public-facing website content.' },
      { q: 'Does it work with any website?', a: 'Yes, as long as the website is publicly accessible. It works best with SaaS landing pages, product pages, and marketing sites that clearly describe what you offer.' },
      { q: 'Can I edit the extracted keywords?', a: 'Absolutely. All extracted data is presented for your review. Add, remove, or modify keywords and descriptions before starting your first scan.' },
    ],
    relatedSlugs: ['subreddit-discovery', 'intent-detection', 'scheduled-scans'],
  },
  {
    slug: 'natural-tone',
    title: 'Natural Tone',
    tagline: 'Replies built to add value, not sound like ads',
    heroSubtitle: 'Reddit users can smell self-promotion from a mile away. Our AI is trained on Reddit culture — generating replies that contribute to conversations, build credibility, and mention your product the way a genuine user would.',
    metaTitle: 'Natural-Sounding Reddit Replies — Anti-Spam AI | Reddix',
    metaDescription: 'AI replies trained on Reddit culture. Natural tone that adds value, builds credibility, and avoids spam flags.',
    icon: Shield,
    demoHeadline: 'The anti-spam reply engine',
    demoDescription: 'Every reply is crafted to match the specific subreddit\'s communication style. Technical subs get detailed, analytical responses. Casual subs get conversational, relatable replies. Your product is woven in as a natural recommendation.',
    demoStats: [
      { label: 'Spam flag rate', value: '0%' },
      { label: 'Avg. upvotes/reply', value: '4.7' },
      { label: 'Tone presets', value: '5' },
      { label: 'Subreddit adaptation', value: 'Auto' },
    ],
    benefits: [
      { title: 'Reddit-native language', desc: 'Trained on millions of Reddit posts. Our AI understands community norms, inside jokes, and communication styles per subreddit.', icon: Shield },
      { title: 'Value-first approach', desc: 'Every reply leads with genuine help — answering the question, sharing context, or offering insight before any product mention.', icon: MessageSquare },
      { title: 'Anti-promotional patterns', desc: 'Avoids phrases and structures that trigger Reddit spam detection or community suspicion. No "Check out our tool!" energy.', icon: Repeat },
      { title: 'Credibility building', desc: 'Replies are designed to establish you as a knowledgeable community member, not a drive-by marketer.', icon: Target },
    ],
    useCases: [
      { persona: 'Brand-Conscious Startup', scenario: 'Worried about Reddit backlash from promotional comments. Natural tone ensures every reply adds genuine value.', outcome: 'Zero negative reactions. Multiple users thanked them for the helpful recommendation.' },
      { persona: 'Community Builder', scenario: 'Wants to build long-term presence in key subreddits. Natural tone helps establish authentic community credibility.', outcome: 'Became a recognized helpful contributor in 2 target subreddits within a month.' },
      { persona: 'Previous Spam Victim', scenario: 'Got burned by aggressive Reddit marketing in the past. Natural tone provides a sustainable, community-friendly approach.', outcome: 'Rebuilt Reddit presence with positive engagement and zero removals.' },
    ],
    faq: [
      { q: 'How does natural tone prevent spam detection?', a: 'Our AI avoids promotional language patterns, excessive links, repetitive phrasing, and other signals that Reddit\'s spam filters look for. Replies read like organic community contributions.' },
      { q: 'Can I see how the tone adapts per subreddit?', a: 'Yes. The reply preview shows the generated tone and you can see how language, formality, and style shift based on the target subreddit\'s culture.' },
      { q: 'What if I want a more promotional tone?', a: 'We advise against it on Reddit, but you can edit any generated reply to adjust the balance. The AI defaults to natural tone because it produces the highest engagement rates.' },
    ],
    relatedSlugs: ['ai-replies', 'intent-detection', 'lead-scoring'],
  },
];

export function getFeatureBySlug(slug: string): FeatureData | undefined {
  return features.find((f) => f.slug === slug);
}
