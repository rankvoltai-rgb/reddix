import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BUYERS, TIMELINE } from '../content';

/* A buyer profile, row by row; on phones each row becomes a small card. */
export function Buyers() {
  return (
    <section aria-labelledby="buyers-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <h2 id="buyers-title" className={SECTION_TITLE}>
              {BUYERS.title}
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{BUYERS.body}</p>
          </div>
        </div>
        <dl className="divide-y divide-ink/[0.07]">
          {BUYERS.rows.map((r) => (
            <div key={r.k} className="px-6 py-6 sm:px-10">
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{r.k}</dt>
              <dd className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-6">
                <p className="text-[0.88rem] leading-relaxed text-ink/75">
                  <span className="mb-1 block text-[0.72rem] font-semibold text-ink/50">Brandwatch</span>
                  {r.brandwatch}
                </p>
                <p className="text-[0.88rem] leading-relaxed text-ink">
                  <span className="mb-1 block text-[0.72rem] font-semibold text-cta">Reddix</span>
                  {r.reddix}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

/* A vertical timeline down the left, the removed fields beside it. */
export function Timeline() {
  return (
    <section aria-labelledby="timeline-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="timeline-title" className={cn('max-w-2xl', SECTION_TITLE)}>
          {TIMELINE.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{TIMELINE.body}</p>
      </Band>
      <Band inner="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <ol className="relative px-6 py-10 sm:px-10 lg:px-12">
          {TIMELINE.events.map((e, i) => {
            const now = e.when.includes('2026');
            return (
              <li key={e.when} className="relative pb-8 pl-8 last:pb-0">
                {i < TIMELINE.events.length - 1 && <span aria-hidden className="absolute bottom-0 left-[0.4rem] top-4 w-px bg-ink/[0.12]" />}
                <span
                  aria-hidden
                  className={cn('absolute left-0 top-1.5 h-[0.85rem] w-[0.85rem] rounded-full border-2', now ? 'border-cta bg-cta' : 'border-ink/25 bg-white')}
                />
                <Reveal delay={i * 0.05}>
                  <p className={cn('text-[0.8rem] font-semibold tabular-nums', now ? 'text-cta' : 'text-muted-foreground')}>{e.when}</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-ink">{e.what}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <div className={cn('border-t bg-surface/70 px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10', LINE)}>
          <h3 className="text-[0.95rem] font-semibold text-ink">{TIMELINE.removedTitle}</h3>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {TIMELINE.removed.map((f) => (
              <li key={f} className="rounded-md border border-ink/[0.1] bg-white px-2 py-1 text-[0.78rem] text-ink/60 line-through decoration-ink/30">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.85rem] leading-relaxed text-muted-foreground">{TIMELINE.kept}</p>
        </div>
      </Band>
    </section>
  );
}
