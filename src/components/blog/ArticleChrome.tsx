/**
 * Everything around an article's text: reading progress, the table of
 * contents, sharing, the side-rail offer, the author card and the closing
 * call to action.
 */
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent, type RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Globe, Link2, Radar } from 'lucide-react';
import { Reveal } from '@/components/landing/shared';
import { Band, Spacer } from '@/components/landing/frame';
import { HeroRadar } from '@/components/landing/hero-radar';
import type { TocEntry } from '@/lib/blog/outline';
import { DEFAULT_AUTHOR } from '@/lib/blog/posts';
import { cn } from '@/lib/utils';

/* Clearance for the fixed navbar (h-16) plus breathing room, used both for
   scroll-spy and for jumping to a heading. Matches scroll-mt-28 on headings. */
const HEADING_OFFSET = 112;

/* ---------- byline mark ---------- */

export function AuthorMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white', className)}>
      <span className="flex h-[62%] w-[62%] items-center justify-center rounded-[28%] bg-cta">
        <Radar className="h-[62%] w-[62%] text-white" />
      </span>
    </span>
  );
}

/* ---------- reading progress ---------- */

export function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight + HEADING_OFFSET;
      const read = HEADING_OFFSET - rect.top;
      setProgress(total > 0 ? Math.min(1, Math.max(0, read / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [target]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[3px]">
      <div className="h-full origin-left bg-cta transition-transform duration-150 ease-out" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/* ---------- table of contents ---------- */

function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADING_OFFSET + 8) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);
  return active;
}

function jumpTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADING_OFFSET + 4, behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

export function TableOfContents({ entries, variant, className }: { entries: TocEntry[]; variant: 'rail' | 'inline'; className?: string }) {
  const key = entries.map((e) => e.id).join('|');
  const ids = useMemo(() => (key ? key.split('|') : []), [key]);
  const active = useActiveHeading(ids);
  if (entries.length < 2) return null;
  const list = (
    <ol className="border-l border-ink/[0.08]">
      {entries.map((entry) => {
        const on = variant === 'rail' && active === entry.id;
        return (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => jumpTo(e, entry.id)}
              aria-current={on ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-[0.3rem] pl-4 text-[0.82rem] leading-snug transition-colors',
                on ? 'border-cta font-medium text-cta' : 'border-transparent text-muted-foreground hover:border-ink/20 hover:text-ink',
              )}
            >
              {entry.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
  if (variant === 'inline') {
    return (
      <details className={cn('group rounded-xl border border-ink/[0.08] bg-white', className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span>
            On this page
            <span className="ml-2 font-medium text-muted-foreground">{entries.length} sections</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-5 pb-5">{list}</div>
      </details>
    );
  }
  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">On this page</p>
      {list}
    </nav>
  );
}

/* ---------- sharing ---------- */

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <ellipse cx="10" cy="11.6" rx="5.2" ry="3.6" fill="#fff" />
      <circle cx="4.9" cy="9.4" r="1.25" fill="#fff" />
      <circle cx="15.1" cy="9.4" r="1.25" fill="#fff" />
    </svg>
  );
}

const SHARE_BUTTON =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-ink/[0.1] bg-white px-3 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40';

export function ShareButtons({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const enc = encodeURIComponent;
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <a href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className={cn(SHARE_BUTTON, 'w-9 px-0')}>
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className={cn(SHARE_BUTTON, 'w-9 px-0')}>
        <LinkedInIcon className="h-3.5 w-3.5" />
      </a>
      <a href={`https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Reddit" className={cn(SHARE_BUTTON, 'w-9 px-0 text-[#FF4500]')}>
        <RedditIcon className="h-4 w-4" />
      </a>
      <button type="button" onClick={copy} className={SHARE_BUTTON}>
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  );
}

/* ---------- side-rail offer ---------- */

export function RailCta() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta">
        <Radar className="h-4.5 w-4.5 text-white" />
      </span>
      <p className="mt-4 text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">Find the threads asking for you</p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Reddix scans your subreddits, scores every post's buying intent, and drafts a reply you post yourself.
      </p>
      <Link
        to="/auth"
        className="group mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
      >
        Start finding leads
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <p className="mt-2.5 text-center text-[0.7rem] text-muted-foreground">2-minute setup · Cancel anytime</p>
    </div>
  );
}

/* ---------- author ---------- */

const TEAM_BIO =
  'The team behind Reddix. We study how buyers ask for tools on Reddit, and how founders can show up in those threads without getting banned, and publish what we learn.';

export function AuthorCard({ author }: { author: string }) {
  const team = author === DEFAULT_AUTHOR;
  return (
    <div className="flex gap-4 rounded-xl border border-ink/[0.08] bg-white p-5 sm:p-6">
      <AuthorMark className="h-12 w-12" />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Written by</p>
        <p className="mt-1 font-semibold text-ink">{author}</p>
        {team && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{TEAM_BIO}</p>}
      </div>
    </div>
  );
}

/* ---------- closing CTA ---------- */

/* The landing page's closing band: red inside the rails, the radar in white,
   and the hero's URL form. */
export function BlogCta({ title = 'Find the Reddit threads asking for you' }: { title?: string }) {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');
  const submit = (e: FormEvent) => {
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
    <section aria-labelledby="blog-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.2] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]">
          <HeroRadar className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_8px_24px_-12px_rgba(72,4,8,0.5)]">
            <Radar className="h-5 w-5 text-cta" />
          </span>
          <h2 id="blog-cta-title" className="mt-6 text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Enter your site. Reddix finds the subreddits your buyers use, scores every post for buying intent, and drafts the reply.
          </p>
          <form onSubmit={submit} className="mt-8 flex w-full max-w-xl flex-col gap-2.5 sm:flex-row">
            <label className="flex h-12 min-w-0 flex-1 cursor-text items-center gap-2.5 rounded-lg bg-white px-3.5 shadow-[0_8px_24px_-12px_rgba(72,4,8,0.45)]">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Your website URL"
                aria-label="Your website URL"
                className="w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
              />
            </label>
            <button
              type="submit"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-6 text-[0.95rem] font-semibold text-white transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Find my leads
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
          <p className="mt-3.5 text-[0.82rem] font-medium text-white">2-minute setup · Cancel anytime</p>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
