import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { verifySubscription } from "../_shared/subscription.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function deepAnalyze(lead: any, profile: any, lovableKey: string) {
  const prompt = `Deeply analyze this Reddit post for PURCHASE INTENT.

PRODUCT: ${profile.product_name || 'a SaaS tool'}
DESCRIPTION: ${profile.company_description || 'Software solution'}
VALUE PROP: ${profile.value_proposition || 'Solves business problems'}
KEY FEATURES: ${(profile.key_features || []).join(', ') || 'Not specified'}
COMPETITORS: ${(profile.competitor_names || []).join(', ') || 'None'}

SCORING RUBRIC:
HOT (70-100) — Direct buying signals: asking for recommendations, complaining about current solution AND seeking alternatives, budget/pricing discussions, "ready to switch"
WARM (40-69) — Strong problem awareness: describing a problem the product solves, mentioning competitor pain points, workflow complaints
RESEARCH (25-39) — Early exploration: comparing approaches, general interest in the problem space
LOW (0-24) — Not actionable: general discussion, already solved, self-promotion, news sharing

NEGATIVE SIGNALS: already solved -20, self-promotion -30, problem resolved in comments -15, old post -15

POST TITLE: ${lead.thread_title}
POST CONTENT: ${(lead.thread_content || '').slice(0, 1500)}
POST URL: ${lead.thread_url}`;

  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-lite',
      max_tokens: 500,
      messages: [
        { role: 'system', content: 'Expert lead qualifier. Score Reddit posts honestly.' },
        { role: 'user', content: prompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'return_analysis',
          description: 'Return lead analysis',
          parameters: {
            type: 'object',
            properties: {
              intent_score: { type: 'number' },
              intent_level: { type: 'string', enum: ['hot', 'warm', 'research', 'low'] },
              relevance_notes: { type: 'string', description: '2-3 sentences explaining why this is/isnt a buyer' },
            },
            required: ['intent_score', 'intent_level', 'relevance_notes'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'return_analysis' } },
    }),
  });

  if (!resp.ok) {
    if (resp.status === 429) return { _err: 'Rate limited — please wait a moment and try again.' };
    if (resp.status === 402) return { _err: 'AI credits exhausted. Please add funds to continue analyzing.' };
    return { _err: 'AI analysis failed' };
  }

  const data = await resp.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) return { _err: 'No analysis returned' };
  const parsed = JSON.parse(toolCall.function.arguments);
  return {
    intent_score: parsed.intent_score ?? 0,
    intent_level: parsed.intent_level ?? 'low',
    relevance_notes: parsed.relevance_notes ?? '',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY')!;

    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const sub = await verifySubscription(user.email ?? "");
    if (!sub.subscribed) {
      return new Response(JSON.stringify({ success: false, error: 'Active subscription required.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }


    const { lead_id } = await req.json();
    if (!lead_id) {
      return new Response(JSON.stringify({ success: false, error: 'lead_id required' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).eq('user_id', user.id).single();
    if (!lead) {
      return new Response(JSON.stringify({ success: false, error: 'Lead not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: profile } = await supabase.from('profiles')
      .select('product_name, company_description, value_proposition, key_features, competitor_names')
      .eq('id', user.id).single();

    const result = await deepAnalyze(lead, profile || {}, lovableKey);
    if ((result as any)._err) {
      return new Response(JSON.stringify({ success: false, error: (result as any)._err }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: updated, error: updateErr } = await supabase.from('leads').update({
      intent_score: (result as any).intent_score,
      intent_level: (result as any).intent_level,
      relevance_notes: (result as any).relevance_notes,
      deep_analyzed: true,
      analyzed_at: new Date().toISOString(),
    }).eq('id', lead_id).select().single();

    if (updateErr) {
      return new Response(JSON.stringify({ success: false, error: 'Update failed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, lead: updated }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('analyze-lead error:', e);
    return new Response(JSON.stringify({ success: false, error: 'Analysis failed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
