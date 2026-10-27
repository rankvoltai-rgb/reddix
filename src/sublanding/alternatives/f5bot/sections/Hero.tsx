import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Facts a reader can act on before scrolling: what each watches, what each
   costs for a business. */
const GLANCE = [
  { label: 'F5Bot watches', value: 'Reddit, Hacker News, Lobsters' },
  { label: 'Reddix watches', value: REDDIX.platforms.join(', ') },
  { label: 'F5Bot for business', value: 'From $49.99/mo (Gold)' },
  { label: 'Reddix', value: `$${REDDIX.pricing.premium.price}/mo or $${REDDIX.pricing.lifetime.price} once` },
];

/* An editorial split: the verdict as the headline on the left, the plain
   answer and the action on the right, then the facts at a glance. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="f5-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]', LINE)}>
        <div className="px-5 pb-8 pt-12 sm:px-10 lg:pb-16 lg:pl-12 lg:pr-8 lg:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Bell}>{HERO.pill}</Pill>
          </div>
          <h1
            id="f5-title"
            className="mt-6 text-balance text-[2.2rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.6rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="flex flex-col justify-end px-5 pb-12 sm:px-10 lg:pb-16 lg:pl-4 lg:pr-12 lg:pt-20">
          <p className="text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.05rem]" style={rise(0.16)}>
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
      <div className={cn('border-t', LINE)}>
        <dl className={cn('mx-auto grid max-w-6xl grid-cols-2 border-x lg:grid-cols-4', LINE)}>
          {GLANCE.map((g, i) => (
            <div
              key={g.label}
              className={cn(
                'border-ink/[0.07] px-5 py-5 sm:px-8 lg:px-10',
                i % 2 === 0 && 'border-r',
                i < 2 && 'border-b lg:border-b-0',
                i === 1 && 'lg:border-r',
                i === 2 && 'lg:border-r',
              )}
            >
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{g.label}</dt>
              <dd className="mt-1.5 text-[0.95rem] font-semibold leading-snug text-ink">{g.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
