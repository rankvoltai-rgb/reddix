# Subreddit Signals — research notes

Checked: 2026-10-27. All claims below come from the vendor's own pages unless marked otherwise.

## 1. Exists / status

- **Official URL:** https://www.subredditsignals.com
- **Status:** Active. The site is live with self-serve sign-up and pricing. Its blog's most recent posts are dated Jul 30, 2026 [5]. There is no public changelog, so we can't say when the product itself last changed.
- **Confirmed Reddit product:** Yes. It is a Reddit-only customer-discovery and lead tool [1].

## 2. What it is

Subreddit Signals watches a set of subreddits you choose and ranks new posts by how well they fit your product and how much buying intent they show. It is aimed at founders, small growth teams and agencies who want a short daily list of Reddit threads worth answering, and who will reply by hand from their own accounts [1]. It also sells a managed service, starting at $2,000/month, for teams that want the work done for them [1].

## 3. How it works

- **Data source and platforms:** Reddit only, limited to communities you pick. The homepage says it does not monitor all of Reddit [1]. The lead-scoring page says subreddits are watched through the official Reddit API [3], and the keyword-alerts page shows an "Official Reddit API" badge [4]. Subreddit suggestions are generated from your product description [1].
- **Keywords vs search vs AI scoring:** You enter keywords, competitor names and pain-point phrases for each brand, and an AI layer then scores each match for intent [4]. Posts are scored 1–10 on five dimensions: Lead Gen, Fit, Engagement Opportunity, Relevance and Authenticity. Keywords feed only the Relevance score [3]. A lead is flagged HOT when Lead Gen or Engagement is 7 or higher [3]. Intent is sorted into four stages: Problem Aware, Solution Seeking, Comparing Options and Purchase Ready [3]. Scores are described as prioritization aids, not conversion predictions [1][3].
- **Freshness:** The vendor says matches arrive about five minutes after posting, using a multireddit "new posts" path rather than periodic polling. It reports that its earlier polling lag was about 3.3 hours, measured on its own system [4]. The lead-scoring page says new posts and comments are scored in real time [3], but the keyword-alerts page only talks about new posts [4]. Whether comments are covered is therefore **uncertain**.
- **Alert channels:** An in-app filterable feed and email digests on all plans. Slack alerts for high-scoring leads on Pro only, delivered by webhook [1][4].
- **Analytics/reports:** Pain Points Radar groups recurring pain points from qualifying leads and tracks how often they come up. The vendor says it is not Reddit-wide trend analysis [1]. Other listed features are Competitor Intelligence, Reddit + AI traffic attribution, AI Chat Insights, and Thread & Comment Analysis (Pro) [1][2].
- **Drafts replies:** Yes. On request it drafts a reply using a "Voice Profile" (Comment Builder), which you edit [1].
- **Posts anything:** No. The homepage says it "does not auto-post replies," and you post from your own Reddit account [1].

## 4. Pricing (checked 2026-10-27)

Source: https://www.subredditsignals.com/pricing [2]

| Tier | Monthly | Annual | Main limits |
|---|---|---|---|
| Starter | $29/mo | $24/mo billed annually ($288/yr) | 1 brand, up to 10 subreddits, 15 Weekly Lead Tokens |
| Pro | $59/mo | $49.17/mo billed annually ($590/yr) | Up to 5 brands, up to 25 subreddits, 25 Weekly Lead Tokens, Slack alerts, "expanded monitoring capacity" |
| Managed service | from $2,000/month | n/a | Done-for-you monitoring, signal review, competitor and pain-point analysis, reports. Fit is confirmed on a strategy call [1] |

- **Free plan:** None listed.
- **Trial:** 14 days on Starter and Pro. A card is required at sign-up, and you are not charged during the trial [2].
- **Not stated:** seat limits and keyword limits [2].
- **Contradictions on the vendor's own page** [2]:
  - Pro lists "Unlimited subreddits" but also "Up to 25 subreddits." The FAQ says neither plan includes unlimited subreddits.
  - Starter's feature list includes Pain Points Radar, Competitor Intelligence and AI-traffic attribution, but the comparison table and FAQ put these in Pro.
  - Starter lists both "Basic email support" and "Priority support."
- Third-party directories appeared in search results with different prices. I did not open them, so they are not cited here. Use the vendor page.

## 5. Notable features

- Five-dimension AI lead scoring with HOT/WARM flags and adjustable thresholds: https://www.subredditsignals.com/how-it-works/lead-scoring [3]
- Four-stage buyer-intent classification (Problem Aware through Purchase Ready): https://www.subredditsignals.com/how-it-works/lead-scoring [3]
- Authenticity score that tries to filter out spam, self-promotion and automation: https://www.subredditsignals.com/how-it-works/lead-scoring [3]
- Matches arrive about 5 minutes after posting (vendor claim): https://www.subredditsignals.com/reddit-keyword-alerts [4]
- Comment Builder with Voice Profiles for drafting replies, with no auto-posting: https://www.subredditsignals.com [1]
- Pain Points Radar: https://www.subredditsignals.com [1]
- Reddit + AI traffic attribution: https://www.subredditsignals.com [1], https://www.subredditsignals.com/pricing [2]
- Multi-brand workspaces (up to 5 on Pro): https://www.subredditsignals.com/pricing [2]
- Slack alerts via webhook (Pro): https://www.subredditsignals.com/reddit-keyword-alerts [4]
- Managed service from $2,000/month: https://www.subredditsignals.com [1]
- Engagement Queue, Campaign Automations and Daily Streak Gamification are listed by name. Their details are not explained on the pages I opened: https://www.subredditsignals.com [1]

## 6. Where it's stronger than a focused lead tool might be

- **Transparent scoring model:** It publishes its scoring dimensions, score bands, HOT/WARM thresholds and intent stages [3]. That is more detail than many tools show.
- **Authenticity scoring:** A dedicated score for whether a post looks organic or spammy [3].
- **Low entry price with annual discount:** $24/mo billed annually for Starter [2].
- **Agency-friendly Pro tier:** Up to 5 brands under one $59/mo plan [2].
- **Extras beyond lead alerts:** Pain-point clustering, competitor intelligence and Reddit/AI traffic attribution, though which plan includes each one is inconsistent on the pricing page [1][2].
- **Managed option:** A done-for-you service for teams without time to work leads [1].
- **Explicit no-auto-post stance:** The site states plainly that it does not auto-post [1].

## 7. Limits stated or evident from its own materials

- Only monitors subreddits you choose, not all of Reddit [1].
- Subreddit caps: 10 on Starter, 25 on Pro [2]. Weekly Lead Token caps: 15 on Starter, 25 on Pro [2]. The page I opened does not explain exactly what a "Lead Token" consumes.
- Slack is Pro-only [1][4].
- The vendor says it is not a fit for open-ended Reddit-wide research, mass outreach, automatic posting, or audiences that don't discuss relevant problems on Reddit [1].
- Pain Points Radar is described as not Reddit-wide trend analysis [1].
- Scores are not conversion probabilities. Authenticity "cannot verify a person's identity." Purchase Ready labels should be checked by hand [3].
- The model's internals and weights are not disclosed, and no accuracy metrics are published [3].
- Comment coverage is not clearly stated: one page mentions comments [3] and another mentions only posts [4].
- Public docs and a changelog are not mentioned on its site.
- The pricing page contradicts itself on subreddit limits and on which plan includes which features (see section 4) [2].

## 8. What a buyer comparing it to a Reddit lead-finding tool needs to know

- It covers Reddit only, and only the subreddits you list, with a hard cap of 10 or 25. If your buyers post in many or unpredictable subreddits, check whether the cap fits.
- Weekly Lead Tokens (15 or 25 a week) cap how many leads you can work. Confirm what a token is used for before comparing per-lead value.
- It drafts replies but never posts them. Slack alerts need Pro at $59/mo.
- Its pricing page contradicts itself. Confirm the plan contents in the trial, which needs a card up front.
- Its strongest differentiators are the published scoring rubric, the authenticity score, and pain-point and attribution analytics. A buyer weighing a focused lead tool should compare lead quality and speed, not feature count.

## 9. Sources

1. https://www.subredditsignals.com — Homepage. Confirmed the product description, target users, Reddit-only scope limited to chosen communities, alert channels, Voice Profile drafts, the "does not auto-post replies" statement, the feature list, Starter/Pro prices, the 14-day trial and the managed service from $2,000/month.
2. https://www.subredditsignals.com/pricing — Confirmed the tier prices, annual prices, limits (brands, subreddits, Weekly Lead Tokens), trial and card terms, and the contradictions noted in section 4.
3. https://www.subredditsignals.com/how-it-works/lead-scoring — Confirmed the five scoring dimensions, 1–10 bands, HOT/WARM thresholds, four intent stages, official Reddit API, real-time scoring of posts and comments, and the stated limitations.
4. https://www.subredditsignals.com/reddit-keyword-alerts — Confirmed keyword, competitor and pain-phrase setup with AI intent scoring, the roughly 5-minute latency claim, the earlier ~3.3h polling lag, email, in-app and Slack (Pro, webhook) delivery, and the "Official Reddit API" badge.
5. https://www.subredditsignals.com/blog — Confirmed recent activity (latest posts dated Jul 30, 2026) and competitor-comparison posts (Brand24, F5Bot, Threadlytics, Redreach). No changelog posts.
