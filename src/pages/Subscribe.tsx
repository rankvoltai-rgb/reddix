import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, SubscriptionPlan } from '@/lib/subscriptionTiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.initial_setup_completed) navigate('/setup');
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (!subLoading && subscribed && !profileLoading && profile) {
      navigate(profile.onboarding_completed ? '/dashboard' : '/onboarding');
    }
  }, [subscribed, subLoading, profile, profileLoading, navigate]);

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
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (authLoading || subLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <span className="text-2xl font-bold text-foreground">Reddix</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            Choose your plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start finding qualified leads on Reddit. 7-day free trial on all plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionPlan, typeof SUBSCRIPTION_TIERS[SubscriptionPlan]][]).map(([key, tier]) => (
            <Card
              key={key}
              className={`relative flex flex-col ${
                tier.popular ? 'border-primary shadow-sm' : 'border-border'
              }`}
            >
              <CardHeader className="text-center pt-8 pb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CardTitle className="text-xl font-semibold">{tier.name}</CardTitle>
                  {tier.popular && (
                    <Badge variant="default" className="text-xs px-2 py-0.5">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground text-base">/month</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pt-2">
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex-col gap-2 pb-8">
                <Button
                  className="w-full h-11 text-sm font-medium group"
                  size="lg"
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handleCheckout(key)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === key && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  7 days free, then ${tier.price}/mo
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>7-day money-back guarantee</span>
          </div>
          <span className="hidden sm:inline text-border">·</span>
          <span>Secure payment via Stripe</span>
          <span className="hidden sm:inline text-border">·</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}
