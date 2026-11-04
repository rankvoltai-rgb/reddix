// The checks beyond the SEO score, carried over from Rankbox's post tests
// (src/content/ai-search-posts.test.ts, alternatives-posts.test.ts there).
//
// Roundups name real companies, so a price without a date, a competitor
// described as unable to do something, testing we didn't do, or a Reddix feature
// that doesn't ship fails here rather than in production. Posts must also not
// read as one template with the name swapped: Google's spam policies call "many
// pages generated for the primary purpose of manipulating search rankings"
// scaled content abuse, and a set of posts sharing structure and sentences looks
// like exactly that.
//
// A roundup sets `roundup: true` in its frontmatter, and `picks: N` when its
// title promises a number. `about: Name` is the tool a post is about.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { competitors } from "../src/lib/alternatives";
import { features } from "../src/lib/features";
import { glossaryTerms } from "../src/lib/glossary";
import { useCases } from "../src/lib/useCases";
import { parseFrontmatter } from "../src/lib/blog/markdown";
import { priceChartSlug, type PriceChartData } from "../src/lib/blog/price-chart";
import type { PostFull } from "../src/lib/blog/types";
import { BLOG_DIR } from "./blog-files";

export interface Finding {
  label: string;
  detail: string;
}

/** The markdown under one "## Heading", up to the next "## ". */
function section(body: string, heading: RegExp): string {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.startsWith("## ") && heading.test(l));
  if (start < 0) return "";
  const end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

/** Body text without link targets, code, or the References list (titles quote vendors). */
function prose(body: string): string {
  return body
    .replace(/\n## References[\s\S]*$/, "")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/`[^`]*`/g, "");
}

/* No first-party testing we didn't do, in any post. */
const NO_TESTING = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bin our (own )?test(s|ing)?\b/i,
  /\bour (own )?(data|benchmark|study)\b/i,
  /\bhands-on\b/i,
];

/* In a roundup, never "it can't" about a product: write what its site shows. */
const NO_CANT = [/\bcan(?:'|’)t\b/i, /\bcannot\b/i, /\black(s|ing)?\b/i, /\bis missing\b/i];

/* Things Reddix doesn't do, per docs/blog/content-roadmap.md. A sentence naming
   Reddix with one of these fails, unless it says Reddix doesn't. */
const OVERCLAIMS = [
  /real[- ]time/i,
  /24\/7/,
  /auto-?pilot/i,
  /in the background/i,
  /schedul(ed|es) scans?/i,
  /sends? (you )?(an? )?(alerts?|notifications?|digests?)/i,
  /unified inbox/i,
  /ban[- ]?(proof|safe)/i,
  /free plan/i,
  /guarantee/i,
  /multi-platform/i,
];
const DENIES = /\b(doesn(?:'|’)t|does not|don(?:'|’)t|not|no|never|without|none|only|isn(?:'|’)t|has no|won(?:'|’)t)\b/i;

function internalLinkProblems(post: PostFull, slugs: Set<string>): string[] {
  const known: Record<string, Set<string>> = {
    blog: slugs,
    features: new Set(features.map((f) => f.slug)),
    alternatives: new Set(competitors.map((c) => c.slug)),
    "use-cases": new Set(useCases.map((u) => u.slug)),
    glossary: new Set(glossaryTerms.map((g) => g.slug)),
  };
  const bad: string[] = [];
  // Links only: `![alt](/blog/shot.webp)` is an image, not a page.
  for (const m of post.body.matchAll(/(?<!!)\[[^\]]*\]\((\/[^)\s]*)/g)) {
    const path = m[1].split(/[?#]/)[0].replace(/\/$/, "");
    const [, section, slug] = path.split("/");
    if (slug && known[section] && !known[section].has(slug)) bad.push(path);
  }
  return [...new Set(bad)];
}

/** What's wrong with one post, on its own. */
export function postFindings(post: PostFull, slugs: Set<string>): Finding[] {
  const out: Finding[] = [];
  const raw = readFileSync(resolve(BLOG_DIR, `${post.slug}.md`), "utf8");
  const { data } = parseFrontmatter(raw);
  const text = prose(post.body);

  const links = internalLinkProblems(post, slugs);
  if (links.length) out.push({ label: "Internal links", detail: `No such page: ${links.join(", ")}` });

  for (const re of NO_TESTING) {
    const m = re.exec(text);
    if (m) out.push({ label: "Testing claims", detail: `"${m[0]}": we report what vendors publish, not tests we didn't run.` });
  }

  const sentences = text.split(/(?<=[.!?])\s+|\n+/);
  for (const s of sentences) {
    if (!/\bReddix\b/.test(s) || DENIES.test(s)) continue;
    for (const re of OVERCLAIMS) {
      if (re.test(s)) out.push({ label: "Reddix claim", detail: `Not true of the product: "${s.trim().slice(0, 110)}"` });
    }
  }

  if (data.roundup !== "true") return out;

  for (const re of NO_CANT) {
    const m = re.exec(text);
    if (m) {
      const around = text.slice(Math.max(0, m.index - 40), m.index + 30).replace(/\s+/g, " ");
      out.push({ label: "Never \"it can't\"", detail: `"…${around}…": write what its site shows instead.` });
    }
  }

  if (!/\bwe make Reddix\b/i.test(text.split(/^### 1\./m)[0])) {
    out.push({ label: "Disclosure", detail: 'Say "We make Reddix" before the list starts.' });
  }
  if (!/checked on [A-Z][a-z]+ \d{1,2}, 20\d\d/i.test(text)) {
    out.push({ label: "Dated prices", detail: 'Date the prices: "checked on November 3, 2026".' });
  }
  const refs = [...section(post.body, /^## References$/).matchAll(/^\d+\. \[[^\]]+\]\((https:\/\/[^)]+)\)/gm)];
  if (refs.length < 8) out.push({ label: "References", detail: `${refs.length} sources; a roundup lists at least 8.` });

  const picks = [...post.body.matchAll(/^### (\d+)\. /gm)].length;
  if (data.picks && picks !== Number(data.picks)) {
    out.push({ label: "Picks", detail: `The title promises ${data.picks}; the post numbers ${picks}.` });
  }
  if (picks && (picks < 4 || picks > 12)) out.push({ label: "Picks", detail: `${picks} picks; keep it to 4–12.` });

  if (post.wordCount > 4400) out.push({ label: "Length", detail: `${post.wordCount} words; a roundup stops at 4,400.` });

  const images = [...post.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]);
  const chart = images.map(priceChartSlug).find(Boolean);
  if (!chart) {
    out.push({ label: "Price chart", detail: `Add ![alt](figure:price-chart/${post.slug} "caption").` });
  } else {
    const file = resolve("src/content/price-charts", `${chart}.json`);
    if (!existsSync(file)) {
      out.push({ label: "Price chart", detail: `No data at src/content/price-charts/${chart}.json.` });
    } else {
      const data = JSON.parse(readFileSync(file, "utf8")) as PriceChartData;
      const missing = data.bars.map((b) => b.name).filter((n) => !post.body.includes(n));
      if (missing.length) out.push({ label: "Price chart", detail: `Charted but not in the post: ${missing.join(", ")}.` });
    }
  }
  const shot = images.find((i) => i.startsWith("/blog/"));
  if (!shot) {
    out.push({ label: "Pricing screenshot", detail: "Show the competitor's pricing page as captured the day prices were checked." });
  } else if (!existsSync(resolve("public", shot.slice(1)))) {
    out.push({ label: "Pricing screenshot", detail: `No file at public${shot}.` });
  }
  return out;
}

/* ---------- across posts ---------- */

/** Every run of eight words in a post's prose, for measuring overlap between two posts. */
function shingles(body: string): Set<string> {
  const text = prose(body)
    .split("\n")
    .filter((l) => !/^(#|\||!\[)/.test(l.trim()))
    .join(" ");
  const words = text.toLowerCase().match(/[a-z0-9$.,'%-]+/g) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + 8 <= words.length; i++) out.add(words.slice(i, i + 8).join(" "));
  return out;
}

function aboutOf(post: PostFull): string {
  const { data } = parseFrontmatter(readFileSync(resolve(BLOG_DIR, `${post.slug}.md`), "utf8"));
  return data.about || "\u0000";
}

/** Prose sentences with the post's own tool name swapped for "X". */
function templateSentences(post: PostFull): Set<string> {
  const name = aboutOf(post);
  const lines = prose(post.body)
    .split("\n")
    .filter((l) => l.trim() && !/^(#|\||!\[)/.test(l.trim()));
  return new Set(
    lines
      .join("\n")
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.replaceAll(name, "X").replace(/[*_]/g, "").replace(/\s+/g, " ").trim())
      .filter((s) => s.split(" ").length >= 8),
  );
}

/** A post's section headings, name-swapped and without numbers, minus the ones every article needs. */
function sectionHeadings(post: PostFull): Set<string> {
  const name = aboutOf(post);
  return new Set(
    [...post.body.matchAll(/^## (.+)$/gm)]
      .map((m) => m[1].replaceAll(name, "X").replace(/\d+/g, "N").toLowerCase().trim())
      .filter((h) => !/^(key takeaways|frequently asked questions|references)$/.test(h)),
  );
}

/** Where any two posts read too alike. */
export function acrossFindings(posts: PostFull[]): Finding[] {
  const out: Finding[] = [];
  const pairs = posts.flatMap((a, i) => posts.slice(i + 1).map((b) => [a, b] as const));

  const sets = new Map(posts.map((p) => [p.slug, shingles(p.body)]));
  for (const [a, b] of pairs) {
    const x = sets.get(a.slug)!;
    const y = sets.get(b.slug)!;
    let shared = 0;
    for (const s of x) if (y.has(s)) shared++;
    const pct = Math.round((shared / Math.max(1, Math.min(x.size, y.size))) * 1000) / 10;
    if (pct > 8) out.push({ label: "Shared wording", detail: `${a.slug} / ${b.slug}: ${pct}% of 8-word runs (limit 8%).` });
  }

  const seen = new Map<string, string[]>();
  for (const p of posts) for (const s of templateSentences(p)) seen.set(s, [...(seen.get(s) ?? []), p.slug]);
  for (const [s, slugs] of seen) {
    if (slugs.length >= 3) out.push({ label: "Name-swapped sentence", detail: `In ${slugs.length} posts: "${s.slice(0, 90)}"` });
  }

  const heads = new Map(posts.map((p) => [p.slug, sectionHeadings(p)]));
  for (const [a, b] of pairs) {
    const shared = [...heads.get(a.slug)!].filter((h) => heads.get(b.slug)!.has(h));
    if (shared.length > 2) out.push({ label: "Same structure", detail: `${a.slug} / ${b.slug} share: ${shared.join("; ")}` });
  }
  return out;
}
