import { useId, useMemo, useState } from 'react';
import { CalendarClock, Globe2, Plus, Search, X } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { PLANNER } from '../content';
import { cleanName, FRESHNESS_LABEL, MAX_SEARCHES, planScan, slotAt, VALID_NAME, type Search as Planned } from '../rotation';

const LABEL = 'text-[0.8rem] font-semibold text-ink';

/* Edit a list of subreddits and see the searches a scan would run: which
   three subreddits it reads, the queries, and the time window of each. */
export function Planner() {
  const ids = { add: useId(), error: useId(), comp: useId() };
  const [list, setList] = useState<string[]>(PLANNER.startList);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [competitor, setCompetitor] = useState(true);
  const [offset, setOffset] = useState(0);
  // The rotation slot when the page opened; "In 5 min" is the next one.
  const [base] = useState(() => slotAt(Date.now()));

  const plan = useMemo(
    () => planScan(list, PLANNER.phrases, competitor ? [PLANNER.competitor] : [], base + offset),
    [list, competitor, base, offset],
  );
  const left = list.filter((s) => !plan.picked.includes(s));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const name = cleanName(draft);
    if (!name) return;
    if (!VALID_NAME.test(name)) return setError('Use letters, numbers and underscores only.');
    if (list.includes(name)) return setError(`r/${name} is already on the list.`);
    setList((l) => [...l, name]);
    setDraft('');
    setError(null);
  };

  return (
    <section id="planner" aria-labelledby="planner-title" className="scroll-mt-16">
      <SectionHead icon={CalendarClock} eyebrow={PLANNER.pill} title={<span id="planner-title">{PLANNER.title}</span>} subtitle={PLANNER.body} />

      <Band inner="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ---------- the inputs ---------- */}
        <div className="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <p className={LABEL}>{PLANNER.listLabel}</p>
          {list.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {list.map((s) => {
                const on = plan.picked.includes(s);
                return (
                  <li
                    key={s}
                    className={cn(
                      'inline-flex h-8 items-center gap-1 rounded-lg border pl-2.5 pr-1 text-[0.82rem] font-medium transition-colors',
                      on ? 'border-cta/40 bg-cta-soft text-cta-deep' : 'border-ink/[0.1] bg-white text-ink/75',
                    )}
                  >
                    {on && <span aria-hidden className="mr-0.5 h-1.5 w-1.5 rounded-full bg-cta" />}
                    r/{s}
                    {on && <span className="sr-only"> (in this scan)</span>}
                    <button
                      type="button"
                      onClick={() => setList((l) => l.filter((x) => x !== s))}
                      aria-label={`Remove r/${s}`}
                      className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-md text-ink/40 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-[0.85rem] text-muted-foreground">The list is empty.</p>
          )}

          <form onSubmit={add} className="mt-4">
            <label htmlFor={ids.add} className="sr-only">
              {PLANNER.addLabel}
            </label>
            <div className="flex gap-2">
              <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-ink/[0.1] bg-white pl-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] focus-within:border-cta/50 focus-within:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]">
                <span className="text-[0.85rem] text-muted-foreground">r/</span>
                <input
                  id={ids.add}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setError(null);
                  }}
                  placeholder="subreddit"
                  aria-invalid={!!error}
                  aria-describedby={error ? ids.error : undefined}
                  className="h-full w-full min-w-0 bg-transparent px-1 text-[0.88rem] text-ink outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={!cleanName(draft)}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.85rem] font-medium text-ink transition-colors hover:border-ink/[0.2] disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            {error && (
              <p id={ids.error} role="alert" className="mt-2 text-[0.78rem] text-cta">
                {error}
              </p>
            )}
          </form>

          <label htmlFor={ids.comp} className="mt-7 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-ink/[0.08] bg-white px-3.5 py-3">
            <span className="text-[0.85rem] font-medium text-ink">{PLANNER.competitorLabel}</span>
            <input id={ids.comp} type="checkbox" checked={competitor} onChange={(e) => setCompetitor(e.target.checked)} className="peer sr-only" />
            <span
              aria-hidden
              className="relative h-5 w-9 shrink-0 rounded-full bg-ink/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-cta peer-checked:after:translate-x-4 peer-focus-visible:ring-4 peer-focus-visible:ring-cta/25"
            />
          </label>

          <p className={cn(LABEL, 'mt-7')}>{PLANNER.slotsLabel}</p>
          <div role="group" aria-label={PLANNER.slotsLabel} className="mt-2.5 grid grid-cols-2 gap-1 rounded-lg bg-surface p-1 min-[480px]:grid-cols-4">
            {PLANNER.slots.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setOffset(i)}
                aria-pressed={offset === i}
                className={cn(
                  'h-8 rounded-md text-[0.8rem] font-medium transition-colors',
                  offset === i ? 'bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : 'text-ink/60 hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- the plan ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-10', LINE)}>
          {plan.picked.length ? (
            <>
              <p aria-live="polite" className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                This scan reads {listWords(plan.picked.map((s) => `r/${s}`))}.
              </p>
              <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
                {plan.searches.length} of {MAX_SEARCHES} searches
                {left.length > 0 && <> · Not in this scan: {left.map((s) => `r/${s}`).join(', ')}</>}
              </p>
              <ol className="mt-6 space-y-2.5">
                {plan.searches.map((s, i) => (
                  <SearchRow key={`${s.kind}-${i}`} n={i + 1} search={s} />
                ))}
              </ol>
              <p className="mt-5 text-[0.75rem] leading-relaxed text-muted-foreground">{PLANNER.note}</p>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-ink/[0.15] bg-white p-5">
              <p className="text-[0.95rem] font-semibold text-ink">No subreddits, no scan</p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                With an empty list the scanner stops before searching and tells you no subreddits are configured. Add one on the left.
              </p>
            </div>
          )}
        </div>
      </Band>
    </section>
  );
}

function SearchRow({ n, search }: { n: number; search: Planned }) {
  const everywhere = search.subs.length === 0;
  return (
    <li className="rounded-lg border border-ink/[0.08] bg-white p-3.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="text-[0.72rem] font-semibold tabular-nums text-ink/35">{String(n).padStart(2, '0')}</span>
        <span className="flex items-center gap-1 text-[0.82rem] font-semibold text-ink">
          {everywhere ? <Globe2 className="h-3.5 w-3.5 text-cta" /> : <Search className="h-3.5 w-3.5 text-ink/40" />}
          {PLANNER.kinds[search.kind]}
        </span>
        <span className="ml-auto rounded-md bg-surface px-1.5 py-0.5 text-[0.7rem] font-medium text-ink/65">{FRESHNESS_LABEL[search.freshness]}</span>
      </div>
      <code className="mt-2 block break-words font-mono text-[0.72rem] leading-relaxed text-ink/60">{search.query}</code>
    </li>
  );
}

function listWords(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
