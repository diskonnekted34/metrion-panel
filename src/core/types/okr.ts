/**
 * OKR Domain
 * Core tables: okr_cycles, objectives, key_results, okr_links
 * Plan-segmented: Core (disabled), Performance (lite), Workforce (full)
 */

import { SeatKey } from "./identity";

// ── Plan Feature Gates ──────────────────────────────────
export type OKRPlanLevel = "disabled" | "performance" | "workforce";

export function getOKRPlanLevel(plan: string): OKRPlanLevel {
  if (plan === "workforce" || plan === "enterprise") return "workforce";
  if (plan === "performance") return "performance";
  return "disabled";
}

export const OKR_PLAN_LIMITS = {
  performance: {
    maxActiveCycles: 1,
    maxObjectivesPerCycle: 10,
    hierarchyEnabled: false,
    aiCorrectionEnabled: false,
    multiCycleEnabled: false,
    alignmentEnabled: false,
    autoMetricBinding: false,
    deviationConfigurable: false,
  },
  workforce: {
    maxActiveCycles: 10,
    maxObjectivesPerCycle: 100,
    hierarchyEnabled: true,
    aiCorrectionEnabled: true,
    multiCycleEnabled: true,
    alignmentEnabled: true,
    autoMetricBinding: true,
    deviationConfigurable: true,
  },
} as const;

// ── OKR Cycle ───────────────────────────────────────────
export type CycleType = "annual" | "quarterly" | "custom";
export type CycleStatus = "planned" | "active" | "closed";

export interface OKRCycle {
  id: string;
  tenant_id: string;
  name: string;
  type: CycleType;
  start_date: string;
  end_date: string;
  status: CycleStatus;
  is_global: boolean;
  created_at: string;
}

// ── Objective ───────────────────────────────────────────
export type ObjectiveLevel = "strategic" | "tactical";
export type ObjectiveStatus = "active" | "paused" | "closed";

export interface ObjectiveHealthExplanation {
  progress_component: string;
  risk_component: string;
  velocity_component: string;
  summary: string;
}

export interface Objective {
  id: string;
  tenant_id: string;
  cycle_id: string;
  parent_objective_id: string | null; // null for top-level; hierarchy only in Workforce
  level: ObjectiveLevel;
  owner_seat: SeatKey;
  department_key: string;
  title: string;
  description: string;
  status: ObjectiveStatus;
  // Computed scores
  health_score: number;         // 0-100
  risk_score: number;           // 0-100
  probability_of_success: number; // 0-100
  // Explanations (explainability requirement)
  health_explanation: ObjectiveHealthExplanation;
  risk_explanation: string;
  success_explanation: string;
  // Deviation
  deviation_flag: boolean;
  deviation_delta: number;      // % difference from expected
  // Alignment (Workforce only)
  alignment_score: number;      // 0-100
  created_at: string;
}

// ── Key Result ──────────────────────────────────────────
export type KRMetricType = "currency" | "percentage" | "count" | "ratio" | "score";
export type KRAggregation = "sum" | "average" | "latest" | "max" | "min";
export type KRStatus = "on_track" | "at_risk" | "behind" | "completed";

export interface KeyResult {
  id: string;
  tenant_id: string;
  objective_id: string;
  title: string;
  metric_type: KRMetricType;
  target_value: number;
  current_value: number;       // computed, never manually set
  baseline_value: number;
  aggregation_logic: KRAggregation;
  data_source: string;
  weight: number;              // 0-1, weights within objective sum to 1
  status: KRStatus;
  last_calculated_at: string;
}

// ── OKR Link (Decision/Action ↔ Objective) ──────────────
export type OKRLinkEntityType = "decision" | "action";

export interface OKRLink {
  id: string;
  tenant_id: string;
  entity_type: OKRLinkEntityType;
  entity_id: string;
  objective_id: string;
  impact_estimate: number;     // -100 to +100
  created_at: string;
}

// ── Corrective Decision Draft ───────────────────────────
export interface CorrectiveDecisionDraft {
  id: string;
  tenant_id: string;
  linked_objective_id: string;
  impact_estimate: number;
  recommended_action: string;
  rationale: string;           // explainable AI output
  simulation_option: string;
  risk_score: number;
  created_at: string;
  status: "draft" | "submitted" | "approved" | "rejected";
}

// ── Strategic Health Index (Workforce aggregate) ────────
export interface StrategicHealthIndex {
  overall_score: number;
  at_risk_count: number;
  on_track_count: number;
  misalignment_count: number;
  velocity_trend: "improving" | "stable" | "declining";
  explanation: string;
}

// ── Alignment Model (Workforce Only) ────────────────────
export interface DepartmentAlignment {
  department_key: string;
  contribution_pct: number;    // % contribution to strategic objectives
  coverage_completeness: number;
  conflict_factor: number;
  alignment_score: number;
  overlapping_objectives: string[];
  resource_strain: "low" | "medium" | "high";
}
