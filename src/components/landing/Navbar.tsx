import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield, ArrowRight, ArrowUpRight, Radar } from 'lucide-react';
import { competitors } from '@/lib/alternatives';

interface DropdownItem {
  label: string;
  desc: string;
  icon: React.ElementType;
  route?: string;
  scrollId?: string;
}

interface NavItem {
  label: string;
  scrollId?: string;
  route?: string;
  dropdown?: {
    items: DropdownItem[];
    footer?: { label: string; route: string };
  };
}

const featureItems: DropdownItem[] = [
  { label: 'Intent Detection', desc: 'AI spots genuine buying signals', icon: Zap, scrollId: 'features' },
  { label: 'Lead Scoring', desc: 'Every lead scored 0–100', icon: Target, scrollId: 'features' },
  { label: 'AI Replies', desc: 'Context-aware reply drafts', icon: MessageSquare, scrollId: 'features' },
  { label: 'Subreddit Discovery', desc: 'Find communities where your ICP lives', icon: Compass, scrollId: 'features' },
  { label: 'Analytics Dashboard', desc: 'Track leads and conversions', icon: BarChart3, scrollId: 'features' },
  { label: 'Scheduled Scans', desc: 'Set it and forget it — 24/7', icon: Clock, scrollId: 'features' },
  { label: 'Deduplication', desc: 'Never see the same post twice', icon: Repeat, scrollId: 'features' },
  { label: 'Website Analysis', desc: 'Auto-extract keywords from your URL', icon: Globe, scrollId: 'features' },
  { label: 'Natural Tone', desc: 'Replies that add value, not noise', icon: Shield, scrollId: 'features' },
];

const altItems: DropdownItem[] = competitors.map((c) => ({
  label: `vs ${c.name}`,
  desc: c.weakness,
  icon: ArrowUpRight,
  route: `/alternatives/${c.slug}`,
}));

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
  { label: 'Testimonials', scrollId: 'testimonials' },
  { label: 'Pricing', scrollId: 'pricing' },
  {
    label: 'Alternatives',
    route: '/alternatives',
    dropdown: {
      items: altItems,
      footer: { label: 'View all alternatives', route: '/alternatives' },
    },
  },
  { label: 'Glossary', route: '/glossary' },
];

function DropdownPanel({
  dropdown,
  scrolled,
  onNavigate,
}: {
  dropdown: NonNullable<NavItem['dropdown']>;
  scrolled: boolean;
  onNavigate: (route?: string, scrollId?: string) => void;
}) {
  const isLarge = dropdown.items.length > 4;

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50`}
      style={{ minWidth: isLarge ? '580px' : '320px' }}
    >
      <div className="bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.12)] overflow-hidden">
        {/* Items grid */}
        <div className={`p-3 ${isLarge ? 'grid grid-cols-2 gap-0.5' : 'space-y-0.5'}`}>
          {dropdown.items.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route, item.scrollId)}
              className="group flex items-start gap-3 w-full text-left px-3.5 py-3 rounded-xl hover:bg-muted/60 transition-all duration-200"
            >
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/[0.06] border border-primary/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/[0.1] group-hover:border-primary/[0.15] transition-colors">
                <item.icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {item.label}
                </span>
                <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        {dropdown.footer && (
          <div className="border-t border-border/30 px-3 py-2.5">
            <button
              onClick={() => onNavigate(dropdown.footer!.route)}
              className="group flex items-center justify-between w-full px-3.5 py-2 rounded-xl hover:bg-muted/40 transition-colors"
            >
              <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {dropdown.footer!.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavigate = (route?: string, scrollId?: string) => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);

    if (route) {
      // Handle hash routes like '/#features'
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
          <button
            onClick={() => navigate('/')}
            className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}
          >
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

                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.label && (
                  <DropdownPanel
                    dropdown={item.dropdown}
                    scrolled={scrolled}
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
        <div className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border px-6 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
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

              {/* Mobile sub-items */}
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
