/**
 * Core Barrel Export
 * Single entry point for the entire core architecture.
 */

// Types
export * from "./types/identity";
export * from "./types/governance";
export * from "./types/infrastructure";

// Engines
export { transitionDecision, transitionAction, getDecisionNextStates, getActionNextStates } from "./engine/lifecycle";
export { resolveApprovalRequirement, isApprovalComplete } from "./engine/approval";
export { eventBus } from "./engine/events";
export { auditLogger } from "./engine/audit";
export { usageEngine } from "./engine/usage";
export { seatHasCapability, canApproveFor, requiresMultiApproval, legacyRoleToAuthorityLevel, getCapabilitiesForLevel } from "./engine/seats";
