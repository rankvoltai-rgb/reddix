

# AI-Powered Website Analysis for Onboarding

## Overview

After the user enters their website URL in Step 1, a "Analyze My Website" button uses Firecrawl to scrape the site and Lovable AI to extract product details. This auto-fills most onboarding fields, letting users review and tweak instead of typing everything from scratch.

## User Experience

1. User enters their name, business name, and website URL
2. Clicks "Analyze My Website" button (with a sparkle icon)
3. Loading state shows "Analyzing your website..."
4. Fields auto-populate: company description, target audience, value proposition, key features, competitors, pricing model, unique differentiators
5. Steps 3-5 arrive pre-filled -- user can edit or just click Continue through them
6. Net effect: onboarding goes from ~15 manual fields to ~3 (name, business name, URL) plus review

## Technical Changes

### 1. New Edge Function: `analyze-website`

**File:** `supabase/functions/analyze-website/index.ts`

- Accepts `{ url: string }` in the request body
- Requires auth (Bearer token)
- Scrapes the URL using Firecrawl API (`formats: ['markdown', 'links']`)
- Sends the scraped content to Lovable AI (gemini-2.5-flash) with a structured extraction prompt
- Uses tool calling to extract a structured JSON with fields: `company_description`, `target_audience`, `value_proposition`, `key_features` (array), `competitor_names` (array), `pricing_model`, `unique_differentiators`, `common_objections` (array), `success_stories`
- Returns the extracted data to the client
- Handles errors gracefully (site unreachable, scrape failure, AI parse failure)

**Config:** Add `[functions.analyze-website] verify_jwt = false` to `supabase/config.toml`

### 2. Update `OnboardingWizard.tsx` -- Step 1

- Add an "Analyze My Website" button next to the Website URL field (appears when URL is non-empty)
- Button shows `Sparkles` icon + loading spinner during analysis
- On success: auto-fill `company_description`, `target_audience`, and toast "Website analyzed! We've pre-filled your details."
- Store the full AI result so that Steps 3-5 also arrive pre-filled (`key_features`, `value_proposition`, `competitor_names`, `common_objections`, `pricing_model`, `unique_differentiators`, `success_stories`)
- On failure: toast with error, user can still fill manually
- Only overwrite fields that are currently empty (don't clobber user edits)

### 3. Update `src/lib/api/firecrawl.ts`

- Add an `analyzeWebsite(url: string)` method that invokes the `analyze-website` edge function with auth headers
- Returns typed response with extracted profile fields

### 4. UX Polish

- Steps 3-5 show a small "Auto-filled from your website" badge next to pre-filled fields so users know they can review/edit
- If no URL is provided, onboarding works exactly as before (fully manual)
- The analyze button is disabled while loading and shows progress text

## Files Modified

- `supabase/functions/analyze-website/index.ts` -- new edge function
- `supabase/config.toml` -- add function config (handled automatically)
- `src/lib/api/firecrawl.ts` -- add `analyzeWebsite` method
- `src/components/onboarding/OnboardingWizard.tsx` -- add analyze button + auto-fill logic

## Architecture

```text
User enters URL
      |
      v
[Analyze Button] --> firecrawlApi.analyzeWebsite(url)
      |
      v
Edge Function: analyze-website
      |
      +---> Firecrawl API (scrape URL, get markdown)
      |
      +---> Lovable AI (extract structured product data via tool calling)
      |
      v
Return structured data --> Auto-fill wizard fields
```

## Edge Cases

- Invalid/unreachable URL: return friendly error, user fills manually
- Very sparse website (landing page only): AI extracts what it can, leaves rest empty
- Rate limiting on Firecrawl or AI: surface error with retry suggestion
- User already typed some fields before analyzing: only fill empty fields

