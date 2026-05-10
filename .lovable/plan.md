## Plan

### 1. Remove Analysis Results step from `/onboarding`
- Edit `src/components/onboarding/OnboardingWizard.tsx`: revert to a 2-step flow (Business Details → Plan Selection).
- Remove the analysis results step UI, related state for `suggested_keywords` / extracted fields display, and update `stepTitles` + navigation.
- Keep the `analyze-website` call running silently in the background (or remove it if no longer needed) — I'll remove the visible step but preserve any data persistence already wired to the profile.

### 2. Replace landing hero CTA with website input
- Edit `src/components/landing/HeroSection.tsx`.
- Replace the two CTA buttons ("Start Finding Leads" + "See How It Works") with a single modern SaaS-style input group:
  - Glassmorphic pill container with website URL input on the left and a "Find leads" button on the right, arrow icon.
  - Placeholder: `yourwebsite.com`
  - On submit (button click or Enter): store the URL in `sessionStorage` (key: `pendingWebsite`) and `navigate('/auth')`.
- Keep proof points row beneath unchanged.

### Technical Details
- Input styling: `h-[60px]` rounded-2xl, white/glass background, white border, inset button. Responsive: stacks on mobile.
- The stored website URL can later be picked up by the onboarding wizard to prefill the website field (no wiring done in this plan unless requested).
- No backend changes.
