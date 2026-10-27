/**
 * The hero headline's moving part: a subreddit name that rolls to the next
 * every few seconds, beside a Reddit tile.
 *
 * Every name sits in one vertical strip inside a clipped, soft-edged window,
 * and the strip glides up one row at a time — a slot roll, moved only by
 * transform so it stays on the compositor. The window's width eases to fit
 * the incoming name over the same curve, so "on autopilot" after it slides
 * rather than jumps. The first name repeats at the end of the strip: after
 * rolling onto that copy, the strip snaps back to the top with no transition,
 * so the loop always moves the same way and never rewinds.
 *
 * Nothing mounts or unmounts as it runs, so no animation can be cut short.
 *
 * Decorative (aria-hidden): the headline's screen-reader text names the
 * subreddits. Hovering holds the current name. With reduced motion it shows
 * the first subreddit and never moves.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const SUBREDDITS = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', 'r/smallbusiness'];
/* The strip: every name, then the first again for a seamless wrap. */
const STRIP = [...SUBREDDITS, SUBREDDITS[0]];

/* How long each name holds before the next one rolls in. */
const HOLD_MS = 2600;
/* The roll itself. Long enough to read as a glide, short enough to stay lively. */
const ROLL_MS = 720;
/* Ease-in-out with a soft landing: starts gently, settles without a bounce. */
const EASE = 'cubic-bezier(0.65, 0, 0.25, 1)';

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

/* Fades the strip at the window's top and bottom edges, so names roll
   through a soft opening instead of being sliced by a hard clip. */
const WINDOW_MASK: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 90%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 90%, transparent 100%)',
};

export function SubredditTicker({ className }: { className?: string }) {
  // Row of the strip in view; SUBREDDITS.length is the copy of the first.
  const [row, setRow] = useState(0);
  // Off for the instant snap from the copy back to the top.
  const [animate, setAnimate] = useState(true);
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

  // Roll on to the next row after each hold.
  useEffect(() => {
    if (still || paused || row >= SUBREDDITS.length) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setRow((r) => r + 1);
    }, HOLD_MS);
    return () => window.clearTimeout(id);
  }, [row, still, paused]);

  // Landed on the copy of the first name: once the roll has finished, jump
  // back to the real first row without a transition. It looks identical.
  useEffect(() => {
    if (row < SUBREDDITS.length) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setRow(0);
    }, ROLL_MS);
    return () => window.clearTimeout(id);
  }, [row]);

  // Turn the transition back on only after the snap has painted.
  useEffect(() => {
    if (animate) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const width = widths ? widths[row % SUBREDDITS.length] : undefined;
  const transition = animate ? `transform ${ROLL_MS}ms ${EASE}` : 'none';

  return (
    <span
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn('relative inline-flex h-[1.18em] shrink-0 items-center gap-[0.2em] whitespace-nowrap align-middle', className)}
    >
      <span className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
        <RedditMark className="h-[62%] w-[62%]" />
      </span>

      {/* The window: clipped to one row, soft at its top and bottom edges,
          its width easing to the incoming name alongside the roll. */}
      <span
        className="relative inline-block h-[1.18em] overflow-hidden"
        style={{
          ...WINDOW_MASK,
          width,
          transition: animate ? `width ${ROLL_MS}ms ${EASE}` : 'none',
        }}
      >
        <span
          // Left-aligned: the headline is centred, and a centred row would
          // push short names off the window's right edge.
          className="absolute left-0 top-0 flex flex-col text-left font-[700] text-cta will-change-transform"
          style={{ transform: `translate3d(0, ${-row * 1.18}em, 0)`, transition }}
        >
          {STRIP.map((name, i) => (
            <span key={i} className="block h-[1.18em] whitespace-nowrap leading-[1.18em]">
              {name}
            </span>
          ))}
        </span>
        {/* Gives the window its width before the names are measured. */}
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
