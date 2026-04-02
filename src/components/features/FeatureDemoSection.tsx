import type { FeatureData } from '@/lib/features';

export function FeatureDemoSection({ feature }: { feature: FeatureData }) {
  const Icon = feature.icon;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-6">
              <Icon className="w-3.5 h-3.5" />
              How it works
            </div>
            <h2 className="text-[28px] sm:text-[38px] font-bold tracking-[-0.03em] leading-[1.1] mb-6">
              {feature.demoHeadline}
            </h2>
            <p className="text-[15px] sm:text-[17px] text-muted-foreground leading-[1.7]">
              {feature.demoDescription}
            </p>
          </div>

          {/* Demo visual */}
          <div className="reveal" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-2xl border border-border/40 bg-card shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.06)] overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/30 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <span className="text-[11px] text-muted-foreground/50 ml-2 font-mono">reddix — {feature.title.toLowerCase()}</span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  {feature.demoStats.map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-muted/40 border border-border/20 p-4 text-center"
                    >
                      <div className="text-[22px] font-bold text-foreground">{stat.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Simulated activity */}
                <div className="space-y-2.5 pt-2">
                  {[85, 62, 45].map((val, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: val > 70 ? 'hsl(var(--intent-hot))' : val > 50 ? 'hsl(var(--intent-warm))' : 'hsl(var(--intent-research))' }} />
                      <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${val}%`,
                            backgroundColor: val > 70 ? 'hsl(var(--intent-hot))' : val > 50 ? 'hsl(var(--intent-warm))' : 'hsl(var(--intent-research))',
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-mono text-muted-foreground w-8 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
