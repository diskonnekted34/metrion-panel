/**
 * AuthorizedRoute — Route guard with DEFAULT-DENY policy.
 *
 * Security model:
 * 1. Unauthenticated → redirect to /login
 * 2. No matching route rule → DENY (redirect to landing)
 * 3. Matching rule but unauthorized → DENY (redirect to landing)
 * 4. Explicit resource/action override checked first
 *
 * This ensures new pages are inaccessible until a route rule is defined.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthorization } from "@/contexts/AuthorizationContext";
import type { PermissionAction, PermissionResource, PermissionScope } from "@/core/security/authorization/types";
import { ROUTE_ACCESS_RULES } from "@/core/security/authorization/defaults";
import PageLoading from "@/components/ui/PageLoading";

/** Fallback route when authorization fails */
const DENY_REDIRECT = "/";

interface AuthorizedRouteProps {
  children: React.ReactNode;
  /** Override permission check (if not using route rules) */
  resource?: PermissionResource;
  action?: PermissionAction;
  scope?: PermissionScope;
}

export function AuthorizedRoute({
  children,
  resource,
  action,
  scope,
}: AuthorizedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { can: canDo, canRoute } = useAuthorization();
  const location = useLocation();

  // ── Loading state: show skeleton instead of blank screen ──
  if (isLoading) {
    return <PageLoading label="Oturum doğrulanıyor…" rows={3} />;
  }

  // ── Authentication gate ──
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ── Explicit resource/action check (component-level override) ──
  if (resource && action) {
    if (!canDo(resource, action, scope)) {
      return <Navigate to={DENY_REDIRECT} replace />;
    }
    return <>{children}</>;
  }

  // ── Route-rule matching ──
  const matchingRule = ROUTE_ACCESS_RULES.find((rule) => {
    if (rule.path === location.pathname) return true;
    if (location.pathname.startsWith(rule.path + "/")) return true;
    if (rule.path === "/seat" && location.pathname.startsWith("/seat/")) return true;
    return false;
  });

  // ── DEFAULT-DENY: no rule defined → block access ──
  // If a protected route has no matching rule in ROUTE_ACCESS_RULES,
  // it is inaccessible. Add a rule to defaults.ts to grant access.
  if (!matchingRule) {
    if (import.meta.env.DEV) {
      console.warn(
        `[AuthorizedRoute] DEFAULT-DENY: No route rule found for "${location.pathname}". ` +
        `Add a rule to ROUTE_ACCESS_RULES in defaults.ts to grant access.`
      );
    }
    return <Navigate to={DENY_REDIRECT} replace />;
  }

  // ── Authorization check against matching rule ──
  if (!canRoute(matchingRule)) {
    return <Navigate to={DENY_REDIRECT} replace />;
  }

  return <>{children}</>;
}
