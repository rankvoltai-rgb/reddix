import { useMemo, useState, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ArrowRight, BookOpen, Layers, Search, Workflow, X, type LucideIcon } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { HeroRadar } from '@/components/landing/hero-radar';
import { Reveal, SubredditIcon } from '@/components/landing/shared';
import { Accent, Band, CELL, CellGrid, LINE, Pill, Spacer } from '@/components/landing/frame';
import { FeaturedPost, PostCard } from '@/components/blog/PostCards';
import { BlogCta } from '@/components/blog/ArticleChrome';
import { listPosts, SITE_URL, topicCounts } from '@/lib/blog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';

const TITLE = 'Reddit Marketing & Lead Generation Guides | Reddix Blog';
const DESCRIPTION =
  'Practical, sourced playbooks for finding customers on Reddit: where buyers ask for tools, how to reply without getting banned, and how to turn threads into pipeline.';

/* Staggers the CSS entrance (animate-hero-rise in tailwind.config.ts). */
const rise = (delay: number) => ({ '--rise-delay': `${delay}s` }) as CSSProperties;

/* ---------- hero ---------- */

const SUBS = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', 'r/sales'];

function Hero() {
  return (
    <section aria-labelledby="blog-title" className="relative bg-white pt-16">
      <div className={cn('relative mx-auto max-w-6xl overflow-hidden border-x', LINE)}>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.36] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]">
          <HeroRadar />
        </div>
        <div className="relative flex flex-col items-center px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={BookOpen}>The Reddix blog</Pill>
          </div>
          <h1
            id="blog-title"
            className="mt-6 text-balance text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.8rem]"
            style={rise(0.08)}
          >
            Turn Reddit into <Accent>a customer channel</Accent>
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
            style={rise(0.16)}
          >
            Practical, sourced playbooks for finding buyers on Reddit and replying without getting banned. Built to be used this
            week, not bookmarked.
          </p>
          <ul aria-label="Communities we cover" className="mt-8 flex flex-wrap items-center justify-center gap-2 motion-safe:animate-hero-rise" style={rise(0.24)}>
            {SUBS.map((s) => (
              <li
                key={s}
                className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              >
                <SubredditIcon name={s} className="h-5 w-5 text-[0.55rem]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- library controls ---------- */

function TopicFilter({ topics, total, active }: { topics: { topic: string; count: number }[]; total: number; active: string | null }) {
  const chip = (on: boolean) =>
    cn(
      'inline-flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-[0.82rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40',
      on ? 'border-cta/25 bg-cta-soft text-cta' : 'border-ink/[0.08] bg-white text-ink/75 hover:border-ink/[0.16] hover:text-ink',
    );
  const count = (on: boolean) => cn('text-xs tabular-nums', on ? 'text-cta/70' : 'text-muted-foreground');
  return (
    <nav aria-label="Topics" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
      <ul className="flex gap-2">
        <li>
          <Link to="/blog" preventScrollReset aria-current={!active ? 'page' : undefined} className={chip(!active)}>
            All <span className={count(!active)}>{total}</span>
          </Link>
        </li>
        {topics.map(({ topic, count: n }) => {
          const on = active === topic;
          return (
            <li key={topic}>
              <Link to={`/blog?topic=${encodeURIComponent(topic)}`} preventScrollReset aria-current={on ? 'page' : undefined} className={chip(on)}>
                {topic} <span className={count(on)}>{n}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative block w-full md:w-72">
      <span className="sr-only">Search articles</span>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles"
        className="h-10 w-full rounded-lg border border-ink/[0.1] bg-white pl-10 pr-9 text-sm text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/[0.04] hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );
}

/* ---------- more to read ---------- */

const RESOURCES: { to: string; icon: LucideIcon; title: string; body: string; cta: string }[] = [
  { to: '/glossary', icon: BookOpen, title: 'Reddit marketing glossary', body: '45+ Reddit and lead-gen terms, defined in plain English.', cta: 'Browse the glossary' },
  { to: '/alternatives', icon: Layers, title: 'Reddit tool comparisons', body: 'Side-by-side feature tables for every major Reddit lead tool.', cta: 'Compare tools' },
  { to: '/#how-it-works', icon: Workflow, title: 'How Reddix works', body: 'From your URL to scored leads and reply drafts in minutes.', cta: 'See how it works' },
];

function ResourcesBand() {
  return (
    <section aria-labelledby="resources-title">
      <Spacer />
      <Band inner="flex flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-12">
        <div>
          <Pill icon={Layers}>Resources</Pill>
          <h2 id="resources-title" className="mt-4 text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
            Put the playbooks <Accent>to work</Accent>
          </h2>
          <p className="mt-2 max-w-xl text-[0.95rem] text-muted-foreground">Reference pages for the steps these guides walk through.</p>
        </div>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {RESOURCES.map(({ to, icon: Icon, title, body, cta }, i) => (
            <li key={to} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link to={to} className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-surface/35 sm:p-8">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/75 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:border-cta group-hover:bg-cta group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-5 text-[1.02rem] font-semibold tracking-tight text-ink">{title}</p>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cta">
                    {cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- page ---------- */

export default function Blog() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: '/blog' });
  const posts = useMemo(() => listPosts(), []);
  const [params] = useSearchParams();
  const topic = params.get('topic');
  const [query, setQuery] = useState('');

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const topics = useMemo(() => topicCounts(posts), [posts]);
  const q = query.trim().toLowerCase();
  const filtering = !!topic || !!q;
  const results = posts.filter(
    (p) => (!topic || p.tags.includes(topic)) && (!q || `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase().includes(q)),
  );
  // Unfiltered, the lead story sits above; the grid holds everything else.
  const grid = filtering ? results : results.filter((p) => p !== featured);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'Reddix Blog',
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Organization', name: 'Reddix', url: SITE_URL },
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated,
      description: p.excerpt,
    })),
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-jakarta">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar framed />
        <main>
          <Hero />

          {featured && !filtering && (
            <section aria-label="Featured article">
              <Band>
                <Reveal y={20}>
                  <FeaturedPost post={featured} />
                </Reveal>
              </Band>
            </section>
          )}

          <section id="articles" aria-labelledby="articles-title" className="scroll-mt-16">
            <Spacer />
            <Band inner="flex flex-col gap-5 px-6 py-8 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-12">
              <div>
                <h2 id="articles-title" className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
                  {topic ?? (filtering ? 'Search results' : 'Latest articles')}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground" aria-live="polite">
                  {filtering
                    ? `${results.length} ${results.length === 1 ? 'article' : 'articles'}${q ? ` matching “${query.trim()}”` : ''}`
                    : 'Playbooks, research, and how-tos from the Reddix team.'}
                </p>
              </div>
              <SearchField value={query} onChange={setQuery} />
            </Band>
            {topics.length > 1 && (
              <Band inner="px-6 py-3.5 sm:px-10 lg:px-12">
                <TopicFilter topics={topics} total={posts.length} active={topic} />
              </Band>
            )}
            <Band>
              {grid.length > 0 ? (
                <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
                  {grid.map((p, i) => (
                    <li key={p.slug} className={CELL}>
                      <Reveal delay={(i % 3) * 0.05} className="h-full">
                        <PostCard post={p} />
                      </Reveal>
                    </li>
                  ))}
                </CellGrid>
              ) : (
                <div className="px-6 py-16 text-center">
                  <p className="text-lg font-medium text-ink">
                    {posts.length === 0 ? 'New articles are on the way' : filtering ? 'No articles match that yet' : 'More articles are on the way'}
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {filtering ? 'Try a different word, or browse every topic.' : 'We publish new playbooks regularly. Check back soon.'}
                  </p>
                  {filtering && (
                    <Link
                      to="/blog"
                      preventScrollReset
                      onClick={() => setQuery('')}
                      className="mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
                    >
                      Clear filters
                    </Link>
                  )}
                </div>
              )}
            </Band>
          </section>

          <ResourcesBand />
          <BlogCta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
