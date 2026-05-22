import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Search, Sparkles, Zap, Clock, Crown, Flame } from "lucide-react";
import { LeadsSection } from "@/components/scanner/LeadsSection";
import { SubredditDiscovery } from "@/components/scanner/SubredditDiscovery";
import { formatDistanceToNow, startOfDay } from "date-fns";
import { usePageMeta } from "@/hooks/usePageMeta";

const FREE_DAILY_LIMIT = 10;

async function getTodayHighIntentCount(userId: string): Promise<number> {
  const todayMidnight = startOfDay(new Date()).toISOString();
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('intent_level', ['hot', 'warm'])
    .gte('discovered_at', todayMidnight)
    .neq('status', 'archived');
  if (error) throw error;
  return count ?? 0;
}

const Scanner = () => {
  usePageMeta({
    title: 'Reddit Scanner | Reddix',
    description: 'Scan Reddit in real time for high-intent buyers and draft AI replies that convert.',
    path: '/scanner',
    noindex: true,
  });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newSubreddit, setNewSubreddit] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [scanCooldown, setScanCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isFreePlan = false;

  // Query today's high-intent lead count for free users
  const { data: todayLeadCount = 0, refetch: refetchLeadCount } = useQuery({
    queryKey: ['todayHighIntentCount', user?.id],
    queryFn: () => getTodayHighIntentCount(user!.id),
    enabled: !!user && isFreePlan,
    
  });

  // Fetch subreddits — must be before any early return to respect Rules of Hooks
  const { data: subreddits = [], isLoading: subredditsLoading } = useQuery({
    queryKey: ['subreddits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monitored_subreddits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
      return;
    }
    if (!subLoading && !subscribed && profile?.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, navigate]);

  // Safety net: if user landed on Scanner with zero subreddits but has a product_url,
  // run preseed once so they always have a working setup.
  const preseedRanRef = useRef(false);
  useEffect(() => {
    if (preseedRanRef.current) return;
    if (subredditsLoading || profileLoading) return;
    if (!user || !profile?.product_url) return;
    if (subreddits.length > 0) return;

    preseedRanRef.current = true;
    (async () => {
      try {
        const FALLBACK = ['SaaS', 'Entrepreneur', 'smallbusiness', 'startups', 'marketing'];
        const result = await firecrawlApi.discoverSubreddits().catch(() => null);
        const fromAI = (result?.success && result.suggestions)
          ? result.suggestions.slice(0, 5).map((s: any) => s.name)
          : [];
        const merged: string[] = [];
        const seen = new Set<string>();
        for (const name of [...fromAI, ...FALLBACK]) {
          const clean = (name || '').replace(/^r\//i, '').toLowerCase().trim();
          if (clean && !seen.has(clean)) {
            seen.add(clean);
            merged.push(clean);
            if (merged.length >= 5) break;
          }
        }
        for (const sub of merged) {
          await supabase.from('monitored_subreddits').upsert({
            user_id: user.id,
            subreddit_name: sub,
            is_active: true,
          }, { onConflict: 'user_id,subreddit_name' });
        }
        queryClient.invalidateQueries({ queryKey: ['subreddits', user.id] });
      } catch (e) {
        console.error('Scanner preseed error:', e);
      }
    })();
  }, [user, profile, profileLoading, subreddits, subredditsLoading, queryClient]);

  // Mutations — must be before any early return (Rules of Hooks)
  const addSubreddit = useMutation({
    mutationFn: async (name: string) => {
      const cleanName = name.replace(/^r\//, '').trim().toLowerCase();
      const { error } = await supabase
        .from('monitored_subreddits')
        .insert({ subreddit_name: cleanName, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
      setNewSubreddit("");
      toast({ title: "Subreddit added" });
    },
    onError: () => {},
  });

  const removeSubreddit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('monitored_subreddits')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
      toast({ title: "Subreddit removed" });
    },
  });

  if (authLoading || profileLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }




  const handleScan = async () => {
    if (subreddits.length === 0) {
      return;
    }

    // Free plan limit check
    if (isFreePlan) {
      const freshCount = await getTodayHighIntentCount(user!.id);
      if (freshCount >= FREE_DAILY_LIMIT) {
        setShowUpgradeDialog(true);
        refetchLeadCount();
        return;
      }
    }

    setIsScanning(true);
    try {
      const result = await firecrawlApi.scanForLeads('manual');
      if (result.success) {
        toast({
          title: "Scan complete!",
          description: `Found ${result.leadsFound || 0} leads from ${result.postsScanned || 0} posts${result.hotLeads ? ` (${result.hotLeads} hot)` : ''}`,
        });
        queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
        refetchLeadCount();
      } else {
        // Scan failed silently
      }
    } catch (error: any) {
      // Scan error silently
    } finally {
      setIsScanning(false);
      // Start 10s cooldown
      setScanCooldown(true);
      setCooldownSeconds(10);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownSeconds(prev => {
          if (prev <= 1) {
            clearInterval(cooldownIntervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      cooldownTimerRef.current = setTimeout(() => {
        setScanCooldown(false);
        setCooldownSeconds(0);
      }, 10000);
    }
  };

  const isConfigured = subreddits.length > 0;
  const lastScan = profile?.last_scan_at ? new Date(profile.last_scan_at) : null;


  const leadLimitPercent = Math.min((todayLeadCount / FREE_DAILY_LIMIT) * 100, 100);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* ── Command Bar ── */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <Button
            onClick={handleScan}
            disabled={isScanning || !isConfigured || scanCooldown}
            className="gap-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning…
              </>
            ) : scanCooldown ? (
              <>
                <Clock className="h-4 w-4" />
                Wait {cooldownSeconds}s
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Scan Now
              </>
            )}
          </Button>

          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            {/* Free plan daily count indicator */}
            {isFreePlan && (
              <Badge
                variant={todayLeadCount >= FREE_DAILY_LIMIT ? "destructive" : "outline"}
                className="gap-1 text-xs"
              >
                <Flame className="h-3 w-3" />
                {todayLeadCount}/{FREE_DAILY_LIMIT} leads today
              </Badge>
            )}
            {lastScan && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(lastScan, { addSuffix: true })}
              </span>
            )}
            {isConfigured && (
              <span>{subreddits.length} subreddit{subreddits.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* ── Product Context Pill ── */}
        {profile?.product_name && (
          <div className="flex items-center gap-2 px-1">
            <Badge variant="outline" className="gap-1.5 text-xs font-normal py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Scanning for: <span className="font-medium">{profile.product_name}</span>
            </Badge>
            <button
              onClick={() => navigate("/settings")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Edit
            </button>
          </div>
        )}

        {/* ── Config Strip ── */}
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">r/</span>
              <span className="text-sm font-medium">Subreddits</span>
              <Dialog open={discoveryOpen} onOpenChange={setDiscoveryOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto gap-1 h-7 text-xs">
                    <Sparkles className="h-3 w-3" />
                    Discover
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Smart Subreddit Discovery
                    </DialogTitle>
                  </DialogHeader>
                  {user && (
                    <SubredditDiscovery
                      userId={user.id}
                      existingSubreddits={subreddits.map(s => s.subreddit_name.toLowerCase())}
                      onAddSubreddit={(name) => addSubreddit.mutate(name)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {subredditsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                subreddits.map((sub) => (
                  <Badge key={sub.id} variant="secondary" className="gap-1 pr-1">
                    r/{sub.subreddit_name}
                    <button
                      onClick={() => removeSubreddit.mutate(sub.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
              <div className="flex items-center gap-1">
                <Input
                  placeholder="Add subreddit…"
                  value={newSubreddit}
                  onChange={(e) => setNewSubreddit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newSubreddit && addSubreddit.mutate(newSubreddit)}
                  className="h-7 w-36 text-xs"
                />
                <Button
                  onClick={() => newSubreddit && addSubreddit.mutate(newSubreddit)}
                  disabled={!newSubreddit || addSubreddit.isPending}
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {subreddits.length === 0 && (
              <div className="flex flex-wrap gap-1">
                {["webdev", "SaaS", "startups", "Entrepreneur", "smallbusiness"].map((sub) => (
                  <Badge
                    key={sub}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent text-xs"
                    onClick={() => addSubreddit.mutate(sub)}
                  >
                    + r/{sub}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Leads (Hero) ── */}
        {user && <LeadsSection userId={user.id} isScanning={isScanning} />}
      </div>

      {/* ── Upgrade Dialog ── */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-primary" />
              Daily Limit Reached
            </DialogTitle>
            <DialogDescription>
              You've discovered {todayLeadCount} high-intent leads today — great work! Upgrade to Premium for unlimited daily scans and leads.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">High-intent leads today</span>
                <span className="font-semibold">{todayLeadCount}/{FREE_DAILY_LIMIT}</span>
              </div>
              <Progress value={leadLimitPercent} className="h-2" />
            </div>

            <div className="rounded-lg border bg-muted/50 p-3 space-y-1.5">
              <p className="text-sm font-medium">Premium includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-primary" /> Unlimited high-intent leads</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-primary" /> Unlimited manual scans</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-primary" /> AI-powered reply generation</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={() => {
                setShowUpgradeDialog(false);
                navigate("/onboarding?step=2");
              }}
              className="w-full gap-2"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Premium — $45/mo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowUpgradeDialog(false)}
              className="w-full text-muted-foreground"
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Scanner;
