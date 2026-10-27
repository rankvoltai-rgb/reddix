import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { ALREADY, CLOSING, FAQ, RIGHT_CHOICE, SOURCES } from '../content';

/* Four honest reasons to choose Brandwatch, two by two. */
export function RightChoice() {
  return (
    <section aria-labelledby="right-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="right-title" className={SECTION_TITLE}>
          {RIGHT_CHOICE.title}
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2">
          {RIGHT_CHOICE.items.map((it, i) => (
            <li key={it.title} className={CELL}>
              <Reveal delay={(i % 2) * 0.06} className="h-full p-6 sm:p-9">
                <h3 className="text-[1.1rem] font-semibold tracking-[-0.015em] text-ink">{it.title}</h3>
                <p className="mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">{it.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function Already() {
  return (
    <section aria-labelledby="already-title">
      <Band inner="grid gap-4 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12 lg:px-12">
        <h2 id="already-title" className={SECTION_TITLE}>
          {ALREADY.title}
        </h2>
        <p className="text-[0.98rem] leading-relaxed text-ink/80 lg:pt-2">{ALREADY.body}</p>
      </Band>
    </section>
  );
}

/* Question on the left, answer on the right, ruled like a reference table. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 pt-12 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          Brandwatch, Reddit and Reddix: questions
        </h2>
      </Band>
      <Band inner="mt-8">
        <dl>
          {FAQ.map((f, i) => (
            <div key={f.q} className={cn('grid gap-2 px-6 py-6 sm:px-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-10 lg:px-12', i > 0 && 'border-t', LINE)}>
              <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</dd>
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
          Brandwatch details from its own site, help centre and press releases, checked {CHECKED_LABEL}. Check with Brandwatch before you buy.
        </p>
        <ol className="mt-4 space-y-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="text-[0.82rem]">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-start gap-1.5 break-words text-ink/75 underline decoration-ink/20 underline-offset-2 hover:text-cta hover:decoration-cta/40"
              >
                <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                <span className="min-w-0">{s.label}</span>
                <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* The close on ink: the one place the page goes dark. */
export function Closing() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="bg-ink px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
        <h2 id="close-title" className="max-w-xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.3rem]">
          {CLOSING.title}
        </h2>
        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/70">{CLOSING.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSING.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
