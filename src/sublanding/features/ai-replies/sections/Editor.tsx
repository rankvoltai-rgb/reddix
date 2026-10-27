import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUp, BookOpen, Check, Copy, Link2, MessageSquare, PenLine, RotateCcw, Zap, type LucideIcon } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { VARIANTS } from '../content';
import { MAX_CHARS, MIN_CHARS, readDraft, type Band as LengthBand, type LinkState } from '../draft';

const ICONS: Record<string, LucideIcon> = { direct: Zap, story: MessageSquare, expert: BookOpen };

const BAND_TEXT: Record<LengthBand, string> = {
  empty: 'Nothing to post yet.',
  short: `Shorter than a Reddix draft (${MIN_CHARS}+). Short is fine if it still answers the question.`,
  fits: `Within the ${MIN_CHARS}–${MAX_CHARS} characters Reddix drafts are written to.`,
  long: `Longer than a Reddix draft (${MAX_CHARS} max). Long replies get skimmed; trim if you can.`,
};

const LINK_TEXT: Record<LinkState, string> = {
  'last-line': 'Link on its own last line, left out of the count.',
  inline: 'Link inside the text. Drafts keep it on its own last line.',
  none: 'No link. Fine where the subreddit doesn’t allow them.',
};

/* The reply dialog, rebuilt for the page: pick a draft, edit it, copy it.
   The count and the link check follow the rules the drafts are written to. */
export function Editor() {
  const ids = { text: useId(), status: useId() };
  const [active, setActive] = useState(0);
  const [texts, setTexts] = useState<string[]>(VARIANTS.drafts.map((d) => d.text));
  const [copy, setCopy] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const text = texts[active];
  const original = VARIANTS.drafts[active].text;
  const edited = text !== original;
  const reading = useMemo(() => readDraft(text), [text]);

  const setText = (value: string) => setTexts((all) => all.map((t, i) => (i === active ? value : t)));

  const onCopy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopy('done');
    } catch {
      setCopy('failed');
    }
    timer.current = setTimeout(() => setCopy('idle'), 2400);
  };

  const pct = Math.min(100, (reading.chars / MAX_CHARS) * 100);

  return (
    <section id="editor" aria-labelledby="editor-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14">
        <Pill icon={PenLine}>{VARIANTS.pill}</Pill>
        <h2 id="editor-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {VARIANTS.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">{VARIANTS.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ---------- the thread and the three angles ---------- */}
        <div className="min-w-0 bg-surface/70 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <article className="rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
            <div className="flex items-center gap-2 text-[0.75rem]">
              <SubredditIcon name={VARIANTS.post.subreddit} className="h-5 w-5 text-[0.6rem]" />
              <span className="font-semibold text-ink">{VARIANTS.post.subreddit}</span>
              <span className="text-muted-foreground">· 5h</span>
            </div>
            <h3 className="mt-2.5 text-[1rem] font-semibold leading-snug text-ink">{VARIANTS.post.title}</h3>
            <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink/65">{VARIANTS.post.body}</p>
            <p aria-hidden className="mt-3 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
              <ArrowUp className="h-3.5 w-3.5" />
              23
            </p>
          </article>

          <fieldset className="mt-6">
            <legend className="text-[0.8rem] font-semibold text-ink">Choose a draft</legend>
            <div className="mt-2.5 space-y-2">
              {VARIANTS.drafts.map((d, i) => {
                const Icon = ICONS[d.type];
                const on = i === active;
                return (
                  <label
                    key={d.type}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-3.5 transition-[border-color,box-shadow] focus-within:ring-4 focus-within:ring-cta/15',
                      on ? 'border-cta/50 shadow-[0_0_0_1px_hsl(var(--cta)/0.25)]' : 'border-ink/[0.08] hover:border-ink/[0.18]',
                    )}
                  >
                    <input type="radio" name="draft" className="sr-only" checked={on} onChange={() => setActive(i)} />
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', on ? 'bg-cta text-white' : 'bg-ink/[0.05] text-ink/60')}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[0.9rem] font-semibold text-ink">
                        {d.name}
                        {texts[i] !== d.text && <span className="rounded bg-cta-soft px-1.5 text-[0.65rem] font-semibold text-cta-deep">Edited</span>}
                      </span>
                      <span className="mt-0.5 block text-[0.8rem] text-muted-foreground">{d.angle}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* ---------- the editor ---------- */}
        <div className={cn('min-w-0 border-t px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)}>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={ids.text} className="text-[0.8rem] font-semibold text-ink">
              Your reply · {VARIANTS.drafts[active].name}
            </label>
            {edited && (
              <button
                type="button"
                onClick={() => setText(original)}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
          <textarea
            id={ids.text}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby={ids.status}
            rows={7}
            className="mt-2 w-full resize-y rounded-lg border border-ink/[0.1] bg-white px-3.5 py-3 text-[0.92rem] leading-relaxed text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]"
          />

          {/* The count, against the band the drafts are written to. */}
          <div className="mt-4">
            <div className="relative h-2 rounded-full bg-ink/[0.06]">
              <div aria-hidden className="absolute inset-y-0 rounded-full bg-cta/[0.12]" style={{ left: `${(MIN_CHARS / MAX_CHARS) * 100}%`, right: 0 }} />
              <div
                className={cn('absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-300', reading.band === 'fits' ? 'bg-cta' : reading.band === 'long' ? 'bg-ink' : 'bg-ink/30')}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div aria-hidden className="relative mt-1.5 h-4 text-[0.68rem] tabular-nums text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute -translate-x-1/2" style={{ left: `${(MIN_CHARS / MAX_CHARS) * 100}%` }}>
                {MIN_CHARS}
              </span>
              <span className="absolute right-0">{MAX_CHARS}</span>
            </div>
          </div>

          <div id={ids.status} aria-live="polite" className="mt-4 space-y-2 text-[0.82rem]">
            <p className="flex items-start gap-2">
              <span className={cn('mt-0.5 shrink-0 font-semibold tabular-nums', reading.band === 'fits' ? 'text-cta' : 'text-ink')}>{reading.chars}</span>
              <span className="text-muted-foreground">{BAND_TEXT[reading.band]}</span>
            </p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <Link2 className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', reading.link === 'last-line' ? 'text-cta' : 'text-ink/40')} />
              {LINK_TEXT[reading.link]}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCopy}
              disabled={reading.band === 'empty'}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink/[0.12] bg-white px-4 text-[0.86rem] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.22] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20 disabled:opacity-40"
            >
              {copy === 'done' ? <Check className="h-4 w-4 text-cta" /> : <Copy className="h-4 w-4" />}
              {copy === 'done' ? 'Copied' : 'Copy reply'}
            </button>
            <span role="status" className="text-[0.78rem] text-muted-foreground">
              {copy === 'failed' ? 'Your browser blocked copying. Select the text and copy it instead.' : 'In Reddix, Copy & Go also opens the thread for you.'}
            </span>
          </div>
          <p className="mt-6 border-t border-ink/[0.07] pt-4 text-[0.72rem] text-muted-foreground">{VARIANTS.note}</p>
        </div>
      </Band>
    </section>
  );
}
