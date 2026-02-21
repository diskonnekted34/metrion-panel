/**
 * Policy Engine — ABAC-style authorization
 * Evaluates access control based on actor, resource, and action.
 * Phase 1: In-memory, synchronous evaluation.
 */

import type { UserRole } from "@/contexts/RBACContext";
import type { PolicyRequest, PolicyResult, PolicyAction, ResourceType } from "./types";

// ── Role hierarchy (higher index = more privilege) ──────
const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 0,
  operator: 1,
  department_lead: 2,
  admin: 3,
  owner: 4,
};

// ── Minimum role required per action ────────────────────
const ACTION_MIN_ROLE: Record<PolicyAction, number> = {
  READ: 0,                // viewer+
  WRITE: 1,               // operator+
  APPROVE: 2,             // department_lead+
  REJECT: 2,              // department_lead+
  EXECUTE: 3,             // admin+
  REVEAL_SENSITIVE: 2,    // department_lead+
  REVEAL_SECRET: 4,       // owner only
  DELETE: 3,              // admin+
  TRANSITION: 1,          // operator+
  ASSIGN_SEAT: 4,         // owner only
  CHANGE_AI_MODE: 4,      // owner only
  MODIFY_BUDGET: 4,       // owner only
};

// ── Resource-specific overrides ─────────────────────────
const RESOURCE_OVERRIDES: Partial<Record<ResourceType, Partial<Record<PolicyAction, number>>>> = {
  Secret: {
    READ: 4,        // owner only
    WRITE: 4,
    DELETE: 4,
  },
  AuditLog: {
    WRITE: 99,      // nobody can write audit logs directly
    DELETE: 99,     // nobody can delete audit logs
  },
  Governance: {
    WRITE: 4,
    EXECUTE: 4,
  },
};

// ── State-based restrictions ────────────────────────────
const WRITE_ALLOWED_STATES = new Set(["draft", "proposed", "rejected"]);

/**
 * Evaluate a policy request.
 */
export function evaluatePolicy(request: PolicyRequest): PolicyResult {
  const { actor, resource, action } = request;
  const roleLevel = ROLE_HIERARCHY[actor.role] ?? 0;

  // 1. Check resource-specific override
  const override = RESOURCE_OVERRIDES[resource.type]?.[action];
  const requiredLevel = override ?? ACTION_MIN_ROLE[action] ?? 99;

  if (roleLevel < requiredLevel) {
    return {
      allowed: false,
      reason: `Role '${actor.role}' lacks permission for ${action} on ${resource.type}`,
    };
  }

  // 2. State-based write restriction
  if (
    (action === "WRITE" || action === "DELETE") &&
    resource.state &&
    !WRITE_ALLOWED_STATES.has(resource.state)
  ) {
    return {
      allowed: false,
      reason: `Cannot ${action} when resource is in '${resource.state}' state`,
    };
  }

  // 3. Classification-based access control
  if (resource.classification === "secret" && action === "READ") {
    if (roleLevel < ACTION_MIN_ROLE.REVEAL_SECRET) {
      return {
        allowed: false,
        reason: "Secret-classified data requires owner-level access",
        classification: "secret",
      };
    }
  }

  if (resource.classification === "sensitive" && action === "READ") {
    if (roleLevel < ACTION_MIN_ROLE.REVEAL_SENSITIVE) {
      return {
        allowed: false,
        reason: "Sensitive data requires department_lead or higher access",
        classification: "sensitive",
      };
    }
  }

  return {
    allowed: true,
    reason: "Policy check passed",
    classification: resource.classification,
  };
}

/**
 * Quick helper: can actor perform action on resource type?
 */
export function canPerformAction(
  role: UserRole,
  action: PolicyAction,
  resourceType: ResourceType,
  resourceState?: string
): boolean {
  return evaluatePolicy({
    actor: { id: "", role, tenant_id: "", seat_key: null },
    resource: { type: resourceType, state: resourceState },
    action,
  }).allowed;
}

/**
 * Batch check: returns a map of action → allowed for a given resource.
 */
export function getPermittedActions(
  role: UserRole,
  resourceType: ResourceType,
  resourceState?: string
): Record<PolicyAction, boolean> {
  const actions: PolicyAction[] = [
    "READ", "WRITE", "APPROVE", "REJECT", "EXECUTE",
    "REVEAL_SECRET", "REVEAL_SENSITIVE", "DELETE", "TRANSITION",
    "ASSIGN_SEAT", "CHANGE_AI_MODE", "MODIFY_BUDGET",
  ];
  const result = {} as Record<PolicyAction, boolean>;
  for (const action of actions) {
    result[action] = canPerformAction(role, action, resourceType, resourceState);
  }
  return result;
}
