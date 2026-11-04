# SERP and replacements research

Checked 2026-11-03. Input for six blog posts.

## How to read this file

- **Every fact comes from a page I opened on 2026-11-03**, unless marked otherwise. The full list is in [Sources](#sources).
- **The fetch tool summarises pages through a small model.** Numbers and short quotes are its reading of the page. Spot-check any quote against the live page before publishing.
- **Labels:** [vendor page] and [vendor blog] mean the publisher sells a product in this market. [directory] means a listing site. [press] means news or trade media. [preprint] means not peer-reviewed. [UNCERTAIN] means I could not confirm it.
- **Search ranking caveat:** "Top 5" means the order returned by the WebSearch tool, which is not Google. Standard mode was noisy, so I re-ran each query in extended mode and used that order. Check real Google positions before quoting a rank.
- **Blocked sources, which limit this research:**
  - reddit.com, redditinc.com and business.reddit.com refuse the fetch tool. So **I read no Reddit thread and none of Reddit's own pages.**
  - web.archive.org also refuses it. I could read Wayback snapshot metadata through archive.org's availability API, but not snapshot content.
  - I did not route around these blocks. Details are in the sections they affect.

## Findings that change the posts

1. **Reddit reportedly set an end date for public data access, and none of the ranking pages I checked mention it.** Four outlets report: new public API requests stopped 2026-10-31, RSS ends 2026-11-13, public API access closes by March 2027. See section 0. This is the largest gap across all six queries.
2. **GummySearch's dates and reason are unchanged.** Full shutdown and data deletion are 2026-12-01, 28 days from today.
3. **No small audience-research tool I opened says it holds a commercial Reddit licence.** Subreddit Signals says it runs on the official API, without claiming a licence. The partners with announced Reddit deals are enterprise suites with no public listening price.
4. **TrackReddit: no shutdown announcement found.** The "it died in 2020" evidence comes from competitors. A 2020 user complaint quoted by Syften is the strongest item. Several 2026 listicles still present it as live and free.
5. **There is no independent false-positive rate for Reddit keyword alerts,** and only two Reddit-specific timing studies. Neither is general-purpose. See section 3.7.

---

## 0. Cross-cutting: Reddit's API and RSS closure

This affects every Reddit tool named below.

**The September 2026 notice.** Reddit's post itself could not be opened. These are secondary reports:

| Date | Event | Reported by |
|---|---|---|
| 2026-09-30 | Reddit announces the change | Decrypt, How2Shout |
| 2026-10-31 | New public API access requests stop | TechRepublic, Decrypt, How2Shout |
| 2026-11-10 | Migration progress update | How2Shout |
| 2026-11-13 | RSS feeds end | heise, TechRepublic, Decrypt, How2Shout |
| 2026-11-30 | App migration bounty registration closes | TechRepublic, Decrypt, How2Shout |
| 2027-01-12 | Access starts closing for unregistered apps and users | TechRepublic, Decrypt, How2Shout |
| 2027-02-23 | Further migration progress update | How2Shout |
| March 2027 | Remaining public API access closes | heise, TechRepublic, Decrypt, How2Shout |

- **Stated reason:** scraping and automated abuse (heise, Decrypt).
- **RSS replacement:** none for feeds outside communities you moderate. Moderators get the Discord Relay app (Decrypt, How2Shout).
- **Conflict to resolve before publishing:**
  - heise says registered API users are not affected.
  - TechRepublic says "Registration alone does not preserve legacy public API access indefinitely."
  - Decrypt says registered apps avoid the January date, but does not say whether they escape March 2027.
- **Commercial tools:**
  - How2Shout says social listening products will need a commercial agreement after March 2027.
  - TechRepublic tells buyers to "ask vendors how they plan to maintain access after March 2027."
- **Sources:**
  - https://www.heise.de/en/news/Reddit-to-shut-down-RSS-feeds-and-public-API-11473400.html [press]
  - https://www.techrepublic.com/article/news-reddit-rss-public-api-shutdown/ [press]
  - https://decrypt.co/379892/reddit-killing-rss-feeds-public-api-access-ai-scrapers [press]
  - https://www.how2shout.com/news/reddit-rss-public-api-shutdown-dates.html [press]
- **Check again after 2026-11-10,** when the next update is due.

**The May 2026 `.json` block.**
- A write-up says Reddit announced the shutdown of unauthenticated `.json` access on 2026-05-28 in r/modnews, with 403s following within days. https://dev.to/tonywangca/why-reddit-blocked-unauthenticated-json-in-2026-and-how-to-still-get-reddit-data-58b9 (originally on crawlora.net, which sells a Reddit API, so vendor-tied)
- An unrelated GitHub issue logged direct 403s on `.json` requests on 2026-10-25 and 2026-10-27. Its 05-28 date comes from the last stored rows. https://github.com/kellyaa/agent-newsletter/issues/328
- Prowlo's blog also reports late-May 403s. https://prowlo.com/blog/reddit-data-api [vendor blog]

**Why it matters:**
- RedNudge's homepage still says "We monitor public Reddit posts using Reddit's public JSON endpoints." https://rednudge.com/ This does not prove RedNudge is broken, since its method may have changed. It should be checked.
- RedNudge's May 2026 F5Bot post says RSS "remains a documented approach." The November 13 date overtakes that. https://rednudge.com/blog/best-f5bot-alternatives-2026 [vendor blog]

---

## Part 1: GummySearch replacements

### 1.1 Shutdown notice: confirmed unchanged

I re-opened the vendor's pages and compared them with `src/sublanding/alternatives/gummysearch/RESEARCH.md`. **Dates and reason match.**

| Item | Current wording or fact | Source |
|---|---|---|
| Homepage banner | "GummySearch is closed as of 11/30/2025." | https://gummysearch.com/ |
| To 2025-11-30 | Full access, signups, purchases, plan changes | https://gummysearch.com/docs/articles/gummysearch-is-now-closed-6533h |
| 2025-12-01 to 2026-11-30 | Paid access for existing customers only, no signups, purchases or renewals | same |
| 2026-12-01 | Complete shutdown. Data "permanently deleted on December 1, 2026." | same |
| Reason (help article) | "due to the inability to reach a commercial license agreement with Reddit's Data API" | same |
| Reason (founder post, 2025-11-30) | Reddit's policies "forbid commercial applications" | https://gummysearch.com/closing-time/ |
| Lifetime-deal access ends | 11/30/2026 | https://gummysearch.com/closing-time/ |

New detail not in `RESEARCH.md`:
- **Original announcement:** 2025-11-06, in a separate post, with the same dates. https://gummysearch.com/final-chapter/
- **User count differs between the founder's posts.** Final-chapter says over 135,000. Closing-time says over 140,000. Use "over 135,000" or cite each post.
- **Possible sale.** The founder says he would prefer a buyer with Reddit or a Reddit Commercial API licence. No buyer is named (final-chapter; also Failory below).
- **Revenue.** Failory reports $35K MRR and a one-person team. https://newsletter.failory.com/p/when-reddit-pulls-over [press]

### 1.2 What GummySearch users say they moved to

**Short answer: I have no reliable evidence.** Reddit threads are where this would be discussed, and I could not open them. Do not write "users moved to X."

What I did find:
- **Hacker News:** 22 search hits for "gummysearch." None is a user saying what they moved to. Two closure threads have no comments. https://hn.algolia.com/api/v1/search?query=gummysearch&hitsPerPage=30 , https://news.ycombinator.com/item?id=45844269 , https://news.ycombinator.com/item?id=49237225
- **One self-described user:** a Medium writer says "I used it too," names Syften, Redreach, Brand24 and GigaBrain, then pitches their own research service. No switch is stated. https://medium.com/@vivaciousquestventuresandvisio/gummysearch-is-dead-heres-what-nobody-s-telling-you-about-the-alternatives-861061a543c5
- **A builder's comment:** one commenter, building their own tool, says they found few public posts from former users saying they would pay for a replacement. Anecdotal. https://dev.to/wubingwx/gummysearch-shut-down-here-are-the-reddit-research-alternatives-for-indie-hackers-2akc
- **Vendor claims about migration have no data behind them:**
  - Simular says most former users combine two tools, unsourced. https://www.simular.ai/alternatives/gummy-search-alternatives
  - Prowlo says its list reflects what users ask about, with no survey or traffic data. https://prowlo.com/blog/gummysearch-shut-down-what-now
  - Leadverse has a "Why GummySearch users are migrating" section, with no data. https://leadverse.ai/alternatives/alternative-to-gummysearch
- **GummySearch's own list** is the most authoritative starting point, but says "(some of these might be affiliate links)." It names BuzzAbout, Adlicio, RedReach, ReplyAgent, SubredditSignals, PainOnSocial, IdeaFast and Postpone. https://gummysearch.com/gummysearch-alternatives/

**Action for the user:** read r/SaaS, r/indiehackers and r/startups threads by hand if the post needs first-person switching quotes.

### 1.3 Reddit's own business tools

**Reddit Pro**
- **Official URL:** https://www.business.reddit.com/pro, as linked by BrandMentions. Not opened, because the domain is blocked.
- **Status:** free, "currently available in beta to eligible businesses and organizations" per a vendor blog updated 2026-09-17. https://brandmentions.com/blog/best-social-listening-tools-reddit/ [vendor blog]
- **Access:** free. Provide name, URL, category and employee count. Approval is described as instant. https://www.practicalecommerce.com/seo-wins-from-reddit-pro [press, 2026-04-06]
- **Trends:**
  - Announced 2025-01-07. Shows conversation volume over time, the communities mentioning a term, and a feed of related posts.
  - Covers about 100,000 "smart" keywords. https://techcrunch.com/2025/01/07/reddit-intros-new-trends-tools-for-businesses-and-an-ama-ad-format/ [press]
  - Added to mobile by 2025-08-26. https://www.socialmediatoday.com/news/reddit-adds-mobile-trend-insights-comment-performance-data/758703/ [press]
- **Other features, per Practical Ecommerce:** recent threads per keyword with AI context and sentiment, a weekly email, a Questions tab, brand sentiment and competitor monitoring.
- **Limit:** chart filter "is limited to 3 prior months" (the writer: "too restrictive"). The Questions tab also tops out at 3 months.
- **Data source:** Reddit, first party. No licence question arises.
- **Coverage of GummySearch's job:**
  - Keyword tracking: yes.
  - Finding communities per keyword: yes.
  - Question and pain-point surfacing: partial.
  - Saved subreddit "audiences" and theme buckets: no source I read describes them.
- **Conflict:** BrandMentions says there is no dedicated sentiment analysis. Practical Ecommerce describes AI brand-sentiment analysis. Verify in the product.

**Reddit Insights**
- An AI social listening dashboard Reddit was testing in June 2025, with Publicis Media named as an early tester. https://dataconomy.com/?p=72820 [press]
- [UNCERTAIN] I could not confirm current availability or who can use it. Treat it as ad-side, not a self-serve GummySearch replacement.

### 1.4 Replacements that do audience research

Pricing is from each vendor's page, read 2026-11-03. "Licence statement" means what the vendor's page says about Reddit data access.

**Status:** all nine tools below were live on 2026-11-03, meaning the page loaded with these latest markers:
- BuzzAbout: © 2026 only.
- Adlicio: newest review 2026-09-04.
- PainOnSocial: comparison page updated 2026-10-10.
- IdeaFast: demo posts up to 2026-10-28.
- Pane: feed item dated Jul '26.
- Reddinbox: © 2026, blog post 2026-03-15.
- Karmit: AlternativeTo listing added 2026-10-14.
- Subreddit Signals: © 2026 only.
- Trend Seeker: live signal counters, blog updated 2026-10-09.

**Self-serve tools**

| Tool and URL | Job coverage | Pricing (vendor page) | Data source | Licence statement |
|---|---|---|---|---|
| **BuzzAbout** https://buzzabout.ai/ | Audience profiling, pain points, top questions, subreddit tracking | https://buzzabout.ai/pricing : Starter $98/mo, Pro $178/mo, Business $450/mo, Enterprise custom. $1 one-day trial | Reddit, TikTok, Instagram, YouTube, Facebook, X, LinkedIn. FAQ and plan cards disagree on Facebook | None |
| **Adlicio** https://tryadlicio.com/ | Recurring themes from comments and reviews, aimed at ad angles. Has a "Reddit Radar" | Same page: Starter $49/mo, Growth $99/mo, Scale $199/mo, Agency on request | Reddit (11,767 subreddits claimed), Amazon, TikTok, YouTube, Trustpilot and more | None |
| **PainOnSocial** https://painonsocial.com/ | Pain-point scans ranked by AI score, weekly topic watches, subreddit guides for 800+ professions | https://painonsocial.com/pricing : Starter $19/mo (7-day trial), Professional $49/mo | Reddit | None |
| **IdeaFast** https://www.ideafast.pro/ | Recurring pain points scored 0 to 100, startup ideas, trend tracking on top plan | Same page, one-time: Explorer free, Founder $19 (40 scans), Builder $49 (100 scans) | "public conversations across reddit" | None |
| **Pane (Panegains)** https://panegains.com/ | Clusters complaints into ranked problems, Topic Watch for a niche | https://panegains.com/pricing : Free, Player $29/mo ($290/yr), Pro $49/mo ($490/yr), Intel from $250 | Reddit, HN, Stack Overflow, GitHub issues, app-store reviews, open web. 270+ subreddits | None. Its "So it's a Reddit scraper?" FAQ answers "No," but about product value, not data access |
| **Reddinbox** https://reddinbox.com/ | Research agent with Top Pains, Questions, Trending and Vocabulary tabs. Free subreddit stats tool | https://reddinbox.com/pricing : Starter $39/mo ($390/yr), Pro $99/mo ($990/yr). Free trial | Reddit, X, Bluesky, HN, Facebook | None |
| **Karmit** https://karmit.co/ | Community Map, Community Analysis, Voice of Customer, Hotspot Analysis, monitoring every five minutes | Same page, credits: Free map, Starter $10 one-time, Pro $40 one-time | "real Reddit data," method unnamed | None |

**Partial or adjacent**

| Tool and URL | Why partial | Pricing (vendor page) | Licence statement |
|---|---|---|---|
| **Subreddit Signals** https://www.subredditsignals.com/ | Lead tool first. Suggests subreddits. Pain Points Radar "is not exhaustive Reddit-wide trend analysis" | https://www.subredditsignals.com/pricing : Starter $29/mo, Pro $59/mo. 14-day trial, card required | **The only small vendor stating API use:** "runs on the official Reddit API." The words "licence" and "commercial" do not appear |
| **Trend Seeker** https://trend-seeker.app/ | Idea discovery. Its own blog says "No custom audience/subreddit curation like GummySearch had." https://trend-seeker.app/blog/gummysearch-alternative [vendor blog] | https://trend-seeker.app/pricing : Free, Pro $9.99/mo, Pro Plus $39/mo | None. Homepage does not name Reddit. Its blog says Reddit is one source among several |

**Enterprise suites with announced Reddit data deals**

These can do listening and audience work, but they are a different budget class.

| Vendor | Evidence of Reddit access | Pricing |
|---|---|---|
| **Meltwater** | Official Data Partner. "continues Meltwater's access to Reddit's enterprise data APIs" (dated 2026-02-13). https://www.meltwater.com/en/press-releases/reddit-partnership [vendor page] | "Request pricing" only |
| **Sprinklr** | Data API partnership, 2024-06-06. https://www.tipranks.com/news/the-fly/sprinklr-reddit-expand-strategic-partnership [press] | No published price, per Syften's blog [vendor blog] |
| **Sprout Social** | Expanded Reddit partnership, 2024-02-08. https://sproutsocial.com/insights/press/sprout-social-expands-reddit-partnership/ [vendor page]. The "Official Reddit Data Partner" label comes only from BrandMentions [UNCERTAIN] | https://sproutsocial.com/pricing/ : Standard $199/seat/mo. Listening is an add-on priced by demo. That page does not mention Reddit |
| **Brandwatch / Cision, Talkwalker** | The SI Lab says they announced formal Reddit partnerships. https://www.thesilab.com/resource/how-to-do-social-listening-with-reddit-data [UNCERTAIN: not confirmed on their own pages. Talkwalker's post returned only its title] | No published price, per Syften's blog [vendor blog] |

### 1.5 Signs of abandonment

- **Peekdit shows clear signs. Do not recommend it without checking by hand.**
  - https://peekdit.com/ and https://peekdit.com/pricing returned 404.
  - The www host returned an expired-certificate error.
  - Its Chrome listing was last updated 2025-12-29, with 13 users, at v1.0.1. https://chromewebstore.google.com/detail/peekdit/fbeefacphficbmanencnmnjmicppefgh
  - AlternativeTo still lists it at $19 to $25/mo. https://alternativeto.net/software/peekdit/about
- **GigaBrain [UNCERTAIN].**
  - One blog says it announced shutdown on 2026-02-08 after losing Reddit data access. https://karmatools.xyz/blog/reddit-api-licensing/
  - I could not corroborate this. A search found no second source.
  - thegigabrain.com returned a certificate error naming an unrelated host.
  - Do not state it as fact, and do not recommend it.
- **BigIdeasDB:** its pages returned HTTP 429 on every attempt, so I could not verify it. That is a rate limit, not a sign of abandonment. Trend Seeker's blog lists it from $49.99 one-time.
- **No abandonment signs** on the other tools in 1.4. Very new products worth flagging: Karmit (AlternativeTo listing dated 2026-10-14), and IdeaFast and Pane (AlternativeTo lists both as since 2026). https://alternativeto.net/software/gummysearch/ Being new is a risk, not a sign of abandonment.

### 1.6 Lead-alert tools that are not research replacements

GummySearch's own list files RedReach, ReplyAgent and SubredditSignals under "Reddit Lead Generation."
- RedReach's post covers leads, and does not describe subreddit browsing or theme analysis as features. https://redreach.ai/blog/gummysearch-shutdown-alternative [vendor blog]
- F5Bot and Syften do keyword alerts, not audience research.
- Do not present these as replacing the research job.

### 1.7 What vendors say about Reddit access

GummySearch closed over this, so it is the fair question to ask.

| Vendor | What the page says | Reading |
|---|---|---|
| Meltwater, Sprinklr, Sprout Social | Announced Reddit partnership or data API access | Strongest evidence |
| Subreddit Signals | "runs on the official Reddit API" | API use stated. No commercial licence claimed |
| Octolens | Works "within Reddit's API limits." https://octolens.com/reddit-monitoring | API implied. No licence claimed |
| RedNudge | "Reddit's public JSON endpoints" | Conflicts with reported `.json` 403s (section 0) |
| Prowlo | Such data layers "do not use Reddit's official API," and "the data provider holds the access relationship with Reddit." Never says it holds a licence. https://prowlo.com/blog/reddit-data-api | Third-party data path |
| Redditapis | "no commercial agreement to negotiate," basis not explained. https://www.redditapis.com/gummysearch-alternative | Unexplained. Treat with caution |
| BuzzAbout, Adlicio, PainOnSocial, IdeaFast, Pane, Reddinbox, Karmit, Syften, F5Bot, Awario, Brand24, Trackdit | Silent on method | Unknown. Ask them |

- Simular's "API Risk" column is the only attempt I saw to label this across tools. It gives no evidence and promotes its own tool, so do not reuse it.
- No vendor in the self-serve table in 1.4 states a commercial licence.

### 1.8 Honest framing for the post

- Trend Seeker's blog is the only list I read that says it plainly: "There is no exact replacement."
- **Closest single tool to the browsing job (inference):** Karmit, for its map and community analysis, and Reddinbox, for its pain and question tabs. Neither is proven.
- **Cheapest honest stack (inference):** Reddit Pro for keyword and community discovery, plus one pain-point tool.

---

## Part 2: TrackReddit

### 2.1 Summary

TrackReddit was a real-time Reddit keyword alert service launched in July 2014. It was a recognised tool for years. The best evidence says the service stopped working by about October 2020. **I found no shutdown announcement.** The domain now hosts promotional articles with no product.

### 2.2 Record

| Question | Finding | Confidence and source |
|---|---|---|
| Domain | Registered 2014-06-15. Last changed 2026-06-15. Expires 2027-06-15. GoDaddy, Cloudflare name servers | High. https://rdap.verisign.com/com/v1/domain/trackreddit.com |
| Launch | Show HN 2014-07-13 (46 points). #1 on Product Hunt 2014-07-15, 210 upvotes | High. https://news.ycombinator.com/item?id=8028890 , https://www.producthunt.com/posts/trackreddit |
| Who made it | **Not established.** HN poster is `TheMask01`, who does not claim it. Product Hunt shows hunter Jack Smith and says "no makers." | Unknown. https://www.producthunt.com/products/trackreddit/makers |
| Location | A directory entry names no people. Search-result text from Crunchbase and Tracxn says Phoenix, Arizona, founded 2014, but neither page opened | [UNCERTAIN]. https://phoenix.startups-list.com/startups/trackreddit |
| What it did | Watched all of Reddit for keywords. Required and excluded terms. Comments, submissions or both. Subreddit limits. Email or text alerts, real time or digest. Shareable result URLs. Exports. API on upgraded plans. Affiliate programme | Medium. https://thebetterwebmovement.com/trackreddit-a-robust-reddit-monitoring-tool/ (affiliate review), plus the Phoenix directory entry |
| Pricing | **Free: 3 keywords, no card. Paid: $19 to $119/mo.** Not from an archived vendor page. Undated review, footer "© 2016-22," images from 2015 and 2016 | Medium. Same review. A 2014 HN comment confirms paid plans and SMS: "Wish there was a cheaper plan though" |
| Early limits | Trackers had a 5-character minimum, per a 2014 HN comment | Low. https://news.ycombinator.com/item?id=8028890 |
| Still treated as a rival, 2017 | HN commenter `codeplea`, comparing it with F5Bot: "F5Bot is free and it covers HN + Lobsters too." (2017-02-22) | High. https://news.ycombinator.com/item?id=13709068 |

### 2.3 When it was last visibly live

Bracketed, not pinned down:

- **Latest datable positive evidence:** the February 2017 HN comparison above. The Better Web Movement review is undated. ReplyAgent says "last major update was 2018" but gives no source. https://www.replyagent.ai/blog/best-brand-monitoring-tools-track-reddit-mentions [vendor blog]
- **First negative evidence, October 2020:** Syften's Reddit page has a case study headed "Trackreddit is no more?". It describes a paying user looking for a replacement after the service stopped working, attributed to u/sherbang in r/trackreddit. https://syften.com/reddit [vendor page]
- **About 2020:** a Product Hunt comment shown as "6yr ago" says "Since TrackReddit is dead," and suggests Syften. The commenter, Michal Mazurek, is Syften's founder per Syften's own blog. https://www.producthunt.com/posts/trackreddit , https://syften.com/blog/best-reddit-monitoring-tools/
- **Notifier [UNCERTAIN]:** search-result text said Notifier reports the site went down in mid-to-late 2020 and the domain was on GoDaddy auction. The URL returned (`notifier.so/docs/?p=698`) showed unrelated content when opened, and I could not find the page. Do not cite it unless you can open it.

Wayback availability API, metadata only. Each returned HTTP 200, but **I could not read the content**, so 200 says nothing about whether the product worked:

| Snapshot | Host |
|---|---|
| 2014-12-24 | www.trackreddit.com |
| 2017-11-23 | www.trackreddit.com |
| 2019-12-13 | www.trackreddit.com |
| 2020-08-12 | www.trackreddit.com |
| 2020-11-11 | www.trackreddit.com |
| 2021-05-07 | www.trackreddit.com |
| 2021-12-23 | trackreddit.com |
| 2023-03-15 | www.trackreddit.com/dashboard.php |
| 2023-11-29 | trackreddit.com |
| 2025-10-03 | trackreddit.com |

API used: https://archive.org/wayback/available?url=trackreddit.com&timestamp=2019 (same pattern for other dates). No snapshot exists for `/pricing` or `/pricing.php`.

**To finish this by hand:** open https://web.archive.org/web/2020*/trackreddit.com in a browser. The 2019-12-13 and 2020-08-12 snapshots should show the last product page and price, and the 2021 to 2023 ones should show when the articles replaced it.

### 2.4 Shutdown announcement

**None found.** No statement from TrackReddit appeared in Hacker News, Product Hunt, directories or the search results. Its X account and Crunchbase page refused the fetch tool (HTTP 402 and 403), and r/trackreddit is blocked, so an announcement could exist there. Safe wording: "appears to have stopped working around 2020; no shutdown notice found."

### 2.5 What is on trackreddit.com today

Confirmed. The homepage is "Social Media Listening: Navigating the World of Online Feedback," with no byline, signup or pricing. Footer: "Proudly powered by JTG Media and SMM Lab." It contains unrelated promotional links. https://trackreddit.com/

A second page, "Reddit Trackers Unveiled," describes TrackReddit as a real-time alert tool with no way to try it, and links to an essay service. https://trackreddit.com/tracking-php/

Image paths point to a 2023/10 upload folder, so this content probably dates from about then or later. That is inference. Ownership of the domain today is not established.

### 2.6 Does another live product use the name?

**No live product under the exact name found.**
- trackreddit.io, .app, .co and .net do not resolve.
- **Trackdit** (https://trackdit.com/) is live with a similar name. Different spelling, launched 2026, free plan, maker Meelis Ojasild on Product Hunt. No stated link to TrackReddit. https://www.producthunt.com/posts/trackdit
- **Beware:** an undated entry on mythos.one describes "Track Reddit" in the present tense, with "within 30 seconds" matches, and complains of "absentee owners." It cannot be dated or verified. https://mythos.one/me/brianswichkow/c7d691

### 2.7 Pages still presenting it as live

- ReplyAgent: "Simple, free Reddit mention tracker with keyword alerts." Dated 2024-11-08, titled for 2026 [vendor blog]
- PainOnSocial: "TrackReddit (Free)" in a 2026 list. https://painonsocial.com/blog/reddit-monitoring-tools [vendor blog]
- PainOnSocial, second list: "real-time keyword tracking across all subreddits." https://painonsocial.com/blog/reddit-monitoring-platforms [vendor blog]
- Blaze, in the present tense, undated. https://www.blaze.ai/blog/reddit-marketing-tools [vendor blog]
- A dev.to guide promoting Wappkit: "Simple web-based trackers like TrackReddit." https://dev.to/short_playskits_ab152535/a-practical-guide-to-reddit-keyword-monitoring-for-founders-and-growth-operators-2afi
- Zoho, last updated 2023-08-17. https://www.zoho.com/social/journal/marketing-on-reddit-an-essential-guide-for-brands.html [vendor blog]

---

## Part 3: Search results

### 3.0 What every query has in common

- **Almost every ranking page is a vendor ranking itself first.**
- **I checked for the Reddit closure on pages updated after 2026-09-30:**
  - Relato's F5Bot post (updated 10-27) and monitoring post (updated 10-19): not mentioned.
  - PainOnSocial (updated 10-10): not mentioned.
  - Trend Seeker (updated 10-09): not mentioned.
  - Syften's list (updated 10-08): makes no statement about Reddit's API.
  - AlternativeTo's F5Bot page (updated 10-13): not mentioned.
- **No page reports a measured latency or precision figure,** except Leadmore's single test (3.7).
- **Prices are widely stale.** See the corrections in 3.3 and 3.5 and 3.6.

### 3.1 Query: reddit monitoring tool

**Top 5 (extended mode):**
1. https://awario.com/reddit-monitoring/ [vendor page]
2. https://octolens.com/reddit-monitoring [vendor page]
3. https://syften.com/blog/best-reddit-monitoring-tools/ [vendor blog, updated 2026-10-08]
4. https://quorage.com/social-media/best-reddit-keyword-monitoring-tools/ (editorial blog, undated, no affiliate disclosure)
5. https://linkeddit.com/reddit-monitoring: **returned HTTP 410 Gone when opened.**

Also read: https://usepulse.ai/reddit/blog/top-10-reddit-monitoring-tools [vendor blog], https://brand24.com/reddit-monitoring-tool/ [vendor page], https://redship.io/best-reddit-monitoring-tools [vendor blog], https://www.relato.com/blog/best-reddit-monitoring-tools/ [vendor blog]. Standard mode returned Brand24, directories and code repositories.

**H2s:**
- *Awario* (no heading markup; section titles): Track brand mentions on Reddit; Find leads among billions of Reddit users; Monitor Reddit influencers; Check your marketing progress on Reddit; Monitor your competition; Reddit monitoring in real time; Detect links to your website; View full context for every mention; Visualize topics and themes; Find top posts and influencers; Find leads on Reddit; Get instant notifications; How Awario's Reddit monitoring works; Why monitor Reddit with Awario?; Why Awario is Different; Start Reddit monitoring; Customers about us; Reddit monitoring with Awario - FAQ.
- *Octolens:* Why you should monitor Reddit; How Reddit monitoring works; Everything you need to track Reddit; Real results from teams using Octolens; Finally, social listening with fair pricing; Keyword Monitoring for Reddit - FAQ; Monitor other platforms; Start listening to your customers today.
- *Syften:* Choose by the job you need done; Quick verdict and Reddit Monitoring Score; Is Syften the best online community monitoring tool for demand generation?; How I evaluated these tools; Tools I did not rank; Short answers; Reddit monitoring, Reddit analytics, social listening, and Reddit marketing tools are not the same thing; What makes a Reddit monitoring tool good?; 13 best Reddit monitoring tools in 2026; Free vs paid Reddit monitoring; How to set up Reddit monitoring well; Final recommendation.
- *Quorage:* #1 Brand24; #2 Awario; #3 GummySearch; #4 Octolens; #5 Pulse for Reddit; #6 (Bonus) Syften; FAQs.

**All cover:** "real time" claims, keyword and subreddit filters, Slack or email delivery, AI relevance or sentiment, why Reddit matters, FAQ.

**Miss or get wrong:**
- Quorage ranks GummySearch #3 as if buyable, and Pulse recommends it as live with no status note.
- Quorage calls Octolens "real-time alerts every hour," and claims "100% accuracy on keyword mentions" with no evidence.
- Quorage lists Octolens at $19/mo and Syften at $19.95. Vendors list $159/mo billed annually and $29.95.
- Awario never says whether comments are monitored. RedNudge's page describes posts only.
- Syften's "A helpful reply is worth more while the thread is still active" has no data behind it.

**The gap:** nobody separates alert speed by plan, and nobody asks who still has Reddit data after March 2027. Published vendor figures already make a useful table:

| Tool and plan | Published delay | Source |
|---|---|---|
| F5Bot Free | Up to 2 hours from when it finds a match | https://f5bot.com/tiers |
| F5Bot Silver | Up to 5 minutes | same |
| F5Bot Gold and up | Instant or scheduled | same |
| Syften | Target under 1 minute | https://syften.com/reddit |
| Octolens | "within 1-2 minutes" stated; Pro listed as hourly refresh, Scale as real-time | https://octolens.com/reddit-monitoring |
| Awario | "within a couple of minutes" | https://awario.com/reddit-monitoring/ |
| RedNudge | Scans every 30 minutes, with a daily digest as the main output | https://rednudge.com/ |
| Karmit | Every five minutes | https://karmit.co/ |
| Brand24 Individual | Every 12 hours, per a competitor [UNCERTAIN] | https://redship.io/best-reddit-monitoring-tools |

All are vendor-stated targets, not measurements.

### 3.2 Query: gummysearch alternative

**Top 5 (extended mode):**
1. https://www.g2.com/products/gummysearch/competitors/alternatives [directory]
2. https://www.simular.ai/alternatives/gummy-search-alternatives [vendor page]
3. https://redreach.ai/blog/gummysearch-shutdown-alternative [vendor blog, 2025-12-02]
4. bigideasdb.com/gummysearch-alternative [vendor page]: **HTTP 429 on every attempt, not read.**
5. https://leadverse.ai/alternatives/alternative-to-gummysearch [vendor page]

Also read: https://prowlo.com/blog/gummysearch-shut-down-what-now [vendor blog, 2026-09-15], https://alternativeto.net/software/gummysearch/ [directory], https://painonsocial.com/gummysearch-alternative [vendor page, updated 2026-10-10], https://trend-seeker.app/blog/gummysearch-alternative [vendor blog, updated 2026-10-09], https://redship.io/blog/gummysearch-shut-down-alternatives [vendor blog, updated 2026-09-14], https://reddinbox.com/blog/best-gummysearch-alternative [vendor blog, 2026-03-15], https://prems.ai/blog/gummysearch-is-dead-best-alternative [vendor blog]. Standard mode led with AlternativeTo and other directories.

**H2s:**
- *G2:* Top 10 Alternatives to GummySearch Recently Reviewed By G2 Community; AI can help you find the answers. G2 helps you trust them.
- *Simular:* How we evaluated; Comparison Summary; 9 GummySearch Alternatives Worth Using in 2026; Stop doing repetitive tasks. Let Sai handle them for you.
- *Redreach:* What Happened to GummySearch?; Redreach: The Best GummySearch Alternative; How Redreach Compares to GummySearch; What Makes Redreach the Top GummySearch Alternative?; How to Get Started with Redreach; Who Should Use Redreach?; Pricing That Makes Sense; Making the Switch Today; Getting Started with the Best GummySearch Alternative; Get Customers from Reddit.
- *Leadverse:* Feature comparison; Why GummySearch users are migrating; Where Leadverse goes beyond GummySearch; Frequently asked questions; Other Leadverse alternatives.
- *Prowlo:* Key takeaways; Why did GummySearch shut down?; 9 Best GummySearch Alternatives Compared; Which GummySearch replacement should you pick?; What's different about Reddit marketing in 2026?; Related deep-dives; FAQ.
- *PainOnSocial:* Key takeaways; What happened to GummySearch?; Can you still sign up for GummySearch?; What did GummySearch cost?; What did GummySearch do?; How PainOnSocial replaces GummySearch's research features; What PainOnSocial finds on Reddit; How to move from GummySearch in 4 steps; GummySearch alternative: frequently asked questions; Sources; Keep your Reddit research running after December 1.
- *Trend Seeker:* What GummySearch Actually Did; The Best GummySearch Alternatives in 2026; GummySearch Alternatives Comparison; Why GummySearch Shut Down; Which Alternative Should You Choose?; The Bigger Lesson; Sources and Further Reading; Test the research workflow before choosing a replacement.

**All cover:** closure story, a ranked list with own product first, a price table, a "which should you choose" section.

**Miss or get wrong:**
- G2's top alternatives include Thinkific, Akismet and redirect.pizza, and it does not say GummySearch closed.
- AlternativeTo also does not say GummySearch is discontinued.
- Simular says "GummySearch shut down on November 30, 2025," which omits the 2026-12-01 deletion. It also gives wrong tier names and prices (Growth $59, Business $99). The real tiers were Starter $29, Pro $59, Mega $199.
- Prems's title says "10 Alternatives Tested (Only 3 Work)," but the page describes no test and no such verdict.
- Prowlo frames the shutdown as past while saying access runs to November 2026.
- Redreach gives no closure reason at all.
- Reddinbox gives "$0.24 per 1,000 API calls" with no source. Prems and Prowlo repeat the figure, pointing to Reddit's terms or wiki, which I could not open. [UNCERTAIN: Prowlo's other post treats Reddit's commercial pricing as third-party reporting, not a published rate card. https://prowlo.com/blog/reddit-data-api ]
- Most pages swap GummySearch's job (research) for lead generation.

**The gap:** a job-by-job map with licence status.
- Lists rarely split subreddit discovery, themes, search and tracking into separate replacements. Reddinbox's "GummySearch Features and Their Replacements" section is the closest I saw. I did not read its mapping in detail, and Reddinbox ranks itself first.
- Reddit Pro is absent from every GummySearch list whose tools I captured (GummySearch's own, Simular, Prowlo, RedShip, Reddinbox, Trend Seeker, Prems), although it is free and first-party.
- Nobody tells readers that the licence problem now reaches their replacement too (section 0).
- Reasonable angle for the post (my wording, not a source): GummySearch closed over Reddit access, Reddit reportedly ends public access by March 2027, so here is what to ask any replacement.

### 3.3 Query: trackreddit

**Top 5 (extended mode):**
1. crunchbase.com/organization/trackreddit: **HTTP 403, not read.**
2. x.com/trackreddit: **HTTP 402, not read.**
3. https://www.blaze.ai/blog/reddit-marketing-tools [vendor blog]
4. https://www.zoho.com/social/journal/marketing-on-reddit-an-essential-guide-for-brands.html [vendor blog, 2023-08-17]
5. https://startupresources.io/resource/trackreddit/ [directory]

Also read: https://trackreddit.com/tracking-php/ (the current domain), https://thebetterwebmovement.com/trackreddit-a-robust-reddit-monitoring-tool/ , https://www.producthunt.com/products/trackreddit , https://mythos.one/me/brianswichkow/c7d691 . Standard mode returned mythos.one, Trackdit, Notifier and browser add-ons.

**H2s:**
- *Blaze:* Why Use Reddit Marketing Tools?; Audience and Trend Research Tools; Scheduling and Posting Tools; SEO and Competitive Analysis Tools; AI and Insight Tools; Pro Tips for Choosing the Right Tools; FAQ: Reddit Marketing Tools; Conclusion – Tools Work Best with a Community-First Approach.
- *Zoho:* Why is Reddit important?; How to use Reddit for marketing.
- *Startup Resources:* You might also like these resources...; Get the best new tools and articles to build your Startup.
- *trackreddit.com/tracking-php:* Understanding the Basics of Reddit Tracking; The Most Popular Reddit Tracking Tools and Extensions; The Pros and Cons of Using Reddit Tracking Tools; How to Set Up and Use Reddit Trackers for Optimal Results (twice); Addressing Common Concerns and Questions About Reddit Trackers; Final Thoughts on Utilizing Reddit Trackers.

**All cover:** a one-line "alerts for Reddit keywords" description.

**Miss or get wrong:** see 2.7. Blaze warns about alert fatigue but not that the tool is gone. The domain itself markets TrackReddit with no product behind it.

**The gap: no page plainly says what happened.** The current top results describe a live tool or are stale profiles. The people who said it died are competitors. A post can honestly say: launched July 2014, paid plans of $19 to $119/mo, reported dead around October 2020, no shutdown notice found, domain now serving unrelated articles. Then show which of its features have a home today: comment and submission filters, text alerts, shareable result URLs.

### 3.4 Query: rednudge

**Top 5 (extended mode):**
1. https://openhunts.com/projects/rednudge [directory]
2. https://whattheai.tech/tools/rednudge [directory]
3. https://tooltrove.net/rednudge [directory]
4. https://rednudge.com/vs/social-searcher [vendor page]
5. https://earlyhunt.com/project/rednudge-reddit-keyword-monitoring-ai-digests [directory, updated 2026-10-23]

Also read: https://rednudge.com/ (#6, vendor page), https://rednudge.com/best-reddit-monitoring-tools [vendor page], https://rednudge.com/blog/best-f5bot-alternatives-2026 [vendor blog], https://hunted.space/product/rednudge [directory], https://www.producthunt.com/products/rednudge/reviews [directory].

**H2s:**
- *OpenHunts:* Comments; Tools Similar to RedNudge.
- *WhatTheAI:* About rednudge; Product Information; Add the Featured badge to your site; Related to rednudge; Similar AI Tools; Popular AI tool categories; Popular AI tools; Latest guides.
- *ToolTrove:* About rednudge; Key features; Use cases; Pros; Limitations; Screenshots; Reviews; rednudge alternatives; Related tools; Categories.
- *RedNudge vs Social Searcher:* One-off lookups vs daily ops; Reddit depth.
- *EarlyHunt:* About RedNudge; What RedNudge — Reddit Keyword Monitoring & AI Digests does; Who RedNudge — Reddit Keyword Monitoring & AI Digests is for; Pricing & access; Key features; Quick answers; Overview; Frequently asked questions; Screenshots / media; Links; Explore.

**Vendor facts, from https://rednudge.com/ :**
- Starter $7/mo: 5 keywords, 300 AI-scored matches a month.
- Pro $15/mo: 15 keywords, 1,000 matches.
- 7-day trial, no card. Score 1 to 10. Scans every 30 minutes. Daily digest, optional Slack.
- Footer company: 3D Reality Labs LLC.

**All cover:** keyword scan, AI relevance score, intent tags, daily digest.

**Miss or get wrong:**
- **Price:** Product Hunt shows Pro at $19. EarlyHunt lists it as free. OpenHunts says "webfreemium." The vendor shows $7 and $15.
- **Score scale:** Product Hunt text in search results says 0 to 100, against the vendor's 1 to 10. [UNCERTAIN on the Product Hunt wording, since my fetch of that page did not surface it]
- **Speed:** the homepage heading says "Real-time Reddit monitoring," while scans run every 30 minutes and the main output is a daily digest.
- **Comments:** the fetch tool read the homepage as describing posts, not comments. No directory raises this. Confirm with the vendor before stating it firmly.
- **Its "8 Tested" list** describes no test method, and gives GummySearch a $29/mo starting price on a page last updated May 2026.
- **Traction:** Product Hunt shows 0 reviews and 5 followers. hunted.space shows 0 upvotes.

**The gap: no independent review exists.** Page one is launch directories rewriting the vendor's description. A useful page would answer three questions no one covers:
1. Does a 30-minute scan plus a daily digest fit a reply window (see 3.7)?
2. Does it watch comments?
3. Does it still work on "public JSON endpoints" after the reported `.json` block?

Test question 3 before publishing. Do not assert a failure you have not observed.

### 3.5 Query: f5bot alternatives

**Top 5 (extended mode):**
1. https://alternativeto.net/software/f5bot/ [directory, updated 2026-10-13]
2. https://www.relato.com/blog/f5bot-alternatives/ [vendor blog, updated 2026-10-27]
3. https://mentionagent.ai/blog/f5bot-alternatives/ [vendor blog, April 2026]
4. https://www.communitytracker.ai/blog/f5bot-alternatives [vendor blog, 2026-09-04]
5. https://redship.io/best-f5bot-alternatives [vendor blog, 2026-09-14]

Also read: https://rednudge.com/blog/best-f5bot-alternatives-2026 [vendor blog, 2026-05-27], https://makerstack.co/reviews/f5bot-review/ (funded by placement fees and some affiliate links), https://leadmore.ai/blog/f5bot-review [vendor blog], https://www.redditalert.com/blog/reddit-keyword-alerts-redditalert-vs-f5bot [vendor blog]. Standard mode was polluted by F5's unrelated bot-defense product.

**H2s:**
- *AlternativeTo:* Alternatives list, then one per product (Buska, MentionFox, Google Alerts, InsightScout, Brand24, Syften, Surfkey, Keyword Watch, Publer, Notikey, Karmit, Mention).
- *Relato:* What F5Bot costs in 2026, in short; Quick comparison for the impatient; What is F5Bot? Pricing, API, and how it works; How to send Reddit alerts to Slack; The alert fatigue problem: why F5Bot's free tier stops working at scale; What to Look for in an F5Bot Alternative; F5Bot vs the top alternatives at a glance; The 10 Best F5Bot Alternatives for 2026; Pricing Breakdown: True Cost of Upgrading from F5Bot; Decision Framework: Which F5Bot Alternative Should You Choose?; Special Considerations: For Agencies & Multi-Client Teams; Conclusion; Frequently asked questions.
- *MentionAgent:* Quick comparison; 1. MentionAgent; 2. Brand24; 3. Mention; 4. GummySearch; 5. Google Alerts; 6. Reddit Pro; 7. Talkwalker; Which alternative should you pick?; What to read next; Related; Frequently asked questions.
- *CommunityTracker:* TL;DR; How I evaluated these F5Bot alternatives; Quick comparison of F5Bot alternatives; 1. CommunityTracker; 2. Syften; 3. Brand24; 4. Mention; 5. Awario; 6. Talkwalker Alerts; Pick the F5Bot alternative that solves the current problem; Frequently asked questions.
- *RedShip:* How this list was put together; At a glance; The tools, ranked; Feature comparison; Which one should you choose?

**F5Bot's own numbers, 2026-11-03, https://f5bot.com/tiers :**

| Plan | Price | Keywords | Per keyword/day | Alerts/day | Delay |
|---|---|---|---|---|---|
| Free | $0 | 5 | 10 | 20 | Up to 2 hours |
| Silver | $12.99/mo | 20 | 30 | 100 | Up to 5 minutes |
| Gold | $49.99/mo | 200 | 100 | 5,000 | Instant or scheduled |
| Platinum | $214.99/mo | 300 | 500 | 200,000 | Instant or scheduled |
| Diamond | From $500/mo | Custom | Custom | Custom | Instant or scheduled |

Silver is labelled "personal, non-commercial use." Gold is recommended for business. API and webhooks start at Platinum.

**All cover:** "free but limited," a list of paid options, alert-fatigue argument.

**Miss or get wrong:**
- **Stale F5Bot limits.** Leadmore (2026-05-18) and RedditAlert (2026-02-17) describe 200 free keywords and 50 alerts per keyword a day. RedNudge (2026-05-27) also describes a 50-a-day cap. Inference: the free tier shrank between 2026-05-27 and 2026-07-20, when MakerStack shows the new limit. F5Bot's page gives no date.
- **Silver price.** Relato, CommunityTracker, RedShip and MakerStack all say $9.99. F5Bot's page says $12.99. [UNCERTAIN whether this is a recent rise]
- **MentionAgent** lists GummySearch as an alternative at $19 and $49/mo, tiers and prices that do not match its real ones, and describes F5Bot as sending one digest per hour.
- **Relato** says F5Bot "treats every keyword match equally" while also listing Gold's AI filters. Its 50 to 100 emails a day and 1 to 2 hours of review are assumptions, not measurements.
- **AlternativeTo** mixes in Publer and Google Alerts, which do not do Reddit keyword alerts in the same way.

**The gap: the real floor for a business is now $49.99/mo.**
- Silver is labelled non-commercial on F5Bot's own page. Relato, the most detailed page, does not mention this, and I did not see it in the other top results.
- "F5Bot is free" is also the most repeated claim, and it now means 5 keywords, 20 alerts a day and up to 2 hours' delay, which is too slow for an early reply if timing matters.
- Nobody says how F5Bot gets Reddit data, or what the closure means for it. F5Bot's page is silent, so ask rather than assume.

### 3.6 Query: syften alternatives

**Top 5 (extended mode):**
1. https://www.capterra.com/p/240533/Syften/alternatives/ [directory]
2. https://alternativeto.net/software/syften/ [directory]
3. https://www.g2.com/products/syften/competitors/alternatives [directory]
4. https://getairefs.com/blog/syften-alternatives-2026/ [vendor blog, updated 2026-08-06]
5. https://www.insightscout.co/alternatives/syften [vendor page]

Also read: https://redship.io/best-syften-alternatives [vendor blog, 2026-09-14]. Standard mode returned AlternativeTo, G2 and generic directories, plus an unrelated product called Syft.

**H2s:**
- *Capterra:* Top alternatives; Top alternatives with AI capabilities; Top Free alternatives to Syften; Top alternatives for SMBs.
- *AlternativeTo:* one per product (Google Alerts, InsightScout, Buska, UserConcern, Brand24, Surfkey, Keyword Watch, F5Bot, Publer, Notikey, Karmit, Mention).
- *G2:* Top 10 Alternatives to Syften Recently Reviewed By G2 Community; AI can help you find the answers. G2 helps you trust them.
- *Airefs:* What Syften does (and where it falls short); The 3 best Syften alternatives; The limitation every tool in this list shares; Side-by-side comparison; Frequently asked questions.
- *InsightScout:* Plain-English difference; Quick take; Syften vs InsightScout: the real tradeoff; Two jobs InsightScout is built for; Why teams switch from Syften; Best fit for InsightScout; Syften still makes sense if; How to switch cleanly; FAQ.

**Syften's own numbers, https://syften.com/pricing :**

| Plan | Price | Community filters | Community results/day | Archive | Notable |
|---|---|---|---|---|---|
| Entry | $29.95/mo | 3 | 100 | 7 days | API access |
| Standard | $49.95/mo | 20 | 200 | 30 days | AI filtering, Slack |
| PRO | $119.95/mo | 100 | 500 | Full available | Webhooks, MCP |

14-day trial on PRO, no card. X (+$40) and YouTube (+$20) are add-ons. Target Reddit delay is under one minute.

**All cover:** generic lists of social and media tools.

**Miss or get wrong:**
- **Capterra** never mentions Reddit and names BigSpy "best free plan." Its "free" section lists free trials.
- **G2** ranks CisionOne "best overall" on one Syften review and lists Semrush, Ahrefs, TVEyes and Newswire.
- **Airefs** gives Syften as $19, $49 and $79 with a free tier. Syften's page shows none of those prices and only a trial.
- **Stale Syften prices elsewhere:** Simular $19.95 with a 7-day trial, Prems and Reddinbox $19 to $79, RedNudge $11/mo, Quorage $19.95.
- **Simular** labels Syften as "Web crawling" with no evidence. Syften's pricing page does not state its method.
- **InsightScout** lists no prices for itself or Syften.

**The gap: page one barely answers the actual question.** A Syften user wants another fast community-alert tool, not a PR suite.
- The directory pages fail on relevance, and some vendor pages have wrong prices.
- The switching reasons on offer are vendor positioning: InsightScout's "Why teams switch from Syften" and Airefs's "where it falls short." Syften's own plans suggest more concrete triggers: 3 filters on Entry, and AI filtering and Slack locked to $49.95. No source I read states these as reasons, so that part is inference.
- None of these pages says how Syften gets Reddit data, apart from Simular's unevidenced label. Syften says it monitors "Posts and comments across Reddit," and its pricing page is silent on method.

### 3.7 Data on timing, sorting and false positives

**Early replies and visibility**

| Finding | Source | Limits |
|---|---|---|
| 6.00% of comments arrive in the first 30 minutes, 9.39% in the first hour, 93.47% within 24 hours. Excluding official bot comments: 4.35% and 7.80% | Ye et al., 2024. https://arxiv.org/html/2411.05328 [preprint] | 3,156,070 comments, 11 mental-health subreddits only, 2005 to 2023. Posts with fewer than 10 comments excluded |
| The first 30% of comments get more upvotes than a random-allocation simulation predicts. Upvote share "decreases rapidly" with later timing | Same | Correlation. No exact share is reported in the text. Earlier comments were also lower quality |
| Reddit Answers selects earlier comments. Median 1.2 hours after the post for selected, 5.9 hours for others. Odds ratio 0.73 per SD of log age | Goyal, Claire, Chandrasekharan, 2026. https://arxiv.org/html/2609.14575 [preprint] | 20 advice and support subreddits, 14.68M comments. Authors say observational, not causal. This is generative search, not classic search |
| Same study: within-thread score percentile is the strongest structural predictor (OR 2.88). About 92% of selected comments are top-level, versus 53% of all comments | Same | Same |
| Average Reddit post half-life is 150 minutes (2.50 hours), down from 155 in 2025 | Graffius, 2026-01-23. https://www.scottgraffius.com/blog/files/lifespan-halflife-of-social-media-posts-update-2026.html (2025: https://www.scottgraffius.com/blog/files/lifespan-halflife-of-social-media-posts-update-for-2025.html ) | Applies to posts, not replies. No Reddit-specific sample given. Single author, method lightly described. Varies by subreddit |

**Most honest claim available:** in the groups studied, most comments arrive within a day, early comments collect a disproportionate share of upvotes, and Reddit's generative search tends to pick comments that came early and scored high. **No study I found measures how fast an individual early reply gains visibility, or shows that replying sooner causes more visibility.** Do not publish a "first hour" rule as fact.

**How sorting favours early replies**
- Reddit's own documentation could not be opened (blocked).
- Ye et al. say Reddit ranks comments by upvotes and "breaks the tie based on the time the comment was posted," favouring earlier ones. A footnote describes Top (upvotes) and Best (upvote ratio) as "often times very similar."
- Evan Miller's 2009 piece describes the method as the lower bound of a Wilson score interval and says it caught on at Reddit. https://evanmiller.org/how-not-to-sort-by-average-rating.html
- Matt Ranger argues in an opinion piece that Best still lets early comments keep the top. His plot needs about 25 votes to converge at an 85% ratio, which is illustrative, not measured. https://singlelunch.com/2019/09/17/a-decade-later-reddits-comment-sorting-still-fails-to-do-its-job/
- Glenski and Weninger found, in a vote-treatment experiment, no positive herding on comments but a 37.4% fall from negative treatment. Its abstract says "social news" and does not name Reddit. https://arxiv.org/abs/1606.06140 [preprint, noted as accepted to ACM TIST]
- **Reddit search:** no data found on how classic Reddit search treats early replies. The Goyal study covers Reddit Answers only.

**False-positive rates from keyword alerts**

**No independent, controlled figure exists that I could find.** What exists:

| Figure | Source | Why it is weak |
|---|---|---|
| 23 of 341 F5Bot alerts actionable (6.7%) over 14 days and 9 keywords. The page says both "about 94%" and "93%" noise | Leadmore, 2026-05-18. https://leadmore.ai/blog/f5bot-review [vendor blog] | One competitor's reviewer, no second rater, broad keywords. "Not actionable" is not "false positive," since most were real keyword matches. Its subreddit-scoping result has no data |
| 80 to 90% of keyword alerts are noise | RedditAlert citing one founder's Reddit post. https://www.redditalert.com/blog/reddit-keyword-alerts-redditalert-vs-f5bot [vendor blog] | An estimate, not a measurement |
| 90 false positives per 100 alerts | Relato. https://www.relato.com/blog/best-reddit-monitoring-tools/ [vendor blog] | Illustrative example. Relato also says of Octolens "We have not seen a published, independent figure for how much noise it removes." |
| Illustrative table | BrandJet. https://www.brandjet.ai/blog/reddit-community-mention-alerts/ [vendor blog] | States "These are illustrative examples" |

**Recommendation:** run a labelled test of your own, and publish the method. That would be the only such figure on page one.

**Related, vendor-only:**
- Syften says comments are 87.4% of activity in devtool-relevant subreddits, without giving a method.
- RedditAlert says about 1.7M posts and 8.6M comments a day, without a source.
- Do not present either as independent.

---

## Open items before publishing

1. **Reddit threads and Reddit's pages.** Open by hand: Reddit Pro, the r/modnews and r/redditdev posts, r/trackreddit, and GummySearch switching threads.
2. **Wayback content for TrackReddit** (section 2.3), to get a primary pricing page and the date the articles replaced the product.
3. **BigIdeasDB,** which rate-limited every attempt.
4. **RedNudge's live behaviour** on `.json` and on comments. Test rather than infer.
5. **The conflict on registered API users** (section 0), plus Reddit's 2026-11-10 update.
6. **Quote spot-checks,** since all quotes passed through the fetch tool's summariser.
7. **Real Google rankings** for the six queries.

## Sources

### Opened and used

**GummySearch:** https://gummysearch.com/ ; https://gummysearch.com/docs/articles/gummysearch-is-now-closed-6533h ; https://gummysearch.com/closing-time/ ; https://gummysearch.com/final-chapter/ ; https://gummysearch.com/gummysearch-alternatives/

**Reddit closure and access:** https://www.heise.de/en/news/Reddit-to-shut-down-RSS-feeds-and-public-API-11473400.html ; https://www.techrepublic.com/article/news-reddit-rss-public-api-shutdown/ ; https://decrypt.co/379892/reddit-killing-rss-feeds-public-api-access-ai-scrapers ; https://www.how2shout.com/news/reddit-rss-public-api-shutdown-dates.html ; https://dev.to/tonywangca/why-reddit-blocked-unauthenticated-json-in-2026-and-how-to-still-get-reddit-data-58b9 ; https://github.com/kellyaa/agent-newsletter/issues/328 ; https://prowlo.com/blog/reddit-data-api ; https://karmatools.xyz/blog/reddit-api-licensing/ ; https://www.beri.net/article/reddit-public-api-shutdown-march-2027-social-listening-ai-data-license-deadlines

**Reddit Pro and partners:** https://techcrunch.com/2025/01/07/reddit-intros-new-trends-tools-for-businesses-and-an-ama-ad-format/ ; https://www.practicalecommerce.com/seo-wins-from-reddit-pro ; https://www.socialmediatoday.com/news/reddit-adds-mobile-trend-insights-comment-performance-data/758703/ ; https://www.britopian.com/data/reddit-pro-analytics/ ; https://dataconomy.com/?p=72820 ; https://brandmentions.com/blog/best-social-listening-tools-reddit/ ; https://www.brandwatch.com/blog/subreddit-analytics-tools/ ; https://www.meltwater.com/en/press-releases/reddit-partnership ; https://www.tipranks.com/news/the-fly/sprinklr-reddit-expand-strategic-partnership ; https://sproutsocial.com/insights/press/sprout-social-expands-reddit-partnership/ ; https://sproutsocial.com/pricing/ ; https://www.thesilab.com/resource/how-to-do-social-listening-with-reddit-data

**Replacement vendors:** https://buzzabout.ai/ ; https://buzzabout.ai/pricing ; https://tryadlicio.com/ ; https://painonsocial.com/ ; https://painonsocial.com/pricing ; https://www.ideafast.pro/ ; https://panegains.com/ ; https://panegains.com/pricing ; https://reddinbox.com/ ; https://reddinbox.com/pricing ; https://karmit.co/ ; https://alternativeto.net/software/karmit/about ; https://www.subredditsignals.com/ ; https://www.subredditsignals.com/pricing ; https://trend-seeker.app/ ; https://trend-seeker.app/pricing ; https://chromewebstore.google.com/detail/peekdit/fbeefacphficbmanencnmnjmicppefgh ; https://alternativeto.net/software/peekdit/about ; https://www.redditapis.com/gummysearch-alternative

**User voice:** https://hn.algolia.com/api/v1/search?query=gummysearch&hitsPerPage=30 ; https://news.ycombinator.com/item?id=45844269 ; https://news.ycombinator.com/item?id=49237225 ; https://medium.com/@vivaciousquestventuresandvisio/gummysearch-is-dead-heres-what-nobody-s-telling-you-about-the-alternatives-861061a543c5 ; https://syncsuptech.substack.com/p/gummysearch-shuts-down ; https://dev.to/wubingwx/gummysearch-shut-down-here-are-the-reddit-research-alternatives-for-indie-hackers-2akc ; https://newsletter.failory.com/p/when-reddit-pulls-over

**TrackReddit:** https://trackreddit.com/ ; https://trackreddit.com/tracking-php/ ; https://rdap.verisign.com/com/v1/domain/trackreddit.com ; https://archive.org/wayback/available?url=trackreddit.com&timestamp=2019 ; https://hn.algolia.com/api/v1/search?query=trackreddit&hitsPerPage=30 ; https://news.ycombinator.com/item?id=8028890 ; https://news.ycombinator.com/item?id=8036623 ; https://news.ycombinator.com/item?id=13709068 ; https://www.producthunt.com/posts/trackreddit ; https://www.producthunt.com/products/trackreddit ; https://www.producthunt.com/products/trackreddit/makers ; https://www.producthunt.com/products/trackreddit/alternatives ; https://thebetterwebmovement.com/trackreddit-a-robust-reddit-monitoring-tool/ ; https://startupresources.io/resource/trackreddit/ ; https://phoenix.startups-list.com/startups/trackreddit ; https://syften.com/reddit ; https://www.replyagent.ai/blog/best-brand-monitoring-tools-track-reddit-mentions ; https://painonsocial.com/blog/reddit-monitoring-tools ; https://painonsocial.com/blog/reddit-monitoring-platforms ; https://www.blaze.ai/blog/reddit-marketing-tools ; https://www.zoho.com/social/journal/marketing-on-reddit-an-essential-guide-for-brands.html ; https://dev.to/short_playskits_ab152535/a-practical-guide-to-reddit-keyword-monitoring-for-founders-and-growth-operators-2afi ; https://mythos.one/me/brianswichkow/c7d691 ; https://trackdit.com/ ; https://www.producthunt.com/posts/trackdit

**SERP pages:** every URL listed under 3.1 to 3.6, except those marked as not read.

**Data:** https://arxiv.org/html/2411.05328 ; https://arxiv.org/html/2609.14575 ; https://arxiv.org/abs/1606.06140 ; https://evanmiller.org/how-not-to-sort-by-average-rating.html ; https://singlelunch.com/2019/09/17/a-decade-later-reddits-comment-sorting-still-fails-to-do-its-job/ ; https://www.scottgraffius.com/blog/files/lifespan-halflife-of-social-media-posts-update-2026.html ; https://www.scottgraffius.com/blog/files/lifespan-halflife-of-social-media-posts-update-for-2025.html ; https://leadmore.ai/blog/f5bot-review ; https://www.redditalert.com/blog/reddit-keyword-alerts-redditalert-vs-f5bot ; https://www.relato.com/blog/best-reddit-monitoring-tools/ ; https://www.brandjet.ai/blog/reddit-community-mention-alerts/ ; https://makerstack.co/reviews/f5bot-review/ ; https://f5bot.com/ ; https://f5bot.com/tiers ; https://syften.com/pricing

### Tried and could not read

| Page | Result |
|---|---|
| reddit.com, r/trackreddit, business.reddit.com/pro, redditinc.com, redditblog.com (redirects to redditinc.com) | Refused by fetch tool |
| web.archive.org snapshots and CDX | Refused by fetch tool. Availability API used instead |
| archive.ph | Refused by fetch tool |
| crunchbase.com/organization/trackreddit | HTTP 403 |
| x.com/trackreddit | HTTP 402 |
| tracxn.com TrackReddit profile, bigideasdb.com pages | HTTP 429 on every attempt |
| peekdit.com, peekdit.com/pricing | HTTP 404 |
| www.peekdit.com | Expired certificate |
| thegigabrain.com | Certificate error |
| linkeddit.com/reddit-monitoring | HTTP 410 |
| searchengineland.com Reddit Pro article | HTTP 403 |
| alternativeto.net/software/trackreddit/ | HTTP 404 |
| notifier.so/docs/?p=698 and /blog/?p=698 | Opened, but showed unrelated content, not the TrackReddit claim in the search snippet |
| phoenix.startups-list.com/people/ | HTTP 404 |
| addons.mozilla.org Reddit Tracker | Error page |
| dev.to/devtoolpicks post from search results | HTTP 404 |
| producthunt.com/products/gummysearch/reviews | HTTP 404 |
| arXiv PDFs for 2411.05328 and 2609.14575 | Unreadable as PDF. HTML versions used |
