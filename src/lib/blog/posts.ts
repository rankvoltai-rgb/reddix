/**
 * Turns post files into posts, and the queries every page shares. Pure: the
 * app feeds it files through Vite (src/lib/blog/index.ts) and the build
 * scripts through the file system (scripts/blog-files.ts), so both see the
 * same posts.
 */
import { markdownToBlocks, parseFrontmatter } from './markdown';
import { countWords, readingMinutes } from './outline';
import type { PostFull, PostMeta } from './types';

export const SITE_URL = 'https://reddix.info';
export const DEFAULT_AUTHOR = 'Reddix Team';

/** "src/content/blog/find-customers-on-reddit.md" -> "find-customers-on-reddit" */
export function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

export function parsePost(slug: string, raw: string): PostFull {
  const { data, body } = parseFrontmatter(raw);
  const blocks = markdownToBlocks(body, slug);
  const wordCount = countWords(blocks);
  const date = data.date || '1970-01-01';
  return {
    slug,
    title: data.title || slug,
    excerpt: data.description || '',
    keyword: data.keyword || '',
    date,
    updated: data.updated || date,
    author: data.author || DEFAULT_AUTHOR,
    tags: (data.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    cover: data.cover || null,
    featured: data.featured === 'true',
    readingMinutes: readingMinutes(wordCount),
    wordCount,
    body,
    blocks,
  };
}

export function toMeta(post: PostFull): PostMeta {
  const { body, blocks, ...meta } = post;
  return meta;
}

/** Today in UTC, as YYYY-MM-DD. */
export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** A post goes live on its date (00:00 UTC). Previews show every post. */
export function isLive(post: Pick<PostMeta, 'date'>, today = todayUTC(), preview = false): boolean {
  return preview || post.date <= today;
}

/** Newest first; ties broken by title so the order never shuffles. */
export function sortPosts<T extends PostMeta>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/** Up to `limit` other posts, those sharing the most topics first, then newest. */
export function relatedPosts(post: PostMeta, posts: PostMeta[], limit = 3): PostMeta[] {
  const topics = new Set(post.tags);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p, i) => ({ p, i, shared: p.tags.filter((t) => topics.has(t)).length }))
    .sort((a, b) => b.shared - a.shared || a.i - b.i)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Every topic and how many posts carry it, most used first. */
export function topicCounts(posts: PostMeta[]): { topic: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
