/**
 * Onboarding chrome.
 *
 * One step on screen at a time, in a single reading column, with the running
 * summary (what's been set up, what happens next, one customer quote) in a
 * rail on the right. Progress is shown once, in the header.
 *
 * Each step ends in an ActionBar that sticks to the bottom of the viewport, so
 * the primary action stays in reach however long the step runs.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/brand/Logo';

export type Step = 1 | 2 | 3;

export const PARTS = [
  { n: 1, title: 'Business' },
  { n: 2, title: 'Profile' },
  { n: 3, title: 'Plan' },
] as const;

/**
 * Three segments that fill as steps complete. Finished steps are links back;
 * the current and later ones are not, so nobody skips ahead of the analysis.
 */
function Progress({ active, onStep }: { active: Step; onStep: (step: Step) => void }) {
  return (
    <nav aria-label="Setup progress" className="w-full max-w-40 justify-self-center sm:w-auto sm:max-w-none">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {PARTS.map((part) => {
          const done = part.n < active;
          const current = part.n === active;
          return (
            <li key={part.n} className="flex-1 sm:flex-none">
              <button
                type="button"
                disabled={!done}
                onClick={() => onStep(part.n)}
                aria-current={current ? 'step' : undefined}
                aria-label={`Step ${part.n}: ${part.title}${done ? ' (done, edit)' : ''}`}
                className="group flex w-full flex-col gap-1.5 py-3 text-left disabled:cursor-default sm:w-24 sm:py-0"
              >
                <span
                  className={cn(
                    'h-1 w-full rounded-full transition-colors duration-300',
                    done || current ? 'bg-cta' : 'bg-ink/[0.08]',
                    done && 'group-hover:bg-cta/70',
                  )}
                />
                <span
                  className={cn(
                    'hidden items-center gap-1 text-xs transition-colors sm:flex',
                    current && 'font-semibold text-ink',
                    done && 'font-medium text-ink group-hover:text-cta',
                    !done && !current && 'text-muted-foreground',
                  )}
                >
                  {done && <Check className="h-3 w-3 text-cta" strokeWidth={3} />}
                  {part.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function OnboardingShell({
  active,
  onStep,
  rail,
  children,
}: {
  active: Step;
  onStep: (step: Step) => void;
  /** Desktop right rail. Below lg the steps stand alone. */
  rail: ReactNode;
  children: ReactNode;
}) {
  return (
    // White, with the landing page's hairline rails framing the column.
    <div className="min-h-screen bg-white font-jakarta">
      <header className="sticky top-0 z-30 border-b border-ink/[0.07] bg-white/90 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1180px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-4 lg:px-8 xl:border-x xl:border-ink/[0.07]">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start" aria-label="Reddix home">
            <LogoMark className="h-7 w-7" />
            <span className="text-[1.2rem] font-semibold tracking-tight text-ink">Reddix</span>
          </Link>
          <Progress active={active} onStep={onStep} />
          <p className="flex items-center gap-1.5 justify-self-end text-xs text-muted-foreground">
            <span className="sm:hidden">
              {active} of {PARTS.length}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Progress saved
            </span>
          </p>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1180px] gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:px-8 xl:gap-14 xl:border-x xl:border-ink/[0.07]">
        <main className="min-w-0 pt-8 sm:pt-12 lg:pt-14">
          <div className="mx-auto max-w-[42rem] lg:mx-0">{children}</div>
        </main>
        {/* Ruled off from the step by a hairline, like the landing's cells. */}
        <aside className="hidden pt-14 lg:block lg:border-l lg:border-ink/[0.07] lg:pl-10 xl:pl-12">
          <div className="sticky top-[5.5rem]">{rail}</div>
        </aside>
      </div>
    </div>
  );
}

/** The heading every step opens with. */
export function StepHeader({ n, title, subtitle }: { n: Step; title: ReactNode; subtitle: ReactNode }) {
  return (
    <header className="mb-8">
      <p className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1 text-[0.78rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <span className="h-1.5 w-1.5 rounded-full bg-cta" />
        Step {n} of {PARTS.length}
      </p>
      <h1 className="mt-4 text-balance text-[1.85rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.35rem]">{title}</h1>
      <p className="mt-2.5 max-w-[36rem] text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">{subtitle}</p>
    </header>
  );
}

export const PRIMARY_BUTTON =
  'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 disabled:pointer-events-none disabled:opacity-50 sm:px-6';

/**
 * The step's footer: Back on the left, a short reassurance, the primary action
 * on the right. Sticks to the bottom of the viewport while the step scrolls.
 */
export function ActionBar({ onBack, note, children }: { onBack?: () => void; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-10 border-t border-ink/[0.07] bg-white px-5 py-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <div className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground">{note}</div>
        {children}
      </div>
    </div>
  );
}

/** A labelled text input in the landing page's field style. */
export function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  autoComplete,
  inputMode,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  autoComplete?: string;
  inputMode?: 'url' | 'text';
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.85rem] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoFocus={autoFocus}
        className="h-11 w-full rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.95rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]"
      />
      {hint && <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}
