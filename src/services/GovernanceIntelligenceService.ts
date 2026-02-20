/**
 * Governance Intelligence Service
 * Central gateway for all governance intelligence computations.
 */

import { CommandService } from "./CommandService";
import { OkrService } from "./OkrService";
import { seedKPIs } from "@/core/data/kpiSeed";
import { seedGovernanceActions } from "@/core/data/actionSeed";
import type { KPI } from "@/core/types/kpi";
import type { GovernanceAction } from "@/core/data/actionSeed";
import type { Objective } from "@/core/types/okr";
import type { CommandSeat } from "@/core/types/command";
import {
  computeSeatIntelligence,
  type SeatIntelligence,
} from "@/core/engine/governance-intelligence";

export const GovernanceIntelligenceService = {
  // ── Data Access ──────────────────────────────────────
  getAllKPIs(): KPI[] {
    return seedKPIs;
  },

  getKPIsBySeat(seatKey: string): KPI[] {
    return seedKPIs.filter(k => k.owner_seat === seatKey);
  },

  getKPIsByDepartment(deptKey: string): KPI[] {
    return seedKPIs.filter(k => k.department_key === deptKey);
  },

  getAllActions(): GovernanceAction[] {
    return seedGovernanceActions;
  },

  getActionsBySeat(seatKey: string): GovernanceAction[] {
    return seedGovernanceActions.filter(a => a.responsible_seat === seatKey);
  },

  getUnalignedActionCount(seatKey: string): number {
    return seedGovernanceActions.filter(
      a => a.responsible_seat === seatKey && a.alignment_status === "UNALIGNED" && a.status === "active"
    ).length;
  },

  // ── OKR by Seat ──────────────────────────────────────
  getObjectivesBySeat(seatKey: string): Objective[] {
    return OkrService.getObjectives().filter(o => o.owner_seat === seatKey);
  },

  // ── Intelligence Computation ─────────────────────────
  computeForSeat(seat: CommandSeat): SeatIntelligence {
    const allSeats = CommandService.getAllSeats();
    const seatKPIs = this.getKPIsBySeat(seat.seat_key);
    const seatObjectives = this.getObjectivesBySeat(seat.seat_key);
    const unalignedCount = this.getUnalignedActionCount(seat.seat_key);

    return computeSeatIntelligence(seat, allSeats, seatKPIs, seatObjectives, unalignedCount);
  },

  computeAll(): Map<string, SeatIntelligence> {
    const allSeats = CommandService.getAllSeats();
    const map = new Map<string, SeatIntelligence>();

    for (const seat of allSeats) {
      map.set(seat.seat_key, this.computeForSeat(seat));
    }

    return map;
  },

  // ── Aggregate Stats ──────────────────────────────────
  getAggregateStats() {
    const allIntel = this.computeAll();
    let totalGovernance = 0;
    let highRiskCount = 0;
    let inactiveCount = 0;
    let misalignedCount = 0;
    let noOKRCount = 0;

    allIntel.forEach(intel => {
      totalGovernance += intel.governance.score;
      if (intel.risk.level === "high") highRiskCount++;
      if (intel.inactivity.detected) inactiveCount++;
      if (intel.alignment.has_misalignment_warning) misalignedCount++;
      if (!intel.hasActiveOKR) noOKRCount++;
    });

    const avgGovernance = allIntel.size > 0 ? Math.round(totalGovernance / allIntel.size) : 0;

    return {
      avg_governance_score: avgGovernance,
      high_risk_seats: highRiskCount,
      strategic_inactive: inactiveCount,
      misaligned_seats: misalignedCount,
      seats_without_okr: noOKRCount,
      total_seats: allIntel.size,
    };
  },
};
