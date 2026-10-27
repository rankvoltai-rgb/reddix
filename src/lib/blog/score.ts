/**
 * The SEO score a post must reach before it ships: Rankbox's eleven weighted
 * checks, plus the blueprint checks from docs/blog/writing-guide.md (title
 * length, Key Takeaways, a five-question FAQ, References). Run it with
 * `npm run blog:check`.
 */
import { blockText, faqEntries, outlineArticle, plainText } from './outline';
import type { Block, PostFull } from './types';

export type Status = 'pass' | 'warn' | 'fail';

export interface Check {
  label: string;
  weight: number;
  status: Status;
  detail: string;
}

export interface Score {
  score: number;
  checks: Check[];
  /** Blueprint checks: not weighted, but a post shouldn't ship failing one. */
  blueprint: Check[];
  words: number;
  readability: number;
}

function flatten(blocks: Block[]): Block[] {
  return blocks.flatMap((b) => [b, ...flatten(b.children ?? [])]);
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.replace(/e$/, '').match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

/** Flesch reading ease, limited to 0–100. */
function flesch(text: string): number {
  const ws = words(text);
  const sentences = Math.max(1, (text.match(/[.!?]+(\s|$)/g) ?? []).length);
  if (!ws.length) return 0;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  const score = 206.835 - 1.015 * (ws.length / sentences) - 84.6 * (syl / ws.length);
  return Math.round(Math.max(0, Math.min(100, score)));
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function check(label: string, weight: number, status: Status, detail: string): Check {
  return { label, weight, status, detail };
}

const POINTS: Record<Status, number> = { pass: 1, warn: 0.5, fail: 0 };

export function scorePost(post: PostFull): Score {
  const all = flatten(post.blocks);
  const bodyText = post.blocks.map(blockText).join(' ');
  const bodyWords = words(bodyText);
  const n = bodyWords.length;
  const kw = post.keyword.trim().toLowerCase();
  const checks: Check[] = [];

  // Keyword in title
  if (kw) {
    checks.push(
      post.title.toLowerCase().includes(kw)
        ? check('Keyword in title', 15, 'pass', `"${post.keyword}" appears in the title.`)
        : check('Keyword in title', 15, 'fail', `Add "${post.keyword}" to the title.`),
    );
  } else {
    checks.push(check('Focus keyword set', 15, 'fail', 'Add a `keyword:` to the frontmatter.'));
  }

  // Keyword in introduction (first 100 words)
  const first100 = bodyWords.slice(0, 100).join(' ').toLowerCase();
  if (kw)
    checks.push(
      first100.includes(kw)
        ? check('Keyword in introduction', 10, 'pass', 'Keyword appears in the first 100 words.')
        : check('Keyword in introduction', 10, 'warn', 'Mention the keyword early in the intro.'),
    );

  // Keyword density: exact-phrase, whole-word matches
  if (kw) {
    const matches = (bodyText.toLowerCase().match(new RegExp(`\\b${escapeRe(kw)}\\b`, 'g')) ?? []).length;
    const density = n ? Math.round((matches / n) * 10000) / 100 : 0;
    checks.push(
      density === 0
        ? check('Keyword density', 12, 'fail', 'Keyword does not appear in the body.')
        : density < 0.5
          ? check('Keyword density', 12, 'warn', `${density}% — use the keyword a bit more.`)
          : density > 2.5
            ? check('Keyword density', 12, 'warn', `${density}% — risk of keyword stuffing.`)
            : check('Keyword density', 12, 'pass', `${density}% — within the ideal range.`),
    );
  }

  // Depth
  checks.push(
    n >= 1500
      ? check('In-depth content', 15, 'pass', `${n} words — great depth for ranking.`)
      : n >= 800
        ? check('Content length', 15, 'warn', `${n} words — aim for 1,500+.`)
        : check('Content length', 15, 'fail', `${n} words — too short to rank well.`),
  );

  // Structure
  const h2 = post.blocks.filter((b) => b.type === 'heading_1').length;
  const h3 = post.blocks.filter((b) => b.type === 'heading_2').length;
  checks.push(
    h2 >= 3
      ? check('Clear section structure', 10, 'pass', `${h2} H2 sections.`)
      : h2 > 0
        ? check('Section structure', 10, 'warn', `Only ${h2} H2 — add more sections.`)
        : check('Section structure', 10, 'fail', 'Add H2 headings to structure the article.'),
  );
  checks.push(
    h3 >= 2
      ? check('Sub-headings', 5, 'pass', `${h3} H3 sub-headings.`)
      : check('Sub-headings', 5, 'warn', h3 ? '1 H3 sub-heading.' : 'Add H3s to break down sections.'),
  );

  // Lists
  const items = all.filter((b) => b.type === 'bulleted_list_item' || b.type === 'numbered_list_item').length;
  checks.push(
    items >= 3
      ? check('Scannable lists', 10, 'pass', `${items} list items.`)
      : items > 0
        ? check('Scannable lists', 10, 'warn', `${items} list items — add more.`)
        : check('Scannable lists', 10, 'fail', 'Add bullet or numbered lists.'),
  );

  // FAQ
  const questionHeadings = all.filter((b) => /^heading_/.test(b.type) && plainText(b.richText).trim().endsWith('?')).length;
  const hasFaq = /frequently asked|\bfaqs?\b/i.test(bodyText) || questionHeadings >= 2;
  checks.push(
    hasFaq
      ? check('FAQ for AI engines', 8, 'pass', 'FAQ section helps answer engines cite you.')
      : check('FAQ for AI engines', 8, 'warn', 'Add a FAQ section.'),
  );

  // Meta description
  const meta = post.excerpt.trim().length;
  checks.push(
    meta >= 120 && meta <= 160
      ? check('Meta description', 8, 'pass', `${meta} characters — ideal length.`)
      : meta
        ? check('Meta description', 8, 'warn', `${meta} characters — aim for 120–160.`)
        : check('Meta description', 8, 'fail', 'Write a `description:` in the frontmatter.'),
  );

  // Links
  const links = all.flatMap((b) => [...(b.richText ?? []), ...(b.rows ?? []).flat(2)]).filter((s) => s.href).length;
  checks.push(
    links >= 2
      ? check('Internal & external links', 7, 'pass', `${links} links.`)
      : links === 1
        ? check('Internal & external links', 7, 'warn', '1 link — add more.')
        : check('Internal & external links', 7, 'fail', 'Add links to relevant pages and sources.'),
  );

  // Readability
  const readability = flesch(bodyText);
  checks.push(
    readability >= 55
      ? check('Readability', 5, 'pass', `Flesch ${readability}.`)
      : readability >= 40
        ? check('Readability', 5, 'warn', `Flesch ${readability} — shorten sentences.`)
        : check('Readability', 5, 'fail', `Flesch ${readability} — hard to read.`),
  );

  const earned = checks.reduce((s, c) => s + c.weight * POINTS[c.status], 0);
  const possible = checks.reduce((s, c) => s + c.weight, 0);

  // Blueprint
  const outline = outlineArticle(post.blocks);
  const takeaways = outline.sections.find((s) => s.kind === 'takeaways');
  const takeawayItems = takeaways?.blocks.filter((b) => b.type.endsWith('list_item')).length ?? 0;
  const faq = outline.sections.find((s) => s.kind === 'faq');
  const faqCount = faq ? faqEntries(faq).entries.length : 0;
  const refs = outline.sections.find((s) => s.kind === 'references');
  const refCount = refs?.blocks.filter((b) => b.type.endsWith('list_item')).length ?? 0;
  const lead = outline.intro.find((b) => b.type === 'paragraph');
  const leadWords = lead ? words(plainText(lead.richText)).length : 0;
  const blueprint: Check[] = [
    post.title.length <= 60
      ? check('Title length', 0, 'pass', `${post.title.length} characters.`)
      : check('Title length', 0, 'warn', `${post.title.length} characters — keep it under 60.`),
    lead && leadWords <= 80
      ? check('Answer-first intro', 0, 'pass', `Opens with a ${leadWords}-word answer.`)
      : check('Answer-first intro', 0, 'warn', 'Open with a direct 2–3 sentence answer (under 80 words).'),
    takeawayItems >= 5 && takeawayItems <= 7
      ? check('Key Takeaways', 0, 'pass', `${takeawayItems} takeaways.`)
      : check('Key Takeaways', 0, 'fail', takeaways ? `${takeawayItems} takeaways — use 5 to 7.` : 'Add a "## Key Takeaways" section.'),
    faqCount === 5
      ? check('FAQ questions', 0, 'pass', '5 questions.')
      : check('FAQ questions', 0, 'fail', faq ? `${faqCount} questions — use exactly 5.` : 'Add a "## Frequently Asked Questions" section.'),
    refCount >= 3
      ? check('References', 0, 'pass', `${refCount} sources.`)
      : check('References', 0, 'fail', refs ? `${refCount} sources — cite at least 3.` : 'Add a "## References" section.'),
    post.tags.length >= 1 && post.tags.length <= 4
      ? check('Tags', 0, 'pass', post.tags.join(', '))
      : check('Tags', 0, 'warn', 'Use 1 to 4 tags.'),
  ];

  return { score: Math.round((earned / possible) * 100), checks, blueprint, words: n, readability };
}
