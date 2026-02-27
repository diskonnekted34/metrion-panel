/**
 * V1 API Contract — Intelligence & KPIs
 */

export type KPITrend = "improving" | "stable" | "declining";
export type KPICategory = "financial" | "operational" | "growth" | "workforce" | "customer" | "technology";

export interface KPI {
  id: string;
  tenantId: string;
  metricKey: string;
  label: string;
  ownerSeat: string;
  departmentKey: string;
  category: KPICategory;
  currentValue: number;
  previousValue: number;
  targetValue: number;
  unit: string;
  trend: KPITrend;
  updatedAt: string;
}

export interface SeatIntelligence {
  seatKey: string;
  governanceScore: number;
  riskLevel: "low" | "medium" | "high";
  activeOkrCount: number;
  unalignedActionCount: number;
  kpiDeviationAvg: number;
}

export interface AggregateStats {
  avgGovernanceScore: number;
  highRiskCount: number;
  inactiveCount: number;
  misalignedCount: number;
  noActiveOkrCount: number;
}

export interface CompanySnapshot {
  tenantId: string;
  healthScore: number;
  kpis: KPI[];
  stats: AggregateStats;
  generatedAt: string;
}
