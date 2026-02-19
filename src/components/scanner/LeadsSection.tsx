import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "./LeadCard";
import { ReplyDialog } from "./ReplyDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Inbox } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

type IntentFilter = "all" | "hot" | "warm" | "research" | "low";

interface ReplyVariant {
  type: 'direct' | 'story' | 'expert';
  content: string;
  conversionScore: number;
  reasoning: string;
}

interface AnalysisResult {
  painLevel: number;
  technicalLevel: string;
  buyingStage: string;
  emotionalState: string;
  productRelevance: number;
}

interface LeadsSectionProps {
  userId: string;
  isScanning?: boolean;
}

const filterConfig: { value: IntentFilter; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "" },
  { value: "hot", label: "Hot", emoji: "🔥" },
  { value: "warm", label: "Warm", emoji: "🌡️" },
  { value: "research", label: "Research", emoji: "🔍" },
  { value: "low", label: "Low", emoji: "💤" },
];

export function LeadsSection({ userId, isScanning = false }: LeadsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(null);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedReply, setGeneratedReply] = useState("");
  const [replyVariants, setReplyVariants] = useState<ReplyVariant[]>([]);
  const [postAnalysis, setPostAnalysis] = useState<AnalysisResult | undefined>();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<IntentFilter>("all");

  // Fetch leads (exclude archived)
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'archived')
        .order('intent_score', { ascending: false })
        .order('discovered_at', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Realtime subscription for new leads
  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['leads', userId] });
          toast({ title: "🆕 New lead discovered!", description: (payload.new as Lead).thread_title?.slice(0, 60) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, toast]);

  // Count leads per intent level
  const counts = useMemo(() => {
    const c = { all: leads.length, hot: 0, warm: 0, research: 0, low: 0 };
    leads.forEach((l) => {
      const level = (l.intent_level || "low") as IntentFilter;
      if (level in c) c[level]++;
    });
    return c;
  }, [leads]);

  // Auto-select "hot" if there are hot leads, otherwise "all"
  useEffect(() => {
    if (counts.hot > 0 && activeFilter === "all") {
      setActiveFilter("hot");
    }
  }, [counts.hot]); // only on first load / when hot count changes

  const filteredLeads = useMemo(() => {
    if (activeFilter === "all") return leads;
    return leads.filter((l) => (l.intent_level || "low") === activeFilter);
  }, [leads, activeFilter]);

  const generateReplyForLead = async (leadId: string, isRegenerate = false) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (isRegenerate) {
      setIsRegenerating(true);
    } else {
      setGeneratingLeadId(leadId);
      setSelectedLead(lead);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", variant: "destructive" });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { leadId },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to generate reply');
      }

      setGeneratedReply(data.reply);
      if (data.variants && Array.isArray(data.variants)) {
        setReplyVariants(data.variants);
      } else {
        setReplyVariants([]);
      }
      if (data.analysis) setPostAnalysis(data.analysis);

      if (!isRegenerate) setDialogOpen(true);
      toast({ title: isRegenerate ? "Reply regenerated!" : "Reply generated!" });
    } catch (err: any) {
      console.error('Reply generation error:', err);
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingLeadId(null);
      setIsRegenerating(false);
    }
  };

  const handleGenerateReply = async (leadId: string) => {
    await generateReplyForLead(leadId, false);
  };

  const handleRegenerate = async () => {
    if (selectedLead) await generateReplyForLead(selectedLead.id, true);
  };

  const handleSaveLead = async (leadId: string) => {
    setSavingLeadId(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: 'engaged' })
        .eq('id', leadId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['leads', userId] });
      queryClient.invalidateQueries({ queryKey: ['saved-leads', userId] });
      toast({ title: "Lead saved to CRM!" });
    } catch (err) {
      console.error('Error saving lead:', err);
      toast({ title: "Failed to save lead", variant: "destructive" });
    } finally {
      setSavingLeadId(null);
    }
  };

  const handleDismiss = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: 'archived' })
        .eq('id', leadId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['leads', userId] });
      toast({ title: "Lead dismissed" });
    } catch (err) {
      console.error('Error dismissing lead:', err);
      toast({ title: "Failed to dismiss", variant: "destructive" });
    }
  };

  if (isLoading || isScanning) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isScanning ? 'Scanning for fresh leads...' : 'Loading leads...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Discovered Leads
            </CardTitle>
          </div>
          {/* Intent Filter Tabs */}
          {leads.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {filterConfig.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {f.emoji && <span>{f.emoji}</span>}
                  {f.label}
                  <Badge
                    variant="secondary"
                    className={`ml-0.5 h-5 min-w-[20px] justify-center text-[10px] px-1.5 ${
                      activeFilter === f.value
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : ""
                    }`}
                  >
                    {counts[f.value]}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No leads yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Configure your subreddits above, then run a scan to discover potential leads.
              </p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No {activeFilter} leads found. Try a different filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onGenerateReply={handleGenerateReply}
                  onSaveLead={handleSaveLead}
                  onDismiss={handleDismiss}
                  isGenerating={generatingLeadId === lead.id}
                  isSaving={savingLeadId === lead.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ReplyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={selectedLead}
        reply={generatedReply}
        onReplyChange={setGeneratedReply}
        variants={replyVariants}
        analysis={postAnalysis}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />
    </>
  );
}
