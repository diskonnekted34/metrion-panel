/**
 * Enterprise Authorization Types — 4-Layer Model
 * Layer 1: System Roles (platform-level)
 * Layer 2: Organizational Levels (immutable rank)
 * Layer 3: Functional Roles (capability blocks)
 * Layer 4: Policy & Permission Engine (dynamic authorization)
 */

// ── Layer 1: System Roles ──────────────────────────────
export type SystemRole =
  | "owner"
  | "system_admin"
  | "security_admin"
  | "billing_admin";

// ── Layer 2: Organizational Levels ─────────────────────
export type OrgLevel =
  | "executive"
  | "department_director"
  | "manager"
  | "lead"
  | "specialist"
  | "contributor"
  | "viewer";

export const ORG_LEVEL_HIERARCHY: Record<OrgLevel, number> = {
  executive: 0,
  department_director: 1,
  manager: 2,
  lead: 3,
  specialist: 4,
  contributor: 5,
  viewer: 6,
};

export const ORG_LEVEL_LABELS: Record<OrgLevel, string> = {
  executive: "Executive (C-Level)",
  department_director: "Departman Direktörü",
  manager: "Müdür",
  lead: "Lider",
  specialist: "Uzman",
  contributor: "Katkıda Bulunan",
  viewer: "İzleyici",
};

// ── Layer 3: Functional Roles ──────────────────────────
export type FunctionalRole =
  | "approval_authority"
  | "dept_primary_approver"
  | "org_primary_approver"
  | "integration_manager"
  | "tech_integration_manager"
  | "report_publisher"
  | "risk_officer"
  | "budget_controller"
  | "okr_owner";

export const FUNCTIONAL_ROLE_LABELS: Record<FunctionalRole, string> = {
  approval_authority: "Onay Yetkisi",
  dept_primary_approver: "Departman Onaylayıcısı",
  org_primary_approver: "Organizasyon Onaylayıcısı",
  integration_manager: "Entegrasyon Yöneticisi",
  tech_integration_manager: "Teknik Entegrasyon Yöneticisi",
  report_publisher: "Rapor Yayıncısı",
  risk_officer: "Risk Sorumlusu",
  budget_controller: "Bütçe Kontrolörü",
  okr_owner: "OKR Sahibi",
};

// ── Layer 4: Permission Model ──────────────────────────

export type PermissionAction =
  | "view"
  | "create"
  | "propose"
  | "approve"
  | "execute"
  | "admin";

export type PermissionResource =
  | "dashboard"
  | "report"
  | "decision"
  | "action"
  | "task"
  | "alert"
  | "integration"
  | "tech_integration"
  | "department"
  | "organization"
  | "seat"
  | "agent_workspace"
  | "settings"
  | "billing"
  | "okr"
  | "strategy"
  | "analysis"
  | "marketplace"
  | "creative_workspace"
  | "position_history"
  | "approval_policy"
  | "user_roles";

// Scope types
export type ScopeType = "org" | "dept" | "seat" | "self" | "tag";

export interface PermissionScope {
  type: ScopeType;
  /** For dept: department id. For seat: seat key. For tag: classification tag. */
  target?: string;
}

export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
  scope: PermissionScope;
}

// ── Data Classification ────────────────────────────────
export type DataClassificationTag =
  | "public"
  | "departmental"
  | "executive_confidential"
  | "restricted"
  | "pii"
  | "risk_high"
  | "budget_sensitive";

export const CLASSIFICATION_LABELS: Record<DataClassificationTag, string> = {
  public: "Genel (Şirket İçi)",
  departmental: "Departman Bazlı",
  executive_confidential: "Yönetim Gizli",
  restricted: "Kısıtlı (PII/Secret)",
  pii: "Kişisel Veri",
  risk_high: "Yüksek Risk",
  budget_sensitive: "Bütçe Hassas",
};

export const CLASSIFICATION_SEVERITY: Record<DataClassificationTag, number> = {
  public: 0,
  departmental: 1,
  executive_confidential: 2,
  budget_sensitive: 2,
  risk_high: 3,
  pii: 3,
  restricted: 4,
};

// ── User Authorization Profile ─────────────────────────
export interface AuthorizationProfile {
  user_id: string;
  tenant_id: string;
  level: OrgLevel;
  system_roles: SystemRole[];
  functional_roles: FunctionalRole[];
  department_ids: string[];
  /** Seat key if assigned */
  seat_key?: string | null;
}

// ── Approval Rule ──────────────────────────────────────
export interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  condition: {
    resource: PermissionResource;
    action?: PermissionAction;
    tags?: DataClassificationTag[];
    minAmount?: number;
    riskScoreAbove?: number;
    department?: string;
  };
  required_roles: FunctionalRole[];
  min_approvals: number;
  escalation_to?: FunctionalRole;
  enabled: boolean;
}

// ── Route Access Rule ──────────────────────────────────
export interface RouteAccessRule {
  path: string;
  label: string;
  /** Minimum level required (or null = any level with correct permissions) */
  min_level?: OrgLevel;
  /** Required system roles (any match) */
  system_roles?: SystemRole[];
  /** Required functional roles (any match) */
  functional_roles?: FunctionalRole[];
  /** Required permission (checked via can()) */
  required_permission?: Pick<Permission, "resource" | "action">;
  /** Scope constraint */
  scope_constraint?: ScopeType;
}

// ── Policy Evaluation Result ───────────────────────────
export interface AuthorizationResult {
  allowed: boolean;
  reason: string;
  classification?: DataClassificationTag;
  requires_approval?: boolean;
  approval_rule_id?: string;
}

// ── Serializable permission string format ──────────────
export type PermissionString = `${PermissionResource}.${PermissionAction}.${string}`;

export function parsePermissionString(str: string): Permission | null {
  const parts = str.split(".");
  if (parts.length < 3) return null;
  const [resource, action, ...scopeParts] = parts;
  const scopeStr = scopeParts.join(".");
  let scope: PermissionScope;

  if (scopeStr === "org") {
    scope = { type: "org" };
  } else if (scopeStr === "self") {
    scope = { type: "self" };
  } else if (scopeStr.startsWith("dept:")) {
    scope = { type: "dept", target: scopeStr.slice(5) };
  } else if (scopeStr.startsWith("seat:")) {
    scope = { type: "seat", target: scopeStr.slice(5) };
  } else if (scopeStr.startsWith("tag:")) {
    scope = { type: "tag", target: scopeStr.slice(4) };
  } else {
    scope = { type: "org" };
  }

  return {
    resource: resource as PermissionResource,
    action: action as PermissionAction,
    scope,
  };
}

export function toPermissionString(p: Permission): PermissionString {
  const scopeStr =
    p.scope.type === "org" || p.scope.type === "self"
      ? p.scope.type
      : `${p.scope.type}:${p.scope.target ?? ""}`;
  return `${p.resource}.${p.action}.${scopeStr}` as PermissionString;
}
