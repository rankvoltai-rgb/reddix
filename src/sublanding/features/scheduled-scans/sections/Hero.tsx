import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MousePointerClick, Radar } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { HERO } from '../content';
import { RATE_LIMIT_MINUTES } from '../rotation';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/** The scanner's limits, to scale: a scan stops at 50 s; the next may start
 *  5 minutes after the press. */
const SCAN_S = 50;
const CYCLE_S = RATE_LIMIT_MINUTES * 60;
const SCAN_SHARE = (SCAN_S / CYCLE_S) * 100;

/* Wide type across the rails, the answer and the action side by side under
   it, and the press-then-rest timeline closing the hero. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="scans-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="px-5 pb-10 pt-12 sm:px-10 sm:pt-16 lg:px-12 lg:pb-12 lg:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Radar}>{HERO.pill}</Pill>
          </div>
          <h1
            id="scans-title"
            className="mt-6 max-w-[56rem] text-balance text-[2.3rem] font-medium leading-[1.05] tracking-[-0.04em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>

        <div
          className={cn('grid border-t motion-safe:animate-hero-rise lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]', LINE)}
          style={rise(0.16)}
        >
          <p className="px-5 py-8 text-[1.05rem] leading-relaxed text-muted-foreground sm:px-10 sm:text-[1.12rem] lg:px-12 lg:py-10">
            {HERO.answer}
          </p>
          <div className={cn('flex items-center border-t px-5 pb-8 pt-6 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)}>
            <Link to="/auth" className={cn(CTA_BUTTON, 'w-full sm:w-auto')}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <Timeline />
      </div>
    </section>
  );
}

/* One cycle on a single track: the red scan, then the hatched rest, with a
   playhead walking it. Static under reduced motion. */
function Timeline() {
  const { scan, rest, press, next } = HERO.timeline;
  return (
    <figure
      className={cn('border-t bg-surface/70 px-5 py-8 motion-safe:animate-hero-rise sm:px-10 lg:px-12 lg:py-10', LINE)}
      style={rise(0.24)}
    >
      <figcaption className="sr-only">
        A scan runs for at most {SCAN_S} seconds. The next scan can start {RATE_LIMIT_MINUTES} minutes after you pressed Scan.
      </figcaption>
      <div aria-hidden className="relative">
        <div className="flex items-end justify-between text-[0.75rem] font-medium text-ink">
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="h-3.5 w-3.5 text-cta" />
            {press}
          </span>
          <span className="text-muted-foreground">{next}</span>
        </div>
        <div className="relative mt-3 flex h-11 overflow-hidden rounded-lg border border-ink/[0.08] bg-white">
          <div className="relative flex h-full items-center bg-cta pl-3 text-[0.72rem] font-semibold text-white" style={{ width: `${SCAN_SHARE}%` }}>
            <span className="hidden whitespace-nowrap sm:inline">{scan}</span>
          </div>
          <div className="relative flex flex-1 items-center justify-center bg-[repeating-linear-gradient(135deg,hsl(var(--ink)/0.05)_0_6px,transparent_6px_12px)] text-[0.72rem] font-medium text-ink/55">
            {rest}
          </div>
          <span className="absolute inset-y-0 left-0 w-0.5 bg-ink motion-safe:animate-[scan-playhead_9s_linear_infinite]" />
        </div>
        <div className="mt-2.5 flex justify-between text-[0.7rem] tabular-nums text-muted-foreground">
          <span>0:00</span>
          <span className="sm:hidden">{scan}</span>
          <span>{RATE_LIMIT_MINUTES}:00</span>
        </div>
      </div>
      <style>{'@keyframes scan-playhead{0%{left:0}88%{left:calc(100% - 2px)}100%{left:calc(100% - 2px)}}'}</style>
    </figure>
  );
}
