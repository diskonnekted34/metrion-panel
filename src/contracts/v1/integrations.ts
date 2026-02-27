/**
 * V1 API Contract — Business Integrations
 */

export type IntegrationStatus = "not_connected" | "connected" | "syncing" | "error";

export type IntegrationCategory =
  | "commerce"
  | "advertising"
  | "finance"
  | "analytics"
  | "crm"
  | "operations"
  | "creative"
  | "social"
  | "marketplace"
  | "fulfillment"
  | "accounting"
  | "subscription"
  | "collaboration";

export interface IntegrationPermission {
  label: string;
  access: string;
  scope: "read" | "write";
}

export interface WriteCapability {
  action: string;
  label: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  draftOnly: boolean;
}

export interface DataHealth {
  syncStatus: "healthy" | "warning" | "error" | "idle";
  lastError?: string;
  apiHealth: "operational" | "degraded" | "down" | "unknown";
  tokenExpiresAt?: string;
  rateLimitPercent?: number;
}

export interface Integration {
  id: string;
  tenantId: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  permissions: IntegrationPermission[];
  writeCapabilities: WriteCapability[];
  requiredBy: string[];
  writeEnabled: boolean;
  dataHealth: DataHealth;
  csvSupported: boolean;
}
