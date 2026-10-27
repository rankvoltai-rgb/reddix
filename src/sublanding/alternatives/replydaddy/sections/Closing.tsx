import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, CLOSING, FAQ, SOURCES } from '../content';

/* Numbered questions down a single reading column. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 lg:py-14">
        <div className="mx-auto max-w-[46rem]">
          <h2 id="faq-title" className={SECTION_TITLE}>
            Questions people ask before switching
          </h2>
          <ol className="mt-8 space-y-0 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
            {FAQ.map((f, i) => (
              <li key={f.q} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-6">
                <span className="pt-0.5 text-[0.8rem] font-semibold tabular-nums text-cta">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</h3>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* Sources and the close share one band: the list on the left, the action on
   the soft surface to the right. */
export function SourcesAndClose() {
  return (
    <section aria-labelledby="sources-title">
      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <h2 id="sources-title" className="text-[1.1rem] font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted-foreground">
            ReplyDaddy’s site renders in the browser, so its pricing, FAQ and guides were read from the pages’ own code, checked {CHECKED}.
          </p>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[0.85rem] marker:text-muted-foreground">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-cta hover:decoration-cta/50">
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className={cn('flex flex-col justify-center border-t bg-cta-soft/70 px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-12', LINE)}>
          <h2 className="text-balance text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]">{CLOSING.title}</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{CLOSING.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-7 self-start')}>
            {CLOSING.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
