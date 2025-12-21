import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';

interface OnboardingData {
  product_name: string;
  company_description: string;
  target_audience: string;
  value_proposition: string;
  tone: 'professional' | 'casual' | 'friendly' | 'technical' | 'witty';
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
  { value: 'witty', label: 'Witty', description: 'Clever with personality' },
] as const;

const STEPS = [
  { id: 1, title: 'Your Product', description: 'Tell us about what you\'re building' },
  { id: 2, title: 'Target Audience', description: 'Who are you trying to reach?' },
  { id: 3, title: 'Value Proposition', description: 'What makes you unique?' },
  { id: 4, title: 'Communication Style', description: 'How should we sound?' },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    product_name: '',
    company_description: '',
    target_audience: '',
    value_proposition: '',
    tone: 'friendly',
  });
  
  const { updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateField = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.product_name.trim() && data.company_description.trim();
      case 2:
        return data.target_audience.trim();
      case 3:
        return data.value_proposition.trim();
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = () => {
    updateProfile(
      { ...data, onboarding_completed: true },
      {
        onSuccess: () => {
          toast({
            title: 'Setup complete!',
            description: 'Your dashboard is ready with personalized lead detection.',
          });
          navigate('/dashboard');
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'Please try again.',
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > s.id
                      ? 'bg-primary text-primary-foreground'
                      : step === s.id
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 transition-colors ${
                      step > s.id ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {STEPS[step - 1].title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {STEPS[step - 1].description}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  placeholder="e.g., Acme Analytics"
                  value={data.product_name}
                  onChange={(e) => updateField('product_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_description">Company Description</Label>
                <Textarea
                  id="company_description"
                  placeholder="Tell us what your product does in 2-3 sentences..."
                  value={data.company_description}
                  onChange={(e) => updateField('company_description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Textarea
                  id="target_audience"
                  placeholder="Describe your ideal customers. What roles do they have? What problems do they face? Which subreddits might they be in?"
                  value={data.target_audience}
                  onChange={(e) => updateField('target_audience', e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="value_proposition">Value Proposition</Label>
                <Textarea
                  id="value_proposition"
                  placeholder="What makes your product unique? Why should someone choose you over alternatives?"
                  value={data.value_proposition}
                  onChange={(e) => updateField('value_proposition', e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label>Select your preferred tone for AI-generated replies</Label>
              <div className="grid gap-3">
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => updateField('tone', tone.value)}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                      data.tone === tone.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{tone.label}</p>
                      <p className="text-sm text-muted-foreground">{tone.description}</p>
                    </div>
                    {data.tone === tone.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isUpdating}>
                {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Complete Setup
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}