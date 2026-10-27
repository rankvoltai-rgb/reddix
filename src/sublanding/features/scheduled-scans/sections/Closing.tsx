import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Band, CTA_BUTTON, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSE, FAQ } from '../content';

/* Numbered questions, every answer open, so readers and crawlers see the
   same text. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 pb-6 pt-12 sm:px-10 sm:pt-14 lg:px-12">
        <Pill icon={HelpCircle}>Questions</Pill>
        <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
          Scanning, answered
        </h2>
      </Band>
      <Band>
        <dl className="grid md:grid-cols-2">
          {FAQ.map((f, i) => (
            <div
              key={f.q}
              className={cn(
                'flex gap-5 border-t border-ink/[0.07] px-6 py-7 sm:px-10 lg:px-12',
                i % 2 === 1 && 'md:border-l',
                i === 0 && 'border-t-0',
                i === 1 && 'md:border-t-0',
              )}
            >
              <span aria-hidden className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-cta/35">
                {i + 1}
              </span>
              <div className="min-w-0">
                <dt className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
                <dd className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

/* The close on ink: the one action, with the related pages under it. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="overflow-hidden bg-ink px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
        <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="close-title" className="max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
              {CLOSE.title}
            </h2>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/70">{CLOSE.body}</p>
          </div>
          <div className="lg:justify-self-end">
            <Link to="/auth" className={CTA_BUTTON}>
              {CLOSE.button}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
        <nav aria-label="Related features" className="mt-10 border-t border-white/10 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem]">
            {CLOSE.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-1.5 py-1 text-white/70 transition-colors hover:text-white">
                  {l.title}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Band>
      <Spacer closing />
    </section>
  );
}
