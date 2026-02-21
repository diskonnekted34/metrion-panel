/**
 * Core Barrel Export
 * Single entry point for the entire core architecture.
 */

// Types
export * from "./types/identity";
export * from "./types/governance";
export * from "./types/infrastructure";
export * from "./types/okr";

// Engines
export { transitionDecision, transitionAction, getDecisionNextStates, getActionNextStates } from "./engine/lifecycle";
export { resolveApprovalRequirement, isApprovalComplete } from "./engine/approval";
export { eventBus } from "./engine/events";
export { auditLogger } from "./engine/audit";
export { usageEngine } from "./engine/usage";
export { seatHasCapability, canApproveFor, requiresMultiApproval, legacyRoleToAuthorityLevel, getCapabilitiesForLevel } from "./engine/seats";
export {
  calculateKRProgress, calculateObjectiveProgress, calculateExpectedProgress,
  calculateHealthScore, calculateRiskScore, calculateSuccessProbability,
  detectDeviation, recalculateObjectiveHealth, generateCorrectiveDecisionDraft,
  calculateStrategicHealthIndex, calculateDepartmentAlignments,
  canAccessOKR, canUseHierarchy, canUseAICorrection, canUseMultiCycle, canUseAlignment,
} from "./engine/okr";

// Commands
export * from "./commands";
