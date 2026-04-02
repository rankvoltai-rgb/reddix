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

  const links = [
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[64px]">
          <span className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}>
            Reddix
          </span>

          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className={`text-[13px] h-9 px-4 rounded-lg transition-colors duration-300 ${
                scrolled ? 'text-muted-foreground' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Log in
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/auth')}
              className={`text-[13px] h-9 px-5 rounded-xl font-medium transition-all duration-300 ${
                scrolled
                  ? ''
                  : 'bg-white text-foreground hover:bg-white/90 shadow-lg shadow-black/10'
              }`}
            >
              Get started free
            </Button>
          </div>

          <button
            className={`lg:hidden p-1.5 ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border px-6 py-4 space-y-1">
          {links.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg"
            >
              {item.label}
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
