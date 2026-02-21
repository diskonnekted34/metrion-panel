/**
 * Data Classification & Redaction
 * Defines per-entity field classifications and provides redaction utilities.
 */

import type { DataClassification, FieldClassificationMap } from "../policy/types";

// ── Entity Field Classifications ────────────────────────

export const DECISION_FIELDS: FieldClassificationMap = {
  // Public
  id: "public",
  title: "public",
  category: "public",
  lifecycle: "public",
  createdAt: "public",
  lastActionDate: "public",
  source: "public",
  department: "public",
  // Sensitive
  description: "sensitive",
  aiReasoning: "sensitive",
  estimatedFinancialImpact: "sensitive",
  estimatedKPIImpact: "sensitive",
  riskLevel: "sensitive",
  aiConfidence: "sensitive",
  simulationStrength: "sensitive",
  humanOverrideRisk: "sensitive",
  timeSensitivity: "sensitive",
  decisionDelayRisk: "sensitive",
  modelReasoning: "sensitive",
  priorityScore: "sensitive",
  dataSources: "sensitive",
  overrideEvents: "sensitive",
  requiredApprovers: "sensitive",
  finalAuthority: "sensitive",
  // Secret
  externalReferenceTokens: "secret",
};

export const ACTION_FIELDS: FieldClassificationMap = {
  // Public
  id: "public",
  title: "public",
  type: "public",
  status: "public",
  createdAt: "public",
  createdBy: "public",
  integrationId: "public",
  // Sensitive
  description: "sensitive",
  estimatedImpact: "sensitive",
  riskLevel: "sensitive",
  riskFlags: "sensitive",
  budgetCap: "sensitive",
  rollbackPlan: "sensitive",
  changes: "sensitive",
  // Secret
  integrationExecutionTokens: "secret",
};

export const OKR_FIELDS: FieldClassificationMap = {
  // Public
  id: "public",
  objectiveTitle: "public",
  keyResultTitle: "public",
  progressPercent: "public",
  status: "public",
  // Sensitive
  financialTargets: "sensitive",
  internalStrategyNotes: "sensitive",
  predictiveMetrics: "sensitive",
  // Secret
  linkedIntegrationCredentials: "secret",
};

export const INTEGRATION_FIELDS: FieldClassificationMap = {
  // Public
  id: "public",
  name: "public",
  provider: "public",
  status: "public",
  category: "public",
  // Sensitive
  accountMetadata: "sensitive",
  connectionDetails: "sensitive",
  // Secret
  accessToken: "secret",
  refreshToken: "secret",
  apiKey: "secret",
  clientSecret: "secret",
};

// ── Classification Registry ─────────────────────────────

const ENTITY_CLASSIFIERS: Record<string, FieldClassificationMap> = {
  Decision: DECISION_FIELDS,
  Action: ACTION_FIELDS,
  OKR: OKR_FIELDS,
  Integration: INTEGRATION_FIELDS,
};

/**
 * Get the classification level for a specific field on an entity.
 */
export function getFieldClassification(
  entityType: string,
  fieldName: string
): DataClassification {
  return ENTITY_CLASSIFIERS[entityType]?.[fieldName] ?? "public";
}

/**
 * Get all field classifications for an entity type.
 */
export function getEntityClassification(entityType: string): FieldClassificationMap {
  return ENTITY_CLASSIFIERS[entityType] ?? {};
}

// ── Redaction Utilities ─────────────────────────────────

const REDACTED_PLACEHOLDER = "[REDACTED]";
const MASKED_PLACEHOLDER = "••••••••";

/**
 * Redact an object based on the viewer's maximum classification access.
 * Fields above the viewer's clearance are replaced with placeholders.
 */
export function redactEntity<T extends Record<string, unknown>>(
  entity: T,
  entityType: string,
  maxClassification: DataClassification
): T {
  const classificationMap = ENTITY_CLASSIFIERS[entityType];
  if (!classificationMap) return entity;

  const classOrder: Record<DataClassification, number> = {
    public: 0,
    sensitive: 1,
    secret: 2,
  };

  const maxLevel = classOrder[maxClassification];
  const result = { ...entity };

  for (const [field, classification] of Object.entries(classificationMap)) {
    if (field in result && classOrder[classification] > maxLevel) {
      (result as Record<string, unknown>)[field] =
        classification === "secret" ? MASKED_PLACEHOLDER : REDACTED_PLACEHOLDER;
    }
  }

  return result;
}

/**
 * Mask a sensitive string value for display.
 */
export function maskValue(value: string, visibleChars = 4): string {
  if (!value || value.length <= visibleChars) return "••••";
  return "••••" + value.slice(-visibleChars);
}

/**
 * Check if a field requires redaction for a given classification level.
 */
export function isFieldRedacted(
  entityType: string,
  fieldName: string,
  viewerClassification: DataClassification
): boolean {
  const classOrder: Record<DataClassification, number> = {
    public: 0,
    sensitive: 1,
    secret: 2,
  };
  const fieldClass = getFieldClassification(entityType, fieldName);
  return classOrder[fieldClass] > classOrder[viewerClassification];
}
