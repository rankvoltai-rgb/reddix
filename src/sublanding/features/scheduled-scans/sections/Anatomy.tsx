import { Link } from 'react-router-dom';
import { ArrowRight, ListOrdered } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { ANATOMY } from '../content';

/* A ledger, one row per step: number, what happens, and the limit the
   scanner enforces there in its own column. */
export function Anatomy() {
  return (
    <section aria-labelledby="anatomy-title">
      <SectionHead icon={ListOrdered} eyebrow={ANATOMY.pill} title={<span id="anatomy-title">{ANATOMY.title}</span>} subtitle={ANATOMY.body} />
      <Band>
        <ol className="divide-y divide-ink/[0.07]">
          {ANATOMY.rows.map((row, i) => (
            <li key={row.title}>
              <Reveal y={10} delay={0.04} className="grid gap-x-8 gap-y-3 px-6 py-7 sm:px-10 md:grid-cols-[3rem_minmax(0,1fr)_14rem] lg:px-12">
                <span className="text-[0.85rem] font-semibold tabular-nums text-cta">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h3 className="text-[1.08rem] font-semibold tracking-[-0.015em] text-ink">{row.title}</h3>
                  <p className="mt-1.5 max-w-[40rem] text-[0.92rem] leading-relaxed text-muted-foreground">{row.body}</p>
                  {'link' in row && row.link && (
                    <Link to={row.link.to} className="group mt-3 inline-flex items-center gap-1.5 py-1 text-[0.84rem] font-medium text-cta hover:text-cta-hover">
                      {row.link.label}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
                <span className="w-fit self-start rounded-md border border-ink/[0.08] bg-surface px-2.5 py-1 text-[0.78rem] font-medium tabular-nums text-ink md:justify-self-end">
                  {row.limit}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
      <Band inner={cn('bg-surface/70 px-6 py-6 text-[0.86rem] leading-relaxed text-muted-foreground sm:px-10 lg:px-12', LINE)}>
        <p className="max-w-[52rem]">{ANATOMY.footnote}</p>
      </Band>
    </section>
  );
}
