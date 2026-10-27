import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { DOSSIER, HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* The headline and answer on the left; on the right, the facts a buyer needs
   about Brandwatch, as a ruled fact sheet with its check date. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="bw-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]', LINE)}>
        <div className="px-5 pb-12 pt-12 sm:px-10 lg:py-20 lg:pl-12 lg:pr-10">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Building2}>{HERO.pill}</Pill>
          </div>
          <h1
            id="bw-title"
            className="mt-6 text-balance text-[2.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.4rem] sm:text-[2.9rem] lg:text-[3.15rem]"
            style={rise(0.08)}
          >
            {lead} <span className="font-[700] text-cta">{HERO.accent}</span>
          </h1>
          <p className="mt-6 max-w-[36rem] text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.05rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-8 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <div className={cn('flex items-center border-t bg-surface/70 px-5 py-10 motion-safe:animate-hero-rise sm:px-10 lg:border-l lg:border-t-0', LINE)} style={rise(0.12)}>
          <figure className="w-full rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-26px_rgba(16,24,40,0.3)]">
            <figcaption className={cn('flex items-center justify-between gap-3 border-b px-5 py-3.5', LINE)}>
              <span className="text-[0.9rem] font-semibold text-ink">Brandwatch at a glance</span>
              <span className="text-[0.7rem] font-medium text-muted-foreground">Checked {CHECKED_LABEL}</span>
            </figcaption>
            <dl className="divide-y divide-ink/[0.06]">
              {DOSSIER.map((d) => (
                <div key={d.k} className="grid gap-1 px-5 py-3 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="text-[0.75rem] font-semibold text-muted-foreground">{d.k}</dt>
                  <dd className="text-[0.86rem] leading-relaxed text-ink">{d.v}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </div>
    </section>
  );
}
