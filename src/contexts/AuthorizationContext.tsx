/**
 * AuthorizationContext — Provides 4-layer authorization state to the React tree.
 *
 * Security:
 * - PROD: Profile is memory-only. localStorage is NEVER read/written.
 *   This prevents privilege escalation via browser devtools.
 * - DEV: Simulation mode allows localStorage persistence for testing
 *   different roles/levels. Controlled by import.meta.env.DEV.
 *
 * Default profile: Owner/Executive for demo purposes (no backend yet).
 * When backend is connected, replace with server-issued profile from /auth/me.
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
import { ALL_DEPARTMENT_IDS } from "@/data/departments";

// ── Environment flags ──────────────────────────────────
const IS_DEV = import.meta.env.DEV;
/**
 * Simulation mode: only available in development builds.
 * Allows localStorage-based profile switching for testing.
 * Set VITE_AUTH_SIMULATION=false to explicitly disable in dev.
 */
const SIMULATION_ENABLED = IS_DEV && import.meta.env.VITE_AUTH_SIMULATION !== "false";
const STORAGE_KEY = "authorization_profile";

// ── Default profile ────────────────────────────────────
// Owner/Executive for demo (no backend). Replace with server-issued
// profile when backend is connected. Frontend authorization is UX
// only — backend MUST enforce all access decisions.
const DEFAULT_PROFILE: AuthorizationProfile = {
  user_id: "user-default",
  tenant_id: "tenant-default",
  level: "executive",
  system_roles: ["owner"],
  functional_roles: ["approval_authority", "org_primary_approver"],
  department_ids: [...ALL_DEPARTMENT_IDS],
  seat_key: "CEO",
};

/**
 * Load profile with security boundary.
 * - PROD: always returns DEFAULT_PROFILE (no localStorage)
 * - DEV+Simulation: reads from localStorage if available
 */
function loadProfile(): AuthorizationProfile {
  if (SIMULATION_ENABLED) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic shape validation
        if (parsed && typeof parsed === "object" && parsed.user_id && parsed.level) {
          return parsed;
        }
      }
    } catch {
      // Corrupt data — fall through to default
    }
  }
  return DEFAULT_PROFILE;
}

// ── Context value type ─────────────────────────────────
interface AuthorizationContextValue {
  profile: AuthorizationProfile;
  setProfile: (p: AuthorizationProfile) => void;
  updateProfile: (patch: Partial<AuthorizationProfile>) => void;

  can: (resource: PermissionResource, action: PermissionAction, scope?: PermissionScope) => boolean;
  canAccessClass: (classification: DataClassificationTag) => boolean;
  canRoute: (rule: RouteAccessRule) => boolean;
  visibleRoutes: RouteAccessRule[];
  getActions: (resource: PermissionResource, scope?: PermissionScope) => Record<PermissionAction, boolean>;
  getApprovals: (resource: PermissionResource, action: PermissionAction, tags?: DataClassificationTag[], riskScore?: number) => ApprovalRule[];
  allPermissions: ReturnType<typeof resolvePermissions>;
  routeRules: RouteAccessRule[];
  approvalRules: ApprovalRule[];
  isOwner: boolean;

  /** Whether simulation mode is active (DEV only) */
  isSimulationMode: boolean;

  /** Simulation helpers — no-op in production */
  simulateLevel: (level: OrgLevel) => void;
  simulateSystemRole: (roles: SystemRole[]) => void;
  simulateFunctionalRoles: (roles: FunctionalRole[]) => void;
  simulateDepartments: (deptIds: string[]) => void;
  resetToDefault: () => void;
}

const AuthorizationContext = createContext<AuthorizationContextValue | null>(null);

export function useAuthorization() {
  const ctx = useContext(AuthorizationContext);
  if (!ctx) throw new Error("useAuthorization must be used within AuthorizationProvider");
  return ctx;
}

export function AuthorizationProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<AuthorizationProfile>(loadProfile);

  /** Persist profile — only writes to localStorage in simulation mode */
  const persistProfile = useCallback((p: AuthorizationProfile) => {
    if (SIMULATION_ENABLED) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      } catch {
        // Storage full / private mode
      }
    }
  }, []);

  const setProfile = useCallback((p: AuthorizationProfile) => {
    setProfileState(p);
    persistProfile(p);
  }, [persistProfile]);

  const updateProfile = useCallback((patch: Partial<AuthorizationProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      persistProfile(next);
      return next;
    });
  }, [persistProfile]);

  const resetToDefault = useCallback(() => {
    setProfileState(DEFAULT_PROFILE);
    if (SIMULATION_ENABLED) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
    }
  }, []);

  // ── Permission checks ──────────────────────────────
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

  // ── Simulation helpers (no-op in prod) ─────────────
  const simulateLevel = useCallback((level: OrgLevel) => {
    if (!SIMULATION_ENABLED) return;
    updateProfile({ level });
  }, [updateProfile]);

  const simulateSystemRole = useCallback((roles: SystemRole[]) => {
    if (!SIMULATION_ENABLED) return;
    updateProfile({ system_roles: roles });
  }, [updateProfile]);

  const simulateFunctionalRoles = useCallback((roles: FunctionalRole[]) => {
    if (!SIMULATION_ENABLED) return;
    updateProfile({ functional_roles: roles });
  }, [updateProfile]);

  const simulateDepartments = useCallback((deptIds: string[]) => {
    if (!SIMULATION_ENABLED) return;
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
    isSimulationMode: SIMULATION_ENABLED,
    simulateLevel,
    simulateSystemRole,
    simulateFunctionalRoles,
    simulateDepartments,
    resetToDefault,
  };

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}
