import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileX2 } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { HERO, RESPONSES } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* The headline, then the evidence: what Linkeddit's own URLs answer today,
   set as a response log across the frame. */
export function Hero() {
  const [before, after] = HERO.h1.split(HERO.accent);
  return (
    <section aria-labelledby="ld-title" className="relative bg-white pt-16">
      <div className={cn('mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]', LINE)}>
        <div className="px-5 pb-10 pt-14 sm:px-10 sm:pt-16 lg:pb-14 lg:pl-12">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={FileX2}>{HERO.pill}</Pill>
          </div>
          <h1
            id="ld-title"
            className="mt-6 text-balance text-[2.25rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3rem] lg:text-[3.3rem]"
            style={rise(0.08)}
          >
            {before}
            <Accent>{HERO.accent}</Accent>
            {after}
          </h1>
        </div>
        <div className={cn('flex flex-col justify-end border-t px-5 pb-12 pt-8 sm:px-10 lg:border-l lg:border-t-0 lg:pb-14 lg:pr-12', LINE)}>
          <p className="text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-7 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* The log. */}
      <div className={cn('border-t', LINE)}>
        <div className={cn('mx-auto max-w-6xl border-x bg-ink', LINE)}>
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3 sm:px-10 lg:px-12">
            <span className="font-mono text-[0.72rem] text-white/50">GET linkeddit.com</span>
            <span className="text-[0.72rem] text-white/50">Checked {CHECKED_LABEL}</span>
          </div>
          <ul className="divide-y divide-white/[0.07] font-mono text-[0.8rem] sm:text-[0.85rem]">
            {RESPONSES.map((r) => (
              <li key={r.path} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[3.5rem_13rem_minmax(0,1fr)] sm:px-10 lg:px-12">
                <span className={cn('font-semibold', r.code === 410 ? 'text-cta' : 'text-white/80')}>{r.code}</span>
                <span className="truncate text-white">{r.path}</span>
                <span className="col-start-2 text-white/55 sm:col-start-auto">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
