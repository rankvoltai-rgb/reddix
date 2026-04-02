

## Feature Landing Pages — Rich Sub-Pages for Each Core Feature

### Overview

Create 9 individual feature landing pages at `/features/:slug`, each designed as a standalone landing page with the same visual richness as the main site. Every page gets its own hero, interactive demo UI, detailed benefits, use cases, FAQ, and CTA — all SEO-optimized with unique titles and meta descriptions.

### Features to build (9 pages)

| Slug | Title | Core angle |
|---|---|---|
| `intent-detection` | Intent Detection | AI spots buying signals, not vanity mentions |
| `lead-scoring` | Lead Scoring | Every lead scored 0–100 for purchase readiness |
| `ai-replies` | AI Replies | Context-aware drafts that match subreddit culture |
| `subreddit-discovery` | Subreddit Discovery | AI finds communities where your ICP hangs out |
| `analytics-dashboard` | Analytics Dashboard | Track leads, replies, and conversion rates |
| `scheduled-scans` | Scheduled Scans | Auto-pilot scans Reddit 24/7 on your schedule |
| `deduplication` | Deduplication | Smart filtering — never see the same post twice |
| `website-analysis` | Website Analysis | Drop your URL, extract keywords automatically |
| `natural-tone` | Natural Tone | Replies built to add value, not sound like ads |

### File plan

| File | Purpose |
|---|---|
| `src/lib/features.ts` | Centralized data: slug, title, descriptions, benefits, use cases, FAQ, SEO meta, demo UI config per feature |
| `src/pages/FeatureDetail.tsx` | Dynamic page rendering each feature by slug |
| `src/components/features/FeatureHero.tsx` | Feature-specific hero with gradient background, icon, and bubble design (reusing HeroSection/AlternativeHero patterns) |
| `src/components/features/FeatureDemoSection.tsx` | Large interactive demo UI section (expanded versions of the mini UIs from FeaturesGrid) |
| `src/components/features/FeatureBenefits.tsx` | Benefits grid with bento cards |
| `src/components/features/FeatureUseCases.tsx` | Use case scenarios section |
| `src/components/features/FeatureFAQ.tsx` | Feature-specific FAQ accordion |
| `src/App.tsx` | Add `/features/:slug` route |
| `src/components/landing/Navbar.tsx` | Update feature dropdown items to link to `/features/slug` instead of scrolling to `#features` |

### Page structure (each feature page)

```text
┌─────────────────────────────────────┐
│  Navbar                             │
├─────────────────────────────────────┤
│  FeatureHero                        │
│  (gradient bg, icon, bubble title,  │
│   subtitle, CTA buttons)            │
├─────────────────────────────────────┤
│  FeatureDemoSection                 │
│  (large interactive demo UI,        │
│   side-by-side text + visual)       │
├─────────────────────────────────────┤
│  FeatureBenefits                    │
│  (3-4 bento cards with icons)       │
├─────────────────────────────────────┤
│  FeatureUseCases                    │
│  (3 use case cards with scenarios)  │
├─────────────────────────────────────┤
│  FeatureFAQ                         │
│  (3-4 feature-specific Q&As)        │
├─────────────────────────────────────┤
│  CTA Section (reuse FinalCTA style) │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### Design approach

- **Hero**: Same gradient background as landing hero with decorative circles, feature-specific floating stat cards, bubble-wrapped Playfair Display subtitle, back button
- **Demo section**: Enlarged versions of the mini UIs already in `FeaturesGrid.tsx` (e.g., the intent bars, the lead score chart, the AI reply card) — presented in an alternating text-left/visual-right layout like `FeatureShowcase.tsx` but bigger and more detailed
- **Benefits**: Bento-card grid with glassmorphism, gradient tints, hover effects (`card-hover`, `bento-card`)
- **Use cases**: Cards showing persona + scenario + outcome (e.g., "SaaS founder" / "Finds 47 warm leads in week one" / "3x pipeline growth")
- **FAQ**: Accordion component reusing existing `Accordion` primitives, styled with the same clean look as `FAQSection.tsx`
- **CTA**: Dark section matching `FinalCTA` with orbs, Playfair italic, and proof points

### SEO strategy

- Each page: unique `document.title` and `meta description` via `useEffect`
- H1 with target keyword (e.g., "Reddit Intent Detection Tool")
- Internal links: related features cross-linked at bottom, link back to main features grid
- URL structure: `/features/intent-detection`, `/features/ai-replies`, etc.

### Navigation update

Feature dropdown items in Navbar will change from `scrollId: 'features'` to `route: '/features/intent-detection'` etc., with the footer link "View all features" pointing to `/#features`.

### Technical details

- All feature data centralized in `src/lib/features.ts` for easy maintenance
- `useParams()` for dynamic routing, 404 fallback for unknown slugs
- Demo UIs extracted as standalone components within the data file or as inline JSX
- Reuse existing utility classes: `reveal`, `glass-card`, `bento-card`, `gradient-border`, `orb`, `bg-radial-glow`, Playfair Display typography

