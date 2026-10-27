import { AlertTriangle, Boxes, Scale } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CONFLICTS, FIT, MODES, RULES } from '../content';

/* Three stacked product rows, each with its price set big on the left, then
   one line on how Reddix compares. */
export function Modes() {
  return (
    <section aria-labelledby="modes-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Boxes}>{MODES.pill}</Pill>
        <h2 id="modes-title" className={cn('mt-5', SECTION_TITLE)}>
          {MODES.title}
        </h2>
      </Band>
      {MODES.items.map((m) => (
        <Band key={m.name} inner="grid md:grid-cols-[16rem_minmax(0,1fr)]">
          <div className={cn('px-6 pb-2 pt-8 sm:px-10 md:border-r md:py-8 lg:px-12', LINE)}>
            <h3 className="text-[1.1rem] font-semibold text-ink">{m.name}</h3>
            <p className="mt-1 text-[0.9rem] font-medium tabular-nums text-cta">{m.price}</p>
          </div>
          <p className="max-w-[44rem] px-6 pb-8 pt-2 text-[0.95rem] leading-[1.75] text-ink/80 sm:px-10 md:py-8">{m.body}</p>
        </Band>
      ))}
      <Band inner="bg-cta-soft/60 px-6 py-6 sm:px-10 lg:px-12">
        <p className="text-[0.93rem] leading-relaxed text-ink/85">{MODES.reddix}</p>
      </Band>
    </section>
  );
}

export function Rules() {
  return (
    <section aria-labelledby="rules-title">
      <Band inner="px-6 py-12 text-center sm:px-10">
        <Pill icon={Scale}>{RULES.pill}</Pill>
        <h2 id="rules-title" className={cn('mx-auto mt-5 max-w-2xl', SECTION_TITLE)}>
          {RULES.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {[RULES.vendor, RULES.reddit].map((col, i) => (
          <div key={col.label} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && cn('border-t md:border-l md:border-t-0', LINE))}>
            <h3 className={cn('text-[0.8rem] font-semibold uppercase tracking-[0.07em]', i === 1 ? 'text-cta' : 'text-muted-foreground')}>{col.label}</h3>
            <ol className="mt-4 space-y-3.5">
              {col.points.map((p, j) => (
                <li key={p} className="grid grid-cols-[1.5rem_minmax(0,1fr)] text-[0.92rem] leading-relaxed text-ink/85">
                  <span className="text-[0.75rem] font-semibold tabular-nums text-ink/35">{j + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Band>
      <Band inner="px-6 py-7 sm:px-10 lg:px-12">
        <p className="mx-auto max-w-3xl text-[0.93rem] leading-relaxed text-ink/75">{RULES.close}</p>
      </Band>
    </section>
  );
}

export function Fit() {
  return (
    <section aria-labelledby="fit-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Boxes}>{FIT.pill}</Pill>
        <h2 id="fit-title" className={cn('mt-5', SECTION_TITLE)}>
          {FIT.title}
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {FIT.points.map((p, i) => (
            <li key={p.title} className={CELL}>
              <Reveal delay={(i % 3) * 0.05} className="h-full p-6 sm:p-7">
                <h3 className="text-[1rem] font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function Conflicts() {
  return (
    <section aria-labelledby="conflicts-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className={cn('px-6 pb-3 pt-10 sm:px-10 lg:border-r lg:px-12 lg:py-10', LINE)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-ink/60">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <h2 id="conflicts-title" className="mt-4 text-[1.3rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
            {CONFLICTS.title}
          </h2>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{CONFLICTS.intro}</p>
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {CONFLICTS.items.map((c) => (
            <li key={c} className="px-6 py-5 text-[0.92rem] leading-relaxed text-ink/80 sm:px-10 lg:px-12">
              {c}
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}
