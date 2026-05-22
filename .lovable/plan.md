## Goal

Lock in the flow: Landing → Auth → Onboarding (analyze site with Gemini) → Subscribe → Scanner with 5 AI-picked subreddits already active. Clicking **Scan Now** uses the analyzed profile to find leads.

## What's already in place

- Step 1 of `OnboardingWizard.tsx` calls `firecrawlApi.analyzeWebsite(url)` and writes the analyzed product fields to `profiles`.
- `preseedScannerSetup()` runs in the background after Step 1 — calls `discoverSubreddits()` (already on Gemini via Lovable AI) + `autoGenerateKeywords()`, merges AI picks with a fallback list, and upserts 5 into `monitored_subreddits`.
- `triggerAutoSetup()` re-runs `preseedScannerSetup()` after Stripe checkout as a safety net.
- `scan-reddit` reads the profile + subreddits + keywords on manual Scan Now.

## Changes

### 1. Swap `analyze-website` from OpenRouter/Qwen → Lovable AI (Gemini)
`supabase/functions/analyze-website/index.ts` currently uses `OPENROUTER_API_KEY` with `qwen/qwen3.6-plus`. Replace with:
- Endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Auth: `LOVABLE_API_KEY` (already provisioned)
- Model: `google/gemini-3-flash-preview` (fast, cheap, plenty for structured extraction)
- Use **tool calling** for structured output instead of `response_format: json_schema` (per Lovable AI guidance) — tool name `extract_product_profile` with the same field set we have today (company_description, target_audience, value_proposition, key_features[], competitor_names[], pricing_model, unique_differentiators, common_objections[], success_stories, tone, suggested_keywords[]).
- Keep Firecrawl for scraping the page markdown — only the LLM step changes.
- Keep the silent-error contract: return HTTP 200 with `{ success: false, error: '...' }` on 429/402/parse failures.

Benefit: one less paid API, faster, consistent with `discover-subreddits` and `auto-generate-keywords` which already use Lovable AI.

### 2. Post-checkout lands on Scanner, not Dashboard
`OnboardingWizard.handleComplete` and the `checkout=success` effect both `navigate('/dashboard')`. Change both to `navigate('/scanner')` so the user immediately sees their 5 preselected subreddits + Scan Now.

### 3. Close the preseed race
`preseedScannerSetup()` is fire-and-forget. Two safeguards:
- On post-checkout success, **await** `triggerAutoSetup()` with a ~6s max timeout before navigating.
- On `Scanner.tsx` mount, if `subreddits.length === 0` and `profile.product_url` exists, run the preseed once (idempotent upsert) before the first scan.

### 4. Copy tweak (Step 1 helper text)
"We'll analyze your site, build your product profile, and preselect 5 subreddits — so you can scan immediately after subscribing."

## Out of scope

- No DB schema changes.
- No changes to `scan-reddit`, `discover-subreddits`, Stripe, or pricing.
- Manual-scan-only constraint stays — no auto scan after checkout.
- `OPENROUTER_API_KEY` secret stays in place (not deleted) in case other functions still use it; we just stop calling it from `analyze-website`.

## Files touched

- `supabase/functions/analyze-website/index.ts` — swap to Lovable AI + Gemini with tool calling.
- `src/components/onboarding/OnboardingWizard.tsx` — redirect to `/scanner`, await safety-net preseed with timeout, copy tweak.
- `src/pages/Scanner.tsx` — idempotent preseed on mount when empty.

## One confirmation

OK to proceed with `google/gemini-3-flash-preview` for the analyzer, or do you want the stronger `google/gemini-2.5-pro` (slightly slower/more expensive, marginally better extraction on messy sites)?
