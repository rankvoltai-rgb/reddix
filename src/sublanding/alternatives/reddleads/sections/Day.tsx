import { useId, useMemo, useState, type MouseEvent } from 'react';
import { BellRing, CalendarClock, Inbox, Plus, X } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, DAY, NAME, RL_PLANS, type PlanId } from '../content';

const DAY_MIN = 24 * 60;
/** Reddix's rule: at most one scan every 5 minutes. */
const GAP = 5;
const MAX_SCANS = 8;

const pct = (m: number) => `${(Math.min(m, DAY_MIN) / DAY_MIN) * 100}%`;
const clock = (m: number) => {
  const d = ((m % DAY_MIN) + DAY_MIN) % DAY_MIN;
  return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}${m >= DAY_MIN ? ' tomorrow' : ''}`;
};
const wait = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`);
const fromInput = (v: string) => {
  const [h, m] = v.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};
const tooClose = (scans: number[], m: number, except = -1) => scans.some((s, i) => i !== except && Math.abs(s - m) < GAP);

/* A 24-hour strip with two lanes: ReddLeads' scan ticks at the plan's
   interval, and the Reddix scans you place. Move the post; each lane shows
   when it would first be seen. */
export function Day() {
  const ids = { post: useId() };
  const [plan, setPlan] = useState<PlanId>('pro');
  const [post, setPost] = useState(10 * 60 + 20);
  const [scans, setScans] = useState<number[]>([...DAY.defaultScans]);
  const [note, setNote] = useState('');

  const rl = RL_PLANS[plan];
  const sorted = useMemo(() => [...scans].sort((a, b) => a - b), [scans]);

  const rlNext = (Math.floor(post / rl.every) + 1) * rl.every;
  const rxNext = sorted.length ? (sorted.find((s) => s > post) ?? sorted[0] + DAY_MIN) : null;

  const addAt = (m: number) => {
    const t = Math.max(0, Math.min(DAY_MIN - GAP, Math.round(m / GAP) * GAP));
    if (scans.length >= MAX_SCANS) return setNote(`Up to ${MAX_SCANS} scans in this example.`);
    if (tooClose(scans, t)) return setNote(`Scans must be at least ${GAP} minutes apart.`);
    setNote('');
    setScans((s) => [...s, t]);
  };
  const change = (i: number, v: string) => {
    const m = fromInput(v);
    if (m === null) return;
    if (tooClose(scans, m, i)) return setNote(`Scans must be at least ${GAP} minutes apart.`);
    setNote('');
    setScans((s) => s.map((x, j) => (j === i ? m : x)));
  };
  const remove = (i: number) => {
    setNote('');
    setScans((s) => s.filter((_, j) => j !== i));
  };
  const onStrip = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    addAt(((e.clientX - r.left) / r.width) * DAY_MIN);
  };
  const nextFree = () => {
    for (let m = 8 * 60; m < DAY_MIN; m += 60) if (!tooClose(scans, m)) return m;
    return 0;
  };

  return (
    <section id="day" aria-labelledby="day-title" className="scroll-mt-16">
      <Band inner="grid gap-5 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={CalendarClock}>{DAY.pill}</Pill>
          <h2 id="day-title" className={cn('mt-5', SECTION_TITLE)}>
            {DAY.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{DAY.body}</p>
      </Band>

      {/* ---------- controls ---------- */}
      <Band inner="grid gap-6 px-5 py-6 sm:px-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:px-12">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span id="rl-plan" className="text-[0.82rem] font-semibold text-ink">{NAME} plan</span>
        <div role="radiogroup" aria-labelledby="rl-plan" className="flex w-fit rounded-lg border border-ink/[0.1] bg-surface p-1">
          {(Object.keys(RL_PLANS) as PlanId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={plan === id}
              onClick={() => setPlan(id)}
              className={cn(
                'h-8 rounded-md px-3 text-[0.82rem] font-medium transition-colors',
                plan === id ? 'bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : 'text-ink/60 hover:text-ink',
              )}
            >
              {RL_PLANS[id].name}
              <span className="ml-1.5 text-[0.7rem] tabular-nums text-muted-foreground">{RL_PLANS[id].every}m</span>
            </button>
          ))}
        </div>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor={ids.post} className="shrink-0 text-[0.82rem] font-semibold text-ink">
            {DAY.postLabel} <span className="tabular-nums text-cta">{clock(post)}</span>
          </label>
          <input id={ids.post} type="range" min={0} max={DAY_MIN - GAP} step={GAP} value={post} onChange={(e) => setPost(Number(e.target.value))} className="w-full accent-cta" />
        </div>
      </Band>

      {/* ---------- the day ---------- */}
      <Band inner="px-5 py-8 sm:px-10 lg:px-12">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
          <span />
          <div aria-hidden className="relative h-4 text-[0.68rem] tabular-nums text-muted-foreground">
            {[0, 6, 12, 18, 24].map((h) => (
              <span key={h} className={cn('absolute', h === 0 ? 'left-0' : h === 24 ? 'right-0' : '-translate-x-1/2')} style={h === 0 || h === 24 ? undefined : { left: pct(h * 60) }}>
                {String(h).padStart(2, '0')}:00
              </span>
            ))}
          </div>

          <span className="self-center text-[0.78rem] font-semibold leading-tight text-ink">{NAME}</span>
          <div className="relative h-11 overflow-hidden rounded-lg border border-ink/[0.08] bg-surface">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(to right, hsl(var(--ink) / 0.22) 1px, transparent 1px)',
                backgroundSize: `${(rl.every / DAY_MIN) * 100}% 100%`,
              }}
            />
            <Wait from={post} to={rlNext} tone="ink" />
            <PostMark at={post} />
          </div>

          <span className="self-center text-[0.78rem] font-semibold leading-tight text-cta">Reddix</span>
          <div
            className="relative h-11 cursor-copy overflow-hidden rounded-lg border border-cta/20 bg-cta-soft/40"
            onClick={onStrip}
            title="Click to add a scan"
          >
            {rxNext !== null && <Wait from={post} to={rxNext} tone="red" />}
            {sorted.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(scans.indexOf(s));
                }}
                aria-label={`Remove the ${clock(s)} scan`}
                className="absolute top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cta text-white shadow-[0_1px_3px_rgba(16,24,40,0.25)] ring-2 ring-white transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/30"
                style={{ left: pct(s) }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </button>
            ))}
            <PostMark at={post} />
          </div>
        </div>
        <p className="mt-3 pl-[5.25rem] text-[0.72rem] text-muted-foreground sm:pl-[7.25rem]">
          Ticks: {NAME} {rl.name} scans every {rl.every} minutes. Dots: your Reddix scans; click the strip to add one, or a dot to remove it.
        </p>
      </Band>

      {/* ---------- outcome and scan list ---------- */}
      <Band inner="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div aria-live="polite" className={cn('grid gap-px border-b bg-ink/[0.07] sm:grid-cols-2 lg:border-b-0 lg:border-r', LINE)}>
          <Outcome
            name={`${NAME} ${rl.name}`}
            time={clock(rlNext)}
            after={wait(rlNext - post)}
            icon={rl.alerts ? BellRing : Inbox}
            detail={rl.alerts ? DAY.alertYes : DAY.alertNo}
          />
          {rxNext === null ? (
            <div className="bg-white px-6 py-6 sm:px-8">
              <p className="text-[0.78rem] font-semibold text-cta">Reddix</p>
              <p className="mt-2 text-[0.9rem] text-muted-foreground">No scans set. Add one to see when you’d find this post.</p>
            </div>
          ) : (
            <Outcome
              red
              name="Reddix"
              time={clock(rxNext)}
              after={wait(rxNext - post)}
              icon={CalendarClock}
              detail={rxNext >= DAY_MIN ? DAY.reddixNone : 'Found at your next scan, ranked 0–100 with three drafts.'}
            />
          )}
        </div>

        <div className="px-5 py-6 sm:px-10 lg:px-8">
          <p className="text-[0.82rem] font-semibold text-ink">{DAY.scansLabel}</p>
          <ul className="mt-3 space-y-2">
            {scans.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  step={300}
                  value={clock(s).slice(0, 5)}
                  onChange={(e) => change(i, e.target.value)}
                  aria-label={`Scan ${i + 1} time`}
                  className="h-9 rounded-lg border border-ink/[0.1] bg-white px-2.5 text-[0.86rem] tabular-nums text-ink outline-none focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Remove scan ${i + 1}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-ink/[0.04] hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => addAt(nextFree())}
            disabled={scans.length >= MAX_SCANS}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 text-[0.82rem] font-medium text-ink transition-colors hover:border-ink/20 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            {DAY.addScan}
          </button>
          {note && (
            <p role="status" className="mt-2 text-[0.76rem] text-cta">
              {note}
            </p>
          )}
        </div>
      </Band>
      <Band inner="px-5 py-4 text-[0.74rem] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
        {DAY.assumption} {CHECKED}.
      </Band>
    </section>
  );
}

function Wait({ from, to, tone }: { from: number; to: number; tone: 'ink' | 'red' }) {
  return (
    <div
      aria-hidden
      className={cn('absolute inset-y-2 rounded-[3px] transition-[left,width] duration-300', tone === 'red' ? 'bg-cta/30' : 'bg-ink/25')}
      style={{ left: pct(from), width: `calc(${pct(to)} - ${pct(from)})` }}
    />
  );
}

function PostMark({ at }: { at: number }) {
  return (
    <span aria-hidden className="absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-ink transition-[left] duration-200" style={{ left: pct(at) }}>
      <span className="absolute -top-px left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-ink" />
    </span>
  );
}

function Outcome({
  name,
  time,
  after,
  icon: Icon,
  detail,
  red,
}: {
  name: string;
  time: string;
  after: string;
  icon: typeof BellRing;
  detail: string;
  red?: boolean;
}) {
  return (
    <div className="bg-white px-6 py-6 sm:px-8">
      <p className={cn('text-[0.78rem] font-semibold', red ? 'text-cta' : 'text-ink/60')}>{name}</p>
      <p className="mt-2 text-[1.7rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">{after}</p>
      <p className="mt-1 text-[0.8rem] tabular-nums text-muted-foreground">after the post, at {time}</p>
      <p className="mt-3 flex gap-2 text-[0.82rem] leading-snug text-ink/75">
        <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', red ? 'text-cta' : 'text-ink/50')} />
        {detail}
      </p>
    </div>
  );
}
