/**
 * KPI Seed Data
 * Realistic KPIs for all departments, linked to roles.
 */

import type { KPI } from "../types/kpi";
import { DEFAULT_TENANT_ID } from "./seed";

export const seedKPIs: KPI[] = [
  // ── Executive ─────────────────────────────────────────
  { id: "kpi_revenue_growth", tenant_id: DEFAULT_TENANT_ID, metric_key: "revenue_growth", label: "Gelir Büyümesi", owner_seat: "CEO", department_key: "executive", category: "financial", current_value: 18, previous_value: 15, target_value: 30, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_profitability", tenant_id: DEFAULT_TENANT_ID, metric_key: "profitability", label: "Kârlılık", owner_seat: "CEO", department_key: "executive", category: "financial", current_value: 12, previous_value: 11, target_value: 15, unit: "%", trend: "stable", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_market_share", tenant_id: DEFAULT_TENANT_ID, metric_key: "market_share", label: "Pazar Payı", owner_seat: "CEO", department_key: "executive", category: "growth", current_value: 8.5, previous_value: 7.8, target_value: 12, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Finance ───────────────────────────────────────────
  { id: "kpi_cash_flow", tenant_id: DEFAULT_TENANT_ID, metric_key: "cash_flow", label: "Nakit Akışı", owner_seat: "CFO", department_key: "finance", category: "financial", current_value: 2800000, previous_value: 2500000, target_value: 3500000, unit: "TRY", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_budget_variance", tenant_id: DEFAULT_TENANT_ID, metric_key: "budget_variance", label: "Bütçe Varyansı", owner_seat: "CFO", department_key: "finance", category: "financial", current_value: 8, previous_value: 12, target_value: 5, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_ebitda_margin", tenant_id: DEFAULT_TENANT_ID, metric_key: "ebitda_margin", label: "EBITDA Marjı", owner_seat: "CFO", department_key: "finance", category: "financial", current_value: 22, previous_value: 20, target_value: 28, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_opex_ratio", tenant_id: DEFAULT_TENANT_ID, metric_key: "opex_ratio", label: "Operasyonel Maliyet Oranı", owner_seat: "FINANCE_CONTROLLER", department_key: "finance", category: "financial", current_value: 72, previous_value: 74, target_value: 60, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Technology ────────────────────────────────────────
  { id: "kpi_uptime", tenant_id: DEFAULT_TENANT_ID, metric_key: "uptime", label: "Uptime", owner_seat: "CTO", department_key: "technology", category: "technology", current_value: 99.7, previous_value: 99.5, target_value: 99.9, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_deploy_failure", tenant_id: DEFAULT_TENANT_ID, metric_key: "deploy_failure_rate", label: "Deploy Failure Rate", owner_seat: "CTO", department_key: "technology", category: "technology", current_value: 3.2, previous_value: 4.5, target_value: 1, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_tech_debt", tenant_id: DEFAULT_TENANT_ID, metric_key: "tech_debt_index", label: "Tech Debt Index", owner_seat: "CTO", department_key: "technology", category: "technology", current_value: 35, previous_value: 42, target_value: 20, unit: "score", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_api_latency", tenant_id: DEFAULT_TENANT_ID, metric_key: "api_latency", label: "API Latency", owner_seat: "CIO", department_key: "technology", category: "technology", current_value: 62, previous_value: 78, target_value: 50, unit: "ms", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Marketing ─────────────────────────────────────────
  { id: "kpi_cac", tenant_id: DEFAULT_TENANT_ID, metric_key: "cac", label: "Müşteri Edinme Maliyeti", owner_seat: "CMO", department_key: "marketing", category: "growth", current_value: 210, previous_value: 240, target_value: 150, unit: "TRY", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_roas", tenant_id: DEFAULT_TENANT_ID, metric_key: "roas", label: "ROAS", owner_seat: "CMO", department_key: "marketing", category: "growth", current_value: 3.8, previous_value: 3.2, target_value: 5.5, unit: "ratio", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_brand_awareness", tenant_id: DEFAULT_TENANT_ID, metric_key: "brand_awareness", label: "Marka Bilinirliği", owner_seat: "CMO", department_key: "marketing", category: "growth", current_value: 42, previous_value: 38, target_value: 60, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_funnel_conversion", tenant_id: DEFAULT_TENANT_ID, metric_key: "funnel_conversion", label: "Funnel Dönüşüm", owner_seat: "GROWTH_LEAD", department_key: "marketing", category: "growth", current_value: 5.2, previous_value: 4.5, target_value: 8, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Operations ────────────────────────────────────────
  { id: "kpi_sla_compliance", tenant_id: DEFAULT_TENANT_ID, metric_key: "sla_compliance", label: "SLA Uyumu", owner_seat: "COO", department_key: "operations", category: "operational", current_value: 96.5, previous_value: 95, target_value: 99, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_delivery_deviation", tenant_id: DEFAULT_TENANT_ID, metric_key: "delivery_deviation", label: "Teslimat Sapması", owner_seat: "COO", department_key: "operations", category: "operational", current_value: 6, previous_value: 8, target_value: 2, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_operational_margin", tenant_id: DEFAULT_TENANT_ID, metric_key: "operational_margin", label: "Operasyonel Marj", owner_seat: "COO", department_key: "operations", category: "financial", current_value: 18, previous_value: 16, target_value: 25, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_inventory_turnover", tenant_id: DEFAULT_TENANT_ID, metric_key: "inventory_turnover", label: "Stok Devir Hızı", owner_seat: "INVENTORY_LEAD", department_key: "operations", category: "operational", current_value: 8.5, previous_value: 7.2, target_value: 12, unit: "ratio", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── HR ────────────────────────────────────────────────
  { id: "kpi_engagement", tenant_id: DEFAULT_TENANT_ID, metric_key: "employee_engagement", label: "Çalışan Bağlılığı", owner_seat: "CHRO", department_key: "hr", category: "workforce", current_value: 72, previous_value: 68, target_value: 82, unit: "score", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_turnover", tenant_id: DEFAULT_TENANT_ID, metric_key: "turnover_rate", label: "Turnover Oranı", owner_seat: "CHRO", department_key: "hr", category: "workforce", current_value: 14, previous_value: 16, target_value: 8, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_hiring_time", tenant_id: DEFAULT_TENANT_ID, metric_key: "time_to_hire", label: "İşe Alım Süresi", owner_seat: "TALENT_ACQUISITION", department_key: "hr", category: "workforce", current_value: 32, previous_value: 38, target_value: 21, unit: "gün", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Sales ─────────────────────────────────────────────
  { id: "kpi_revenue_target", tenant_id: DEFAULT_TENANT_ID, metric_key: "revenue_target", label: "Gelir Hedefi", owner_seat: "SALES_DIRECTOR", department_key: "sales", category: "financial", current_value: 68, previous_value: 55, target_value: 100, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_pipeline_value", tenant_id: DEFAULT_TENANT_ID, metric_key: "pipeline_value", label: "Pipeline Değeri", owner_seat: "SALES_DIRECTOR", department_key: "sales", category: "financial", current_value: 4200000, previous_value: 3800000, target_value: 6000000, unit: "TRY", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_close_rate", tenant_id: DEFAULT_TENANT_ID, metric_key: "close_rate", label: "Kapanış Oranı", owner_seat: "SALES_DIRECTOR", department_key: "sales", category: "customer", current_value: 28, previous_value: 24, target_value: 35, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_customer_retention", tenant_id: DEFAULT_TENANT_ID, metric_key: "customer_retention", label: "Müşteri Tutma", owner_seat: "CUSTOMER_SUCCESS", department_key: "sales", category: "customer", current_value: 91, previous_value: 88, target_value: 95, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Creative ──────────────────────────────────────────
  { id: "kpi_brand_consistency", tenant_id: DEFAULT_TENANT_ID, metric_key: "brand_consistency", label: "Marka Tutarlılığı", owner_seat: "CREATIVE_DIRECTOR", department_key: "creative", category: "operational", current_value: 85, previous_value: 80, target_value: 95, unit: "score", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Marketplace ───────────────────────────────────────
  { id: "kpi_listing_sync", tenant_id: DEFAULT_TENANT_ID, metric_key: "listing_sync", label: "Listing Sync", owner_seat: "MARKETPLACE_LEAD", department_key: "marketplace", category: "operational", current_value: 92, previous_value: 88, target_value: 98, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
  { id: "kpi_channel_profit", tenant_id: DEFAULT_TENANT_ID, metric_key: "channel_profitability", label: "Kanal Kârlılığı", owner_seat: "MARKETPLACE_LEAD", department_key: "marketplace", category: "financial", current_value: 15, previous_value: 12, target_value: 22, unit: "%", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },

  // ── Legal ─────────────────────────────────────────────
  { id: "kpi_compliance_audit", tenant_id: DEFAULT_TENANT_ID, metric_key: "compliance_audit", label: "Uyum Denetimi", owner_seat: "LEGAL_COUNSEL", department_key: "legal", category: "operational", current_value: 88, previous_value: 82, target_value: 95, unit: "score", trend: "improving", updated_at: "2026-02-19T08:00:00Z" },
];
