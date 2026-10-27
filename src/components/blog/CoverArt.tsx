/**
 * A post's cover. Posts with a `cover:` image show it; the rest get a
 * generated one: flat, bold shapes in the brand's red, ink and white, with a
 * scene picked from what the title is about, so the grid reads as a set of
 * subjects rather than one picture repeated.
 *
 * Everything derives from the slug and title, so a post always gets the same
 * cover. The art is one SVG canvas scaled to cover its box, so it reads the
 * same as a card thumbnail and as a header.
 */
import { useId } from 'react';
import { cn } from '@/lib/utils';
import type { PostMeta } from '@/lib/blog/types';

const RED = 'hsl(0 84% 47%)';
const RED_DEEP = 'hsl(0 80% 38%)';
const INK = 'hsl(222 14% 9%)';
const PAPER = '#ffffff';
const MIST = 'hsl(0 90% 96.5%)';
const LINE = 'hsl(220 14% 88%)';

type Scene = 'thread' | 'score' | 'lockup' | 'rules';

/* First match wins, so the more specific subjects come first. */
const SUBJECTS: [Scene, RegExp][] = [
  ['lockup', /\bfind|search|subreddit|communit|monitor|discover/i],
  ['rules', /rule|\bban|moderat|self-promo|spam|policy|karma/i],
  ['score', /lead|intent|scor|qualif|pipeline|convert|customer/i],
  ['thread', /repl|comment|post|write|thread|engage/i],
];

/** A stable 32-bit hash of a string. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function sceneFor(post: Pick<PostMeta, 'title'>, seed: number): Scene {
  return SUBJECTS.find(([, re]) => re.test(post.title))?.[0] ?? (['thread', 'score', 'lockup'] as const)[seed % 3];
}

/* ---------- shared pieces ---------- */

function RedditGlyph({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x - r} ${y - r}) scale(${(r * 2) / 20})`}>
      <circle cx="10" cy="10" r="10" fill="#FF4500" />
      <ellipse cx="10" cy="11.6" rx="5.2" ry="3.6" fill="#fff" />
      <circle cx="4.9" cy="9.4" r="1.25" fill="#fff" />
      <circle cx="15.1" cy="9.4" r="1.25" fill="#fff" />
      <circle cx="8" cy="11.1" r="0.85" fill="#FF4500" />
      <circle cx="12" cy="11.1" r="0.85" fill="#FF4500" />
      <path d="M10 8l.8-3.4 2.4.5" fill="none" stroke="#fff" strokeWidth="0.7" strokeLinecap="round" />
      <circle cx="13.9" cy="5.3" r="1" fill="#fff" />
    </g>
  );
}

/* A Reddit post as a white card: subreddit row, title bars, vote column. */
function PostCard({ x, y, w, accent = RED }: { x: number; y: number; w: number; accent?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={92} rx={10} fill={PAPER} />
      <circle cx={x + 18} cy={y + 18} r={7} fill={accent} />
      <rect x={x + 31} y={y + 14} width={46} height={7} rx={3.5} fill={INK} opacity={0.75} />
      <rect x={x + 82} y={y + 14} width={22} height={7} rx={3.5} fill={LINE} />
      <rect x={x + 12} y={y + 34} width={w - 40} height={9} rx={4.5} fill={INK} />
      <rect x={x + 12} y={y + 49} width={w - 70} height={9} rx={4.5} fill={INK} />
      <rect x={x + 12} y={y + 70} width={34} height={8} rx={4} fill={LINE} />
      <rect x={x + 52} y={y + 70} width={44} height={8} rx={4} fill={LINE} />
      <rect x={x + w - 48} y={y + 66} width={36} height={16} rx={8} fill={accent} />
    </g>
  );
}

/* ---------- scenes ---------- */

/* A mosaic of tiles around one Reddit post card. */
function ThreadScene({ seed }: { seed: number }) {
  const tiles = [RED, INK, MIST, RED_DEEP, PAPER, INK];
  const pick = (i: number) => tiles[(seed >> i) % tiles.length];
  return (
    <>
      <rect width="400" height="250" fill={RED} />
      {/* The mosaic: three rows of tiles behind the card. */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3].map((col) => {
          const i = row * 4 + col;
          const fill = pick(i % 12);
          const x = 8 + col * 98;
          const y = 8 + row * 80;
          const mark = (seed >> (i + 3)) % 4;
          const fg = fill === PAPER || fill === MIST ? RED : PAPER;
          return (
            <g key={i}>
              <rect x={x} y={y} width={90} height={72} rx={8} fill={fill} />
              {mark === 0 && <circle cx={x + 45} cy={y + 36} r={20} fill="none" stroke={fg} strokeWidth={3} />}
              {mark === 1 &&
                [0, 1, 2].flatMap((c) => [0, 1].map((r) => <circle key={`${c}${r}`} cx={x + 30 + c * 15} cy={y + 29 + r * 15} r={4.5} fill={fg} />))}
              {mark === 2 && [0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={x + 18 + k * 10} y={y + 14} width={3} height={44} fill={fg} opacity={0.6} />)}
              {mark === 3 && <circle cx={x + 45} cy={y + 72} r={26} fill={fg} />}
            </g>
          );
        }),
      )}
      <rect x={106} y={70} width={188} height={110} rx={12} fill={INK} opacity={0.12} />
      <PostCard x={112} y={78} w={176} />
    </>
  );
}

/* A lead score card: the big number, the meter, and lead rows below. */
function ScoreScene({ seed }: { seed: number }) {
  const score = 80 + (seed % 19);
  const onRed = (seed >> 4) % 2 === 1;
  return (
    <>
      <rect width="400" height="250" fill={onRed ? RED : INK} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={30 + i * 58} cy={30} r={3} fill={PAPER} opacity={0.18} />
      ))}
      <circle cx={340} cy={210} r={70} fill={onRed ? INK : RED} />
      <circle cx={340} cy={210} r={42} fill="none" stroke={PAPER} strokeWidth={3} opacity={0.5} />
      <rect x={52} y={46} width={232} height={160} rx={14} fill={PAPER} />
      <circle cx={74} cy={68} r={8} fill={RED} />
      <rect x={88} y={64} width={70} height={8} rx={4} fill={INK} opacity={0.75} />
      <text x={68} y={124} fontSize={46} fontWeight={700} fill={INK} fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
        {score}
      </text>
      <rect x={140} y={96} width={52} height={20} rx={6} fill={MIST} />
      <rect x={150} y={103} width={32} height={6} rx={3} fill={RED} />
      <rect x={68} y={138} width={200} height={7} rx={3.5} fill={LINE} />
      <rect x={68} y={138} width={200 * (score / 100)} height={7} rx={3.5} fill={RED} />
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={68} y={158 + r * 20} width={14} height={14} rx={4} fill={r ? '#fbbf24' : RED} />
          <rect x={90} y={162 + r * 20} width={120 - r * 30} height={6} rx={3} fill={INK} opacity={0.6} />
        </g>
      ))}
    </>
  );
}

/* A Reddit mark in a ring, wired to a subreddit pill. */
function LockupScene({ seed }: { seed: number }) {
  const subs = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/sales', 'r/marketing'];
  const sub = subs[seed % subs.length];
  const onRed = (seed >> 4) % 2 === 1;
  return (
    <>
      <rect width="400" height="250" fill={onRed ? RED : INK} />
      <path d="M150 125 L238 125" stroke={PAPER} strokeWidth={2} strokeDasharray="5 6" opacity={0.6} />
      <path d="M110 125 L36 40 M110 125 L60 232 M300 125 L372 44 M300 125 L360 236" stroke={PAPER} strokeWidth={1.6} strokeDasharray="4 6" opacity={0.35} />
      {[
        [36, 40],
        [60, 232],
        [372, 44],
        [360, 236],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={15} fill={i % 2 ? PAPER : onRed ? INK : RED} />
          <circle cx={x} cy={y} r={5} fill={i % 2 ? RED : PAPER} />
        </g>
      ))}
      <circle cx={110} cy={125} r={62} fill="none" stroke={PAPER} strokeWidth={3} />
      <circle cx={110} cy={125} r={50} fill={PAPER} />
      <RedditGlyph x={110} y={125} r={28} />
      <rect x={232} y={101} width={150} height={48} rx={24} fill={PAPER} />
      <circle cx={256} cy={125} r={7} fill={RED} />
      <text x={272} y={132} fontSize={20} fontWeight={700} fill={INK} fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
        {sub}
      </text>
    </>
  );
}

/* A rulebook card with checks and one cross, on the red field. */
function RulesScene({ seed }: { seed: number }) {
  const crossAt = 1 + (seed % 3);
  const onInk = (seed >> 4) % 2 === 1;
  return (
    <>
      <rect width="400" height="250" fill={onInk ? INK : RED} />
      <circle cx={52} cy={210} r={64} fill={onInk ? RED : RED_DEEP} />
      <circle cx={356} cy={36} r={46} fill="none" stroke={PAPER} strokeWidth={3} opacity={0.45} />
      {[0, 1, 2].map((c) => [0, 1].map((r) => <circle key={`${c}${r}`} cx={320 + c * 16} cy={190 + r * 16} r={4.5} fill={PAPER} opacity={0.7} />))}
      <rect x={100} y={34} width={200} height={182} rx={14} fill={PAPER} />
      <rect x={120} y={52} width={84} height={10} rx={5} fill={INK} />
      {[0, 1, 2, 3].map((i) => {
        const y = 82 + i * 32;
        const bad = i === crossAt;
        return (
          <g key={i}>
            <circle cx={130} cy={y + 6} r={10} fill={bad ? INK : RED} />
            {bad ? (
              <path d={`M125 ${y + 1} l10 10 M135 ${y + 1} l-10 10`} stroke={PAPER} strokeWidth={2.4} strokeLinecap="round" />
            ) : (
              <path d={`M125 ${y + 6} l3.5 3.5 6.5-7`} stroke={PAPER} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
            <rect x={150} y={y + 2} width={bad ? 96 : 128 - i * 8} height={8} rx={4} fill={INK} opacity={bad ? 0.3 : 0.65} />
          </g>
        );
      })}
    </>
  );
}

export function CoverArt({ post, className }: { post: Pick<PostMeta, 'slug' | 'title' | 'cover'>; className?: string }) {
  const uid = `cover${useId().replace(/[^\w-]/g, '')}`;
  if (post.cover) {
    return (
      <div className={cn('relative overflow-hidden bg-secondary', className)}>
        <img src={post.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }
  const seed = hash(post.slug);
  const scene = sceneFor(post, seed);
  return (
    <div aria-hidden className={cn('relative overflow-hidden bg-cta', className)}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" id={uid}>
        {scene === 'thread' && <ThreadScene seed={seed} />}
        {scene === 'score' && <ScoreScene seed={seed} />}
        {scene === 'lockup' && <LockupScene seed={seed} />}
        {scene === 'rules' && <RulesScene seed={seed} />}
      </svg>
    </div>
  );
}
