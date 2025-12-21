import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Search, Sparkles } from "lucide-react";

const Scanner = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newSubreddit, setNewSubreddit] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ postsScanned?: number; leadsFound?: number; message?: string } | null>(null);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (!profileLoading && profile && !profile.onboarding_completed) {
    navigate("/onboarding");
    return null;
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
      const result = await firecrawlApi.scanForLeads();
      
      if (result.success) {
        setScanResult({
          postsScanned: result.postsScanned,
          leadsFound: result.leadsFound,
          message: result.message,
        });
        toast({
          title: "Scan complete!",
          description: result.message || `Found ${result.leadsFound} new leads`,
        });
        queryClient.invalidateQueries({ queryKey: ['leads'] });
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

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reddit Scanner</h1>
            <p className="text-muted-foreground">Configure subreddits and keywords to find leads</p>
          </div>
          <Button 
            onClick={handleScan} 
            disabled={isScanning || subreddits.length === 0 || keywords.length === 0}
            size="lg"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Now
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Subreddits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-primary">r/</span> Subreddits
              </CardTitle>
              <CardDescription>
                Add subreddits where your target audience hangs out
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subreddits.length === 0 && (
                <div className="pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggested subreddits:</p>
                  <div className="flex flex-wrap gap-1">
                    {["SaaS", "startups", "Entrepreneur", "smallbusiness", "marketing"].map((sub) => (
                      <Badge 
                        key={sub} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => addSubreddit.mutate(sub)}
                      >
                        + r/{sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. entrepreneur, startups"
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
            </CardContent>
          </Card>

          {/* Keywords Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Keywords
              </CardTitle>
              <CardDescription>
                Trigger phrases that indicate purchase intent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. looking for, any recommendations"
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
                  <p className="text-sm text-muted-foreground">No keywords added yet</p>
                ) : (
                  keywords.map((kw) => (
                    <Badge key={kw.id} variant="outline" className="gap-1 pr-1">
                      {kw.keyword}
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
                  <p className="text-xs text-muted-foreground mb-2">Suggested high-intent keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "looking for a tool",
                      "need recommendation",
                      "any suggestions for",
                      "what do you use for",
                      "best software for",
                      "alternative to",
                      "help me find"
                    ].map((kw) => (
                      <Badge 
                        key={kw} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => addKeyword.mutate(kw)}
                      >
                        + {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scan Results Card */}
        {scanResult && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-green-700 dark:text-green-400">Last Scan Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analyzed <strong>{scanResult.postsScanned || 0}</strong> posts and found{" "}
                    <strong>{scanResult.leadsFound || 0}</strong> qualified leads.
                    {scanResult.leadsFound === 0 && scanResult.postsScanned && scanResult.postsScanned > 0 && (
                      <span className="block mt-1 text-amber-600 dark:text-amber-400">
                        Tip: Try adding more specific intent keywords like "looking for a tool" or "need recommendation"
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">How scanning works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We search each subreddit for posts from the past month containing your keywords, 
                  then use AI to analyze purchase intent. Leads scoring 10+ are saved to your list.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Scanner;
