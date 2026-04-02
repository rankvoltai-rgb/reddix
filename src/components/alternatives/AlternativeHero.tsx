import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Radar, ArrowLeft } from 'lucide-react';

interface AlternativeHeroProps {
  title: React.ReactNode;
  subtitle: string;
  pill?: string;
  showBack?: boolean;
}

export function AlternativeHero({ title, subtitle, pill, showBack }: AlternativeHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(0,65%,48%)] to-[hsl(15,70%,42%)]" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Circles */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.06]" />
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.04]" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-[120px] pb-20">
        {showBack && (
          <button
            onClick={() => navigate('/alternatives')}
            className="flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white mb-8 transition-colors reveal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All alternatives
          </button>
        )}

        {pill && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.12] backdrop-blur-sm border border-white/[0.15] text-[13px] text-white/90 font-medium mb-10 reveal">
            <Radar className="w-3.5 h-3.5" />
            {pill}
          </div>
        )}

        <h1 className="text-center reveal reveal-delay-1 max-w-[800px]">
          {title}
        </h1>

        <p className="mt-8 text-[17px] sm:text-[19px] text-white/60 leading-[1.6] max-w-[600px] text-center reveal reveal-delay-2">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 reveal reveal-delay-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[54px] px-8 rounded-2xl text-[15px] font-semibold bg-white text-foreground hover:bg-white/90 shadow-2xl shadow-black/20 border-0 transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Reddix Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            className="h-[54px] px-8 rounded-2xl text-[15px] font-medium bg-white/[0.08] text-white border-white/[0.2] hover:bg-white/[0.15] hover:text-white backdrop-blur-sm transition-all duration-300"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 80V40C240 10 480 0 720 0C960 0 1200 10 1440 40V80H0Z" fill="hsl(0, 0%, 100%)" />
        </svg>
      </div>
    </section>
  );
}
