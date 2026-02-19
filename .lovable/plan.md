

# Scanner Power-Ups: Advanced but Effortless

## The Insight
The Scanner finds leads well, but once they arrive, users face a flat, unfiltered wall of cards. The bottleneck has shifted from **discovery** to **triage**. These five changes make triage instant while keeping the UI dead simple.

## Changes

### 1. Intent Filter Tabs on Leads Section
Replace the static "Discovered Leads" header with horizontal filter tabs: **All | Hot | Warm | Research | Low** -- each showing a live count badge (e.g. "Hot (3)"). Clicking a tab instantly filters. Default view: "Hot" if any exist, otherwise "All". This puts the highest-value leads one click away instead of buried in a scroll.

- File: `src/components/scanner/LeadsSection.tsx`
- Add `activeFilter` state, count leads per intent level, render tab row, filter displayed leads

### 2. Dismiss Leads Inline
Add a subtle X (dismiss) button on each LeadCard. Clicking it sets the lead status to `archived`, removing it from the scanner view (archived leads are already excluded from the Leads/CRM page by default -- they only show if filtered). This lets users clean noise without leaving the scanner.

- File: `src/components/scanner/LeadCard.tsx` -- add `onDismiss` prop and X button
- File: `src/components/scanner/LeadsSection.tsx` -- add dismiss handler, filter out archived leads from display

### 3. "Copy and Go" One-Click Action in ReplyDialog
Currently the reply workflow is: Copy Reply, then Open Reddit Post (two clicks). Add a single "Copy and Go" primary button that copies the reply to clipboard AND opens the Reddit thread in one action. Keep the individual buttons for flexibility, but make the combined action prominent.

- File: `src/components/scanner/ReplyDialog.tsx` -- add combined button in footer

### 4. Product Context Pill
Add a small pill/badge below the command bar showing "Scanning for: [Product Name]" with a link to Settings to update product info. This gives users confidence the AI knows what it's looking for, and a quick path to update context if their product evolves.

- File: `src/pages/Scanner.tsx` -- add context pill between command bar and config strip, reading from `profile.product_name`

### 5. Realtime Lead Counter
Subscribe to the `leads` table via realtime so when auto-pilot scans find new leads in the background, the lead count updates live without requiring a page refresh. Show a subtle "N new leads" toast or badge when new ones arrive.

- Database: enable realtime on `leads` table (migration)
- File: `src/components/scanner/LeadsSection.tsx` -- add Supabase realtime subscription, auto-refetch on INSERT events

---

## Technical Details

### Database Migration
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
```

### Files Modified
- **src/components/scanner/LeadsSection.tsx** -- Intent filter tabs with counts, dismiss handler, realtime subscription
- **src/components/scanner/LeadCard.tsx** -- Add `onDismiss` prop and dismiss (X) button
- **src/components/scanner/ReplyDialog.tsx** -- Add "Copy and Go" combined action button
- **src/pages/Scanner.tsx** -- Add product context pill

### No New Files or Tables
All changes use existing data structures. Dismiss uses the existing `archived` status on the leads table. Realtime uses native capabilities.

