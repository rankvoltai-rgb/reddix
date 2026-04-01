import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm text-sm text-muted-foreground mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          Now scanning 180+ subreddits
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in">
          Your AI co-pilot for{' '}
          <span className="gradient-text">Reddit lead generation</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Stop cold outreach. Reddix finds people already asking for what you
          built—and writes replies that convert.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="rounded-full px-8 h-12 text-base"
          >
            Start free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base"
            onClick={() =>
              document
                .getElementById('how-it-works')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            See how it works
          </Button>
        </div>

        {/* Trust strip */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <div className="flex -space-x-2">
            {['SJ', 'MK', 'AL', 'RD', 'TP'].map((initials, i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-background">
                <AvatarFallback className="text-[10px] font-medium bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]"
                />
              ))}
            </div>
            <span>Trusted by 500+ SaaS founders</span>
          </div>
        </div>
      </div>
    </section>
  );
}
