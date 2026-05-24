import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Radar } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/20 bg-muted/10 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-radial-glow opacity-30" />
      
      <div className="relative max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Radar className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[16px] font-bold text-foreground tracking-tight">Reddix</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[240px]">
              AI-powered Reddit lead generation. Find buyers, not browsers.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
            <div className="mt-4">
              <div
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id="56278e9abfbbba0bdcd568bc"
                data-businessunit-id="6953ba7474cf034e3abcff6b"
                data-style-height="52px"
                data-style-width="100%"
                data-token="d04813d0-c51e-40a9-b1ff-79cc082f8602"
              >
                <a
                  href="https://www.trustpilot.com/review/reddix.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trustpilot
                </a>
              </div>
            </div>
            <div className="mt-4">
              <a href="https://smollaunch.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://smollaunch.com/badges/featured.svg"
                  alt="Featured on Smol Launch"
                  loading="lazy"
                  width={250}
                  height={60}
                  className="max-w-[180px] h-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wider mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Features', action: () => scrollTo('features') },
                { label: 'Pricing', action: () => scrollTo('pricing') },
                { label: 'How it works', action: () => scrollTo('how-it-works') },
                { label: 'Alternatives', action: () => navigate('/alternatives') },
                { label: 'Glossary', action: () => navigate('/glossary') },
                { label: 'FAQ', action: () => scrollTo('faq') },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="group flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((label) => (
                <li key={label}>
                  <button className="group flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wider mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', action: () => {} },
                { label: 'Terms of Service', action: () => navigate('/terms') },
                { label: 'Refund Policy', action: () => navigate('/refund-policy') },
                { label: 'Cookie Policy', action: () => {} },
              ].map((item) => (
                <li key={item.label}>
                  <button onClick={item.action} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-border/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} Reddix. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground/35">
            Built for founders who prefer warm conversations over cold outreach.
          </p>
        </div>
      </div>
    </footer>
  );
}
