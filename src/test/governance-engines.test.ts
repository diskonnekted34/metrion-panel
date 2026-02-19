/**
 * Deterministic tests for governance engines:
 * lifecycle state machine, approval resolution, seat authority.
 */

import { describe, it, expect } from "vitest";
import {
  transitionDecision,
  transitionAction,
  getDecisionNextStates,
  getActionNextStates,
} from "@/core/engine/lifecycle";
import {
  resolveApprovalRequirement,
  isApprovalComplete,
} from "@/core/engine/approval";
import {
  seatHasCapability,
  canApproveFor,
  requiresMultiApproval,
  getCapabilitiesForLevel,
} from "@/core/engine/seats";
import type { Seat } from "@/core/types/identity";
import type { DecisionApproval } from "@/core/types/governance";

// ── Lifecycle State Machine ─────────────────────────────
describe("transitionDecision", () => {
  it("allows valid transition draft → review", () => {
    const result = transitionDecision("draft", "review");
    expect(result.success).toBe(true);
    expect(result.to).toBe("review");
  });

  it("rejects invalid transition draft → approved", () => {
    const result = transitionDecision("draft", "approved");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("blocks transitions from archived", () => {
    const result = transitionDecision("archived", "draft");
    expect(result.success).toBe(false);
  });
});

describe("transitionAction", () => {
  it("allows draft → approval_pending", () => {
    expect(transitionAction("draft", "approval_pending").success).toBe(true);
  });

  it("rejects draft → completed", () => {
    expect(transitionAction("draft", "completed").success).toBe(false);
  });

  it("allows failed → rolled_back", () => {
    expect(transitionAction("failed", "rolled_back").success).toBe(true);
  });
});

describe("getDecisionNextStates", () => {
  it("returns correct next states for review", () => {
    const states = getDecisionNextStates("review");
    expect(states).toContain("approval_pending");
    expect(states).toContain("draft");
  });
});

describe("getActionNextStates", () => {
  it("returns empty for completed", () => {
    expect(getActionNextStates("completed")).toEqual([]);
  });
});

// ── Approval Engine ─────────────────────────────────────
describe("resolveApprovalRequirement", () => {
  it("requires CEO + CFO for critical decisions", () => {
    const req = resolveApprovalRequirement("decision", "critical", "technology");
    expect(req.required_seats).toContain("CEO");
    expect(req.required_seats).toContain("CFO");
    expect(req.minimum_count).toBe(2);
  });

  it("uses department-specific policy for HR high risk", () => {
    const req = resolveApprovalRequirement("decision", "high", "hr");
    expect(req.required_seats).toContain("CHRO");
    expect(req.required_seats).toContain("CEO");
  });

  it("falls back to standard for low risk", () => {
    const req = resolveApprovalRequirement("decision", "low", "marketing");
    expect(req.minimum_count).toBe(1);
  });
});

describe("isApprovalComplete", () => {
  const requirement = {
    required_seats: ["CEO" as const, "CFO" as const],
    minimum_count: 2,
    policy_description: "Test",
  };

  it("returns complete when all required seats approved", () => {
    const approvals: DecisionApproval[] = [
      { id: "a1", tenant_id: "t1", decision_id: "d1", seat_key: "CEO", status: "approved", created_at: "" },
      { id: "a2", tenant_id: "t1", decision_id: "d1", seat_key: "CFO", status: "approved", created_at: "" },
    ];
    const result = isApprovalComplete(approvals, requirement);
    expect(result.complete).toBe(true);
    expect(result.approved_count).toBe(2);
  });

  it("returns incomplete when seat missing", () => {
    const approvals: DecisionApproval[] = [
      { id: "a1", tenant_id: "t1", decision_id: "d1", seat_key: "CEO", status: "approved", created_at: "" },
    ];
    expect(isApprovalComplete(approvals, requirement).complete).toBe(false);
  });

  it("returns rejected when required seat rejects", () => {
    const approvals: DecisionApproval[] = [
      { id: "a1", tenant_id: "t1", decision_id: "d1", seat_key: "CEO", status: "rejected", created_at: "" },
      { id: "a2", tenant_id: "t1", decision_id: "d1", seat_key: "CFO", status: "approved", created_at: "" },
    ];
    const result = isApprovalComplete(approvals, requirement);
    expect(result.rejected).toBe(true);
    expect(result.complete).toBe(false);
  });
});

// ── Seat Authority ──────────────────────────────────────
describe("seatHasCapability", () => {
  const seat: Seat = {
    id: "s1", tenant_id: "t1", seat_key: "CTO", label: "CTO",
    department_key: "technology", authority_level: 90, ai_mode: "advisory",
    human_user_id: null, capabilities: ["analysis.view", "decision.approve", "simulation.approve"],
    created_at: "",
  };

  it("returns true for present capability", () => {
    expect(seatHasCapability(seat, "decision.approve")).toBe(true);
  });

  it("returns false for absent capability", () => {
    expect(seatHasCapability(seat, "task.create")).toBe(false);
  });
});

describe("canApproveFor", () => {
  const ceo: Seat = {
    id: "s1", tenant_id: "t1", seat_key: "CEO", label: "CEO",
    department_key: "executive", authority_level: 100, ai_mode: "advisory",
    human_user_id: "u1", capabilities: ["decision.approve"],
    created_at: "",
  };

  const operator: Seat = {
    id: "s2", tenant_id: "t1", seat_key: "CTO", label: "CTO",
    department_key: "technology", authority_level: 50, ai_mode: "advisory",
    human_user_id: null, capabilities: ["analysis.view"],
    created_at: "",
  };

  it("higher authority can approve for lower", () => {
    expect(canApproveFor(ceo, operator)).toBe(true);
  });

  it("lower authority cannot approve for higher", () => {
    expect(canApproveFor(operator, ceo)).toBe(false);
  });
});

describe("requiresMultiApproval", () => {
  it("always true for critical risk", () => {
    expect(requiresMultiApproval("critical", 0)).toBe(true);
  });

  it("true for high risk with large financial impact", () => {
    expect(requiresMultiApproval("high", 100000)).toBe(true);
  });

  it("false for medium risk", () => {
    expect(requiresMultiApproval("medium", 10000)).toBe(false);
  });
});

describe("getCapabilitiesForLevel", () => {
  it("viewer level gets only analysis.view", () => {
    const caps = getCapabilitiesForLevel(10);
    expect(caps).toContain("analysis.view");
    expect(caps).not.toContain("task.create");
  });

  it("admin level (90) gets simulation.approve", () => {
    const caps = getCapabilitiesForLevel(90);
    expect(caps).toContain("simulation.approve");
    expect(caps).toContain("decision.approve");
  });
});
