/**
 * The auth page's right-hand panel: how many leads Reddix finds.
 *
 * One scan, told as volume. The count card rises from the bottom, then leads
 * land faster and faster: each one drops into the feed, ticks the counter
 * and the tallies, and sends a "+1" chip floating up through the painting
 * above. The scan lands on its total, holds, and the card drops away for the
 * next loop.
 *
 * The posts are illustrative. The loop only runs while the scene is on
 * screen, and reduced motion shows the finished scan.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Flame, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubredditIcon } from '@/components/landing/shared';

/* ---------- script ---------- */

const TOTAL = 47;
/* Rows visible in the feed; older leads are pushed out the bottom. */
const FEED_ROWS = 6;
/* The gap between leads, easing from a trickle to a flood. */
const FIRST_GAP = 520;
const LAST_GAP = 70;

const SUBS = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', 'r/sales', 'r/smallbusiness', 'r/microsaas', 'r/growthhacking', 'r/indiehackers', 'r/B2BSaaS', 'r/webdev', 'r/ecommerce', 'r/agency', 'r/SideProject'];
const TITLES = [
  'Any tool that finds leads on Reddit automatically?',
  "What's the best lightweight CRM for a small team?",
  'How do you get your first 100 customers?',
  'Need a Reddit monitoring tool — recommendations?',
  'Switching from our current tool, what else is out there?',
  'Best way to find B2B leads without cold email?',
  'Is there something cheaper than our analytics stack?',
  'Looking for an alternative to spreadsheets for outreach',
  'Which onboarding tool are you all using?',
  'Spending hours a day searching subs for customers',
  'What do you use to track competitor mentions?',
  'Recommend a tool for scheduling social posts?',
];

/* Seeded PRNG (mulberry32), so every loop and every load are the same. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const leadRand = seeded(4721);
const LEADS = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  title: TITLES[Math.floor(leadRand() * TITLES.length)],
  sub: SUBS[Math.floor(leadRand() * SUBS.length)],
  // Mostly warm-to-hot, as a real scan's matches are.
  score: Math.round(62 + leadRand() * 36),
  // Where its "+1" chip rises in the sky above the card.
  x: 6 + leadRand() * 70,
  y: 38 + leadRand() * 48,
}));
const isHot = (score: number) => score >= 80;

type Phase = 'idle' | 'flood' | 'done' | 'reset';

/* Expo-out: a quick move that spends most of its time settling. */
const SETTLE = [0.16, 1, 0.3, 1] as const;
/* For the card dropping away before the next loop. */
const SINK = [0.7, 0, 0.84, 0] as const;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---------- the field ---------- */

/* Pixels sit on an invisible 24px lattice, centred in the panel. */
const CELL = 24;
const COLS = 32;
const fieldRand = seeded(918);

const PIXELS = Array.from({ length: 46 }, () => ({
  col: Math.floor(fieldRand() * COLS),
  row: Math.floor(fieldRand() * 44),
  peak: 0.07 + fieldRand() * 0.15,
  duration: 4 + fieldRand() * 5,
  delay: fieldRand() * 7,
  accent: fieldRand() < 0.25,
}));

const SPECKS = Array.from({ length: 18 }, () => ({
  left: fieldRand() * 96,
  top: 35 + fieldRand() * 65,
  size: 2 + Math.round(fieldRand()),
  travel: 120 + fieldRand() * 140,
  duration: 9 + fieldRand() * 8,
  delay: fieldRand() * 10,
  opacity: 0.3 + fieldRand() * 0.45,
}));

function PixelField({ busy }: { busy: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#8c0e12]">
      {/* The landing showcase's painted sky, so sign-up continues the
          picture the visitor just scrolled past. */}
      <img
        src="/assets/painting-red.webp"
        alt=""
        width={2200}
        height={1400}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />
      {/* Pixels brighten while leads are pouring in. */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-opacity duration-700"
        style={{ width: COLS * CELL, opacity: busy ? 1 : 0.7 }}
      >
        {PIXELS.map((p, i) => (
          <span
            key={i}
            className={cn('absolute animate-pixel-blink', p.accent ? 'bg-[#ffc9c2]' : 'bg-white')}
            style={
              {
                left: p.col * CELL + 1,
                top: p.row * CELL + 1,
                width: CELL - 1,
                height: CELL - 1,
                '--pixel-opacity': p.accent ? p.peak * 1.8 : p.peak,
                '--pixel-duration': `${p.duration.toFixed(1)}s`,
                '--pixel-delay': `${p.delay.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {SPECKS.map((p, i) => (
        <span
          key={i}
          className="absolute animate-particle-rise bg-white"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              '--particle-opacity': p.opacity,
              '--particle-travel': `-${Math.round(p.travel)}px`,
              '--particle-duration': `${p.duration.toFixed(1)}s`,
              '--particle-delay': `${p.delay.toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------- pieces ---------- */

function ScoreTile({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md font-[700] tabular-nums',
        isHot(score) ? 'bg-cta text-white' : 'bg-amber-400 text-amber-950',
        className,
      )}
    >
      {score}
    </span>
  );
}

/* A "+1" for each lead, rising through the painting and fading out. */
function SkyChip({ lead }: { lead: (typeof LEADS)[number] }) {
  return (
    <motion.span
      className="absolute flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 text-[0.7rem] font-semibold text-ink shadow-[0_8px_20px_-8px_rgb(70_3_6/0.6)]"
      style={{ left: `${lead.x}%`, top: `${lead.y}%` }}
      initial={{ opacity: 0, y: 18, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [18, 0, -50, -90], scale: [0.8, 1, 1, 0.96] }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 2.6, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
    >
      <SubredditIcon name={lead.sub} className="h-4 w-4 text-[0.45rem]" />
      <span className="text-cta">+1</span>
      <span className="text-muted-foreground">{lead.sub}</span>
    </motion.span>
  );
}

function Tally({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-semibold', className)}>
      <span className="tabular-nums">{value}</span>
      {label}
    </span>
  );
}

/* ---------- the scene ---------- */

export function LeadFloodScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [found, setFound] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Only animate while visible: the loop re-renders per lead.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen) return;
    if (prefersReducedMotion()) {
      setReduced(true);
      setFound(TOTAL);
      setPhase('done');
      return;
    }

    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    async function run() {
      let first = true;
      while (alive) {
        // Clear the stage. After the first pass the card drops away first.
        if (!first) {
          setPhase('reset');
          await wait(800);
          if (!alive) return;
        }
        first = false;
        setFound(0);

        // The card rises, empty, and the scan starts.
        setPhase('idle');
        await wait(1100);
        if (!alive) return;

        // The flood: each gap shorter than the last, from a trickle to a rush.
        setPhase('flood');
        for (let i = 1; i <= TOTAL; i++) {
          if (!alive) return;
          setFound(i);
          const t = i / TOTAL;
          await wait(FIRST_GAP + (LAST_GAP - FIRST_GAP) * Math.pow(t, 0.45));
        }
        await wait(500);

        // The total lands, then holds.
        if (!alive) return;
        setPhase('done');
        await wait(5000);
      }
    }

    void run();
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onScreen]);

  const arrived = LEADS.slice(0, found);
  const hot = arrived.filter((l) => isHot(l.score)).length;
  const subs = new Set(arrived.map((l) => l.sub)).size;
  const feed = arrived.slice(-FEED_ROWS).reverse();
  // A chip for every early lead, then every third once the rush starts, so
  // the sky stays busy without turning to noise. Each fades out on its own.
  const sky = phase === 'flood' || phase === 'done' ? arrived.filter((l) => l.id < 14 || l.id % 3 === 0) : [];
  const cardUp = phase !== 'reset';
  const flooding = phase === 'flood';
  const done = phase === 'done';

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        role="img"
        aria-label={`Reddix finding ${TOTAL} leads across ${new Set(LEADS.map((l) => l.sub)).size} subreddits in one scan.`}
        className={cn('relative isolate overflow-hidden font-jakarta', className)}
      >
        <PixelField busy={flooding} />

        {/* The "+1" chips, in the sky above the card. */}
        <div aria-hidden className="absolute inset-x-[4%] top-[4%] h-[34%]">
          <AnimatePresence>
            {sky.map((lead) => (
              <SkyChip key={`${lead.id}`} lead={lead} />
            ))}
          </AnimatePresence>
        </div>

        <div aria-hidden className="absolute inset-y-0 left-1/2 w-[min(86%,34rem)] -translate-x-1/2">
          {/* The count card pops up from below the panel and settles with its
              top above half height. It runs 2rem past the bottom edge so the
              spring's overshoot never shows a gap beneath it. */}
          <motion.div
            className="absolute inset-x-0 -bottom-8 top-[38%] overflow-hidden rounded-t-[24px] bg-white shadow-[0_-24px_60px_-24px_rgb(70_3_6/0.55)] ring-1 ring-black/5"
            initial={reduced ? false : { y: '108%', filter: 'blur(6px)' }}
            animate={cardUp ? { y: '0%', filter: 'blur(0px)' } : { y: '108%', filter: 'blur(6px)' }}
            transition={
              cardUp
                ? { y: { type: 'spring', bounce: 0.28, duration: 1.1 }, filter: { duration: 0.7, ease: SETTLE } }
                : { duration: 0.65, ease: SINK }
            }
          >
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white"
                    animate={{ rotate: flooding ? 360 : 0 }}
                    transition={flooding ? { repeat: Infinity, duration: 2.2, ease: 'linear' } : { duration: 0.5, ease: SETTLE }}
                  >
                    <Radar className="h-3.5 w-3.5" />
                  </motion.span>
                  <span className="text-[0.95rem] font-semibold text-ink">Leads found today</span>
                </div>
                <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    {!done && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60" />}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
                  </span>
                  {done ? 'Scan complete' : 'Scanning'}
                </span>
              </div>

              {/* The count, and what it's made of. */}
              <div className="mt-3 flex items-end justify-between gap-4">
                <motion.span
                  key={done ? 'final' : 'running'}
                  initial={done ? { scale: 1.08 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  className="origin-left text-[3.4rem] font-[700] leading-none tracking-[-0.04em] text-ink tabular-nums"
                >
                  {found}
                </motion.span>
                <div className="mb-1.5 flex flex-wrap justify-end gap-1.5">
                  <Tally label="hot" value={hot} className="bg-cta-soft text-cta" />
                  <Tally label="warm" value={found - hot} className="bg-amber-50 text-amber-700" />
                  <Tally label="subreddits" value={subs} className="bg-surface text-ink/75" />
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                <div
                  className="h-full rounded-full bg-cta transition-[width] duration-200 ease-out"
                  style={{ width: `${(found / TOTAL) * 100}%` }}
                />
              </div>

              {/* The feed: newest on top, older ones pushed out the bottom. */}
              <ul className="relative mt-4 space-y-1.5">
                <AnimatePresence initial={false} mode="popLayout">
                  {feed.map((lead) => (
                    <motion.li
                      key={lead.id}
                      layout="position"
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, ease: SETTLE }}
                      className="flex items-center gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2"
                    >
                      <ScoreTile score={lead.score} className="h-6 w-6 text-[0.62rem]" />
                      <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium text-ink">{lead.title}</span>
                      <span className="flex shrink-0 items-center gap-1 text-[0.66rem] text-muted-foreground">
                        <SubredditIcon name={lead.sub} className="h-3.5 w-3.5 text-[0.4rem]" />
                        {lead.sub}
                      </span>
                      {isHot(lead.score) && <Flame className="h-3 w-3 shrink-0 text-cta" />}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {found === 0 &&
                  Array.from({ length: 3 }, (_, i) => (
                    <li key={i} className="flex items-center gap-2.5 rounded-lg border border-dashed border-ink/[0.08] px-2.5 py-2">
                      <span className="h-6 w-6 animate-pulse rounded-md bg-ink/[0.05]" />
                      <span className="h-2 flex-1 animate-pulse rounded-full bg-ink/[0.05]" style={{ maxWidth: `${70 - i * 15}%` }} />
                    </li>
                  ))}
              </ul>

              {/* The total, said plainly once the scan lands. */}
              <AnimatePresence>
                {done && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: SETTLE, delay: 0.2 }}
                    className="mt-3 rounded-lg bg-cta-soft/70 px-3 py-2 text-[0.78rem] text-ink"
                  >
                    <span className="font-semibold">{TOTAL} people asking for what you sell</span> — each with a reply
                    drafted.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
