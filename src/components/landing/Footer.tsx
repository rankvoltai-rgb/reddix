import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/30 bg-muted/10">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-[15px] font-semibold text-foreground">Reddix</span>
            <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
              AI-powered Reddit lead generation for SaaS founders.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', action: () => scrollTo('features') },
                { label: 'Pricing', action: () => scrollTo('pricing') },
                { label: 'How it works', action: () => scrollTo('how-it-works') },
                { label: 'FAQ', action: () => scrollTo('faq') },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map((label) => (
                <li key={label}>
                  <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
                <li key={label}>
                  <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground/60">
            © {new Date().getFullYear()} Reddix. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground/40">
            Built for founders who prefer warm conversations over cold outreach.
          </p>
        </div>
      </div>
    </footer>
  );
}
