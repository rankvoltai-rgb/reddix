import { useState, useMemo } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AlternativeHero } from '@/components/alternatives/AlternativeHero';
import { GlossaryCard } from '@/components/glossary/GlossaryCard';
import { glossaryTerms, glossaryCategories } from '@/lib/glossary';
import { Search } from 'lucide-react';

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  usePageMeta({
    title: 'Reddit Marketing Glossary — 45+ Terms Defined | Reddix',
    description: 'The most comprehensive Reddit marketing glossary. 45+ terms covering Reddit, lead generation, AI, and SaaS marketing — all defined and explained.',
    path: '/glossary',
  });

  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Reddit Marketing Glossary",
    "description": "Definitions for Reddit, lead generation, AI, and SaaS marketing terms.",
    "url": "https://reddix.info/glossary",
    "hasDefinedTerm": glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      "name": t.title,
      "description": t.shortDef,
      "url": `https://reddix.info/glossary/${t.slug}`,
    })),
  };


  const filtered = useMemo(() => {
    return glossaryTerms.filter((t) => {
      const matchCat = category === 'All' || t.category === category;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.shortDef.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }} />
      <Navbar />


      <AlternativeHero
        pill="45+ terms defined"
        title={
          <span className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] text-white">
            Reddit Marketing{' '}
            <span className="italic">Glossary</span>
          </span>
        }
        subtitle="Every term you need to know about Reddit lead generation, AI-powered marketing, and social selling — explained simply."
      />

      {/* Filters */}
      <section className="max-w-[1100px] mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-card border border-border/40 rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {glossaryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    category === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            Showing {filtered.length} of {glossaryTerms.length} terms
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1100px] mx-auto px-6 py-16">
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((term) => (
              <GlossaryCard key={term.slug} term={term} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No terms found matching "{search}"</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-primary text-sm hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
