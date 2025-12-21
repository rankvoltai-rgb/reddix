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
import { Copy, ExternalLink, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  reply: string;
  onReplyChange: (reply: string) => void;
}

export function ReplyDialog({ 
  open, 
  onOpenChange, 
  lead, 
  reply, 
  onReplyChange 
}: ReplyDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">Generated Reply</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {lead?.thread_title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 py-4">
          <Textarea
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            className="min-h-[200px] h-full resize-none text-sm"
            placeholder="Your reply will appear here..."
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
            onClick={handleOpenReddit}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Reddit Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
