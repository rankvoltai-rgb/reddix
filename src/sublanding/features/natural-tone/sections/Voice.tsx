import { useId, useMemo, useState } from 'react';
import { Link2, SlidersHorizontal } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { readDraft } from '../../ai-replies/draft';
import { VOICE } from '../content';
import { exampleReply, instructionLines } from '../voice';

const OPTION =
  'flex cursor-pointer items-center rounded-lg border bg-white px-3 text-[0.84rem] font-medium transition-[border-color,color,box-shadow] focus-within:ring-4 focus-within:ring-cta/15';

/* Set the two profile fields that shape a draft's voice, and see the lines
   they add to the AI's instructions next to a reply written that way. */
export function Voice() {
  const ids = { tone: useId(), pricing: useId() };
  const [toneValue, setTone] = useState<string>(VOICE.defaultTone);
  const [pricingValue, setPricing] = useState<string>(VOICE.defaultPricing);
  const tone = VOICE.tones.find((t) => t.value === toneValue) ?? VOICE.tones[0];
  const pricing = VOICE.pricing.find((p) => p.value === pricingValue) ?? VOICE.pricing[0];

  const lines = useMemo(() => instructionLines(tone, pricing), [tone, pricing]);
  const reply = useMemo(() => exampleReply(tone, pricing), [tone, pricing]);
  const reading = useMemo(() => readDraft(reply), [reply]);
  const [body, link] = [reply.slice(0, reply.lastIndexOf('\n')), reply.slice(reply.lastIndexOf('\n') + 1)];

  return (
    <section aria-labelledby="voice-title">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14">
        <Pill icon={SlidersHorizontal}>{VOICE.pill}</Pill>
        <h2 id="voice-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {VOICE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">{VOICE.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* ---------- the two settings ---------- */}
        <div className="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <fieldset aria-describedby={ids.tone}>
            <legend className="text-[0.8rem] font-semibold text-ink">{VOICE.toneLabel}</legend>
            <div className="mt-2.5 grid gap-2">
              {VOICE.tones.map((t) => {
                const on = t.value === toneValue;
                return (
                  <label key={t.value} className={cn(OPTION, 'justify-between gap-3 py-2.5', on ? 'border-cta/50 text-ink shadow-[0_0_0_1px_hsl(var(--cta)/0.25)]' : 'border-ink/[0.08] text-ink/70 hover:border-ink/[0.18]')}>
                    <input type="radio" name="tone" value={t.value} checked={on} onChange={() => setTone(t.value)} className="sr-only" />
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className={cn('h-3.5 w-3.5 rounded-full border-2', on ? 'border-cta bg-cta shadow-[inset_0_0_0_2px_white]' : 'border-ink/25')} />
                      {t.name}
                      {t.value === VOICE.defaultTone && <span className="text-[0.7rem] font-normal text-muted-foreground">default</span>}
                    </span>
                    <span className="hidden truncate text-[0.75rem] font-normal text-muted-foreground sm:block">{t.line}</span>
                  </label>
                );
              })}
            </div>
            <p id={ids.tone} className="mt-2 text-[0.75rem] text-muted-foreground">
              Settings → Reply tone in the app.
            </p>
          </fieldset>

          <fieldset className="mt-7" aria-describedby={ids.pricing}>
            <legend className="text-[0.8rem] font-semibold text-ink">{VOICE.pricingLabel}</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {VOICE.pricing.map((p) => {
                const on = p.value === pricingValue;
                return (
                  <label key={p.value} className={cn(OPTION, 'h-9', on ? 'border-cta/50 bg-cta-soft text-cta-deep' : 'border-ink/[0.1] text-ink/70 hover:border-ink/[0.2]')}>
                    <input type="radio" name="pricing" value={p.value} checked={on} onChange={() => setPricing(p.value)} className="sr-only" />
                    {p.name}
                  </label>
                );
              })}
            </div>
            <p id={ids.pricing} className="mt-2 text-[0.75rem] text-muted-foreground">
              Read from your website when Reddix builds your profile. Paid-only products get no pricing line.
            </p>
          </fieldset>
        </div>

        {/* ---------- what it produces ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)} aria-live="polite">
          <p className="text-[0.8rem] font-semibold text-ink">{VOICE.instructionsLabel}</p>
          <pre className="mt-2.5 overflow-x-auto rounded-lg bg-ink px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed text-white/85">
            {lines.map((l, i) => (
              <span key={i} className={cn('block', i === 0 && 'text-white/45')}>
                {l}
              </span>
            ))}
          </pre>

          <p className="mt-7 text-[0.8rem] font-semibold text-ink">{VOICE.exampleLabel}</p>
          <div className="mt-2.5 rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
            <p className="text-[0.93rem] leading-relaxed text-ink">{body}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.88rem] font-medium text-cta-deep">
              <Link2 className="h-3.5 w-3.5" />
              {link}
            </p>
            <p className="mt-3 border-t border-ink/[0.07] pt-3 text-[0.75rem] tabular-nums text-muted-foreground">
              {reading.chars} characters before the link · within the 120–250 every draft is written to
            </p>
          </div>
          <p className="mt-5 text-[0.72rem] leading-relaxed text-muted-foreground">{VOICE.note}</p>
        </div>
      </Band>
    </section>
  );
}
