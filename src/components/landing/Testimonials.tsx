import { Star, Quote, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    quote: "Reddix found 3 paying customers in our first week. We were manually browsing Reddit for months — never going back.",
    name: 'Sarah J.',
    role: 'Founder, LaunchKit',
    rating: 5,
    metric: '3 customers in week 1',
  },
  {
    quote: "The AI replies are actually good. They don't sound like a bot, and people genuinely engage. Game-changer for our outbound strategy.",
    name: 'Marcus K.',
    role: 'CEO, DataPulse',
    rating: 5,
    metric: '4x reply engagement',
  },
  {
    quote: "We track everything through Reddix. It replaced our manual prospecting AND our CRM for Reddit leads. Intent scoring is scary accurate.",
    name: 'Priya D.',
    role: 'Head of Growth, Metricflow',
    rating: 5,
    metric: 'Replaced 2 tools',
  },
  {
    quote: "I set up auto-pilot on day one and now I get 5–10 warm leads every morning. Best $45/mo I spend on marketing. Period.",
    name: 'Alex T.',
    role: 'Founder, Pagespeed.dev',
    rating: 5,
    metric: '10 leads/day on autopilot',
  },
  {
    quote: "Finally, a tool that gets Reddit culture. Subreddit discovery alone saved me weeks of research finding where our ICP hangs out.",
    name: 'Robin L.',
    role: 'CMO, Stackbase',
    rating: 5,
    metric: 'Weeks of research saved',
  },
  {
    quote: "Our conversion rate from Reddit leads is 4x higher than cold email. Reddix makes it effortless to show up in the right threads.",
    name: 'Jamie W.',
    role: 'Co-founder, Replyfast',
    rating: 5,
    metric: '4x vs cold email',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <Star className="w-3.5 h-3.5 fill-primary" />
            Real results from real founders
          </div>
          <h2 className="text-3xl sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Loved by{' '}
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              founders who ship
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Don't take our word for it. Here's what happens when SaaS founders stop scrolling and start converting.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group break-inside-avoid rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 transition-all duration-500 hover:border-primary/15 hover:shadow-[0_20px_50px_-12px_hsl(var(--foreground)/0.06)] hover:-translate-y-0.5 reveal overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Quote icon + stars */}
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-6 h-6 text-primary/15" />
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Metric highlight */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 mb-4">
                <ArrowRight className="w-3 h-3" />
                {t.metric}
              </div>

              <p className="text-[14px] text-foreground leading-[1.65] mb-5">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[12px] font-bold text-primary">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
