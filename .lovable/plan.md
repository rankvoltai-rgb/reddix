

# Auth Page Layout Update -- Rounded Panels with Gray Backdrop

## What Changes

The current `/auth` page uses a full-bleed split layout where white and red panels stretch edge-to-edge. The new layout wraps both panels inside a light gray backdrop with spacing, and rounds the inner edges where the panels meet the outer boundary.

## Layout Structure

```text
+------ light gray bg (full screen) ------+
|  padding (~2.5% on all sides)            |
|  +--------------------------------------+|
|  | White panel      | Red panel         ||
|  | (rounded TL/BL)  | (rounded TR/BR)   ||
|  |                  |                    ||
|  +--------------------------------------+|
|                                          |
+------------------------------------------+
```

- Outer container: `min-h-screen bg-gray-100 p-[2.5vh_2.5vw]` (creates the ~5% border)
- Inner container: `h-[95vh] w-[95vw]` with `flex overflow-hidden rounded-3xl`
- White (left) panel: gets natural rounding from parent's `rounded-3xl`
- Red (right) panel: same -- parent border-radius clips both sides

## Technical Details

### File: `src/pages/Auth.tsx`

**Current outer wrapper:**
```tsx
<div className="min-h-screen flex">
```

**New outer wrapper:**
```tsx
<div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="flex w-[95vw] h-[95vh] rounded-3xl overflow-hidden shadow-xl">
```

- The `rounded-3xl` (~24px radius) on the inner container rounds all four corners
- `overflow-hidden` ensures the white and red panels are clipped by the rounded corners
- The left white panel and right red panel stay as flex children -- no border-radius changes needed on individual panels since the parent clips them
- Remove `min-h-screen` from inner panels; they fill the container via flex

**Left panel change:**
- Remove: `min-h-screen` (it fills the parent now)
- Keep all form content as-is

**Right panel change:**
- Remove: any standalone rounding if present
- Keep all LeadPreviewCard content as-is

No logic, auth flow, or component changes -- purely CSS layout adjustments.

