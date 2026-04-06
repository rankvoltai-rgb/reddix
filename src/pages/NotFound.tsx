import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="orb w-[500px] h-[500px] bg-primary/10 top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-primary/8 bottom-[-200px] left-[-100px]" style={{ animationDelay: '-4s' }} />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        {/* Large 404 */}
        <div className="relative mb-6">
          <span className="text-[140px] sm:text-[180px] font-bold leading-none tracking-[-0.06em] text-muted/60 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Search className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. But your next Reddit lead does — let's find it.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-12 px-8 rounded-xl text-sm font-semibold gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Start Finding Leads
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            className="h-12 px-8 rounded-xl text-sm font-medium gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {[
            { label: 'Features', href: '/#features' },
            { label: 'Pricing', href: '/#pricing' },
            { label: 'Alternatives', href: '/alternatives' },
            { label: 'Glossary', href: '/glossary' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
