/**
 * Governance Domain
 * Core tables: decisions, decision_approvals, actions, action_approvals
 * Lifecycle state machines for Decision and Action entities
 */

import { SeatKey } from "./identity";

// ── Decision Lifecycle ──────────────────────────────────
export type DecisionLifecycleState =
  | "draft"
  | "review"
  | "approval_pending"
  | "approved"
  | "rejected"
  | "converted_to_action"
  | "archived";

export const DECISION_TRANSITIONS: Record<DecisionLifecycleState, DecisionLifecycleState[]> = {
  draft: ["review", "archived"],
  review: ["approval_pending", "draft", "archived"],
  approval_pending: ["approved", "rejected", "review"],
  approved: ["converted_to_action", "archived"],
  rejected: ["draft", "archived"],
  converted_to_action: ["archived"],
  archived: [],
};

// ── Action Lifecycle ────────────────────────────────────
export type ActionLifecycleState =
  | "draft"
  | "approval_pending"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rolled_back";

export const ACTION_TRANSITIONS: Record<ActionLifecycleState, ActionLifecycleState[]> = {
  draft: ["approval_pending"],
  approval_pending: ["approved", "draft"],
  approved: ["executing"],
  executing: ["completed", "failed"],
  completed: [],
  failed: ["rolled_back", "draft"],
  rolled_back: ["draft"],
};

// ── Risk & Impact ───────────────────────────────────────
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type StrategicCategory = "operational" | "strategic" | "structural";
export type ImpactDomain = "financial" | "operational" | "strategic" | "compliance" | "workforce";

export interface FinancialImpact {
  currency: string;
  estimated_value: number;
  confidence_pct: number;
  time_horizon_days: number;
}

export interface KPIAttachment {
  kpi_key: string;
  kpi_label: string;
  baseline_value: number;
  target_value: number;
  monitoring_duration_days: number;
  current_value?: number;
}

// ── Decision ────────────────────────────────────────────
export interface Decision {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  state: DecisionLifecycleState;
  category: StrategicCategory;
  department_key: string;
  proposing_seat: SeatKey;
  priority_score: number; // 0-100
  risk_level: RiskLevel;
  ai_confidence_pct: number;
  financial_impact: FinancialImpact;
  delay_risk: {
    days_threshold: number;
    estimated_loss: number;
  };
  kpi_attachments: KPIAttachment[];
  ai_reasoning: string;
  data_sources: string[];
  scenarios: {
    best: { label: string; value: number };
    base: { label: string; value: number };
    worst: { label: string; value: number };
  };
  required_approvers: SeatKey[];
  override_events: OverrideEvent[];
  created_at: string;
  updated_at: string;
  decided_at?: string;
}

export interface OverrideEvent {
  id: string;
  seat_key: SeatKey;
  action: "approve" | "reject" | "override";
  reason: string;
  ai_counter_argument?: string;
  timestamp: string;
}

// ── Decision Approval ───────────────────────────────────
export interface DecisionApproval {
  id: string;
  tenant_id: string;
  decision_id: string;
  seat_key: SeatKey;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  ai_counter_argument?: string;
  created_at: string;
  resolved_at?: string;
}

// ── Action ──────────────────────────────────────────────
export interface Action {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  state: ActionLifecycleState;
  source_decision_id?: string;
  department_key: string;
  responsible_seat: SeatKey;
  risk_level: RiskLevel;
  financial_impact: FinancialImpact;
  target_kpi?: KPIAttachment;
  idempotency_key: string;
  execution_attempts: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// ── Action Approval ─────────────────────────────────────
export interface ActionApproval {
  id: string;
  tenant_id: string;
  action_id: string;
  seat_key: SeatKey;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  created_at: string;
  resolved_at?: string;
}

// ── Approval Policy ─────────────────────────────────────
export interface ApprovalPolicy {
  id: string;
  tenant_id: string;
  entity_type: "decision" | "action";
  department_key?: string; // null = global
  risk_level: RiskLevel;
  financial_threshold?: number;
  required_seats: SeatKey[];
  minimum_approval_count: number;
  description: string;
}
