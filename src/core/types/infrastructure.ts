/**
 * Infrastructure Domain
 * Core tables: events, audit_logs, usage_logs, metric_packs
 */

import { SeatKey } from "./identity";

// ── Event (Outbox Pattern) ──────────────────────────────
export type EventType =
  | "decision.created"
  | "decision.state_changed"
  | "decision.approved"
  | "decision.rejected"
  | "decision.converted"
  | "action.created"
  | "action.state_changed"
  | "action.approved"
  | "action.executing"
  | "action.completed"
  | "action.failed"
  | "action.rolled_back"
  | "kpi.recalculated"
  | "risk.score_updated"
  | "alert.generated"
  | "simulation.created"
  | "simulation.completed"
  | "approval.requested"
  | "approval.resolved"
  | "seat.assigned"
  | "seat.unassigned"
  | "usage.credit_consumed"
  | "usage.limit_reached";

export type EventStatus = "pending" | "processed" | "failed";

export interface DomainEvent {
  id: string;
  tenant_id: string;
  event_type: EventType;
  entity_type: string;
  entity_id: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  correlation_id?: string;
  causation_id?: string;
  created_at: string;
  processed_at?: string;
}

// ── Audit Log ───────────────────────────────────────────
export type AuditActionType =
  | "create" | "update" | "delete"
  | "approve" | "reject" | "override"
  | "execute" | "rollback"
  | "login" | "logout"
  | "state_transition";

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  seat_key: SeatKey | null;
  entity_type: string;
  entity_id: string;
  action_type: AuditActionType;
  before_snapshot: Record<string, unknown> | null;
  after_snapshot: Record<string, unknown> | null;
  reason?: string;
  ip_address?: string;
  created_at: string;
}

// ── Usage Log ───────────────────────────────────────────
export type UsageCategory =
  | "analysis"
  | "simulation"
  | "action_execution"
  | "report_generation"
  | "ai_recommendation";

export interface UsageLog {
  id: string;
  tenant_id: string;
  user_id: string;
  seat_key?: SeatKey;
  category: UsageCategory;
  units_consumed: number;
  description: string;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
}

// ── Metric Pack (CQRS Read Model) ───────────────────────
export type MetricType =
  | "department_health"
  | "kpi_snapshot"
  | "risk_summary"
  | "decision_velocity"
  | "action_throughput"
  | "financial_overview"
  | "headcount_summary"
  | "revenue_forecast"
  | "pipeline_summary"
  | "retention_risk";

export interface MetricPack {
  id: string;
  tenant_id: string;
  department_key: string;
  metric_type: MetricType;
  payload: Record<string, unknown>;
  generated_at: string;
  valid_until: string;
}
