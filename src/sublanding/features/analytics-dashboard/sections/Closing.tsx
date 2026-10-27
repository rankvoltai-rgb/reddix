import { Link } from 'react-router-dom';
import { ArrowRight, Award, CircleSlash, Flame, Sparkles, Star, Trophy, Zap, type LucideIcon } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, SectionHead, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BADGES, FAQ, NEXT, NOT_HERE } from '../content';

const BADGE_ICONS: LucideIcon[] = [Flame, Sparkles, Star, Zap, Trophy];

/* The five badges as stops on one track, numbers above, names below. */
export function Badges() {
  return (
    <section aria-labelledby="badges-title">
      <SectionHead icon={Award} eyebrow={BADGES.pill} title={<span id="badges-title">{BADGES.title}</span>} subtitle={BADGES.body} />
      <Band inner="px-5 py-12 sm:px-10 lg:px-16">
        <ol className="relative grid grid-cols-5 gap-2">
          <span aria-hidden className="absolute left-[10%] right-[10%] top-[2.6rem] h-px bg-ink/[0.12]" />
          {BADGES.list.map((b, i) => {
            const Icon = BADGE_ICONS[i];
            return (
              <li key={b.name} className="relative flex flex-col items-center text-center">
                <Reveal delay={i * 0.06} className="flex flex-col items-center">
                  <span className="text-[0.8rem] font-semibold tabular-nums text-cta">{b.threshold}</span>
                  <span className="relative z-10 mt-2 flex h-10 w-10 items-center justify-center rounded-xl border border-cta/30 bg-cta-soft text-cta sm:h-12 sm:w-12">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className="mt-3 text-[0.72rem] font-semibold leading-tight text-ink sm:text-[0.85rem]">{b.name}</span>
                  <span className="mt-0.5 hidden text-[0.7rem] text-muted-foreground sm:block">
                    {b.threshold} engaged lead{b.threshold > 1 ? 's' : ''}
                  </span>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
    </section>
  );
}

/* Five limits, five cells in a row. */
export function NotHere() {
  return (
    <section aria-labelledby="not-here-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={CircleSlash}>{NOT_HERE.pill}</Pill>
        <h2 id="not-here-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {NOT_HERE.title}
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-5">
          {NOT_HERE.items.map((item, i) => (
            <li key={item.title} className={CELL}>
              <Reveal delay={i * 0.05} className="h-full p-6">
                <span aria-hidden className="block h-px w-6 bg-cta" />
                <h3 className="mt-4 text-[0.98rem] font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* One centred column, a large numeral beside each question. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-title" className={cn('text-center', SECTION_TITLE)}>
            Dashboard questions
          </h2>
          <dl className={cn('mt-10 border-t', LINE)}>
            {FAQ.map((f, i) => (
              <div key={f.q} className={cn('grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)]', LINE)}>
                <span aria-hidden className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink/15 sm:text-[2rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</dt>
                  <dd className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* Split close: the ask on the left, the action and related pages on the right. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="bg-cta-soft px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
          <h2 id="close-title" className="max-w-lg text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {NEXT.title}
          </h2>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink/70">{NEXT.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
            {NEXT.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ul className={cn('divide-y divide-ink/[0.07] border-t lg:border-l lg:border-t-0', LINE)}>
          {NEXT.links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="group flex items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-surface/60 sm:px-10">
                <span>
                  <span className="block text-[0.98rem] font-semibold text-ink">{l.title}</span>
                  <span className="mt-1 block text-[0.84rem] text-muted-foreground">{l.body}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
              </Link>
            </li>
          ))}
        </ul>
      </Band>
      <Spacer closing />
    </section>
  );
}
