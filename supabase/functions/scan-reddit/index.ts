import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { verifySubscription } from "../_shared/subscription.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const RATE_LIMIT_MINUTES = 5;
const BATCH_SIZE = 6;
const PASS1_THRESHOLD = 25; // lowered — deep analysis happens on-demand from the UI
const PASS1_MAX_LEADS = 30; // cap leads inserted per scan
const PASS1_FLOOR_LEADS = 10; // fallback when AI returns nothing usable
const MIN_CONTENT_LENGTH = 50;
const TIMEOUT_MS = 50_000;
const PASS1_BATCH_TIMEOUT_MS = 12_000; // per-batch AI hang guard
const SEEN_WINDOW_DAYS = 2; // shorter window so the candidate pool refreshes
const MAX_FIRECRAWL_CALLS = 7;

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

// ── Search Helper ──
async function runSearch(query: string, label: string, freshness: string, firecrawlKey: string, callCounter: { count: number }): Promise<RedditPost[]> {
  if (callCounter.count >= MAX_FIRECRAWL_CALLS) {
    console.log(`[${label}] SKIPPED — API call cap reached (${MAX_FIRECRAWL_CALLS})`);
    return [];
  }
  callCounter.count++;
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
        return filtered.length > 0 ? filtered : terms;
      }
    }
  } catch (e) {
    console.error('AI search term generation failed:', e);
  }

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
- Post appears older than 30 days → -15

POST TITLE: ${post.title}
POST CONTENT: ${(post.markdown || post.description || '').slice(0, 1200)}
POST URL: ${post.url}`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        max_tokens: 400,
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

// ── Helper: complete scan record ──
async function completeScan(
  supabase: any, scanId: string | undefined,
  postsScanned: number, leadsToInsert: Lead[], userId: string
) {
  if (leadsToInsert.length > 0) {
    const { error: insertError } = await supabase.from('leads').insert(leadsToInsert);
    if (insertError) console.error('Insert error:', insertError);
  }

  // Compute hot/warm from the DB so analyzed leads are reflected, not just this scan's provisional inserts.
  const [{ count: hotCount }, { count: warmCount }] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('intent_level', 'hot'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('intent_level', 'warm'),
  ]);
  const hotLeads = hotCount ?? 0;
  const warmLeads = warmCount ?? 0;

  if (scanId) {
    await supabase.from('scan_history').update({
      status: 'completed',
      posts_scanned: postsScanned,
      leads_found: leadsToInsert.length,
      hot_leads: hotLeads,
      warm_leads: warmLeads,
      completed_at: new Date().toISOString(),
    }).eq('id', scanId);
  }

  return { hotLeads, warmLeads };
}

// ── Main Handler ──
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Request-scoped counter — prevents concurrency bugs across isolate reuse
  const callCounter = { count: 0 };

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
      const sub = await verifySubscription(user.email ?? "");
      if (!sub.subscribed) {
        return new Response(
          JSON.stringify({ success: false, error: 'Active subscription required.' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const scanId = scanRecord?.id;

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
        if (scanId) {
          await supabase.from('scan_history').update({
            status: 'failed', error_message: `Rate limited - wait ${waitMinutes} minutes`,
            completed_at: new Date().toISOString(),
          }).eq('id', scanId);
        }
        return new Response(
          JSON.stringify({ success: false, error: `Rate limit exceeded. Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before scanning again.` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      if (scanId) {
        await supabase.from('scan_history').update({
          status: 'failed', error_message: 'No subreddits configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanId);
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
      if (scanId) {
        await supabase.from('scan_history').update({
          status: 'failed', error_message: 'API keys not configured',
          completed_at: new Date().toISOString(),
        }).eq('id', scanId);
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Services not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Timeout guard: race the entire processing against a 50s timer ──
    const startTime = Date.now();
    const leadsCollected: Lead[] = [];
    let postsScannedCount = 0;
    let timedOut = false;

    const doScan = async () => {
      // Get search terms + seen posts in parallel
      const seenSince = new Date(Date.now() - SEEN_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const [topics, seenPostsResult] = await Promise.all([
        getCachedOrGenerateTerms(supabase, userId, profile, lovableKey),
        supabase.from('seen_posts').select('post_url').eq('user_id', userId).gte('last_seen_at', seenSince),
      ]);

      const seenUrls = new Set((seenPostsResult.data || []).map((p: any) => p.post_url));
      console.log(`Scanning ${subreddits.length} subreddits with ${topics.length} topics, ${seenUrls.size} seen posts (${SEEN_WINDOW_DAYS}-day window)`);

      // ── Rotation seed: changes every 5 min so we hit different subs/topics/freshness ──
      const rot = Math.floor(Date.now() / (1000 * 60 * 5));
      const shuffled = <T,>(arr: T[]): T[] => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(((rot * 9301 + 49297 + i * 233) % 233280) / 233280 * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };
      const rotatedSubs = shuffled(subreddits);
      const rotatedTopics = topics.length > 0
        ? [...topics.slice(rot % topics.length), ...topics.slice(0, rot % topics.length)]
        : topics;
      const freshnessCycle = ['qdr:d', 'qdr:w', 'qdr:m'];
      const freshA = freshnessCycle[rot % 3];
      const freshB = freshnessCycle[(rot + 1) % 3];
      const freshC = freshnessCycle[(rot + 2) % 3];

      // ── Search Phase: ALL strategies in PARALLEL ──
      const searchPromises: Promise<RedditPost[]>[] = [];

      for (const sub of rotatedSubs.slice(0, 2)) {
        searchPromises.push(
          runSearch(
            `site:reddit.com/r/${sub.subreddit_name}`,
            `Latest:${sub.subreddit_name}`, freshA, firecrawlKey, callCounter
          )
        );
      }

      const topicTerms = rotatedTopics.slice(0, 3).join(' OR ');
      const subredditScope = rotatedSubs.slice(0, 3).map((s: any) => `r/${s.subreddit_name}`).join(' OR ');
      searchPromises.push(
        runSearch(`site:reddit.com (${topicTerms}) (${subredditScope})`, 'Fresh', freshB, firecrawlKey, callCounter)
      );

      if (profile.competitor_names?.length > 0) {
        const competitorQuery = profile.competitor_names
          .slice(0, 2)
          .map((c: string) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`)
          .join(' OR ');
        searchPromises.push(
          runSearch(`site:reddit.com (${competitorQuery})`, 'Competitors', freshC, firecrawlKey, callCounter)
        );
      }

      const topTermsUnquoted = rotatedTopics.slice(0, 2).join(' OR ');
      for (const sub of rotatedSubs.slice(0, 3)) {
        searchPromises.push(
          runSearch(
            `site:reddit.com/r/${sub.subreddit_name} ${topTermsUnquoted}`,
            `Sub:${sub.subreddit_name}`, freshB, firecrawlKey, callCounter
          )
        );
      }

      const searchResults = await Promise.all(searchPromises);
      const allPosts: RedditPost[] = [];
      for (const posts of searchResults) {
        allPosts.push(...posts);
      }

      console.log(`Found ${allPosts.length} total posts (rot=${rot}, fresh=${freshA}/${freshB}/${freshC})`);

      if (allPosts.length < 8 && callCounter.count < MAX_FIRECRAWL_CALLS) {
        console.log('Few results, running fallback search...');
        const fallbackPosts = await runSearch(
          `site:reddit.com ${topics[0] || 'help'} recommendation OR help OR suggestion`,
          'Fallback', 'qdr:w', firecrawlKey, callCounter
        );
        allPosts.push(...fallbackPosts);
      }

      console.log(`Total posts after all strategies: ${allPosts.length}`);

      // Deduplicate (against scan results + seen cache)
      const filteredOutByCache: string[] = [];
      const uniquePosts = allPosts.filter((post, index, self) => {
        const isDupe = index !== self.findIndex(p => p.url === post.url);
        if (isDupe) return false;
        if (seenUrls.has(post.url)) {
          if (filteredOutByCache.length < 5) filteredOutByCache.push(post.url);
          return false;
        }
        return true;
      });

      console.log(`${uniquePosts.length} new unique posts (${allPosts.length - uniquePosts.length} dupes/seen removed)`);
      if (filteredOutByCache.length > 0) {
        console.log(`First filtered-by-seen URLs:`, filteredOutByCache);
      }

      if (uniquePosts.length === 0) return;

      // Time budget check before AI passes
      if (Date.now() - startTime > TIMEOUT_MS - 15_000) {
        console.log('TIMEOUT WARNING: Skipping AI analysis — not enough time');
        return;
      }

      // ── PASS 1: Batch Fast Filter with per-batch timeout ──
      console.log('=== PASS 1: Batch Fast Filter ===');
      const postsToAnalyze = uniquePosts
        .filter(p => (p.markdown || p.description || '').length >= MIN_CONTENT_LENGTH)
        .slice(0, 30);

      postsScannedCount = postsToAnalyze.length;
      console.log(`${postsToAnalyze.length} posts pass content threshold`);

      const productContext = `${profile.product_name || 'SaaS'}: ${profile.company_description || 'software solution'}`;
      const pass1Results: Map<number, number> = new Map();

      const pass1Promises: Promise<{ post: number; score: number }[]>[] = [];
      for (let i = 0; i < postsToAnalyze.length; i += BATCH_SIZE) {
        const batch = postsToAnalyze.slice(i, i + BATCH_SIZE).map((p, j) => ({
          index: i + j,
          title: p.title,
          content: p.markdown || p.description || '',
        }));
        // Per-batch timeout: if Gemini hangs, default to neutral 25 so post still has a chance.
        const guarded = Promise.race([
          batchScorePass1(batch, productContext, lovableKey),
          new Promise<{ post: number; score: number }[]>((resolve) =>
            setTimeout(() => {
              console.warn(`Pass 1 batch starting at ${i} timed out after ${PASS1_BATCH_TIMEOUT_MS}ms — using neutral scores`);
              resolve(batch.map(b => ({ post: b.index, score: 25 })));
            }, PASS1_BATCH_TIMEOUT_MS)
          ),
        ]);
        pass1Promises.push(guarded);
      }

      const pass1Settled = await Promise.allSettled(pass1Promises);
      for (const result of pass1Settled) {
        if (result.status === 'fulfilled') {
          for (const s of result.value) {
            pass1Results.set(s.post, s.score);
          }
        } else {
          console.error('Pass 1 batch rejected:', result.reason);
        }
      }

      // Score distribution for diagnostics
      const dist = { '0-19': 0, '20-39': 0, '40-59': 0, '60-79': 0, '80-100': 0 };
      for (const [, score] of pass1Results) {
        if (score < 20) dist['0-19']++;
        else if (score < 40) dist['20-39']++;
        else if (score < 60) dist['40-59']++;
        else if (score < 80) dist['60-79']++;
        else dist['80-100']++;
      }
      console.log('Pass 1 score distribution:', JSON.stringify(dist));

      let pass1Qualified = postsToAnalyze
        .map((post, idx) => ({ post, score: pass1Results.get(idx) ?? 0 }))
        .filter(x => x.score >= PASS1_THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, PASS1_MAX_LEADS);
      console.log(`Pass 1: ${pass1Qualified.length} posts kept (>= ${PASS1_THRESHOLD}) of ${postsToAnalyze.length}`);

      // ── Fallback floor: never return empty when we have viable content ──
      if (pass1Qualified.length === 0 && postsToAnalyze.length >= 5) {
        console.log(`Fallback floor: surfacing top ${PASS1_FLOOR_LEADS} by content length as provisional leads`);
        pass1Qualified = postsToAnalyze
          .map(post => ({ post, score: 20 }))
          .sort((a, b) => (b.post.markdown || b.post.description || '').length - (a.post.markdown || a.post.description || '').length)
          .slice(0, PASS1_FLOOR_LEADS);
      }

      // ── Insert as provisional leads (deep analysis on-demand) ──
      for (const { post, score } of pass1Qualified) {
        const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
        const subreddit = subredditMatch ? subredditMatch[1] : 'unknown';

        leadsCollected.push({
          thread_url: post.url,
          thread_title: post.title,
          thread_content: (post.markdown || post.description || '').slice(0, 5000),
          subreddit,
          author: 'unknown',
          intent_score: score,
          intent_level: 'research', // provisional — user clicks Analyze for real classification
          relevance_notes: '',
          user_id: userId,
        });
      }

      // ── Only mark QUALIFIED leads as seen — unqualified posts stay eligible for retry ──
      // This prevents poisoning the candidate pool with posts that scored low under stale context.
      const now = new Date().toISOString();
      const postsToMark = pass1Qualified.map(({ post }) => ({
        user_id: userId,
        post_url: post.url,
        last_seen_at: now,
      }));
      for (let i = 0; i < postsToMark.length; i += 50) {
        await supabase.from('seen_posts').upsert(postsToMark.slice(i, i + 50), {
          onConflict: 'user_id,post_url', ignoreDuplicates: false,
        });
      }
    };

    // Race the scan against the timeout
    try {
      await Promise.race([
        doScan(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)),
      ]);
    } catch (e) {
      if (e instanceof Error && e.message === 'TIMEOUT') {
        console.warn('⏰ Scan hit 50s timeout — returning partial results');
        timedOut = true;
      } else {
        throw e; // re-throw non-timeout errors
      }
    }

    // Always save whatever we collected
    const { hotLeads, warmLeads } = await completeScan(supabase, scanId, postsScannedCount, leadsCollected, userId);

    const message = timedOut
      ? `Partial results: found ${leadsCollected.length} leads before timeout`
      : `Found ${leadsCollected.length} leads from ${postsScannedCount} posts`;

    return new Response(
      JSON.stringify({
        success: true,
        leadsFound: leadsCollected.length,
        postsScanned: postsScannedCount,
        hotLeads,
        warmLeads,
        message,
        timedOut,
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
