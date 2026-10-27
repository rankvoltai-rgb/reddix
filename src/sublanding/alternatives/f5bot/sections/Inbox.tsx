import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Ban, Clock, Mail } from 'lucide-react';
import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { firstPass, type FirstPass } from '@/sublanding/features/intent-detection/signals';
import { INBOX } from '../content';

type Mode = 'arrival' | 'reddix';

const KEYWORD = new RegExp(`(${INBOX.keyword.replace(/s$/, '')}s?)`, 'i');

/* Front of the line first (more points first), then the queue, then the
   posts the rules skip. */
const RANK: Record<FirstPass['state'], number> = { front: 0, queue: 1, skipped: 2, short: 3, empty: 4 };

function verdictOf(pass: FirstPass) {
  switch (pass.state) {
    case 'front':
      return {
        icon: <ArrowUpRight className="h-3.5 w-3.5" />,
        label: pass.result.boost ? `Scored first · +${pass.result.boost} points` : 'Scored first',
        tone: 'bg-cta-soft text-cta-deep',
      };
    case 'queue':
      return { icon: <Clock className="h-3.5 w-3.5" />, label: 'Scored after the priority posts', tone: 'bg-ink/[0.05] text-ink/70' };
    case 'skipped':
      return { icon: <Ban className="h-3.5 w-3.5" />, label: `Skipped before the AI · “${pass.junk.join('”, “')}”`, tone: 'bg-ink/[0.04] text-ink/50' };
    default:
      return { icon: <Ban className="h-3.5 w-3.5" />, label: 'Too short to judge', tone: 'bg-ink/[0.04] text-ink/50' };
  }
}

/* The same six posts, as an alert inbox delivers them and as Reddix's first
   pass orders them. Verdicts come from the scanner's own rules. */
export function Inbox() {
  const [mode, setMode] = useState<Mode>('arrival');
  const rows = useMemo(
    () =>
      INBOX.posts.map((p, i) => {
        const pass = firstPass(p.text, [INBOX.competitor]);
        const boost = pass.state === 'front' || pass.state === 'queue' ? pass.result.boost : 0;
        return { ...p, i, pass, boost };
      }),
    [],
  );
  const ordered = useMemo(
    () => (mode === 'arrival' ? rows : [...rows].sort((a, b) => RANK[a.pass.state] - RANK[b.pass.state] || b.boost - a.boost || a.i - b.i)),
    [mode, rows],
  );
  const counts = useMemo(() => {
    const c = { front: 0, queue: 0, skipped: 0 };
    rows.forEach((r) => {
      if (r.pass.state in c) c[r.pass.state as keyof typeof c] += 1;
    });
    return c;
  }, [rows]);

  return (
    <section id="inbox" aria-labelledby="inbox-title" className="scroll-mt-16">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <h2 id="inbox-title" className={SECTION_TITLE}>
          {INBOX.title}
        </h2>
        <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{INBOX.body}</p>
      </Band>
      <Band inner="bg-surface/70 px-4 py-8 sm:px-10 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Order" className="inline-flex rounded-lg border border-ink/[0.1] bg-white p-1">
              {(
                [
                  ['arrival', 'As alerts arrive'],
                  ['reddix', 'Reddix’s first pass'],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'h-8 rounded-md px-3 text-[0.8rem] font-semibold transition-colors',
                    mode === m ? 'bg-ink text-white' : 'text-ink/65 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="text-[0.8rem] text-muted-foreground">
              {mode === 'arrival'
                ? `${rows.length} alerts, newest first, all equal`
                : `${counts.front} scored first · ${counts.queue} queued · ${counts.skipped} skipped`}
            </p>
          </div>

          <ul className="mt-5 space-y-2.5">
            {ordered.map((r) => {
              const v = verdictOf(r.pass);
              const dim = mode === 'reddix' && r.pass.state === 'skipped';
              return (
                <motion.li
                  layout
                  key={r.i}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  className={cn('rounded-xl border border-ink/[0.08] bg-white p-4 transition-opacity', dim && 'opacity-60')}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-muted-foreground">
                    <SubredditIcon name={r.sub} className="h-4 w-4 text-[0.55rem]" />
                    <span className="font-semibold text-ink/80">{r.sub}</span>
                    <span>· {r.age} ago</span>
                    <span className="ml-auto inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Matched “{INBOX.keyword}”
                    </span>
                  </div>
                  <p className={cn('mt-2 text-[0.92rem] leading-relaxed text-ink', dim && 'line-through decoration-ink/30')}>
                    {r.text.split(KEYWORD).map((part, j) =>
                      KEYWORD.test(part) ? (
                        <span key={j} className="rounded bg-ink/[0.07] px-1 font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                  {mode === 'reddix' && (
                    <p className={cn('mt-3 inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-semibold', v.tone)}>
                      {v.icon}
                      <span className="truncate">{v.label}</span>
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ul>
          <p className={cn('mt-5 border-t pt-4 text-[0.75rem] leading-relaxed text-muted-foreground', LINE)}>{INBOX.note}</p>
        </div>
      </Band>
    </section>
  );
}
