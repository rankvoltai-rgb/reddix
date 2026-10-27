import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, CalendarX2 } from 'lucide-react';
import { Accent, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { DATES, HERO } from '../content';
import { daysUntilShutdown, formatDay, railProgress, urgency } from '../dates';
import { useToday } from '../useToday';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred copy over a full-width shutdown clock: days left, and a rail from
   the day sign-ups closed to the day the data goes. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="gs-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="flex flex-col items-center px-5 pb-12 pt-14 text-center sm:px-8 sm:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={CalendarX2}>{HERO.pill}</Pill>
          </div>
          <h1
            id="gs-title"
            className="mt-6 max-w-4xl text-balance text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.75rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p
            className="mx-auto mt-6 max-w-[44rem] text-[1.03rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
            style={rise(0.16)}
          >
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#checklist" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
      <ShutdownClock />
    </section>
  );
}

const TONE = {
  calm: 'text-ink',
  soon: 'text-cta',
  urgent: 'text-cta',
  gone: 'text-ink/50',
} as const;

function ShutdownClock() {
  const now = useToday();
  const days = daysUntilShutdown(now);
  const state = urgency(days);
  const progress = railProgress(now);

  const headline =
    state === 'gone'
      ? days === 0
        ? 'Today'
        : 'Shut down'
      : `${days}`;
  const caption =
    state === 'gone'
      ? days === 0
        ? 'GummySearch shuts down and deletes user data today.'
        : `GummySearch shut down on ${formatDay(DATES.shutdown)} and its user data was deleted.`
      : `${days === 1 ? 'day' : 'days'} until GummySearch shuts down and deletes all user data.`;

  return (
    <div className={cn('border-t', LINE)}>
      <div className={cn('mx-auto grid max-w-6xl border-x md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]', LINE)}>
        <div className={cn('flex flex-col justify-center border-b bg-surface/70 px-6 py-7 md:border-b-0 md:border-r sm:px-10', LINE)}>
          <p className={cn('text-[3.4rem] font-semibold leading-none tracking-[-0.05em] tabular-nums', TONE[state])}>{headline}</p>
          <p className="mt-2.5 text-[0.85rem] leading-snug text-muted-foreground">{caption}</p>
        </div>
        <div className="px-6 py-7 sm:px-10">
          <div className="flex items-baseline justify-between gap-4 text-[0.75rem] text-muted-foreground">
            <span>
              <span className="font-semibold text-ink">{formatDay(DATES.closed)}</span>
              <span className="hidden sm:inline"> · closed to new users</span>
            </span>
            <span className="text-right">
              <span className="font-semibold text-ink">{formatDay(DATES.shutdown)}</span>
              <span className="hidden sm:inline"> · shutdown, data deleted</span>
            </span>
          </div>
          {/* The closed year as a rail; the filled part is time already gone. */}
          <div className="relative mt-4 h-3 rounded-full bg-ink/[0.06]" role="img" aria-label={`${Math.round(progress * 100)}% of the closed period has passed`}>
            <div className={cn('absolute inset-y-0 left-0 rounded-full', state === 'gone' ? 'bg-ink/25' : 'bg-cta')} style={{ width: `${progress * 100}%` }} />
            <span
              aria-hidden
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-ink shadow-[0_1px_3px_rgba(16,24,40,0.3)]"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.75rem] text-muted-foreground">
            <span>Today: {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>GummySearch facts checked {CHECKED_LABEL}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
