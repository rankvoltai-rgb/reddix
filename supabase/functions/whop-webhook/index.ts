import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, whop-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    console.log("Whop webhook received:", payload.action);

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, data } = payload;

    // Extract user_id from metadata
    const userId = data?.metadata?.user_id;
    const planType = data?.metadata?.plan_type || "pro";
    const membershipId = data?.id;
    const whopUserId = data?.user_id;

    console.log("Webhook data:", { action, userId, planType, membershipId, whopUserId });

    if (!userId) {
      console.error("No user_id in webhook metadata");
      return new Response(
        JSON.stringify({ error: "No user_id in metadata" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    switch (action) {
      case "membership.went_valid":
      case "membership.created": {
        console.log("Creating/activating subscription for user:", userId);

        // Check if subscription already exists
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (existing) {
          // Update existing subscription
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: "active",
              whop_membership_id: membershipId,
              whop_user_id: whopUserId,
              plan_type: planType,
              current_period_start: new Date().toISOString(),
              current_period_end: data?.renewal_period_end || null,
            })
            .eq("user_id", userId);

          if (error) {
            console.error("Error updating subscription:", error);
            throw error;
          }
          console.log("Subscription updated for user:", userId);
        } else {
          // Create new subscription
          const { error } = await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              whop_membership_id: membershipId,
              whop_user_id: whopUserId,
              plan_type: planType,
              status: "active",
              current_period_start: new Date().toISOString(),
              current_period_end: data?.renewal_period_end || null,
            });

          if (error) {
            console.error("Error creating subscription:", error);
            throw error;
          }
          console.log("Subscription created for user:", userId);
        }
        break;
      }

      case "membership.went_invalid":
      case "membership.cancelled": {
        console.log("Deactivating subscription for user:", userId);

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: action === "membership.cancelled" ? "cancelled" : "expired",
          })
          .eq("user_id", userId);

        if (error) {
          console.error("Error deactivating subscription:", error);
          throw error;
        }
        console.log("Subscription deactivated for user:", userId);
        break;
      }

      case "payment.succeeded": {
        console.log("Payment succeeded, updating period for user:", userId);

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: data?.renewal_period_end || null,
          })
          .eq("user_id", userId);

        if (error) {
          console.error("Error updating subscription period:", error);
          throw error;
        }
        console.log("Subscription period updated for user:", userId);
        break;
      }

      case "payment.failed": {
        console.log("Payment failed for user:", userId);

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("user_id", userId);

        if (error) {
          console.error("Error marking subscription past due:", error);
          throw error;
        }
        break;
      }

      default:
        console.log("Unhandled webhook action:", action);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
