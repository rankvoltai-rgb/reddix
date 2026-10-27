import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, HERO, VENN } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred copy over a Venn diagram: two overlapping rings, with what only
   ReplyDaddy does, what both do, and what only Reddix does. On phones the
   rings drop away and the three lists stack. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="hero-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="flex flex-col items-center px-5 pb-10 pt-12 text-center sm:px-10 lg:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Scale}>{HERO.pill}</Pill>
          </div>
          <h1
            id="hero-title"
            className="mt-6 max-w-4xl text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3rem] lg:text-[3.4rem]"
            style={rise(0.06)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p className="mt-6 max-w-[44rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]" style={rise(0.12)}>
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 motion-safe:animate-hero-rise" style={rise(0.18)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="text-[0.78rem] text-muted-foreground">ReplyDaddy facts checked {CHECKED}</span>
          </div>
        </div>

        <Venn />
      </div>
    </section>
  );
}

function Venn() {
  return (
    <figure className={cn('relative overflow-hidden border-t px-5 py-10 motion-safe:animate-hero-rise sm:px-10 lg:py-14', LINE)} style={rise(0.24)}>
      <figcaption className="sr-only">What only ReplyDaddy does, what both do, and what only Reddix does.</figcaption>
      {/* The rings, behind the lists (wide screens only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
        <span className="absolute h-[30rem] w-[30rem] -translate-x-[8.5rem] rounded-full border border-ink/[0.1] bg-ink/[0.015]" />
        <span className="absolute h-[30rem] w-[30rem] translate-x-[8.5rem] rounded-full border border-cta/25 bg-cta/[0.025]" />
      </div>
      <div className="relative mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_0.9fr_1fr] lg:items-center lg:gap-0">
        <Set name={VENN.left.name} items={VENN.left.items} tone="ink" />
        <Set name={VENN.both.name} items={VENN.both.items} tone="both" />
        <Set name={VENN.right.name} items={VENN.right.items} tone="cta" />
      </div>
    </figure>
  );
}

function Set({ name, items, tone }: { name: string; items: readonly string[]; tone: 'ink' | 'both' | 'cta' }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 lg:border-0 lg:bg-transparent lg:p-6',
        tone === 'both' ? 'border-ink/[0.1] bg-surface lg:text-center' : 'border-ink/[0.08] bg-white',
        tone === 'ink' && 'lg:pr-10 lg:text-right',
        tone === 'cta' && 'lg:pl-10',
      )}
    >
      <p className={cn('text-[0.78rem] font-semibold uppercase tracking-[0.08em]', tone === 'cta' ? 'text-cta' : tone === 'both' ? 'text-ink' : 'text-ink/55')}>{name}</p>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className={cn('text-[0.88rem] leading-snug', tone === 'both' ? 'font-medium text-ink' : 'text-ink/75')}>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
