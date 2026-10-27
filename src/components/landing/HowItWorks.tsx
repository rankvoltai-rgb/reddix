import type { ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal, SubredditIcon } from './shared';
import { RedditMark } from './subreddit-ticker';
import { Accent, Band, LINE, LINE_FILL, PANEL, SectionHead, Spacer } from './frame';

/* The two headline promises: white cards on a grey panel, each half ruled
   off by a hairline. */
function PanelCard({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[28rem] rounded-xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)] sm:p-6">
      <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

const ROW =
  'flex items-center justify-between rounded-lg border border-ink/[0.07] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.03)]';

const SIGNALS = [
  { text: 'Need a tool to find leads on Reddit', score: 96, label: 'Hot' },
  { text: 'Best alternatives to BrandMonitor?', score: 82, label: 'Hot' },
  { text: 'Anyone tried a Reddit CRM?', score: 64, label: 'Warm' },
  { text: 'How do you do Reddit marketing?', score: 34, label: 'Low' },
] as const;

function IntentList() {
  return (
    <div className="space-y-1.5">
      {SIGNALS.map((s) => {
        const tone =
          s.label === 'Hot'
            ? { tile: 'bg-cta text-white', bar: 'bg-cta', chip: 'bg-cta-soft text-cta' }
            : s.label === 'Warm'
              ? { tile: 'bg-amber-400 text-amber-950', bar: 'bg-amber-400', chip: 'bg-amber-50 text-amber-700' }
              : { tile: 'bg-ink/[0.06] text-ink/50', bar: 'bg-ink/20', chip: 'bg-ink/[0.05] text-muted-foreground' };
        return (
          <div key={s.text} className={cn(ROW, 'gap-3 py-2')}>
            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[0.7rem] font-[700] tabular-nums', tone.tile)}>
              {s.score}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.75rem] font-medium text-ink">&ldquo;{s.text}&rdquo;</span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-ink/[0.06]">
                <span className={cn('block h-full rounded-full', tone.bar)} style={{ width: `${s.score}%` }} />
              </span>
            </span>
            <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold', tone.chip)}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ReplyThread() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <SubredditIcon name="r/SaaS" className="h-6 w-6 text-[0.65rem]" />
        <span className="text-sm font-semibold text-ink">r/SaaS</span>
        <span className="text-[0.7rem] text-muted-foreground">· 2h ago</span>
      </div>
      <p className="mt-2.5 text-[0.85rem] font-medium leading-snug text-ink">
        I was spending 3 hours a day searching Reddit for leads. Is there a better way?
      </p>
      <p className="mt-1 text-[0.68rem] text-muted-foreground">48 upvotes · 22 comments</p>
      <div className="mt-3.5 rounded-lg border border-cta/30 bg-cta-soft/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-cta">
            <RedditMark className="h-3.5 w-3.5" />
            Your reply draft
          </span>
          <span className="flex items-center gap-1 text-[0.62rem] font-semibold text-emerald-700">
            <Check className="h-3 w-3" />
            Reddit-safe
          </span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-ink/85">
          Same boat last year. What fixed it was letting a tool watch the subs for me — I use{' '}
          <span className="font-semibold text-ink underline decoration-cta/60 decoration-2 underline-offset-2">Reddix</span>,
          it flags the posts where someone's actually asking for a fix.
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[0.65rem] text-muted-foreground">Tone: Casual · 186 chars</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-ink px-2 py-1 text-[0.65rem] font-semibold text-white">
            <Copy className="h-3 w-3" />
            Copy &amp; go
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- The three steps ---------- */

function StepCell({ num, title, body, children }: { num: string; title: string; body: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <span className="text-[0.7rem] font-semibold tabular-nums tracking-[0.14em] text-cta">STEP {num}</span>
      <h3 className="mt-2 text-[1.05rem] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

function UrlStep() {
  return (
    <div className="space-y-2">
      <div className={ROW}>
        <span className="flex items-center gap-2 text-xs text-ink">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          yoursite.com
        </span>
        <span className="text-[0.65rem] font-semibold text-emerald-700">Analyzed</span>
      </div>
      <div className={cn(ROW, 'block')}>
        <span className="text-xs text-muted-foreground">Keywords found</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['lead gen', 'reddit', 'SaaS', 'monitoring', 'outreach'].map((k) => (
            <span key={k} className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta">
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScanStep() {
  return (
    <div className="space-y-2">
      <div className={ROW}>
        <span className="text-xs text-muted-foreground">Autopilot</span>
        <span className="relative h-5 w-9 rounded-full bg-cta">
          <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
      <div className={cn(ROW, 'block')}>
        <span className="text-xs text-muted-foreground">Scan every</span>
        <div className="mt-2 flex gap-1.5">
          {['6h', '12h', '24h'].map((f, i) => (
            <span
              key={f}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium',
                i === 0 ? 'bg-cta text-white' : 'border border-ink/[0.08] bg-white text-ink',
              )}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {['r/SaaS', 'r/startups', 'r/Entrepreneur'].map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 rounded-md border border-ink/[0.07] bg-white py-0.5 pl-1 pr-2 text-[0.7rem] text-ink/80">
            <SubredditIcon name={s} className="h-4 w-4 text-[0.5rem]" />
            {s}
          </span>
        ))}
        <span className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-[0.7rem] text-muted-foreground">+11</span>
      </div>
    </div>
  );
}

function ToneStep() {
  return (
    <div className="space-y-1.5">
      {[
        { tone: 'Casual', note: 'Like a regular in the thread', on: true },
        { tone: 'Professional', note: 'For B2B subs', on: false },
        { tone: 'Witty', note: 'Light, never salesy', on: false },
      ].map((t) => (
        <div key={t.tone} className={cn(ROW, 'gap-3', t.on && 'border-cta/30 bg-cta-soft/50')}>
          <span className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-full border-2',
                t.on ? 'border-cta bg-cta' : 'border-ink/20',
              )}
            >
              {t.on && <span className="h-1 w-1 rounded-full bg-white" />}
            </span>
            <span className={cn('text-xs font-medium', t.on ? 'text-cta' : 'text-ink')}>{t.tone}</span>
          </span>
          <span className="truncate text-[0.68rem] text-muted-foreground">{t.note}</span>
        </div>
      ))}
    </div>
  );
}

const RESULTS = [
  ['2,400+', 'Leads discovered'],
  ['180+', 'Subreddits scanned'],
  ['12x', 'Faster than manual'],
  ['500+', 'SaaS teams'],
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Zap}
        eyebrow="3 steps · 2 minutes"
        title={
          <>
            From zero to warm leads <Accent>before your coffee cools</Accent>
          </>
        }
        subtitle="No onboarding calls. No complex setup. Paste your URL and Reddix finds the people already asking for what you sell — then hands you the reply."
      />

      {/* The two promises, side by side on the grey panel. */}
      <Band inner={PANEL}>
        <div className="grid lg:grid-cols-2">
          <Reveal className="flex min-w-0 items-center px-5 py-10 sm:px-10 sm:py-14">
            <PanelCard
              title="Catch buying intent"
              body="Reddix reads every new post in your subreddits and scores how ready its author is to buy, from 0 to 100."
            >
              <IntentList />
            </PanelCard>
          </Reveal>
          <Reveal delay={0.08} className={cn('flex min-w-0 items-center border-t px-5 py-10 sm:px-10 sm:py-14 lg:border-l lg:border-t-0', LINE)}>
            <PanelCard
              title="Reply like a regular"
              body="Every lead ships with a reply written for that thread — helpful first, your product second."
            >
              <ReplyThread />
            </PanelCard>
          </Reveal>
        </div>
      </Band>

      {/* The three steps, as one row of hairline cells. White sits on still
          wrappers so a fading cell never shows the fill behind it. */}
      <Band>
        <div className={cn('grid gap-px lg:grid-cols-3', LINE_FILL)}>
          {[
            {
              num: '01',
              title: 'Paste your URL. We do the rest.',
              body: 'AI reads your product and pulls out your value prop, your buyers, and the words they use.',
              ui: <UrlStep />,
            },
            {
              num: '02',
              title: 'AI hunts Reddit while you sleep.',
              body: 'Agents watch your subreddits around the clock, flagging buying signals and skipping the noise.',
              ui: <ScanStep />,
            },
            {
              num: '03',
              title: 'Reply, convert, repeat.',
              body: 'Each lead comes with a native reply in the tone you pick. Copy it, tweak it, post it.',
              ui: <ToneStep />,
            },
          ].map((s, i) => (
            <div key={s.num} className="bg-white">
              <Reveal delay={i * 0.06} className="h-full">
                <StepCell num={s.num} title={s.title} body={s.body}>
                  {s.ui}
                </StepCell>
              </Reveal>
            </div>
          ))}
        </div>
      </Band>

      {/* The result: a label cell, then one cell per figure. */}
      <Band>
        <div className="grid grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className={cn('col-span-2 flex flex-col justify-center border-b px-6 py-6 sm:px-8 lg:col-span-1 lg:border-b-0 lg:border-r', LINE)}>
            <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">Warm leads every morning</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">What Reddix has done for founders so far.</p>
          </div>
          {RESULTS.map(([value, label], i) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-6 text-center sm:py-8',
                i % 2 === 0 && 'border-r',
                i < 2 && 'border-b lg:border-b-0',
                'lg:border-r lg:last:border-r-0',
                LINE,
              )}
            >
              <span className="text-[1.6rem] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</span>
              <span className="text-[0.75rem] font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
