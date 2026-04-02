import type { FeatureData } from '@/lib/features';

export function FeatureBenefits({ feature }: { feature: FeatureData }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1]">
            Why{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              {feature.title.toLowerCase()}
            </span>
            {' '}matters
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-[500px] mx-auto">
            Built to save you time and surface the opportunities that actually convert.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {feature.benefits.map((benefit, i) => {
            const BIcon = benefit.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl border border-border/40 bg-background p-7 shadow-[0_4px_20px_-6px_hsl(var(--foreground)/0.04)] hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.1)] hover:border-primary/20 transition-all duration-300 reveal"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/[0.1] group-hover:border-primary/20 transition-colors">
                  <BIcon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-[16px] font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-[1.7]">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
