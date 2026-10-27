# /features/website-analysis — brief

## The page's one job

Someone wants to know what Reddix does with their URL and whether the result is any good. The page shows what is read, what the profile contains, and where each field goes afterwards, then asks for the URL (stored as `pendingWebsite`, then `/auth`).

## Concept

**"The profile is the input to everything."** Hero: a fictional homepage (Tallyfold) whose passages light up one by one as profile fields fill in. Interactive: a field map. Pick a field and see which parts of Reddix read it, whether Settings can edit it, and what happens when it's empty.

## Section plan

1. Hero: centred title, answer and URL form (live "Reddix will read https://…" preview using analyze-website's normalisation), then the full-width page → profile specimen.
2. Five steps between your URL and your profile: a run sheet with the governing number per step.
3. Field map (interactive).
4. What the analysis can't see: the page's one dark band.
5. Questions: a numbered reading column.
6. Start with your URL: URL form plus links to its siblings.

## Truth (from the code, 2026-10-27)

- URL gets `https://` unless it starts with http:// or https:// — analyze-website/index.ts:44-47.
- One page, markdown, `onlyMainContent` — :59-70. Under 50 chars → error, fill manually — :80-84.
- First 8,000 characters to the AI — :93. Fields and caps — :120-145, :195-208 (features ≤5, competitors ≤5 and only if named, objections ≤5, suggested_keywords ≤10).
- Onboarding saves non-empty fields except suggested_keywords — OnboardingWizard.tsx:526-541. Failure is silent; setup continues — :548-562. Then preseed saves up to 5 subreddits — :69-108.
- Field uses: search phrases scan-reddit/index.ts:103-110 (name filtered out of phrases :135); scoring :157-161 ("Software" fallback :159); competitor +25 via buildHeuristics :347; competitor search, first two :381-384; discovery discover-subreddits/index.ts:67-76; replies generate-reply/index.ts:45-70 (differentiators → value prop fallback :66; pricing hook :45-49; tone default friendly).
- common_objections and success_stories: written, never read (grep).
- Settings edits only name, description, audience, value proposition and tone — Settings.tsx:45-51. Changing product fields clears cached search phrases — useProfile.tsx:10-13, :40-45.
- Not said: crawling a whole site, live monitoring, re-running the analysis.

## How it differs

- From subreddit-discovery: this page explains the profile; that page explains what's done with it for communities. They share the fictional Tallyfold, and the layouts differ (centred title page plus run sheet here, editorial masthead plus tiers there).
- From intent-detection: no two-column hero card and no score explanations; it links there instead.
