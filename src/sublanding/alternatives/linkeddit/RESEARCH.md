# Linkeddit: research notes

Checked 2026-10-27. Facts below come from pages opened on that date (see Sources). Live pages were read with a fetch tool and as raw HTML. The history comes from Internet Archive (Wayback Machine) captures of the vendor's own pages, read as raw HTML.

## 1. Exists / status

- Official URL: https://linkeddit.com [1]. The footer says "Linkeddit is a product of Pavado Technologies Inc." [5]
- Status: **active company, but the Reddit lead-finding product has been dropped from the site. The product has rebranded and pivoted.**
  - **Today (2026-10-27):** the site sells competitive intelligence for small SaaS teams [1]: competitor briefs, review monitoring, Google rankings, and "Answer Radar", which checks whether ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews recommend you [1][2][3]. The live homepage and pricing page do not mention Reddit lead generation [1][2].
  - **Former Reddit pages are gone:**
    - /reddit-leads returns **410 Gone** ("permanently removed") [6]
    - /chrome-extension returns 410 Gone [7]
    - /lifetime-deal returns 410 Gone [8]
  - **History:**
    - 2025-12-02: titled "#1 AI powered Reddit Lead Generation Tool" [10]
    - April and June 2026: "Reddit Lead Generation Tool — Find Leads on Reddit With AI" [11][12]
    - 2026-07-10: the homepage was retitled "AI Demand & Competitor Intelligence Platform", but Reddit Leads, Monitoring and the Chrome extension were still in the menu [13]
    - 2026-09-15: the archived pricing page still sold Pro at $49/mo with Reddit lead-gen pipelines, Reddit monitors and the DM extension [16]
    - 2026-10-27: the live pricing page offers a single $60/mo "Compete" plan with no Reddit lead features [2]
  - **Pivot date: uncertain.** It falls between 2026-09-15 and 2026-10-27.
  - **No official announcement was found.** The blog and help centre do not mention a sunset [3][4].
  - Whether existing users still have Reddit lead features inside the app is **unknown**.
- The Chrome Web Store listing for "Linkeddit Outreach" is still live: v0.3.0, last updated 2026-05-19, 15 users, beta [9].

Sections 2–8 describe both the **current** product and the **former Reddit product**, labelled as such.

## 2. What it is

**Current:** Linkeddit sells competitor and "AI search visibility" intelligence to SaaS teams and agencies. It tracks competitor moves and reviews, and measures where AI answer engines recommend competitors instead of you. It is also usable from AI agents through an MCP connector [1][2][3].

**Former Reddit product (up to at least 2026-09-15):** you described your product in plain language, and AI "pipelines" searched Reddit conversations for users who seemed to need it. Each lead came with a buying-intent score, activity context and direct thread links, ready to export or contact [10][11][12]. It was later bundled with a Reddit content writer, a Reddit CMS, keyword research, scheduled Reddit monitors and a DM/comment Chrome extension [12][15][16].

## 3. How it works

**Current product** [1][2][3]:
- Sources: competitor sites and changelogs; reviews on G2, Capterra, TrustRadius and Trustpilot; Google rankings and Search Console; AI answer engines (ChatGPT, Gemini, Perplexity, Claude, Google AI Overviews).
- The live pricing page does not list Reddit as a source [2].
- MCP connector with 47 tools [3]. A weekly email brief [4].
- No Reddit lead alerts, reply drafting or Reddit posting are described on the live site.

**Former Reddit product (archived)**:
- **Data sources:** Reddit posts, comments and user activity, including karma and engagement [10]. From July 2026, Compete-tier pain points came from "Reddit + reviews" [15].
- **Search vs alerts vs AI scoring:** AI lead-gen "pipelines" scored leads by buying intent and engagement. Homepage examples showed scores such as 92 or 87 [11][12]. "Reddit monitors" ran "Scheduled keyword scans with AI reply suggestions": 5 on Pro, unlimited on Enterprise [15][16].
- **Alert channels:** not stated on the pages opened. A "Keyword Alerts" use-case link appeared in the footer [16].
- **Reply drafting:** yes. It offered AI comment generation and reply suggestions [10][16].
- **Posting / automation on Reddit:** the Linkeddit Outreach Chrome extension sends AI-drafted DMs and comments "from your own Reddit account" [9]. The user can edit drafts before sending [9]. Its safety settings are:
  - a 60-second to 5-minute pace
  - a 30-actions-per-day cap per mode
  - automatic rate-limit backoff
  - it never holds your Reddit password [9]

  The pricing page also listed "Post scheduling" under the Reddit CMS [16]. Whether that posted automatically was not stated.
- **Multiple accounts:** not mentioned on its site.

## 4. Pricing (checked 2026-10-27)

**Current (live)** — https://linkeddit.com/pricing [2]:
- **Compete: $60 per month**, billed monthly, cancel anytime. Includes:
  - a weekly graded brief on up to 12 competitors
  - review monitoring
  - Google rankings and Search Console data
  - Answer Radar
  - Claude connector with all 47 tools
  - priority support
- More than 12 competitors or a team setup: contact sales.
- The homepage says "Free account. No credit card." [1] The pricing page does not describe free-account limits.
- No Reddit lead-generation plan is offered.

**Former pricing (archived, for context only):**
- 2025-12-02: "Pro Lifetime" at $69.99 one-time [10].
- 2026-04-17: Pro Monthly at $49/month [14].
- 2026-07-13 and 2026-09-15 [15][16]:
  - Pro: $49/mo, with unlimited lead-gen pipelines, 5 Reddit monitors and the Chrome extension for DMs
  - Compete: $99/mo
  - Enterprise: custom
  - Pro Lifetime: $450 one-time

## 5. Notable features

Current:
- Weekly competitor brief graded by priority, covering up to 12 competitors — https://linkeddit.com/pricing [2]
- Answer Radar for AI-engine recommendation gaps, with cited sources and re-measurement — https://linkeddit.com/pricing [2]
- MCP connector (OAuth, 47 tools) for Claude and other agents — https://linkeddit.com [1]

Former Reddit features (archived):
- Plain-language product description that becomes an AI lead pipeline with intent scores — https://linkeddit.com (archived 2026-04-15) [11]
- Reddit monitors with AI reply suggestions — https://linkeddit.com/pricing (archived 2026-09-15) [16]
- Reddit CMS (kanban and calendar), AI content writer, subreddit research — https://linkeddit.com/pricing (archived 2026-09-15) [16]
- Chrome side-panel extension for AI-drafted DMs and comments — https://chromewebstore.google.com/detail/foklfdajgigmbfnbachjfcjocnppdbmp [9]

## 6. Where it's stronger than a competitor might be

- **Current product:** it does a different job from a Reddit lead finder. It offers competitor intelligence plus AI-answer visibility from multiple sources (review sites, Google, AI engines) in one $60 plan [2], and agent access through MCP [1]. Buyers who want that, rather than Reddit leads, may prefer it.
- **Former Reddit product:** it had a broad Reddit toolkit for one price: leads, monitors, a content writer, a CMS and outreach in a $49/mo or lifetime plan [16]. It also published a 4.4/5 G2 rating and a 4.3/5 Capterra rating on its homepage [13]. Those ratings are vendor-reported and were not checked on G2 or Capterra.

## 7. Limits stated or evident from its own materials

- Reddit lead finding is **no longer offered on the live site**. The former Reddit pages return 410 Gone [2][6][7][8].
- No migration or sunset notice was found in the blog or help centre [3][4].
- The current plan caps tracked competitors at 12 [2].
- The DM/comment extension (former) was capped at 30 actions per day per mode and needed a Pro account [9]. It is now orphaned from the site but still listed in the Chrome Web Store [7][9].
- Multiple Reddit accounts: not mentioned on its site.
- Alert channels (email, Slack, etc.) for Reddit monitors: not mentioned on the pages opened.

## 8. What a buyer comparing it to another Reddit lead-finding tool needs to know

- As of 2026-10-27, **Linkeddit does not sell a Reddit lead-finding product.** It is now a competitive-intelligence and AI-visibility tool [1][2].
- Old reviews, directory listings and comparisons describe the former Reddit product, including $49/mo Pro, a $69.99 or $450 lifetime deal, monitors and the DM extension. Those details are out of date [10][16].
- Lifetime-deal buyers of the Reddit product: what they now get is not stated anywhere opened (uncertain).
- **Recommendation for a "Reddix vs Linkeddit" page:** frame it for former users of Linkeddit's Reddit features. Do not compare against current Reddit features, because there aren't any on the live site.
- If you mention the old extension, note it sent DMs and comments from the user's own account, with daily caps [9].

## 9. Sources

1. https://linkeddit.com — live homepage (fetch tool and raw HTML). Confirmed: "Competitive Intelligence for Small SaaS Teams" positioning, MCP connector details (47 tools, OAuth), "Free account. No credit card.", and no Reddit lead-gen messaging.
2. https://linkeddit.com/pricing — live pricing. Confirmed: one plan, Compete, $60/month billed monthly, up to 12 competitors, contents as listed, and no Reddit lead features.
3. https://linkeddit.com/blog — confirmed: about 150 posts, recent ones on AEO/CI, and no post about Reddit lead gen, a pivot or a sunset.
4. https://linkeddit.com/help — confirmed: help sections on Compete, Search, Keyword Research, Answer Radar, MCP and FAQ. No Reddit leads, monitors or extension docs, and no sunset notice.
5. https://linkeddit.com/features/reddit-leads — returned 404. Its footer confirmed "a product of Pavado Technologies Inc."
6. https://linkeddit.com/reddit-leads — returned HTTP 410 Gone ("permanently removed"). Wayback shows it returned 200 on 2026-05-14 (https://web.archive.org/cdx/search/cdx?url=linkeddit.com/reddit-leads).
7. https://linkeddit.com/chrome-extension — returned HTTP 410 Gone.
8. https://linkeddit.com/lifetime-deal — returned HTTP 410 Gone.
9. https://chromewebstore.google.com/detail/foklfdajgigmbfnbachjfcjocnppdbmp — confirmed: "Linkeddit Outreach" v0.3.0, updated 2026-05-19, 15 users, beta. Sends AI-drafted DMs and comments from your own Reddit account; 60 s–5 min pacing; 30 actions/day per mode; requires Linkeddit Pro.
10. https://web.archive.org/web/20251202205926/https://linkeddit.com/ — confirmed: "#1 AI powered Reddit Lead Generation Tool", how the AI agents worked, data shown per lead, and Pro Lifetime at $69.99 one-time.
11. https://web.archive.org/web/20260415213919/https://linkeddit.com/ — confirmed: "The Reddit Marketing Platform", AI intent scoring, CSV export, MCP launch banner.
12. https://web.archive.org/web/20260609153359/https://linkeddit.com/ — confirmed: Reddit lead gen, Reddit monitoring, Chrome extension and competitor analysis in the menu.
13. https://web.archive.org/web/20260710204514/https://linkeddit.com/ — confirmed: retitled "AI Demand & Competitor Intelligence Platform", Reddit features still in the menu, G2 4.4 and Capterra 4.3 badges.
14. https://web.archive.org/web/20260417190746/https://linkeddit.com/pricing — confirmed: "Reddit Lead Generation Tool Pricing", Pro Monthly $49/month.
15. https://web.archive.org/web/20260713034748/https://linkeddit.com/pricing — confirmed: Pro $49/mo, Compete $99/mo, Enterprise custom, and the features listed above.
16. https://web.archive.org/web/20260915022434/https://linkeddit.com/pricing — confirmed: Pro $49/mo, Compete $99/mo, Pro Lifetime $450 one-time, 5 Reddit monitors with AI replies, Chrome extension for DMs, post scheduling.
