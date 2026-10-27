/**
 * The blog's posts, for the app: every markdown file in src/content/blog,
 * bundled at build time. A post dated in the future stays hidden until its
 * day, except on the dev server, so it can be read before it goes live.
 */
import { isLive, parsePost, slugFromPath, sortPosts, toMeta } from './posts';
import type { PostFull, PostMeta } from './types';

const FILES = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

const ALL: PostFull[] = sortPosts(Object.entries(FILES).map(([path, raw]) => parsePost(slugFromPath(path), raw)));

function live(): PostFull[] {
  return ALL.filter((p) => isLive(p, undefined, import.meta.env.DEV));
}

export function listPosts(): PostMeta[] {
  return live().map(toMeta);
}

export function getPost(slug: string): PostFull | null {
  return live().find((p) => p.slug === slug) ?? null;
}

export * from './posts';
export * from './outline';
export type * from './types';
