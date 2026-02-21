/**
 * Command Layer — Policy-Enforced Execution
 * Wraps command execution with security policy checks and audit events.
 */

import type { CommandContext, CommandResult } from "./types";
import { evaluatePolicy } from "../security/policy/engine";
import { emitSecurityAudit, emitPolicyDenial } from "../security/audit/events";
import type { PolicyAction, ResourceType } from "../security/policy/types";

/**
 * Execute a command with policy enforcement.
 * Flow: Policy Check → Command Execute → Security Audit
 */
export function withPolicy<TInput, TOutput>(
  action: PolicyAction,
  resourceType: ResourceType,
  commandFn: (input: TInput, ctx: CommandContext) => CommandResult<TOutput>,
  options?: {
    getResourceId?: (input: TInput) => string;
    getResourceState?: (input: TInput) => string | undefined;
  }
) {
  return function (input: TInput, ctx: CommandContext): CommandResult<TOutput> {
    const resourceId = options?.getResourceId?.(input) ?? "";
    const resourceState = options?.getResourceState?.(input);

    // Policy check
    const policyResult = evaluatePolicy({
      actor: {
        id: ctx.user_id,
        role: ctx.user_role,
        seat_key: ctx.seat_key,
        tenant_id: ctx.tenant_id,
      },
      resource: {
        type: resourceType,
        id: resourceId,
        state: resourceState,
      },
      action,
    });

    if (!policyResult.allowed) {
      emitPolicyDenial({
        tenantId: ctx.tenant_id,
        actorId: ctx.user_id,
        action,
        resourceType,
        resourceId,
        reason: policyResult.reason,
      });
      return { success: false, error: policyResult.reason };
    }

    // Execute command
    const result = commandFn(input, ctx);

    // Emit security audit on success
    if (result.success) {
      emitSecurityAudit({
        tenantId: ctx.tenant_id,
        actorId: ctx.user_id,
        seatKey: ctx.seat_key,
        action,
        resourceType,
        resourceId: resourceId || (result.data as any)?.id || "",
        allowed: true,
        reason: `Command executed: ${action} on ${resourceType}`,
      });
    }

    return result;
  };
}
