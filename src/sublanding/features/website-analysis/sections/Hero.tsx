import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, FileSearch, Lock } from 'lucide-react';
import { Accent, Band, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { HERO, SPECIMEN } from '../content';
import { UrlForm } from './UrlForm';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* A title page: the promise centred with the URL field under it, then the
   example running full width below, a homepage on the left and the profile
   written from it on the right. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="wa-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={FileSearch}>{HERO.pill}</Pill>
          </div>
          <h1
            id="wa-title"
            className="mt-6 text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.2rem] lg:text-[3.5rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p className="mt-6 text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-9 w-full max-w-[36rem] text-left motion-safe:animate-hero-rise" style={rise(0.24)}>
            <UrlForm />
          </div>
        </div>
      </div>
      <Band className="motion-safe:animate-hero-rise">
        <Specimen />
      </Band>
    </section>
  );
}

/* Passages light up one at a time, each with the field it becomes, then the
   whole profile holds before it starts again. */
function Specimen() {
  const { passages, fields, domain, brand, note } = SPECIMEN;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  // 0: nothing read; 1..n: passage n being read; n + 1: the full profile, held.
  const hold = passages.length + 1;
  const at = reduce ? hold : step;

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setStep((s) => (s >= hold ? 0 : s + 1)), step >= hold ? 3800 : step === 0 ? 900 : 1300);
    return () => clearTimeout(t);
  }, [reduce, inView, step, hold]);

  const active = at >= 1 && at < hold ? passages[at - 1].id : null;
  const filled = (id: string) => passages.findIndex((p) => p.id === id) < at;

  return (
    <figure ref={ref} className="grid lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]">
      <figcaption className="sr-only">
        {note} The page at {domain} becomes a profile: {fields.map((f) => `${f.label}: ${typeof f.value === 'string' ? f.value : f.value.join(', ')}`).join('; ')}.
      </figcaption>

      {/* ---------- the page ---------- */}
      <div aria-hidden className="bg-surface/70 p-4 sm:p-8 lg:p-10">
        <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-26px_rgba(16,24,40,0.3)]">
          <div className={cn('flex items-center gap-2 border-b px-3.5 py-2.5', LINE)}>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-ink/[0.1]" />
              ))}
            </span>
            <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-surface px-2.5 py-1 text-[0.72rem] text-muted-foreground">
              <Lock className="h-3 w-3 shrink-0" />
              <span className="truncate">{domain}</span>
            </span>
          </div>
          <div className="px-5 pb-6 pt-5 sm:px-7">
            <div className="flex items-center justify-between text-[0.72rem] text-ink/50">
              <span className="text-[0.85rem] font-semibold tracking-[-0.01em] text-ink">{brand}</span>
              <span className="hidden gap-3 min-[400px]:flex">
                <span>Features</span>
                <span>Pricing</span>
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {passages.map((p) => {
                const on = filled(p.id);
                const now = active === p.id;
                return (
                  <p
                    key={p.id}
                    className={cn(
                      'rounded-md px-1.5 py-0.5 transition-[background-color,color,box-shadow] duration-500',
                      p.as === 'h' ? 'text-[1.2rem] font-semibold leading-snug tracking-[-0.02em]' : 'text-[0.84rem] leading-relaxed',
                      p.as === 'list' && 'font-medium',
                      now ? 'bg-cta/[0.12] text-ink ring-1 ring-cta/40' : on ? 'bg-cta/[0.05] text-ink' : 'text-ink/60',
                    )}
                  >
                    {p.text}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- the hand-off ---------- */}
      <div aria-hidden className={cn('flex items-center justify-center border-y py-3 lg:border-x lg:border-y-0 lg:py-0', LINE)}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
        </span>
      </div>

      {/* ---------- the profile ---------- */}
      <div aria-hidden className="p-4 sm:p-8 lg:p-10">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Product profile</p>
        <dl className={cn('mt-4 divide-y rounded-xl border bg-white', 'divide-ink/[0.07] border-ink/[0.08]')}>
          {fields.map((f) => {
            const on = filled(f.id);
            const now = active === f.id;
            return (
              <div key={f.id} className={cn('grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-4 py-3 transition-colors duration-500', now && 'bg-cta-soft/60')}>
                <dt className="pt-0.5 text-[0.75rem] font-medium text-muted-foreground">{f.label}</dt>
                <dd className={cn('min-h-[1.4rem] text-[0.84rem] leading-snug transition-opacity duration-500', on ? 'opacity-100' : 'opacity-0')}>
                  {Array.isArray(f.value) ? (
                    <span className="flex flex-wrap gap-1.5">
                      {f.value.map((v) => (
                        <span key={v} className={cn('rounded-md px-1.5 py-0.5 text-[0.75rem] font-medium', f.id === 'competitors' ? 'bg-cta text-white' : 'bg-surface text-ink')}>
                          {v}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-ink">{f.value}</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="mt-3 text-[0.72rem] text-muted-foreground">{note}</p>
      </div>
    </figure>
  );
}
