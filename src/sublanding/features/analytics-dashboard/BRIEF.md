# /features/analytics-dashboard — brief

## The page's one job

Someone searched for a **reddit lead dashboard** (or "reddit analytics dashboard"). They want to know what they'll see after signing in, and whether it tracks their Reddit leads. The page describes the dashboard exactly as it is, says plainly what it doesn't do, and lets them drive a working replica. Then it asks them to start (`/auth`).

## Concept

**"A status board, honestly labelled."** The dashboard is a small screen: four counts, the last scan, the five newest leads and badges. The page doesn't inflate it into analytics. Instead it shows exactly what each number counts, and a sandbox makes the numbers move under the app's rules.

## Section plan

1. **Hero**: left-aligned copy with a numbered key; below it the replica in a browser window, with pins 1–6.
2. **The numbers**: a ledger table (figure / counts / includes / leaves out) that stacks on phones.
3. **Next step**: the three panel states side by side, each under the condition that shows it.
4. **Sandbox** (`#sandbox`): controls (add or remove subreddits, scan, wait, save, draft, dismiss, mark replied, reset) beside a live replica.
5. **Achievements**: five badges on one track.
6. **Limits**: five cells covering what the dashboard doesn't show.
7. **Questions**: numbered single column, 5 questions.
8. **Close**: split band with the CTA on soft red and related links.

## Truth (from the code, 2026-10-27)

- Counts: leads = all of the user's leads (any status); hot = intent_level hot (any status); replies ready = reply_drafts with is_posted false; subreddits = monitored_subreddits with is_active true: `src/hooks/useDashboardStats.tsx:29-56`.
- Nothing sets is_posted, and every generate or regenerate inserts a draft: `supabase/functions/generate-reply/index.ts:275-284`.
- Subreddits are added or removed (deleted), never paused: `src/pages/Scanner.tsx:127-167`.
- Recent leads: 5 newest by discovered_at: `useDashboardStats.tsx:61-71`; shown with level dot and badge, linking to the thread: `src/pages/Dashboard.tsx:218-257`.
- Last scan label with a green pulse within 60 minutes: `Dashboard.tsx:103-104, 130-136`.
- Panel states: no subreddits → setup; no leads → "Ready to find leads"; otherwise recent leads (the subreddit check comes first): `Dashboard.tsx:100-101, 187-203`.
- Badges at 1/10/25/50/100 leads with status engaged, computed from the current count: `src/hooks/useBadges.ts:13-42`.
- One scan per 5 minutes; a scan needs at least one subreddit: `scan-reddit/index.ts:14, 298-301, 315`.
- Queries load on open (staleTime 60s, no refetch on focus): `src/App.tsx` QueryClient.
- **Never said:** charts, trends, date filters, CSV export, conversion rates, engagement tracking, real-time updates, per-subreddit stats.

## How it differs from other pages

- **lead-scoring** covers the lead list and lifecycle; this page covers the summary screen and links there.
- Layout: left-aligned hero with a pin key over a window replica; ledger table; tri-panel states; sandbox; badge track; five-cell limits; numbered FAQ; split close.
