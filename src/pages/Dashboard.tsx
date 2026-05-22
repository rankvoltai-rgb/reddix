import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  ExternalLink,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { BadgesSection } from '@/components/badges/BadgesSection';
import { usePageMeta } from '@/hooks/usePageMeta';
import { resolveDestination, safeNavigate } from '@/lib/routing';

const intentDot: Record<string, string> = {
  hot: 'bg-destructive',
  warm: 'bg-amber-500',
  research: 'bg-blue-500',
  low: 'bg-muted-foreground/40',
};

export default function Dashboard() {
  usePageMeta({
    title: 'Dashboard | Reddix',
    description: 'Your Reddix command center: track leads, scanning activity, and conversion stats at a glance.',
    path: '/dashboard',
    noindex: true,
  });
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading, refreshSubscription } = useSubscription();
  const { stats, recentLeads, isLoading: statsLoading } = useDashboardStats();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerifyingSubscription, setIsVerifyingSubscription] = useState(false);
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    const checkoutSuccess = searchParams.get('checkout');
    if (checkoutSuccess === 'success' && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      setIsVerifyingSubscription(true);
      setSearchParams({}, { replace: true });
      refreshSubscription().finally(() => {
        setIsVerifyingSubscription(false);
      });
    }
  }, [searchParams, setSearchParams, refreshSubscription]);

  useEffect(() => {
    if (isVerifyingSubscription) return;
    const dest = resolveDestination({
      user,
      profile,
      subscribed,
      authLoading,
      profileLoading,
      subLoading,
    });
    safeNavigate(location.pathname, dest, navigate);
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, isVerifyingSubscription, navigate, location.pathname]);

  if (authLoading || profileLoading || subLoading || isVerifyingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-3" />
          {isVerifyingSubscription && (
            <p className="text-sm text-muted-foreground">Finalizing your subscription...</p>
          )}
        </div>
      </div>
    );
  }

  const getIntentBadgeVariant = (level: string | null) => {
    switch (level) {
      case 'hot': return 'destructive';
      case 'warm': return 'default';
      case 'research': return 'secondary';
      default: return 'outline';
    }
  };

  const hasSetup = stats && stats.activeSubreddits > 0;
  const hasLeads = stats && stats.totalLeads > 0;

  const lastScan = profile?.last_scan_at ? new Date(profile.last_scan_at) : null;
  const isRecentScan = lastScan ? Date.now() - lastScan.getTime() < 60 * 60 * 1000 : false;

  const statItems = [
    { label: 'Leads', value: stats?.totalLeads, icon: Users, color: 'text-primary' },
    { label: 'Hot', value: stats?.hotLeads, icon: TrendingUp, color: 'text-destructive' },
    { label: 'Replies ready', value: stats?.repliesReady, icon: MessageSquare, color: 'text-amber-500' },
    { label: 'Subreddits', value: stats?.activeSubreddits, icon: Search, color: 'text-emerald-500' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative animate-fade-in">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[280px] rounded-full blur-3xl opacity-40"
            style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)' }}
            aria-hidden
          />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
                Welcome back{profile?.full_name ? <>, <em className="italic">{profile.full_name}</em></> : ''}
              </h1>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">Your Reddit lead command center.</p>
                {lastScan && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/60 backdrop-blur rounded-full text-xs text-muted-foreground border border-border/50">
                    <span className={`w-1.5 h-1.5 rounded-full ${isRecentScan ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
                    <Clock className="w-3 h-3" />
                    Last scan {formatDistanceToNow(lastScan, { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/leads')} className="gap-1.5 text-muted-foreground hover:text-foreground">
                All leads
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button onClick={() => navigate('/scanner')} className="gap-2 shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4" />
                Scan now
              </Button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/60">
            {statItems.map((stat, i) => (
              <div
                key={stat.label}
                className="p-5 opacity-0 animate-stagger-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  {stat.label}
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-14 mt-2" />
                ) : (
                  <p className="mt-1.5 text-3xl font-semibold text-foreground tabular-nums">
                    <AnimatedCounter value={stat.value ?? 0} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads — visual anchor */}
        {statsLoading ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6">
            <Skeleton className="h-6 w-48 mb-5" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ) : !hasSetup ? (
          <EmptyState
            icon={Search}
            title="No subreddits configured"
            body="Set up your first subreddit and keywords to start discovering leads."
            cta="Configure scanner"
            onClick={() => navigate('/scanner')}
          />
        ) : !hasLeads ? (
          <EmptyState
            icon={Zap}
            title="Ready to find leads"
            body={`You have ${stats?.activeSubreddits} subreddit${stats?.activeSubreddits !== 1 ? 's' : ''} configured. Run a scan to discover potential buyers.`}
            cta="Run first scan"
            onClick={() => navigate('/scanner')}
          />
        ) : (
          <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl text-foreground">Recent leads</h2>
                <Badge variant="outline" className="text-xs font-normal">
                  {recentLeads.length} latest
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/leads')} className="gap-1.5 text-muted-foreground hover:text-foreground">
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-1.5">
              {recentLeads.map((lead, index) => (
                <a
                  key={lead.id}
                  href={lead.thread_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block px-4 py-3.5 rounded-xl border border-transparent hover:border-border/60 hover:bg-background/60 hover:-translate-y-px transition-all opacity-0 animate-stagger-fade-in"
                  style={{ animationDelay: `${index * 50 + 200}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${intentDot[lead.intent_level || 'low']}`}
                        aria-hidden
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground line-clamp-1">
                            {lead.thread_title || 'Untitled thread'}
                          </p>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">r/{lead.subreddit}</span>
                          {lead.discovered_at && (
                            <>
                              <span className="opacity-40">·</span>
                              <span>{formatDistanceToNow(new Date(lead.discovered_at), { addSuffix: true })}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getIntentBadgeVariant(lead.intent_level)} className="capitalize flex-shrink-0">
                      {lead.intent_level || 'low'}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        <BadgesSection />
      </div>
    </DashboardLayout>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-10 text-center">
      <div className="max-w-sm mx-auto">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-display text-2xl text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{body}</p>
        <Button onClick={onClick} className="gap-2">
          {cta}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
