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
import { BASE_URL, getRoutes, type SeoRoute } from "./seo-routes";
import { features } from "../src/lib/features";
import { useCases } from "../src/lib/useCases";
import { competitors } from "../src/lib/alternatives";
import { glossaryTerms } from "../src/lib/glossary";

const DIST = resolve("dist");
const SHELL = readFileSync(resolve(DIST, "index.html"), "utf8");

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  const f = features.find((x) => x.slug === slug);
  if (!f) return "";
  const benefits = f.benefits
    .map((b) => `<li><strong>${esc(b.title)}</strong> — ${esc(b.desc)}</li>`)
    .join("");
  const useCasesHtml = f.useCases
    .map(
      (u) =>
        `<li><strong>${esc(u.persona)}:</strong> ${esc(u.scenario)} <em>Outcome:</em> ${esc(u.outcome)}</li>`,
    )
    .join("");
  const faq = f.faq
    .map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`)
    .join("");
  const stats = f.demoStats.map((s) => `<li>${esc(s.label)}: ${esc(s.value)}</li>`).join("");
  return `
    <section><h2>${esc(f.demoHeadline)}</h2><p>${esc(f.demoDescription)}</p>
      <ul>${stats}</ul></section>
    <section><h2>Key benefits</h2><ul>${benefits}</ul></section>
    <section><h2>Who it's for</h2><ul>${useCasesHtml}</ul></section>
    <section><h2>Frequently asked questions</h2><dl>${faq}</dl></section>
  `;
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
  const c = competitors.find((x) => x.slug === slug);
  if (!c) return "";
  const wins = c.whyReddixWins.map((w) => `<li>${esc(w)}</li>`).join("");
  const rows = c.features
    .map(
      (row) =>
        `<tr><td>${esc(row.name)}</td><td>${esc(String(row.competitor))}</td><td>${esc(String(row.reddix))}</td></tr>`,
    )
    .join("");
  return `
    <section><h2>About ${esc(c.name)}</h2><p>${esc(c.description)}</p>
      <p><strong>Weakness:</strong> ${esc(c.weakness)}</p></section>
    <section><h2>Why teams choose Reddix over ${esc(c.name)}</h2><ul>${wins}</ul></section>
    <section><h2>Feature comparison</h2>
      <table><thead><tr><th>Feature</th><th>${esc(c.name)}</th><th>Reddix</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </section>
    <section><h2>Verdict</h2>
      <p><strong>${esc(c.name)}:</strong> ${esc(c.verdict.competitor)}</p>
      <p><strong>Reddix:</strong> ${esc(c.verdict.reddix)}</p>
    </section>
  `;
}

function alternativesIndexBody(): string {
  const items = competitors
    .map(
      (c) =>
        `<li><a href="/alternatives/${c.slug}"><strong>Reddix vs ${esc(c.name)}</strong></a> — ${esc(c.tagline)}. ${esc(c.description)}</li>`,
    )
    .join("");
  return `<section><h2>Every major Reddit lead-gen tool, compared</h2><ul>${items}</ul></section>`;
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
  if (p === "/alternatives") return alternativesIndexBody();
  if (p === "/glossary") return glossaryIndexBody();
  if (p === "/terms" || p === "/refund-policy") return staticBody(p);
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

  // Bake full visible content into #root so raw-HTML crawlers (LLMs,
  // social previews, Googlebot first pass) see real content. React
  // replaces this on hydration. Kept in a non-hidden <main> so AI
  // crawlers don't discount it as cloaked / hidden content.
  const body = buildBody(route);
  const fallback = `
      <main data-prerendered="true">
        <h1>${esc(route.h1)}</h1>
        <p>${esc(route.lead)}</p>
        ${body}
        <nav aria-label="Site"><ul>
          <li><a href="/">Home</a></li>
          <li><a href="/alternatives">Alternatives</a></li>
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

console.log(`prerender: wrote ${written} HTML files into dist/`);
