import { Zap, Target, MessageSquare, Compass, BarChart3, Clock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Intent Detection',
    description:
      'AI identifies posts where users are actively looking for solutions like yours — not just mentions.',
    tint: 'stat-tint-primary',
  },
  {
    icon: Target,
    title: 'Lead Scoring',
    description:
      'Automatically ranks leads by buying intent so you focus on the hottest opportunities first.',
    tint: 'stat-tint-destructive',
  },
  {
    icon: MessageSquare,
    title: 'AI Replies',
    description:
      'Generate context-aware responses that match Reddit culture and feel natural, not spammy.',
    tint: 'stat-tint-success',
  },
  {
    icon: Compass,
    title: 'Subreddit Discovery',
    description:
      'AI suggests the best subreddits where your target customers are actively discussing problems.',
    tint: 'stat-tint-warning',
  },
  {
    icon: BarChart3,
    title: 'Built-in CRM',
    description:
      'Track every lead from discovery to conversion in one clean dashboard with status tracking.',
    tint: 'stat-tint-primary',
  },
  {
    icon: Clock,
    title: 'Scheduled Scans',
    description:
      'Set it and forget it. Auto-pilot scans Reddit on your schedule and surfaces new leads daily.',
    tint: 'stat-tint-success',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to find qualified leads
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Built by SaaS founders, for SaaS founders. Every feature is designed to save you
            hours of manual Reddit browsing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`${feature.tint} shine-effect rounded-xl border border-border p-6 card-hover animate-fade-in`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
