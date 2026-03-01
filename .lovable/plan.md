

# Cleaner Reply Dialog UI + Shorter Copy with Website Link

## Overview

Two changes: (1) simplify the ReplyDialog UI to be cleaner and less cluttered, and (2) update the AI prompt to generate much shorter replies (120-250 characters) with the user's website URL appended at the end.

## Change 1: Shorter Reply Copy (Edge Function)

**File:** `supabase/functions/generate-reply/index.ts`

Update the `generateVariants` prompt rules to enforce brevity:

- Replace rule 5 ("Keep replies 2-4 paragraphs") with: **"Keep replies 120-250 characters MAX. Be concise -- one short paragraph only."**
- Add a new rule: **"Always end the reply with the product URL on its own line, e.g. `yoursite.com`. The URL does NOT count toward the character limit."**
- The product URL comes from `profile.product_url` which is already available in the prompt context

This ensures every generated reply is a punchy 1-2 sentence comment with the website naturally linked at the end.

## Change 2: Cleaner Reply Dialog UI

**File:** `src/components/scanner/ReplyDialog.tsx`

Simplify the dialog by:

- **Remove the analysis badges row** (Pain, Technical Level, Buying Stage, etc.) -- this is internal data that clutters the UI. The user just wants to copy a reply.
- **Remove the reasoning text** next to each variant -- it adds visual noise.
- **Simplify the variant tabs** -- keep the 3-tab selector but make it more compact (icon-only on all sizes with a tooltip, or just smaller labels).
- **Reduce textarea height** from `min-h-[200px]` to `min-h-[100px]` since replies are now much shorter.
- **Show character count** below the textarea so users can see the reply length at a glance.
- **Streamline the footer** -- combine "Copy Reply" and "Open Thread" into just the single "Copy and Go" primary action, with "Copy" as a subtle secondary option and "Regenerate" as ghost.

### New layout structure:
```text
+----------------------------------+
| [Sparkles] AI Reply              |
| Thread title (truncated)         |
+----------------------------------+
| [Direct] [Story] [Expert]  tabs  |
| [8/10 conversion badge]         |
|                                  |
| [Textarea - shorter height]     |
| 187 / 250 chars                 |
+----------------------------------+
| [Regenerate]    [Copy] [Copy&Go] |
+----------------------------------+
```

## Technical Details

| File | Change |
|------|--------|
| `supabase/functions/generate-reply/index.ts` | Update prompt: 120-250 char limit, append product URL at end |
| `src/components/scanner/ReplyDialog.tsx` | Remove analysis badges, remove reasoning text, shrink textarea, add char count, simplify footer |

