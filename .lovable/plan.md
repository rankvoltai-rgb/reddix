

## Glossary — SEO-Optimized Public Page

### What we're building

A comprehensive `/glossary` hub page and `/glossary/:slug` detail pages covering 40+ Reddit marketing and lead generation terms. Each term gets its own URL for maximum SEO surface area. The design matches the existing Alternatives pages pattern (Navbar, AlternativeHero, rich cards, Footer).

### Terms to include (~45)

**Reddit-specific**: Subreddit, Karma, Upvote, Flair, AMA, Crosspost, Reddit API, Reddit Bot, Shadowban, Reddiquette, Reddit Gold/Premium, Reddit Ads, NSFW Tag, OP (Original Poster), TL;DR, Mod/Moderator, Reddit Search Operators

**Lead generation**: Lead Scoring, Intent Detection, Buying Signal, ICP (Ideal Customer Profile), Lead Qualification, Warm Lead, Cold Lead, MQL (Marketing Qualified Lead), SQL (Sales Qualified Lead), Social Selling, Community-Led Growth, Dark Social, Inbound Marketing

**AI & SaaS marketing**: Natural Language Processing (NLP), Sentiment Analysis, AI Reply Generation, Keyword Monitoring, Brand Monitoring, Social Listening, Conversion Rate, Customer Acquisition Cost (CAC), Churn Rate, Product-Market Fit, Growth Hacking, Programmatic SEO

**Reddix-specific**: Subreddit Discovery, Scheduled Scan, Lead Deduplication, Intent Score, Website Analysis, Reply Draft

### File plan

| File | Purpose |
|---|---|
| `src/lib/glossary.ts` | Data file: array of ~45 terms with slug, title, shortDef, longDef, category, relatedTerms, metaTitle, metaDescription |
| `src/pages/Glossary.tsx` | Hub page — hero + category filters + alphabetical/category grid of term cards |
| `src/pages/GlossaryTerm.tsx` | Individual term page — definition, related terms, CTA |
| `src/components/glossary/GlossaryCard.tsx` | Card component for the hub grid |
| `src/App.tsx` | Add `/glossary` and `/glossary/:slug` routes |
| `src/components/landing/Navbar.tsx` | Add Glossary to nav (under a "Resources" dropdown or standalone) |
| `src/components/landing/Footer.tsx` | Add Glossary link |

### Design approach

- Reuse `AlternativeHero` for the glossary hero with glossary-specific copy
- Hub page: category filter pills (All / Reddit / Lead Gen / AI & SaaS / Reddix) + searchable grid of `GlossaryCard` components
- Each card shows term name, short definition, category badge, arrow CTA
- Detail pages: clean typography-focused layout with the full definition, "Related terms" sidebar/section linking to other glossary entries, and a bottom CTA
- Same styling tokens: `bento-card`, `reveal`, Playfair Display accents, `rounded-2xl`, primary color accents
- SEO: unique `document.title` and meta description per term page, internal cross-linking between related terms

### Navigation integration

Add "Glossary" as a standalone nav item between "Pricing" and "Alternatives" in the Navbar, or nest it under a new "Resources" dropdown alongside Alternatives.

### Technical details

- Client-side search/filter on the hub page using `useState` — no backend needed
- `useParams` for slug-based routing on detail pages
- 404 redirect if slug doesn't match
- All definitions stored as plain strings in the data file for easy editing

