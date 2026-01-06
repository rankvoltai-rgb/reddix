import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Sparkles, Lock, CreditCard, Shield, Flame, Clock, Star, ArrowRight, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, SubscriptionPlan } from '@/lib/subscriptionTiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ACTIVITY_FEED = [
  { name: 'Sarah M.', action: 'just started their trial', time: '2 minutes ago' },
  { name: 'Alex R.', action: 'upgraded to Business', time: '5 minutes ago' },
  { name: 'Jordan K.', action: 'just started their trial', time: '8 minutes ago' },
  { name: 'Casey L.', action: 'found their first lead', time: '12 minutes ago' },
  { name: 'Morgan T.', action: 'just started their trial', time: '15 minutes ago' },
];

const COUNTDOWN_END = { days: 2, hours: 14, minutes: 32 };

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);

  // Cycle through activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Redirect if initial setup not completed
  useEffect(() => {
    if (!profileLoading && profile && !profile.initial_setup_completed) {
      navigate('/setup');
    }
  }, [profile, profileLoading, navigate]);

  // Redirect based on subscription status
  useEffect(() => {
    if (!subLoading && subscribed && !profileLoading && profile) {
      // If subscribed but onboarding not complete, go to onboarding
      if (!profile.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
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
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
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

  const currentActivity = ACTIVITY_FEED[activityIndex];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Urgency Banner */}
      <div className="bg-primary text-primary-foreground py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary animate-pulse opacity-50" />
        <div className="relative container max-w-5xl mx-auto flex items-center justify-center gap-3 text-sm md:text-base font-medium">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>Special Launch Offer: 50% off your first month</span>
          <span className="hidden sm:inline">—</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-mono">
              {COUNTDOWN_END.days}d {COUNTDOWN_END.hours}h {COUNTDOWN_END.minutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow-bottom pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-40 left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-3xl floating pointer-events-none" />
      <div className="absolute top-60 right-[5%] w-56 h-56 bg-primary/5 rounded-full blur-3xl floating-delayed pointer-events-none" />

      <div className="relative container max-w-5xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="text-2xl font-bold text-foreground">Reddix</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            Limited Beta Access
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Start Finding Leads in the Next 5 Minutes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join <span className="font-semibold text-foreground">2,847+ founders</span> already using Reddix to turn Reddit conversations into paying customers.
          </p>
        </div>

        {/* Live Activity Feed */}
        <div className="flex justify-center mb-10">
          <div 
            key={activityIndex}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-success/10 border border-success/20 animate-fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-foreground">
              <span className="font-medium">{currentActivity.name}</span>
              {' '}{currentActivity.action}
            </span>
            <span className="text-xs text-muted-foreground">{currentActivity.time}</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionPlan, typeof SUBSCRIPTION_TIERS[SubscriptionPlan]][]).map(([key, tier], index) => (
            <Card 
              key={key} 
              className={`relative flex flex-col overflow-visible pricing-card-hover shine-effect ${
                tier.popular 
                  ? 'border-primary/50 shadow-lg shadow-primary/10 gradient-border' 
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground shadow-lg px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
                <CardDescription className="mt-3">
                  <span className="text-base text-muted-foreground line-through mr-2">${tier.price * 2}</span>
                  <span className="text-5xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground text-base">/month</span>
                </CardDescription>
                <p className="text-xs text-primary font-medium mt-2">Save 50% — Launch offer</p>
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
                  className={`w-full h-12 text-base font-medium group ${tier.popular ? '' : ''}`}
                  size="lg"
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handleCheckout(key)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === key ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Claim Your Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  7 days free, then ${tier.price}/month
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* What you're missing section */}
        <div className="max-w-2xl mx-auto mb-10">
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="py-6">
              <p className="text-sm font-medium text-foreground mb-4 text-center">Without Reddix, you're missing:</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Hours scrolling Reddit manually</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Hot leads going to competitors</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Generic replies that get ignored</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Money-back Guarantee */}
        <div className="max-w-2xl mx-auto mb-10">
          <Card className="bg-card border-success/30">
            <CardContent className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Money-Back Guarantee</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try Reddix risk-free for 7 days. If you don't find at least 10 qualified leads, we'll refund every penny. No questions asked.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="max-w-xl mx-auto mb-10 text-center">
          <blockquote className="text-lg text-foreground italic mb-3">
            "I found 3 paying customers in my first week. Reddix paid for itself 10x over."
          </blockquote>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              AR
            </div>
            <span className="text-sm text-muted-foreground">Alex R., SaaS Founder</span>
            <div className="flex items-center ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
              ))}
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">
            Join <span className="font-medium text-foreground">2,847+ founders</span> finding leads on Reddit
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Secure payment powered by Stripe</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">No card required to start</span>
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
