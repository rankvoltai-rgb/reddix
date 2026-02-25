

# Simplify Onboarding: 2-Step Wizard

## Goal

Reduce onboarding from 6 steps to 2 steps. The user provides only their name, business name, and website URL. The AI analyzes the website and auto-fills everything else behind the scenes.

## New Flow

```text
Step 1: Your Info
  - Your Name (required)
  - Business Name (required)  
  - Website URL (required)
  - [Analyze & Continue] button

Step 2: Choose Your Plan
  - Free / Premium / Enterprise (same as current)
  - [Complete Setup]
```

When the user clicks "Analyze & Continue":
1. The AI scrapes and analyzes their website
2. All product fields (description, audience, features, competitors, tone, etc.) are auto-filled
3. Profile is saved with AI-extracted data
4. User proceeds to plan selection
5. After selecting a plan, onboarding completes and triggers auto-setup (keywords, subreddits, first scan)

If analysis fails (network error, sparse content), the user is shown a toast error and can retry or proceed with minimal data.

## Technical Changes

### 1. `supabase/functions/analyze-website/index.ts`

- Add `tone` to the AI extraction schema so the AI can infer the best reply tone from the website's voice (professional, casual, friendly, technical, witty)
- This removes the need for a separate tone-selection step

### 2. `src/components/onboarding/OnboardingWizard.tsx`

- Change `TOTAL_STEPS` from 6 to 2
- **Step 1**: Only 3 fields -- name, business name, website URL (all required). The "Continue" button triggers `handleAnalyzeWebsite`, saves all extracted data to the profile, then advances to step 2
- **Step 2**: Plan selection (unchanged logic)
- After plan selection, call `handleComplete` which saves remaining profile data and triggers auto-setup
- Remove steps 3-6 UI entirely (features, competition, social proof, tone)
- Remove unused state (featureInput, competitorInput, objectionInput, autoFilledFields)
- The "Continue" button on step 1 shows a loading state ("Analyzing your website...") during analysis
- Keep the same card-based UI design, logo, progress bar, and animation patterns
- `canProceed()` for step 1 only requires name + business name + URL
- Website URL is now required (not optional)

### 3. No database changes needed

All profile columns already exist. The AI just populates them automatically instead of the user doing it manually.

## Edge Cases

- **AI credits exhausted (402)**: Toast error, user can retry later
- **Rate limited (429)**: Toast with "try again in a moment"
- **Website unreachable**: Toast error, allow user to proceed anyway with just the 3 fields filled (graceful degradation -- description/audience/etc. will be empty but the app still works)
- **Sparse website content**: Same graceful degradation

## Files Modified

- `supabase/functions/analyze-website/index.ts` -- add tone extraction
- `src/components/onboarding/OnboardingWizard.tsx` -- simplify to 2 steps

