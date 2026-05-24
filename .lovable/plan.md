## Goal
Add pagination to the Discovered Leads list on `/scanner` with a page-size selector (15, 25, 50). One lead per row (current layout).

## Changes
**`src/components/scanner/LeadsSection.tsx`**
- Add state `pageSize` (default 15) and `currentPage` (default 1).
- Reset `currentPage` to 1 when `activeFilter` or `pageSize` changes.
- Derive `pagedLeads = filteredLeads.slice((page-1)*pageSize, page*pageSize)`; render those instead of all `filteredLeads`.
- Below the list, render a footer row with:
  - Left: "Showing X–Y of Z" text.
  - Right: page-size `Select` (15 / 25 / 50) + `Pagination` (Prev, page numbers with ellipsis, Next) from `@/components/ui/pagination` and `@/components/ui/select`.
- Hide footer when `filteredLeads.length <= 15` AND pageSize is 15 (nothing to paginate).

No backend, schema, or LeadCard changes.
