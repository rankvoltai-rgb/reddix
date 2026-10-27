import { useEffect, useId, useState } from 'react';
import { Check, ListChecks, RotateCcw } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKLIST, DATES } from '../content';
import { daysUntilShutdown, formatDay, lifetimeActive, urgency, type Urgency } from '../dates';
import { useToday } from '../useToday';

const KEY = 'reddix:gummysearch-checklist';

function load(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function save(done: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(done));
  } catch {
    // Storage blocked: the list still works, it just won't be remembered.
  }
}

/* The list on the left, a status panel on the right that reads the date and
   the ticks together and says what's left. */
export function Checklist() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => setDone(load()), []);
  const toggle = (id: string) =>
    setDone((d) => {
      const next = d.includes(id) ? d.filter((x) => x !== id) : [...d, id];
      save(next);
      return next;
    });
  const reset = () => {
    setDone([]);
    save([]);
  };

  return (
    <section id="checklist" aria-labelledby="checklist-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={ListChecks}>{CHECKLIST.pill}</Pill>
        <h2 id="checklist-title" className={cn('mt-5 max-w-3xl', SECTION_TITLE)}>
          {CHECKLIST.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{CHECKLIST.body}</p>
      </Band>
      <Band inner="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ol className="divide-y divide-ink/[0.07]">
          {CHECKLIST.items.map((item, i) => (
            <Item key={item.id} index={i} item={item} checked={done.includes(item.id)} onToggle={() => toggle(item.id)} />
          ))}
        </ol>
        <Status done={done.length} onReset={reset} />
      </Band>
    </section>
  );
}

function Item({
  index,
  item,
  checked,
  onToggle,
}: {
  index: number;
  item: (typeof CHECKLIST.items)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <li className="flex gap-4 px-6 py-6 sm:px-10 lg:pl-12">
      <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <label
        htmlFor={id}
        aria-hidden
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-cta/25',
          checked ? 'border-cta bg-cta text-white' : 'border-ink/[0.18] bg-white text-transparent hover:border-ink/30',
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </label>
      <div className="min-w-0">
        <p className="text-[0.72rem] font-semibold tabular-nums text-muted-foreground">Step {index + 1}</p>
        <label htmlFor={id} className={cn('mt-0.5 block cursor-pointer text-[1.02rem] font-semibold leading-snug', checked ? 'text-ink/50 line-through decoration-ink/30' : 'text-ink')}>
          {item.title}
        </label>
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">{item.body}</p>
        <p className="mt-2.5 text-[0.82rem] font-medium text-cta-deep">{item.next}</p>
      </div>
    </li>
  );
}

const MESSAGE: Record<Urgency, (days: number) => string> = {
  calm: (d) => `${d} days left. Enough time to do this properly, not enough to forget about it.`,
  soon: (d) => `${d} days left. Do the downloads this week; rebuilding can wait.`,
  urgent: (d) => `${d === 1 ? 'One day' : `${d} days`} left. Download your data first, then list your audiences.`,
  gone: (d) => (d === 0 ? 'GummySearch shuts down today. Anything not saved is about to be deleted.' : 'GummySearch has shut down and its data is deleted. Rebuild from whatever you saved.'),
};

function Status({ done, onReset }: { done: number; onReset: () => void }) {
  const now = useToday();
  const days = daysUntilShutdown(now);
  const state = urgency(days);
  const total = CHECKLIST.items.length;
  const pct = Math.round((done / total) * 100);

  return (
    <aside className={cn('border-t bg-surface/70 lg:border-l lg:border-t-0', LINE)} aria-live="polite">
      <div className="px-6 py-8 sm:px-10 lg:sticky lg:top-20 lg:px-10">
        <p className="text-[0.8rem] font-semibold text-ink">Your progress</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">{done}</span>
          <span className="pb-1 text-[0.95rem] text-muted-foreground">of {total} saved</span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-ink/[0.07]">
          <div className="h-full rounded-full bg-cta transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>

        <div className={cn('mt-6 rounded-lg border p-4', state === 'calm' ? 'border-ink/[0.08] bg-white' : 'border-cta/30 bg-white')}>
          <p className={cn('text-[0.9rem] font-semibold', state === 'calm' ? 'text-ink' : 'text-cta-deep')}>
            {done === total && state !== 'gone' ? 'Everything’s saved.' : MESSAGE[state](days)}
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
            Deletion date: {formatDay(DATES.shutdown)}.
            {lifetimeActive(now) && ` Lifetime-deal access ends ${formatDay(DATES.lifetimeEnds)}.`}
          </p>
        </div>

        {done > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear my ticks
          </button>
        )}
      </div>
    </aside>
  );
}
