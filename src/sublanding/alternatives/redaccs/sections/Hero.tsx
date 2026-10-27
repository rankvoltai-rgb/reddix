import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radar, ShoppingBag, Store } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BUSINESSES, CATALOGUE, HERO } from '../content';
import { Ref } from './Ref';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* The question on the left; REDAccs' own price list on the right, set like a
   shop's board, so what's for sale is the first thing you see. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="rc-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]', LINE)}>
        <div className="flex flex-col justify-center px-5 pb-12 pt-12 sm:px-10 lg:py-20 lg:pl-12 lg:pr-10">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={ShoppingBag}>{HERO.pill}</Pill>
          </div>
          <h1
            id="rc-title"
            className="mt-6 text-balance text-[2.15rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3rem] lg:text-[3.2rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p className="mt-6 max-w-[35rem] text-[1.03rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-8 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className={cn('border-t bg-surface/70 px-4 py-10 motion-safe:animate-hero-rise sm:px-10 lg:border-l lg:border-t-0 lg:py-14', LINE)} style={rise(0.12)}>
          <div className="mx-auto max-w-[27rem] rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-26px_rgba(16,24,40,0.3)]">
            <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/[0.12] px-5 py-4">
              <h2 className="text-[0.95rem] font-semibold text-ink">{CATALOGUE.title}</h2>
              <span className="text-[0.72rem] text-muted-foreground">{HERO.checked}</span>
            </div>
            <ul className="divide-y divide-dashed divide-ink/[0.1] px-5">
              {CATALOGUE.lines.map((l) => (
                <li key={l.item} className="flex items-start justify-between gap-4 py-3.5">
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-medium text-ink">
                      {l.item}
                      <Ref id={l.src} />
                    </span>
                    <span className="mt-0.5 block text-[0.76rem] leading-snug text-muted-foreground">{l.detail}</span>
                  </span>
                  <span className="shrink-0 text-right text-[0.9rem] font-semibold tabular-nums text-ink">{l.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Two panels: what the marketplace sells, what the lead finder does. */
export function Businesses() {
  const panels = [
    { ...BUSINESSES.market, icon: Store, tag: 'Most of the site' },
    { ...BUSINESSES.finder, icon: Radar, tag: 'Since February 2026' },
  ];
  return (
    <section aria-labelledby="rc-biz">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={Store}>{BUSINESSES.pill}</Pill>
        <h2 id="rc-biz" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {BUSINESSES.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{BUSINESSES.body}</p>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {panels.map((p, i) => (
          <div key={p.name} className={cn('px-6 py-8 sm:px-10 lg:px-12 lg:py-10', i === 1 && cn('border-t bg-surface/50 md:border-l md:border-t-0', LINE))}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[1.2rem] font-semibold tracking-[-0.015em] text-ink">
                <p.icon className="h-4 w-4 text-cta" />
                {p.name}
              </h3>
              <span className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-[0.7rem] font-semibold text-ink/60">{p.tag}</span>
            </div>
            <dl className="mt-6 space-y-5">
              {p.items.map((it, j) => (
                <Reveal key={it.title} delay={j * 0.04}>
                  <dt className="text-[0.92rem] font-semibold text-ink">{it.title}</dt>
                  <dd className="mt-1 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {it.text}
                    <Ref id={it.src} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        ))}
      </Band>
    </section>
  );
}
