/** Dashboard data contracts */

export type TimeRange = "D" | "W" | "M" | "Y";

export interface SparkPoint {
  t: string;
  v: number;
}

export interface KpiCard {
  id: string;
  title: string;
  value: string;
  deltaLabel: string;
  trend: "up" | "down" | "flat";
  series: SparkPoint[];
  minLabel: string;
  maxLabel: string;
}

export interface HealthDriver {
  label: string;
  impact: "pos" | "neg";
}

export interface CompanySnapshot {
  updatedAt: string;
  healthScore: number;
  healthDelta: string;
  healthDrivers: HealthDriver[];
  kpis: KpiCard[];
}
