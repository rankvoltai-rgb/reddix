import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bookmark, BookmarkCheck, Brain, CircleDashed, Crosshair, Inbox, ListChecks, RotateCcw, Trash2, X } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { TRIAGE } from '../content';
import { analyze, levelCounts, LOW_CONFIDENCE, savedList, scannerList, seedLeads, type Lead, type LevelFilter, type Status } from '../model';
import { LevelChip, LEVEL_NAME } from '../../intent-detection/ui';

const TABS: LevelFilter[] = ['all', 'hot', 'warm', 'research', 'low'];
const SAVED_STATUSES: Exclude<Status, 'new'>[] = ['engaged', 'replied', 'converted', 'archived'];
const STATUS_NAME: Record<Status, string> = { new: 'New', engaged: 'Engaged', replied: 'Replied', converted: 'Converted', archived: 'Archived' };

const ICON_BUTTON =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-2.5 text-[0.75rem] font-medium text-ink/80 transition-colors hover:border-ink/[0.2] hover:text-ink disabled:cursor-default disabled:opacity-60 disabled:hover:border-ink/[0.1]';

/** The list opens on Hot when there are hot leads (LeadsSection.tsx:104-111). */
function initialFilter(leads: Lead[]): LevelFilter {
  return levelCounts(leads).hot > 0 ? 'hot' : 'all';
}

export function Triage() {
  const [leads, setLeads] = useState(seedLeads);
  const [filter, setFilter] = useState<LevelFilter>(() => initialFilter(seedLeads()));
  const [clock, setClock] = useState(1);
  const [said, setSaid] = useState('');

  const counts = useMemo(() => levelCounts(leads), [leads]);
  const queue = useMemo(() => scannerList(leads, filter), [leads, filter]);
  const saved = useMemo(() => savedList(leads), [leads]);

  const change = (id: string, fn: (l: Lead) => Lead, message: string) => {
    setLeads((all) => all.map((l) => (l.id === id ? { ...fn(l), touched: clock } : l)));
    setClock((c) => c + 1);
    setSaid(message);
  };
  const setStatus = (l: Lead, status: Status, message: string) => change(l.id, (x) => ({ ...x, status }), message);
  const remove = (l: Lead) => {
    setLeads((all) => all.filter((x) => x.id !== l.id));
    setSaid('Lead deleted.');
  };
  const reset = () => {
    const fresh = seedLeads();
    setLeads(fresh);
    setFilter(initialFilter(fresh));
    setClock(1);
    setSaid('List reset.');
  };

  return (
    <section id="triage" aria-labelledby="triage-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14">
        <Pill icon={ListChecks}>{TRIAGE.pill}</Pill>
        <h2 id="triage-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {TRIAGE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{TRIAGE.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <p className="sr-only" aria-live="polite">
          {said}
        </p>

        {/* ---------- the Scanner's list ---------- */}
        <div className="min-w-0 px-4 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[0.8rem] font-semibold text-ink">{TRIAGE.scannerLabel}</h3>
            <button type="button" onClick={reset} className={ICON_BUTTON}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
          <div role="group" aria-label="Filter by level" className="mt-3 flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.75rem] font-medium transition-colors',
                  filter === t ? 'bg-ink text-white' : 'bg-ink/[0.05] text-ink/65 hover:bg-ink/[0.09] hover:text-ink',
                )}
              >
                {t === 'all' ? 'All' : LEVEL_NAME[t]}
                <span className={cn('min-w-[1.1rem] rounded-full px-1 text-center text-[0.65rem] tabular-nums', filter === t ? 'bg-white/20' : 'bg-white')}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {queue.map((l) => (
                <motion.li
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                >
                  <ScannerCard
                    lead={l}
                    onSave={() => setStatus(l, 'engaged', `Saved: ${l.title}. It's now in your lead list as Engaged.`)}
                    onDismiss={() => setStatus(l, 'archived', `Dismissed: ${l.title}. Archived.`)}
                    onAnalyze={() => change(l.id, analyze, `Analyzed: ${l.title}.`)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {queue.length === 0 && (
            <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-ink/[0.14] px-6 py-10 text-center">
              <Inbox className="h-6 w-6 text-ink/30" />
              <p className="mt-3 text-[0.85rem] text-muted-foreground">
                {counts.all === 0 ? 'No leads left. Run a scan to find more, or reset the list.' : `No ${filter} leads found. Try a different filter.`}
              </p>
            </div>
          )}
        </div>

        {/* ---------- the lead list ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-4 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-9', LINE)}>
          <h3 className="text-[0.8rem] font-semibold text-ink">{TRIAGE.crmLabel}</h3>
          <p className="mt-1 text-[0.72rem] text-muted-foreground">Last changed first</p>
          <ul className="mt-4 space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {saved.map((l) => (
                <motion.li
                  key={l.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                  className="rounded-lg border border-ink/[0.08] bg-white p-3"
                >
                  <p className="line-clamp-2 text-[0.84rem] font-medium leading-snug text-ink">{l.title}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <LevelChip level={l.level} className="h-5 px-1.5 text-[0.65rem]" />
                    <label className="sr-only" htmlFor={`status-${l.id}`}>
                      Status for {l.title}
                    </label>
                    <select
                      id={`status-${l.id}`}
                      value={l.status}
                      onChange={(e) => setStatus(l, e.target.value as Status, `Status changed to ${STATUS_NAME[e.target.value as Status]}.`)}
                      className="h-7 min-w-0 flex-1 rounded-md border border-ink/[0.1] bg-white px-1.5 text-[0.75rem] text-ink outline-none focus-visible:border-cta/50 focus-visible:ring-2 focus-visible:ring-cta/20"
                    >
                      {SAVED_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_NAME[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => remove(l)}
                      aria-label={`Delete ${l.title}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink/40 transition-colors hover:bg-ink/[0.05] hover:text-ink"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {saved.length === 0 && (
            <p className="mt-4 rounded-lg border border-dashed border-ink/[0.14] px-4 py-8 text-center text-[0.8rem] text-muted-foreground">
              No saved leads yet. Save one from the Scanner’s list.
            </p>
          )}
        </div>
      </Band>
      <Band inner="px-6 py-3.5 text-center text-[0.75rem] text-muted-foreground sm:px-10">{TRIAGE.note}</Band>
    </section>
  );
}

/* The Scanner's card, with the same display rules as scanner/LeadCard.tsx. */
function ScannerCard({ lead, onSave, onDismiss, onAnalyze }: { lead: Lead; onSave: () => void; onDismiss: () => void; onAnalyze: () => void }) {
  const isSaved = lead.status !== 'new';
  return (
    <div
      className={cn(
        'relative rounded-xl border border-l-4 border-ink/[0.08] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-4',
        lead.deepAnalyzed ? (lead.level === 'hot' ? 'border-l-cta' : lead.level === 'warm' ? 'border-l-cta/50' : 'border-l-ink/25') : 'border-l-ink/10',
      )}
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Dismiss ${lead.title}`}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-ink/35 transition-colors hover:bg-ink/[0.05] hover:text-ink"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex flex-wrap items-center gap-2 pr-7">
        {lead.deepAnalyzed ? (
          <>
            <LevelChip level={lead.level} className="h-5 px-1.5 text-[0.65rem]" />
            <span className="text-[0.7rem] tabular-nums text-muted-foreground">Score: {lead.ai}</span>
          </>
        ) : (
          <span className="inline-flex h-5 items-center gap-1 rounded-md border border-dashed border-ink/[0.2] px-1.5 text-[0.65rem] font-medium text-muted-foreground">
            <CircleDashed className="h-2.5 w-2.5" />
            Unanalyzed
          </span>
        )}
        {isSaved && <span className="rounded-md bg-ink/[0.06] px-1.5 py-0.5 text-[0.65rem] font-medium text-ink/70">{STATUS_NAME[lead.status]}</span>}
        {lead.competitor && (
          <span className="inline-flex h-5 items-center gap-1 rounded-md border border-cta/40 px-1.5 text-[0.65rem] font-medium text-cta">
            <Crosshair className="h-2.5 w-2.5" />
            Competitor
          </span>
        )}
        {lead.deepAnalyzed && lead.confidence < LOW_CONFIDENCE && (
          <span className="text-[0.62rem] text-muted-foreground">~{Math.round(lead.confidence * 100)}% conf</span>
        )}
      </div>
      <p className="mt-2 text-[0.9rem] font-semibold leading-snug text-ink">{lead.title}</p>
      {lead.deepAnalyzed && (
        <p className="mt-1.5 text-[0.75rem] italic leading-relaxed text-muted-foreground">
          <Brain className="mr-1 inline h-3 w-3 text-cta" />
          {lead.reason}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.7rem] text-muted-foreground">{lead.subreddit}</span>
        <span className="flex gap-1.5">
          {!lead.deepAnalyzed && (
            <button type="button" onClick={onAnalyze} className={ICON_BUTTON}>
              <Brain className="h-3.5 w-3.5" />
              Analyze
            </button>
          )}
          <button type="button" onClick={onSave} disabled={isSaved} className={ICON_BUTTON}>
            {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 text-cta" /> : <Bookmark className="h-3.5 w-3.5" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </span>
      </div>
    </div>
  );
}
