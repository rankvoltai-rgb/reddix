

# Scanner Page Simplification

## Problem
The current Scanner page has **9 distinct visual sections** stacked vertically: header, auto-pilot card, 4 stat cards, scan results banner, collapsible config panel (2 cards), subreddit discovery, scan history, and leads. This creates cognitive overload -- users scroll past noise to reach the only thing that matters: **leads**.

## Design Philosophy
One primary action surface. Leads front and center. Everything else is supporting context, not a section.

## Changes

### 1. Unified Command Bar (replaces header + auto-pilot card + scan results)
A single horizontal bar at the top containing:
- "Scan Now" button (primary action)
- Auto-pilot toggle (compact, inline -- just a switch + label)
- Last scan time + next scan countdown (small text)
- Subreddit/keyword count as subtle context ("4 subs, 12 topics")

This collapses 3 sections into one slim row.

### 2. Remove Quick Stats Grid
The 4 stat cards (Total Leads, Hot Leads, Recent Scans, Posts Analyzed) duplicate information already visible in the leads list and scan history. Remove entirely. The scan result feedback becomes a temporary toast notification instead of a persistent card.

### 3. Always-Visible Compact Config (replaces collapsible config + discovery)
Instead of a hidden config panel with two large cards, show a single compact section below the command bar:
- Two rows of tag-style badges for subreddits and keywords with inline add inputs
- "Discover" button for AI subreddit discovery opens as a dialog instead of an inline card
- No card wrappers -- just clean inline elements with subtle separators

### 4. Remove Scan History Section
Low-value section. Last scan info is in the command bar. Historical data belongs on a dedicated analytics page, not the scanner workflow.

### 5. Leads as Hero Section (unchanged structure, cleaner container)
LeadsSection stays as-is but becomes the dominant visual element with no competing sections above.

---

## Technical Details

### Files Modified
- **src/pages/Scanner.tsx** -- Major rewrite: remove stat cards, scan history query, scan result card, auto-pilot card. Build unified command bar. Inline config with compact layout. Move SubredditDiscovery into a Dialog.
- **src/components/scanner/SubredditDiscovery.tsx** -- Wrap content to work inside a Dialog (pass open/onOpenChange props or use internal trigger).

### Files Unchanged
- LeadCard.tsx, LeadsSection.tsx, ReplyDialog.tsx -- no changes needed

### Removed Elements
- 4x stat Card grid (lines 364-426)
- Scan results Card (lines 428-447)
- Auto-pilot status Card (lines 317-362)  
- Scan history Card + query (lines 89-103, 625-661)
- Empty state Card for unconfigured state (lines 597-614)

### New Structure (top to bottom)
1. **Command bar** -- single flex row with scan button, auto-pilot switch, timing info, config counts
2. **Config strip** -- two compact rows: subreddits as badges + input, keywords as badges + input, discover button
3. **LeadsSection** -- full width, the hero

### State Simplification
- Remove `scanResult` state -- use toast notifications instead
- Remove `showConfig` state -- config is always visible in compact form
- Remove `countdown` timer logic -- simplify to just showing "Next: Xh Ym" text from `next_scheduled_scan_at`
- Remove `scanHistory` query entirely

Page drops from ~670 lines to ~350 lines.

