import type { UseCaseData } from '@/lib/useCases';

export function UseCaseScenario({ useCase }: { useCase: UseCaseData }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1]">
            A day with{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Reddix
            </span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-[500px] mx-auto">
            Here's how {useCase.title.toLowerCase()} use Reddix to find and convert leads on Reddit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Steps */}
          <div className="space-y-6">
            {useCase.scenario.map((s, i) => (
              <div
                key={i}
                className="group flex gap-5 reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center text-[14px] font-bold text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                    {i + 1}
                  </div>
                  {i < useCase.scenario.length - 1 && (
                    <div className="w-px flex-1 bg-border/30 mt-2 min-h-[20px]" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="text-[16px] font-semibold text-foreground mb-1.5">{s.step}</h3>
                  <p className="text-[14px] text-muted-foreground leading-[1.7]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mock dashboard UI */}
          <div className="rounded-2xl border border-border/40 bg-background shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.06)] overflow-hidden reveal reveal-delay-2">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/20 bg-muted/30">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              <span className="ml-2 text-[11px] text-muted-foreground/50 font-mono">reddix.app/dashboard</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Mock stats row */}
              <div className="grid grid-cols-3 gap-3">
                {useCase.stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="rounded-xl bg-muted/40 border border-border/20 p-3 text-center">
                    <div className="text-[18px] font-bold text-foreground">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Mock lead cards */}
              {[
                { score: 92, label: 'Hot lead', color: 'bg-red-500', title: '"Looking for a tool that..."' },
                { score: 78, label: 'Warm lead', color: 'bg-orange-500', title: '"Any recommendations for..."' },
                { score: 65, label: 'Research', color: 'bg-yellow-500', title: '"Has anyone tried..."' },
              ].map((lead, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/15 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className={`w-2 h-8 rounded-full ${lead.color}/70`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-foreground truncate">{lead.title}</div>
                    <div className="text-[11px] text-muted-foreground">r/SaaS · 2h ago</div>
                  </div>
                  <div className="shrink-0 text-[12px] font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                    {lead.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
