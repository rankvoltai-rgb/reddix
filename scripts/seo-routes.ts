// Shared route registry used by both sitemap and prerender scripts.
// Imports data modules directly so there is one source of truth.

import { features } from "../src/lib/features";
import { glossaryTerms } from "../src/lib/glossary";
import { competitors } from "../src/lib/alternatives";
import { useCases } from "../src/lib/useCases";
import { readLivePosts } from "./blog-files";

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  /** YYYY-MM-DD; the build date when absent. */
  lastmod?: string;
}

export const BASE_URL = "https://reddix.info";

/** App and account pages: prerendered with their own title and noindex, so a
 *  crawler never sees the homepage's title and canonical on them. Not in the
 *  sitemap. */
export const PRIVATE_ROUTES: { path: string; title: string }[] = [
  { path: "/auth", title: "Sign in or create an account | Reddix" },
  { path: "/onboarding", title: "Get started | Reddix" },
  { path: "/setup", title: "Get started | Reddix" },
  { path: "/subscribe", title: "Get started | Reddix" },
  { path: "/dashboard", title: "Dashboard | Reddix" },
  { path: "/scanner", title: "Scanner | Reddix" },
  { path: "/leads", title: "Leads | Reddix" },
  { path: "/settings", title: "Settings | Reddix" },
];

const HOME_TITLE = "Reddix | AI Reddit Lead Generation Tool";
const HOME_DESC =
  "Reddix scans Reddit on demand, scores buying intent with AI (0–100), and drafts natural replies — turning Reddit threads into qualified leads for your SaaS.";

export function getRoutes(): SeoRoute[] {
  const routes: SeoRoute[] = [];

  // Static public pages
  routes.push({
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESC,
    h1: "Reddix — AI Reddit Lead Generation",
    lead: HOME_DESC,
    changefreq: "weekly",
    priority: "1.0",
  });
  routes.push({
    path: "/alternatives",
    title: "Reddix Alternatives — Compare Reddit Lead Tools | Reddix",
    description:
      "Compare Reddix to every major Reddit lead-generation tool. See feature breakdowns, pricing, and why teams switch from GummySearch, RedReach, and more.",
    h1: "Reddix Alternatives & Competitor Comparisons",
    lead: "Side-by-side comparisons against every major Reddit lead-gen tool.",
    changefreq: "monthly",
    priority: "0.7",
  });
  routes.push({
    path: "/glossary",
    title: "Reddit & Lead-Gen Glossary | Reddix",
    description:
      "Plain-English definitions for every Reddit, lead-generation, and SaaS marketing term that matters when growing on Reddit.",
    h1: "Reddit & Lead-Gen Glossary",
    lead: "Plain-English definitions for Reddit, lead-gen, and SaaS marketing.",
    changefreq: "monthly",
    priority: "0.7",
  });
  routes.push({
    path: "/terms",
    title: "Terms of Service | Reddix",
    description: "Reddix terms of service — the rules for using Reddix.info.",
    h1: "Terms of Service",
    lead: "The rules for using Reddix.info.",
    changefreq: "yearly",
    priority: "0.3",
  });
  routes.push({
    path: "/refund-policy",
    title: "Refund Policy | Reddix",
    description: "Reddix refund policy — all sales are final.",
    h1: "Refund Policy",
    lead: "All sales are final. Read the full policy.",
    changefreq: "yearly",
    priority: "0.3",
  });

  // Dynamic: features
  for (const f of features) {
    routes.push({
      path: `/features/${f.slug}`,
      title: f.metaTitle,
      description: f.metaDescription,
      h1: f.title,
      lead: f.heroSubtitle,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  // Dynamic: use cases
  for (const u of useCases) {
    routes.push({
      path: `/use-cases/${u.slug}`,
      title: u.metaTitle,
      description: u.metaDescription,
      h1: u.title,
      lead: u.heroSubtitle,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  // Dynamic: alternatives
  for (const c of competitors) {
    routes.push({
      path: `/alternatives/${c.slug}`,
      title: c.metaTitle,
      description: c.metaDescription,
      h1: `Reddix vs ${c.name}`,
      lead: c.heroSubtitle,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // Dynamic: glossary terms
  for (const g of glossaryTerms) {
    routes.push({
      path: `/glossary/${g.slug}`,
      title: g.metaTitle,
      description: g.metaDescription,
      h1: g.title,
      lead: g.shortDef,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // Dynamic: blog (posts whose date has come; scheduled ones wait)
  const posts = readLivePosts();
  routes.push({
    path: "/blog",
    title: "Reddit Marketing & Lead Generation Guides | Reddix Blog",
    description:
      "Practical, sourced playbooks for finding customers on Reddit: where buyers ask for tools, how to reply without getting banned, and how to turn threads into pipeline.",
    h1: "Turn Reddit into a customer channel",
    lead: "Practical, sourced playbooks for finding buyers on Reddit and replying without getting banned.",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: posts.reduce((d, p) => (p.updated > d ? p.updated : d), "2026-01-01"),
  });
  for (const p of posts) {
    routes.push({
      path: `/blog/${p.slug}`,
      title: `${p.title} | Reddix`,
      description: p.excerpt,
      h1: p.title,
      lead: p.excerpt,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: p.updated,
    });
  }

  return routes;
}
