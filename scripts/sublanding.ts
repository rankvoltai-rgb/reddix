// Pages with a design of their own live in src/sublanding/<section>/<slug>/
// (features, alternatives). Each exports its words from content.ts and its
// crawler HTML from crawler.ts; this finds them so the sitemap and prerender
// pick a new page up without being edited.

import { existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

export interface Sublanding {
  META: { title: string; description: string };
  HERO: { h1: string; answer: string };
  FAQ: { q: string; a: string }[];
  crawlerBody: (esc: (s: string) => string) => string;
}

async function load(section: string): Promise<Record<string, Sublanding>> {
  const root = resolve("src/sublanding", section);
  const slugs = (existsSync(root) ? readdirSync(root) : []).filter(
    (slug) => existsSync(resolve(root, slug, "content.ts")) && existsSync(resolve(root, slug, "crawler.ts")),
  );
  return Object.fromEntries(
    await Promise.all(
      slugs.map(async (slug) => {
        const content = await import(pathToFileURL(resolve(root, slug, "content.ts")).href);
        const { crawlerBody } = await import(pathToFileURL(resolve(root, slug, "crawler.ts")).href);
        return [slug, { META: content.META, HERO: content.HERO, FAQ: content.FAQ, crawlerBody }] as const;
      }),
    ),
  );
}

/** /features/<slug> pages. */
export const SUBLANDING = await load("features");
/** /alternatives/<slug> pages; the index lives at alternatives/index. */
export const ALTERNATIVES = await load("alternatives");
