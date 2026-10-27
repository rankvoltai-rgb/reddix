// The blog's posts for the build scripts (sitemap, prerender, checker),
// read from src/content/blog with the same parser the app uses.

import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { isLive, parsePost, sortPosts } from "../src/lib/blog/posts";
import type { PostFull } from "../src/lib/blog/types";

export const BLOG_DIR = resolve("src/content/blog");

export function readAllPosts(): PostFull[] {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return sortPosts(files.map((f) => parsePost(f.replace(/\.md$/, ""), readFileSync(resolve(BLOG_DIR, f), "utf8"))));
}

/** Posts whose date has come: the ones a build publishes. */
export function readLivePosts(): PostFull[] {
  return readAllPosts().filter((p) => isLive(p));
}
