import {
  Rocket, Users, User, Code, ShoppingCart, Briefcase, PenTool, TrendingUp,
  Zap, Target, MessageSquare, Clock, BarChart3, Globe, Compass, Repeat,
  CheckCircle2, Shield, Search, ArrowUpRight, Layers, Award, Heart, Star,
  type LucideIcon,
} from 'lucide-react';

export interface UseCaseScenarioStep {
  step: string;
  detail: string;
}

export interface UseCaseBenefit {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface UseCaseFAQItem {
  q: string;
  a: string;
}

export interface UseCaseData {
  slug: string;
  title: string;
  tagline: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  stats: { label: string; value: string }[];
  scenario: UseCaseScenarioStep[];
  benefits: UseCaseBenefit[];
  relevantFeatures: string[];
  faq: UseCaseFAQItem[];
  relatedSlugs: string[];
  testimonial: { quote: string; name: string; role: string };
}

export const useCases: UseCaseData[] = [
  {
    slug: 'saas-founders',
    title: 'SaaS Founders',
    tagline: 'Find users actively searching for your category',
    heroSubtitle: 'Reddit is where your ideal customers compare tools, ask for recommendations, and describe the exact problem your SaaS solves. Reddix puts you in front of them at the perfect moment.',
    metaTitle: 'Reddit Lead Generation for SaaS Founders | Reddix',
    metaDescription: 'Find Reddit users actively searching for SaaS tools like yours. Reddix surfaces buying signals and helps SaaS founders convert conversations into customers.',
    icon: Rocket,
    stats: [
      { label: 'Avg. leads/week', value: '47' },
      { label: 'Time saved', value: '12h' },
      { label: 'Conversion lift', value: '3.2×' },
      { label: 'Subreddits monitored', value: '25+' },
    ],
    scenario: [
      { step: 'Drop your URL', detail: 'Reddix analyzes your product page and auto-generates keywords that match how Reddit users describe your category.' },
      { step: 'Discover subreddits', detail: 'AI finds 20+ communities where your ICP hangs out — not just the obvious ones, but niche subs with high buyer intent.' },
      { step: 'Scan for buyers', detail: 'Every post is analyzed for purchase signals: "looking for," "switching from," "any recommendations for..." — scored 0–100.' },
      { step: 'Reply & convert', detail: 'Draft context-aware replies that add genuine value. No spammy self-promotion — just helpful answers that naturally mention your tool.' },
    ],
    benefits: [
      { title: 'Skip cold outreach', desc: 'Stop sending emails nobody reads. Engage with people who are already looking for what you built.', icon: MessageSquare },
      { title: 'Validate product-market fit', desc: 'See how real users describe their problems. Use their exact language in your marketing.', icon: Target },
      { title: 'Compete on timing', desc: 'The first helpful reply wins. Reddix alerts you within seconds of a new buying signal.', icon: Clock },
      { title: 'Scale without headcount', desc: 'One founder can monitor 25+ subreddits and respond to dozens of leads daily.', icon: TrendingUp },
    ],
    relevantFeatures: ['intent-detection', 'ai-replies', 'website-analysis', 'lead-scoring'],
    faq: [
      { q: 'How is this different from just searching Reddit manually?', a: 'Manual searching finds keyword matches. Reddix uses NLP to detect buying intent — understanding context, sarcasm, and implicit needs. Plus it runs 24/7 so you never miss a post.' },
      { q: 'Will my replies look like spam?', a: 'No. Reddix generates replies that match subreddit culture and add genuine value. The AI adapts tone and includes relevant context from the thread. You review everything before posting.' },
      { q: 'How quickly can I start finding leads?', a: 'Most founders see their first qualified leads within 15 minutes of setup. Just drop your URL and Reddix handles keyword generation and subreddit discovery automatically.' },
      { q: 'What if my SaaS is in a niche market?', a: 'Niche markets actually perform better on Reddix. Less competition means your replies get more visibility, and Reddit has communities for virtually every niche.' },
    ],
    relatedSlugs: ['startup-growth', 'developer-tools', 'b2b-sales'],
    testimonial: { quote: 'We found 47 warm leads in our first week. Three converted to paying customers within 14 days.', name: 'Alex Chen', role: 'Founder, CloudSync' },
  },
  {
    slug: 'marketing-agencies',
    title: 'Marketing Agencies',
    tagline: 'Scale Reddit lead gen across multiple clients',
    heroSubtitle: 'Manage Reddit lead generation for multiple clients from one dashboard. Reddix lets agencies deliver a new channel with minimal effort and maximum results.',
    metaTitle: 'Reddit Lead Generation for Marketing Agencies | Reddix',
    metaDescription: 'Scale Reddit lead generation across multiple clients. Reddix helps marketing agencies discover, qualify, and engage Reddit leads at scale.',
    icon: Users,
    stats: [
      { label: 'Clients managed', value: '∞' },
      { label: 'Avg. ROI', value: '8.4×' },
      { label: 'Setup per client', value: '5min' },
      { label: 'Reply templates', value: 'AI' },
    ],
    scenario: [
      { step: 'Onboard a new client', detail: 'Enter their product URL. Reddix auto-extracts keywords, value props, and target audience in under 60 seconds.' },
      { step: 'Configure monitoring', detail: 'Set up subreddit monitoring and scan frequency per client. Each client gets their own keyword set and intent filters.' },
      { step: 'Review & approve', detail: 'AI drafts replies tailored to each client\'s voice and product. Batch-review and approve in minutes.' },
      { step: 'Report results', detail: 'Track leads found, replies sent, and engagement rates. Export reports showing clear ROI for each client.' },
    ],
    benefits: [
      { title: 'New revenue stream', desc: 'Offer Reddit lead gen as a premium service. High margins with minimal additional work per client.', icon: TrendingUp },
      { title: 'Effortless scaling', desc: 'Adding a new client takes 5 minutes. Automated scanning and AI replies handle the heavy lifting.', icon: Layers },
      { title: 'Client-specific tone', desc: 'Each client gets AI replies that match their brand voice, industry jargon, and positioning.', icon: Shield },
      { title: 'Prove ROI instantly', desc: 'Every lead is tracked from discovery to engagement. Show clients exactly what they\'re paying for.', icon: BarChart3 },
    ],
    relevantFeatures: ['scheduled-scans', 'ai-replies', 'analytics-dashboard', 'natural-tone'],
    faq: [
      { q: 'Can I manage multiple clients from one account?', a: 'Yes. Each product profile is independent with its own keywords, subreddits, and tone settings. Switch between clients seamlessly.' },
      { q: 'How do I match each client\'s brand voice?', a: 'Reddix lets you set tone preferences per client — professional, casual, technical, witty, or friendly. The AI adapts all replies accordingly.' },
      { q: 'What reporting is available for clients?', a: 'The analytics dashboard tracks leads discovered, intent scores, reply engagement, and conversion rates. All exportable for client reports.' },
      { q: 'Is there a white-label option?', a: 'We\'re actively developing white-label features. Contact us for early access to agency-specific plans and branding options.' },
    ],
    relatedSlugs: ['content-marketers', 'b2b-sales', 'saas-founders'],
    testimonial: { quote: 'We added Reddit lead gen to our service offering and increased average client retainer by 40%.', name: 'Sarah Kim', role: 'Director, GrowthLab Agency' },
  },
  {
    slug: 'solopreneurs',
    title: 'Solopreneurs',
    tagline: 'One-person teams finding warm leads on autopilot',
    heroSubtitle: 'You can\'t be everywhere at once — but Reddix can. Set up automated scanning and let AI find and qualify leads while you focus on building your product.',
    metaTitle: 'Reddit Lead Generation for Solopreneurs | Reddix',
    metaDescription: 'Automated Reddit lead generation for solopreneurs. Find warm leads on autopilot while you focus on building your business.',
    icon: User,
    stats: [
      { label: 'Daily time needed', value: '10min' },
      { label: 'Leads on autopilot', value: '30+/wk' },
      { label: 'Setup time', value: '2min' },
      { label: 'Cost vs. ads', value: '95% less' },
    ],
    scenario: [
      { step: 'Set up once', detail: 'Drop your URL, let AI generate keywords and find subreddits. Total setup: 2 minutes.' },
      { step: 'Enable autopilot', detail: 'Turn on scheduled scans. Reddix monitors Reddit 24/7 and scores every post for buying intent.' },
      { step: 'Morning review', detail: 'Check your inbox of pre-qualified leads over coffee. Each one scored, categorized, and ready to engage.' },
      { step: 'Reply in minutes', detail: 'Use AI-drafted replies as starting points. Tweak, personalize, and post — all in under 10 minutes.' },
    ],
    benefits: [
      { title: 'Time is your scarcest resource', desc: 'Spend 10 minutes a day instead of 3 hours manually searching Reddit. Let AI handle the grunt work.', icon: Clock },
      { title: 'Zero ad spend', desc: 'Reddit leads are free. You\'re not paying per click — you\'re joining conversations that already exist.', icon: Star },
      { title: 'Authentic growth', desc: 'Build a reputation as a helpful expert, not a spammer. Genuine engagement compounds over time.', icon: Heart },
      { title: 'Punch above your weight', desc: 'Look like a team of 10 when it\'s just you. AI replies and automated scanning level the playing field.', icon: Award },
    ],
    relevantFeatures: ['scheduled-scans', 'website-analysis', 'ai-replies', 'deduplication'],
    faq: [
      { q: 'I only have 10 minutes a day. Is that enough?', a: 'Absolutely. Reddix pre-qualifies leads and drafts replies. Your daily workflow is: review → tweak → post. Most solopreneurs spend 5-15 minutes per session.' },
      { q: 'Will this work for my tiny niche?', a: 'Niche products actually outperform on Reddit. Smaller communities mean less noise and more genuine conversations. Reddix finds even the most obscure relevant subreddits.' },
      { q: 'How is this better than just posting in subreddits?', a: 'Posting gets you exposure; Reddix gets you leads. Instead of broadcasting, you\'re responding to people who already need what you offer.' },
      { q: 'Can I use this alongside my other marketing?', a: 'Yes. Reddix complements SEO, content marketing, and ads. Many solopreneurs use it as their primary acquisition channel while building other channels.' },
    ],
    relatedSlugs: ['saas-founders', 'startup-growth', 'ecommerce'],
    testimonial: { quote: 'As a solo founder, Reddix replaced my need for a sales team. 10 minutes a day and I have a pipeline full of warm leads.', name: 'Jamie Torres', role: 'Founder, InvoiceBot' },
  },
  {
    slug: 'developer-tools',
    title: 'Developer Tools',
    tagline: 'Reach devs where they actually hang out',
    heroSubtitle: 'Developers don\'t click ads. They ask peers on Reddit. Reddix monitors programming subreddits to find devs actively seeking tools like yours — and helps you engage authentically.',
    metaTitle: 'Reddit Lead Generation for Developer Tools | Reddix',
    metaDescription: 'Find developers actively seeking tools like yours on Reddit. Reddix helps dev tool companies engage authentically in programming communities.',
    icon: Code,
    stats: [
      { label: 'Dev subreddits', value: '200+' },
      { label: 'Intent accuracy', value: '96%' },
      { label: 'Avg. thread depth', value: '40+' },
      { label: 'Tech stacks tracked', value: '50+' },
    ],
    scenario: [
      { step: 'Define your stack', detail: 'Tell Reddix what your tool does and which tech ecosystem it belongs to. AI maps your product to relevant dev communities.' },
      { step: 'Monitor discussions', detail: 'Track threads in r/programming, r/webdev, r/devops, and dozens of niche language/framework subs automatically.' },
      { step: 'Spot evaluators', detail: 'Reddix detects devs comparing tools, asking "what do you use for X," and discussing migration from competitors.' },
      { step: 'Reply with code', detail: 'AI drafts technically accurate replies with code snippets, benchmarks, and genuine help — matching the dev community\'s no-BS culture.' },
    ],
    benefits: [
      { title: 'Devs trust devs', desc: 'A helpful Reddit reply is worth more than 100 banner ads. Build trust by showing up with real answers.', icon: Shield },
      { title: 'Technical accuracy', desc: 'AI understands programming context and generates replies with proper terminology, code examples, and technical depth.', icon: Code },
      { title: 'Community-native', desc: 'Replies match the no-nonsense culture of dev subreddits. No marketing speak — just genuine technical help.', icon: MessageSquare },
      { title: 'Competitive intelligence', desc: 'See what devs say about competitors in real time. Understand their pain points and position accordingly.', icon: Search },
    ],
    relevantFeatures: ['intent-detection', 'natural-tone', 'subreddit-discovery', 'lead-scoring'],
    faq: [
      { q: 'Can the AI write technically accurate replies?', a: 'Yes. The AI adapts to technical contexts and can include relevant terminology and concepts. You always review before posting to ensure accuracy.' },
      { q: 'Which developer subreddits does Reddix monitor?', a: 'Any subreddit you choose. Popular ones include r/programming, r/webdev, r/devops, r/rust, r/golang, r/python, and hundreds of framework-specific communities.' },
      { q: 'Won\'t developers see through marketing?', a: 'That\'s exactly why Reddix focuses on genuine helpfulness. Replies add real value first. Your product is mentioned naturally as part of a helpful answer, not as a sales pitch.' },
      { q: 'How do I handle open-source competition?', a: 'Reddix helps you find threads where devs are frustrated with OSS limitations — complexity, maintenance burden, missing features. Position your tool as the "just works" alternative.' },
    ],
    relatedSlugs: ['saas-founders', 'startup-growth', 'b2b-sales'],
    testimonial: { quote: 'Developers are the hardest audience to market to. Reddix helped us find them in their natural habitat and earn their trust.', name: 'Priya Patel', role: 'Head of Growth, DevStack' },
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce Brands',
    tagline: 'Discover product recommendation threads',
    heroSubtitle: 'Reddit is the world\'s largest product recommendation engine. Reddix finds threads where people ask "what should I buy?" and helps you show up with the perfect answer.',
    metaTitle: 'Reddit Lead Generation for E-commerce | Reddix',
    metaDescription: 'Find Reddit threads where users ask for product recommendations. Reddix helps e-commerce brands discover and convert warm leads from Reddit.',
    icon: ShoppingCart,
    stats: [
      { label: '"Best X" threads/day', value: '500+' },
      { label: 'Purchase intent', value: '89%' },
      { label: 'Avg. order value', value: '+34%' },
      { label: 'Categories', value: 'All' },
    ],
    scenario: [
      { step: 'Map your products', detail: 'Reddix analyzes your store and identifies the categories, pain points, and use cases your products solve.' },
      { step: 'Find recommendation threads', detail: 'AI scans for "best X under $Y," "what do you recommend for," and "X vs Y" threads — the highest-intent e-commerce posts.' },
      { step: 'Score by purchase readiness', detail: 'Each thread is scored for buyer intent. Filter for people ready to buy today vs. just researching.' },
      { step: 'Reply with social proof', detail: 'Draft replies that include specific product benefits, real use cases, and why your product fits their exact requirements.' },
    ],
    benefits: [
      { title: 'Free acquisition channel', desc: 'Stop burning money on Meta and Google ads. Reddit recommendation threads convert at 5–10× the rate of paid traffic.', icon: TrendingUp },
      { title: 'High-intent buyers', desc: 'People asking "what should I buy" are ready to purchase. You\'re not convincing — you\'re helping them decide.', icon: Target },
      { title: 'SEO compound effect', desc: 'Reddit threads rank on Google. Your helpful reply lives forever and drives organic traffic for months.', icon: Globe },
      { title: 'Category monitoring', desc: 'Track specific product categories across all relevant subreddits. Never miss a recommendation thread.', icon: Compass },
    ],
    relevantFeatures: ['intent-detection', 'subreddit-discovery', 'ai-replies', 'scheduled-scans'],
    faq: [
      { q: 'Does this work for physical products?', a: 'Absolutely. Reddit is full of recommendation threads for electronics, home goods, fashion, fitness gear, beauty products — virtually every consumer category.' },
      { q: 'How do I avoid looking like a shill?', a: 'Reddix generates replies that lead with genuine helpfulness. Mention your product as one option among several, include specific reasons why it fits, and always disclose your affiliation.' },
      { q: 'Can I track specific product categories?', a: 'Yes. Set up keyword groups per product line or category. Monitor different subreddits for different products simultaneously.' },
      { q: 'What about Reddit\'s self-promotion rules?', a: 'Reddix helps you follow the 90/10 rule. Replies are crafted to be genuinely helpful first. Most subreddits welcome authentic product recommendations when they\'re relevant and transparent.' },
    ],
    relatedSlugs: ['solopreneurs', 'content-marketers', 'saas-founders'],
    testimonial: { quote: 'We tracked "best wireless earbuds" threads and saw a 34% increase in average order value from Reddit-sourced customers.', name: 'Marcus Lee', role: 'E-commerce Director, SoundWave' },
  },
  {
    slug: 'b2b-sales',
    title: 'B2B Sales Teams',
    tagline: 'Surface enterprise buying signals on Reddit',
    heroSubtitle: 'Decision-makers research solutions on Reddit before talking to sales. Reddix surfaces these buying signals so your team can engage prospects at the research stage — before competitors even know they exist.',
    metaTitle: 'Reddit Lead Generation for B2B Sales Teams | Reddix',
    metaDescription: 'Surface enterprise buying signals on Reddit. Reddix helps B2B sales teams find and engage decision-makers researching solutions.',
    icon: Briefcase,
    stats: [
      { label: 'B2B signals/day', value: '120+' },
      { label: 'Decision-maker %', value: '62%' },
      { label: 'Pipeline velocity', value: '+45%' },
      { label: 'Deal size avg.', value: '$24K' },
    ],
    scenario: [
      { step: 'Define your ICP', detail: 'Set up your ideal customer profile — industry, company size, pain points. Reddix maps this to Reddit discussions.' },
      { step: 'Monitor buying signals', detail: 'Track threads where decision-makers ask about solutions, compare vendors, or describe operational pain points your product solves.' },
      { step: 'Qualify at scale', detail: 'Every lead is scored for intent and purchase readiness. Focus your team\'s energy on the hottest opportunities.' },
      { step: 'Warm outreach', detail: 'Engage on Reddit first, then follow up via traditional channels. Warm introductions convert 5× better than cold calls.' },
    ],
    benefits: [
      { title: 'Top-of-funnel goldmine', desc: 'Catch buyers at the research stage — before they\'ve shortlisted vendors or contacted competitors.', icon: Search },
      { title: 'Multi-thread intelligence', desc: 'See what prospects say about competitors, pricing concerns, and must-have features. Tailor your pitch accordingly.', icon: Layers },
      { title: 'Warm every cold lead', desc: 'A helpful Reddit interaction transforms cold outreach into a warm follow-up. "Hey, I helped you on Reddit last week…"', icon: Heart },
      { title: 'Shorten sales cycles', desc: 'Engaging at the research stage means fewer discovery calls and faster progression through your pipeline.', icon: Clock },
    ],
    relevantFeatures: ['lead-scoring', 'intent-detection', 'analytics-dashboard', 'ai-replies'],
    faq: [
      { q: 'Are B2B decision-makers really on Reddit?', a: 'Yes. 52% of B2B buyers use Reddit for research. Subreddits like r/sysadmin, r/devops, r/sales, and r/marketing are packed with decision-makers evaluating tools.' },
      { q: 'How do I integrate Reddit leads into my CRM?', a: 'Export qualified leads with intent scores and thread context. Copy the pre-qualified lead data into your CRM for your sales team to follow up.' },
      { q: 'Can my whole sales team use Reddix?', a: 'Yes. Multiple team members can access the same dashboard, review leads, and coordinate replies to avoid duplicate outreach.' },
      { q: 'What\'s the typical deal size from Reddit leads?', a: 'Our B2B users report average deal sizes of $15K-$50K from Reddit-sourced leads, with shorter sales cycles due to the warm introduction.' },
    ],
    relatedSlugs: ['saas-founders', 'marketing-agencies', 'startup-growth'],
    testimonial: { quote: 'Reddit became our #2 pipeline source after outbound. Decision-makers are literally telling us what they need.', name: 'David Nguyen', role: 'VP Sales, DataPlatform' },
  },
  {
    slug: 'content-marketers',
    title: 'Content Marketers',
    tagline: 'Find content gaps and distribution opportunities',
    heroSubtitle: 'Reddit tells you exactly what content your audience wants. Use Reddix to discover trending topics, find content distribution opportunities, and engage readers who are asking the questions your content answers.',
    metaTitle: 'Reddit Lead Generation for Content Marketers | Reddix',
    metaDescription: 'Find content gaps and distribution opportunities on Reddit. Reddix helps content marketers discover what their audience is asking and engage authentically.',
    icon: PenTool,
    stats: [
      { label: 'Topics discovered', value: '200+/mo' },
      { label: 'Content ROI', value: '6.8×' },
      { label: 'Organic reach', value: '+180%' },
      { label: 'Backlink opps', value: '40+/mo' },
    ],
    scenario: [
      { step: 'Discover content gaps', detail: 'Reddix surfaces questions your audience is asking that you haven\'t written about yet. Each one is a content opportunity.' },
      { step: 'Validate before writing', detail: 'See how many people are asking about a topic before investing time creating content. Reddit = real demand signals.' },
      { step: 'Distribute strategically', detail: 'Find threads where your existing content is the perfect answer. Share helpful insights with links to your in-depth guides.' },
      { step: 'Build authority', detail: 'Consistent helpful engagement builds your personal and brand authority. Reddit karma translates to real credibility.' },
    ],
    benefits: [
      { title: 'Content ideas on tap', desc: 'Never stare at a blank page again. Reddit surfaces exactly what your audience wants to learn about.', icon: PenTool },
      { title: 'Distribution built in', desc: 'Don\'t just publish and pray. Find threads where your content is the perfect answer and share it naturally.', icon: ArrowUpRight },
      { title: 'SEO amplification', desc: 'Reddit threads rank on Google. Your replies with links drive referral traffic and signal authority to search engines.', icon: Globe },
      { title: 'Audience research', desc: 'Understand your audience\'s exact language, pain points, and questions. Use their words in your content for better resonance.', icon: Search },
    ],
    relevantFeatures: ['subreddit-discovery', 'intent-detection', 'natural-tone', 'website-analysis'],
    faq: [
      { q: 'Can I use Reddix to find content topics?', a: 'Yes. Filter for "question" and "how-to" intent to discover exactly what your audience is asking about. Each thread is a potential blog post or guide.' },
      { q: 'How do I share content without getting banned?', a: 'Reddix helps you follow Reddit\'s community guidelines. Lead with a helpful answer, include key insights, and only link to your content when it genuinely adds value.' },
      { q: 'Does Reddit traffic convert?', a: 'Reddit traffic has higher engagement than social media: longer time on page, lower bounce rates, and more shares. Users arrive pre-educated and ready to engage.' },
      { q: 'Can I track which content performs best on Reddit?', a: 'The analytics dashboard shows engagement by reply, letting you see which content topics and formats resonate most with Reddit audiences.' },
    ],
    relatedSlugs: ['marketing-agencies', 'saas-founders', 'solopreneurs'],
    testimonial: { quote: 'Reddix became our content calendar. Every thread is a validated content idea with built-in distribution.', name: 'Elena Marsh', role: 'Content Lead, GrowthBlog' },
  },
  {
    slug: 'startup-growth',
    title: 'Startup Growth',
    tagline: 'Early traction through authentic Reddit engagement',
    heroSubtitle: 'Pre-seed to Series A, Reddit is where your first 100 customers live. Reddix helps early-stage startups find traction through genuine community engagement — no ad budget required.',
    metaTitle: 'Reddit Lead Generation for Startup Growth | Reddix',
    metaDescription: 'Get early startup traction through authentic Reddit engagement. Reddix helps startups find their first 100 customers without ad spend.',
    icon: TrendingUp,
    stats: [
      { label: 'First lead in', value: '<15min' },
      { label: 'Monthly cost', value: '$0 ads' },
      { label: 'Traction signal', value: '10× faster' },
      { label: 'Founder time', value: '15min/day' },
    ],
    scenario: [
      { step: 'Launch day setup', detail: 'Before your launch, set up Reddix to monitor communities where your early adopters live. Be ready to engage from day one.' },
      { step: 'Find early adopters', detail: 'Reddix surfaces people who are actively unhappy with existing solutions or seeking alternatives. These are your ideal first users.' },
      { step: 'Validate with real feedback', detail: 'Engage in genuine conversations. Get unfiltered feedback on your product while simultaneously acquiring your first customers.' },
      { step: 'Build momentum', detail: 'Each helpful interaction builds credibility. As your karma and reputation grow, so does your conversion rate.' },
    ],
    benefits: [
      { title: 'Zero-budget acquisition', desc: 'No ad spend, no paid influencers. Just genuine conversations with people who need what you\'re building.', icon: Star },
      { title: 'Real-time validation', desc: 'See if people actually want your product by watching how they respond to your Reddit engagement.', icon: CheckCircle2 },
      { title: 'Compound credibility', desc: 'Every helpful reply builds your reputation. After a month, you\'re the go-to expert Reddit recommends.', icon: Award },
      { title: 'Investor-ready metrics', desc: 'Show investors organic growth from Reddit. Community-driven traction is a powerful signal of product-market fit.', icon: BarChart3 },
    ],
    relevantFeatures: ['website-analysis', 'subreddit-discovery', 'intent-detection', 'ai-replies'],
    faq: [
      { q: 'My product isn\'t launched yet. Can I still use Reddix?', a: 'Yes. Monitor your category before launch to understand language, pain points, and competitor gaps. Then hit the ground running on launch day.' },
      { q: 'How much time does this take for an early-stage founder?', a: '15 minutes per day is enough. Reddix handles scanning and qualification. You just review pre-qualified leads and approve AI-drafted replies.' },
      { q: 'Is Reddit really a viable growth channel for startups?', a: 'Many successful startups got their first 1,000 users from Reddit — including Dropbox, Notion, and Figma. Reddit users are early adopters by nature.' },
      { q: 'How do I measure ROI without a big data set?', a: 'Track leads found, replies sent, and website visits from Reddit. Even 10 converted leads validate the channel for further investment.' },
    ],
    relatedSlugs: ['saas-founders', 'solopreneurs', 'developer-tools'],
    testimonial: { quote: 'We got our first 100 paying users entirely from Reddit. Reddix made it possible for a two-person team.', name: 'Jordan Wells', role: 'Co-founder, LaunchPad' },
  },
];

export function getUseCaseBySlug(slug: string): UseCaseData | undefined {
  return useCases.find((uc) => uc.slug === slug);
}
