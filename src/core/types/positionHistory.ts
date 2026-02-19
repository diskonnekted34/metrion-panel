/**
 * Position History domain types.
 * CEO-only governance module for tracking executive position assignments,
 * scope changes, and handover quality.
 */

export type PositionLevel = "C_LEVEL" | "DIRECTOR" | "MANAGER" | "IC";
export type AssignmentType = "PERMANENT" | "ACTING";
export type TransitionReason =
  | "RESIGNED"
  | "PROMOTED"
  | "TERMINATED"
  | "REORG"
  | "BACKFILL"
  | "ACTING_APPOINTMENT"
  | "OTHER";

export type PositionStatus = "ACTIVE" | "VACANT" | "ACTING";
export type HandoverQuality = "GOOD" | "RISKY" | "UNKNOWN";

export interface Position {
  id: string;
  org_id: string;
  title: string;
  department: string;
  level: PositionLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  org_id: string;
  full_name: string;
  email: string;
  employment_status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface PositionAssignment {
  id: string;
  org_id: string;
  position_id: string;
  person_id: string;
  assignment_type: AssignmentType;
  start_date: string;
  end_date: string | null;
  transition_reason: TransitionReason;
  approved_by: string[];
  approved_at: string | null;
  notes_private: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScopeSnapshot {
  responsibilities: string[];
  budget_limit: number;
  approval_level: string;
  direct_reports_count: number;
  okr_ownership: string[];
  systems_owned: string[];
}

export interface PositionScopeSnapshot {
  id: string;
  org_id: string;
  assignment_id: string;
  scope_json: ScopeSnapshot;
  captured_at: string;
}

export interface HandoverChecklist {
  id: string;
  org_id: string;
  assignment_id: string;
  completion_percent: number;
  open_items_count: number;
  open_items: string[];
  docs_links: string[];
  meetings_count: number;
  access_handover: {
    tools: string[];
    completed: boolean;
    completed_at: string | null;
  };
  time_to_productivity: {
    d30: "on_track" | "delayed" | "not_started";
    d60: "on_track" | "delayed" | "not_started";
    d90: "on_track" | "delayed" | "not_started";
  } | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  org_id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/* ── Derived / Computed types ── */

export interface PositionDerivedMetrics {
  tenure_days: number;
  changes_12m: number;
  changes_24m: number;
  vacancy_days: number;
  avg_tenure_days: number;
  acting_ratio: number;
  stability_score: number;
  handover_quality: HandoverQuality;
  status: PositionStatus;
}

export interface PositionWithMetrics extends Position {
  current_holder: Person | null;
  current_assignment: PositionAssignment | null;
  assignments: PositionAssignment[];
  metrics: PositionDerivedMetrics;
  last_transition_reason: TransitionReason | null;
}
