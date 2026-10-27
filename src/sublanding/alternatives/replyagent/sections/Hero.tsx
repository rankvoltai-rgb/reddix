import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserRound, Users } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, HERO, LANES } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Question, lanes, answer: the H1 asks, the frame splits into two lanes
   (surface for "you post", ink for "their accounts post"), and the answer
   with the action sits underneath. Reddix sits only in the first lane. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="hero-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="px-5 pb-10 pt-12 sm:px-10 lg:px-12 lg:pb-12 lg:pt-16">
          <p className="text-[0.8rem] font-medium text-muted-foreground motion-safe:animate-hero-rise" style={rise(0)}>
            {HERO.pill}
          </p>
          <h1
            id="hero-title"
            className="mt-4 max-w-4xl text-balance text-[2.4rem] font-medium leading-[1.04] tracking-[-0.04em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.7rem] sm:text-[3.6rem] lg:text-[4.2rem]"
            style={rise(0.06)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
        </div>

        <div className={cn('grid border-t motion-safe:animate-hero-rise md:grid-cols-2', LINE)} style={rise(0.14)}>
          <Lane lane={LANES.you} icon={<UserRound className="h-4 w-4" />} />
          <Lane lane={LANES.them} icon={<Users className="h-4 w-4" />} dark />
        </div>

        <div
          className={cn('grid gap-6 border-t px-5 py-9 motion-safe:animate-hero-rise sm:px-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center lg:px-12', LINE)}
          style={rise(0.22)}
        >
          <p className="text-[1.02rem] leading-relaxed text-ink/75">{HERO.answer}</p>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="text-[0.78rem] text-muted-foreground">ReplyAgent facts checked {CHECKED}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lane({ lane, icon, dark = false }: { lane: (typeof LANES)['you']; icon: ReactNode; dark?: boolean }) {
  return (
    <div className={cn('px-6 py-9 sm:px-10 lg:px-12', dark ? 'bg-ink text-white' : 'bg-surface/60')}>
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', dark ? 'bg-white/10 text-white' : 'bg-cta-soft text-cta')}>{icon}</span>
      <h2 className={cn('mt-4 text-[1.3rem] font-semibold tracking-[-0.02em]', dark ? 'text-white' : 'text-ink')}>{lane.title}</h2>
      <p className={cn('mt-1 text-[0.82rem] font-medium', dark ? 'text-white/60' : 'text-cta')}>{lane.who}</p>
      <ul className="mt-5 space-y-2.5">
        {lane.points.map((p) => (
          <li key={p} className={cn('flex gap-3 text-[0.92rem] leading-snug', dark ? 'text-white/80' : 'text-ink/80')}>
            <span aria-hidden className={cn('mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full', dark ? 'bg-white/40' : 'bg-cta')} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
