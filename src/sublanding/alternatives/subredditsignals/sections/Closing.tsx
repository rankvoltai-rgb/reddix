import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Scale } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BETTER, CHECKED, CLOSE, FAQ, SOURCES } from '../content';

/* The verdict as two facing columns, the competitor's first. */
export function Better() {
  return (
    <section aria-labelledby="better-title">
      <Band inner="px-6 pt-12 text-center sm:px-10 sm:pt-14">
        <Pill icon={Scale}>{BETTER.pill}</Pill>
        <h2 id="better-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {BETTER.title}
        </h2>
      </Band>
      <Band inner="grid pt-10 lg:grid-cols-2">
        {[BETTER.them, BETTER.reddix].map((col, i) => (
          <Reveal key={col.title} delay={i * 0.08} className={cn('px-6 pb-10 sm:px-10 lg:px-12', i === 0 && 'border-b lg:border-b-0 lg:border-r', LINE)}>
            <h3 className={cn('text-[1.1rem] font-semibold', i === 1 ? 'text-cta' : 'text-ink')}>{col.title}</h3>
            <ol className="mt-4 space-y-3">
              {col.items.map((item, j) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink/80">
                  <span className="w-5 shrink-0 text-[0.78rem] font-semibold tabular-nums text-ink/35">{j + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </Band>
    </section>
  );
}

/* Questions as a two-column grid of open answers; nothing collapses. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          Subreddit Signals or Reddix: questions
        </h2>
      </Band>
      <Band>
        <dl className="grid md:grid-cols-2">
          {FAQ.map((f, i) => (
            <div
              key={f.q}
              className={cn('border-b px-6 py-7 sm:px-10 lg:px-12', LINE, i % 2 === 0 && 'md:border-r', i === FAQ.length - 1 && 'md:col-span-2 md:border-r-0')}
            >
              <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Band id="sources" className="scroll-mt-16" inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-12', LINE)}>
          <h2 className="text-[1.05rem] font-semibold text-ink">Sources</h2>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
            {CHECKED}. Every Subreddit Signals fact on this page comes from these pages. Reddix facts come from Reddix itself.
          </p>
        </div>
        <ol className="grid gap-x-8 gap-y-2 px-6 py-7 text-[0.84rem] sm:grid-cols-2 sm:px-10 lg:px-12">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="flex gap-2">
              <span className="w-4 shrink-0 tabular-nums text-ink/35">{i + 1}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="group inline-flex items-start gap-1 text-ink/80 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                {s.label}
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-ink/30 group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ol>
      </Band>

      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className={cn('border-b px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <h2 id="close-title" className="max-w-xl text-balance text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
            {CLOSE.title}
          </h2>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-7')}>
            {CLOSE.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <nav aria-label="Related" className="px-6 py-10 sm:px-10 lg:px-10 lg:py-14">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Also compared</p>
          <ul className="mt-4 divide-y divide-ink/[0.07]">
            {CLOSE.related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="group flex items-center justify-between gap-3 py-3 text-[0.92rem] font-medium text-ink">
                  {r.label}
                  <ArrowRight className="h-4 w-4 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                </Link>
              </li>
            ))}
            <li>
              <Link to="/alternatives" className="group flex items-center justify-between gap-3 py-3 text-[0.92rem] font-medium text-ink">
                All Reddix alternatives
                <ArrowRight className="h-4 w-4 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
              </Link>
            </li>
          </ul>
        </nav>
      </Band>
      <Spacer closing />
    </section>
  );
}
