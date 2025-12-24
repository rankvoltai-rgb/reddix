import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of AI-driven Reddit lead generation. Find your next customers where they're already talking.
          </p>
          <p className="mt-3 text-primary font-medium">Start with a 7-day free trial</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionPlan, typeof SUBSCRIPTION_TIERS[SubscriptionPlan]][]).map(([key, tier]) => (
            <Card 
              key={key} 
              className={`relative flex flex-col ${tier.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="flex-col gap-2">
                <Button 
                  className="w-full" 
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
                <p className="text-xs text-muted-foreground">7 days free, then ${tier.price}/month</p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <span className="text-sm">🔒 SSL Encrypted</span>
            <span className="text-sm">💳 Secure Billing</span>
            <span className="text-sm">❌ No Hidden Fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
