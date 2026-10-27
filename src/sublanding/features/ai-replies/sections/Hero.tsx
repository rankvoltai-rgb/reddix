import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight, ChevronRight, MessageSquareText } from 'lucide-react';
import { Accent, Band, CELL, CellGrid, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { FLOW, HERO, VARIANTS } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* The copy centred over the rails, then the whole mechanism in one strip
   underneath: what goes in, the one AI pass, the three drafts that come out. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="replies-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="flex flex-col items-center px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={MessageSquareText}>{HERO.pill}</Pill>
          </div>
          <h1
            id="replies-title"
            className="mt-6 max-w-[46rem] text-balance text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.2rem] lg:text-[3.6rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p
            className="mt-6 max-w-[40rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
            style={rise(0.16)}
          >
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#editor" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      <Band inner="motion-safe:animate-hero-rise" className="[--rise-delay:0.32s]">
        <CellGrid className="lg:grid-cols-3">
          {FLOW.map((step, i) => (
            <li key={step.label} className={cn(CELL, 'relative flex flex-col', i === 1 && 'bg-surface/70')}>
              <div className="px-6 pt-6 sm:px-8 sm:pt-7">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-cta">{step.label}</span>
                <p className="mt-1.5 text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">{step.title}</p>
                <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
              <div aria-hidden className="flex flex-1 items-end px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                {i === 0 ? <InFigure /> : i === 1 ? <PassFigure /> : <OutFigure />}
              </div>
              {i < FLOW.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-ink/40 lg:flex"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

const CARD = 'w-full rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]';

function InFigure() {
  const { post } = VARIANTS;
  return (
    <div className="w-full space-y-2">
      <div className={cn(CARD, 'p-3')}>
        <div className="flex items-center gap-1.5 text-[0.68rem]">
          <SubredditIcon name={post.subreddit} className="h-4 w-4 text-[0.5rem]" />
          <span className="font-semibold text-ink">{post.subreddit}</span>
        </div>
        <p className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-ink">{post.title}</p>
      </div>
      <div className={cn(CARD, 'flex flex-wrap gap-1.5 p-3')}>
        {['Tallyfold', 'Invoicing for freelancers', 'Free tier', 'Friendly tone'].map((t) => (
          <span key={t} className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.68rem] font-medium text-ink/70">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Illustrative readings, lighting up one after another. */
const READINGS = [
  ['Pain', 'High'],
  ['Technical level', 'Beginner'],
  ['Stage', 'Comparing'],
  ['Mood', 'Frustrated'],
  ['Product fit', 'Strong'],
];

function PassFigure() {
  return (
    <ul className="w-full space-y-1.5">
      {READINGS.map(([k, v], i) => (
        <motion.li
          key={k}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
          className={cn(CARD, 'flex items-center justify-between px-3 py-1.5 text-[0.75rem]')}
        >
          <span className="text-muted-foreground">{k}</span>
          <span className="font-semibold text-ink">{v}</span>
        </motion.li>
      ))}
      <li className="pt-1 text-[0.7rem] text-muted-foreground">Example readings for the r/freelance post.</li>
    </ul>
  );
}

function OutFigure() {
  return (
    <div className="w-full space-y-2">
      {VARIANTS.drafts.map((d, i) => (
        <motion.div
          key={d.type}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.9 + i * 0.12 }}
          className={cn(CARD, 'flex items-center gap-2.5 px-3 py-2.5')}
        >
          <span className="w-14 shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-center text-[0.66rem] font-semibold text-cta-deep">{d.name}</span>
          <p className="min-w-0 truncate text-[0.76rem] text-ink/70">{d.text.split('\n')[0]}</p>
        </motion.div>
      ))}
    </div>
  );
}
