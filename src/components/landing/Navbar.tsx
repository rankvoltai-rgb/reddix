import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield, ArrowRight, ArrowUpRight, BookOpen, Radar, Rocket, Users, User, Code, ShoppingCart, Briefcase, PenTool, TrendingUp } from 'lucide-react';
import { competitors } from '@/lib/alternatives';
import { DropdownPanel, type DropdownConfig, type DropdownItem } from './DropdownPanel';

interface NavItem {
  label: string;
  scrollId?: string;
  route?: string;
  dropdown?: DropdownConfig;
}

const featureItems: DropdownItem[] = [
  { label: 'Intent Detection', desc: 'AI spots genuine buying signals', icon: Zap, route: '/features/intent-detection' },
  { label: 'Lead Scoring', desc: 'Every lead scored 0–100', icon: Target, route: '/features/lead-scoring' },
  { label: 'AI Replies', desc: 'Context-aware reply drafts', icon: MessageSquare, route: '/features/ai-replies' },
  { label: 'Subreddit Discovery', desc: 'Find communities where your ICP lives', icon: Compass, route: '/features/subreddit-discovery' },
  { label: 'Analytics Dashboard', desc: 'Track leads and conversions', icon: BarChart3, route: '/features/analytics-dashboard' },
  { label: 'Scheduled Scans', desc: 'Set it and forget it — 24/7', icon: Clock, route: '/features/scheduled-scans' },
  { label: 'Deduplication', desc: 'Never see the same post twice', icon: Repeat, route: '/features/deduplication' },
  { label: 'Website Analysis', desc: 'Auto-extract keywords from your URL', icon: Globe, route: '/features/website-analysis' },
  { label: 'Natural Tone', desc: 'Replies that add value, not noise', icon: Shield, route: '/features/natural-tone' },
];

const resourceItems: DropdownItem[] = [
  ...competitors.map((c) => ({
    label: `vs ${c.name}`,
    desc: c.weakness,
    icon: ArrowUpRight,
    route: `/alternatives/${c.slug}`,
  })),
  { label: 'Glossary', desc: '45+ Reddit marketing terms defined', icon: BookOpen, route: '/glossary' },
];

const navItems: NavItem[] = [
  {
    label: 'Features',
    scrollId: 'features',
    dropdown: {
      items: featureItems,
      footer: { label: 'View all features', route: '/#features' },
    },
  },
  { label: 'How it works', scrollId: 'how-it-works' },
  { label: 'Pricing', scrollId: 'pricing' },
  {
    label: 'Resources',
    route: '/alternatives',
    dropdown: {
      items: resourceItems,
      footer: { label: 'View all alternatives', route: '/alternatives' },
    },
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavigate = (route?: string, scrollId?: string) => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);

    if (route) {
      if (route.startsWith('/#')) {
        if (location.pathname === '/') {
          document.getElementById(route.slice(2))?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            document.getElementById(route.slice(2))?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        navigate(route);
      }
    } else if (scrollId) {
      if (location.pathname === '/') {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
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
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 text-[15px] font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${scrolled ? 'bg-primary' : 'bg-white/15'}`}>
              <Radar className="w-3.5 h-3.5 text-white" />
            </div>
            Reddix
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown ? handleMouseEnter(item.label) : undefined}
                onMouseLeave={() => item.dropdown ? handleMouseLeave() : undefined}
              >
                <button
                  onClick={() => {
                    if (item.dropdown) {
                      setActiveDropdown(activeDropdown === item.label ? null : item.label);
                    } else {
                      handleNavigate(item.route, item.scrollId);
                    }
                  }}
                  className={`flex items-center gap-1 px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${
                    activeDropdown === item.label
                      ? scrolled
                        ? 'text-foreground bg-muted/60'
                        : 'text-white bg-white/10'
                      : scrolled
                        ? 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {item.dropdown && activeDropdown === item.label && (
                  <DropdownPanel
                    dropdown={item.dropdown}
                    onNavigate={handleNavigate}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
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

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-1.5 ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border px-6 py-4 space-y-1 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.dropdown) {
                    setMobileExpanded(mobileExpanded === item.label ? null : item.label);
                  } else {
                    handleNavigate(item.route, item.scrollId);
                  }
                }}
                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                )}
              </button>

              {item.dropdown && mobileExpanded === item.label && (
                <div className="pl-3 pb-2 space-y-0.5">
                  {item.dropdown.items.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleNavigate(sub.route, sub.scrollId)}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <sub.icon className="w-3.5 h-3.5 text-primary/50" />
                      {sub.label}
                    </button>
                  ))}
                  {item.dropdown.footer && (
                    <button
                      onClick={() => handleNavigate(item.dropdown!.footer!.route)}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-[12px] font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item.dropdown.footer.label}
                    </button>
                  )}
                </div>
              )}
            </div>
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
