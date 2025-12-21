import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Perfect for growing businesses",
    icon: Zap,
    features: [
      "100 leads per month",
      "5 monitored subreddits",
      "AI-powered reply generation",
      "Basic intent scoring",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "$99",
    period: "/month",
    description: "For power users and agencies",
    icon: Crown,
    features: [
      "Unlimited leads",
      "Unlimited subreddits",
      "AI-powered reply generation",
      "Advanced intent scoring",
      "Priority support",
      "Custom keywords",
      "Export to CSV",
      "Team collaboration",
    ],
    popular: true,
  },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = async (planType: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(planType);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          plan_type: planType,
          user_id: user.id,
          user_email: user.email,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
      });
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            Choose your plan
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start finding high-intent leads on Reddit today. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-lg p-6 ${
                plan.popular
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    plan.popular ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <plan.icon
                    className={`h-5 w-5 ${
                      plan.popular ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Get ${plan.name}`
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Secure payment powered by Whop. Cancel anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
