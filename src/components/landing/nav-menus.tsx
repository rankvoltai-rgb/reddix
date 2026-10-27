/**
 * The contents of the navbar's two mega menus, and the navigation data the
 * mobile sheet shares with them. The shell (triggers, hover intent, the
 * morphing panel behind these) lives in Navbar.tsx.
 *
 * Every menu is two-tone: primary links sit on the white panel, and the
 * secondary zone (a right rail, a footer band) sits on a soft grey, so the
 * eye lands on the product first and the extras second. Icons sit on flat
 * grey tiles that turn soft red on hover and on the page you're on.
 */
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  COMPARE_LINK,
  FEATURE_COLUMNS,
  LEARN_LINKS,
  NAV_COMPETITORS,
  PERSONA_COLUMNS,
  type GoToSection,
  type NavEntry,
  type NavTarget,
} from './nav-data';

/* ---------- Primitives ---------- */

/** The secondary zone inside a menu: rails and footer bands. */
const MENU_RAIL = 'bg-[hsl(220_20%_98.5%)]';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-0';

const TILE =
  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink/[0.045] text-ink/75 transition-colors group-hover:bg-cta-soft group-hover:text-cta group-focus-visible:bg-cta-soft group-focus-visible:text-cta group-data-[status=active]:bg-cta-soft group-data-[status=active]:text-cta';
const TILE_SMALL =
  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-ink/70 ring-1 ring-inset ring-ink/[0.07] transition-colors group-hover:bg-cta-soft group-hover:text-cta group-hover:ring-cta/20 group-data-[status=active]:bg-cta-soft group-data-[status=active]:text-cta';

export function NavLink({
  target,
  goToSection,
  className,
  children,
  ...rest
}: {
  target: NavTarget;
  goToSection: GoToSection;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  title?: string;
}) {
  const { pathname } = useLocation();
  if ('section' in target) {
    return (
      <a
        href={`/#${target.section}`}
        onClick={(e) => {
          e.preventDefault();
          goToSection(target.section);
        }}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={target.to}
      data-status={pathname === target.to ? 'active' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}

function ColumnLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex h-8 items-center justify-between px-2.5">
      <p className="text-[0.75rem] font-medium text-muted-foreground">{children}</p>
      {action}
    </div>
  );
}

function MoreLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-cta transition-colors hover:bg-cta-soft',
        FOCUS_RING,
        className,
      )}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );
}

/** The primary row: icon tile, name, one line of what it does. */
function MenuItem({ icon: Icon, title, description, target, goToSection }: NavEntry & { goToSection: GoToSection }) {
  return (
    <NavLink
      target={target}
      goToSection={goToSection}
      className={cn(
        'group flex items-start gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-ink/[0.03] data-[status=active]:bg-ink/[0.03]',
        FOCUS_RING,
      )}
    >
      <span className={TILE}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[0.9rem] font-medium leading-tight text-ink">
          {title}
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
        </span>
        <span className="mt-1 block text-pretty text-[0.78rem] leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </NavLink>
  );
}

function MenuFooter({ children }: { children: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 border-t border-ink/[0.07] px-3 py-2.5', MENU_RAIL)}>
      {children}
    </div>
  );
}

/** A competitor's initial on a neutral tile, standing in for its logo. */
function CompetitorInitial({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[26%] bg-ink/[0.06] text-[0.62rem] font-semibold text-ink/70 transition-colors group-hover:bg-cta-soft group-hover:text-cta"
    >
      {name.charAt(0)}
    </span>
  );
}

/* ---------- Features ---------- */

/** The rail's closing card: a sample lead read, plus the way in. */
function LeadScoreCard() {
  return (
    <div className="mt-auto hidden rounded-lg border border-ink/[0.08] bg-white p-3.5 lg:block">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.875rem] font-medium text-ink">Score a lead</p>
        <span className="shrink-0 rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">r/SaaS · Intent score</span>
        <span className="shrink-0 font-semibold text-ink">94 · Hot</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div className="h-full w-[94%] rounded-full bg-cta" />
      </div>
      <Link
        to="/auth"
        className={cn(
          'group mt-3.5 flex items-center justify-center gap-1.5 rounded-md bg-cta px-3 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover',
          FOCUS_RING,
        )}
      >
        Start free
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </Link>
    </div>
  );
}

export function FeaturesMenu({ goToSection }: { goToSection: GoToSection }) {
  return (
    <>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid grid-cols-2 gap-x-2 p-3">
          {FEATURE_COLUMNS.map((col) => (
            <div key={col.label}>
              <ColumnLabel>{col.label}</ColumnLabel>
              {col.items.map((f) => (
                <MenuItem key={f.title} {...f} goToSection={goToSection} />
              ))}
            </div>
          ))}
        </div>
        <div className={cn('flex flex-col gap-0.5 border-t border-ink/[0.07] p-3 lg:border-l lg:border-t-0', MENU_RAIL)}>
          <ColumnLabel>Who it&rsquo;s for</ColumnLabel>
          <div className="mb-3 grid grid-cols-2 gap-x-0.5">
            {PERSONA_COLUMNS.map((g) => (
              <div key={g.label} className="min-w-0">
                <p className="px-2 pb-1 pt-1.5 text-[0.7rem] text-muted-foreground/80">{g.label}</p>
                {g.items.map((p) => (
                  <NavLink
                    key={p.slug}
                    target={{ to: `/use-cases/${p.slug}` }}
                    goToSection={goToSection}
                    aria-label={`Reddix for ${p.title.toLowerCase()}`}
                    title={p.title}
                    className={cn(
                      'group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-white data-[status=active]:bg-white',
                      FOCUS_RING,
                    )}
                  >
                    <span className={TILE_SMALL}>
                      <p.icon className="h-3 w-3" />
                    </span>
                    <span className="truncate text-[0.8rem] font-medium text-ink">{p.short}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <LeadScoreCard />
        </div>
      </div>
      <MenuFooter>
        <NavLink
          target={{ section: 'how-it-works' }}
          goToSection={goToSection}
          className={cn('group flex min-w-0 items-center gap-3 rounded-md px-2.5 py-1.5 transition-colors hover:bg-white', FOCUS_RING)}
        >
          <span className="shrink-0 text-[0.875rem] font-medium text-ink">How it works</span>
          <span className="hidden truncate text-xs text-muted-foreground lg:inline">
            Drop in your URL, pick subreddits, and get scored leads with reply drafts
          </span>
        </NavLink>
        <NavLink
          target={{ section: 'features' }}
          goToSection={goToSection}
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-cta transition-colors hover:bg-cta-soft',
            FOCUS_RING,
          )}
        >
          All features
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </NavLink>
      </MenuFooter>
    </>
  );
}

/* ---------- Resources ---------- */

export function ResourcesMenu({ goToSection }: { goToSection: GoToSection }) {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="p-3">
          <ColumnLabel>Learn</ColumnLabel>
          {LEARN_LINKS.map((l) => (
            <MenuItem key={l.title} {...l} goToSection={goToSection} />
          ))}
        </div>
        <div className="p-3 pl-0">
          <ColumnLabel>Compare</ColumnLabel>
          <MenuItem {...COMPARE_LINK} goToSection={goToSection} />
          <div className="mx-2.5 my-1.5 h-px bg-ink/[0.07]" />
          {NAV_COMPETITORS.map((c) => (
            <NavLink
              key={c.slug}
              target={{ to: `/alternatives/${c.slug}` }}
              goToSection={goToSection}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors hover:bg-ink/[0.03] data-[status=active]:bg-ink/[0.03]',
                FOCUS_RING,
              )}
            >
              <CompetitorInitial name={c.name} />
              <span className="shrink-0 text-[0.875rem] font-medium text-ink">vs {c.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <MenuFooter>
        <span className="truncate px-2.5 text-xs text-muted-foreground">
          Side-by-side feature tables for every major Reddit lead tool
        </span>
        <MoreLink to="/alternatives" className="shrink-0">
          Compare all
        </MoreLink>
      </MenuFooter>
    </>
  );
}
