import { useState, type ReactNode } from 'react';
import { Clock, FlaskConical, Minus, Plus, RotateCcw, ScanSearch } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { SANDBOX } from '../content';
import {
  dismiss,
  draftReply,
  EMPTY,
  markReplied,
  morePosts,
  save,
  scan,
  scanBlocked,
  SUBREDDIT_POOL,
  type Account,
  type Lead,
} from '../model';
import { Screen } from '../Screen';

const BUTTON =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 text-[0.8rem] font-medium text-ink/80 transition-colors hover:border-ink/[0.2] hover:text-ink disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-ink/[0.1]';
const SMALL = 'inline-flex h-7 items-center rounded-md border border-ink/[0.1] bg-white px-2 text-[0.7rem] font-medium text-ink/75 transition-colors hover:border-ink/[0.2] hover:text-ink';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={cn('border-t pt-5 first:border-t-0 first:pt-0', LINE)}>
      <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* Controls on the left, the dashboard on the right, both on one account. */
export function Sandbox() {
  const [account, setAccount] = useState<Account>(EMPTY);
  const [said, setSaid] = useState('');
  const act = (next: Account, message: string) => {
    setAccount(next);
    setSaid(message);
  };

  const blocked = scanBlocked(account);
  const leads = [...account.leads].sort((a, b) => b.foundAt - a.foundAt || b.id - a.id);
  const nextSub = SUBREDDIT_POOL.find((s) => !account.subreddits.includes(s));

  const runScan = () => {
    const next = scan(account);
    const found = next.leads.length - account.leads.length;
    act(next, found ? `Scan found ${found} leads.` : 'Scan ran and found no new posts.');
  };

  return (
    <section id="sandbox" aria-labelledby="sandbox-title" className="scroll-mt-16">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={FlaskConical}>{SANDBOX.pill}</Pill>
          <h2 id="sandbox-title" className={cn('mt-5', SECTION_TITLE)}>
            {SANDBOX.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{SANDBOX.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <p className="sr-only" aria-live="polite">
          {said}
        </p>

        {/* ---------- controls ---------- */}
        <div className="min-w-0 space-y-5 px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.75rem] text-muted-foreground">
              Sandbox clock: <span className="font-semibold tabular-nums text-ink">{clock(account.now)}</span>
            </span>
            <button type="button" className={SMALL} onClick={() => act(EMPTY, 'Sandbox reset to an empty account.')}>
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </button>
          </div>

          <Group title="Subreddits">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={BUTTON}
                disabled={!nextSub}
                onClick={() => nextSub && act({ ...account, subreddits: [...account.subreddits, nextSub] }, `Added ${nextSub}.`)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add {nextSub ?? 'subreddit'}
              </button>
              <button
                type="button"
                className={BUTTON}
                disabled={account.subreddits.length === 0}
                onClick={() => act({ ...account, subreddits: account.subreddits.slice(0, -1) }, `Removed ${account.subreddits.at(-1)}.`)}
              >
                <Minus className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </Group>

          <Group title="Scan">
            <div className="flex flex-wrap gap-2">
              <button type="button" className={cn(BUTTON, 'border-cta bg-cta text-white hover:border-cta-hover hover:bg-cta-hover hover:text-white disabled:hover:bg-cta')} disabled={!!blocked} onClick={runScan}>
                <ScanSearch className="h-3.5 w-3.5" />
                Run a scan
              </button>
              <button type="button" className={BUTTON} onClick={() => act({ ...account, now: account.now + 5 }, 'Five minutes later.')}>
                <Clock className="h-3.5 w-3.5" />
                Wait 5 min
              </button>
              <button type="button" className={BUTTON} onClick={() => act({ ...account, now: account.now + 60 }, 'An hour later.')}>
                Wait 1 hour
              </button>
            </div>
            <p className="mt-2.5 min-h-[1.25rem] text-[0.75rem] text-muted-foreground">
              {blocked ?? (morePosts(account) ? 'Ready. Each sandbox scan finds up to 3 illustrative posts.' : 'The sandbox is out of illustrative posts; scans will find nothing new.')}
            </p>
          </Group>

          <Group title="Leads">
            {leads.length === 0 ? (
              <p className="rounded-lg border border-dashed border-ink/[0.14] px-4 py-5 text-center text-[0.78rem] text-muted-foreground">No leads yet. Add a subreddit and run a scan.</p>
            ) : (
              <ul className="max-h-[19rem] space-y-2 overflow-y-auto pr-1">
                {leads.map((l) => (
                  <LeadRow key={l.id} lead={l} account={account} act={act} />
                ))}
              </ul>
            )}
          </Group>
        </div>

        {/* ---------- the dashboard ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-3 py-8 sm:px-8 lg:border-l lg:border-t-0', LINE)}>
          <Screen account={account} />
        </div>
      </Band>
      <Band inner="px-6 py-3.5 text-center text-[0.75rem] text-muted-foreground sm:px-10">{SANDBOX.note}</Band>
    </section>
  );
}

function LeadRow({ lead, account, act }: { lead: Lead; account: Account; act: (a: Account, m: string) => void }) {
  return (
    <li className="rounded-lg border border-ink/[0.08] bg-white p-2.5">
      <p className="truncate text-[0.8rem] font-medium text-ink">{lead.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-auto text-[0.68rem] capitalize text-muted-foreground">
          {lead.level} · {lead.status}
        </span>
        {lead.status === 'new' && (
          <>
            <button type="button" className={SMALL} onClick={() => act(save(account, lead.id), 'Lead saved: now Engaged.')}>
              Save
            </button>
            <button type="button" className={SMALL} onClick={() => act(dismiss(account, lead.id), 'Lead dismissed: Archived, still counted.')}>
              Dismiss
            </button>
          </>
        )}
        {lead.status !== 'archived' && (
          <button type="button" className={SMALL} onClick={() => act(draftReply(account, lead.id), 'Reply drafted: one more reply ready, lead Engaged.')}>
            Draft reply
          </button>
        )}
        {lead.status === 'engaged' && (
          <button type="button" className={SMALL} onClick={() => act(markReplied(account, lead.id), 'Marked Replied.')}>
            Mark replied
          </button>
        )}
      </div>
    </li>
  );
}

function clock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `+${h}h ${m}m` : `+${m}m`;
}
