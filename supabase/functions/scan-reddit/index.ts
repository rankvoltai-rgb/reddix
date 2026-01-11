import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// Rate limit: 1 scan per 5 minutes
const RATE_LIMIT_MINUTES = 5;

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

    // Parse request body for scan type and user_id (for scheduled scans)
    let scanType = 'manual';
    let targetUserId: string | null = null;
    try {
      const body = await req.json();
      scanType = body.scan_type || 'manual';
      targetUserId = body.user_id || null;
    } catch {
      // No body, default to manual
    }

    let userId: string;

    // For scheduled scans with service role, use the provided user_id
    if (scanType === 'scheduled' && targetUserId && authHeader.includes(supabaseKey)) {
      userId = targetUserId;
      console.log('Scheduled scan for user:', userId);
    } else {
      // Get user from auth header for manual scans
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
      userId = user.id;
      console.log('Manual scan for user:', userId);
    }

    // Create scan history entry
    const { data: scanRecord, error: scanRecordError } = await supabase
      .from('scan_history')
      .insert({
        user_id: userId,
        scan_type: scanType,
        status: 'running',
      })
      .select()
      .single();

    if (scanRecordError) {
      console.error('Error creating scan record:', scanRecordError);
    }

    // Fetch user's profile for rate limiting and context
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('product_name, company_description, value_proposition, last_scan_at, key_features, competitor_names')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check (skip for scheduled scans)
    if (scanType === 'manual' && profile.last_scan_at) {
      const lastScan = new Date(profile.last_scan_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - lastScan.getTime()) / (1000 * 60);
      
      if (diffMinutes < RATE_LIMIT_MINUTES) {
        const waitMinutes = Math.ceil(RATE_LIMIT_MINUTES - diffMinutes);
        
        // Update scan record as failed
        if (scanRecord) {
          await supabase.from('scan_history').update({
            status: 'failed',
            error_message: `Rate limited - wait ${waitMinutes} minutes`,
            completed_at: new Date().toISOString(),
          }).eq('id', scanRecord.id);
        }
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Rate limit exceeded. Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before scanning again.` 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch user's subreddits and keywords
    const [subredditsRes, keywordsRes] = await Promise.all([
      supabase.from('monitored_subreddits').select('subreddit_name').eq('user_id', userId).eq('is_active', true),
      supabase.from('keywords').select('keyword').eq('user_id', userId).eq('is_active', true),
    ]);

    const subreddits = subredditsRes.data || [];
    const keywords = keywordsRes.data || [];

    if (subreddits.length === 0) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'failed',
          error_message: 'No subreddits configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'No subreddits configured. Add subreddits to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (keywords.length === 0) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'failed',
          error_message: 'No topics configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'No topics configured. Add topics to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last_scan_at timestamp for rate limiting
    await supabase
      .from('profiles')
      .update({ last_scan_at: new Date().toISOString() })
      .eq('id', userId);

    // Topics are the user's niche keywords
    const topics = keywords.map(kw => kw.keyword);
    console.log(`Scanning ${subreddits.length} subreddits with ${topics.length} topics`);

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlKey || !lovableKey) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'failed',
          error_message: 'API keys not configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Services not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch seen posts for deduplication
    const { data: seenPosts } = await supabase
      .from('seen_posts')
      .select('post_url')
      .eq('user_id', userId);
    
    const seenUrls = new Set((seenPosts || []).map(p => p.post_url));
    console.log(`User has ${seenUrls.size} previously seen posts`);

    const allPosts: RedditPost[] = [];
    
    // Helper function to run a search query
    const runSearch = async (query: string, label: string, freshness: string = 'qdr:w'): Promise<RedditPost[]> => {
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
            limit: 20,
            tbs: freshness, // Use fresher data: qdr:d (day), qdr:w (week)
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

    // Optimized search strategy - prioritize fresh content
    const intentPart = INTENT_MODIFIERS.slice(0, 8).map(i => `"${i}"`).join(' OR ');

    // === STRATEGY A: Fresh content (last 24 hours) - highest priority ===
    console.log('=== Strategy A: Fresh Content (24h) ===');
    const topicQuery = topics.slice(0, 3).map(t => `"${t}"`).join(' OR ');
    const freshQuery = `site:reddit.com (${topicQuery}) (${intentPart})`;
    const freshPosts = await runSearch(freshQuery, 'Fresh:24h', 'qdr:d');
    allPosts.push(...freshPosts);

    // === STRATEGY B: Competitor-aware searching ===
    if (profile.competitor_names && profile.competitor_names.length > 0) {
      console.log('=== Strategy B: Competitor Alternatives ===');
      const competitorQuery = profile.competitor_names
        .slice(0, 3)
        .map((c: string) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`)
        .join(' OR ');
      const competitorPosts = await runSearch(
        `site:reddit.com (${competitorQuery})`,
        'Competitors',
        'qdr:w'
      );
      allPosts.push(...competitorPosts);
      await new Promise(r => setTimeout(r, 200));
    }

    // === STRATEGY C: Subreddit-specific with intent (last week) ===
    console.log('=== Strategy C: Subreddit + Intent Search ===');
    for (const sub of subreddits.slice(0, 5)) {
      const subredditQuery = `site:reddit.com/r/${sub.subreddit_name} (${intentPart})`;
      const posts = await runSearch(subredditQuery, `Subreddit:${sub.subreddit_name}`, 'qdr:w');
      allPosts.push(...posts);
      await new Promise(r => setTimeout(r, 150));
    }

    // === STRATEGY D: Broad topic search (fallback if needed) ===
    if (allPosts.length < 10) {
      console.log('=== Strategy D: Broad Fallback ===');
      for (const topic of topics.slice(0, 2)) {
        const fallbackQuery = `site:reddit.com "${topic}" recommendation OR help OR suggestion`;
        const posts = await runSearch(fallbackQuery, `Fallback:${topic}`, 'qdr:m');
        allPosts.push(...posts);
        await new Promise(r => setTimeout(r, 150));
      }
    }

    console.log(`Found ${allPosts.length} total posts`);

    // Filter duplicates within this scan AND against seen posts
    const uniquePosts = allPosts.filter((post, index, self) => {
      // Remove duplicates within this scan
      const isFirstOccurrence = index === self.findIndex(p => p.url === post.url);
      // Remove already seen posts
      const isNew = !seenUrls.has(post.url);
      return isFirstOccurrence && isNew;
    });

    console.log(`${uniquePosts.length} new unique posts to analyze (${allPosts.length - uniquePosts.length} duplicates/seen removed)`);

    if (uniquePosts.length === 0) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'completed',
          posts_scanned: 0,
          leads_found: 0,
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: true, leadsFound: 0, postsScanned: 0, message: 'No new posts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark posts as seen (batch insert)
    const postsToMark = uniquePosts.map(p => ({
      user_id: userId,
      post_url: p.url,
    }));

    // Insert seen posts in batches to avoid conflicts
    for (let i = 0; i < postsToMark.length; i += 50) {
      const batch = postsToMark.slice(i, i + 50);
      await supabase.from('seen_posts').upsert(batch, { 
        onConflict: 'user_id,post_url',
        ignoreDuplicates: true 
      });
    }

    // Analyze posts with AI for intent
    const leadsToInsert: Lead[] = [];
    const postsToAnalyze = uniquePosts.slice(0, 30); // Analyze up to 30 posts

    for (const post of postsToAnalyze) {
      try {
        const analysisPrompt = `You are a lead qualification expert. Analyze this Reddit post for PURCHASE INTENT.

PRODUCT BEING SOLD: ${profile?.product_name || 'a SaaS tool'}
PRODUCT DESCRIPTION: ${profile?.company_description || 'Software that helps businesses'}
VALUE PROPOSITION: ${profile?.value_proposition || 'Solves business problems'}
KEY FEATURES: ${(profile?.key_features || []).join(', ') || 'Not specified'}

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
        
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          console.log(`Post: "${post.title.slice(0, 40)}..." => Score: ${analysis.intent_score}`);
          
          // Lower threshold to 10 for testing
          if (analysis.intent_score >= 10) {
            const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
            const subreddit = subredditMatch ? subredditMatch[1] : 'unknown';

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
              user_id: userId,
            });
          }
        }
      } catch (e) {
        console.error('Analysis error for post:', post.url, e);
      }

      await new Promise(r => setTimeout(r, 80));
    }

    console.log(`Inserting ${leadsToInsert.length} qualified leads`);

    // Count intent levels for scan history
    const hotLeads = leadsToInsert.filter(l => l.intent_level === 'hot').length;
    const warmLeads = leadsToInsert.filter(l => l.intent_level === 'warm').length;

    // Insert leads (they accumulate, no deletion of old leads)
    if (leadsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('leads').insert(leadsToInsert);
      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    // Update scan history
    if (scanRecord) {
      await supabase.from('scan_history').update({
        status: 'completed',
        posts_scanned: postsToAnalyze.length,
        leads_found: leadsToInsert.length,
        hot_leads: hotLeads,
        warm_leads: warmLeads,
        completed_at: new Date().toISOString(),
      }).eq('id', scanRecord.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadsFound: leadsToInsert.length,
        postsScanned: postsToAnalyze.length,
        hotLeads,
        warmLeads,
        message: `Found ${leadsToInsert.length} new leads from ${postsToAnalyze.length} posts`
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
