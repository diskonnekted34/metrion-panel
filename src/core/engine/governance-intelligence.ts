/**
 * Governance Intelligence Engine
 * Deterministic, formula-based, explainable.
 *
 * - Risk Score (per seat)
 * - Governance Score (per seat)
 * - Strategic Inactivity Detection
 * - Alignment Analysis
 * - OKR Suggestion Generation
 */

import type { CommandSeat } from "../types/command";
import type { KPI, KPITrend } from "../types/kpi";
import type { Objective } from "../types/okr";

// ── Role Weight (fixed) ─────────────────────────────────
const ROLE_WEIGHT: Record<number, number> = {
  0: 1.2,  // CEO
  1: 1.0,  // C-Level
  2: 0.8,  // Director
  3: 0.6,  // Manager
};

function getSeatLevel(seat: CommandSeat, allSeats: CommandSeat[]): number {
  let level = 0;
  let cur = seat;
  while (cur.parent_seat_key) {
    const parent = allSeats.find(s => s.seat_key === cur.parent_seat_key);
    if (!parent) break;
    cur = parent;
    level++;
  }
  return level;
}

// ── Risk Level ──────────────────────────────────────────
export type GovernanceRiskLevel = "low" | "medium" | "high";

export function riskLevelFromScore(score: number): GovernanceRiskLevel {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
}

// ── Deterministic Risk Score ────────────────────────────
export interface SeatRiskResult {
  score: number;
  level: GovernanceRiskLevel;
  explanation: string;
  components: {
    kpi_deviation: number;
    budget_exposure: number;
    alignment_weakness: number;
    role_weight: number;
  };
}

export function calculateSeatRiskScore(
  seat: CommandSeat,
  allSeats: CommandSeat[],
  seatKPIs: KPI[],
  seatObjectives: Objective[],
): SeatRiskResult {
  const level = getSeatLevel(seat, allSeats);
  const roleWeight = ROLE_WEIGHT[level] ?? 0.6;

  // KPI Deviation (0-100): average deviation across seat's KPIs
  let kpiDeviation = 0;
  if (seatKPIs.length > 0) {
    const totalDev = seatKPIs.reduce((sum, kpi) => {
      if (kpi.target_value === 0) return sum;
      return sum + Math.min(100, Math.abs((kpi.current_value - kpi.target_value) / kpi.target_value) * 100);
    }, 0);
    kpiDeviation = totalDev / seatKPIs.length;
  }

  // Budget Exposure (0-100)
  let budgetExposure = 0;
  if (seat.budget.annual_limit > 0) {
    budgetExposure = Math.min(100, ((seat.budget.spent + seat.budget.reserved) / seat.budget.annual_limit) * 100);
  }

  // Alignment Weakness (0-100)
  let alignmentWeakness = 0;
  if (seatObjectives.length === 0) {
    alignmentWeakness = 60; // No OKR = weak
  } else {
    const avgAlignment = seatObjectives.reduce((s, o) => s + o.alignment_score, 0) / seatObjectives.length;
    alignmentWeakness = Math.max(0, 100 - avgAlignment);
  }

  const rawScore =
    (kpiDeviation * 0.4) +
    (budgetExposure * 0.3) +
    (alignmentWeakness * 0.2) +
    (roleWeight * 10 * 0.1); // normalize role weight to 0-12 range

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score,
    level: riskLevelFromScore(score),
    explanation: `Risk = KPI Sapma(${kpiDeviation.toFixed(0)}×0.4) + Bütçe(${budgetExposure.toFixed(0)}×0.3) + Hizalama(${alignmentWeakness.toFixed(0)}×0.2) + Rol(${(roleWeight * 10).toFixed(0)}×0.1) = ${score}`,
    components: {
      kpi_deviation: Math.round(kpiDeviation),
      budget_exposure: Math.round(budgetExposure),
      alignment_weakness: Math.round(alignmentWeakness),
      role_weight: roleWeight,
    },
  };
}

// ── Governance Score ────────────────────────────────────
export interface GovernanceScoreResult {
  score: number;
  components: {
    okr_active: number;
    okr_progress: number;
    kpi_stability: number;
    budget_compliance: number;
    alignment: number;
  };
}

export function calculateGovernanceScore(
  seat: CommandSeat,
  seatKPIs: KPI[],
  seatObjectives: Objective[],
): GovernanceScoreResult {
  // OKR Active (20%): 100 if has active OKR, 0 if not
  const okrActive = seatObjectives.some(o => o.status === "active") ? 100 : 0;

  // OKR Progress (20%): average health score
  const okrProgress = seatObjectives.length > 0
    ? seatObjectives.reduce((s, o) => s + o.health_score, 0) / seatObjectives.length
    : 0;

  // KPI Stability (20%): based on trend
  let kpiStability = 0;
  if (seatKPIs.length > 0) {
    const trendScores: Record<KPITrend, number> = { improving: 100, stable: 60, declining: 20 };
    kpiStability = seatKPIs.reduce((s, k) => s + trendScores[k.trend], 0) / seatKPIs.length;
  }

  // Budget Compliance (20%): how well within budget
  let budgetCompliance = 100;
  if (seat.budget.annual_limit > 0) {
    const utilization = (seat.budget.spent + seat.budget.reserved) / seat.budget.annual_limit;
    budgetCompliance = utilization > 1 ? 0 : utilization > 0.9 ? 40 : utilization > 0.8 ? 70 : 100;
  }

  // Alignment (20%): average alignment score of objectives
  const alignment = seatObjectives.length > 0
    ? seatObjectives.reduce((s, o) => s + o.alignment_score, 0) / seatObjectives.length
    : 0;

  const score = Math.round(
    (okrActive * 0.2) +
    (okrProgress * 0.2) +
    (kpiStability * 0.2) +
    (budgetCompliance * 0.2) +
    (alignment * 0.2)
  );

  return {
    score,
    components: {
      okr_active: Math.round(okrActive),
      okr_progress: Math.round(okrProgress),
      kpi_stability: Math.round(kpiStability),
      budget_compliance: Math.round(budgetCompliance),
      alignment: Math.round(alignment),
    },
  };
}

// ── Strategic Inactivity Detection ──────────────────────
export interface StrategicInactivityResult {
  detected: boolean;
  reason: string;
  severity: GovernanceRiskLevel;
}

export function detectStrategicInactivity(
  seatObjectives: Objective[],
  seatKPIs: KPI[],
): StrategicInactivityResult {
  const noOKR = seatObjectives.length === 0;
  const lowProgress = !noOKR && seatObjectives.every(o => o.health_score < 40);
  const okrWeak = noOKR || lowProgress;

  const negativeOrStagnant = seatKPIs.length > 0 &&
    seatKPIs.every(k => k.trend === "declining" || k.trend === "stable");

  if (!okrWeak || !negativeOrStagnant) {
    return { detected: false, reason: "", severity: "low" };
  }

  // Calculate severity based on KPI deviation
  const avgDeviation = seatKPIs.length > 0
    ? seatKPIs.reduce((s, k) => {
        if (k.target_value === 0) return s;
        return s + Math.abs((k.current_value - k.target_value) / k.target_value) * 100;
      }, 0) / seatKPIs.length
    : 0;

  const severity: GovernanceRiskLevel = avgDeviation > 40 ? "high" : avgDeviation > 20 ? "medium" : "low";

  const reasons: string[] = [];
  if (noOKR) reasons.push("Aktif OKR bulunmuyor");
  if (lowProgress) reasons.push("OKR ilerleme skoru düşük");
  if (negativeOrStagnant) reasons.push("KPI trendi negatif/durağan");

  return {
    detected: true,
    reason: reasons.join("; "),
    severity,
  };
}

// ── Alignment Status ────────────────────────────────────
export type AlignmentStatus = "ALIGNED" | "UNALIGNED" | "WEAK";

export interface SeatAlignmentResult {
  status: AlignmentStatus;
  unaligned_action_count: number;
  has_misalignment_warning: boolean; // 3+ unaligned
}

export function calculateSeatAlignment(
  seatObjectives: Objective[],
  unalignedActionCount: number,
): SeatAlignmentResult {
  if (seatObjectives.length === 0) {
    return { status: "WEAK", unaligned_action_count: unalignedActionCount, has_misalignment_warning: unalignedActionCount >= 3 };
  }

  if (unalignedActionCount >= 3) {
    return { status: "UNALIGNED", unaligned_action_count: unalignedActionCount, has_misalignment_warning: true };
  }

  return { status: "ALIGNED", unaligned_action_count: unalignedActionCount, has_misalignment_warning: false };
}

// ── OKR Suggestion (not auto-create) ────────────────────
export interface OKRSuggestion {
  seat_key: string;
  suggested_title: string;
  reason: string;
  risk_level: GovernanceRiskLevel;
  approval_required: "self" | "parent" | "escalation";
}

export function generateOKRSuggestion(
  seat: CommandSeat,
  allSeats: CommandSeat[],
  inactivity: StrategicInactivityResult,
): OKRSuggestion | null {
  if (!inactivity.detected) return null;

  const level = getSeatLevel(seat, allSeats);

  // Determine approval requirement based on risk
  let approvalRequired: "self" | "parent" | "escalation" = "self";
  if (inactivity.severity === "medium") approvalRequired = "parent";
  if (inactivity.severity === "high") approvalRequired = "escalation";

  const departmentSuggestions: Record<string, string> = {
    executive: "Stratejik büyüme hedefi belirleyin",
    finance: "Finansal optimizasyon hedefi oluşturun",
    technology: "Teknik altyapı iyileştirme hedefi tanımlayın",
    marketing: "Pazarlama performans hedefi belirleyin",
    operations: "Operasyonel verimlilik hedefi oluşturun",
    hr: "İnsan kaynakları gelişim hedefi tanımlayın",
    sales: "Satış performans hedefi belirleyin",
    creative: "Kreatif çıktı kalite hedefi oluşturun",
    marketplace: "Pazaryeri büyüme hedefi tanımlayın",
    legal: "Uyum ve risk azaltma hedefi belirleyin",
  };

  return {
    seat_key: seat.seat_key,
    suggested_title: departmentSuggestions[seat.department_key] || "Stratejik hedef belirleyin",
    reason: inactivity.reason,
    risk_level: inactivity.severity,
    approval_required: approvalRequired,
  };
}

// ── Full Seat Intelligence (aggregate) ──────────────────
export interface SeatIntelligence {
  risk: SeatRiskResult;
  governance: GovernanceScoreResult;
  inactivity: StrategicInactivityResult;
  alignment: SeatAlignmentResult;
  suggestion: OKRSuggestion | null;
  hasActiveOKR: boolean;
}

export function computeSeatIntelligence(
  seat: CommandSeat,
  allSeats: CommandSeat[],
  seatKPIs: KPI[],
  seatObjectives: Objective[],
  unalignedActionCount: number,
): SeatIntelligence {
  const risk = calculateSeatRiskScore(seat, allSeats, seatKPIs, seatObjectives);
  const governance = calculateGovernanceScore(seat, seatKPIs, seatObjectives);
  const inactivity = detectStrategicInactivity(seatObjectives, seatKPIs);
  const alignment = calculateSeatAlignment(seatObjectives, unalignedActionCount);
  const suggestion = generateOKRSuggestion(seat, allSeats, inactivity);
  const hasActiveOKR = seatObjectives.some(o => o.status === "active");

  return { risk, governance, inactivity, alignment, suggestion, hasActiveOKR };
}
