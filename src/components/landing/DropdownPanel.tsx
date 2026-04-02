import { ArrowRight } from 'lucide-react';

interface DropdownItem {
  label: string;
  desc: string;
  icon: React.ElementType;
  route?: string;
  scrollId?: string;
}

interface DropdownConfig {
  items: DropdownItem[];
  footer?: { label: string; route: string };
}

export type { DropdownItem, DropdownConfig };

export function DropdownPanel({
  dropdown,
  onNavigate,
}: {
  dropdown: DropdownConfig;
  onNavigate: (route?: string, scrollId?: string) => void;
}) {
  const isLarge = dropdown.items.length > 4;

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ minWidth: isLarge ? '580px' : '320px' }}
    >
      <div className="bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.12)] overflow-hidden">
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
