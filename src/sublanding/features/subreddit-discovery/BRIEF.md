# /features/subreddit-discovery — brief

## The page's one job

Someone searching "find subreddits for my product" wants to know whether Reddix can pick the right communities and how much control they keep. The page shows how suggestions are made, how the list is shaped, and which of the subreddits a scan actually reads. Primary action: `/auth`.

## Concept

**"The list is a start; the scan reads three."** Hero: an editorial masthead over a three-tier map of example suggestions. Interactive: a scan planner that runs the scanner's real plan (rotation, searches, time windows) on a list the visitor edits.

## Section plan

1. Hero: masthead (H1 left, answer and CTA right), then the tier map (Primary / Secondary / Niche) for fictional Tallyfold.
2. Every suggestion comes with its reasons: an anatomy specimen with numbered markers, plus what discovery reads.
3. The list is yours to shape: three moments on a timeline rule.
4. Scan planner (interactive), `#planner`.
5. Four things to know before you add twenty: guideline sheet.
6. Questions: a two-up cell grid, with the last cell pointing to related pages.
7. Red close band.

## Truth (from the code, 2026-10-27)

- Discovery reads name, description, audience, value prop, features, competitors and pricing model; asks for the top 10; excludes monitored ones — discover-subreddits/index.ts:58-101. Fields per suggestion: relevance_score, reasoning, typical_intent_signals, estimated_activity (AI estimate), category.
- Setup saves the top 5, topped up from SaaS, Entrepreneur, smallbusiness, startups, marketing — OnboardingWizard.tsx:45, :69-108. Scanner repeats this if the list is empty — Scanner.tsx:99-138.
- Scanner: Discover dialog with Add, Add Primary, Add All — SubredditDiscovery.tsx; add by name and remove with × — Scanner.tsx:139-170, :373-412. No cap in code.
- Scan plan: active subs only, empty list fails — scan-reddit/index.ts:312-322. Rotation slot `floor(now/300000)`, shuffle, 3 subs, 2 "latest" + 1 combined + 1 Reddit-wide competitor search (first two competitors) + 3 per-sub, max 7, freshness rotates day/week/month — :358-391. `rotation.ts` mirrors this line for line; change both together.
- Search phrases cached 24h — :87-99.
- Not said: that the rotation is even. It isn't (see the known bug below). Also not said: verified member or post counts, scheduled scans, posting.

## Known bug (2026-10-27)

The shuffle in scan-reddit (:362-366) is heavily biased. Simulated over 288 slots, with 12 subreddits the first in the list is read in ~75% of scans and some in ~5%; with 5, the fifth gets ~31% versus ~75% for the first. The page only says which three "can change every 5 minutes". If the shuffle is fixed, update `rotation.ts`.

## How it differs

- From website-analysis: links to it for the profile and doesn't repeat it.
- From intent-detection: no scoring rubric; the planner is about where to search, not how posts score.
