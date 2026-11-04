# Reddit alert and social listening tools: research notes

Checked 2026-11-03. Every fact below comes from a page opened that day, listed under Sources in each section. Vendor pages come first. Third-party pages are labelled as leads and are never the basis for a stated fact.

How to read this:

- Pages were read through a fetch tool that summarises them, so spot-check short quotes against the live page before publishing.
- Plan tables that use checkmarks often lost their marks in that process. Where a feature could not be tied to a plan, the section says so.
- "Not mentioned on its site" means not found on the pages listed. It is not proof the feature is missing.
- Reference numbers like [3] point to the Sources list at the end of the same section.

## Summary

| Tool | Status | Lowest paid price | Reddit posts / comments | Vendor's stated Reddit speed | Drafts replies? | Posts anything? |
|---|---|---|---|---|---|---|
| F5Bot | Active | $12.99/mo (Silver, non-commercial). Business use starts at Gold, $49.99/mo | Both | Free up to 2 hours. Silver up to 5 min. Gold and up instant or scheduled | Not mentioned | No |
| Syften | Active | $29.95/mo | Both | Aims for at most 1 minute. No per-plan difference stated | Not itself. Your own AI agent can, using its data | No |
| KWatch.io | Active | $19/mo | Both, selectable | **Conflict:** per second (pricing and homepage) vs 10 min to 1 hour (docs) | Not mentioned | Not mentioned |
| Octolens | Active | $159/mo billed annually, or $199/mo monthly | Both | Real time on every plan (docs) | Only through playbooks your own AI agent runs | Not mentioned |
| Brand24 | Active | $199/mo billed annually, or $249/mo monthly | Both, public only | Individual every 12h. Team hourly. Pro and up real time | Not mentioned | Not mentioned |
| Awario | Active | $29/mo annually, or $49/mo monthly (mapping inferred) | Posts confirmed. Comments uncertain | "within a couple of minutes" | Not mentioned | In-app replies confirmed for X. Reddit uncertain |
| Mention | Active for existing customers. **Not sold standalone since 2026-07-01** | Not published | Both, public only | "real-time" on homepage, no figure | Not mentioned for Reddit | Publish and Respond being removed |
| Sublookout | Active | $12/mo, or $99/yr | **Posts only** | Free 60 min. Pro 10 min | Not mentioned | Not mentioned |
| RedditMentions | Active | €4.49/mo | Both | Checks every 30 min. Daily email. Slack about 15 min on average | Not mentioned | Not mentioned |

Price changes since the 2026-10-27 notes: F5Bot none, Syften none.

## Things a comparison post could easily get wrong

1. **Mention** is no longer sold as a standalone product, per its own help center, yet mention.com still shows a pricing page and "Start a free trial" (see Mention).
2. **KWatch.io**'s "per second" claim conflicts with its own docs, which put Reddit in the "Low Frequency (10 minutes to 1 hour)" tier.
3. **Brand24** says "real time" on its Reddit page, but its cheapest plan updates every 12 hours.
4. **Sublookout** monitors posts only. Its blog table says F5Bot lacks Slack alerts and subreddit filtering, and its homepage compares against "F5Bot Power $16.99/mo". F5Bot's own pages show Slack on Gold, an `only-subreddit=` flag, and no Power plan.
5. **Syften** still has no reply drafting of its own. The drafts on its homepage are done by the customer's own AI agent.
6. **RedditMentions**' comparison page lists Syften at about $19.95, dated July 2026. Syften's own page shows $29.95, and its changelog lists no pricing change. Use vendor pages only.

---

## F5Bot

**Official URL:** https://f5bot.com/

**Status:** Active. Real product, operated by F5Bot LLC and first released in 2017. Footer reads "Copyright © 2017-2026 F5Bot LLC" [3][5].

**What it does:** F5Bot emails you when a word or phrase you track appears in new posts or comments on Reddit, Hacker News or Lobsters. It suits individuals and small teams tracking brand names, competitors or niche terms. Paid tiers add faster alerts, integrations and AI filtering for businesses and agencies [1][2][3].

**Reddit coverage:**
- Posts and comments. It scans post titles, linked URLs and "the text of every comment" [4]. Usernames are skipped unless you opt in [4][6].
- Other platforms: Hacker News and Lobsters [2][3].
- Data source: not mentioned on its site [2][4][5].

**Speed:**
- Monitoring cadence: "every few minutes" [2][3].
- Alert delay by plan, measured from when F5Bot finds a match [1]:
  - Free: "Up to 2 hours"
  - Silver: "Up to 5 minutes"
  - Gold, Platinum and Diamond: "Instant or scheduled"
- "Real-time" is not used on the homepage. The headline is "Know the moment you're mentioned online" [3].

**Alert channels:**
- Email on all plans. Instant, delayed or grouped, and scheduled digest (up to 3 set times) need a plan with scheduled delivery [6].
- RSS and JSON feeds: Gold and up [1].
- Slack and Discord: 1 integration on Gold, 3 on Platinum, custom on Diamond [1]. The docs say these are not delayed [6].
- API and webhooks: Platinum and up [1].

**Filtering:**
- Case-insensitive keyword match. No regular expressions or wildcards [2].
- Whole-word matching, `only-reddit`, `only-subreddit=`, `no-comments` and `no-posts` [2][4].
- Paid flags: `in-title`, `in-url`, `in-body`, `in-username`, `in-permalink`, `exclude=`, `include-any=`, `include-all=`, `exclude-username=` [6].
- AI filtering: 2 filters on Gold, 5 on Platinum. You describe what should match in plain language, and the result is a yes or no. Each filter can watch up to 5 subreddits directly, or take keyword matches through an `ai=` flag [1][7].
- Intent or lead scoring: no score is described. The docs only suggest writing the "intent or topic" into a filter [7].

**Drafts replies:** Not mentioned on its site.

**Posts anything:** No posting is described. The only mention of posting is a test keyword you post yourself in r/test [2][3].

**Pricing (checked 2026-11-03):** https://f5bot.com/tiers [1]. **No change since the 2026-10-27 notes.**

| Tier | Monthly | Yearly | Keywords | Daily alerts (per keyword / total) | History | Notes |
|---|---|---|---|---|---|---|
| Free | $0 [3] | n/a | 5 | 10 / 20 | 7 days | "personal use only". Small text ads in emails [2] |
| Silver | $12.99 | $143 | 20 | 30 / 100 | 7 days | "Personal, non-commercial use." Ad-free, paid flags, common words, full post text |
| Gold | $49.99 | $549 | 200 | 100 / 5,000 | 90 days | RSS/JSON, 1 Slack/Discord, 2 AI filters, mass keyword upload |
| Platinum | $214.99 | $2,364 | 300 | 500 / 200,000 | 90 days | 3 Slack/Discord, 5 AI filters, API and webhooks |
| Diamond | "Starting at $500/mo" | Not listed | Custom | Custom | 90 days | Enterprise |

- Yearly prices are labelled "1 mo free" [1].
- AI filtering includes the first $10/month of token usage on Gold and Platinum. Usage above that is billed on top [1][7].
- Trial: not mentioned on the pages opened. The free plan is the entry point.
- Vendor pages differ slightly. The homepage shows Free, Silver, Gold and an unpriced "Enterprise" [3]. /tiers shows the fuller lineup [1]. The AI docs also list a legacy "Ultra" tier [7].

**Real strengths:**
- A genuinely free plan, and a very simple setup for brand or niche terms [1][3].
- Covers Hacker News and Lobsters, useful for developer tools [2].
- Scans every comment, not just posts [4].
- Platinum allows 200,000 alerts a day with API and webhooks, so it can feed your own pipeline [1].
- Over 430,000 alerts a day sent, per the vendor, and running since 2017 [5].

**Limits shown by its own materials:**
- No regex or wildcards [2].
- Free accounts cannot monitor very common words [2].
- A keyword over its daily cap "will be disabled" until you re-enable it [2].
- Built for uncommon terms, so it may not suit very popular brands [2].
- Free is personal use and Silver is non-commercial. Business use starts at $49.99/mo [1].
- AI filters are capped at 2 or 5, and tokens above $10/mo cost extra [1][7].
- Lead scoring, reply drafting and a lead inbox: not mentioned on its site.

**Sources:**
1. https://f5bot.com/tiers : all tier prices, limits, delay wording, integrations, commercial-use labels, AI token note.
2. https://f5bot.com/faq : sites covered, posts and comments, check cadence, no regex, common-word and cap rules, ads, personal use, r/test note.
3. https://f5bot.com/ : homepage. Prices for Free, Silver, Gold, "Enterprise", cadence, headline, footer, no posting features.
4. https://f5bot.com/guides/reddit-keyword-alerts : what is scanned on Reddit, flags, "promptly" wording for paid plans.
5. https://f5bot.com/about : F5Bot LLC, 2017, 430,000 alerts a day, no data source statement.
6. https://f5bot.com/docs-power : channels and paid flags.
7. https://f5bot.com/docs-semantic : AI filter limits, 5 subreddits per filter, token billing, legacy Ultra tier, no model named.

Earlier notes compared: `/Users/admin/Documents/reddix-app/src/sublanding/alternatives/f5bot/RESEARCH.md` (2026-10-27).

---

## Syften

**Official URL:** https://syften.com/

**Status:** Active. Real product. The changelog's latest entry is a web scraper on 2026.06.19 [3].

**What it does:** Syften watches online communities and the public web for keyword filters you write, then pushes matches to email, Slack, feeds, an API or webhooks. An optional AI rule can screen out noise. It targets "founders, marketers, indie hackers, support teams, and agencies" [1][2].

**Reddit coverage:**
- Posts and comments: the FAQ says it "tracks Reddit posts and comments for chosen keywords" [1].
- It scans all of Reddit from a logged-out view. Edits are not tracked, `replyto:` is not supported, and comment titles are rebuilt from the URL slug. Reddit ads count as promoted posts [2].
- Other platforms: the public web, X/Twitter, Indie Hackers, Hacker News, GitHub, Product Hunt, the Stack Exchange family, forums, Lobste.rs, Dev.to, Steemit, Slack communities, newsletters, YouTube, podcasts, Bluesky and Mastodon [1]. X and YouTube are paid add-ons [1]. LinkedIn is not monitored ("No, unfortunately not") and Facebook Groups are not monitored [1][2]. The Quora scraper shut down on 2025.10.17 [3].
- Data source: beyond the logged-out view, not mentioned on its site.

**Speed:**
- Reddit: "we aim for at most a 1-minute delay" [1].
- X/Twitter: "a delay of at most 15 minutes" [1].
- No per-plan difference is stated. Other platforms have no stated figure [1].
- "Real-time" is claimed in the heading "Real-time community monitoring", with no plan restriction [1].

**Alert channels:**
- Email (immediate, hourly, every 6 hours, every 24 hours) and RSS/Atom/JSON feeds [2].
- Slack: Standard and PRO [1].
- API: all plans. Archive API search requires PRO [1].
- Webhooks and MCP: PRO. MCP is also available during the trial [1][2].

**Filtering:**
- Keyword filters with phrases, a trailing `*`, backticks for literal match, `NOT`, `site:`, `author:`, `type:`, `title:` and `lang:`. Regex is not described [2].
- Subreddit targeting uses `site:reddit.com/r/<name>/` per the 2026-10-27 notes. Today's docs check confirmed the `site:` operator only.
- AI filtering (Standard and PRO): one `$accept` rule per filter, run after a keyword match. Rejected matches stay in the archive and API but skip Slack and email [2][4].
- Intent or lead scoring: no score. For buying intent, you write separate filters and accept rules yourself [4].
- Onboarding: after sign-up Syften says it researches your company and competitors and builds the initial setup [1].

**Drafts replies:** Not itself. The homepage demo shows a customer's own AI assistant drafting six replies into Trello. Syften says "We provide the mentions and get out of the way" [1].

**Posts anything:** No. The docs say the MCP connector cannot publish posts or replies [2]. The AI page says "It is not a social publishing suite" [4]. The same demo shows the customer's agent liking X posts through a connected X account, which is the agent acting, not Syften [1].

**Pricing (checked 2026-11-03):** https://syften.com/?redirect=false#pricing [1]. **No change since the 2026-10-27 notes.** Monthly USD. No annual billing is mentioned.

| Tier | Price | Community filters | Community results/day | Web filters | Web results/day | Archive | Notable |
|---|---|---|---|---|---|---|---|
| Entry | $29.95/mo | 3 | 100 | 1 | 5 | 7 days | API. No Slack, AI filtering, webhooks or MCP |
| Standard | $49.95/mo | 20 | 200 | 5 | 20 | 30 days | Slack, AI filtering, API |
| PRO | $119.95/mo | 100 | 500 | 20 | 50 | "full available history" | Slack, AI filtering, API, webhooks, MCP |
| Tailor made | Custom | n/a | n/a | n/a | n/a | n/a | Custom solutions |

- Add-ons (Standard and PRO): X +$40/mo, YouTube +$20/mo [1].
- Trial: "Start a 14 day free trial on the Syften PRO plan." No credit card required [1].
- The trial's archive window appears as 60 days in one place and "last 2 months" in another on the same page [1].
- Free plan: none listed.
- Third-party lead, not used: RedditMentions lists Syften at about $19.95 to $99.95, dated July 2026 [5]. This conflicts with Syften's page.

**Real strengths:**
- The widest community coverage in this group, including developer sites, newsletters and podcasts [1].
- A specific Reddit delay target (at most 1 minute), which few rivals commit to [1].
- API on every plan, plus webhooks with retries for up to 48 hours and MCP on PRO [1][2].
- AI rejections stay inspectable, with the verdict shown in API responses [2][4].

**Limits shown by its own materials:**
- LinkedIn and Facebook Groups are not monitored [1][2].
- Reddit edits are not tracked and `replyto:` is unsupported on Reddit [2].
- X and YouTube cost extra and are not in the archive [2].
- The docs say history varies by source and is not a complete record [2].
- Entry has 3 community filters and no AI or Slack [1].
- AI is a binary accept or reject [4].
- Lead scoring: not mentioned on its site. Built-in reply drafting: not mentioned on its site.

**Sources:**
1. https://syften.com/?redirect=false : full homepage. Prices, limits, add-ons, trial wording, Reddit and X delays, platforms, audience, posts and comments, AI demo wording, no annual billing.
2. https://syften.com/documentation : filter syntax, AI rules, channels, webhooks, MCP limits, archive retention, Reddit notes, sources.
3. https://syften.com/changelog : latest entries, Quora shutdown, webhooks on PRO, no pricing changes listed.
4. https://syften.com/ai-social-listening : AI as accept or reject, "not a social publishing suite", intent via your own rules.
5. https://redditmentions.com/compare : third-party lead (a competitor's page). Quoted Syften prices that conflict with the vendor.

Earlier notes compared: `/Users/admin/Documents/reddix-app/src/sublanding/alternatives/syften/RESEARCH.md` (2026-10-27).

---

## KWatch.io

**Official URL:** https://kwatch.io/

**Status:** Active. Real product. Footer reads "© 2026 KWatch.io", with New York, NY listed [1]. Consistent with `MARKET.md` (2026-10-27).

**What it does:** KWatch sends alerts when keywords appear on Reddit, Hacker News, LinkedIn, X, Facebook or YouTube, and adds an AI sentiment label to each one. It is pitched at sales teams looking for buying signals, plus marketers, reputation managers, competitor analysts, support teams and researchers [1].

**Reddit coverage:**
- Posts and/or comments, selectable per alert, with an NSFW option and included or excluded subreddits and users [3].
- Other platforms [2][3]:
  - Hacker News: posts and/or comments.
  - X: posts and/or replies.
  - LinkedIn and Facebook: no comments.
  - Facebook groups: public only.
  - YouTube: titles and descriptions only.
  - Instagram and TikTok: not monitored.
- Data source: not mentioned on its site. It only notes "Twitter's API is now a paid service" [1].

**Speed:** No per-plan difference is stated. **Vendor pages disagree on Reddit:**
- Homepage and pricing FAQ: "The refresh rate is per second", with notifications usually in a couple of seconds and up to 1 minute during congestion [1][2]. It promises "real-time alerts" with no plan restriction [1].
- Docs: Reddit, X and Facebook are in "Low Frequency (10 minutes to 1 hour)". Hacker News is "High Frequency (1 second to 1 minute)". LinkedIn and YouTube are "Medium Frequency (1 minute to 10 minutes)". Rates "may be adjusted based on platform congestion and load" [4].
- Uncertain which is current. The docs page is the more specific one. No independent measurement was found.

**Alert channels:**
- Email is the default [2][5]. Large content is truncated in email [5].
- Slack and API webhooks (global or per alert): Business, Enterprise and Agency [2][5].
- REST API (create, read, update and delete alerts) and an MCP server, also Business and up [2][6][7].

**Filtering:**
- Multiple keywords act as AND. Excluded keywords and language filters are available. There is no general exact match, but Reddit and Hacker News have "Whole Words Only" and "Case Sensitive" [3].
- "Filtering and saved results" is not on Free [2].
- AI: sentiment only (positive, negative, neutral), on Essential and up [2][3].
- Intent: you track phrases yourself, such as "alternative to" or "looking for" [1]. Lead scoring: not mentioned on its site.

**Drafts replies:** Not mentioned on its site.

**Posts anything:** Not mentioned on its site. API and MCP tools only manage alerts [6][7].

**Pricing (checked 2026-11-03):** https://kwatch.io/pricing [2]. Numbers are keyword alerts per platform.

| Plan | Price | Reddit | HN | X | YouTube | Facebook | LinkedIn | Filtering, AI | API, webhooks, Slack, MCP | Bulk import, teams |
|---|---|---|---|---|---|---|---|---|---|---|
| Free | $0/mo | 2 | 2 | 0 | 0 | 0 | 0 | No | No | No |
| Essential | $19/mo | 20 | 20 | 2 | 2 | 1 | 1 | Yes | No | No |
| Business | $79/mo | 100 | 100 | 10 | 10 | 5 | 5 | Yes | Yes | Yes |
| Enterprise | $199/mo | 500 | 500 | 50 | 50 | 25 | 25 | Yes | Yes | Yes |
| Agency | Custom | Custom | Custom | Custom | Custom | Custom | Custom | Yes | Yes | Bulk yes. Teams not listed |

- Free plan: yes. Trial: not mentioned. Annual billing: not mentioned [2].
- Plans are prorated. Cancelling mid-cycle earns a discount on later invoices [2].
- No cap on alerts delivered is stated. The limits are keyword alerts per platform [2].

**Real strengths:**
- Covers LinkedIn and Facebook at a low entry price, which most Reddit-focused tools here do not [2].
- A real free plan with Reddit and Hacker News alerts [2].
- Fine-grained Reddit controls: posts or comments, subreddit and user lists [3].
- Per-alert Slack and webhook routing, plus API and MCP from $79/mo [2][5][6][7].

**Limits shown by its own materials:**
- Reddit sits in the slowest refresh tier in its docs [4].
- Slack and webhooks need Business at $79/mo [2].
- LinkedIn and Facebook comments are not monitored, YouTube matches titles and descriptions only, and Instagram and TikTok are absent [2].
- The homepage line "found in posts/comments" does not hold for LinkedIn or Facebook, per its FAQ [1][2].
- AI is sentiment only [2]. Reply drafting and lead scoring: not mentioned on its site.

**Sources:**
1. https://kwatch.io/ : homepage. Platforms, real-time and refresh wording, intent phrases, footer, X API note.
2. https://kwatch.io/pricing : every plan and limit, feature availability, FAQ on sources and speed, no data source statement.
3. https://docs.kwatch.io : platforms, AND behaviour, filter options per platform, sentiment label.
4. https://docs.kwatch.io/refresh-rates/ : frequency tiers per platform.
5. https://docs.kwatch.io/notification-channels/ : email, Slack, API webhooks, global and per-alert setup.
6. https://docs.kwatch.io/api/ : API scope, 403 and 429 notes, no posting.
7. https://docs.kwatch.io/mcp-server/ : MCP scope, requires a plan with API access, no posting tools.

---

## Octolens

**Official URL:** https://octolens.com/

**Status:** Active. Real product. The homepage shows no footer date and I found no changelog page. Signs of activity are the live pricing page, the 7-day trial and a docs index of about 150 pages [1][2][3].

**What it does:** Octolens collects mentions across social platforms, communities, news and the web, uses AI to score relevance and tag them, then delivers them as structured data. It is aimed at founders, marketing teams, DevRel and community teams, agencies, and developers or AI agent builders feeding social data into their own products [1].

**Reddit coverage:**
- "Keyword mentioned in post title, post body, and comments" [4].
- The FAQ says coverage of X, Reddit and YouTube is close to full. You can also track all posts in a subreddit by pasting its URL, and allowlist or exclude subreddits in global settings [5].
- Other platforms: X, Hacker News, LinkedIn, Instagram, YouTube, Bluesky, TikTok, GitHub, Stack Overflow, DEV and reviews (Trustpilot, App Store, Google Play). Podcasts, news, web and newsletters are Scale only [2][4].
- Vendor pages disagree on Meta: the pricing FAQ says Facebook and Instagram are tracked, the plan table lists neither, and the platform docs list Instagram (own-brand terms only, once daily) but not Facebook [2][4].
- Data source for Reddit: not mentioned on its site. LinkedIn keywords see what a logged-out user sees [5].

**Speed:**
- Reddit: real time on every plan, per the FAQ and platform docs [4][5].
- Pricing table: search frequency "Hourly" on Pro, "Real-time" on Scale and Enterprise, with no Reddit exception shown [2].
- Docs on most other platforms: hourly on Pro, under 5 minutes on Scale. Some sources run slower (news every 6 hours; Stack Overflow and reviews daily) [4].
- Delivery: "Instantly" sends each match "as soon as Octolens ingests it" [6].

**Alert channels:**
- Slack, email and webhooks, each with instant, hourly, daily or weekly frequency [6]. Webhooks send one mention per POST and are "available on every plan" [7].
- REST API, MCP server and CLI [1][3]. The homepage says delivery channels are on every plan [1]. Attio is listed as a destination in the docs overview, though the destinations page does not name it [3][6].

**Filtering:**
- Per keyword: "Posts must ALSO include", negative terms, negative authors, wildcard negative terms, case sensitivity and keyword context [8].
- Boolean query syntax: not mentioned on its site [8].
- AI: it "reads every mention, scores its relevance to your business, and tags it" [9]. Posts judged irrelevant are filtered out of feeds. Tags include Buy Intent, Competitor Mention, Product Question and Bug Report [9]. Sentiment analysis is included [2].
- Lead scoring: no numeric lead score is described, and Buy Intent criteria are not defined [9].

**Drafts replies:** Only through "skills", which are playbooks your own AI agent (Claude, Cursor, ChatGPT) runs over the Octolens MCP server. Examples include "a reply draft in a human voice" and drafts "ready for human review" [1][10]. Drafting in the Octolens app itself: not mentioned on its site.

**Posts anything:** Not mentioned on its site. MCP write actions cover keywords, feeds and notification destinations only [11]. The FAQ does not mention replying or posting [5].

**Pricing (checked 2026-11-03):** https://octolens.com/pricing [2]

| Plan | Monthly | Billed annually | Keywords | Mentions/mo | History | Search frequency (pricing table) |
|---|---|---|---|---|---|---|
| Pro | $199 (homepage) [1] | $159/mo [1][2] | 10 | 15,000 | 2 years | Hourly |
| Scale | $599 (homepage) [1] | $499/mo [1][2] | 40 | 50,000 | Unlimited | Real-time |
| Enterprise | Custom [2] | Starts at $1,000/mo billed annually (docs FAQ) [5] | Unlimited | Unlimited | Unlimited | Real-time |

- Records where pages differ:
  - /pricing text showed only annual figures, with a monthly toggle. The monthly figures come from the homepage [1][2].
  - Extra keywords: the table says $10 each on Pro and $5 each on Scale. The FAQ says "from $5/month" [2].
- Overage: $0.013 per mention on Pro, $0.01 on Scale. You can set a spend cap or turn it off [2].
- Seats: unlimited on all plans [2].
- Trial: 7 days, no card, up to 5,000 mentions and 5 keywords [2][5].
- Free option: /agents lists a $0 developer sandbox with 50 one-time searches and no card [12]. The CLI docs call it the Agents plan, with a cap of 5,000 AI-scored mentions a month [13]. It is not on /pricing and is a search sandbox rather than ongoing monitoring (my reading).

**Real strengths:**
- Reddit posts and comments in real time even on the lowest plan, per its docs [4][5].
- API, webhooks and MCP on every plan, with unlimited seats [1][2][7].
- AI relevance filtering aimed at keeping common-word brands free of noise [3][9].
- Very broad source list, including LinkedIn, TikTok and reviews [2][4].

**Limits shown by its own materials:**
- Second-highest published entry price in this group, after Brand24 (my comparison).
- The mention quota counts every post pulled in, including ones that fail the AI relevance filter [5].
- New keywords look back 7 days, with up to 10 posts per platform [4][5].
- On Pro, most non-Reddit sources refresh hourly [4].
- Podcasts, news, web and newsletters need Scale [2].
- LinkedIn keyword tracking may miss posts [5].
- Posting replies: not mentioned on its site.

**Sources:**
1. https://octolens.com/ : homepage. Platforms, audience, channels on every plan, monthly and annual prices, reply-draft skill wording, no posting claim.
2. https://octolens.com/pricing : plan table, overage, trial, Facebook and Instagram FAQ note.
3. https://octolens.com/docs : docs overview, feeds, destinations including Attio, CLI.
4. https://octolens.com/docs/learn/platforms/overview.md : per-platform coverage and refresh, Reddit wording, backfill.
5. https://octolens.com/docs/learn/faqs.md : refresh by plan, Reddit coverage, quota rules, Enterprise floor, trial limits.
6. https://octolens.com/docs/quickstart/destinations.md : destinations and frequency options.
7. https://octolens.com/docs/quickstart/webhooks.md : one mention per POST, every plan.
8. https://octolens.com/docs/quickstart/keywords.md : keyword fields, no boolean syntax described.
9. https://octolens.com/docs/learn/ai-relevance.md : relevance judgement and tags, no numeric lead score.
10. https://octolens.com/skills : skills run by your own agent, reply draft wording.
11. https://octolens.com/docs/mcp/v2/overview.md : MCP read and write scope, no publishing described.
12. https://octolens.com/agents : $0 sandbox, 50 searches, Pro price and overage.
13. https://octolens.com/docs/cli/agents.md : Agents plan limits, no price listed.
14. https://octolens.com/docs/llms.txt : docs index, about 150 pages, no changelog or replies page.

---

## Brand24

**Official URL:** https://brand24.com/

**Status:** Active. Real product. Footer reads "Copyrights © 2026 Brand24 Global, Inc." [1]

**What it does:** Brand24 is an AI social listening and brand monitoring platform that tracks mentions across social media, news, blogs, forums and reviews, and analyses sentiment and context. It is aimed at brands, agencies, marketers and PR teams, with enterprise plans. Reddit is one source among many [1][2].

**Reddit coverage:**
- It refers to "public Reddit comments and posts" and "public subreddits" [3]. A 2026 vendor blog also says "Reddit posts and comments" [4].
- Subreddit filter: none is named. You narrow to Reddit with a domain filter [3][5].
- Other sources on the pricing page: Facebook, Instagram, X, News, Blogs, Other Socials, LinkedIn, Medium, Quora, YouTube, TikTok, Reviews, Twitch, Newsletters, Podcasts [2].
- Data source: "+25,000,000 online sources" [1]. How Reddit data is collected: not mentioned on its site.

**Speed (per plan, from the pricing page) [2]:**
- Individual: "Update every 12h"
- Team: "Update every hour"
- Pro and Business: "Realtime updates"
- Enterprise: "Realtime update"

"Real-time" also appears without plan limits on the homepage ("tracked in real-time") and on the Reddit page ("real-time monitoring of subreddits") [1][3]. On the pricing page it applies only from Pro at $399/mo billed annually. No latency figure is given.

**Alert channels:**
- Email: "immediate real-time e-mail alerts for every new mention", plus daily and weekly reports [6].
- Storm Alerts for spikes in volume or reach [7].
- Slack and Microsoft Teams [2][6].
- Mobile app push notifications [2][3].
- API at "an additional fee $149" and MCP, both listed under Data Access [2].
- Which plans include each of these could not be determined from the page text [2].

**Filtering:**
- Required and excluded keywords [5].
- Boolean filters with `{AND}`, `{OR}`, `{NOT}` and `{IS}` [8]. No plan restriction is stated in that article.
- AI sentiment on all plans. Events detection, Brand Assistant, AI Insights and AI Topics start at Pro [2].
- Intent: an intent filter and intent analysis that tags posts that "indicate a high likelihood of purchasing" [5][7]. Smart Context Search finds "purchase intent or interest", and is an add-on on Pro and Business [2][5]. Which plans include intent analysis could not be determined.
- Numeric lead scoring: not mentioned on its site.

**Drafts replies:** Not mentioned on its site. Brand Assistant is described as a chatbot over your monitoring data [6][7].

**Posts anything:** Not mentioned on its site. The lead generation article describes manual outreach ("Contact them directly") [5]. The Reddit page says you can answer comments, but not that this happens from inside Brand24 [3].

**Pricing (checked 2026-11-03):** https://brand24.com/prices/ [2]. USD.

| Plan | Monthly | Billed annually (per month) | Keywords | Mentions/mo | Users | Updates |
|---|---|---|---|---|---|---|
| Individual | $249 | $199 | 3 | 2K | 1 | Every 12h |
| Team | $349 | $299 | 7 | 10K | Unlimited | Hourly |
| Pro | $499 | $399 | 12 | 40K | Unlimited | Real time |
| Business | $699 | $599 | 25 | 100K | Unlimited | Real time |
| Enterprise | Not listed | From $1,499 | Custom | Custom | Unlimited | Real time |

- Free plan: none. Trial: 14 days, "No credit card required."
- Annual: "Up to 3 months free". Annual is arranged by starting a trial and contacting the team.
- API: $149 extra. The billing period for that fee is not stated.
- Going over mentions: overage fees apply, and rates are not on the page. Going over keywords: you must upgrade or buy more.
- Third-party lead: RedditMentions lists Brand24 at about $199 (July 2026), consistent with the annual Individual price [9].

**Real strengths:**
- Very broad coverage, including podcasts, newsletters and reviews [2].
- Mature analytics: sentiment, AI insights, reports and a chatbot over your data [2][7].
- Instant email and Slack alerts for each new mention [6].
- Intent-oriented filters and Smart Context Search for prospecting [5][7].
- A no-card 14-day trial [2].

**Limits shown by its own materials:**
- Individual updates only every 12 hours and allows just 3 keywords and 2K mentions [2].
- Real-time starts at Pro [2].
- Overage fees apply above the mentions limit [2]. API costs extra [2].
- Public subreddits only, with no named subreddit-level filter [3].
- Reply drafting and posting: not mentioned on its site.

**Sources:**
1. https://brand24.com/ : homepage. Source count, real-time wording, audience, footer.
2. https://brand24.com/prices/ : price blocks, limits, update frequency, AI by plan, sources, API fee, trial, overage. Opened three times to confirm mapping. Checkmarks did not survive text extraction.
3. https://brand24.com/reddit-monitoring/ : Reddit wording, domain filter, notification channels, no prices.
4. https://brand24.com/blog/reddit-mentions/ : updated 2026-03-13. Reddit posts and comments, platform filter.
5. https://help.brand24.com/en/articles/9941778-lead-generation : dated 2026-09-08. Intent filter, Smart Context Search, required and excluded keywords, manual outreach.
6. https://brand24.com/what-is-brand24/ : email and Slack notifications, API, Reddit as a source, Brand Assistant.
7. https://brand24.com/features/ : notifications, Storm Alerts, Slack, intent analysis, Brand Assistant.
8. https://help.brand24.com/en/articles/3267755-boolean-search : dated 2026-06-11. Boolean operators.
9. https://redditmentions.com/compare : third-party lead (competitor page).
10. https://api-data.brand24.com/api-data-docs/documentation : opened, but only the title loaded, so it confirmed nothing beyond the page existing.

---

## Awario

**Official URL:** https://awario.com/

**Status:** Active. Real product. Footer "© 2026" [1].

**What it does:** Awario is a brand monitoring and social listening tool that tracks mentions across social media, news, blogs, videos, forums and reviews, with sentiment analysis. Its Leads module surfaces people asking for recommendations or unhappy with competitors. It is aimed at marketers, PR, customer service, sales, SEO and agencies [1][4].

**Reddit coverage:**
- The Reddit page says the engine "checks posts across all public subreddits", shows the exact subreddit per mention, and picks up AMAs and megathreads [3].
- Comments: **uncertain.** The current Reddit page refers to posts and threads and never says comments [3].
- Other platforms: X, Facebook, Instagram, YouTube, Vimeo, blogs, forums, news and the web [1].
- Data source: the homepage claims it crawls over 13 billion web pages daily in addition to using APIs [1]. Reddit-specific method: not mentioned on its site [3].

**Speed:** No per-plan difference is stated.
- New Reddit mentions are "usually detected and added to your dashboard within a couple of minutes" [3].
- Alerts arrive "the moment a relevant mention appears" and it tracks "in real time" [3].
- Slack page: "real-time Slack notifications" [6].
- "Real-time" is claimed generally, on no specific plan.

**Alert channels:**
- Email, per alert, up to 20 recipients. Frequency options appear only in a screenshot [7].
- Slack, to a chosen channel [6]. Which plans include it is not stated [2][5].
- Dashboard feed [3].
- API: Enterprise, per the help and API pages [5][8].
- CSV and PDF export [2][3].

**Filtering:**
- Boolean search with proximity, exclusions, search modes, per-keyword language and URL filtering [9]. The Reddit page lists AND/OR/NEAR, excluded keywords and author filtering [3].
- It does not use Reddit's native search operators [3].
- Sentiment analysis. The Reddit page says "AI-powered insights" [3].
- Leads: you enter 2- to 3-word product descriptions and competitors, and Awario applies "predictive insights" [4][10]. The Leads pages do not name their sources, so Reddit coverage in Leads is unconfirmed [4][10].
- Numeric lead scoring: not mentioned on its site.

**Drafts replies:** Not mentioned on its site.

**Posts anything:** Replies only.
- You can reply to X users "straight from the Awario's account" [11].
- Leads lets you reply publicly or send a direct message from the prospect's profile [4].
- For Reddit, **uncertain**. A 2022 blog says you "can also reply to these mentions" in the feed, which includes Reddit [12]. The current Reddit page describes a direct thread link instead [3].
- Publishing new posts: not described on its homepage [1].

**Pricing (checked 2026-11-03):** https://awario.com/pricing/ [2]

| Plan | Monthly billing | Yearly billing (per month) | Topics | New mentions/mo | Stored per topic | Users | Projects [5] |
|---|---|---|---|---|---|---|---|
| Starter | $49 | $29 | 3 | 30,000 | 5,000 | 1 | 1 |
| Pro | $149 | $89 | 15 | 300,000 | 15,000 | 10 | 3 |
| Enterprise | $399 | $249 | 100 | 1,000,000 | 50,000 | Unlimited | 10 |

- **Uncertain:** the page text does not map each price to its billing label. The lower price as annual is my inference from the toggle "Yearly (Save up to 40%)" [2]. Third-party search snippets (pages not opened, so not cited) pointed the same way.
- Free plan: none. Trial: "Awario trial grants you free access to the Starter plan", up to 3 alerts and 30,000 mentions, no card. Data kept 14 days after expiry [2].
- Vendor pages disagree on features. The pricing page text listed API access, CSV export, white-label reports and an account manager without clear plan marks [2]. Its FAQ says export is Pro and Enterprise only [2]. The help page shows export on Pro and up, and API, white-label and account manager on Enterprise only [5]. The API page also says Enterprise [8]. Treat the help page as the working answer. The pricing-page conflict may be a text extraction artefact.
- Vendor pages differ on hitting a limit. The pricing FAQ says the oldest mentions are replaced [2]. The help page says collection "stops" for 24 hours or until mentions are removed, and older ones are then replaced [5].

**Real strengths:**
- Low entry price for full social listening, with high mention volumes (30,000 a month on Starter) [2].
- Boolean with proximity controls [9].
- A dedicated Leads module for social selling, including competitor complaints [4][10].
- In-app replies on X, and DMs from Leads [4][11].
- A specific Reddit detection claim ("within a couple of minutes") [3].

**Limits shown by its own materials:**
- Starter has no export, no API and no report sharing [5].
- API excludes Twitter data and needs Enterprise [8].
- An alert at its stored-mention cap can pause for up to 24 hours [5].
- Help pages do not say which plans have Boolean, Slack or Leads [5].
- Reply drafting and lead scoring: not mentioned on its site.

**Sources:**
1. https://awario.com/ : homepage. Sources, crawl claim, audience, sales opportunities, in-app responses, footer.
2. https://awario.com/pricing/ : prices, limits, trial, export and quota FAQ. Opened twice.
3. https://awario.com/reddit-monitoring/ : Reddit wording, speed, alerts, Boolean, FAQ.
4. https://awario.com/social-selling/ : Leads module, reply and DM.
5. https://awario.com/help/plans-and-quotas/ : quotas, export, API, white-label by plan, stop-collecting behaviour.
6. https://awario.com/slack/ : Slack notifications, real-time wording.
7. https://awario.com/help/email-notifications/email-frequency/ : per-alert email settings, up to 20 emails.
8. https://awario.com/social-listening-api/ : API on Enterprise, excludes Twitter.
9. https://awario.com/boolean/ : Boolean controls.
10. https://awario.com/help/leads/leads-settings-overview/ : Leads settings.
11. https://awario.com/twitter/ : in-app replies on X.
12. https://awario.com/blog/reddit-marketing-with-awario/ : dated 2022-09-22. Reply wording in the feed. Old, so treat with care.
13. https://awario.com/help/ : help index, used to find articles.

---

## Mention (mention.com)

**Official URL:** https://mention.com/

**Status:** Active for existing customers, with a major caveat. Real product, acquired by Agorapulse (announced 2025-05-22) [5]. Vendor pages disagree on whether new customers can buy it:
- Help center: "As of July 1, 2026, Mention is no longer sold as a standalone product." Existing customers "can retain access to your current plan" [2].
- mention.com still shows a pricing page and "Start a free trial" with no such notice [1][3].

**What it does:** Mention is a social listening and media monitoring tool with keyword alerts, Boolean queries, reports and influence scoring. New buyers are now pointed to Agorapulse Listening, sold through Agorapulse's sales team. Its stated audience is marketers, agencies, founders and PR, for brand management, competitive analysis and crisis work [1][2].

**Reddit coverage:**
- Posts and comments both count. Public subreddits only: "Mention does not crawl private subreddits" [6].
- Targeting specific subreddits is not supported. 18+ content is fetched but not previewed [6].
- Other sources: X, Forums, Blogs, Videos, News and Web. Facebook, Instagram and review sites are covered through monitored pages or URLs [6][7].
- Data source: it says systems are "configured to capture most of the publicly available data online" [8]. Reddit-specific method: not mentioned on its site.

**Speed:**
- Homepage: "analyzes mentions from over 1 billion sources in real-time" [1]. No plan is named.
- Slack: "ensures you receive updates instantly", with an option for all new mentions in real time [9].
- The help articles give no fetch frequency or delay. Its monitoring FAQ refers such questions to support [6][8].
- No per-plan difference is stated.

**Alert channels:**
- Email: spike, instant mentions (subject to a "daily quota"), and daily or weekly digests [10].
- In-app notifications, and SMS for spikes only [10].
- Slack: daily recap, all new mentions, or influential sources only [9]. Solo had no Slack, per the plans article [2].
- API at "extra cost", with real-time streaming [11]. RSS integration [12]. Zapier is listed on the pricing page [3].
- Pages differ on push: the pricing FAQ says email or desktop push [3]. The notifications article does not list desktop push [10].

**Filtering:**
- Three alert types [7]:
  - Basic: 15 keywords or phrases, with required, secondary and excluded boxes.
  - Standard: 40 keywords with AND, OR, AND NOT, NEAR.
  - Advanced: full Boolean with 20+ operators.
- Query length: the pricing FAQ says up to 2,000 characters [3]. The help article says "2,000+ characters" [7].
- AI: an AI helper builds advanced Boolean queries, and the article calls it "not a dedicated feature of Mention" [13]. Agorapulse Listening lists AI-powered Search Screening [2].
- Influence score and sentiment [1][3][9].
- Intent or lead scoring: not mentioned on its site.

**Drafts replies:** No Reddit reply drafting is described. The homepage lists "AI tools" under Engage for content creation assistance [1], but the product is moving away from this area (see below).

**Posts anything:** Being removed. Since 2025-06-16, the help center says new or inactive users have no access to Publish or Respond [2]. The pricing FAQ says these features are being phased out and names Agorapulse as the replacement [3]. The homepage still advertises scheduling and publishing under Engage [1]. Vendor pages disagree. Trust the help article and FAQ.

**Pricing (checked 2026-11-03):** https://mention.com/en/pricing/ [3]. **Not published.**

- The page text reads "Starting at" then a bare "$" with no amount. It also shows "Save 360$" and "Pay yearly and get 2 months free" [3].
- It shows one plan, Company, with historical data and API as paid add-ons, and a "Request a demo" button [3].
- Help center: Company is itself "Depreciated" (vendor's spelling) and all listed plans are legacy [2]:

| Plan | Users | Alerts | Mentions | Status |
|---|---|---|---|---|
| Company | Unlimited | 5 | 50,000/mo | Legacy. Yearly billing only |
| Solo | 1 | 2 basic | 5,000 per 30 days | Legacy |
| Pro | Up to 10 | 5 basic | 10,000 per 30 days | Legacy |
| Pro Plus | Unlimited | 7 | 20,000 per 30 days | Legacy |
| Company Lite | Varies | Varies | Varies | Legacy, by contract |

- Agorapulse Listening (the replacement): an add-on to Advanced or Tailored Agorapulse plans, or a standalone package through sales. No price listed. Sources include Reddit, with up to 24 months of history [2]. Agorapulse's own help describes its Advanced Listening add-on as sales-assisted and priced "measured by the quota limit" [14]. Whether these two names are the same product is not stated.
- Agorapulse base plans for context, per user: Standard $99 monthly or $79 annually, Professional $149 or $119, Advanced $199 or $149, plus Custom. The listening add-on is extra and unpriced [15].
- Trial, sources disagree. The pricing page says "Start a free trial" [3]. An Agorapulse landing page offers "Try free for 30 days" including Mention, no card [16]. PricingSaaS (third party) says trials ended in Q3 2025 [17].
- Old public prices on a vendor blog updated 2025-03-31: Solo $41/mo, Pro $83/mo, ProPlus $149/mo annually [4]. Those plans are legacy and no longer for sale [2].
- Third-party leads, labelled, not vendor-confirmed:
  - PricingSaaS says the $599/mo Company price was hidden on 2026-07-06, and its current table shows $569/mo billed annually [17].
  - Capterra shows $599 flat rate [18].
  - My arithmetic: $599 minus $569 is $30, times 12 is the $360 saving on Mention's page, so that figure fits. It does not fit "2 months free". Do not publish any of these as Mention's price.

**Real strengths:**
- Deep Boolean queries with 20+ operators [7].
- Public Reddit posts and comments, with historical data available as an add-on [3][6].
- Influence score filter for Slack alerts [9].
- API with real-time streaming, at extra cost [11].
- Backed by Agorapulse, which handles publishing and responding [3][5].

**Limits shown by its own materials:**
- Not sold standalone since 2026-07-01 [2].
- No subreddit targeting, and private subreddits are not crawled [6].
- Alerts do not retroactively fetch older data, and Basic and Standard only monitor from creation [8].
- Instant emails have a daily quota [10].
- Company allowed only 5 alerts [2].
- Sites with hard paywalls, logins or crawl blockers are out of reach [8].
- Accounts go view-only after a trial or subscription ends [2].
- Reply drafting and lead scoring: not mentioned on its site.

**Sources:**
1. https://mention.com/ : homepage. Agorapulse notice, real-time claim, Monitor, Analyze, Engage, CTAs.
2. https://support.mention.com/en/articles/13354178-mention-plans-explained : dated 2026-09-29. Standalone end date, legacy plans, Agorapulse Listening, Publish and Respond date, inactive accounts.
3. https://mention.com/en/pricing/ : blank price, Save 360$, 2 months free, add-ons, FAQ on Boolean, notifications, API, Publish and Respond.
4. https://mention.com/en/blog/agorapulse-vs-mention/ : updated 2025-03-31. Old prices, Reddit as a source.
5. https://www.agorapulse.com/blog/agorapulse-news/mention-by-agorapulse-why-were-investing-in-social-listening/ : dated 2025-05-22. Acquisition announcement.
6. https://support.mention.com/en/articles/13420818-mention-sources-explained : dated 2026-08-25. Reddit rules, other sources.
7. https://support.mention.com/en/articles/13413515-mention-alerts-explained : dated 2026-07-01. Alert types and limits.
8. https://support.mention.com/en/articles/13420837-mention-monitoring-frequently-asked-questions-faq : dated 2026-07-01. Coverage, no retroactive fetch, restrictions.
9. https://support.mention.com/en/articles/13407578-how-to-use-the-slack-integration : dated 2026-07-01. Slack options.
10. https://support.mention.com/en/articles/13352025-notifications-explained : dated 2026-07-01. Channels and types.
11. https://support.mention.com/en/articles/13407573-api-access-explained : dated 2026-07-01. API extra cost, streaming.
12. https://support.mention.com/en/collections/17946588-integrations : lists Slack, RSS and API articles. The RSS article itself was not opened.
13. https://support.mention.com/en/articles/13420782-build-advanced-alerts-with-ai : dated 2026-07-01. AI query builder.
14. https://support.agorapulse.com/en/articles/10365572-advanced-listening-explained : dated 2026-09-23. Sales-assisted, quota pricing, 30-day trial. Reddit not named on this page.
15. https://www.agorapulse.com/pricing/ : Agorapulse plans, listening add-on without a price.
16. https://social.agorapulse.com/mention-trial : 30-day trial offer including Mention.
17. https://pricingsaas.com/companies/mention : third-party lead. Price history.
18. https://www.capterra.com/p/149705/Mention/pricing/ : third-party lead. $599 flat rate.
19. https://www.agorapulse.com/blog/social-media-listening/reddit-social-listening-for-real-audience-insights/ : dated 2025-07-11. Reddit listening needs the Listening add-on, up to 24 months of past mentions.

20. https://support.mention.com/en/ , https://support.mention.com/en/collections/17815595-notifications , https://support.mention.com/en/collections/17948279-alert-queries , https://support.mention.com/en/collections/17967968-monitoring : help indexes, used only to find articles.

Failed to open: https://en.support.mention.com/en/articles/7988097-mention-plans-explained (TLS handshake failure). Not cited.

---

## Sublookout

**Official URL:** https://sublookout.com/ (app at app.sublookout.com) [1]

**Status:** Active. Real product, but young and thinly documented elsewhere.
- Terms updated 2026-03-28, blog posts from March and April 2026, footer "© 2026" [1][4][5].
- The Terms name no company, only "Sublookout and its operators" [5].
- Product Hunt and PeerPush (third-party leads) point to sublookout.com and name a maker, "Dil" [9][10].
- Search results also surface sublookout.pages.dev, which shows matching content and links to the same app. I treat it as a mirror, but could not confirm this [7][8].
- I found no independent reviews.

**What it does:** Sublookout is a cloud-based Reddit keyword monitor. You set monitors with subreddits and keywords, and it checks them on a schedule and alerts you by email or Slack. It is aimed at sales and lead-generation teams, founders, marketers, PR and product managers [1].

**Reddit coverage:**
- **Posts only.** The docs say "(new submissions) only — not comments" and comment monitoring "may be added in a future update" [3].
- Keywords match title and body text. Private subreddits cannot be monitored. NSFW subreddits can if publicly accessible [3].
- Other platforms: none mentioned [1].
- Data source: a blog says it uses "the official Reddit API" [6]. The docs refer to the "public Reddit API" [3]. Terms describe polling public Reddit posts on a schedule [5].

**Speed:**
- Docs: minimum check interval of 60 minutes on Free and 10 minutes on Pro [3].
- Homepage: "<10min" lead detection time and "as low as 10 min" on pricing [1][2].
- Marketing also says "alerts you the moment a matching keyword appears" and "in real time" [1], "Real-time alerts" on the Slack page [11], and "Within minutes" on the blog [4]. Real-time is claimed on Pro, where the stated minimum interval is 10 minutes.
- Free plan sends no alerts by email or Slack [3].

**Alert channels (Pro only for email and Slack) [3]:**
- Email digest: every 10 min, 30 min, 1 hour, 12 hours or daily.
- Slack: instant or digest, connecting to one channel.
- In-app results list.
- Webhook and API: not mentioned on its site.

**Filtering [3]:**
- Case-insensitive substring match. Keywords work as an OR list.
- Subreddit list per monitor, and freshness windows of 1 hour, 6 hours, 24 hours or 7 days.
- Exclude filters and boolean operators: not mentioned on its site.
- AI: the homepage lists "AI-powered monitor setup" with no further detail [1]. The docs mention no AI features [3].
- Intent or lead scoring: not mentioned on its site.

**Drafts replies:** Not mentioned on its site.

**Posts anything:** Not mentioned on its site. It sends alerts, and replying is left to you.

**Pricing (checked 2026-11-03):** https://sublookout.com/pricing [2]

| Plan | Price | Monitors | Subreddits per monitor | Keywords per monitor | Check interval | Results stored | Email, Slack |
|---|---|---|---|---|---|---|---|
| Pro, monthly | $12/mo | 10 | 20 | 20 | 10 min | Up to 500 | Yes |
| Pro, yearly | $99/yr (shown as "$8/mo"), "Save $45" | 10 | 20 | 20 | 10 min | Up to 500 | Yes |
| Free (docs only) [3] | $0 | 1 | 2 | 3 | 60 min | 100 | No |

**Vendor pages disagree, recorded in full:**
- Free plan: the docs and Terms describe one, including that monitors pause after 14 days of inactivity [3][5]. The pricing page and homepage do not mention it [1][2]. Third-party Product Hunt shows "Free Options" [10] and PeerPush shows "Freemium" [9].
- Card for the trial:
  - Pricing FAQ: "a card is required to start the trial" [2].
  - Homepage: "No credit card required until your trial ends." [1]
  - Blog posts: "No credit card required to start" and "No card required to start" [4][6].
- Other details:
  - 7-day free trial and a 7-day money-back guarantee from first charge [2][3].
  - Billing through Dodo Payments [2][3].
  - The homepage also says up to 100 results per check [1].
  - Product Hunt lists a 20% off code (third-party lead) [10].

**Real strengths:**
- One of the lowest prices here for Slack and email alerts [2].
- Simple setup and a flat, single paid plan [1][2].
- Claims official API access, which it positions as more stable than scraping [6].
- Instant-per-match Slack mode [3].

**Limits shown by its own materials:**
- No comment monitoring [3].
- Fixed subreddit lists rather than all of Reddit [3].
- 10-minute minimum check on Pro, 60 on Free [3].
- Free has no email or Slack, and pauses after 14 days of inactivity [3].
- At most 500 results stored [2].
- Terms warn that third-party rate limits or loss of access may disrupt the service [5].
- Exclusions, boolean, API, webhooks, reply drafting and lead scoring: not mentioned on its site.

**Its competitor claims need care:**
- Its table says F5Bot has no Slack alerts, dashboard or subreddit filtering [4]. F5Bot's own pages show Slack on Gold and an `only-subreddit=` flag.
- "F5Bot Power $16.99/mo" [1] matches no plan on https://f5bot.com/tiers today.

**Sources:**
1. https://sublookout.com/ : homepage. Speed wording, trial wording, limits, AI setup, F5Bot comparison, Slack link, footer.
2. https://sublookout.com/pricing : Pro limits, $12 and $99, FAQ on card, money-back. Opened twice.
3. https://sublookout.com/docs : posts only, intervals, limits, channels, filters, free plan, pricing, API wording.
4. https://sublookout.com/blog/f5bot-alternative : dated 2026-04-03. Trial wording, speed, F5Bot table.
5. https://sublookout.com/terms : updated 2026-03-28. Operator not named, polling, free tier, refunds, third-party risk.
6. https://sublookout.com/blog/how-to-monitor-reddit-keywords : dated 2026-03-28. Official API claim, trial wording.
7. https://sublookout.pages.dev/ , https://sublookout.pages.dev/docs , https://sublookout.pages.dev/pricing : matching content, app.sublookout.com links.
8. https://sublookout.pages.dev/blog/f5bot-alternative : matching blog content.
9. https://peerpush.com/p/sublookout : third-party lead. Website URL, freemium, published 2026-04-25, maker handle.
10. https://www.producthunt.com/products/sublookout : third-party lead. Website URL, launched in 2026, maker, free options, promo code.
11. https://sublookout.com/slack : requires Pro, instant and real-time wording.

---

## RedditMentions

**Official URL:** https://redditmentions.com/

**Status:** Active. Real product. Footer reads "© 2026 RedditMentions", and its comparison page says "Last updated: July 2026" [1][3].
- Operator: not named on the pages I could read. /terms and /privacy loaded empty through the fetch tool, so this is unverified. Third-party GoodFirms lists HQ as Estonia, founded 2025 [6].
- Third-party Capterra shows "Last updated on October 21, 2026" [5].

**What it does:** RedditMentions scans subreddits you choose for keywords you choose, then sends matching posts and comments as a daily email and, optionally, to Slack. It is aimed at business owners, marketing teams, sales, researchers, agencies (with a multi-client dashboard) and creators [1].

**Reddit coverage:**
- Posts and comments [1]. Public subreddits only: "any public subreddit" [1].
- Other platforms: none. Its comparison page calls it "deliberately Reddit-only" [3].
- Data source: "Our Reddit scraper does the social listening for you" [1]. Whether it uses Reddit's official API: not mentioned on its site.

**Speed:** Same on both plans.
- "Every 30 minutes, 24/7" it searches your subreddits [1].
- Email: a daily digest covering the previous 24 hours, at a time you pick [1].
- Slack: the guide says alerts usually arrive roughly 1 to 30 minutes after a match goes live, about 15 minutes on average [4]. Elsewhere it says "instant notifications" [1] and "near-instant" [3].
- All plans are said to include "real-time monitoring" [1], though the stated cycle is 30 minutes.

**Alert channels:**
- Daily email, only when there are matches [1].
- Slack through an OAuth connection, with one channel described [4]. It is "included free with all paid RedditMentions plans" [4].
- Dashboard list of matches from the last 7 days [1].
- Webhook and API: not mentioned on its site.

**Filtering:**
- Subreddits and keywords, negative keywords, a filterable match list, and de-duplication of repeat matches [1][2].
- Boolean: not mentioned on its site. AI, intent and lead scoring: not mentioned on its site.

**Drafts replies:** Not mentioned on its site.

**Posts anything:** Not mentioned on its site. The product only surfaces matches.

**Pricing (checked 2026-11-03):** https://redditmentions.com/pricing [2]. Euro, monthly only. The vendor FAQ says annual plans may be added if there is demand.

| Plan | Price | Subreddits | Keywords | Negative keywords | Alerts | Slack | Support |
|---|---|---|---|---|---|---|---|
| Standard | €4.49/mo | Up to 5 | Up to 5 | Included | Daily email | Included | Email |
| Pro | €9.49/mo | Up to 15 | Up to 15 | Included | Daily email | Included | Priority email |

- Trial: 7 days on both plans, and you are not charged until it ends [2]. The homepage says continuing the trial requires card details [1].
- Free preview: "up to 5 matches for free, no credit card required" [1].
- Free plan: none. Third-party listings disagree (Capterra says a free version exists, GoodFirms says no) [5][6]. The vendor describes only the preview and trial.

**Real strengths:**
- By far the lowest price in this group [2].
- Covers comments as well as posts at the entry price [1].
- Negative keywords and Slack on every plan [2].
- Honest about scope: it says it is not the right fit if you need multi-platform coverage [3].

**Limits shown by its own materials:**
- Only 5 or 15 subreddits and keywords. It does not scan all of Reddit [2].
- 30-minute check cycle, and email only once a day [1].
- Match list covers the last 7 days [1].
- Public subreddits only [1].
- Monthly billing only [2].
- API, webhooks, AI filtering, reply drafting and lead scoring: not mentioned on its site.
- Its comparison page's competitor prices date from July 2026 and do not all match vendor pages today (Syften especially) [3].

**Sources:**
1. https://redditmentions.com/ : homepage. Coverage, scraper wording, 30-minute cycle, channels, limits, trial and preview, footer. Opened twice.
2. https://redditmentions.com/pricing : plans, prices, currency, monthly-only billing, trial, FAQ.
3. https://redditmentions.com/compare : self-described comparison. Reddit-only wording, near-instant Slack, July 2026 competitor prices.
4. https://redditmentions.com/guides/slack-integration-setup : Slack timing, plans, one channel, OAuth.
5. https://www.capterra.com/p/10039940/RedditMentions/ : third-party lead. Prices, last-updated date, free version claim.
6. https://www.goodfirms.co/software/redditmentions : third-party lead. Official URL, Estonia, 2025, no free version.
7. https://redditmentions.com/guides : guide index only.
8. https://redditmentions.com/terms and https://redditmentions.com/privacy : opened, but loaded empty. Confirmed nothing.

---

## Method

Searches, all via WebSearch:

- Standard: "Sublookout Reddit monitoring tool"; "RedditMentions Reddit keyword alerts tool pricing"; "Mention.com pricing Company plan 2026 Agorapulse acquired Mention starting at per month"; Mention legacy plans (mention domains); Agorapulse Listening add-on and standalone end; Agorapulse acquires Mention; Brand24 notifications and Boolean (brand24 domains); Brand24 Reddit limits (brand24 domains); Awario pricing; Awario in-app replies (awario.com); Octolens Agents plan (octolens.com); "KWatch.io review pricing Reddit alerts how fast 2026".
- Extended (standard results on company details were thin): Sublookout and RedditMentions reviews and operators. It found no independent reviews and no operator details.

Page text was treated as data. Also read: `/Users/admin/Documents/reddix-app/src/sublanding/alternatives/MARKET.md`. Its status notes for Octolens, KWatch.io, Brand24 and Awario still hold.
