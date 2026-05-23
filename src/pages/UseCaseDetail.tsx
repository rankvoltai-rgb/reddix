import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getUseCaseBySlug, useCases } from '@/lib/useCases';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { UseCaseHero } from '@/components/use-cases/UseCaseHero';
import { UseCaseScenario } from '@/components/use-cases/UseCaseScenario';
import { UseCaseBenefits } from '@/components/use-cases/UseCaseBenefits';
import { UseCaseFeatures } from '@/components/use-cases/UseCaseFeatures';
import { UseCaseTestimonial } from '@/components/use-cases/UseCaseTestimonial';
import { UseCaseFAQ } from '@/components/use-cases/UseCaseFAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { ArrowRight } from 'lucide-react';

export default function UseCaseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const useCase = slug ? getUseCaseBySlug(slug) : undefined;

  usePageMeta({
    title: useCase?.metaTitle ?? 'Use Case | Reddix',
    description: useCase?.metaDescription ?? 'Reddit lead generation use case.',
    path: `/use-cases/${slug || ''}`,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!useCase) return <Navigate to="/404" replace />;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": useCase.metaTitle,
    "description": useCase.metaDescription,
    "url": `https://reddix.info/use-cases/${useCase.slug}`,
    "isPartOf": { "@type": "WebSite", "name": "Reddix", "url": "https://reddix.info" },
  };

  const faqJsonLd = useCase.faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": useCase.faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  } : null;


  const related = useCase.relatedSlugs
    .map((s) => useCases.find((uc) => uc.slug === s))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <Navbar />

      <UseCaseHero useCase={useCase} />
      <UseCaseScenario useCase={useCase} />
      <UseCaseBenefits useCase={useCase} />
      <UseCaseFeatures useCase={useCase} />
      <UseCaseTestimonial useCase={useCase} />
      <UseCaseFAQ useCase={useCase} />

      {related.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <h3 className="text-[20px] font-semibold text-center mb-8">Explore more use cases</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => {
                if (!r) return null;
                const RIcon = r.icon;
                return (
                  <button
                    key={r.slug}
                    onClick={() => navigate(`/use-cases/${r.slug}`)}
                    className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-background p-5 hover:border-primary/20 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.08)] transition-all duration-300 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/[0.1] transition-colors">
                      <RIcon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{r.title}</span>
                      <span className="block text-[12px] text-muted-foreground line-clamp-1">{r.tagline}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
      <Footer />
    </div>
  );
}
