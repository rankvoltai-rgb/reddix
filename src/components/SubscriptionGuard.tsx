import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || subLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!hasActiveSubscription) {
      navigate("/pricing");
    }
  }, [user, hasActiveSubscription, authLoading, subLoading, navigate]);

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !hasActiveSubscription) {
    return null;
  }

  return <>{children}</>;
}
