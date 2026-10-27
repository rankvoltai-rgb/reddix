import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, Crosshair, ListOrdered } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { HeroRadar } from '@/components/landing/hero-radar';
import { cn } from '@/lib/utils';
import { HERO, HERO_ROWS } from '../content';
import { finalScore } from '../model';
import { LevelChip, LEVEL_FILL } from '../../intent-detection/ui';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="scoring-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl overflow-hidden border-x', LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.32] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <HeroRadar />
        </div>
        <div className="relative flex flex-col items-center px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={ListOrdered}>{HERO.pill}</Pill>
          </div>
          <h1
            id="scoring-title"
            className="mt-6 max-w-4xl text-balance text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.3rem] lg:text-[3.7rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p
            className="mx-auto mt-6 max-w-[42rem] text-[1.03rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
            style={rise(0.16)}
          >
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#triage" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
      <RankedStack />
    </section>
  );
}

/* The focal piece: five leads arrive in the order a scan found them, then
   settle into the order Reddix lists them, best final score first. */
function RankedStack() {
  const rows = useMemo(
    () => HERO_ROWS.map((r, i) => ({ ...r, id: i, ...finalScore(r.title, r.ai) })),
    [],
  );
  const sorted = useMemo(() => [...rows].sort((a, b) => b.quality - a.quality || b.ai - a.ai), [rows]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => setSettled(true), 900);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const order = reduce || settled ? sorted : rows;

  return (
    <Band inner="bg-surface/70 px-3 py-8 sm:px-10 sm:py-12 lg:px-16">
      <div ref={ref} className="mx-auto max-w-4xl">
        <div className="mb-3 flex items-center justify-between gap-3 px-1 text-[0.72rem] text-muted-foreground">
          <span>{reduce || settled ? 'Sorted by final score, then AI score' : 'As the scan found them'}</span>
          <span className="hidden sm:inline">AI score → final score</span>
        </div>
        <ol className="space-y-2" aria-label="Leads in ranked order">
          {order.map((r, i) => (
            <motion.li
              key={r.id}
              layout="position"
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="flex items-center gap-3 rounded-xl border border-ink/[0.08] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:gap-4 sm:px-4"
            >
              <span className="w-5 shrink-0 text-center text-[0.8rem] font-semibold tabular-nums text-ink/35">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9rem] font-medium text-ink sm:text-[0.95rem]">{r.title}</span>
                <span className="mt-0.5 flex items-center gap-2 text-[0.72rem] text-muted-foreground">
                  {r.subreddit}
                  {r.competitor && (
                    <span className="inline-flex items-center gap-1 font-medium text-cta">
                      <Crosshair className="h-3 w-3" />
                      Competitor
                    </span>
                  )}
                </span>
              </span>
              <span className="hidden w-28 shrink-0 sm:block" aria-hidden>
                <span className="relative block h-1.5 rounded-full bg-ink/[0.06]">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-ink/15" style={{ width: `${r.ai}%` }} />
                  <span className={cn('absolute inset-y-0 rounded-full', LEVEL_FILL[r.level])} style={{ left: `${r.ai}%`, width: `${r.quality - r.ai}%` }} />
                </span>
              </span>
              <span className="w-[4.5rem] shrink-0 text-right text-[0.78rem] tabular-nums text-muted-foreground">
                {r.ai}
                {r.quality !== r.ai && <span className="text-cta"> → </span>}
                {r.quality !== r.ai && <span className="font-semibold text-ink">{r.quality}</span>}
              </span>
              <LevelChip level={r.level} className="hidden min-[440px]:inline-flex" />
            </motion.li>
          ))}
        </ol>
        <p className="mt-4 text-center text-[0.72rem] text-muted-foreground">{HERO.caption}</p>
      </div>
    </Band>
  );
}
