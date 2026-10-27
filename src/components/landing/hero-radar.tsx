/**
 * The landing hero's backdrop: a radar drawn as a field of tiny "+" and "·"
 * glyphs. Range rings sit still, a sweep turns slowly over them, and a few
 * blips flare as the sweep passes, then fade, like leads being picked up. A
 * fine pointer lights up the grid around itself.
 *
 * Drawn on a 2D canvas: each frame the radar is painted into a tiny offscreen
 * canvas (one pixel per glyph cell), and that pixel decides which glyph the
 * cell gets. An ordered (Bayer) dither turns the in-between values into the
 * mixed "+"/"·" texture instead of a flat fill.
 *
 * It stops drawing while scrolled out of view, and with reduced motion it
 * draws one still frame and ignores the pointer.
 */
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/* CSS px per glyph cell. Small enough to read as texture, large enough that
   a glyph is a recognisable "+" rather than a smudge. */
const CELL = 9;
/* 4×4 Bayer matrix, as thresholds in (0, 1). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);
/* 30fps is plenty for motion this slow, and halves the work. */
const FRAME_MS = 1000 / 30;
/* One full turn of the sweep, in seconds. */
const TURN_S = 8;
/* How far the sweep's glow trails behind its leading edge, in radians. */
const TRAIL = Math.PI * 0.55;
const TRAIL_SLICES = 18;
const FADE_IN_MS = 1600;

/* Blips, as (angle in turns, distance as a share of the outer ring). Fixed so
   the field is the same on every load. */
const BLIPS: [number, number][] = [
  [0.08, 0.62],
  [0.21, 0.34],
  [0.33, 0.82],
  [0.47, 0.5],
  [0.58, 0.9],
  [0.69, 0.28],
  [0.81, 0.7],
  [0.93, 0.44],
];

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export function HeroRadar({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const sampler = document.createElement('canvas');
    const sctx = sampler.getContext('2d', { willReadFrequently: true });
    if (!ctx || !sctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let color = '#e01b1b';

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cols = Math.max(1, Math.ceil(width / CELL));
      rows = Math.max(1, Math.ceil(height / CELL));
      sampler.width = cols;
      sampler.height = rows;
      // The glyph colour comes from CSS (`text-*` on the canvas), so the
      // backdrop follows the brand token rather than a hard-coded red.
      color = getComputedStyle(canvas).color || color;
    };

    /* Paints the radar into the sampler, one pixel per cell, and returns the
       pixels. Each layer gets its own channel (red: the sweep, green: the
       rings, blue: the blips) so the glyph pass can weight them separately.
       They are added onto black, so a channel is how much of that layer
       covers the cell. */
    const sample = (t: number) => {
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      sctx.fillStyle = '#000';
      sctx.fillRect(0, 0, cols, rows);
      sctx.globalCompositeOperation = 'lighter';
      // The outer ring overshoots the canvas height, so the frame crops it
      // top and bottom; the width cap keeps it off the rails on a phone.
      const radius = Math.min(rows * 0.62, cols * 0.42);
      const angle = (t / TURN_S) * Math.PI * 2 - Math.PI / 2;
      sctx.translate(cols / 2, rows / 2);

      // Range rings, the outermost dotted.
      sctx.strokeStyle = '#0f0';
      sctx.lineWidth = 1.7;
      for (const share of [0.25, 0.5, 0.75]) {
        sctx.beginPath();
        sctx.arc(0, 0, radius * share, 0, Math.PI * 2);
        sctx.stroke();
      }
      sctx.save();
      sctx.lineWidth = 2.2;
      sctx.setLineDash([2.6, 2.2]);
      sctx.beginPath();
      sctx.arc(0, 0, radius, 0, Math.PI * 2);
      sctx.stroke();
      sctx.restore();

      // The sweep: a bright leading edge with a glow fading out behind it,
      // drawn as thin slices so each can carry its own strength.
      const step = TRAIL / TRAIL_SLICES;
      for (let k = 0; k < TRAIL_SLICES; k++) {
        const a = Math.pow(1 - k / TRAIL_SLICES, 1.6);
        sctx.fillStyle = `rgba(255,0,0,${a * 0.85})`;
        sctx.beginPath();
        sctx.moveTo(0, 0);
        sctx.arc(0, 0, radius, angle - (k + 1) * step, angle - k * step);
        sctx.closePath();
        sctx.fill();
      }

      // Blips flare as the sweep crosses them, then fade over the turn.
      for (const [turn, dist] of BLIPS) {
        const a = turn * Math.PI * 2 - Math.PI / 2;
        const behind = (((angle - a) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const strength = Math.exp(-behind / 1.4);
        if (strength < 0.03) continue;
        sctx.fillStyle = `rgba(0,0,255,${strength})`;
        sctx.beginPath();
        sctx.arc(Math.cos(a) * radius * dist, Math.sin(a) * radius * dist, 2, 0, Math.PI * 2);
        sctx.fill();
      }
      return sctx.getImageData(0, 0, cols, rows).data;
    };

    // The pointer eases toward where it really is, so the light trails a
    // little behind a fast flick instead of snapping cell to cell.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0, seen: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - r.left) / CELL;
      pointer.ty = (e.clientY - r.top) / CELL;
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.ta = inside ? 1 : 0;
      if (!pointer.seen) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.seen = true;
      }
    };

    const start = performance.now();
    let last = 0;
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      // With reduced motion the still frame shows the sweep partway round,
      // with a few blips lit, rather than an empty field.
      const t = reduce ? TURN_S * 0.3 : (now - start) / 1000;
      const data = sample(t);
      const intro = reduce ? 1 : easeOut((now - start) / FADE_IN_MS);

      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      pointer.a += (pointer.ta - pointer.a) * 0.08;

      const cx = cols / 2;
      const cy = rows / 2;
      const reach = Math.min(cols, rows) * 0.62;
      const glow = 9; // pointer radius, in cells

      const px = CELL * dpr;
      const dot = Math.max(1, Math.round(1.35 * dpr));
      const thin = Math.max(1, Math.round(1.05 * dpr));
      const thick = Math.max(1, Math.round(1.35 * dpr));
      const armSm = Math.round(5 * dpr) | 1;
      const armLg = Math.round(6.4 * dpr) | 1;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      // One path per glyph weight, so the frame is three fills, not thousands.
      const dots = new Path2D();
      const pluses = new Path2D();
      const bold = new Path2D();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const sweep = data[i] / 255;
          const ring = data[i + 1] / 255;
          const blip = data[i + 2] / 255;

          // Blips strongest, rings next, the sweep lightest: the rings give
          // the radar its shape and the sweep reads as light moving over it.
          const base = Math.max(blip, ring * 0.8, sweep * 0.72, ring * sweep * 1.2);
          if (base < 0.02 && pointer.a < 0.01) continue;

          // Brighter toward the centre, so the field has a little depth.
          const depth = 1 - 0.2 * Math.min(1, Math.hypot(c - cx, r - cy) / reach);
          let v = base * depth;

          if (pointer.a > 0.01) {
            const pd = (c - pointer.x) ** 2 + (r - pointer.y) ** 2;
            const lit = Math.exp(-pd / (2 * glow * glow)) * pointer.a;
            // Off the radar the pointer reveals a faint grid of dots; on it,
            // the glyphs step up a weight.
            v += lit * (0.55 + 0.4 * Math.max(ring, sweep));
          }
          if (v < 0.06) continue;

          const level = Math.floor(v * 3.15 + (BAYER[(r & 3) * 4 + (c & 3)] - 0.5) * 0.9);
          if (level <= 0) continue;

          const x = Math.round(c * px + px / 2);
          const y = Math.round(r * px + px / 2);
          if (level === 1) {
            dots.rect(x - (dot >> 1), y - (dot >> 1), dot, dot);
          } else if (level === 2) {
            pluses.rect(x - (armSm >> 1), y - (thin >> 1), armSm, thin);
            pluses.rect(x - (thin >> 1), y - (armSm >> 1), thin, armSm);
          } else {
            bold.rect(x - (armLg >> 1), y - (thick >> 1), armLg, thick);
            bold.rect(x - (thick >> 1), y - (armLg >> 1), thick, armLg);
          }
        }
      }

      ctx.globalAlpha = 0.5 * intro;
      ctx.fill(dots);
      ctx.globalAlpha = 0.78 * intro;
      ctx.fill(pluses);
      ctx.globalAlpha = intro;
      ctx.fill(bold);
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (now - last >= FRAME_MS) {
        last = now;
        draw(now);
      }
      raf = window.requestAnimationFrame(loop);
    };
    const run = () => {
      if (!raf && visible) raf = window.requestAnimationFrame(loop);
    };

    resize();
    if (reduce) draw(start);
    else run();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!reduce) run();
    });
    viewObserver.observe(canvas);

    if (finePointer && !reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn('pointer-events-none block h-full w-full text-cta', className)} />;
}
