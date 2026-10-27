import { Equal, Split, Trophy } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, Pill, SECTION_TITLE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { AHEAD, DIFF, SAME } from '../content';

/* What's the same: a narrow reading column, the page's argument in prose. */
export function Same() {
  return (
    <section aria-labelledby="same-title">
      <Band inner="px-6 py-12 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-[44rem]">
          <Pill icon={Equal}>{SAME.pill}</Pill>
          <h2 id="same-title" className={cn('mt-5', SECTION_TITLE)}>
            {SAME.title}
          </h2>
          <div className="mt-6 space-y-4">
            {SAME.body.map((p, i) => (
              <p key={i} className="text-[1rem] leading-[1.8] text-ink/80">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Band>
    </section>
  );
}

/* Five chapters, each a label down the left edge and the two answers beside
   it, ReplyDaddy then Reddix. */
export function Differences() {
  return (
    <section aria-labelledby="diff-title">
      <SectionHead icon={Split} eyebrow={DIFF.pill} title={<span id="diff-title">{DIFF.title}</span>} />
      <Band inner={cn('hidden border-b bg-surface/60 text-[0.75rem] font-semibold uppercase tracking-[0.07em] md:grid md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
        <span className="px-6 py-3 lg:px-10" />
        <span className={cn('border-l px-6 py-3 text-ink/60', LINE)}>ReplyDaddy</span>
        <span className={cn('border-l px-6 py-3 text-cta', LINE)}>Reddix</span>
      </Band>
      {DIFF.groups.map((g) => (
        <Band key={g.title} inner="grid md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
          <h3 className="px-6 pb-1 pt-7 text-[1rem] font-semibold text-ink md:py-7 lg:px-10">{g.title}</h3>
          <div className={cn('px-6 py-3 md:border-l md:py-7', LINE)}>
            <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-ink/50 md:hidden">ReplyDaddy</p>
            <p className="text-[0.9rem] leading-relaxed text-ink/80">{g.replydaddy}</p>
          </div>
          <div className={cn('px-6 pb-7 pt-3 md:border-l md:py-7', LINE)}>
            <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-cta md:hidden">Reddix</p>
            <p className="text-[0.9rem] leading-relaxed text-ink/80">{g.reddix}</p>
          </div>
        </Band>
      ))}
    </section>
  );
}

export function Ahead() {
  return (
    <section aria-labelledby="ahead-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Trophy}>{AHEAD.pill}</Pill>
        <h2 id="ahead-title" className={cn('mt-5', SECTION_TITLE)}>
          {AHEAD.title}
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {AHEAD.items.map((a, i) => (
            <li key={a.title} className={CELL}>
              <Reveal delay={(i % 3) * 0.06} className="h-full p-6 sm:p-8">
                <span className="text-[0.75rem] font-semibold tabular-nums text-ink/35">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{a.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{a.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
