/**
 * Governance Commands (future extension point)
 * Handles cross-entity governance operations:
 * - Approval policy changes
 * - Budget cap enforcement
 * - AI mode transitions
 * - Seat authority modifications
 */

import type { CommandContext, CommandResult } from "./types";
import { auditLogger } from "../engine/audit";

export interface UpdateBudgetCapsInput {
  dailySpendLimit?: number;
  weeklySpendLimit?: number;
  maxBudgetChangePercent?: number;
}

export function updateBudgetCaps(
  input: UpdateBudgetCapsInput,
  currentCaps: Record<string, unknown>,
  ctx: CommandContext
): CommandResult<Record<string, unknown>> {
  // Validate
  if (input.dailySpendLimit !== undefined && input.dailySpendLimit < 0) {
    return { success: false, error: "Daily spend limit cannot be negative" };
  }
  if (input.weeklySpendLimit !== undefined && input.weeklySpendLimit < 0) {
    return { success: false, error: "Weekly spend limit cannot be negative" };
  }

  // Authorize — only owner can modify budget caps
  if (ctx.user_role !== "owner") {
    return { success: false, error: "Only owner can modify budget caps" };
  }

  // Apply
  const updatedCaps = { ...currentCaps, ...input };

  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "GovernanceConfig",
    entity_id: "budget_caps",
    action_type: "update",
    before_snapshot: currentCaps,
    after_snapshot: updatedCaps,
    reason: "Budget caps updated via command layer",
  });

  return { success: true, data: updatedCaps, audit_id: audit.id };
}

export interface AIModeChangeInput {
  seatKey: string;
  newMode: "advisory" | "hybrid" | "autonomous";
}

export function changeAIMode(
  input: AIModeChangeInput,
  currentMode: string,
  ctx: CommandContext
): CommandResult<string> {
  // Validate
  if (input.newMode === currentMode) {
    return { success: false, error: "Mode is already set to this value" };
  }

  // Authorize — only owner
  if (ctx.user_role !== "owner") {
    return { success: false, error: "Only owner can change AI modes" };
  }

  // Apply
  const audit = auditLogger.log({
    tenant_id: ctx.tenant_id,
    user_id: ctx.user_id,
    seat_key: ctx.seat_key,
    entity_type: "Seat",
    entity_id: input.seatKey,
    action_type: "update",
    before_snapshot: { ai_mode: currentMode } as Record<string, unknown>,
    after_snapshot: { ai_mode: input.newMode } as Record<string, unknown>,
    reason: `AI mode changed from ${currentMode} to ${input.newMode}`,
  });

  return { success: true, data: input.newMode, audit_id: audit.id };
}
