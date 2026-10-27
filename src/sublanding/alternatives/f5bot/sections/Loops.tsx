import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { LOOPS } from '../content';

/* A ruled comparison: a label column, then F5Bot and Reddix side by side.
   On phones each row stacks, label first. */
export function Loops() {
  return (
    <section aria-labelledby="loops-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <h2 id="loops-title" className={cn('max-w-2xl', SECTION_TITLE)}>
          {LOOPS.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{LOOPS.body}</p>
      </Band>
      <Band>
        <div className={cn('hidden border-b md:grid md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
          <span />
          <span className={cn('border-l px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground', LINE)}>F5Bot</span>
          <span className={cn('border-l px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-cta', LINE)}>Reddix</span>
        </div>
        <dl>
          {LOOPS.rows.map((r, i) => (
            <div
              key={r.label}
              className={cn('grid md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]', i < LOOPS.rows.length - 1 && 'border-b', LINE)}
            >
              <dt className="px-6 pb-1 pt-5 text-[0.85rem] font-semibold text-ink md:py-5">{r.label}</dt>
              <dd className={cn('px-6 py-2 text-[0.9rem] leading-relaxed text-ink/75 md:border-l md:py-5', LINE)}>
                <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:hidden">F5Bot</span>
                {r.f5bot}
              </dd>
              <dd className={cn('px-6 pb-5 pt-2 text-[0.9rem] leading-relaxed text-ink md:border-l md:py-5', LINE)}>
                <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-cta md:hidden">Reddix</span>
                {r.reddix}
              </dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}
