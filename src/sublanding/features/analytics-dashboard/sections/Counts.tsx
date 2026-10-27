import { Hash } from 'lucide-react';
import { Band, SectionHead } from '@/components/landing/frame';
import { COUNTS } from '../content';

/* A ledger: one row per figure, with what it counts, includes and leaves out.
   On phones each row stacks into its own block. */
export function Counts() {
  return (
    <section aria-labelledby="counts-title">
      <SectionHead icon={Hash} eyebrow={COUNTS.pill} title={<span id="counts-title">{COUNTS.title}</span>} subtitle={COUNTS.body} />
      <Band>
        <div className="hidden grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] border-b border-ink/[0.07] bg-surface/70 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:grid lg:px-12">
          <span>#</span>
          <span>Figure</span>
          <span>Counts</span>
          <span>Includes</span>
          <span>Leaves out</span>
        </div>
        <dl className="divide-y divide-ink/[0.07]">
          {COUNTS.rows.map((r, i) => (
            <div
              key={r.name}
              className="grid gap-x-6 gap-y-1.5 px-6 py-5 md:grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] md:items-baseline lg:px-12"
            >
              <span aria-hidden className="hidden text-[0.8rem] font-semibold tabular-nums text-cta md:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <dt className="text-[1rem] font-semibold text-ink">{r.name}</dt>
              <dd className="text-[0.9rem] leading-relaxed text-ink/80">{r.counts}</dd>
              <dd className="text-[0.86rem] leading-relaxed text-muted-foreground">
                <span className="font-medium text-ink/60 md:hidden">Includes: </span>
                {r.includes}
              </dd>
              <dd className="text-[0.86rem] leading-relaxed text-muted-foreground">
                <span className="font-medium text-ink/60 md:hidden">Leaves out: </span>
                {r.excludes}
              </dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}
