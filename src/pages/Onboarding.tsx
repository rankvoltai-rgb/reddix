import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Loader2 } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { resolveDestination, safeNavigate } from '@/lib/routing';

export default function Onboarding() {
  usePageMeta({
    title: 'Get Started | Reddix',
    description: 'Set up your Reddix account in minutes — tell us about your business and pick a plan.',
    path: '/onboarding',
    noindex: true,
  });
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const dest = resolveDestination({
      user,
      profile,
      subscribed,
      authLoading,
      profileLoading,
      subLoading,
    });
    safeNavigate(location.pathname, dest, navigate);
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, navigate, location.pathname]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Hard guard: once onboarding is completed it must NEVER re-appear, even if
  // upstream routing logic regresses or the subscription check is flaky.
  if (profile?.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <OnboardingWizard />;
}
