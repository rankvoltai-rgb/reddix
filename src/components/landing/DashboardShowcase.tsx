/**
 * The product, framed like a picture: the Reddix scanner laid on a painted
 * sky (scripts/painting renders it), then rows of the communities it watches.
 *
 * Motion is tied to the scroll, through a spring so it never jitters: the
 * scanner rises and tips upright as the section comes up the screen, and the
 * painting drifts the other way behind it. Inside, the scanner runs its own
 * loop (scanner-replica.tsx). With reduced motion it simply sits flat on the
 * painting.
 */
import { useRef, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { Band } from './frame';
import { ScannerReplica } from './scanner-replica';
import { SubredditIcon } from './shared';

export function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The rise: from the section's top entering the screen to it reaching the
  // upper fifth, so the scanner is flat by the time it's read.
  const { scrollYProgress: rise } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const p = useSpring(rise, { stiffness: 120, damping: 28, mass: 0.6 });
  const rotateX = useTransform(p, [0, 1], [16, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const y = useTransform(p, [0, 1], [72, 0]);

  // The painting's drift, over the whole time the section is on screen.
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(pass, [0, 1], ['-7%', '7%']);

  return (
    <section aria-label="The Reddix scanner">
      <Band inner="overflow-hidden">
        <div
          ref={ref}
          className="relative bg-[#8c0e12] px-3 pb-14 pt-12 [perspective:1800px] sm:px-10 sm:pb-20 sm:pt-16 lg:px-16"
        >
          <motion.img
            src="/assets/painting-red.webp"
            alt=""
            aria-hidden
            width={2200}
            height={1400}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.16] select-none object-cover"
            style={reduce ? undefined : { y: bgY }}
          />
          <motion.div
            className="relative mx-auto max-w-5xl will-change-transform"
            style={reduce ? undefined : { rotateX, scale, y, transformOrigin: '50% 0%' }}
          >
            <ScannerReplica />
          </motion.div>
        </div>
      </Band>
      <Band>
        <SubredditRows />
      </Band>
    </section>
  );
}

/* ---------- The communities it watches ---------- */

const KIND = {
  saas: { label: 'SaaS', className: 'bg-cta-soft text-cta ring-cta/20' },
  startup: { label: 'Startups', className: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20' },
  marketing: { label: 'Marketing', className: 'bg-violet-500/10 text-violet-700 ring-violet-500/20' },
  sales: { label: 'Sales', className: 'bg-amber-500/10 text-amber-700 ring-amber-500/20' },
  dev: { label: 'Dev', className: 'bg-sky-500/10 text-sky-700 ring-sky-500/20' },
  commerce: { label: 'E-commerce', className: 'bg-orange-500/10 text-orange-700 ring-orange-500/20' },
} as const;

type Community = { name: string; who: string; kind: keyof typeof KIND };

const COMMUNITIES: Community[] = [
  { name: 'r/SaaS', who: 'Founders & operators', kind: 'saas' },
  { name: 'r/startups', who: 'Early-stage teams', kind: 'startup' },
  { name: 'r/Entrepreneur', who: 'Business builders', kind: 'startup' },
  { name: 'r/marketing', who: 'Marketers', kind: 'marketing' },
  { name: 'r/sales', who: 'Sales teams', kind: 'sales' },
  { name: 'r/smallbusiness', who: 'Owners', kind: 'startup' },
  { name: 'r/webdev', who: 'Developers', kind: 'dev' },
  { name: 'r/ecommerce', who: 'Store owners', kind: 'commerce' },
  { name: 'r/growthhacking', who: 'Growth teams', kind: 'marketing' },
  { name: 'r/microsaas', who: 'Indie founders', kind: 'saas' },
  { name: 'r/indiehackers', who: 'Solo builders', kind: 'saas' },
  { name: 'r/devops', who: 'Platform teams', kind: 'dev' },
  { name: 'r/shopify', who: 'Merchants', kind: 'commerce' },
  { name: 'r/digital_marketing', who: 'Agencies', kind: 'marketing' },
  { name: 'r/B2BSaaS', who: 'B2B buyers', kind: 'sales' },
  { name: 'r/SideProject', who: 'Makers', kind: 'saas' },
  { name: 'r/programming', who: 'Engineers', kind: 'dev' },
  { name: 'r/agency', who: 'Agency owners', kind: 'marketing' },
];

function Chip({ c, copy }: { c: Community; copy: boolean }) {
  const kind = KIND[c.kind];
  return (
    <li
      aria-hidden={copy || undefined}
      className="flex h-16 w-[18rem] shrink-0 items-center gap-3 rounded-lg border border-ink/[0.08] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-cta/60 hover:bg-cta-soft/45 hover:shadow-[0_0_0_3px_hsl(var(--cta)/0.12),0_12px_24px_-16px_rgba(16,24,40,0.35)]"
    >
      <SubredditIcon name={c.name} className="h-8 w-8 text-[0.85rem]" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.92rem] font-medium leading-tight text-ink">{c.name}</span>
        <span className="block truncate text-[0.72rem] text-muted-foreground">{c.who}</span>
      </span>
      <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold ring-1 ring-inset', kind.className)}>
        {kind.label}
      </span>
    </li>
  );
}

/* The rows drift at different speeds, the middle one the other way. Hovering
   a row holds it. Each track holds its chips twice, so sliding it by half
   loops without a seam; the copy is hidden from screen readers. With reduced
   motion the rows sit still and scroll sideways. */
function Row({ items, duration, reverse = false }: { items: Community[]; duration: number; reverse?: boolean }) {
  return (
    <div className="group/row overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={cn(
          'flex w-max motion-safe:animate-marquee group-hover/row:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <ul className="flex gap-3 py-1.5 pr-3">
          {items.map((c) => (
            <Chip key={c.name} c={c} copy={false} />
          ))}
        </ul>
        <ul aria-hidden className="flex gap-3 py-1.5 pr-3 motion-reduce:hidden">
          {items.map((c) => (
            <Chip key={c.name} c={c} copy />
          ))}
        </ul>
      </div>
    </div>
  );
}

const ROWS: Community[][] = [[], [], []];
COMMUNITIES.forEach((c, i) => ROWS[i % 3].push(c));

function SubredditRows() {
  return (
    <div
      role="region"
      aria-label="Communities Reddix watches"
      className="space-y-1.5 py-4 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
    >
      <Row items={ROWS[0]} duration={70} />
      <Row items={ROWS[1]} duration={85} reverse />
      <Row items={ROWS[2]} duration={62} />
    </div>
  );
}
