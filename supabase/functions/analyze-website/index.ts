import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Step 1: Scrape website with Firecrawl
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Scraping URL:', formattedUrl);
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error('Scrape failed:', scrapeData);
      return new Response(JSON.stringify({ success: false, error: 'Could not access that website. Please check the URL and try again.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    if (!markdown || markdown.length < 50) {
      return new Response(JSON.stringify({ success: false, error: 'Website content was too sparse to analyze. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Extract structured data with Lovable AI
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      return new Response(JSON.stringify({ success: false, error: 'AI service not configured' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Truncate markdown to avoid token limits
    const truncatedMarkdown = markdown.slice(0, 8000);

    console.log('Analyzing content with AI, length:', truncatedMarkdown.length);
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a product analyst. Extract structured product information from website content. Be concise and accurate. If information is not available, leave the field empty or as an empty array.',
          },
          {
            role: 'user',
            content: `Analyze this website content and extract product details:\n\n${truncatedMarkdown}`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_product_data',
              description: 'Extract structured product data from website content',
              parameters: {
                type: 'object',
                properties: {
                  company_description: { type: 'string', description: 'A 1-3 sentence description of the product/company and what problems it solves' },
                  target_audience: { type: 'string', description: 'Who the ideal customers are (1-2 sentences)' },
                  value_proposition: { type: 'string', description: 'The main value proposition - why someone should choose this product' },
                  key_features: { type: 'array', items: { type: 'string' }, description: 'Top 3-5 key features of the product (short phrases)' },
                  competitor_names: { type: 'array', items: { type: 'string' }, description: 'Names of competitors if mentioned or implied' },
                  pricing_model: { type: 'string', enum: ['free', 'freemium', 'free-trial', 'paid', 'enterprise', ''], description: 'The pricing model' },
                  unique_differentiators: { type: 'string', description: 'What makes this product unique compared to alternatives' },
                  common_objections: { type: 'array', items: { type: 'string' }, description: 'Potential customer objections the website addresses' },
                  success_stories: { type: 'string', description: 'Any case studies, testimonials, or success metrics mentioned' },
                },
                required: ['company_description', 'target_audience', 'value_proposition', 'key_features'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'extract_product_data' } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'AI rate limit reached. Please try again in a moment.' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ success: false, error: 'AI credits exhausted. Please try again later.' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('AI error:', aiResponse.status);
      return new Response(JSON.stringify({ success: false, error: 'AI analysis failed. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error('No tool call in AI response');
      return new Response(JSON.stringify({ success: false, error: 'AI could not extract product data. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let extracted;
    try {
      extracted = JSON.parse(toolCall.function.arguments);
    } catch {
      console.error('Failed to parse AI tool call arguments');
      return new Response(JSON.stringify({ success: false, error: 'AI response was malformed. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Analysis complete, extracted fields:', Object.keys(extracted));

    return new Response(JSON.stringify({
      success: true,
      data: {
        company_description: extracted.company_description || '',
        target_audience: extracted.target_audience || '',
        value_proposition: extracted.value_proposition || '',
        key_features: (extracted.key_features || []).slice(0, 5),
        competitor_names: (extracted.competitor_names || []).slice(0, 5),
        pricing_model: extracted.pricing_model || '',
        unique_differentiators: extracted.unique_differentiators || '',
        common_objections: (extracted.common_objections || []).slice(0, 5),
        success_stories: extracted.success_stories || '',
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('analyze-website error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Analysis failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
