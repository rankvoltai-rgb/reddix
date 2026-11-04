# Reddix content roadmap

All 32 briefs from the *Reddix Blog Content Brief* (Semrush keyword research), in phases. Same system as Rankbox's `docs/content-roadmap.md`. Search metrics below are copied from the brief unchanged.

**To run a phase**, start a session with: `Run Phase N of docs/blog/content-roadmap.md`. Tick the boxes as posts are written.

Last reviewed: 2026-11-03. Phase 1 is written and scheduled.

## Rules for every phase

1. **Write each blog as the brief gives it.** Use the exact title, angle and target queries. Don't shorten, merge, park or judge them. The only exception is an exact duplicate of a live page, and the user decides that one. Similar isn't a duplicate: it gets written with its own angle and a link to the similar page.
2. **Keep facts true.** If research contradicts a claim in an angle, keep the title and angle, write the accurate version, and mention it in the hand-off. The code decides what Reddix does: the brief says product claims stay within its Section 2, but parts of Section 2 aren't true of the product (see "Product facts"), so a claim must be in Section 2 *and* true in the code.
3. **Metrics are locked.** Never invent, round or update a search metric. Articles don't need to state them at all. A "—" means the brief gave none.
4. **Verify or cut.** Anything in "Claims to verify" needs a live source cited in the article, or it comes out. Re-check every vendor's price and features the week its post is written, on the vendor's own site.
5. **One primary keyword per post.** See "Keyword owners".
6. **Never call a competitor unable to do something.** Write "not mentioned on its site" unless its docs say so. Say plainly where a competitor is the better choice.
7. **No invented proof.** No made-up customers, results, quotes or "we tested". Illustrative examples are labelled.
8. **Tone:** founder to founder, not spammy. Reddix is positioned against spam bots and noisy alerts, not against Reddit.
9. **Titles on the page stay exact; the search title carries the keyword.** Many brief titles run past 60 characters or don't contain the primary keyword. Phase 0 adds a short search title (`searchTitle`) for the `<title>` tag, so the page keeps the brief's wording and the search result still fits and targets the keyword.
10. **Years in titles match the go-live year.** The brief's date note warns that "2026" can age before a post ranks, so a post going live in 2027 says 2027.

### Each post

1. Search the query and read the top results. Find what they miss.
2. Write to `docs/blog/writing-guide.md`: the answer first, Key Takeaways, 5 FAQs, references. About 2,500 words. Roundups can run to 4,400.
3. Open every source you cite.
4. Pass `npm run blog:check -- <slug>` at 100, the bar Rankbox's tests hold every post to, with no blueprint failures.
5. Run `npx tsx scripts/og/render.ts` for the social image.
6. Add its cluster links (each phase lists them) and check it on the dev server.
7. Add a diagram or a video only where the post needs one: at most one video per post, from a primary source, with its id checked.
8. Note in the hand-off anything research changed.

### Roundups ("best X", "X alternatives")

These name real companies and are the likeliest to read as a template. Rankbox's first drafts did, and all nine were rewritten. Each one needs:

- 4–12 picks, each with a price dated to the day it was checked, from the vendor's own page.
- A price chart and a dated screenshot of the competitor's pricing page.
- A "we make Reddix" disclosure.
- Its own angle and structure: at most 8% shared 8-word phrasing with any other roundup, at most 2 shared H2s, no name-swapped sentences, no forced keyword openers.
- Reddix listed first only where it does the job the searcher wants. It doesn't lead a post about alerts, because it has none.

## Phases at a glance

| Phase | Theme | Posts | Needs first |
| --- | --- | --- | --- |
| 0 | Set up the Rankbox system | None | Nothing to start. The reply prompt fix waits on decision 1 |
| 1 | People switching tools | 6 | Vendor price checks. A1 goes live December 1 |
| 2 | Revenue picks and staying safe | 5 new, 1 upgrade | Reply prompt fixed. Citable agency and ad prices |
| 3 | From thread to pipeline | 5 | Reply prompt fixed |
| 4 | Alerts and monitoring | 3 | Nothing extra. Posts recommend alert tools unless alerts ship first |
| 5 | Social listening roundups | 4 | Price checks on enterprise tools |
| 6 | Strategy, SEO and AI search | 4 | Real, sourced case studies for P2 |
| 7 | Research and developers | 4 | Competitors field in Settings for Q3 |

That's 31 new posts and 1 upgrade. At 3 a week, the release runs about 11 weeks. Standalone posts aren't included yet (decision 3).

## Decisions open

1. **Reply prompt.** `generate-reply/index.ts:77` tells the AI to "never reveal AI origin", and drafts end with the product link. Phases 2 and 3 sell an honest, human-reviewed workflow, so this should change first.
2. **Alerts or scheduled scans.** Reddix has neither. Phase 4 argues that speed decides who gets the customer, so its posts recommend alert tools for that job. Phase 4 gets written either way; shipping alerts first would only change what the posts can say about Reddix.
3. **Standalone posts.** Rankbox gives every target query its own post (1,500–2,800 words) that links up to its category post. Here that would add up to 48 posts. Six of those queries have 100+ searches a month: `best social listening tools`, `social media listening tool`, `alerts for reddit`, `reddit tracker`, `reddit keyword research tool`, `how to scrape reddit`. Others are near-identical, such as `reddit keyword alert` and `reddit keyword alerts`.

## Product facts (checked against the code)

| In the brief's Section 2 | In the code | Use |
| --- | --- | --- |
| $45/mo or $150 lifetime | True. Premium has a 7-day trial. No free plan | State it |
| Hot / Warm / Research | True. There's also Low | State it |
| Two-pass filtering | True: first-pass rules, then AI scoring | State it |
| Subreddit Discovery | True | State it |
| "Copy & Go" replies you review | True: `ReplyDialog.tsx:199`. Reddix never posts | State it |
| Built-in lead CRM | Partly: a lead list with statuses (engaged, replied, converted, archived). No contact data, and notes aren't shown | Say "lead list with statuses" |
| Unified inbox | Not found in the product | Don't say it |
| Real-time intent triage | **False.** Scans run when you press Scan, at most one every 5 minutes. No alerts | Never say it |
| Keyword suggestion engine | Not user-facing. The `keywords` table isn't read by scans. Scans write their own buyer phrases | Describe the phrases instead |

Also true and worth disclosing: Reddix finds posts through Firecrawl search, not Reddit's API. It's Reddit only. Never claim it's safe, ban-proof or compliant, only that it never posts, votes or messages and that the user reviews every reply.

## Claims to verify (brief Section 5)

| Claim | Status |
| --- | --- |
| GummySearch shutdown | **Verified.** Closed to new buyers after 2025-11-30; all services end and user data is deleted on 2026-12-01; it cites failing to reach a commercial Reddit API licence (`alternatives/gummysearch/RESEARCH.md`) |
| Reddit is closing public access (not in the brief) | **Verified in the press.** Announced 2026-09-30: new API requests stopped Oct 31, RSS ends Nov 13, unregistered access starts closing Jan 12, 2027, remaining public API access closes in March 2027. TechRepublic, heise, Decrypt and TechCrunch report it; they differ on registered users. Reddit's own post is blocked to our tools |
| TrackReddit is live (not in the brief) | **Not live.** Appears to have stopped around 2020; no shutdown notice found; the domain carries unrelated articles. See `research/serp-and-replacements.md` Part 2 |
| Syften costs $19–49/mo | **Wrong.** $29.95, $49.95 and $119.95 a month (`alternatives/syften/RESEARCH.md`, checked 2026-10-27) |
| "Official" 9:1 rule | **Resolved.** A rule of thumb, not a site-wide rule. The live post already says so |
| AI engines cite Reddit heavily | **Direction verified.** Peec (30M sources, March 2026) ranks Reddit first or second on every engine tested. Shares vary widely between studies, so don't quote one as fact |
| Howitzer used mass DMs that Reddit cracked down on | **Half verified.** It sold mass DMs, but one search found no evidence of a crackdown. Cut that part unless a source turns up |
| "Replies beat cold DMs by 10x" and "90% of notifications waste your time" | No source. Cut from the headlines |
| First 3 replies get 70–80% of upvotes; 12 hours late is invisible | Not checked. Source or cut |
| Cold email open rates below 15% | Not checked. Source or cut |
| Enterprise tool pricing | Brandwatch publishes no prices (verified). The rest are unchecked |
| Agency retainers; agencies using VAs | Not checked. Source or cut |
| Reddit API limits, token costs, IP bans | Not checked. Source or cut |
| Reddit PPC "75–93 CPC"; redditors downvote ads | Not checked. Source or cut |
| SERP snapshots | May be stale. Re-check when writing |

## Data conflicts (brief Section 4)

There's no Semrush access from here, so these stay unresolved. None of them needs to appear in an article.

- **Search metrics (#1, #2, #3, #8, #9):** used for ordering only. Don't state them.
- **Prices (#4, #5, #6, #7):** state one only with a live source. `reddit ads manager` CPC is Google's advertiser CPC, not Reddit's ad CPC.
- **#10, Syften slug:** resolved. It's `/blog/syften-alternatives`.

## Keyword owners

| Keyword | Owner | Note |
| --- | --- | --- |
| `reddit lead generation`, `reddit lead gen` | L1, with the live `/blog/reddit-lead-generation` beside it | Similar, not a duplicate. L1 is new, with a B2B anti-cold-outreach angle, and links to the live post |
| `reddit self promotion rules` | S1, the live `/blog/reddit-self-promotion-rules` | Exact duplicate: the brief's slug is already live. S1 upgrades it unless the user says otherwise |
| `how to find customers on reddit` | Live `/blog/find-customers-on-reddit` | Stays a supporting query in L2, which links to the live post |
| `reddit market research` | Q1 | |
| `reddit sentiment analysis` | Q2 | |
| `reddit brand monitoring` | A5 | |
| `how to monitor brand mentions on reddit`, `reddit brand mentions` | M3 | P4 owns the AI-search questions |
| `reddit listening tool` | R2 | |
| `reddit marketing automation` | R6 | |
| `gummysearch alternative`, `f5bot alternatives`, `syften` | A1, A3, A4 | Similar to the comparison pages, so both exist: posts are roundups, pages are one-to-one. Phase 0 retitles the pages |

**Other sites you own:** rankbox.xyz already has `how-to-use-reddit-for-seo` (keyword "Reddit for SEO") and `reddit-in-ai-search`. P3 and P4 must be written from scratch with a lead-finding angle, not adapted from those.

## Phase 0: Set up the Rankbox system

No posts. Brings over what Rankbox has and Reddix doesn't.

**Needs:** Nothing to start. The reply prompt fix waits on decision 1.

- [x] Post checks in `blog:check`, matching Rankbox's tests: score 100, internal links resolve, 5–6 FAQs and references, dated prices, shared phrasing and H2 limits against every post, no "we tested", Reddix claims limited to what ships. Roundups also need 4–12 picks, a disclosure before the list, and no name-swapped sentences. Rankbox: `src/content/ai-search-posts.test.ts`, `src/content/alternatives-posts.test.ts`.
- [x] Price charts and dated pricing screenshots in posts. Rankbox: `src/data/blog-figures.ts`, `src/data/price-charts/`.
- [ ] Built-in diagrams in posts. Rankbox: `src/components/blog/figures.tsx`, placed with `![alt](figure:<id> "caption")`.
- [ ] YouTube embeds that load on click, with VideoObject markup and a checked registry. Rankbox: `src/data/blog-videos.ts`.
- [ ] A topic link graph, so posts, features, comparisons and glossary pages link across sections and no page is orphaned. Rankbox: `src/data/link-graph.ts`, `src/components/ExploreMore.tsx`.
- [x] A scheduler and cadence: 3 posts a week, 3 days between posts in a cluster, facts re-checked if a post waits over 30 days. Now in `scripts/blog-schedule.ts` and `src/lib/blog/cadence.ts`.
- [x] A release process. Rankbox renders per request, so dated posts go live by themselves. Reddix is prerendered at build, so a post goes live in the app on its date but only reaches the sitemap and crawler HTML after a push and a click on Publish in Lovable. Publish on go-live days; a missed day is caught up by the next Publish.
- [x] A short search title in frontmatter (`searchTitle`), read by the page's `<title>`, the prerender and `blog:check`. See rule 9.
- [x] Link each `/alternatives/<slug>` page to its roundup once it's live (`RelatedGuide`), and the roundup back.
- [x] Retitle three comparison pages so they don't compete with A1, A3 and A4: GummySearch to a shutdown and export title, F5Bot and Syften to "X vs Reddix". Rankbox pairs pages and posts the same way.
- [ ] Load post text per post. All posts ship in one blog chunk (108 KB gzipped at 9 posts); it doesn't touch the landing page, but split it before Phase 3.
- [ ] Fix the reply prompt, if you approve.

## Phase 1: People switching tools

**Written 2026-11-03.** Dates are in each post's frontmatter. Push once, then click Publish in Lovable on each date.

| Go-live | Post |
| --- | --- |
| Fri, Nov 6 | R1: Best Reddit Monitoring Tools |
| Mon, Nov 9 | A2: TrackReddit Review |
| Fri, Nov 13 | A5: Rednudge Alternatives |
| Mon, Nov 16 | A3: F5Bot vs. Dedicated Reddit CRMs |
| Fri, Nov 20 | A4: Syften Alternatives |
| Tue, Dec 1 | A1: GummySearch Alternatives (pinned) |

**Re-check before release:**
- **After Nov 10:** Reddit's reported migration update. Update R1 and A2 if they're live, and the others before they go out.
- **After Nov 13:** RSS ends. Pane's site says its Reddit intake stops that day, which is why A1 leaves it out. Check other vendors for similar notices.
- **Before Dec 1:** every price and vendor statement in A1, which waits 28 days between writing and release.

The brief's best first picks and the lowest-difficulty commercial keywords. R1 is the hub.

**Needs:** Vendor price checks and screenshots the week each post is written. A1 goes live December 1.

**Links:** R1 ↔ A1, A2, A3, A4, A5. Each post ↔ its `/alternatives/<slug>` page where one exists.

- [x] **R1: The 7 Best Reddit Monitoring Tools for Finding SaaS Leads in 2026**
  - Slug: /blog/best-reddit-monitoring-tools
  - Primary: `reddit monitoring tool` (110/mo, KD 1, CPC $14.68). The brief flags it as the fastest to rank.
  - Angle: a definitive comparison on speed, filtering accuracy and pricing.
  - Flag: replace the brief's "Reddit API compliance" axis with "where the data comes from", stated for every tool including Reddix. State Reddix's limits on speed: it scans on demand and sends no alerts.
- [x] **A1: Top 7 GummySearch Alternatives in 2026 (Since the Shutdown)**
  - Slug: /blog/gummysearch-alternatives
  - Primary: `gummysearch alternative` (40/mo, KD 12, CPC $7.21)
  - Searcher: users looking for an exact replacement.
  - Angle: what GummySearch did well, why keyword-only scrapers fail today, how AI intent scoring replaces manual subreddit searching.
  - Flag: date it December 1, the day the title becomes true. `/alternatives/gummysearch` covers the urgency before then. Reddix doesn't do audience research, so say so and name tools that do.
- [x] **A2: TrackReddit Review: 5 Modern Alternatives for Real-Time Reddit Alerts**
  - Slug: /blog/trackreddit-alternatives
  - Primary: `trackreddit` (260/mo, KD 7, CPC $25.21)
  - Angle: legacy email alert bots vs. modern tools that triage buyer intent and filter spam.
  - Flag: on 2026-11-03, trackreddit.com showed an unrelated promotional article and no product page. Re-check first. If that holds, the review section reports what can be confirmed; don't claim a shutdown without a source. The five picks must be real alert tools, so Reddix isn't one of them; mention it separately with that limit stated.
- [x] **A5: Top Rednudge Alternatives for Reddit Social Listening**
  - Slug: /blog/rednudge-alternatives
  - Primary: `rednudge` (390/mo, KD 10)
  - Supporting: `reddit brand monitoring` (50/mo, KD 11, CPC $14.20)
  - Searcher: commercial investigation. People find traditional tools lack lead qualification and CRM workflow.
  - Angle: compare RedNudge, Reddix, Brand24 and Syften; the shift from keyword pings to AI-filtered buyer intent scoring.
  - Flag: RedNudge is a close rival. On 2026-11-03 rednudge.com listed $7 and $15 a month with a 7-day trial, scanning about every 30 minutes, AI scoring, intent tags and a daily digest with optional Slack delivery. Product Hunt says $19 for Pro, so use the vendor's page. Say plainly where it beats Reddix on price and background scanning.
- [x] **A3: F5Bot vs. Dedicated Reddit CRMs: Why Simple Keyword Alerts Aren't Enough**
  - Slug: /blog/f5bot-alternatives-reddit-monitoring
  - Primary: `f5bot alternatives` / `f5bot review` (880/mo, stated for the pair; see conflict #8)
  - Angle: acknowledge F5Bot as a great free notification tool; show the cost of noise when you need qualified pipeline.
  - Flag: its free and Silver plans are for personal or non-commercial use, and business use starts at Gold, $49.99 (`alternatives/f5bot/RESEARCH.md`).
- [x] **A4: Top 5 Syften Alternatives in 2026: From Raw Keyword Pings to AI Lead Qualification**
  - Slug: /blog/syften-alternatives
  - Primary: `syften` (170/mo, KD 20, CPC $8.91)
  - Supporting: `syften alternatives` (KD 0), `what are the top competitors to syften` (KD 0)
  - Gap: the top 10 for `syften` is mostly directories and Reddit threads, with no authoritative comparison guide. Re-check.
  - Angle: multi-platform scrapers and Slack bots vs. deep Reddit intent qualification. Reddix's buying-intent scoring plus its lead list.
  - Flag: use the verified Syften prices, not the brief's. Syften covers far more sources than Reddix; say so.

## Phase 2: Revenue picks and staying safe

The brief's "fastest route to revenue" picks (B1, P3, S1) and the safety cluster. Later phases link back to these.

**Needs:** Reply prompt fixed. Citable agency and Reddit Ads prices.

**Links:** S1 ↔ S2, R6.

- [ ] **S1 (upgrade): Reddit Self-Promotion Rules: How to Market Your Product Without Getting Banned**
  - Slug: /blog/reddit-self-promotion-rules. Already live at the brief's exact slug, so it can't be a second post: keep the URL and date, update `updated`, and adopt the brief's title.
  - Primary: `reddit self promotion rules` (20/mo, KD 0)
  - Supporting: `can you self promote on reddit` (20/mo, KD 0), `how to self promote on reddit` (20/mo, KD 0)
  - Add: AutoModerator trigger words, post vs. comment etiquette, the "Transparent Founder" technique. The 9:1 question is already handled.
- [ ] **B1: Reddit Marketing Agency vs. In-House Software: Cost, ROI & Ban Risk in 2026**
  - Slug: /blog/reddit-marketing-agency-vs-software
  - Primary: `reddit marketing agency` (320/mo, KD 24, CPC $11.76)
  - Supporting: `how much does reddit marketing agency cost` (KD 0)
  - Searcher: founders and CMOs with budget, evaluating outsourcing.
  - Angle: agency retainers vs. in-house tooling at $45/mo or $150 lifetime: authentic voice, faster reactions, no markup.
  - Flag: retainers conflict in the brief ($3,000–$8,000 vs. $3,000–$5,000), so source them. "Outsourced VAs", "often downvoted", "lower ban exposure" and "15 minutes a day" all need a source or come out. Say when an agency is the better choice.
- [ ] **P3: Reddit Parasite SEO: Ride Google's Top Rankings with High-Intent Comments**
  - Slug: /blog/reddit-parasite-seo-guide
  - Primary: `reddit for seo` (140/mo, CPC $12.90)
  - Supporting: `how to use reddit for seo` (50/mo, CPC $11.62), `reddit parasite seo` (20/mo, KD 0)
  - Angle: instead of waiting months for a blog post to rank, find threads already ranking for high-intent queries and add a genuinely helpful comment.
  - Flag: "parasite SEO" is also the common nickname for what Google's site reputation abuse policy targets, so the post must draw that line clearly: helpful comments in real threads, not content planted on a host site. Don't promise a top-voted comment or daily traffic. Write fresh; see "Other sites you own".
- [ ] **S2: Reddit Shadowbans Explained: Why Marketers Get Banned and How to Stay Safe**
  - Slug: /blog/reddit-shadowban-guide-for-marketers
  - Primary: `how to check self promotion on reddit` (KD 0)
  - Searcher: marketers whose comments get no upvotes or views.
  - Angle: how spam filters and AutoModerator work (domain blacklists, URL shortener flags, karma thresholds), and why full-auto commenting is riskier than a "Copy & Go" workflow.
  - Flag: Reddit's flagged-account page is in `alternatives/REDDIT-POLICY.md`.
- [ ] **R6: Reddit Marketing Automation: What's Safe to Automate (and What Gets You Shadowbanned)**
  - Slug: /blog/reddit-marketing-automation-guide
  - Primary: `reddit automation tools` (90/mo, KD 32)
  - Supporting: `reddit marketing automation` (20/mo, KD 0), `reddit automation tool` (10/mo, KD 0, CPC $11.23), `reddit outreach tool` (KD 0, ad competition 0.79)
  - Angle: warn against auto-commenters, auto-DM bots and upvote rings; advocate automating scanning and triage, with replies you review.
  - Flag: cite Reddit's rules from `alternatives/REDDIT-POLICY.md`. State what vendors say beside what Reddit says; never accuse. Don't call Reddix safe.
- [ ] **B2: Reddit Ads vs. Organic Intent Listening: Why Founders Waste Thousands on Ads**
  - Slug: /blog/reddit-ads-vs-organic-intent-listening
  - Primary: `should i use reddit ads for my small business` (KD 0)
  - Supporting: `are reddit ads good for small businesses` (KD 0), `reddit ads manager` (CPC $75.71)
  - Angle: $500 on sponsored posts vs. joining 20 active conversations where buyers ask for recommendations.
  - Flag: don't state "thousands" as a finding without a source. Label the $500 example as illustrative. Say when ads are the better choice. See conflict #4.

## Phase 3: From thread to pipeline

C1 defines a category nobody owns yet; the rest are the playbooks around it.

**Needs:** Reply prompt fixed.

**Links:** C1 ↔ L1, L2, O1. L1 and O1 → S1. L1 → the live lead generation post.

- [ ] **C1: The Reddit CRM: How to Track, Triage & Close Warm Leads from Reddit**
  - Slug: /blog/reddit-sales-pipeline-crm-playbook
  - Primary: `reddit crm` (110/mo, KD 31, CPC $29.37). Highest commercial intent in the dataset.
  - Supporting: `reddit sales pipeline`
  - Gap: 9 of the top 10 results were raw threads on r/CRM and r/sales. Re-check.
  - Angle: find → triage (Hot/Warm/Research) → track → follow up, without spreadsheets.
  - Flag: describe Reddix as a lead list with statuses, not a full CRM. Say when a real CRM is still needed.
- [ ] **L1: How to Use Reddit for B2B Lead Generation in 2026 (Without Getting Banned)**
  - Slug: /blog/b2b-reddit-lead-generation-playbook
  - Primary: `reddit lead generation` (90/mo, CPC $15.31)
  - Supporting: `reddit lead gen` (KD 0, CPC $16.28), `how to use reddit for lead generation` (20/mo, KD 0), `reddit lead generation tool` (20/mo, KD 0), `b2b reddit marketing` (20/mo, KD 0), `how to generate leads from reddit` (KD 0)
  - Searcher: B2B founders burned out on LinkedIn InMail and cold email.
  - Gap: top results are thin agency listicles or old threads.
  - Angle: the anti-cold-outreach playbook: spot recommendation asks and competitor complaints, write consultative replies, move to DMs or a CRM without pitch-slapping.
  - Flag: similar to the live `/blog/reddit-lead-generation`, so give it this B2B angle and link to it. The "<15% open rate" claim needs a source. Move to DMs only when invited; Reddit's spam page names unsolicited messages.
- [ ] **L2: Reddit Sales Prospecting: How to Find Your First 100 B2B Customers**
  - Slug: /blog/reddit-sales-prospecting-guide
  - Primary: `reddit prospecting` (20/mo, KD 0)
  - Supporting: `reddit sales prospecting` (20/mo, KD 0), `how to find customers on reddit` (10/mo, KD 0), `social listening for saas` (10/mo, KD 0), `reddit sales pitch` (KD 0)
  - Searcher: SDRs, agency owners, bootstrappers.
  - Angle: subreddits beyond r/SaaS, search queries that signal buying intent, "Help First, Pitch Never", then qualify and save.
  - Flag: link to the live `/blog/find-customers-on-reddit`.
- [ ] **L3: Conversational Lead Generation: Why Public Reddit Replies Beat Cold DMs by 10x**
  - Slug: /blog/conversational-lead-generation-reddit
  - Primary: `conversational lead generation` (40/mo, KD 30, paid competition 0.86)
  - Angle: cold DMs feel intrusive and can trigger spam flags; a public reply solves the problem openly and keeps being read after the thread goes quiet.
  - Flag: the brief says "10x" needs a source or a softer headline. If none turns up, the title ends at "Beat Cold DMs". Reddit's spam page does name mass unsolicited messages.
- [ ] **O1: How to Do Reddit Outreach (Without Sounding Like an SDR)**
  - Slug: /blog/reddit-cold-outreach-guide
  - Primary: `reddit outreach` (20/mo, KD 0)
  - Angle: the anatomy of a non-promotional reply: immediate value, answer the pain point, mention the product only where it fits. Positions the review-first workflow against spam bots.
  - Flag: cut the Howitzer crackdown unless sourced. Follow each subreddit's link rules; don't advise "soft-linking" where links aren't allowed.

## Phase 4: Alerts and monitoring

Decent volume, but the product has no alerts, so these posts recommend alert tools for the speed half.

**Needs:** Nothing extra. See decision 2.

**Links:** M1, M2, M3 ↔ R1.

- [ ] **M1: Reddit Keyword Alerts: Why Speed-to-Lead (Not Volume) Decides Who Gets the Customer**
  - Slug: /blog/reddit-keyword-alerts-vs-intent-scoring
  - Primary: `reddit alerts` (170/mo, KD 25)
  - Supporting: `alerts for reddit` (170/mo), `reddit keyword alert` (40/mo, KD 29), `reddit keyword alerts` (20/mo, KD 0)
  - Gap: articles teach RSS feeds and Discord webhooks; none address notification fatigue or false positives.
  - Angle: speed (low-latency alerts, the first reply) and fatigue (50 irrelevant pings a day).
  - Flag: the 70–80% upvote and "90%" claims need sources. Without alerts in the product, recommend real alert tools for the speed half.
- [ ] **M2: Reddit Keyword Monitoring: Simple Alert Bots vs. AI Intent Scanners**
  - Slug: /blog/reddit-keyword-monitoring-intent
  - Primary: `reddit keyword monitoring` (30/mo, KD 0)
  - Supporting: `reddit keyword monitor` (KD 0, CPC $19.27), `reddit keyword tracker` (20/mo, KD 0, CPC $10.08), `reddit alert bot` (20/mo, KD 0), `monitor reddit for keywords` (KD 0)
  - Gap: existing content covers Google Alerts or old RSS tricks.
  - Angle: broad terms like "CRM" flood your inbox; Boolean modifiers and AI scoring isolate real buyers.
  - Flag: don't claim scoring "boosts reply conversion" without a source.
- [ ] **M3: How to Monitor Brand Mentions on Reddit (Without Alert Fatigue)**
  - Slug: /blog/how-to-monitor-brand-mentions-on-reddit
  - Primary: `how to monitor brand mentions on reddit` (40/mo, KD 0)
  - Supporting: `reddit mention tracker` (KD 0), `reddit brand mentions` (KD 0)
  - Angle: track direct mentions, competitor praise and complaints, and problem-aware questions; respond without triggering self-promotion flags.
  - Flag: Reddix finds buying intent, not every brand mention. Point to listening tools for full coverage. See conflict #7.

## Phase 5: Social listening roundups

Bigger keywords and buyers with budget. R1, R2 and R5 cover overlapping tools, so each needs a clearly different frame.

**Needs:** Price checks on every tool named, the week each post is written.

**Links:** R2 ↔ R1 and A1–A5.

- [ ] **R2: The 6 Best Reddit Social Listening Tools for 2026**
  - Slug: /blog/best-reddit-social-listening-tools
  - Primary: `reddit social listening tool` (40/mo, KD 29, CPC $16.22)
  - Supporting: `reddit tracker` (140/mo, KD 37), `reddit listening tool` (50/mo, KD 25, CPC $12.76), `reddit listening tools` (50/mo, KD 33), `reddit mentions` (50/mo, KD 22, CPC $15.33)
  - Angle: tiers: simple email alerts, real-time webhooks, AI intent classification plus lead tracking. Compare Reddix, Brand24, Mention, Syften, F5Bot and others.
  - Flag: Reddix sits in the third tier with no alerts. GummySearch can't be a pick. The research covers Brandwatch, Syften and F5Bot; Brand24 and Mention are unchecked.
- [ ] **R3: Reddit Social Listening on a Budget: Enterprise Tools vs. Founder-First Monitors**
  - Slug: /blog/reddit-social-listening-enterprise-vs-founder-tools
  - Primary: `reddit social listening` (210/mo, CPC $13.51, ad competition 0.66; KD 38, see conflict #2)
  - Supporting: `best social listening tools` (720/mo, CPC $46.79)
  - Gap: dominated by enterprise platforms.
  - Angle: general tools treat Reddit as one source among many and don't filter for purchase intent; Reddix surfaces buyers at $45/mo or $150 lifetime.
  - Flag: drop "vanity" and "afterthought" framing unless shown. Enterprise tools do real work Reddix doesn't. Brandwatch's August 2026 Reddit data change is sourced in `alternatives/brandwatch/RESEARCH.md`. Pricing ranges conflict, so check each vendor.
- [ ] **R4: B2B Social Listening: How to Turn Reddit & Communities into a Sales Pipeline**
  - Slug: /blog/b2b-social-listening-guide
  - Primary: `b2b social listening` (170/mo, KD 25)
  - Supporting: `social media listening tool` (720/mo, CPC $30.69)
  - Angle: B2C listening tracks brand names; B2B listening finds unbranded problem statements ("How do you guys handle X?", "Tired of tool Y").
  - Flag: "buyers ask Reddit before Google" needs a source. The Reddit and SurveyMonkey study found search is the most-used early channel, and 32% of software buyers had researched on Reddit.
- [ ] **R5: The Best Reddit Marketing Software in 2026: Alert Bots vs. Scrapers vs. AI Lead Finders**
  - Slug: /blog/reddit-marketing-software-comparison
  - Primary: `reddit marketing tools` (90/mo, KD 25)
  - Supporting: `reddit marketing software` (KD 0, CPC $6.80)
  - Angle: sort tools by maturity: free scrapers, listening suites, intent engines.
  - Flag: it shares its frame with the `/alternatives` field guide; link to it and don't repeat it.

## Phase 6: Strategy, SEO and AI search

**Needs:** Real, sourced case studies for P2.

- [ ] **P1: Reddit Organic Marketing: The 2026 Playbook for Bootstrapped Startups**
  - Slug: /blog/reddit-organic-marketing-playbook
  - Primary: `reddit marketing strategy` (320/mo, CPC $9.45)
  - Supporting: `reddit organic marketing` (30/mo, KD 26, CPC $5.86; see conflict #1), `how to use reddit for b2b marketing` (KD 0)
  - Gap: existing guides are generic ("post memes in relevant subreddits").
  - Angle: find problem-aware subreddits, build helpful standing, track competitor churn posts, turn participation into pipeline.
- [ ] **P2: Reddit Growth Hacking: How to Land Your First $10k MRR Without Paid Ads**
  - Slug: /blog/reddit-growth-hacking-playbook
  - Primary: `reddit growth hacking` (20/mo, KD 0)
  - Supporting: `social listening for startups` (KD 0, ad competition 0.86)
  - Searcher: bootstrapped founders, Indie Hackers, early-stage teams.
  - Angle (case-study format): micro-communities, threads ranking in Google, value-packed teardowns, signups without spam links.
  - Flag: there's no Reddix case study to draw on. Use public founder accounts, linked and attributed. If none reaches $10k, raise it in the hand-off.
- [ ] **P4: How Reddit Mentions Shape AI Search Results (ChatGPT, Perplexity & GEO in 2026)**
  - Slug: /blog/reddit-mentions-ai-search-perplexity
  - Primary: `how do brand mentions on reddit impact ai search results` (KD 0)
  - Supporting: `brand mentions on reddit ai search` (KD 0)
  - Angle: AI engines cite Reddit because it reflects real discussion; show up in high-intent threads before the answer gets written.
  - Flag: cut "trains AI tools to recommend you" and "in real time"; neither is shown. Reddix doesn't measure citations. Write fresh; see "Other sites you own".
- [ ] **P5: Reddit Keyword Research: Find the Hidden Subreddits Where Your Buyers Hang Out**
  - Slug: /blog/reddit-keyword-research
  - Primary: `reddit keyword research` (260/mo, KD 19, CPC $7.96)
  - Supporting: `reddit keyword research tool` (140/mo, KD 31)
  - Angle: founders watch r/SaaS and r/startups; turn buyer problems into niche communities and search queries.
  - Flag: show Subreddit Discovery and the buyer phrases scans write. There's no keyword tool to show.

## Phase 7: Research and developers

Lower commercial intent, or further from the product. Q3 is the exception: it may move up once the Settings field ships.

**Needs:** A competitors field in Settings for Q3. Today competitors only come from the website analysis, and only if the site names them.

**Links:** Q1 ↔ Q2 ↔ Q3.

- [ ] **Q1: How to Use Reddit for Market Research Before Writing a Single Line of Code**
  - Slug: /blog/reddit-market-research
  - Primary: `reddit market research` (20/mo, KD 0, CPC $11.60)
  - Supporting: `how to conduct market research reddit` (20/mo, KD 0), `how to use reddit for market research` (KD 0)
  - Angle: scan complaints, feature requests and budget talk to validate an idea or sharpen a value proposition.
  - Flag: Reddix isn't a research tool, so teach the manual method.
- [ ] **Q2: Reddit Sentiment Analysis: Uncover Competitor Churn & Feature Gaps**
  - Slug: /blog/reddit-sentiment-analysis-guide
  - Primary: `reddit sentiment analysis` (210/mo, KD 37, CPC $4.90)
  - Searcher: PMs and founders checking demand or competitor weaknesses.
  - Angle: why users cancel incumbents, which pricing frustrates them, how to position in those threads.
  - Flag: Reddix has no sentiment analysis. Teach it as a qualitative method.
- [ ] **Q3: Reddit Competitor Displacement: How to Win Buyers Complaining About Incumbents**
  - Slug: /blog/reddit-competitor-displacement-playbook
  - Primary: `reddit competitor monitoring` (KD 0)
  - Supporting: `reddit competitor analysis` (CPC $14.20; see conflict #9)
  - Angle: buyer-regret phrases ("looking for an alternative to [Competitor]", "moving away from [Competitor]"); join the conversation without looking predatory.
  - Flag: the scanner's real rules back this up: competitor complaints rate Hot, with +25 for a named competitor and +10 for "alternative to". Replace "alert setups" with scans. A use-case page on the same topic would need its own keyword.
- [ ] **T1: The Reddit Scraper Dilemma: Why Custom Python Scrapers Fail & What Modern Teams Use**
  - Slug: /blog/reddit-scraper-alternative
  - Primary: `reddit scraper` (590/mo, CPC $2.93; KD 37, see conflict #2)
  - Supporting: `how to scrape reddit` (140/mo, CPC $5.31), `how to scrape data from reddit` (KD 16)
  - Searcher: developers hitting rate limits and API pricing.
  - Angle: API limits, token costs and IP bans vs. buying the workflow.
  - Flag: cut "real-time" and "40 hours" unless sourced. Disclose that Reddix itself finds posts through a third-party search API. GummySearch's failed licence talks are a verified example.
