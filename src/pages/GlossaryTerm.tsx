import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCanonical } from '@/hooks/useCanonical';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AlternativeHero } from '@/components/alternatives/AlternativeHero';
import { getTermBySlug, getRelatedTerms } from '@/lib/glossary';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const categoryColors: Record<string, string> = {
  Reddit: 'bg-orange-100 text-orange-700 border-orange-200',
  'Lead Generation': 'bg-blue-100 text-blue-700 border-blue-200',
  'AI & SaaS': 'bg-purple-100 text-purple-700 border-purple-200',
  Reddix: 'bg-primary/10 text-primary border-primary/20',
};

export default function GlossaryTerm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const term = slug ? getTermBySlug(slug) : undefined;
  useCanonical(`/glossary/${slug || ''}`);

  useEffect(() => {
    if (term) {
      document.title = term.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', term.metaDescription);
    }
  }, [term]);

  if (!term) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Term not found</h1>
            <p className="text-muted-foreground mb-6">The glossary term you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/glossary')}>Back to Glossary</Button>
          </div>
        </div>
      </div>
    );
  }

  const related = getRelatedTerms(term);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AlternativeHero
        showBack
        pill={term.category}
        title={
          <span className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] text-white">
            What is{' '}
            <span className="italic font-serif">{term.title}</span>?
          </span>
        }
        subtitle={term.shortDef}
      />

      {/* Definition */}
      <section className="max-w-[760px] mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Definition</h2>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium border mt-1 ${categoryColors[term.category] || ''}`}>
              {term.category}
            </span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-[16px] text-muted-foreground leading-[1.8]">
            {term.longDef}
          </p>
        </div>
      </section>

      {/* Related terms */}
      {related.length > 0 && (
        <section className="max-w-[760px] mx-auto px-6 pb-16">
          <h3 className="text-lg font-bold text-foreground mb-6">Related Terms</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <button
                key={r.slug}
                onClick={() => navigate(`/glossary/${r.slug}`)}
                className="group flex items-start gap-3 p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </span>
                  <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">
                    {r.shortDef}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-[760px] mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 sm:p-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Stop reading about leads. Start finding them.
          </h3>
          <p className="text-muted-foreground text-[15px] mb-6 max-w-md mx-auto">
            Reddix uses AI to detect buying intent on Reddit and generate replies that convert — so you can focus on closing, not scrolling.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[50px] px-8 rounded-2xl text-[15px] font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Reddix Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
