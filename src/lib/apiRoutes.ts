/**
 * Centralized API v1 route map.
 * All endpoint paths used by UI services live here.
 */

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  governance: {
    decisions: "/governance/decisions",
    decision: (id: string) => `/governance/decisions/${id}`,
    decisionApprovals: (id: string) => `/governance/decisions/${id}/approvals`,
    actions: "/governance/actions",
    action: (id: string) => `/governance/actions/${id}`,
    actionApprovals: (id: string) => `/governance/actions/${id}/approvals`,
  },

  okr: {
    cycles: "/okr/cycles",
    objectives: "/okr/objectives",
    keyResults: "/okr/key-results",
  },

  alerts: {
    alerts: "/alerts",
  },

  integrations: {
    integrations: "/integrations",
  },

  tech: {
    connectors: "/tech/connectors",
  },

  intelligence: {
    kpis: "/intelligence/kpis",
    aggregate: "/intelligence/aggregate",
    companySnapshot: "/dashboard/company-snapshot",
  },

  reports: {
    definitions: "/reports/definitions",
    runs: "/reports/runs",
    download: (runId: string) => `/reports/runs/${runId}/download`,
  },

  positions: {
    positions: "/positions",
    people: "/people",
    audit: "/audit",
  },
} as const;
