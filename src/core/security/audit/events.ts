/**
 * Security Audit Events
 * Extends the core audit logger with security-specific event types.
 * All security operations MUST emit audit events.
 */

import { auditLogger } from "@/core/engine/audit";
import type { SeatKey } from "@/core/types/identity";
import type { PolicyAction, ResourceType, DataClassification } from "../policy/types";

export interface SecurityAuditEvent {
  tenantId: string;
  actorId: string;
  seatKey?: SeatKey | null;
  action: PolicyAction;
  resourceType: ResourceType;
  resourceId: string;
  classification?: DataClassification;
  allowed: boolean;
  reason: string;
  metadata?: Record<string, unknown>;
}

/**
 * Emit a security audit event.
 * Called by the policy engine and security-sensitive operations.
 */
export function emitSecurityAudit(event: SecurityAuditEvent): string {
  const actionTypeMap: Record<string, string> = {
    READ: "override",     // sensitive read = override-level audit
    WRITE: "update",
    APPROVE: "approve",
    REJECT: "reject",
    EXECUTE: "execute",
    REVEAL_SECRET: "override",
    REVEAL_SENSITIVE: "override",
    DELETE: "delete",
    TRANSITION: "state_transition",
    ASSIGN_SEAT: "update",
    CHANGE_AI_MODE: "update",
    MODIFY_BUDGET: "update",
  };

  const audit = auditLogger.log({
    tenant_id: event.tenantId,
    user_id: event.actorId,
    seat_key: event.seatKey ?? null,
    entity_type: `Security:${event.resourceType}`,
    entity_id: event.resourceId,
    action_type: (actionTypeMap[event.action] || "update") as any,
    before_snapshot: null,
    after_snapshot: {
      action: event.action,
      allowed: event.allowed,
      classification: event.classification,
      ...event.metadata,
    },
    reason: event.reason,
  });

  return audit.id;
}

/**
 * Emit audit for a policy denial (for monitoring unauthorized attempts).
 */
export function emitPolicyDenial(event: Omit<SecurityAuditEvent, "allowed">): string {
  return emitSecurityAudit({ ...event, allowed: false });
}

/**
 * Emit audit for a successful sensitive data reveal.
 */
export function emitDataReveal(
  tenantId: string,
  actorId: string,
  resourceType: ResourceType,
  resourceId: string,
  fieldName: string,
  classification: DataClassification
): string {
  return emitSecurityAudit({
    tenantId,
    actorId,
    action: classification === "secret" ? "REVEAL_SECRET" : "REVEAL_SENSITIVE",
    resourceType,
    resourceId,
    classification,
    allowed: true,
    reason: `Field '${fieldName}' revealed`,
    metadata: { field: fieldName },
  });
}
