import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[60px]">
          <span className="text-[15px] font-semibold text-foreground tracking-tight">
            Reddix
          </span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', id: 'features' },
              { label: 'How it works', id: 'how-it-works' },
              { label: 'Pricing', id: 'pricing' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="text-[13px] text-muted-foreground h-8 px-3"
            >
              Log in
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/auth')}
              className="text-[13px] h-8 px-4 rounded-lg"
            >
              Get started
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border px-6 py-4 space-y-1">
          {['Features', 'How it works', 'Pricing'].map((label) => (
            <button
              key={label}
              onClick={() => scrollTo(label.toLowerCase().replace(/ /g, '-'))}
              className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="flex-1 text-[13px]">
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="flex-1 text-[13px]">
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
