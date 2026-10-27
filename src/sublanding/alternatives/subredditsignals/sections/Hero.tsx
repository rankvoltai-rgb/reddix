import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, GitCompareArrows } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, HERO, OVERLAP } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred copy, then the overlap map: what only one has, what both share,
   what only the other has. The middle column sits on two faint circles that
   overlap, so it reads as the shared ground before a word is read. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="ss-title" className="relative bg-white pt-16">
      <Band inner="px-5 pb-12 pt-14 text-center sm:px-10 sm:pb-14 sm:pt-16">
        <div className="motion-safe:animate-hero-rise" style={rise(0)}>
          <Pill icon={GitCompareArrows}>{HERO.pill}</Pill>
        </div>
        <h1
          id="ss-title"
          className="mx-auto mt-6 max-w-4xl text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.2rem] lg:text-[3.6rem]"
          style={rise(0.08)}
        >
          {lead} <Accent>{HERO.accent}</Accent>
        </h1>
        <p
          className="mx-auto mt-6 max-w-[46rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
          style={rise(0.16)}
        >
          {HERO.answer}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
          <Link to="/auth" className={CTA_BUTTON}>
            {HERO.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#fit" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
            {HERO.secondary}
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
          </a>
        </div>
      </Band>

      <Band>
        <div style={rise(0.3)} className="grid motion-safe:animate-hero-rise lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)]">
          <Side title={OVERLAP.left.title} items={OVERLAP.left.items} className="order-2 lg:order-1" tone="them" />
          <Middle />
          <Side title={OVERLAP.right.title} items={OVERLAP.right.items} className="order-3" tone="reddix" />
        </div>
      </Band>
      <Band inner="flex items-center justify-between gap-3 px-5 py-3 text-[0.75rem] text-muted-foreground sm:px-10">
        <span>{CHECKED}, from each vendor’s own pages.</span>
        <a href="#sources" className="underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink">
          Sources
        </a>
      </Band>
    </section>
  );
}

function Side({ title, items, className, tone }: { title: string; items: string[]; className?: string; tone: 'them' | 'reddix' }) {
  return (
    <div className={cn('px-6 py-8 sm:px-10 lg:px-8 lg:py-10', className)}>
      <p className={cn('text-[0.72rem] font-semibold uppercase tracking-[0.07em]', tone === 'reddix' ? 'text-cta' : 'text-ink/55')}>{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink/80">
            <span aria-hidden className={cn('mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full', tone === 'reddix' ? 'bg-cta' : 'bg-ink/35')} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Middle() {
  return (
    <div className={cn('relative order-1 overflow-hidden border-b bg-surface/70 px-6 py-8 sm:px-10 lg:order-2 lg:border-x lg:border-b-0 lg:px-8 lg:py-10', LINE)}>
      {/* Two circles that overlap behind the list: the shared ground. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="h-64 w-64 -translate-x-12 rounded-full border border-ink/[0.07] bg-white/50" />
        <span className="absolute h-64 w-64 translate-x-12 rounded-full border border-cta/15 bg-cta-soft/40" />
      </div>
      <div className="relative">
        <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-ink">{OVERLAP.both.title}</p>
        <ul className="mx-auto mt-4 max-w-[15rem] space-y-2.5">
          {OVERLAP.both.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-lg border border-ink/[0.07] bg-white/90 px-3 py-2 text-[0.86rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-cta" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
