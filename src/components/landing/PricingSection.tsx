import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/subscriptionTiers';

const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, t]) => ({ key, ...t }));

const tierAccents = [
  { gradient: 'from-muted/20 to-background', border: 'border-border/40', iconBg: 'bg-muted' },
  { gradient: 'from-primary/[0.04] to-background', border: 'border-primary/25', iconBg: 'bg-primary/10' },
  { gradient: 'from-foreground/[0.02] to-background', border: 'border-border/40', iconBg: 'bg-foreground/5' },
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      <div className="relative max-w-[1050px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Pay once. Or subscribe monthly.
          </div>
          <h2 className="text-3xl sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Pricing that{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              makes sense
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            No hidden fees. No annual lock-in. Just pay for the leads you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((tier, idx) => {
            const accent = tierAccents[idx] || tierAccents[0];
            return (
              <div
                key={tier.key}
                className={`group relative rounded-2xl border bg-gradient-to-b ${accent.gradient} transition-all duration-500 hover:-translate-y-1 ${
                  tier.popular
                    ? `${accent.border} shadow-[0_24px_60px_-12px_hsl(var(--primary)/0.12)] scale-[1.03] z-10`
                    : `${accent.border} hover:border-border/60 hover:shadow-[0_20px_50px_-12px_hsl(var(--foreground)/0.06)]`
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-lg shadow-primary/25 tracking-wide">
                      <Zap className="w-3 h-3" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-7">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className={`w-9 h-9 rounded-xl ${accent.iconBg} flex items-center justify-center`}>
                      {idx === 0 ? <Shield className="w-4 h-4 text-muted-foreground" /> :
                       idx === 1 ? <Sparkles className="w-4 h-4 text-primary" /> :
                       <Zap className="w-4 h-4 text-foreground/60" />}
                    </div>
                    <h3 className="text-[16px] font-bold text-foreground">{tier.name}</h3>
                  </div>

                  <div className="mb-6">
                    {tier.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">
                          ${tier.price}
                        </span>
                        {'mode' in tier && tier.mode === 'subscription' && (
                          <span className="text-[15px] text-muted-foreground font-medium">/mo</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[36px] font-bold text-foreground tracking-tight">Custom</span>
                    )}
                    {'mode' in tier && tier.mode === 'payment' && (
                      <p className="text-[13px] text-muted-foreground mt-1.5">One-time payment · Lifetime access</p>
                    )}
                    {'mode' in tier && tier.mode === 'subscription' && (
                      <p className="text-[13px] text-muted-foreground mt-1.5">7-day free trial · Cancel anytime</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate('/auth')}
                    variant={tier.popular ? 'default' : 'outline'}
                    className={`w-full rounded-xl h-12 text-[14px] font-semibold transition-all duration-300 ${
                      tier.popular ? 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25' : 'hover:bg-muted/50'
                    }`}
                  >
                    {tier.cta}
                    {tier.popular && <ArrowRight className="w-4 h-4 ml-1.5" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[13px] text-muted-foreground reveal" style={{ animationDelay: '0.3s' }}>
          {[
            '🔒 Secure payments via Stripe',
            '⚡ Instant access after signup',
            '🚫 No annual contracts',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
