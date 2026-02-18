/**
 * Seat Authority Engine
 * Replaces traditional RBAC with seat-based authority model.
 */

import { Seat, SeatKey, SeatCapability } from "../types/identity";

/** Check if a seat has a given capability */
export function seatHasCapability(seat: Seat, cap: SeatCapability): boolean {
  return seat.capabilities.includes(cap);
}

/** Check if seat can approve for another seat's action */
export function canApproveFor(approverSeat: Seat, targetSeat: Seat): boolean {
  // Higher authority level can approve lower
  if (approverSeat.authority_level > targetSeat.authority_level) return true;
  // Same level only if approver has decision.approve capability
  if (approverSeat.authority_level === targetSeat.authority_level) {
    return seatHasCapability(approverSeat, "decision.approve");
  }
  return false;
}

/** Determine if an action requires multi-seat approval */
export function requiresMultiApproval(
  riskLevel: "low" | "medium" | "high" | "critical",
  financialImpact: number
): boolean {
  if (riskLevel === "critical") return true;
  if (riskLevel === "high" && financialImpact > 50000) return true;
  return false;
}

/** Map legacy RBAC role to default seat authority level */
export function legacyRoleToAuthorityLevel(
  role: "owner" | "admin" | "department_lead" | "operator" | "viewer"
): number {
  const map: Record<string, number> = {
    owner: 100,
    admin: 90,
    department_lead: 60,
    operator: 30,
    viewer: 10,
  };
  return map[role] || 10;
}

/** Get all capabilities for a given authority level */
export function getCapabilitiesForLevel(level: number): SeatCapability[] {
  const caps: SeatCapability[] = ["analysis.view"];
  if (level >= 30) caps.push("task.create");
  if (level >= 50) caps.push("action.draft.create", "task.assign", "decision.propose");
  if (level >= 60) caps.push("simulation.create");
  if (level >= 80) caps.push("action.publish", "decision.approve", "decision.reject", "integration.connect", "settings.thresholds");
  if (level >= 90) caps.push("simulation.approve");
  return caps;
}
