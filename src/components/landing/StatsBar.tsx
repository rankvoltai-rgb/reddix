import { AnimatedCounter } from '@/components/ui/animated-counter';
import { TrendingUp, Users, Radar, Zap } from 'lucide-react';

const stats = [
  { value: 2400, suffix: '+', label: 'Leads discovered', icon: TrendingUp, desc: 'High-intent leads found for our users' },
  { value: 180, suffix: '+', label: 'Subreddits monitored', icon: Radar, desc: 'Active communities being scanned daily' },
  { value: 12, suffix: 'x', label: 'Faster than manual', icon: Zap, desc: 'Compared to manual Reddit browsing' },
  { value: 500, suffix: '+', label: 'SaaS teams', icon: Users, desc: 'Founders trusting Reddix for leads' },
];

export function StatsBar() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`bento-card text-center py-8 reveal reveal-delay-${i + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[34px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-none">
                <AnimatedCounter value={s.value} duration={1400} />
                <span className="text-primary">{s.suffix}</span>
              </div>
              <p className="mt-2 text-[13px] font-medium text-foreground">{s.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
