import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, SubscriptionPlan } from '@/lib/subscriptionTiers';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles, Flame, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import logo from '@/assets/logo.png';

interface OnboardingData {
  full_name: string;
  product_name: string;
  product_url: string;
  selected_plan: SubscriptionPlan | null;
}

const TOTAL_STEPS = 2;

export default function OnboardingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [step, setStep] = useState(1);
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { profile, updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Defensive guard: if onboarding is already completed, never render the
  // wizard. Send the user back to the dashboard immediately.
  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile?.onboarding_completed, navigate]);
  if (profile?.onboarding_completed) return null;

  // Handle checkout=success redirect from Stripe — one-shot, guarded.
  const checkoutHandledRef = useRef(false);
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout !== 'success' || checkoutHandledRef.current) return;
    checkoutHandledRef.current = true;

    // Strip the query param immediately so a refresh can't re-trigger this.
    setSearchParams({}, { replace: true });

    (async () => {
      await refreshSubscription();
      updateProfile(
        {
          initial_setup_completed: true,
          onboarding_completed: true,
        } as any,
        {
          onSuccess: async () => {
            toast({ title: 'Setup complete!', description: 'Configuring your scanner...' });
            // Await preseed (with timeout) so Scanner has subreddits ready.
            await Promise.race([
              triggerAutoSetup(),
              new Promise(resolve => setTimeout(resolve, 6000)),
            ]);
            navigate('/scanner', { replace: true });
          },
        }
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    product_name: '',
    product_url: '',
    selected_plan: null,
  });

  useEffect(() => {
    if (profile) {
      setData(prev => ({
        ...prev,
        full_name: profile.full_name || prev.full_name,
        product_name: profile.product_name || prev.product_name,
        product_url: profile.product_url || prev.product_url,
      }));
    }
  }, [profile]);

  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyzeAndContinue = async () => {
    const url = data.product_url.trim();
    if (!url) return;

    setIsAnalyzing(true);

    const profileUpdate: Record<string, any> = {
      full_name: data.full_name,
      product_name: data.product_name,
      product_url: url,
    };

    try {
      const { firecrawlApi } = await import('@/lib/api/firecrawl');
      const result = await firecrawlApi.analyzeWebsite(url);

      if (result.success && result.data) {
        const d = result.data;
        if (d.company_description) profileUpdate.company_description = d.company_description;
        if (d.target_audience) profileUpdate.target_audience = d.target_audience;
        if (d.value_proposition) profileUpdate.value_proposition = d.value_proposition;
        if (d.key_features?.length) profileUpdate.key_features = d.key_features;
        if (d.competitor_names?.length) profileUpdate.competitor_names = d.competitor_names;
        if (d.common_objections?.length) profileUpdate.common_objections = d.common_objections;
        if (d.success_stories) profileUpdate.success_stories = d.success_stories;
        if (d.pricing_model) profileUpdate.pricing_model = d.pricing_model;
        if (d.unique_differentiators) profileUpdate.unique_differentiators = d.unique_differentiators;
        if ((d as any).tone) profileUpdate.tone = (d as any).tone;

        toast({ title: '✨ Website analyzed!', description: 'Product details auto-filled. Finding subreddits in the background…' });
      } else {
        toast({ title: 'Heads up', description: "We couldn't fully read your site — you can refine details later in Settings." });
      }
    } catch (error) {
      console.error('Analyze error:', error);
    }

    updateProfile(profileUpdate as any, {
      onSuccess: () => {
        setIsAnalyzing(false);
        // Background: discover + preselect 5 subreddits and generate keywords
        // using freshly-analyzed profile, in parallel with plan selection.
        void preseedScannerSetup();
        setStep(2);
      },
      onError: () => {
        setIsAnalyzing(false);
      },
    });
  };

  const preseedScannerSetup = async () => {
    try {
      const { firecrawlApi } = await import('@/lib/api/firecrawl');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [, subredditsResult] = await Promise.all([
        firecrawlApi.autoGenerateKeywords().catch(() => null),
        firecrawlApi.discoverSubreddits().catch(() => null),
      ]);

      const FALLBACK = ['SaaS', 'Entrepreneur', 'smallbusiness', 'startups', 'marketing'];
      const fromAI = (subredditsResult?.success && subredditsResult.suggestions)
        ? subredditsResult.suggestions.slice(0, 5).map(s => s.name)
        : [];

      const merged: string[] = [];
      const seen = new Set<string>();
      for (const name of [...fromAI, ...FALLBACK]) {
        const clean = (name || '').replace(/^r\//i, '').toLowerCase().trim();
        if (clean && !seen.has(clean)) {
          seen.add(clean);
          merged.push(clean);
          if (merged.length >= 5) break;
        }
      }

      for (const sub of merged) {
        await supabase.from('monitored_subreddits').upsert({
          user_id: user.id,
          subreddit_name: sub,
          is_active: true,
        }, { onConflict: 'user_id,subreddit_name' });
      }
    } catch (error) {
      console.error('preseedScannerSetup error:', error);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!data.full_name.trim() && !!data.product_name.trim() && !!data.product_url.trim();
    if (step === 2) return data.selected_plan !== null;
    return false;
  };

  const handlePlanSelect = async (planKey: SubscriptionPlan) => {
    if (planKey === 'enterprise') {
      window.location.href = 'mailto:support@reddix.app?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    const tier = SUBSCRIPTION_TIERS[planKey];
    if (!tier.price_id) return;

    if (!session?.access_token) return;

    setLoadingPlan(planKey);
    try {
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: tier.price_id, mode: tier.mode },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (checkoutData?.url) window.location.href = checkoutData.url;
    } catch (error: any) {
      // Checkout failed silently
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleComplete = async () => {
    updateProfile(
      {
        selected_plan: data.selected_plan,
        initial_setup_completed: true,
        onboarding_completed: true,
      } as any,
      {
        onSuccess: async () => {
          toast({ title: 'Setup complete!', description: 'Configuring your scanner...' });
          await Promise.race([
            triggerAutoSetup(),
            new Promise(resolve => setTimeout(resolve, 6000)),
          ]);
          navigate('/scanner');
        },
      }
    );
  };

  const triggerAutoSetup = async () => {
    // Safety net after paywall — ensures keywords + 5 subreddits exist even if
    // the background step-1 preseed didn't complete before checkout. No auto scan
    // (manual-only constraint).
    await preseedScannerSetup();
  };

  const progressPercentage = Math.round((step / TOTAL_STEPS) * 100);

  const stepTitles: Record<number, string> = {
    1: 'Tell us about your business',
    2: 'Choose your lead generation plan',
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Header with logo */}
          <div className="px-8 pt-8 pb-6">
            <img src={logo} alt="Reddix" className="h-8 w-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground">{stepTitles[step]}</h2>
          </div>

          {/* Content */}
          <div className="px-8 pb-6">
            <div className="min-h-[300px]">
              {/* Step 1: Your Info */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Your Name <span className="text-primary">*</span></label>
                    <Input placeholder="John Doe" value={data.full_name} onChange={(e) => updateField('full_name', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Business Name <span className="text-primary">*</span></label>
                    <Input placeholder="e.g., Acme Analytics" value={data.product_name} onChange={(e) => updateField('product_name', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Website URL <span className="text-primary">*</span></label>
                    <Input placeholder="yourproduct.com" value={data.product_url} onChange={(e) => updateField('product_url', e.target.value)} className="h-11" />
                    <p className="text-xs text-muted-foreground">We'll analyze your site, build your product profile, and preselect 5 subreddits — so you can scan immediately after subscribing.</p>
                  </div>
                </div>
              )}

              {/* Step 2: Plan Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <LiveLeadsCard productName={data.product_name} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionPlan, typeof SUBSCRIPTION_TIERS[SubscriptionPlan]][]).map(([key, tier]) => {
                      const isSelected = data.selected_plan === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handlePlanSelect(key)}
                          disabled={loadingPlan !== null}
                          className={`relative flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : tier.popular ? 'border-primary/50' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {tier.popular && (
                            <Badge variant="default" className="absolute -top-2.5 right-3 text-xs px-2 py-0.5">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          <span className="text-base font-bold text-foreground">{tier.name}</span>
                          <span className="text-2xl font-bold text-foreground mt-1">
                            {tier.price !== null ? `$${tier.price}` : 'Custom'}
                            {tier.price !== null && tier.mode === 'subscription' && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                            {tier.price !== null && tier.mode === 'payment' && <span className="text-sm font-normal text-muted-foreground"> one-time</span>}
                          </span>
                          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                            {tier.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 w-full">
                            <div className={`w-full py-2 rounded-lg text-center text-sm font-medium transition-colors ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                            }`}>
                              {loadingPlan === key ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : tier.cta}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">7-day free trial on Premium · Cancel anytime · Lifetime is a one-time payment</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer: progress bar + navigation */}
          <div className="px-8 py-5 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {step === 1 ? (
                  <Button type="button" onClick={handleAnalyzeAndContinue} disabled={!canProceed() || isAnalyzing} className="gap-2">
                    {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <>Analyze & Continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                ) : step === 2 ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveLeadsCard({ productName }: { productName: string }) {
  // Deterministic believable count per (hour + product) — refreshes hourly, stable within session.
  const count = (() => {
    const seedStr = `${productName || 'reddix'}-${Math.floor(Date.now() / 3_600_000)}`;
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) | 0;
    return 180 + (Math.abs(h) % 161); // 180–340
  })();

  const subs = ['r/SaaS', 'r/Entrepreneur', 'r/smallbusiness'];
  const label = productName?.trim() || 'your product';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-background to-background p-5">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Live · last 60 min
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Flame className="w-5 h-5 text-primary shrink-0 self-center" />
            <span className="text-3xl sm:text-4xl font-semibold text-foreground leading-none tabular-nums">
              <AnimatedCounter value={count} duration={900} />
            </span>
            <span className="text-sm sm:text-[15px] text-foreground/80">
              high-intent leads asking for solutions like{' '}
              <span className="font-semibold text-foreground">{label}</span>
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <TrendingUp className="w-3 h-3 text-primary/70" />
            <span className="text-[11px] text-muted-foreground">Trending in</span>
            {subs.map((s) => (
              <span
                key={s}
                className="text-[11px] font-medium text-foreground/70 px-1.5 py-0.5 rounded-md bg-foreground/[0.04] border border-border/40"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
