export const SUBSCRIPTION_TIERS = {
  pro: {
    name: 'Reddix Pro',
    price_id: 'price_1ShkD4ATaqTexwUQ2VLJGoYi',
    product_id: 'prod_Tf4LwTxHB5J3hd',
    price: 29,
    features: [
      'Unlimited lead discovery',
      'AI-powered reply generation',
      'Real-time Reddit monitoring',
      'Up to 10 subreddits',
      'Basic analytics',
      'Email support',
    ],
    popular: false,
  },
  business: {
    name: 'Reddix Business',
    price_id: 'price_1ShkDkATaqTexwUQgyS1Ljyh',
    product_id: 'prod_Tf4MWwcVys39nO',
    price: 45,
    features: [
      'Everything in Pro',
      'Unlimited subreddits',
      'Priority scanning',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
    ],
    popular: true,
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_TIERS;
