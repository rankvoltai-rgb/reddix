/**
 * Markdown -> the block model the blog renders.
 *
 * Heading levels shift up one: the page title is the only h1, so "##"
 * becomes heading_1 (rendered as <h2>), "###" heading_2, "####" heading_3.
 * A blockquote that opens with [!TIP], [!NOTE], [!WARNING] or [!IMPORTANT]
 * becomes a callout.
 *
 * Pure (no Vite, no DOM), so the build scripts parse posts exactly as the
 * page does.
 */
import { marked, type Token, type Tokens } from 'marked';
import type { Block, RichTextSpan } from './types';

export type Frontmatter = Record<string, string>;

/** Splits a leading `---` block of `key: value` lines from the body. */
export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i <= 0) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
  }
  return { data, body: raw.slice(match[0].length) };
}

type Marks = Pick<RichTextSpan, 'bold' | 'italic' | 'strikethrough' | 'code' | 'href'>;

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function inline(tokens: Token[] | undefined, marks: Marks = {}): RichTextSpan[] {
  const out: RichTextSpan[] = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case 'strong':
        out.push(...inline((t as Tokens.Strong).tokens, { ...marks, bold: true }));
        break;
      case 'em':
        out.push(...inline((t as Tokens.Em).tokens, { ...marks, italic: true }));
        break;
      case 'del':
        out.push(...inline((t as Tokens.Del).tokens, { ...marks, strikethrough: true }));
        break;
      case 'link':
        out.push(...inline((t as Tokens.Link).tokens, { ...marks, href: (t as Tokens.Link).href }));
        break;
      case 'codespan':
        out.push({ ...marks, text: decodeEntities((t as Tokens.Codespan).text), code: true });
        break;
      case 'br':
        out.push({ ...marks, text: '\n' });
        break;
      case 'text': {
        const text = t as Tokens.Text;
        if (text.tokens?.length) out.push(...inline(text.tokens, marks));
        else out.push({ ...marks, text: decodeEntities(text.text) });
        break;
      }
      case 'escape':
        out.push({ ...marks, text: (t as Tokens.Escape).text });
        break;
      default:
        if ('text' in t && typeof t.text === 'string') out.push({ ...marks, text: decodeEntities(t.text) });
    }
  }
  // Drop falsy marks so spans compare and serialize compactly.
  return out.map((s) => Object.fromEntries(Object.entries(s).filter(([, v]) => v)) as unknown as RichTextSpan);
}

const CALLOUT = /^\[!(TIP|NOTE|WARNING|IMPORTANT)\]\s*/i;

export function markdownToBlocks(markdown: string, idPrefix = 'md'): Block[] {
  let seq = 0;
  const id = () => `${idPrefix}-${++seq}`;

  function listItems(list: Tokens.List): Block[] {
    const type = list.ordered ? 'numbered_list_item' : 'bulleted_list_item';
    return list.items.map((item) => {
      const richText: RichTextSpan[] = [];
      const children: Block[] = [];
      for (const child of item.tokens) {
        if (child.type === 'text' || child.type === 'paragraph') {
          if (richText.length) richText.push({ text: ' ' });
          richText.push(...inline((child as Tokens.Text).tokens ?? [child]));
        } else {
          children.push(...convert([child]));
        }
      }
      return { id: id(), type, richText, ...(children.length ? { children } : {}) };
    });
  }

  function convert(tokens: Token[]): Block[] {
    const out: Block[] = [];
    for (const t of tokens) {
      switch (t.type) {
        case 'heading': {
          const h = t as Tokens.Heading;
          // A stray "#" title in the body is dropped: the page renders its own.
          if (h.depth === 1) break;
          out.push({ id: id(), type: `heading_${Math.min(3, h.depth - 1)}`, richText: inline(h.tokens) });
          break;
        }
        case 'paragraph': {
          const p = t as Tokens.Paragraph;
          const only = p.tokens.length === 1 ? p.tokens[0] : null;
          if (only?.type === 'image') {
            const img = only as Tokens.Image;
            out.push({
              id: id(),
              type: 'image',
              url: img.href,
              alt: img.text,
              caption: img.title ? [{ text: img.title }] : [],
            });
            break;
          }
          out.push({ id: id(), type: 'paragraph', richText: inline(p.tokens) });
          break;
        }
        case 'list':
          out.push(...listItems(t as Tokens.List));
          break;
        case 'blockquote': {
          const q = t as Tokens.Blockquote;
          const first = q.tokens[0] as Tokens.Paragraph | undefined;
          const kind = first?.type === 'paragraph' ? CALLOUT.exec(first.text) : null;
          if (kind && first) {
            // The marker sits at the start of the first paragraph's text.
            const lead = marked.lexer(first.text.replace(CALLOUT, ''))[0] as Tokens.Paragraph | undefined;
            const rest = q.tokens.slice(1).flatMap((child) => convert([child]));
            out.push({
              id: id(),
              type: 'callout',
              language: kind[1].toLowerCase(),
              richText: lead?.tokens ? inline(lead.tokens) : [],
              ...(rest.length ? { children: rest } : {}),
            });
            break;
          }
          const richText = q.tokens.flatMap((child, i) => [
            ...(i ? [{ text: '\n' }] : []),
            ...inline((child as Tokens.Paragraph).tokens ?? []),
          ]);
          out.push({ id: id(), type: 'quote', richText });
          break;
        }
        case 'code': {
          const c = t as Tokens.Code;
          out.push({ id: id(), type: 'code', language: c.lang || 'text', richText: [{ text: c.text }] });
          break;
        }
        case 'table': {
          const table = t as Tokens.Table;
          out.push({
            id: id(),
            type: 'table',
            rows: [
              table.header.map((cell) => inline(cell.tokens)),
              ...table.rows.map((row) => row.map((cell) => inline(cell.tokens))),
            ],
          });
          break;
        }
        case 'hr':
          out.push({ id: id(), type: 'divider' });
          break;
        default:
          break;
      }
    }
    return out;
  }

  return convert(marked.lexer(markdown));
}
