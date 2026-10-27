// Runs after `vite build` (postbuild hook).
// For each public route, writes dist/<route>/index.html with a unique
// <title>, meta description, canonical, og:*, twitter:*, AND a fully
// server-rendered body containing the actual page content (headings,
// paragraphs, lists, FAQ Q&A, comparison tables, glossary defs).
//
// This is critical for LLM/AI crawlers (ChatGPT, Perplexity, Claude,
// Googlebot) which predominantly read raw HTML and do NOT execute the
// SPA's JavaScript. The React app still hydrates normally and replaces
// this static content for human visitors.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { BASE_URL, PRIVATE_ROUTES, getRoutes, type SeoRoute } from "./seo-routes";
import { features } from "../src/lib/features";
import { ALTERNATIVES, SUBLANDING } from "./sublanding";
import { useCases } from "../src/lib/useCases";
import { competitors } from "../src/lib/alternatives";
import { glossaryTerms } from "../src/lib/glossary";
import { marked } from "marked";
import { readLivePosts } from "./blog-files";
import { faqForSchema } from "../src/lib/blog/outline";
import { formatDate } from "../src/lib/blog/posts";

const POSTS = readLivePosts();

/** The social preview for a path: a post's own image when it has one
 *  (scripts/og/render.ts), the blog's for the index, the default otherwise. */
function ogImageFor(path: string): string {
  const post = path.match(/^\/blog\/(.+)$/);
  if (post && existsSync(resolve("public/og/blog", `${post[1]}.jpg`))) return `${BASE_URL}/og/blog/${post[1]}.jpg`;
  if (path === "/blog") return `${BASE_URL}/og/blog.jpg`;
  return `${BASE_URL}/og/default.jpg`;
}
const postFor = (path: string) => {
  const m = path.match(/^\/blog\/(.+)$/);
  return m ? POSTS.find((p) => p.slug === m[1]) : undefined;
};

const DIST = resolve("dist");
const SHELL = readFileSync(resolve(DIST, "index.html"), "utf8");

const BUILD_DATE = new Date().toISOString().slice(0, 10);
const BUILD_DATE_HUMAN = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdSafe(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function breadcrumbsNode(path: string, title: string) {
  const parts = path.split("/").filter(Boolean);
  const items = [{ name: "Home", item: `${BASE_URL}/` }];
  let acc = "";
  parts.forEach((p, i) => {
    acc += `/${p}`;
    const isLast = i === parts.length - 1;
    const name = isLast
      ? title
      : p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ name, item: `${BASE_URL}${acc}` });
  });
  return {
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}${path}#breadcrumbs`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Reddix",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Reddix",
    description: "AI-powered Reddit lead intelligence platform.",
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en",
    datePublished: "2026-01-01",
    dateModified: BUILD_DATE,
  };
}

function webPageNode(route: SeoRoute) {
  return {
    "@type": "WebPage",
    "@id": `${BASE_URL}${route.path}#webpage`,
    url: `${BASE_URL}${route.path}`,
    name: route.title,
    description: route.description,
    inLanguage: "en",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    datePublished: "2026-01-01",
    dateModified: BUILD_DATE,
  };
}

function faqNode(faq: Array<{ q: string; a: string }>, id: string) {
  return {
    "@type": "FAQPage",
    "@id": id,
    datePublished: "2026-01-01",
    dateModified: BUILD_DATE,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function buildJsonLd(route: SeoRoute): string {
  const p = route.path;
  const graph: unknown[] = [organizationNode(), websiteNode()];

  if (p === "/") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#software`,
      name: "Reddix",
      url: BASE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: route.description,
      datePublished: "2026-01-01",
      dateModified: BUILD_DATE,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "45",
        highPrice: "150",
        offerCount: "2",
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
    });
  } else {
    graph.push(webPageNode(route));
    graph.push(breadcrumbsNode(p, route.h1));

    // Comparison pages with their own design carry their own FAQ.
    const own = p === "/alternatives" ? ALTERNATIVES.index : ALTERNATIVES[p.match(/^\/alternatives\/(.+)$/)?.[1] ?? ""];
    if (own?.FAQ.length) graph.push(faqNode(own.FAQ, `${BASE_URL}${p}#faq`));
    const fMatch = p.match(/^\/features\/(.+)$/);
    if (fMatch) {
      const faq = SUBLANDING[fMatch[1]]?.FAQ;
      if (faq?.length) graph.push(faqNode(faq, `${BASE_URL}${p}#faq`));
    }
    const uMatch = p.match(/^\/use-cases\/(.+)$/);
    if (uMatch) {
      const u = useCases.find((x) => x.slug === uMatch[1]);
      if (u?.faq?.length) graph.push(faqNode(u.faq, `${BASE_URL}${p}#faq`));
    }
    if (p === "/blog") {
      graph.push({
        "@type": "Blog",
        "@id": `${BASE_URL}/blog#blog`,
        name: "Reddix Blog",
        url: `${BASE_URL}/blog`,
        description: route.description,
        publisher: { "@id": `${BASE_URL}/#organization` },
        blogPost: POSTS.slice(0, 20).map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${BASE_URL}/blog/${post.slug}`,
          datePublished: post.date,
          dateModified: post.updated,
          description: post.excerpt,
        })),
      });
    }
    const post = postFor(p);
    if (post) {
      graph.push({
        "@type": "BlogPosting",
        "@id": `${BASE_URL}${p}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated,
        wordCount: post.wordCount,
        keywords: [post.keyword, ...post.tags].filter(Boolean).join(", "),
        articleSection: post.tags[0],
        inLanguage: "en",
        author: { "@type": "Organization", name: post.author, url: BASE_URL },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${BASE_URL}${p}#webpage` },
        isPartOf: { "@id": `${BASE_URL}/blog#blog` },
        ...(post.cover ? { image: `${BASE_URL}${post.cover}` } : {}),
      });
      const faq = faqForSchema(post.blocks);
      if (faq.length) graph.push(faqNode(faq, `${BASE_URL}${p}#faq`));
    }
    const gMatch = p.match(/^\/glossary\/(.+)$/);
    if (gMatch) {
      const g = glossaryTerms.find((x) => x.slug === gMatch[1]);
      if (g) {
        graph.push({
          "@type": "DefinedTerm",
          "@id": `${BASE_URL}${p}#term`,
          name: g.title,
          description: g.shortDef,
          inDefinedTermSet: `${BASE_URL}/glossary`,
          datePublished: "2026-01-01",
          dateModified: BUILD_DATE,
        });
      }
    }
  }

  return `<script type="application/ld+json">${jsonLdSafe({
    "@context": "https://schema.org",
    "@graph": graph,
  })}</script>`;
}

// ── Per-route-type body builders ─────────────────────────────────────

function homeBody(): string {
  const featureLinks = features
    .map(
      (f) =>
        `<li><a href="/features/${f.slug}"><strong>${esc(f.title)}</strong></a> — ${esc(f.tagline)}</li>`,
    )
    .join("");
  const useCaseLinks = useCases
    .map(
      (u) =>
        `<li><a href="/use-cases/${u.slug}"><strong>${esc(u.title)}</strong></a> — ${esc(u.tagline)}</li>`,
    )
    .join("");
  const compLinks = competitors
    .map((c) => `<li><a href="/alternatives/${c.slug}">Reddix vs ${esc(c.name)}</a></li>`)
    .join("");
  return `
    <section>
      <h2>What Reddix does</h2>
      <p>Reddix is an AI-powered Reddit lead intelligence platform. It scans Reddit on demand,
      scores buying intent on a 0–100 scale, and drafts natural, context-aware replies so SaaS
      founders, agencies, and growth teams can turn Reddit conversations into qualified leads.
      Manual scans only — no auto-posting and no background polling.</p>
    </section>
    <section>
      <h2>Features</h2>
      <ul>${featureLinks}</ul>
    </section>
    <section>
      <h2>Use cases</h2>
      <ul>${useCaseLinks}</ul>
    </section>
    <section>
      <h2>Alternatives & comparisons</h2>
      <ul>${compLinks}</ul>
    </section>
    <section>
      <h2>Pricing</h2>
      <p>Reddix is paid: $150 one-time Lifetime or $45/month Premium. Choose either after
      onboarding to unlock the scanner, lead CRM, and AI reply drafts.</p>
    </section>
  `;
}

function featureBody(slug: string): string {
  return SUBLANDING[slug]?.crawlerBody(esc) ?? "";
}

function useCaseBody(slug: string): string {
  const u = useCases.find((x) => x.slug === slug);
  if (!u) return "";
  const stats = u.stats.map((s) => `<li>${esc(s.label)}: ${esc(s.value)}</li>`).join("");
  const scenario = u.scenario
    .map((s, i) => `<li><strong>${i + 1}. ${esc(s.step)}</strong> — ${esc(s.detail)}</li>`)
    .join("");
  const benefits = u.benefits
    .map((b) => `<li><strong>${esc(b.title)}</strong> — ${esc(b.desc)}</li>`)
    .join("");
  const faq = u.faq
    .map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`)
    .join("");
  return `
    <section><h2>By the numbers</h2><ul>${stats}</ul></section>
    <section><h2>How it works</h2><ol>${scenario}</ol></section>
    <section><h2>Why it matters</h2><ul>${benefits}</ul></section>
    <section><h2>Testimonial</h2>
      <blockquote>“${esc(u.testimonial.quote)}” — <strong>${esc(u.testimonial.name)}</strong>, ${esc(u.testimonial.role)}</blockquote>
    </section>
    <section><h2>Frequently asked questions</h2><dl>${faq}</dl></section>
  `;
}

function alternativeBody(slug: string): string {
  return ALTERNATIVES[slug]?.crawlerBody(esc) ?? "";
}

function glossaryIndexBody(): string {
  const items = glossaryTerms
    .map(
      (g) =>
        `<li><a href="/glossary/${g.slug}"><strong>${esc(g.title)}</strong></a> (${esc(g.category)}) — ${esc(g.shortDef)}</li>`,
    )
    .join("");
  return `<section><h2>All terms</h2><ul>${items}</ul></section>`;
}

function glossaryTermBody(slug: string): string {
  const g = glossaryTerms.find((x) => x.slug === slug);
  if (!g) return "";
  const related = g.relatedTerms
    .map((rs) => {
      const r = glossaryTerms.find((t) => t.slug === rs);
      return r ? `<li><a href="/glossary/${r.slug}">${esc(r.title)}</a></li>` : "";
    })
    .filter(Boolean)
    .join("");
  return `
    <section><p><strong>Category:</strong> ${esc(g.category)}</p>
      <p><strong>${esc(g.shortDef)}</strong></p>
      <p>${esc(g.longDef)}</p></section>
    ${related ? `<section><h2>Related terms</h2><ul>${related}</ul></section>` : ""}
  `;
}

function blogIndexBody(): string {
  const items = POSTS.map(
    (p) =>
      `<li><a href="/blog/${p.slug}"><strong>${esc(p.title)}</strong></a> — ${esc(p.excerpt)} <time datetime="${p.date}">${formatDate(p.date)}</time></li>`,
  ).join("");
  return `<section><h2>Latest articles</h2><ul>${items}</ul></section>`;
}

// The whole article, rendered from its markdown, so crawlers that don't run
// JavaScript read exactly what visitors do.
function blogPostBody(path: string): string {
  const post = postFor(path);
  if (!post) return "";
  const byline = `<p>By ${esc(post.author)} · Published <time datetime="${post.date}">${formatDate(post.date)}</time>${
    post.updated !== post.date ? ` · Updated <time datetime="${post.updated}">${formatDate(post.updated)}</time>` : ""
  } · ${post.readingMinutes} min read</p>`;
  const html = marked.parse(post.body, { async: false, gfm: true }) as string;
  const tags = post.tags.map((t) => `<li>${esc(t)}</li>`).join("");
  return `${byline}<article>${html}</article>${tags ? `<ul aria-label="Topics">${tags}</ul>` : ""}<p><a href="/blog">More articles from the Reddix blog</a></p>`;
}

function staticBody(path: string): string {
  if (path === "/terms")
    return `<section><p>These terms of service govern use of Reddix.info. By using Reddix you agree to use the product lawfully, not to abuse the Reddit API through it, and to accept the all-sales-are-final refund policy. Full terms are available on this page once the app loads.</p></section>`;
  if (path === "/refund-policy")
    return `<section><h2>All sales are final</h2><p>Because Reddix grants immediate access to AI scanning, lead data, and reply generation on purchase, all payments — Lifetime and monthly — are final and non-refundable. Cancel a monthly subscription at any time to stop future charges; past charges are not refunded.</p></section>`;
  return "";
}

function buildBody(route: SeoRoute): string {
  const p = route.path;
  if (p === "/") return homeBody();
  if (p === "/alternatives") return ALTERNATIVES.index.crawlerBody(esc);
  if (p === "/glossary") return glossaryIndexBody();
  if (p === "/terms" || p === "/refund-policy") return staticBody(p);
  if (p === "/blog") return blogIndexBody();
  if (p.startsWith("/blog/")) return blogPostBody(p);
  const featureMatch = p.match(/^\/features\/(.+)$/);
  if (featureMatch) return featureBody(featureMatch[1]);
  const useCaseMatch = p.match(/^\/use-cases\/(.+)$/);
  if (useCaseMatch) return useCaseBody(useCaseMatch[1]);
  const altMatch = p.match(/^\/alternatives\/(.+)$/);
  if (altMatch) return alternativeBody(altMatch[1]);
  const glossMatch = p.match(/^\/glossary\/(.+)$/);
  if (glossMatch) return glossaryTermBody(glossMatch[1]);
  return "";
}

// ── HTML rewrite ─────────────────────────────────────────────────────

function renderRoute(html: string, route: SeoRoute) {
  const url = `${BASE_URL}${route.path}`;
  const title = esc(route.title);
  const desc = esc(route.description);

  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${desc}">`,
  );
  out = out.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${url}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${url}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${title}">`,
  );
  out = out.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${desc}">`,
  );
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${title}">`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${desc}">`,
  );

  const image = ogImageFor(route.path);
  out = out.replace(/<meta\s+property="og:image"\s[^>]*>/i, `<meta property="og:image" content="${image}" />`);
  out = out.replace(/<meta\s+name="twitter:image"\s[^>]*>/i, `<meta name="twitter:image" content="${image}" />`);

  const post = postFor(route.path);
  if (post) {
    out = out.replace(/<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="article" />`);
    const articleMeta = [
      `<meta property="article:published_time" content="${post.date}" />`,
      `<meta property="article:modified_time" content="${post.updated}" />`,
      ...post.tags.map((t) => `<meta property="article:tag" content="${esc(t)}" />`),
    ].join("\n    ");
    out = out.replace(/<\/head>/i, `    ${articleMeta}\n  </head>`);
  }

  // Bake full visible content into #root so raw-HTML crawlers (LLMs,
  // social previews, Googlebot first pass) see real content. React
  // replaces this on hydration. Kept in a non-hidden <main> so AI
  // crawlers don't discount it as cloaked / hidden content.
  const body = buildBody(route);
  const dateLine = post
    ? ""
    : `<p><time datetime="${route.lastmod ?? BUILD_DATE}" itemprop="dateModified">Last updated: ${
        route.lastmod ? formatDate(route.lastmod) : BUILD_DATE_HUMAN
      }</time></p>`;
  const fallback = `
      <main data-prerendered="true">
        <h1>${esc(route.h1)}</h1>
        <p>${esc(route.lead)}</p>
        ${dateLine}
        ${body}
        <nav aria-label="Site"><ul>
          <li><a href="/">Home</a></li>
          <li><a href="/alternatives">Alternatives</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/glossary">Glossary</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/refund-policy">Refund Policy</a></li>
        </ul></nav>
      </main>
    `;
  out = out.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<noscript>/i,
    `<div id="root">${fallback}</div>\n    <noscript>`,
  );

  // Inject per-route JSON-LD into <head>. Strip any pre-existing JSON-LD
  // from the shell first so we don't ship duplicates.
  out = out.replace(
    /<script\s+type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi,
    "",
  );
  const jsonLd = buildJsonLd(route);
  out = out.replace(/<\/head>/i, `  ${jsonLd}\n  </head>`);

  return out;
}

const routes = getRoutes();
let written = 0;

for (const route of routes) {
  const outPath =
    route.path === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, route.path.replace(/^\//, ""), "index.html");
  const dir = dirname(outPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outPath, renderRoute(SHELL, route));
  written++;
}

// App and account pages: their own title, noindex, and no canonical, so they
// never pass as copies of the homepage. The app replaces the body on load.
for (const { path, title } of PRIVATE_ROUTES) {
  let out = SHELL;
  const t = esc(title);
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  out = out.replace(/<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="noindex, nofollow">`);
  out = out.replace(/\s*<link\s+rel="canonical"[^>]*>/i, "");
  out = out.replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${BASE_URL}${path}" />`);
  out = out.replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${t}">`);
  out = out.replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${t}">`);
  out = out.replace(/<meta\s+property="og:image"\s[^>]*>/i, `<meta property="og:image" content="${BASE_URL}/og/default.jpg" />`);
  out = out.replace(/<meta\s+name="twitter:image"\s[^>]*>/i, `<meta name="twitter:image" content="${BASE_URL}/og/default.jpg" />`);
  out = out.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi, "");
  const dir = resolve(DIST, path.replace(/^\//, ""));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), out);
  written++;
}

console.log(`prerender: wrote ${written} HTML files into dist/`);
