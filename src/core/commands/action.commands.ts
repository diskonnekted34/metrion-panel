/**
 * Action Commands
 * All write operations for the Action lifecycle (ActionModeContext entities).
 * Pattern: Validate → Authorize → Apply (state + audit)
 */

import type { CommandContext, CommandResult } from "./types";
import type { ActionDraft, ActionStatus, ActionType, RiskLevel } from "@/contexts/ActionModeContext";
import { auditLogger } from "../engine/audit";

// ── Valid transitions ──
const ACTION_TRANSITIONS: Record<ActionStatus, ActionStatus[]> = {
  draft: ["pending_approval"],
  pending_approval: ["approved", "rejected"],
  approved: ["published"],
  published: [],
  rejected: ["draft"],
};

function isValidTransition(from: ActionStatus, to: ActionStatus): boolean {
  return (ACTION_TRANSITIONS[from] || []).includes(to);
}

// ── Authorize helpers ──
const APPROVE_ROLES = ["owner", "admin"] as const;
const DRAFT_ROLES = ["owner", "admin", "department_lead", "operator"] as const;

function canApprove(role: string): boolean {
  return (APPROVE_ROLES as readonly string[]).includes(role);
}

function canDraft(role: string): boolean {
  return (DRAFT_ROLES as readonly string[]).includes(role);
}

// ── Commands ──

export interface CreateActionInput {
  integrationId: string;
  type: ActionType;
  title: string;
  description: string;
  estimatedImpact: string;
  riskLevel: RiskLevel;
  riskFlags: string[];
  budgetCap?: number;
  rollbackPlan: string;
  changes: { field: string; from: string; to: string }[];
}

export function createAction(
  input: CreateActionInput,
  ctx: CommandContext
): CommandResult<ActionDraft> {
  // Validate
  if (!input.title.trim()) return { success: false, error: "Title is required" };

  // Authorize
  if (!canDraft(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot create actions` };
  }

  // Apply
  const action: ActionDraft = {
    id: `act-cmd-${Date.now()}`,
    integrationId: input.integrationId,
    type: input.type,
    title: input.title,
    description: input.description,
    status: "draft",
    createdBy: ctx.user_name,
    createdAt: new Date().toISOString(),
    estimatedImpact: input.estimatedImpact,
    riskLevel: input.riskLevel,
    riskFlags: input.riskFlags,
    budgetCap: input.budgetCap,
    rollbackPlan: input.rollbackPlan,
    changes: input.changes,
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Action",
    entity_id: action.id,
    action_type: "create",
    before_snapshot: null,
    after_snapshot: { status: "draft", title: action.title } as Record<string, unknown>,
    reason: "Action created via command layer",
  });

  return { success: true, data: action, audit_id: audit.id };
}

export function submitActionForApproval(
  action: ActionDraft,
  ctx: CommandContext
): CommandResult<ActionDraft> {
  // Validate
  if (action.status !== "draft") {
    return { success: false, error: `Cannot submit: current status is '${action.status}'` };
  }

  // Authorize
  if (!canDraft(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot submit actions` };
  }

  // Apply
  const updated: ActionDraft = {
    ...action,
    status: "pending_approval",
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Action",
    entity_id: action.id,
    action_type: "state_transition",
    before_snapshot: { status: "draft" } as Record<string, unknown>,
    after_snapshot: { status: "pending_approval" } as Record<string, unknown>,
    reason: "Submitted for approval",
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function approveAction(
  action: ActionDraft,
  ctx: CommandContext
): CommandResult<ActionDraft> {
  // Validate
  if (!isValidTransition(action.status, "approved")) {
    return { success: false, error: `Cannot approve from '${action.status}'` };
  }

  // Authorize
  if (!canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot approve actions` };
  }

  // Apply
  const updated: ActionDraft = {
    ...action,
    status: "approved",
    approvedBy: ctx.user_name,
    approvedAt: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Action",
    entity_id: action.id,
    action_type: "approve",
    before_snapshot: { status: action.status } as Record<string, unknown>,
    after_snapshot: { status: "approved" } as Record<string, unknown>,
    reason: `Approved by ${ctx.user_name}`,
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function rejectAction(
  action: ActionDraft,
  ctx: CommandContext,
  reason?: string
): CommandResult<ActionDraft> {
  // Validate
  if (!isValidTransition(action.status, "rejected")) {
    return { success: false, error: `Cannot reject from '${action.status}'` };
  }

  // Authorize
  if (!canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot reject actions` };
  }

  // Apply
  const updated: ActionDraft = {
    ...action,
    status: "rejected",
    rejectedBy: ctx.user_name,
    rejectedAt: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Action",
    entity_id: action.id,
    action_type: "reject",
    before_snapshot: { status: action.status } as Record<string, unknown>,
    after_snapshot: { status: "rejected" } as Record<string, unknown>,
    reason: reason || `Rejected by ${ctx.user_name}`,
  });

  return { success: true, data: updated, audit_id: audit.id };
}

export function executeAction(
  action: ActionDraft,
  ctx: CommandContext
): CommandResult<ActionDraft> {
  // Validate
  if (action.status !== "approved") {
    return { success: false, error: `Cannot execute: status is '${action.status}', expected 'approved'` };
  }

  // Authorize
  if (!canApprove(ctx.user_role)) {
    return { success: false, error: `Role '${ctx.user_role}' cannot execute actions` };
  }

  // Apply
  const updated: ActionDraft = {
    ...action,
    status: "published",
    publishedBy: ctx.user_name,
    publishedAt: new Date().toISOString(),
  };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Action",
    entity_id: action.id,
    action_type: "execute",
    before_snapshot: { status: "approved" } as Record<string, unknown>,
    after_snapshot: { status: "published" } as Record<string, unknown>,
    reason: `Executed by ${ctx.user_name}`,
  });

  return { success: true, data: updated, audit_id: audit.id };
}
