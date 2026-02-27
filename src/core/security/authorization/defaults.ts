/**
 * Default Policy Templates — MVP permission sets per level/role.
 * Default-deny: anything not listed here is forbidden.
 */

import type {
  OrgLevel,
  SystemRole,
  FunctionalRole,
  Permission,
  RouteAccessRule,
  ApprovalRule,
} from "./types";

// ── Helper to build permissions concisely ──────────────
function p(
  resource: Permission["resource"],
  action: Permission["action"],
  scope: Permission["scope"]["type"] = "org",
  target?: string
): Permission {
  return { resource, action, scope: { type: scope, target } };
}

// ── Default permissions by Organizational Level ────────
export const LEVEL_DEFAULT_PERMISSIONS: Record<OrgLevel, Permission[]> = {
  executive: [
    p("dashboard", "view"),
    p("report", "view"),
    p("decision", "view"),
    p("decision", "approve"),
    p("decision", "propose"),
    p("action", "view"),
    p("action", "propose"),
    p("strategy", "view"),
    p("analysis", "view"),
    p("okr", "view"),
    p("alert", "view"),
    p("organization", "view"),
    p("seat", "view"),
    p("position_history", "view"),
    p("agent_workspace", "view"),
    p("marketplace", "view"),
    p("integration", "view"),
    p("task", "view"),
    p("task", "create"),
  ],
  department_director: [
    p("dashboard", "view"),
    p("report", "view", "dept"),
    p("report", "create", "dept"),
    p("decision", "view", "dept"),
    p("decision", "propose", "dept"),
    p("decision", "approve", "dept"),
    p("action", "view", "dept"),
    p("action", "create", "dept"),
    p("action", "execute", "dept"),
    p("strategy", "view", "dept"),
    p("analysis", "view", "dept"),
    p("okr", "view", "dept"),
    p("okr", "create", "dept"),
    p("alert", "view", "dept"),
    p("organization", "view"),
    p("seat", "view", "dept"),
    p("agent_workspace", "view", "dept"),
    p("marketplace", "view"),
    p("task", "view", "dept"),
    p("task", "create", "dept"),
    p("integration", "view", "dept"),
  ],
  manager: [
    p("dashboard", "view"),
    p("report", "view", "dept"),
    p("decision", "view", "dept"),
    p("decision", "propose", "dept"),
    p("action", "view", "dept"),
    p("action", "create", "dept"),
    p("action", "execute", "dept"),
    p("strategy", "view", "dept"),
    p("analysis", "view", "dept"),
    p("okr", "view", "dept"),
    p("alert", "view", "dept"),
    p("organization", "view"),
    p("task", "view", "dept"),
    p("task", "create", "dept"),
    p("marketplace", "view"),
  ],
  lead: [
    p("dashboard", "view"),
    p("report", "view", "dept"),
    p("action", "view", "dept"),
    p("action", "create", "dept"),
    p("analysis", "view", "dept"),
    p("okr", "view", "dept"),
    p("alert", "view", "dept"),
    p("task", "view", "dept"),
    p("task", "create", "dept"),
    p("marketplace", "view"),
  ],
  specialist: [
    p("dashboard", "view"),
    p("report", "view", "dept"),
    p("analysis", "view", "dept"),
    p("decision", "create", "dept"),
    p("okr", "view", "dept"),
    p("alert", "view", "dept"),
    p("task", "view", "self"),
    p("task", "create", "self"),
    p("marketplace", "view"),
  ],
  contributor: [
    p("dashboard", "view"),
    p("decision", "create", "dept"),
    p("task", "view", "self"),
    p("task", "create", "self"),
    p("report", "view", "dept"),
    p("marketplace", "view"),
  ],
  viewer: [
    p("dashboard", "view"),
    p("report", "view"),
    p("marketplace", "view"),
  ],
};

// ── System role permissions (additive) ─────────────────
export const SYSTEM_ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  owner: [
    p("dashboard", "admin"),
    p("report", "admin"),
    p("decision", "admin"),
    p("action", "admin"),
    p("integration", "admin"),
    p("tech_integration", "admin"),
    p("organization", "admin"),
    p("seat", "admin"),
    p("settings", "admin"),
    p("billing", "admin"),
    p("okr", "admin"),
    p("strategy", "admin"),
    p("analysis", "admin"),
    p("alert", "admin"),
    p("task", "admin"),
    p("agent_workspace", "admin"),
    p("marketplace", "admin"),
    p("creative_workspace", "admin"),
    p("position_history", "admin"),
    p("approval_policy", "admin"),
    p("user_roles", "admin"),
  ],
  system_admin: [
    p("organization", "admin"),
    p("seat", "admin"),
    p("user_roles", "admin"),
    p("integration", "admin"),
    p("settings", "admin"),
  ],
  security_admin: [
    p("settings", "admin"),
    p("organization", "view"),
    p("approval_policy", "admin"),
    p("user_roles", "view"),
  ],
  billing_admin: [
    p("billing", "admin"),
    p("settings", "view"),
  ],
};

// ── Functional role permissions (additive) ─────────────
export const FUNCTIONAL_ROLE_PERMISSIONS: Record<FunctionalRole, Permission[]> = {
  approval_authority: [
    p("decision", "approve"),
    p("action", "approve"),
  ],
  dept_primary_approver: [
    p("decision", "approve", "dept"),
    p("action", "approve", "dept"),
  ],
  org_primary_approver: [
    p("decision", "approve"),
    p("action", "approve"),
  ],
  integration_manager: [
    p("integration", "admin"),
    p("integration", "execute"),
  ],
  tech_integration_manager: [
    p("tech_integration", "admin"),
    p("tech_integration", "execute"),
  ],
  report_publisher: [
    p("report", "execute"),
    p("report", "create"),
  ],
  risk_officer: [
    p("alert", "admin"),
    p("analysis", "admin"),
  ],
  budget_controller: [
    p("action", "approve"),
    p("okr", "approve"),
  ],
  okr_owner: [
    p("okr", "admin"),
    p("okr", "create"),
    p("okr", "approve"),
  ],
};

// ── Route access rules ─────────────────────────────────
export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  // Core
  { path: "/dashboard", label: "Merkez", required_permission: { resource: "dashboard", action: "view" } },
  { path: "/strategy", label: "Strateji", required_permission: { resource: "strategy", action: "view" } },
  { path: "/analysis", label: "Analiz", required_permission: { resource: "analysis", action: "view" } },
  { path: "/decision-lab", label: "Kararlar", required_permission: { resource: "decision", action: "view" } },
  { path: "/action-center", label: "Aksiyonlar", required_permission: { resource: "action", action: "view" } },
  { path: "/reports", label: "Raporlar", required_permission: { resource: "report", action: "view" } },
  { path: "/tasks", label: "Görevler", required_permission: { resource: "task", action: "view" } },
  { path: "/alerts", label: "Uyarılar", required_permission: { resource: "alert", action: "view" } },
  { path: "/okr", label: "OKR", required_permission: { resource: "okr", action: "view" } },

  // Organization
  { path: "/organization", label: "Organizasyon", required_permission: { resource: "organization", action: "view" } },
  { path: "/seat", label: "Kadro Detay", required_permission: { resource: "seat", action: "view" } },
  { path: "/executive/position-history", label: "Pozisyon Geçmişi", min_level: "executive" },

  // Data sources
  { path: "/data-sources", label: "Veri Kaynakları", required_permission: { resource: "integration", action: "view" } },
  { path: "/tech-data-sources", label: "Teknik Veri Kaynakları", required_permission: { resource: "tech_integration", action: "view" }, system_roles: ["owner"], functional_roles: ["tech_integration_manager"] },

  // Workspace
  { path: "/workspace", label: "Ajan Çalışma Alanı", required_permission: { resource: "agent_workspace", action: "view" } },
  { path: "/marketplace", label: "Marketplace", required_permission: { resource: "marketplace", action: "view" } },
  { path: "/creative-workspace", label: "Kreatif Alan", required_permission: { resource: "creative_workspace", action: "view" }, scope_constraint: "dept" },

  // Settings sub-sections
  { path: "/settings", label: "Ayarlar", required_permission: { resource: "settings", action: "view" } },
  { path: "/settings/billing", label: "Faturalandırma", system_roles: ["owner", "billing_admin"] },
  { path: "/settings/users", label: "Kullanıcılar & Roller", system_roles: ["owner", "system_admin"] },
  { path: "/settings/security", label: "Güvenlik & Denetim", system_roles: ["owner", "security_admin"] },
  { path: "/settings/policy-studio", label: "Policy Studio", system_roles: ["owner"] },
];

// ── Default approval rules ─────────────────────────────
export const DEFAULT_APPROVAL_RULES: ApprovalRule[] = [
  {
    id: "apr-budget-critical",
    name: "Bütçe Hassas Aksiyonlar",
    description: "Bütçe etiketli aksiyonlar için çift onay gerekir",
    condition: {
      resource: "action",
      action: "execute",
      tags: ["budget_sensitive"],
    },
    required_roles: ["dept_primary_approver", "budget_controller"],
    min_approvals: 2,
    enabled: true,
  },
  {
    id: "apr-high-risk",
    name: "Yüksek Risk Kararları",
    description: "Yüksek riskli kararlar org onay gerektirir",
    condition: {
      resource: "decision",
      action: "approve",
      riskScoreAbove: 80,
    },
    required_roles: ["org_primary_approver"],
    min_approvals: 1,
    escalation_to: "approval_authority",
    enabled: true,
  },
  {
    id: "apr-tech-integration",
    name: "Teknik Entegrasyon Bağlama",
    description: "Tech data source connect için CTO + Owner onayı",
    condition: {
      resource: "tech_integration",
      action: "execute",
    },
    required_roles: ["tech_integration_manager"],
    min_approvals: 1,
    enabled: true,
  },
  {
    id: "apr-report-publish",
    name: "Rapor Yayınlama",
    description: "Raporların dış paylaşımı için onay gerekir",
    condition: {
      resource: "report",
      action: "execute",
      tags: ["executive_confidential"],
    },
    required_roles: ["report_publisher", "org_primary_approver"],
    min_approvals: 1,
    enabled: true,
  },
  {
    id: "apr-dept-action",
    name: "Departman Aksiyon Onayı",
    description: "Departman aksiyonları departman onaylayıcısı gerektirir",
    condition: {
      resource: "action",
      action: "execute",
    },
    required_roles: ["dept_primary_approver"],
    min_approvals: 1,
    enabled: true,
  },
];

// ── Tech data source hard deny list ────────────────────
export const TECH_DATASOURCE_ALLOWED_LEVELS: OrgLevel[] = ["executive"];
export const TECH_DATASOURCE_ALLOWED_SYSTEM_ROLES: SystemRole[] = ["owner", "system_admin"];
export const TECH_DATASOURCE_ALLOWED_FUNCTIONAL_ROLES: FunctionalRole[] = ["tech_integration_manager"];
