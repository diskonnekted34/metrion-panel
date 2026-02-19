/**
 * Deterministic tests for OKR domain engines.
 * Covers health score, risk score, deviation detection,
 * KR progress, success probability, and alignment.
 */

import { describe, it, expect } from "vitest";
import {
  calculateKRProgress,
  calculateObjectiveProgress,
  calculateExpectedProgress,
  calculateVelocity,
  calculateHealthScore,
  calculateRiskScore,
  calculateSuccessProbability,
  detectDeviation,
  recalculateObjectiveHealth,
  calculateStrategicHealthIndex,
  calculateDepartmentAlignments,
  calculateKRStatus,
} from "@/core/engine/okr";
import type { KeyResult, OKRCycle, Objective } from "@/core/types/okr";

// ── Helpers ─────────────────────────────────────────────
const makeKR = (overrides: Partial<KeyResult> = {}): KeyResult => ({
  id: "kr_test",
  tenant_id: "t1",
  objective_id: "obj_test",
  title: "Test KR",
  metric_type: "percentage",
  target_value: 100,
  current_value: 50,
  baseline_value: 0,
  aggregation_logic: "latest",
  data_source: "test",
  weight: 1,
  status: "on_track",
  last_calculated_at: new Date().toISOString(),
  ...overrides,
});

const makeCycle = (overrides: Partial<OKRCycle> = {}): OKRCycle => ({
  id: "cycle_test",
  tenant_id: "t1",
  name: "Test Cycle",
  type: "quarterly",
  start_date: "2026-01-01T00:00:00Z",
  end_date: "2026-03-31T23:59:59Z",
  status: "active",
  is_global: false,
  created_at: "2025-12-01T00:00:00Z",
  ...overrides,
});

const makeObjective = (overrides: Partial<Objective> = {}): Objective => ({
  id: "obj_test",
  tenant_id: "t1",
  cycle_id: "cycle_test",
  parent_objective_id: null,
  level: "tactical",
  owner_seat: "CTO",
  department_key: "technology",
  title: "Test Objective",
  description: "Test",
  status: "active",
  health_score: 70,
  risk_score: 30,
  probability_of_success: 65,
  health_explanation: {
    progress_component: "",
    risk_component: "",
    velocity_component: "",
    summary: "",
  },
  risk_explanation: "",
  success_explanation: "",
  deviation_flag: false,
  deviation_delta: 0,
  alignment_score: 80,
  created_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

// ── KR Progress ─────────────────────────────────────────
describe("calculateKRProgress", () => {
  it("returns 50% when halfway between baseline and target", () => {
    const kr = makeKR({ baseline_value: 0, target_value: 100, current_value: 50 });
    expect(calculateKRProgress(kr)).toBe(50);
  });

  it("clamps to 0% when below baseline", () => {
    const kr = makeKR({ baseline_value: 10, target_value: 100, current_value: 5 });
    expect(calculateKRProgress(kr)).toBe(0);
  });

  it("clamps to 100% when above target", () => {
    const kr = makeKR({ baseline_value: 0, target_value: 100, current_value: 150 });
    expect(calculateKRProgress(kr)).toBe(100);
  });

  it("handles zero-range (target == baseline)", () => {
    const kr = makeKR({ baseline_value: 50, target_value: 50, current_value: 50 });
    expect(calculateKRProgress(kr)).toBe(100);
  });

  it("handles zero-range below target", () => {
    const kr = makeKR({ baseline_value: 50, target_value: 50, current_value: 40 });
    expect(calculateKRProgress(kr)).toBe(0);
  });
});

// ── Objective Progress (weighted) ───────────────────────
describe("calculateObjectiveProgress", () => {
  it("returns weighted average of KR progress", () => {
    const krs = [
      makeKR({ weight: 0.6, target_value: 100, current_value: 80, baseline_value: 0 }),
      makeKR({ weight: 0.4, target_value: 100, current_value: 40, baseline_value: 0 }),
    ];
    // (80 * 0.6 + 40 * 0.4) / 1.0 = 48 + 16 = 64
    expect(calculateObjectiveProgress(krs)).toBeCloseTo(64, 1);
  });

  it("returns 0 for empty KR list", () => {
    expect(calculateObjectiveProgress([])).toBe(0);
  });
});

// ── Expected Progress ───────────────────────────────────
describe("calculateExpectedProgress", () => {
  it("returns 0 before cycle start", () => {
    const cycle = makeCycle({
      start_date: "2099-01-01T00:00:00Z",
      end_date: "2099-12-31T23:59:59Z",
    });
    expect(calculateExpectedProgress(cycle)).toBe(0);
  });

  it("returns 100 after cycle end", () => {
    const cycle = makeCycle({
      start_date: "2020-01-01T00:00:00Z",
      end_date: "2020-12-31T23:59:59Z",
    });
    expect(calculateExpectedProgress(cycle)).toBe(100);
  });
});

// ── Velocity ────────────────────────────────────────────
describe("calculateVelocity", () => {
  it("returns 1 when on track (progress == expected)", () => {
    expect(calculateVelocity(50, 50)).toBe(1);
  });

  it("clamps to 0 when progress is 0 and expected is high", () => {
    expect(calculateVelocity(0, 100)).toBe(0);
  });

  it("clamps to 2 when progress far exceeds expected", () => {
    expect(calculateVelocity(300, 50)).toBe(2);
  });

  it("returns 1 when expected is 0", () => {
    expect(calculateVelocity(50, 0)).toBe(1);
  });
});

// ── Health Score ────────────────────────────────────────
describe("calculateHealthScore", () => {
  it("produces higher score with high progress and low risk", () => {
    const { score: good } = calculateHealthScore(80, 10, 1.2);
    const { score: bad } = calculateHealthScore(20, 80, 0.5);
    expect(good).toBeGreaterThan(bad);
  });

  it("clamps between 0 and 100", () => {
    const { score: high } = calculateHealthScore(100, 0, 2);
    const { score: low } = calculateHealthScore(0, 100, 0);
    expect(high).toBeLessThanOrEqual(100);
    expect(low).toBeGreaterThanOrEqual(0);
  });

  it("includes explanation fields", () => {
    const { explanation } = calculateHealthScore(50, 30, 1);
    expect(explanation.progress_component).toBeDefined();
    expect(explanation.risk_component).toBeDefined();
    expect(explanation.velocity_component).toBeDefined();
    expect(explanation.summary).toBeDefined();
  });
});

// ── Risk Score ──────────────────────────────────────────
describe("calculateRiskScore", () => {
  it("returns higher risk for large deviation + slow velocity + little time", () => {
    const { score: highRisk } = calculateRiskScore(0.5, 0.4, 5, 90);
    const { score: lowRisk } = calculateRiskScore(0.05, 1.2, 80, 90);
    expect(highRisk).toBeGreaterThan(lowRisk);
  });

  it("clamps to 100 max", () => {
    const { score } = calculateRiskScore(2.0, 0, 0, 90);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ── Success Probability ─────────────────────────────────
describe("calculateSuccessProbability", () => {
  it("high progress + fast velocity + low risk = high probability", () => {
    const { probability } = calculateSuccessProbability(90, 1.5, 10);
    expect(probability).toBeGreaterThan(60);
  });

  it("clamps between 0 and 100", () => {
    const { probability: high } = calculateSuccessProbability(100, 2, 0);
    const { probability: low } = calculateSuccessProbability(0, 0, 100);
    expect(high).toBeLessThanOrEqual(100);
    expect(low).toBeGreaterThanOrEqual(0);
  });
});

// ── Deviation Detection ─────────────────────────────────
describe("detectDeviation", () => {
  it("flags when actual is > threshold behind expected", () => {
    const { flag, delta } = detectDeviation(40, 60, 0.15);
    expect(flag).toBe(true);
    expect(delta).toBeGreaterThan(0.15);
  });

  it("does not flag when on track", () => {
    const { flag } = detectDeviation(55, 60, 0.15);
    expect(flag).toBe(false);
  });

  it("does not flag when expected is 0", () => {
    const { flag, delta } = detectDeviation(0, 0);
    expect(flag).toBe(false);
    expect(delta).toBe(0);
  });
});

// ── KR Status ───────────────────────────────────────────
describe("calculateKRStatus", () => {
  it("returns completed at 100%", () => {
    const kr = makeKR({ target_value: 100, current_value: 100, baseline_value: 0 });
    expect(calculateKRStatus(kr, 50)).toBe("completed");
  });

  it("returns on_track when close to expected", () => {
    const kr = makeKR({ target_value: 100, current_value: 50, baseline_value: 0 });
    expect(calculateKRStatus(kr, 55)).toBe("on_track");
  });

  it("returns behind when far from expected", () => {
    const kr = makeKR({ target_value: 100, current_value: 10, baseline_value: 0 });
    expect(calculateKRStatus(kr, 80)).toBe("behind");
  });
});

// ── Strategic Health Index ──────────────────────────────
describe("calculateStrategicHealthIndex", () => {
  it("returns zero values for empty objective list", () => {
    const result = calculateStrategicHealthIndex([]);
    expect(result.overall_score).toBe(0);
    expect(result.at_risk_count).toBe(0);
    expect(result.on_track_count).toBe(0);
  });

  it("calculates averages correctly", () => {
    const objs = [
      makeObjective({ health_score: 80, risk_score: 20, deviation_flag: false, alignment_score: 90, deviation_delta: -5 }),
      makeObjective({ id: "obj2", health_score: 40, risk_score: 70, deviation_flag: true, alignment_score: 30, deviation_delta: 25 }),
    ];
    const result = calculateStrategicHealthIndex(objs);
    expect(result.overall_score).toBe(60); // avg(80,40)
    expect(result.at_risk_count).toBe(1); // risk > 60
    expect(result.on_track_count).toBe(1); // !deviation && health >= 60
  });
});

// ── Recalculate Objective Health (integration) ──────────
describe("recalculateObjectiveHealth", () => {
  it("returns health/risk/probability fields", () => {
    const obj = makeObjective();
    const krs = [
      makeKR({ weight: 0.5, target_value: 100, current_value: 70, baseline_value: 0 }),
      makeKR({ id: "kr2", weight: 0.5, target_value: 100, current_value: 30, baseline_value: 0 }),
    ];
    const cycle = makeCycle({
      start_date: "2020-01-01T00:00:00Z",
      end_date: "2099-12-31T23:59:59Z",
    });
    const updates = recalculateObjectiveHealth(obj, krs, cycle);
    expect(updates.health_score).toBeDefined();
    expect(updates.risk_score).toBeDefined();
    expect(updates.probability_of_success).toBeDefined();
    expect(typeof updates.deviation_flag).toBe("boolean");
  });
});

// ── Department Alignments ───────────────────────────────
describe("calculateDepartmentAlignments", () => {
  it("returns alignment per department", () => {
    const strategic = [makeObjective({ id: "s1", level: "strategic" })];
    const tactical = [
      makeObjective({ id: "t1", department_key: "marketing", parent_objective_id: "s1" }),
      makeObjective({ id: "t2", department_key: "sales", parent_objective_id: null }),
    ];
    const result = calculateDepartmentAlignments(tactical, strategic);
    expect(result.length).toBe(2);
    const marketing = result.find(r => r.department_key === "marketing");
    expect(marketing).toBeDefined();
    expect(marketing!.contribution_pct).toBeGreaterThan(0);
  });

  it("returns empty for no objectives", () => {
    expect(calculateDepartmentAlignments([], [])).toEqual([]);
  });
});
