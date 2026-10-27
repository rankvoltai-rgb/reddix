import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { HeroRadar } from '@/components/landing/hero-radar';
import { cn } from '@/lib/utils';
import { CHOOSING, FAQ, NEXT } from '../content';

/* Four rules set like a printed guideline sheet: a heavy rule over each. */
export function Choosing() {
  return (
    <section aria-labelledby="choosing-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <Pill icon={Lightbulb}>{CHOOSING.pill}</Pill>
        <h2 id="choosing-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {CHOOSING.title}
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CHOOSING.rules.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={i * 0.07} y={10} className="border-t-2 border-ink pt-4">
                <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{r.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{r.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* Questions in a two-up grid of open cells; the last cell points onward. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="flex flex-col items-start gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-12">
        <div>
          <Pill icon={HelpCircle}>Questions</Pill>
          <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
            Subreddit discovery, answered
          </h2>
        </div>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-2">
          {FAQ.map((f) => (
            <li key={f.q} className={cn(CELL, 'px-6 py-8 sm:px-10')}>
              <dl>
                <dt className="text-[1.04rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
                <dd className="mt-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </dl>
            </li>
          ))}
          <li className={cn(CELL, 'bg-surface/70 px-6 py-8 sm:px-10')}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">{NEXT.title}</p>
            <ul className="mt-3 divide-y divide-ink/[0.07]">
              {NEXT.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center justify-between gap-3 py-3">
                    <span>
                      <span className="block text-[0.95rem] font-semibold text-ink group-hover:text-cta">{l.title}</span>
                      <span className="block text-[0.82rem] text-muted-foreground">{l.body}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}

/* The close on the brand red, with the hero's radar returning in white. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner={cn('overflow-hidden bg-cta', LINE)}>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.2] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000_40%,transparent_100%)]">
          <HeroRadar className="text-white" />
        </div>
        <Reveal className="relative px-6 py-16 text-center sm:px-10 sm:py-20">
          <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]">
            {NEXT.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-white/90">{NEXT.cta.body}</p>
          <Link
            to="/auth"
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta-deep shadow-[0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            {NEXT.cta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
