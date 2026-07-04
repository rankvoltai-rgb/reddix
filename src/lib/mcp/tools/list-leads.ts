import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_leads",
  title: "List Reddit leads",
  description:
    "List the signed-in user's saved Reddit leads from Reddix, optionally filtered by intent level and status.",
  inputSchema: {
    intent_level: z
      .enum(["hot", "warm", "research", "low"])
      .optional()
      .describe("Filter by intent classification."),
    status: z
      .enum(["new", "engaged", "replied", "converted", "archived"])
      .optional()
      .describe("Filter by CRM status."),
    limit: z.number().int().min(1).max(100).default(25),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ intent_level, status, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = supabaseForUser(ctx)
      .from("leads")
      .select(
        "id, thread_title, thread_url, subreddit, intent_level, intent_score, status, relevance_notes, created_at",
      )
      .eq("user_id", ctx.getUserId())
      .order("intent_score", { ascending: false })
      .limit(limit);
    if (intent_level) q = q.eq("intent_level", intent_level);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { leads: data ?? [] },
    };
  },
});
