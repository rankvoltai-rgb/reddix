/**
 * An article's text, laid out by section.
 *
 * Posts written to the guide (docs/blog/writing-guide.md) share a shape: a
 * two-to-three sentence answer up top, Key Takeaways, body sections, an FAQ,
 * and References. Each gets its own treatment, because each is what an answer
 * engine — and a skimming reader — looks for. Anything else renders as
 * ordinary body copy, so free-form posts read fine too.
 */
import { useContext, useMemo } from 'react';
import { Check, Zap } from 'lucide-react';
import { Blocks, Rich } from './Blocks';
import { BlockContext } from './block-context';
import { ShareButtons } from './ArticleChrome';
import { faqEntries, plainText, type ArticleOutline, type ArticleSection } from '@/lib/blog/outline';
import type { Block } from '@/lib/blog/types';

interface Share {
  url: string;
  title: string;
}

/* ---------- intro ---------- */

function Intro({ blocks, answerFirst }: { blocks: Block[]; answerFirst: boolean }) {
  const leadIndex = blocks.findIndex((b) => b.type === 'paragraph' && b.richText?.length);
  if (leadIndex < 0) return <Blocks blocks={blocks} />;
  const lead = blocks[leadIndex];
  return (
    <>
      <Blocks blocks={blocks.slice(0, leadIndex)} />
      {answerFirst ? (
        <div className="relative overflow-hidden rounded-xl border border-cta/20 bg-cta-soft/40 p-6 sm:p-7">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cta" aria-hidden />
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cta">
            <Zap className="h-3.5 w-3.5 fill-current" />
            The short answer
          </p>
          <p className="mt-3 text-[1.125rem] font-medium leading-[1.7] text-ink sm:text-[1.2rem]">
            <Rich spans={lead.richText} />
          </p>
        </div>
      ) : (
        <p className="text-[1.2rem] leading-[1.7] text-ink sm:text-[1.3rem]">
          <Rich spans={lead.richText} />
        </p>
      )}
      <Blocks blocks={blocks.slice(leadIndex + 1)} />
    </>
  );
}

/* ---------- Key Takeaways ---------- */

function Takeaways({ section }: { section: ArticleSection }) {
  const { anchors } = useContext(BlockContext);
  const items = section.blocks.filter((b) => b.type.endsWith('list_item'));
  const rest = section.blocks.filter((b) => !items.includes(b));
  const id = section.heading ? anchors.get(section.heading.id) : undefined;
  return (
    <section aria-labelledby={id} className="mt-12 rounded-xl border border-ink/[0.08] bg-surface/70 p-6 sm:p-8">
      <h2 id={id} className="scroll-mt-28 text-[1.3rem] font-medium tracking-[-0.02em] text-ink">
        <Rich spans={section.heading?.richText} />
      </h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span className="mt-[0.3rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta text-white">
              <Check className="h-3 w-3" strokeWidth={3.5} />
            </span>
            <span className="text-[1rem] leading-relaxed text-ink/85 sm:text-[1.05rem]">
              <Rich spans={item.richText} />
            </span>
          </li>
        ))}
      </ul>
      <Blocks blocks={rest} />
    </section>
  );
}

/* ---------- FAQ ---------- */

function Faq({ section, share }: { section: ArticleSection; share: Share }) {
  const { anchors } = useContext(BlockContext);
  const { lead, entries, outro } = faqEntries(section);
  return (
    <section>
      {section.heading && <Blocks blocks={[section.heading]} />}
      <Blocks blocks={lead} />
      {entries.length > 0 && (
        <div className="mt-7 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
          {entries.map(({ question, answer }) => (
            <div key={question.id} className="p-5 sm:p-6">
              <h3 id={anchors.get(question.id)} className="flex scroll-mt-28 gap-3 text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
                <span aria-hidden className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.7rem] font-bold text-cta">
                  Q
                </span>
                <Rich spans={question.richText} />
              </h3>
              <div className="pl-9 [&>p]:mt-2.5 [&>p]:text-[1rem] [&>p]:leading-relaxed [&>ol]:mt-3 [&>ul]:mt-3">
                <Blocks blocks={answer} />
              </div>
            </div>
          ))}
        </div>
      )}
      {outro.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-dashed border-cta/35 bg-cta-soft/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="[&>p]:mt-0 [&>p]:text-[1.02rem] [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-ink">
            <Blocks blocks={outro} />
          </div>
          <ShareButtons url={share.url} title={share.title} className="shrink-0" />
        </div>
      )}
    </section>
  );
}

/* ---------- References ---------- */

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function References({ section }: { section: ArticleSection }) {
  const { anchors } = useContext(BlockContext);
  const items = section.blocks.filter((b) => b.type.endsWith('list_item'));
  const rest = section.blocks.filter((b) => !items.includes(b));
  const id = section.heading ? anchors.get(section.heading.id) : undefined;
  return (
    <section aria-labelledby={id} className="mt-16 border-t border-ink/[0.08] pt-10">
      <h2 id={id} className="scroll-mt-28 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {plainText(section.heading?.richText)}
      </h2>
      <ol className="mt-5 space-y-3">
        {items.map((item, i) => {
          const spans = item.richText ?? [];
          const link = spans.length === 1 && spans[0].href ? spans[0] : null;
          return (
            <li key={item.id} className="flex gap-3 text-[0.9rem] leading-relaxed">
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-muted-foreground">{i + 1}.</span>
              {link ? (
                <a href={link.href!} target="_blank" rel="noopener noreferrer" className="group min-w-0">
                  <span className="font-medium text-ink decoration-ink/30 underline-offset-4 group-hover:underline">{link.text}</span>
                  <span className="ml-2 text-muted-foreground">{hostOf(link.href!)} ↗</span>
                </a>
              ) : (
                <span className="min-w-0 text-ink/80">
                  <Rich spans={spans} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <Blocks blocks={rest} />
    </section>
  );
}

/* ---------- body ---------- */

export function ArticleBody({ outline, share }: { outline: ArticleOutline; share: Share }) {
  const context = useMemo(() => ({ anchors: outline.anchors }), [outline]);
  return (
    <BlockContext.Provider value={context}>
      <Intro blocks={outline.intro} answerFirst={outline.answerFirst} />
      {outline.sections.map((section, i) => {
        const key = section.heading?.id ?? i;
        switch (section.kind) {
          case 'takeaways':
            return <Takeaways key={key} section={section} />;
          case 'faq':
            return <Faq key={key} section={section} share={share} />;
          case 'references':
            return <References key={key} section={section} />;
          default:
            return <Blocks key={key} blocks={section.heading ? [section.heading, ...section.blocks] : section.blocks} />;
        }
      })}
    </BlockContext.Provider>
  );
}
