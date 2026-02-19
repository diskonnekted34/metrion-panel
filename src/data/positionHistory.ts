/**
 * Mock data for Position History (CEO-only governance module).
 * 6 positions, each with 2–4 historical assignments.
 */

import type {
  Position,
  Person,
  PositionAssignment,
  PositionScopeSnapshot,
  HandoverChecklist,
  AuditLogEntry,
} from "@/core/types/positionHistory";

/* ── People ── */
export const people: Person[] = [
  { id: "p1", org_id: "org1", full_name: "Ahmet Yılmaz", email: "ahmet@acme.com", employment_status: "ACTIVE", created_at: "2020-01-01", updated_at: "2024-01-01" },
  { id: "p2", org_id: "org1", full_name: "Zeynep Kaya", email: "zeynep@acme.com", employment_status: "ACTIVE", created_at: "2019-06-01", updated_at: "2024-06-01" },
  { id: "p3", org_id: "org1", full_name: "Mehmet Demir", email: "mehmet@acme.com", employment_status: "INACTIVE", created_at: "2018-01-01", updated_at: "2024-02-01" },
  { id: "p4", org_id: "org1", full_name: "Elif Öztürk", email: "elif@acme.com", employment_status: "ACTIVE", created_at: "2021-03-01", updated_at: "2025-01-01" },
  { id: "p5", org_id: "org1", full_name: "Can Arslan", email: "can@acme.com", employment_status: "ACTIVE", created_at: "2020-09-01", updated_at: "2025-06-01" },
  { id: "p6", org_id: "org1", full_name: "Selin Çelik", email: "selin@acme.com", employment_status: "INACTIVE", created_at: "2019-01-01", updated_at: "2023-12-01" },
  { id: "p7", org_id: "org1", full_name: "Deniz Yıldız", email: "deniz@acme.com", employment_status: "ACTIVE", created_at: "2022-01-01", updated_at: "2025-10-01" },
  { id: "p8", org_id: "org1", full_name: "Berk Aydın", email: "berk@acme.com", employment_status: "ACTIVE", created_at: "2021-06-01", updated_at: "2025-08-01" },
  { id: "p9", org_id: "org1", full_name: "Aslı Koç", email: "asli@acme.com", employment_status: "ACTIVE", created_at: "2023-01-01", updated_at: "2025-12-01" },
  { id: "p10", org_id: "org1", full_name: "Emre Tan", email: "emre@acme.com", employment_status: "INACTIVE", created_at: "2018-06-01", updated_at: "2024-05-01" },
];

/* ── Positions ── */
export const positions: Position[] = [
  { id: "pos-ceo", org_id: "org1", title: "CEO", department: "Executive", level: "C_LEVEL", is_active: true, created_at: "2018-01-01", updated_at: "2024-01-01" },
  { id: "pos-cfo", org_id: "org1", title: "CFO", department: "Finance", level: "C_LEVEL", is_active: true, created_at: "2018-01-01", updated_at: "2025-01-01" },
  { id: "pos-cto", org_id: "org1", title: "CTO", department: "Technology", level: "C_LEVEL", is_active: true, created_at: "2018-01-01", updated_at: "2025-06-01" },
  { id: "pos-cmo", org_id: "org1", title: "CMO", department: "Marketing", level: "C_LEVEL", is_active: true, created_at: "2019-01-01", updated_at: "2025-03-01" },
  { id: "pos-coo", org_id: "org1", title: "COO", department: "Operations", level: "C_LEVEL", is_active: true, created_at: "2019-01-01", updated_at: "2025-01-01" },
  { id: "pos-gc", org_id: "org1", title: "General Counsel", department: "Legal", level: "C_LEVEL", is_active: true, created_at: "2020-01-01", updated_at: "2025-06-01" },
];

/* ── Assignments ── */
export const assignments: PositionAssignment[] = [
  // CEO: 2 assignments — stable
  { id: "a-ceo-1", org_id: "org1", position_id: "pos-ceo", person_id: "p3", assignment_type: "PERMANENT", start_date: "2018-01-15", end_date: "2022-06-30", transition_reason: "RESIGNED", approved_by: ["board"], approved_at: "2018-01-10", notes_private: "Kurucu geçişi tamamlandı.", created_at: "2018-01-10", updated_at: "2022-06-30" },
  { id: "a-ceo-2", org_id: "org1", position_id: "pos-ceo", person_id: "p1", assignment_type: "PERMANENT", start_date: "2022-07-01", end_date: null, transition_reason: "PROMOTED", approved_by: ["board"], approved_at: "2022-06-25", notes_private: "İç terfi — güçlü performans.", created_at: "2022-06-25", updated_at: "2022-07-01" },

  // CFO: 4 assignments — high churn, includes acting period + vacancy
  { id: "a-cfo-1", org_id: "org1", position_id: "pos-cfo", person_id: "p6", assignment_type: "PERMANENT", start_date: "2019-03-01", end_date: "2022-01-15", transition_reason: "RESIGNED", approved_by: ["p1"], approved_at: "2019-02-20", notes_private: null, created_at: "2019-02-20", updated_at: "2022-01-15" },
  // Vacancy gap: 2022-01-15 to 2022-03-01 = 45 days
  { id: "a-cfo-2", org_id: "org1", position_id: "pos-cfo", person_id: "p2", assignment_type: "ACTING", start_date: "2022-03-01", end_date: "2022-08-31", transition_reason: "ACTING_APPOINTMENT", approved_by: ["p1"], approved_at: "2022-02-25", notes_private: "Geçici atama, aday aranıyor.", created_at: "2022-02-25", updated_at: "2022-08-31" },
  { id: "a-cfo-3", org_id: "org1", position_id: "pos-cfo", person_id: "p10", assignment_type: "PERMANENT", start_date: "2022-09-01", end_date: "2024-05-15", transition_reason: "TERMINATED", approved_by: ["p1"], approved_at: "2022-08-20", notes_private: "Performans yetersizliği.", created_at: "2022-08-20", updated_at: "2024-05-15" },
  { id: "a-cfo-4", org_id: "org1", position_id: "pos-cfo", person_id: "p4", assignment_type: "PERMANENT", start_date: "2024-06-01", end_date: null, transition_reason: "BACKFILL", approved_by: ["p1", "board"], approved_at: "2024-05-25", notes_private: null, created_at: "2024-05-25", updated_at: "2024-06-01" },

  // CTO: 3 assignments — scope change on latest
  { id: "a-cto-1", org_id: "org1", position_id: "pos-cto", person_id: "p3", assignment_type: "PERMANENT", start_date: "2018-06-01", end_date: "2021-12-31", transition_reason: "REORG", approved_by: ["p1"], approved_at: "2018-05-20", notes_private: null, created_at: "2018-05-20", updated_at: "2021-12-31" },
  { id: "a-cto-2", org_id: "org1", position_id: "pos-cto", person_id: "p7", assignment_type: "PERMANENT", start_date: "2022-01-15", end_date: "2025-02-28", transition_reason: "PROMOTED", approved_by: ["p1"], approved_at: "2022-01-10", notes_private: null, created_at: "2022-01-10", updated_at: "2025-02-28" },
  { id: "a-cto-3", org_id: "org1", position_id: "pos-cto", person_id: "p5", assignment_type: "PERMANENT", start_date: "2025-03-15", end_date: null, transition_reason: "BACKFILL", approved_by: ["p1", "board"], approved_at: "2025-03-10", notes_private: "Scope genişletildi — AI/ML eklendi.", created_at: "2025-03-10", updated_at: "2025-03-15" },

  // CMO: 2 assignments
  { id: "a-cmo-1", org_id: "org1", position_id: "pos-cmo", person_id: "p8", assignment_type: "PERMANENT", start_date: "2021-01-15", end_date: "2024-09-30", transition_reason: "RESIGNED", approved_by: ["p1"], approved_at: "2021-01-10", notes_private: null, created_at: "2021-01-10", updated_at: "2024-09-30" },
  { id: "a-cmo-2", org_id: "org1", position_id: "pos-cmo", person_id: "p9", assignment_type: "PERMANENT", start_date: "2024-10-15", end_date: null, transition_reason: "BACKFILL", approved_by: ["p1"], approved_at: "2024-10-10", notes_private: null, created_at: "2024-10-10", updated_at: "2024-10-15" },

  // COO: 3 assignments — acting period
  { id: "a-coo-1", org_id: "org1", position_id: "pos-coo", person_id: "p6", assignment_type: "PERMANENT", start_date: "2019-06-01", end_date: "2023-03-31", transition_reason: "REORG", approved_by: ["p1"], approved_at: "2019-05-20", notes_private: null, created_at: "2019-05-20", updated_at: "2023-03-31" },
  { id: "a-coo-2", org_id: "org1", position_id: "pos-coo", person_id: "p2", assignment_type: "ACTING", start_date: "2023-04-01", end_date: "2023-09-30", transition_reason: "ACTING_APPOINTMENT", approved_by: ["p1"], approved_at: "2023-03-25", notes_private: "Yeniden yapılanma sırasında geçici.", created_at: "2023-03-25", updated_at: "2023-09-30" },
  { id: "a-coo-3", org_id: "org1", position_id: "pos-coo", person_id: "p8", assignment_type: "PERMANENT", start_date: "2023-10-01", end_date: null, transition_reason: "BACKFILL", approved_by: ["p1"], approved_at: "2023-09-25", notes_private: null, created_at: "2023-09-25", updated_at: "2023-10-01" },

  // General Counsel: 2 — currently vacant
  { id: "a-gc-1", org_id: "org1", position_id: "pos-gc", person_id: "p10", assignment_type: "PERMANENT", start_date: "2020-03-01", end_date: "2024-08-15", transition_reason: "RESIGNED", approved_by: ["p1"], approved_at: "2020-02-20", notes_private: null, created_at: "2020-02-20", updated_at: "2024-08-15" },
  { id: "a-gc-2", org_id: "org1", position_id: "pos-gc", person_id: "p9", assignment_type: "ACTING", start_date: "2024-09-01", end_date: "2025-01-31", transition_reason: "ACTING_APPOINTMENT", approved_by: ["p1"], approved_at: "2024-08-25", notes_private: "Geçici — aday arama devam ediyor.", created_at: "2024-08-25", updated_at: "2025-01-31" },
  // Currently VACANT since 2025-02-01
];

/* ── Scope Snapshots (before/after for CTO transition) ── */
export const scopeSnapshots: PositionScopeSnapshot[] = [
  // Before (CTO a-cto-2)
  {
    id: "ss-cto-before", org_id: "org1", assignment_id: "a-cto-2",
    scope_json: {
      responsibilities: ["Platform Architecture", "DevOps", "Security", "Engineering"],
      budget_limit: 500000,
      approval_level: "Board for >200K",
      direct_reports_count: 12,
      okr_ownership: ["Tech Reliability", "Platform Speed"],
      systems_owned: ["AWS", "GitHub", "Datadog"],
    },
    captured_at: "2025-02-28",
  },
  // After (CTO a-cto-3)
  {
    id: "ss-cto-after", org_id: "org1", assignment_id: "a-cto-3",
    scope_json: {
      responsibilities: ["Platform Architecture", "DevOps", "Security", "Engineering", "AI/ML", "Data Platform"],
      budget_limit: 750000,
      approval_level: "Board for >300K",
      direct_reports_count: 18,
      okr_ownership: ["Tech Reliability", "Platform Speed", "AI Integration", "Data Maturity"],
      systems_owned: ["AWS", "GitHub", "Datadog", "Vertex AI", "BigQuery"],
    },
    captured_at: "2025-03-15",
  },
  // CFO scope (a-cfo-4)
  {
    id: "ss-cfo-after", org_id: "org1", assignment_id: "a-cfo-4",
    scope_json: {
      responsibilities: ["Financial Planning", "Treasury", "Audit", "Tax", "Investor Relations"],
      budget_limit: 1000000,
      approval_level: "CEO for >500K",
      direct_reports_count: 8,
      okr_ownership: ["Cash Flow Health", "Margin Improvement", "Fundraising"],
      systems_owned: ["NetSuite", "Brex", "Carta"],
    },
    captured_at: "2024-06-01",
  },
];

/* ── Handover Checklists ── */
export const handoverChecklists: HandoverChecklist[] = [
  // Good handover — CTO a-cto-2 → a-cto-3
  {
    id: "hc-cto-2", org_id: "org1", assignment_id: "a-cto-2",
    completion_percent: 92,
    open_items_count: 1,
    open_items: ["Vertex AI credentials rotation pending"],
    docs_links: ["https://docs.internal/cto-handover-2025"],
    meetings_count: 6,
    access_handover: { tools: ["AWS", "GitHub", "Datadog", "Vertex AI"], completed: true, completed_at: "2025-03-12" },
    time_to_productivity: { d30: "on_track", d60: "on_track", d90: "not_started" },
    created_at: "2025-03-01", updated_at: "2025-03-15",
  },
  // Risky handover — CFO a-cfo-3 (terminated)
  {
    id: "hc-cfo-3", org_id: "org1", assignment_id: "a-cfo-3",
    completion_percent: 35,
    open_items_count: 8,
    open_items: ["Q2 close incomplete", "Audit prep docs missing", "Tax filing handover", "Board deck templates", "Bank signatory change", "Vendor payment schedule", "Insurance renewal", "Cap table updates"],
    docs_links: [],
    meetings_count: 1,
    access_handover: { tools: ["NetSuite", "Brex"], completed: false, completed_at: null },
    time_to_productivity: { d30: "delayed", d60: "delayed", d90: "not_started" },
    created_at: "2024-05-20", updated_at: "2024-06-15",
  },
  // Unknown — GC has no handover data for latest
];

/* ── Audit Logs ── */
export const auditLogs: AuditLogEntry[] = [
  { id: "al-1", org_id: "org1", actor_user_id: "p1", action: "POSITION_ASSIGNMENT_CREATED", entity_type: "assignment", entity_id: "a-cto-3", metadata: { reason: "BACKFILL" }, created_at: "2025-03-10" },
  { id: "al-2", org_id: "org1", actor_user_id: "p1", action: "POSITION_SCOPE_UPDATED", entity_type: "scope_snapshot", entity_id: "ss-cto-after", metadata: { changes: ["AI/ML added", "Budget increased"] }, created_at: "2025-03-15" },
  { id: "al-3", org_id: "org1", actor_user_id: "p1", action: "POSITION_ASSIGNMENT_CREATED", entity_type: "assignment", entity_id: "a-cfo-4", metadata: { reason: "BACKFILL" }, created_at: "2024-05-25" },
  { id: "al-4", org_id: "org1", actor_user_id: "p1", action: "HANDOVER_UPDATED", entity_type: "handover", entity_id: "hc-cto-2", metadata: { completion: 92 }, created_at: "2025-03-15" },
];

/* ── Helper: get person by id ── */
export function getPersonById(id: string): Person | null {
  return people.find(p => p.id === id) ?? null;
}

/** Get assignments for a position, sorted by start_date */
export function getAssignmentsForPosition(positionId: string): PositionAssignment[] {
  return assignments
    .filter(a => a.position_id === positionId)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

/** Get the current (open) assignment for a position */
export function getCurrentAssignment(positionId: string): PositionAssignment | null {
  return assignments.find(a => a.position_id === positionId && a.end_date === null) ?? null;
}

/** Get scope snapshots for an assignment */
export function getSnapshotsForAssignment(assignmentId: string): PositionScopeSnapshot[] {
  return scopeSnapshots.filter(s => s.assignment_id === assignmentId);
}

/** Get handover checklist for an assignment */
export function getHandoverForAssignment(assignmentId: string): HandoverChecklist | null {
  return handoverChecklists.find(h => h.assignment_id === assignmentId) ?? null;
}

/** Get audit logs for an entity */
export function getAuditLogsForEntity(entityId: string): AuditLogEntry[] {
  return auditLogs.filter(l => l.entity_id === entityId);
}
