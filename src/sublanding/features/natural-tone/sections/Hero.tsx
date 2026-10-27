import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Feather, X } from 'lucide-react';
import { Accent, Band, CTA_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { COMPARE, HERO } from '../content';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* Editorial: a wide left-set headline, the answer and the action on one line
   under it, then the argument itself, an ad and a reply side by side. */
export function Hero() {
  const lead = HERO.h1.replace(HERO.accent, '').trim();
  return (
    <section aria-labelledby="tone-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <div className="px-5 pb-12 pt-12 sm:px-10 sm:pb-14 sm:pt-16 lg:px-12">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Feather}>{HERO.pill}</Pill>
          </div>
          <h1
            id="tone-title"
            className="mt-6 max-w-[52rem] text-balance text-[2.3rem] font-medium leading-[1.06] tracking-[-0.038em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{HERO.accent}</Accent>
          </h1>
          <div className="mt-8 grid gap-7 motion-safe:animate-hero-rise lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12" style={rise(0.16)}>
            <p className="max-w-[42rem] text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.12rem]">{HERO.answer}</p>
            <Link to="/auth" className={cn(CTA_BUTTON, 'w-fit')}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <Band inner="motion-safe:animate-hero-rise" className="[--rise-delay:0.26s]">
        <p className={cn('border-b px-5 py-3 text-[0.78rem] text-muted-foreground sm:px-10 lg:px-12', LINE)}>
          In reply to <span className="font-medium text-ink/80">{COMPARE.post}</span>
        </p>
        <div className="grid md:grid-cols-2">
          {/* The ad, greyed and faulted. */}
          <figure className="min-w-0 bg-surface/70 px-5 py-8 sm:px-10 lg:px-12">
            <figcaption className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink/50">
              <X className="h-3.5 w-3.5" />
              {COMPARE.ad.label}
            </figcaption>
            <p className="mt-4 rounded-xl border border-dashed border-ink/[0.14] bg-white/60 p-4 text-[0.95rem] leading-relaxed text-ink/45 sm:p-5">
              {COMPARE.ad.text}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {COMPARE.ad.faults.map((f) => (
                <li key={f} className="rounded-md bg-ink/[0.06] px-2 py-1 text-[0.72rem] font-medium text-ink/60">
                  {f}
                </li>
              ))}
            </ul>
          </figure>

          {/* The reply, each part tagged with the rule it follows. */}
          <figure className={cn('min-w-0 border-t px-5 py-8 sm:px-10 md:border-l md:border-t-0 lg:px-12', LINE)}>
            <figcaption className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-cta">
              <Feather className="h-3.5 w-3.5" />
              {COMPARE.reply.label}
            </figcaption>
            <div className="mt-4 rounded-xl border border-ink/[0.08] bg-white p-4 text-[0.95rem] leading-[1.75] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.3)] sm:p-5">
              <p>
                {COMPARE.reply.parts.map((p, i) => (
                  <span key={i}>
                    {p.text}
                    <RuleTag n={p.rule} delay={0.6 + i * 0.25} />
                  </span>
                ))}
                <RuleTag n={4} delay={0.6 + COMPARE.reply.parts.length * 0.25} />
              </p>
              <p className="mt-2 font-medium text-cta-deep">
                {COMPARE.reply.link}
                <RuleTag n={6} delay={0.6 + (COMPARE.reply.parts.length + 1) * 0.25} />
              </p>
            </div>
            <p className="mt-4 text-[0.75rem] text-muted-foreground">Numbers point to the rules below. {COMPARE.note}</p>
          </figure>
        </div>
      </Band>
    </section>
  );
}

function RuleTag({ n, delay }: { n: number; delay: number }) {
  return (
    <motion.a
      href={`#rule-${n}`}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      aria-label={`Rule ${n}`}
      className="relative -top-[0.55em] ml-1 inline-flex h-[1.15rem] w-[1.15rem] items-center justify-center rounded-full bg-cta align-baseline text-[0.62rem] font-semibold leading-none text-white no-underline transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
    >
      {n}
    </motion.a>
  );
}
