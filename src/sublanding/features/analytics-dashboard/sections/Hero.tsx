import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { COUNTS, HERO } from '../content';
import { SAMPLE } from '../model';
import { Screen } from '../Screen';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Copy on the left, a key to the pins on the right; then the dashboard itself
   in a window that runs the width of the rails. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="dash-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl gap-10 border-x px-5 pb-12 pt-12 sm:px-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:px-12 lg:pb-14 lg:pt-20', LINE)}>
        <div>
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={LayoutDashboard}>{HERO.pill}</Pill>
          </div>
          <h1
            id="dash-title"
            className="mt-6 text-balance text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.4rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p className="mt-6 max-w-[38rem] text-[1.03rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#sandbox" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* The key to the numbered pins on the window below. */}
        <ol className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[0.82rem] motion-safe:animate-hero-rise lg:grid-cols-1" style={rise(0.3)}>
          {COUNTS.rows.map((r, i) => (
            <li key={r.name} className="flex items-baseline gap-2.5">
              <span className="flex h-5 w-5 shrink-0 translate-y-[0.2rem] items-center justify-center rounded-full bg-ink text-[0.62rem] font-semibold text-white">{i + 1}</span>
              <span>
                <span className="font-semibold text-ink">{r.name}</span>
                <span className="hidden text-muted-foreground sm:inline"> · {r.counts}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <Band inner="bg-surface/70 px-3 py-8 sm:px-10 sm:py-12 lg:px-16">
        <figure className="mx-auto max-w-4xl motion-safe:animate-hero-rise" style={rise(0.36)}>
          <div className="overflow-hidden rounded-2xl border border-ink/[0.1] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(16,24,40,0.35)]">
            <div aria-hidden className={cn('flex items-center gap-1.5 border-b px-4 py-2.5', LINE)}>
              <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
              <span className="ml-3 rounded-md bg-surface px-3 py-0.5 text-[0.68rem] text-muted-foreground">reddix.info/dashboard</span>
            </div>
            <div className="p-4 sm:p-6">
              <Screen account={SAMPLE} pins />
            </div>
          </div>
          <figcaption className="mt-3 text-center text-[0.72rem] text-muted-foreground">{HERO.caption}</figcaption>
        </figure>
      </Band>
    </section>
  );
}
