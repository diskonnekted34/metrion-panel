/**
 * Command Layer Tests
 * Validates Validate → Authorize → Apply pattern for decision & action commands.
 */

import { describe, it, expect } from "vitest";
import {
  createDecision,
  submitDecisionForApproval,
  approveDecision,
  rejectDecision,
  transitionDecisionLifecycle,
} from "../core/commands/decision.commands";
import {
  createAction,
  submitActionForApproval,
  approveAction,
  rejectAction,
  executeAction,
} from "../core/commands/action.commands";
import type { CommandContext } from "../core/commands/types";
import type { Decision } from "../data/decisions";

const ownerCtx: CommandContext = {
  tenant_id: "t1",
  user_id: "u1",
  user_name: "Ahmet",
  user_role: "owner",
  seat_key: "CEO",
};

const viewerCtx: CommandContext = {
  tenant_id: "t1",
  user_id: "u6",
  user_name: "Selin",
  user_role: "viewer",
  seat_key: null,
};

// ── Decision Commands ──

describe("Decision Commands", () => {
  it("createDecision — valid input + authorized role", () => {
    const result = createDecision({
      title: "Test Decision",
      description: "A test",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "₺100K",
      requiredApprovers: ["CEO"],
    }, ownerCtx);

    expect(result.success).toBe(true);
    expect(result.data?.lifecycle).toBe("proposed");
    expect(result.audit_id).toBeDefined();
  });

  it("createDecision — viewer cannot create", () => {
    const result = createDecision({
      title: "Test",
      description: "test",
      category: "strategic",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: [],
    }, viewerCtx);

    expect(result.success).toBe(false);
    expect(result.error).toContain("viewer");
  });

  it("createDecision — empty title rejected", () => {
    const result = createDecision({
      title: "",
      description: "test",
      category: "strategic",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: [],
    }, ownerCtx);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Title");
  });

  it("submitDecisionForApproval — proposed → under_review", () => {
    const created = createDecision({
      title: "Submit Test",
      description: "desc",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: ["CEO"],
    }, ownerCtx);

    const result = submitDecisionForApproval(created.data!, ownerCtx);
    expect(result.success).toBe(true);
    expect(result.data?.lifecycle).toBe("under_review");
  });

  it("approveDecision — under_review → approved", () => {
    const created = createDecision({
      title: "Approve Test",
      description: "desc",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: ["CEO"],
    }, ownerCtx);

    const submitted = submitDecisionForApproval(created.data!, ownerCtx);
    const approved = approveDecision(submitted.data!, ownerCtx);
    expect(approved.success).toBe(true);
    expect(approved.data?.lifecycle).toBe("approved");
  });

  it("approveDecision — viewer cannot approve", () => {
    const created = createDecision({
      title: "Auth Test",
      description: "desc",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: ["CEO"],
    }, ownerCtx);

    const submitted = submitDecisionForApproval(created.data!, ownerCtx);
    const result = approveDecision(submitted.data!, viewerCtx);
    expect(result.success).toBe(false);
    expect(result.error).toContain("viewer");
  });

  it("rejectDecision — requires reason", () => {
    const created = createDecision({
      title: "Reject Test",
      description: "desc",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: ["CEO"],
    }, ownerCtx);

    const submitted = submitDecisionForApproval(created.data!, ownerCtx);
    const result = rejectDecision(submitted.data!, "", ownerCtx);
    expect(result.success).toBe(false);
    expect(result.error).toContain("reason");
  });

  it("invalid transition blocked", () => {
    const created = createDecision({
      title: "Invalid",
      description: "desc",
      category: "operational",
      riskLevel: "low",
      estimatedFinancialImpact: "—",
      requiredApprovers: [],
    }, ownerCtx);

    // Cannot go directly from proposed to approved
    const result = transitionDecisionLifecycle(created.data!, "approved", ownerCtx);
    expect(result.success).toBe(false);
  });
});

// ── Action Commands ──

describe("Action Commands", () => {
  it("createAction + submit + approve + execute", () => {
    const created = createAction({
      integrationId: "meta-ads",
      type: "campaign_create",
      title: "Test Campaign",
      description: "desc",
      estimatedImpact: "High",
      riskLevel: "low",
      riskFlags: [],
      rollbackPlan: "Revert",
      changes: [],
    }, ownerCtx);

    expect(created.success).toBe(true);
    expect(created.data?.status).toBe("draft");

    const submitted = submitActionForApproval(created.data!, ownerCtx);
    expect(submitted.success).toBe(true);
    expect(submitted.data?.status).toBe("pending_approval");

    const approved = approveAction(submitted.data!, ownerCtx);
    expect(approved.success).toBe(true);
    expect(approved.data?.status).toBe("approved");

    const executed = executeAction(approved.data!, ownerCtx);
    expect(executed.success).toBe(true);
    expect(executed.data?.status).toBe("published");
  });

  it("viewer cannot create actions", () => {
    const result = createAction({
      integrationId: "meta-ads",
      type: "campaign_create",
      title: "Test",
      description: "desc",
      estimatedImpact: "Low",
      riskLevel: "low",
      riskFlags: [],
      rollbackPlan: "Revert",
      changes: [],
    }, viewerCtx);

    expect(result.success).toBe(false);
  });

  it("cannot execute unapproved action", () => {
    const created = createAction({
      integrationId: "meta-ads",
      type: "budget_update",
      title: "Budget",
      description: "desc",
      estimatedImpact: "Med",
      riskLevel: "medium",
      riskFlags: [],
      rollbackPlan: "Revert",
      changes: [],
    }, ownerCtx);

    const result = executeAction(created.data!, ownerCtx);
    expect(result.success).toBe(false);
    expect(result.error).toContain("approved");
  });
});
