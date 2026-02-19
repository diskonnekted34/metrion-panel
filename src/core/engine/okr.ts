/**
 * OKR Engines
 * - Health Score Engine
 * - Deviation Detection Engine
 * - AI Strategic Correction Engine (Workforce only)
 * - Alignment Scoring Engine (Workforce only)
 */

import type {
  Objective, KeyResult, OKRCycle, CorrectiveDecisionDraft,
  StrategicHealthIndex, DepartmentAlignment, OKRPlanLevel,
  ObjectiveHealthExplanation,
} from "../types/okr";

// ── Config ──────────────────────────────────────────────
const HEALTH_WEIGHTS = {
  progress: 0.50,
  risk: 0.25,
  velocity: 0.25,
};

const DEFAULT_DEVIATION_THRESHOLD = 0.15; // 15% behind expected
const RISK_THRESHOLD = 60;
const SUCCESS_PROBABILITY_THRESHOLD = 40;

// ── Progress Calculation ────────────────────────────────
export function calculateKRProgress(kr: KeyResult): number {
  const range = kr.target_value - kr.baseline_value;
  if (range === 0) return kr.current_value >= kr.target_value ? 100 : 0;
  const progress = ((kr.current_value - kr.baseline_value) / range) * 100;
  return Math.max(0, Math.min(100, progress));
}

export function calculateObjectiveProgress(krs: KeyResult[]): number {
  if (krs.length === 0) return 0;
  const totalWeight = krs.reduce((s, kr) => s + kr.weight, 0);
  if (totalWeight === 0) return 0;
  return krs.reduce((s, kr) => s + calculateKRProgress(kr) * (kr.weight / totalWeight), 0);
}

// ── Expected Progress (time-based) ──────────────────────
export function calculateExpectedProgress(cycle: OKRCycle): number {
  const start = new Date(cycle.start_date).getTime();
  const end = new Date(cycle.end_date).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return ((now - start) / (end - start)) * 100;
}

// ── Velocity (trend factor) ────────────────────────────
export function calculateVelocity(currentProgress: number, expectedProgress: number): number {
  if (expectedProgress === 0) return 1;
  const ratio = currentProgress / expectedProgress;
  return Math.max(0, Math.min(2, ratio)); // 0-2 scale, 1 = on track
}

// ── Health Score Engine ────────────────────────────────
export function calculateHealthScore(
  progressPct: number,
  riskScore: number,
  velocityFactor: number
): { score: number; explanation: ObjectiveHealthExplanation } {
  const progressComponent = HEALTH_WEIGHTS.progress * progressPct;
  const riskComponent = HEALTH_WEIGHTS.risk * riskScore;
  const velocityComponent = HEALTH_WEIGHTS.velocity * (velocityFactor * 50); // normalize to 0-100

  const score = Math.max(0, Math.min(100,
    progressComponent - riskComponent + velocityComponent
  ));

  const explanation: ObjectiveHealthExplanation = {
    progress_component: `İlerleme katkısı: ${progressComponent.toFixed(1)} (ağırlık: ${HEALTH_WEIGHTS.progress}, ilerleme: %${progressPct.toFixed(1)})`,
    risk_component: `Risk düşüşü: -${riskComponent.toFixed(1)} (ağırlık: ${HEALTH_WEIGHTS.risk}, risk skoru: ${riskScore.toFixed(1)})`,
    velocity_component: `Hız katkısı: ${velocityComponent.toFixed(1)} (ağırlık: ${HEALTH_WEIGHTS.velocity}, hız faktörü: ${velocityFactor.toFixed(2)})`,
    summary: `Sağlık Skoru = (${progressComponent.toFixed(1)}) - (${riskComponent.toFixed(1)}) + (${velocityComponent.toFixed(1)}) = ${score.toFixed(1)}`,
  };

  return { score, explanation };
}

// ── Risk Score ──────────────────────────────────────────
export function calculateRiskScore(
  deviationDelta: number,
  velocityFactor: number,
  daysRemaining: number,
  totalDays: number
): { score: number; explanation: string } {
  const timeUrgency = totalDays > 0 ? Math.max(0, 1 - daysRemaining / totalDays) : 1;
  const deviationRisk = Math.min(100, Math.abs(deviationDelta) * 100);
  const velocityRisk = velocityFactor < 0.8 ? (1 - velocityFactor) * 60 : 0;
  const score = Math.min(100, deviationRisk * 0.4 + velocityRisk * 0.3 + timeUrgency * 30);

  return {
    score,
    explanation: `Risk = Sapma(${deviationRisk.toFixed(0)}×0.4) + Hız(${velocityRisk.toFixed(0)}×0.3) + Zaman(${(timeUrgency * 30).toFixed(0)}) = ${score.toFixed(1)}`,
  };
}

// ── Probability of Success ──────────────────────────────
export function calculateSuccessProbability(
  progressPct: number,
  velocityFactor: number,
  riskScore: number
): { probability: number; explanation: string } {
  const base = progressPct * 0.4 + velocityFactor * 30 + (100 - riskScore) * 0.3;
  const probability = Math.max(0, Math.min(100, base));

  return {
    probability,
    explanation: `Başarı Olasılığı = İlerleme(${(progressPct * 0.4).toFixed(1)}) + Hız(${(velocityFactor * 30).toFixed(1)}) + RiskDüşüklüğü(${((100 - riskScore) * 0.3).toFixed(1)}) = %${probability.toFixed(1)}`,
  };
}

// ── Deviation Detection Engine ──────────────────────────
export function detectDeviation(
  actualProgress: number,
  expectedProgress: number,
  threshold: number = DEFAULT_DEVIATION_THRESHOLD
): { flag: boolean; delta: number } {
  if (expectedProgress === 0) return { flag: false, delta: 0 };
  const delta = (expectedProgress - actualProgress) / expectedProgress;
  return { flag: delta > threshold, delta };
}

// ── Full Objective Health Recalculation ─────────────────
export function recalculateObjectiveHealth(
  _objective: Objective,
  krs: KeyResult[],
  cycle: OKRCycle,
  deviationThreshold?: number
): Partial<Objective> {
  const progress = calculateObjectiveProgress(krs);
  const expectedProgress = calculateExpectedProgress(cycle);
  const velocity = calculateVelocity(progress, expectedProgress);

  const start = new Date(cycle.start_date).getTime();
  const end = new Date(cycle.end_date).getTime();
  const totalDays = (end - start) / 86400000;
  const daysRemaining = Math.max(0, (end - Date.now()) / 86400000);

  const { flag, delta } = detectDeviation(progress, expectedProgress, deviationThreshold);
  const { score: riskScore, explanation: riskExplanation } = calculateRiskScore(delta, velocity, daysRemaining, totalDays);
  const { score: healthScore, explanation: healthExplanation } = calculateHealthScore(progress, riskScore, velocity);
  const { probability, explanation: successExplanation } = calculateSuccessProbability(progress, velocity, riskScore);

  return {
    health_score: Math.round(healthScore),
    risk_score: Math.round(riskScore),
    probability_of_success: Math.round(probability),
    health_explanation: healthExplanation,
    risk_explanation: riskExplanation,
    success_explanation: successExplanation,
    deviation_flag: flag,
    deviation_delta: Math.round(delta * 100),
  };
}

// ── AI Strategic Correction Engine (Workforce Only) ─────
let correctionIdCounter = 0;

export function generateCorrectiveDecisionDraft(
  objective: Objective,
  tenantId: string
): CorrectiveDecisionDraft | null {
  if (!objective.deviation_flag) return null;
  if (objective.risk_score <= RISK_THRESHOLD && objective.probability_of_success >= SUCCESS_PROBABILITY_THRESHOLD) return null;

  const id = `corr_${++correctionIdCounter}_${Date.now()}`;

  const rationale = [
    `Hedef "${objective.title}" sapma durumunda (sapma: %${objective.deviation_delta}).`,
    `Risk skoru: ${objective.risk_score}/100 (eşik: ${RISK_THRESHOLD}).`,
    `Başarı olasılığı: %${objective.probability_of_success} (eşik: %${SUCCESS_PROBABILITY_THRESHOLD}).`,
    objective.risk_explanation,
    `Düzeltici aksiyon önerilmektedir.`,
  ].join(" ");

  const recommendations: Record<string, string> = {
    executive: "Üst düzey stratejik hedefi yeniden değerlendirin ve kaynak tahsisini optimize edin.",
    finance: "Bütçe tahsisini gözden geçirin, maliyet optimizasyonu senaryosu çalıştırın.",
    technology: "Sprint kapasitesini artırın veya teknik borç azaltma planı oluşturun.",
    marketing: "Kampanya ROI analizi yapın, düşük performanslı kanalları durdurun.",
    operations: "Darboğaz analizi yapın, süreç optimizasyonu başlatın.",
    hr: "Yetenek boşluğu analizi yapın, kritik pozisyon önceliklendirmesi güncelleyin.",
    sales: "Satış hunisi optimizasyonu yapın, dönüşüm oranı iyileştirme planı oluşturun.",
  };

  return {
    id,
    tenant_id: tenantId,
    linked_objective_id: objective.id,
    impact_estimate: Math.round(objective.deviation_delta * -1),
    recommended_action: recommendations[objective.department_key] || "Detaylı analiz ve aksiyon planı oluşturun.",
    rationale,
    simulation_option: `${objective.department_key}_correction_sim`,
    risk_score: objective.risk_score,
    created_at: new Date().toISOString(),
    status: "draft",
  };
}

// ── Strategic Health Index (Workforce aggregate) ────────
export function calculateStrategicHealthIndex(objectives: Objective[]): StrategicHealthIndex {
  if (objectives.length === 0) {
    return {
      overall_score: 0, at_risk_count: 0, on_track_count: 0,
      misalignment_count: 0, velocity_trend: "stable",
      explanation: "Henüz hedef bulunmamaktadır.",
    };
  }

  const avgHealth = objectives.reduce((s, o) => s + o.health_score, 0) / objectives.length;
  const atRisk = objectives.filter(o => o.risk_score > RISK_THRESHOLD).length;
  const onTrack = objectives.filter(o => !o.deviation_flag && o.health_score >= 60).length;
  const misaligned = objectives.filter(o => o.alignment_score < 40).length;

  const avgVelocity = objectives.reduce((s, o) => {
    const v = o.deviation_delta <= 0 ? 1.1 : 0.9;
    return s + v;
  }, 0) / objectives.length;

  const trend = avgVelocity > 1.05 ? "improving" : avgVelocity < 0.95 ? "declining" : "stable";

  return {
    overall_score: Math.round(avgHealth),
    at_risk_count: atRisk,
    on_track_count: onTrack,
    misalignment_count: misaligned,
    velocity_trend: trend,
    explanation: `${objectives.length} hedef analiz edildi. Ortalama sağlık: ${avgHealth.toFixed(0)}/100, ${atRisk} risk altında, ${onTrack} yolunda, ${misaligned} hizalama sorunu. Hız trendi: ${trend === "improving" ? "iyileşiyor" : trend === "declining" ? "düşüyor" : "stabil"}.`,
  };
}

// ── Alignment Engine (Workforce Only) ───────────────────
export function calculateDepartmentAlignments(
  objectives: Objective[],
  strategicObjectives: Objective[]
): DepartmentAlignment[] {
  const departments = [...new Set(objectives.map(o => o.department_key))];

  return departments.map(dept => {
    const deptObjectives = objectives.filter(o => o.department_key === dept);
    const linkedToStrategic = deptObjectives.filter(o =>
      o.parent_objective_id && strategicObjectives.some(s => s.id === o.parent_objective_id)
    );

    const coverage = strategicObjectives.length > 0
      ? linkedToStrategic.length / strategicObjectives.length
      : 0;

    // Overlap: multiple dept objectives pointing to same strategic
    const parentCounts: Record<string, number> = {};
    linkedToStrategic.forEach(o => {
      if (o.parent_objective_id) {
        parentCounts[o.parent_objective_id] = (parentCounts[o.parent_objective_id] || 0) + 1;
      }
    });
    const overlaps = Object.entries(parentCounts).filter(([, c]) => c > 1).map(([id]) => id);
    const conflictFactor = overlaps.length * 0.1;

    const alignmentScore = Math.max(0, Math.min(100, (coverage * 100) - conflictFactor * 100));

    const strain = deptObjectives.length > 5 ? "high" : deptObjectives.length > 3 ? "medium" : "low";

    return {
      department_key: dept,
      contribution_pct: Math.round(coverage * 100),
      coverage_completeness: Math.round(coverage * 100),
      conflict_factor: Math.round(conflictFactor * 100) / 100,
      alignment_score: Math.round(alignmentScore),
      overlapping_objectives: overlaps,
      resource_strain: strain,
    };
  });
}

// ── KR Status Helper ────────────────────────────────────
export function calculateKRStatus(kr: KeyResult, expectedProgress: number): KRStatus {
  const progress = calculateKRProgress(kr);
  if (progress >= 100) return "completed";
  if (progress >= expectedProgress * 0.85) return "on_track";
  if (progress >= expectedProgress * 0.6) return "at_risk";
  return "behind";
}

// ── Plan Enforcement ────────────────────────────────────
export function canAccessOKR(plan: OKRPlanLevel): boolean {
  return plan !== "disabled";
}

export function canUseHierarchy(plan: OKRPlanLevel): boolean {
  return plan === "workforce";
}

export function canUseAICorrection(plan: OKRPlanLevel): boolean {
  return plan === "workforce";
}

export function canUseMultiCycle(plan: OKRPlanLevel): boolean {
  return plan === "workforce";
}

export function canUseAlignment(plan: OKRPlanLevel): boolean {
  return plan === "workforce";
}

type KRStatus = "on_track" | "at_risk" | "behind" | "completed";
