# How Reddix blog posts are written

Every post on reddix.info/blog follows one blueprint, so readers can skim it and answer engines (Google AI Overviews, ChatGPT, Perplexity, Claude) can lift a clean passage out of it. It is the same article blueprint Rankbox uses, adapted to Reddix.

A post isn't done until `npm run blog:check -- <slug>` passes: a score of 90 or more and no blueprint failures.

## 1. Pick the query

Every post targets one search query, the `keyword`. Write it down before anything else.

- Use the words people type: "how to find customers on reddit", not "Reddit-based customer acquisition".
- One query per post. If a second query needs its own answer, it gets its own post and the two link to each other.
- Check that no live post already targets it (`ls src/content/blog`).

## 2. Research the live web

Before drafting, search the query and read the top results.

1. Read the top 10 results. From the top 5, note the headings they use and what each covers.
2. Find the gaps: what none of them answers, gets wrong, or leaves vague. The post must cover what they cover **and** at least one thing they miss.
3. Collect sources: official docs (Reddit's help center and rules, subreddit wikis), studies with real numbers, and reputable publications. Prefer primary sources.
4. **Open every link you cite** and confirm it says what you claim. Never cite a page you haven't read. Never invent a statistic, quote, study or URL.

## 3. Write to the blueprint

| Part | What it must be |
| --- | --- |
| Title (H1) | Under 60 characters, contains the keyword. It lives in the frontmatter, not the body. |
| Introduction | 150–200 words. The **first paragraph is the answer**: 2–3 sentences, under 80 words, quotable on its own, containing the keyword. |
| Key Takeaways | `## Key Takeaways` right after the intro, 5–7 bullets, each a complete fact. |
| Structure | At least 15 headings overall: `##` sections (H2) with `###` (H3) and `####` where useful, in a logical order. |
| Sections | 300–500 words per H2, with concrete examples, numbers or steps, and at least one insight the top results miss. |
| Lists | At least two bulleted or numbered lists, plus a comparison table or step-by-step section where it fits. |
| Conclusion | 200–250 words that end with a call to action. |
| FAQ | `## Frequently Asked Questions` with **exactly 5** `###` questions ending in `?`, each answered in 2–4 sentences. End the section with one line that invites the reader to reply, ending in `?`. |
| References | `## References`, a numbered list of every source cited, as `[Title, Publisher](url)`. At least 3. |
| Citations | Link sources inline where the claim is made. |
| Keywords | The keyword at 0.5–2.5% density (aim for 1–2%), plus 10–15 natural long-tail variations. |
| Style | Short paragraphs (2–4 sentences), plain words, bold for key phrases, Flesch readability 55+. |
| Meta description | The frontmatter `description`: 120–160 characters, contains the keyword. |
| Length | Aim for about 2,500 words. The depth check passes at 1,500. |

### Voice

- Write like a founder who has done this, talking to another founder. Direct, specific, no hype.
- Lead with the answer, then the reasoning. Cut throat-clearing ("In today's fast-paced world…").
- Prefer numbers and examples to adjectives. "Reply within the first hour" beats "reply quickly".
- Reddit culture matters: never advise spam, vote manipulation, fake accounts or hiding affiliation. Posts must hold up if a moderator reads them.

### Reddix in a post

Mention Reddix where it genuinely helps the reader, usually once in the body and once in the conclusion. Never make the post an ad. **Only state what the product does today:**

- Reddix runs **on-demand scans**: you start a scan, it pulls fresh threads from the subreddits you monitor and scores each post's buying intent 0–100 (hot, warm, research, low).
- It suggests relevant subreddits from your product profile, which it builds by analyzing your website.
- It drafts reply variants for you to review, edit and post yourself from your own account. **Reddix never posts for you.**
- Saved leads live in a lead CRM with statuses and notes.
- Pricing: $45/month Premium or $150 one-time Lifetime. Link to `/#pricing` rather than repeating prices.
- **Do not** claim autopilot, scheduled or 24/7 background scanning, auto-posting, or results numbers. Those aren't live.

### Internal links

Link 3–6 relevant Reddix pages where they help. Use root-relative paths:

- Features: `/features/intent-detection`, `/features/lead-scoring`, `/features/ai-replies`, `/features/subreddit-discovery`, `/features/website-analysis`, `/features/deduplication`, `/features/natural-tone`, `/features/analytics-dashboard`
- Use cases: `/use-cases/saas-founders`, `/use-cases/marketing-agencies`, `/use-cases/solopreneurs`, `/use-cases/developer-tools`, `/use-cases/ecommerce`, `/use-cases/b2b-sales`, `/use-cases/content-marketers`, `/use-cases/startup-growth`
- Glossary terms: `/glossary/<slug>` (see `src/lib/glossary.ts` for slugs)
- Comparisons: `/alternatives`, `/alternatives/<slug>` (see `src/lib/alternatives.ts`)
- Other posts: `/blog/<slug>`

## 4. The file

Posts live in `src/content/blog/<slug>.md`. The file name is the URL: `src/content/blog/find-customers-on-reddit.md` is `reddix.info/blog/find-customers-on-reddit`. Keep slugs short, lowercase and hyphenated, built from the keyword.

```markdown
---
title: How to Find Customers on Reddit Without Getting Banned
description: A 120–160 character summary with the keyword, written for the search result.
keyword: find customers on reddit
date: 2026-10-27
updated: 2026-10-27
author: Reddix Team
tags: Lead Generation, Playbooks
featured: false
---

The direct answer, in 2–3 sentences…

More intro…

## Key Takeaways

- …
```

| Field | Notes |
| --- | --- |
| `title` | Under 60 characters, with the keyword. |
| `description` | 120–160 characters. Used as the meta description, the subtitle and the card excerpt. |
| `keyword` | The one query the post targets. |
| `date` | Publish date, `YYYY-MM-DD`. A future date schedules the post (see below). |
| `updated` | Change it when you revise the post substantively. |
| `author` | `Reddix Team` unless a named person wrote it. |
| `tags` | 1–4, from: Reddit Marketing, Lead Generation, Playbooks, Community Rules, Tools. The first is the post's topic. |
| `featured` | `true` pins the post as the blog's lead story. Only one at a time. |
| `cover` | Optional image path in `public/` (e.g. `/blog/my-post.webp`). Without one, a cover is generated from the title. |

### Markdown you can use

- `##`, `###`, `####` headings. Don't use `#`: the title is the page's only H1.
- Tables, bulleted and numbered lists, code blocks, `> quotes`.
- Callouts: start a quote with `[!TIP]`, `[!NOTE]`, `[!WARNING]` or `[!IMPORTANT]`.
- Images: put files in `public/blog/` and write `![alt text](/blog/file.webp "caption")`.

## 5. Check it, preview it, publish it

1. `npx tsx scripts/og/render.ts` to create the post's social preview image (`public/og/blog/<slug>.jpg`). It needs Google Chrome; Lovable's build can't run it, so the image is committed with the post.
2. `npm run blog:check -- <slug>` and fix everything it flags until it passes.
3. Preview at `http://localhost:8080/blog/<slug>` on the dev server (`npx vite`).
4. Commit and push to `main`. Lovable builds the site, and the build adds the post to `sitemap.xml`, `rss.xml` and `llms.txt` and prerenders its HTML for crawlers.

### Scheduling

A post with a future `date` is hidden from the blog, the sitemap and the feed until that day; the dev server shows it so you can review it. The site is built when you push, so a scheduled post appears at the first build on or after its date. Push (or trigger a Lovable rebuild) on the day.
