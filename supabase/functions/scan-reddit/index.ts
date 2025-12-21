import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  intent_level: 'low' | 'medium' | 'high';
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
        JSON.stringify({ success: false, error: 'No keywords configured. Add keywords to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scanning ${subreddits.length} subreddits with ${keywords.length} keywords`);

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get existing thread URLs to avoid duplicates
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('thread_url')
      .eq('user_id', user.id);
    
    const existingUrls = new Set(existingLeads?.map(l => l.thread_url) || []);

    const allPosts: RedditPost[] = [];
    
    // Search each subreddit with each keyword
    for (const sub of subreddits) {
      for (const kw of keywords) {
        const query = `site:reddit.com/r/${sub.subreddit_name} "${kw.keyword}"`;
        console.log('Searching:', query);

        try {
          const response = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              limit: 5,
              tbs: 'qdr:w', // Last week
              scrapeOptions: { formats: ['markdown'] },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const posts = (data.data || []).map((item: any) => ({
              url: item.url,
              title: item.title || '',
              description: item.description || '',
              markdown: item.markdown || '',
              subreddit: sub.subreddit_name,
            }));
            allPosts.push(...posts);
          }
        } catch (e) {
          console.error('Search error for', query, e);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      }
    }

    console.log(`Found ${allPosts.length} total posts`);

    // Filter out duplicates and existing
    const uniquePosts = allPosts.filter((post, index, self) => 
      !existingUrls.has(post.url) &&
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
        const analysisPrompt = `Analyze this Reddit post for purchase intent related to: ${profile?.product_name || 'our product'}.

Product context: ${profile?.company_description || 'A software product'}
Value proposition: ${profile?.value_proposition || 'Helps users solve problems'}

Post Title: ${post.title}
Post Content: ${post.markdown?.slice(0, 1500) || post.description || 'No content'}

Respond with JSON only:
{
  "intent_score": <1-100>,
  "intent_level": "<low|medium|high>",
  "relevance_notes": "<brief explanation of why this is/isn't a good lead>",
  "author": "<extract reddit username if visible, otherwise 'unknown'>"
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

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          
          // Extract JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            
            // Only save leads with score >= 30
            if (analysis.intent_score >= 30) {
              // Extract subreddit from URL
              const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
              const subreddit = subredditMatch ? subredditMatch[1] : (post as any).subreddit || 'unknown';

              leadsToInsert.push({
                thread_url: post.url,
                thread_title: post.title,
                thread_content: post.markdown?.slice(0, 5000) || post.description || '',
                subreddit,
                author: analysis.author || 'unknown',
                intent_score: analysis.intent_score,
                intent_level: analysis.intent_level,
                relevance_notes: analysis.relevance_notes,
                user_id: user.id,
              });
            }
          }
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
