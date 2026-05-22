import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REPLY_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface ReplyVariant {
  type: 'direct' | 'story' | 'expert';
  content: string;
  conversionScore: number;
  reasoning: string;
}

interface CombinedResult {
  analysis: {
    painLevel: number;
    technicalLevel: 'beginner' | 'intermediate' | 'advanced';
    buyingStage: 'awareness' | 'consideration' | 'decision';
    emotionalState: 'frustrated' | 'curious' | 'desperate' | 'casual';
    productRelevance: number;
  };
  variants: ReplyVariant[];
}

// Single-call merged analyzer + variant generator using tool calling.
async function analyzeAndGenerate(lead: any, profile: any, apiKey: string): Promise<CombinedResult> {
  const toneGuide: Record<string, string> = {
    professional: "Formal, polished, business-appropriate",
    casual: "Relaxed, conversational, like talking to a friend",
    friendly: "Warm, helpful, approachable",
    technical: "Precise, detailed, use industry terms",
    witty: "Clever, engaging, subtle humor",
  };

  const pricingCta = profile.pricing_model === 'free'
    ? "it's free to use"
    : profile.pricing_model === 'freemium'
    ? "there's a free tier to try"
    : profile.pricing_model === 'free-trial'
    ? "you can try it free"
    : "";

  const prompt = `You will analyze a Reddit post AND generate 3 reply variants in a SINGLE response using the provided tool.

=== POST ===
Subreddit: r/${lead.subreddit}
Title: ${lead.thread_title}
Content: ${(lead.thread_content || 'No content').slice(0, 1500)}

=== PRODUCT ===
Name: ${profile.product_name || 'Not specified'}
Description: ${profile.company_description || 'Not specified'}
Features: ${(profile.key_features || []).join(', ') || 'Not specified'}
Competitors: ${(profile.competitor_names || []).join(', ') || 'Not specified'}
URL: ${profile.product_url || 'Not provided'}
Differentiators: ${profile.unique_differentiators || profile.value_proposition || ''}
${pricingCta ? `Pricing hook: ${pricingCta}` : ''}

=== TONE ===
${toneGuide[profile.tone] || toneGuide.friendly}

=== REPLY RULES ===
1. Be genuinely helpful first
2. Mirror user's language + technical level
3. If mentioning product, do it naturally — never salesy
4. 120–250 chars MAX per reply (excluding the URL)
5. Match subreddit culture, never reveal AI origin
6. End each reply with the product URL on its own line: ${profile.product_url || 'the product website'} (URL excluded from char limit)

=== VARIANT TYPES ===
- direct: head-on practical answer
- story:  "I had this exact problem..." relatable
- expert: educational breakdown, knowledgeable framing`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      max_tokens: 1200,
      messages: [
        { role: 'system', content: 'You are a Reddit conversion expert. Always call the return_result tool.' },
        { role: 'user', content: prompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'return_result',
          description: 'Return post analysis and 3 reply variants in one call',
          parameters: {
            type: 'object',
            properties: {
              analysis: {
                type: 'object',
                properties: {
                  painLevel: { type: 'number' },
                  technicalLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                  buyingStage: { type: 'string', enum: ['awareness', 'consideration', 'decision'] },
                  emotionalState: { type: 'string', enum: ['frustrated', 'curious', 'desperate', 'casual'] },
                  productRelevance: { type: 'number' },
                },
                required: ['painLevel', 'technicalLevel', 'buyingStage', 'emotionalState', 'productRelevance'],
              },
              variants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['direct', 'story', 'expert'] },
                    content: { type: 'string' },
                    conversionScore: { type: 'number' },
                    reasoning: { type: 'string' },
                  },
                  required: ['type', 'content', 'conversionScore', 'reasoning'],
                },
              },
            },
            required: ['analysis', 'variants'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'return_result' } },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    throw new Error('No tool call returned');
  }
  const parsed = JSON.parse(toolCall.function.arguments) as CombinedResult;
  if (!parsed.variants || parsed.variants.length === 0) {
    throw new Error('No variants returned');
  }
  return parsed;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { leadId, regenerate = false } = body;

    if (!leadId || typeof leadId !== 'string' || !UUID_REGEX.test(leadId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid Lead ID' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lead not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Cache short-circuit: skip AI call if we already generated recently ──
    if (!regenerate && lead.cached_replies && lead.replies_generated_at) {
      const ageMs = Date.now() - new Date(lead.replies_generated_at).getTime();
      if (ageMs < REPLY_CACHE_TTL_MS) {
        const cached = lead.cached_replies as CombinedResult;
        const best = cached.variants?.[0];
        console.log(`Cache hit for lead ${leadId} (age: ${Math.round(ageMs / 1000)}s) — skipping AI call`);
        return new Response(
          JSON.stringify({
            success: true,
            cached: true,
            analysis: cached.analysis,
            variants: cached.variants,
            reply: best?.content?.trim() || '',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating reply (single-call) for lead ${leadId}`);
    const result = await analyzeAndGenerate(lead, profile, LOVABLE_API_KEY);

    // Sort by conversion score
    result.variants.sort((a, b) => b.conversionScore - a.conversionScore);
    const bestVariant = result.variants[0];

    // Cache full result on the lead
    await supabase
      .from('leads')
      .update({
        cached_replies: result,
        replies_generated_at: new Date().toISOString(),
        status: 'engaged',
      })
      .eq('id', leadId);

    // Save best draft
    const { data: draft } = await supabase
      .from('reply_drafts')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        content: bestVariant?.content?.trim() || '',
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        cached: false,
        analysis: result.analysis,
        variants: result.variants.map(v => ({
          type: v.type,
          content: v.content.trim(),
          conversionScore: v.conversionScore,
          reasoning: v.reasoning,
        })),
        reply: bestVariant?.content?.trim() || '',
        draftId: draft?.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate reply error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
