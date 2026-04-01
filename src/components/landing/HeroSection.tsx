import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-[140px] pb-24 sm:pt-[180px] sm:pb-32 overflow-hidden">
      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] bg-[hsl(var(--primary)/0.15)] top-[-200px] left-[10%]" />
      <div
        className="orb w-[400px] h-[400px] bg-[hsl(350,80%,70%,0.1)] top-[60px] right-[5%]"
        style={{ animationDelay: '-4s' }}
      />

      <div className="relative max-w-[860px] mx-auto px-6 text-center">
        {/* Tag */}
        <div className="tag-pill border-border/60 bg-muted/50 text-muted-foreground mb-8 reveal">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))]" />
          Now with AI-powered reply generation
        </div>

        {/* Headline — serif + sans mix */}
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.03em] font-semibold reveal reveal-delay-1">
          Find people who{' '}
          <span className="font-display italic font-normal text-primary">already want</span>
          <br />
          what you built
        </h1>

        {/* Sub */}
        <p className="mt-6 text-[17px] sm:text-[19px] text-muted-foreground leading-relaxed max-w-[540px] mx-auto reveal reveal-delay-2">
          Reddix scans Reddit around the clock and surfaces warm leads — people actively asking for products like yours.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 reveal reveal-delay-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-12 px-7 rounded-xl text-[14px] font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
          >
            Start for free
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() =>
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="h-12 px-7 rounded-xl text-[14px] text-muted-foreground"
          >
            See how it works
          </Button>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex items-center justify-center gap-6 text-[13px] text-muted-foreground reveal reveal-delay-4">
          <span className="flex items-center gap-1.5">
            <span className="text-foreground font-semibold">500+</span> SaaS teams
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="text-foreground font-semibold">2,400+</span> leads found
          </span>
          <span className="w-px h-3 bg-border hidden sm:block" />
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="text-foreground font-semibold">4.9</span> avg rating
          </span>
        </div>
      </div>
    </section>
  );
}
