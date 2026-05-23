## Goal
Improve LLM/AI-crawler readability of Reddix's public pages so assistants like ChatGPT, Perplexity, and Claude can index the site accurately without executing JS.

## Changes

### 1. Refresh `public/llms.txt`
- Align copy with current product reality (manual-scan only — remove "24/7 autopilot" and "Scheduled Scans" claims per project memory).
- Tighten the summary and feature list (Intent Scanner, Qualification Engine, CRM, AI Copilot, Billing).
- Add a `## Glossary terms` section with 6–8 representative glossary entries from `src/lib/glossary.ts` (avoid listing all — keep flat per spec).
- Add a short `## Optional` section with deep links AI crawlers can skip (e.g. specific competitor comparisons beyond the top few).
- Keep excluding `/auth`, `/onboarding`, `/dashboard`, `/scanner`, `/leads`, `/settings` (auth-gated).

### 2. Improve `index.html` head metadata
- Replace the R2-hosted preview screenshot in `og:image` / `twitter:image` with a stable asset on the domain (e.g. `/og-image.png`) so social/AI previews don't break.
- Add `<link rel="canonical" href="https://reddix.info/">`.
- Add `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">` so AI crawlers can pull full snippets.
- Add `<link rel="alternate" type="application/ld+json" title="llms.txt" href="/llms.txt">` (signal discoverability).
- Add a minimal `<noscript>` fallback in `<body>` summarizing what Reddix is and linking to key public pages, so non-JS crawlers see real content on the root HTML.

### 3. Static crawler fallback
- Within the existing `<div id="root">` (replaced on hydration), inline a basic semantic HTML skeleton: H1 "Reddix — AI Reddit Lead Generation", a paragraph summary, and an unordered list of the main public pages (Features, Use Cases, Alternatives, Glossary). This gives JS-less crawlers real text without affecting the React app (React replaces it on mount).

### 4. JSON-LD already on `/` — leave intact
- `Index.tsx` already emits `SoftwareApplication`, `Organization`, and `FAQPage` JSON-LD. No changes there.
- Verify the Organization `logo` points to a real asset (currently `/placeholder.svg`); switch to `/favicon.png` or `/logo.png`.

### 5. Sitemap sanity check
- Confirm `public/sitemap.xml` only lists public routes (no auth/dashboard/scanner). Trim if needed.

## Out of scope
- No SSR/prerender setup (would be a much larger change). The `<noscript>` + root skeleton is the pragmatic win.
- No per-page meta overhaul beyond the root — existing `usePageMeta` hook already handles subpages.

## Technical notes
- Files touched: `public/llms.txt`, `index.html`, `src/pages/Index.tsx` (logo URL only), possibly `public/sitemap.xml`.
- `<noscript>` in `<head>` may only contain metadata tags; the visible fallback goes in `<body>`.
