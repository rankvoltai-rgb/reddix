

# Fix: "Analysis failed" Error on Website Analyze Button

## Root Cause

The analyze-website backend function works correctly -- it successfully scrapes the website via Firecrawl and sends content to the AI service. However, the **AI service is returning HTTP 402 (credits exhausted)**.

The real problem is how the error flows back to the user:

```text
Edge Function returns HTTP 402 with body: { success: false, error: "AI credits exhausted..." }
        |
        v
supabase.functions.invoke() sees 402 as an error, sets `error` object, `data` = null
        |
        v
Client code reads `error.message` which is a generic SDK message, not the actual error text
        |
        v
User sees "Analysis failed" with no useful context
```

## Fix Strategy

Make the edge function **always return HTTP 200** and communicate success/failure through the JSON body. This is the pattern used by the other edge functions in this project (e.g., `check-subscription`). This ensures `supabase.functions.invoke` passes the full response body to the client, preserving error details.

## Changes

### 1. Update `supabase/functions/analyze-website/index.ts`

Change all non-2xx responses to return HTTP 200 with `success: false` in the body:

- Line ~72 (scrape failure): Change `status: 400` to `status: 200`
- Line ~82 (sparse content): Change `status: 400` to `status: 200`  
- Line ~91 (AI not configured): Change `status: 500` to `status: 200`
- Line ~148 (rate limit): Change `status: 429` to `status: 200`
- Line ~153 (credits exhausted): Change `status: 402` to `status: 200`
- Line ~158 (AI error): Change `status: 500` to `status: 200`
- Line ~165 (no tool call): Change `status: 500` to `status: 200`
- Line ~173 (parse failure): Change `status: 500` to `status: 200`
- Keep the outer catch as `status: 500` (genuine unexpected errors)
- Keep the 401 unauthorized responses as-is (security)

This way, the client always receives the structured `{ success: false, error: "specific message" }` response and can display the actual error to the user.

### 2. No client-side changes needed

The `OnboardingWizard.tsx` already correctly reads `result.error` and shows it in the toast (line 132). Once the edge function returns 200, the error message will flow through properly.

## Expected Result After Fix

- If AI credits are exhausted: toast shows "AI credits exhausted. Please try again later."
- If website is unreachable: toast shows "Could not access that website."
- If content is sparse: toast shows "Website content was too sparse to analyze."
- User always gets a clear, actionable error message instead of generic "Analysis failed"

## Files Modified

- `supabase/functions/analyze-website/index.ts` -- change error HTTP statuses to 200

