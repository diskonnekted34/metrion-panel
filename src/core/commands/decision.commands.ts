/**
 * Decision Commands
 * All write operations for the Decision lifecycle.
 * Pattern: Validate → Authorize → Apply (state + audit)
 */

import type { CommandContext, CommandResult } from "./types";
import type { Decision, DecisionLifecycle } from "@/data/decisions";
import { transitionDecision } from "../engine/lifecycle";
import { auditLogger } from "../engine/audit";

// ── Map data-layer lifecycle to governance lifecycle ──
const LIFECYCLE_TO_GOVERNANCE: Record<string, string> = {
  proposed: "draft",
  under_review: "review",
  approved: "approved",
  rejected: "rejected",
  in_execution: "converted_to_action",
  monitoring: "approved",
  completed: "archived",
  failed: "archived",
};

const GOVERNANCE_TRANSITIONS: Record<string, string[]> = {
  proposed: ["under_review", "rejected"],
  under_review: ["approved", "rejected", "proposed"],
  approved: ["in_execution", "monitoring"],
  rejected: ["proposed"],
  in_execution: ["monitoring", "completed", "failed"],
  monitoring: ["completed", "failed"],
  completed: [],
  failed: ["proposed"],
};

// ── Authorize helpers ──
const APPROVE_ROLES = ["owner", "admin", "department_lead"] as const;
const DRAFT_ROLES = ["owner", "admin", "department_lead", "operator"] as const;

function canApprove(role: string): boolean {
  return (APPROVE_ROLES as readonly string[]).includes(role);
}

function canDraft(role: string): boolean {
  return (DRAFT_ROLES as readonly string[]).includes(role);
}

function isValidTransition(from: DecisionLifecycle, to: DecisionLifecycle): boolean {
  const allowed = GOVERNANCE_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

// ── Commands ──

export interface CreateDecisionInput {
  title: string;
  description: string;
  category: Decision["category"];
  department?: string;
  riskLevel: Decision["riskLevel"];
  estimatedFinancialImpact: string;
  requiredApprovers: string[];
}

export function createDecision(
  input: CreateDecisionInput,
  ctx: CommandContext
): CommandResult<Decision> {
  // Validate
  if (!input.title.trim()) return { success: false, error: "Title is required" };
  if (!input.description.trim()) return { success: false, error: "Description is required" };

  // Authorize
  if (!canDraft(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot create decisions` };
  }

  // Apply
  const now = new Date().toISOString();
  const decision: Decision = {
    id: `dec-cmd-${Date.now()}`,
    title: input.title,
    description: input.description,
    category: input.category,
    lifecycle: "proposed",
    priorityScore: 50,
    riskLevel: input.riskLevel,
    aiConfidence: 70,
    simulationStrength: 50,
    humanOverrideRisk: "low",
    estimatedFinancialImpact: input.estimatedFinancialImpact,
    estimatedKPIImpact: "—",
    timeSensitivity: "medium",
    decisionDelayRisk: { days: 30, estimatedLoss: "$0" },
    requiredApprovers: input.requiredApprovers,
    finalAuthority: input.requiredApprovers[0] || "CEO",
    source: ctx.user_name,
    department: input.department,
    createdAt: now,
    lastActionDate: now,
    aiReasoning: "Manuel oluşturuldu.",
    dataSources: [],
    modelReasoning: "—",
    overrideEvents: [],
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Decision",
    entity_id: decision.id,
    action_type: "create",
    before_snapshot: null,
    after_snapshot: { lifecycle: "proposed", title: decision.title } as Record<string, unknown>,
    reason: "Decision created via command layer",
  });

  return { success: true, data: decision, audit_id: audit.id };
}

export function submitDecisionForApproval(
  decision: Decision,
  ctx: CommandContext
): CommandResult<Decision> {
  // Validate
  if (decision.lifecycle !== "proposed") {
    return { success: false, error: `Cannot submit: current state is '${decision.lifecycle}', expected 'proposed'` };
  }

  // Authorize
  if (!canDraft(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot submit decisions` };
  }

  // Apply
  const updated: Decision = {
    ...decision,
    lifecycle: "under_review",
    lastActionDate: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Decision",
    entity_id: decision.id,
    action_type: "state_transition",
    before_snapshot: { lifecycle: decision.lifecycle } as Record<string, unknown>,
    after_snapshot: { lifecycle: "under_review" } as Record<string, unknown>,
    reason: "Submitted for approval",
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function approveDecision(
  decision: Decision,
  ctx: CommandContext
): CommandResult<Decision> {
  // Validate
  if (!isValidTransition(decision.lifecycle, "approved")) {
    return { success: false, error: `Cannot approve from '${decision.lifecycle}'` };
  }

  // Authorize
  if (!canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot approve decisions` };
  }

  // Apply
  const updated: Decision = {
    ...decision,
    lifecycle: "approved",
    approvedAt: new Date().toISOString(),
    lastActionDate: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Decision",
    entity_id: decision.id,
    action_type: "approve",
    before_snapshot: { lifecycle: decision.lifecycle } as Record<string, unknown>,
    after_snapshot: { lifecycle: "approved" } as Record<string, unknown>,
    reason: `Approved by ${ctx.user_name}`,
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function rejectDecision(
  decision: Decision,
  reason: string,
  ctx: CommandContext
): CommandResult<Decision> {
  // Validate
  if (!isValidTransition(decision.lifecycle, "rejected")) {
    return { success: false, error: `Cannot reject from '${decision.lifecycle}'` };
  }
  if (!reason.trim()) {
    return { success: false, error: "Rejection reason is required" };
  }

  // Authorize
  if (!canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot reject decisions` };
  }

  // Apply
  const updated: Decision = {
    ...decision,
    lifecycle: "rejected",
    rejectedAt: new Date().toISOString(),
    rejectionReason: reason,
    lastActionDate: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Decision",
    entity_id: decision.id,
    action_type: "reject",
    before_snapshot: { lifecycle: decision.lifecycle } as Record<string, unknown>,
    after_snapshot: { lifecycle: "rejected", rejectionReason: reason } as Record<string, unknown>,
    reason,
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function transitionDecisionLifecycle(
  decision: Decision,
  targetLifecycle: DecisionLifecycle,
  ctx: CommandContext,
  reason?: string
): CommandResult<Decision> {
  // Validate
  if (!isValidTransition(decision.lifecycle, targetLifecycle)) {
    return { success: false, error: `Invalid transition: ${decision.lifecycle} → ${targetLifecycle}` };
  }

  // Authorize
  const needsApproval = targetLifecycle === "approved" || targetLifecycle === "rejected";
  if (needsApproval && !canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot perform this transition` };
  }

  // Apply
  const updated: Decision = {
    ...decision,
    lifecycle: targetLifecycle,
    lastActionDate: new Date().toISOString(),
    ...(targetLifecycle === "approved" ? { approvedAt: new Date().toISOString() } : {}),
    ...(targetLifecycle === "rejected" ? { rejectedAt: new Date().toISOString(), rejectionReason: reason } : {}),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Decision",
    entity_id: decision.id,
    action_type: "state_transition",
    before_snapshot: { lifecycle: decision.lifecycle } as Record<string, unknown>,
    after_snapshot: { lifecycle: targetLifecycle } as Record<string, unknown>,
    reason: reason || `Transition to ${targetLifecycle}`,
  });

  return { success: true, data: updated, audit_id: audit.id };
}
