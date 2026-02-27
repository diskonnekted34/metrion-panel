/**
 * V1 API Contract — Governance (Decisions & Actions)
 */

// ── Decision States ─────────────────────────────────────
export type DecisionState =
  | "draft"
  | "review"
  | "approval_pending"
  | "approved"
  | "rejected"
  | "archived";

// ── Action States ───────────────────────────────────────
export type ActionState =
  | "draft"
  | "approval_pending"
  | "queued"
  | "executing"
  | "completed"
  | "failed"
  | "rolled_back";

// ── Risk / Impact ───────────────────────────────────────
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type StrategicCategory = "operational" | "strategic" | "structural";
export type ImpactDomain = "financial" | "operational" | "strategic" | "compliance" | "workforce";

export interface FinancialImpact {
  currency: string;
  estimatedValue: number;
  confidencePct: number;
  timeHorizonDays: number;
}

export interface KPIAttachment {
  kpiKey: string;
  kpiLabel: string;
  baselineValue: number;
  targetValue: number;
  currentValue?: number;
  monitoringDurationDays: number;
}

export interface ScenarioSet {
  best: { label: string; value: number };
  base: { label: string; value: number };
  worst: { label: string; value: number };
}

// ── Decision ────────────────────────────────────────────
export interface Decision {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  state: DecisionState;
  category: StrategicCategory;
  departmentKey: string;
  proposingSeat: string;
  priorityScore: number;
  riskLevel: RiskLevel;
  aiConfidencePct: number;
  financialImpact: FinancialImpact;
  delayRisk: { daysThreshold: number; estimatedLoss: number };
  kpiAttachments: KPIAttachment[];
  aiReasoning: string;
  dataSources: string[];
  scenarios: ScenarioSet;
  requiredApprovers: string[];
  overrideEvents: OverrideEvent[];
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
}

export interface OverrideEvent {
  id: string;
  seatKey: string;
  action: "approve" | "reject" | "override";
  reason: string;
  aiCounterArgument?: string;
  timestamp: string;
}

// ── Decision Approval ───────────────────────────────────
export interface DecisionApproval {
  id: string;
  tenantId: string;
  decisionId: string;
  seatKey: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  aiCounterArgument?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── Action ──────────────────────────────────────────────
export interface Action {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  state: ActionState;
  sourceDecisionId?: string;
  departmentKey: string;
  responsibleSeat: string;
  riskLevel: RiskLevel;
  financialImpact: FinancialImpact;
  targetKpi?: KPIAttachment;
  idempotencyKey: string;
  executionAttempts: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ── Action Approval ─────────────────────────────────────
export interface ActionApproval {
  id: string;
  tenantId: string;
  actionId: string;
  seatKey: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── Approval Policy ─────────────────────────────────────
export interface ApprovalPolicy {
  id: string;
  tenantId: string;
  entityType: "decision" | "action";
  departmentKey?: string;
  riskLevel: RiskLevel;
  financialThreshold?: number;
  requiredSeats: string[];
  minimumApprovalCount: number;
  description: string;
}
