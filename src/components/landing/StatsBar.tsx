import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { value: 2400, suffix: '+', label: 'Leads discovered' },
  { value: 180, suffix: '+', label: 'Subreddits scanned' },
  { value: 12, suffix: 'x', label: 'Faster than manual' },
  { value: 500, suffix: '+', label: 'SaaS teams' },
];

export function StatsBar() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center reveal reveal-delay-${i + 1}`}
            >
              <div className="text-[36px] sm:text-[44px] font-semibold text-foreground tracking-tight leading-none">
                <AnimatedCounter value={s.value} duration={1400} />
                <span className="text-primary">{s.suffix}</span>
              </div>
              <p className="mt-2 text-[13px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
