# Redreach: research notes

Checked 2026-10-27. Facts below come from pages opened on that date (see Sources). Most pages were read through a fetch tool that summarises them. Key phrases on the homepage were also checked against the raw HTML. The product is spelled "Redreach" on its own site, not "RedReach".

## 1. Exists / status

- Official URL: https://redreach.ai [1]
- Status: **active.** The changelog's latest entry is dated 2026-09-08 (MCP & API launch) [4]. The site footer reads "Copyright © 2026 Redreach" [1].
- This is the Reddit product. The footer states "Redreach is not affiliated with Reddit in any way." [1]
- Name clash to avoid: search results also show **RedReplier**, a different tool. Do not mix them up.

## 2. What it is

Redreach is an AI Reddit-marketing tool for SaaS companies, apps, e-commerce brands, consultants, local businesses and agencies [1]. You give it your website and up to three competitors. It surfaces Reddit threads where people are asking for products like yours, with a priority on threads that rank on Google. It suggests replies for you to post yourself and tracks brand and competitor mentions [1]. A second module, "Outbound", is a Chrome extension that automates bulk Reddit DMs [1][5].

## 3. How it works

- **Data sources / platforms:** Reddit only. The homepage says its AI tracks "search engine indexed Reddit posts" and brand mentions inside Reddit comments [1]. The API page describes a "SERP opportunities" feed of Reddit threads ranking on Google for your keywords, plus keyword-monitoring results [7]. The API page contrasts Redreach's processed output with Reddit's own API. It does not say how Reddit content is collected [7]. No platform other than Reddit appears in the changelog [4].
- **Keywords vs search vs AI scoring:** setup is website-plus-competitors, with "No keywords needed." [1]. The AI proposes keywords and topics, and you can add custom tracked keywords (20/40/60 by plan) [1][8]. Posts are shown with an AI relevance score (e.g. "Relevance: 94/100" in homepage examples) [1].
- **Alert channels:** Email, Slack, Telegram and Webhook [1][6]. By plan: Startup gets email only, Growth gets email and Telegram, and Professional gets email, Telegram, Slack and webhook [8].
- **Reply drafting:** yes. It gives "AI-Guided Reply Suggestions", capped at 100/300/500 by plan [8]. The homepage flow ends with "You post from your account." [1]
- **Posting / automation on Reddit:**
  - Public replies: no auto-posting. The FAQ says it does not auto-post or auto-reply. It gives Reddit's bot detection and shadow-removed comments as the reasons [1]. The API page says the API does not post to Reddit [7].
  - DMs: **yes, automated.** Outbound is a Chrome extension that sends bulk DMs by automating "the clicking and typing" in your logged-in browser session [5]. Plans include 30/100/500 "Daily Auto DMs" [8]. Targets can be subreddit members, thread commenters or a CSV of usernames. Safety features include randomised 1–60 s delays, duplicate prevention, and limits based on account age and karma [5].
- **Multiple Reddit accounts:** not mentioned on its site [1][4][5]. Its "multiple" features are team seats (1/2/3) and multiple client projects for agencies [1].
- **Other:** MCP server and REST API (Growth and Professional) [4][8]. Built-in CRM for DM outreach [5][8].

## 4. Pricing (checked 2026-10-27)

The pricing table on the homepage is rendered client-side, and the fetch tool could not see the prices. The figures below come from the plan configuration in the site's own production JavaScript bundle [8], marked `prodConfig`. The seat counts and the 3-day pass also appear in the visible homepage FAQ [1]. Treat the exact figures as **likely but not seen on a rendered page**.

| Plan | Monthly | Yearly | Main limits [8] |
|---|---|---|---|
| Startup | $19/mo | $180/yr | 1 seat; 3 tracked competitors; 20 custom keywords; 100 AI reply suggestions; weekly new leads and competitor tracking; 30 daily auto DMs; email alerts |
| Growth | $39/mo | $372/yr | 2 seats; 6 competitors; 40 keywords; 300 AI replies; daily leads and competitor tracking; 100 daily auto DMs; MCP/API; email and Telegram alerts |
| Professional | $79/mo | $756/yr | 3 seats; 8 competitors; 60 keywords; 500 AI replies; daily tracking; 500 daily auto DMs; MCP/API; email, Telegram, Slack and webhook alerts |
| 3-Day Pass | $12 one-time | — | Pro features except daily mention tracking, plus a report of ranking posts and mentions to date [1][8] |
| Agency / custom seats | Contact sales | — | hello@redreach.ai [1] |

- Free plan / trial: none is mentioned. The 3-day pass is the closest thing [1].
- Money-back guarantee: "within the first 48 hours after payment" [1].
- Uncertain:
  - The bundle also contains a legacy "Redreach Pro" plan at $29/mo, probably for older subscribers.
  - It contains a price-experiment hook ("v2_2026_06") with higher prices ($49/$99/$149 per month; 3-day pass $19). In the code these appear only in the non-production config [8].
  - Some visitors may see different prices. Re-check in a browser before publishing.

## 5. Notable features

- AI finds keywords from your website and competitors, so no manual keyword list is needed — https://redreach.ai [1]
- Focus on Reddit threads that rank on Google (SERP opportunities) — https://redreach.ai [1], https://redreach.ai/reddit-api [7]
- Brand and competitor mention tracking with sentiment insights — https://redreach.ai/changelog [4], https://redreach.ai/reddit-api [7]
- AI reply suggestions, with posts marked as replied or rejected and bulk rejection — https://redreach.ai/changelog [4]
- Outbound Chrome extension for bulk DM campaigns, with a CRM — https://redreach.ai/feature/reddit-dm-automation-tool [5]
- Alerts by email, Slack, Telegram and webhook — https://redreach.ai/alerts/reddit [6]
- MCP server and API that work with Claude, ChatGPT, Cursor and Codex (launched 2026-09-08) — https://redreach.ai/changelog [4]
- Team seats and per-member notification preferences (2026-03-25) — https://redreach.ai/changelog [4]
- Mobile-responsive interface, CMD+K launcher and keyboard shortcuts — https://redreach.ai/changelog [4]

## 6. Where it's stronger than a competitor might be

- **Fast setup:** website plus competitors, no keyword list, and results in minutes, per the vendor [1].
- **SEO angle:** it focuses on Reddit threads already ranking on Google, which helps buyers who care about long-lived search traffic [1][7].
- **Low entry price:** $19/mo, and a $12 three-day pass lets you test it without a subscription [8].
- **Wide range of alert channels on the top tier:** Slack, Telegram and webhook [8].
- **Developer access:** MCP server and API on Growth and up [4][8].
- **Active shipping cadence:** 15 changelog entries from Oct 2024 to Sep 2026 [4].
- **Inbound and outbound in one subscription:** reply suggestions and DM automation [1][8].

## 7. Limits stated or evident from its own materials

- No free plan or free trial is mentioned. The refund window is only 48 hours [1].
- The Startup plan gets weekly, not daily, new-lead and competitor updates, and email-only alerts [8].
- Reply suggestions are capped per plan (100/300/500) [8].
- Seats are capped at 3 on self-serve plans. More need a sales conversation [1].
- Reddit is the only platform covered. No other sources are mentioned on its site [1][4].
- Multiple Reddit accounts: not mentioned on its site.
- The DM extension depends on your logged-in Chrome session. The vendor advises conservative daily limits for newer accounts (roughly 10–20/day) [5].
- Pricing is not visible to a non-JS reader. The bundle shows an A/B price-experiment mechanism [8].

## 8. What a buyer comparing it to another Reddit lead-finding tool needs to know

- Redreach **does automate DMs** through a Chrome extension, with 30–500 per day by plan. It does **not** auto-post public replies [1][5][8]. If a competitor is reply-only, this is the main difference in posture.
- It ranks threads by Google visibility as well as purchase intent. That suits SEO-minded buyers, but it is a different signal from real-time "someone just asked" alerts.
- Startup ($19) refreshes weekly. Daily lead discovery starts at Growth ($39/mo) [8].
- Slack and webhook alerts are only on Professional ($79/mo) [8].
- No free trial. Budget for the $12 pass or rely on the 48-hour refund window [1][8].

## 9. Sources

1. https://redreach.ai — homepage. Confirmed: product description, setup flow, "No keywords needed", relevance scores, alert channels, FAQ on seats (1/2/3), 3-day pass contents, no auto-posting, 48-hour money-back guarantee, agency plans, not-affiliated footer. Read with the fetch tool and as raw HTML.
2. https://redreach.ai/#pricing — the homepage pricing anchor. Confirmed only that prices are not visible in the fetched content.
3. https://redreach.ai/pricing — returned HTTP 404 (no standalone pricing page).
4. https://redreach.ai/changelog — confirmed 15 dated entries (2024-10-29 to 2026-09-08): Outbound DM extension (2025-11-09), team seats (2026-03-25), multi-channel alerts (2026-04-05), DM list campaigns (2026-06-08), MCP & API (2026-09-08). Also confirmed no platforms beyond Reddit.
5. https://redreach.ai/feature/reddit-dm-automation-tool — confirmed: Chrome extension using your browser session, no credential storage, targeting options, randomised delays, limits based on account age and karma, suggested 10–20 DMs/day for new accounts.
6. https://redreach.ai/alerts/reddit — confirmed: email, Telegram, Slack and webhook alerts for keywords and brand mentions.
7. https://redreach.ai/reddit-api — confirmed: Redreach API returns its own processed data (SERP opportunities, keyword opportunities, mentions with sentiment, CRM). Says it does not post to Reddit. Does not say how data is gathered.
8. https://redreach.ai/_nuxt/H3hFDz1K.js — the site's production JS bundle, loaded by the homepage. Confirmed: `prodConfig` prices (Startup $19/$180, Growth $39/$372, Professional $79/$756, legacy Pro $29, 3-day pass $12) and per-plan feature/quota lists. Also shows a price-experiment variant ("v2_2026_06") present only in the dev config.
