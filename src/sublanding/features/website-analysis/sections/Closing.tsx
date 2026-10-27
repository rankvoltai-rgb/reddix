import { Link } from 'react-router-dom';
import { ArrowRight, EyeOff } from 'lucide-react';
import { Band, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { FAQ, LIMITS, NEXT } from '../content';
import { UrlForm } from './UrlForm';

/* The blind spots on ink: the one dark band on the page, so the limits read
   as a different kind of information from the rest. */
export function Limits() {
  return (
    <section aria-labelledby="limits-title">
      <Band inner="bg-ink px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-12">
        <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta text-white">
            <EyeOff className="h-3 w-3" />
          </span>
          {LIMITS.pill}
        </span>
        <h2 id="limits-title" className="mt-5 max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
          {LIMITS.title}
        </h2>
        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {LIMITS.items.map((item, i) => (
            <li key={item.title} className="border-t border-white/[0.12] py-6">
              <Reveal delay={(i % 2) * 0.06} y={10}>
                <h3 className="text-[1rem] font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-white/65">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* Questions as a short, numbered reading column: every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-[44rem]">
          <h2 id="faq-title" className={SECTION_TITLE}>
            Questions about the analysis
          </h2>
          <dl className="mt-10 space-y-9">
            {FAQ.map((f, i) => (
              <div key={f.q} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                <span aria-hidden className="pt-0.5 text-[0.8rem] font-semibold tabular-nums text-cta">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <dt className="text-[1.08rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

export function Next() {
  return (
    <section aria-labelledby="next-title">
      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className={cn('border-b bg-surface/70 px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <h2 id="next-title" className={SECTION_TITLE}>
            {NEXT.cta.title}
          </h2>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">{NEXT.cta.body}</p>
          <UrlForm className="mt-8" button={NEXT.cta.button} />
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {NEXT.links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="group flex items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-surface/60 sm:px-10 lg:py-8">
                <span>
                  <span className="block text-[1rem] font-semibold text-ink">{l.title}</span>
                  <span className="mt-1 block text-[0.86rem] text-muted-foreground">{l.body}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
              </Link>
            </li>
          ))}
        </ul>
      </Band>
      <Spacer closing />
    </section>
  );
}
