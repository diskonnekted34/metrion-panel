/**
 * V1 API Contract — Authentication & Identity
 */

// ── Requests ────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ── Responses ───────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface LoginResponse {
  tokens: TokenPair;
  user: User;
}

export interface RefreshResponse {
  tokens: TokenPair;
}

export interface MeResponse {
  user: User;
  tenant: Tenant;
  membership: Membership;
  seat: Seat | null;
}

// ── Domain Objects ──────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  status: "active" | "invited" | "deactivated";
  lastLoginAt?: string;
  createdAt: string;
}

export type PlanTier = "core" | "performance" | "workforce" | "enterprise";

export interface TenantSettings {
  defaultCurrency: string;
  fiscalYearStart: number;
  timezone: string;
  aiProcessingCredits: number;
  autoTopUpEnabled: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  status: "active" | "suspended" | "trial";
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  tenantId: string;
  userId: string;
  legacyRole: "owner" | "admin" | "department_lead" | "operator" | "viewer";
  invitedBy?: string;
  joinedAt: string;
}

export type AIMode = "advisory" | "hybrid" | "autonomous";

export type SeatCapability =
  | "analysis.view"
  | "action.draft.create"
  | "action.publish"
  | "task.create"
  | "task.assign"
  | "integration.connect"
  | "settings.thresholds"
  | "decision.propose"
  | "decision.approve"
  | "decision.reject"
  | "simulation.create"
  | "simulation.approve";

export interface Seat {
  id: string;
  tenantId: string;
  seatKey: string;
  label: string;
  departmentKey: string;
  authorityLevel: number;
  aiMode: AIMode;
  humanUserId: string | null;
  capabilities: SeatCapability[];
  createdAt: string;
}
