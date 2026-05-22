## Goal

Remove the autopilot / background scanning feature so the app is **manual-only**: users click "Scan Now" to find leads, nothing runs in the background.

## Changes

### 1. Delete the scheduled-scan edge function
- Delete `supabase/functions/scheduled-scan/index.ts`
- Remove its `[functions.scheduled-scan]` block from `supabase/config.toml`

### 2. Remove the cron job (if any)
- Drop any `cron.job` that invokes `scheduled-scan` via a `pg_cron` insert. (If none exists, no-op.)

### 3. Strip Auto-Pilot UI from the Scanner page (`src/pages/Scanner.tsx`)
- Remove the Auto-Pilot toggle + label + divider (around lines 245–251)
- Remove the `toggleAutoPilot` handler and the "Auto-pilot enabled/disabled" toast (line 140-142)
- Remove the `autoPilotEnabled` and `nextScheduledScan` derived state (lines 200–201)
- Remove the "Next: ..." next-scan countdown (lines 270–272) and the `getNextScanText` helper if unused
- Remove the "Auto-pilot scanning 24/7" bullet from the upsell list (line 407)
- Drop the `Zap` / `Switch` imports if no longer used

### 4. Stop writing autopilot fields during onboarding (`src/components/onboarding/OnboardingWizard.tsx`)
- Remove `auto_pilot_enabled` and `next_scheduled_scan_at` from the two profile updates (lines 55–56 and 180–181); drop the `nextScan` computation
- Leaves the rest of onboarding untouched

### 5. Default `auto_pilot_enabled` to `false` for existing users (migration)
- `UPDATE profiles SET auto_pilot_enabled = false, next_scheduled_scan_at = NULL;`
- `ALTER TABLE profiles ALTER COLUMN auto_pilot_enabled SET DEFAULT false;`
- Columns are kept (not dropped) to avoid breaking the generated types file and any cached row reads. They simply become inert.

### 6. Update memory
- Add a constraint memory: "Manual scanning only — no background/autopilot scans. `scheduled-scan` removed."

## Out of scope
- No marketing-copy changes on the landing page (Testimonials/FeatureShowcase/Hero/Navbar still mention 24/7 — flag for a separate copy pass if you want)
- Pricing & paywall untouched
- `useCases.ts`, `glossary.ts`, `features.ts`, `alternatives.ts` content copy untouched (SEO pages)

## Confirm before I build

Three quick decisions:

1. **Landing page copy** still says things like "Auto-pilot scanning 24/7" and "monitors 24/7". Want me to rewrite that copy in this pass, or leave it for a follow-up?
2. **Drop the DB columns** (`auto_pilot_enabled`, `scan_frequency_hours`, `next_scheduled_scan_at`) entirely, or keep them inert as proposed?
3. **Free-plan daily limit + cooldown** stays as-is on manual scan, right?