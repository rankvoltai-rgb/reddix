import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { BETTER, BOTH, CLOSING, FAQ, SOURCES } from '../content';

/* Where F5Bot wins: five cells, the heading in a sixth. */
export function Better() {
  return (
    <section aria-labelledby="better-title">
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {BETTER.items.map((item, i) => (
            <li key={item.title} className={CELL}>
              <Reveal delay={(i % 3) * 0.05} className="h-full p-6 sm:p-8">
                <span className="text-[0.75rem] font-semibold tabular-nums text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-3 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            </li>
          ))}
          <li className={cn(CELL, 'flex flex-col justify-end bg-ink p-6 sm:p-8')}>
            <h2 id="better-title" className="text-balance text-[1.6rem] font-medium leading-[1.15] tracking-[-0.03em] text-white sm:text-[1.9rem]">
              {BETTER.title}
            </h2>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}

export function Both() {
  return (
    <section aria-labelledby="both-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <h2 id="both-title" className={SECTION_TITLE}>
            {BOTH.title}
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{BOTH.body}</p>
        </div>
        <ol className="grid sm:grid-cols-3">
          {BOTH.steps.map((s, i) => (
            <li key={s.title} className={cn('px-6 py-8 sm:px-7 lg:py-12', i > 0 && 'border-t sm:border-l sm:border-t-0', LINE)}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cta-soft text-[0.75rem] font-semibold text-cta">{i + 1}</span>
              <h3 className="mt-4 text-[0.98rem] font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* Questions in two columns, every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          F5Bot or Reddix: questions
        </h2>
        <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</dd>
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
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="sources-title" className="text-[0.95rem] font-semibold text-ink">
          Sources
        </h2>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">
          F5Bot details from its own site, checked {CHECKED_LABEL}. Plans change; check f5bot.com before you buy.
        </p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="text-[0.82rem]">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-start gap-1.5 text-ink/75 underline decoration-ink/20 underline-offset-2 hover:text-cta hover:decoration-cta/40"
              >
                <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                {s.label}
                <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
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
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="close-title" className="mx-auto max-w-xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]">
          {CLOSING.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">{CLOSING.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSING.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
