import { Globe, Radar, MessageCircle, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Globe,
    num: '01',
    title: 'Paste your URL. We do the rest.',
    body: 'Our AI reverse-engineers your product in seconds — extracting your value prop, ICP, competitive angles, and the exact language your buyers use. Zero forms. Zero guesswork.',
    detail: 'Keywords, positioning, and audience insights — extracted automatically.',
    color: 'from-primary/10 to-primary/[0.03]',
    borderColor: 'border-primary/10',
    iconBg: 'bg-primary/10',
    badge: 'Instant Setup',
  },
  {
    icon: Radar,
    num: '02',
    title: 'AI hunts Reddit while you sleep.',
    body: 'Reddix deploys intelligent agents across hundreds of subreddits, zeroing in on posts where people are begging for a solution — your solution. Buying signals, not noise.',
    detail: 'Smart dedup + intent scoring means zero false positives in your feed.',
    color: 'from-amber-500/10 to-amber-500/[0.03]',
    borderColor: 'border-amber-500/10',
    iconBg: 'bg-amber-500/10',
    badge: '24/7 Monitoring',
  },
  {
    icon: MessageCircle,
    num: '03',
    title: 'Reply, convert, repeat.',
    body: 'Each lead ships with a Reddit-native reply that reads like a community member, not a marketer. Copy it, tweak it, post it — and watch cold strangers convert into pipeline.',
    detail: 'Tone-matched replies with your product link, ready to post.',
    color: 'from-emerald-500/10 to-emerald-500/[0.03]',
    borderColor: 'border-emerald-500/10',
    iconBg: 'bg-emerald-500/10',
    badge: 'AI-Powered',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-radial-glow opacity-60" />
      
      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <Zap className="w-3.5 h-3.5" />
            3 steps. 2 minutes. Unlimited leads.
          </div>
          <h2 className="text-3xl sm:text-[46px] font-semibold tracking-[-0.03em] leading-[1.1]">
            From zero to warm leads
            <br />
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              before your coffee gets cold
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            No onboarding calls. No complex setup. Just paste your URL and let AI do what AI does best.
          </p>
        </div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`reveal group relative`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`relative rounded-2xl border ${step.borderColor} bg-gradient-to-br ${step.color} backdrop-blur-sm p-7 h-full transition-all duration-500 hover:shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.08)] hover:-translate-y-1`}>
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-6 h-6 text-foreground/70" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground/50 tracking-wider">
                        STEP {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/60 border border-border/30 text-[10px] font-medium text-muted-foreground mb-4">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {step.badge}
                  </span>

                  <h3 className="text-[20px] font-semibold text-foreground mb-3 leading-tight tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-[1.7] mb-4">
                    {step.body}
                  </p>
                  
                  <div className="pt-4 border-t border-border/20">
                    <p className="text-[12px] text-muted-foreground/70 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom connector */}
        <div className="flex items-center justify-center mt-12 reveal" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-foreground text-background">
            <Sparkles className="w-4 h-4" />
            <span className="text-[14px] font-medium">Result: Warm leads in your inbox every morning</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
