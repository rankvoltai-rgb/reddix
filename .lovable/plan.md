## Where credits are spent today

Quick audit of the four AI-using edge functions:

| Function | Model | Calls per invocation | Notes |
|---|---|---|---|
| `scan-reddit` — `generateSearchTerms` | gemini-2.5-flash-lite | 1 (cached) | Already cached on profile ✅ |
| `scan-reddit` — `batchScorePass1` | gemini-2.5-flash-lite | ~3 (30 posts / BATCH_SIZE) | Cheap, fine |
| `scan-reddit` — `deepAnalyzePost` | **gemini-2.5-flash** | 1 per Pass-1 qualifier (up to ~30) | **Biggest cost driver** |
| `generate-reply` | gemini-2.5-flash | **2 per click** (analyze + generate, possibly ×3 variants) | Second biggest |
| `auto-generate-keywords` | gemini-2.5-flash | 1 per onboarding | Fine |
| `discover-subreddits` | gemini-2.5-flash | 1 per click | Fine |

The two functions doing most of the spend are `scan-reddit` (every scheduled + manual scan) and `generate-reply` (every reply click).

---

## Plan — 6 changes, biggest impact first

### 1. Downgrade Pass-2 deep analysis to `gemini-2.5-flash-lite`
`deepAnalyzePost` runs up to ~30 times per scan on `gemini-2.5-flash`. Flash-lite is ~5–8× cheaper and the task (scoring with a rubric + short notes via tool calling) is well within its ability. Pass-1 already uses flash-lite successfully.
- File: `supabase/functions/scan-reddit/index.ts` line 327
- Expected savings: **~60–70% of scan cost**.

### 2. Tighten Pass-1 → Pass-2 funnel
Currently `PASS1_THRESHOLD` lets a lot of posts through to the expensive Pass 2. Raise the bar and cap Pass-2 to the top N.
- Raise `PASS1_THRESHOLD` (e.g. 25 → 35).
- Cap Pass-2 to top 15 posts by Pass-1 score (`pass1Qualified.sort(...).slice(0,15)`).
- Expected savings: **~30–50% of Pass-2 calls**.

### 3. Truncate prompt inputs in Pass-2
`deepAnalyzePost` sends up to 3,000 chars of post content. Reddit posts rarely need >1,200 chars to score intent.
- Change `.slice(0, 3000)` → `.slice(0, 1200)` (line 316).
- Expected savings: **~30–50% of input tokens on Pass-2**.

### 4. Collapse `generate-reply` two-stage pipeline
Today every reply does an Analyze call **then** a Generate call. Merge them into a single call that uses tool-calling to return both the analysis JSON and reply variants. One round-trip instead of two.
- File: `supabase/functions/generate-reply/index.ts`
- Also downgrade analyze step to flash-lite if kept separate.
- Expected savings: **~50% of reply cost**.

### 5. Cache replies per lead
A user often clicks "Generate reply" multiple times on the same lead while iterating. Store the generated variants on the `leads` row (or a `lead_replies` table) and reuse on subsequent opens unless the user clicks "Regenerate".
- DB: add `cached_replies jsonb`, `replies_generated_at timestamptz` to `leads`.
- Edge function: short-circuit if cache exists and `regenerate=false`.
- Expected savings: **~70% of repeat reply calls**.

### 6. Reduce scheduled-scan frequency for inactive users
If `scheduled-scan` runs on a fixed cron for every user, idle users still consume AI. Skip the scan when:
- The user hasn't logged in for 7+ days, OR
- The last scan returned 0 new posts (back off to daily instead of hourly).

Expected savings: variable but meaningful for the long tail.

---

## Smaller wins (optional)

- **Re-use the cached search terms TTL more aggressively** — currently regenerated whenever cache misses. Extend to 14 days.
- **Skip Pass-2 when Pass-1 confidence is already 80+** — promote directly as a hot lead with Pass-1 notes.
- **Set `max_tokens` explicitly** on every AI call (e.g. 400 for analysis, 300 for reply variants) to bound runaway responses.
- **Add a `gemini-2.5-flash-lite` fallback** when a 429 is hit on the larger model, instead of failing the whole scan.

---

## Out of scope

- No UI changes — these are all backend edge-function and DB tweaks.
- No paywall/quota changes (already in place).
- No model switching to non-Lovable providers (would require external API keys).

## Suggested order

1. Quick wins first: changes **#1, #2, #3** in `scan-reddit` — one file, ~10 minute edit, biggest dollar impact.
2. Then **#4 + #5** in `generate-reply` (requires a small migration for the cache).
3. Then **#6** in `scheduled-scan`.

Want me to implement all six, or just the scan-reddit quick wins (#1–3) first?