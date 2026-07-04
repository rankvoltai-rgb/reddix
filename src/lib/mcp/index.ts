import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeads from "./tools/list-leads";
import getLead from "./tools/get-lead";
import listKeywords from "./tools/list-keywords";
import listSubreddits from "./tools/list-subreddits";
import updateLeadStatus from "./tools/update-lead-status";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "reddix-mcp",
  title: "Reddix MCP",
  version: "0.1.0",
  instructions:
    "Reddix tools for AI assistants. Read Reddit leads scored by intent, view tracked keywords and monitored subreddits, and update lead CRM status for the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeads, getLead, listKeywords, listSubreddits, updateLeadStatus],
});
