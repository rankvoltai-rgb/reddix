import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUp, MessageSquare, ScanSearch } from 'lucide-react';
import { Accent, CTA_BUTTON, GHOST_BUTTON, LINE, Pill } from '@/components/landing/frame';
import { SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { HERO, HERO_POST } from '../content';
import { clampScore, levelFromScore, POINTS, segment, firstPass, type Kind } from '../signals';
import { LevelChip, Marked, Meter } from '../ui';

const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

export function Hero() {
  const [lead, accent] = [HERO.h1.replace(HERO.accent, '').trim(), HERO.accent];
  return (
    <section aria-labelledby="intent-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]', LINE)}>
        <div className="flex flex-col justify-center px-5 pb-12 pt-12 sm:px-10 lg:py-20 lg:pl-12 lg:pr-10">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={ScanSearch}>{HERO.pill}</Pill>
          </div>
          <h1
            id="intent-title"
            className="mt-6 text-balance text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.35rem]"
            style={rise(0.08)}
          >
            {lead} <Accent>{accent}</Accent>
          </h1>
          <p
            className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
            style={rise(0.16)}
          >
            {HERO.answer}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise" style={rise(0.24)}>
            <Link to="/auth" className={CTA_BUTTON}>
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#checker" className={cn(GHOST_BUTTON, 'group/btn h-11 px-4 text-[0.9rem]')}>
              {HERO.secondary}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
            </a>
          </div>
        </div>

        <div
          className={cn('relative overflow-hidden border-t bg-surface/70 motion-safe:animate-hero-rise lg:border-l lg:border-t-0', LINE)}
          style={rise(0.12)}
        >
          {/* A faint dot grid, so the post sits on a worktop rather than a void. */}
          <div
            aria-hidden
            className="absolute inset-0 [background-image:radial-gradient(hsl(var(--ink)/0.09)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_30%,transparent_100%)]"
          />
          <div className="relative flex h-full flex-col justify-center px-4 py-10 sm:px-10 lg:px-10 lg:py-14">
            <AnnotatedPost />
          </div>
        </div>
      </div>
    </section>
  );
}

const ROW_LABEL: Record<'competitor' | 'pricing' | 'alt', string> = {
  competitor: 'Names a competitor',
  pricing: 'Talks price',
  alt: 'Asks for an alternative',
};

/* The focal piece: the AI's score first, then each signal the scanner's rules
   find lights up in the post and adds its points, until the total settles. */
function AnnotatedPost() {
  const { title, body, aiScore, competitors, subreddit, note } = HERO_POST;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduce = useReducedMotion();

  const titleSegs = useMemo(() => segment(title, competitors), [title, competitors]);
  const bodySegs = useMemo(() => segment(body, competitors), [body, competitors]);
  const rows = useMemo(() => {
    const pass = firstPass(`${title}\n${body}`, competitors);
    if (pass.state !== 'front' && pass.state !== 'queue') return [];
    const r = pass.result;
    const found = (kind: Kind) =>
      [...titleSegs, ...bodySegs].filter((s) => s.kind === kind).map((s) => s.text);
    return (
      [
        ['competitor', r.hasCompetitor],
        ['pricing', r.hasPricingSignal],
        ['alt', r.hasAltSignal],
      ] as const
    )
      .filter(([, on]) => on)
      .map(([kind]) => ({ kind, points: POINTS[kind], phrases: [...new Set(found(kind))] }));
  }, [title, body, competitors, titleSegs, bodySegs]);

  const last = rows.length;
  const [step, setStep] = useState(0);
  const shown = reduce ? last : step;

  // Walk through the rows while the card is on screen, hold the total, repeat.
  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), step === 0 ? 1100 : step >= last ? 3600 : 1250);
    return () => clearTimeout(t);
  }, [reduce, inView, step, last]);

  const total = clampScore(aiScore + rows.slice(0, shown).reduce((a, r) => a + r.points, 0));
  const level = levelFromScore(total);
  // Phrases that add points light up with their row; the rest show throughout.
  const lit = (kind: Kind) => {
    const i = rows.findIndex((r) => r.kind === kind);
    return i === -1 || i < shown;
  };
  const final = clampScore(aiScore + rows.reduce((a, r) => a + r.points, 0));
  const summary = `Example post in ${subreddit}: “${title} ${body}” AI score ${aiScore}, ${rows.map((r) => `plus ${r.points} because it ${ROW_LABEL[r.kind].toLowerCase()}`).join(', ')}: final score ${final}, ${levelFromScore(final)}.`;

  return (
    <figure ref={ref} className="mx-auto w-full max-w-[29rem]">
      <p className="sr-only">{summary}</p>
      <div aria-hidden className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)]">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[0.75rem]">
            <SubredditIcon name={subreddit} className="h-5 w-5 text-[0.6rem]" />
            <span className="font-semibold text-ink">{subreddit}</span>
            <span className="text-muted-foreground">· 2h</span>
          </div>
          <p className="mt-2.5 text-[1rem] font-semibold leading-snug text-ink sm:text-[1.05rem]">
            <Marked segments={titleSegs} lit={lit} />
          </p>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink/65">
            <Marked segments={bodySegs} lit={lit} />
          </p>
          <p className="mt-3 flex items-center gap-3 text-[0.7rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3.5 w-3.5" />
              14
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />9 comments
            </span>
          </p>
        </div>

        {/* The ledger: how the score is built. */}
        <div className={cn('border-t bg-surface/50 px-4 py-4 sm:px-5', LINE)}>
          <dl className="space-y-2 text-[0.8rem]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">AI score against your product</dt>
              <dd className="font-semibold tabular-nums text-ink">{aiScore}</dd>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.kind}
                className={cn(
                  'flex items-center justify-between gap-3 transition-[opacity,transform] duration-500',
                  i < shown ? 'opacity-100' : 'translate-x-1 opacity-25',
                )}
              >
                <dt className="min-w-0 truncate text-ink/80">
                  {ROW_LABEL[r.kind]}
                  <span className="text-muted-foreground"> · {r.phrases.join(', ')}</span>
                </dt>
                <dd className="font-semibold tabular-nums text-cta">+{r.points}</dd>
              </div>
            ))}
          </dl>
          <div className={cn('mt-3.5 border-t pt-3.5', LINE)}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.8rem] font-semibold text-ink">Final score</span>
              <span className="flex items-center gap-2.5">
                <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                  {total}
                </span>
                <LevelChip level={level} />
              </span>
            </div>
            <Meter score={total} level={level} className="mt-3" />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.72rem] text-muted-foreground">{note}</figcaption>
    </figure>
  );
}
