import { Zap, Target, Compass, BarChart3, Shield, MessageSquare, Clock, Bell, Filter, Radar, TrendingUp } from 'lucide-react';

const showcases = [
  {
    tag: 'Intent Detection',
    icon: Zap,
    title: "Know exactly who's ready to buy",
    desc: "Our AI doesn't just find mentions — it detects genuine buying signals. When someone asks \"what tool should I use for X?\" or \"looking for alternatives to Y,\" Reddix catches it and scores the lead instantly.",
    features: [
      { icon: Target, text: 'Buying intent scoring from 0-100' },
      { icon: Filter, text: 'Smart filtering removes noise' },
      { icon: Bell, text: 'Instant alerts for hot leads' },
    ],
  },
  {
    tag: 'AI Replies',
    icon: MessageSquare,
    title: 'Replies that feel human, not spammy',
    desc: "Every reply is crafted to match the subreddit's tone and culture. Reddix reads the full thread context, understands the conversation, and generates a response that adds genuine value while naturally mentioning your product.",
    features: [
      { icon: Shield, text: 'Tone-matched to each subreddit' },
      { icon: Compass, text: 'Context-aware thread analysis' },
      { icon: Clock, text: 'One-click copy and post' },
    ],
  },
  {
    tag: 'Auto-Pilot',
    icon: BarChart3,
    title: 'Set it once, get leads forever',
    desc: 'Enable auto-pilot mode and Reddix runs on your schedule — daily, every 6 hours, or continuously. New leads land in your dashboard with AI replies ready to go. Wake up to warm opportunities without opening Reddit once.',
    features: [
      { icon: Clock, text: 'Configurable scan frequency' },
      { icon: Radar, text: 'Smart subreddit discovery' },
      { icon: TrendingUp, text: 'Performance analytics built in' },
    ],
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Deep dive
          </p>
          <h2 className="text-3xl sm:text-[42px] font-semibold tracking-[-0.025em] leading-tight">
            More than a scanner —
            <br />
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              your Reddit growth engine
            </span>
          </h2>
        </div>

        <div className="space-y-16">
          {showcases.map((s, i) => (
            <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 3)}`}>
              <div className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-start`}>
                <div className="flex-1">
                  <div className="tag-pill border-primary/15 bg-primary/[0.04] text-primary mb-5">
                    <s.icon className="w-3.5 h-3.5" />
                    {s.tag}
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] font-semibold text-foreground tracking-[-0.02em] leading-[1.2] mb-4">
                    {s.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-[1.7] mb-6">
                    {s.desc}
                  </p>
                  <div className="space-y-3">
                    {s.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <f.icon className="w-4 h-4 text-foreground/60" />
                        </div>
                        <span className="text-[13px] text-muted-foreground">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="bento-card h-[280px] sm:h-[320px] bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center">
                    <s.icon className="w-16 h-16 text-primary/15" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
