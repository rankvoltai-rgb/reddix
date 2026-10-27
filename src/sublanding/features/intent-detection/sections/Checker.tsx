import { useId, useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, Ban, Check, Clock, FlaskConical, Minus, Scissors } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKER } from '../content';
import { clampScore, firstPass, levelFromScore, MIN_LENGTH, POINTS, SAVE_AT, segment, splitCompetitors, type FirstPass, type Kind } from '../signals';
import { KIND_LABEL, KIND_SWATCH, LevelChip, Marked, Meter } from '../ui';

const FIELD =
  'w-full rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.92rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]';

const LABEL = 'text-[0.8rem] font-semibold text-ink';

/* Paste a post and watch the scanner's first pass decide what happens to it,
   then set an AI score to see how the signal points move the result. */
export function Checker() {
  const ids = { post: useId(), comp: useId(), hint: useId(), ai: useId() };
  const [text, setText] = useState(CHECKER.samples[0].text);
  const [compText, setCompText] = useState(CHECKER.defaultCompetitors);
  const [ai, setAi] = useState(50);

  const competitors = useMemo(() => splitCompetitors(compText), [compText]);
  const pass = useMemo(() => firstPass(text, competitors), [text, competitors]);
  const segs = useMemo(() => segment(text, competitors), [text, competitors]);
  const kinds = useMemo(() => new Set(segs.flatMap((s) => (s.kind ? [s.kind] : []))), [segs]);

  const scored = pass.state === 'front' || pass.state === 'queue';
  const boost = scored ? pass.result.boost : 0;
  const total = clampScore(ai + boost);
  const level = levelFromScore(total);
  const length = text.trim().length;

  return (
    <section id="checker" aria-labelledby="checker-title" className="scroll-mt-16">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={FlaskConical}>{CHECKER.pill}</Pill>
          <h2 id="checker-title" className={cn('mt-5', SECTION_TITLE)}>
            {CHECKER.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{CHECKER.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------- the post ---------- */}
        <div className="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <p className={LABEL}>Try an example</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {CHECKER.samples.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setText(s.text)}
                aria-pressed={text === s.text}
                className={cn(
                  'h-8 rounded-lg border px-3 text-[0.8rem] font-medium transition-colors',
                  text === s.text ? 'border-cta/40 bg-cta-soft text-cta-deep' : 'border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.2] hover:text-ink',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <label htmlFor={ids.post} className={LABEL}>
              {CHECKER.postLabel}
            </label>
            <span className={cn('text-[0.72rem] tabular-nums', length && length < MIN_LENGTH ? 'text-cta' : 'text-muted-foreground')}>
              {length} characters{length < MIN_LENGTH ? ` · needs ${MIN_LENGTH}` : ''}
            </span>
          </div>
          <textarea
            id={ids.post}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste the text of a Reddit post…"
            className={cn(FIELD, 'mt-2 resize-y py-3 leading-relaxed')}
          />

          <label htmlFor={ids.comp} className={cn(LABEL, 'mt-6 block')}>
            {CHECKER.competitorsLabel}
          </label>
          <input
            id={ids.comp}
            value={compText}
            onChange={(e) => setCompText(e.target.value)}
            aria-describedby={ids.hint}
            placeholder="e.g. Pipewell, Tallyfold"
            className={cn(FIELD, 'mt-2 h-11')}
          />
          <p id={ids.hint} className="mt-2 text-[0.75rem] text-muted-foreground">
            {CHECKER.competitorsHint}
          </p>
        </div>

        {/* ---------- what the scanner does with it ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)}>
          <p className={LABEL}>First pass</p>
          <Verdict pass={pass} />

          {kinds.size > 0 && (
            <>
              <p className={cn(LABEL, 'mt-7')}>What it found</p>
              <div className="mt-2.5 max-h-48 overflow-y-auto rounded-lg border border-ink/[0.08] bg-white px-4 py-3 text-[0.88rem] leading-[1.75] text-ink/80">
                <Marked segments={segs} />
              </div>
              <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.72rem] text-muted-foreground">
                {(['competitor', 'alt', 'pricing', 'ask', 'junk'] as Kind[])
                  .filter((k) => kinds.has(k))
                  .map((k) => (
                    <li key={k} className="flex items-center gap-1.5">
                      <span aria-hidden className={cn('inline-block h-3 w-4 rounded-[0.2rem]', KIND_SWATCH[k])} />
                      {KIND_LABEL[k]}
                    </li>
                  ))}
              </ul>
            </>
          )}

          <p className={cn(LABEL, 'mt-7')}>Points after the AI</p>
          <ul className="mt-2.5 divide-y divide-ink/[0.07] rounded-lg border border-ink/[0.08] bg-white text-[0.85rem]">
            <Signal on={scored && pass.result.hasCompetitor} label="Names a competitor you listed" points={POINTS.competitor} />
            <Signal on={scored && pass.result.hasPricingSignal} label="Talks about price or budget" points={POINTS.pricing} />
            <Signal on={scored && pass.result.hasAltSignal} label="Says “alternative to”" points={POINTS.alt} />
          </ul>

          <div className="mt-7 flex items-baseline justify-between gap-3">
            <label htmlFor={ids.ai} className={LABEL}>
              {CHECKER.sliderLabel}
            </label>
            <span className="text-[0.8rem] font-semibold tabular-nums text-ink">{ai}</span>
          </div>
          <input
            id={ids.ai}
            type="range"
            min={0}
            max={100}
            value={ai}
            onChange={(e) => setAi(Number(e.target.value))}
            disabled={!scored}
            className="mt-2 w-full accent-cta disabled:opacity-40"
          />
          <p className="mt-1 text-[0.72rem] text-muted-foreground">You set this here. In a scan, Reddix’s AI sets it from your product profile.</p>

          <div className={cn('mt-6 rounded-xl border bg-white p-4 sm:p-5', scored ? 'border-ink/[0.08]' : 'border-dashed border-ink/[0.12]')}>
            {scored ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <p className="text-[0.85rem] tabular-nums text-muted-foreground">
                    {ai} <span className="text-cta">+ {boost}</span> =
                    <span className="ml-2 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-ink">{total}</span>
                  </p>
                  <LevelChip level={level} />
                </div>
                <Meter score={total} level={level} className="mt-3.5" />
                <p className={cn('mt-3.5 flex items-center gap-1.5 text-[0.82rem] font-medium', total >= SAVE_AT ? 'text-ink' : 'text-muted-foreground')}>
                  {total >= SAVE_AT ? <Check className="h-4 w-4 text-cta" /> : <Minus className="h-4 w-4" />}
                  {total >= SAVE_AT ? 'Saved to your leads' : `Not saved: under ${SAVE_AT}, and not scored again for 7 days`}
                </p>
              </>
            ) : (
              <p className="text-[0.85rem] text-muted-foreground">This post never reaches the AI, so it gets no score.</p>
            )}
          </div>
        </div>
      </Band>
    </section>
  );
}

function Signal({ on, label, points }: { on: boolean; label: string; points: number }) {
  return (
    <li className={cn('flex items-center justify-between gap-3 px-3.5 py-2.5', on ? 'text-ink' : 'text-muted-foreground')}>
      <span className="flex items-center gap-2">
        {on ? <Check className="h-3.5 w-3.5 text-cta" /> : <Minus className="h-3.5 w-3.5 text-ink/25" />}
        {label}
      </span>
      <span className={cn('font-semibold tabular-nums', on ? 'text-cta' : 'text-ink/30')}>+{points}</span>
    </li>
  );
}

function Verdict({ pass }: { pass: FirstPass }) {
  const view: { icon: ReactNode; title: string; body: string; tone: string } = (() => {
    switch (pass.state) {
      case 'empty':
        return { icon: <Clock className="h-4 w-4" />, title: 'Waiting for a post', body: 'Paste one above, or pick an example.', tone: 'text-muted-foreground' };
      case 'short':
        return {
          icon: <Scissors className="h-4 w-4" />,
          title: 'Too short to judge',
          body: `${pass.length} of ${MIN_LENGTH} characters. The scanner skips posts this short.`,
          tone: 'text-ink/70',
        };
      case 'skipped':
        return {
          icon: <Ban className="h-4 w-4" />,
          title: 'Skipped before the AI',
          body: `It reads like promotion or noise (“${pass.junk.join('”, “')}”) and has no buying phrase or competitor to rescue it.`,
          tone: 'text-ink',
        };
      case 'front': {
        const why = [pass.result.hasCompetitor && 'names a competitor', pass.result.hasDirectAsk && 'uses a buying phrase'].filter(Boolean).join(' and ');
        return {
          icon: <ArrowUpRight className="h-4 w-4" />,
          title: 'Scored first',
          body: `It ${why}, so it goes to the front of the line for the AI. Up to 30 posts are scored per scan.`,
          tone: 'text-cta',
        };
      }
      case 'queue':
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Scored after the priority posts',
          body: 'No buying phrase or competitor, so it waits behind posts that have one. Up to 30 posts are scored per scan.',
          tone: 'text-ink/70',
        };
    }
  })();

  return (
    <div aria-live="polite" className="mt-2.5 flex gap-3 rounded-lg border border-ink/[0.08] bg-white p-3.5">
      <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface', view.tone)}>{view.icon}</span>
      <div className="min-w-0">
        <p className={cn('text-[0.92rem] font-semibold', view.tone === 'text-muted-foreground' ? 'text-ink/70' : 'text-ink')}>{view.title}</p>
        <p className="mt-0.5 text-[0.84rem] leading-relaxed text-muted-foreground">{view.body}</p>
      </div>
    </div>
  );
}
