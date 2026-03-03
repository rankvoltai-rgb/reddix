

# Absolute Fix: Scan Edge Function Reliability

## Root Cause

There are **3 bugs** causing the scan to fail intermittently:

### Bug 1: Shared Global Counter (Critical)
`firecrawlCallCount` on line 42 is a **module-level global variable**. Edge function isolates can handle multiple concurrent requests. When the user clicks "Scan" while a previous scan is still running (or two requests land on the same isolate), they **share the same counter**. One request increments it to 7, and the other request's searches all get skipped because `firecrawlCallCount >= MAX_FIRECRAWL_CALLS`. The reset on line 423 doesn't help because concurrent requests interleave.

### Bug 2: Rate Limit Returns HTTP 429 (Causes SDK Error)
The rate limit check on line 500 returns `status: 429`. The Supabase SDK treats non-2xx responses as errors and **swallows the JSON body**, so the client only sees a generic "FunctionsHttpError" instead of the helpful "wait X minutes" message. Per the project's own error-handling convention (documented in memory), application-level failures should return HTTP 200 with `{ success: false, error: "..." }`.

### Bug 3: No Client-Side Guard Against Double-Clicks
The scan button sets `isScanning = true` but if the function errors quickly (e.g., rate limit), `isScanning` is reset to `false` immediately, allowing another rapid click. There's no cooldown or debounce to prevent spamming the edge function.

## Fixes

### Fix 1: Request-Scoped Counter
Move `firecrawlCallCount` from a module-level global into a local variable inside the request handler, passed to `runSearch` as a parameter. This eliminates all concurrency issues.

### Fix 2: Return HTTP 200 for Rate Limits
Change the rate limit response from `status: 429` to `status: 200` with `{ success: false, error: "..." }`. This ensures the Supabase SDK passes the error message through to the UI correctly.

### Fix 3: Client-Side Scan Cooldown
Add a `useRef`-based cooldown timer on the scan button. After a scan completes (success or failure), disable the button for 10 seconds to prevent rapid re-invocations.

## Technical Changes

| File | Change |
|------|--------|
| `supabase/functions/scan-reddit/index.ts` | Make `firecrawlCallCount` request-scoped (pass as object ref); change rate limit response to HTTP 200 |
| `src/pages/Scanner.tsx` | Add 10s cooldown after scan completes; disable button during cooldown |

### Implementation Details

**Edge function counter fix:**
- Remove the global `let firecrawlCallCount = 0` on line 42
- Create a `const callCounter = { count: 0 }` inside the request handler (after line 423)
- Pass `callCounter` as a parameter to `runSearch` instead of referencing the global
- `runSearch` increments `callCounter.count` instead of the global

**Rate limit response fix:**
- Change line 500-503 from `status: 429` to `status: 200` so the JSON body (`{ success: false, error: "wait X minutes" }`) is properly returned to the client

**Client-side cooldown:**
- Add a `scanCooldown` state and a `useRef` timer
- After `handleScan` completes (finally block), set `scanCooldown = true` and start a 10-second timer
- Disable the scan button when `isScanning || scanCooldown`
- Show countdown text on button during cooldown

