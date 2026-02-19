/**
 * Position History Service — single data access gateway.
 * Currently backed by mock data; will swap to BFF API calls.
 */

import type {
  PositionWithMetrics,
  PositionScopeSnapshot,
  HandoverChecklist,
  AuditLogEntry,
  PositionAssignment,
} from "@/core/types/positionHistory";
import {
  positions,
  getAssignmentsForPosition,
  getCurrentAssignment,
  getPersonById,
  getHandoverForAssignment,
  getSnapshotsForAssignment,
  getAuditLogsForEntity,
} from "@/data/positionHistory";
import { computePositionMetrics } from "@/lib/positionHistory/metrics";

export const PositionHistoryService = {
  /** Get all positions with computed metrics */
  getPositions(): PositionWithMetrics[] {
    return positions.map(pos => {
      const allAssignments = getAssignmentsForPosition(pos.id);
      const current = getCurrentAssignment(pos.id);
      const person = current ? getPersonById(current.person_id) : null;

      // Find the latest handover (from the most recent completed assignment)
      const completedAssignments = allAssignments.filter(a => a.end_date !== null);
      const latestCompleted = completedAssignments[completedAssignments.length - 1];
      const handover = latestCompleted
        ? getHandoverForAssignment(latestCompleted.id)
        : null;

      const metrics = computePositionMetrics(allAssignments, current, handover);

      const lastTransition = allAssignments.length > 0
        ? allAssignments[allAssignments.length - 1].transition_reason
        : null;

      return {
        ...pos,
        current_holder: person,
        current_assignment: current,
        assignments: allAssignments,
        metrics,
        last_transition_reason: lastTransition,
      };
    });
  },

  /** Get a single position by ID */
  getPosition(positionId: string): PositionWithMetrics | null {
    return this.getPositions().find(p => p.id === positionId) ?? null;
  },

  /** Get scope snapshots for before/after diff */
  getSnapshots(assignmentId: string): PositionScopeSnapshot[] {
    return getSnapshotsForAssignment(assignmentId);
  },

  /** Get handover checklist for an assignment */
  getHandover(assignmentId: string): HandoverChecklist | null {
    return getHandoverForAssignment(assignmentId);
  },

  /** Get audit trail for an assignment */
  getAuditLogs(entityId: string): AuditLogEntry[] {
    return getAuditLogsForEntity(entityId);
  },

  /** Get assignment details */
  getAssignment(assignmentId: string): PositionAssignment | null {
    const allPositions = this.getPositions();
    for (const pos of allPositions) {
      const found = pos.assignments.find(a => a.id === assignmentId);
      if (found) return found;
    }
    return null;
  },

  /** Resolve person by ID */
  getPerson: getPersonById,
};
