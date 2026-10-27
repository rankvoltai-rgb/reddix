/**
 * Renders a post's blocks with the blog's reading typography.
 *
 * Heading anchors come from BlockContext, which ArticleBody fills from the
 * article outline, so the table of contents and the headings always agree.
 */
import { useContext, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Copy, Info, Lightbulb, Link2, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Block, RichTextSpan } from '@/lib/blog/types';
import { BlockContext } from './block-context';


/* ---------- inline rich text ---------- */

const LINK =
  'font-medium text-cta underline decoration-cta/30 decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-cta';

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  // Same-site paths route client-side; anything else opens in a new tab.
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link to={href} className={LINK}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} className={LINK}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

export function Rich({ spans }: { spans?: RichTextSpan[] }) {
  if (!spans?.length) return null;
  return (
    <>
      {spans.map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code)
          node = (
            <code className="rounded-md border border-ink/[0.08] bg-surface px-1.5 py-0.5 font-mono text-[0.84em] font-medium text-ink">
              {node}
            </code>
          );
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.italic) node = <em>{node}</em>;
        if (s.strikethrough) node = <s>{node}</s>;
        if (s.href) node = <InlineLink href={s.href}>{node}</InlineLink>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/* ---------- code ---------- */

function CodeBlock({ block }: { block: Block }) {
  const code = (block.richText ?? []).map((s) => s.text).join('');
  const [copied, setCopied] = useState(false);
  const language = block.language && block.language !== 'text' ? block.language : '';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0b]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#121417] px-4 py-2">
        <span className="font-mono text-[0.72rem] font-medium text-white/50">{language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.85rem] leading-7 text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------- table ---------- */

function Table({ block }: { block: Block }) {
  const rows = block.rows ?? [];
  if (!rows.length) return null;
  const [head, ...body] = rows;
  // A comparison table (empty corner cell, row labels down the side) gets its
  // last column lifted: that's the option the article argues for.
  const comparison = head.length >= 3 && !head[0].some((s) => s.text.trim());
  const last = head.length - 1;
  const lift = (col: number) => comparison && col === last;
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
        <thead>
          <tr className="border-b border-ink/[0.08] bg-surface/60">
            {head.map((cell, c) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground',
                  lift(c) && 'bg-cta-soft text-cta',
                )}
              >
                <Rich spans={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.06]">
          {body.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                    <Rich spans={cell} />
                  </th>
                ) : (
                  <td key={c} className={cn('px-4 py-3 align-top leading-relaxed text-ink/75', lift(c) && 'bg-cta-soft/50 font-medium text-ink')}>
                    <Rich spans={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- callouts ---------- */

const CALLOUTS = {
  tip: { icon: Lightbulb, label: 'Tip', box: 'border-emerald-500/25 bg-emerald-500/[0.05]', tone: 'text-emerald-700' },
  note: { icon: Info, label: 'Note', box: 'border-sky-500/25 bg-sky-500/[0.05]', tone: 'text-sky-700' },
  warning: { icon: AlertTriangle, label: 'Warning', box: 'border-amber-500/30 bg-amber-500/[0.06]', tone: 'text-amber-700' },
  important: { icon: Megaphone, label: 'Important', box: 'border-cta/25 bg-cta-soft/60', tone: 'text-cta' },
} as const;

function Callout({ block }: { block: Block }) {
  const c = CALLOUTS[(block.language as keyof typeof CALLOUTS) ?? 'note'] ?? CALLOUTS.note;
  return (
    <aside className={cn('my-8 rounded-xl border p-5', c.box)}>
      <p className={cn('flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em]', c.tone)}>
        <c.icon className="h-3.5 w-3.5" />
        {c.label}
      </p>
      <div className="mt-2 text-[1rem] leading-relaxed text-ink/85 [&>p]:mt-3">
        <Rich spans={block.richText} />
        {block.children && <Blocks blocks={block.children} />}
      </div>
    </aside>
  );
}

/* ---------- headings ---------- */

function Heading({ block }: { block: Block }) {
  const { anchors } = useContext(BlockContext);
  const id = anchors.get(block.id);
  const Tag = block.type === 'heading_1' ? 'h2' : block.type === 'heading_2' ? 'h3' : 'h4';
  const size = {
    h2: 'mt-16 text-[1.6rem] font-[700] leading-tight sm:text-[1.9rem]',
    h3: 'mt-11 text-[1.25rem] font-semibold leading-snug sm:text-[1.35rem]',
    h4: 'mt-8 text-[1.05rem] font-semibold leading-snug',
  }[Tag];
  return (
    <Tag id={id} className={cn('group relative scroll-mt-28 tracking-tight text-ink', size)}>
      <Rich spans={block.richText} />
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 inline-flex translate-y-[-0.1em] align-middle text-transparent transition-colors hover:!text-cta focus-visible:text-cta group-hover:text-muted-foreground"
        >
          <Link2 className="h-[0.7em] w-[0.7em]" />
        </a>
      )}
    </Tag>
  );
}

/* ---------- blocks ---------- */

export const PARAGRAPH = 'mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]';

function ListItems({ items, ordered }: { items: Block[]; ordered: boolean }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={cn(
        'mt-6 space-y-2.5 pl-6 text-[1.0625rem] leading-[1.75] text-ink/80 marker:text-cta sm:text-[1.125rem]',
        ordered ? 'list-decimal marker:font-semibold' : 'list-disc',
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="pl-1.5">
          <Rich spans={item.richText} />
          {item.children && (
            <div className="[&>ol]:mt-2.5 [&>ul]:mt-2.5">
              <Blocks blocks={item.children} />
            </div>
          )}
        </li>
      ))}
    </Tag>
  );
}

function SingleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      if (!block.richText?.length) return null;
      return (
        <p className={PARAGRAPH}>
          <Rich spans={block.richText} />
        </p>
      );
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <Heading block={block} />;
    case 'quote':
      return (
        <blockquote className="my-10 border-l-[3px] border-cta pl-6 text-[1.3rem] font-medium leading-snug tracking-tight text-ink sm:text-[1.45rem]">
          <Rich spans={block.richText} />
        </blockquote>
      );
    case 'callout':
      return <Callout block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'table':
      return <Table block={block} />;
    case 'image':
      return (
        <figure className="my-10">
          <img src={block.url} alt={block.alt ?? ''} loading="lazy" className="w-full rounded-xl border border-ink/[0.08]" />
          {block.caption?.length ? (
            <figcaption className="mt-3 text-center text-[0.8rem] text-muted-foreground">
              <Rich spans={block.caption} />
            </figcaption>
          ) : null}
        </figure>
      );
    case 'divider':
      return <hr className="my-12 border-ink/[0.08]" />;
    default:
      return null;
  }
}

/** Blocks in order, with consecutive list items gathered into one list. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
      const run: Block[] = [];
      while (i < blocks.length && blocks[i].type === b.type) run.push(blocks[i++]);
      i--;
      out.push(<ListItems key={b.id} items={run} ordered={b.type === 'numbered_list_item'} />);
    } else {
      out.push(<SingleBlock key={b.id} block={b} />);
    }
  }
  return <>{out}</>;
}
