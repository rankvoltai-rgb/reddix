import { AnimatedCounter } from '@/components/ui/animated-counter';
import { TrendingUp, Users, Radar, Zap, ArrowUpRight } from 'lucide-react';

const stats = [
  { value: 2400, suffix: '+', label: 'Leads Discovered', icon: TrendingUp, desc: 'High-intent conversations surfaced', accent: 'from-primary/10 to-primary/[0.02]' },
  { value: 180, suffix: '+', label: 'Subreddits Scanned', icon: Radar, desc: 'Communities monitored in real-time', accent: 'from-amber-500/10 to-amber-500/[0.02]' },
  { value: 12, suffix: 'x', label: 'Faster Than Manual', icon: Zap, desc: 'vs. scrolling Reddit yourself', accent: 'from-emerald-500/10 to-emerald-500/[0.02]' },
  { value: 500, suffix: '+', label: 'SaaS Teams Trust Us', icon: Users, desc: 'Founders shipping with Reddix', accent: 'from-blue-500/10 to-blue-500/[0.02]' },
];

export function StatsBar() {
  return (
    <section className="py-20 sm:py-28 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      <div className="relative max-w-[1100px] mx-auto px-6">
        {/* Section intro */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            The numbers speak
          </p>
          <h2 className="text-2xl sm:text-[36px] font-semibold tracking-[-0.025em] leading-tight">
            Founders don't guess —{' '}
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              they measure
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-border/50 bg-gradient-to-br ${s.accent} p-6 sm:p-7 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.1)] hover:-translate-y-1 reveal`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Corner accent */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-4 h-4 text-primary/40" />
              </div>

              <div className="w-11 h-11 rounded-xl bg-background/80 border border-border/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="text-[36px] sm:text-[44px] font-bold text-foreground tracking-[-0.03em] leading-none">
                <AnimatedCounter value={s.value} duration={1400} />
                <span className="text-primary">{s.suffix}</span>
              </div>
              
              <p className="mt-2.5 text-[14px] font-semibold text-foreground">{s.label}</p>
              <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
