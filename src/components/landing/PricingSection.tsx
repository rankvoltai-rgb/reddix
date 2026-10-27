/**
 * Pricing laid out as a row of static cards: a name, a price, a full-width
 * button, a line of reassurance, then what it includes as icon rows with a
 * title and a one-line detail. Premium, the recommended plan, sits in the
 * middle with a red border and a header strip. Plans and prices come from
 * lib/subscriptionTiers, so they can't drift from checkout.
 */
import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Infinity as InfinityIcon,
  Layers,
  LifeBuoy,
  Lock,
  Plug,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUBSCRIPTION_TIERS } from '@/lib/subscriptionTiers';
import { Avatar, Reveal, SubredditIcon } from './shared';
import { Accent, Band, LINE, LINE_FILL, SectionHead, Spacer } from './frame';
import { LogoMark } from '@/components/brand/Logo';

type Icon = ComponentType<{ className?: string }>;
interface Row {
  icon: Icon;
  title: string;
  detail: string;
}

export const CONTACT_EMAIL = 'support@reddix.io';

/* Each plan's features, as written in subscriptionTiers, with a line of
   detail. Unknown features still render, just without the detail. */
const DETAIL: Record<string, { icon: Icon; detail: string }> = {
  'Unlimited leads': { icon: InfinityIcon, detail: 'No daily cap on what Reddix surfaces' },
  'Unlimited subreddits': { icon: Layers, detail: 'Watch every community you sell into' },
  'Priority scanning': { icon: Zap, detail: 'First in line when scans run' },
  'Advanced analytics': { icon: BarChart3, detail: 'Leads, replies, and what converts' },
  'Team collaboration': { icon: Users, detail: 'Bring your whole team in' },
  'Priority support': { icon: LifeBuoy, detail: 'Straight to the people who build it' },
  'Custom signals': { icon: Sparkles, detail: 'Intent tuned to your buyers' },
  'N8n automation': { icon: Workflow, detail: 'Pipe leads into your workflows' },
  'Custom integration': { icon: Plug, detail: 'Into your CRM or your stack' },
};
const rowsFor = (features: readonly string[]): Row[] =>
  features.map((f) => ({ title: f, icon: DETAIL[f]?.icon ?? Sparkles, detail: DETAIL[f]?.detail ?? '' }));

function Price({ amount, suffix }: { amount: number | null; suffix: string }) {
  return (
    <p className="mt-6 flex items-start text-ink">
      {amount === null ? (
        <span className="text-[3.25rem] font-medium leading-none tracking-[-0.04em]">Custom</span>
      ) : (
        <>
          <span className="mt-1.5 text-xl font-medium">$</span>
          <span className="text-[3.25rem] font-medium leading-none tracking-[-0.04em] tabular-nums">{amount}</span>
          <span className="ml-1.5 self-end pb-1.5 text-sm text-muted-foreground">{suffix}</span>
        </>
      )}
    </p>
  );
}

function PlanCard({
  featured = false,
  strip,
  icon,
  name,
  tag,
  subtitle,
  price,
  priceNote,
  action,
  reassurance,
  rows,
  className,
}: {
  featured?: boolean;
  strip?: string;
  icon: ReactNode;
  name: string;
  tag?: string;
  subtitle: string;
  price: ReactNode;
  priceNote: ReactNode;
  action: { label: string; to?: string; href?: string };
  reassurance: string;
  rows: Row[];
  className?: string;
}) {
  const button = (
    <>
      {action.label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </>
  );
  const buttonClass = cn(
    'group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25',
    featured
      ? 'bg-cta text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] hover:bg-cta-hover'
      : 'border border-ink/[0.12] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-ink/[0.2] hover:bg-ink/[0.02]',
  );
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl bg-white',
        featured
          ? 'border-[1.5px] border-cta shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]'
          : 'border border-ink/[0.09] shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
        className,
      )}
    >
      {strip && <p className="bg-cta py-1.5 text-center text-xs font-semibold text-white">{strip}</p>}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start gap-3">
          {icon}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1.35rem] font-medium leading-tight tracking-tight text-ink">{name}</h3>
              {tag && <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta">{tag}</span>}
            </div>
            {/* Two lines' room on every card, so the prices line up. */}
            <p className="mt-0.5 min-h-[2.5rem] text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {price}
        <p className="mt-2 text-sm text-muted-foreground">{priceNote}</p>

        {action.href ? (
          <a href={action.href} className={buttonClass}>
            {button}
          </a>
        ) : (
          <Link to={action.to ?? '/auth'} className={buttonClass}>
            {button}
          </Link>
        )}
        <p className="mt-3 text-balance text-center text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 -translate-y-px align-middle" />
          {reassurance}
        </p>

        <ul className={cn('mt-6 space-y-4 border-t pt-6', LINE)}>
          {rows.map(({ icon: RowIcon, title, detail }) => (
            <li key={title} className="flex items-start gap-3">
              <RowIcon className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-cta" />
              <div className="min-w-0">
                <p className="text-[0.92rem] font-medium leading-snug text-ink">{title}</p>
                {detail && <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">{detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const PlanIcon = ({ icon: I }: { icon: Icon }) => <I className="mt-0.5 h-8 w-8 shrink-0 text-cta" />;

export function PlanCards() {
  const { lifetime, premium, enterprise } = SUBSCRIPTION_TIERS;
  return (
    <div className="mx-auto grid max-w-[26rem] items-start gap-5 lg:max-w-none lg:grid-cols-3">
      <PlanCard
        icon={<PlanIcon icon={InfinityIcon} />}
        name={lifetime.name}
        subtitle="Pay once, keep every premium feature for good."
        price={<Price amount={lifetime.price} suffix="one-time" />}
        priceNote="Lifetime access. No recurring charges, ever."
        action={{ label: lifetime.cta, to: '/auth' }}
        reassurance="Secure checkout via Stripe."
        rows={rowsFor(lifetime.features)}
        className="order-2 lg:order-none"
      />
      <PlanCard
        featured
        strip="7-day free trial"
        icon={
          <LogoMark className="mt-0.5 h-8 w-8" />
        }
        name={premium.name}
        tag="Most popular"
        subtitle="Everything Reddix does, billed monthly."
        price={<Price amount={premium.price} suffix="/month" />}
        priceNote="Try it free for 7 days, then monthly."
        action={{ label: 'Start free trial', to: '/auth' }}
        reassurance="No annual contract. Cancel anytime."
        rows={rowsFor(premium.features)}
        className="order-1 lg:order-none"
      />
      <PlanCard
        icon={<PlanIcon icon={Layers} />}
        name={enterprise.name}
        subtitle="For agencies and teams with their own stack."
        price={<Price amount={enterprise.price} suffix="" />}
        priceNote="Shaped around your signals and workflows."
        action={{ label: enterprise.cta, href: `mailto:${CONTACT_EMAIL}?subject=Enterprise%20Plan%20Inquiry` }}
        reassurance="Tell us what you need; we'll shape the plan."
        rows={rowsFor(enterprise.features)}
        className="order-3 lg:order-none"
      />
    </div>
  );
}

const PROOF_SUBS = ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', 'r/sales'];
const PROOF_PEOPLE = ['Sarah J.', 'Marcus K.', 'Priya D.', 'Alex T.', 'Robin L.'];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Tag}
        eyebrow="Simple pricing"
        title={
          <>
            Pay once, <Accent>or month to month</Accent>
          </>
        }
        subtitle="No hidden fees and no annual lock-in. Lifetime and Premium both find unlimited leads across unlimited subreddits."
      />

      <Band inner="px-5 py-14 sm:px-8 sm:py-16">
        <PlanCards />
      </Band>

      {/* Proof: where the leads come from, and who's using it. */}
      <Band>
        <div className="grid items-center md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:gap-5 sm:px-8">
            <span className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
              Finding leads in
            </span>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {PROOF_SUBS.map((s) => (
                <li key={s} className="group/p flex items-center gap-1.5 text-[0.85rem] font-medium text-ink/60 transition-colors hover:text-ink">
                  <SubredditIcon name={s} className="h-4 w-4 text-[0.5rem] opacity-70 grayscale transition-[filter,opacity] group-hover/p:opacity-100 group-hover/p:grayscale-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className={cn('flex items-center gap-3 border-t px-6 py-5 sm:px-8 md:border-l md:border-t-0', LINE)}>
            <div className="flex -space-x-2">
              {PROOF_PEOPLE.map((n) => (
                <Avatar key={n} name={n} className="h-8 w-8 text-[0.62rem] ring-white" />
              ))}
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              <span className="font-semibold text-ink">500+</span> SaaS teams finding
              <br className="hidden sm:block" /> customers with Reddix
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}

const PROMISES = [
  { icon: Sparkles, title: '7-day free trial', body: 'Try Premium before you pay a cent.' },
  { icon: ShieldCheck, title: 'Cancel anytime', body: 'One click from your settings.' },
  { icon: Lock, title: 'Secure payments', body: 'Checkout handled by Stripe.' },
  { icon: Zap, title: 'Instant access', body: 'Start scanning right after signup.' },
];

/* The promise, then four plain guarantees as a row of hairline cells. */
export function Guarantee() {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        title={
          <>
            Try it with <Accent>zero risk</Accent>
          </>
        }
        subtitle="No hidden fees and no long-term contract. Cancel whenever you like and keep access until the end of your billing period."
      />
      <Band>
        <ul className={cn('grid gap-px sm:grid-cols-2 lg:grid-cols-4', LINE_FILL)}>
          {PROMISES.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="bg-white">
              <Reveal delay={i * 0.05} className="group flex h-full flex-col items-center px-6 py-8 text-center sm:py-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[0.95rem] font-semibold tracking-tight text-ink">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}
