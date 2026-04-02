import { ArrowRight, User } from 'lucide-react';
import type { FeatureData } from '@/lib/features';

export function FeatureUseCases({ feature }: { feature: FeatureData }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1]">
            Real-world{' '}
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              use cases
            </span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-[500px] mx-auto">
            See how different teams use {feature.title.toLowerCase()} to grow their business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {feature.useCases.map((uc, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border/40 bg-background overflow-hidden hover:border-primary/20 hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.08)] transition-all duration-300 reveal"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border/20">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/[0.06] border border-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary/60" />
                  </div>
                  <span className="text-[13px] font-semibold text-foreground">{uc.persona}</span>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1.5 block">Scenario</span>
                  <p className="text-[13px] text-muted-foreground leading-[1.6]">{uc.scenario}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1.5 block">Outcome</span>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <p className="text-[13px] font-medium text-foreground leading-[1.6]">{uc.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
