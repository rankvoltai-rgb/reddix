

# Fix Sidebar Collapse/Expand Jank

## Problem

When clicking the sidebar toggle, the sidebar width animates smoothly (200ms transition), but the main content area has no matching transition. This causes the content to snap/jump instantly to fill the new space, creating a jarring "jamming" effect.

## Fix

Add a smooth transition to the main content area in `DashboardLayout.tsx` so it expands/contracts in sync with the sidebar. Also add `overflow-hidden` to prevent layout thrashing during the transition.

## Changes

### `src/components/layout/DashboardLayout.tsx`

- Add `transition-all duration-200 ease-linear` to the `<main>` element so it animates in sync with the sidebar's 200ms linear transition
- Add `overflow-hidden` to prevent horizontal scrollbar flash during the resize

This is a one-line className change — no structural modifications needed.

