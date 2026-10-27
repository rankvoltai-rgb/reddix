# CatchIntent — research notes

Checked: 2026-10-27. All claims below come from the vendor's own pages.

## 1. Exists / status

- **Official URL:** https://catchintent.com
- **Status:** The company and product are active, but **it is no longer a Reddit product for new customers.**
  - CatchIntent launched with Reddit monitoring as its proof of concept in its v0.1.0 changelog entry (Dec 13, 2025), and went live on Jan 11, 2026 covering Reddit, Hacker News and Bluesky [2].
  - On **May 13, 2026** (v3.0.0, "CatchIntent is now one product"), it deprecated Reddit, HN and Bluesky monitoring **"for new buyers"** and became a LinkedIn-first "intent layer for B2B outbound" [2][3].
  - On **May 25, 2026** (v3.1.0), X/Twitter was deprecated too. The product is now described as "LinkedIn-only going forward" [2].
  - The announcement post says existing customers keep their listeners and signals on their current plan without repricing. Legacy products get bug fixes and infrastructure work only, and new features go to the new product [3].
  - Its current Reddit platform page says it does "not watch X, Reddit, Hacker News, or Bluesky" [4].
- **Bottom line:** A Reddit product named CatchIntent existed from Dec 2025 to May 2026. Today it cannot be bought as a Reddit tool. Sections 2–8 describe the **current** product, with notes on the legacy Reddit product where the changelog documents it.
- No name change: the brand is still CatchIntent [2].

## 2. What it is

Today, CatchIntent is a B2B outbound tool. It watches LinkedIn and company-event signals such as job changes, funding, hiring, competitor engagement and keyword discussions, then builds a ranked daily book of accounts and leads, each with a drafted opener [1][3][4]. It is aimed at Seed to Series A B2B SaaS teams with someone running outbound, at GTM agencies, and at buyers of its done-for-you service [1]. It used to monitor Reddit, HN, Bluesky and X for buying-intent posts, but that is now closed to new buyers [2][3].

## 3. How it works

**Current product (since May 2026):**
- **Data sources:** LinkedIn plus company-event data. The announcement says LinkedIn is the only signal source [3]. The homepage calls LinkedIn "today's richest source" and says it stays source-agnostic [1]. Enterprise lists "custom sources" [1][5].
- **Signals and scoring:** Leads are scored on signal strength, ICP fit and recency [1]. Signals are grouped into tiers: job changes and funding (A), hiring (B), and competitor engagers, keyword discussions and influencer engagers (C), plus an ICP-match baseline [4]. Signal stacking uses age-based decay [2]. Pricing claims "All 7 intent signals," but the FAQ lists eight examples, so the exact set is unclear [5]. The docs mention "warmth scoring" without giving a method [6].
- **Delivery:** A ranked account book rebuilt each business day, a daily warm-leads queue, a browser extension for sending from LinkedIn, and push to a CRM or sequencer [1][4]. The current product pages I opened don't describe email, Slack or Discord alerts for it [1][4][6].
- **Drafts:** Each lead comes with a drafted opener that cites its signal, which you can edit or regenerate [4]. MCP server access is on every plan [3].
- **Posting/sending:** You send openers from your own LinkedIn or email [2][3]. None of the changelog entries describe it posting to any platform [2].

**Legacy Reddit product (Dec 2025 – May 2026), per changelog [2]:**
- Monitored Reddit, Hacker News and Bluesky, adding X (Jan 13, 2026) and LinkedIn (Jan 15, 2026).
- Its pitch was "Signals, not mentions." The vendor claimed AI filtered out 95%+ of noise, with 0–100 relevance scores.
- Alerts went to Email, Slack, Discord or Telegram.
- AI reply suggestions in Comment mode (public reply) or DM mode (v2.1.0) were for you to copy and send. Nothing was auto-posted.
- "SEO Opportunities" (v2.7.0, Apr 8, 2026) found Reddit threads that rank on Google, with targeting for 48 countries (v2.7.1).
- Free Reddit tools such as a "Reddit Buying Intent Analyzer" were added in v1.4.0. The current free-tools page lists only LinkedIn and outbound calculators [7].

## 4. Pricing (checked 2026-10-27)

**Pricing page (https://catchintent.com/pricing/) as fetched on 2026-10-27 [5]:**

| Tier | Price shown on pricing page | Main limits |
|---|---|---|
| Growth | Not shown | 1,000 leads/mo (~50/day), 1 Product, 1 outreach account, twice-daily signal refresh |
| Scale ("Popular") | Not shown | 4,000 leads/mo (~200/day), 3 Products, 3 outreach accounts, 4x daily refresh |
| Enterprise | Custom | 25,000+ leads/mo, 25 Products, 25 outreach accounts, 8x daily refresh plus custom sources, SSO, dedicated CSM |
| Done-for-you | Starting at $1,999/mo, 3-month minimum | Not listed |

- **Growth and Scale prices:** The May 13, 2026 announcement post lists **Growth at $99/mo** and **Scale at $249/mo** [3]. The pricing page I fetched showed no dollar amount for these tiers [5], possibly because the prices load client-side. This is **uncertain**, so confirm on the live page.
- **Billing:** "We bill monthly today, no annual plans" [5].
- **Free plan:** None [5].
- **Trial:** 7 days on every plan, card on file, 50 trial leads. Cancel before day 7 and you are not charged [1][5].
- **Refunds:** Request within 14 days of your first charge [5].
- **Legacy Reddit-era pricing:** v3.0.0 says pricing went from seven tiers to three [2]. I did not find the legacy tier prices on the vendor pages I opened, so they are not given here.

## 5. Notable features

- Ranked account book rebuilt every business day, with account states (New, Working, Snoozed, Dismissed, Won): https://catchintent.com/changelog/ [2]
- Drafted openers that cite the triggering signal: https://catchintent.com/platforms/reddit/ [4]
- Browser extension for LinkedIn sending, plus CRM push: https://catchintent.com [1]
- MCP server on every plan: https://catchintent.com/blog/introducing-the-intent-layer/ [3]
- Multi-Product workspaces for agencies (up to 25 Products on Enterprise): https://catchintent.com/pricing/ [5]
- Done-for-you service from $1,999/mo: https://catchintent.com/pricing/ [5]
- Public changelog with 47 versioned entries: https://catchintent.com/changelog/ [2]
- Legacy only: Reddit/HN/Bluesky monitoring, Email/Slack/Discord/Telegram alerts, Comment and DM reply modes, Reddit SEO Opportunities: https://catchintent.com/changelog/ [2]

## 6. Where it's stronger than a focused lead tool might be

- **Account-level B2B signals:** Job changes, funding, hiring and competitor engagement on LinkedIn are buying signals a Reddit-only tool doesn't capture [1][4].
- **Outbound workflow:** Drafted openers, a browser extension for LinkedIn and push to a CRM or sequencer suit SDR-style teams [1][4].
- **Agency scale:** Up to 25 Products and 25 outreach accounts on Enterprise [5].
- **Transparency of change:** A detailed, dated public changelog and a migration post explaining what was deprecated [2][3].
- **Managed option:** A done-for-you service for teams without outbound capacity [5].

## 7. Limits stated or evident from its own materials

- Reddit, Hacker News and Bluesky monitoring is deprecated for new buyers (May 13, 2026), and X was deprecated on May 25, 2026 [2][3]. The vendor states it does not watch Reddit [4].
- Legacy customers keep Reddit monitoring but get only bug fixes and infrastructure work, no new features [3].
- The vendor says it is a weaker fit for teams with no one doing outbound, since leads "will sit unworked" [1].
- It is not a contact database and not social listening, by the vendor's own positioning [1].
- No free plan, no annual plans, and the trial requires a card [5].
- The count of "7 intent signals" doesn't match the eight examples the vendor lists [5].
- Email, Slack and Discord alerts are not mentioned on the current product pages I opened [1][4][6]. They are documented only for the legacy product [2].

## 8. What a buyer comparing it to a Reddit lead-finding tool needs to know

- **It no longer monitors Reddit for new customers.** Since May 13, 2026, it has been a LinkedIn-first B2B outbound tool [2][3][4].
- Older third-party "best Reddit tools" lists may still feature CatchIntent as a Reddit monitor. Those lists are out of date for new buyers.
- It is a different job: account-level LinkedIn signals plus outbound openers, not finding and joining Reddit threads.
- Current self-serve pricing, per the May 2026 announcement, is $99/mo (Growth) and $249/mo (Scale). The live pricing page didn't display these figures when fetched, so confirm before quoting [3][5].
- Teams that need both could pair a Reddit tool with CatchIntent. They don't directly substitute for each other.

## 9. Sources

1. https://catchintent.com — Homepage. Confirmed the "intent layer for B2B outbound" positioning, target users, LinkedIn as "today's richest source," scoring on signal strength, ICP fit and recency, drafted openers, browser extension and CRM push, the 7-day card-on-file trial, tier limits, the "will sit unworked" fit note, and links to the changelog and docs.
2. https://catchintent.com/changelog/ — Confirmed 47 dated entries, Reddit monitoring at v0.1.0 (Dec 13, 2025), launch with Reddit/HN/Bluesky (Jan 11, 2026), X and LinkedIn added in Jan 2026, legacy alert channels, Comment and DM modes, SEO Opportunities, the v3.0.0 (May 13, 2026) deprecation of Reddit/HN/Bluesky "for new buyers," the v3.1.0 (May 25, 2026) X deprecation and "LinkedIn-only going forward," and no auto-posting.
3. https://catchintent.com/blog/introducing-the-intent-layer/ — The May 13, 2026 announcement with a May 25 update. Confirmed the merge into one product, LinkedIn as the only signal source, Growth $99/mo and Scale $249/mo, DFY from $1,999/mo, that Reddit/HN/Bluesky/X monitoring was "sunset for new buyers," and the treatment of existing customers.
4. https://catchintent.com/platforms/reddit/ — The current Reddit platform URL. Its FAQ states it does "not watch X, Reddit, Hacker News, or Bluesky." Confirmed the signal tiers, drafted openers, browser extension and CRM push, and that no prices are shown.
5. https://catchintent.com/pricing/ — Confirmed the Growth/Scale/Enterprise/DFY limits, that no dollar amounts are shown for Growth or Scale, Enterprise "Custom," DFY "Starting at $1,999/mo · 3-month minimum," monthly-only billing, no free plan, the 7-day trial with 50 leads, the 14-day refund window, and the "7 intent signals" versus eight examples. Reddit is not mentioned.
6. https://catchintent.com/docs/ — Docs introduction. Confirmed the "warmth scoring" mention, drafted openers and CRM push. It does not name sources or alert channels.
7. https://catchintent.com/tools/ — Confirmed the current free tools are three LinkedIn and outbound calculators, with no Reddit tools.
