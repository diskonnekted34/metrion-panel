/**
 * Tests for Position History derived metrics.
 * Validates stability score, tenure, vacancy, handover quality, and status.
 */

import { describe, it, expect } from "vitest";
import {
  computeTenure,
  countChanges,
  computeVacancyDays,
  computeAvgTenure,
  computeActingRatio,
  computeHandoverQuality,
  computePositionStatus,
  computeStabilityScore,
  daysBetween,
} from "@/lib/positionHistory/metrics";
import type { PositionAssignment, HandoverChecklist } from "@/core/types/positionHistory";

const makeAssignment = (overrides: Partial<PositionAssignment> = {}): PositionAssignment => ({
  id: "a1",
  org_id: "org1",
  position_id: "pos1",
  person_id: "p1",
  assignment_type: "PERMANENT",
  start_date: "2024-01-01",
  end_date: null,
  transition_reason: "BACKFILL",
  approved_by: ["admin"],
  approved_at: "2024-01-01",
  notes_private: null,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ...overrides,
});

describe("daysBetween", () => {
  it("returns 0 for same date", () => {
    expect(daysBetween("2024-01-01", "2024-01-01")).toBe(0);
  });
  it("returns correct number of days", () => {
    expect(daysBetween("2024-01-01", "2024-01-31")).toBe(30);
  });
});

describe("computeTenure", () => {
  it("returns 0 for null assignment", () => {
    expect(computeTenure(null)).toBe(0);
  });
  it("calculates tenure from start to now param", () => {
    const a = makeAssignment({ start_date: "2025-01-01", end_date: null });
    expect(computeTenure(a, "2025-04-01")).toBe(90);
  });
  it("calculates tenure from start to end_date", () => {
    const a = makeAssignment({ start_date: "2024-01-01", end_date: "2024-07-01" });
    expect(computeTenure(a)).toBe(182);
  });
});

describe("countChanges", () => {
  it("counts assignments within 12M range", () => {
    const assignments = [
      makeAssignment({ id: "a1", start_date: "2024-06-01", end_date: "2024-12-01" }),
      makeAssignment({ id: "a2", start_date: "2025-01-01", end_date: null }),
    ];
    expect(countChanges(assignments, 12, "2025-06-01")).toBe(2);
  });
  it("excludes assignments outside range", () => {
    const assignments = [
      makeAssignment({ id: "a1", start_date: "2022-01-01", end_date: "2022-06-01" }),
      makeAssignment({ id: "a2", start_date: "2025-01-01", end_date: null }),
    ];
    expect(countChanges(assignments, 12, "2025-06-01")).toBe(1);
  });
});

describe("computeVacancyDays", () => {
  it("returns 0 with single assignment", () => {
    expect(computeVacancyDays([makeAssignment()], 24)).toBe(0);
  });
  it("calculates gap between consecutive assignments", () => {
    const assignments = [
      makeAssignment({ id: "a1", start_date: "2024-01-01", end_date: "2024-06-01" }),
      makeAssignment({ id: "a2", start_date: "2024-07-01", end_date: null }),
    ];
    expect(computeVacancyDays(assignments, 24, "2025-01-01")).toBe(30);
  });
  it("returns 0 when no gaps", () => {
    const assignments = [
      makeAssignment({ id: "a1", start_date: "2024-01-01", end_date: "2024-06-01" }),
      makeAssignment({ id: "a2", start_date: "2024-06-01", end_date: null }),
    ];
    expect(computeVacancyDays(assignments, 24, "2025-01-01")).toBe(0);
  });
});

describe("computeAvgTenure", () => {
  it("returns 0 for no closed assignments", () => {
    expect(computeAvgTenure([makeAssignment({ end_date: null })])).toBe(0);
  });
  it("averages closed assignments", () => {
    const assignments = [
      makeAssignment({ start_date: "2024-01-01", end_date: "2024-07-01" }), // 182 days
      makeAssignment({ start_date: "2024-07-01", end_date: "2024-10-01" }), // 92 days
    ];
    expect(computeAvgTenure(assignments)).toBe(137);
  });
});

describe("computeActingRatio", () => {
  it("returns 0 when no acting assignments", () => {
    const assignments = [makeAssignment({ assignment_type: "PERMANENT", start_date: "2024-01-01", end_date: null })];
    expect(computeActingRatio(assignments, 24, "2025-01-01")).toBe(0);
  });
  it("returns ratio > 0 with acting periods", () => {
    const assignments = [
      makeAssignment({ assignment_type: "ACTING", start_date: "2024-01-01", end_date: "2024-07-01" }),
      makeAssignment({ assignment_type: "PERMANENT", start_date: "2024-07-01", end_date: null }),
    ];
    const ratio = computeActingRatio(assignments, 24, "2025-01-01");
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeLessThanOrEqual(1);
  });
});

describe("computeHandoverQuality", () => {
  it("returns UNKNOWN for null checklist", () => {
    expect(computeHandoverQuality(null)).toBe("UNKNOWN");
  });
  it("returns GOOD for high completion + low open items", () => {
    const checklist = { completion_percent: 90, open_items_count: 1 } as HandoverChecklist;
    expect(computeHandoverQuality(checklist)).toBe("GOOD");
  });
  it("returns RISKY for low completion", () => {
    const checklist = { completion_percent: 30, open_items_count: 2 } as HandoverChecklist;
    expect(computeHandoverQuality(checklist)).toBe("RISKY");
  });
  it("returns RISKY for very high open items", () => {
    const checklist = { completion_percent: 70, open_items_count: 10 } as HandoverChecklist;
    expect(computeHandoverQuality(checklist)).toBe("RISKY");
  });
});

describe("computePositionStatus", () => {
  it("returns VACANT for null assignment", () => {
    expect(computePositionStatus(null)).toBe("VACANT");
  });
  it("returns VACANT for closed assignment", () => {
    expect(computePositionStatus(makeAssignment({ end_date: "2024-06-01" }))).toBe("VACANT");
  });
  it("returns ACTIVE for open permanent assignment", () => {
    expect(computePositionStatus(makeAssignment({ end_date: null, assignment_type: "PERMANENT" }))).toBe("ACTIVE");
  });
  it("returns ACTING for open acting assignment", () => {
    expect(computePositionStatus(makeAssignment({ end_date: null, assignment_type: "ACTING" }))).toBe("ACTING");
  });
});

describe("computeStabilityScore", () => {
  it("returns 100 for stable position (1 assignment, no vacancy, no acting)", () => {
    const a = [makeAssignment({ start_date: "2020-01-01", end_date: null, assignment_type: "PERMANENT" })];
    const score = computeStabilityScore(a, 0, 0, 12, "2025-01-01");
    expect(score).toBe(100);
  });
  it("decreases with more changes", () => {
    const a = [
      makeAssignment({ id: "a1", start_date: "2025-01-01", end_date: "2025-03-01" }),
      makeAssignment({ id: "a2", start_date: "2025-03-01", end_date: "2025-06-01" }),
      makeAssignment({ id: "a3", start_date: "2025-06-01", end_date: null }),
    ];
    const score = computeStabilityScore(a, 0, 0, 12, "2025-07-01");
    expect(score).toBeLessThan(100);
    expect(score).toBe(55); // 100 - 3*15 = 55
  });
  it("clamps to 0..100", () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      makeAssignment({ id: `a${i}`, start_date: `2025-0${(i % 9) + 1}-01`, end_date: i < 9 ? `2025-0${(i % 9) + 1}-15` : null })
    );
    const score = computeStabilityScore(many, 60, 0.5, 12, "2025-10-01");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
