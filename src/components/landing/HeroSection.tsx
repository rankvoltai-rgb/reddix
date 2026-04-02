import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Flame, Target, CheckCircle2, Radar } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100vh] flex flex-col overflow-hidden">
      {/* Full background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(0,65%,48%)] to-[hsl(15,70%,42%)]" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Large decorative circles */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.07]" />
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.05]" />
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.04]" />

      {/* Floating stat cards — left side */}
      <div className="absolute top-[18%] left-[3%] xl:left-[6%] hidden lg:block floating">
        <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-medium text-white/70">Lead Score</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-white leading-none">94</span>
            <span className="text-[11px] font-medium text-emerald-300">↑ Hot</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[28%] left-[2%] xl:left-[5%] hidden lg:block floating-delayed">
        <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="w-4 h-4 text-white/80" />
            <span className="text-[11px] font-medium text-white/70">Intent Match</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-white leading-none">100%</span>
          </div>
          <span className="text-[10px] text-emerald-300">vs last week</span>
        </div>
      </div>

      {/* Floating stat cards — right side */}
      <div className="absolute top-[15%] right-[3%] xl:right-[6%] hidden lg:block floating-delayed">
        <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span className="text-[11px] font-medium text-white/70">Leads Found</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-white leading-none">2,847</span>
            <span className="text-[11px] font-medium text-emerald-300">↑ 24%</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[30%] right-[2%] xl:right-[5%] hidden lg:block floating">
        <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Radar className="w-4 h-4 text-white/80" />
            <span className="text-[11px] font-medium text-white/70">Subreddits</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-white leading-none">183</span>
            <span className="text-[11px] font-medium text-emerald-300">active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-[120px] pb-20">
        {/* Top pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.12] backdrop-blur-sm border border-white/[0.15] text-[13px] text-white/90 font-medium mb-10 reveal">
          <div className="flex items-center gap-1">
            <span className="text-[13px]">🔥</span>
            <span className="font-semibold text-white">2,400+</span>
          </div>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5" />
            Leads Found on Autopilot
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center reveal reveal-delay-1">
          <span className="block text-[clamp(2.8rem,7vw,5.5rem)] font-bold text-white leading-[1.05] tracking-[-0.04em]">
            Find Warm Leads
          </span>
          <span className="block mt-2">
            <span
              className="inline-flex items-center text-[clamp(2.8rem,7vw,5.5rem)] font-normal text-white/90 leading-[1.05] tracking-[-0.03em] px-6 py-1 rounded-2xl border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              & Convert on Reddit
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-[17px] sm:text-[19px] text-white/60 leading-[1.6] max-w-[560px] text-center reveal reveal-delay-2">
          AI agents that scan Reddit 24/7, detect buying intent, and draft natural replies — driving warm leads to your SaaS on autopilot.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 reveal reveal-delay-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[54px] px-8 rounded-2xl text-[15px] font-semibold bg-white text-foreground hover:bg-white/90 shadow-2xl shadow-black/20 border-0 transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Finding Leads — It's Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-[54px] px-8 rounded-2xl text-[15px] font-medium bg-white/[0.08] text-white border-white/[0.2] hover:bg-white/[0.15] hover:text-white backdrop-blur-sm transition-all duration-300"
          >
            See How It Works
          </Button>
        </div>

        {/* Proof points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[13px] text-white/50 reveal reveal-delay-4">
          {[
            '12x Faster Than Manual',
            '500+ SaaS Teams',
            'Setup in 2 Minutes',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300/70" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom curve transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 80V40C240 10 480 0 720 0C960 0 1200 10 1440 40V80H0Z" fill="hsl(0, 0%, 100%)" />
        </svg>
      </div>
    </section>
  );
}
