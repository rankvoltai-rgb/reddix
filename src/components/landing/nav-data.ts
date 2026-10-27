/**
 * Navigation data shared by the desktop mega menus (nav-menus.tsx) and the
 * mobile sheet (Navbar.tsx). Feature, use-case and competitor details come
 * from their own data files; this only decides grouping and short labels.
 */
import { BookOpen, HelpCircle, Layers, Newspaper, Workflow, type LucideIcon } from 'lucide-react';
import { features } from '@/lib/features';
import { useCases } from '@/lib/useCases';
import { competitors } from '@/lib/alternatives';

/** A link either to a page or to a section of the landing page. */
export type NavTarget = { to: string } | { section: string };

export interface NavEntry {
  icon: LucideIcon;
  title: string;
  description: string;
  target: NavTarget;
}

/** Scrolls to a landing-page section, from any page. Set by the Navbar. */
export type GoToSection = (id: string) => void;

/* ---------- Data ---------- */

const FEATURE_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: 'Find',
    slugs: ['intent-detection', 'subreddit-discovery', 'website-analysis', 'scheduled-scans', 'deduplication'],
  },
  {
    label: 'Convert',
    slugs: ['lead-scoring', 'ai-replies', 'natural-tone', 'analytics-dashboard'],
  },
];

export const FEATURE_COLUMNS = FEATURE_GROUPS.map((g) => ({
  label: g.label,
  items: g.slugs
    .map((slug) => features.find((f) => f.slug === slug))
    .filter((f): f is (typeof features)[number] => !!f)
    .map<NavEntry>((f) => ({
      icon: f.icon,
      title: f.title,
      description: f.tagline,
      target: { to: `/features/${f.slug}` },
    })),
}));

/* Short names so two columns of four fit the rail. */
const PERSONA_GROUPS: { label: string; items: { slug: string; short: string }[] }[] = [
  {
    label: 'By role',
    items: [
      { slug: 'saas-founders', short: 'Founders' },
      { slug: 'solopreneurs', short: 'Solopreneurs' },
      { slug: 'marketing-agencies', short: 'Agencies' },
      { slug: 'content-marketers', short: 'Marketers' },
    ],
  },
  {
    label: 'By business',
    items: [
      { slug: 'developer-tools', short: 'Dev tools' },
      { slug: 'ecommerce', short: 'E-commerce' },
      { slug: 'b2b-sales', short: 'B2B sales' },
      { slug: 'startup-growth', short: 'Startups' },
    ],
  },
];

export const PERSONA_COLUMNS = PERSONA_GROUPS.map((g) => ({
  label: g.label,
  items: g.items
    .map(({ slug, short }) => {
      const u = useCases.find((c) => c.slug === slug);
      return u && { slug, short, title: u.title, icon: u.icon };
    })
    .filter((p): p is NonNullable<typeof p> => !!p),
}));

export const LEARN_LINKS: NavEntry[] = [
  { icon: Newspaper, title: 'Blog', description: 'Playbooks for finding customers on Reddit', target: { to: '/blog' } },
  { icon: Workflow, title: 'How it works', description: 'From your URL to scored leads in minutes', target: { section: 'how-it-works' } },
  { icon: BookOpen, title: 'Glossary', description: '45+ Reddit marketing terms, defined', target: { to: '/glossary' } },
  { icon: HelpCircle, title: 'FAQ', description: 'Pricing, safety, and how replies work', target: { section: 'faq' } },
];

export const COMPARE_LINK: NavEntry = {
  icon: Layers,
  title: 'Reddix alternatives',
  description: `How Reddix stacks up against ${competitors.length} Reddit tools`,
  target: { to: '/alternatives' },
};

export const NAV_COMPETITORS = competitors.slice(0, 5);
