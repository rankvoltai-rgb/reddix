

# Merge /onboarding and /subscribe into a Unified Wizard

## Overview

Combine the separate `/subscribe` and `/onboarding` pages into a single unified wizard at `/onboarding`. The new flow follows the reference design: a clean white card with the Reddix logo, step-based form fields, inline pricing cards, a progress bar at the bottom, and a Continue button.

## New User Journey

```text
Auth -> Setup (/setup) -> Unified Onboarding (/onboarding) -> Dashboard

The unified onboarding wizard contains these steps:
  Step 1: "Personalize your lead generation" (Business name, Website URL, Target Audience)
  Step 2: "Choose your lead generation plan" (3 pricing cards inline)
  Step 3-6: Remaining product context (Features, Competition, Social Proof, Tone)
```

## UI Design (matching reference images)

Each step renders inside a single clean white card:
- Reddix logo (top-left of card)
- Bold heading describing the step
- Form fields or pricing cards as content
- Bottom bar with a colored progress indicator and "Continue" button on the right
- No heavy gradients, floating decorations, or step circles -- minimalist and flat

### Pricing Step (Step 2)

Three cards side by side:
- **Free** -- $0.00/mo with limited features (10 leads/day, 4 subreddits, AI co-pilot, Hubspot integration). CTA: "Get Started"
- **Premium** -- $45.00/mo (maps to existing Business tier price_id). "Recommend" badge, red border. CTA: "Start free trial"
- **Enterprise** -- Custom pricing (custom signals, unlimited subreddits, N8n automation, custom integration). CTA: "Start free trial" (opens a contact/mailto flow)

When the user selects Free, they continue without Stripe checkout. When they select Premium, the Stripe checkout is triggered (redirecting to `/onboarding?checkout=success&step=3`). Enterprise opens a contact link or mailto.

## Technical Changes

### 1. Update subscription tiers (`src/lib/subscriptionTiers.ts`)
- Add a `free` tier (no price_id, no product_id, $0)
- Rename `business` to `premium` internally but keep same Stripe IDs
- Add an `enterprise` tier (no price_id, custom pricing)
- Update features arrays to match reference image

### 2. Rewrite `src/components/onboarding/OnboardingWizard.tsx`
- Restructure into the new step layout:
  - Step 1: Business name, Website URL, Target Audience (condensed from current steps 1+3)
  - Step 2: Plan selection (inline pricing cards, replaces /subscribe)
  - Step 3: Key Features + Value Proposition (current step 2)
  - Step 4: Competition + Objections (current step 4)
  - Step 5: Social Proof + Pricing Model (current step 5)
  - Step 6: Tone selection (current step 6)
- New card-based UI matching reference: logo top-left, heading, content area, bottom progress bar + Continue button
- Handle Stripe checkout redirect within the wizard (detect `checkout=success` param and resume at step 3)
- Free tier users skip checkout entirely

### 3. Update `src/pages/Onboarding.tsx`
- Remove the subscription check redirect (subscription is now handled within the wizard itself)
- Remove redirect to /subscribe (no longer exists as separate page)
- Pass checkout search params down to the wizard

### 4. Update `src/pages/Setup.tsx`
- Change navigation on completion: go to `/onboarding` instead of `/subscribe`
- Update step indicator text (Step 1 of 2 instead of 1 of 3)

### 5. Update `src/App.tsx`
- Keep `/subscribe` route but make it redirect to `/onboarding` for backward compatibility
- Or remove Subscribe import and route entirely

### 6. Update `create-checkout` edge function (`supabase/functions/create-checkout/index.ts`)
- Change `success_url` to `${origin}/onboarding?checkout=success&step=3` so users resume at the correct wizard step after payment

### 7. Update `useSubscription` hook behavior
- No structural changes needed -- it still checks Stripe for active/trialing status
- Free tier users will have `subscribed: false` but the onboarding wizard will allow them through by storing a `selected_plan` field in the profile

### 8. Database consideration
- Add a `selected_plan` column to `profiles` table (text, nullable) to track which tier the user chose (free/premium/enterprise)
- This lets free-tier users proceed through onboarding without a Stripe subscription
- Update route guards across protected pages to allow free-tier users (check `profile.selected_plan` in addition to `subscribed`)

### 9. Update route guards in Dashboard, Scanner, Leads, Settings
- Currently these check `subscribed` from useSubscription. After this change, they should also allow access if `profile.selected_plan === 'free'`

### 10. Remove `/subscribe` page
- Delete `src/pages/Subscribe.tsx` or convert to a redirect

## Files Modified
- `src/lib/subscriptionTiers.ts` -- add free/enterprise tiers, rename
- `src/components/onboarding/OnboardingWizard.tsx` -- full rewrite with new UI and plan step
- `src/pages/Onboarding.tsx` -- simplify guards
- `src/pages/Setup.tsx` -- update navigation target
- `src/pages/Subscribe.tsx` -- remove or redirect
- `src/App.tsx` -- update routes
- `supabase/functions/create-checkout/index.ts` -- update success_url
- Database migration -- add `selected_plan` column to profiles
- Protected page guards (Dashboard, Scanner, etc.) -- allow free tier access

