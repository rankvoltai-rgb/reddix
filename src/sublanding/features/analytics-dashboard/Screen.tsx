/**
 * A replica of the Reddix dashboard, drawn from an Account by the same rules
 * the app uses (model.ts). The hero shows it at rest; the sandbox drives it.
 */
import type { ReactNode } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Clock, ExternalLink, Flame, Lock, MessageSquare, Search, Sparkles, Star, Trophy, Users, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SAMPLE_NAME, STATES } from './content';
import { badges, lastScanLabel, panel, recent, stats, type Account, type Level } from './model';

const DOT: Record<Level, string> = { hot: 'bg-cta', warm: 'bg-cta/55', research: 'bg-ink/35', low: 'bg-ink/15' };
const CHIP: Record<Level, string> = {
  hot: 'bg-cta text-white',
  warm: 'bg-cta-soft text-cta-deep',
  research: 'bg-ink/[0.06] text-ink/70',
  low: 'bg-ink/[0.035] text-ink/45',
};
const BADGE_ICON: LucideIcon[] = [Flame, Sparkles, Star, Zap, Trophy];

/** A numbered pin for the hero's annotations. */
export function Pin({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('absolute z-10 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.62rem] font-semibold text-white ring-2 ring-white', className)}
    >
      {n}
    </span>
  );
}

export function Screen({ account, pins = false }: { account: Account; pins?: boolean }) {
  const s = stats(account);
  const view = panel(account);
  const scan = lastScanLabel(account);
  const b = badges(account);
  const unlocked = b.list.filter((x) => x.unlocked).length;

  const counts: { label: string; value: number; icon: LucideIcon }[] = [
    { label: 'Leads', value: s.leads, icon: Users },
    { label: 'Hot', value: s.hot, icon: Flame },
    { label: 'Replies ready', value: s.drafts, icon: MessageSquare },
    { label: 'Subreddits', value: s.subreddits, icon: Search },
  ];

  return (
    <div className="space-y-3.5">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.6rem]">Welcome back, {SAMPLE_NAME}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.72rem] text-muted-foreground">
            <span>Your Reddit lead command center.</span>
            {scan && (
              <span className="relative inline-flex items-center gap-1.5 rounded-full border border-ink/[0.08] bg-surface px-2 py-0.5">
                <span className={cn('h-1.5 w-1.5 rounded-full', scan.recent ? 'bg-emerald-500 motion-safe:animate-pulse' : 'bg-ink/25')} />
                <Clock className="h-3 w-3" />
                {scan.text}
                {pins && <Pin n={5} className="-right-3 -top-3" />}
              </span>
            )}
          </div>
        </div>
        <div aria-hidden className="flex items-center gap-1.5 text-[0.72rem]">
          <span className="rounded-md px-2 py-1 text-muted-foreground">All leads</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-cta px-2.5 py-1 font-semibold text-white">
            <Sparkles className="h-3 w-3" />
            Scan now
          </span>
        </div>
      </div>

      {/* the four counts */}
      <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-ink/[0.08] bg-white sm:grid-cols-4">
        {counts.map((c, i) => (
          <div
            key={c.label}
            className={cn('relative px-3.5 py-3', i % 2 === 1 && 'border-l border-ink/[0.07]', i > 1 && 'border-t border-ink/[0.07] sm:border-t-0', i === 2 && 'sm:border-l')}
          >
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <c.icon className="h-3 w-3" />
              {c.label}
            </dt>
            <dd className="mt-1 text-[1.5rem] font-semibold leading-none tabular-nums text-ink">{c.value}</dd>
            {pins && <Pin n={i + 1} className="right-2 top-2" />}
          </div>
        ))}
      </dl>

      {/* the main panel */}
      <div className="relative rounded-xl border border-ink/[0.08] bg-white p-3.5 sm:p-4">
        {pins && view === 'leads' && <Pin n={6} className="-right-2 -top-2" />}
        {view === 'leads' ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[0.95rem] font-semibold text-ink">
                {STATES.states[2].title}
                <span className="ml-2 rounded-md border border-ink/[0.1] px-1.5 py-0.5 text-[0.62rem] font-normal text-muted-foreground">
                  {recent(account).length} latest
                </span>
              </p>
              <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                View all <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <ul className="divide-y divide-ink/[0.06]">
              {recent(account).map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-3 py-2">
                  <span className="flex min-w-0 items-start gap-2.5">
                    <span aria-hidden className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', DOT[l.level])} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[0.82rem] font-medium text-ink">{l.title}</span>
                        <ExternalLink aria-hidden className="h-3 w-3 shrink-0 text-ink/25" />
                      </span>
                      <span className="mt-0.5 block text-[0.68rem] text-muted-foreground">
                        <span className="font-medium text-ink/65">{l.subreddit}</span>
                        <span className="opacity-50"> · </span>
                        {ago(account.now - l.foundAt)}
                        {l.status !== 'new' && <span className="opacity-70"> · {l.status}</span>}
                      </span>
                    </span>
                  </span>
                  <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold capitalize', CHIP[l.level])}>{l.level}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyPanel icon={view === 'setup' ? Search : Zap} state={view === 'setup' ? 0 : 1} subreddits={s.subreddits} />
        )}
      </div>

      {/* achievements */}
      <div className="rounded-xl border border-ink/[0.08] bg-white p-3.5 sm:p-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.85rem] font-semibold text-ink">Achievements</p>
          <span className="text-[0.7rem] text-muted-foreground">
            {unlocked}/{b.list.length} unlocked
          </span>
        </div>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {b.list.map((x, i) => {
            const Icon = x.unlocked ? BADGE_ICON[i] : Lock;
            return (
              <li
                key={x.name}
                title={`${x.name}: ${x.threshold} engaged`}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border',
                  x.unlocked ? 'border-cta/30 bg-cta-soft text-cta' : 'border-ink/[0.08] bg-surface text-ink/25',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">
                  {x.name}, {x.unlocked ? 'unlocked' : 'locked'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function EmptyPanel({ icon: Icon, state, subreddits }: { icon: LucideIcon; state: 0 | 1; subreddits: number }) {
  const s = STATES.states[state];
  const body = state === 1 ? `You have ${subreddits} subreddit${subreddits !== 1 ? 's' : ''} configured. Run a scan to discover potential buyers.` : s.body;
  return (
    <div className="px-2 py-6 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink/45">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-[1rem] font-semibold text-ink">{s.title}</p>
      <p className="mx-auto mt-1 max-w-xs text-[0.78rem] leading-relaxed text-muted-foreground">{body}</p>
      <ActionChip>{s.action}</ActionChip>
    </div>
  );
}

function ActionChip({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="mt-4 inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[0.7rem] font-semibold text-white">
      {children}
      <ArrowRight className="h-3 w-3" />
    </span>
  );
}

/** A lead's age, worded by date-fns as on the real dashboard. */
function ago(minutes: number) {
  return formatDistanceToNow(new Date(Date.now() - minutes * 60_000), { addSuffix: true });
}
