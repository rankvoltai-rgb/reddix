import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Sparkles, Lock, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, SubscriptionPlan } from '@/lib/subscriptionTiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!subLoading && subscribed) {
      navigate('/dashboard');
    }
  }, [subscribed, subLoading, navigate]);

  const handleCheckout = async (planKey: SubscriptionPlan) => {
    if (!session?.access_token) {
      toast.error('Please sign in to continue');
      return;
    }

    setLoadingPlan(planKey);
    
    try {
      const tier = SUBSCRIPTION_TIERS[planKey];
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: tier.price_id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow-bottom pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-40 left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-3xl floating pointer-events-none" />
      <div className="absolute top-60 right-[5%] w-56 h-56 bg-primary/5 rounded-full blur-3xl floating-delayed pointer-events-none" />

      <div className="relative container max-w-5xl mx-auto px-4 py-16">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="text-2xl font-bold text-foreground">Reddix</span>
        </div>

        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            7-day free trial
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unlock the power of AI-driven Reddit lead generation. Find your next customers where they're already talking.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionPlan, typeof SUBSCRIPTION_TIERS[SubscriptionPlan]][]).map(([key, tier], index) => (
            <Card 
              key={key} 
              className={`relative flex flex-col pricing-card-hover shine-effect ${
                tier.popular 
                  ? 'border-primary/50 shadow-lg shadow-primary/5' 
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-lg px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
                <CardDescription className="mt-3">
                  <span className="text-5xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground text-base">/month</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 pt-2">
                <ul className="space-y-3.5">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="flex-col gap-3 pb-8">
                <Button 
                  className={`w-full h-12 text-base font-medium ${tier.popular ? '' : ''}`}
                  size="lg"
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handleCheckout(key)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === key ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Start Free Trial
                </Button>
                <p className="text-xs text-muted-foreground">
                  7 days free, then ${tier.price}/month
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Secure payment powered by Stripe</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Secure Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
