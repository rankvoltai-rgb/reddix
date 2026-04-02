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
    if (!user) {
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
      setIsLoading(false);
      return;
    }

    try {
      // First try to get current session
      let { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // If session exists but might be expired, try to refresh it
      if (sessionData.session) {
        const tokenExpiry = sessionData.session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        // If token is expired or about to expire (within 60 seconds), refresh it
        if (tokenExpiry && tokenExpiry - now < 60) {
          const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Failed to refresh session:', refreshError);
            // Sign out the user if refresh fails
            await supabase.auth.signOut();
            setSubscribed(false);
            setPlan(null);
            setSubscriptionEnd(null);
            setIsLoading(false);
            return;
          }
          sessionData = refreshedData;
        }
      }
      
      if (sessionError || !sessionData.session?.access_token) {
        console.error('Failed to get session:', sessionError);
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
        setIsLoading(false);
        return;
      }

      const invokeCheck = async (accessToken: string) => {
        return await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      };

      let { data, error } = await invokeCheck(sessionData.session.access_token);

      // If the backend says the JWT is expired/invalid, refresh and retry once.
      if (error && (error as any)?.status === 401) {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshed.session?.access_token) {
          ({ data, error } = await invokeCheck(refreshed.session.access_token));
        }
      }

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
      } else {
        setSubscribed(data?.subscribed ?? false);
        setPlan(data?.plan ?? null);
        setSubscriptionEnd(data?.subscriptionEnd ?? null);
      }
    } catch (err) {
      console.error('Failed to check subscription:', err);
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true);
    await checkSubscription();
  }, [checkSubscription]);

  // Check subscription on mount and when session changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);


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
