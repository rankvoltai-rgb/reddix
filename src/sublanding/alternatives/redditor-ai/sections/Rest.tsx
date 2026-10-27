import { Link } from 'react-router-dom';
import { ArrowRight, Check, HelpCircle, Library, Scale } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSING, FAQ, FIT, INSTEAD, SOURCES, STRENGTHS } from '../content';

/* What the done-for-you model buys you, said first and plainly. */
export function Strengths() {
  return (
    <section aria-labelledby="ra-strengths">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="ra-strengths" className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
          {STRENGTHS.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{STRENGTHS.body}</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {STRENGTHS.items.map((s, i) => (
            <li key={s.title} className={CELL}>
              <Reveal delay={i * 0.05} className="h-full p-6 sm:p-7">
                <span className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-ink/[0.12]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-[1rem] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* Reddix's side, with the costs of doing it yourself left in. */
export function Instead() {
  return (
    <section aria-labelledby="ra-instead">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <Pill icon={Scale}>{INSTEAD.pill}</Pill>
            <h2 id="ra-instead" className={cn('mt-5', SECTION_TITLE)}>
              {INSTEAD.title}
            </h2>
          </div>
        </div>
        <ol className="divide-y divide-ink/[0.07]">
          {INSTEAD.items.map((it, i) => (
            <li key={it.title} className="flex gap-5 px-6 py-6 sm:px-10 lg:px-12">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cta-soft text-[0.75rem] font-semibold text-cta-deep">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.02rem] font-semibold text-ink">{it.title}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

export function Fit() {
  return (
    <section aria-labelledby="ra-fit">
      <Band inner="px-6 py-10 text-center sm:px-10">
        <h2 id="ra-fit" className={SECTION_TITLE}>
          {FIT.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {[FIT.them, FIT.us].map((side, i) => (
          <div key={side.name} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 ? cn('border-t bg-cta-soft/40 md:border-l md:border-t-0', LINE) : '')}>
            <h3 className="text-[1.05rem] font-semibold text-ink">{side.name}</h3>
            <ul className="mt-4 space-y-3">
              {side.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.92rem] leading-relaxed text-ink/80">
                  <Check className={cn('mt-1 h-4 w-4 shrink-0', i === 1 ? 'text-cta' : 'text-ink/40')} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
    </section>
  );
}

/* Questions in two columns, every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="ra-faq">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={HelpCircle}>Questions</Pill>
        <h2 id="ra-faq" className={cn('mt-5', SECTION_TITLE)}>
          Redditor AI and Reddix, answered
        </h2>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-2">
          {FAQ.map((f) => (
            <li key={f.q} className={cn(CELL, 'px-6 py-7 sm:px-10 lg:px-12')}>
              <h3 className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function Sources() {
  return (
    <section aria-labelledby="ra-sources">
      <Band inner="grid gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-12">
        <div>
          <Pill icon={Library}>Sources</Pill>
          <h2 id="ra-sources" className="mt-4 text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">
            Where every fact comes from
          </h2>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
            All pages opened on October 27, 2026. Prices and features change; check the vendor’s site before you buy.
          </p>
        </div>
        <ol className="space-y-2.5 text-[0.86rem]">
          {SOURCES.map((s, i) => (
            <li key={s.id} id={`ra-src-${i + 1}`} className="flex scroll-mt-24 gap-3">
              <span className="w-5 shrink-0 font-semibold tabular-nums text-cta">{i + 1}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 break-words text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-cta">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

export function Closing() {
  return (
    <section aria-labelledby="ra-close">
      <Spacer />
      <Band inner="px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="ra-close" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
          {CLOSING.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSING.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSING.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
