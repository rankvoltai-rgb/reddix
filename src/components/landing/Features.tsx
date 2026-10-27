import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Clock, Compass, Layers, MessageSquare, Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal, SubredditIcon } from './shared';
import { Accent, Band, GHOST_BUTTON, SectionHead, Spacer } from './frame';

/* Each feature's panel tint, so a long list of rows still reads as distinct
   tools. `ink` is the icon. */
const TINTS = {
  red: { panel: '#fff0ef', tile: '#ffdcda', ink: '#FF3130' },
  amber: { panel: '#fdf4e4', tile: '#fbe7c4', ink: '#d97706' },
  blue: { panel: '#eaf2fe', tile: '#dbe8fd', ink: '#1877f2' },
  violet: { panel: '#f1eefd', tile: '#e3ddfb', ink: '#7c3aed' },
  green: { panel: '#e9f6ee', tile: '#d6efdf', ink: '#16a34a' },
  orange: { panel: '#fdefe7', tile: '#fbdccb', ink: '#ea580c' },
} as const;
type Tint = keyof typeof TINTS;

function Step({ label, value, tone }: { label: ReactNode; value: ReactNode; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2 text-xs">
      <span className="flex min-w-0 items-center gap-2 truncate font-medium text-ink">{label}</span>
      <span className={cn('shrink-0 tabular-nums text-muted-foreground', tone)}>{value}</span>
    </div>
  );
}

/* The white product card inside a tinted panel. It runs past the panel's
   foot and is cropped there, like a screen rising out of the frame. */
function ScreenCard({ title, meta, children }: { title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <div className="absolute inset-x-5 top-8 mx-auto max-w-[27rem] rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-10 sm:top-10 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

const Running = ({ label = 'Live' }: { label?: string }) => (
  <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-cta">
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cta motion-reduce:animate-none" />
    {label}
  </span>
);

/* A small hand-drawn area chart: the week's leads, rising. */
function WeekChart() {
  const pts = [14, 18, 16, 24, 29, 27, 38];
  const w = 300;
  const h = 72;
  const max = 42;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - (v / max) * h] as const);
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id="week-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#week-fill)" />
      <path d={line} fill="none" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

interface Feature {
  title: string;
  slug: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
  tint: Tint;
  screen: ReactNode;
}

const SIGNAL_TAG = 'rounded px-1.5 py-0.5 text-[0.6rem] font-semibold';

const FEATURES: Feature[] = [
  {
    title: 'Intent Detection',
    slug: 'intent-detection',
    body: 'Most tools find mentions. Reddix finds buyers — posts where someone is asking to buy, switch, or try something new.',
    icon: Zap,
    tint: 'red',
    screen: (
      <ScreenCard title="Buying signals" meta={<Running />}>
        <div className="space-y-1.5">
          {[
            ['Recommendation', 'bg-cta-soft text-cta', 'Any tool that finds leads on Reddit?'],
            ['Switching', 'bg-violet-500/10 text-violet-700', 'Moving off our current monitor — ideas?'],
            ['Pain point', 'bg-amber-500/15 text-amber-700', 'Spending hours a day searching subs'],
            ['Comparison', 'bg-sky-500/10 text-sky-700', 'Which is better for a small team?'],
          ].map(([tag, cls, text]) => (
            <Step key={text} label={<span className="truncate">&ldquo;{text}&rdquo;</span>} value={<span className={cn(SIGNAL_TAG, cls)}>{tag}</span>} />
          ))}
        </div>
      </ScreenCard>
    ),
  },
  {
    title: 'Lead Scoring',
    slug: 'lead-scoring',
    body: 'Every lead scored 0–100 for purchase readiness, with the reasons behind it, so you spend your time on the ones that convert.',
    icon: Target,
    tint: 'amber',
    screen: (
      <ScreenCard
        title="Lead score"
        meta={
          <span className="text-2xl font-semibold leading-none text-cta">
            94<span className="text-sm text-muted-foreground">/100</span>
          </span>
        }
      >
        <div className="space-y-1.5">
          <Step label="Intent strength" value="38 / 40" />
          <Step label="Recency" value="18 / 20" />
          <Step label="Engagement" value="14 / 15" />
          <Step label="Subreddit fit" value="14 / 15" />
          <Step label="Author history" value="10 / 10" />
        </div>
        <div className="mt-3 rounded-lg border border-cta/25 bg-cta-soft px-3 py-2 text-[0.72rem] text-ink">
          Hot lead — asking for a recommendation, posted 4 minutes ago.
        </div>
      </ScreenCard>
    ),
  },
  {
    title: 'AI Replies',
    slug: 'ai-replies',
    body: 'Reddix reads the whole thread, matches the subreddit’s tone, and drafts a reply that adds value before it mentions you.',
    icon: MessageSquare,
    tint: 'blue',
    screen: (
      <ScreenCard title="Drafting a reply" meta={<Running label="Writing" />}>
        <div className="space-y-1.5">
          <Step label="Read the thread" value="22 comments" />
          <Step label="Matched the tone" value="r/SaaS · casual" />
          <Step label="Product mention" value="Natural, once" />
          <Step label="Length" value="186 chars" />
          <Step label="Reddit-safe check" value="Passed" tone="font-semibold text-emerald-700" />
        </div>
      </ScreenCard>
    ),
  },
  {
    title: 'Subreddit Discovery',
    slug: 'subreddit-discovery',
    body: 'AI finds the communities where your buyers actually hang out — including the ones you never knew existed.',
    icon: Compass,
    tint: 'violet',
    screen: (
      <ScreenCard title="14 communities found" meta={<span className="text-[0.68rem] text-muted-foreground">Fit for your product</span>}>
        <div className="space-y-1.5">
          {[
            ['r/SaaS', '98%'],
            ['r/microsaas', '94%'],
            ['r/startups', '91%'],
            ['r/indiehackers', '87%'],
          ].map(([sub, fit]) => (
            <Step
              key={sub}
              label={
                <>
                  <SubredditIcon name={sub} className="h-5 w-5 text-[0.55rem]" />
                  {sub}
                </>
              }
              value={<span className="rounded-md border border-violet-500/25 bg-violet-500/10 px-1.5 py-0.5 text-[0.68rem] font-semibold text-violet-700">{fit} fit</span>}
            />
          ))}
        </div>
      </ScreenCard>
    ),
  },
  {
    title: 'Scheduled Scans',
    slug: 'scheduled-scans',
    body: 'Pick your subreddits and a schedule, then walk away. Reddix scans, scores, and drafts on autopilot, 24/7.',
    icon: Clock,
    tint: 'green',
    screen: (
      <ScreenCard title="This morning's scan" meta={<Running label="Running" />}>
        <div className="space-y-1.5">
          <Step label="Scanning 14 subreddits" value="412 posts" />
          <Step label="Reading threads" value="96 threads" />
          <Step label="Scoring intent" value="31 matches" />
          <Step label="Skipping duplicates" value="7 skipped" />
          <Step label="Drafting replies" value="24 drafts" />
          <Step label="Next scan" value="12:00 PM" />
        </div>
      </ScreenCard>
    ),
  },
  {
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    body: 'Track leads found, replies posted, and what converts — so you can double down on the subreddits that pay.',
    icon: BarChart3,
    tint: 'orange',
    screen: (
      <ScreenCard title="This week" meta={<span className="text-[0.68rem] text-muted-foreground">Mon – Sun</span>}>
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Leads', '47', '+18%'],
            ['Reply rate', '34%', '+6%'],
            ['Converted', '9', '+3'],
          ].map(([l, v, c]) => (
            <div key={l}>
              <p className="text-[0.68rem] text-muted-foreground">{l}</p>
              <p className="text-lg font-semibold tracking-tight text-ink tabular-nums">{v}</p>
              <p className="text-[0.62rem] font-semibold text-emerald-700">{c}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-ink/[0.07] px-2 pt-2">
          <WeekChart />
        </div>
      </ScreenCard>
    ),
  },
];

function FeatureRow({ f }: { f: Feature }) {
  const tint = TINTS[f.tint];
  const Icon = f.icon;
  return (
    <Band>
      <div className="group grid lg:grid-cols-[0.85fr_1fr]">
        <Reveal className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12 lg:pl-14 lg:pr-10">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: tint.tile, color: tint.ink }}>
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="mt-5 text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]">{f.title}</h3>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">{f.body}</p>
          <Link to={`/features/${f.slug}`} className={cn(GHOST_BUTTON, 'group/btn mt-6 w-fit')}>
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Reveal>
        {/* Flush to the right rail, with a hairline of white around it. */}
        <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
          <div aria-hidden className="relative h-[17rem] overflow-hidden sm:h-[18.5rem]" style={{ background: tint.panel } as CSSProperties}>
            {f.screen}
          </div>
        </div>
      </div>
    </Band>
  );
}

/* The long tail, rolling past in two rows that drift in opposite directions.
   Tags with a page of their own link to it. Hovering a row holds it; with
   reduced motion the rows sit still and scroll sideways. */
const TAGS = [
  'Website Analysis',
  'Keyword Monitoring',
  'Deduplication',
  'Natural Tone',
  'Hot-Lead Alerts',
  'Lead CRM',
  'Reply Drafts',
  'Copy & Go',
  'Audience Research',
  'Signal Categories',
  'Score Explanations',
  'Priority Scanning',
  'Team Collaboration',
  'Custom Signals',
  'n8n Automation',
  'Unlimited Subreddits',
];

const TAG_LINKS: Record<string, string> = {
  'Website Analysis': '/features/website-analysis',
  Deduplication: '/features/deduplication',
  'Natural Tone': '/features/natural-tone',
};

function TagRow({ tags, reverse = false }: { tags: string[]; reverse?: boolean }) {
  const chip = (t: string, copy: boolean) => {
    const cls =
      'inline-flex shrink-0 items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-3 py-2 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]';
    const inner = (
      <>
        <Sparkles className="h-3.5 w-3.5 text-cta" />
        {t}
      </>
    );
    return TAG_LINKS[t] ? (
      <Link
        key={`${t}-${copy}`}
        to={TAG_LINKS[t]}
        tabIndex={copy ? -1 : undefined}
        className={cn(cls, 'underline decoration-ink/15 underline-offset-2 transition-colors hover:border-cta/40 hover:text-cta')}
      >
        {inner}
      </Link>
    ) : (
      <span key={`${t}-${copy}`} className={cls}>
        {inner}
      </span>
    );
  };
  return (
    <div className="group/row overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={cn(
          'flex w-max py-1 motion-safe:animate-marquee group-hover/row:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
        style={{ '--marquee-duration': '55s' } as CSSProperties}
      >
        {/* Spacing inside each copy, so half the track is exactly one copy. */}
        <div className="flex gap-2.5 pr-2.5">{tags.map((t) => chip(t, false))}</div>
        <div aria-hidden className="flex gap-2.5 pr-2.5 motion-reduce:hidden">
          {tags.map((t) => chip(t, true))}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const half = Math.ceil(TAGS.length / 2);
  return (
    <section id="features" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Layers}
        eyebrow="One platform, end to end"
        title={
          <>
            Everything you need <Accent>to sell on Reddit</Accent>
          </>
        }
        subtitle="Intent detection, lead scoring, AI replies, and subreddit discovery — so you show up in the threads where buyers are already asking."
      />

      {FEATURES.map((f) => (
        <FeatureRow key={f.slug} f={f} />
      ))}

      <Band inner="py-10 sm:py-12">
        <p className="mb-6 px-5 text-center text-sm font-medium text-muted-foreground">
          Plus everything else you need to turn Reddit into a channel
        </p>
        <div className="space-y-2.5 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <TagRow tags={TAGS.slice(0, half)} />
          <TagRow tags={[...TAGS.slice(half), '+ much more']} reverse />
        </div>
      </Band>
    </section>
  );
}
