/**
 * Security Policy Types — ABAC-style authorization
 * Phase 1: Frontend-only policy evaluation
 */

import type { UserRole } from "@/contexts/RBACContext";
import type { SeatKey } from "@/core/types/identity";

// ── Policy Actions ──────────────────────────────────────
export type PolicyAction =
  | "READ"
  | "WRITE"
  | "APPROVE"
  | "REJECT"
  | "EXECUTE"
  | "REVEAL_SECRET"
  | "REVEAL_SENSITIVE"
  | "DELETE"
  | "TRANSITION"
  | "ASSIGN_SEAT"
  | "CHANGE_AI_MODE"
  | "MODIFY_BUDGET";

// ── Resource Types ──────────────────────────────────────
export type ResourceType =
  | "Decision"
  | "Action"
  | "OKR"
  | "Integration"
  | "Governance"
  | "Seat"
  | "AuditLog"
  | "Secret";

// ── Data Classification ─────────────────────────────────
export type DataClassification = "public" | "sensitive" | "secret";

// ── Policy Request ──────────────────────────────────────
export interface PolicyRequest {
  actor: {
    id: string;
    role: UserRole;
    seat_key?: SeatKey | null;
    tenant_id: string;
  };
  resource: {
    type: ResourceType;
    id?: string;
    state?: string;
    owner_id?: string;
    classification?: DataClassification;
  };
  action: PolicyAction;
  context?: Record<string, unknown>;
}

// ── Policy Result ───────────────────────────────────────
export interface PolicyResult {
  allowed: boolean;
  reason: string;
  classification?: DataClassification;
}

// ── Field Classification Map ────────────────────────────
export type FieldClassificationMap = Record<string, DataClassification>;
