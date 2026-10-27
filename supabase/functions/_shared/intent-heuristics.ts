// Shared intent heuristics for Reddit lead qualification.
// Zero-cost regex prefilter + booster signals applied before/after AI.
// Also imported by the /features/intent-detection page, whose signal checker
// runs these exact rules in the browser: keep it pure (no Deno APIs).

export const WHITELIST = /\b(recommend|recommendation|suggest|suggestion|looking for|searching for|need (?:a |an )?(?:tool|app|service|software)|best (?:\w+ )*?(?:for|to)|alternative to|alternatives to|vs\.?|switching from|moving (?:from|away)|tired of|stuck with|fed up|frustrated with|budget|pricing|how much|anyone (?:use|using|tried)|worth it|any good|opinions on|thoughts on|help (?:me )?(?:choose|pick|find)|what (?:do you|are you) us(?:e|ing))\b/i;

export const BLACKLIST = /\b(i (?:built|made|created|launched)|check (?:out )?my|launching|showcase|show ?hn|\[oc\]|hiring|for sale|giveaway|promote|affiliate|self[- ]promo|just released|ama)\b/i;

export const PRICING_RE = /\b(budget|pricing|how much|cost|costs|\$\d|per month|monthly|annual(?:ly)?|free tier|paid plan|cheap(?:er|est)?|expensive|afford)\b/i;
export const ALT_RE = /\balternative to\b/i;

export interface HeuristicResult {
  // True = skip AI scoring entirely; post is junk or pure self-promo.
  skip: boolean;
  // Boost applied after AI scores (0-50).
  boost: number;
  hasCompetitor: boolean;
  hasPricingSignal: boolean;
  hasAltSignal: boolean;
  hasDirectAsk: boolean;
}

function buildCompetitorRegex(names: string[]): RegExp | null {
  const clean = names
    .map((n) => (n || "").trim())
    .filter((n) => n.length >= 2 && n.length <= 40)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (clean.length === 0) return null;
  return new RegExp(`\\b(${clean.join("|")})\\b`, "i");
}

export function buildHeuristics(competitorNames: string[] = []) {
  const competitorRe = buildCompetitorRegex(competitorNames);

  return function evaluate(title: string, body: string): HeuristicResult {
    const text = `${title}\n${body || ""}`;
    const hasCompetitor = !!competitorRe && competitorRe.test(text);
    const hasDirectAsk = WHITELIST.test(text);
    const isJunk = BLACKLIST.test(text);
    const hasPricingSignal = PRICING_RE.test(text);
    const hasAltSignal = ALT_RE.test(text);

    // Skip only if: junk AND no rescue signal.
    const skip = isJunk && !hasCompetitor && !hasDirectAsk;

    let boost = 0;
    if (hasCompetitor) boost += 25;
    if (hasPricingSignal) boost += 15;
    if (hasAltSignal) boost += 10;

    return { skip, boost, hasCompetitor, hasPricingSignal, hasAltSignal, hasDirectAsk };
  };
}

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function levelFromScore(score: number): "hot" | "warm" | "research" | "low" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  if (score >= 25) return "research";
  return "low";
}
