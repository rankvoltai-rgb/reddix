

# Unique Copy for Auth Page Lead Preview Cards

## Change

Update the three `LeadPreviewCard` components in `src/pages/Auth.tsx` so each displays different, unique copy instead of the same repeated content.

## Current State

All three cards show identical text:
- **Title**: "Any Affordable reddit post monitoring tool? : r/microsaas"
- **Body**: "I know that there are lots monitoring sites but they are kinda expensive for me so I'm looking for an affordable option to get alerts by tracking the..."

## New Copy (matching character counts)

**Card 1** (keep original):
- Title: "Any Affordable reddit post monitoring tool? : r/microsaas"
- Body: "I know that there are lots monitoring sites but they are kinda expensive for me so I'm looking for an affordable option to get alerts by tracking the..."
- Subreddit: r/microsaas | Score: 95 | Hot

**Card 2** (new):
- Title: "Best way to find potential customers on Reddit? : r/startups"
- Body: "I've been trying to manually search Reddit for people who might need my product but it takes forever. Is there a smarter way to automate finding..."
- Subreddit: r/startups | Score: 88 | Warm

**Card 3** (new):
- Title: "How do you monitor brand mentions across subreddits? : r/SaaS"
- Body: "We recently launched our product and want to track when people mention problems we solve. Currently checking manually every day but it's not scalab..."
- Subreddit: r/SaaS | Score: 91 | Hot

## Technical Approach

- Convert `LeadPreviewCard` to accept props for title, body, subreddit, score, and intent label
- Pass unique content to each of the three card instances
- No design/layout changes

## File Modified

- `src/pages/Auth.tsx`

