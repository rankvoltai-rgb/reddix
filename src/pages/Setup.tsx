import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, User, Globe, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const setupSchema = z.object({
  full_name: z.string().min(1, 'Please enter your name').max(100, 'Name is too long'),
  product_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  company_description: z.string().min(10, 'Please provide at least 10 characters').max(1000, 'Description is too long'),
});

export default function Setup() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    product_url: '',
    company_description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Redirect if already completed setup
  useEffect(() => {
    if (!profileLoading && profile?.initial_setup_completed) {
      navigate('/onboarding');
    }
  }, [profile, profileLoading, navigate]);

  // Pre-populate form if profile data exists
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        product_url: profile.product_url || '',
        company_description: profile.company_description || '',
      });
    }
  }, [profile]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = setupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    updateProfile(
      {
        full_name: formData.full_name,
        product_url: formData.product_url || null,
        company_description: formData.company_description,
        initial_setup_completed: true,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Setup complete!',
            description: 'Let\'s continue with onboarding.',
          });
          navigate('/onboarding');
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

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const descriptionLength = formData.company_description.length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />
      
      {/* Floating decorations */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-sm">
                1
              </div>
              <span className="font-medium text-foreground">Profile</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <span className="text-muted-foreground">Setup</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Reddix" className="h-10 w-auto" />
          </div>

          {/* Step Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <User className="w-3 h-3" />
              Step 1 of 2 • Profile Setup
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Let's set up your profile
            </h1>
            <p className="text-muted-foreground text-sm">
              Tell us about yourself and what you're building so we can personalize your experience.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-sm p-8 animate-fade-in transition-shadow hover:shadow-md">
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  What's your name? <span className="text-primary">*</span>
                </label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className={`h-11 transition-all ${errors.full_name ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-2 focus:ring-primary/20'}`}
                  disabled={isUpdating}
                />
                {errors.full_name && (
                  <p className="text-destructive text-xs">{errors.full_name}</p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Product URL */}
              <div className="space-y-2">
                <label htmlFor="product_url" className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Website URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </label>
                <Input
                  id="product_url"
                  placeholder="https://yourproduct.com"
                  value={formData.product_url}
                  onChange={(e) => handleChange('product_url', e.target.value)}
                  className={`h-11 transition-all ${errors.product_url ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-2 focus:ring-primary/20'}`}
                  disabled={isUpdating}
                />
                {errors.product_url && (
                  <p className="text-destructive text-xs">{errors.product_url}</p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Service Description */}
              <div className="space-y-2">
                <label htmlFor="company_description" className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  What are you selling? <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Textarea
                    id="company_description"
                    placeholder="Briefly describe your product or service and the problems it solves..."
                    value={formData.company_description}
                    onChange={(e) => handleChange('company_description', e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className={`resize-none pb-6 transition-all ${errors.company_description ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-2 focus:ring-primary/20'}`}
                    disabled={isUpdating}
                  />
                  <span className={`absolute bottom-2 right-3 text-xs ${descriptionLength > 900 ? 'text-warning' : 'text-muted-foreground'}`}>
                    {descriptionLength}/1000
                  </span>
                </div>
                {errors.company_description && (
                  <p className="text-destructive text-xs">{errors.company_description}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full mt-8 h-12 text-base font-semibold group transition-all hover:shadow-lg"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            <span>Your data is secure and private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
