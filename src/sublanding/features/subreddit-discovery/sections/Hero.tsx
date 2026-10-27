import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Compass } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { Reveal, SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { EXAMPLE, HERO } from '../content';
import { ActivityTag } from '../ui';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* An editorial masthead: the headline across the left, the answer and the
   action set low on the right. Under it, the example as a map in three tiers. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="sd-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl gap-8 border-x px-5 pb-12 pt-12 sm:px-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-14 lg:px-12 lg:pb-16 lg:pt-20', LINE)}>
        <div>
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Compass}>{HERO.pill}</Pill>
          </div>
          <h1
            id="sd-title"
            className="mt-6 text-balance text-[2.25rem] font-medium leading-[1.06] tracking-[-0.038em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.3rem] lg:text-[3.85rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="motion-safe:animate-hero-rise lg:pb-2" style={rise(0.18)}>
          <p className="text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]">{HERO.answer}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#planner" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
      <TierMap />
    </section>
  );
}

/* Seven suggestions, filed by tier, best first within each. */
function TierMap() {
  return (
    <div role="group" aria-labelledby="sd-example">
      <Band inner="grid md:grid-cols-3">
        {EXAMPLE.tiers.map((tier, t) => {
          const rows = EXAMPLE.suggestions.filter((s) => s.tier === tier.id);
          return (
            <div key={tier.id} className={cn('min-w-0 border-b md:border-b-0', t > 0 && 'md:border-l', LINE)}>
              <div className={cn('flex items-baseline justify-between gap-3 border-b bg-surface/70 px-5 py-3.5 sm:px-6', LINE)}>
                <span className="text-[0.8rem] font-semibold text-ink">{tier.name}</span>
                <span className="truncate text-[0.72rem] text-muted-foreground">{tier.body}</span>
              </div>
              <ul className="divide-y divide-ink/[0.06]">
                {rows.map((s, i) => (
                  <li key={s.name}>
                    <Reveal delay={0.25 + t * 0.12 + i * 0.08} y={8} className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <SubredditIcon name={s.name} className="h-6 w-6 text-[0.65rem]" />
                        <span className="min-w-0 flex-1 truncate text-[0.9rem] font-semibold text-ink">r/{s.name}</span>
                        <span className="text-[0.95rem] font-semibold tabular-nums text-ink">{s.score}</span>
                      </div>
                      {/* The relevance score as a bar, so the tiers read at a glance. */}
                      <div aria-hidden className="mt-2.5 h-1 rounded-full bg-ink/[0.05]">
                        <div className={cn('h-full rounded-full', tier.id === 'primary' ? 'bg-cta' : tier.id === 'secondary' ? 'bg-cta/55' : 'bg-cta/30')} style={{ width: `${s.score}%` }} />
                      </div>
                      <p className="mt-2.5 text-[0.8rem] leading-relaxed text-muted-foreground">{s.reason}</p>
                      <ActivityTag activity={s.activity} className="mt-2" />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Band>
      <Band inner="px-6 py-3 text-center text-[0.75rem] text-muted-foreground sm:px-10">
        <p id="sd-example">{EXAMPLE.note}</p>
      </Band>
    </div>
  );
}
