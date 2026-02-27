/**
 * V1 API Contract — Alerts
 */

export type AlertUrgency = "critical" | "high" | "medium" | "low";
export type AlertCategory = "critical" | "recommendation" | "completed";

export interface AlertMetric {
  label: string;
  value: string;
}

export interface Alert {
  id: string;
  tenantId: string;
  text: string;
  detail: string;
  urgency: AlertUrgency;
  confidence: number;
  agentId: string;
  agentLabel: string;
  category: AlertCategory;
  resolved: boolean;
  metrics?: AlertMetric[];
  whatHappened?: string;
  whyItMatters?: string;
  recommendations?: string[];
  createdAt: string;
  resolvedAt?: string;
}
