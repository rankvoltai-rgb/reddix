// Single source of truth for post-auth route gating.
// Keeps Index/Onboarding/Dashboard from disagreeing and bouncing the user
// between routes.

type RouteUser = { id: string } | null | undefined;
type RouteProfile = { onboarding_completed?: boolean | null } | null | undefined;

export type RouteDestination = '/auth' | '/onboarding' | '/dashboard' | null;

interface ResolveArgs {
  user: RouteUser;
  profile: RouteProfile;
  subscribed: boolean;
  authLoading: boolean;
  profileLoading: boolean;
  subLoading: boolean;
}

/**
 * Returns the canonical route the user should be on, or null when we should
 * stay put / still loading. Pages call this and only navigate if the result
 * differs from their current path.
 */
export function resolveDestination({
  user,
  profile,
  subscribed,
  authLoading,
  profileLoading,
  subLoading,
}: ResolveArgs): RouteDestination {
  if (authLoading) return null;
  if (!user) return '/auth';

  // Profile / subscription still loading — don't make a routing decision yet.
  if (profileLoading || subLoading) return null;
  if (!profile) return null;

  if (!profile.onboarding_completed) return '/onboarding';

  // Onboarding done — always send to /dashboard. The dashboard owns the
  // hard-paywall overlay for unsubscribed users. We must NEVER bounce a
  // user with onboarding_completed=true back into the wizard, because
  // transient subscription-check failures would re-open onboarding.
  return '/dashboard';
}

/** Navigate only if we're not already on the target route. */
export function safeNavigate(
  currentPath: string,
  target: RouteDestination,
  navigate: (to: string, opts?: { replace?: boolean }) => void,
) {
  if (!target) return;
  if (currentPath === target) return;
  navigate(target, { replace: true });
}
