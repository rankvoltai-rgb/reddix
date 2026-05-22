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
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* ── Hero: Scan Command ── */}
        <section className="relative overflow-hidden rounded-2xl border bg-card">
          {/* subtle red glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative grid gap-6 p-6 md:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            {/* Left: title + meta */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Reddit Intent Scanner
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Find buyers talking about <span className="italic text-primary">your product</span> right now.
              </h1>

              {profile?.product_name && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="gap-1.5 rounded-full py-1 text-xs font-normal">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Scanning for <span className="font-medium">{profile.product_name}</span>
                  </Badge>
                  <button
                    onClick={() => navigate("/settings")}
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    Edit context
                  </button>
                </div>
              )}
            </div>

            {/* Right: scan action + stats */}
            <div className="space-y-4">
              <Button
                onClick={handleScan}
                disabled={isScanning || !isConfigured || scanCooldown}
                size="lg"
                className="group h-14 w-full justify-center gap-2 rounded-xl text-base shadow-lg shadow-primary/20"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Scanning Reddit…
                  </>
                ) : scanCooldown ? (
                  <>
                    <Clock className="h-5 w-5" />
                    Ready in {cooldownSeconds}s
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                    Scan Now
                  </>
                )}
              </Button>

              <div className="grid grid-cols-3 divide-x divide-border rounded-xl border bg-background/60 backdrop-blur">
                <div className="flex flex-col items-center gap-0.5 px-2 py-3">
                  <span className="text-lg font-semibold tabular-nums">
                    {subredditsLoading ? '—' : subreddits.length}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Subreddits
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5 px-2 py-3">
                  <span className="text-lg font-semibold tabular-nums">
                    {isFreePlan ? `${todayLeadCount}/${FREE_DAILY_LIMIT}` : '∞'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Today
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5 px-2 py-3">
                  <span className="text-xs font-medium text-center leading-tight">
                    {lastScan ? formatDistanceToNow(lastScan, { addSuffix: false }) : 'Never'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Last scan
                  </span>
                </div>
              </div>

              {!isConfigured && !subredditsLoading && (
                <p className="text-center text-xs text-muted-foreground">
                  Add at least one subreddit below to start scanning.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Subreddit Manager ── */}
        <section className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold tracking-tight">Monitored subreddits</h2>
              <p className="text-xs text-muted-foreground">
                Where Reddix listens for buying intent.
              </p>
            </div>
            <Dialog open={discoveryOpen} onOpenChange={setDiscoveryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
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
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              subreddits.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="secondary"
                  className="group gap-1 rounded-full pl-3 pr-1 py-1 text-xs transition-colors hover:bg-secondary/80"
                >
                  <span className="text-muted-foreground">r/</span>
                  <span className="font-medium">{sub.subreddit_name}</span>
                  <button
                    onClick={() => removeSubreddit.mutate(sub.id)}
                    className="ml-1 rounded-full p-0.5 opacity-50 transition-opacity hover:bg-background hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}

            <div className="flex items-center gap-1 rounded-full border bg-background pl-2 pr-1 py-0.5 focus-within:ring-1 focus-within:ring-ring">
              <span className="text-xs text-muted-foreground">r/</span>
              <Input
                placeholder="add subreddit"
                value={newSubreddit}
                onChange={(e) => setNewSubreddit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && newSubreddit && addSubreddit.mutate(newSubreddit)}
                className="h-7 w-28 border-0 px-1 text-xs shadow-none focus-visible:ring-0"
              />
              <Button
                onClick={() => newSubreddit && addSubreddit.mutate(newSubreddit)}
                disabled={!newSubreddit || addSubreddit.isPending}
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {subreddits.length === 0 && !subredditsLoading && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <p className="text-xs text-muted-foreground">Quick add:</p>
              <div className="flex flex-wrap gap-1.5">
                {["webdev", "SaaS", "startups", "Entrepreneur", "smallbusiness"].map((sub) => (
                  <Badge
                    key={sub}
                    variant="outline"
                    className="cursor-pointer rounded-full text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => addSubreddit.mutate(sub)}
                  >
                    + r/{sub}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Leads ── */}
        <section>
          {user && <LeadsSection userId={user.id} isScanning={isScanning} />}
        </section>
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
