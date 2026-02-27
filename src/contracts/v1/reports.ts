/**
 * V1 API Contract — Reports
 */

export type ReportScope = "company" | "department" | "position";
export type ReportType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type ReportStatus = "immutable" | "draft" | "scheduled";
export type ConfidentialityLevel = "public" | "internal" | "executive";

export interface ReportDefinition {
  id: string;
  tenantId: string;
  title: string;
  scope: ReportScope;
  type: ReportType;
  departmentKey?: string;
  ownerSeat?: string;
  confidentiality: ConfidentialityLevel;
  sections: number;
  createdAt: string;
}

export interface ReportRun {
  id: string;
  tenantId: string;
  reportDefinitionId: string;
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  healthScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  kpiDelta: string;
  kpiLabel: string;
  confidence: number;
  sources: string[];
  hash: string;
  topRisk: string;
  topOpportunity: string;
  generatedAt: string;
  version: string;
  aiModelVersion: string;
}
