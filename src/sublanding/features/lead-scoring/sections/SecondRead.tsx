import { ArrowRight, Brain, Check, CircleDashed } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { SECOND_READ } from '../content';

/* Left-aligned heading over a before → analyze → after strip. */
export function SecondRead() {
  const { before, after, steps } = SECOND_READ;
  return (
    <section aria-labelledby="second-read-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={Brain}>{SECOND_READ.pill}</Pill>
          <h2 id="second-read-title" className={cn('mt-5', SECTION_TITLE)}>
            {SECOND_READ.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{SECOND_READ.body}</p>
      </Band>
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
        <Reveal className={cn('border-b p-6 sm:p-8 lg:border-b-0 lg:border-r', LINE)}>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md border border-dashed border-ink/[0.2] px-2 text-[0.72rem] font-medium text-muted-foreground">
            <CircleDashed className="h-3 w-3" />
            Unanalyzed
          </span>
          <h3 className="mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{before.label}</h3>
          <ul className="mt-3 space-y-2.5 text-[0.9rem] text-ink/75">
            {before.points.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className={cn('border-b bg-surface/70 p-6 sm:p-8 lg:border-b-0 lg:border-r', LINE)}>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-ink px-2 text-[0.72rem] font-semibold text-white">
            <Brain className="h-3 w-3" />
            Analyze
          </span>
          <ol className="mt-5 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.1] bg-white text-[0.72rem] font-semibold tabular-nums text-cta">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
            <ArrowRight className="h-3 w-3" />
            {SECOND_READ.note}
          </p>
        </Reveal>

        <Reveal delay={0.16} className="p-6 sm:p-8">
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-cta px-2 text-[0.72rem] font-semibold text-white">
            <Check className="h-3 w-3" />
            Analyzed
          </span>
          <h3 className="mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{after.label}</h3>
          <ul className="mt-3 space-y-2.5 text-[0.9rem] text-ink">
            {after.points.map((p) => (
              <li key={p} className="flex gap-2.5">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-cta" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </Band>
    </section>
  );
}
