import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroRadar } from './hero-radar';
import { HeroProofBand } from './hero-proof-band';
import { SubredditTicker } from './subreddit-ticker';

/* The page's hairline rails, running down from the navbar. */
const RAIL = 'border-ink/[0.07]';

/* Staggers the CSS entrance (animate-hero-rise in tailwind.config.ts). */
const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* White, framed between hairline rails that run down from the navbar, the
   copy centred over a dithered radar, and a proof band closing the frame. */
export function HeroSection() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = website.trim();
    if (value) {
      try {
        sessionStorage.setItem('pendingWebsite', value);
      } catch {
        // Storage blocked (private mode): onboarding just won't prefill the URL.
      }
    }
    navigate('/auth');
  };

  return (
    <section id="top" className="relative bg-white pt-16 font-jakarta">
      <div className={cn('relative mx-auto max-w-6xl overflow-hidden border-x', RAIL)}>
        {/* Faded toward the edges, so the radar sits behind the copy and the
            rails stay clean. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]"
        >
          <HeroRadar />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-20 lg:pb-[5.5rem] lg:pt-24">
          <h1 className="text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]">
            {/* The full sentence for crawlers and screen readers; the visual
                line below swaps the subreddit names in turn. */}
            <span className="sr-only">
              Find warm leads on Reddit, in r/SaaS, r/startups, r/Entrepreneur and more, on autopilot
            </span>
            <span aria-hidden className="block motion-safe:animate-hero-rise" style={rise(0.05)}>
              Find warm leads in
            </span>
            <span
              aria-hidden
              className="mt-[0.04em] flex flex-wrap items-center justify-center gap-x-[0.25em] motion-safe:animate-hero-rise"
              style={rise(0.14)}
            >
              <SubredditTicker />
              {/* Its own line on phones, so a longer name never re-wraps the headline. */}
              <span className="basis-full sm:basis-auto">on autopilot</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-[41rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
            style={rise(0.24)}
          >
            AI agents that scan Reddit 24/7, detect buying intent, and draft natural replies — driving warm leads to
            your SaaS on autopilot.
          </p>

          <div className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise" style={rise(0.34)}>
            <form onSubmit={handleSubmit} className="group flex w-full flex-col gap-2.5 sm:flex-row">
              <label className="flex h-12 min-w-0 shrink-0 cursor-text items-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-ink/[0.16] focus-within:border-cta/50 focus-within:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)] sm:flex-1">
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Your website URL"
                  aria-label="Your website URL"
                  className="w-full text-ellipsis bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 sm:w-[13.5rem]"
              >
                Find my leads
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-focus-within:translate-x-0.5 group-hover:translate-x-0.5" />
              </button>
            </form>
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">
              Free to start · No credit card · 2-minute setup
            </p>
          </div>
        </div>
      </div>

      <HeroProofBand className="motion-safe:animate-hero-rise" style={rise(0.44)} />
    </section>
  );
}
