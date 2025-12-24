import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';

export default function SubscribeSuccess() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscribed, isLoading: subLoading, refreshSubscription } = useSubscription();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Poll for subscription status
  useEffect(() => {
    if (subscribed) {
      // Wait a moment then redirect
      const timeout = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (attempts < 10) {
      const timeout = setTimeout(() => {
        refreshSubscription();
        setAttempts(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [subscribed, attempts, refreshSubscription, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        {subscribed ? (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Reddix!</h1>
            <p className="text-muted-foreground mb-6">
              Your subscription is active. Redirecting to dashboard...
            </p>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-6 text-primary" />
            <h1 className="text-2xl font-bold mb-2">Processing Your Payment</h1>
            <p className="text-muted-foreground mb-6">
              Please wait while we confirm your subscription...
            </p>
            {attempts >= 10 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Taking longer than expected? Your payment may still be processing.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => refreshSubscription()}>
                    Check Again
                  </Button>
                  <Button onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
