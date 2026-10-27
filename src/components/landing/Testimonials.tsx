import { MessageSquareQuote, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, Reveal, Stars } from './shared';
import { Accent, Band, LINE, LINE_FILL, PANEL, SectionHead, Spacer } from './frame';

const STORIES = [
  {
    quote: 'Reddix found 3 paying customers in our first week. We were manually browsing Reddit for months — never going back.',
    metric: '3 customers in week 1',
    name: 'Sarah J.',
    role: 'Founder · LaunchKit',
  },
  {
    quote: "The AI replies are actually good. They don't sound like a bot, and people genuinely engage. Game-changer for our outbound strategy.",
    metric: '4x reply engagement',
    name: 'Marcus K.',
    role: 'CEO · DataPulse',
  },
  {
    quote: 'We track everything through Reddix. It replaced our manual prospecting AND our CRM for Reddit leads. Intent scoring is scary accurate.',
    metric: 'Replaced 2 tools',
    name: 'Priya D.',
    role: 'Head of Growth · Metricflow',
  },
  {
    quote: 'I set up auto-pilot on day one and now I get 5–10 warm leads every morning. Best $45/mo I spend on marketing. Period.',
    metric: '10 leads/day on autopilot',
    name: 'Alex T.',
    role: 'Founder · Pagespeed.dev',
  },
  {
    quote: 'Finally, a tool that gets Reddit culture. Subreddit discovery alone saved me weeks of research finding where our ICP hangs out.',
    metric: 'Weeks of research saved',
    name: 'Robin L.',
    role: 'CMO · Stackbase',
  },
  {
    quote: 'Our conversion rate from Reddit leads is 4x higher than cold email. Reddix makes it effortless to show up in the right threads.',
    metric: '4x vs cold email',
    name: 'Jamie W.',
    role: 'Co-founder · Replyfast',
  },
] as const;

/* One founder's result: the outcome up top, their words on a soft panel, and
   who they are. Cells share hairlines rather than floating as cards. */
function Story({ s }: { s: (typeof STORIES)[number] }) {
  return (
    <article className="group flex h-full flex-col bg-white p-6 transition-colors duration-300 hover:bg-surface/35 sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <Stars className="[&_svg]:h-3.5 [&_svg]:w-3.5" />
        <span className="inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-2 py-1 text-[0.72rem] font-semibold text-cta">
          <TrendingUp className="h-3.5 w-3.5" />
          {s.metric}
        </span>
      </div>

      <blockquote className={cn('mb-6 mt-5 rounded-xl border border-ink/[0.06] p-4', PANEL)}>
        <p className="text-[0.88rem] leading-relaxed text-ink/85">&ldquo;{s.quote}&rdquo;</p>
      </blockquote>

      <div className={cn('mt-auto flex items-center gap-3 border-t pt-5', LINE)}>
        <Avatar name={s.name} className="h-9 w-9 ring-white" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
          <p className="truncate text-xs text-muted-foreground">{s.role}</p>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={MessageSquareQuote}
        eyebrow="Real results, real founders"
        title={
          <>
            Founders already <Accent>closing on Reddit</Accent>
          </>
        }
        subtitle="Here's what happens when SaaS founders stop scrolling Reddit by hand and let Reddix bring the buyers to them."
      />
      <Band>
        <div className={cn('grid gap-px md:grid-cols-2 lg:grid-cols-3', LINE_FILL)}>
          {/* White on a still wrapper, so a cell fading in never shows the
              hairline fill behind it as a grey block. */}
          {STORIES.map((s, i) => (
            <div key={s.name} className="bg-white">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Story s={s} />
              </Reveal>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
