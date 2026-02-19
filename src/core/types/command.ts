/**
 * Command Structure Domain
 * Budget allocation, visibility, approval levels, governance monitoring
 */

import type { SeatKey } from "./identity";
import type { DepartmentId } from "@/contexts/RBACContext";

// ── AI Mode (extended) ──────────────────────────────────
export type CommandAIMode = "advisory" | "hybrid" | "autonomous" | "locked";

export const AI_MODE_LABELS: Record<CommandAIMode, string> = {
  advisory: "AI Danışman",
  hybrid: "Hibrit",
  autonomous: "Tam Otopilot",
  locked: "AI Kilitli",
};

export const AI_MODE_COLORS: Record<CommandAIMode, string> = {
  advisory: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  hybrid: "text-primary bg-primary/10 border-primary/30",
  autonomous: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  locked: "text-muted-foreground bg-muted/50 border-border",
};

// ── Budget ──────────────────────────────────────────────
export interface RoleBudget {
  annual_limit: number;
  monthly_active: number;
  spent: number;
  reserved: number;
  available: number;
  currency: string;
}

// ── Visibility Scope ────────────────────────────────────
export interface VisibilityScope {
  departments: DepartmentId[];
  decisions: boolean;
  budgets: boolean;
  okrs: boolean;
  risk_reports: boolean;
}

// ── Approval Config ─────────────────────────────────────
export interface ApprovalConfig {
  level: number; // 1-5
  financial_limit: number;
  strategic_authority: boolean;
}

// ── Command Seat (enriched) ─────────────────────────────
export interface CommandSeat {
  id: string;
  seat_key: SeatKey;
  label: string;
  title: string;
  department_key: string;
  department_label: string;
  parent_seat_key: SeatKey | null;
  authority_level: number;
  ai_mode: CommandAIMode;
  assigned_human: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  budget: RoleBudget;
  approval: ApprovalConfig;
  visibility: VisibilityScope;
  escalation_scope: SeatKey[];
  linked_okr_ids: string[];
  kpi_responsibilities: string[];
  decision_volume_30d: number;
  risk_exposure: "low" | "medium" | "high" | "critical";
  override_count: number;
  ai_challenge_count: number;
  last_activity: string;
}

// ── Governance Event ────────────────────────────────────
export type GovernanceEventType =
  | "role_update"
  | "budget_change"
  | "approval_change"
  | "visibility_change"
  | "ai_mode_change"
  | "human_assigned"
  | "human_removed";

export interface GovernanceEvent {
  id: string;
  seat_key: SeatKey;
  event_type: GovernanceEventType;
  changed_by: string;
  old_value: string;
  new_value: string;
  timestamp: string;
}

// ── Hierarchy Node (for tree) ───────────────────────────
export interface HierarchyNode {
  seat: CommandSeat;
  children: HierarchyNode[];
}

// ── Governance Summary ──────────────────────────────────
export interface GovernanceSummary {
  total_seats: number;
  human_assigned: number;
  ai_seats: number;
  total_budget_exposure: number;
  active_approvals: number;
  escalations: number;
  overall_risk: "low" | "medium" | "high" | "critical";
  override_count: number;
}
