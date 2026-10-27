// Feature pages with a design of their own live in
// src/sublanding/features/<slug>/. Each exports its words from content.ts and
// its crawler HTML from crawler.ts; this finds them so the sitemap and
// prerender pick a new page up without being edited.

import { existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

export interface Sublanding {
  META: { title: string; description: string };
  HERO: { h1: string; answer: string };
  FAQ: { q: string; a: string }[];
  crawlerBody: (esc: (s: string) => string) => string;
}

const ROOT = resolve("src/sublanding/features");

export const SUBLANDING: Record<string, Sublanding> = Object.fromEntries(
  await Promise.all(
    (existsSync(ROOT) ? readdirSync(ROOT) : [])
      .filter((slug) => existsSync(resolve(ROOT, slug, "content.ts")) && existsSync(resolve(ROOT, slug, "crawler.ts")))
      .map(async (slug) => {
        const content = await import(pathToFileURL(resolve(ROOT, slug, "content.ts")).href);
        const { crawlerBody } = await import(pathToFileURL(resolve(ROOT, slug, "crawler.ts")).href);
        return [slug, { META: content.META, HERO: content.HERO, FAQ: content.FAQ, crawlerBody }] as const;
      }),
  ),
);
