import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

type StripeSubscription = Stripe.Subscription;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Product ID to plan mapping
const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_Tf4LwTxHB5J3hd": "pro",
  "prod_Tf4MWwcVys39nO": "business",
  "prod_UGAzApTebO1Lxj": "lifetime",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      const msg = userError.message || "";
      logStep("Auth error", { message: msg });
      const isAuth = msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid jwt");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isAuth ? 401 : 401,
      });
    }

    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed");
      return new Response(JSON.stringify({ subscribed: false, plan: null, subscriptionEnd: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Fetch subscriptions with statuses that count as "subscribed" (active OR trialing)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    // Find the best subscription: prefer active, then trialing
    const validStatuses = ["active", "trialing"];
    const validSubscription = subscriptions.data.find((sub: StripeSubscription) => validStatuses.includes(sub.status));

    let hasActiveSub = false;
    let plan: string | null = null;
    let subscriptionEnd: string | null = null;

    if (validSubscription) {
      hasActiveSub = true;
      subscriptionEnd = new Date(validSubscription.current_period_end * 1000).toISOString();
      const productId = validSubscription.items.data[0].price.product as string;
      plan = PRODUCT_TO_PLAN[productId] || null;
      logStep("Valid subscription found", { 
        subscriptionId: validSubscription.id, 
        status: validSubscription.status,
        plan, 
        endDate: subscriptionEnd 
      });
    } else {
      logStep("No active or trialing subscription found");
    }

    // If no active subscription, check for one-time lifetime payments
    if (!hasActiveSub) {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 100,
      });

      const lifetimeSession = sessions.data.find(
        (s: any) => s.payment_status === "paid" && s.mode === "payment"
      );

      if (lifetimeSession) {
        // Verify it's actually a lifetime product by checking line items
        const lineItems = await stripe.checkout.sessions.listLineItems(lifetimeSession.id);
        const lifetimeItem = lineItems.data.find((item: any) => {
          const productId = item.price?.product as string;
          return PRODUCT_TO_PLAN[productId] === "lifetime";
        });

        if (lifetimeItem) {
          hasActiveSub = true;
          plan = "lifetime";
          subscriptionEnd = null; // Lifetime = no end date
          logStep("Lifetime payment found", { sessionId: lifetimeSession.id });
        }
      }
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan,
      subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

});
