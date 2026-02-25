
# Celebratory Animation for Newly Unlocked Badges

## What This Does

Adds a visual celebration effect when a badge is unlocked for the first time. Previously seen (acknowledged) badges are tracked in `localStorage`, so the animation only plays once per milestone -- not every time the dashboard loads.

## How It Works

1. **Track seen badges** -- Store which badges the user has already seen as unlocked in `localStorage` (keyed by user ID)
2. **Detect newly unlocked** -- Compare current unlocked badges against the stored list to find "new" unlocks
3. **Play animation** -- Newly unlocked badges get a pulse + glow animation with particle-like sparkle effects
4. **Show toast** -- A celebratory toast notification appears congratulating the user
5. **Mark as seen** -- After the animation plays, update `localStorage` so it won't repeat

## Visual Effect

- A scaling pulse animation (badge briefly grows and shrinks back)
- A glowing ring/shadow effect radiating outward from the badge
- A subtle shimmer overlay
- A sonner toast: "Badge Unlocked! You earned 'First Contact'"

## Files to Modify

- **`src/components/badges/BadgeCard.tsx`** -- Accept a `isNew` prop; when true, apply the celebratory CSS animation classes
- **`src/components/badges/BadgesSection.tsx`** -- Add logic to compare unlocked badges against localStorage, pass `isNew` to BadgeCard, show toast, and update localStorage after render
- **`src/index.css`** -- Add the `@keyframes` for the celebration pulse/glow animation

## Technical Details

- localStorage key: `badges-seen-{userId}` storing a JSON array of threshold numbers
- Animation: a CSS keyframe (`badge-celebrate`) combining scale bounce + box-shadow glow, ~1.5s duration
- Uses `useEffect` to detect new badges and fire the toast via `sonner`
- After a short delay (matching animation duration), the new badges are marked as seen in localStorage
- No database changes needed -- localStorage is sufficient since this is a cosmetic-only feature
