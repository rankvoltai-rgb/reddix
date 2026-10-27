import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Globe2, HelpCircle, PenLine, Play, ShieldAlert, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { FAQ, LIMITS, NEXT } from '../content';

const LIMIT_ICONS: LucideIcon[] = [Play, Globe2, PenLine, Eye, SlidersHorizontal];

/* The heading takes the first cell, so five limits fill two rows of three. */
export function Limits() {
  return (
    <section aria-labelledby="limits-title">
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          <li className={cn(CELL, 'flex flex-col justify-end bg-surface/70 p-6 sm:p-8')}>
            <Pill icon={ShieldAlert} className="w-fit">
              {LIMITS.pill}
            </Pill>
            <h2 id="limits-title" className="mt-5 text-balance text-[1.7rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2rem]">
              {LIMITS.title}
            </h2>
          </li>
          {LIMITS.items.map((item, i) => {
            const Icon = LIMIT_ICONS[i];
            return (
              <li key={item.title} className={CELL}>
                <Reveal delay={(i % 3) * 0.06} className="h-full p-6 sm:p-8">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-5 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{item.body}</p>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* Every answer open: no accordion, so readers and crawlers see the same text. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <Pill icon={HelpCircle}>Questions</Pill>
            <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
              Intent detection, answered
            </h2>
          </div>
        </div>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f) => (
            <div key={f.q} className="px-6 py-7 sm:px-10 lg:px-12">
              <dt className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
              <dd className="mt-2.5 max-w-[40rem] text-[0.93rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Next() {
  return (
    <section aria-labelledby="next-title">
      <Spacer />
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="next-title" className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
          {NEXT.title}
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {NEXT.links.map((l) => (
            <li key={l.to} className={CELL}>
              <Link to={l.to} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface/60 sm:p-7">
                <span className="flex items-center justify-between gap-3 text-[0.98rem] font-semibold text-ink">
                  {l.title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                </span>
                <span className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{l.body}</span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>

      {/* The close: the page's one action again, on the soft red. */}
      <Spacer />
      <Band inner="overflow-hidden bg-cta-soft px-6 py-14 text-center sm:px-10 sm:py-16">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {NEXT.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-ink/70">{NEXT.cta.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
            {NEXT.cta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
