import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { QWEN_URL, QWEN_KEY, QWEN_MODEL, QWEN_FAST_MODEL } from "../_shared/qwen.ts";
import { verifySubscription } from "../_shared/subscription.ts";
import { buildHeuristics, clampScore, levelFromScore } from "../_shared/intent-heuristics.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Fetch top OP-related comments from Reddit's free .json endpoint.
async function fetchTopComments(threadUrl: string, limit = 5): Promise<string[]> {
  try {
    const clean = threadUrl.split('?')[0].replace(/\/$/, '');
    const jsonUrl = `${clean}.json?limit=${limit}&sort=top`;
    const resp = await fetch(jsonUrl, {
      headers: { 'User-Agent': 'reddix-lead-analyzer/1.0' },
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    const commentsListing = Array.isArray(data) ? data[1] : null;
    const children = commentsListing?.data?.children ?? [];
    const comments: string[] = [];
    for (const c of children) {
      if (c?.kind !== 't1') continue;
      const body = c?.data?.body;
      const author = c?.data?.author || 'user';
      if (typeof body === 'string' && body.length > 5 && body.length < 800) {
        comments.push(`u/${author}: ${body}`);
      }
      if (comments.length >= limit) break;
    }
    return comments;
  } catch (e) {
    console.warn('comment fetch failed:', e);
    return [];
  }
}

async function deepAnalyze(lead: any, profile: any, comments: string[], lovableKey: string) {
  const commentBlock = comments.length > 0
    ? `\n\nTOP COMMENTS (use these to qualify intent — OP's follow-ups reveal budget, blockers, urgency):\n${comments.join('\n---\n')}`
    : '';

  const prompt = `Deeply analyze this Reddit post for PURCHASE INTENT.

PRODUCT: ${profile.product_name || 'a SaaS tool'}
DESCRIPTION: ${profile.company_description || 'Software solution'}
VALUE PROP: ${profile.value_proposition || ''}
KEY FEATURES: ${(profile.key_features || []).join(', ') || 'n/a'}
COMPETITORS: ${(profile.competitor_names || []).join(', ') || 'none'}

RUBRIC:
HOT 70-100 — direct buying signals, ready to switch, budget mentioned
WARM 40-69 — strong problem awareness, comparing options
RESEARCH 25-39 — early exploration
LOW 0-24 — not actionable

NEGATIVE: already solved -20, self-promotion -30, problem resolved in comments -15, old post -15

POST TITLE: ${lead.thread_title}
POST CONTENT: ${(lead.thread_content || '').slice(0, 1500)}
POST URL: ${lead.thread_url}${commentBlock}`;

  const resp = await fetch(QWEN_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${QWEN_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: QWEN_MODEL,
      max_tokens: 500,
      messages: [
        { role: 'system', content: 'Expert lead qualifier. Score Reddit posts honestly using both the post and any follow-up comments.' },
        { role: 'user', content: prompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'return_analysis',
          parameters: {
            type: 'object',
            properties: {
              intent_score: { type: 'number' },
              intent_level: { type: 'string', enum: ['hot', 'warm', 'research', 'low'] },
              relevance_notes: { type: 'string', description: '2-3 sentences explaining why this is/isnt a buyer, citing comments if useful' },
              confidence: { type: 'number', description: '0-1 how confident you are' },
            },
            required: ['intent_score', 'intent_level', 'relevance_notes', 'confidence'],
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
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return { _err: 'No analysis returned' };
  const parsed = JSON.parse(args);
  return {
    intent_score: clampScore(parsed.intent_score ?? 0),
    intent_level: parsed.intent_level ?? 'low',
    relevance_notes: parsed.relevance_notes ?? '',
    confidence: Math.max(0, Math.min(1, parsed.confidence ?? 0.5)),
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

    const sub = await verifySubscription(user.email ?? '');
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

    // Pull top comments (free) + run heuristics on combined text
    const comments = await fetchTopComments(lead.thread_url);
    const evalHeur = buildHeuristics(profile?.competitor_names || []);
    const combinedText = `${lead.thread_content || ''}\n${comments.join('\n')}`;
    const heur = evalHeur(lead.thread_title || '', combinedText);

    const result = await deepAnalyze(lead, profile || {}, comments, lovableKey);
    if ((result as any)._err) {
      return new Response(JSON.stringify({ success: false, error: (result as any)._err }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiScore = (result as any).intent_score as number;
    const quality = clampScore(aiScore + heur.boost);
    const finalLevel = levelFromScore(quality);

    const { data: updated, error: updateErr } = await supabase.from('leads').update({
      intent_score: aiScore,
      intent_level: finalLevel,
      relevance_notes: (result as any).relevance_notes,
      confidence: (result as any).confidence,
      quality_score: quality,
      has_competitor_mention: heur.hasCompetitor,
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
