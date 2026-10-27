# /features/ai-replies — brief

## The page's one job

Someone searched for an **AI Reddit reply generator**. Their worry is a bot that posts for them, or replies that read like ads. The page shows exactly what goes into a draft, what comes out, and that the posting is theirs, then asks them to start (`/auth`).

## Concept

**"A draft, not a post."** The page follows a reply from thread to Reddit and draws the line where Reddix stops.

**Hero:** copy centred over the rails, then a full-width strip under it: In (post + profile) → One pass (what the AI notes about the writer) → Out (Direct, Story, Expert).

## Section plan

1. **Hero**: H1 with the query, plain answer, one CTA, a link down to the editor; the three-cell flow strip.
2. **What the AI reads before it writes**: a two-column spec sheet of every input (post fields, profile fields), then what it notes about the writer.
3. **Three ways into the same thread** (`#editor`): pick a draft, edit it, copy it. The count leaves out a link on its own last line and is measured against 120–250. The link check is live. Reset, plus a clipboard copy with a failure state.
4. **You post it, from your account**: the handoff split into an "In Reddix" panel (3 steps) and an "On Reddit" panel (1 step); then caching, Regenerate and the Engaged status.
5. **What AI replies never do**: an ink band.
6. **Questions**: five, set as numbered rows with the answer beside each.
7. **Close**: a split CTA band with three related links.

## Truth (from the code, 2026-10-27)

- One AI call returns analysis + three variants: direct / story / expert (`supabase/functions/generate-reply/index.ts:53-83`, `:123`).
- Inputs: subreddit, title, the first 1,500 characters of the body (`:56-58`); profile name, description, key features, competitors, URL, differentiators, pricing hook, tone (`:61-70`).
- Analysis fields: painLevel, technicalLevel, buyingStage, emotionalState, productRelevance (`:25-31`). They are **not shown** in the dialog (`ReplyDialog.tsx` never reads `analysis`), so the page only says the AI notes them.
- Variants are sorted by the AI's conversionScore; the top one is saved to `reply_drafts` (`:262-285`).
- Drafts are cached on the lead for 7 days; Regenerate bypasses the cache (`:15`, `:218-236`).
- Generating sets the lead status to `engaged` (`:272`).
- An active or trialing subscription, or Lifetime, is required (`:193-200`, `_shared/subscription.ts:2,32,43`).
- UI: Direct/Story/Expert tabs, an editable textarea, a char count, Regenerate, Copy, and Copy & Go, which copies and opens the thread in a new tab (`src/components/scanner/ReplyDialog.tsx:84-108`, `:186-203`).
- Reddix has no Reddit login or posting path.
- **Never said:** auto-posting, DMs, voting, conversion rates, "AI that sounds human", customer outcomes.

## How it differs from other pages

- `/features/natural-tone` owns the writing rules and the tone settings; this page owns the workflow. Each links to the other.
- `/features/intent-detection` is about finding the thread; this page starts where that one ends.
