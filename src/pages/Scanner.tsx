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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Search, Sparkles, Zap, Clock, TrendingUp, History, RefreshCw, ChevronRight, Settings2 } from "lucide-react";
import { LeadsSection } from "@/components/scanner/LeadsSection";
import { SubredditDiscovery } from "@/components/scanner/SubredditDiscovery";
import { formatDistanceToNow } from "date-fns";

const Scanner = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newSubreddit, setNewSubreddit] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ postsScanned?: number; leadsFound?: number; hotLeads?: number; warmLeads?: number; message?: string } | null>(null);
  const [showConfig, setShowConfig] = useState(false);

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

  // Fetch keywords
  const { data: keywords = [], isLoading: keywordsLoading } = useQuery({
    queryKey: ['keywords', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch scan history
  const { data: scanHistory = [] } = useQuery({
    queryKey: ['scan-history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add subreddit mutation
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

  // Remove subreddit mutation
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

  // Add keyword mutation
  const addKeyword = useMutation({
    mutationFn: async (keyword: string) => {
      const { error } = await supabase
        .from('keywords')
        .insert({ keyword: keyword.trim(), user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
      setNewKeyword("");
      toast({ title: "Keyword added" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Remove keyword mutation
  const removeKeyword = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
      toast({ title: "Keyword removed" });
    },
  });

  // Toggle auto-pilot
  const toggleAutoPilot = async (enabled: boolean) => {
    updateProfile({ auto_pilot_enabled: enabled });
    toast({ 
      title: enabled ? "Auto-pilot enabled" : "Auto-pilot disabled",
      description: enabled ? "Leads will be discovered automatically" : "Use manual scanning"
    });
  };

  // Scan mutation
  const handleScan = async () => {
    if (subreddits.length === 0 || keywords.length === 0) {
      toast({
        title: "Configuration required",
        description: "Add at least one subreddit and one keyword to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await firecrawlApi.scanForLeads('manual');
      
      if (result.success) {
        setScanResult({
          postsScanned: result.postsScanned,
          leadsFound: result.leadsFound,
          hotLeads: result.hotLeads,
          warmLeads: result.warmLeads,
          message: result.message,
        });
        toast({
          title: "Scan complete!",
          description: result.message || `Found ${result.leadsFound} new leads`,
        });
        queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['scan-history', user?.id] });
      } else {
        toast({
          title: "Scan failed",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Scan error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const isConfigured = subreddits.length > 0 && keywords.length > 0;
  const lastScan = profile?.last_scan_at ? new Date(profile.last_scan_at) : null;
  const autoPilotEnabled = profile?.auto_pilot_enabled ?? true;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Auto-Pilot Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lead Scanner</h1>
            <p className="text-muted-foreground">
              {isConfigured 
                ? `Monitoring ${subreddits.length} subreddits with ${keywords.length} topics`
                : "Configure subreddits and keywords to find leads"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              {showConfig ? 'Hide' : 'Configure'}
            </Button>
            <Button 
              onClick={handleScan} 
              disabled={isScanning || !isConfigured}
              size="lg"
              className="gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Auto-Pilot Status Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${autoPilotEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Zap className={`h-5 w-5 ${autoPilotEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Auto-Pilot</h3>
                    <Badge variant={autoPilotEnabled ? "default" : "secondary"} className="text-xs">
                      {autoPilotEnabled ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {autoPilotEnabled 
                      ? `Scanning every ${profile?.scan_frequency_hours || 4} hours automatically`
                      : 'Enable to discover leads automatically'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {lastScan && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last scan: {formatDistanceToNow(lastScan, { addSuffix: true })}</span>
                  </div>
                )}
                <Switch
                  checked={autoPilotEnabled}
                  onCheckedChange={toggleAutoPilot}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {scanHistory.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {scanHistory.reduce((sum, s) => sum + (s.leads_found || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Leads (5 scans)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Sparkles className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {scanHistory.reduce((sum, s) => sum + (s.hot_leads || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Hot Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <RefreshCw className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scanHistory.length}</p>
                    <p className="text-xs text-muted-foreground">Recent Scans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <History className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {scanHistory.reduce((sum, s) => sum + (s.posts_scanned || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Posts Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scan Results Card */}
        {scanResult && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-700 dark:text-green-400">Latest Scan Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analyzed <strong>{scanResult.postsScanned || 0}</strong> posts and found{" "}
                    <strong>{scanResult.leadsFound || 0}</strong> qualified leads
                    {scanResult.hotLeads ? ` (${scanResult.hotLeads} hot, ${scanResult.warmLeads} warm)` : ''}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration Panel (Collapsible) */}
        {showConfig && (
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {/* Subreddits Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-primary">r/</span> Subreddits
                </CardTitle>
                <CardDescription>
                  Communities to search for leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. webdev, SaaS, startups"
                    value={newSubreddit}
                    onChange={(e) => setNewSubreddit(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && newSubreddit && addSubreddit.mutate(newSubreddit)}
                  />
                  <Button 
                    onClick={() => newSubreddit && addSubreddit.mutate(newSubreddit)}
                    disabled={!newSubreddit || addSubreddit.isPending}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {subredditsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : subreddits.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No subreddits added yet</p>
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
                </div>

                {subreddits.length === 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick add:</p>
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topics Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-4 w-4 text-primary" /> Topics
                </CardTitle>
                <CardDescription>
                  Keywords related to your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Website development, CRM software"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && newKeyword && addKeyword.mutate(newKeyword)}
                  />
                  <Button 
                    onClick={() => newKeyword && addKeyword.mutate(newKeyword)}
                    disabled={!newKeyword || addKeyword.isPending}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {keywordsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : keywords.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No topics added yet</p>
                  ) : (
                    keywords.map((kw: any) => (
                      <Badge 
                        key={kw.id} 
                        variant={kw.is_auto_generated ? "default" : "outline"} 
                        className="gap-1 pr-1"
                      >
                        {kw.keyword}
                        {kw.is_auto_generated && <Sparkles className="h-2.5 w-2.5 ml-0.5" />}
                        <button
                          onClick={() => removeKeyword.mutate(kw.id)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                {keywords.length === 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-1">
                      {["SaaS tools", "Web development", "Marketing automation", "Project management"].map((kw) => (
                        <Badge 
                          key={kw} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent text-xs"
                          onClick={() => addKeyword.mutate(kw)}
                        >
                          + {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                  <strong>🧠 Smart search:</strong> We automatically combine your topics with intent signals.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isConfigured && !showConfig && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Settings2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Scanner not configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add subreddits and topics to start finding leads
              </p>
              <Button onClick={() => setShowConfig(true)}>
                Configure Scanner
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Smart Subreddit Discovery */}
        {user && showConfig && (
          <SubredditDiscovery
            userId={user.id}
            existingSubreddits={subreddits.map(s => s.subreddit_name.toLowerCase())}
            onAddSubreddit={(name) => addSubreddit.mutate(name)}
          />
        )}

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-4 w-4 text-muted-foreground" /> Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scanHistory.map((scan: any) => (
                  <div 
                    key={scan.id} 
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={scan.scan_type === 'auto' ? 'secondary' : 'outline'} className="text-xs">
                        {scan.scan_type === 'auto' ? 'Auto' : 'Manual'}
                      </Badge>
                      <span className="text-sm">
                        {scan.leads_found || 0} leads from {scan.posts_scanned || 0} posts
                      </span>
                      {(scan.hot_leads || 0) > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {scan.hot_leads} hot
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Section */}
        {user && <LeadsSection userId={user.id} isScanning={isScanning} />}
      </div>
    </DashboardLayout>
  );
};

export default Scanner;
