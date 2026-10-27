import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, CopyCheck, Search, Stamp } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred copy, then the motif: the same post, found by three searches,
   folding into a single read. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="dedup-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl overflow-hidden border-x', LINE)}>
        <div className="flex flex-col items-center px-5 pb-6 pt-14 text-center sm:px-8 sm:pt-16 lg:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={CopyCheck}>{HERO.pill}</Pill>
          </div>
          <h1
            id="dedup-title"
            className="mt-6 max-w-[48rem] text-balance text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.4rem] lg:text-[3.9rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p
            className="mt-6 max-w-[40rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
            style={rise(0.16)}
          >
            {HERO.answer}
          </p>
          <div className="mt-8 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <div className="motion-safe:animate-hero-rise" style={rise(0.3)}>
          <Merge />
        </div>
      </div>
    </section>
  );
}

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/* Spread, the three copies fan out; merged, the outer two fold behind the
   middle one and the stamp lands. Loops while on screen. */
function Merge() {
  const { post, subreddit, sources, stamp, note } = HERO.merge;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const wide = useWide();
  const [merged, setMerged] = useState(false);
  const shown = reduce ? true : merged;

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setMerged((m) => !m), merged ? 3800 : 2000);
    return () => clearTimeout(t);
  }, [reduce, inView, merged]);

  const spread = wide ? [-330, 0, 330] : [-26, 0, 26];
  const tilt = wide ? [-3, 0, 3] : [-5, 0, 5];
  const lift = wide ? [10, 0, 10] : [-14, 0, -14];

  return (
    <figure ref={ref} className="relative">
      <figcaption className="sr-only">
        The same post, found by three searches in one scan ({sources.join(', ')}), is read once and remembered for 7 days.
      </figcaption>
      <div aria-hidden className="relative flex h-[15.5rem] items-center justify-center overflow-hidden sm:h-[16rem]">
        <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--ink)/0.08)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
        {[0, 2, 1].map((i) => {
          const middle = i === 1;
          return (
            <motion.div
              key={i}
              className="absolute w-[min(19rem,80vw)] rounded-xl border border-ink/[0.08] bg-white p-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-20px_rgba(16,24,40,0.3)]"
              initial={false}
              animate={{
                x: shown ? 0 : spread[i],
                y: shown ? 0 : lift[i],
                rotate: shown ? 0 : tilt[i],
                opacity: shown && !middle ? 0 : 1,
                scale: shown && !middle ? 0.94 : 1,
              }}
              transition={{ type: 'spring', stiffness: 170, damping: 24 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-0.5 text-[0.68rem] font-medium text-ink/70">
                <Search className="h-3 w-3" />
                {middle && shown ? `Found by ${sources.length} searches` : `Found by ${sources[i]}`}
              </span>
              <div className="mt-3 flex items-center gap-2 text-[0.72rem]">
                <SubredditIcon name={subreddit} className="h-5 w-5 text-[0.6rem]" />
                <span className="font-semibold text-ink">{subreddit}</span>
              </div>
              <p className="mt-2 text-[0.95rem] font-semibold leading-snug text-ink">{post}</p>
              {middle && (
                <motion.span
                  className="absolute -bottom-3 right-4 inline-flex items-center gap-1.5 rounded-md bg-cta px-2.5 py-1 text-[0.7rem] font-semibold text-white shadow-[0_6px_16px_-6px_hsl(var(--cta)/0.7)]"
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 1.25, rotate: shown ? -2 : -8 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: shown ? 0.25 : 0 }}
                >
                  <Stamp className="h-3 w-3" />
                  {stamp}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="pb-6 text-center text-[0.72rem] text-muted-foreground">{note}</p>
    </figure>
  );
}
