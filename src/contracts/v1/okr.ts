/**
 * V1 API Contract — OKR
 */

export type CycleType = "annual" | "quarterly" | "custom";
export type CycleStatus = "planned" | "active" | "closed";
export type ObjectiveLevel = "strategic" | "tactical";
export type ObjectiveStatus = "active" | "paused" | "closed";
export type KrStatus = "on_track" | "at_risk" | "behind" | "completed";
export type KrMetricType = "currency" | "percentage" | "count" | "ratio" | "score";

export interface OkrCycle {
  id: string;
  tenantId: string;
  label: string;
  type: CycleType;
  status: CycleStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Objective {
  id: string;
  tenantId: string;
  cycleId: string;
  parentId?: string;
  ownerSeat: string;
  departmentKey: string;
  level: ObjectiveLevel;
  title: string;
  description: string;
  status: ObjectiveStatus;
  score: number;
  aiExplanation?: string;
  deviation?: number;
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  id: string;
  tenantId: string;
  objectiveId: string;
  ownerSeat: string;
  title: string;
  metricType: KrMetricType;
  unit: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number;
  status: KrStatus;
  updatedAt: string;
}

export interface OkrLink {
  id: string;
  tenantId: string;
  objectiveId: string;
  entityType: "decision" | "action";
  entityId: string;
  linkedAt: string;
}
