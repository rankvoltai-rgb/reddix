import { Gauge } from 'lucide-react';
import { Band, CELL, CellGrid, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BANDS } from '../content';
import { POINTS, SAVE_AT } from '../signals';
import { LEVEL_FILL, LevelChip } from '../ui';

/* Low to hot, so the scale and the cards under it read left to right like the meter. */
const SCALE = [...BANDS.bands].reverse();

export function ScoreBands() {
  return (
    <section aria-labelledby="bands-title">
      <SectionHead icon={Gauge} eyebrow={BANDS.pill} title={<span id="bands-title">{BANDS.title}</span>} subtitle={BANDS.body} />

      {/* The 0–100 scale, each band as wide as its range. */}
      <Band inner="px-5 pb-8 pt-10 sm:px-10 lg:px-12">
        <div className="relative">
          <div className="flex h-10 gap-[3px] overflow-hidden rounded-lg">
            {SCALE.map((b) => (
              <div
                key={b.level}
                className={cn('flex items-center justify-center text-[0.72rem] font-semibold', LEVEL_FILL[b.level], b.level === 'hot' || b.level === 'warm' ? 'text-white' : 'text-ink/60')}
                style={{ flex: `${Math.min(b.range[1], 99) - b.range[0] + 1} 1 0%` }}
              >
                <span className="hidden sm:inline">{b.name}</span>
              </div>
            ))}
          </div>
          {/* Where saving starts. */}
          <div className="pointer-events-none absolute -bottom-2 -top-2 w-0.5 rounded-full bg-ink" style={{ left: `${SAVE_AT}%` }}>
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
              Saved from {SAVE_AT}
            </span>
          </div>
          <div aria-hidden className="relative mt-4 h-4 text-[0.7rem] tabular-nums text-muted-foreground">
            {[0, 25, 40, 70, 100].map((n) => (
              <span
                key={n}
                className={cn('absolute', n === 0 ? 'left-0' : n === 100 ? 'right-0' : '-translate-x-1/2')}
                style={n === 0 || n === 100 ? undefined : { left: `${n}%` }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {SCALE.map((b, i) => (
            <li key={b.level} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <LevelChip level={b.level} />
                  <span className="text-[0.8rem] font-semibold tabular-nums text-ink/60">
                    {b.range[0]}–{b.range[1]}
                  </span>
                </div>
                <dl className="mt-5 space-y-4 text-[0.88rem] leading-relaxed">
                  <div>
                    <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Usually</dt>
                    <dd className="mt-1 text-ink">{b.looks}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">What to do</dt>
                    <dd className="mt-1 text-ink/80">{b.act}</dd>
                  </div>
                </dl>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>

      {/* The signals that add points after the AI. */}
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-10', LINE)}>
          <h3 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-ink">{BANDS.boostsTitle}</h3>
          <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">{BANDS.boostsNote}</p>
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {BANDS.boosts.map((b) => (
            <li key={b.key} className="flex items-center gap-5 px-6 py-5 sm:px-10">
              <span className="w-14 shrink-0 text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-cta">
                +{POINTS[b.key]}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.95rem] font-semibold text-ink">{b.name}</span>
                <span className="mt-0.5 block text-[0.84rem] text-muted-foreground">{b.example}</span>
              </span>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}
