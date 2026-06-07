## Goal
Fix two SEO/AI-crawler findings on every public page:
1. **No date signals** — add `dateModified` (and `datePublished`) so crawlers know content is fresh.
2. **Missing JSON-LD** — only `/` has structured data (it's React-rendered, invisible to non-JS crawlers). Bake JSON-LD into the raw HTML for every prerendered route.

Sitemap already has `<lastmod>` — good, leave it. The gap is in-page signals.

## Changes

### 1. `scripts/prerender.ts` — inject JSON-LD + dates into every prerendered page

For each route, build a JSON-LD `@graph` and inject it as `<script type="application/ld+json">` into `<head>` (before `</head>`), and add a visible `<time datetime="...">Last updated: …</time>` line in the prerendered `<main>`.

Schema per route type:
- **`/` (home)** — `Organization` + `WebSite` + `SoftwareApplication` (move the three blocks currently in `src/pages/Index.tsx` into the static HTML so non-JS crawlers see them; keep React copy too — duplicates are fine, Google dedupes by `@id`).
- **`/features/*`** — `WebPage` + `FAQPage` (from `f.faq`) + `BreadcrumbList`.
- **`/use-cases/*`** — `WebPage` + `FAQPage` (from `u.faq`) + `BreadcrumbList`.
- **`/alternatives/*`** — `WebPage` (about: SoftwareApplication Reddix) + `BreadcrumbList`. Optional `ItemList` for the comparison rows.
- **`/alternatives` index** — `CollectionPage` + `BreadcrumbList`.
- **`/glossary` index** — `CollectionPage` + `BreadcrumbList` + `DefinedTermSet`.
- **`/glossary/*`** — `DefinedTerm` + `BreadcrumbList`.
- **`/terms`, `/refund-policy`** — `WebPage` + `BreadcrumbList`.

Every JSON-LD object includes:
```json
"datePublished": "2026-06-07",
"dateModified": "<build-date>"
```
Build date = `new Date().toISOString().slice(0,10)`, computed once at the top of `prerender.ts`.

Visible date line appended inside the prerendered `<main>`:
```html
<p><time datetime="2026-06-07" itemprop="dateModified">Last updated: June 7, 2026</time></p>
```

### 2. `index.html` — add a baseline JSON-LD for the SPA shell
Inline `Organization` + `WebSite` JSON-LD so even non-prerendered routes (and the shell before prerender runs) carry structured data. Include `dateModified`.

### 3. Keep
- `src/pages/Index.tsx` JSON-LD stays (hydrates for SPA navigation); prerender just adds the static copy.
- `scripts/seo-routes.ts` and `generate-sitemap.ts` need no changes — sitemap `<lastmod>` is already there.

## Technical detail
- Helper `buildJsonLd(route)` returns an array of schema objects → wrapped as `{"@context":"https://schema.org","@graph":[...]}` → one `<script>` tag injected via regex `out.replace('</head>', `${tag}\n</head>`)`.
- Breadcrumbs derived from `route.path` segments.
- All URLs absolute with `BASE_URL`.
- Date strings ISO `YYYY-MM-DD`.

## Verification
After build, spot-check `dist/features/<slug>/index.html` and `dist/alternatives/<slug>/index.html` for the JSON-LD `<script>` and visible `<time>` element. Validate with Google's Rich Results Test on one URL of each type after deploy.
