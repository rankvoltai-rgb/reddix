import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-[140px] pb-12 sm:pt-[170px] sm:pb-16 overflow-hidden">
      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] bg-[hsl(var(--primary)/0.12)] top-[-300px] left-[5%]" />
      <div className="orb w-[500px] h-[500px] bg-[hsl(340,70%,65%,0.08)] top-[0px] right-[-5%]" style={{ animationDelay: '-4s' }} />
      <div className="orb w-[300px] h-[300px] bg-[hsl(30,80%,60%,0.06)] bottom-[0] left-[40%]" style={{ animationDelay: '-8s' }} />

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.04] text-[13px] text-primary font-medium mb-8 reveal">
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered Reddit lead generation
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.06] tracking-[-0.035em] font-semibold reveal reveal-delay-1">
          Stop chasing leads.
          <br />
          <span
            className="font-normal text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Let them find you
          </span>{' '}
          on Reddit.
        </h1>

        {/* Sub */}
        <p className="mt-7 text-[17px] sm:text-[19px] text-muted-foreground leading-[1.6] max-w-[580px] mx-auto reveal reveal-delay-2">
          Reddix monitors Reddit 24/7, detects buying intent, and drafts natural replies — so you can turn conversations into customers without lifting a finger.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 reveal reveal-delay-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[52px] px-8 rounded-xl text-[15px] font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
          >
            Start for free
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-[52px] px-8 rounded-xl text-[15px] text-muted-foreground border-border/60"
          >
            See how it works
          </Button>
        </div>

        {/* Micro proof */}
        <p className="mt-6 text-[12px] text-muted-foreground/60 reveal reveal-delay-4">
          No credit card required · Setup in 2 minutes · Cancel anytime
        </p>
      </div>
    </section>
  );
}
