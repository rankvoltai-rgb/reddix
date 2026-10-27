import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shuffle } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* A left-set headline, then the product before and after its May 2026 turn,
   side by side with the date as the hinge. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim().replace(/,$/, '');
  return (
    <section aria-labelledby="ci-title" className="relative bg-white pt-16">
      <div className={cn('mx-auto max-w-6xl border-x px-5 pb-12 pt-14 sm:px-10 sm:pt-16 lg:px-12', LINE)}>
        <div className="motion-safe:animate-hero-rise" style={rise(0)}>
          <Pill icon={Shuffle}>{HERO.pill}</Pill>
        </div>
        <h1
          id="ci-title"
          className="mt-6 max-w-4xl text-balance text-[2.25rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.1rem] lg:text-[3.5rem]"
          style={rise(0.08)}
        >
          {lead}, <Accent>{HERO.accent}</Accent>
        </h1>
        <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <p className="max-w-[46rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="shrink-0 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className={cn('border-t', LINE)}>
        <div className={cn('relative mx-auto grid max-w-6xl border-x md:grid-cols-2', LINE)}>
          <Side label={HERO.before.label} items={HERO.before.items} muted />
          <Side label={HERO.after.label} items={HERO.after.items} className={cn('border-t md:border-l md:border-t-0', LINE)} />
          {/* The hinge: the day Reddit closed to new buyers. */}
          <span className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg border border-ink/[0.1] bg-white px-3 py-2 text-center shadow-[0_6px_20px_-10px_rgba(16,24,40,0.35)] md:flex">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">v3.0.0</span>
            <span className="text-[0.85rem] font-semibold text-cta">May 13, 2026</span>
          </span>
        </div>
      </div>
      <div className={cn('border-t', LINE)}>
        <p className={cn('mx-auto max-w-6xl border-x px-6 py-3 text-[0.75rem] text-muted-foreground sm:px-10 lg:px-12', LINE)}>
          CatchIntent facts from its own site and changelog, checked {CHECKED_LABEL}.
        </p>
      </div>
    </section>
  );
}

function Side({ label, items, muted = false, className }: { label: string; items: readonly string[]; muted?: boolean; className?: string }) {
  return (
    <div className={cn('px-6 py-8 sm:px-10 lg:px-12 lg:py-10', muted && 'bg-surface/70', className)}>
      <p className={cn('text-[0.75rem] font-semibold uppercase tracking-[0.06em]', muted ? 'text-muted-foreground' : 'text-cta')}>{label}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className={cn('flex gap-3 text-[0.93rem] leading-snug', muted ? 'text-ink/55' : 'text-ink')}>
            <span aria-hidden className={cn('mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full', muted ? 'bg-ink/25' : 'bg-cta')} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
