import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Radar } from 'lucide-react';
import { CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { HERO, SOURCES_WATCHED } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred copy over a wall of every source Syften lists, with the one Reddix
   reads picked out beneath it. The wall is the argument. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="sy-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8 sm:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Radar}>{HERO.pill}</Pill>
          </div>
          <h1
            id="sy-title"
            className="mt-6 text-balance text-[2.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.4rem] sm:text-[3rem] lg:text-[3.3rem]"
            style={rise(0.08)}
          >
            {lead} <span className="font-[700] text-cta">{HERO.accent}</span>
          </h1>
          <p className="mt-6 text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#planner" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              Check your sources
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>

        <figure className={cn('border-t bg-surface/70 px-5 py-8 sm:px-10 lg:px-12', LINE)} aria-label="Sources each tool watches">
          <div className="grid gap-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:items-start">
            <figcaption className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground lg:pt-1.5">Syften watches</figcaption>
            <ul className="flex flex-wrap gap-1.5">
              {SOURCES_WATCHED.map((s) => (
                <li
                  key={s.name}
                  className={cn(
                    'rounded-md border px-2 py-1 text-[0.78rem] font-medium',
                    s.syften === 'yes' && 'border-ink/[0.1] bg-white text-ink/80',
                    s.syften === 'addon' && 'border-dashed border-ink/[0.2] bg-white text-ink/60',
                    s.syften === 'no' && 'border-transparent bg-transparent text-ink/35 line-through',
                    s.name === 'Reddit' && 'border-cta/40 text-cta-deep',
                  )}
                >
                  {s.name}
                  {s.syften === 'addon' && <span className="ml-1 text-[0.68rem] text-muted-foreground">add-on</span>}
                </li>
              ))}
            </ul>
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-cta lg:pt-1.5">Reddix reads</span>
            <ul className="flex flex-wrap gap-1.5">
              <li className="rounded-md bg-cta px-2 py-1 text-[0.78rem] font-semibold text-white">Reddit, scored for buying intent</li>
            </ul>
          </div>
        </figure>
      </div>
    </section>
  );
}
