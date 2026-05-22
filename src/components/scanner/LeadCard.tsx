import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Loader2, User, Bookmark, BookmarkCheck, X, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

interface LeadCardProps {
  lead: Lead;
  onGenerateReply: (leadId: string) => void;
  onAnalyze?: (leadId: string) => void;
  onSaveLead?: (leadId: string) => void;
  onDismiss?: (leadId: string) => void;
  isGenerating: boolean;
  isAnalyzing?: boolean;
  isSaving?: boolean;
  showSaveButton?: boolean;
}

const intentConfig = {
  hot: {
    label: "🔥 Hot",
    className: "intent-hot",
    borderColor: "border-l-red-500",
  },
  warm: {
    label: "🌡️ Warm",
    className: "intent-warm",
    borderColor: "border-l-amber-500",
  },
  research: {
    label: "🔍 Research",
    className: "intent-research",
    borderColor: "border-l-blue-500",
  },
  low: {
    label: "💤 Low",
    className: "intent-low",
    borderColor: "border-l-gray-400",
  },
};

export function LeadCard({ lead, onGenerateReply, onSaveLead, onDismiss, isGenerating, isSaving = false, showSaveButton = true }: LeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const intentLevel = lead.intent_level || "low";
  const config = intentConfig[intentLevel as keyof typeof intentConfig] || intentConfig.low;
  
  const truncatedContent = lead.thread_content && lead.thread_content.length > 150
    ? lead.thread_content.slice(0, 150) + "..."
    : lead.thread_content;

  const shouldShowExpand = lead.thread_content && lead.thread_content.length > 150;

  return (
    <Card className={cn("border-l-4 hover:shadow-md transition-shadow group relative", config.borderColor)}>
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(lead.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Dismiss lead"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Intent & Score Row */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Score: {lead.intent_score || 0}
              </span>
              {lead.status && lead.status !== "new" && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {lead.status}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-2">
              {lead.thread_title || "Untitled Post"}
            </h3>
            
            {/* Content Preview */}
            {lead.thread_content && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isExpanded ? lead.thread_content : truncatedContent}
                </p>
                {shouldShowExpand && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
            
            {/* Meta Row */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="font-normal">
                r/{lead.subreddit}
              </Badge>
              {lead.author && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  u/{lead.author}
                </span>
              )}
              {lead.discovered_at && (
                <span>
                  {formatDistanceToNow(new Date(lead.discovered_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex gap-2">
              {showSaveButton && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-9 h-9 p-0"
                  onClick={() => onSaveLead?.(lead.id)}
                  disabled={isSaving || lead.status !== 'new'}
                  title={lead.status !== 'new' ? 'Already saved' : 'Save to CRM'}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : lead.status !== 'new' ? (
                    <BookmarkCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-9 h-9 p-0"
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
            </div>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => onGenerateReply(lead.id)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
