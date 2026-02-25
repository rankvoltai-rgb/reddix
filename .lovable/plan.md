

# Achievement Badges on the Dashboard

## What This Does

Adds a badge/achievement section directly on the `/dashboard` page (below the stats cards, above the leads section). Badges unlock at milestone thresholds based on the number of leads the user has engaged with (status = "engaged"). No new pages or sidebar items are added.

## Badge Milestones

| Threshold | Icon | Name |
|-----------|------|------|
| 1 | Flame | First Contact |
| 10 | Sparkles | Lead Hunter |
| 25 | Star | Rising Star |
| 50 | Zap | Power Player |
| 100 | Trophy | Lead Legend |

Unlocked badges show with a vibrant coral/red background. Locked badges are greyed out with reduced opacity and a lock overlay.

## Visual Layout

```text
+--------------------------------------------------+
| Stats Cards (unchanged)                          |
+--------------------------------------------------+
| Achievements              X/5 unlocked           |
| [Badge] [Badge] [Badge] [Badge] [Badge]         |
+--------------------------------------------------+
| Recent Leads / Empty State (unchanged)           |
+--------------------------------------------------+
```

## Files to Create

- **src/hooks/useBadges.ts** -- Hook that queries count of leads with `status = 'engaged'` and computes which badges are unlocked
- **src/components/badges/BadgeCard.tsx** -- Single badge card (icon, name, threshold, locked/unlocked state)
- **src/components/badges/BadgesSection.tsx** -- Horizontal row of badge cards with a header showing progress (e.g. "2/5 unlocked")

## Files to Modify

- **src/pages/Dashboard.tsx** -- Import and render `BadgesSection` between the stats grid and the dynamic content section

## Technical Details

- Badge data is derived from a single count query: leads where `user_id = current user` and `status = 'engaged'`
- Uses `@tanstack/react-query` consistent with existing hooks
- No new database tables or migrations needed
- Locked badges use `opacity-40 grayscale` with a Lock icon overlay
- Unlocked badges use `bg-red-400` / `bg-red-500` background matching the reference image
- The dashboard layout, stats, and leads sections remain completely unchanged
