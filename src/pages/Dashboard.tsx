import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, MessageSquare, Users, TrendingUp, ExternalLink, Clock, Zap, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { stats, recentLeads, isLoading: statsLoading } = useDashboardStats();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [user, authLoading, profile, profileLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-10 animate-fade-in">
        <h2 className="text-3xl font-semibold text-foreground tracking-tight">
          Welcome back{profile?.product_name ? `, ${profile.product_name}` : ''}
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Your Reddit lead generation dashboard is ready.
        </p>
        {profile?.last_scan_at && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Last scan: {formatDistanceToNow(new Date(profile.last_scan_at), { addSuffix: true })}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Leads Found', value: stats?.totalLeads, icon: Users, color: 'text-primary', tint: 'stat-tint-primary' },
          { label: 'Hot Leads', value: stats?.hotLeads, icon: TrendingUp, color: 'text-destructive', tint: 'stat-tint-destructive' },
          { label: 'AI Replies Ready', value: stats?.repliesReady, icon: MessageSquare, color: 'text-warning', tint: 'stat-tint-warning' },
          { label: 'Subreddits Tracked', value: stats?.activeSubreddits, icon: Search, color: 'text-success', tint: 'stat-tint-success' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`bg-card border border-border rounded-lg p-5 card-hover ${stat.tint} opacity-0 animate-stagger-fade-in`}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-background border border-border`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            {statsLoading ? (
              <Skeleton className="h-9 w-14 mb-1" />
            ) : (
              <p className="text-3xl font-semibold text-foreground mb-1">
                <AnimatedCounter value={stat.value ?? 0} />
              </p>
            )}
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Content Based on State */}
      {statsLoading ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <Skeleton className="h-6 w-48 mb-5" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      ) : !hasSetup ? (
        /* No subreddits configured */
        <div className="bg-card border border-border rounded-lg p-14 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No subreddits configured
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Set up your first subreddit and keywords to start discovering leads automatically.
            </p>
            <Button onClick={() => navigate('/scanner')} className="gap-2">
              Configure Scanner
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : !hasLeads ? (
        /* Has setup but no leads */
        <div className="bg-card border border-border rounded-lg p-14 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Zap className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to find leads
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              You have {stats?.activeSubreddits} subreddit{stats?.activeSubreddits !== 1 ? 's' : ''} configured. Run a scan to discover potential leads.
            </p>
            <Button onClick={() => navigate('/scanner')} className="gap-2">
              Run First Scan
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Has leads - show recent leads */
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')} className="gap-1.5 text-muted-foreground hover:text-foreground">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentLeads.map((lead, index) => (
              <a
                key={lead.id}
                href={lead.thread_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg lead-card opacity-0 animate-stagger-fade-in group"
                style={{ animationDelay: `${index * 50 + 300}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {lead.thread_title || 'Untitled Thread'}
                      </p>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs font-normal">
                        r/{lead.subreddit}
                      </Badge>
                      {lead.discovered_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.discovered_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={getIntentBadgeVariant(lead.intent_level)} className="capitalize">
                    {lead.intent_level || 'low'}
                  </Badge>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
