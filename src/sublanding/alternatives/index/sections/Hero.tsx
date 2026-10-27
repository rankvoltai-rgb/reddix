import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Compass } from 'lucide-react';
import { Accent, CTA_BUTTON, GHOST_BUTTON, LINE as RULE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { HERO } from '../content';
import { REDDIX_ROW, STOPS, TOOLS } from '../directory';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

export function Hero() {
  const [before, after] = HERO.h1.split(HERO.accent);
  return (
    <section aria-labelledby="alt-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', RULE)}>
        <div className="grid gap-8 px-5 pb-12 pt-12 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-14 lg:px-12 lg:pb-14 lg:pt-20">
          <div>
            <div className="motion-safe:animate-hero-rise" style={rise(0)}>
              <Pill icon={Compass}>{HERO.pill}</Pill>
            </div>
            <h1
              id="alt-title"
              className="mt-6 text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.1rem] lg:text-[3.4rem]"
              style={rise(0.08)}
            >
              {before}
              <Accent>{HERO.accent}</Accent>
              {after}
            </h1>
          </div>
          <div className="motion-safe:animate-hero-rise" style={rise(0.16)}>
            <p className="text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]">{HERO.answer}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/auth" className={CTA_BUTTON}>
                {HERO.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#finder" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
                {HERO.secondary}
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
              </a>
            </div>
            <p className="mt-4 text-[0.78rem] text-muted-foreground">{HERO.checked}</p>
          </div>
        </div>
        <TheLine />
      </div>
    </section>
  );
}

/* Every tool placed on one line, from "watches" to "sells engagement". The
   track's red deepens to the right: more of what's said in your name is out
   of your hands. */
function TheLine() {
  const live = TOOLS.filter((t) => !t.gone);
  return (
    <figure className={cn('border-t bg-surface/60 motion-safe:animate-hero-rise', RULE)} style={rise(0.24)}>
      <figcaption className="sr-only">
        Reddit lead tools placed by what they do on Reddit, from watching to selling engagement.
      </figcaption>
      <ol className="grid sm:grid-cols-5">
        {STOPS.map((s, i) => {
          const here = live.filter((t) => t.stop === s.id);
          return (
            <li key={s.id} className={cn('relative border-b px-5 pb-6 pt-5 sm:border-b-0 sm:px-4 lg:px-5', i > 0 && 'sm:border-l', RULE)}>
              {/* The track: a segment per stop, deeper red to the right. */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `hsl(var(--cta) / ${0.15 + i * 0.2})` }} />
              <p className="flex items-baseline gap-2">
                <span className="text-[0.7rem] font-semibold tabular-nums text-cta">0{i + 1}</span>
                <span className="text-[0.95rem] font-semibold text-ink">{s.name}</span>
              </p>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted-foreground">{s.line}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.id === REDDIX_ROW.stop && (
                  <li>
                    <span className="inline-flex h-7 items-center rounded-md bg-cta px-2 text-[0.75rem] font-semibold text-white">Reddix</span>
                  </li>
                )}
                {here.map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={`/alternatives/${t.slug}`}
                      className="inline-flex h-7 items-center rounded-md border border-ink/[0.1] bg-white px-2 text-[0.75rem] font-medium text-ink/80 transition-colors hover:border-cta/40 hover:text-cta"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
