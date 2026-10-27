import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, CLOSING, FAQ, SOURCES } from '../content';

/* Heading pinned left, every answer open on the right. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12', LINE)}>
          <h2 id="faq-title" className={cn('lg:sticky lg:top-28', SECTION_TITLE)}>
            ReplyAgent or Reddix: questions
          </h2>
        </div>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f) => (
            <div key={f.q} className="px-6 py-7 sm:px-10 lg:px-12">
              <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="mt-2.5 max-w-[40rem] text-[0.93rem] leading-relaxed text-muted-foreground">{f.a}</dd>
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
        <p className="mt-1.5 text-[0.82rem] text-muted-foreground">ReplyAgent’s and Reddit’s own pages, checked {CHECKED}. Prices and policies change; check them before you buy.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] text-ink/80 transition-colors hover:border-cta/30 hover:text-cta"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* The close on the red, in white. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="bg-cta px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
          {CLOSING.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[0.98rem] leading-relaxed text-white/85">{CLOSING.body}</p>
        <Link
          to="/auth"
          className={cn(CTA_BUTTON, 'mt-8 bg-white text-cta hover:bg-white/90 focus-visible:ring-white/40')}
        >
          {CLOSING.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
