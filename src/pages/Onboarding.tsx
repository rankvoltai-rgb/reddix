import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Loader2 } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Onboarding() {
  usePageMeta({
    title: 'Get Started | Reddix',
    description: 'Set up your Reddix account in minutes — tell us about your business and pick a plan.',
    path: '/onboarding',
    noindex: true,
  });
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile?.onboarding_completed) navigate('/dashboard');
  }, [profile, profileLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <OnboardingWizard />;
}
