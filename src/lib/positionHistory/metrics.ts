/**
 * Pure deterministic functions for Position History derived metrics.
 * No side effects, no UI — reusable by future backend.
 */

import type {
  PositionAssignment,
  HandoverChecklist,
  HandoverQuality,
  PositionStatus,
  PositionDerivedMetrics,
} from "@/core/types/positionHistory";

/** Days between two dates (ISO strings). Uses UTC to avoid TZ issues. */
export function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay));
}

/** Current date as ISO string (test-overrideable via param) */
function today(now?: string): string {
  return now ?? new Date().toISOString().slice(0, 10);
}

/** Compute tenure in days for the current (open) assignment */
export function computeTenure(assignment: PositionAssignment | null, now?: string): number {
  if (!assignment) return 0;
  const end = assignment.end_date ?? today(now);
  return daysBetween(assignment.start_date, end);
}

/** Count transitions within a date range */
export function countChanges(
  assignments: PositionAssignment[],
  rangeMonths: 12 | 24,
  now?: string
): number {
  const ref = new Date(now ?? today());
  const cutoff = new Date(ref);
  cutoff.setMonth(cutoff.getMonth() - rangeMonths);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return assignments.filter(a => a.start_date >= cutoffStr).length;
}

/** Total vacancy days = sum of gaps between consecutive assignments */
export function computeVacancyDays(
  assignments: PositionAssignment[],
  rangeMonths: 24,
  now?: string
): number {
  if (assignments.length < 2) return 0;

  const ref = new Date(now ?? today());
  const cutoff = new Date(ref);
  cutoff.setMonth(cutoff.getMonth() - rangeMonths);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const sorted = [...assignments]
    .filter(a => (a.end_date ?? today(now)) >= cutoffStr)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  let vacDays = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].end_date;
    if (prevEnd && prevEnd < sorted[i].start_date) {
      vacDays += daysBetween(prevEnd, sorted[i].start_date);
    }
  }
  return vacDays;
}

/** Average tenure across completed (closed) assignments */
export function computeAvgTenure(assignments: PositionAssignment[]): number {
  const closed = assignments.filter(a => a.end_date !== null);
  if (closed.length === 0) return 0;
  const total = closed.reduce((sum, a) => sum + daysBetween(a.start_date, a.end_date!), 0);
  return Math.round(total / closed.length);
}

/** Acting ratio = acting days / total range days */
export function computeActingRatio(
  assignments: PositionAssignment[],
  rangeMonths: 24,
  now?: string
): number {
  const ref = new Date(now ?? today());
  const cutoff = new Date(ref);
  cutoff.setMonth(cutoff.getMonth() - rangeMonths);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const totalDays = daysBetween(cutoffStr, today(now));
  if (totalDays === 0) return 0;

  const actingDays = assignments
    .filter(a => a.assignment_type === "ACTING")
    .filter(a => (a.end_date ?? today(now)) >= cutoffStr)
    .reduce((sum, a) => {
      const start = a.start_date < cutoffStr ? cutoffStr : a.start_date;
      const end = a.end_date ?? today(now);
      return sum + daysBetween(start, end);
    }, 0);

  return Math.min(1, actingDays / totalDays);
}

/** Handover quality badge from checklist */
export function computeHandoverQuality(
  checklist: HandoverChecklist | null | undefined,
  openItemsThreshold = 3
): HandoverQuality {
  if (!checklist) return "UNKNOWN";
  if (checklist.completion_percent >= 80 && checklist.open_items_count <= openItemsThreshold)
    return "GOOD";
  if (checklist.completion_percent < 50 || checklist.open_items_count > openItemsThreshold * 2)
    return "RISKY";
  return "UNKNOWN";
}

/** Position status from current assignment */
export function computePositionStatus(
  currentAssignment: PositionAssignment | null
): PositionStatus {
  if (!currentAssignment || currentAssignment.end_date !== null) return "VACANT";
  if (currentAssignment.assignment_type === "ACTING") return "ACTING";
  return "ACTIVE";
}

/**
 * Stability score (0–100):
 * 100 - (changes_weighted * 15 + vacancy_days * 0.5 + acting_ratio * 30)
 * changes_weighted = transitions + acting_transitions * 0.5
 */
export function computeStabilityScore(
  assignments: PositionAssignment[],
  vacancyDays: number,
  actingRatio: number,
  rangeMonths: 12 | 24 = 12,
  now?: string
): number {
  const ref = new Date(now ?? today());
  const cutoff = new Date(ref);
  cutoff.setMonth(cutoff.getMonth() - rangeMonths);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const inRange = assignments.filter(a => a.start_date >= cutoffStr);
  const permanentChanges = inRange.filter(a => a.assignment_type === "PERMANENT").length;
  const actingChanges = inRange.filter(a => a.assignment_type === "ACTING").length;
  const changesWeighted = permanentChanges + actingChanges * 0.5;

  const raw = 100 - (changesWeighted * 15 + vacancyDays * 0.5 + actingRatio * 30);
  return Math.round(Math.max(0, Math.min(100, raw)));
}

/** Compute all derived metrics for a position */
export function computePositionMetrics(
  assignments: PositionAssignment[],
  currentAssignment: PositionAssignment | null,
  latestHandover: HandoverChecklist | null | undefined,
  now?: string
): PositionDerivedMetrics {
  const vacancyDays = computeVacancyDays(assignments, 24, now);
  const actingRatio = computeActingRatio(assignments, 24, now);

  return {
    tenure_days: computeTenure(currentAssignment, now),
    changes_12m: countChanges(assignments, 12, now),
    changes_24m: countChanges(assignments, 24, now),
    vacancy_days: vacancyDays,
    avg_tenure_days: computeAvgTenure(assignments),
    acting_ratio: actingRatio,
    stability_score: computeStabilityScore(assignments, vacancyDays, actingRatio, 12, now),
    handover_quality: computeHandoverQuality(latestHandover),
    status: computePositionStatus(currentAssignment),
  };
}
