import { useState } from 'react';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Minus, ScrollText, X } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { ARCHIVE, FEATURES, SNAPSHOTS, type Mark } from '../content';

const DAY = 86_400_000;
const toDay = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const fmt = (iso: string) => new Date(toDay(iso)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** The window the change happened in: the last copy with Reddit features
 *  listed, and the first without. */
function changeWindow() {
  const lastWith = [...SNAPSHOTS].reverse().find((s) => Object.values(s.marks).includes('listed'))!;
  const firstWithout = SNAPSHOTS.find((s) => toDay(s.date) > toDay(lastWith.date) && Object.values(s.marks).every((m) => m === 'absent'))!;
  return { from: lastWith.date, to: firstWithout.date, days: Math.round((toDay(firstWithout.date) - toDay(lastWith.date)) / DAY) };
}

const ICON: Record<Mark, typeof Check> = { listed: Check, absent: X, unknown: Minus };
const TONE: Record<Mark, string> = {
  listed: 'bg-cta text-white',
  absent: 'bg-ink text-white',
  unknown: 'border border-dashed border-ink/[0.2] text-ink/40',
};

/* A stepper through the saved copies. The track marks each copy; the panel
   shows what that copy lists, its title and its price. */
export function Archive() {
  const [i, setI] = useState(SNAPSHOTS.length - 2);
  const snap = SNAPSHOTS[i];
  const win = changeWindow();
  const listed = FEATURES.filter((f) => snap.marks[f] === 'listed').length;
  const first = toDay(SNAPSHOTS[0].date);
  const span = toDay(SNAPSHOTS[SNAPSHOTS.length - 1].date) - first;
  const pos = (iso: string) => ((toDay(iso) - first) / span) * 100;

  return (
    <section aria-labelledby="archive-title">
      <SectionHead icon={ScrollText} eyebrow={ARCHIVE.pill} title={<span id="archive-title">{ARCHIVE.title}</span>} subtitle={ARCHIVE.body} />

      {/* ---------- the track ---------- */}
      <Band inner="px-6 pb-6 pt-12 sm:px-10 lg:px-12">
        <div className="relative h-10">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/15" />
          {/* The window the change falls in. */}
          <div
            className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-cta/20"
            style={{ left: `${pos(win.from)}%`, width: `${pos(win.to) - pos(win.from)}%` }}
          >
            <span className="absolute -top-7 right-0 whitespace-nowrap text-[0.68rem] font-semibold text-cta-deep">Changed here</span>
          </div>
          {SNAPSHOTS.map((s, j) => (
            <button
              key={s.date}
              type="button"
              onClick={() => setI(j)}
              aria-label={`Copy from ${fmt(s.date)}`}
              aria-pressed={i === j}
              className={cn(
                'absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25',
                i === j ? 'scale-125 border-cta bg-cta' : s.kind === 'live' ? 'border-ink bg-ink' : 'border-ink/40 bg-white hover:border-ink',
              )}
              style={{ left: `${pos(s.date)}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">
          <span>{fmt(SNAPSHOTS[0].date)}</span>
          <span>Live site</span>
        </div>
      </Band>

      {/* ---------- the copy ---------- */}
      <Band inner="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className={cn('border-b bg-surface/70 px-6 py-8 sm:px-10 md:border-b-0 md:border-r lg:px-12', LINE)} aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              aria-label="Earlier copy"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink/70 transition-colors hover:text-ink disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{snap.kind === 'live' ? 'Live site' : 'Internet Archive copy'}</p>
              <p className="text-[1.35rem] font-semibold tracking-[-0.02em] tabular-nums text-ink">{fmt(snap.date)}</p>
            </div>
            <button
              type="button"
              onClick={() => setI((n) => Math.min(SNAPSHOTS.length - 1, n + 1))}
              disabled={i === SNAPSHOTS.length - 1}
              aria-label="Later copy"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink/70 transition-colors hover:text-ink disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-6 text-[0.95rem] font-medium leading-snug text-ink">{snap.title}</p>
          <p className="mt-3 text-[0.85rem] text-muted-foreground">
            <span className="font-semibold text-ink">Price shown:</span> {snap.price}
          </p>
          <p className="mt-3 text-[0.85rem] text-muted-foreground">
            <span className="font-semibold text-ink">{listed}</span> of {FEATURES.length} Reddit features listed
          </p>
          <a href={snap.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-[0.8rem] font-medium text-ink/70 underline decoration-ink/20 underline-offset-2 hover:text-ink">
            Open this copy
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {FEATURES.map((f) => {
            const m = snap.marks[f];
            const Icon = ICON[m];
            return (
              <li key={f} className="flex items-center justify-between gap-4 px-6 py-4 sm:px-10">
                <span className={cn('text-[0.92rem]', m === 'listed' ? 'font-medium text-ink' : 'text-ink/60')}>{f}</span>
                <span className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <span className="hidden sm:inline">{ARCHIVE.marks[m]}</span>
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', TONE[m])}>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="sr-only">{ARCHIVE.marks[m]}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </Band>
      <Band inner="px-6 py-4 text-[0.85rem] leading-relaxed text-ink/80 sm:px-10 lg:px-12">
        The change falls between {fmt(win.from)} and {fmt(win.to)}, a {win.days}-day window. Linkeddit hasn’t announced it, so no closer date can be given.
      </Band>
    </section>
  );
}
