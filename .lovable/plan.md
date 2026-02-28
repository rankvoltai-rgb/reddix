

# Bug Audit and Fix Plan

After a thorough review of the entire codebase, here are the bugs found, ranked by severity:

---

## Bug 1 (CRITICAL) -- React Error #310 on Scanner Page

**File:** `src/pages/Scanner.tsx` (lines 99-129)

Two `useMutation` hooks (`addSubreddit`, `removeSubreddit`) are declared **after** the early return on line 90. React requires all hooks to be called in the same order every render -- calling them conditionally (after an early return) crashes the app with Error #310.

**Fix:** Move both `useMutation` declarations above the `if (authLoading || profileLoading || subLoading)` early return block, alongside the other hooks.

---

## Bug 2 (HIGH) -- Auth Page Always Redirects to /onboarding

**File:** `src/pages/Auth.tsx` (lines 92-96)

When a user is logged in, the effect unconditionally navigates to `/onboarding`, even if onboarding is already completed. This means a logged-in user visiting `/auth` gets bounced to onboarding instead of the dashboard.

**Fix:** Check `profile.onboarding_completed` and redirect to `/dashboard` if complete, `/onboarding` if not.

---

## Bug 3 (MEDIUM) -- Dashboard Welcome Uses Product Name Instead of User Name

**File:** `src/pages/Dashboard.tsx` (line 93)

The greeting says "Welcome back, {profile.product_name}" which would display something like "Welcome back, Reddix" instead of the user's name.

**Fix:** Use `profile.full_name` (which exists in the profiles table) and fall back gracefully.

---

## Bug 4 (LOW) -- Outdated Copyright Year

**File:** `src/pages/Index.tsx` (line 139)

Footer says "2024" but the current year is 2026.

**Fix:** Update to 2026 or use a dynamic year.

---

## Bug 5 (LOW) -- LeadsSection useEffect Missing Dependency

**File:** `src/components/scanner/LeadsSection.tsx` (line 114)

The auto-select "hot" filter `useEffect` references `activeFilter` but doesn't include it in its dependency array. This can cause stale closure bugs.

**Fix:** Add `activeFilter` to the dependency array.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/Scanner.tsx` | Move `useMutation` hooks before early return |
| `src/pages/Auth.tsx` | Fix redirect logic to check onboarding status |
| `src/pages/Dashboard.tsx` | Use `full_name` instead of `product_name` in greeting |
| `src/pages/Index.tsx` | Update copyright year to 2026 |
| `src/components/scanner/LeadsSection.tsx` | Add missing dependency to `useEffect` |

