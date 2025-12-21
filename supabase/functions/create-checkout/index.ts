import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan_type, user_id, user_email } = await req.json();

    console.log("Creating checkout for:", { plan_type, user_id, user_email });

    if (!plan_type || !user_id) {
      return new Response(
        JSON.stringify({ error: "plan_type and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const WHOP_API_KEY = Deno.env.get("WHOP_API_KEY");
    const WHOP_COMPANY_ID = Deno.env.get("WHOP_COMPANY_ID");
    const WHOP_PLAN_PRO = Deno.env.get("WHOP_PLAN_PRO");
    const WHOP_PLAN_ADVANCED = Deno.env.get("WHOP_PLAN_ADVANCED");

    if (!WHOP_API_KEY || !WHOP_COMPANY_ID) {
      console.error("Missing Whop configuration");
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select the correct plan ID
    const planId = plan_type === "pro" ? WHOP_PLAN_PRO : WHOP_PLAN_ADVANCED;

    if (!planId) {
      console.error("Plan ID not found for:", plan_type);
      return new Response(
        JSON.stringify({ error: "Invalid plan type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the redirect URL from the request origin or use default
    const origin = req.headers.get("origin") || "https://iouqvoqsqttlvubpabwg.lovableproject.com";
    const redirectUrl = `${origin}/payment-success?user_id=${user_id}`;

    console.log("Creating Whop checkout session with plan:", planId);

    // Create Whop checkout session
    const response = await fetch("https://api.whop.com/api/v5/checkout_sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHOP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        redirect_url: redirectUrl,
        metadata: {
          user_id: user_id,
          user_email: user_email || "",
          plan_type: plan_type,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Whop API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Whop checkout created:", data.id);

    return new Response(
      JSON.stringify({ checkout_url: data.purchase_url || data.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating checkout:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
