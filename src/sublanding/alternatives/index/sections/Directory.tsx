import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, CircleSlash } from 'lucide-react';
import { Band, CELL, CellGrid, LINE as RULE, Pill, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { ALSO_SECTION, DIRECTORY, GONE } from '../content';
import { ALSO, STOPS, TOOLS } from '../directory';

/* The live tools, grouped by stop on the line; then the ones that left
   Reddit; then the ones not compared yet. */
export function Directory() {
  const live = TOOLS.filter((t) => !t.gone);
  return (
    <section aria-labelledby="directory-title">
      <SectionHead icon={BookOpen} eyebrow={DIRECTORY.pill} title={<span id="directory-title">{DIRECTORY.title}</span>} subtitle={DIRECTORY.body} />
      {STOPS.map((s, i) => {
        const here = live.filter((t) => t.stop === s.id);
        if (!here.length) return null;
        return (
          <Band key={s.id} inner="grid lg:grid-cols-[14rem_minmax(0,1fr)]">
            <div className={cn('border-b px-6 py-5 sm:px-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-7', RULE)}>
              <p className="text-[0.7rem] font-semibold tabular-nums text-cta">0{i + 1}</p>
              <h3 className="mt-1 text-[1.05rem] font-semibold text-ink">{s.name}</h3>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">{s.line}</p>
            </div>
            <ul className="divide-y divide-ink/[0.07]">
              {here.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/alternatives/${t.slug}`}
                    className="group grid gap-1.5 px-6 py-5 transition-colors hover:bg-surface/60 sm:grid-cols-[10rem_minmax(0,1fr)_13rem] sm:items-baseline sm:gap-5 sm:px-10 lg:px-8"
                  >
                    <span className="flex items-center gap-1.5 text-[0.98rem] font-semibold text-ink">
                      {t.name}
                      <ArrowRight className="h-3.5 w-3.5 text-ink/25 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                    </span>
                    <span className="text-[0.88rem] leading-relaxed text-muted-foreground">
                      {t.what}
                      {t.reddit === 'among others' && <span className="text-ink/60"> Covers more than Reddit.</span>}
                    </span>
                    <span className="text-[0.8rem] font-medium text-ink/75 sm:text-right">{t.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Band>
        );
      })}
    </section>
  );
}

export function Gone() {
  const gone = TOOLS.filter((t) => t.gone);
  return (
    <section aria-labelledby="gone-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={CircleSlash}>{GONE.pill}</Pill>
        <h2 id="gone-title" className="mt-5 text-[1.7rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2rem]">
          {GONE.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{GONE.body}</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-3">
          {gone.map((t, i) => (
            <li key={t.slug} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link to={`/alternatives/${t.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface/60 sm:p-7">
                  <span className="inline-flex w-fit items-center rounded-md bg-ink/[0.06] px-2 py-0.5 text-[0.7rem] font-semibold text-ink/70">{t.gone}</span>
                  <span className="mt-4 flex items-center gap-1.5 text-[1.1rem] font-semibold text-ink">
                    {t.name} alternative
                    <ArrowRight className="h-4 w-4 text-ink/25 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                  </span>
                  <span className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{t.what}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function Also() {
  return (
    <section aria-labelledby="also-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-10', RULE)}>
          <h2 id="also-title" className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
            {ALSO_SECTION.title}
          </h2>
          <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">{ALSO_SECTION.body}</p>
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {ALSO.map((a) => (
            <li key={a.name} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-5 sm:px-10">
              <a
                href={a.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex w-36 shrink-0 items-center gap-1 text-[0.92rem] font-semibold text-ink hover:text-cta"
              >
                {a.name}
                <ArrowUpRight className="h-3 w-3 text-ink/40" />
              </a>
              <span className="text-[0.86rem] leading-relaxed text-muted-foreground">{a.what}</span>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}
