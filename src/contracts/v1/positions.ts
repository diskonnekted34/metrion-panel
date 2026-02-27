/**
 * V1 API Contract — Position History
 */

import type { AuditLog } from "./api";

export type PositionLevel = "C_LEVEL" | "DIRECTOR" | "MANAGER" | "IC";
export type AssignmentType = "PERMANENT" | "ACTING";
export type TransitionReason =
  | "RESIGNED" | "PROMOTED" | "TERMINATED" | "REORG"
  | "BACKFILL" | "ACTING_APPOINTMENT" | "OTHER";
export type PositionStatus = "ACTIVE" | "VACANT" | "ACTING";
export type HandoverQuality = "GOOD" | "RISKY" | "UNKNOWN";

export interface Person {
  id: string;
  fullName: string;
  email: string;
  employmentStatus: "ACTIVE" | "INACTIVE";
}

export interface PositionAssignment {
  id: string;
  positionId: string;
  personId: string;
  assignmentType: AssignmentType;
  startDate: string;
  endDate: string | null;
  transitionReason: TransitionReason;
  approvedBy: string[];
  approvedAt: string | null;
}

export interface PositionMetrics {
  tenureDays: number;
  changes12m: number;
  changes24m: number;
  vacancyDays: number;
  avgTenureDays: number;
  actingRatio: number;
  stabilityScore: number;
  handoverQuality: HandoverQuality;
  status: PositionStatus;
}

export interface PositionWithMetrics {
  id: string;
  tenantId: string;
  title: string;
  department: string;
  level: PositionLevel;
  isActive: boolean;
  currentHolder: Person | null;
  currentAssignment: PositionAssignment | null;
  assignments: PositionAssignment[];
  metrics: PositionMetrics;
  lastTransitionReason: TransitionReason | null;
}

/** Re-export AuditLog for position-related audit trails */
export type { AuditLog };
