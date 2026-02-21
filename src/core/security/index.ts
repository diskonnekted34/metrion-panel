/**
 * Security Core — Public API
 * All security operations must go through this module.
 */

// Policy Engine
export { evaluatePolicy, canPerformAction, getPermittedActions } from "./policy/engine";
export type {
  PolicyAction,
  PolicyRequest,
  PolicyResult,
  ResourceType,
  DataClassification,
  FieldClassificationMap,
} from "./policy/types";

// Crypto Adapter
export { cryptoAdapter } from "./crypto/adapter";
export type { CryptoAdapter, EncryptedPayload } from "./crypto/adapter";

// Secrets Manager
export { secretsManager } from "./secrets/manager";
export type { SecretEntry, SecretRevealResult } from "./secrets/manager";

// Data Classification & Redaction
export {
  getFieldClassification,
  getEntityClassification,
  redactEntity,
  maskValue,
  isFieldRedacted,
  DECISION_FIELDS,
  ACTION_FIELDS,
  OKR_FIELDS,
  INTEGRATION_FIELDS,
} from "./redaction/classifier";

// Security Audit Events
export {
  emitSecurityAudit,
  emitPolicyDenial,
  emitDataReveal,
} from "./audit/events";
export type { SecurityAuditEvent } from "./audit/events";
