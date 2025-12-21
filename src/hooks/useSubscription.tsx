import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Subscription {
  id: string;
  user_id: string;
  whop_membership_id: string | null;
  whop_user_id: string | null;
  plan_type: "pro" | "advanced";
  status: "active" | "cancelled" | "expired" | "past_due";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, refetch, error } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching subscription:", error);
        throw error;
      }

      return data as Subscription | null;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
  });

  const hasActiveSubscription = subscription?.status === "active";
  const planType = subscription?.plan_type || null;

  return {
    subscription,
    isLoading,
    hasActiveSubscription,
    planType,
    refetch,
    error,
  };
}
