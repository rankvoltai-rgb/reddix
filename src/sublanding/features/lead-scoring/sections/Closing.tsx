import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { HeroRadar } from '@/components/landing/hero-radar';
import { cn } from '@/lib/utils';
import { FAQ, NEXT } from '../content';

/* Questions as cells: two across, every answer open. The sixth cell sends the
   reader to the page that explains the scoring itself. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="flex flex-col gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-12">
        <div>
          <Pill icon={HelpCircle}>Questions</Pill>
          <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
            Lead scoring, answered
          </h2>
        </div>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-2">
          {FAQ.map((f) => (
            <li key={f.q} className={cn(CELL, 'p-6 sm:p-8')}>
              <h3 className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</p>
            </li>
          ))}
          <li className={cn(CELL, 'bg-surface/70')}>
            <Link to="/features/intent-detection" className="group flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
              <span className="text-[1.02rem] font-semibold leading-snug text-ink">How is the 0–100 score worked out?</span>
              <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-cta">
                Read intent detection
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}

/* The close, in ink: the one action, then the related pages in a row. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="overflow-hidden bg-ink">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_30%,#000_30%,transparent_100%)]">
          <HeroRadar className="text-white" />
        </div>
        <div className="relative px-6 py-14 text-center sm:px-10 sm:py-16">
          <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.5rem]">
            {NEXT.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-white/70">{NEXT.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
            {NEXT.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <nav aria-label={NEXT.linksTitle} className="relative grid border-t border-white/10 sm:grid-cols-3">
          {NEXT.links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn('group px-6 py-5 transition-colors hover:bg-white/[0.04] sm:px-8', i > 0 && 'border-t border-white/10 sm:border-l sm:border-t-0')}
            >
              <span className="flex items-center justify-between gap-3 text-[0.92rem] font-semibold text-white">
                {l.title}
                <ArrowRight className="h-4 w-4 text-white/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-white" />
              </span>
              <span className="mt-1 block text-[0.8rem] text-white/55">{l.body}</span>
            </Link>
          ))}
        </nav>
      </Band>
      <Spacer closing />
    </section>
  );
}

