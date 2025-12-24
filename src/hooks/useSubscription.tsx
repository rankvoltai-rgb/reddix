import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { SubscriptionPlan } from '@/lib/subscriptionTiers';

interface SubscriptionContextType {
  subscribed: boolean;
  plan: SubscriptionPlan | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
      } else {
        setSubscribed(data.subscribed ?? false);
        setPlan(data.plan ?? null);
        setSubscriptionEnd(data.subscriptionEnd ?? null);
      }
    } catch (err) {
      console.error('Failed to check subscription:', err);
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.access_token]);

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true);
    await checkSubscription();
  }, [checkSubscription]);

  // Check subscription on mount and when session changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Periodic refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return (
    <SubscriptionContext.Provider value={{ subscribed, plan, subscriptionEnd, isLoading, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
