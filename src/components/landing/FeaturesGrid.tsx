import { Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Intent Detection', desc: 'AI spots genuine buying signals, not just keyword mentions.' },
  { icon: Target, title: 'Lead Scoring', desc: 'Every lead scored 0–100 based on purchase readiness.' },
  { icon: MessageSquare, title: 'AI Replies', desc: 'Context-aware drafts that match each subreddit\'s culture.' },
  { icon: Compass, title: 'Subreddit Discovery', desc: 'AI suggests communities where your audience discusses problems.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track leads, replies, and conversion rates in real time.' },
  { icon: Clock, title: 'Scheduled Scans', desc: 'Auto-pilot scans Reddit on your schedule — daily or hourly.' },
  { icon: Repeat, title: 'Deduplication', desc: 'Smart filtering ensures you never see the same post twice.' },
  { icon: Globe, title: 'Website Analysis', desc: 'Drop your URL and we extract keywords and positioning instantly.' },
  { icon: Shield, title: 'Natural Tone', desc: 'Replies designed to add value, not feel like ads or spam.' },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Everything included
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            One tool,{' '}
            <span className="font-display italic font-normal">every feature</span>{' '}
            you need
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-lg mx-auto">
            Built by SaaS founders, for SaaS founders. Every feature is designed to replace hours of manual Reddit work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bento-card shine-effect group reveal reveal-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <f.icon className="w-[18px] h-[18px] text-primary" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
