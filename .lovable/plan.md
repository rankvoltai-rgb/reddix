

## Reddix — Alternatives Pages (SEO-Optimized, UI-Rich)

### Research: Confirmed Competitors

Based on web research, these are the main Reddit lead generation tools competing with Reddix:

| Competitor | Status | Key Weakness (for Reddix positioning) |
|---|---|---|
| **GummySearch** | Shut down Nov 2025 | Dead — no longer available |
| **RedReach** | Active | No autonomous scanning, manual workflow |
| **Redditor AI** | Active | Focused on auto-posting, risk of bans |
| **SubredditSignals** | Active | Monitoring only, no AI replies |
| **CommunityTracker** | Active | Analytics-heavy, limited lead scoring |
| **ReplyAgent** | Active | Managed accounts model, expensive |
| **ReddLeads** | Active | Basic keyword matching, no intent AI |

### What We'll Build

**1. Alternatives Hub Page** (`/alternatives`)
- SEO title: "Best Reddit Lead Generation Tools — Reddix Alternatives Compared"
- Grid of competitor cards with scores, key differences, and CTAs
- Hero with the same rich dark-gradient style as landing
- Comparison table summarizing all tools
- Final CTA section

**2. Individual Alternative Pages** (`/alternatives/:slug`)
- One page per competitor (7 pages total)
- Each page: Hero → Head-to-head comparison table → Feature breakdown → Why Reddix wins → CTA
- SEO-optimized `<title>`, `<meta description>`, structured copy
- Same visual language as landing (glassmorphism, gradient borders, reveal animations)

### File Plan

| File | Purpose |
|---|---|
| `src/lib/alternatives.ts` | Data file with all competitor info, features, slugs |
| `src/pages/Alternatives.tsx` | Hub page listing all competitors |
| `src/pages/AlternativeDetail.tsx` | Individual comparison page (dynamic by slug) |
| `src/components/alternatives/AlternativeHero.tsx` | Shared hero component for alternatives |
| `src/components/alternatives/ComparisonTable.tsx` | Head-to-head feature comparison table |
| `src/components/alternatives/CompetitorCard.tsx` | Card component for the hub grid |
| `src/App.tsx` | Add `/alternatives` and `/alternatives/:slug` routes |
| `src/components/landing/Navbar.tsx` | Add "Alternatives" nav link |
| `src/components/landing/Footer.tsx` | Add alternatives links in footer |
| `index.html` | Update meta tags |

### SEO Strategy

- Each page gets a unique `document.title` and `meta description` set via `useEffect`
- URL structure: `/alternatives/gummysearch`, `/alternatives/redreach`, etc.
- H1 tags with target keywords like "Reddix vs GummySearch" 
- Structured comparison content that answers search intent
- Internal linking between hub and detail pages
- robots.txt already allows all crawlers

### Design Approach

- Reuse landing page utility classes: `reveal`, `glass-card`, `gradient-border`, `orb`, `bento-card`
- Dark gradient hero matching the landing page style
- Comparison tables with the same styling as `ComparisonSection.tsx` (check/x icons, color-coded cells)
- Competitor cards with hover effects, intent badges showing Reddix advantages
- ICP-aligned copy: speaks to SaaS founders tired of manual Reddit prospecting

### Technical Details

- All competitor data centralized in `src/lib/alternatives.ts` for easy maintenance
- Dynamic routing with `useParams()` to render the correct competitor
- 404 fallback if slug doesn't match any competitor
- `useEffect` to set `document.title` and meta description per page
- Smooth scroll nav items on detail pages link back to hub

