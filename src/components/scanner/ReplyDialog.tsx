import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, Check, Sparkles, MessageSquare, BookOpen, Zap, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

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

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  reply: string;
  onReplyChange: (reply: string) => void;
  variants?: ReplyVariant[];
  analysis?: AnalysisResult;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

const variantIcons = {
  direct: Zap,
  story: MessageSquare,
  expert: BookOpen,
};

const variantLabels = {
  direct: 'Direct Helper',
  story: 'Story Approach',
  expert: 'Expert Advisor',
};

function ConversionBadge({ score }: { score: number }) {
  const color = score >= 8 ? 'bg-green-500/10 text-green-600 border-green-500/20' 
    : score >= 6 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    : 'bg-muted text-muted-foreground';
  
  return (
    <Badge variant="outline" className={`${color} gap-1`}>
      <Sparkles className="h-3 w-3" />
      {score}/10 conversion
    </Badge>
  );
}

export function ReplyDialog({ 
  open, 
  onOpenChange, 
  lead, 
  reply, 
  onReplyChange,
  variants = [],
  analysis,
  onRegenerate,
  isRegenerating = false,
}: ReplyDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('direct');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ 
        title: "Failed to copy", 
        description: "Please select and copy manually",
        variant: "destructive" 
      });
    }
  };

  const handleOpenReddit = () => {
    if (lead?.thread_url) {
      window.open(lead.thread_url, '_blank');
    }
  };

  const handleCopyAndGo = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      toast({ title: "Reply copied! Opening thread..." });
      if (lead?.thread_url) {
        window.open(lead.thread_url, '_blank');
      }
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleSelectVariant = (variant: ReplyVariant) => {
    setSelectedVariant(variant.type);
    onReplyChange(variant.content);
  };

  const hasVariants = variants.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Generated Reply
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {lead?.thread_title}
          </DialogDescription>
        </DialogHeader>

        {/* Analysis Summary */}
        {analysis && (
          <div className="flex flex-wrap gap-2 py-2 border-b border-border">
            <Badge variant="outline" className="text-xs">
              Pain: {analysis.painLevel}/10
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {analysis.technicalLevel}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {analysis.buyingStage}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {analysis.emotionalState}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Fit: {analysis.productRelevance}/10
            </Badge>
          </div>
        )}
        
        <div className="flex-1 min-h-0 py-4 overflow-hidden flex flex-col">
          {hasVariants ? (
            <Tabs defaultValue="direct" className="flex-1 flex flex-col" onValueChange={setSelectedVariant}>
              <TabsList className="grid grid-cols-3 mb-4">
                {variants.map((variant) => {
                  const Icon = variantIcons[variant.type];
                  return (
                    <TabsTrigger 
                      key={variant.type} 
                      value={variant.type}
                      className="gap-2 text-xs sm:text-sm"
                      onClick={() => handleSelectVariant(variant)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{variantLabels[variant.type]}</span>
                      <span className="sm:hidden">{variant.type}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {variants.map((variant) => (
                <TabsContent 
                  key={variant.type} 
                  value={variant.type} 
                  className="flex-1 flex flex-col gap-3 mt-0 data-[state=active]:flex"
                >
                  <div className="flex items-center justify-between">
                    <ConversionBadge score={variant.conversionScore} />
                    <p className="text-xs text-muted-foreground max-w-[60%] text-right">
                      {variant.reasoning}
                    </p>
                  </div>
                  <Textarea
                    value={selectedVariant === variant.type ? reply : variant.content}
                    onChange={(e) => {
                      if (selectedVariant === variant.type) {
                        onReplyChange(e.target.value);
                      }
                    }}
                    className="flex-1 min-h-[200px] resize-none text-sm"
                    placeholder="Your reply will appear here..."
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Textarea
              value={reply}
              onChange={(e) => onReplyChange(e.target.value)}
              className="min-h-[200px] h-full resize-none text-sm"
              placeholder="Your reply will appear here..."
            />
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-wrap">
          {onRegenerate && (
            <Button
              variant="ghost"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Reply
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenReddit}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Thread
          </Button>
          <Button
            onClick={handleCopyAndGo}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy & Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
