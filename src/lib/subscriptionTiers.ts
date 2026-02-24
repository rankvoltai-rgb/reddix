export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price_id: null,
    product_id: null,
    price: 0,
    features: [
      '10 leads/day',
      '4 subreddits',
      'AI co-pilot',
      'Hubspot integration',
    ],
    popular: false,
    cta: 'Get Started',
  },
  premium: {
    name: 'Premium',
    price_id: 'price_1ShkDkATaqTexwUQgyS1Ljyh',
    product_id: 'prod_Tf4MWwcVys39nO',
    price: 45,
    features: [
      'Unlimited leads',
      'Unlimited subreddits',
      'Priority scanning',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
    ],
    popular: true,
    cta: 'Start free trial',
  },
  enterprise: {
    name: 'Enterprise',
    price_id: null,
    product_id: null,
    price: null,
    features: [
      'Custom signals',
      'Unlimited subreddits',
      'N8n automation',
      'Custom integration',
    ],
    popular: false,
    cta: 'Contact us',
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_TIERS;
