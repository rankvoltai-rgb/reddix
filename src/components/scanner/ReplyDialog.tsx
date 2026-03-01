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
import { Copy, Check, Sparkles, MessageSquare, BookOpen, Zap, RefreshCw } from "lucide-react";
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
  direct: 'Direct',
  story: 'Story',
  expert: 'Expert',
};

function ConversionBadge({ score }: { score: number }) {
  const color = score >= 8 ? 'bg-green-500/10 text-green-600 border-green-500/20' 
    : score >= 6 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    : 'bg-muted text-muted-foreground';
  
  return (
    <Badge variant="outline" className={`${color} gap-1 text-xs`}>
      <Sparkles className="h-3 w-3" />
      {score}/10
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
      toast({ title: "Failed to copy", variant: "destructive" });
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-8 flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Reply
          </DialogTitle>
          <DialogDescription className="line-clamp-1 text-xs">
            {lead?.thread_title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3">
          {hasVariants ? (
            <Tabs defaultValue="direct" onValueChange={setSelectedVariant}>
              <div className="flex items-center gap-2 mb-3">
                <TabsList className="h-8">
                  {variants.map((variant) => {
                    const Icon = variantIcons[variant.type];
                    return (
                      <TabsTrigger 
                        key={variant.type} 
                        value={variant.type}
                        className="gap-1.5 text-xs px-3 h-7"
                        onClick={() => handleSelectVariant(variant)}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {variantLabels[variant.type]}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {variants.find(v => v.type === selectedVariant) && (
                  <ConversionBadge score={variants.find(v => v.type === selectedVariant)!.conversionScore} />
                )}
              </div>

              {variants.map((variant) => (
                <TabsContent 
                  key={variant.type} 
                  value={variant.type} 
                  className="mt-0"
                >
                  <Textarea
                    value={selectedVariant === variant.type ? reply : variant.content}
                    onChange={(e) => {
                      if (selectedVariant === variant.type) {
                        onReplyChange(e.target.value);
                      }
                    }}
                    className="min-h-[100px] resize-none text-sm"
                    placeholder="Your reply will appear here..."
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Textarea
              value={reply}
              onChange={(e) => onReplyChange(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
              placeholder="Your reply will appear here..."
            />
          )}
          <p className="text-xs text-muted-foreground mt-1.5 text-right tabular-nums">
            {reply.length} chars
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isRegenerating} className="gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <><Check className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
          </Button>
          <Button size="sm" onClick={handleCopyAndGo} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy & Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
