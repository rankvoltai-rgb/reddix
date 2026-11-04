# Phase 1 writer's brief

You're writing one blog post for reddix.info, for founders choosing a Reddit tool. It has to be excellent: specific, sourced and useful enough that a reader would forward it. Today is 2026-11-03. Your prompt names your post, its angle and what it owns.

## Read first

1. `docs/blog/writing-guide.md`: the blueprint, voice, frontmatter, roundup rules.
2. `docs/blog/content-roadmap.md`: rules 1-10, "Product facts", "Claims to verify", and your post's entry in Phase 1.
3. The quality bar, for depth and structure, not wording: `/Users/admin/Rankvolt Final/rank-leap-boost/src/content/blog/seobot-alternatives.md` and `surfer-seo-alternatives.md`. Notice how each is built around one specific finding, does real arithmetic, and says where the competitor is the better buy. Don't copy their sentences or headings.
4. `docs/blog/research/serp-and-replacements.md`: section 0 (Reddit's closure), and the part on your query.
5. `docs/blog/research/alerts-and-listening.md` and `docs/blog/research/lead-tools.md`: vendor facts and prices, checked 2026-11-03.
6. `src/sublanding/alternatives/REDDIT-POLICY.md`, and `src/sublanding/alternatives/<slug>/RESEARCH.md` for tools you cover.
7. `src/sublanding/alternatives/reddix.ts`: what Reddix does and costs.

## Truth rules

- **Only facts from the research files or pages you open yourself.** Research quotes passed through a summariser, so open the page and confirm any quote or number you lean on. Quotes stay under 15 words. Never invent a fact, price, quote, study or URL.
- **Prices:** from the vendor's own page. Say "checked on November 3, 2026". Say so where a vendor's pages disagree. Don't repeat stale third-party prices except to correct them.
- **Label evidence honestly.** Vendor blogs are vendor blogs. Preprints are preprints. Vendor-stated speeds are targets, not measurements. Inference is labelled inference.
- **Never "it can't":** no "can't", "cannot", "lacks", "lacking" or "is missing" anywhere in the post, about anything. Write what a site shows, or "not mentioned on its site". Avoid "we found" and any claim of testing.
- **No accusations.** Put what a vendor says beside what Reddit or the press says, and let the reader judge.

**Reddit's closure, as reported.** Reddit announced on September 30, 2026: new public API requests stopped after October 31, RSS ends November 13, access starts closing January 12, 2027 for unregistered apps, and remaining public API access closes in March 2027. Cite the press (TechRepublic https://www.techrepublic.com/article/news-reddit-rss-public-api-shutdown/, heise https://www.heise.de/en/news/Reddit-to-shut-down-RSS-feeds-and-public-API-11473400.html, Decrypt). Reports differ on whether registered users keep access, so say that. Never state that a named vendor will lose access. Reddit's own pages are blocked to our tools, so don't cite ones you couldn't open.

**Reddix, exactly:**
- It finds Reddit posts and scores each 0-100 against your product (Hot, Warm, Research, Low), then drafts three replies per thread (Direct, Story, Expert). You edit, click Copy & Go, and post from your own account.
- It never posts, votes or messages, and uses no Reddit accounts.
- **Scans run when you press Scan,** at most one every 5 minutes. No scheduled scans, no background monitoring, no email, Slack or webhook alerts.
- Saved leads go in a lead list with statuses (engaged, replied, converted, archived). Call it that, not a full CRM.
- Reddit only. Premium $45 a month with a 7-day trial, or $150 once. No free plan.
- **Data route:** it finds public posts through a third-party search API (Firecrawl), not Reddit's API. Disclose this wherever the post discusses data access. Don't claim this makes it immune to Reddit's changes, and don't claim any licence.
- Never call it safe, ban-proof or compliant. Never claim results, accuracy or customer numbers.
- Where a competitor does something Reddix doesn't (alerts, other platforms, audience research, a free plan), say so plainly.

## The file

Write `src/content/blog/<slug>.md` and `src/content/price-charts/<slug>.json`. Edit nothing else.

```yaml
---
title: "<the exact title from your prompt>"
searchTitle: "<if your prompt gives one>"
description: <120-160 characters, contains the keyword>
keyword: <from your prompt>
date: 2026-11-03
updated: 2026-11-03
author: Reddix Team
tags: <from your prompt>
cluster: reddit-monitoring-tools
roundup: true
about: <the tool the post is about>
---
```
Add `hub: true`, `pin:` or `picks:` only if your prompt says so. Quote any title containing a colon.

**Body:** an opening paragraph that answers the query in under 80 words and contains the keyword; a 150-200 word intro with "We make Reddix" before the list starts; `## Key Takeaways` with 5-7 complete facts; at least 15 headings overall; `## Frequently Asked Questions` with exactly 5 `###` questions ending in `?`, then one closing line inviting a reply, ending in `?`; `## References` as a numbered list of `[Title, Publisher](https://url)`, at least 8. Picks are numbered `### 1. Name — what it's best for`. At least one comparison table. Short paragraphs, plain words. Vary sentence length; don't sound like a template.

**Images:** the chart `![detailed alt](figure:price-chart/<slug> "caption")` and your screenshot `![detailed alt](/blog/<file>.webp "caption with the date")`.

**Chart JSON:**
```json
{ "title": "...", "subtitle": "...", "checkedOn": "2026-11-03",
  "bars": [ { "name": "Reddix", "value": 45, "note": "Premium, billed monthly", "reddix": true },
            { "name": "Tool", "value": 29.95, "note": "Entry, 3 filters", "reference": true } ] }
```
Use monthly-billed list prices. Mark the tool the post is about as `reference`. Every charted name must appear in the post. Include a bar only if the price is published.

**Links:** 3-6 internal links where they help, root-relative. Link the cluster posts in your prompt even if they aren't live yet (they render as plain text until they are): `/blog/best-reddit-monitoring-tools`, `/blog/gummysearch-alternatives`, `/blog/trackreddit-alternatives`, `/blog/rednudge-alternatives`, `/blog/f5bot-alternatives-reddit-monitoring`, `/blog/syften-alternatives`. Other useful pages: `/features/intent-detection`, `/features/scheduled-scans`, `/features/lead-scoring`, `/features/ai-replies`, `/alternatives`, `/blog/reddit-self-promotion-rules`, `/blog/find-customers-on-reddit`.

## Stay in your lane

Six writers are working in parallel on six posts. Your prompt says which finding you own. Mention the others' findings in at most a sentence, linking to their post. Open with your own finding, use your own headings, and don't reuse stock phrases. A checker fails any two posts sharing over 8% of their 8-word phrasing or more than 2 H2s.

## Finish

Run `npx -y tsx scripts/blog-check.ts <slug>` and fix everything under your post until it says PASS at 100/100. An "Across posts" finding naming another writer's file may just mean they're mid-draft; fix your side if you can. Read your post once more as a skeptical founder: cut anything vague, and any sentence that could appear unchanged in another post. Don't commit, push, or run the OG or schedule scripts.

**Final reply, under 150 words:** score and word count; your picks in order; any claim you couldn't verify and left out; anything the site owner should know.
