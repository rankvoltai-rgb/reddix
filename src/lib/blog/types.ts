/**
 * The blog's data model. Posts are markdown files in src/content/blog; the
 * markdown is turned into blocks (src/lib/blog/markdown.ts) so one renderer,
 * one table of contents and one FAQ extractor serve every post.
 */

export interface RichTextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  href?: string | null;
}

export interface Block {
  id: string;
  /** paragraph, heading_1..3, bulleted_list_item, numbered_list_item, quote,
   *  callout, code, table, image, divider. */
  type: string;
  richText?: RichTextSpan[];
  /** code: the fence's language. callout: tip, note, warning or important. */
  language?: string;
  /** image: its src. */
  url?: string;
  /** image: alt text. */
  alt?: string;
  caption?: RichTextSpan[];
  children?: Block[];
  /** table: every row's cells, header row first. */
  rows?: RichTextSpan[][][];
}

export interface PostMeta {
  slug: string;
  title: string;
  /** The meta description, shown under the title and on cards. */
  excerpt: string;
  /** The search query the post is written to rank for. */
  keyword: string;
  /** Publish date, YYYY-MM-DD. A date in the future schedules the post. */
  date: string;
  /** Last substantive revision, YYYY-MM-DD. */
  updated: string;
  author: string;
  tags: string[];
  /** An image path for the cover; without one, a cover is generated. */
  cover: string | null;
  /** Pinned as the blog's lead story. */
  featured: boolean;
  readingMinutes: number;
  wordCount: number;
}

export interface PostFull extends PostMeta {
  /** The markdown body, without frontmatter. */
  body: string;
  blocks: Block[];
}
