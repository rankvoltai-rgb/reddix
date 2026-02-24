import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, SubscriptionPlan } from '@/lib/subscriptionTiers';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Check, Loader2, X, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';

interface OnboardingData {
  full_name: string;
  product_name: string;
  product_url: string;
  company_description: string;
  target_audience: string;
  value_proposition: string;
  key_features: string[];
  competitor_names: string[];
  common_objections: string[];
  success_stories: string;
  pricing_model: string;
  unique_differentiators: string;
  tone: 'professional' | 'casual' | 'friendly' | 'technical' | 'witty';
  selected_plan: SubscriptionPlan | null;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like', icon: '💼' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational', icon: '😊' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable', icon: '🤝' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise', icon: '⚙️' },
  { value: 'witty', label: 'Witty', description: 'Clever with personality', icon: '😄' },
] as const;

const PRICING_OPTIONS = [
  { value: 'free', label: 'Free', icon: '🆓' },
  { value: 'freemium', label: 'Freemium', icon: '🎁' },
  { value: 'free-trial', label: 'Free Trial', icon: '⏱️' },
  { value: 'paid', label: 'Paid Only', icon: '💰' },
  { value: 'enterprise', label: 'Enterprise', icon: '🏢' },
] as const;

const TOTAL_STEPS = 6;

export default function OnboardingWizard() {
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [step, setStep] = useState(1);
  const [featureInput, setFeatureInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [objectionInput, setObjectionInput] = useState('');
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const { profile, updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle checkout=success redirect from Stripe
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    const stepParam = searchParams.get('step');
    if (checkout === 'success') {
      refreshSubscription();
      if (stepParam) setStep(Number(stepParam));
      else setStep(3);
    }
  }, []);

  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    product_name: '',
    product_url: '',
    company_description: '',
    target_audience: '',
    value_proposition: '',
    key_features: [],
    competitor_names: [],
    common_objections: [],
    success_stories: '',
    pricing_model: 'freemium',
    unique_differentiators: '',
    tone: 'friendly',
    selected_plan: null,
  });

  useEffect(() => {
    if (profile) {
      setData(prev => ({
        ...prev,
        full_name: profile.full_name || prev.full_name,
        product_name: profile.product_name || prev.product_name,
        product_url: profile.product_url || prev.product_url,
        company_description: profile.company_description || prev.company_description,
        target_audience: profile.target_audience || prev.target_audience,
        value_proposition: profile.value_proposition || prev.value_proposition,
        key_features: profile.key_features || prev.key_features,
        competitor_names: profile.competitor_names || prev.competitor_names,
        common_objections: profile.common_objections || prev.common_objections,
        success_stories: profile.success_stories || prev.success_stories,
        pricing_model: profile.pricing_model || prev.pricing_model,
        unique_differentiators: profile.unique_differentiators || prev.unique_differentiators,
        tone: profile.tone || prev.tone,
      }));
    }
  }, [profile]);

  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: 'key_features' | 'competitor_names' | 'common_objections', value: string) => {
    if (value.trim() && data[field].length < 5) {
      setData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    }
  };

  const removeFromArray = (field: 'key_features' | 'competitor_names' | 'common_objections', index: number) => {
    setData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.full_name.trim() && data.product_name.trim() && data.company_description.trim().length >= 10 && data.target_audience.trim();
      case 2: return data.selected_plan !== null;
      case 3: return data.key_features.length >= 1 && data.value_proposition.trim();
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const handlePlanSelect = async (planKey: SubscriptionPlan) => {
    if (planKey === 'free') {
      updateField('selected_plan', 'free');
    } else if (planKey === 'premium') {
      if (!session?.access_token) {
        toast({ variant: 'destructive', title: 'Please sign in to continue' });
        return;
      }
      setLoadingPlan('premium');
      try {
        const tier = SUBSCRIPTION_TIERS.premium;
        const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
          body: { priceId: tier.price_id },
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (error) throw error;
        if (checkoutData?.url) window.location.href = checkoutData.url;
      } catch (error: any) {
        toast({ variant: 'destructive', title: `Checkout failed: ${error.message}` });
      } finally {
        setLoadingPlan(null);
      }
    } else if (planKey === 'enterprise') {
      window.location.href = 'mailto:support@reddix.app?subject=Enterprise%20Plan%20Inquiry';
    }
  };

  const handleContinueFromPlan = () => {
    if (data.selected_plan === 'free') {
      // Save selected_plan to profile immediately
      updateProfile(
        { selected_plan: 'free' } as any,
        { onSuccess: () => setStep(3) }
      );
    }
  };

  const handleComplete = async () => {
    const nextScan = new Date(Date.now() + 4 * 60 * 60 * 1000);

    updateProfile(
      {
        full_name: data.full_name,
        product_name: data.product_name,
        product_url: data.product_url || null,
        company_description: data.company_description,
        target_audience: data.target_audience,
        value_proposition: data.value_proposition,
        key_features: data.key_features.length > 0 ? data.key_features : null,
        competitor_names: data.competitor_names.length > 0 ? data.competitor_names : null,
        common_objections: data.common_objections.length > 0 ? data.common_objections : null,
        success_stories: data.success_stories || null,
        pricing_model: data.pricing_model || null,
        unique_differentiators: data.unique_differentiators || null,
        tone: data.tone,
        initial_setup_completed: true,
        onboarding_completed: true,
        auto_pilot_enabled: true,
        next_scheduled_scan_at: nextScan.toISOString(),
      } as any,
      {
        onSuccess: async () => {
          toast({ title: 'Setup complete!', description: 'Configuring your scanner automatically...' });
          triggerAutoSetup();
          navigate('/dashboard');
        },
        onError: () => {
          toast({ variant: 'destructive', title: 'Something went wrong', description: 'Please try again.' });
        },
      }
    );
  };

  const triggerAutoSetup = async () => {
    try {
      const { firecrawlApi } = await import('@/lib/api/firecrawl');
      const keywordsResult = await firecrawlApi.autoGenerateKeywords();
      if (keywordsResult.success) console.log(`Generated ${keywordsResult.inserted} keywords`);

      const subredditsResult = await firecrawlApi.discoverSubreddits();
      if (subredditsResult.success && subredditsResult.suggestions) {
        const topSubreddits = subredditsResult.suggestions.slice(0, 5);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          for (const sub of topSubreddits) {
            await supabase.from('monitored_subreddits').upsert({
              user_id: user.id,
              subreddit_name: sub.name.toLowerCase(),
              is_active: true,
            }, { onConflict: 'user_id,subreddit_name' }).select();
          }
        }
      }

      await firecrawlApi.scanForLeads('auto');
    } catch (error) {
      console.error('Auto-setup error:', error);
    }
  };

  const progressPercentage = Math.round((step / TOTAL_STEPS) * 100);

  const stepTitles: Record<number, string> = {
    1: 'Personalize your lead generation',
    2: 'Choose your lead generation plan',
    3: 'Key features & value proposition',
    4: 'Competition & objections',
    5: 'Social proof & pricing',
    6: 'Communication tone',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
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
              {/* Step 1: Personalization */}
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
                    <label className="text-sm font-medium text-foreground">Website URL <span className="text-xs text-muted-foreground font-normal">(optional)</span></label>
                    <Input placeholder="https://yourproduct.com" value={data.product_url} onChange={(e) => updateField('product_url', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Describe Your Product <span className="text-primary">*</span></label>
                    <Textarea placeholder="Briefly describe your product or service and the problems it solves..." value={data.company_description} onChange={(e) => updateField('company_description', e.target.value)} rows={3} maxLength={1000} className="resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Target Audience <span className="text-primary">*</span></label>
                    <Textarea placeholder="Describe your ideal customers..." value={data.target_audience} onChange={(e) => updateField('target_audience', e.target.value)} rows={3} className="resize-none" />
                  </div>
                </div>
              )}

              {/* Step 2: Plan Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
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
                            {tier.price !== null ? `$${tier.price.toFixed(2)}` : 'Custom'}
                            {tier.price !== null && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
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
                  <p className="text-xs text-center text-muted-foreground">7-day free trial on Premium · Cancel anytime</p>
                </div>
              )}

              {/* Step 3: Features + Value Prop */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Key Features <span className="text-xs text-muted-foreground font-normal">(up to 5)</span> <span className="text-primary">*</span></label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g., Real-time analytics dashboard" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addToArray('key_features', featureInput); setFeatureInput(''); } }} className="h-11" />
                      <Button type="button" variant="secondary" className="h-11 px-4" onClick={() => { addToArray('key_features', featureInput); setFeatureInput(''); }} disabled={data.key_features.length >= 5}>Add</Button>
                    </div>
                    {data.key_features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.key_features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm">
                            {f}
                            <button onClick={() => removeFromArray('key_features', i)} className="ml-2 hover:text-destructive"><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">What Makes You Different? <span className="text-primary">*</span></label>
                    <Textarea placeholder="Why should someone choose you over alternatives?" value={data.value_proposition} onChange={(e) => updateField('value_proposition', e.target.value)} rows={4} className="resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Unique Differentiators <span className="text-xs text-muted-foreground font-normal">(optional)</span></label>
                    <Textarea placeholder="Any patents, proprietary tech, exclusive partnerships?" value={data.unique_differentiators} onChange={(e) => updateField('unique_differentiators', e.target.value)} rows={3} className="resize-none" />
                  </div>
                </div>
              )}

              {/* Step 4: Competition + Objections */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Competitors <span className="text-xs text-muted-foreground font-normal">(optional, up to 5)</span></label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g., Mixpanel" value={competitorInput} onChange={(e) => setCompetitorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addToArray('competitor_names', competitorInput); setCompetitorInput(''); } }} className="h-11" />
                      <Button type="button" variant="secondary" className="h-11 px-4" onClick={() => { addToArray('competitor_names', competitorInput); setCompetitorInput(''); }} disabled={data.competitor_names.length >= 5}>Add</Button>
                    </div>
                    {data.competitor_names.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.competitor_names.map((n, i) => (
                          <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm">{n}<button onClick={() => removeFromArray('competitor_names', i)} className="ml-2 hover:text-destructive"><X className="w-3 h-3" /></button></Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Common Objections <span className="text-xs text-muted-foreground font-normal">(optional, up to 5)</span></label>
                    <div className="flex gap-2">
                      <Input placeholder='"Too expensive", "Hard to set up"' value={objectionInput} onChange={(e) => setObjectionInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addToArray('common_objections', objectionInput); setObjectionInput(''); } }} className="h-11" />
                      <Button type="button" variant="secondary" className="h-11 px-4" onClick={() => { addToArray('common_objections', objectionInput); setObjectionInput(''); }} disabled={data.common_objections.length >= 5}>Add</Button>
                    </div>
                    {data.common_objections.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.common_objections.map((o, i) => (
                          <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm">{o}<button onClick={() => removeFromArray('common_objections', i)} className="ml-2 hover:text-destructive"><X className="w-3 h-3" /></button></Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Social Proof + Pricing Model */}
              {step === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Success Stories <span className="text-xs text-muted-foreground font-normal">(optional)</span></label>
                    <Textarea placeholder='"Helped Company X increase conversions by 40%"' value={data.success_stories} onChange={(e) => updateField('success_stories', e.target.value)} rows={4} className="resize-none" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Your Pricing Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRICING_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" onClick={() => updateField('pricing_model', opt.value)} className={`p-3 rounded-xl border-2 text-left transition-all ${data.pricing_model === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <div className="text-lg mb-1">{opt.icon}</div>
                          <div className="text-sm font-medium text-foreground">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Tone */}
              {step === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground">Select your preferred tone for AI-generated replies</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TONE_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => updateField('tone', opt.value)} className={`p-3 rounded-xl border-2 text-left transition-all ${data.tone === opt.value ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
                        <div className="text-lg mb-1">{opt.icon}</div>
                        <div className="text-sm font-medium text-foreground">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.description}</div>
                      </button>
                    ))}
                  </div>
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
                {step > 1 && step !== 2 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                {step === 2 ? (
                  data.selected_plan === 'free' ? (
                    <Button type="button" onClick={handleContinueFromPlan} disabled={isUpdating} className="gap-2">
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  ) : (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  )
                ) : step < TOTAL_STEPS ? (
                  <Button type="button" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleComplete} disabled={isUpdating} className="gap-2">
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Complete Setup</>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
