import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Globe, Split } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, HERO, SPLIT } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* A wide, left-set headline, then the fork: one shared first step on the
   left, splitting into two paths on the right. The page's argument in one
   diagram: same start, different rhythm. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="rl-title" className="relative bg-white pt-16">
      <Band inner="px-5 pb-10 pt-14 sm:px-10 lg:px-12 lg:pb-12 lg:pt-20">
        <div className="motion-safe:animate-hero-rise" style={rise(0)}>
          <Pill icon={Split}>{HERO.pill}</Pill>
        </div>
        <h1
          id="rl-title"
          className="mt-6 max-w-5xl text-balance text-[2.2rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.2rem] lg:text-[3.7rem]"
          style={rise(0.08)}
        >
          {lead} <Accent>{HERO.accent}</Accent>
        </h1>
        <div className="mt-7 grid gap-6 motion-safe:animate-hero-rise lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end" style={rise(0.16)}>
          <p className="max-w-[44rem] text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]">{HERO.answer}</p>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#day" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid motion-safe:animate-hero-rise lg:grid-cols-[minmax(0,0.9fr)_3.5rem_minmax(0,1.3fr)]" style={rise(0.26)}>
          <div className={cn('flex flex-col justify-center border-b bg-surface/70 px-6 py-8 sm:px-10 lg:border-b-0 lg:px-10', LINE)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink">
              <Globe className="h-4 w-4" />
            </span>
            <p className="mt-4 text-[1.02rem] font-semibold text-ink">{SPLIT.shared.title}</p>
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">{SPLIT.shared.body}</p>
          </div>
          {/* The fork, drawn: one line in, two out. */}
          <div aria-hidden className={cn('relative hidden border-x lg:block', LINE)}>
            <svg viewBox="0 0 56 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 100 C 28 100, 28 50, 56 50" fill="none" stroke="hsl(var(--ink) / 0.25)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path d="M0 100 C 28 100, 28 150, 56 150" fill="none" stroke="hsl(var(--cta))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="grid">
            <Path title={SPLIT.them.title} body={SPLIT.them.body} />
            <Path title={SPLIT.reddix.title} body={SPLIT.reddix.body} red />
          </div>
        </div>
      </Band>
      <Band inner="px-5 py-3 text-[0.75rem] text-muted-foreground sm:px-10 lg:px-12">
        {CHECKED}, from each vendor’s own pages.{' '}
        <a href="#sources" className="underline decoration-ink/20 underline-offset-2 hover:text-ink">
          Sources
        </a>
      </Band>
    </section>
  );
}

function Path({ title, body, red }: { title: string; body: string; red?: boolean }) {
  return (
    <div className={cn('px-6 py-7 sm:px-10', red ? 'bg-cta-soft/40' : cn('border-b', LINE))}>
      <p className={cn('flex items-center gap-2 text-[1rem] font-semibold', red ? 'text-cta' : 'text-ink')}>
        <span aria-hidden className={cn('h-2 w-2 rounded-full', red ? 'bg-cta' : 'bg-ink/40')} />
        {title}
      </p>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/75">{body}</p>
    </div>
  );
}
