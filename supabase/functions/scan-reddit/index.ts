import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const RATE_LIMIT_MINUTES = 5;
const BATCH_SIZE = 6;
const PASS1_THRESHOLD = 25;
const MIN_CONTENT_LENGTH = 50;

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

// ── URL Validation ──
const isRedditPost = (url: string): boolean =>
  /reddit\.com\/r\/\w+\/comments\//.test(url);

// ── Strategy 0: Scrape Latest Posts from Subreddit /new ──
async function fetchLatestPosts(
  subredditName: string,
  firecrawlKey: string,
  seenUrls: Set<string>
): Promise<RedditPost[]> {
  console.log(`[Latest:${subredditName}] Scraping /new page`);
  try {
    // Step 1: Scrape the subreddit's /new page to get post links
    const scrapeResp = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://www.reddit.com/r/${subredditName}/new/`,
        formats: ['markdown', 'links'],
        onlyMainContent: true,
      }),
    });

    if (!scrapeResp.ok) {
      console.error(`[Latest:${subredditName}] Scrape failed:`, scrapeResp.status);
      return [];
    }

    const scrapeData = await scrapeResp.json();
    const links: string[] = scrapeData.data?.links || scrapeData.links || [];
    const markdown: string = scrapeData.data?.markdown || scrapeData.markdown || '';

    // Extract post URLs from links array and markdown content
    const postUrlRegex = /https?:\/\/(?:www\.)?reddit\.com\/r\/\w+\/comments\/[a-z0-9]+/gi;
    const fromLinks = links.filter((l: string) => isRedditPost(l));
    const fromMarkdown = (markdown.match(postUrlRegex) || []);
    
    const allPostUrls = [...new Set([...fromLinks, ...fromMarkdown])];
    const newPostUrls = allPostUrls
      .filter(url => !seenUrls.has(url))
      .slice(0, 8); // Limit to 8 newest unseen posts

    console.log(`[Latest:${subredditName}] Found ${allPostUrls.length} post URLs, ${newPostUrls.length} unseen`);

    if (newPostUrls.length === 0) return [];

    // Step 2: Scrape individual posts in parallel (max 4 at a time)
    const posts: RedditPost[] = [];
    const batchSize = 4;
    for (let i = 0; i < newPostUrls.length; i += batchSize) {
      const batch = newPostUrls.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (postUrl) => {
          try {
            const resp = await fetch('https://api.firecrawl.dev/v1/scrape', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${firecrawlKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: postUrl,
                formats: ['markdown'],
                onlyMainContent: true,
              }),
            });
            if (resp.ok) {
              const data = await resp.json();
              const md = data.data?.markdown || data.markdown || '';
              const title = data.data?.metadata?.title || data.metadata?.title || '';
              return { url: postUrl, title, markdown: md, description: '' } as RedditPost;
            }
          } catch (e) {
            console.error(`[Latest] Failed to scrape ${postUrl}:`, e);
          }
          return null;
        })
      );
      posts.push(...results.filter((p): p is RedditPost => p !== null));
    }

    console.log(`[Latest:${subredditName}] Scraped ${posts.length} post contents`);
    return posts;
  } catch (e) {
    console.error(`[Latest:${subredditName}] Error:`, e);
    return [];
  }
}

// ── Search Term Caching ──
async function getCachedOrGenerateTerms(
  supabase: any, userId: string, profile: any, lovableKey: string
): Promise<string[]> {
  if (profile.cached_search_terms && profile.search_terms_cached_at) {
    const cachedAt = new Date(profile.search_terms_cached_at);
    const ageHours = (Date.now() - cachedAt.getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) {
      console.log('Using cached search terms (age: ' + Math.round(ageHours) + 'h)');
      return profile.cached_search_terms as string[];
    }
  }

  const terms = await generateSearchTerms(profile, lovableKey);

  if (terms.length > 0) {
    await supabase.from('profiles').update({
      cached_search_terms: terms,
      search_terms_cached_at: new Date().toISOString(),
    }).eq('id', userId);
  }

  return terms;
}

async function generateSearchTerms(profile: any, lovableKey: string): Promise<string[]> {
  const productName = (profile.product_name || '').toLowerCase();
  
  try {
    const genPrompt = `You are helping find Reddit posts from potential CUSTOMERS who have a PROBLEM that this product solves.

Product: ${profile.product_name || 'Unknown'}
Description: ${profile.company_description || 'Not provided'}
Key Features: ${(profile.key_features || []).join(', ') || 'Not specified'}
Target Audience: ${profile.target_audience || profile.value_proposition || 'Not specified'}
Competitors: ${(profile.competitor_names || []).join(', ') || 'None listed'}

Generate 6-8 search phrases (3-6 words each) that a POTENTIAL CUSTOMER would write in a Reddit post when they have the PROBLEM this product solves.

CRITICAL RULES:
- These must be PAIN POINTS and QUESTIONS from the customer's perspective
- Do NOT include the product name "${profile.product_name || ''}" in any term
- Do NOT include marketing buzzwords or product category names
- Focus on the SYMPTOMS and FRUSTRATIONS the customer experiences

GOOD examples (pain-point phrasing):
- "struggling with email deliverability"
- "need better way to track invoices"
- "how to automate social media posting"
- "tired of manually updating spreadsheets"
- "looking for alternative to [competitor]"

BAD examples (product/marketing terms - DO NOT generate these):
- "best SaaS lead generation tool"
- "AI-powered marketing automation"
- "Reddit marketing software"
- "${profile.product_name || 'ProductName'} review"`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'Return only search terms via the tool call. No explanation.' },
          { role: 'user', content: genPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_search_terms',
            description: 'Return generated search terms',
            parameters: {
              type: 'object',
              properties: {
                terms: { type: 'array', items: { type: 'string' }, description: 'Search terms array' },
              },
              required: ['terms'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_search_terms' } },
      }),
    });

    if (resp.ok) {
      const data = await resp.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        // Filter out any terms that contain the product name
        const filtered = (parsed.terms || []).filter((t: string) => 
          !t.toLowerCase().includes(productName) || productName.length < 3
        );
        console.log('AI-generated search terms (filtered):', filtered);
        return filtered.length > 0 ? filtered : parsed.terms || [];
      }
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const terms = JSON.parse(jsonMatch[0]);
        const filtered = terms.filter((t: string) => 
          !t.toLowerCase().includes(productName) || productName.length < 3
        );
        console.log('AI-generated search terms:', filtered);
        return filtered.length > 0 ? filtered : terms;
      }
    }
  } catch (e) {
    console.error('AI search term generation failed:', e);
  }

  // Fallback
  const fallback = [
    ...(profile.company_description || '').split(/[.,;]/).slice(0, 3).map((s: string) => s.trim()).filter(Boolean),
  ].filter(Boolean) as string[];
  console.log('Fallback search terms:', fallback);
  return fallback.slice(0, 5);
}

// ── Batch AI Analysis (Pass 1 - Fast Filter) with Tool Calling ──
async function batchScorePass1(
  posts: { index: number; title: string; content: string }[],
  productContext: string,
  lovableKey: string
): Promise<{ post: number; score: number }[]> {
  const numbered = posts.map(p => `[${p.index}] Title: "${p.title}" | Content: "${p.content.slice(0, 400)}"`).join('\n');

  const prompt = `Score these Reddit posts for PURCHASE INTENT related to: ${productContext}

SCORING RUBRIC:
- 70-100 (Direct Ask): "Can anyone recommend...", "looking for a tool that...", "best software for...", asking for alternatives
- 40-69 (Problem + Frustration): "I'm struggling with...", mentions competitor pain, complaining about current tool
- 20-39 (Research): "How do you handle...", comparing approaches, exploring options
- 0-19 (Casual/Off-topic): General discussion, memes, already solved, self-promotion, very old

NEGATIVE SIGNALS (reduce score): Already found solution, post is self-promotion, "I built this", "check out my", just sharing news

Posts:
${numbered}`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'You score Reddit posts for purchase intent.' },
          { role: 'user', content: prompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_scores',
            description: 'Return scored posts',
            parameters: {
              type: 'object',
              properties: {
                scores: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      post: { type: 'number', description: 'Post index number' },
                      score: { type: 'number', description: 'Intent score 0-100' },
                    },
                    required: ['post', 'score'],
                  },
                },
              },
              required: ['scores'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_scores' } },
      }),
    });

    if (!resp.ok) {
      console.error('Pass 1 AI error:', resp.status);
      return posts.map(p => ({ post: p.index, score: 30 }));
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return parsed.scores || [];
    }
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Pass 1 batch error:', e);
  }
  return posts.map(p => ({ post: p.index, score: 30 }));
}

// ── Deep Analysis (Pass 2) with Tool Calling ──
async function deepAnalyzePost(
  post: RedditPost,
  profile: any,
  lovableKey: string
): Promise<{ score: number; level: string; notes: string; author: string } | null> {
  const prompt = `Deeply analyze this Reddit post for PURCHASE INTENT.

PRODUCT: ${profile.product_name || 'a SaaS tool'}
DESCRIPTION: ${profile.company_description || 'Software solution'}
VALUE PROP: ${profile.value_proposition || 'Solves business problems'}
KEY FEATURES: ${(profile.key_features || []).join(', ') || 'Not specified'}
COMPETITORS: ${(profile.competitor_names || []).join(', ') || 'None'}

SCORING RUBRIC:
🔥 HOT (70-100) — Direct buying signals: asking for recommendations, complaining about current solution AND seeking alternatives, budget/pricing discussions, "ready to switch"
🌡️ WARM (40-69) — Strong problem awareness: describing a problem the product solves, mentioning competitor pain points, workflow complaints
🔍 RESEARCH (25-39) — Early exploration: comparing approaches, general interest in the problem space
💤 LOW (0-24) — Not actionable: general discussion, already solved, self-promotion, news sharing

NEGATIVE SIGNALS (subtract points):
- "I already use [solution] and love it" → -20
- Post is self-promotion or "I built" → -30
- Problem already resolved in comments → -15
- Post appears older than 30 days (check for date signals in content) → -15

FRESHNESS: If you detect date signals showing the post is more than 2 weeks old, reduce the score by 10-15 points. Recent posts are more valuable for engagement.

POST TITLE: ${post.title}
POST CONTENT: ${(post.markdown || post.description || '').slice(0, 3000)}
POST URL: ${post.url}`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Expert lead qualifier. Analyze and score Reddit posts.' },
          { role: 'user', content: prompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_analysis',
            description: 'Return lead analysis result',
            parameters: {
              type: 'object',
              properties: {
                intent_score: { type: 'number', description: 'Intent score 0-100' },
                intent_level: { type: 'string', enum: ['hot', 'warm', 'research', 'low'] },
                relevance_notes: { type: 'string', description: '2-3 sentence analysis' },
                author: { type: 'string', description: 'Reddit username or unknown' },
              },
              required: ['intent_score', 'intent_level', 'relevance_notes', 'author'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_analysis' } },
      }),
    });

    if (!resp.ok) {
      console.error('Pass 2 AI error:', resp.status);
      return null;
    }

    const data = await resp.json();

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return {
        score: parsed.intent_score ?? 0,
        level: parsed.intent_level ?? 'low',
        notes: parsed.relevance_notes ?? '',
        author: parsed.author ?? 'unknown',
      };
    }

    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: parsed.intent_score ?? parsed.score ?? 0,
        level: parsed.intent_level ?? parsed.level ?? 'low',
        notes: parsed.relevance_notes ?? parsed.notes ?? '',
        author: parsed.author ?? 'unknown',
      };
    }
  } catch (e) {
    console.error('Pass 2 analysis error:', e);
  }
  return null;
}

// ── Search Helper ──
async function runSearch(query: string, label: string, freshness: string, firecrawlKey: string): Promise<RedditPost[]> {
  console.log(`[${label}] Query:`, query.slice(0, 120));
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
        tbs: freshness,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const results = (data.data || []).map((item: any) => ({
        url: item.url,
        title: item.title || '',
        description: item.description || '',
        markdown: item.markdown || '',
      }));
      const validPosts = results.filter((p: RedditPost) => isRedditPost(p.url));
      console.log(`[${label}] Found ${results.length} results, ${validPosts.length} valid Reddit posts`);
      return validPosts;
    } else {
      console.error(`[${label}] Error:`, response.status);
      return [];
    }
  } catch (e) {
    console.error(`[${label}] Search error:`, e);
    return [];
  }
}

// ── Main Handler ──
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

    let scanType = 'manual';
    let targetUserId: string | null = null;
    try {
      const body = await req.json();
      scanType = body.scan_type || 'manual';
      targetUserId = body.user_id || null;
    } catch { /* no body */ }

    let userId: string;

    if (scanType === 'scheduled' && targetUserId && authHeader.includes(supabaseKey)) {
      userId = targetUserId;
      console.log('Scheduled scan for user:', userId);
    } else {
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const anonClient = createClient(supabaseUrl, anonKey);
      const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
      if (userError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid authorization' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      userId = user.id;
      console.log('Manual scan for user:', userId);
    }

    // Create scan history
    const { data: scanRecord } = await supabase
      .from('scan_history')
      .insert({ user_id: userId, scan_type: scanType, status: 'running' })
      .select()
      .single();

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('product_name, company_description, value_proposition, target_audience, last_scan_at, key_features, competitor_names, cached_search_terms, search_terms_cached_at')
      .eq('id', userId)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting (skip for scheduled)
    if (scanType === 'manual' && profile.last_scan_at) {
      const diffMinutes = (Date.now() - new Date(profile.last_scan_at).getTime()) / (1000 * 60);
      if (diffMinutes < RATE_LIMIT_MINUTES) {
        const waitMinutes = Math.ceil(RATE_LIMIT_MINUTES - diffMinutes);
        if (scanRecord) {
          await supabase.from('scan_history').update({
            status: 'failed', error_message: `Rate limited - wait ${waitMinutes} minutes`,
            completed_at: new Date().toISOString(),
          }).eq('id', scanRecord.id);
        }
        return new Response(
          JSON.stringify({ success: false, error: `Rate limit exceeded. Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before scanning again.` }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch subreddits
    const { data: subredditsData } = await supabase
      .from('monitored_subreddits')
      .select('subreddit_name')
      .eq('user_id', userId)
      .eq('is_active', true);

    const subreddits = subredditsData || [];
    if (subreddits.length === 0) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'failed', error_message: 'No subreddits configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'No subreddits configured. Add subreddits to scan.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last_scan_at
    await supabase.from('profiles').update({ last_scan_at: new Date().toISOString() }).eq('id', userId);

    const lovableKey = Deno.env.get('LOVABLE_API_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')!;

    if (!firecrawlKey || !lovableKey) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'failed', error_message: 'API keys not configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Services not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get search terms (cached or freshly generated) — runs in parallel with seen posts fetch
    const [topics, seenPostsResult] = await Promise.all([
      getCachedOrGenerateTerms(supabase, userId, profile, lovableKey),
      supabase.from('seen_posts').select('post_url').eq('user_id', userId),
    ]);

    const seenUrls = new Set((seenPostsResult.data || []).map((p: any) => p.post_url));
    console.log(`Scanning ${subreddits.length} subreddits with ${topics.length} topics, ${seenUrls.size} seen posts`);

    // ── Search Phase: ALL strategies run in PARALLEL ──
    const allPosts: RedditPost[] = [];

    // Build all search promises
    const searchPromises: Promise<RedditPost[]>[] = [];

    // Strategy 0: Latest Posts — scrape /new from top 3 subreddits
    const latestPostsPromises = subreddits.slice(0, 3).map((s: any) =>
      fetchLatestPosts(s.subreddit_name, firecrawlKey, seenUrls)
    );
    searchPromises.push(...latestPostsPromises);

    // Strategy A: Fresh content — AI terms + subreddit scoping, NO quotes (partial match)
    const topicTerms = topics.slice(0, 3).join(' OR ');
    const subredditScope = subreddits.slice(0, 3).map((s: any) => `r/${s.subreddit_name}`).join(' OR ');
    searchPromises.push(
      runSearch(`site:reddit.com (${topicTerms}) (${subredditScope})`, 'Fresh', 'qdr:w', firecrawlKey)
    );

    // Strategy B: Competitor alternatives (max 2 competitors)
    if (profile.competitor_names?.length > 0) {
      const competitorQuery = profile.competitor_names
        .slice(0, 2)
        .map((c: string) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`)
        .join(' OR ');
      searchPromises.push(
        runSearch(`site:reddit.com (${competitorQuery})`, 'Competitors', 'qdr:w', firecrawlKey)
      );
    }

    // Strategy C: Subreddit-specific with top 2 AI terms — NO quotes
    const topTermsUnquoted = topics.slice(0, 2).join(' OR ');
    for (const sub of subreddits.slice(0, 5)) {
      searchPromises.push(
        runSearch(
          `site:reddit.com/r/${sub.subreddit_name} ${topTermsUnquoted}`,
          `Sub:${sub.subreddit_name}`, 'qdr:w', firecrawlKey
        )
      );
    }

    // Run ALL strategies in parallel
    const searchResults = await Promise.all(searchPromises);
    for (const posts of searchResults) {
      allPosts.push(...posts);
    }

    console.log(`Found ${allPosts.length} total posts from all strategies`);

    // Strategy D: Broad fallback (only if very few results)
    if (allPosts.length < 8) {
      console.log('Few results, running fallback searches...');
      const fallbackResults = await Promise.all(
        topics.slice(0, 2).map((topic: string) =>
          runSearch(
            `site:reddit.com ${topic} recommendation OR help OR suggestion`,
            `Fallback:${topic}`, 'qdr:w', firecrawlKey
          )
        )
      );
      for (const posts of fallbackResults) {
        allPosts.push(...posts);
      }
    }

    console.log(`Total posts after all strategies: ${allPosts.length}`);

    // Deduplicate
    const uniquePosts = allPosts.filter((post, index, self) => {
      return index === self.findIndex(p => p.url === post.url) && !seenUrls.has(post.url);
    });

    console.log(`${uniquePosts.length} new unique posts (${allPosts.length - uniquePosts.length} dupes/seen removed)`);

    if (uniquePosts.length === 0) {
      if (scanRecord) {
        await supabase.from('scan_history').update({
          status: 'completed', posts_scanned: 0, leads_found: 0,
          completed_at: new Date().toISOString(),
        }).eq('id', scanRecord.id);
      }
      return new Response(
        JSON.stringify({ success: true, leadsFound: 0, postsScanned: 0, message: 'No new posts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as seen
    const postsToMark = uniquePosts.map(p => ({ user_id: userId, post_url: p.url }));
    for (let i = 0; i < postsToMark.length; i += 50) {
      await supabase.from('seen_posts').upsert(postsToMark.slice(i, i + 50), {
        onConflict: 'user_id,post_url', ignoreDuplicates: true,
      });
    }

    // ── PASS 1: Batch Fast Filter ──
    console.log('=== PASS 1: Batch Fast Filter ===');
    const postsToAnalyze = uniquePosts
      .filter(p => (p.markdown || p.description || '').length >= MIN_CONTENT_LENGTH)
      .slice(0, 30);

    console.log(`${postsToAnalyze.length} posts pass content threshold (>= ${MIN_CONTENT_LENGTH} chars)`);

    const productContext = `${profile.product_name || 'SaaS'}: ${profile.company_description || 'software solution'}`;
    const pass1Results: Map<number, number> = new Map();

    // Run Pass 1 batches in parallel too
    const pass1Promises: Promise<{ post: number; score: number }[]>[] = [];
    for (let i = 0; i < postsToAnalyze.length; i += BATCH_SIZE) {
      const batch = postsToAnalyze.slice(i, i + BATCH_SIZE).map((p, j) => ({
        index: i + j,
        title: p.title,
        content: p.markdown || p.description || '',
      }));
      pass1Promises.push(batchScorePass1(batch, productContext, lovableKey));
    }

    const pass1BatchResults = await Promise.all(pass1Promises);
    for (const scores of pass1BatchResults) {
      for (const s of scores) {
        pass1Results.set(s.post, s.score);
      }
    }

    // Filter: only posts scoring >= PASS1_THRESHOLD proceed
    const pass1Qualified = postsToAnalyze.filter((_, idx) => (pass1Results.get(idx) || 0) >= PASS1_THRESHOLD);
    console.log(`Pass 1: ${pass1Qualified.length}/${postsToAnalyze.length} posts scored >= ${PASS1_THRESHOLD}`);

    // ── PASS 2: Deep Analysis ──
    console.log('=== PASS 2: Deep Analysis ===');
    const leadsToInsert: Lead[] = [];

    // Run Pass 2 in parallel (max 3 concurrent)
    const pass2BatchSize = 3;
    for (let i = 0; i < pass1Qualified.length; i += pass2BatchSize) {
      const batch = pass1Qualified.slice(i, i + pass2BatchSize);
      const analyses = await Promise.all(
        batch.map(post => deepAnalyzePost(post, profile, lovableKey))
      );

      for (let j = 0; j < batch.length; j++) {
        const post = batch[j];
        const analysis = analyses[j];
        if (!analysis) continue;

        console.log(`Deep: "${post.title.slice(0, 40)}..." => Score: ${analysis.score}, Level: ${analysis.level}`);

        if (analysis.score >= PASS1_THRESHOLD) {
          const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
          const subreddit = subredditMatch ? subredditMatch[1] : 'unknown';

          let intentLevel: 'low' | 'warm' | 'hot' | 'research' = 'low';
          if (analysis.score >= 70) intentLevel = 'hot';
          else if (analysis.score >= 40) intentLevel = 'warm';
          else if (analysis.score >= 25) intentLevel = 'research';

          leadsToInsert.push({
            thread_url: post.url,
            thread_title: post.title,
            thread_content: (post.markdown || post.description || '').slice(0, 5000),
            subreddit,
            author: analysis.author || 'unknown',
            intent_score: analysis.score,
            intent_level: intentLevel,
            relevance_notes: analysis.notes,
            user_id: userId,
          });
        }
      }
    }

    console.log(`Inserting ${leadsToInsert.length} qualified leads`);

    const hotLeads = leadsToInsert.filter(l => l.intent_level === 'hot').length;
    const warmLeads = leadsToInsert.filter(l => l.intent_level === 'warm').length;

    if (leadsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('leads').insert(leadsToInsert);
      if (insertError) console.error('Insert error:', insertError);
    }

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
        message: `Found ${leadsToInsert.length} leads from ${postsToAnalyze.length} posts (${pass1Qualified.length} passed fast filter)`,
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
