import { useId, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { EVENTS, EXPLORER, PLATFORMS } from '../content';
import { addDays, availableOn, daysBetween, formatDay, range, statusOn, toDay, type Status } from '../timeline';

const PILL: Record<Status, string> = {
  none: 'bg-transparent text-ink/35 border border-dashed border-ink/[0.15]',
  pilot: 'bg-cta-soft text-cta-deep',
  live: 'bg-cta text-white',
  legacy: 'bg-ink/[0.07] text-ink/60',
};

/* A date slider over CatchIntent's life. The panel reads each platform's
   status for that day; the releases are buttons that jump the slider. */
export function Explorer() {
  const sliderId = useId();
  const { start, days } = useMemo(() => range(new Date()), []);
  const [offset, setOffset] = useState(days);
  const t = addDays(start, offset);
  const open = availableOn(t);
  const latest = [...EVENTS].reverse().find((e) => toDay(e.date) <= t);

  return (
    <section aria-labelledby="explorer-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={History}>{EXPLORER.pill}</Pill>
          <h2 id="explorer-title" className={cn('mt-5', SECTION_TITLE)}>
            {EXPLORER.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{EXPLORER.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* ---------- the releases ---------- */}
        <ol className={cn('order-2 border-t lg:order-1 lg:border-r lg:border-t-0', LINE)}>
          {EVENTS.map((e) => {
            const at = daysBetween(start, toDay(e.date));
            const active = latest?.date === e.date;
            const past = toDay(e.date) <= t;
            return (
              <li key={e.date} className={cn('border-b last:border-b-0', LINE)}>
                <button
                  type="button"
                  onClick={() => setOffset(at)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'grid w-full grid-cols-[6.5rem_minmax(0,1fr)] gap-4 px-6 py-4 text-left transition-colors sm:px-10 lg:px-12',
                    active ? 'bg-cta-soft/60' : 'hover:bg-surface/70',
                  )}
                >
                  <span className={cn('text-[0.8rem] font-semibold tabular-nums', past ? 'text-ink' : 'text-ink/40')}>
                    {formatDay(toDay(e.date))}
                    {e.version && <span className="mt-0.5 block text-[0.7rem] font-medium text-muted-foreground">{e.version}</span>}
                  </span>
                  <span className={cn('text-[0.9rem] leading-snug', past ? 'text-ink/85' : 'text-ink/40')}>{e.text}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* ---------- the day ---------- */}
        <div className="order-1 bg-surface/70 px-6 py-8 sm:px-10 lg:order-2 lg:px-10">
          <label htmlFor={sliderId} className="text-[0.8rem] font-semibold text-ink">
            Pick a day
          </label>
          <p className="mt-1 text-[1.6rem] font-semibold tracking-[-0.03em] tabular-nums text-ink" aria-live="polite">
            {formatDay(t)}
          </p>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={days}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            aria-valuetext={formatDay(t)}
            className="mt-3 w-full accent-cta"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">
            <span>{formatDay(start)}</span>
            <span>Today</span>
          </div>

          <ul className="mt-6 divide-y divide-ink/[0.07] rounded-lg border border-ink/[0.08] bg-white">
            {PLATFORMS.map((p) => {
              const s = statusOn(t, p);
              return (
                <li key={p.name} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className={cn('text-[0.9rem] font-medium', s === 'live' ? 'text-ink' : 'text-ink/60')}>{p.name}</span>
                  <span className={cn('inline-flex h-6 items-center whitespace-nowrap rounded-md px-2 text-[0.7rem] font-semibold', PILL[s])}>
                    {EXPLORER.status[s]}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-ink/80">
            {open.length ? (
              <>
                A new buyer could get <strong className="font-semibold text-ink">{open.join(', ')}</strong>.
              </>
            ) : (
              'A new buyer couldn’t get any platform yet: Reddit was still a proof of concept.'
            )}
            {!open.includes('Reddit') && t >= toDay(PLATFORMS[0].closed!) && ' Reddit was no longer on sale.'}
          </p>
        </div>
      </Band>
    </section>
  );
}
