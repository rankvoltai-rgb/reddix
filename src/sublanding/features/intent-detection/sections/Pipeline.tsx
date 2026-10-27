import { ChevronRight, Workflow } from 'lucide-react';
import { Band, CELL, CellGrid, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { STAGES } from '../content';

/* The four passes, left to right. A bar over each pass narrows as the posts
   are filtered, so the funnel reads before the words do. */
const WIDTHS = ['100%', '62%', '40%', '24%'];

export function Pipeline() {
  return (
    <section aria-labelledby="pipeline-title">
      <SectionHead icon={Workflow} eyebrow={STAGES.pill} title={<span id="pipeline-title">{STAGES.title}</span>} subtitle={STAGES.body} />
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.steps.map((s, i) => (
            <li key={s.title} className={cn(CELL, 'relative')}>
              <Reveal delay={i * 0.08} className="flex h-full flex-col p-6 sm:p-7">
                <div aria-hidden className="h-1.5 rounded-full bg-ink/[0.05]">
                  <div className={cn('h-full rounded-full', i === 3 ? 'bg-cta' : 'bg-cta/30')} style={{ width: WIDTHS[i] }} />
                </div>
                <span className="mt-6 text-[0.75rem] font-semibold tabular-nums text-cta">0{i + 1}</span>
                <h3 className="mt-1.5 text-[1.12rem] font-semibold leading-snug tracking-[-0.015em] text-ink">{s.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.88rem] leading-relaxed text-muted-foreground">{s.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.facts.map((f) => (
                    <li key={f} className="rounded-md border border-ink/[0.08] bg-surface px-2 py-1 text-[0.72rem] font-medium text-ink/75">
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              {i < STAGES.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[3.1rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-ink/40 lg:flex"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
