// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml from the shared route registry, the blog's
// public/rss.xml, and the Blog section of public/llms.txt.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { BASE_URL, getRoutes } from "./seo-routes";
import { readLivePosts } from "./blog-files";

const routes = getRoutes();
const today = new Date().toISOString().slice(0, 10);

const urls = routes
  .map((r) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${r.path}</loc>`,
      `    <lastmod>${r.lastmod ?? today}</lastmod>`,
      r.changefreq ? `    <changefreq>${r.changefreq}</changefreq>` : null,
      r.priority ? `    <priority>${r.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${routes.length} entries)`);

// ── Blog: RSS feed and llms.txt ──────────────────────────────────────
const posts = readLivePosts();
const xmlEsc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

const rss = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  "  <channel>",
  "    <title>Reddix Blog</title>",
  `    <link>${BASE_URL}/blog</link>`,
  `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
  "    <description>Practical, sourced playbooks for finding customers on Reddit.</description>",
  "    <language>en</language>",
  posts.length ? `    <lastBuildDate>${rfc822(posts[0].updated)}</lastBuildDate>` : null,
  ...posts.map((p) =>
    [
      "    <item>",
      `      <title>${xmlEsc(p.title)}</title>`,
      `      <link>${BASE_URL}/blog/${p.slug}</link>`,
      `      <guid isPermaLink="true">${BASE_URL}/blog/${p.slug}</guid>`,
      `      <pubDate>${rfc822(p.date)}</pubDate>`,
      `      <description>${xmlEsc(p.excerpt)}</description>`,
      ...p.tags.map((t) => `      <category>${xmlEsc(t)}</category>`),
      "    </item>",
    ].join("\n"),
  ),
  "  </channel>",
  "</rss>",
  "",
]
  .filter((l) => l !== null)
  .join("\n");
writeFileSync(resolve("public/rss.xml"), rss);
console.log(`rss.xml written (${posts.length} posts)`);

// The Blog section of llms.txt is rebuilt from the posts on every run; the
// rest of the file is hand-written and left alone.
const llmsPath = resolve("public/llms.txt");
const llms = readFileSync(llmsPath, "utf8").replace(/\n## Blog\n[\s\S]*?(?=\n## )/, "\n");
const blogSection = [
  "## Blog",
  "",
  `- [Reddix Blog](${BASE_URL}/blog): Playbooks for finding customers on Reddit without getting banned`,
  ...posts.map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.excerpt}`),
  "",
].join("\n");
// Collapse runs of blank lines so rebuilding never grows the file.
writeFileSync(llmsPath, llms.replace(/\n## Legal\n/, `\n${blogSection}\n## Legal\n`).replace(/\n{3,}/g, "\n\n"));
console.log("llms.txt Blog section updated");
