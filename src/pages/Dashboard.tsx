import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Loader2, Search, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
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
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Leads Found', value: '0', icon: Users, color: 'text-primary' },
          { label: 'Hot Leads', value: '0', icon: TrendingUp, color: 'text-destructive' },
          { label: 'AI Replies Ready', value: '0', icon: MessageSquare, color: 'text-warning' },
          { label: 'Subreddits Tracked', value: '0', icon: Search, color: 'text-success' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-semibold text-foreground mt-2">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No leads yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Set up your first subreddit and keywords to start discovering leads automatically.
          </p>
          <Button>
            Configure Scanner
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
