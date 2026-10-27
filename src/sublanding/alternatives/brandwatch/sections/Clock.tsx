import { useId, useMemo, useState } from 'react';
import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { ARRIVAL, ARRIVAL_TAIL_HOURS, CLOCK } from '../content';
import { arrivedBy, formatHours, position, STOPS } from '../clock';

/* Pick a reply window; the clock reads Brandwatch's published arrival points
   for Reddit content and states only what they support. */
export function Clock() {
  const id = useId();
  const [stop, setStop] = useState(3); // 1.5 hours
  const hours = STOPS[stop];
  const reading = useMemo(() => arrivedBy(hours), [hours]);

  const headline =
    reading.kind === 'unknown'
      ? 'No published figure yet'
      : reading.kind === 'nearlyAll'
        ? 'About all of it'
        : `At least ${reading.share}%`;
  const detail =
    reading.kind === 'unknown'
      ? `Brandwatch publishes nothing under an hour. By one hour, it says about ${reading.next}% of Reddit content has arrived.`
      : reading.kind === 'nearlyAll'
        ? `Brandwatch says some Reddit content takes up to about ${ARRIVAL_TAIL_HOURS} hours, so by now nearly all of it should have arrived.`
        : `of Reddit content has reached Brandwatch by ${formatHours(hours)}, going by its ${reading.since}-hour figure. The rest can take up to about ${ARRIVAL_TAIL_HOURS} hours.`;

  return (
    <section id="clock" aria-labelledby="clock-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-12">
        <h2 id="clock-title" className={cn('mx-auto max-w-2xl', SECTION_TITLE)}>
          {CLOCK.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{CLOCK.body}</p>
      </Band>
      <Band inner="bg-surface/70 px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={id} className="text-[0.85rem] font-semibold text-ink">
              {CLOCK.label}
            </label>
            <span className="text-[1.05rem] font-semibold tabular-nums text-ink">{formatHours(hours)}</span>
          </div>
          <input
            id={id}
            type="range"
            min={0}
            max={STOPS.length - 1}
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
            aria-valuetext={formatHours(hours)}
            className="mt-3 w-full accent-cta"
          />

          {/* The scale, log-spaced, with Brandwatch's published points. */}
          <div aria-hidden className="relative mt-6 h-16">
            <div className="absolute inset-x-0 top-6 h-2 rounded-full bg-ink/[0.07]" />
            <div className="absolute left-0 top-6 h-2 rounded-full bg-cta/70 transition-[width] duration-300" style={{ width: `${position(hours)}%` }} />
            {[...ARRIVAL.map((p) => ({ h: p.hours, label: `${p.share}%` })), { h: ARRIVAL_TAIL_HOURS, label: '~all' }].map((p) => (
              <div key={p.h} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${position(p.h)}%` }}>
                <span className="block text-[0.68rem] font-semibold tabular-nums text-ink/70">{p.label}</span>
                <span className="mx-auto mt-1 block h-4 w-px bg-ink/40" />
                <span className="mt-3 block text-[0.65rem] tabular-nums text-muted-foreground">{p.h}h</span>
              </div>
            ))}
          </div>

          <div aria-live="polite" className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-ink/[0.08] bg-white p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Brandwatch, by its own figures</p>
              <p className="mt-2 text-[1.7rem] font-semibold leading-none tracking-[-0.03em] text-ink">{headline}</p>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">{detail}</p>
            </div>
            <div className="rounded-xl border border-ink/[0.08] bg-white p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-cta">Reddix</p>
              <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-ink">Found when you scan</p>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">{CLOCK.reddix}</p>
            </div>
          </div>
          <p className={cn('mt-6 border-t pt-4 text-[0.75rem] leading-relaxed text-muted-foreground', LINE)}>{CLOCK.note}</p>
        </div>
      </Band>
    </section>
  );
}
