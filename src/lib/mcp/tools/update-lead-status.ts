import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_lead_status",
  title: "Update lead status",
  description: "Move a Reddix lead through the CRM pipeline (new, engaged, replied, converted, archived).",
  inputSchema: {
    id: z.string().uuid(),
    status: z.enum(["new", "engaged", "replied", "converted", "archived"]),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("leads")
      .update({ status })
      .eq("id", id)
      .eq("user_id", ctx.getUserId())
      .select()
      .maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: "Lead not found" }], isError: true };
    return {
      content: [{ type: "text", text: `Updated lead ${id} → ${status}` }],
      structuredContent: { lead: data },
    };
  },
});
