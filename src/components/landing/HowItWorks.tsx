import { FileText, Radar, MessageSquare } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Describe your product',
    description:
      'Enter your website URL. Our AI analyzes your product to understand what you sell and who you serve.',
  },
  {
    icon: Radar,
    number: '02',
    title: 'AI scans Reddit 24/7',
    description:
      'Reddix continuously monitors relevant subreddits for posts that signal buying intent for your product.',
  },
  {
    icon: MessageSquare,
    number: '03',
    title: 'Get warm leads with AI replies',
    description:
      'Each lead comes with an AI-drafted reply that blends into the conversation naturally. Copy, tweak, post.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            From zero to warm leads in 2 minutes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t-2 border-dashed border-border" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-muted/60 border border-border mb-6 relative">
                <step.icon className="w-10 h-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
