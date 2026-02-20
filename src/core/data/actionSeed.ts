/**
 * Action Seed Data (Governance Intelligence aligned)
 * Each action has source (AI/HUMAN) and alignment_status
 */

import type { SeatKey } from "../types/identity";
import { DEFAULT_TENANT_ID } from "./seed";

export type ActionSource = "AI" | "HUMAN";
export type ActionAlignmentStatus = "ALIGNED" | "UNALIGNED";

export interface GovernanceAction {
  id: string;
  tenant_id: string;
  title: string;
  responsible_seat: SeatKey;
  department_key: string;
  linked_okr_id: string | null;
  linked_kpi_id: string;
  source: ActionSource;
  alignment_status: ActionAlignmentStatus;
  status: "active" | "completed" | "draft";
  created_at: string;
}

export const seedGovernanceActions: GovernanceAction[] = [
  // AI Actions (always linked to OKR)
  { id: "ga_1", tenant_id: DEFAULT_TENANT_ID, title: "Gelir artış stratejisi optimizasyonu", responsible_seat: "CEO", department_key: "executive", linked_okr_id: "obj_s1", linked_kpi_id: "kpi_revenue_growth", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-10T00:00:00Z" },
  { id: "ga_2", tenant_id: DEFAULT_TENANT_ID, title: "Nakit akışı projeksiyonu güncelleme", responsible_seat: "CFO", department_key: "finance", linked_okr_id: "obj_t3", linked_kpi_id: "kpi_cash_flow", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-11T00:00:00Z" },
  { id: "ga_3", tenant_id: DEFAULT_TENANT_ID, title: "API performans iyileştirme planı", responsible_seat: "CTO", department_key: "technology", linked_okr_id: "obj_t4", linked_kpi_id: "kpi_api_latency", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-12T00:00:00Z" },
  { id: "ga_4", tenant_id: DEFAULT_TENANT_ID, title: "Dijital pazarlama ROI analizi", responsible_seat: "CMO", department_key: "marketing", linked_okr_id: "obj_t1", linked_kpi_id: "kpi_roas", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-13T00:00:00Z" },
  { id: "ga_5", tenant_id: DEFAULT_TENANT_ID, title: "SLA iyileştirme aksiyon planı", responsible_seat: "COO", department_key: "operations", linked_okr_id: "obj_s2", linked_kpi_id: "kpi_sla_compliance", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-14T00:00:00Z" },
  { id: "ga_6", tenant_id: DEFAULT_TENANT_ID, title: "Çalışan bağlılık programı tasarımı", responsible_seat: "CHRO", department_key: "hr", linked_okr_id: "obj_t5", linked_kpi_id: "kpi_engagement", source: "AI", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-15T00:00:00Z" },

  // HUMAN Actions (some aligned, some not)
  { id: "ga_7", tenant_id: DEFAULT_TENANT_ID, title: "Yeni tedarikçi araştırması", responsible_seat: "COO", department_key: "operations", linked_okr_id: null, linked_kpi_id: "kpi_delivery_deviation", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-10T00:00:00Z" },
  { id: "ga_8", tenant_id: DEFAULT_TENANT_ID, title: "Manuel raporlama süreci", responsible_seat: "CFO", department_key: "finance", linked_okr_id: null, linked_kpi_id: "kpi_budget_variance", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-11T00:00:00Z" },
  { id: "ga_9", tenant_id: DEFAULT_TENANT_ID, title: "Sosyal medya içerik planı", responsible_seat: "CMO", department_key: "marketing", linked_okr_id: "obj_t1", linked_kpi_id: "kpi_brand_awareness", source: "HUMAN", alignment_status: "ALIGNED", status: "active", created_at: "2026-02-12T00:00:00Z" },
  { id: "ga_10", tenant_id: DEFAULT_TENANT_ID, title: "Ek bütçe talebi", responsible_seat: "SALES_DIRECTOR", department_key: "sales", linked_okr_id: null, linked_kpi_id: "kpi_pipeline_value", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-13T00:00:00Z" },
  { id: "ga_11", tenant_id: DEFAULT_TENANT_ID, title: "Müşteri ziyaret programı", responsible_seat: "SALES_DIRECTOR", department_key: "sales", linked_okr_id: null, linked_kpi_id: "kpi_close_rate", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-14T00:00:00Z" },
  { id: "ga_12", tenant_id: DEFAULT_TENANT_ID, title: "Ad-hoc kampanya bütçesi", responsible_seat: "SALES_DIRECTOR", department_key: "sales", linked_okr_id: null, linked_kpi_id: "kpi_revenue_target", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-15T00:00:00Z" },
  { id: "ga_13", tenant_id: DEFAULT_TENANT_ID, title: "Ofis yenileme projesi", responsible_seat: "CHRO", department_key: "hr", linked_okr_id: null, linked_kpi_id: "kpi_engagement", source: "HUMAN", alignment_status: "UNALIGNED", status: "active", created_at: "2026-02-16T00:00:00Z" },
];
