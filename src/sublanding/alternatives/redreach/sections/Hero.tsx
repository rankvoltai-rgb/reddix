import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitFork } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, FORK, HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Left-set copy, then a fork drawn across the full frame: one shared trunk,
   splitting into what each product does next. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="hero-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="px-5 pb-12 pt-12 sm:px-10 lg:px-12 lg:pb-14 lg:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={GitFork}>{HERO.pill}</Pill>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
            <h1
              id="hero-title"
              className="text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3rem] lg:text-[3.3rem]"
              style={rise(0.06)}
            >
              {lead} <Accent>{HERO.accent}</Accent>
            </h1>
            <div className="motion-safe:animate-hero-rise" style={rise(0.14)}>
              <p className="text-[1.02rem] leading-relaxed text-muted-foreground">{HERO.answer}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                <Link to="/auth" className={CTA_BUTTON}>
                  {HERO.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[0.78rem] text-muted-foreground">Redreach facts checked {CHECKED}</span>
              </div>
            </div>
          </div>
        </div>

        <Fork />
      </div>
    </section>
  );
}

function Fork() {
  return (
    <figure className={cn('border-t bg-surface/60 px-5 pb-10 pt-8 motion-safe:animate-hero-rise sm:px-10 lg:px-12', LINE)} style={rise(0.22)}>
      <figcaption className="sr-only">What both products share, and where each goes next.</figcaption>
      <p className="mx-auto max-w-xl rounded-xl border border-ink/[0.08] bg-white px-5 py-3.5 text-center text-[0.92rem] font-medium leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {FORK.shared}
      </p>
      {/* The split: a stem, a crossbar, and a drop to each branch (wide screens). */}
      <div aria-hidden className="relative mx-auto hidden h-10 max-w-[calc(50%+18rem)] sm:block">
        <span className="absolute left-1/2 top-0 h-5 w-px bg-ink/20" />
        <span className="absolute left-[25%] right-[25%] top-5 h-px bg-ink/20" />
        <span className="absolute left-[25%] top-5 h-5 w-px bg-ink/20" />
        <span className="absolute right-[25%] top-5 h-5 w-px bg-ink/20" />
      </div>
      <div className="mt-5 grid gap-4 sm:mt-0 sm:grid-cols-2">
        <Branch name={FORK.redreach.name} steps={FORK.redreach.steps} />
        <Branch name={FORK.reddix.name} steps={FORK.reddix.steps} ours />
      </div>
    </figure>
  );
}

function Branch({ name, steps, ours = false }: { name: string; steps: readonly string[]; ours?: boolean }) {
  return (
    <div className={cn('rounded-xl border bg-white p-5 sm:p-6', ours ? 'border-cta/30' : 'border-ink/[0.08]')}>
      <p className={cn('text-[0.8rem] font-semibold uppercase tracking-[0.08em]', ours ? 'text-cta' : 'text-ink/60')}>{name}</p>
      <ol className="mt-3.5 space-y-2.5">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[0.9rem] leading-snug text-ink/85">
            <span className={cn('mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[0.68rem] font-semibold tabular-nums', ours ? 'bg-cta-soft text-cta' : 'bg-ink/[0.05] text-ink/60')}>
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
