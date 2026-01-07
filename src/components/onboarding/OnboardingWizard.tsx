import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Check, Loader2, X, Package, Sparkles, Users, Shield, Trophy, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.png';

interface OnboardingData {
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
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like', icon: '💼' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational', icon: '😊' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable', icon: '🤝' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise', icon: '⚙️' },
  { value: 'witty', label: 'Witty', description: 'Clever with personality', icon: '😄' },
] as const;

const PRICING_OPTIONS = [
  { value: 'free', label: 'Free', description: 'No cost to use', icon: '🆓' },
  { value: 'freemium', label: 'Freemium', description: 'Free tier with paid upgrades', icon: '🎁' },
  { value: 'free-trial', label: 'Free Trial', description: 'Trial period before payment', icon: '⏱️' },
  { value: 'paid', label: 'Paid Only', description: 'Requires payment to use', icon: '💰' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing for businesses', icon: '🏢' },
] as const;

const STEPS = [
  { id: 1, title: 'Your Product', shortTitle: 'Product', description: 'Tell us about what you\'re building', icon: Package },
  { id: 2, title: 'Key Features', shortTitle: 'Features', description: 'What are your top selling points?', icon: Sparkles },
  { id: 3, title: 'Target Audience', shortTitle: 'Audience', description: 'Who are you trying to reach?', icon: Users },
  { id: 4, title: 'Competition', shortTitle: 'Competition', description: 'Know your market', icon: Shield },
  { id: 5, title: 'Social Proof', shortTitle: 'Proof', description: 'Success stories & pricing', icon: Trophy },
  { id: 6, title: 'Communication', shortTitle: 'Tone', description: 'How should we sound?', icon: MessageSquare },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [featureInput, setFeatureInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [objectionInput, setObjectionInput] = useState('');
  const { profile, updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Pre-populate data from profile (collected during initial setup)
  const [data, setData] = useState<OnboardingData>({
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
  });

  // Pre-populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setData(prev => ({
        ...prev,
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
      case 1:
        return data.product_name.trim() && data.company_description.trim();
      case 2:
        return data.key_features.length >= 1 && data.value_proposition.trim();
      case 3:
        return data.target_audience.trim();
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = () => {
    updateProfile(
      { 
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
        onboarding_completed: true,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Setup complete!',
            description: 'Welcome to Reddix. Let\'s find some leads!',
          });
          navigate('/dashboard');
        },
        onError: () => {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'Please try again.',
          });
        },
      }
    );
  };

  const progressPercentage = Math.round((step / STEPS.length) * 100);
  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />
      
      {/* Floating decorations */}
      <div className="absolute top-32 left-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-32 right-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative flex flex-col items-center min-h-screen px-4 py-8">
        {/* Logo */}
        <div className="mb-6">
          <img src={logo} alt="Reddix" className="h-9 w-auto" />
        </div>

        {/* Progress Stepper */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, index) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              const Icon = s.icon;
              
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted ? 'bg-primary text-primary-foreground shadow-sm' : ''}
                        ${isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-sm' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {s.shortTitle}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-6 sm:w-10 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-xl">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            {/* Step Header */}
            <div className="bg-gradient-to-b from-muted/50 to-transparent px-8 py-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{currentStep.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              <div className="min-h-[280px]">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Product Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Acme Analytics"
                        value={data.product_name}
                        onChange={(e) => updateField('product_name', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Product URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                      </label>
                      <Input
                        placeholder="e.g., https://acme.com"
                        value={data.product_url}
                        onChange={(e) => updateField('product_url', e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">For natural link mentions in replies</p>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Product Description <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        placeholder="What does your product do? Be specific about the problems it solves..."
                        value={data.company_description}
                        onChange={(e) => updateField('company_description', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Key Features <span className="text-muted-foreground text-xs font-normal">(add up to 5)</span> <span className="text-primary">*</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Real-time analytics dashboard"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addToArray('key_features', featureInput);
                              setFeatureInput('');
                            }
                          }}
                          className="h-11"
                        />
                        <Button 
                          type="button" 
                          variant="secondary"
                          className="h-11 px-4"
                          onClick={() => {
                            addToArray('key_features', featureInput);
                            setFeatureInput('');
                          }}
                          disabled={data.key_features.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      {data.key_features.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {data.key_features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm group hover:bg-destructive/10 transition-colors">
                              {feature}
                              <button onClick={() => removeFromArray('key_features', i)} className="ml-2 hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        What Makes You Different? <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        placeholder="Why should someone choose you over alternatives? What's your unique angle?"
                        value={data.value_proposition}
                        onChange={(e) => updateField('value_proposition', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Unique Differentiators <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                      </label>
                      <Textarea
                        placeholder="Any patents, proprietary tech, exclusive partnerships, or unique methodologies?"
                        value={data.unique_differentiators}
                        onChange={(e) => updateField('unique_differentiators', e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Describe Your Ideal Customer <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        placeholder="Describe your ideal customers. What roles do they have? What problems do they face? Which subreddits might they be in?"
                        value={data.target_audience}
                        onChange={(e) => updateField('target_audience', e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        The more specific, the better. This helps us identify relevant conversations.
                      </p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Competitors <span className="text-muted-foreground text-xs font-normal">(optional, add up to 5)</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Mixpanel, Amplitude"
                          value={competitorInput}
                          onChange={(e) => setCompetitorInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addToArray('competitor_names', competitorInput);
                              setCompetitorInput('');
                            }
                          }}
                          className="h-11"
                        />
                        <Button 
                          type="button" 
                          variant="secondary"
                          className="h-11 px-4"
                          onClick={() => {
                            addToArray('competitor_names', competitorInput);
                            setCompetitorInput('');
                          }}
                          disabled={data.competitor_names.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      {data.competitor_names.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {data.competitor_names.map((name, i) => (
                            <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm group hover:bg-destructive/10 transition-colors">
                              {name}
                              <button onClick={() => removeFromArray('competitor_names', i)} className="ml-2 hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Helps AI understand what alternatives users might mention</p>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Common Objections <span className="text-muted-foreground text-xs font-normal">(optional, add up to 5)</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder='"Too expensive", "Hard to set up"'
                          value={objectionInput}
                          onChange={(e) => setObjectionInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addToArray('common_objections', objectionInput);
                              setObjectionInput('');
                            }
                          }}
                          className="h-11"
                        />
                        <Button 
                          type="button" 
                          variant="secondary"
                          className="h-11 px-4"
                          onClick={() => {
                            addToArray('common_objections', objectionInput);
                            setObjectionInput('');
                          }}
                          disabled={data.common_objections.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      {data.common_objections.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {data.common_objections.map((objection, i) => (
                            <Badge key={i} variant="secondary" className="py-1.5 px-3 text-sm group hover:bg-destructive/10 transition-colors">
                              {objection}
                              <button onClick={() => removeFromArray('common_objections', i)} className="ml-2 hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">AI will preemptively address these concerns</p>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Success Stories <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                      </label>
                      <Textarea
                        placeholder='"Helped Company X increase conversions by 40%" or "Used by 500+ startups"'
                        value={data.success_stories}
                        onChange={(e) => updateField('success_stories', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">Social proof to weave into replies naturally</p>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Pricing Model</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRICING_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField('pricing_model', option.value)}
                            className={`
                              p-3 rounded-xl border-2 text-left transition-all duration-200
                              ${data.pricing_model === option.value 
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                            `}
                          >
                            <div className="text-lg mb-1">{option.icon}</div>
                            <div className="text-sm font-medium text-foreground">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Reply Tone <span className="text-primary">*</span>
                      </label>
                      <p className="text-xs text-muted-foreground">Select your preferred tone for AI-generated replies</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TONE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField('tone', option.value)}
                            className={`
                              p-3 rounded-xl border-2 text-left transition-all duration-200
                              ${data.tone === option.value 
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                            `}
                          >
                            <div className="text-lg mb-1">{option.icon}</div>
                            <div className="text-sm font-medium text-foreground">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-8 py-5 bg-muted/30 border-t border-border">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {step < 6 ? (
                  <Button 
                    type="button"
                    onClick={() => setStep((s) => s + 1)} 
                    disabled={!canProceed()}
                    className="gap-2 group"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleComplete} 
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              Step {step} of {STEPS.length} • {progressPercentage}% complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
