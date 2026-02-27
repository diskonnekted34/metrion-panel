/**
 * V1 API Contract — Tech Connectors
 */

export type TechConnectorStatus = "available" | "connected" | "error" | "disabled";
export type TechDataSensitivity = "low" | "med" | "high";
export type TechAccessMethod = "oauth" | "api_key" | "webhook" | "export";
export type TechRefreshFrequency = "realtime" | "hourly" | "daily" | "manual";
export type TechSyncStatus = "ok" | "partial" | "failed" | "never";

export type TechConnectorCategory =
  | "vcs" | "issue_tracking" | "cicd" | "cloud" | "containers"
  | "observability" | "logging" | "error_tracking" | "security"
  | "iam" | "waf_edge" | "incident" | "status_page" | "finops"
  | "databases" | "data_pipelines" | "docs" | "support" | "communication";

export interface TechConnector {
  id: string;
  tenantId: string;
  name: string;
  vendor: string;
  category: TechConnectorCategory;
  description: string;
  status: TechConnectorStatus;
  dataSensitivity: TechDataSensitivity;
  accessMethod: TechAccessMethod;
  refreshFrequency: TechRefreshFrequency;
  lastSyncAt: string | null;
  lastSyncStatus: TechSyncStatus;
  errorMessage: string | null;
}
