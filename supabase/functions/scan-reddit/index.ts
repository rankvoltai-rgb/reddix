import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// High-intent modifiers - automatically combined with user's topic keywords
const INTENT_MODIFIERS = [
  // Direct requests
  "looking for",
  "need recommendation",
  "any suggestions",
  "what do you use",
  "best tool for",
  "best software for",
  "can anyone recommend",
  // Comparison shopping
  "alternative to",
  "better than",
  "switching from",
  "vs",
  "compared to",
  // Buying signals
  "worth it",
  "pricing",
  "free trial",
  "which one should",
  // Problem signals
  "struggling with",
  "frustrated with",
  "need help with",
  "how do you handle",
];

interface RedditPost {
  url: string;
  title: string;
  description?: string;
  markdown?: string;
}

interface Lead {
  thread_url: string;
  thread_title: string;
  thread_content: string;
  subreddit: string;
  author: string;
  intent_score: number;
  intent_level: 'low' | 'warm' | 'hot' | 'research';
  relevance_notes: string;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scanning for user:', user.id);

    // Fetch user's subreddits and keywords
    const [subredditsRes, keywordsRes, profileRes] = await Promise.all([
      supabase.from('monitored_subreddits').select('subreddit_name').eq('user_id', user.id).eq('is_active', true),
      supabase.from('keywords').select('keyword').eq('user_id', user.id).eq('is_active', true),
      supabase.from('profiles').select('product_name, company_description, value_proposition').eq('id', user.id).single()
    ]);

    const subreddits = subredditsRes.data || [];
    const keywords = keywordsRes.data || [];
    const profile = profileRes.data;

    if (subreddits.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No subreddits configured. Add subreddits to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (keywords.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No topics configured. Add topics to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Topics are the user's niche keywords
    const topics = keywords.map(kw => kw.keyword);
    console.log(`Scanning ${subreddits.length} subreddits with ${topics.length} topics`);
    console.log('Topics:', topics);
    console.log('Intent modifiers:', INTENT_MODIFIERS.slice(0, 5), '...');

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lovableKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clear all previous leads for a fresh scan
    console.log('Clearing previous leads for fresh scan...');
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error clearing old leads:', deleteError);
    }

    const allPosts: RedditPost[] = [];
    
    // Helper function to run a search query
    const runSearch = async (query: string, label: string): Promise<RedditPost[]> => {
      console.log(`[${label}] Query:`, query);
      try {
        const response = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            limit: 15,
            tbs: 'qdr:m', // Last month
            scrapeOptions: { formats: ['markdown'] },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[${label}] Found ${data.data?.length || 0} results`);
          return (data.data || []).map((item: any) => ({
            url: item.url,
            title: item.title || '',
            description: item.description || '',
            markdown: item.markdown || '',
          }));
        } else {
          const errText = await response.text();
          console.error(`[${label}] Error:`, response.status, errText);
          return [];
        }
      } catch (e) {
        console.error(`[${label}] Search error:`, e);
        return [];
      }
    };

    // Build intent query part (top signals only)
    const intentPart = INTENT_MODIFIERS.slice(0, 8).map(i => `"${i}"`).join(' OR ');

    // === STRATEGY A: Broad Reddit search with topic + intent (no subreddit lock) ===
    console.log('=== Strategy A: Broad Topic + Intent Search ===');
    for (const topic of topics) {
      const broadQuery = `site:reddit.com "${topic}" (${intentPart})`;
      const posts = await runSearch(broadQuery, `Broad:${topic}`);
      allPosts.push(...posts);
      await new Promise(r => setTimeout(r, 200));
    }

    // === STRATEGY B: Subreddit-specific with intent only (no topic filter) ===
    console.log('=== Strategy B: Subreddit + Intent Search ===');
    for (const sub of subreddits) {
      const subredditQuery = `site:reddit.com/r/${sub.subreddit_name} (${intentPart})`;
      const posts = await runSearch(subredditQuery, `Subreddit:${sub.subreddit_name}`);
      allPosts.push(...posts);
      await new Promise(r => setTimeout(r, 200));
    }

    // === STRATEGY C: Simple fallback - just topic on Reddit (if we still have no results) ===
    if (allPosts.length === 0) {
      console.log('=== Strategy C: Fallback Simple Search ===');
      for (const topic of topics) {
        const fallbackQuery = `site:reddit.com "${topic}" recommendation OR help`;
        const posts = await runSearch(fallbackQuery, `Fallback:${topic}`);
        allPosts.push(...posts);
        await new Promise(r => setTimeout(r, 200));
      }
    }

    console.log(`Found ${allPosts.length} total posts`);

    // Filter out duplicates within this scan
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.url === post.url)
    );

    console.log(`${uniquePosts.length} new unique posts to analyze`);

    if (uniquePosts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, leadsFound: 0, message: 'No new posts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze posts with AI for intent
    const leadsToInsert: Lead[] = [];

    for (const post of uniquePosts.slice(0, 20)) { // Limit to 20 for efficiency
      try {
        const analysisPrompt = `You are a lead qualification expert. Analyze this Reddit post for PURCHASE INTENT.

PRODUCT BEING SOLD: ${profile?.product_name || 'a SaaS tool'}
PRODUCT DESCRIPTION: ${profile?.company_description || 'Software that helps businesses'}
VALUE PROPOSITION: ${profile?.value_proposition || 'Solves business problems'}

HIGH INTENT SIGNALS (score 50-100):
- Explicitly asking for tool/software recommendations
- Complaining about current solution and seeking alternatives
- Asking "what do you use for X?" or "best tool for X?"
- Budget discussions, comparing pricing
- Ready to buy/try something new

MEDIUM INTENT SIGNALS (score 20-49):
- Discussing problems the product solves
- Showing interest in the problem space
- Asking how others handle similar challenges

LOW INTENT (score 1-19):
- General discussion not seeking solutions
- Already happy with current solution
- Off-topic or unrelated content

POST TITLE: ${post.title}
POST CONTENT: ${post.markdown?.slice(0, 2000) || post.description || 'No content available'}

Respond with valid JSON ONLY:
{
  "intent_score": <number 1-100>,
  "intent_level": "<low|medium|high>",
  "relevance_notes": "<1-2 sentence explanation>",
  "author": "<reddit username if visible, else 'unknown'>"
}`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are an expert at analyzing Reddit posts for purchase intent. Always respond with valid JSON only.' },
              { role: 'user', content: analysisPrompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error('AI API error:', aiResponse.status, errorText);
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        
        console.log(`AI response for "${post.title.slice(0, 50)}...":`, content.slice(0, 200));
        
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          console.log(`Post: "${post.title.slice(0, 40)}..." => Score: ${analysis.intent_score}, Level: ${analysis.intent_level}`);
          
          // Lower threshold to 10 for testing - captures more leads
          if (analysis.intent_score >= 10) {
            // Extract subreddit from URL
            const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
            const subreddit = subredditMatch ? subredditMatch[1] : (post as any).subreddit || 'unknown';

            // Map intent_level to valid enum values
            let intentLevel: 'low' | 'warm' | 'hot' | 'research' = 'low';
            if (analysis.intent_score >= 70) intentLevel = 'hot';
            else if (analysis.intent_score >= 40) intentLevel = 'warm';
            else if (analysis.intent_score >= 20) intentLevel = 'research';

            leadsToInsert.push({
              thread_url: post.url,
              thread_title: post.title,
              thread_content: post.markdown?.slice(0, 5000) || post.description || '',
              subreddit,
              author: analysis.author || 'unknown',
              intent_score: analysis.intent_score,
              intent_level: intentLevel,
              relevance_notes: analysis.relevance_notes,
              user_id: user.id,
            });
            console.log(`✓ Added lead: ${post.title.slice(0, 50)}...`);
          } else {
            console.log(`✗ Skipped (score ${analysis.intent_score} < 10): ${post.title.slice(0, 50)}...`);
          }
        } else {
          console.error('Could not parse AI response JSON:', content.slice(0, 200));
        }
      } catch (e) {
        console.error('Analysis error for post:', post.url, e);
      }

      // Small delay between AI calls
      await new Promise(r => setTimeout(r, 100));
    }

    console.log(`Inserting ${leadsToInsert.length} qualified leads`);

    // Insert leads
    if (leadsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('leads').insert(leadsToInsert);
      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadsFound: leadsToInsert.length,
        postsScanned: uniquePosts.length,
        message: `Found ${leadsToInsert.length} new leads from ${uniquePosts.length} posts`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scan error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Scan failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
