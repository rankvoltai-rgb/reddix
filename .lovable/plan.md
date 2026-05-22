## Dashboard UX Tightening Plan

Keep the existing structure and brand (red, Instrument Serif headings, glassmorphism). Refine spacing, hierarchy, and make **Recent Leads** the visual anchor. No business logic changes — `src/pages/Dashboard.tsx` only.

### 1. Header band (tighter, more useful)
- Replace the plain `text-3xl` welcome with a serif `Instrument Serif` headline ("Welcome back, {name}") + small muted sub.
- Move "Last scan" pill inline to the right of the headline on desktop, with a small green pulse dot when recent (<1h).
- Add a single primary `Scan Now` button (anchored top-right) and a ghost `View All Leads` next to it. Header height drops ~30%.

### 2. Stats strip (demoted, refined)
- Convert 4-card grid into a single horizontal `rounded-2xl` glass strip with 4 cells separated by hairline dividers (no per-card borders).
- Smaller numerals (`text-2xl`), icon left of value, label below — tighter footprint so the leads feed dominates.
- Keep AnimatedCounter, keep stagger fade-in.

### 3. Recent Leads (new visual anchor)
- Promote to a larger `rounded-2xl` glass panel directly under the stats strip.
- Header: serif "Recent Leads" + small count chip ("12 today") + `View all →` ghost link.
- Each row becomes a richer card:
  - Left: intent dot (red/amber/blue/gray) + thread title (serif-ish weight, 2-line clamp).
  - Sub-row: `r/subreddit` chip · time ago · short relevance snippet (italic Playfair) when present.
  - Right: intent badge + hover-reveal `Open ↗` and `Reply` ghost buttons.
- Increase row padding, subtle hover lift (`translate-y-[-1px]`, ring-1 ring-primary/10).
- Show up to 6 (was implicit smaller); empty rows collapse cleanly.

### 4. Badges section
- Wrap in a collapsible `<details>`-style section ("Achievements") below leads, default expanded, smaller header so it doesn't compete with leads.

### 5. Empty / setup states
- Keep the two empty-state cards but slim padding (`p-10` instead of `p-14`), serif headline, and add a secondary ghost link ("Learn how scanning works" → docs/glossary).

### 6. Layout polish
- Page max-width to `max-w-6xl` (was wider via DashboardLayout default) centered.
- Vertical rhythm: `space-y-6` between major blocks (was `mb-10`).
- Add subtle top radial red glow behind header (matches Scanner hero) for visual continuity.

### Files touched
- `src/pages/Dashboard.tsx` — full presentational refactor, same hooks/data/navigation.

### Out of scope
- No changes to `useDashboardStats`, routing, edge functions, or DB.
- No new components beyond inline JSX (BadgesSection stays as-is, just re-wrapped).
