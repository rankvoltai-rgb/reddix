

## Plan: Switch to OpenRouter (Qwen) for Analysis + Add Results Step

### Summary
1. Replace the Lovable AI gateway with OpenRouter API using `qwen/qwen3.6-plus` in the `analyze-website` edge function
2. Add an `OPENROUTER_API_KEY` secret
3. Add a new Step 2 ("Analysis Results") to the onboarding wizard, making it a 3-step flow: Business Details → Analysis Results → Subscribe

---

### Step 1: Add OpenRouter API Key Secret
- Use the `add_secret` tool to request the user's OpenRouter API key
- This will be used in the `analyze-website` edge function

### Step 2: Update `analyze-website` Edge Function
**File:** `supabase/functions/analyze-website/index.ts`

- Replace the Lovable AI gateway URL (`https://ai.gateway.lovable.dev/...`) with OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
- Change auth header to use `OPENROUTER_API_KEY` instead of `LOVABLE_API_KEY`
- Change model to `qwen/qwen3.6-plus`
- Keep the same tool-calling schema and Firecrawl scraping logic unchanged
- Also generate suggested keywords as part of the analysis response (add to the tool schema: `suggested_keywords` array) so results can be shown before subscription

### Step 3: Update the Onboarding Wizard to 3 Steps
**File:** `src/components/onboarding/OnboardingWizard.tsx`

- Change `TOTAL_STEPS` from 2 to 3
- Step 1 (unchanged): Business details (name, product name, URL) → "Analyze & Continue"
- **Step 2 (new): Analysis Results** — displays the extracted data:
  - Company description, target audience, value proposition
  - Key features as badges/chips
  - Competitor names
  - AI-suggested keywords (from the enhanced analysis)
  - A "Continue" button to proceed to Step 3
- Step 3 (was Step 2): Plan selection / subscribe
- Store the analysis results in component state after Step 1 analysis completes, so Step 2 can render them
- Update `stepTitles` and navigation logic accordingly

### Technical Details
- The `analyze-website` edge function will add a `suggested_keywords` field to its response (array of keyword strings generated from the same AI call)
- The `AnalyzeWebsiteResponse` type in `src/lib/api/firecrawl.ts` will be updated to include `suggested_keywords`
- The analysis results step will use a clean card layout showing each extracted field with appropriate labels and icons

