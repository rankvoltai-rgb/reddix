import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AnalysisResult {
  painLevel: number;
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
  buyingStage: 'awareness' | 'consideration' | 'decision';
  emotionalState: 'frustrated' | 'curious' | 'desperate' | 'casual';
  keyPainPoints: string[];
  mentionedSolutions: string[];
  productRelevance: number;
  bestApproach: 'direct' | 'story' | 'educational' | 'empathy-first';
}

interface ReplyVariant {
  type: 'direct' | 'story' | 'expert';
  content: string;
  conversionScore: number;
  reasoning: string;
}

// Stage 1: Deep Analysis
async function analyzePost(lead: any, profile: any, apiKey: string): Promise<AnalysisResult> {
  const analysisPrompt = `Analyze this Reddit post for sales conversion potential. Return ONLY valid JSON.

POST:
- Subreddit: r/${lead.subreddit}
- Title: ${lead.thread_title}
- Content: ${lead.thread_content || 'No additional content'}

PRODUCT CONTEXT:
- Product: ${profile.product_name || 'Not specified'}
- Description: ${profile.company_description || 'Not specified'}
- Features: ${(profile.key_features || []).join(', ') || 'Not specified'}
- Competitors: ${(profile.competitor_names || []).join(', ') || 'Not specified'}

Analyze and return this exact JSON structure:
{
  "painLevel": <1-10 how urgent is their problem>,
  "technicalLevel": "<beginner|intermediate|advanced>",
  "buyingStage": "<awareness|consideration|decision>",
  "emotionalState": "<frustrated|curious|desperate|casual>",
  "keyPainPoints": ["<list 1-3 specific pain points from their post>"],
  "mentionedSolutions": ["<any tools/solutions they mentioned trying>"],
  "productRelevance": <1-10 how well does our product fit>,
  "bestApproach": "<direct|story|educational|empathy-first>"
}`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: analysisPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Return defaults if parsing fails
    return {
      painLevel: 5,
      technicalLevel: 'intermediate',
      buyingStage: 'consideration',
      emotionalState: 'curious',
      keyPainPoints: ['General inquiry'],
      mentionedSolutions: [],
      productRelevance: 5,
      bestApproach: 'educational',
    };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      painLevel: 5,
      technicalLevel: 'intermediate',
      buyingStage: 'consideration',
      emotionalState: 'curious',
      keyPainPoints: ['General inquiry'],
      mentionedSolutions: [],
      productRelevance: 5,
      bestApproach: 'educational',
    };
  }
}

// Stage 2 & 3: Generate Reply Variants
async function generateVariants(
  lead: any, 
  profile: any, 
  analysis: AnalysisResult, 
  apiKey: string
): Promise<ReplyVariant[]> {
  const toneGuide: Record<string, string> = {
    professional: "Formal, polished, business-appropriate",
    casual: "Relaxed, conversational, like talking to a friend",
    friendly: "Warm, helpful, approachable",
    technical: "Precise, detailed, use industry terms",
    witty: "Clever, engaging, subtle humor"
  };

  const ctaStrategy = analysis.productRelevance >= 7 
    ? "Mention product naturally if it genuinely helps"
    : analysis.productRelevance >= 4 
    ? "Focus on helping, only mention product if truly relevant"
    : "Pure value, no product mention needed";

  const pricingCta = profile.pricing_model === 'free' 
    ? "it's free to use"
    : profile.pricing_model === 'freemium' 
    ? "there's a free tier to try"
    : profile.pricing_model === 'free-trial' 
    ? "you can try it free"
    : "";

  const socialProof = profile.success_stories 
    ? `Social proof to weave in: ${profile.success_stories}`
    : "";

  const competitorContext = (profile.competitor_names || []).length > 0
    ? `If user mentions ${profile.competitor_names.join(' or ')}, acknowledge their merits but highlight your differentiators.`
    : "";

  const objectionHandling = (profile.common_objections || []).length > 0
    ? `If relevant, preemptively address concerns like: ${profile.common_objections.join(', ')}`
    : "";

  const variantsPrompt = `Generate 3 Reddit reply variants for maximum conversion. Return ONLY valid JSON.

=== ANALYSIS ===
Pain Level: ${analysis.painLevel}/10
Technical Level: ${analysis.technicalLevel}
Buying Stage: ${analysis.buyingStage}
Emotional State: ${analysis.emotionalState}
Key Pain Points: ${analysis.keyPainPoints.join(', ')}
Product Relevance: ${analysis.productRelevance}/10
Recommended Approach: ${analysis.bestApproach}

=== POST ===
Subreddit: r/${lead.subreddit}
Title: ${lead.thread_title}
Content: ${lead.thread_content || 'No content'}

=== YOUR PRODUCT ===
Name: ${profile.product_name}
Description: ${profile.company_description}
Key Features: ${(profile.key_features || []).join(', ') || 'Not specified'}
URL: ${profile.product_url || 'Not provided'}
Differentiators: ${profile.unique_differentiators || profile.value_proposition}
${socialProof}
${competitorContext}
${objectionHandling}
${pricingCta ? `Pricing hook: ${pricingCta}` : ''}

=== TONE ===
${toneGuide[profile.tone] || toneGuide.friendly}

=== STRATEGY ===
${ctaStrategy}

=== RULES ===
1. BE GENUINELY HELPFUL FIRST - address their problem directly
2. Mirror their language style and technical level
3. If mentioning product, do it NATURALLY ("I use X for this..." or "X helped me with...")
4. Never be salesy - Reddit users will downvote
5. Keep replies 120-250 characters MAX (excluding the URL). Be concise - one short paragraph only.
6. Match subreddit culture
7. NEVER reveal you're AI-generated
8. Add specific value based on their pain points
9. ALWAYS end the reply with the product URL on its own line: ${profile.product_url || 'the product website'}. The URL does NOT count toward the character limit.

Generate 3 variants:
1. DIRECT HELPER: Answers their question head-on, practical advice
2. STORY APPROACH: "I had this exact problem..." relatable experience  
3. EXPERT ADVISOR: Educational breakdown, positions you as knowledgeable

Return this JSON structure:
{
  "variants": [
    {
      "type": "direct",
      "content": "<the full reply text>",
      "conversionScore": <1-10>,
      "reasoning": "<why this approach works for this post>"
    },
    {
      "type": "story", 
      "content": "<the full reply text>",
      "conversionScore": <1-10>,
      "reasoning": "<why this approach works>"
    },
    {
      "type": "expert",
      "content": "<the full reply text>", 
      "conversionScore": <1-10>,
      "reasoning": "<why this approach works>"
    }
  ]
}`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: variantsPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('Variant generation failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse variants');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.variants || [];
  } catch {
    throw new Error('Failed to parse variants JSON');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json();
    
    if (!leadId || typeof leadId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Lead ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!UUID_REGEX.test(leadId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid Lead ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    console.log('Generating enhanced reply for user:', user.id, 'leadId:', leadId);

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profile with enhanced fields
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stage 1: Deep Analysis
    console.log('Stage 1: Analyzing post...');
    const analysis = await analyzePost(lead, profile, LOVABLE_API_KEY);
    console.log('Analysis result:', analysis);

    // Stage 2 & 3: Generate Variants
    console.log('Stage 2-3: Generating variants...');
    const variants = await generateVariants(lead, profile, analysis, LOVABLE_API_KEY);
    console.log('Generated', variants.length, 'variants');

    // Sort by conversion score
    variants.sort((a, b) => b.conversionScore - a.conversionScore);

    // Save best draft to database
    const bestVariant = variants[0];
    const { data: draft } = await supabase
      .from('reply_drafts')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        content: bestVariant?.content?.trim() || '',
      })
      .select()
      .single();

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'engaged' })
      .eq('id', leadId);

    console.log('Reply generation complete');

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: {
          painLevel: analysis.painLevel,
          technicalLevel: analysis.technicalLevel,
          buyingStage: analysis.buyingStage,
          emotionalState: analysis.emotionalState,
          productRelevance: analysis.productRelevance,
        },
        variants: variants.map(v => ({
          type: v.type,
          content: v.content.trim(),
          conversionScore: v.conversionScore,
          reasoning: v.reasoning,
        })),
        reply: bestVariant?.content?.trim() || '',
        draftId: draft?.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate reply error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
