import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CalendarCheck } from 'lucide-react';
import { Accent, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { GLANCE, HERO } from '../content';
import { Ref } from './Ref';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Centred question, then the answer laid out as a two-column ledger: what
   you'd buy from each, row by row, before any argument starts. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="ra-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl overflow-hidden border-x', LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(hsl(var(--ink)/0.045)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--ink)/0.045)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_30%,#000_20%,transparent_80%)]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-20">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Bot}>{HERO.pill}</Pill>
          </div>
          <h1
            id="ra-title"
            className="mt-6 text-balance text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.2rem] lg:text-[3.6rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <p className="mt-6 text-balance text-[1.03rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]" style={rise(0.16)}>
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-dashed border-ink/[0.14] px-3.5 text-[0.82rem] text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5" />
              {HERO.checked}
            </span>
          </div>
        </div>
      </div>

      <Glance />
    </section>
  );
}

function Glance() {
  return (
    <div className={cn('border-t', LINE)}>
      <div className={cn('mx-auto max-w-6xl border-x', LINE)}>
        <h2 className="sr-only">{GLANCE.title}</h2>
        <table className="w-full table-fixed border-collapse text-left text-[0.9rem]">
          <caption className="sr-only">Redditor AI and Reddix compared, checked October 2026</caption>
          <thead>
            <tr className={cn('border-b', LINE)}>
              <th scope="col" className="hidden w-[22%] px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:table-cell lg:px-12">
                {GLANCE.title}
              </th>
              <th scope="col" className={cn('px-4 py-4 text-[0.95rem] font-semibold text-ink sm:px-6 md:border-l', LINE)}>
                Redditor AI
                <span className="mt-0.5 block text-[0.75rem] font-normal text-muted-foreground">The vendor posts</span>
              </th>
              <th scope="col" className={cn('border-l bg-cta-soft/40 px-4 py-4 text-[0.95rem] font-semibold text-ink sm:px-6', LINE)}>
                Reddix
                <span className="mt-0.5 block text-[0.75rem] font-normal text-muted-foreground">You post</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {GLANCE.rows.map((r) => (
              <tr key={r.label} className={cn('border-b align-top last:border-b-0', LINE)}>
                <th scope="row" className="hidden px-6 py-4 font-medium text-ink md:table-cell lg:px-12">
                  {r.label}
                </th>
                <td className={cn('px-4 py-4 leading-relaxed text-ink/80 sm:px-6 md:border-l', LINE)}>
                  <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:hidden">{r.label}</span>
                  {r.them}
                  <Ref id={r.src} />
                </td>
                <td className={cn('border-l bg-cta-soft/40 px-4 py-4 leading-relaxed text-ink sm:px-6', LINE)}>
                  <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-transparent md:hidden" aria-hidden>
                    {r.label}
                  </span>
                  {r.us}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
