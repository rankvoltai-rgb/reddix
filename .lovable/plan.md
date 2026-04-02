

## Use Cases — SEO Sub-Landing Pages

### What we're building

A set of rich `/use-cases/:slug` pages, each targeting a specific business persona or scenario (e.g., "SaaS Founders," "Agencies," "Solopreneurs"). Each page is a standalone landing page with the same visual richness as the feature pages. A "Use Cases" dropdown is added to the Navbar.

### Use cases to create (8 pages)

| Slug | Title | Angle |
|---|---|---|
| `saas-founders` | SaaS Founders | Find users actively searching for your category |
| `marketing-agencies` | Marketing Agencies | Scale Reddit lead gen across multiple clients |
| `solopreneurs` | Solopreneurs | One-person teams finding warm leads on autopilot |
| `developer-tools` | Developer Tools | Reach devs where they actually hang out |
| `ecommerce` | E-commerce Brands | Discover product recommendation threads |
| `b2b-sales` | B2B Sales Teams | Surface enterprise buying signals on Reddit |
| `content-marketers` | Content Marketers | Find content gaps and distribution opportunities |
| `startup-growth` | Startup Growth | Early traction through authentic Reddit engagement |

### Page structure (mirrors feature pages)

```text
Navbar
UseCaseHero        — gradient bg, persona icon, bubble title, CTA
UseCaseScenario    — day-in-the-life walkthrough with mock UI
UseCaseBenefits    — 3-4 bento cards specific to the persona
UseCaseFeatures    — which Reddix features matter most (links to feature pages)
UseCaseTestimonial — persona-specific social proof quote
UseCaseFAQ         — 3-4 persona-specific Q&As
FinalCTA
Footer
```

### File plan

| File | Purpose |
|---|---|
| `src/lib/useCases.ts` | Centralized data for all 8 use cases (same pattern as `features.ts`) |
| `src/pages/UseCaseDetail.tsx` | Dynamic page with slug routing, SEO meta, related use cases |
| `src/components/use-cases/UseCaseHero.tsx` | Hero with gradient, persona icon, bubble Playfair title |
| `src/components/use-cases/UseCaseScenario.tsx` | "A day with Reddix" walkthrough section with mock UI |
| `src/components/use-cases/UseCaseBenefits.tsx` | Bento benefits grid |
| `src/components/use-cases/UseCaseFeatures.tsx` | Relevant features grid linking to `/features/:slug` |
| `src/components/use-cases/UseCaseFAQ.tsx` | Accordion FAQ |
| `src/App.tsx` | Add `/use-cases/:slug` route |
| `src/components/landing/Navbar.tsx` | Add "Use Cases" dropdown between "Pricing" and "Resources" |

### Navigation update

Add a new top-level nav item "Use Cases" with a dropdown listing all 8 personas, plus a footer link "View all use cases" pointing to `/#features` or a hub page.

### Data structure

```typescript
interface UseCaseData {
  slug: string;
  title: string;
  tagline: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  scenario: { step: string; detail: string }[];
  benefits: { title: string; desc: string; icon: LucideIcon }[];
  relevantFeatures: string[]; // slugs from features.ts
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
}
```

### Design approach

- Hero, benefits, FAQ components follow the exact same visual patterns as the feature pages (gradient hero, floating stat cards, bento grids, bubble Playfair italic text, `reveal` animations)
- **UseCaseScenario** is the unique section — a numbered step walkthrough showing how the persona uses Reddix, with a mock dashboard UI on the right side
- **UseCaseFeatures** shows 3-4 relevant features as cards that link to their individual feature pages for internal cross-linking
- Related use cases shown at the bottom for cross-linking

### SEO

- Unique `document.title` and meta description per page
- H1 targeting "[Persona] Reddit Lead Generation" keywords
- Internal links to feature pages and glossary terms

