import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';
import { getFeatureBySlug, features } from '@/lib/features';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FeatureHero } from '@/components/features/FeatureHero';
import { FeatureDemoSection } from '@/components/features/FeatureDemoSection';
import { FeatureBenefits } from '@/components/features/FeatureBenefits';
import { FeatureUseCases } from '@/components/features/FeatureUseCases';
import { FeatureFAQ } from '@/components/features/FeatureFAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { ArrowRight } from 'lucide-react';

export default function FeatureDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const feature = slug ? getFeatureBySlug(slug) : undefined;

  useEffect(() => {
    if (feature) {
      document.title = feature.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', feature.metaDescription);
      else {
        const m = document.createElement('meta');
        m.name = 'description';
        m.content = feature.metaDescription;
        document.head.appendChild(m);
      }
    }
    window.scrollTo(0, 0);
  }, [feature]);

  if (!feature) return <Navigate to="/404" replace />;

  const related = feature.relatedSlugs
    .map((s) => features.find((f) => f.slug === s))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": feature.metaTitle,
    "description": feature.metaDescription,
    "url": `https://reddix.info/features/${feature.slug}`,
    "isPartOf": {
      "@type": "SoftwareApplication",
      "name": "Reddix",
      "url": "https://reddix.info"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://reddix.info" },
        { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://reddix.info/#features" },
        { "@type": "ListItem", "position": 3, "name": feature.title, "item": `https://reddix.info/features/${feature.slug}` }
      ]
    }
  };

  const faqJsonLd = feature.faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": feature.faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <Navbar />
      <FeatureHero feature={feature} />
      <FeatureDemoSection feature={feature} />
      <FeatureBenefits feature={feature} />
      <FeatureUseCases feature={feature} />
      <FeatureFAQ feature={feature} />

      {/* Related features */}
      {related.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <h3 className="text-[20px] font-semibold text-center mb-8">Explore related features</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((rf) => {
                if (!rf) return null;
                const RIcon = rf.icon;
                return (
                  <button
                    key={rf.slug}
                    onClick={() => navigate(`/features/${rf.slug}`)}
                    className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-background p-5 hover:border-primary/20 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.08)] transition-all duration-300 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/[0.1] transition-colors">
                      <RIcon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{rf.title}</span>
                      <span className="block text-[12px] text-muted-foreground line-clamp-1">{rf.tagline}</span>
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
