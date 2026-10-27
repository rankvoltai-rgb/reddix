# Syften: research notes

Checked 2026-10-27. All facts below come from pages opened on that date (see Sources). Page content was read through a fetch tool that summarises pages, so short quotes should be spot-checked against the live page before they are published.

## 1. Exists / status

- Official URL: https://syften.com/ [1]
- Status: **active.** The changelog shows releases through 2026, the latest being a web scraper added on 2026-06-19 [3].

## 2. What it is

Syften is a keyword-monitoring and alerting service for online communities and the public web. It is aimed at founders, marketers and dev-tool teams who want to catch mentions of their brand, competitors or problem space soon after they are posted [1]. You write keyword filters. Syften watches many communities, including Reddit, and pushes matches to email, Slack, feeds, an API or webhooks. An optional AI rule screens out noise [1][2][4].

## 3. How it works

- **Platforms (multi-platform):**
  - Communities: Reddit, X/Twitter, Hacker News, Indie Hackers, GitHub, Product Hunt, the Stack Exchange family, forums, Lobste.rs, Dev.to, Steemit, Slack communities, newsletters, YouTube, podcasts, Bluesky and Mastodon [1][2].
  - The public web: articles, changelogs, docs, directories and competitor blogs [1].
  - The pricing area also lists mailing lists [2].
  - LinkedIn is not monitored. The FAQ answers "No, unfortunately not" [2].
  - X and YouTube are paid add-ons [2].
  - Quora was removed on 2025-10-17 [3].
- **Reddit specifics:**
  - Tracks Reddit posts and comments, aiming for at most a 1-minute delay [2].
  - The docs say Syften sees Reddit content as a logged-out user does. Edits are not tracked, and `replyto:` is not supported on Reddit [4].
  - Subreddit targeting uses `site:reddit.com/r/<name>/` [4].
  - Reddit ads are treated as promoted posts [4].
  - How Reddit data is obtained is not mentioned on its site.
- **Matching model:**
  - Keyword filters with exact phrases, `*` wildcards, `NOT`, and operators such as `site:`, `type:`, `author:`, `title:` and `lang:` [4]. Regex is not mentioned in the docs [4].
  - Optional AI filtering (Standard and PRO) runs after a keyword match. You write a per-filter `$accept:"true if …"` rule, and only accepted matches go to Slack and email [4][5].
  - The AI decision is a binary accept or reject. No numeric score is described [5].
  - Rejected matches stay visible in the archive and API, with the verdict and reason [4].
  - The homepage FAQ says that after sign-up Syften researches your company and competitors to build the initial setup [1]. This was seen only on the homepage, so treat it as uncertain until re-checked.
- **Alert channels:**
  - Email (immediate, hourly, 6-hourly or daily) and RSS/Atom/JSON feeds [4].
  - Slack (Standard and above) [2].
  - API (all plans) [2][4].
  - Webhooks and MCP (PRO) [2][4].
- **Posting or automation:**
  - None described. The AI social listening page says it is "not a social publishing suite" [5].
  - The docs say the MCP connector cannot publish posts or replies [4].
- **Multiple accounts:** not mentioned on its site.

## 4. Pricing (checked 2026-10-27)

Source: https://syften.com/?redirect=false#pricing [2]. Monthly USD. No annual pricing was shown on the pages opened.

| Tier | Price | Community filters | Community results/day | Web filters | Web results/day | Archive | Notable |
|---|---|---|---|---|---|---|---|
| Entry | $29.95/mo | 3 | 100 | 1 | 5 | 7 days | API (account matches, filter edits) |
| Standard | $49.95/mo | 20 | 200 | 5 | 20 | 30 days | Slack, AI filtering, API |
| PRO | $119.95/mo | 100 | 500 | 20 | 50 | Full available history | Slack, AI filtering, API, webhooks, MCP, archive API |
| Tailor made | Custom | n/a | n/a | n/a | n/a | n/a | Contact custom@syften.com |

- Add-ons (Standard and PRO): X monitoring is +$40/mo. YouTube monitoring is +$20/mo [2].
- Archive API and MCP searches on PRO share 1,000,000 fetched items per calendar month [2][4].
- **Free trial:** 14 days on the PRO plan, with no credit card required. Trial users see archive mentions from roughly the last 60 days [1][2].
- **Free plan:** none listed.

## 5. Notable features

- Coverage of about 17 community sources plus the public web [1][2]: https://syften.com/
- Reddit alerts targeting at most a 1-minute delay [2]: https://syften.com/?redirect=false
- Per-filter AI accept/reject rules ("Advanced AI filtering" added 2026-02-18) [3][4]: https://syften.com/documentation
- Webhooks on PRO (added 2025-02-07), with retries for up to 48 hours [3][4]: https://syften.com/documentation
- MCP support (added 2026-05-10) to query matches from AI tools [3][4]: https://syften.com/changelog
- Searchable archive, with 7 days on Entry, 30 days on Standard and full available history on PRO [2][4]: https://syften.com/documentation
- Language detection (2025-02-03), Bluesky (2025-01-29) and Mastodon (2025-02-27) support [3]: https://syften.com/changelog
- Public web scraper (2026-06-19) [3]: https://syften.com/changelog

## 6. Where it's stronger than a focused Reddit lead tool

- **Multi-platform coverage:** Reddit plus HN, Indie Hackers, GitHub, Product Hunt, Stack Exchange, Dev.to, Bluesky, Mastodon, newsletters, podcasts and the open web, with X and YouTube as add-ons [1][2]. If your buyers aren't mainly on Reddit, this matters.
- **Speed claim:** it targets at most a 1-minute delay on Reddit [2].
- **Developer-friendly delivery:** API on every plan, plus webhooks and MCP on PRO [2][4]. This makes it easy to pipe matches into your own CRM or agents.
- **Transparent filtering:** AI-rejected matches stay inspectable, with the verdict and reason [4].
- **Low entry price** ($29.95/mo) and a no-card 14-day PRO trial [2].

## 7. Limits stated or evident from its own materials

- LinkedIn is not monitored [2]. X/Twitter, YouTube, LinkedIn and Facebook are not in the archive [4].
- Reddit edits are not tracked, and `replyto:` is not supported on Reddit [4].
- Its archive is not a complete record of every past mention [4]. The vendor says it focuses on live delivery rather than historical search [2].
- Entry has only 3 community filters and 100 results a day. AI filtering starts at Standard ($49.95/mo), and webhooks and MCP at PRO ($119.95/mo) [2].
- The AI is a binary accept or reject filter. Lead scoring and reply drafting are not mentioned on its site [5].
- Posting or replying on platforms is not offered. It is described as monitoring only [4][5].
- How it obtains Reddit data is not mentioned on its site.

## 8. What a buyer comparing it to a Reddit lead-finding tool needs to know

- Syften is a general monitoring and alerting tool. Reddit is one source among many. It is well suited if you need cross-community coverage, and less specialised for Reddit-only lead workflows.
- Finding leads with it means writing keyword filters plus an AI accept rule for buying intent. The vendor describes that as something you build yourself, not a dedicated lead-detection feature [5].
- You handle prioritising and replying yourself. Syften pushes matches to email, Slack, feeds or webhooks and does not draft or post replies [4][5].
- Plan limits are filter-count and results-per-day based. Check that 3, 20 or 100 filters and 100 to 500 Reddit and community results a day fit your volume [2].
- A 14-day PRO trial with no card makes it easy to test side by side [2].

## 9. Sources

1. https://syften.com/ : homepage and FAQ. Confirmed the platform list, alert channels, AI filtering, automated onboarding claim, pricing summary, and 14-day no-card trial.
2. https://syften.com/?redirect=false : full homepage and pricing view. Confirmed exact tier prices and limits, add-ons, PRO trial, the at-most-1-minute Reddit delay, "LinkedIn not monitored", and no posting described.
3. https://syften.com/changelog : changelog. Confirmed the 2025–2026 entries (web scraper, MCP, advanced AI filtering, archive upgrade, Quora removed, webhooks, Bluesky, Mastodon, language detection).
4. https://syften.com/documentation : docs. Confirmed the filter syntax, no regex mentioned, AI `$accept` rules, channels, archive retention, the Reddit logged-out view and its limits, and that MCP cannot publish posts.
5. https://syften.com/ai-social-listening : AI page. Confirmed the AI acts as an accept/reject filter, with no scoring or reply drafting described, and the "not a social publishing suite" statement.
