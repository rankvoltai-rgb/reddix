import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Equal, History, Layers3, MessageCircleQuestion, EqualNot, Receipt, X } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, Pill, SECTION_TITLE, SectionHead, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { CLOSE, FAQ, FORMER, LIFETIME, LINEUP, NOW, SOURCES, type Fit } from '../content';

/* The old product as four cells, each tagged as past. */
export function Former() {
  return (
    <section aria-labelledby="former-title">
      <SectionHead icon={History} eyebrow={FORMER.pill} title={<span id="former-title">{FORMER.title}</span>} subtitle={FORMER.body} />
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {FORMER.items.map((f, i) => (
            <li key={f.title} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full p-6 sm:p-7">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Was offered</span>
                <h3 className="mt-3 text-[1.05rem] font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{f.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* The current plan as a single price block beside what it includes. */
export function Now() {
  return (
    <section aria-labelledby="now-title">
      <Band inner="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <Pill icon={Layers3}>{NOW.pill}</Pill>
        <h2 id="now-title" className={cn('mt-5 max-w-3xl', SECTION_TITLE)}>
          {NOW.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{NOW.body}</p>
      </Band>
      <Band inner="grid md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <div className={cn('border-b bg-surface/70 px-6 py-8 sm:px-10 md:border-b-0 md:border-r', LINE)}>
          <p className="text-[0.8rem] font-semibold text-muted-foreground">{NOW.plan.name}</p>
          <p className="mt-1 text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-ink">{NOW.plan.price}</p>
          <p className="mt-2 text-[0.8rem] text-muted-foreground">{NOW.plan.billing}</p>
        </div>
        <div className="px-6 py-8 sm:px-10 lg:px-12">
          <ul className="space-y-3">
            {NOW.items.map((item) => (
              <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8rem] leading-relaxed text-muted-foreground">{NOW.note}</p>
        </div>
      </Band>
    </section>
  );
}

const FIT_ICON: Record<Fit, typeof Equal> = { same: Equal, different: EqualNot, none: X };
const FIT_TONE: Record<Fit, string> = {
  same: 'bg-cta text-white',
  different: 'bg-cta-soft text-cta-deep',
  none: 'bg-ink/[0.07] text-ink/55',
};

/* Each old feature against Reddix, with a sign between them. */
export function Lineup() {
  return (
    <section aria-labelledby="lineup-title">
      <SectionHead icon={Equal} eyebrow={LINEUP.pill} title={<span id="lineup-title">{LINEUP.title}</span>} subtitle={LINEUP.body}>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.78rem] text-muted-foreground">
          {(Object.keys(LINEUP.legend) as Fit[]).map((k) => {
            const Icon = FIT_ICON[k];
            return (
              <li key={k} className="flex items-center gap-1.5">
                <span className={cn('flex h-5 w-5 items-center justify-center rounded', FIT_TONE[k])}>
                  <Icon className="h-3 w-3" />
                </span>
                {LINEUP.legend[k]}
              </li>
            );
          })}
        </ul>
      </SectionHead>
      <Band>
        <ul className="divide-y divide-ink/[0.07]">
          {LINEUP.rows.map((r) => {
            const Icon = FIT_ICON[r.fit];
            return (
              <li key={r.old} className="grid items-center gap-3 px-6 py-5 sm:px-10 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.3fr)] md:gap-6 lg:px-12">
                <p className="text-[0.95rem] font-medium text-ink/65">
                  <span className="mr-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:hidden">Linkeddit</span>
                  {r.old}
                </p>
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', FIT_TONE[r.fit])} title={LINEUP.legend[r.fit]}>
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{LINEUP.legend[r.fit]}</span>
                </span>
                <p className="text-[0.92rem] leading-relaxed text-ink">
                  <span className="mr-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-cta md:hidden">Reddix</span>
                  {r.reddix}
                </p>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

export function Lifetime() {
  return (
    <section aria-labelledby="lifetime-title">
      <Band inner="flex flex-col gap-4 bg-cta-soft/60 px-6 py-8 sm:flex-row sm:gap-6 sm:px-10 lg:px-12">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <Receipt className="h-5 w-5" />
        </span>
        <div>
          <h2 id="lifetime-title" className="text-[1.2rem] font-semibold tracking-[-0.015em] text-ink">
            {LIFETIME.title}
          </h2>
          <p className="mt-2 max-w-3xl text-[0.93rem] leading-relaxed text-ink/75">{LIFETIME.body}</p>
        </div>
      </Band>
    </section>
  );
}

/* Questions down a red rule, answers open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <Pill icon={MessageCircleQuestion}>Questions</Pill>
          <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
            Linkeddit and Reddit, answered
          </h2>
        </div>
        <div className="space-y-7 px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          {FAQ.map((f) => (
            <div key={f.q} className="border-l-2 border-cta pl-5">
              <h3 className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}

export function Sources() {
  return (
    <section aria-labelledby="sources-title">
      <Spacer />
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="sources-title" className="text-[1rem] font-semibold text-ink">
          Sources
        </h2>
        <p className="mt-1 text-[0.78rem] text-muted-foreground">
          Checked {CHECKED_LABEL}: Linkeddit’s live pages, its Chrome Web Store listing, and Internet Archive copies of its own pages.
        </p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-[0.84rem] md:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="flex gap-2.5">
              <span className="w-5 shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-start gap-1 text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-cta">
                <span className="min-w-0 break-words">{s.label}</span>
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="bg-cta px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
          {CLOSE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-white">{CLOSE.body}</p>
        <Link
          to="/auth"
          className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta-deep shadow-[0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          {CLOSE.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
