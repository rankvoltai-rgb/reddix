import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HERO } from '../content';

/** The address analyze-website will fetch: it adds https:// unless the URL
 *  already starts with http:// or https://. */
export function normalizeUrl(value: string): string {
  const v = value.trim();
  if (!v) return '';
  return v.startsWith('http://') || v.startsWith('https://') ? v : `https://${v}`;
}

/* The page's one action. The URL waits in sessionStorage, as the landing
   hero's does, so onboarding opens with it filled in. */
export function UrlForm({ className, button = HERO.cta }: { className?: string; button?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const ids = { input: useId(), status: useId() };
  const normalized = normalizeUrl(value);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalized) {
      try {
        sessionStorage.setItem('pendingWebsite', value.trim());
      } catch {
        // Storage blocked: onboarding just won't prefill the URL.
      }
    }
    navigate('/auth');
  };

  return (
    <form onSubmit={submit} className={cn('w-full', className)}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label
          htmlFor={ids.input}
          className="flex h-12 min-w-0 cursor-text items-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] hover:border-ink/[0.16] focus-within:border-cta/50 focus-within:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)] sm:flex-1"
        >
          <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">{HERO.fieldLabel}</span>
          <input
            id={ids.input}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={HERO.placeholder}
            aria-describedby={ids.status}
            className="w-full min-w-0 text-ellipsis bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          type="submit"
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
        >
          {button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <p id={ids.status} aria-live="polite" className="mt-3 min-h-[1.25rem] truncate text-[0.8rem] text-muted-foreground">
        {normalized ? (
          <>
            Reddix will read <span className="font-medium text-ink">{normalized}</span>
          </>
        ) : (
          HERO.helper
        )}
      </p>
    </form>
  );
}
