import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Reddix found 3 paying customers in our first week. We were manually browsing Reddit for months before this — never going back.",
    name: 'Sarah J.',
    role: 'Founder, LaunchKit',
    rating: 5,
  },
  {
    quote: "The AI replies are actually good. They don't sound like a bot wrote them, and people genuinely engage with them. Game-changer for our outbound.",
    name: 'Marcus K.',
    role: 'CEO, DataPulse',
    rating: 5,
  },
  {
    quote: "We track everything through Reddix now. It replaced our manual Reddit prospecting AND our CRM for those leads. The intent scoring is incredibly accurate.",
    name: 'Priya D.',
    role: 'Head of Growth, Metricflow',
    rating: 5,
  },
  {
    quote: "I set up auto-pilot on day one and now I get 5–10 warm leads every morning in my dashboard. Best $45/mo I spend on marketing.",
    name: 'Alex T.',
    role: 'Founder, Pagespeed.dev',
    rating: 5,
  },
  {
    quote: "Finally, a tool that understands Reddit. The subreddit discovery feature alone saved me weeks of research finding where our audience hangs out.",
    name: 'Robin L.',
    role: 'CMO, Stackbase',
    rating: 5,
  },
  {
    quote: "Our conversion rate from Reddit leads is 4x higher than cold email. Reddix makes it effortless to show up in the right conversations.",
    name: 'Jamie W.',
    role: 'Co-founder, Replyfast',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Loved by{' '}
            <span className="font-display italic font-normal">SaaS founders</span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-md mx-auto">
            Don't take our word for it. Here's what founders building real products say about Reddix.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bento-card break-inside-avoid reveal"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>

              <p className="text-[14px] text-foreground leading-[1.6] mb-4">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{t.name}</p>
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
