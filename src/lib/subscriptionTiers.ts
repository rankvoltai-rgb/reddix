export const SUBSCRIPTION_TIERS = {
  lifetime: {
    name: 'Lifetime',
    price_id: 'price_1THedrATaqTexwUQGCPUWSnI',
    product_id: 'prod_UGAzApTebO1Lxj',
    price: 150,
    mode: 'payment' as const,
    features: [
      'Unlimited leads',
      'Unlimited subreddits',
      'Priority scanning',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
    ],
    popular: false,
    cta: 'Get Lifetime Access',
  },
  premium: {
    name: 'Premium',
    price_id: 'price_1ShkDkATaqTexwUQgyS1Ljyh',
    product_id: 'prod_Tf4MWwcVys39nO',
    price: 45,
    mode: 'subscription' as const,
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
    mode: null,
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
