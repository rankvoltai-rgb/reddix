import { useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REPLAY } from '../content';
import { aiReads, isJunk, MIN_LENGTH, replay, SAVE_AT, type Outcome } from '../memory';

const DAYS = Array.from({ length: REPLAY.days }, (_, i) => i + 1);
const { competitors } = REPLAY;

const CELL: Record<Outcome['kind'], string> = {
  saved: 'bg-cta text-white',
  'saved-again': 'bg-cta-deep text-white',
  low: 'bg-ink/[0.08] text-ink/60',
  junk: 'bg-ink/[0.04] text-ink/40 line-through',
  short: 'border border-dashed border-ink/25 text-ink/45',
  remembered: 'bg-[repeating-linear-gradient(135deg,hsl(var(--cta)/0.16)_0_4px,transparent_4px_8px)] text-transparent',
};

const LEGEND: { kind: Outcome['kind']; label: string }[] = [
  { kind: 'saved', label: 'Read and saved (score)' },
  { kind: 'low', label: `Read, under ${SAVE_AT}, not saved` },
  { kind: 'remembered', label: 'Skipped: seen in the past 7 days' },
  { kind: 'junk', label: 'Skipped as promotion, remembered' },
  { kind: 'short', label: 'Too short, checked again next scan' },
  { kind: 'saved-again', label: 'Saved again after its week ran out' },
];

function mark(o: Outcome): string {
  switch (o.kind) {
    case 'saved':
    case 'low':
      return String(o.score);
    case 'saved-again':
      return '2×';
    case 'junk':
      return '0';
    case 'short':
      return '–';
    case 'remembered':
      return '';
  }
}

function describe(o: Outcome, day: number): string {
  switch (o.kind) {
    case 'saved':
      return `Day ${day}: read once, scored ${o.score}, saved`;
    case 'saved-again':
      return `Day ${day}: its 7 days ran out, scored ${o.score} again and saved a second time`;
    case 'low':
      return `Day ${day}: read once, scored ${o.score}, not saved, remembered`;
    case 'junk':
      return `Day ${day}: skipped as promotion, remembered at score 0`;
    case 'short':
      return `Day ${day}: under ${MIN_LENGTH} characters, skipped, not remembered`;
    case 'remembered':
      return `Day ${day}: skipped, seen on day ${o.since}, remembered until day ${o.until}`;
  }
}

/* Days across, posts down. Toggle the days you scan; every cell is the
   scanner's rules applied to that post on that day. */
export function Replay() {
  const [scans, setScans] = useState<number[]>(REPLAY.defaultScans);
  const result = useMemo(() => replay(REPLAY.posts, scans, competitors), [scans]);
  const reads = useMemo(() => aiReads(REPLAY.posts, scans, result, competitors), [scans, result]);
  const on = new Set(scans);

  const toggle = (d: number) => setScans((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d].sort((a, b) => a - b)));

  const summary = [...scans]
    .sort((a, b) => a - b)
    .map((d) => {
      const os = REPLAY.posts.map((p) => result[p.id][d]).filter(Boolean) as Outcome[];
      const read = os.filter((o) => o.kind === 'saved' || o.kind === 'saved-again' || o.kind === 'low').length;
      const saved = os.filter((o) => o.kind === 'saved' || o.kind === 'saved-again').length;
      const again = os.filter((o) => o.kind === 'saved-again').length;
      const skipped = os.filter((o) => o.kind === 'remembered').length;
      return { d, read, saved, again, skipped, found: os.length };
    });

  return (
    <section id="replay" aria-labelledby="replay-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={History}>{REPLAY.pill}</Pill>
        <h2 id="replay-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {REPLAY.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">{REPLAY.body}</p>
      </Band>

      <Band inner={cn('flex flex-wrap items-center gap-2 border-b bg-surface/70 px-4 py-4 sm:px-10 lg:px-12', LINE)}>
        <span className="mr-1 text-[0.78rem] font-medium text-muted-foreground">Scan</span>
        {REPLAY.presets.map((p) => {
          const active = p.days.length === scans.length && p.days.every((d) => on.has(d));
          return (
            <button
              key={p.label}
              type="button"
              aria-pressed={active}
              onClick={() => setScans(p.days)}
              className={cn(
                'h-8 rounded-lg border px-3 text-[0.8rem] font-medium transition-colors',
                active ? 'border-ink bg-ink text-white' : 'border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.2] hover:text-ink',
              )}
            >
              {p.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setScans([])}
          className="h-8 rounded-lg px-2 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-ink"
        >
          Clear
        </button>
        <span className="ml-auto hidden text-[0.75rem] text-muted-foreground sm:inline">Or tap a day to scan it</span>
      </Band>

      <Band inner="px-4 py-6 sm:px-10 lg:px-12 lg:py-8">
        <table className="w-full table-fixed border-separate border-spacing-[3px]">
          <caption className="sr-only">Outcome of each post on each scan day, worked out by the scanner’s rules</caption>
          <thead>
            <tr>
              {DAYS.map((d) => (
                <th key={d} scope="col" className="p-0">
                  <button
                    type="button"
                    aria-pressed={on.has(d)}
                    aria-label={`Day ${d}${on.has(d) ? ', scanning' : ''}`}
                    onClick={() => toggle(d)}
                    className={cn(
                      'flex h-9 w-full items-center justify-center rounded-md text-[0.72rem] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/50',
                      on.has(d) ? 'bg-ink text-white' : 'border border-ink/[0.1] bg-white text-ink/45 hover:border-ink/[0.25] hover:text-ink',
                    )}
                  >
                    {d}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPLAY.posts.map((p) => {
              const short = p.body.length < MIN_LENGTH;
              const junk = !short && isJunk(p, competitors);
              const meta = [
                `Posted day ${p.day}`,
                p.copies > 1 ? `found by ${p.copies} searches each scan` : null,
                short ? `under ${MIN_LENGTH} characters` : junk ? 'promotion, by the first-pass rules' : `scores ${p.score}`,
              ]
                .filter(Boolean)
                .join(' · ');
              return [
                <tr key={`${p.id}-t`}>
                  <th scope="rowgroup" colSpan={DAYS.length} className="px-0.5 pb-1 pt-4 text-left font-normal">
                    <span className="block text-[0.88rem] font-semibold leading-snug text-ink sm:truncate">{p.title}</span>
                    <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">{meta}</span>
                  </th>
                </tr>,
                <tr key={`${p.id}-c`}>
                  {DAYS.map((d) => {
                    const o = result[p.id][d];
                    return (
                      <td key={d} className="p-0">
                        <div
                          className={cn(
                            'flex h-8 items-center justify-center rounded-md text-[0.68rem] font-semibold tabular-nums transition-colors duration-300 sm:h-9 sm:text-[0.72rem]',
                            o ? CELL[o.kind] : on.has(d) ? 'bg-transparent' : 'bg-ink/[0.02]',
                          )}
                          title={o ? describe(o, d) : undefined}
                        >
                          {o ? <span aria-hidden>{mark(o)}</span> : null}
                          <span className="sr-only">{o ? describe(o, d) : on.has(d) ? `Day ${d}: not posted yet` : `Day ${d}: no scan`}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>,
              ];
            })}
          </tbody>
        </table>

        <ul className="mt-6 grid gap-x-6 gap-y-2 text-[0.75rem] text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {LEGEND.map((l) => (
            <li key={l.kind} className="flex items-center gap-2">
              <span aria-hidden className={cn('h-4 w-6 shrink-0 rounded', CELL[l.kind])} />
              {l.label}
            </li>
          ))}
        </ul>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className={cn('border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12', LINE)} aria-live="polite">
          {scans.length ? (
            <>
              <p className="text-[0.8rem] font-medium text-muted-foreground">AI reads over these {scans.length} scans</p>
              <p className="mt-2 flex items-baseline gap-3">
                <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">{reads.withMemory}</span>
                <span className="text-[0.88rem] text-muted-foreground">
                  instead of <span className="font-semibold tabular-nums text-ink">{reads.without}</span> without the memory
                </span>
              </p>
            </>
          ) : (
            <p className="text-[0.9rem] text-muted-foreground">Pick at least one day to scan.</p>
          )}
        </div>
        <div className="px-6 py-8 sm:px-10 lg:px-12">
          {summary.length > 0 ? (
            <ul className="space-y-1.5 text-[0.82rem]">
              {summary.map((s) => (
                <li key={s.d} className="flex flex-wrap gap-x-2 text-muted-foreground">
                  <span className="w-14 font-semibold tabular-nums text-ink">Day {s.d}</span>
                  {s.found === 0 ? (
                    <span>Nothing posted yet.</span>
                  ) : (
                    <span>
                      {s.read} read · {s.skipped} skipped from memory · {s.saved} saved
                      {s.again > 0 && <span className="font-medium text-cta-deep"> ({s.again} saved again)</span>}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.82rem] text-muted-foreground">Each scan day you pick gets a line here.</p>
          )}
          <p className="mt-5 text-[0.72rem] text-muted-foreground">{REPLAY.note}</p>
        </div>
      </Band>
    </section>
  );
}
