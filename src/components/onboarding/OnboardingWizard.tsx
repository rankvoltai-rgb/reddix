/**
 * The three-step onboarding: business, then the profile Reddix builds from the
 * site (with the subreddits and keywords it saves), then the plan. One step on
 * screen at a time, with a rail that keeps what's been set up in view.
 *
 * Step 1 saves to the profile, so a refresh resumes with the fields filled
 * in. Stripe returns to `?checkout=success`, which completes setup and opens
 * the Scanner.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AlertCircle, ArrowRight, Check, Globe, Infinity as InfinityIcon, Layers, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS, type SubscriptionPlan } from '@/lib/subscriptionTiers';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/brand/Logo';
import { Avatar, Stars, SubredditIcon } from '@/components/landing/shared';
import { ActionBar, Field, OnboardingShell, PRIMARY_BUTTON, StepHeader, type Step } from './shell';

type ProfileUpdate = Record<string, unknown>;

interface Learned {
  description: string;
  audience: string;
  value: string;
  features: string[];
  competitors: string[];
}

interface FoundSubreddit {
  name: string;
  reason: string;
}

interface Setup {
  subreddits: FoundSubreddit[];
  keywords: string[];
}

const FALLBACK_SUBREDDITS = ['SaaS', 'Entrepreneur', 'smallbusiness', 'startups', 'marketing'];
const STEP_KEY = 'reddix:onboarding-step';

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function domainOf(url: string) {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#]/)[0];
}

/* The site the visitor typed into the landing hero, if any. */
function pendingWebsite(): string {
  try {
    return sessionStorage.getItem('pendingWebsite')?.trim() || '';
  } catch {
    return '';
  }
}

/** Discovers subreddits and keywords from the saved profile, keeps up to five
 *  subreddits (AI picks first, then sensible defaults), and saves them. */
async function preseedScannerSetup(): Promise<Setup> {
  const empty: Setup = { subreddits: [], keywords: [] };
  try {
    const { firecrawlApi } = await import('@/lib/api/firecrawl');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return empty;

    const [keywordsResult, subredditsResult] = await Promise.all([
      firecrawlApi.autoGenerateKeywords().catch(() => null),
      firecrawlApi.discoverSubreddits().catch(() => null),
    ]);

    const fromAI: FoundSubreddit[] =
      subredditsResult?.success && subredditsResult.suggestions
        ? subredditsResult.suggestions.slice(0, 5).map((s) => ({ name: s.name, reason: s.reasoning }))
        : [];

    const merged: FoundSubreddit[] = [];
    const seen = new Set<string>();
    for (const s of [...fromAI, ...FALLBACK_SUBREDDITS.map((name) => ({ name, reason: '' }))]) {
      const clean = (s.name || '').replace(/^r\//i, '').toLowerCase().trim();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        merged.push({ name: clean, reason: s.reason });
        if (merged.length >= 5) break;
      }
    }

    for (const sub of merged) {
      await supabase
        .from('monitored_subreddits')
        .upsert({ user_id: user.id, subreddit_name: sub.name, is_active: true }, { onConflict: 'user_id,subreddit_name' });
    }

    const keywords = keywordsResult?.success && keywordsResult.keywords ? keywordsResult.keywords.map((k) => k.keyword).slice(0, 12) : [];
    return { subreddits: merged, keywords };
  } catch (error) {
    console.error('preseedScannerSetup error:', error);
    return empty;
  }
}

/* ---------- step 2: the scan checklist ---------- */

const SCAN_STEPS = ['Fetching your site', 'Reading your positioning', 'Saving your product profile', 'Finding where your buyers talk', 'Picking intent keywords'];

/** Real progress (stage) sets how far the list may go; the timer moves it
 *  along within that, holding short of the end until the work is done. */
function Scanning({ stage, domain }: { stage: number; domain: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setShown((s) => Math.min(s + 1, stage)), 900);
    return () => window.clearInterval(id);
  }, [stage]);
  const step = Math.min(Math.max(shown, stage - 1), SCAN_STEPS.length);
  const progress = Math.round(((step + 0.6) / SCAN_STEPS.length) * 100);
  return (
    <div aria-live="polite">
      <div className="rounded-xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-ink">Reading {domain || 'your site'}…</p>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{Math.min(progress, 99)}%</span>
        </div>
        <div role="progressbar" aria-label="Analyzing your site" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-3 h-1 overflow-hidden rounded-full bg-ink/[0.06]">
          <div className="h-full rounded-full bg-cta transition-[width] duration-700 ease-out" style={{ width: `${Math.min(progress, 99)}%` }} />
        </div>
        <ol className="mt-6 space-y-3.5">
          {SCAN_STEPS.map((label, i) => {
            const complete = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {complete ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cta text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-cta" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
                  )}
                </span>
                <span className={cn('text-sm transition-colors', complete ? 'text-ink' : active ? 'font-medium text-ink' : 'text-muted-foreground')}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
      {/* The shape of what's coming, so the wait reads as progress. */}
      <div aria-hidden className="mt-4 space-y-2 opacity-60">
        {[88, 72, 80, 64].map((w) => (
          <div key={w} className="flex items-center gap-4 rounded-xl border border-ink/[0.07] bg-white px-4 py-3.5">
            <span className="h-5 w-5 animate-pulse rounded-full bg-ink/[0.06]" />
            <span className="h-3 animate-pulse rounded-full bg-ink/[0.06]" style={{ width: `${w * 0.5}%` }} />
            <span className="ml-auto h-3 w-12 animate-pulse rounded-full bg-ink/[0.06]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({ title, meta, children }: { title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {meta}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function Learned({ learned, productName }: { learned: Learned | null; productName: string }) {
  if (!learned || (!learned.description && !learned.audience && !learned.value)) {
    return (
      <Panel title={`What we learned about ${productName || 'you'}`}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We couldn't read much from your site this time. That's fine: Reddix uses your business name and URL, and you can add
          your audience and positioning later in Settings for sharper matches.
        </p>
      </Panel>
    );
  }
  const rows: [string, string][] = [
    ['What you do', learned.description],
    ['Who it’s for', learned.audience],
    ['Why they buy', learned.value],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <Panel title={`What we learned about ${productName || 'you'}`} meta={<span className="text-xs text-muted-foreground">Edit anytime in Settings</span>}>
      <dl className="space-y-3.5">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink">{v}</dd>
          </div>
        ))}
        {learned.competitors.length > 0 && (
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Alternatives buyers compare</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {learned.competitors.slice(0, 6).map((c) => (
                <span key={c} className="rounded-md border border-ink/[0.08] bg-surface/70 px-2 py-0.5 text-xs font-medium text-ink/80">
                  {c}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </Panel>
  );
}

function Subreddits({ setup }: { setup: Setup }) {
  return (
    <Panel title="Subreddits we'll watch" meta={<span className="text-xs text-muted-foreground">{setup.subreddits.length} saved</span>}>
      <ul className="-my-1 divide-y divide-ink/[0.06]">
        {setup.subreddits.map((s, i) => (
          <motion.li
            key={s.name}
            initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3 py-3"
          >
            <SubredditIcon name={s.name} className="mt-0.5 h-7 w-7 text-[0.7rem]" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">r/{s.name}</p>
              <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">{s.reason || 'A broad community where founders ask for tools.'}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      {setup.keywords.length > 0 && (
        <div className="mt-3 border-t border-ink/[0.07] pt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Intent keywords</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {setup.keywords.map((k) => (
              <span key={k} className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ---------- step 3: plans ---------- */

const PLAN_ICON: Record<SubscriptionPlan, ReactNode> = {
  lifetime: <InfinityIcon className="h-6 w-6 text-cta" />,
  premium: <LogoMark className="h-7 w-7" />,
  enterprise: <Layers className="h-6 w-6 text-cta" />,
};

const PLAN_NOTE: Record<SubscriptionPlan, string> = {
  lifetime: 'One-time payment · Lifetime access',
  premium: '7-day free trial · Cancel anytime',
  enterprise: 'Custom signals and integrations',
};

function PlanCard({ planKey, loading, disabled, onSelect }: { planKey: SubscriptionPlan; loading: boolean; disabled: boolean; onSelect: () => void }) {
  const tier = SUBSCRIPTION_TIERS[planKey];
  const featured = tier.popular;
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl bg-white',
        featured ? 'border-[1.5px] border-cta shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]' : 'border border-ink/[0.09] shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
      )}
    >
      {featured && <p className="bg-cta py-1 text-center text-[0.7rem] font-semibold text-white">Most popular</p>}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5">
          {PLAN_ICON[planKey]}
          <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">{tier.name}</h3>
        </div>
        <p className="mt-4 flex items-end gap-1 text-ink">
          {tier.price === null ? (
            <span className="text-[2.1rem] font-medium leading-none tracking-[-0.03em]">Custom</span>
          ) : (
            <>
              <span className="text-[2.4rem] font-medium leading-none tracking-[-0.04em] tabular-nums">${tier.price}</span>
              <span className="pb-1 text-sm text-muted-foreground">{tier.mode === 'subscription' ? '/month' : 'once'}</span>
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{PLAN_NOTE[planKey]}</p>
        <ul className="mt-5 flex-1 space-y-2 border-t border-ink/[0.07] pt-4">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[0.85rem] text-ink/85">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          className={cn(
            'group mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[0.82rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 disabled:opacity-60',
            featured
              ? 'bg-cta text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] hover:bg-cta-hover'
              : 'border border-ink/[0.12] bg-white text-ink hover:border-ink/[0.2] hover:bg-ink/[0.02]',
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {tier.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------- rail ---------- */

function Rail({ step, productName, url, setup }: { step: Step; productName: string; url: string; setup: Setup | null }) {
  const domain = domainOf(url);
  const items: { label: string; detail: string; done: boolean }[] = [
    { label: 'Your business', detail: domain || 'Add your website', done: step > 1 },
    {
      label: 'Your profile',
      detail: setup ? `${setup.subreddits.length} subreddits${setup.keywords.length ? ` · ${setup.keywords.length} keywords` : ''}` : 'Built from your site',
      done: step > 2,
    },
    { label: 'Your plan', detail: 'Then your first scan', done: false },
  ];
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-surface/70 text-ink/70">
            <Globe className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{productName.trim() || 'Your business'}</p>
            <p className="truncate text-xs text-muted-foreground">{domain || 'yoursite.com'}</p>
          </div>
        </div>
        <ol className="mt-5 space-y-3 border-t border-ink/[0.07] pt-4">
          {items.map((it, i) => (
            <li key={it.label} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold',
                  it.done ? 'bg-cta text-white' : i + 1 === step ? 'border-[1.5px] border-cta text-cta' : 'border border-ink/15 text-muted-foreground',
                )}
              >
                {it.done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className={cn('text-sm', it.done || i + 1 === step ? 'font-medium text-ink' : 'text-muted-foreground')}>{it.label}</p>
                <p className="truncate text-xs text-muted-foreground">{it.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">What happens next</p>
        <ul className="mt-3 space-y-2.5 text-[0.82rem] leading-snug text-ink/80">
          {['Run your first scan from the Scanner', 'Review leads scored 0–100 for buying intent', 'Edit a reply draft and post it yourself'].map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-cta" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* One customer quote: quiet on purpose, it reassures without competing. */}
      <figure className="border-t border-ink/[0.07] pt-6">
        <Stars className="[&_svg]:h-3 [&_svg]:w-3" />
        <blockquote className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
          &ldquo;Finally, a tool that gets Reddit culture. Subreddit discovery alone saved me weeks of research finding where our ICP
          hangs out.&rdquo;
        </blockquote>
        <figcaption className="mt-2.5 flex items-center gap-2">
          <Avatar name="Robin L." className="h-6 w-6 text-[0.55rem] ring-white" />
          <span className="text-xs font-medium text-ink">
            Robin L.<span className="font-normal text-muted-foreground"> · CMO, Stackbase</span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/* ---------- the wizard ---------- */

export default function OnboardingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStepState] = useState<Step>(() => {
    try {
      const saved = Number(sessionStorage.getItem(STEP_KEY));
      return saved === 2 || saved === 3 ? (saved as Step) : 1;
    } catch {
      return 1;
    }
  });
  const [form, setForm] = useState({ full_name: '', product_name: '', product_url: pendingWebsite() });
  const [stage, setStage] = useState(0);
  const [learned, setLearned] = useState<Learned | null>(null);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const [finishing, setFinishing] = useState(false);
  const checkoutHandledRef = useRef(false);
  const scanning = step === 2 && !setup;

  const setStep = useCallback((s: Step) => {
    setStepState(s);
    try {
      sessionStorage.setItem(STEP_KEY, String(s));
    } catch {
      // Storage blocked: a refresh just starts at step 1 with fields filled.
    }
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const saveProfile = useCallback(
    (update: ProfileUpdate) =>
      new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the profile row type is generated
        updateProfile(update as any, { onSuccess: () => resolve(), onError: (e: unknown) => reject(e) });
      }),
    [updateProfile],
  );

  // Defensive guard: a completed onboarding never shows the wizard again.
  useEffect(() => {
    if (profile?.onboarding_completed) navigate('/dashboard', { replace: true });
  }, [profile?.onboarding_completed, navigate]);

  // Fill the form from the saved profile; a URL from the hero wins if the
  // profile has none yet.
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      full_name: profile.full_name || prev.full_name,
      product_name: profile.product_name || prev.product_name,
      product_url: profile.product_url || prev.product_url,
    }));
  }, [profile]);

  // A refresh on step 2 or 3 has no analysis in memory: go back to step 1,
  // whose fields are already filled from the profile.
  useEffect(() => {
    if (step > 1 && !setup && stage === 0) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);

  // Stripe returns here with ?checkout=success: finish setup once, then open
  // the Scanner.
  useEffect(() => {
    if (searchParams.get('checkout') !== 'success' || checkoutHandledRef.current) return;
    checkoutHandledRef.current = true;
    setFinishing(true);
    // Strip the query param immediately so a refresh can't re-trigger this.
    setSearchParams({}, { replace: true });
    (async () => {
      await refreshSubscription();
      try {
        await saveProfile({ initial_setup_completed: true, onboarding_completed: true });
        try {
          sessionStorage.removeItem(STEP_KEY);
          sessionStorage.removeItem('pendingWebsite');
        } catch {
          // Nothing to clean up.
        }
        toast({ title: 'Setup complete!', description: 'Configuring your scanner…' });
        // Safety net after the paywall: make sure subreddits and keywords
        // exist, with a timeout so the Scanner never waits long. No auto scan.
        await Promise.race([preseedScannerSetup(), new Promise((r) => setTimeout(r, 6000))]);
        navigate('/scanner', { replace: true });
      } catch {
        setFinishing(false);
        setError('We received your payment but couldn’t finish setup. Refresh the page to try again.');
      }
    })();
  }, [searchParams, setSearchParams, refreshSubscription, saveProfile, toast, navigate]);

  const analyze = useCallback(async () => {
    const url = form.product_url.trim();
    if (!url) return;
    setError(null);
    setLearned(null);
    setSetup(null);
    setStage(1);
    setStep(2);

    const update: ProfileUpdate = { full_name: form.full_name.trim(), product_name: form.product_name.trim(), product_url: url };
    try {
      const { firecrawlApi } = await import('@/lib/api/firecrawl');
      const result = await firecrawlApi.analyzeWebsite(url);
      if (result.success && result.data) {
        const d = result.data;
        if (d.company_description) update.company_description = d.company_description;
        if (d.target_audience) update.target_audience = d.target_audience;
        if (d.value_proposition) update.value_proposition = d.value_proposition;
        if (d.key_features?.length) update.key_features = d.key_features;
        if (d.competitor_names?.length) update.competitor_names = d.competitor_names;
        if (d.common_objections?.length) update.common_objections = d.common_objections;
        if (d.success_stories) update.success_stories = d.success_stories;
        if (d.pricing_model) update.pricing_model = d.pricing_model;
        if (d.unique_differentiators) update.unique_differentiators = d.unique_differentiators;
        if (d.tone) update.tone = d.tone;
        setLearned({
          description: d.company_description || '',
          audience: d.target_audience || '',
          value: d.value_proposition || '',
          features: d.key_features || [],
          competitors: d.competitor_names || [],
        });
      }
    } catch (e) {
      console.error('Analyze error:', e);
    }

    setStage(3);
    try {
      await saveProfile(update);
    } catch {
      setStage(0);
      setStep(1);
      setError('We couldn’t save your details. Check your connection and try again.');
      return;
    }

    // Subreddits and keywords read the saved profile, so they come after it.
    setStage(4);
    const found = await preseedScannerSetup();
    setStage(6);
    setAnalyzedUrl(url);
    setSetup(found.subreddits.length ? found : { subreddits: FALLBACK_SUBREDDITS.map((name) => ({ name: name.toLowerCase(), reason: '' })), keywords: [] });
  }, [form, saveProfile, setStep]);

  const selectPlan = useCallback(
    async (planKey: SubscriptionPlan) => {
      setError(null);
      if (planKey === 'enterprise') {
        window.location.href = 'mailto:support@reddix.app?subject=Enterprise%20Plan%20Inquiry';
        return;
      }
      const tier = SUBSCRIPTION_TIERS[planKey];
      if (!tier.price_id || !session?.access_token) return;
      setLoadingPlan(planKey);
      try {
        await saveProfile({ selected_plan: planKey });
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
          body: { priceId: tier.price_id, mode: tier.mode },
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (checkoutError) throw checkoutError;
        if (checkoutData?.url) window.location.href = checkoutData.url;
        else throw new Error('No checkout URL');
      } catch {
        setError('We couldn’t open checkout. Please try again in a moment.');
        setLoadingPlan(null);
      }
    },
    [session?.access_token, saveProfile],
  );

  const canContinue = !!form.full_name.trim() && !!form.product_name.trim() && !!form.product_url.trim();
  const domain = domainOf(form.product_url);
  // Going back to step 1 and changing the URL makes the analysis stale.
  const stale = analyzedUrl !== null && analyzedUrl !== form.product_url.trim();
  const plans = useMemo(() => Object.keys(SUBSCRIPTION_TIERS) as SubscriptionPlan[], []);

  if (profile?.onboarding_completed) return null;

  if (finishing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white font-jakarta">
        <LogoMark className="h-10 w-10" />
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <Loader2 className="h-4 w-4 animate-spin text-cta" />
          Setting up your scanner…
        </p>
      </div>
    );
  }

  const errorNote = error && (
    <p role="alert" className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-3 py-2.5 text-[0.85rem] text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {error}
    </p>
  );

  const reduced = reducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <OnboardingShell
        active={step}
        onStep={(s) => (s === 1 ? setStep(1) : s === 2 && setup ? setStep(2) : undefined)}
        rail={<Rail step={step} productName={form.product_name} url={form.product_url} setup={setup} />}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}
          >
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canContinue && !stale && setup) setStep(2);
                  else if (canContinue) void analyze();
                }}
              >
                <StepHeader
                  n={1}
                  title={domain ? 'Is this your business?' : 'Start with your website'}
                  subtitle="Reddix reads your site to learn what you sell and who buys it, then finds the subreddits where those buyers ask for help."
                />
                {errorNote}
                <div className="space-y-5">
                  <Field
                    id="product_url"
                    label="Website"
                    value={form.product_url}
                    onChange={(v) => setForm((f) => ({ ...f, product_url: v }))}
                    placeholder="yourproduct.com"
                    inputMode="url"
                    autoComplete="url"
                    autoFocus={!form.product_url}
                    hint="We'll analyze it and preselect 5 subreddits, so you can scan as soon as you subscribe."
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      id="product_name"
                      label="Business name"
                      value={form.product_name}
                      onChange={(v) => setForm((f) => ({ ...f, product_name: v }))}
                      placeholder="Acme Analytics"
                      autoComplete="organization"
                    />
                    <Field
                      id="full_name"
                      label="Your name"
                      value={form.full_name}
                      onChange={(v) => setForm((f) => ({ ...f, full_name: v }))}
                      placeholder="Jane Doe"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <ActionBar note={<span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />We only read public pages on your site.</span>}>
                  <button type="submit" disabled={!canContinue} className={PRIMARY_BUTTON}>
                    {setup && !stale ? 'Continue' : 'Analyze my site'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </ActionBar>
              </form>
            )}

            {step === 2 && (
              <>
                <StepHeader
                  n={2}
                  title={scanning ? `Reading ${domain || 'your site'}` : 'Here’s where your buyers are'}
                  subtitle={
                    scanning
                      ? 'This takes about half a minute. Reddix is building your product profile and choosing subreddits to watch.'
                      : 'Reddix saved these to your scanner. You can add, remove or change any of them later.'
                  }
                />
                {errorNote}
                {scanning ? (
                  <Scanning stage={stage} domain={domain} />
                ) : (
                  <div className="space-y-4">
                    <Learned learned={learned} productName={form.product_name} />
                    {setup && <Subreddits setup={setup} />}
                  </div>
                )}
                <ActionBar
                  onBack={scanning ? undefined : () => setStep(1)}
                  note={scanning ? 'Hang tight, this runs once.' : <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />Scans run when you start them.</span>}
                >
                  <button type="button" disabled={scanning} onClick={() => setStep(3)} className={PRIMARY_BUTTON}>
                    {scanning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Choose a plan
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </ActionBar>
              </>
            )}

            {step === 3 && (
              <>
                <StepHeader
                  n={3}
                  title="Pick your plan"
                  subtitle="Lifetime and Premium both find unlimited leads across unlimited subreddits. Premium starts with a 7-day free trial."
                />
                {errorNote}
                <div className="grid gap-4 sm:grid-cols-3">
                  {plans.map((key) => (
                    <PlanCard key={key} planKey={key} loading={loadingPlan === key} disabled={loadingPlan !== null} onSelect={() => void selectPlan(key)} />
                  ))}
                </div>
                <ActionBar onBack={() => setStep(2)} note="Secure checkout by Stripe. Cancel anytime from Settings.">
                  <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Choose a plan above</span>
                </ActionBar>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </OnboardingShell>
    </MotionConfig>
  );
}
