import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CLOSE, FAQ } from '../content';

/* Each question on its own row, the answer beside it: read across, not down. */
export function Questions() {
  return (
    <section aria-labelledby="replies-faq-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="replies-faq-title" className={SECTION_TITLE}>
          Questions about AI replies
        </h2>
      </Band>
      <Band>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f, i) => (
            <div key={f.q} className="grid gap-2 px-6 py-6 sm:px-10 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-8 lg:px-12 lg:py-7">
              <span aria-hidden className="hidden text-[0.8rem] font-semibold tabular-nums text-cta lg:block">
                0{i + 1}
              </span>
              <dt className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
              <dd className="text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="replies-close-title">
      <Spacer />
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-center lg:px-12">
        <div>
          <h2 id="replies-close-title" className={SECTION_TITLE}>
            {CLOSE.title}
          </h2>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
        </div>
        <Link to="/auth" className={cn(CTA_BUTTON, 'w-fit')}>
          {CLOSE.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-3">
          {CLOSE.related.map((l) => (
            <li key={l.to} className={CELL}>
              <Link to={l.to} className="group flex h-full items-start justify-between gap-4 p-6 transition-colors hover:bg-surface/60 sm:p-7">
                <span>
                  <span className="block text-[0.95rem] font-semibold text-ink">{l.title}</span>
                  <span className="mt-1.5 block text-[0.84rem] leading-relaxed text-muted-foreground">{l.body}</span>
                </span>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Spacer closing />
    </section>
  );
}
