

# Free Plan: 10 High-Intent Leads/Day Limit with Upgrade Overlay

## Overview

Enforce a daily limit of 10 high-intent (hot + warm) leads for free-plan users. When they hit the cap and click "Scan Now" again, an upgrade overlay dialog appears instead of running the scan.

## How It Works

1. **Before each scan**, count today's high-intent leads (hot + warm) from the `leads` table for the current user
2. If the user is on the free plan AND has >= 10 high-intent leads discovered today, block the scan and show an upgrade dialog
3. Premium/Enterprise users have no limit

## Technical Changes

### 1. `src/pages/Scanner.tsx`

- Add state: `showUpgradeDialog` (boolean)
- Before calling `handleScan`, query `leads` table for today's hot+warm leads count:
  ```sql
  SELECT count(*) FROM leads 
  WHERE user_id = ? 
  AND intent_level IN ('hot', 'warm') 
  AND discovered_at >= today_midnight
  AND status != 'archived'
  ```
- If count >= 10 AND user's `selected_plan` is `'free'` (or not subscribed), set `showUpgradeDialog = true` and skip the scan
- Otherwise, proceed with the scan normally
- Add an upgrade `Dialog` component with:
  - Icon + title: "Daily Limit Reached"
  - Message: "You've discovered 10 high-intent leads today. Upgrade to Premium for unlimited leads."
  - Current count display (e.g., "10/10 leads used today")
  - "Upgrade to Premium" button that navigates to `/onboarding?step=2` (the pricing step) or invokes `create-checkout`
  - "Close" / "Maybe Later" secondary button

### 2. Lead count helper

- Create a small async function `getTodayHighIntentCount(userId)` that queries the leads table filtered by today's date and intent_level in ('hot', 'warm')
- Called inside `handleScan` before the actual scan starts
- Also display the current count in the command bar as a subtle indicator (e.g., "3/10 leads today") so free users always know where they stand

### 3. No backend changes needed

The limit check happens client-side before invoking the scan. This is acceptable because:
- The data is the user's own leads table (RLS-protected)
- Even if bypassed, the scan itself is rate-limited server-side
- This is a UX gate, not a security gate -- the real enforcement is that free users see limited value without paying

## Files Modified

- `src/pages/Scanner.tsx` -- add limit check in `handleScan`, add upgrade dialog, add daily count indicator

## UX Details

- The upgrade dialog uses the existing `Dialog` component (already imported)
- Styled with a gradient accent and clear value proposition
- Shows a progress bar of leads used (e.g., 8/10)
- "Upgrade to Premium" button is prominent (primary style)
- Free users see a small "X/10 leads today" badge in the command bar at all times

