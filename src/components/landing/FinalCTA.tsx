import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Radar, CheckCircle2 } from 'lucide-react';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 sm:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-[hsl(0,10%,8%)] to-foreground" />
      
      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] bg-primary/20 top-[-300px] right-[-200px]" style={{ filter: 'blur(160px)' }} />
      <div className="orb w-[600px] h-[600px] bg-[hsl(350,70%,50%,0.12)] bottom-[-300px] left-[-200px]" style={{ filter: 'blur(160px)', animationDelay: '-6s' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-[700px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-[12px] font-medium text-white/60 mb-8 reveal">
          <Radar className="w-3.5 h-3.5" />
          Your competitors are already on Reddit
        </div>

        <h2 className="text-[34px] sm:text-[52px] font-bold text-white tracking-[-0.04em] leading-[1.08] reveal reveal-delay-1">
          Your next 100 customers are{' '}
          <span
            className="inline-flex items-center font-normal text-white/70 px-5 py-1 rounded-2xl border border-white/[0.15] bg-white/[0.06]"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            posting on Reddit right now
          </span>
        </h2>
        
        <p className="mt-7 text-[17px] text-white/40 leading-relaxed max-w-lg mx-auto reveal reveal-delay-2">
          They're asking for recommendations. Comparing tools. Describing the exact problem you solve. Show up before your competitor does.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 reveal reveal-delay-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[56px] px-10 rounded-2xl text-[16px] font-bold bg-white text-foreground hover:bg-white/90 shadow-2xl shadow-black/30 border-0 transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Finding Leads — Free
          </Button>
        </div>

        {/* Proof points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[13px] text-white/30 reveal reveal-delay-4">
          {[
            'No credit card required',
            '2 minute setup',
            'Cancel anytime',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
