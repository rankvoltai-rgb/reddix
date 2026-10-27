# /features/intent-detection — brief

## The page's one job

Someone searched for **reddit intent detection** (or "find buying intent on reddit", "reddit lead signals"). They already know keyword alerts are noisy. They want to know whether a tool can tell a buyer from a browser, and how. The page answers that by **showing the mechanism**, then asks them to start (`/auth`, carrying their URL).

## Concept

**"Show the working."** Every other Reddit lead tool says "AI finds buyers." This page opens the box: the four stages a post goes through, the rubric it's scored on, the exact phrases that add points, and a checker where the visitor pastes a real post and watches the first pass run. The checker imports the same rules the scanner runs (`supabase/functions/_shared/intent-heuristics.ts`), so the page can't drift from the product.

**Focal visual (hero):** one Reddit post, annotated. Its phrases light up one by one with the points they add (competitor +25, pricing +15), and a meter adds them to the AI's score until it lands in the Hot band.

## Section plan

1. **Hero** — H1 with the query; the plain-text answer to "what is Reddit intent detection" right under it (for readers and answer engines); one primary action; a secondary link down to the checker. Annotated post on the right.
2. **Same word, four intents** — four short posts that all contain the same keyword, scored from Low to Hot. Makes the case against keyword alerts without a paragraph about it.
3. **From search to saved lead** — the pipeline in four stages with the real limits from the code (6–8 search phrases, 7-day memory, up to 30 posts scored, batches of 10, saved at 35+, top 25 kept).
4. **Reading the score** — the 0–100 scale in its four bands, what each usually looks like, what to do about it; the three signals that add points.
5. **Check a post yourself** — the interactive checker (real rules, real arithmetic; the AI score is a slider the visitor sets, clearly labelled).
6. **What it doesn't do** — the honest limits: scans run when you start them, public posts only, never posts for you, the AI can be wrong (so every lead shows its note and confidence).
7. **Questions** — five, specific to intent detection, in a plain definition-list layout.
8. **Next** — related features and posts, then a short closing band.

## Truth (from the code, 2026-10-27)

- Search: AI writes 6–8 buyer-language search phrases from the product profile; up to 7 searches per scan.
- First pass: duplicates and posts scored low in the past 7 days are skipped; a post under 40 characters is skipped; "junk" patterns (I built, check out my, launching, hiring, giveaway, AMA, …) are skipped **unless** a buying signal or competitor rescues them. Competitor mentions and direct asks are scored first. Up to 30 posts per scan.
- AI pass: batches of 10, scored 0–100 against product name, description, features and competitors, with a one-line note and a confidence (0–1). Rubric: Hot 70–100, Warm 40–69, Research 25–39, Low 0–24.
- Boosts after the AI: competitor named +25, pricing language +15, "alternative to" +10; capped at 100.
- Saved: final score ≥ 35; at most 25 per scan, best first. One scan per 5 minutes.
- **Not true, so never said:** real-time or background scanning, "140+ signals", "94% accuracy", "<2s", engagement multipliers, customer outcomes.

## How it differs from other pages

- Not the shared feature template (`FeatureDetail`): no hero-gradient, no demo-stats row, no benefits grid, no use-case stories.
- Not the landing page: the landing sells the whole product; this page explains one mechanism and lets the visitor test it.
- Not `/features/lead-scoring` (which should explain ranking and the CRM) or `/blog/reddit-lead-generation` (a strategy guide with a manual rubric). Links to both.

## Known rule gap (2026-10-27)

`PRICING_RE` lists `\$\d`, but the leading `\b` can't match before `$` after a space, so prices like "$49" don't count as pricing language today. The page never cites a dollar amount as a pricing signal; if the regex is fixed, "$30" can go back into the examples.
