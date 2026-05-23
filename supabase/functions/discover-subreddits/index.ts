import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
      return new Response(JSON.stringify({ success: false, error: 'No authorization header' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ success: false, error: 'Profile not found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch existing subreddits to exclude
    const { data: existingSubreddits } = await supabase
      .from('monitored_subreddits')
      .select('subreddit_name')
      .eq('user_id', user.id);

    const existingNames = (existingSubreddits || []).map(s => s.subreddit_name.toLowerCase());

    // Build context from profile
    const productContext = {
      productName: profile.product_name || 'Unknown product',
      description: profile.company_description || '',
      targetAudience: profile.target_audience || '',
      valueProposition: profile.value_proposition || '',
      keyFeatures: profile.key_features || [],
      competitors: profile.competitor_names || [],
      pricingModel: profile.pricing_model || '',
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'AI service not configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are a Reddit expert who deeply understands which subreddits contain the best potential customers for different products.

Analyze this product and suggest the TOP 10 best subreddits to monitor for finding potential customers/leads:

**Product Name:** ${productContext.productName}
**Description:** ${productContext.description}
**Target Audience:** ${productContext.targetAudience}
**Value Proposition:** ${productContext.valueProposition}
**Key Features:** ${productContext.keyFeatures.join(', ') || 'Not specified'}
**Competitors:** ${productContext.competitors.join(', ') || 'Not specified'}
**Pricing Model:** ${productContext.pricingModel || 'Not specified'}

**Already monitoring (EXCLUDE these):** ${existingNames.join(', ') || 'None'}

For each subreddit suggestion, analyze:
1. How likely are users in this subreddit to be potential customers?
2. What kind of posts/discussions happen there that indicate buying intent?
3. How active is this subreddit (estimate)?

Return a JSON object with this exact structure:
{
  "suggestions": [
    {
      "name": "subreddit_name_without_r_prefix",
      "relevance_score": 95,
      "reasoning": "Brief 1-2 sentence explanation of why this subreddit is great for this product",
      "typical_intent_signals": ["looking for tool", "need recommendation"],
      "estimated_activity": "high" | "medium" | "low",
      "category": "primary" | "secondary" | "niche"
    }
  ],
  "analysis_summary": "Brief 2-3 sentence summary of the subreddit strategy"
}

Focus on:
- Subreddits where people actively discuss problems your product solves
- Subreddits with high buying/research intent
- Mix of large active communities and niche targeted ones
- Subreddits where your competitors get mentioned

Order by relevance_score (highest first). Only suggest REAL, ACTIVE subreddits.`;

    console.log('Calling Lovable AI for subreddit discovery...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at Reddit marketing and finding potential customers. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: 'AI credits exhausted.' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: false, error: 'AI service error' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
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
      return new Response(JSON.stringify({ success: false, error: 'Failed to parse AI suggestions' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully generated ${result.suggestions?.length || 0} subreddit suggestions`);

    return new Response(JSON.stringify({
      success: true,
      ...result,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in discover-subreddits:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
