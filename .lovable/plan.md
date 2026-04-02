

## Plan: Replace Auto-Refresh with Manual Refresh

Remove all automatic polling and background refetching for subscription status. Users will rely on the existing `refreshSubscription` function triggered manually (e.g., after checkout redirect).

### Changes

**1. `src/hooks/useSubscription.tsx`**
- Remove the 60-second `setInterval` polling effect entirely
- Keep the `refreshSubscription` function available for manual use (e.g., called after checkout success)
- Keep the initial `checkSubscription()` call on mount/user change

**2. `src/components/scanner/LeadsSection.tsx`**
- Set `refetchOnWindowFocus: false` on the leads query to stop automatic refetches on tab switch

**3. `src/pages/Scanner.tsx`**
- Remove `refetchInterval: 30000` from any polling queries

