# Sitemap Deep Analysis

## Technical health check — everything passes

- `https://reddix.info/sitemap.xml` returns **HTTP 200**, `content-type: text/xml`, 130 `<loc>` entries, valid XML.
- `https://reddix.info/robots.txt` returns 200 and correctly declares `Sitemap: https://reddix.info/sitemap.xml`.
- Disallow rules don't block any URL listed in the sitemap.
- Every sampled URL (`/features/intent-detection`, `/glossary/karma`, etc.) returns HTTP 200.

So the sitemap **is** being fetched. The real problem is what Google sees *after* it follows those URLs.

## The actual root cause: all 130 URLs serve identical HTML

This is a Vite SPA. The server returns the same `index.html` shell for every route, and meta tags are only updated client-side via `usePageMeta` (React `useEffect`).

Proof — raw HTML (no JS executed) for three different URLs:

```text
/                            /features/intent-detection      /glossary/karma
<title>Reddix | AI Reddit…   <title>Reddix | AI Reddit…      <title>Reddix | AI Reddit…
<meta description …same      …same                            …same
<link canonical → /          <link canonical → /              <link canonical → /
<h1>Reddix — AI Reddit…      <h1>Reddix — AI Reddit…          <h1>Reddix — AI Reddit…
```

Every entry in the sitemap appears to Google as:

1. **The same title and meta description** as the homepage.
2. **A `<link rel="canonical">` pointing back to `https://reddix.info/`** — you're literally telling Google "this page is a duplicate of the homepage, don't index it."
3. **The same H1 and body content** in the initial HTML.

Result in Search Console: pages get classified as
- "Discovered – currently not indexed", or
- "Duplicate, Google chose different canonical than user", or
- "Alternate page with proper canonical tag"

…which from your side looks exactly like "Google is ignoring my sitemap."

Googlebot *can* render JS, but (a) it does so on a delayed second pass, (b) it gives strong weight to the initial HTML signals, and (c) when the initial canonical points to `/`, the rendered version rarely overrides it.

## Secondary issues

- `lastmod` is hardcoded to `2026-04-02` on every URL. Not fatal, but signals a stale, machine-generated sitemap.
- No `og:image` per page, no JSON-LD per page — weak signals for unique content.
- Sitemap is a static hand-edited `public/sitemap.xml` — easy to drift out of sync with routes.

## Fix plan (for the next build-mode turn)

The sitemap itself doesn't need to change. We need to make each URL look like a real, unique page in the **initial HTML response**, not just after React mounts.

Two paths:

### Option A — Prerender static HTML at build time (recommended)
Use `vite-plugin-prerender` or `react-snap` to crawl the known routes during `vite build` and write a real `dist/features/intent-detection/index.html` (etc.) with the correct title, description, canonical, H1, and content baked in. Lovable hosting will serve these directly; the SPA still hydrates afterward.

Pros: real SSR-quality HTML, zero runtime cost, fixes the duplicate-content problem completely.
Cons: build step grows; needs a route list (which we already have — it's the sitemap).

### Option B — Server-side meta injection via a lightweight edge worker
Less appropriate for Lovable's hosting model; only mention if Option A is rejected.

### Other fixes regardless of path
1. Auto-generate `sitemap.xml` from a route registry so `lastmod` and entries stay accurate (`scripts/generate-sitemap.ts` with a `prebuild` hook).
2. Remove the hardcoded `2026-04-02` lastmod; use the file's git mtime or build date.
3. Verify the domain in Google Search Console and submit the sitemap explicitly; check the Coverage report — it will confirm the "duplicate / canonical" diagnosis above.

## What to do now

Decide on Option A (prerender) vs leaving it as-is. If you greenlight A, I'll wire up the prerender step plus the auto-generated sitemap in build mode.
