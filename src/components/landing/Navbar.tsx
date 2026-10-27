import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeaturesMenu, NavLink, ResourcesMenu } from './nav-menus';
import { useGoToSection } from './scroll';
import { COMPARE_LINK, FEATURE_COLUMNS, LEARN_LINKS, NAV_COMPETITORS, PERSONA_COLUMNS, type GoToSection } from './nav-data';
import { LogoMark } from '@/components/brand/Logo';

type MenuId = 'features' | 'resources';

/* Landing-page sections. The navbar is shared by every public page, so these
   always go to "/" first when you're elsewhere. */
const LINKS: { label: string; section: string }[] = [
  { label: 'How it works', section: 'how-it-works' },
  { label: 'Pricing', section: 'pricing' },
  { label: 'FAQ', section: 'faq' },
];

const MENUS: { id: MenuId; label: string; width: string; paths: string[] }[] = [
  { id: 'features', label: 'Features', width: 'w-[min(60rem,calc(100vw-2rem))]', paths: ['/features', '/use-cases'] },
  { id: 'resources', label: 'Resources', width: 'w-[min(40rem,calc(100vw-2rem))]', paths: ['/blog', '/glossary', '/alternatives'] },
];

const inSection = (pathname: string, paths: string[]) => paths.some((p) => pathname.startsWith(p));

/* Long enough that sweeping the pointer across the bar doesn't flash a menu
   open; short enough that reaching for one feels instant. */
const OPEN_DELAY = 90;
/* Long enough to cut the corner from a trigger to the far side of its panel. */
const CLOSE_DELAY = 200;

/* Where the panel sits: centred under the bar, just below it. The surface
   behind the menus and the hairline over them share it. */
const STAGE = 'absolute inset-x-0 top-[calc(100%+0.5rem)] mx-auto';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const TOP_ITEM =
  'relative flex h-9 items-center gap-1 whitespace-nowrap rounded-md px-3 text-sm font-medium text-ink/65 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 md:px-2 lg:px-3.5';

/* Marks the top-level item for the section you're in. */
function CurrentDot() {
  return <span aria-hidden className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink" />;
}

/* Hover belongs to mice and pens; a tap goes through click instead. */
const hoverOnly = (fn: () => void) => (e: ReactPointerEvent) => {
  if (e.pointerType !== 'touch') fn();
};

interface MenuState {
  active: MenuId | null;
  /* The menu shown last, so the surface keeps its size while it fades out. */
  last: MenuId;
  /* True while switching between two open menus: the only time the surface
     animates its size. Opening from closed sizes it at once. */
  morph: boolean;
}

interface Pill {
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
  /* False when it appears from hidden, so it fades in where it lands instead
     of sliding over from wherever it last was. */
  slide: boolean;
}

/**
 * @param framed Draw the landing page's hairline rails on the bar, so they run
 *               on into a page laid out in that frame.
 */
export function Navbar({ framed = false }: { framed?: boolean }) {
  const { pathname } = useLocation();
  const [menu, setMenu] = useState<MenuState>({ active: null, last: 'features', morph: false });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill | null>(null);
  const [sizes, setSizes] = useState<Partial<Record<MenuId, { w: number; h: number }>>>({});

  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const panelRefs = useRef<Partial<Record<MenuId, HTMLDivElement | null>>>({});
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const timers = useRef<{ open?: number; close?: number }>({});
  const lastPointer = useRef('mouse');

  const active = menu.active;

  const show = useCallback((id: MenuId | null) => {
    setMenu((m) => (m.active === id ? m : { active: id, last: id ?? m.last, morph: m.active !== null && id !== null }));
  }, []);

  // Navigating closes everything.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenu((m) => ({ ...m, active: null, morph: false }));
    setMobileOpen(false);
  }

  const goHome = useGoToSection();
  const goToSection: GoToSection = useCallback(
    (id) => {
      show(null);
      setMobileOpen(false);
      goHome(id);
    },
    [goHome, show],
  );

  const clearTimers = () => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
  };
  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.open);
      window.clearTimeout(t.close);
    };
  }, []);

  // Once a menu is open, moving to the other trigger switches at once; only
  // the first opening waits out the intent delay.
  const hoverOpen = (id: MenuId) => {
    clearTimers();
    if (active) show(id);
    else timers.current.open = window.setTimeout(() => show(id), OPEN_DELAY);
  };
  const scheduleClose = () => {
    clearTimers();
    timers.current.close = window.setTimeout(() => show(null), CLOSE_DELAY);
  };
  const cancelClose = () => window.clearTimeout(timers.current.close);

  // Escape closes (handing focus back to the trigger if it was in the menu);
  // so does pressing anywhere outside the header.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const focusInside = headerRef.current?.contains(document.activeElement);
      show(null);
      if (focusInside) triggerRefs.current[active]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) show(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [active, show]);

  // The surface takes the size of whichever menu is showing, so each menu is
  // measured as it lays out.
  useEffect(() => {
    const measure = () => {
      const next: Partial<Record<MenuId, { w: number; h: number }>> = {};
      for (const { id } of MENUS) {
        const el = panelRefs.current[id];
        if (el) next[id] = { w: el.offsetWidth, h: el.offsetHeight };
      }
      setSizes(next);
    };
    const observer = new ResizeObserver(measure);
    for (const { id } of MENUS) {
      const el = panelRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // The pill follows the pointer across the bar, and rests on the open
  // menu's trigger while the pointer is inside that menu.
  const pillKey = hovered ?? active;
  useLayoutEffect(() => {
    const el = pillKey ? itemRefs.current[pillKey] : null;
    setPill((prev) =>
      el
        ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, visible: true, slide: !!prev?.visible }
        : prev && { ...prev, visible: false },
    );
  }, [pillKey]);

  const order = (id: MenuId) => MENUS.findIndex((m) => m.id === id);

  // An open menu sits in place; the others wait off to the side they'd slide
  // in from, so moving between menus reads as moving along the bar.
  // Visibility flips at once on the way in, so a link can take focus in the
  // same frame, and waits for the fade on the way out.
  const panelState = (id: MenuId) => {
    if (active === id) {
      return 'visible translate-x-0 translate-y-0 opacity-100 transition-[opacity,transform]';
    }
    return cn(
      'invisible pointer-events-none opacity-0 transition-[opacity,transform,visibility]',
      !active ? '-translate-y-1' : order(id) < order(active) ? '-translate-x-6' : 'translate-x-6',
    );
  };

  // Up and down arrows walk the menu's links; up from the first returns to
  // the trigger.
  const walkLinks = (e: ReactKeyboardEvent<HTMLDivElement>, id: MenuId) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href]'));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && i === 0) triggerRefs.current[id]?.focus();
    else links[e.key === 'ArrowDown' ? Math.min(i + 1, links.length - 1) : i - 1]?.focus();
  };

  // On the landing page the logo scrolls back to the top instead.
  const onLogo = (e: MouseEvent) => {
    if (pathname !== '/') return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const size = sizes[menu.last];
  const stageStyle = size ? { width: size.w, height: size.h } : undefined;
  const stageMotion = cn(
    menu.morph ? 'transition-[opacity,transform,width,height] duration-300' : 'transition-[opacity,transform] duration-200',
    EASE,
    'motion-reduce:transition-none',
    active ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
  );

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-ink/[0.07] bg-white font-jakarta">
      {/* A faint wash over the page while a menu is open, lifting the menu
          off the hero it opens over. Purely visual — never takes the pointer. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-0 top-16 hidden bg-ink/[0.04] transition-opacity duration-300 md:block',
          active ? 'opacity-100' : 'opacity-0',
        )}
      />
      <nav
        aria-label="Main"
        className={cn(
          'relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-6',
          framed && 'border-x border-ink/[0.07]',
        )}
      >
        {/* The panel's surface, behind both menus: one card that reshapes
            between them rather than two cards that swap. */}
        <div
          aria-hidden
          style={stageStyle}
          className={cn(
            STAGE,
            'pointer-events-none hidden rounded-lg bg-white shadow-[0_2px_6px_-2px_rgba(16,24,40,0.06),0_16px_40px_-16px_rgba(16,24,40,0.2)] md:block',
            stageMotion,
          )}
        />
        <Link to="/" onClick={onLogo} className="relative flex shrink-0 items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="text-[1.2rem] font-semibold tracking-tight text-ink">Reddix</span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex" onPointerLeave={() => setHovered(null)}>
          <span
            aria-hidden
            style={pill ? { transform: `translate(${pill.x}px, ${pill.y}px)`, width: pill.w, height: pill.h } : undefined}
            className={cn(
              'pointer-events-none absolute left-0 top-0 rounded-md bg-ink/[0.045]',
              pill?.slide ? cn('transition-[transform,width,opacity] duration-300', EASE) : 'transition-opacity duration-150',
              'motion-reduce:transition-none',
              pill?.visible ? 'opacity-100' : 'opacity-0',
            )}
          />
          {/* Bridges the gap between the bar and the panel. */}
          <div
            aria-hidden
            onPointerEnter={hoverOnly(cancelClose)}
            onPointerLeave={hoverOnly(scheduleClose)}
            className={cn('absolute inset-x-0 top-full h-2', active ? 'pointer-events-auto' : 'pointer-events-none')}
          />
          {MENUS.map(({ id, label, width, paths }) => {
            const open = active === id;
            return (
              <div
                key={id}
                onBlur={(e) => {
                  if (open && !e.currentTarget.contains(e.relatedTarget as Node)) show(null);
                }}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[id] = el;
                    itemRefs.current[id] = el;
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`nav-menu-${id}`}
                  onPointerDown={(e) => {
                    lastPointer.current = e.pointerType;
                  }}
                  onPointerEnter={(e) => {
                    setHovered(id);
                    if (e.pointerType !== 'touch') hoverOpen(id);
                  }}
                  onPointerLeave={hoverOnly(scheduleClose)}
                  onClick={(e) => {
                    clearTimers();
                    // Hover already opened it: clicking the label the pointer
                    // rests on shouldn't slam it shut. Taps and keys toggle.
                    if (open && e.detail > 0 && lastPointer.current !== 'touch') return;
                    show(open ? null : id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'ArrowDown') return;
                    e.preventDefault();
                    flushSync(() => show(id));
                    panelRefs.current[id]?.querySelector<HTMLElement>('a[href]')?.focus();
                  }}
                  className={cn(TOP_ITEM, open && 'text-ink')}
                >
                  {label}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 opacity-70 transition-transform duration-300 motion-reduce:transition-none',
                      open && 'rotate-180',
                    )}
                  />
                  {inSection(pathname, paths) && <CurrentDot />}
                </button>
                <div
                  id={`nav-menu-${id}`}
                  ref={(el) => {
                    panelRefs.current[id] = el;
                  }}
                  onPointerEnter={hoverOnly(cancelClose)}
                  onPointerLeave={hoverOnly(scheduleClose)}
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('a')) return;
                    clearTimers();
                    show(null);
                  }}
                  onKeyDown={(e) => walkLinks(e, id)}
                  className={cn(
                    STAGE,
                    width,
                    'max-h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden rounded-lg duration-200 ease-out motion-reduce:transition-none',
                    panelState(id),
                  )}
                >
                  {id === 'features' ? <FeaturesMenu goToSection={goToSection} /> : <ResourcesMenu goToSection={goToSection} />}
                </div>
              </div>
            );
          })}
          {LINKS.map((l) => (
            <a
              key={l.label}
              ref={(el) => {
                itemRefs.current[l.label] = el;
              }}
              href={`/#${l.section}`}
              onClick={(e) => {
                e.preventDefault();
                goToSection(l.section);
              }}
              onPointerEnter={() => setHovered(l.label)}
              className={TOP_ITEM}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Hairline over the menus, so their tinted zones can run right to
            the panel's edge without covering its border. */}
        <div
          aria-hidden
          style={stageStyle}
          className={cn(STAGE, 'pointer-events-none hidden rounded-lg border border-ink/[0.08] md:block', stageMotion)}
        />

        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden whitespace-nowrap rounded-lg border border-ink/[0.1] bg-white px-3 py-2 text-sm font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.16] hover:bg-ink/[0.02] md:inline-flex lg:px-4"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="hidden whitespace-nowrap rounded-lg bg-cta px-3 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover md:inline-flex lg:px-4"
          >
            Get Started Free
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink md:hidden"
          >
            <Menu
              className={cn(
                'absolute h-5 w-5 transition-all duration-200 motion-reduce:transition-none',
                mobileOpen && 'rotate-90 scale-50 opacity-0',
              )}
            />
            <X
              className={cn(
                'absolute h-5 w-5 transition-all duration-200 motion-reduce:transition-none',
                !mobileOpen && '-rotate-90 scale-50 opacity-0',
              )}
            />
          </button>
        </div>
      </nav>
      {mobileOpen && <MobileNav goToSection={goToSection} />}
    </header>
  );
}

/* ---------- Mobile ---------- */

const MOBILE_ROW =
  'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-[0.9rem] font-medium text-ink transition-colors hover:bg-ink/[0.03]';

/** The phone sheet: each menu folds open in place; plain links sit below. */
function MobileNav({ goToSection }: { goToSection: GoToSection }) {
  const [open, setOpen] = useState<MenuId | null>(null);

  const section = (id: MenuId, label: string, body: ReactNode) => (
    <div className="border-b border-ink/[0.07] py-1">
      <button
        type="button"
        aria-expanded={open === id}
        onClick={() => setOpen(open === id ? null : id)}
        className="flex w-full items-center justify-between px-2.5 py-3 text-[0.95rem] font-semibold text-ink"
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 opacity-60 transition-transform duration-200', open === id && 'rotate-180')} />
      </button>
      {open === id && <div className="pb-2">{body}</div>}
    </div>
  );

  const label = (text: string) => (
    <p className="px-2.5 pb-1 pt-2 text-[0.72rem] font-medium text-muted-foreground">{text}</p>
  );

  return (
    <div
      id="mobile-nav"
      className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink/[0.07] bg-white px-4 pb-5 md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {section(
        'features',
        'Features',
        <>
          {FEATURE_COLUMNS.map((col) => (
            <div key={col.label}>
              {label(col.label)}
              {col.items.map((f) => (
                <NavLink key={f.title} target={f.target} goToSection={goToSection} className={MOBILE_ROW}>
                  <f.icon className="h-4 w-4 text-ink/60" />
                  {f.title}
                </NavLink>
              ))}
            </div>
          ))}
          {label('Who it’s for')}
          <div className="grid grid-cols-2">
            {PERSONA_COLUMNS.flatMap((g) => g.items).map((p) => (
              <NavLink key={p.slug} target={{ to: `/use-cases/${p.slug}` }} goToSection={goToSection} className={MOBILE_ROW}>
                <p.icon className="h-4 w-4 text-ink/60" />
                {p.short}
              </NavLink>
            ))}
          </div>
        </>,
      )}
      {section(
        'resources',
        'Resources',
        <>
          {[...LEARN_LINKS, COMPARE_LINK].map((l) => (
            <NavLink key={l.title} target={l.target} goToSection={goToSection} className={MOBILE_ROW}>
              <l.icon className="h-4 w-4 text-ink/60" />
              {l.title}
            </NavLink>
          ))}
          {NAV_COMPETITORS.map((c) => (
            <NavLink key={c.slug} target={{ to: `/alternatives/${c.slug}` }} goToSection={goToSection} className={MOBILE_ROW}>
              <span className="w-4 text-center text-xs font-semibold text-ink/50">{c.name.charAt(0)}</span>
              vs {c.name}
            </NavLink>
          ))}
        </>,
      )}
      <div className="py-2">
        {LINKS.map((l) => (
          <NavLink key={l.label} target={{ section: l.section }} goToSection={goToSection} className="block px-2.5 py-3 text-[0.95rem] font-semibold text-ink">
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <Link to="/auth" className="flex-1 rounded-lg border border-ink/[0.1] py-2.5 text-center text-sm font-semibold text-ink">
          Sign In
        </Link>
        <Link to="/auth" className="flex-1 rounded-lg bg-cta py-2.5 text-center text-sm font-semibold text-white">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
