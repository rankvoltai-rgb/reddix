import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { value: 2400, suffix: '+', label: 'Leads found' },
  { value: 180, suffix: '+', label: 'Subreddits monitored' },
  { value: 12, suffix: 'x', label: 'Faster than manual outreach' },
];

export function StatsBar() {
  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="animate-fade-in">
              <div className="text-4xl sm:text-5xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} duration={1200} />
                <span>{stat.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
