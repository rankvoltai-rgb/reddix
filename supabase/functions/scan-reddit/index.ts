import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { QWEN_URL, QWEN_KEY, QWEN_MODEL, QWEN_FAST_MODEL } from "../_shared/qwen.ts";
import { verifySubscription } from "../_shared/subscription.ts";
import { buildHeuristics, clampScore, levelFromScore } from "../_shared/intent-heuristics.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const RATE_LIMIT_MINUTES = 5;
const BATCH_SIZE = 10;                     // larger batches → fewer AI calls
const INSERT_THRESHOLD = 35;               // only warm+ enters CRM
const HIGH_CONFIDENCE = 0.8;               // confidence at which we mark deep_analyzed
const PASS_MAX_LEADS = 25;
const MIN_CONTENT_LENGTH = 40;
const TIMEOUT_MS = 50_000;
const BATCH_TIMEOUT_MS = 12_000;
const SEEN_WINDOW_DAYS = 7;                // skip previously low-scoring posts for 7d
const LOWSCORE_SKIP_THRESHOLD = 25;        // posts scored below this are cached as 'seen'
const MAX_FIRECRAWL_CALLS = 7;
const MODEL = QWEN_FAST_MODEL;

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
  quality_score: number;
  confidence: number | null;
  has_competitor_mention: boolean;
  deep_analyzed: boolean;
  analyzed_at: string | null;
}

const isRedditPost = (url: string): boolean =>
  /reddit\.com\/r\/\w+\/comments\//.test(url);

// ── Search (no scrapeOptions → cheaper Firecrawl tier) ──
async function runSearch(query: string, label: string, freshness: string, firecrawlKey: string, callCounter: { count: number }): Promise<RedditPost[]> {
  if (callCounter.count >= MAX_FIRECRAWL_CALLS) {
    console.log(`[${label}] SKIPPED — API call cap reached`);
    return [];
  }
  callCounter.count++;
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${firecrawlKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 15, tbs: freshness }),
    });
    if (!response.ok) {
      console.error(`[${label}] Search error:`, response.status);
      return [];
    }
    const data = await response.json();
    const results = (data.data || []).map((item: any) => ({
      url: item.url,
      title: item.title || '',
      description: item.description || '',
    }));
    const valid = results.filter((p: RedditPost) => isRedditPost(p.url));
    console.log(`[${label}] ${results.length} results, ${valid.length} valid`);
    return valid;
  } catch (e) {
    console.error(`[${label}] err:`, e);
    return [];
  }
}

// ── Search-term caching ──
async function getCachedOrGenerateTerms(supabase: any, userId: string, profile: any, lovableKey: string): Promise<string[]> {
  if (profile.cached_search_terms && profile.search_terms_cached_at) {
    const ageHours = (Date.now() - new Date(profile.search_terms_cached_at).getTime()) / 3_600_000;
    if (ageHours < 24) return profile.cached_search_terms as string[];
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
    const prompt = `Generate 6-8 short search phrases (3-6 words) that a potential CUSTOMER would write on Reddit when they have the problem this product solves.

Product: ${profile.product_name || 'Unknown'}
Description: ${profile.company_description || 'Not provided'}
Key Features: ${(profile.key_features || []).join(', ') || 'Not specified'}
Competitors: ${(profile.competitor_names || []).join(', ') || 'None'}

Rules: pain-point phrasing from customer's view. Do NOT include the product name. No marketing jargon.`;
    const resp = await fetch(QWEN_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${QWEN_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        tools: [{
          type: 'function',
          function: {
            name: 'return_terms',
            parameters: { type: 'object', properties: { terms: { type: 'array', items: { type: 'string' } } }, required: ['terms'] },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_terms' } },
      }),
    });
    if (!resp.ok) throw new Error(String(resp.status));
    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return [];
    const parsed = JSON.parse(args);
    return (parsed.terms || []).filter((t: string) => !t.toLowerCase().includes(productName) || productName.length < 3);
  } catch (e) {
    console.error('term gen failed:', e);
    return (profile.company_description || '').split(/[.,;]/).slice(0, 3).map((s: string) => s.trim()).filter(Boolean);
  }
}

// ── Single batched scoring call (replaces old Pass 1 + Pass 2) ──
interface BatchScore {
  post: number;
  score: number;
  level: 'hot' | 'warm' | 'research' | 'low';
  notes: string;
  confidence: number;
}

async function batchScore(
  posts: { index: number; title: string; content: string }[],
  profile: any,
  lovableKey: string,
): Promise<BatchScore[]> {
  const numbered = posts.map(p => `[${p.index}] Title: "${p.title}"\nContent: "${p.content.slice(0, 500)}"`).join('\n\n');
  const prompt = `Score these Reddit posts for PURCHASE INTENT for:
PRODUCT: ${profile.product_name || 'a SaaS tool'}
DESCRIPTION: ${profile.company_description || 'Software'}
KEY FEATURES: ${(profile.key_features || []).join(', ') || 'n/a'}
COMPETITORS: ${(profile.competitor_names || []).join(', ') || 'none'}

RUBRIC:
- HOT 70-100: direct ask, competitor complaint + alternative search, budget talk, "ready to switch"
- WARM 40-69: clear problem the product solves, workflow pain, comparing options
- RESEARCH 25-39: early exploration, general curiosity
- LOW 0-24: off-topic, already solved, self-promo, news

For each post return: score (0-100), level, 1-sentence notes, confidence (0-1, how sure you are).

Posts:
${numbered}`;

  const resp = await fetch(QWEN_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${QWEN_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'Expert lead qualifier. Score honestly.' },
        { role: 'user', content: prompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'return_scores',
          parameters: {
            type: 'object',
            properties: {
              scores: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    post: { type: 'number' },
                    score: { type: 'number' },
                    level: { type: 'string', enum: ['hot', 'warm', 'research', 'low'] },
                    notes: { type: 'string' },
                    confidence: { type: 'number' },
                  },
                  required: ['post', 'score', 'level', 'notes', 'confidence'],
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
    console.error('batchScore err:', resp.status);
    return posts.map(p => ({ post: p.index, score: 25, level: 'research' as const, notes: '', confidence: 0.3 }));
  }
  const data = await resp.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return [];
  try {
    const parsed = JSON.parse(args);
    return parsed.scores || [];
  } catch {
    return [];
  }
}

async function completeScan(supabase: any, scanId: string | undefined, postsScanned: number, leads: Lead[], userId: string) {
  if (leads.length > 0) {
    const { error } = await supabase.from('leads').insert(leads);
    if (error) console.error('insert err:', error);
  }
  const [{ count: hotCount }, { count: warmCount }] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('intent_level', 'hot'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('intent_level', 'warm'),
  ]);
  if (scanId) {
    await supabase.from('scan_history').update({
      status: 'completed',
      posts_scanned: postsScanned,
      leads_found: leads.length,
      hot_leads: hotCount ?? 0,
      warm_leads: warmCount ?? 0,
      completed_at: new Date().toISOString(),
    }).eq('id', scanId);
  }
  return { hotLeads: hotCount ?? 0, warmLeads: warmCount ?? 0 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const callCounter = { count: 0 };

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const sub = await verifySubscription(user.email ?? '');
    if (!sub.subscribed) {
      return new Response(JSON.stringify({ success: false, error: 'Active subscription required.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = user.id;
    const { data: scanRecord } = await supabase
      .from('scan_history')
      .insert({ user_id: userId, scan_type: 'manual', status: 'running' })
      .select().single();
    const scanId = scanRecord?.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('product_name, company_description, value_proposition, target_audience, last_scan_at, key_features, competitor_names, cached_search_terms, search_terms_cached_at')
      .eq('id', userId).single();

    if (profileError) {
      return new Response(JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (profile.last_scan_at) {
      const diffMinutes = (Date.now() - new Date(profile.last_scan_at).getTime()) / 60_000;
      if (diffMinutes < RATE_LIMIT_MINUTES) {
        const waitMinutes = Math.ceil(RATE_LIMIT_MINUTES - diffMinutes);
        if (scanId) {
          await supabase.from('scan_history').update({
            status: 'failed', error_message: `Rate limited`, completed_at: new Date().toISOString(),
          }).eq('id', scanId);
        }
        return new Response(JSON.stringify({ success: false, error: `Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before scanning again.` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const { data: subredditsData } = await supabase
      .from('monitored_subreddits').select('subreddit_name').eq('user_id', userId).eq('is_active', true);
    const subreddits = subredditsData || [];
    if (subreddits.length === 0) {
      if (scanId) {
        await supabase.from('scan_history').update({
          status: 'failed', error_message: 'No subreddits', completed_at: new Date().toISOString(),
        }).eq('id', scanId);
      }
      return new Response(JSON.stringify({ success: false, error: 'No subreddits configured.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    await supabase.from('profiles').update({ last_scan_at: new Date().toISOString() }).eq('id', userId);

    const lovableKey = Deno.env.get('LOVABLE_API_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')!;
    if (!firecrawlKey || !lovableKey) {
      return new Response(JSON.stringify({ success: false, error: 'Services not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const startTime = Date.now();
    const leadsCollected: Lead[] = [];
    let postsScannedCount = 0;
    let timedOut = false;
    let aiCalls = 0;
    let skippedByHeuristic = 0;
    let skippedByCache = 0;

    const evalHeuristic = buildHeuristics(profile.competitor_names || []);

    const doScan = async () => {
      const seenSince = new Date(Date.now() - SEEN_WINDOW_DAYS * 86_400_000).toISOString();
      const [topics, seenResult] = await Promise.all([
        getCachedOrGenerateTerms(supabase, userId, profile, lovableKey),
        supabase.from('seen_posts').select('post_url, last_score').eq('user_id', userId).gte('last_seen_at', seenSince),
      ]);

      // Posts previously scored low → skip; previously scored high but not converted → still skip (already a lead)
      const seenMap = new Map<string, number | null>();
      for (const row of (seenResult.data || [])) {
        seenMap.set(row.post_url, row.last_score ?? null);
      }
      console.log(`Scanning ${subreddits.length} subs / ${topics.length} topics, ${seenMap.size} seen entries`);

      // Rotation
      const rot = Math.floor(Date.now() / 300_000);
      const shuffled = <T,>(arr: T[]): T[] => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(((rot * 9301 + 49297 + i * 233) % 233280) / 233280 * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };
      const rotatedSubs = shuffled(subreddits);
      const rotatedTopics = topics.length > 0 ? [...topics.slice(rot % topics.length), ...topics.slice(0, rot % topics.length)] : topics;
      const cycle = ['qdr:d', 'qdr:w', 'qdr:m'];
      const [freshA, freshB, freshC] = [cycle[rot % 3], cycle[(rot + 1) % 3], cycle[(rot + 2) % 3]];

      const searchPromises: Promise<RedditPost[]>[] = [];
      for (const sub of rotatedSubs.slice(0, 2)) {
        searchPromises.push(runSearch(`site:reddit.com/r/${sub.subreddit_name}`, `Latest:${sub.subreddit_name}`, freshA, firecrawlKey, callCounter));
      }
      const topicTerms = rotatedTopics.slice(0, 3).join(' OR ');
      const subredditScope = rotatedSubs.slice(0, 3).map((s: any) => `r/${s.subreddit_name}`).join(' OR ');
      searchPromises.push(runSearch(`site:reddit.com (${topicTerms}) (${subredditScope})`, 'Fresh', freshB, firecrawlKey, callCounter));

      if (profile.competitor_names?.length > 0) {
        const cq = profile.competitor_names.slice(0, 2)
          .map((c: string) => `"alternative to ${c}" OR "switching from ${c}" OR "${c} vs"`).join(' OR ');
        searchPromises.push(runSearch(`site:reddit.com (${cq})`, 'Competitors', freshC, firecrawlKey, callCounter));
      }

      const topTermsUnquoted = rotatedTopics.slice(0, 2).join(' OR ');
      for (const sub of rotatedSubs.slice(0, 3)) {
        searchPromises.push(runSearch(`site:reddit.com/r/${sub.subreddit_name} ${topTermsUnquoted}`, `Sub:${sub.subreddit_name}`, freshB, firecrawlKey, callCounter));
      }

      const searchResults = await Promise.all(searchPromises);
      const allPosts: RedditPost[] = [];
      for (const p of searchResults) allPosts.push(...p);
      console.log(`Found ${allPosts.length} raw posts`);

      // Dedup + skip seen
      const uniquePosts: RedditPost[] = [];
      const seenInScan = new Set<string>();
      for (const p of allPosts) {
        if (seenInScan.has(p.url)) continue;
        seenInScan.add(p.url);
        if (seenMap.has(p.url)) { skippedByCache++; continue; }
        uniquePosts.push(p);
      }

      // Heuristic prefilter — kills obvious junk before any AI call
      const candidates: { post: RedditPost; heur: ReturnType<typeof evalHeuristic> }[] = [];
      const subThresholdSeenUpserts: { user_id: string; post_url: string; last_score: number; last_scored_at: string; last_seen_at: string }[] = [];
      const nowIso = new Date().toISOString();

      for (const p of uniquePosts) {
        const body = p.markdown || p.description || '';
        if (body.length < MIN_CONTENT_LENGTH) continue;
        const heur = evalHeuristic(p.title, body);
        if (heur.skip) {
          skippedByHeuristic++;
          subThresholdSeenUpserts.push({ user_id: userId, post_url: p.url, last_score: 0, last_scored_at: nowIso, last_seen_at: nowIso });
          continue;
        }
        candidates.push({ post: p, heur });
      }

      // Prioritize: competitor mentions / direct asks first, then cap
      candidates.sort((a, b) => {
        const ax = (a.heur.hasCompetitor ? 2 : 0) + (a.heur.hasDirectAsk ? 1 : 0);
        const bx = (b.heur.hasCompetitor ? 2 : 0) + (b.heur.hasDirectAsk ? 1 : 0);
        return bx - ax;
      });
      const toScore = candidates.slice(0, 30);
      postsScannedCount = toScore.length;
      console.log(`Prefilter: ${uniquePosts.length} unique → ${candidates.length} candidates → ${toScore.length} scoring (skipped ${skippedByHeuristic} junk, ${skippedByCache} cached)`);

      if (Date.now() - startTime > TIMEOUT_MS - 15_000) {
        console.warn('Skip AI: low time budget');
        return;
      }

      // Single batched scoring pass
      const productCtx = { ...profile };
      const batchPromises: Promise<BatchScore[]>[] = [];
      for (let i = 0; i < toScore.length; i += BATCH_SIZE) {
        const batch = toScore.slice(i, i + BATCH_SIZE).map((c, j) => ({
          index: i + j,
          title: c.post.title,
          content: c.post.markdown || c.post.description || '',
        }));
        aiCalls++;
        batchPromises.push(Promise.race([
          batchScore(batch, productCtx, lovableKey),
          new Promise<BatchScore[]>((resolve) => setTimeout(() => {
            console.warn(`batch ${i} timed out`);
            resolve(batch.map(b => ({ post: b.index, score: 25, level: 'research' as const, notes: '', confidence: 0.3 })));
          }, BATCH_TIMEOUT_MS)),
        ]));
      }

      const settled = await Promise.allSettled(batchPromises);
      const scoreMap = new Map<number, BatchScore>();
      for (const r of settled) {
        if (r.status === 'fulfilled') {
          for (const s of r.value) scoreMap.set(s.post, s);
        }
      }

      // Compose final leads with heuristic boost
      const seenUpserts: typeof subThresholdSeenUpserts = [...subThresholdSeenUpserts];
      const leadCandidates: Lead[] = [];

      for (let i = 0; i < toScore.length; i++) {
        const { post, heur } = toScore[i];
        const s = scoreMap.get(i);
        if (!s) continue;
        const aiScore = clampScore(s.score);
        const quality = clampScore(aiScore + heur.boost);
        const finalLevel = levelFromScore(quality);
        const subredditMatch = post.url.match(/reddit\.com\/r\/([^\/]+)/);
        const subreddit = subredditMatch ? subredditMatch[1] : 'unknown';
        const isConfident = (s.confidence ?? 0) >= HIGH_CONFIDENCE;

        if (quality < INSERT_THRESHOLD) {
          // cache as seen so we don't re-score it for 7d
          seenUpserts.push({ user_id: userId, post_url: post.url, last_score: quality, last_scored_at: nowIso, last_seen_at: nowIso });
          continue;
        }

        leadCandidates.push({
          thread_url: post.url,
          thread_title: post.title,
          thread_content: (post.markdown || post.description || '').slice(0, 5000),
          subreddit,
          author: 'unknown',
          intent_score: aiScore,
          intent_level: finalLevel,
          relevance_notes: s.notes || '',
          user_id: userId,
          quality_score: quality,
          confidence: Math.max(0, Math.min(1, s.confidence ?? 0.5)),
          has_competitor_mention: heur.hasCompetitor,
          deep_analyzed: isConfident,
          analyzed_at: isConfident ? nowIso : null,
        });
        seenUpserts.push({ user_id: userId, post_url: post.url, last_score: quality, last_scored_at: nowIso, last_seen_at: nowIso });
      }

      // Sort by quality, cap inserts
      leadCandidates.sort((a, b) => b.quality_score - a.quality_score);
      leadsCollected.push(...leadCandidates.slice(0, PASS_MAX_LEADS));

      // Upsert seen
      for (let i = 0; i < seenUpserts.length; i += 50) {
        await supabase.from('seen_posts').upsert(seenUpserts.slice(i, i + 50), {
          onConflict: 'user_id,post_url', ignoreDuplicates: false,
        });
      }
    };

    try {
      await Promise.race([
        doScan(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)),
      ]);
    } catch (e) {
      if (e instanceof Error && e.message === 'TIMEOUT') {
        console.warn('scan TIMEOUT — partial results');
        timedOut = true;
      } else { throw e; }
    }

    const { hotLeads, warmLeads } = await completeScan(supabase, scanId, postsScannedCount, leadsCollected, userId);

    console.log(`Scan summary: ${leadsCollected.length} leads, ${aiCalls} AI calls, ${skippedByHeuristic} junk, ${skippedByCache} cache hits`);

    return new Response(JSON.stringify({
      success: true,
      leadsFound: leadsCollected.length,
      postsScanned: postsScannedCount,
      hotLeads, warmLeads,
      aiCalls, skippedByHeuristic, skippedByCache,
      message: timedOut
        ? `Partial: ${leadsCollected.length} leads before timeout`
        : `Found ${leadsCollected.length} qualified leads`,
      timedOut,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Scan error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Scan failed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
