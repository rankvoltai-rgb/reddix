import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = website.trim();
    if (value) {
      try { sessionStorage.setItem('pendingWebsite', value); } catch {}
    }
    navigate('/auth');
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden selection:bg-white/30">
      {/* Ambient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #FF1A1A 0%, #E60000 100%)',
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient blur orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-black/25 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Stats Cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {/* Top Left */}
        <div className="absolute top-[20%] left-[6%] xl:left-[8%] -rotate-[6deg] hover:rotate-0 transition-transform duration-700 floating">
          <div className="p-5 rounded-3xl bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Lead Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] font-extrabold text-white leading-none tracking-tight">94</span>
              <span className="text-amber-300 font-semibold text-xs uppercase">Hot</span>
            </div>
          </div>
        </div>

        {/* Top Right */}
        <div className="absolute top-[15%] right-[6%] xl:right-[8%] rotate-[3deg] hover:rotate-0 transition-transform duration-700 floating-delayed">
          <div className="p-5 rounded-3xl bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Leads Found</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] font-extrabold text-white tracking-tight leading-none">2,847</span>
              <span className="text-emerald-300 font-semibold text-xs">+24%</span>
            </div>
          </div>
        </div>

        {/* Bottom Left — Reddit Snoo Card */}
        <div className="absolute bottom-[18%] left-[4%] xl:left-[5%] rotate-[2deg] hover:rotate-0 transition-transform duration-700 floating-delayed">
          <div className="p-5 rounded-3xl bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 1 0 0 12 12 12 12 1 0 0 12-12A12 12 1 0 0 12 0zm5.01 4.744c.688 1.026.352 2.394-.75 3.09a3.17 3.17 0 0 1-1.37.373c-.007 3.157-1.343 6.091-3.75 8.29A10.2 10.2 0 0 1 12 17.544a10.2 10.2 0 0 1-6.14-2.047c-2.407-2.2-3.743-5.133-3.75-8.29a3.17 3.17 0 0 1-1.37-.373c-1.102-.696-1.438-2.064-.75-3.09.67-.999 2.037-1.324 3.132-.726a10.8 10.8 0 0 1 8.476 1.09 10.8 10.8 0 0 1 8.476-1.09c1.095-.598 2.462-.273 3.132.726zM6.824 12.07a1.58 1.58 0 0 0-1.58 1.58 1.58 1.58 0 0 0 1.58 1.58 1.58 1.58 0 0 1 0-3.16zm10.352 0a1.58 1.58 0 0 1 0 3.16 1.58 1.58 0 0 0 0-3.16zM12 15.25a5.62 5.62 0 0 0-4.63 2.45c-.36.49.1 1.13.67.81a4.38 4.38 0 0 1 7.92 0c.57.32 1.03-.32.67-.81A5.62 5.62 0 1 0 12 15.25z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Reddit</div>
              <div className="text-[22px] font-extrabold text-white tracking-tight leading-none">Scanning</div>
            </div>
          </div>
        </div>

        {/* Bottom Right — Reddit Logo Card */}
        <div className="absolute bottom-[22%] right-[4%] xl:right-[5%] -rotate-[10deg] hover:rotate-0 transition-transform duration-700 floating">
          <div className="p-5 rounded-3xl bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF1A1A]/30 flex items-center justify-center shrink-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="10.5" r="1.2" fill="currentColor"/>
                <circle cx="15.5" cy="10.5" r="1.2" fill="currentColor"/>
                <path d="M16.5 13.5c-.5 1.5-2 2.5-4.5 2.5s-4-1-4.5-2.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="12" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="10" cy="5.5" r="1" fill="currentColor"/>
                <circle cx="14" cy="5.5" r="1" fill="currentColor"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Subreddits</div>
              <div className="text-[22px] font-extrabold text-white tracking-tight leading-none">183</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 pt-28 pb-24 flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="mb-10 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md flex items-center gap-3 shadow-xl reveal">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 uppercase tracking-[0.18em]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_hsl(38,95%,60%)]" />
            100K+ Leads Found
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-white font-bold tracking-[-0.04em] leading-[0.92] flex flex-col items-center gap-4 sm:gap-5 mb-8 reveal reveal-delay-1">
          <span className="text-[clamp(2.8rem,7vw,5.75rem)]">Find Warm Leads</span>
          <span className="relative inline-block py-2 px-7 sm:px-9">
            <span className="absolute inset-0 bg-white/[0.06] border border-white/20 backdrop-blur-xl rounded-2xl -rotate-1 shadow-2xl" />
            <span
              className="relative italic font-normal text-white drop-shadow-sm text-[clamp(2.5rem,6.4vw,5.25rem)] leading-[1.05]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              &amp; Convert on Reddit
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-[17px] sm:text-[19px] text-white/70 leading-[1.6] font-medium mb-12 reveal reveal-delay-2">
          AI agents that scan Reddit 24/7, detect buying intent, and draft natural replies — driving warm leads to your SaaS on autopilot.
        </p>

        {/* CTA Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl reveal reveal-delay-3">
          <div className="group relative">
            <div className="absolute -inset-[2px] rounded-[20px] bg-gradient-to-r from-white/30 via-white/10 to-white/30 opacity-50 blur-md group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative p-2 rounded-2xl bg-white/[0.1] border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-2 focus-within:border-white/35 transition-colors">
              <div className="pl-3.5 text-white/50">
                <Globe className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px] sm:text-[16px] font-medium text-white placeholder:text-white/40 placeholder:font-normal py-3 px-2 tracking-[-0.01em]"
              />
              <Button
                type="submit"
                className="h-[46px] px-5 sm:px-7 rounded-xl text-[14px] font-bold bg-white text-[hsl(var(--primary))] hover:bg-white/95 shadow-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 gap-2 group/btn"
              >
                <span className="hidden sm:inline">Find leads</span>
                <span className="sm:hidden">Find</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" strokeWidth={2.5} />
              </Button>
            </div>
          </div>

          {/* Micro-copy */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/55">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-300" /> Free to start
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-300" /> No credit card
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-300" /> 2-min setup
            </span>
          </div>
        </form>

        {/* Trust signals footer */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10 w-full max-w-3xl flex flex-wrap justify-center gap-x-10 gap-y-4 reveal reveal-delay-4">
          {['12x Faster Than Manual', '500+ SaaS Teams', 'Setup in 2 Minutes'].map((label) => (
            <span key={label} className="flex items-center gap-2 text-white/55 text-[13px] font-semibold tracking-tight">
              <CheckCircle2 className="w-4 h-4 opacity-60" strokeWidth={2.4} />
              {label}
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
