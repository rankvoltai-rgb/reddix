# Reddar: research notes

Checked: 2026-10-27

## 1. Exists / status

- **Official URL (as listed):** https://reddar.io/. Both Product Hunt [3] and the AIPURE directory [1][2] link to it.
- **Status: unverifiable / site unreachable today.** On 2026-10-27 both `reddar.io` and `www.reddar.io` failed DNS lookup (ENOTFOUND) [4][5]. I found no shutdown announcement, so I can't give a shutdown date. The product may be discontinued, or this may be a temporary DNS or domain problem. **Uncertain.**
- **It was a real Reddit product.** The Product Hunt listing exists, with tagline "Target high-intent Reddit posts for your product". The page says "Launched in 2026" and showed "Launched 9mo ago" when fetched, so roughly early 2026, which is my estimate. The maker is Bruno (@skedio) [3]. The AIPURE listing was last updated Feb 8, 2026 [1][2].
- **Namesakes, not this product (from search results, not opened):** a "REDDAR" blood-donation app on Google Play and the App Store, a GitHub repo `HuimingJia/Reddar` (an Elasticsearch-based Reddit retrieval system, an academic or personal project), and a GitHub promo site for a blood-donation app. Also distinct: "ReddRadar", "RedRadar", "RedditRadar" (redditradarai.com) and "LeadRadar".

**Caveat for everything below:** I could not open reddar.io, so sections 2–8 rely on Product Hunt (including the maker's own comment) and on AIPURE. AIPURE is a third-party AI-tool directory and may paraphrase or auto-generate its entries. Treat the AIPURE details as **unverified secondhand data**.

## 2. What it is

Reddar is an AI tool for founders and small businesses that want customers from Reddit. It watches Reddit for posts where people show buying intent around a product's category, scores them, and sends alerts so the team can join the conversation by hand. Product Hunt also pitches it as a way to show up in competitor search results and earn mentions in AI search answers [3].

## 3. How it works

- **Data sources / platforms:** Reddit only, as far as the sources show. AIPURE says it scans "5M+ posts monthly". That number is unverified [2].
- **Setup:** add monitors by subreddit or by entering your website domain, then set keywords [2] (AIPURE).
- **Search vs alerts vs AI:** alert-driven monitoring. AIPURE lists real-time alerts by Slack, email or webhook with a claimed "5-minute alert speed", plus AI lead scoring on purchase intent, sentiment and business relevance [1][2]. Product Hunt says it uses AI to detect buying intent [3].
- **Drafts or posts replies:** it drafts but does not post. The maker wrote on Product Hunt that the AI suggests replies but users post manually, quote: "We deliberately don't automate posting to avoid spam flags." [3]. AIPURE also mentions reply templates and a "mark as contacted" status [2].
- **Reddit accounts:** not mentioned in any source I opened. Nothing suggests it sells or supplies accounts.
- **Pay-per-use:** none. AIPURE describes monthly subscriptions [2]. Product Hunt only says "Payment Required" [3].

## 4. Pricing (checked 2026-10-27)

**Not published on any official page I could open.** The official site doesn't resolve.

Third-party, unverified (AIPURE, last updated Feb 8, 2026) [2]:

| Tier | Price | Billing | Limits mentioned |
|---|---|---|---|
| Starter | $19 | per month | 14-day data history; limited monitored subreddits; monthly lead caps |
| Growth | $39 | per month | not specified |
| Professional | $79 | per month | not specified |

- Free plan or trial: not mentioned by AIPURE [2]. Product Hunt says "Payment Required" [3].

## 5. Notable features

- AI detection of buying intent in Reddit posts: https://www.producthunt.com/products/reddar
- AI-suggested replies that the user posts manually, with no auto-posting by design: https://www.producthunt.com/products/reddar
- Positioning around competitor search results and AI-search mentions: https://www.producthunt.com/products/reddar
- Intent-aware keyword rules and AI lead scoring (unverified, third-party): https://aipure.ai/products/reddar
- Alerts by Slack, email or webhook, claimed 5-minute speed (unverified, third-party): https://aipure.ai/products/reddar
- Competitor and brand mention tracking (unverified, third-party): https://aipure.ai/products/reddar
- Reply templates and "mark as contacted" lead tracking (unverified, third-party): https://aipure.ai/products/reddar

## 6. Where it's stronger than a competitor might be

- **Low entry price:** the reported $19/month Starter tier is cheap for AI-scored Reddit alerts. This is unverified [2].
- **Spam-conscious design:** the maker says posting is deliberately manual, which keeps users' accounts away from automation risk [3].
- **Several alert channels**, including a webhook that can feed CRMs or custom workflows [2] (unverified).
- **Two ways to start:** from a domain as well as from subreddits and keywords, which lowers setup effort [2] (unverified).

## 7. Limits stated or evident from its own materials

- The official site was unreachable on 2026-10-27 [4][5]. That is the biggest practical limit.
- Starter tier: 14-day data history, limited monitored subreddits and monthly lead caps. These come from a third party [2].
- No auto-posting, by design [3].
- Product Hunt showed no reviews and about 17 followers / 15 upvotes [3], so there's little public validation.
- AIPURE's FAQ entries on alert speed, Reddit affiliation and ROI had blank answers [2]. The "300% average return within 90 days" claim has no source [2].
- Coverage of platforms other than Reddit: not mentioned in any source.

## 8. What a buyer comparing it to a Reddit lead-finding tool needs to know

- **Check that it's still running.** reddar.io did not resolve on 2026-10-27, and no announcement explains why.
- **Pricing can't be verified from the vendor.** The $19/$39/$79 tiers come from a directory, not from Reddar.
- **It's a monitor-and-draft tool, not an auto-poster.** You still write or approve replies and post them from your own account. That matches how most lead-finders work.
- **It covers Reddit only**, based on what the sources describe. If you also need X, Hacker News or LinkedIn, check other tools.
- **Little public proof.** No reviews on Product Hunt and a small launch.

## 9. Sources

1. https://aipure.ai/de/products/reddar → German AIPURE listing. Links to reddar.io (with a Product Hunt ref param). Gives $19/$39/$79 tiers, Slack/email/webhook alerts and a "last updated Feb 8, 2026" date.
2. https://aipure.ai/products/reddar → English AIPURE listing. Gives the tiers and Starter limits, the 7-step how-it-works, the features, the "5M+ posts monthly" claim, the unsourced 300% ROI claim and the blank FAQ answers. It does not mention a free trial.
3. https://www.producthunt.com/products/reddar → tagline, "Launched in 2026", maker Bruno (@skedio), website reddar.io, "Payment Required", no reviews, about 17 followers / 15 upvotes, and the maker's comment that posting is deliberately manual.
4. https://reddar.io → DNS lookup failed (ENOTFOUND) on 2026-10-27.
5. https://www.reddar.io/ → DNS lookup failed (ENOTFOUND) on 2026-10-27.

Not opened: archive.org snapshots (the fetch tool couldn't reach the domain).
