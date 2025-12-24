import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Check, Loader2, Plus, X, Package, Sparkles, Users, Shield, Trophy, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
  { value: 'witty', label: 'Witty', description: 'Clever with personality' },
] as const;

const PRICING_OPTIONS = [
  { value: 'free', label: 'Free', description: 'No cost to use' },
  { value: 'freemium', label: 'Freemium', description: 'Free tier with paid upgrades' },
  { value: 'free-trial', label: 'Free Trial', description: 'Trial period before payment' },
  { value: 'paid', label: 'Paid Only', description: 'Requires payment to use' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing for businesses' },
] as const;

const STEPS = [
  { id: 1, title: 'Your Product', description: 'Tell us about what you\'re building', icon: Package },
  { id: 2, title: 'Key Features', description: 'What are your top selling points?', icon: Sparkles },
  { id: 3, title: 'Target Audience', description: 'Who are you trying to reach?', icon: Users },
  { id: 4, title: 'Competition & Objections', description: 'Know your market', icon: Shield },
  { id: 5, title: 'Social Proof', description: 'Success stories & pricing', icon: Trophy },
  { id: 6, title: 'Communication Style', description: 'How should we sound?', icon: MessageSquare },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [featureInput, setFeatureInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [objectionInput, setObjectionInput] = useState('');
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
  
  const { updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

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
            description: 'Choose a plan to start finding leads.',
          });
          navigate('/subscribe');
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

  const progressPercentage = ((step - 1) / (STEPS.length - 1)) * 100;
  const StepIcon = STEPS[step - 1].icon;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl floating pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl floating-delayed pointer-events-none" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Reddix" className="h-8 opacity-0" />
            <span className="text-2xl font-bold text-foreground">Reddix</span>
          </div>

          {/* Progress Section */}
          <div className="mb-8 animate-fade-in">
            {/* Progress bar */}
            <div className="relative mb-6">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step >= s.id
                        ? 'bg-primary scale-100'
                        : 'bg-muted scale-75'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Step {step} of {STEPS.length}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-foreground">
                    {STEPS[step - 1].title}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {STEPS[step - 1].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card-elevated rounded-2xl p-8 animate-fade-in">
            <div className="min-h-[320px]">
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="product_name" className="text-sm font-medium">Product Name *</Label>
                    <Input
                      id="product_name"
                      placeholder="e.g., Acme Analytics"
                      value={data.product_name}
                      onChange={(e) => updateField('product_name', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_url" className="text-sm font-medium">Product URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Input
                      id="product_url"
                      placeholder="e.g., https://acme.com"
                      value={data.product_url}
                      onChange={(e) => updateField('product_url', e.target.value)}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">For natural link mentions in replies</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_description" className="text-sm font-medium">Product Description *</Label>
                    <Textarea
                      id="company_description"
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
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Key Features <span className="text-muted-foreground font-normal">(add up to 5)</span> *</Label>
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
                        variant="outline" 
                        size="icon"
                        className="h-11 w-11 shrink-0"
                        onClick={() => {
                          addToArray('key_features', featureInput);
                          setFeatureInput('');
                        }}
                        disabled={data.key_features.length >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.key_features.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="gap-1.5 pr-1.5 py-1.5 text-sm">
                          {feature}
                          <button onClick={() => removeFromArray('key_features', i)} className="ml-1 hover:text-destructive transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value_proposition" className="text-sm font-medium">What Makes You Different? *</Label>
                    <Textarea
                      id="value_proposition"
                      placeholder="Why should someone choose you over alternatives? What's your unique angle?"
                      value={data.value_proposition}
                      onChange={(e) => updateField('value_proposition', e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unique_differentiators" className="text-sm font-medium">Unique Differentiators <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      id="unique_differentiators"
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
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="target_audience" className="text-sm font-medium">Target Audience *</Label>
                    <Textarea
                      id="target_audience"
                      placeholder="Describe your ideal customers. What roles do they have? What problems do they face? Which subreddits might they be in?"
                      value={data.target_audience}
                      onChange={(e) => updateField('target_audience', e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Competitors <span className="text-muted-foreground font-normal">(optional, add up to 5)</span></Label>
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
                        variant="outline" 
                        size="icon"
                        className="h-11 w-11 shrink-0"
                        onClick={() => {
                          addToArray('competitor_names', competitorInput);
                          setCompetitorInput('');
                        }}
                        disabled={data.competitor_names.length >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.competitor_names.map((name, i) => (
                        <Badge key={i} variant="secondary" className="gap-1.5 pr-1.5 py-1.5 text-sm">
                          {name}
                          <button onClick={() => removeFromArray('competitor_names', i)} className="ml-1 hover:text-destructive transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Helps AI understand what alternatives users might mention</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Common Objections <span className="text-muted-foreground font-normal">(optional, add up to 5)</span></Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder='e.g., "Too expensive", "Hard to set up"'
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
                        variant="outline" 
                        size="icon"
                        className="h-11 w-11 shrink-0"
                        onClick={() => {
                          addToArray('common_objections', objectionInput);
                          setObjectionInput('');
                        }}
                        disabled={data.common_objections.length >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.common_objections.map((objection, i) => (
                        <Badge key={i} variant="secondary" className="gap-1.5 pr-1.5 py-1.5 text-sm">
                          {objection}
                          <button onClick={() => removeFromArray('common_objections', i)} className="ml-1 hover:text-destructive transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">AI will preemptively address these concerns</p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="success_stories" className="text-sm font-medium">Success Stories <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      id="success_stories"
                      placeholder='Brief case studies or testimonials. E.g., "Helped Company X increase conversions by 40%" or "Used by 500+ startups"'
                      value={data.success_stories}
                      onChange={(e) => updateField('success_stories', e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">Social proof to weave into replies naturally</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pricing Model</Label>
                    <div className="grid gap-2">
                      {PRICING_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField('pricing_model', option.value)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                            data.pricing_model === option.value
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-foreground text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                          {data.pricing_model === option.value && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <Label className="text-sm font-medium">Select your preferred tone for AI-generated replies</Label>
                  <div className="grid gap-3">
                    {TONE_OPTIONS.map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => updateField('tone', tone.value)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                          data.tone === tone.value
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{tone.label}</p>
                          <p className="text-sm text-muted-foreground">{tone.description}</p>
                        </div>
                        {data.tone === tone.value && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
              <Button
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
                  onClick={() => setStep((s) => s + 1)} 
                  disabled={!canProceed()}
                  className="gap-2 px-6"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  disabled={isUpdating}
                  className="gap-2 px-6"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Complete Setup
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your information helps us generate better, more personalized replies.
          </p>
        </div>
      </div>
    </div>
  );
}
