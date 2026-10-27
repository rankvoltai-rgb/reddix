import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/** Fades its children up into place the first time they scroll into view.
 *  Reduced motion is honoured by MotionConfig in Index. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5 text-amber-400', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden className="h-4 w-4 fill-current">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}

const GRADIENTS = [
  'from-rose-400 to-orange-300',
  'from-sky-400 to-indigo-400',
  'from-emerald-400 to-teal-300',
  'from-violet-400 to-fuchsia-300',
  'from-amber-400 to-yellow-300',
  'from-cyan-400 to-blue-400',
];

/** Initials on a soft gradient, picked from the name so it never changes. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
  const g = GRADIENTS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.7rem] font-semibold text-white ring-2',
        g,
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** A subreddit's icon: a coloured disc with its first letter, the way Reddit
 *  draws a community that hasn't set one. */
const SUB_COLORS = ['#FF4500', '#0079D3', '#46D160', '#FFB000', '#7193FF', '#FF585B', '#0DD3BB', '#9147FF'];

export function SubredditIcon({ name, className }: { name: string; className?: string }) {
  const bare = name.replace(/^r\//, '');
  const color = SUB_COLORS[[...bare].reduce((a, c) => a + c.charCodeAt(0), 0) % SUB_COLORS.length];
  return (
    <span
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-full text-[0.7rem] font-[700] text-white', className)}
      style={{ background: color }}
    >
      {bare.charAt(0).toUpperCase()}
    </span>
  );
}
