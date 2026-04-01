import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/subscriptionTiers';

const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, t]) => ({ key, ...t }));

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Simple,{' '}
            <span className="font-display italic font-normal">transparent</span>{' '}
            pricing
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative rounded-2xl border transition-all duration-300 ${
                tier.popular
                  ? 'border-primary/30 bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] scale-[1.03] z-10'
                  : 'border-border bg-background hover:border-border/80 hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-lg shadow-primary/20">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-[15px] font-semibold text-foreground">{tier.name}</h3>

                <div className="mt-5 mb-6">
                  {tier.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[44px] font-semibold tracking-tight text-foreground leading-none">
                        ${tier.price}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-[14px] text-muted-foreground">/mo</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[30px] font-semibold text-foreground">Custom</span>
                  )}
                  {tier.price === 0 && (
                    <p className="text-[12px] text-muted-foreground mt-1">Free forever</p>
                  )}
                  {tier.price !== null && tier.price > 0 && (
                    <p className="text-[12px] text-muted-foreground mt-1">Billed monthly · Cancel anytime</p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate('/auth')}
                  variant={tier.popular ? 'default' : 'outline'}
                  className={`w-full rounded-xl h-11 text-[13px] font-medium ${
                    tier.popular ? 'shadow-lg shadow-primary/15' : ''
                  }`}
                >
                  {tier.cta}
                  {tier.popular && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
