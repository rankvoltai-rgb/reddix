import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Plus, TrendingUp, Users, Target, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubredditSuggestion {
  name: string;
  relevance_score: number;
  reasoning: string;
  typical_intent_signals: string[];
  estimated_activity: "high" | "medium" | "low";
  category: "primary" | "secondary" | "niche";
}

interface DiscoveryResult {
  suggestions: SubredditSuggestion[];
  analysis_summary: string;
}

interface SubredditDiscoveryProps {
  userId: string;
  existingSubreddits: string[];
  onAddSubreddit: (name: string) => void;
}

export function SubredditDiscovery({ userId, existingSubreddits, onAddSubreddit }: SubredditDiscoveryProps) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [addedSubreddits, setAddedSubreddits] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDiscover = async () => {
    setIsDiscovering(true);
    setResult(null);
    setAddedSubreddits(new Set());

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Not signed in
        return;
      }

      const response = await supabase.functions.invoke('discover-subreddits', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error) throw new Error(response.error.message);
      if (!response.data.success) throw new Error(response.data.error || 'Discovery failed');

      setResult({
        suggestions: response.data.suggestions,
        analysis_summary: response.data.analysis_summary,
      });

      toast({ title: "Discovery complete!", description: `Found ${response.data.suggestions.length} subreddit suggestions` });
    } catch (error: any) {
      console.error('Discovery error:', error);
      // Discovery failed silently
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAddSuggestion = async (name: string) => {
    try {
      const { error } = await supabase
        .from('monitored_subreddits')
        .insert({ subreddit_name: name.toLowerCase(), user_id: userId });
      if (error) throw error;

      setAddedSubreddits(prev => new Set([...prev, name.toLowerCase()]));
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
      toast({ title: `Added r/${name}` });
    } catch (error: any) {
      // Add subreddit failed silently
    }
  };

  const handleAddAll = async (category?: "primary" | "secondary" | "niche") => {
    const toAdd = result?.suggestions.filter(s => {
      if (category && s.category !== category) return false;
      if (addedSubreddits.has(s.name.toLowerCase())) return false;
      if (existingSubreddits.includes(s.name.toLowerCase())) return false;
      return true;
    }) || [];

    for (const suggestion of toAdd) {
      await handleAddSuggestion(suggestion.name);
    }
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "high": return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "medium": return <Users className="h-3 w-3 text-amber-500" />;
      case "low": return <Target className="h-3 w-3 text-muted-foreground" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "primary": return "bg-primary/10 text-primary border-primary/30";
      case "secondary": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "niche": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      default: return "";
    }
  };

  const isAlreadyAdded = (name: string) => {
    return addedSubreddits.has(name.toLowerCase()) || existingSubreddits.includes(name.toLowerCase());
  };

  if (!result) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground mb-4">
          Discover subreddits where your potential customers are actively discussing problems your product solves.
        </p>
        <Button onClick={handleDiscover} disabled={isDiscovering} className="gap-2">
          {isDiscovering ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your product...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Discover Subreddits
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-3 text-sm">
        <p className="font-medium mb-1">AI Analysis</p>
        <p className="text-muted-foreground">{result.analysis_summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAddAll("primary")} className="gap-1">
          <Plus className="h-3 w-3" /> Add Primary
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddAll()} className="gap-1">
          <Plus className="h-3 w-3" /> Add All
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDiscover} className="ml-auto gap-1">
          <Sparkles className="h-3 w-3" /> Refresh
        </Button>
      </div>

      <div className="grid gap-3">
        {result.suggestions.map((suggestion) => (
          <div
            key={suggestion.name}
            className={cn(
              "rounded-lg border p-3 transition-all",
              isAlreadyAdded(suggestion.name) ? "opacity-60 bg-muted/30" : "hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">r/{suggestion.name}</span>
                  <Badge variant="outline" className={cn("text-xs", getCategoryColor(suggestion.category))}>
                    {suggestion.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getActivityIcon(suggestion.estimated_activity)}
                    {suggestion.estimated_activity}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.relevance_score}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{suggestion.reasoning}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {suggestion.typical_intent_signals.slice(0, 3).map((signal) => (
                    <Badge key={signal} variant="outline" className="text-xs font-normal">
                      "{signal}"
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant={isAlreadyAdded(suggestion.name) ? "ghost" : "default"}
                disabled={isAlreadyAdded(suggestion.name)}
                onClick={() => handleAddSuggestion(suggestion.name)}
                className="shrink-0"
              >
                {isAlreadyAdded(suggestion.name) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
