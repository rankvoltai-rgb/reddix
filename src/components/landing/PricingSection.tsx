import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/subscriptionTiers';

const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => ({
  key,
  ...tier,
}));

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you're ready to scale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative rounded-xl border p-6 pricing-card-hover ${
                tier.popular
                  ? 'border-primary/40 gradient-border bg-background shadow-lg'
                  : 'border-border bg-background'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <div className="mt-3">
                  {tier.price !== null ? (
                    <span className="text-4xl font-bold text-foreground">
                      ${tier.price}
                      {tier.price > 0 && (
                        <span className="text-base font-normal text-muted-foreground">/mo</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">Custom</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate('/auth')}
                variant={tier.popular ? 'default' : 'outline'}
                className={`w-full rounded-full ${tier.popular ? '' : ''}`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
