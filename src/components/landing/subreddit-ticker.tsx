/**
 * The hero headline's moving part: a subreddit name that changes every few
 * seconds, behind a Reddit tile.
 *
 * The outgoing name dissolves letter by letter (rising, blurring, fading)
 * while the next one assembles letter by letter from below, a beat behind.
 * The tile turns like the face of a cube. The name's width springs to fit the
 * new word, so "on autopilot" after it glides instead of jumping. All of it
 * is CSS keyframes (see .ticker-* in index.css).
 *
 * Decorative (aria-hidden): the headline's screen-reader text names the
 * subreddits. Hovering holds the current name. With reduced motion it shows
 * the first subreddit and never changes.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const SUBREDDITS = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', 'r/smallbusiness'];

/* How long each name holds before the next one arrives. */
const HOLD_MS = 2600;
/* Long enough for the slowest outgoing letter to finish. */
const EXIT_MS = 420;

export function RedditMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <circle cx="10" cy="10" r="10" fill="#FF4500" />
      <ellipse cx="10" cy="11.6" rx="5.2" ry="3.6" fill="#fff" />
      <circle cx="4.9" cy="9.4" r="1.25" fill="#fff" />
      <circle cx="15.1" cy="9.4" r="1.25" fill="#fff" />
      <circle cx="8" cy="11.1" r="0.85" fill="#FF4500" />
      <circle cx="12" cy="11.1" r="0.85" fill="#FF4500" />
      <path d="M8.1 13.2c1.1.7 2.7.7 3.8 0" fill="none" stroke="#FF4500" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M10 8l.8-3.4 2.4.5" fill="none" stroke="#fff" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13.9" cy="5.3" r="1" fill="#fff" />
    </svg>
  );
}

function Letters({ word, phase }: { word: string; phase: 'in' | 'out' }) {
  return (
    <>
      {Array.from(word, (ch, i) => (
        <span key={i} className={cn('inline-block', `ticker-${phase}`)} style={{ '--i': i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </>
  );
}

export function SubredditTicker({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Every name's width, measured once laid out and again whenever the set
  // resizes, which covers the web font arriving after first paint.
  useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const measure = () => setWidths(Array.from(box.children, (el) => (el as HTMLElement).offsetWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (still || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        setLeaving(i);
        return (i + 1) % SUBREDDITS.length;
      });
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [still, paused]);

  useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setLeaving(null), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [leaving]);

  return (
    <span
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn('relative inline-flex h-[1.18em] shrink-0 items-center gap-[0.2em] whitespace-nowrap align-middle', className)}
    >
      {/* The tile: turns about its horizontal axis, like a cube showing its
          next face. */}
      <span className="relative inline-flex h-[0.84em] w-[0.84em] shrink-0 [perspective:28em]">
        {leaving !== null && (
          <span
            key={`out-${leaving}`}
            className="ticker-tile-out absolute inset-0 flex items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] [backface-visibility:hidden]"
            style={{ transformOrigin: '50% 50% -0.42em' }}
          >
            <RedditMark className="h-[62%] w-[62%]" />
          </span>
        )}
        <span
          key={`in-${index}`}
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] [backface-visibility:hidden]',
            leaving !== null && 'ticker-tile-in',
          )}
          style={{ transformOrigin: '50% 50% -0.42em' }}
        >
          <RedditMark className="h-[62%] w-[62%]" />
        </span>
      </span>

      {/* The name. Its box springs to the new word's width, after the old
          word has cleared, and clips sideways so a fading letter is trimmed
          at the edge rather than drifting over the words after it. */}
      <span
        className="relative inline-flex h-[1.18em] items-center overflow-x-clip transition-[width] delay-150 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={widths ? { width: widths[index] } : undefined}
      >
        {leaving !== null && (
          <span key={`out-${leaving}`} className="absolute left-0 flex font-[700] text-cta">
            <Letters word={SUBREDDITS[leaving]} phase="out" />
          </span>
        )}
        <span key={`in-${index}`} className="absolute left-0 flex font-[700] text-cta">
          {/* The first name is there on load, so it doesn't animate in. */}
          {leaving === null && index === 0 ? SUBREDDITS[0] : <Letters word={SUBREDDITS[index]} phase="in" />}
        </span>
        {/* Gives the box its width before the names are measured. */}
        {!widths && <span className="invisible font-[700]">{SUBREDDITS[0]}</span>}
      </span>

      {/* Every name laid out once, out of sight, to read its width. */}
      <span ref={measureRef} className="pointer-events-none invisible absolute left-0 top-0 flex flex-col font-[700]">
        {SUBREDDITS.map((s) => (
          <span key={s} className="w-max whitespace-nowrap">
            {s}
          </span>
        ))}
      </span>
    </span>
  );
}
