import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AlternativeHero } from '@/components/alternatives/AlternativeHero';
import { ComparisonTable } from '@/components/alternatives/ComparisonTable';
import { getCompetitorBySlug, competitors } from '@/lib/alternatives';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import NotFound from './NotFound';

export default function AlternativeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const competitor = slug ? getCompetitorBySlug(slug) : undefined;
  usePageMeta({
    title: competitor?.metaTitle ?? 'Reddix Alternatives',
    description: competitor?.metaDescription ?? 'Compare Reddix with other Reddit lead generation tools.',
    path: `/alternatives/${slug || ''}`,
  });

  useEffect(() => {
    if (!competitor) return;
    const featureList = competitor.features.map((f) => f.name);
    const scripts: HTMLScriptElement[] = [];

    const competitorLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: competitor.name,
      description: competitor.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      featureList,
    };
    const reddixLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Reddix',
      description: `Reddix vs ${competitor.name}: ${competitor.heroSubtitle}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `https://reddix.info/alternatives/${competitor.slug}`,
      featureList,
      offers: {
        '@type': 'Offer',
        price: '45',
        priceCurrency: 'USD',
      },
    };

    [competitorLd, reddixLd].forEach((ld, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = `alternative-${i}`;
      script.text = JSON.stringify(ld);
      document.head.appendChild(script);
      scripts.push(script);
    });
    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [competitor]);

  if (!competitor) return <NotFound />;

  // Get 3 other competitors for "also compare" section
  const others = competitors.filter((c) => c.slug !== competitor.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <AlternativeHero
        showBack
        pill={`Reddix vs ${competitor.name}`}
        title={
          <>
            <span className="block text-[clamp(2.2rem,5.5vw,4rem)] font-bold text-white leading-[1.05] tracking-[-0.04em]">
              Reddix vs {competitor.name}
            </span>
            <span className="block mt-2">
              <span
                className="inline-flex items-center text-[clamp(1.6rem,4vw,2.8rem)] font-normal text-white/90 leading-[1.1] tracking-[-0.02em] px-5 py-1 rounded-2xl border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                {competitor.tagline}
              </span>
            </span>
          </>
        }
        subtitle={competitor.heroSubtitle}
      />

      {/* About Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[850px] mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-2xl sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.15] mb-5">
              What is{' '}
              <span className="text-muted-foreground">{competitor.name}</span>?
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[600px] mx-auto">
              {competitor.description}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="mb-20">
            <h2 className="text-center text-2xl sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.15] mb-10 reveal">
              Feature-by-feature{' '}
              <span
                className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                comparison
              </span>
            </h2>
            <ComparisonTable
              competitorName={competitor.name}
              features={competitor.features}
              verdict={competitor.verdict}
            />
          </div>

          {/* Why Reddix Wins */}
          <div className="reveal">
            <h2 className="text-center text-2xl sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.15] mb-10">
              Why SaaS founders{' '}
              <span
                className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                choose Reddix
              </span>
            </h2>
            <div className="space-y-4">
              {competitor.whyReddixWins.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 bento-card reveal"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[14px] text-foreground leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-radial-glow opacity-40" />

        <div className="relative max-w-[600px] mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.15] mb-4">
            Switch from {competitor.name}{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              in 2 minutes
            </span>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
            {competitor.status === 'shutdown'
              ? `${competitor.name} is gone. Reddix is here — with everything it had and more.`
              : `See why founders are switching from ${competitor.name} to Reddix for smarter Reddit lead generation.`}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[54px] px-8 rounded-2xl text-[15px] font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Reddix Free
          </Button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-[13px] text-muted-foreground">
            {['No credit card', '2-minute setup', 'Cancel anytime'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Also Compare Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[850px] mx-auto px-6">
          <h3 className="text-center text-xl font-semibold tracking-[-0.02em] mb-8 text-muted-foreground">
            Also compare Reddix with
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate(`/alternatives/${c.slug}`)}
                className="group bento-card text-left"
              >
                <h4 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5">
                  vs {c.name}
                </h4>
                <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3">{c.weakness}</p>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary">
                  Compare
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
