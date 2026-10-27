# /features/natural-tone — brief

## The page's one job

Someone wants to know how to **reply on Reddit without sounding like an ad** or getting banned, or is checking whether Reddix's drafts will embarrass them. The page lays out the actual rules the drafts are written to and what each one protects. It is honest about what the drafts leave to the user, then asks them to start (`/auth`).

## Concept

**"The rulebook, shown."** The page argues by contrast (an ad next to a reply), then opens the rules and the voice settings.

**Hero:** editorial. A wide, left-set H1, with the answer and CTA on one line under it. Then a full-width split: "Reads like an ad" (greyed, with its faults listed) beside "Reads like a reply", each part tagged with the number of the rule it follows. The tags link down to the rules.

## Section plan

1. **Hero**: before/after split.
2. **Six rules every draft is written to**: a rulebook of wide rows, each with a large numeral, our name for the rule, the prompt's instruction, and why it matters on Reddit.
3. **Choose a voice, see what the AI is told**: tone (5) and pricing model (4) controls. Shows the exact `=== TONE ===` and `Pricing hook:` lines from the prompt, plus an example reply in that voice with its character count (`ai-replies/draft.ts`).
4. **What the drafts leave to you**: disclosure, the link rule, reading the thread, never reposting. A 2×2 grid.
5. **Natural tone, answered**: five questions in one narrow column.
6. **Close**: a full red band with a white button and inline related links.

## Truth (from the code, 2026-10-27)

- Reply rules 1–6 (`supabase/functions/generate-reply/index.ts:72-78`): helpful first; mirror language and technical level; mention the product naturally, never salesy; 120–250 chars max, excluding the URL; match subreddit culture; end with the product URL on its own line.
- Rule 5 also says "never reveal AI origin". The page doesn't present that as a feature.
- Tone lines, verbatim (`:37-43`, `:70`); friendly is the default (`:70`, `src/pages/Settings.tsx:55-61,88`).
- Pricing hooks, verbatim (`:45-51`, `:67`): free, freemium and free-trial only. paid, enterprise and unknown get none (`analyze-website/index.ts:130`).
- Drafts carry **no disclosure** of affiliation, and every draft ends with the link. The page says so and tells the user to disclose and to delete links where they're banned.
- The AI sees the post, not its comments (`:55-58`).
- All 20 tone × pricing example replies were checked to be 120–250 characters before the link.
- **Never said:** "ban-proof", "undetectable", stats, customer outcomes.

## How it differs from other pages

- `/features/ai-replies` owns the drafting workflow and editor; this page owns the rules and the voice.
- `/blog/reddit-self-promotion-rules` covers Reddit's own rules in depth; this page links there rather than repeating them.
