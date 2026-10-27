import { useId, useMemo, useState } from 'react';
import { Ban, CalendarClock, Clock, RotateCcw, Search } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { PLANNER } from '../content';
import { FRESHNESS_LABEL, KIND_LABEL, planScan, RATE_LIMIT_MINUTES, splitList, waitMinutes, type ScanPlan } from '../rotation';

type Press =
  | { id: number; at: number; state: 'ran'; plan: ScanPlan }
  | { id: number; at: number; state: 'refused'; wait: number }
  | { id: number; at: number; state: 'empty' };

const FIELD =
  'w-full rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.9rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]';
const LABEL = 'text-[0.8rem] font-semibold text-ink';
const STEP_BUTTON =
  'h-9 rounded-lg border border-ink/[0.1] bg-white px-3 text-[0.8rem] font-medium tabular-nums text-ink/80 transition-colors hover:border-ink/[0.2] hover:text-ink';

const STEPS = [
  { label: '+1 min', ms: 60_000 },
  { label: '+5 min', ms: 300_000 },
  { label: '+1 hour', ms: 3_600_000 },
  { label: '+1 day', ms: 86_400_000 },
];

/** 9:00 this morning, so the clock starts somewhere sensible. */
function morning() {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

const time = (ms: number) =>
  new Date(ms).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });

const clean = (s: string) => s.replace(/^r\//i, '');

/* Set up an illustrative account, move the clock, press Scan. Each press runs
   the scanner's 5-minute rule and rotation and logs what it would search. */
export function Planner() {
  const ids = { subs: useId(), phrases: useId(), comps: useId() };
  const [subsText, setSubsText] = useState(PLANNER.defaults.subreddits.join(', '));
  const [phrasesText, setPhrasesText] = useState(PLANNER.defaults.phrases.join(', '));
  const [compsText, setCompsText] = useState(PLANNER.defaults.competitors);
  const [start] = useState(morning);
  const [now, setNow] = useState(start);
  const [presses, setPresses] = useState<Press[]>([]);

  const subreddits = useMemo(() => [...new Set(splitList(subsText).map(clean))], [subsText]);
  const phrases = useMemo(() => splitList(phrasesText), [phrasesText]);
  const competitors = useMemo(() => splitList(compsText), [compsText]);

  const lastRan = presses.find((p) => p.state === 'ran')?.at ?? null;
  const wait = waitMinutes(now, lastRan);
  const covered = useMemo(() => new Set(presses.flatMap((p) => (p.state === 'ran' ? p.plan.covered : []))), [presses]);
  const ran = presses.filter((p) => p.state === 'ran').length;

  // In the scanner the 5-minute check comes first, then the subreddit check;
  // only a scan that passes both moves last_scan_at.
  const press = () => {
    const id = presses.length;
    const entry: Press =
      wait > 0
        ? { id, at: now, state: 'refused', wait }
        : subreddits.length === 0
          ? { id, at: now, state: 'empty' }
          : { id, at: now, state: 'ran', plan: planScan(now, subreddits, phrases, competitors) };
    setPresses([entry, ...presses]);
  };

  const reset = () => {
    setPresses([]);
    setNow(start);
  };

  return (
    <section id="planner" aria-labelledby="planner-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={CalendarClock}>{PLANNER.pill}</Pill>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="planner-title" className={SECTION_TITLE}>
            {PLANNER.title}
          </h2>
          <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{PLANNER.body}</p>
        </div>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* ---------- the account ---------- */}
        <div className={cn('min-w-0 border-b px-5 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-10', LINE)}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Illustrative setup</p>
          <label htmlFor={ids.subs} className={cn(LABEL, 'mt-4 block')}>
            Subreddits switched on
          </label>
          <textarea id={ids.subs} value={subsText} onChange={(e) => setSubsText(e.target.value)} rows={3} className={cn(FIELD, 'mt-2 resize-y py-2.5 leading-relaxed')} />
          <p className="mt-1.5 text-[0.72rem] text-muted-foreground">Comma-separated, without the r/.</p>

          <label htmlFor={ids.phrases} className={cn(LABEL, 'mt-5 block')}>
            Buyer phrases
          </label>
          <textarea id={ids.phrases} value={phrasesText} onChange={(e) => setPhrasesText(e.target.value)} rows={4} className={cn(FIELD, 'mt-2 resize-y py-2.5 leading-relaxed')} />

          <label htmlFor={ids.comps} className={cn(LABEL, 'mt-5 block')}>
            Competitors
          </label>
          <input id={ids.comps} value={compsText} onChange={(e) => setCompsText(e.target.value)} placeholder="Leave empty to skip the competitor search" className={cn(FIELD, 'mt-2 h-10')} />

          <p className="mt-6 text-[0.75rem] leading-relaxed text-muted-foreground">{PLANNER.note}</p>
        </div>

        {/* ---------- the clock and the log ---------- */}
        <div className="min-w-0 bg-surface/70 px-5 py-8 sm:px-10 lg:py-10">
          <div className="rounded-xl border border-ink/[0.08] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.72rem] font-medium text-muted-foreground">Clock</p>
                <p className="mt-0.5 text-[1.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink" aria-live="polite">
                  {time(now)}
                </p>
              </div>
              <button
                type="button"
                onClick={press}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
              >
                <Search className="h-4 w-4" />
                Press Scan
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.75rem] text-muted-foreground">Move the clock</span>
              {STEPS.map((s) => (
                <button key={s.label} type="button" onClick={() => setNow((n) => n + s.ms)} className={STEP_BUTTON}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className={cn('mt-3 flex items-center gap-1.5 text-[0.78rem]', wait ? 'text-ink/70' : 'text-muted-foreground')}>
              <Clock className="h-3.5 w-3.5" />
              {lastRan === null
                ? 'No scan yet. The first press can run straight away.'
                : wait
                  ? `Last scan ${time(lastRan)}. The next is allowed in ${wait} minute${wait > 1 ? 's' : ''}.`
                  : `Last scan ${time(lastRan)}. A new scan can run now.`}
            </p>
          </div>

          {/* Which subreddits the scans so far have reached. */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className={LABEL}>Subreddits reached</p>
              <p className="text-[0.75rem] tabular-nums text-muted-foreground">
                {covered.size} of {subreddits.length} after {ran} scan{ran === 1 ? '' : 's'}
              </p>
            </div>
            {subreddits.length ? (
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {subreddits.map((s) => (
                  <li
                    key={s}
                    className={cn(
                      'rounded-md px-2 py-1 text-[0.75rem] font-medium transition-colors',
                      covered.has(s) ? 'bg-cta text-white' : 'border border-ink/[0.1] bg-white text-ink/55',
                    )}
                  >
                    r/{s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-[0.82rem] text-muted-foreground">No subreddits switched on.</p>
            )}
          </div>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <p className={LABEL}>Scans</p>
            {presses.length > 0 && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 py-1 text-[0.78rem] font-medium text-muted-foreground hover:text-ink">
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </button>
            )}
          </div>
          {presses.length === 0 ? (
            <p className="mt-2.5 rounded-lg border border-dashed border-ink/[0.14] bg-white/60 px-4 py-6 text-center text-[0.85rem] text-muted-foreground">
              Press Scan to see what the first scan would search.
            </p>
          ) : (
            <ol className="mt-2.5 space-y-2.5">
              {presses.map((p, i) => (
                <PressEntry key={p.id} press={p} open={i === 0} />
              ))}
            </ol>
          )}
        </div>
      </Band>
    </section>
  );
}

function PressEntry({ press, open }: { press: Press; open: boolean }) {
  if (press.state !== 'ran') {
    return (
      <li className="flex gap-3 rounded-lg border border-ink/[0.08] bg-white px-4 py-3">
        <Ban className="mt-0.5 h-4 w-4 shrink-0 text-ink/45" />
        <div className="min-w-0 text-[0.84rem]">
          <p className="font-semibold text-ink">
            {time(press.at)} · Refused
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {press.state === 'refused'
              ? `Inside the ${RATE_LIMIT_MINUTES} minutes since the last scan, ${press.wait} to go. Nothing is searched.`
              : 'No subreddits are switched on, so there’s nothing to search.'}
          </p>
        </div>
      </li>
    );
  }
  const { plan } = press;
  return (
    <li className="rounded-lg border border-ink/[0.08] bg-white">
      <details open={open} className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <Search className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
          <div className="min-w-0 flex-1 text-[0.84rem]">
            <p className="font-semibold text-ink">
              {time(press.at)} · {plan.searches.length} searches
            </p>
            <p className="mt-0.5 text-muted-foreground">Reaches {plan.covered.map((s) => `r/${s}`).join(', ')}</p>
          </div>
          <span className="mt-0.5 text-[0.75rem] text-muted-foreground group-open:hidden">Show</span>
          <span className="mt-0.5 hidden text-[0.75rem] text-muted-foreground group-open:inline">Hide</span>
        </summary>
        <ul className={cn('divide-y divide-ink/[0.06] border-t', LINE)}>
          {plan.searches.map((s, i) => (
            <li key={i} className="px-4 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.75rem]">
                <span className="font-semibold text-ink">{KIND_LABEL[s.kind]}</span>
                <span className="rounded bg-surface px-1.5 py-0.5 font-medium text-ink/70">{FRESHNESS_LABEL[s.freshness]}</span>
              </div>
              <code className="mt-1 block break-words font-mono text-[0.72rem] leading-relaxed text-ink/60">{s.query}</code>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}
