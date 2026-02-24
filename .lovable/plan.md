
# Remove /setup and Merge Into Onboarding

## What Changes

The `/setup` page currently collects your name, website URL, and business description before onboarding begins. Since the onboarding wizard already asks for similar information (business name, website URL, target audience), we'll fold the name field into the onboarding wizard's first step and eliminate the separate setup page entirely.

## New User Flow

```text
Auth (/auth) --> Onboarding (/onboarding) --> Dashboard
```

No more intermediate `/setup` step.

## Technical Details

### 1. Update Onboarding Wizard Step 1 (`src/components/onboarding/OnboardingWizard.tsx`)
- Add a "Your Name" field (required) at the top of Step 1, before Business Name
- Add a "Describe your product" field (the `company_description` that `/setup` used to collect) -- this can replace or supplement Target Audience
- Save `full_name` and `initial_setup_completed: true` along with other profile data on wizard completion

### 2. Update `src/pages/Onboarding.tsx`
- Remove the guard that redirects to `/setup` when `initial_setup_completed` is false
- Keep only: redirect to `/auth` if not logged in, redirect to `/dashboard` if onboarding already completed

### 3. Update `src/pages/Auth.tsx`
- Change post-login redirect from `/setup` to `/onboarding`

### 4. Update `src/pages/Index.tsx`
- Remove the `initial_setup_completed` check that redirects to `/setup`
- If user is logged in but hasn't completed onboarding, go to `/onboarding`

### 5. Update `src/pages/Dashboard.tsx`
- Remove the guard that redirects to `/setup` when `initial_setup_completed` is false
- The onboarding-incomplete check already redirects to `/onboarding`

### 6. Update `src/App.tsx`
- Remove the `/setup` route and `Setup` import
- Add a redirect: `/setup` -> `/onboarding` for backward compatibility

### 7. Delete `src/pages/Setup.tsx`
- No longer needed

### Files Modified
- `src/components/onboarding/OnboardingWizard.tsx` -- add full_name field, save initial_setup_completed on complete
- `src/pages/Onboarding.tsx` -- remove setup guard
- `src/pages/Auth.tsx` -- redirect to /onboarding
- `src/pages/Index.tsx` -- remove setup redirect
- `src/pages/Dashboard.tsx` -- remove setup guard
- `src/App.tsx` -- remove setup route, add redirect
- `src/pages/Setup.tsx` -- delete
