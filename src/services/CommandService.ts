/**
 * Command Structure Service
 * Single data access gateway for governance hierarchy
 */

import { commandSeats, governanceEvents } from "@/data/commandStructure";
import type { CommandSeat, GovernanceSummary, GovernanceEvent, HierarchyNode } from "@/core/types/command";

export const CommandService = {
  getAllSeats(): CommandSeat[] {
    return commandSeats;
  },

  getSeatByKey(key: string): CommandSeat | undefined {
    return commandSeats.find(s => s.seat_key === key);
  },

  getSeatById(id: string): CommandSeat | undefined {
    return commandSeats.find(s => s.id === id);
  },

  getGovernanceEvents(seatKey?: string): GovernanceEvent[] {
    if (seatKey) return governanceEvents.filter(e => e.seat_key === seatKey);
    return governanceEvents;
  },

  getGovernanceSummary(): GovernanceSummary {
    const seats = commandSeats;
    const humanCount = seats.filter(s => s.assigned_human !== null).length;
    const totalBudget = seats.reduce((sum, s) => sum + s.budget.spent + s.budget.reserved, 0);
    const overrides = seats.reduce((sum, s) => sum + s.override_count, 0);
    const escalations = governanceEvents.filter(e => e.event_type === "budget_change" || e.event_type === "approval_change").length;
    const highRiskCount = seats.filter(s => s.risk_exposure === "high" || s.risk_exposure === "critical").length;

    return {
      total_seats: seats.length,
      human_assigned: humanCount,
      ai_seats: seats.length - humanCount,
      total_budget_exposure: totalBudget,
      active_approvals: 5,
      escalations,
      overall_risk: highRiskCount > 2 ? "high" : highRiskCount > 0 ? "medium" : "low",
      override_count: overrides,
    };
  },

  buildHierarchy(): HierarchyNode[] {
    const seatMap = new Map<string, CommandSeat>();
    for (const s of commandSeats) seatMap.set(s.seat_key, s);

    const nodeMap = new Map<string, HierarchyNode>();
    for (const s of commandSeats) {
      nodeMap.set(s.seat_key, { seat: s, children: [] });
    }

    const roots: HierarchyNode[] = [];
    for (const s of commandSeats) {
      const node = nodeMap.get(s.seat_key)!;
      if (s.parent_seat_key && nodeMap.has(s.parent_seat_key)) {
        nodeMap.get(s.parent_seat_key)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },

  formatCurrency(val: number): string {
    if (val >= 1000000) return `₺${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺${(val / 1000).toFixed(0)}K`;
    return `₺${val}`;
  },
};
