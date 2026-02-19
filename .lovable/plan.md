

# Sort Leads: Best + Newest First

## Change
Update the leads query in `LeadsSection.tsx` to sort by **intent score descending** (best first), then by **discovered date descending** (newest first among same-quality leads). This ensures hot leads always surface at the top, and within each intent tier, the freshest leads appear first.

## Technical Details

### File Modified: `src/components/scanner/LeadsSection.tsx`

Change the query's `.order()` from single-column to dual-column sort:

```typescript
// Before
.order('intent_score', { ascending: false });

// After
.order('intent_score', { ascending: false })
.order('discovered_at', { ascending: false });
```

This is a one-line addition. No database or schema changes needed.

