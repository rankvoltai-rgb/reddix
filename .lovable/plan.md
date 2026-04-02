

## SEO-Optimized Sitemap — `public/sitemap.xml`

### What we're building

A comprehensive, auto-generated `sitemap.xml` placed in `public/` that covers every public route. We'll also update `robots.txt` to reference it, and add an `llms.txt` file for LLM discoverability.

### Files

| File | Purpose |
|---|---|
| `public/sitemap.xml` | Full sitemap with all ~130 URLs, priorities, and changefreqs |
| `public/robots.txt` | Updated to include `Sitemap:` directive |
| `public/llms.txt` | LLM-friendly site description with page index |

### Sitemap structure

All URLs under `https://reddix.lovable.app` with appropriate `<priority>` and `<changefreq>`:

| Section | URLs | Priority | Changefreq |
|---|---|---|---|
| Homepage `/` | 1 | 1.0 | weekly |
| Features `/features/:slug` | 9 | 0.8 | monthly |
| Use Cases `/use-cases/:slug` | 8 | 0.8 | monthly |
| Alternatives `/alternatives` + `/alternatives/:slug` | 1 + 7 = 8 | 0.7 | monthly |
| Glossary `/glossary` + `/glossary/:slug` | 1 + ~95 = ~96 | 0.6 | monthly |
| Legal `/terms`, `/refund-policy` | 2 | 0.3 | yearly |

Auth, dashboard, scanner, settings, onboarding routes are excluded (private/app pages).

### robots.txt update

```
Sitemap: https://reddix.lovable.app/sitemap.xml
```

Plus keep existing allow rules and add `Disallow` for private app routes (`/auth`, `/dashboard`, `/scanner`, `/leads`, `/settings`, `/onboarding`).

### llms.txt

A plaintext file following the emerging `llms.txt` convention — describes what Reddix is, lists all public pages with titles and URLs, and provides context for AI crawlers.

### Technical notes

- Static XML file in `public/` — no build step needed, Vite serves it as-is
- All glossary slugs, feature slugs, use case slugs, and alternative slugs pulled from the data files to ensure completeness
- `<lastmod>` set to current date

