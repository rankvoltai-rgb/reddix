import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Loader2 } from 'lucide-react';

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifyingSubscription, setIsVerifyingSubscription] = useState(false);

  // Handle checkout=success parameter
  useEffect(() => {
    const checkoutSuccess = searchParams.get('checkout');
    if (checkoutSuccess === 'success' && !subscribed && !isVerifyingSubscription) {
      setIsVerifyingSubscription(true);
      refreshSubscription().finally(() => {
        setIsVerifyingSubscription(false);
      });
    }
  }, [searchParams, subscribed, isVerifyingSubscription, refreshSubscription]);

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

  // Redirect if not subscribed (and not verifying)
  useEffect(() => {
    if (!subLoading && !subscribed && !isVerifyingSubscription && !searchParams.get('checkout')) {
      navigate('/subscribe');
    }
  }, [subscribed, subLoading, isVerifyingSubscription, searchParams, navigate]);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (!profileLoading && profile?.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [profile, profileLoading, navigate]);

  if (authLoading || profileLoading || subLoading || isVerifyingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
          {isVerifyingSubscription && (
            <p className="text-sm text-muted-foreground mt-3">Finalizing your subscription...</p>
          )}
        </div>
      </div>
    );
  }

  return <OnboardingWizard />;
}