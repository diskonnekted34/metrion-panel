/**
 * Identity & Tenant Domain
 * Core tables: tenants, users, memberships, seats
 */

// ── Tenant ──────────────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "core" | "performance" | "workforce" | "enterprise";
  status: "active" | "suspended" | "trial";
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  default_currency: string;
  fiscal_year_start: number; // month 1-12
  timezone: string;
  ai_processing_credits: number;
  auto_top_up_enabled: boolean;
}

// ── User ────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  status: "active" | "invited" | "deactivated";
  last_login_at?: string;
  created_at: string;
}

// ── Membership (User ↔ Tenant join) ─────────────────────
export interface Membership {
  id: string;
  tenant_id: string;
  user_id: string;
  /** Deprecated RBAC role – kept for backward compat, seat authority is primary */
  legacy_role: "owner" | "admin" | "department_lead" | "operator" | "viewer";
  invited_by?: string;
  joined_at: string;
}

// ── Seat Level (7-tier hierarchy) ───────────────────────
export type SeatLevel =
  | "ceo"
  | "c_level"
  | "director"
  | "manager"
  | "lead"
  | "specialist"
  | "junior"
  | "intern";

export const SEAT_LEVEL_ORDER: Record<SeatLevel, number> = {
  ceo: 0,
  c_level: 1,
  director: 2,
  manager: 3,
  lead: 4,
  specialist: 5,
  junior: 6,
  intern: 7,
};

export const SEAT_LEVEL_LABELS: Record<SeatLevel, string> = {
  ceo: "CEO",
  c_level: "C-Level",
  director: "Direktör",
  manager: "Müdür",
  lead: "Lider",
  specialist: "Uzman",
  junior: "Junior",
  intern: "Stajyer",
};

// AI can only be Specialist and above
export function canBeAI(level: SeatLevel): boolean {
  return SEAT_LEVEL_ORDER[level] <= SEAT_LEVEL_ORDER["specialist"];
}

// ── Seat Authority Model ────────────────────────────────
export type SeatKey =
  | "CEO" | "CFO" | "CTO" | "CIO" | "CMO" | "COO" | "CHRO"
  | "SALES_DIRECTOR" | "CREATIVE_DIRECTOR" | "LEGAL_COUNSEL"
  | "MARKETPLACE_LEAD" | "HR_ANALYTICS" | "TALENT_ACQUISITION"
  | "COMPENSATION_LEAD" | "REVENUE_INTEL" | "SALES_OPS"
  | "CUSTOMER_SUCCESS" | "GROWTH_LEAD" | "ACCOUNTING_LEAD"
  | "INVENTORY_LEAD" | "GRAPHIC_DESIGNER" | "ART_DIRECTOR"
  | "FINANCE_CONTROLLER" | "PRODUCT_MANAGER" | "PEOPLE_OPS"
  | "ACCOUNT_MANAGER" | "COMPLIANCE_LEAD" | "MARKETING_MANAGER"
  | "CONTENT_LEAD" | "OPS_MANAGER" | "STRATEGIC_INTEL"
  | "RISK_ANALYST" | "FORECAST_ENGINE" | "DEVOPS_LEAD"
  // New specialist/lead roles
  | "DATA_ENGINEER" | "FRONTEND_LEAD" | "BACKEND_LEAD"
  | "QA_LEAD" | "UX_RESEARCHER" | "PERFORMANCE_MARKETER"
  | "SEO_SPECIALIST" | "SOCIAL_MEDIA_SPECIALIST"
  | "SUPPLY_CHAIN_LEAD" | "LOGISTICS_SPECIALIST"
  | "PAYROLL_SPECIALIST" | "TRAINING_LEAD"
  | "BIZ_DEV_LEAD" | "CUSTOMER_SUPPORT_LEAD"
  // Junior & Intern
  | "JUNIOR_DEV" | "JUNIOR_DESIGNER" | "JUNIOR_MARKETER"
  | "JUNIOR_ANALYST" | "JUNIOR_SALES"
  | "INTERN_TECH" | "INTERN_MARKETING" | "INTERN_FINANCE" | "INTERN_HR";

export type AIMode = "advisory" | "hybrid" | "autonomous";

export interface Seat {
  id: string;
  tenant_id: string;
  seat_key: SeatKey;
  label: string;
  department_key: string;
  authority_level: number; // 1-100, higher = more authority
  ai_mode: AIMode;
  human_user_id: string | null; // null = AI-only seat
  capabilities: SeatCapability[];
  created_at: string;
}

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

// ── Authority Helpers ───────────────────────────────────
export interface SeatAuthorityCheck {
  seat_key: SeatKey;
  has_capability: (cap: SeatCapability) => boolean;
  authority_level: number;
  ai_mode: AIMode;
  is_human_occupied: boolean;
}
