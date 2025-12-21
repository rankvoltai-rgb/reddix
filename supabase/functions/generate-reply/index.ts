import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json();
    
    // Input validation - validate leadId format
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

    // Get user from auth header
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

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating reply for user:', user.id, 'leadId:', leadId);

    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      console.error('Lead fetch error:', leadError);
      return new Response(
        JSON.stringify({ success: false, error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile for context
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate reply using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const toneGuide = {
      professional: "Use a professional, polished tone. Be respectful and formal.",
      casual: "Use a relaxed, conversational tone. Feel free to be informal.",
      friendly: "Be warm, approachable, and helpful. Use a friendly demeanor.",
      technical: "Be precise and technical. Use industry terminology where appropriate.",
      witty: "Be clever and engaging. Add subtle humor where natural."
    };

    const prompt = `You are a helpful Reddit community member. Generate a genuine, helpful reply to this Reddit post.

**Post Details:**
- Subreddit: r/${lead.subreddit}
- Title: ${lead.thread_title}
- Content: ${lead.thread_content || 'No additional content'}

**Your Product Context (use subtly if relevant):**
- Product: ${profile.product_name || 'Not specified'}
- Description: ${profile.company_description || 'Not specified'}
- Value Proposition: ${profile.value_proposition || 'Not specified'}
- Target Audience: ${profile.target_audience || 'Not specified'}

**Tone Preference:** ${profile.tone || 'friendly'}
${toneGuide[profile.tone as keyof typeof toneGuide] || toneGuide.friendly}

**CRITICAL RULES:**
1. BE GENUINELY HELPFUL FIRST - Address the user's question/problem directly
2. Only mention your product if it's truly relevant to their problem
3. DO NOT be salesy or promotional - Reddit users hate that
4. If mentioning your product, do it naturally like "I've been using X for this..." 
5. Keep it concise (2-4 paragraphs max)
6. Match the subreddit's culture and tone
7. Add value to the conversation even if you don't mention your product
8. NEVER say "As an AI" or reveal you're generated

Generate only the reply text, nothing else.`;

    console.log('Generating reply with Lovable AI...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedReply = aiData.choices?.[0]?.message?.content;

    if (!generatedReply) {
      console.error('No content in AI response:', aiData);
      return new Response(
        JSON.stringify({ success: false, error: 'No reply generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save draft to database
    const { data: draft, error: draftError } = await supabase
      .from('reply_drafts')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        content: generatedReply.trim(),
      })
      .select()
      .single();

    if (draftError) {
      console.error('Draft save error:', draftError);
      // Still return the reply even if saving failed
    }

    // Update lead status to engaged
    await supabase
      .from('leads')
      .update({ status: 'engaged' })
      .eq('id', leadId);

    console.log('Reply generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        reply: generatedReply.trim(),
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
