// Shared subscription verification helper for premium edge functions.
// Verifies a user has an active/trialing Stripe subscription OR a paid lifetime checkout.
import Stripe from "https://esm.sh/stripe@14.21.0";

const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_Tf4LwTxHB5J3hd": "pro",
  "prod_Tf4MWwcVys39nO": "business",
  "prod_UGAzApTebO1Lxj": "lifetime",
};

export interface SubscriptionStatus {
  subscribed: boolean;
  plan: string | null;
}

export async function verifySubscription(email: string): Promise<SubscriptionStatus> {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    // Misconfiguration — fail closed; do not leak details upstream.
    console.error("[verifySubscription] STRIPE_SECRET_KEY not set");
    return { subscribed: false, plan: null };
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return { subscribed: false, plan: null };

    const customerId = customers.data[0].id;
    const subs = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
    const valid = subs.data.find((s) => s.status === "active" || s.status === "trialing");
    if (valid) {
      const productId = valid.items.data[0]?.price.product as string;
      return { subscribed: true, plan: PRODUCT_TO_PLAN[productId] || "pro" };
    }

    // Check for lifetime one-time payment
    const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 100 });
    const paid = sessions.data.find((s) => s.payment_status === "paid" && s.mode === "payment");
    if (paid) {
      const items = await stripe.checkout.sessions.listLineItems(paid.id);
      const lifetime = items.data.find((it: any) => PRODUCT_TO_PLAN[it.price?.product as string] === "lifetime");
      if (lifetime) return { subscribed: true, plan: "lifetime" };
    }
    return { subscribed: false, plan: null };
  } catch (err) {
    console.error("[verifySubscription] Stripe lookup failed", err);
    return { subscribed: false, plan: null };
  }
}

export const SUBSCRIPTION_REQUIRED_RESPONSE = () =>
  new Response(JSON.stringify({ success: false, error: "Active subscription required." }), {
    status: 200, // Return 200 per app convention; client reads `success: false`.
    headers: { "Content-Type": "application/json" },
  });
