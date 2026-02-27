/**
 * AuthorizedRoute — Route guard using 4-layer authorization.
 * Checks authentication first, then authorization.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthorization } from "@/contexts/AuthorizationContext";
import type { PermissionAction, PermissionResource, PermissionScope } from "@/core/security/authorization/types";
import { ROUTE_ACCESS_RULES } from "@/core/security/authorization/defaults";

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

  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If explicit resource/action provided, check that
  if (resource && action) {
    if (!canDo(resource, action, scope)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // Otherwise, find matching route rule
  const matchingRule = ROUTE_ACCESS_RULES.find((rule) => {
    if (rule.path === location.pathname) return true;
    // Prefix match for parameterized routes
    if (location.pathname.startsWith(rule.path + "/")) return true;
    // Special: /seat/:seatKey matches /seat
    if (rule.path === "/seat" && location.pathname.startsWith("/seat/")) return true;
    return false;
  });

  // No rule found → allow (page exists but no restriction defined)
  if (!matchingRule) {
    return <>{children}</>;
  }

  if (!canRoute(matchingRule)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
