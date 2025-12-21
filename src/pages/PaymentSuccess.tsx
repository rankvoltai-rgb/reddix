import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "timeout">("loading");
  const [attempts, setAttempts] = useState(0);

  const userId = searchParams.get("user_id") || user?.id;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    // Poll for subscription
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("id, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (data && !error) {
          setStatus("success");
          // Redirect to onboarding after a brief success display
          setTimeout(() => {
            navigate("/onboarding");
          }, 1500);
          return true;
        }

        return false;
      } catch (err) {
        console.error("Error checking subscription:", err);
        return false;
      }
    };

    const pollInterval = setInterval(async () => {
      setAttempts((prev) => prev + 1);

      const found = await checkSubscription();
      if (found) {
        clearInterval(pollInterval);
      }

      // Timeout after 30 attempts (60 seconds)
      if (attempts >= 30) {
        clearInterval(pollInterval);
        setStatus("timeout");
      }
    }, 2000);

    // Initial check
    checkSubscription();

    return () => clearInterval(pollInterval);
  }, [user, authLoading, navigate, attempts]);

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Processing your payment...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we confirm your subscription. This usually takes
            just a few seconds.
          </p>
          <div className="mt-6">
            <div className="h-1 w-48 mx-auto bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary animate-pulse"
                style={{ width: `${Math.min(attempts * 3.3, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Payment successful!
          </h1>
          <p className="text-muted-foreground">
            Welcome to Reddix! Redirecting you to complete your setup...
          </p>
        </div>
      </div>
    );
  }

  // Timeout state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Taking longer than expected
        </h1>
        <p className="text-muted-foreground mb-6">
          Your payment was successful, but we're still setting up your account.
          This can happen when our servers are busy.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate("/onboarding")} className="w-full">
            Continue to Setup
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Refresh Page
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Need help? Contact us at support@reddix.app
        </p>
      </div>
    </div>
  );
}
