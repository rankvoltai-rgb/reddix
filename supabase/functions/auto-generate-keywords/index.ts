import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { verifySubscription } from "../_shared/subscription.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has auto-generated keywords
    const { data: existingKeywords } = await supabase
      .from('keywords')
      .select('keyword')
      .eq('user_id', user.id);

    const existingKeywordList = (existingKeywords || []).map(k => k.keyword.toLowerCase());

    console.log('Generating keywords from profile for user:', user.id);
    console.log('Profile data:', {
      product_name: profile.product_name,
      company_description: profile.company_description?.slice(0, 100),
      key_features: profile.key_features,
      competitor_names: profile.competitor_names,
      target_audience: profile.target_audience,
    });

    const prompt = `You are an expert at identifying high-value search keywords for Reddit lead generation.

Analyze this product and generate 10-15 optimal topic keywords that will help find potential customers on Reddit:

**Product Name:** ${profile.product_name || 'Unknown'}
**Description:** ${profile.company_description || 'Not specified'}
**Target Audience:** ${profile.target_audience || 'Not specified'}
**Value Proposition:** ${profile.value_proposition || 'Not specified'}
**Key Features:** ${(profile.key_features || []).join(', ') || 'Not specified'}
**Competitors:** ${(profile.competitor_names || []).join(', ') || 'Not specified'}
**Pricing Model:** ${profile.pricing_model || 'Not specified'}

**Already have (exclude these):** ${existingKeywordList.join(', ') || 'None'}

Generate keywords that:
1. Represent the product's core niche/category
2. Target problems the product solves
3. Include competitor alternatives (e.g., "Notion alternative", "alternative to Slack")
4. Cover related technology/industry terms
5. Match what potential customers would search for

Return a JSON object with this structure:
{
  "keywords": [
    {
      "keyword": "project management software",
      "category": "core_niche",
      "reasoning": "Direct category match for the product"
    },
    {
      "keyword": "Notion alternative",
      "category": "competitor_switch",
      "reasoning": "Captures users looking to switch from competitor"
    }
  ],
  "summary": "Brief 1-2 sentence summary of keyword strategy"
}

Categories: core_niche, problem_solving, competitor_switch, industry_term, feature_specific

Focus on BROAD topic keywords, not intent phrases (we add intent modifiers automatically).
Order by expected lead quality (best first).`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at Reddit marketing and keyword research. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log('AI response received, parsing...');

    // Extract JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI suggestions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedKeywords = result.keywords || [];
    console.log(`Generated ${generatedKeywords.length} keywords`);

    // Filter out existing keywords
    const newKeywords = generatedKeywords.filter((k: any) => 
      !existingKeywordList.includes(k.keyword.toLowerCase())
    );

    console.log(`${newKeywords.length} new keywords to insert`);

    // Insert new keywords
    if (newKeywords.length > 0) {
      const keywordsToInsert = newKeywords.map((k: any) => ({
        user_id: user.id,
        keyword: k.keyword,
        is_auto_generated: true,
        is_active: true,
      }));

      const { error: insertError } = await supabase
        .from('keywords')
        .insert(keywordsToInsert);

      if (insertError) {
        console.error('Error inserting keywords:', insertError);
        // Don't fail - some keywords may have been inserted
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        keywords: newKeywords,
        summary: result.summary,
        inserted: newKeywords.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-generate-keywords:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
