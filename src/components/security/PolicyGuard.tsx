/**
 * PolicyGuard — Conditionally renders children based on policy check.
 * Shows nothing or a fallback when access is denied.
 */

import { useSecurityPolicy } from "@/hooks/useSecurityPolicy";
import type { PolicyAction, ResourceType } from "@/core/security/policy/types";
import type { ReactNode } from "react";

interface PolicyGuardProps {
  action: PolicyAction;
  resourceType: ResourceType;
  resourceState?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PolicyGuard({
  action,
  resourceType,
  resourceState,
  children,
  fallback = null,
}: PolicyGuardProps) {
  const { checkPolicy } = useSecurityPolicy();
  const allowed = checkPolicy(action, resourceType, resourceState);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
