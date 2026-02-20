/**
 * KPI Domain
 * Core table: kpis
 * Each KPI is owned by a role and tracked over time.
 */

import type { SeatKey } from "./identity";

export type KPITrend = "improving" | "stable" | "declining";
export type KPICategory = "financial" | "operational" | "growth" | "workforce" | "customer" | "technology";

export interface KPI {
  id: string;
  tenant_id: string;
  metric_key: string;
  label: string;
  owner_seat: SeatKey;
  department_key: string;
  category: KPICategory;
  current_value: number;
  previous_value: number;
  target_value: number;
  unit: string;            // "%", "TRY", "count", "ratio", "score", "ms"
  trend: KPITrend;
  updated_at: string;
}

// ── KPI Deviation (used by Risk Engine) ─────────────────
export function calculateKPIDeviation(kpi: KPI): number {
  if (kpi.target_value === 0) return 0;
  return Math.abs((kpi.current_value - kpi.target_value) / kpi.target_value) * 100;
}

export function isKPINegativeOrStagnant(kpi: KPI): boolean {
  return kpi.trend === "declining" || kpi.trend === "stable";
}
