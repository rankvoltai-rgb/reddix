import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AlternativeHero } from '@/components/alternatives/AlternativeHero';
import { CompetitorCard } from '@/components/alternatives/CompetitorCard';
import { competitors } from '@/lib/alternatives';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Zap, Clock, CheckCircle2 } from 'lucide-react';

const whyReddix = [
  {
    icon: Zap,
    title: 'AI Intent Scoring',
    desc: 'Every lead scored 0–100 for buying intent. Stop guessing, start closing.',
  },
  {
    icon: Clock,
    title: '24/7 Autonomous Scanning',
    desc: 'Reddix monitors Reddit around the clock. Wake up to warm leads every morning.',
  },
  {
    icon: Shield,
    title: 'Ban-Safe Approach',
    desc: 'We draft replies, you post them. Human-in-the-loop keeps your account safe.',
  },
  {
    icon: Sparkles,
    title: 'Smart Reply Drafts',
    desc: 'Context-aware AI writes replies that sound human and convert naturally.',
  },
];

export default function Alternatives() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Best Reddit Lead Generation Tools — Reddix Alternatives Compared';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Compare the best Reddit lead generation tools. See how Reddix stacks up against GummySearch, RedReach, Redditor AI, and more. AI-powered scoring, 24/7 scanning, and smart replies.');
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <AlternativeHero
        pill="Compare Reddit Lead Gen Tools"
        title={
          <>
            <span className="block text-[clamp(2.4rem,6vw,4.5rem)] font-bold text-white leading-[1.05] tracking-[-0.04em]">
              The Best Reddix
            </span>
            <span className="block mt-2">
              <span
                className="inline-flex items-center text-[clamp(2.4rem,6vw,4.5rem)] font-normal text-white/90 leading-[1.05] tracking-[-0.03em] px-6 py-1 rounded-2xl border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                Alternatives & Competitors
              </span>
            </span>
          </>
        }
        subtitle="Honest comparisons between Reddix and every Reddit lead generation tool on the market. See why 500+ SaaS founders choose Reddix."
      />

      {/* Competitors Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
              <Zap className="w-3.5 h-3.5" />
              Head-to-head comparisons
            </div>
            <h2 className="text-3xl sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.1]">
              How Reddix compares to{' '}
              <span
                className="font-normal text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                every alternative
              </span>
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
              Click any card to see a detailed feature-by-feature breakdown.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitors.map((c, i) => (
              <CompetitorCard key={c.slug} competitor={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Reddix Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-radial-glow-bottom opacity-50" />

        <div className="relative max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.1]">
              Why founders choose{' '}
              <span
                className="font-normal text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                Reddix
              </span>
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
              The only Reddit lead gen tool built from the ground up for SaaS founders who want revenue, not reports.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {whyReddix.map((item, i) => (
              <div key={i} className="bento-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl bg-primary/[0.08] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.1] mb-5">
            Ready to ditch the{' '}
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              old way?
            </span>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            Join 500+ SaaS founders using Reddix to find warm leads on Reddit — automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="h-[54px] px-8 rounded-2xl text-[15px] font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Finding Leads — Free
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[13px] text-muted-foreground">
            {['No credit card required', 'Setup in 2 minutes', 'Cancel anytime'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
