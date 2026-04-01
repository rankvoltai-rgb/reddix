import { Globe, Radar, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Globe,
    num: '01',
    title: 'Drop in your website URL',
    body: 'Our AI analyzes your product in seconds — understanding your value proposition, target audience, and competitive landscape. No forms to fill out.',
    detail: 'We extract keywords, features, and positioning automatically.',
  },
  {
    icon: Radar,
    num: '02',
    title: 'AI scans Reddit around the clock',
    body: 'Reddix monitors hundreds of subreddits for posts that signal buying intent — people asking for recommendations, comparing tools, or describing problems your product solves.',
    detail: 'Smart deduplication ensures you never see the same lead twice.',
  },
  {
    icon: MessageCircle,
    num: '03',
    title: 'Reply with AI-drafted responses',
    body: 'Each lead comes with a context-aware reply that blends into Reddit culture naturally. Copy it, tweak it, post it — and watch cold strangers become warm prospects.',
    detail: 'Replies include your product link and match the subreddit tone.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            How it works
          </p>
          <h2 className="text-3xl sm:text-[42px] font-semibold tracking-[-0.025em] leading-tight">
            From zero to warm leads
            <br />
            <span className="font-display italic font-normal">in under two minutes</span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto">
            No complex setup, no learning curve. Just paste your URL and let AI do the rest.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className={`bento-card flex flex-col sm:flex-row gap-6 sm:gap-8 reveal reveal-delay-${i + 1}`}>
              {/* Number + icon */}
              <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/[0.06] flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground/40 tracking-wider">
                  STEP {step.num}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-[1.65] mb-3">{step.body}</p>
                <p className="text-[12px] text-muted-foreground/60 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
