import { Zap, Target, MessageSquare, Compass, BarChart3, Clock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Intent Detection',
    desc: 'AI identifies posts where users are actively searching for solutions — not just mentions.',
  },
  {
    icon: Target,
    title: 'Lead Scoring',
    desc: 'Leads ranked by buying intent so you always focus on the hottest opportunities.',
  },
  {
    icon: MessageSquare,
    title: 'AI Replies',
    desc: 'Context-aware responses that match Reddit culture. Natural, not spammy.',
  },
  {
    icon: Compass,
    title: 'Subreddit Discovery',
    desc: 'AI suggests the best subreddits where your target audience hangs out.',
  },
  {
    icon: BarChart3,
    title: 'Built-in CRM',
    desc: 'Track every lead from discovery to conversion in one clean dashboard.',
  },
  {
    icon: Clock,
    title: 'Scheduled Scans',
    desc: 'Auto-pilot monitors Reddit on your schedule. New leads, daily, zero effort.',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/25">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Features
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Built for{' '}
            <span className="font-display italic font-normal">SaaS founders</span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-md mx-auto">
            Every feature saves you hours of manual Reddit browsing.
          </p>
        </div>

        {/* Bento grid: 2 large + 4 small */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bento-card shine-effect reveal reveal-delay-${Math.min(i + 1, 5)} ${
                i < 2 ? 'lg:row-span-1' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/[0.06] flex items-center justify-center mb-4">
                <f.icon className="w-[18px] h-[18px] text-primary" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
