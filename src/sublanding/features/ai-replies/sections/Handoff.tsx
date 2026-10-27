import { Ban, Send } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { RedditMark } from '@/components/landing/subreddit-ticker';
import { LogoMark } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import { HANDOFF, NEVER } from '../content';

/* The handoff drawn as a border: three steps happen in Reddix, the last one
   happens on Reddit, in a panel of its own. */
export function Handoff() {
  const inside = HANDOFF.steps.slice(0, -1);
  const outside = HANDOFF.steps[HANDOFF.steps.length - 1];
  return (
    <section aria-labelledby="handoff-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={Send}>{HANDOFF.pill}</Pill>
          <h2 id="handoff-title" className={cn('mt-5', SECTION_TITLE)}>
            {HANDOFF.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{HANDOFF.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.25fr)]">
        <div className="min-w-0">
          <p className={cn('flex items-center gap-2 border-b px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink/60 sm:px-10 lg:px-12', LINE)}>
            <LogoMark className="h-4 w-4" />
            In Reddix
          </p>
          <ol className="grid sm:grid-cols-3">
            {inside.map((s, i) => (
              <li key={s.title} className={cn('px-6 py-7 sm:px-8', i > 0 && cn('border-t sm:border-l sm:border-t-0', LINE), i === 0 && 'lg:pl-12')}>
                <Reveal delay={i * 0.07}>
                  <span className="text-[0.75rem] font-semibold tabular-nums text-cta">0{i + 1}</span>
                  <h3 className="mt-1.5 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{s.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <div className={cn('min-w-0 border-t bg-surface/70 lg:border-l lg:border-t-0', LINE)}>
          <p className={cn('flex items-center gap-2 border-b px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink/60 sm:px-10', LINE)}>
            <RedditMark className="h-4 w-4" />
            On Reddit
          </p>
          <Reveal delay={0.24} className="px-6 py-7 sm:px-10">
            <span className="text-[0.75rem] font-semibold tabular-nums text-cta">0{HANDOFF.steps.length}</span>
            <h3 className="mt-1.5 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{outside.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{outside.body}</p>
          </Reveal>
        </div>
      </Band>

      <Band>
        <CellGrid className="sm:grid-cols-3">
          {HANDOFF.extras.map((x) => (
            <li key={x.title} className={cn(CELL, 'px-6 py-6 sm:px-8 lg:first:pl-12')}>
              <h3 className="text-[0.92rem] font-semibold text-ink">{x.title}</h3>
              <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted-foreground">{x.body}</p>
            </li>
          ))}
        </CellGrid>
      </Band>

      {/* The hard line, in ink, so it reads as a promise rather than a feature. */}
      <Band inner="bg-ink px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center">
          <h2 className="text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-white sm:text-[1.8rem]">{NEVER.title}</h2>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {NEVER.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[0.92rem] text-white/85">
                <Ban className="h-4 w-4 shrink-0 text-cta" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </section>
  );
}
