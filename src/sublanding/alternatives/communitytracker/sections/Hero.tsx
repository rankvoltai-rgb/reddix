import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Network } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, COVERAGE, HERO, PLANS, PLATFORMS } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;
const planName = (id: string) => PLANS.find((p) => p.id === id)?.name ?? id;

/* The headline and the answer side by side, then the coverage strip: ten
   community chips on one row, a single Reddit chip on the next, and what
   Reddix does with it. Breadth against depth, before any reading. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="ct-title" className="relative bg-white pt-16">
      <Band inner="grid gap-8 px-5 pb-12 pt-14 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-14 lg:px-12 lg:pb-14 lg:pt-20">
        <div>
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Network}>{HERO.pill}</Pill>
          </div>
          <h1
            id="ct-title"
            className="mt-6 text-balance text-[2.2rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.1rem] lg:text-[3.4rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="motion-safe:animate-hero-rise" style={rise(0.16)}>
          <p className="text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">{HERO.answer}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#calculator" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </Band>

      <Band>
        <div className="motion-safe:animate-hero-rise" style={rise(0.26)}>
          <Row label={COVERAGE.them.label} note={COVERAGE.them.note}>
            <ul className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <li
                  key={p.name}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[0.82rem] font-medium',
                    p.name === 'Reddit' ? 'border-ink/20 bg-white text-ink' : 'border-ink/[0.08] bg-surface text-ink/70',
                  )}
                >
                  {p.name}
                  <span className="rounded bg-ink/[0.06] px-1 text-[0.62rem] font-semibold uppercase tracking-[0.04em] text-ink/45">{planName(p.from)}+</span>
                </li>
              ))}
            </ul>
          </Row>
          <Row label={COVERAGE.reddix.label} note={COVERAGE.reddix.note} red>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="inline-flex h-8 w-fit items-center rounded-lg border border-cta/40 bg-cta-soft px-3 text-[0.82rem] font-semibold text-cta-deep">Reddit</span>
              <ul className="grid gap-x-6 gap-y-1.5 text-[0.84rem] text-ink/75 sm:grid-cols-2">
                {COVERAGE.reddix.depth.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span aria-hidden className="mt-[0.5rem] h-1 w-3 shrink-0 rounded-full bg-cta/50" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </div>
      </Band>
      <Band inner="px-5 py-3 text-[0.75rem] text-muted-foreground sm:px-10 lg:px-12">
        {CHECKED}, from each vendor’s own pages. Plan labels show the first CommunityTracker plan that includes each community.{' '}
        <a href="#sources" className="underline decoration-ink/20 underline-offset-2 hover:text-ink">
          Sources
        </a>
      </Band>
    </section>
  );
}

function Row({ label, note, red, children }: { label: string; note: string; red?: boolean; children: ReactNode }) {
  return (
    <div className={cn('grid gap-4 border-b px-5 py-6 last:border-b-0 sm:px-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:px-12', LINE, red && 'bg-surface/50')}>
      <div>
        <p className={cn('text-[0.95rem] font-semibold', red ? 'text-cta' : 'text-ink')}>{label}</p>
        <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{note}</p>
      </div>
      {children}
    </div>
  );
}
