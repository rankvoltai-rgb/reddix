import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
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
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [subscribed, setSubscribed] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Collapse concurrent invocations into a single in-flight call.
  const inFlightRef = useRef<Promise<void> | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!userId) {
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
      setIsLoading(false);
      return;
    }

    if (inFlightRef.current) return inFlightRef.current;

    const run = (async () => {
      try {
        // supabase-js auto-refreshes on a timer, but if we land here right after
        // the token expired (e.g. tab was backgrounded), the cached session can
        // still be stale. Detect that and force a refresh before invoking.
        let { data: sessionData } = await supabase.auth.getSession();
        let token = sessionData.session?.access_token;
        const expiresAt = sessionData.session?.expires_at ?? 0;
        const nowSec = Math.floor(Date.now() / 1000);
        if (!token || expiresAt - nowSec < 30) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          token = refreshed.session?.access_token ?? undefined;
        }
        if (!token) {
          // No token at all — treat as unknown, don't clobber last-known-good.
          // Routing will keep waiting (isLoading stays true via finally only on first load).
          return;
        }


        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (error) {
          // Transient error (network, cold start, 5xx). Preserve last-known-good
          // values — flipping `subscribed` to false here would wrongly send a
          // paid user back into the paywall/onboarding flow on every blip.
          return;
        }

        // Only trust an explicit server response.
        if (data && typeof data.subscribed === 'boolean') {
          setSubscribed(data.subscribed);
          setPlan(data.plan ?? null);
          setSubscriptionEnd(data.subscriptionEnd ?? null);
        }
      } catch {
        // Same as above: keep last-known-good on unexpected failure.
        return;
      } finally {
        setIsLoading(false);
      }
    })();

    inFlightRef.current = run;
    try {
      await run;
    } finally {
      inFlightRef.current = null;
    }
  }, [userId]);

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true);
    await checkSubscription();
  }, [checkSubscription]);

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
