/**
 * What Reddix is and costs, for every comparison page to state the same way.
 * Each fact is checked against the code (2026-10-27); change it here, and only
 * when the product changes.
 */

export const CHECKED = '2026-10-27';
export const CHECKED_LABEL = 'October 2026';

export const REDDIX = {
  /** src/lib/subscriptionTiers.ts; trial from create-checkout (trial_period_days: 7). */
  pricing: {
    premium: { price: 45, period: 'month', trial: '7-day free trial' },
    lifetime: { price: 150, period: 'one-time' },
    enterprise: { price: null, note: 'Custom, by email' },
    freePlan: false,
  },
  /** Reddit only: scan-reddit searches Reddit through Firecrawl. */
  platforms: ['Reddit'],
  /** Scans run when the user presses Scan, at most once every 5 minutes; no scheduler. */
  scanning: 'On demand, at most one scan every 5 minutes',
  alerts: 'None: no email, Slack or webhook alerts',
  /** scan-reddit + _shared/intent-heuristics.ts */
  scoring: 'AI scores each post 0–100 against your product, plus points for a named competitor, pricing words and “alternative to”',
  /** generate-reply: Direct, Story and Expert variants. */
  replies: 'Drafts three replies per thread (Direct, Story, Expert) for you to edit and post',
  posting: 'Never posts, comments, votes or messages on Reddit; never connects your Reddit account',
  accounts: 'Uses no Reddit accounts',
  setup: 'Paste your website URL; Reddix builds a product profile and suggests subreddits',
  leads: 'Saved leads live in a lead list with statuses',
} as const;

/** Things a comparison page must never say about Reddix. */
export const NEVER_CLAIM = [
  'autopilot, scheduled, background or 24/7 scanning',
  'real-time alerts or any alert channel',
  'a free plan',
  'that it is “Reddit-approved”, “ban-proof” or guarantees an account stays in good standing',
  'results, customer counts, accuracy rates or time-to-lead numbers',
  'multi-platform coverage',
] as const;
