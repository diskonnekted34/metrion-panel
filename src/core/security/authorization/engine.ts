/**
 * Authorization Engine — Default-Deny, 4-Layer Evaluation
 * Evaluates: SystemRoles → Level → FunctionalRoles → Permissions → Scope
 */

import type {
  AuthorizationProfile,
  AuthorizationResult,
  Permission,
  PermissionAction,
  PermissionResource,
  PermissionScope,
  DataClassificationTag,
  OrgLevel,
  RouteAccessRule,
  ApprovalRule,
} from "./types";
import { ORG_LEVEL_HIERARCHY, CLASSIFICATION_SEVERITY } from "./types";
import {
  LEVEL_DEFAULT_PERMISSIONS,
  SYSTEM_ROLE_PERMISSIONS,
  FUNCTIONAL_ROLE_PERMISSIONS,
  DEFAULT_APPROVAL_RULES,
} from "./defaults";

// ── ACTION HIERARCHY (admin implies everything below) ──
const ACTION_HIERARCHY: Record<PermissionAction, number> = {
  view: 0,
  create: 1,
  propose: 2,
  approve: 3,
  execute: 4,
  admin: 5,
};

function actionImplies(granted: PermissionAction, requested: PermissionAction): boolean {
  return ACTION_HIERARCHY[granted] >= ACTION_HIERARCHY[requested];
}

// ── SCOPE MATCHING ─────────────────────────────────────
function scopeCovers(
  granted: PermissionScope,
  requested: PermissionScope,
  profile: AuthorizationProfile
): boolean {
  // org scope covers everything
  if (granted.type === "org") return true;

  // self scope only covers self
  if (granted.type === "self" && requested.type === "self") return true;

  // dept scope covers if user belongs to that department
  if (granted.type === "dept") {
    if (requested.type !== "dept" && requested.type !== "self") return false;
    // If granted has a specific target, it must match
    if (granted.target && requested.type === "dept" && requested.target) {
      return granted.target === requested.target;
    }
    // If granted has no specific target, user's dept membership is checked
    if (!granted.target && requested.target) {
      return profile.department_ids.includes(requested.target);
    }
    return true;
  }

  // seat scope
  if (granted.type === "seat") {
    return requested.type === "seat" && granted.target === requested.target;
  }

  // tag scope
  if (granted.type === "tag") {
    return requested.type === "tag" && granted.target === requested.target;
  }

  return false;
}

// ── RESOLVE ALL PERMISSIONS ────────────────────────────
export function resolvePermissions(profile: AuthorizationProfile): Permission[] {
  const perms: Permission[] = [];

  // 1. Level defaults
  const levelPerms = LEVEL_DEFAULT_PERMISSIONS[profile.level] ?? [];
  perms.push(...levelPerms);

  // 2. System role permissions
  for (const sr of profile.system_roles) {
    const srPerms = SYSTEM_ROLE_PERMISSIONS[sr] ?? [];
    perms.push(...srPerms);
  }

  // 3. Functional role permissions
  for (const fr of profile.functional_roles) {
    const frPerms = FUNCTIONAL_ROLE_PERMISSIONS[fr] ?? [];
    perms.push(...frPerms);
  }

  return perms;
}

// ── CORE AUTHORIZATION CHECK ───────────────────────────
export function can(
  profile: AuthorizationProfile,
  resource: PermissionResource,
  action: PermissionAction,
  scope?: PermissionScope
): AuthorizationResult {
  const requestedScope: PermissionScope = scope ?? { type: "org" };
  const allPerms = resolvePermissions(profile);

  // Check each permission
  for (const perm of allPerms) {
    if (perm.resource !== resource) continue;
    if (!actionImplies(perm.action, action)) continue;
    if (!scopeCovers(perm.scope, requestedScope, profile)) continue;

    return {
      allowed: true,
      reason: `Permitted via ${perm.action} on ${perm.resource}`,
    };
  }

  return {
    allowed: false,
    reason: `No permission for ${action} on ${resource} (scope: ${requestedScope.type}${requestedScope.target ? `:${requestedScope.target}` : ""})`,
  };
}

// ── CLASSIFICATION ACCESS CHECK ────────────────────────
export function canAccessClassification(
  profile: AuthorizationProfile,
  classification: DataClassificationTag
): boolean {
  const severity = CLASSIFICATION_SEVERITY[classification];

  // public: everyone
  if (severity === 0) return true;

  // Has system owner role → can access anything
  if (profile.system_roles.includes("owner")) return true;

  // departmental: must be in dept or level <= department_director
  if (classification === "departmental") {
    return ORG_LEVEL_HIERARCHY[profile.level] <= ORG_LEVEL_HIERARCHY["department_director"];
  }

  // executive_confidential, budget_sensitive: executive or above
  if (severity === 2) {
    return ORG_LEVEL_HIERARCHY[profile.level] <= ORG_LEVEL_HIERARCHY["executive"];
  }

  // restricted, pii, risk_high: owner or security_admin
  if (severity >= 3) {
    return (
      profile.system_roles.includes("owner") ||
      profile.system_roles.includes("security_admin")
    );
  }

  return false;
}

// ── ROUTE ACCESS CHECK ─────────────────────────────────
export function canAccessRoute(
  profile: AuthorizationProfile,
  rule: RouteAccessRule
): boolean {
  // System role override (any match)
  if (rule.system_roles?.length) {
    const hasSystemRole = rule.system_roles.some((sr) =>
      profile.system_roles.includes(sr)
    );
    if (hasSystemRole) return true;
  }

  // Functional role check (any match)
  if (rule.functional_roles?.length) {
    const hasFuncRole = rule.functional_roles.some((fr) =>
      profile.functional_roles.includes(fr)
    );
    if (hasFuncRole) return true;
  }

  // Min level check
  if (rule.min_level) {
    const required = ORG_LEVEL_HIERARCHY[rule.min_level];
    const actual = ORG_LEVEL_HIERARCHY[profile.level];
    if (actual > required) return false;
  }

  // Permission check
  if (rule.required_permission) {
    const scope: PermissionScope = rule.scope_constraint
      ? { type: rule.scope_constraint }
      : { type: "org" };
    const result = can(profile, rule.required_permission.resource, rule.required_permission.action, scope);
    return result.allowed;
  }

  // If no rules defined, deny (default deny)
  if (!rule.system_roles?.length && !rule.functional_roles?.length && !rule.required_permission && !rule.min_level) {
    return false;
  }

  return true;
}

// ── APPROVAL REQUIREMENT CHECK ─────────────────────────
export function getApprovalRequirements(
  resource: PermissionResource,
  action: PermissionAction,
  tags?: DataClassificationTag[],
  riskScore?: number,
  customRules?: ApprovalRule[]
): ApprovalRule[] {
  const rules = customRules ?? DEFAULT_APPROVAL_RULES;
  return rules.filter((rule) => {
    if (!rule.enabled) return false;
    if (rule.condition.resource !== resource) return false;
    if (rule.condition.action && rule.condition.action !== action) return false;

    // Tag match (any tag matches)
    if (rule.condition.tags?.length) {
      const hasMatch = rule.condition.tags.some((t) => tags?.includes(t));
      if (!hasMatch) return false;
    }

    // Risk score
    if (rule.condition.riskScoreAbove != null) {
      if ((riskScore ?? 0) <= rule.condition.riskScoreAbove) return false;
    }

    return true;
  });
}

// ── BATCH PERMISSION CHECK ─────────────────────────────
export function getPermittedActionsForResource(
  profile: AuthorizationProfile,
  resource: PermissionResource,
  scope?: PermissionScope
): Record<PermissionAction, boolean> {
  const actions: PermissionAction[] = ["view", "create", "propose", "approve", "execute", "admin"];
  const result = {} as Record<PermissionAction, boolean>;
  for (const action of actions) {
    result[action] = can(profile, resource, action, scope).allowed;
  }
  return result;
}

// ── VISIBLE ROUTES HELPER ──────────────────────────────
export function getVisibleRoutes(
  profile: AuthorizationProfile,
  rules: RouteAccessRule[]
): RouteAccessRule[] {
  return rules.filter((rule) => canAccessRoute(profile, rule));
}
