import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Search, Sparkles, Zap, Clock } from "lucide-react";
import { LeadsSection } from "@/components/scanner/LeadsSection";
import { SubredditDiscovery } from "@/components/scanner/SubredditDiscovery";
import { formatDistanceToNow, differenceInSeconds, intervalToDuration } from "date-fns";

const Scanner = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newSubreddit, setNewSubreddit] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);

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
      navigate("/subscribe");
    }
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, navigate]);

  if (authLoading || profileLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fetch subreddits
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

  // Mutations
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
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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


  const toggleAutoPilot = async (enabled: boolean) => {
    updateProfile({ auto_pilot_enabled: enabled });
    toast({
      title: enabled ? "Auto-pilot enabled" : "Auto-pilot disabled",
      description: enabled ? "Leads will be discovered automatically" : "Use manual scanning",
    });
  };

  const handleScan = async () => {
    if (subreddits.length === 0) {
      toast({
        title: "Configuration required",
        description: "Add at least one subreddit to scan.",
        variant: "destructive",
      });
      return;
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
      } else {
        toast({ title: "Scan failed", description: result.error || "Something went wrong", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Scan error", description: error.message, variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  const isConfigured = subreddits.length > 0;
  const lastScan = profile?.last_scan_at ? new Date(profile.last_scan_at) : null;
  const autoPilotEnabled = profile?.auto_pilot_enabled ?? true;
  const nextScheduledScan = profile?.next_scheduled_scan_at ? new Date(profile.next_scheduled_scan_at) : null;

  // Simple next-scan text
  const getNextScanText = () => {
    if (!nextScheduledScan || !autoPilotEnabled) return null;
    const now = new Date();
    const secondsRemaining = differenceInSeconds(nextScheduledScan, now);
    if (secondsRemaining <= 0) return "Scanning soon…";
    const duration = intervalToDuration({ start: now, end: nextScheduledScan });
    const parts: string[] = [];
    if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes !== undefined) parts.push(`${duration.minutes}m`);
    return parts.join(' ') || "Soon";
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* ── Command Bar ── */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <Button
            onClick={handleScan}
            disabled={isScanning || !isConfigured}
            className="gap-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Scan Now
              </>
            )}
          </Button>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${autoPilotEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium">Auto-Pilot</span>
            <Switch checked={autoPilotEnabled} onCheckedChange={toggleAutoPilot} />
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            {lastScan && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(lastScan, { addSuffix: true })}
              </span>
            )}
            {autoPilotEnabled && getNextScanText() && (
              <span className="text-primary font-medium">Next: {getNextScanText()}</span>
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
          {/* Subreddits row */}
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
    </DashboardLayout>
  );
};

export default Scanner;
