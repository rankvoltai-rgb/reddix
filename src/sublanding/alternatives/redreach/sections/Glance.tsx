import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, GLANCE } from '../content';

/* A ruled two-column comparison. On phones each row becomes a small card
   with both answers labelled. */
export function Glance() {
  return (
    <section aria-labelledby="glance-title">
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <h2 id="glance-title" className={SECTION_TITLE}>
            {GLANCE.title}
          </h2>
          <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">{GLANCE.intro}</p>
        </div>
        <span className="rounded-md border border-ink/[0.08] bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-ink/70">Checked {CHECKED}</span>
      </Band>
      <Band>
        <div role="table" aria-label="Redreach and Reddix compared">
          <div role="row" className={cn('hidden border-b bg-surface/60 text-[0.75rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground md:grid md:grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
            <span role="columnheader" className="px-6 py-3 lg:px-12">
              <span className="sr-only">Topic</span>
            </span>
            <span role="columnheader" className={cn('border-l px-6 py-3', LINE)}>Redreach</span>
            <span role="columnheader" className={cn('border-l px-6 py-3 text-cta', LINE)}>Reddix</span>
          </div>
          {GLANCE.rows.map((r) => (
            <div key={r.label} role="row" className={cn('grid border-b last:border-b-0 md:grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
              <span role="rowheader" className="px-6 pb-1 pt-5 text-[0.88rem] font-semibold text-ink md:py-4 lg:px-12">
                {r.label}
              </span>
              <span role="cell" className={cn('px-6 py-1.5 text-[0.88rem] leading-relaxed text-ink/80 md:border-l md:py-4', LINE)}>
                <span className="mr-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:hidden">Redreach</span>
                {r.redreach}
              </span>
              <span role="cell" className={cn('px-6 pb-5 pt-1.5 text-[0.88rem] leading-relaxed text-ink/80 md:border-l md:py-4', LINE)}>
                <span className="mr-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-cta md:hidden">Reddix</span>
                {r.reddix}
              </span>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
