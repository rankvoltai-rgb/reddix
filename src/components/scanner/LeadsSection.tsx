import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCard } from "./LeadCard";
import { ReplyDialog } from "./ReplyDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Inbox } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

interface LeadsSectionProps {
  userId: string;
  isScanning?: boolean;
}

export function LeadsSection({ userId, isScanning = false }: LeadsSectionProps) {
  const { toast } = useToast();
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedReply, setGeneratedReply] = useState("");

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('intent_score', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const handleGenerateReply = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setGeneratingLeadId(leadId);
    setSelectedLead(lead);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ 
          title: "Not authenticated", 
          variant: "destructive" 
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { leadId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to generate reply');
      }

      setGeneratedReply(data.reply);
      setDialogOpen(true);
      toast({ title: "Reply generated!" });

    } catch (err: any) {
      console.error('Reply generation error:', err);
      toast({ 
        title: "Generation failed", 
        description: err.message,
        variant: "destructive" 
      });
    } finally {
      setGeneratingLeadId(null);
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Discovered Leads
            {leads.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({leads.length})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Leads from your scans, sorted by purchase intent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No leads yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Configure your subreddits and keywords above, then run a scan to discover potential leads.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onGenerateReply={handleGenerateReply}
                  isGenerating={generatingLeadId === lead.id}
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
      />
    </>
  );
}
