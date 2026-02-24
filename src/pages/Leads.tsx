import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Users,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const statusConfig = {
  engaged: { label: "Engaged", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  replied: { label: "Replied", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  converted: { label: "Converted", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};

const intentConfig = {
  hot: { label: "🔥 Hot", className: "text-red-500" },
  warm: { label: "🌡️ Warm", className: "text-amber-500" },
  research: { label: "🔍 Research", className: "text-blue-500" },
  low: { label: "💤 Low", className: "text-gray-400" },
};

export default function Leads() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
      return;
    }

    const hasAccess = subscribed || (profile as any)?.selected_plan === 'free';
    if (!subLoading && !hasAccess && profile?.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, navigate]);

  const { data: leads, isLoading } = useQuery({
    queryKey: ['saved-leads', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user!.id)
        .neq('status', 'new')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!user?.id,
  });

  const handleStatusChange = async (leadId: string, newStatus: "engaged" | "replied" | "converted" | "archived") => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['saved-leads', user?.id] });
      toast({ title: `Status updated to ${newStatus}` });
    } catch (err) {
      console.error('Error updating status:', err);
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['saved-leads', user?.id] });
      toast({ title: "Lead deleted" });
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast({ title: "Failed to delete lead", variant: "destructive" });
    }
  };

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchQuery === "" || 
      lead.thread_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.subreddit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.author?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesIntent = intentFilter === "all" || lead.intent_level === intentFilter;
    
    return matchesSearch && matchesStatus && matchesIntent;
  });

  if (authLoading || profileLoading || subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Leads</h1>
          <p className="text-muted-foreground">Manage your saved leads and track their status</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="engaged">Engaged</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={intentFilter} onValueChange={setIntentFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Intent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intent</SelectItem>
                    <SelectItem value="hot">🔥 Hot</SelectItem>
                    <SelectItem value="warm">🌡️ Warm</SelectItem>
                    <SelectItem value="research">🔍 Research</SelectItem>
                    <SelectItem value="low">💤 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Leads ({filteredLeads?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !filteredLeads || filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No saved leads yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Go to the Scanner page and save leads you want to follow up on.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => {
                  const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.engaged;
                  const intent = intentConfig[lead.intent_level as keyof typeof intentConfig] || intentConfig.low;
                  
                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className={cn("text-xs", status.className)}>
                              {status.label}
                            </Badge>
                            <span className={cn("text-xs font-medium", intent.className)}>
                              {intent.label}
                            </span>
                            <Badge variant="outline" className="text-xs font-normal">
                              r/{lead.subreddit}
                            </Badge>
                          </div>
                          
                          <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                            {lead.thread_title || "Untitled Post"}
                          </h3>
                          
                          {lead.thread_content && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {lead.thread_content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {lead.author && <span>u/{lead.author}</span>}
                            {lead.updated_at && (
                              <span>Updated {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <Select
                            value={lead.status || 'engaged'}
                            onValueChange={(value: "engaged" | "replied" | "converted" | "archived") => handleStatusChange(lead.id, value)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engaged">Engaged</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <a
                              href={lead.thread_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open in Reddit"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteLead(lead.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
