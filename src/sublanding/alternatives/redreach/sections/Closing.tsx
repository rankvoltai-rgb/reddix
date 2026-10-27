import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, CLOSING, FAQ, SOURCES, VERDICT } from '../content';

export function Verdict() {
  return (
    <section aria-labelledby="verdict-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="verdict-title" className={SECTION_TITLE}>
          {VERDICT.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {[VERDICT.redreach, VERDICT.reddix].map((v, i) => (
          <div key={v.label} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && cn('border-t md:border-l md:border-t-0', LINE))}>
            <h3 className={cn('text-[1.05rem] font-semibold', i === 1 ? 'text-cta' : 'text-ink')}>{v.label}</h3>
            <ul className="mt-4 divide-y divide-ink/[0.06]">
              {v.points.map((p) => (
                <li key={p} className="py-3 text-[0.92rem] leading-relaxed text-ink/80">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
    </section>
  );
}

/* Questions as a two-column grid of short answers: all open, no accordion. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          Redreach and Reddix, answered
        </h2>
      </Band>
      <Band>
        <dl className="grid md:grid-cols-2">
          {FAQ.map((f, i) => (
            <div key={f.q} className={cn('border-b px-6 py-7 sm:px-10 lg:px-12', LINE, i % 2 === 1 && 'md:border-l', i === FAQ.length - 1 && 'md:col-span-2 md:border-l-0')}>
              <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="mt-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Sources() {
  return (
    <section aria-labelledby="sources-title">
      <Band inner="px-6 py-9 sm:px-10 lg:px-12">
        <h2 id="sources-title" className="text-[1.1rem] font-semibold text-ink">
          Sources
        </h2>
        <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
          Redreach facts come from its own pages, checked {CHECKED}. Prices and features change; check its site before you buy.
        </p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-[0.84rem] md:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="flex gap-2.5">
              <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="group inline-flex items-start gap-1 text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-cta hover:decoration-cta/50">
                {s.label}
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 opacity-50 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* The close on ink: the page's one action again. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="bg-ink px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="close-title" className="max-w-xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.3rem]">
              {CLOSING.title}
            </h2>
            <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-white/70">{CLOSING.body}</p>
          </div>
          <Link to="/auth" className={cn(CTA_BUTTON, 'shrink-0 self-start lg:self-auto')}>
            {CLOSING.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
