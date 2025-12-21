import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, MessageSquare, Users, TrendingUp, ExternalLink, Clock, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';

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
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back{profile?.product_name ? `, ${profile.product_name}` : ''}
        </h2>
        <p className="text-muted-foreground mt-1">
          Your Reddit lead generation dashboard is ready.
        </p>
        {profile?.last_scan_at && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last scan: {formatDistanceToNow(new Date(profile.last_scan_at), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Leads Found', value: stats?.totalLeads, icon: Users, color: 'text-primary' },
          { label: 'Hot Leads', value: stats?.hotLeads, icon: TrendingUp, color: 'text-destructive' },
          { label: 'AI Replies Ready', value: stats?.repliesReady, icon: MessageSquare, color: 'text-warning' },
          { label: 'Subreddits Tracked', value: stats?.activeSubreddits, icon: Search, color: 'text-success' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {statsLoading ? (
              <Skeleton className="h-8 w-12 mt-2" />
            ) : (
              <p className="text-2xl font-semibold text-foreground mt-2">{stat.value ?? 0}</p>
            )}
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Content Based on State */}
      {statsLoading ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ) : !hasSetup ? (
        /* No subreddits configured */
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No subreddits configured
            </h3>
            <p className="text-muted-foreground mb-6">
              Set up your first subreddit and keywords to start discovering leads automatically.
            </p>
            <Button onClick={() => navigate('/scanner')}>
              Configure Scanner
            </Button>
          </div>
        </div>
      ) : !hasLeads ? (
        /* Has setup but no leads */
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ready to find leads
            </h3>
            <p className="text-muted-foreground mb-6">
              You have {stats?.activeSubreddits} subreddit{stats?.activeSubreddits !== 1 ? 's' : ''} configured. Run a scan to discover potential leads.
            </p>
            <Button onClick={() => navigate('/scanner')}>
              Run First Scan
            </Button>
          </div>
        </div>
      ) : (
        /* Has leads - show recent leads */
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Recent Leads</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
              View All
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <a
                key={lead.id}
                href={lead.thread_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {lead.thread_title || 'Untitled Thread'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        r/{lead.subreddit}
                      </Badge>
                      {lead.discovered_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.discovered_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={getIntentBadgeVariant(lead.intent_level)}>
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
