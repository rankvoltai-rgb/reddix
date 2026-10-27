# F5Bot: research notes

Checked 2026-10-27. All facts below come from pages opened on that date (see Sources). Page content was read through a fetch tool that summarises pages, so short quotes should be spot-checked against the live page before they are published.

## 1. Exists / status

- Official URL: https://f5bot.com/ [1]
- Status: **active.** The site shows live sign-up, pricing and docs pages, and its guide footer reads 2017–2026 [3].
- Operated by F5Bot LLC and first released in 2017 [4]. The About page says it sends over 430,000 alerts a day [4].

## 2. What it is

F5Bot is a keyword-alert service. It emails you when a word or phrase you track appears in new posts or comments on Reddit, Hacker News or Lobsters [1][5]. It started as a free tool for individuals tracking brand names or niche terms. It now has paid tiers for businesses and agencies, adding faster alerts, higher caps, integrations and AI filtering [2]. The FAQ says it is designed for "fairly uncommon keywords or phrases" [5].

## 3. How it works

- **Platforms:** Reddit, Hacker News and Lobste.rs, in both submissions and comments [5]. On Reddit it scans post titles, linked URLs and comment text, and skips usernames unless you turn that on [3].
- **Frequency:** checks for new content every few minutes [5]. Alert delay depends on the plan: up to 2 hours on Free, up to 5 minutes on Silver, instant or scheduled on Gold and above [2].
- **Matching model:** keyword matching, case-insensitive [5].
  - Flags include whole-word matching, site filters (e.g. `only-reddit`) and `only-subreddit=` [3].
  - Paid flags include `exclude=`, `include-any=` and `include-all=` [7].
  - The FAQ says it does not support regular expressions or wildcards [5].
- **AI filtering (Gold and above):** you describe in plain language what should match.
  - A filter can watch selected sources directly (up to 5 subreddits per filter), or you can route keyword matches to it with an `ai=` flag [6].
  - The model or provider is not named [6].
- **Alert channels:** email on all plans, including instant, delayed and daily-digest options [1][7].
  - Gold adds RSS/JSON feeds and Slack/Discord [2].
  - Platinum adds API access and webhooks [2].
- **Posting or automation on Reddit:** no posting or replying feature is described on the homepage, FAQ or docs pages opened. They describe only monitoring and alerts [1][5][7].
- **Multiple accounts:** not mentioned on its site.
- **Data source:** how it collects Reddit data is not mentioned on its site [4][5].

## 4. Pricing (checked 2026-10-27)

Source: https://f5bot.com/tiers [2]

| Tier | Price | Keywords | Daily alerts (per keyword / total) | Alert delay | Notable inclusions |
|---|---|---|---|---|---|
| Free | $0 | 5 | 10 / 20 | Up to 2 hours | Email. 7-day match history. Personal use only |
| Silver | $12.99/mo, or $143/yr | 20 | 30 / 100 | Up to 5 minutes | Ad-free emails, paid flags, common words, full post text. Non-commercial use |
| Gold | $49.99/mo, or $549/yr | 200 | 100 / 5,000 | Instant or scheduled | 90-day history, RSS/JSON, 1 Slack/Discord integration, 2 AI filters, mass keyword upload |
| Platinum | $214.99/mo, or $2,364/yr | 300 | 500 / 200,000 | Instant or scheduled | 3 Slack/Discord integrations, 5 AI filters, API and webhooks |
| Diamond (enterprise) | Starting at $500/mo | Custom | Custom | Instant or scheduled | Custom. Contact sales |

- AI filtering includes the first $10/month of LLM token usage. Usage above that is billed on top of the plan [2][6].
- Silver is labelled for personal, non-commercial use. The tiers page points business or client monitoring to Gold [2].
- The free plan sends emails with small text ads [5].
- Annual plans are described as "1 mo free" [2].
- The homepage shows Free, Silver, Gold and "Enterprise" [1]. The /tiers page shows the fuller Free, Silver, Gold, Platinum and Diamond lineup [2]. Use /tiers as the reference.
- The AI filtering docs also mention a legacy "Ultra" tier [6].

## 5. Notable features

- Free-forever keyword alerts across Reddit, HN and Lobsters [1][2]: https://f5bot.com/tiers
- Scans titles, URLs and every comment body [3][5]: https://f5bot.com/guides/reddit-keyword-alerts
- Subreddit and site filter flags, plus whole-word matching [3]: https://f5bot.com/guides/reddit-keyword-alerts
- Include/exclude co-occurrence flags on paid plans [7]: https://f5bot.com/docs-power
- Plain-language AI filters, with token usage billed separately above $10/mo [6]: https://f5bot.com/docs-semantic
- Daily digest at up to 3 scheduled times [7]: https://f5bot.com/docs-power
- RSS/JSON feeds, Slack/Discord, API and webhooks on higher tiers [2][7]: https://f5bot.com/tiers

## 6. Where it's stronger than a focused Reddit lead tool

- **Free entry point:** a genuinely free plan with 5 keywords and no credit card required [1][2]. Most lead tools have no free plan.
- **Simplicity:** keyword-in, email-out. You need almost no setup for brand-name or niche-term tracking.
- **Beyond Reddit:** also covers Hacker News and Lobsters [5], which helps for developer-tool and tech products.
- **Scale at the top:** Platinum allows 200,000 alerts a day with API and webhooks [2], so it can feed your own pipeline.
- **Track record:** running since 2017 [4].

## 7. Limits stated or evident from its own materials

- No regular expressions or wildcards [5].
- Designed for fairly uncommon keywords. Free accounts cannot monitor very common words [5].
- A keyword that exceeds its daily cap is disabled [5]. The caps start at 10 per keyword per day on Free [2].
- Free alerts can be delayed up to 2 hours, and Silver up to 5 minutes [2].
- The free tier is for personal use, and Silver is non-commercial [2].
- AI filtering is capped at 2 filters on Gold and 5 on Platinum, each watching up to 5 subreddits. Token usage above $10/mo costs extra [2][6].
- Coverage is limited to Reddit, Hacker News and Lobsters [5].
- Lead scoring, reply drafting and a CRM-style lead inbox are not mentioned on its site.
- How it obtains Reddit data is not mentioned on its site.

## 8. What a buyer comparing it to a Reddit lead-finding tool needs to know

- F5Bot is a keyword alert tool: it tells you when a term appears. Out of the box it does not judge buying intent. The closest it gets is optional AI filters on Gold ($49.99/mo) and above, limited to 2 or 5 filters [2][6].
- The free and Silver tiers are personal or non-commercial only. Business use starts at Gold, $49.99/mo [2].
- Without regex or wildcards, and with common words blocked on Free, broad intent phrases ("looking for a tool") are hard to track well [5].
- Alerts arrive as matches in email or a feed. Working the leads (prioritising, drafting replies, tracking status) is not described on its site.
- It is a strong, low-cost choice if all you need is to catch your brand or competitor names on Reddit and HN.

## 9. Sources

1. https://f5bot.com/ : homepage. Confirmed the platforms (Reddit, HN, Lobsters), free plan, summary tiers, email alerts, and that no posting is described.
2. https://f5bot.com/tiers : pricing page. Confirmed every tier price, annual price, keyword and alert cap, delay, integration, AI filter count, API/webhook availability, commercial-use labels, and the $10 AI token allowance.
3. https://f5bot.com/guides/reddit-keyword-alerts : guide. Confirmed what is scanned on Reddit (titles, URLs, comments), the flags (whole-word, `only-reddit`, `only-subreddit=`), and the free vs. paid differences.
4. https://f5bot.com/about : About page. Confirmed F5Bot LLC, first release in 2017, and 430,000+ alerts a day. No statement on data source.
5. https://f5bot.com/faq : FAQ. Confirmed the three sites, submissions and comments, checks every few minutes, no regex or wildcards, common-word and cap limits, ads in emails, and personal-use free tier.
6. https://f5bot.com/docs-semantic : AI filtering docs. Confirmed the filter counts per tier, 5 subreddits per filter, the `ai=` routing, token billing, legacy Ultra tier, and that no model is named.
7. https://f5bot.com/docs-power : paid features docs. Confirmed webhooks via API, Slack/Discord, RSS/JSON, digests at up to 3 times, and the paid include/exclude flags.
8. https://f5bot.com/help : help index. Only links to the docs sections above.

Search used: WebSearch "F5Bot Reddit Hacker News keyword alerts pricing Silver Gold" (standard). Third-party results quoted a $9.99 Silver price, which conflicts with f5bot.com/tiers ($12.99). The vendor's page is used.
