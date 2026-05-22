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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Step 1: Scrape with Firecrawl
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

    // Step 2: Extract structured data via Lovable AI (Gemini) + tool calling
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'AI service not configured' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const truncatedMarkdown = markdown.slice(0, 8000);
    console.log('Analyzing content with Gemini via Lovable AI, length:', truncatedMarkdown.length);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a product analyst. Extract structured product data from website content. Be concise and accurate. If information is unavailable, use empty strings or empty arrays.',
          },
          {
            role: 'user',
            content: `Analyze this website content and extract the product profile.\n\nWebsite content:\n${truncatedMarkdown}`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_product_profile',
              description: 'Extract structured product information from a website.',
              parameters: {
                type: 'object',
                properties: {
                  company_description: { type: 'string', description: 'Short 1-2 sentence description of the company/product' },
                  target_audience: { type: 'string', description: 'Who the product is for' },
                  value_proposition: { type: 'string', description: 'Core value proposition' },
                  key_features: { type: 'array', items: { type: 'string' }, description: '3-5 key features' },
                  competitor_names: { type: 'array', items: { type: 'string' }, description: 'Named competitors if mentioned' },
                  pricing_model: { type: 'string', enum: ['free', 'freemium', 'free-trial', 'paid', 'enterprise', 'unknown'] },
                  unique_differentiators: { type: 'string' },
                  common_objections: { type: 'array', items: { type: 'string' } },
                  success_stories: { type: 'string' },
                  tone: { type: 'string', enum: ['professional', 'casual', 'friendly', 'technical', 'witty'] },
                  suggested_keywords: { type: 'array', items: { type: 'string' }, description: '5-10 short Reddit search phrases potential customers would use' },
                },
                required: [
                  'company_description', 'target_audience', 'value_proposition',
                  'key_features', 'competitor_names', 'pricing_model',
                  'unique_differentiators', 'common_objections', 'success_stories',
                  'tone', 'suggested_keywords',
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'extract_product_profile' } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
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
      console.error('AI error:', aiResponse.status, errorText);
      return new Response(JSON.stringify({ success: false, error: 'AI analysis failed. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const rawArgs = toolCall?.function?.arguments;

    if (!rawArgs) {
      console.error('No tool call in AI response', JSON.stringify(aiData));
      return new Response(JSON.stringify({ success: false, error: 'AI could not extract product data. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let extracted: Record<string, unknown>;
    try {
      extracted = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
    } catch {
      console.error('Failed to parse tool args', rawArgs);
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
        key_features: ((extracted.key_features as string[]) || []).slice(0, 5),
        competitor_names: ((extracted.competitor_names as string[]) || []).slice(0, 5),
        pricing_model: extracted.pricing_model || '',
        unique_differentiators: extracted.unique_differentiators || '',
        common_objections: ((extracted.common_objections as string[]) || []).slice(0, 5),
        success_stories: extracted.success_stories || '',
        tone: extracted.tone || '',
        suggested_keywords: ((extracted.suggested_keywords as string[]) || []).slice(0, 10),
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('analyze-website error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Analysis failed' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
