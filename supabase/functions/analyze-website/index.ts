import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function extractJsonFromResponse(response: string) {
  let cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const jsonStart = cleaned.search(/[\{\[]/);
  if (jsonStart === -1) {
    throw new Error('No JSON object found in response');
  }

  const closingChar = cleaned[jsonStart] === '[' ? ']' : '}';
  const jsonEnd = cleaned.lastIndexOf(closingChar);
  if (jsonEnd === -1) {
    throw new Error('JSON appears truncated');
  }

  cleaned = cleaned.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    cleaned = cleaned
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/[\x00-\x1F\x7F]/g, '');

    return JSON.parse(cleaned);
  }
}

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

    // Step 2: Extract structured data with OpenRouter (Qwen)
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterKey) {
      return new Response(JSON.stringify({ success: false, error: 'OpenRouter API key not configured' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const truncatedMarkdown = markdown.slice(0, 8000);

    console.log('Analyzing content with Qwen via OpenRouter, length:', truncatedMarkdown.length);
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-plus:free',
        messages: [
          {
            role: 'system',
            content: 'You are a product analyst. Return only valid JSON matching the requested schema. Be concise and accurate. If information is unavailable, use an empty string or empty array.',
          },
          {
            role: 'user',
            content: `Analyze this website content and return structured product data as JSON with these exact keys: company_description, target_audience, value_proposition, key_features, competitor_names, pricing_model, unique_differentiators, common_objections, success_stories, tone, suggested_keywords.\n\nRules:\n- key_features, competitor_names, common_objections, suggested_keywords must be arrays\n- suggested_keywords should contain 5-10 short Reddit search phrases\n- tone must be one of: professional, casual, friendly, technical, witty, or empty string\n- pricing_model must be one of: free, freemium, free-trial, paid, enterprise, or empty string\n- return JSON only with no markdown fences or extra text\n\nWebsite content:\n${truncatedMarkdown}`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'product_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                company_description: { type: 'string' },
                target_audience: { type: 'string' },
                value_proposition: { type: 'string' },
                key_features: { type: 'array', items: { type: 'string' } },
                competitor_names: { type: 'array', items: { type: 'string' } },
                pricing_model: { type: 'string', enum: ['free', 'freemium', 'free-trial', 'paid', 'enterprise', ''] },
                unique_differentiators: { type: 'string' },
                common_objections: { type: 'array', items: { type: 'string' } },
                success_stories: { type: 'string' },
                tone: { type: 'string', enum: ['professional', 'casual', 'friendly', 'technical', 'witty', ''] },
                suggested_keywords: { type: 'array', items: { type: 'string' } },
              },
              required: [
                'company_description',
                'target_audience',
                'value_proposition',
                'key_features',
                'competitor_names',
                'pricing_model',
                'unique_differentiators',
                'common_objections',
                'success_stories',
                'tone',
                'suggested_keywords'
              ],
            },
          },
        },
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
    const rawContent = aiData.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== 'string') {
      console.error('No JSON content in AI response', JSON.stringify(aiData));
      return new Response(JSON.stringify({ success: false, error: 'AI could not extract product data. Please fill in the fields manually.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let extracted;
    try {
      extracted = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse AI JSON content', rawContent);
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
        tone: extracted.tone || '',
        suggested_keywords: (extracted.suggested_keywords || []).slice(0, 10),
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
