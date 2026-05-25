// Runs after `vite build` (postbuild hook).
// For each public route, writes dist/<route>/index.html with a unique
// <title>, meta description, canonical, og:*, twitter:*, and a server-
// rendered <h1> + lead paragraph baked into the body. The SPA still
// hydrates normally on top; this only changes the initial HTML so
// Googlebot, social crawlers, and LLM bots see unique content per URL.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { BASE_URL, getRoutes } from "./seo-routes";

const DIST = resolve("dist");
const SHELL = readFileSync(resolve(DIST, "index.html"), "utf8");

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string) {
  return escapeHtml(s);
}

function renderRoute(html: string, route: ReturnType<typeof getRoutes>[number]) {
  const url = `${BASE_URL}${route.path}`;
  const title = escapeAttr(route.title);
  const desc = escapeAttr(route.description);

  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // meta name="description"
  out = out.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${desc}">`,
  );

  // canonical
  out = out.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${url}" />`,
  );

  // og:url
  out = out.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${url}" />`,
  );
  // og:title
  out = out.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${title}">`,
  );
  // og:description
  out = out.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${desc}">`,
  );
  // twitter:title
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${title}">`,
  );
  // twitter:description
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${desc}">`,
  );

  // Replace the static fallback <main hidden> block inside #root with a
  // per-route H1 + lead so crawlers see unique body content.
  const fallback = `
      <main hidden aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.lead)}</p>
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
  // "/" is already served by dist/index.html — rewrite it in place too
  // so the home page gets the freshened title/desc/canonical.
  const outPath =
    route.path === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, route.path.replace(/^\//, ""), "index.html");

  const dir = dirname(outPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const html = renderRoute(SHELL, route);
  writeFileSync(outPath, html);
  written++;
}

console.log(`prerender: wrote ${written} HTML files into dist/`);
