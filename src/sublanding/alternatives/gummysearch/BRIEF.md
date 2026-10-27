# /alternatives/gummysearch: brief

## Job

Someone searched **gummysearch alternative**. They're a current or former GummySearch user, and the clock is running: GummySearch deletes all user data on 2026-12-01. They need to know what to save before then, whether Reddix replaces what they used, and what it costs. The page helps them save their setup first and pitches Reddix second.

## Concept

**A migration page with a deadline.** The hero is centred over a full-width shutdown clock (days left, and a rail from the closure date to the deletion date) computed from today's date. Next comes the vendor's phased timeline, with today's phase marked, and a five-step export checklist with a deadline-aware status panel (saved in localStorage). After that, a feature-by-feature mapping with a filter that shows what Reddix doesn't cover, old and new prices, and who should move versus who should find a research tool.

## Sections

1. Hero + shutdown clock
2. What GummySearch has said will happen, and when (3 phases, current marked)
3. Five things to save while you still can (interactive checklist; status panel reads date + ticks)
4. GummySearch features against Reddix (filterable: covered / partly / not)
5. Prices, then and now
6. Move to Reddix, or look elsewhere
7. FAQ (5, numbered rows), Sources, closing CTA (ink band)

## Truth

GummySearch (RESEARCH.md):
- §1: closed to new users 2025-11-30; full shutdown and deletion of all user data 2026-12-01; paid users keep access to the end of their billing period; lifetime-deal access ends 2026-11-30; free users can only view, download or delete data. [2][3]
- §1: stated reason is no commercial licence for Reddit's Data API [2]; the founder's post says it is complying with Reddit's API policies [3].
- §3, §5: audiences, themes (Pain Points, Solution Requests, Money Talk, Hot Discussions, Seeking Alternatives), conversation search across one audience or all of Reddit, tracked keywords [4]. Reply drafting is not described on its product page.
- §2: four homepage use cases, including idea validation and content ideas [1].
- §4: historical tiers $0 / $29 / $59 / $199 a month; annual and day-pass prices not captured [5].
- §8: its own alternatives page discloses affiliate links [6].

Reddix (../reddix.ts): pricing, no free plan, Reddit only, on-demand scans, no alerts, the 0–100 score with competitor and "alternative to" points, three drafts, never posts.

Not used: the 140,000-user figure (not needed, and it's the vendor's own number); any claim about how other tools get Reddit data.

## How it differs from the other two former-user pages

- **catchintent:** the product changed rather than shut down. Left-set hero with a before/after diptych; the interactive piece is a changelog date explorer.
- **linkeddit:** an undated, unannounced pivot. Split hero with an HTTP response log; the interactive piece is an archive-snapshot stepper.
- This page alone has a deadline, so it's built around the date and a to-do list.
