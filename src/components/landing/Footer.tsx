/*
 * The footer is shared by every public page and sits on a deep brand red, so
 * every page closes on the same colour the call to action opens.
 */
import { useEffect, useId, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { features } from '@/lib/features';
import { useCases } from '@/lib/useCases';
import { competitors } from '@/lib/alternatives';
import { ChatGPTMark, ClaudeMark, GoogleMark, PerplexityMark } from './ai-marks';
import { CONTACT_EMAIL } from './PricingSection';
import { useGoToSection } from './scroll';
import { LogoMark } from '@/components/brand/Logo';

/* ---------- Trustpilot ---------- */

type TrustpilotWindow = Window & {
  Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
};

/* The TrustBox the site already embeds (index.html loads the script). The
   footer is lazy-loaded after that script runs, so it asks Trustpilot to
   fill this one in once it's mounted. */
function TrustBox() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trustpilot = (window as TrustpilotWindow).Trustpilot;
    if (ref.current && trustpilot) trustpilot.loadFromElement(ref.current, true);
  }, []);
  return (
    <div className="mt-6 w-60 rounded-lg bg-white px-1.5 py-1 shadow-[0_8px_24px_-12px_rgba(40,0,0,0.5)]">
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="6953ba7474cf034e3abcff6b"
        data-style-height="52px"
        data-style-width="100%"
        data-token="d04813d0-c51e-40a9-b1ff-79cc082f8602"
      >
        <a href="https://www.trustpilot.com/review/reddix.info" target="_blank" rel="noopener noreferrer" className="text-xs text-ink">
          Trustpilot
        </a>
      </div>
    </div>
  );
}

/* ---------- Sitemap ---------- */

type FooterLink = { label: string; more?: boolean } & ({ to: string } | { section: string } | { href: string });

interface FooterSection {
  title: string;
  links: FooterLink[];
}

/* "SaaS Founders" → "SaaS founders": plain capitalised words drop their
   capital, acronyms and brand spellings keep theirs. */
const sentenceCase = (title: string) =>
  title
    .split(' ')
    .map((w) => (/^[A-Z][a-z-]+$/.test(w) ? w.toLowerCase() : w))
    .join(' ');

const PRODUCT: FooterSection = {
  title: 'Product',
  links: [
    { label: 'Features', section: 'features' },
    { label: 'How it works', section: 'how-it-works' },
    { label: 'Pricing', section: 'pricing' },
    { label: 'Results', section: 'testimonials' },
    { label: 'FAQ', section: 'faq' },
    { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
    { label: 'Sign in', to: '/auth' },
  ],
};

const FEATURES_SECTION: FooterSection = {
  title: 'Features',
  links: [
    ...features.map((f) => ({ label: f.title, to: `/features/${f.slug}` })),
    { label: 'All features', section: 'features', more: true },
  ],
};

const USE_CASES: FooterSection = {
  title: 'Use cases',
  links: useCases.map((u) => ({ label: `For ${sentenceCase(u.title)}`, to: `/use-cases/${u.slug}` })),
};

const COMPARE: FooterSection = {
  title: 'Compare',
  links: [
    ...competitors.slice(0, 8).map((c) => ({ label: `${c.name} alternative`, to: `/alternatives/${c.slug}` })),
    { label: 'All alternatives', to: '/alternatives', more: true },
  ],
};

const RESOURCES: FooterSection = {
  title: 'Resources',
  links: [
    { label: 'Blog', to: '/blog' },
    { label: 'Reddit marketing glossary', to: '/glossary' },
    { label: 'Terms of service', to: '/terms' },
    { label: 'Refund policy', to: '/refund-policy' },
  ],
};

/* Five columns from lg; the short lists share one. */
const COLUMNS: FooterSection[][] = [[PRODUCT, RESOURCES], [FEATURES_SECTION], [USE_CASES], [COMPARE]];

const LEGAL_LINKS = [
  { label: 'Terms', to: '/terms' },
  { label: 'Refunds', to: '/refund-policy' },
] as const;

const FOCUS_RING =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-cta-deep';

/* The page you're on is marked with a white pixel in the gutter, so the label
   never shifts. */
const LINK = cn(
  'relative inline-flex items-center gap-1 py-1.5 text-left text-sm text-white/75 transition-colors hover:text-white md:py-1',
  'before:absolute before:-left-3 before:top-1/2 before:hidden before:h-1 before:w-1 before:-translate-y-1/2 before:bg-white',
  'data-[status=active]:text-white data-[status=active]:before:block',
  FOCUS_RING,
);

function FooterLinkItem({ link }: { link: FooterLink }) {
  const { pathname } = useLocation();
  const goToSection = useGoToSection();
  const className = cn(LINK, link.more && 'group font-semibold text-white');
  const label = (
    <>
      {link.label}
      {link.more && (
        <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      )}
    </>
  );
  if ('href' in link) {
    return (
      <a href={link.href} className={className}>
        {label}
      </a>
    );
  }
  if ('section' in link) {
    return (
      <a
        href={`/#${link.section}`}
        onClick={(e) => {
          e.preventDefault();
          goToSection(link.section);
        }}
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link to={link.to} data-status={pathname === link.to ? 'active' : undefined} className={className}>
      {label}
    </Link>
  );
}

/** A titled list. Below md it's a disclosure, so the sitemap folds to a few
 *  rows on a phone; from md up it's always open and the button is gone. The
 *  links stay in the DOM either way. */
function Section({ section }: { section: FooterSection }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  return (
    <div className="border-b border-white/15 md:border-0">
      <h2 className="text-sm font-semibold text-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={listId}
          className={cn('flex w-full items-center justify-between py-4 md:hidden', FOCUS_RING)}
        >
          {section.title}
          <ChevronDown
            aria-hidden
            className={cn('h-4 w-4 text-white/75 transition-transform duration-300 motion-reduce:transition-none', open && 'rotate-180')}
          />
        </button>
        <span className="hidden md:block">{section.title}</span>
      </h2>
      {/* Height animates on the grid row; visibility keeps closed links out of
          the tab order and the accessibility tree. */}
      <div
        id={listId}
        className={cn(
          'grid transition-[grid-template-rows,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:visible md:grid-rows-[1fr]',
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
        )}
      >
        {/* The clip the animation needs would cut off the gutter pixel and the
            focus rings, so it reaches into the gutter and pads back. */}
        <div className="-mx-3 min-h-0 overflow-hidden px-3 md:mx-0 md:overflow-visible md:px-0">
          <ul className="pb-4 pt-0.5 md:mt-3 md:p-0">
            {section.links.map((l) => (
              <li key={l.label}>
                <FooterLinkItem link={l} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ask AI ---------- */

/* Deliberately a plain question: the engine reads reddix.info and answers
   for itself. The prompt shown is exactly the prompt sent. */
const ASK_PROMPT = 'What is Reddix (reddix.info), and how does it find customers on Reddit?';

const ASK_ENGINES: { name: string; short?: string; host: string; Mark: ComponentType<{ className?: string }>; url: string }[] = [
  { name: 'ChatGPT', host: 'chatgpt.com', Mark: ChatGPTMark, url: `https://chatgpt.com/?q=${encodeURIComponent(ASK_PROMPT)}` },
  { name: 'Claude', host: 'claude.ai', Mark: ClaudeMark, url: `https://claude.ai/new?q=${encodeURIComponent(ASK_PROMPT)}` },
  {
    name: 'Perplexity',
    host: 'perplexity.ai',
    Mark: PerplexityMark,
    url: `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK_PROMPT)}`,
  },
  {
    name: 'Google AI Mode',
    short: 'AI Mode',
    host: 'google.com',
    Mark: GoogleMark,
    // udm=50 opens the query in AI Mode rather than classic results.
    url: `https://www.google.com/search?udm=50&q=${encodeURIComponent(ASK_PROMPT)}`,
  },
];

function AskAI() {
  return (
    <div className="w-full rounded-2xl bg-white/[0.07] p-4 ring-1 ring-inset ring-white/15 sm:p-5 lg:w-[29rem]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/75">Ask AI about Reddix</p>
      <p className="mt-2 text-[0.95rem] font-medium leading-snug text-white">&ldquo;{ASK_PROMPT}&rdquo;</p>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {ASK_ENGINES.map(({ name, short, host, Mark, url }) => (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${name} (opens ${host} in a new tab)`}
              className="group flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                <Mark className="h-3.5 w-3.5" />
              </span>
              {short ? (
                <span className="truncate">
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{name}</span>
                </span>
              ) : (
                <span className="truncate">{name}</span>
              )}
              <ArrowUpRight
                aria-hidden
                className="ml-auto h-3.5 w-3.5 shrink-0 text-white/60 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-cta motion-reduce:transition-none"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Wordmark ---------- */

/* "Reddix" in Plus Jakarta Sans Bold at 1000 units, measured in Chrome. The
   viewBox is cut to the ink, so the word runs edge to edge of the column at
   every width, and stops short of the baseline, so the bottom of the page
   crops it. Re-measure if the font, weight or word changes. */
const WORD_VIEWBOX = '71 0 3314 700';
const WORD_BASELINE = 757;
/* One pixel cell of the fill, in font units: a square and its gutter. */
const PIXEL_PITCH = 40;
const PIXEL_SIZE = 32;

/* Light falls from above: the letters fade toward the floor. */
const WORD_FADE: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, #000 15%, rgb(0 0 0 / 0.3))',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 15%, rgb(0 0 0 / 0.3))',
};

/* Follows the pointer, set as --spot-x/--spot-y on the wordmark. */
const SPOTLIGHT: CSSProperties = {
  maskImage: 'radial-gradient(circle 10rem at var(--spot-x) var(--spot-y), #000, transparent)',
  WebkitMaskImage: 'radial-gradient(circle 10rem at var(--spot-x) var(--spot-y), #000, transparent)',
};

function WordLayer({ id, base, pixel, style }: { id: string; base: number; pixel: number; style?: CSSProperties }) {
  return (
    <svg viewBox={WORD_VIEWBOX} className="block h-auto w-full" style={style}>
      <defs>
        <pattern id={id} width={PIXEL_PITCH} height={PIXEL_PITCH} patternUnits="userSpaceOnUse">
          <rect width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#fff" fillOpacity={pixel} />
        </pattern>
      </defs>
      <g className="font-jakarta" fontWeight={700} fontSize={1000}>
        <text x={0} y={WORD_BASELINE} fill="#fff" fillOpacity={base}>
          Reddix
        </text>
        <text x={0} y={WORD_BASELINE} fill={`url(#${id})`}>
          Reddix
        </text>
      </g>
    </svg>
  );
}

/** The brand name set as big as the page allows, in pixel squares. Under a
 *  mouse, the pixels nearest the pointer light up. */
function Wordmark() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  // Written straight to the element: a React state update per pointer move
  // would re-render the whole footer for a purely visual effect.
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
    el.dataset.lit = '';
  };
  const onPointerLeave = () => {
    if (ref.current) delete ref.current.dataset.lit;
  };
  return (
    <div ref={ref} aria-hidden onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="group/word relative select-none">
      <WordLayer id={`${uid}-dim`} base={0.07} pixel={0.2} style={WORD_FADE} />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[lit]/word:opacity-100 motion-reduce:transition-none"
        style={SPOTLIGHT}
      >
        <WordLayer id={`${uid}-lit`} base={0.08} pixel={0.7} />
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */

/* Kept to the side gutters, clear of the copy, a little denser toward the
   wordmark, as if it were shedding pixels. */
const PIXELS = [
  { top: '6%', left: '3%', size: 14, opacity: 0.09 },
  { top: '12%', left: '96%', size: 20, opacity: 0.1 },
  { top: '24%', left: '1.5%', size: 22, opacity: 0.12 },
  { top: '33%', left: '97.5%', size: 12, opacity: 0.08 },
  { top: '46%', left: '2.5%', size: 10, opacity: 0.07 },
  { top: '55%', left: '95.5%', size: 24, opacity: 0.11 },
  { top: '68%', left: '1%', size: 18, opacity: 0.1 },
  { top: '74%', left: '97%', size: 14, opacity: 0.12 },
  { top: '84%', left: '3.5%', size: 26, opacity: 0.13 },
  { top: '88%', left: '95%', size: 20, opacity: 0.14 },
  { top: '94%', left: '1.5%', size: 12, opacity: 0.12 },
];

function PixelField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIXELS.map((p, i) => (
        <span
          key={i}
          className="absolute bg-white motion-safe:animate-pixel-blink"
          style={
            {
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              '--pixel-opacity': p.opacity,
              '--pixel-delay': `${((i * 0.83) % 5).toFixed(2)}s`,
              '--pixel-duration': `${(3.6 + (i % 5) * 0.7).toFixed(1)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cta-deep font-jakarta text-white">
      <PixelField />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-10 border-b border-white/15 py-12 md:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <Link to="/" aria-label="Reddix home" className={cn('inline-flex items-center gap-2.5', FOCUS_RING)}>
              <LogoMark inverted className="h-8 w-8" />
              <span className="text-[1.2rem] font-semibold tracking-tight text-white">Reddix</span>
            </Link>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75">
              AI-powered Reddit lead generation. Reddix finds the people already asking for what you sell, and drafts
              the reply. Find buyers, not browsers.
            </p>
            <TrustBox />
          </div>
          <AskAI />
        </div>

        <nav aria-label="Footer" className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:py-14 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column[0].title} className="md:flex md:flex-col md:gap-10">
              {column.map((section) => (
                <Section key={section.title} section={section} />
              ))}
            </div>
          ))}
        </nav>

        <div className="flex flex-col-reverse gap-4 py-6 md:flex-row md:items-center md:justify-between md:border-t md:border-white/15">
          <p className="text-xs text-white/75">© {new Date().getFullYear()} Reddix. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className={cn('text-xs text-white/75 transition-colors hover:text-white', FOCUS_RING)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={cn('text-xs text-white/75 transition-colors hover:text-white', FOCUS_RING)}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <Wordmark />
      </div>
    </footer>
  );
}
