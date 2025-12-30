import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, User, Globe, FileText } from 'lucide-react';
import { z } from 'zod';

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
      navigate('/subscribe');
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
            description: 'Now choose a plan to get started.',
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

  if (authLoading || profileLoading) {
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
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl floating pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl floating-delayed pointer-events-none" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <span className="text-2xl font-bold text-foreground">Reddix</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome! Let's get you set up
            </h1>
            <p className="text-muted-foreground">
              Tell us a bit about yourself and what you're building.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="glass-card-elevated rounded-2xl p-8 animate-fade-in">
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  What's your name? *
                </Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className={`h-11 ${errors.full_name ? 'border-destructive' : ''}`}
                  disabled={isUpdating}
                />
                {errors.full_name && (
                  <p className="text-destructive text-xs">{errors.full_name}</p>
                )}
              </div>

              {/* Product URL */}
              <div className="space-y-2">
                <Label htmlFor="product_url" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Website URL <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="product_url"
                  placeholder="https://yourproduct.com"
                  value={formData.product_url}
                  onChange={(e) => handleChange('product_url', e.target.value)}
                  className={`h-11 ${errors.product_url ? 'border-destructive' : ''}`}
                  disabled={isUpdating}
                />
                {errors.product_url && (
                  <p className="text-destructive text-xs">{errors.product_url}</p>
                )}
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <Label htmlFor="company_description" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  What are you selling? *
                </Label>
                <Textarea
                  id="company_description"
                  placeholder="Briefly describe your product or service and the problems it solves..."
                  value={formData.company_description}
                  onChange={(e) => handleChange('company_description', e.target.value)}
                  rows={4}
                  className={`resize-none ${errors.company_description ? 'border-destructive' : ''}`}
                  disabled={isUpdating}
                />
                {errors.company_description && (
                  <p className="text-destructive text-xs">{errors.company_description}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full mt-6 h-12 text-base"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            This helps us personalize your experience.
          </p>
        </div>
      </div>
    </div>
  );
}
