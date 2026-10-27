/**
 * A replica of the Reddix Scanner, for the landing showcase.
 *
 * Built from the app's own navigation (Dashboard, Scanner, Leads, Replies,
 * Settings) and laid out like the real page: the greeting and autopilot
 * status, four numbers in a hairline panel, then the live lead feed.
 *
 * Once it's on screen it runs: the newest post is scored, it settles into the
 * feed as Hot or Warm, and the next one arrives on top, with the figures
 * above following along. It holds still off screen, and with reduced motion
 * it shows its first frame and never moves.
 */
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useTransform } from 'motion/react';
import {
  ChevronDown,
  Flame,
  LayoutDashboard,
  MessageSquare,
  Radar,
  Search,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubredditIcon } from './shared';
import { LogoMark } from '@/components/brand/Logo';

/* How long each post takes to score before the next one lands. */
const CYCLE_MS = 3200;
/* New leads before the feed rests, so it doesn't run forever on screen. */
const MAX_NEW = 16;
const EASE = [0.16, 1, 0.3, 1] as const;

const LEADS = [
  { t: 'Looking for a tool to find leads on Reddit automatically', sub: 'r/SaaS', score: 92 },
  { t: 'Best way to monitor Reddit for product mentions?', sub: 'r/startups', score: 78 },
  { t: 'Anyone using AI to draft Reddit replies for outreach?', sub: 'r/Entrepreneur', score: 88 },
  { t: 'How do you get B2B leads without cold email?', sub: 'r/sales', score: 74 },
  { t: 'Need a Reddit monitoring tool for my SaaS — any recs?', sub: 'r/growthhacking', score: 95 },
  { t: 'What do you use to find your first 100 customers?', sub: 'r/startups', score: 84 },
  { t: 'Tool recommendations for tracking competitor mentions?', sub: 'r/marketing', score: 69 },
  { t: 'Switching from manual Reddit prospecting — what works?', sub: 'r/SaaS', score: 86 },
];

/* How long ago each row of the feed landed, top to bottom. */
const AGES = ['now', '3m', '7m', '12m', '18m'];

/* The feed opens with this many leads already scored today. */
const START = 7;
const SUBREDDITS_WATCHED = 14;
const isHot = (score: number) => score >= 80;
const leadAt = (n: number) => LEADS[n % LEADS.length];

const NAV: { label: string; items: { title: string; icon: ComponentType<{ className?: string }>; count?: boolean }[] }[] = [
  {
    label: 'Workspace',
    items: [
      { title: 'Dashboard', icon: LayoutDashboard },
      { title: 'Scanner', icon: Search },
      { title: 'Leads', icon: Users, count: true },
      { title: 'Replies', icon: MessageSquare },
    ],
  },
  { label: 'Account', items: [{ title: 'Settings', icon: Settings }] },
];

/* A figure that counts to its value, and glides when the value changes. */
function Count({ value, run }: { value: number; run: boolean }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString('en-US'));
  useEffect(() => {
    if (run) spring.set(value);
    else spring.jump(value);
  }, [run, value, spring]);
  return <motion.span>{text}</motion.span>;
}

function Meter({ pct }: { pct: number }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
      <span
        className="block h-full rounded-full bg-cta transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

function Stat({
  label,
  icon: Icon,
  value,
  meter,
  hint,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  value: ReactNode;
  meter?: ReactNode;
  hint: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 bg-white p-4 lg:p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[0.75rem] font-medium">{label}</span>
      </div>
      <div className="text-[1.55rem] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</div>
      {meter}
      <p className="text-[0.7rem] text-muted-foreground">{hint}</p>
    </div>
  );
}

function IntentBadge({ score, scoring, run }: { score: number; scoring: boolean; run: boolean }) {
  if (scoring) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink/70">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
        </span>
        Scoring
      </span>
    );
  }
  const hot = isHot(score);
  return (
    <motion.span
      initial={run ? { scale: 0.6, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 24 }}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold',
        hot ? 'bg-cta-soft text-cta' : 'bg-amber-50 text-amber-700',
      )}
    >
      {hot && <Flame className="h-3 w-3" />}
      {hot ? 'Hot' : 'Warm'}
    </motion.span>
  );
}

function ScoreTile({ score, scoring }: { score: number; scoring: boolean }) {
  const hot = isHot(score);
  return (
    <span
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[0.68rem] font-[700] tabular-nums transition-colors duration-500',
        scoring ? 'bg-ink/[0.05] text-ink/40' : hot ? 'bg-cta text-white' : 'bg-amber-400 text-amber-950',
      )}
    >
      {scoring ? '··' : score}
    </span>
  );
}

export function ScannerReplica() {
  const ref = useRef<HTMLDivElement>(null);
  // Half the card on screen before it starts, so it doesn't run down while
  // only its top edge peeks over the fold.
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(0);

  const run = inView && !reduce;
  // The top post waits in "Scoring" even before the card is on screen, so it
  // doesn't flash its score and then take it back as the feed starts.
  const feeding = !reduce && done < MAX_NEW;
  const live = run && feeding;

  // Off screen, start the day over, so the next visit sees it from the top.
  useEffect(() => {
    if (!inView) setDone(0);
  }, [inView]);

  // One lead per cycle, only while the card is on screen.
  useEffect(() => {
    if (!live) return;
    const id = window.setTimeout(() => setDone((d) => d + 1), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [live, done]);

  // The newest post (top) is being scored while the feed is live; everything
  // under it has its score.
  const newest = START + done;
  const scored = feeding ? newest : newest + 1;
  let hot = 0;
  for (let n = 0; n < scored; n++) if (isHot(leadAt(n).score)) hot++;

  const rows = Array.from({ length: 5 }, (_, i) => {
    const n = newest - i;
    return { n, lead: leadAt(n), scoring: i === 0 && feeding, age: AGES[i] };
  });

  return (
    <div
      ref={ref}
      className="flex overflow-hidden rounded-xl bg-white text-left font-jakarta shadow-[0_2px_4px_rgba(72,4,8,0.08),0_32px_80px_-24px_rgba(72,4,8,0.55)] ring-1 ring-black/5"
    >
      {/* Sidebar — the app's own navigation, Scanner selected. */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-ink/[0.06] bg-surface/60 p-3 md:flex lg:w-56">
        <div className="flex items-center justify-between px-1.5 pb-4 pt-1">
          <LogoMark className="h-6 w-6" />
          <span className="flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.68rem] font-medium text-ink">
            yoursite.com
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </span>
        </div>
        {NAV.map((section) => (
          <div key={section.label} className="mt-2 first-of-type:mt-0">
            <p className="px-2 pb-1.5 pt-2 text-[0.65rem] font-medium text-muted-foreground">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map(({ title, icon: Icon, count }) => {
                const active = title === 'Scanner';
                return (
                  <li
                    key={title}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.78rem] font-medium',
                      active
                        ? 'bg-cta-soft font-semibold text-cta shadow-[inset_0_0_0_1px_hsl(var(--cta)/0.16)]'
                        : 'text-ink/70',
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-cta' : 'text-ink/55')} />
                    {title}
                    {count && (
                      <span className="ml-auto rounded-md bg-ink/[0.06] px-1.5 text-[0.62rem] font-semibold text-ink/70 tabular-nums">
                        {scored}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="mt-auto rounded-lg border border-ink/[0.07] bg-white p-3">
          <p className="text-[0.68rem] font-medium text-ink">Next scan</p>
          <p className="mt-0.5 text-[0.65rem] text-muted-foreground">Every 6 hours · autopilot</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.72rem] text-muted-foreground">Scanner</p>
            <h3 className="mt-0.5 text-[1.35rem] font-semibold tracking-tight text-ink sm:text-[1.5rem]">Good morning</h3>
            <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
              Watching {SUBREDDITS_WATCHED} subreddits — <span className="tabular-nums">{scored}</span> leads found today.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-3 py-1.5 text-[0.75rem] font-medium text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cta" />
            </span>
            Autopilot <span className="font-semibold text-cta">On</span>
          </span>
        </header>

        {/* The numbers, in one hairline-divided panel, as in the app. */}
        <div className="overflow-hidden rounded-xl border border-ink/[0.07]">
          <div className="grid grid-cols-2 gap-px bg-ink/[0.07] lg:grid-cols-4">
            <Stat label="Leads today" icon={Users} value={<Count value={scored} run={run} />} hint="High-intent posts found" />
            <Stat
              label="Hot leads"
              icon={Flame}
              value={<span className="tabular-nums">{hot}</span>}
              meter={<Meter pct={(hot / Math.max(1, scored)) * 100} />}
              hint="Scored 80 or higher"
            />
            <Stat
              label="Subreddits"
              icon={Radar}
              value={
                <span className="inline-flex items-center gap-2 text-[1.15rem]">
                  <span className="h-2 w-2 rounded-full bg-cta" />
                  <span className="text-cta">Live</span>
                </span>
              }
              hint={`${SUBREDDITS_WATCHED} watched · ${done > 0 ? 'scanned just now' : 'scanned 3m ago'}`}
            />
            <Stat
              label="Replies drafted"
              icon={Sparkles}
              value={<Count value={scored} run={run} />}
              hint="Ready to copy and post"
            />
          </div>
        </div>

        {/* The feed: newest post on top, scored as it lands. */}
        <div className="overflow-hidden rounded-xl border border-ink/[0.07]">
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
            <p className="text-[0.85rem] font-semibold text-ink">Live lead feed</p>
            <div className="flex gap-1 text-[0.68rem] font-medium">
              <span className="rounded-md bg-ink/[0.06] px-2 py-0.5 text-ink">All</span>
              <span className="px-2 py-0.5 text-muted-foreground">Hot</span>
              <span className="px-2 py-0.5 text-muted-foreground">Warm</span>
            </div>
          </div>
          <div className="hidden grid-cols-[1fr_6.5rem_5rem] gap-4 border-b border-ink/[0.06] px-4 py-2 text-[0.65rem] font-medium text-muted-foreground sm:grid lg:grid-cols-[1fr_8.5rem_3rem_5rem]">
            <span>Post</span>
            <span>Subreddit</span>
            <span className="hidden lg:block">Age</span>
            <span>Intent</span>
          </div>
          <ul className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map(({ n, lead, scoring, age }) => (
                <motion.li
                  key={n}
                  layout={run ? 'position' : false}
                  initial={run ? { opacity: 0, y: -14 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative grid grid-cols-[1fr_auto] items-center gap-4 border-b border-ink/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[1fr_6.5rem_5rem] lg:grid-cols-[1fr_8.5rem_3rem_5rem]"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <ScoreTile score={lead.score} scoring={scoring} />
                    <span className="min-w-0 truncate text-[0.78rem] font-medium text-ink">{lead.t}</span>
                  </span>
                  <span className="hidden min-w-0 items-center gap-1.5 text-[0.72rem] text-ink/80 sm:flex">
                    <SubredditIcon name={lead.sub} className="h-4 w-4 text-[0.55rem]" />
                    <span className="truncate">{lead.sub}</span>
                  </span>
                  <span className="hidden text-[0.72rem] text-muted-foreground tabular-nums lg:block">
                    {age}
                  </span>
                  <span className="flex items-center">
                    <IntentBadge score={lead.score} scoring={scoring} run={run} />
                  </span>
                  {/* The post being scored fills a hairline as it goes. */}
                  {scoring && live && (
                    <motion.span
                      key={`progress-${n}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cta/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
