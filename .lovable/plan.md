

# Remove Topics: Make Scanning Fully Autonomous

## Insight
The "Topics" section is manual friction that shouldn't exist. The `scan-reddit` edge function already has the user's full product context from onboarding (product name, description, features, competitors, audience). Right now it requires a separate `keywords` table to build search queries — but those keywords are just derivatives of the product profile that AI can generate on-the-fly.

The 400 IQ move: **generate search queries dynamically at scan time from the product profile**, eliminating the keywords table dependency entirely from the scanning flow.

## What Changes

### 1. Remove Topics UI from Scanner page
- Delete the entire "Topics" row (keyword badges, add input, suggestions)
- Remove keyword-related state, queries, and mutations from Scanner.tsx
- The config strip becomes just subreddits — one clean row
- The "Scan Now" button only requires subreddits (not keywords)

### 2. Update `scan-reddit` edge function
- Remove the keywords table fetch and the check that fails when keywords are empty
- Instead, dynamically generate 5-8 search terms from the profile at scan time using a fast AI call (gemini-2.5-flash-lite)
- These ephemeral search terms are used for that scan only — no persistence needed
- Falls back to product name + description keywords if AI call fails
- This makes every scan contextually fresh (search terms can evolve as the product evolves)

### 3. Keep keywords table but make it optional/hidden
- The table stays for backwards compatibility and for the `auto-generate-keywords` function
- It becomes an internal system detail, not user-facing
- Existing keywords won't break anything

## Result
- Scanner config strip: just subreddits + discover button
- Zero keyword management friction
- Scans automatically know what to search for based on product profile
- Search terms stay fresh and contextual

---

## Technical Details

### Files Modified

**src/pages/Scanner.tsx**
- Remove `newKeyword` state
- Remove `keywords` query (`useQuery` for keywords table)
- Remove `addKeyword` and `removeKeyword` mutations
- Remove the keywords/topics row from the config strip UI
- Update `isConfigured` to only check `subreddits.length > 0`
- Update config count text to only show subreddit count

**supabase/functions/scan-reddit/index.ts**
- Remove keywords table fetch (lines 173-174)
- Remove keywords empty check (lines 194-206)
- Add a new step: generate search terms from profile using AI (fast call to gemini-2.5-flash-lite)
- Use generated terms in place of `topics` variable for search strategies A and D
- Add fallback: if AI fails, extract simple terms from product_name + company_description via string splitting
- Keep competitor strategy (Strategy B) unchanged — it already uses profile data directly

### Files NOT Modified
- `auto-generate-keywords` edge function — kept as-is for any future use
- `keywords` table — stays in database, just not queried by scanner UI
- LeadsSection, LeadCard, SubredditDiscovery — no changes needed

