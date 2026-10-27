import { HelpCircle, Mail, Plus } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { Reveal } from './shared';
import { Band, LINE, Pill, SECTION_TITLE, Spacer } from './frame';
import { CONTACT_EMAIL } from './PricingSection';

const faqs = [
  {
    q: 'How does Reddix actually find leads?',
    a: 'Our AI agents scan hundreds of subreddits 24/7 for posts where people express genuine buying intent — asking for recommendations, comparing tools, or describing problems your product solves. Each lead is scored 0–100 based on conversion likelihood.',
  },
  {
    q: 'Do I need a Reddit account?',
    a: 'Not to discover leads. Reddix scans publicly available Reddit posts. You only need your own Reddit account when you want to post replies. We generate the reply for you — just copy, paste, and post.',
  },
  {
    q: "Won't my replies look spammy?",
    a: 'No. Our AI is specifically tuned for Reddit culture. Replies are contextual, helpful, and mention your product the way a real community member would — like recommending something they genuinely use and love. Zero self-promo vibes.',
  },
  {
    q: 'How accurate is the intent scoring?',
    a: 'Extremely. We analyze post content, context, subreddit norms, and engagement patterns. Hot leads (80+ score) have a 3–5x higher reply engagement rate compared to generic mentions. You can filter by score to focus on the highest-value opportunities.',
  },
  {
    q: 'What is the Lifetime plan?',
    a: 'For $150 one-time, you get lifetime access to all premium features: unlimited leads, unlimited subreddits, priority scanning, advanced analytics, team collaboration, and priority support. No recurring charges ever.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No contracts, no commitments, no guilt trips. Cancel from your settings page and keep access until the end of your billing period.',
  },
  {
    q: 'How does auto-pilot work?',
    a: 'Configure your product, select subreddits, pick your scan frequency (every 6h, 12h, or daily), and enable auto-pilot. Reddix scans automatically and surfaces new leads with AI replies ready to go. Wake up to warm opportunities.',
  },
  {
    q: 'What subreddits can Reddix monitor?',
    a: "Any public subreddit. Our AI also suggests communities you didn't even know existed — based on your product's positioning and target audience. Premium users get unlimited subreddit monitoring.",
  },
];

/* The title on the left, the questions down the right, each on a hairline
   with a plus that turns into a cross when open. */
export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              'flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14',
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 className={cn('mt-5', SECTION_TITLE)}>Frequently asked questions</h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              Everything you need to know about finding leads, replying safely, and what Reddix costs.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-cta"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-cta transition-colors group-hover:border-cta/30">
                <Mail className="h-3.5 w-3.5" />
              </span>
              Still stuck? Email us
            </a>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <AccordionPrimitive.Root type="single" collapsible className="divide-y divide-ink/[0.07]">
              {faqs.map((f, i) => (
                <AccordionPrimitive.Item key={f.q} value={`item-${i}`}>
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-cta/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-cta group-data-[state=open]:bg-cta group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  {/* Always in the DOM, so every answer is in the page for
                      search engines; closed ones collapse to nothing. */}
                  <AccordionPrimitive.Content
                    forceMount
                    className="overflow-hidden data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  >
                    <p className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}
