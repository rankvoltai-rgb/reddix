import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Cog, UserRound } from 'lucide-react';
import { Accent, Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { FACTS, HERO, LOOP } from '../content';
import { Ref } from './Ref';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* A wide, left-set question; the answer and the plan facts share the row
   under it, and the six jobs run across the band below. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="pm-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="px-5 pb-10 pt-12 sm:px-10 sm:pt-16 lg:px-12">
          <div className="flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Cog}>{HERO.pill}</Pill>
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5" />
              {HERO.checked}
            </span>
          </div>
          <h1
            id="pm-title"
            className="mt-6 max-w-[54rem] text-balance text-[2.2rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.9rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>

        <div className={cn('grid border-t lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]', LINE)}>
          <div className="px-5 py-8 motion-safe:animate-hero-rise sm:px-10 lg:px-12 lg:py-10" style={rise(0.16)}>
            <p className="max-w-[38rem] text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">{HERO.answer}</p>
            <Link to="/auth" className={cn(CTA_BUTTON, 'mt-7')}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <dl aria-label={FACTS.title} className={cn('grid grid-cols-2 border-t bg-surface/60 motion-safe:animate-hero-rise lg:border-l lg:border-t-0', LINE)} style={rise(0.22)}>
            {FACTS.items.map((f, i) => (
              <div key={f.label} className={cn('px-5 py-6 sm:px-7', i % 2 === 1 && 'border-l', i > 1 && 'border-t', LINE)}>
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-1.5 text-[1.12rem] font-semibold leading-tight tracking-[-0.015em] text-ink">
                  {f.value}
                  <Ref id={f.src} />
                </dd>
                <dd className="mt-1 text-[0.78rem] text-muted-foreground">{f.sub}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* The six jobs. The three that act on Reddit as you are marked in red. */
export function Loop() {
  return (
    <section aria-labelledby="pm-loop">
      <Band inner="grid gap-5 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={UserRound}>{LOOP.pill}</Pill>
          <h2 id="pm-loop" className={cn('mt-5', SECTION_TITLE)}>
            {LOOP.title}
          </h2>
        </div>
        <p className="text-[0.96rem] leading-relaxed text-muted-foreground">{LOOP.body}</p>
      </Band>
      <Band>
        <CellGrid className="grid-cols-2 md:grid-cols-3">
          {LOOP.stages.map((s, i) => (
            <li key={s.name} className={cn(CELL, s.acts && 'bg-cta-soft/50')}>
              <Reveal delay={i * 0.05} className="flex h-full flex-col p-5 sm:p-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')} · {s.job}
                </span>
                <h3 className="mt-2 text-[1.05rem] font-semibold text-ink">{s.name}</h3>
                <p className="mt-2 flex-1 text-[0.84rem] leading-relaxed text-ink/70">
                  {s.text}
                  <Ref id={s.src} />
                </p>
                <span
                  className={cn(
                    'mt-4 inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-semibold',
                    s.acts ? 'bg-cta text-white' : 'bg-ink/[0.05] text-ink/55',
                  )}
                >
                  {s.acts ? 'Acts as your account' : 'Reads or sorts'}
                </span>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
