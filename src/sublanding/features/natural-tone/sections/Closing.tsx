import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, HandHeart } from 'lucide-react';
import { Band, CELL, CellGrid, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSE, FAQ, ON_YOU } from '../content';

/* Two by two, each one a short instruction to the reader. */
export function OnYou() {
  return (
    <section aria-labelledby="onyou-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={HandHeart}>{ON_YOU.pill}</Pill>
          <h2 id="onyou-title" className={cn('mt-5', SECTION_TITLE)}>
            {ON_YOU.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{ON_YOU.body}</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2">
          {ON_YOU.items.map((item, i) => (
            <li key={item.title} className={CELL}>
              <Reveal delay={(i % 2) * 0.06} className="flex h-full gap-4 p-6 sm:p-8 lg:px-12">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-cta" />
                <div>
                  <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* One narrow column, set like an interview: question large, answer under. */
export function Questions() {
  return (
    <section aria-labelledby="tone-faq-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-[44rem]">
          <h2 id="tone-faq-title" className={SECTION_TITLE}>
            Natural tone, answered
          </h2>
          <dl className="mt-8 divide-y divide-ink/[0.07] border-t border-ink/[0.07]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-[1.12rem] font-semibold leading-snug tracking-[-0.015em] text-ink">{f.q}</dt>
                <dd className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* The close on the full red, white type, the one action in white. */
export function Close() {
  return (
    <section aria-labelledby="tone-close-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="tone-close-title" className="text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
              {CLOSE.title}
            </h2>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-white/90">{CLOSE.body}</p>
          </div>
          <div className="lg:justify-self-end">
            <Link
              to="/auth"
              className="group inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta-deep shadow-[0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              {CLOSE.button}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem]">
              {CLOSE.related.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
