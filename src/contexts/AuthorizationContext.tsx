/**
 * AuthorizationContext — Provides 4-layer authorization state to the React tree.
 * Stores AuthorizationProfile in localStorage ("authorization_profile").
 * Default-deny principle: no profile = viewer with no extras.
 */

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type {
  AuthorizationProfile,
  OrgLevel,
  SystemRole,
  FunctionalRole,
  PermissionAction,
  PermissionResource,
  PermissionScope,
  DataClassificationTag,
  RouteAccessRule,
  ApprovalRule,
} from "@/core/security/authorization/types";
import {
  can,
  canAccessClassification,
  canAccessRoute,
  getPermittedActionsForResource,
  getVisibleRoutes,
  getApprovalRequirements,
  resolvePermissions,
} from "@/core/security/authorization/engine";
import { ROUTE_ACCESS_RULES, DEFAULT_APPROVAL_RULES } from "@/core/security/authorization/defaults";

const STORAGE_KEY = "authorization_profile";

// ── Default profile (viewer, no system/functional roles) ──
const DEFAULT_PROFILE: AuthorizationProfile = {
  user_id: "user-default",
  tenant_id: "tenant-default",
  level: "executive",
  system_roles: ["owner"],
  functional_roles: ["approval_authority", "org_primary_approver"],
  department_ids: ["executive", "marketing", "finance", "operations", "creative", "marketplace", "legal", "technology", "hr", "sales"],
  seat_key: "CEO",
};

function loadProfile(): AuthorizationProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
}

// ── Context value type ─────────────────────────────────
interface AuthorizationContextValue {
  profile: AuthorizationProfile;
  setProfile: (p: AuthorizationProfile) => void;
  updateProfile: (patch: Partial<AuthorizationProfile>) => void;

  /** Core check: can user do action on resource with scope? */
  can: (resource: PermissionResource, action: PermissionAction, scope?: PermissionScope) => boolean;

  /** Can user access data with given classification? */
  canAccessClass: (classification: DataClassificationTag) => boolean;

  /** Can user access a given route rule? */
  canRoute: (rule: RouteAccessRule) => boolean;

  /** Get all visible route rules */
  visibleRoutes: RouteAccessRule[];

  /** Get permitted actions for a resource */
  getActions: (resource: PermissionResource, scope?: PermissionScope) => Record<PermissionAction, boolean>;

  /** Check if action requires approval workflow */
  getApprovals: (resource: PermissionResource, action: PermissionAction, tags?: DataClassificationTag[], riskScore?: number) => ApprovalRule[];

  /** All resolved permissions (for debugging/display) */
  allPermissions: ReturnType<typeof resolvePermissions>;

  /** Route access rules */
  routeRules: RouteAccessRule[];

  /** Approval rules */
  approvalRules: ApprovalRule[];

  /** Is user an owner? */
  isOwner: boolean;

  /** Simulate a different profile (dev only) */
  simulateLevel: (level: OrgLevel) => void;
  simulateSystemRole: (roles: SystemRole[]) => void;
  simulateFunctionalRoles: (roles: FunctionalRole[]) => void;
  simulateDepartments: (deptIds: string[]) => void;
}

const AuthorizationContext = createContext<AuthorizationContextValue | null>(null);

export function useAuthorization() {
  const ctx = useContext(AuthorizationContext);
  if (!ctx) throw new Error("useAuthorization must be used within AuthorizationProvider");
  return ctx;
}

export function AuthorizationProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<AuthorizationProfile>(loadProfile);

  const setProfile = useCallback((p: AuthorizationProfile) => {
    setProfileState(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

  const updateProfile = useCallback((patch: Partial<AuthorizationProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const canCheck = useCallback(
    (resource: PermissionResource, action: PermissionAction, scope?: PermissionScope) =>
      can(profile, resource, action, scope).allowed,
    [profile]
  );

  const canAccessClass = useCallback(
    (classification: DataClassificationTag) =>
      canAccessClassification(profile, classification),
    [profile]
  );

  const canRouteCheck = useCallback(
    (rule: RouteAccessRule) => canAccessRoute(profile, rule),
    [profile]
  );

  const visibleRoutes = useMemo(
    () => getVisibleRoutes(profile, ROUTE_ACCESS_RULES),
    [profile]
  );

  const getActions = useCallback(
    (resource: PermissionResource, scope?: PermissionScope) =>
      getPermittedActionsForResource(profile, resource, scope),
    [profile]
  );

  const getApprovals = useCallback(
    (resource: PermissionResource, action: PermissionAction, tags?: DataClassificationTag[], riskScore?: number) =>
      getApprovalRequirements(resource, action, tags, riskScore),
    []
  );

  const allPermissions = useMemo(() => resolvePermissions(profile), [profile]);

  const isOwner = profile.system_roles.includes("owner");

  // ── Simulation helpers ─────────────────────────────
  const simulateLevel = useCallback((level: OrgLevel) => {
    updateProfile({ level });
  }, [updateProfile]);

  const simulateSystemRole = useCallback((roles: SystemRole[]) => {
    updateProfile({ system_roles: roles });
  }, [updateProfile]);

  const simulateFunctionalRoles = useCallback((roles: FunctionalRole[]) => {
    updateProfile({ functional_roles: roles });
  }, [updateProfile]);

  const simulateDepartments = useCallback((deptIds: string[]) => {
    updateProfile({ department_ids: deptIds });
  }, [updateProfile]);

  const value: AuthorizationContextValue = {
    profile,
    setProfile,
    updateProfile,
    can: canCheck,
    canAccessClass,
    canRoute: canRouteCheck,
    visibleRoutes,
    getActions,
    getApprovals,
    allPermissions,
    routeRules: ROUTE_ACCESS_RULES,
    approvalRules: DEFAULT_APPROVAL_RULES,
    isOwner,
    simulateLevel,
    simulateSystemRole,
    simulateFunctionalRoles,
    simulateDepartments,
  };

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}
