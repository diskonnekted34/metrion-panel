/**
 * Decision Engine
 * Pure, stateless functions for all decision-related calculations.
 * No React imports. No side effects. Fully unit-testable.
 */

import type { Decision, DecisionLifecycle } from "../types/decisions";

// ── Types ──────────────────────────────────────────────────────────────

export interface DecisionHealthResult {
  score: number;             // 0–100
  completed: number;
  successful: number;
  avgConfidence: number;
  color: "green" | "amber" | "red";
}

export interface DecisionMetrics {
  pendingCount: number;
  highRiskCount: number;
  activeCount: number;
  approvalPending: number;
  delayedHighPriority: Decision[];
}

export interface MatrixPosition {
  riskX: number;   // 0–100 (%)
  impactY: number; // 0–100 (%)
}

export interface PipelineStageCounts {
  [stageKey: string]: number;
}

// ── Config ─────────────────────────────────────────────────────────────

const HEALTH_WEIGHTS = {
  completionRate: 0.30,
  successRate: 0.40,
  aiConfidence: 0.30,
} as const;

const HEALTH_THRESHOLDS = {
  green: 75,
  amber: 50,
} as const;

const PRESSURE_DELAY_DAYS = 3;

const TERMINAL_LIFECYCLES: DecisionLifecycle[] = ["completed", "rejected", "failed"];

// ── Health Score ────────────────────────────────────────────────────────

export function calculateDecisionHealth(decisions: Decision[]): DecisionHealthResult {
  const total = decisions.length || 1;
  const completed = decisions.filter(d => d.lifecycle === "completed").length;
  const successful = decisions.filter(
    d => d.performanceReport?.status === "successful"
  ).length;
  const avgConfidence = Math.round(
    decisions.reduce((s, d) => s + d.aiConfidence, 0) / total
  );

  const score = Math.round(
    (completed / total) * (HEALTH_WEIGHTS.completionRate * 100) +
    (successful / Math.max(completed, 1)) * (HEALTH_WEIGHTS.successRate * 100) +
    (avgConfidence / 100) * (HEALTH_WEIGHTS.aiConfidence * 100)
  );

  const color =
    score >= HEALTH_THRESHOLDS.green ? "green"
    : score >= HEALTH_THRESHOLDS.amber ? "amber"
    : "red";

  return { score, completed, successful, avgConfidence, color };
}

// ── Aggregate Metrics ───────────────────────────────────────────────────

export function calculateDecisionMetrics(decisions: Decision[], now = new Date()): DecisionMetrics {
  const pendingLifecycles: DecisionLifecycle[] = ["proposed", "under_review"];

  const pendingCount = decisions.filter(d => pendingLifecycles.includes(d.lifecycle)).length;

  const highRiskCount = decisions.filter(
    d => d.riskLevel === "high" && pendingLifecycles.includes(d.lifecycle)
  ).length;

  const activeCount = decisions.filter(
    d => !TERMINAL_LIFECYCLES.includes(d.lifecycle)
  ).length;

  const approvalPending = pendingCount;

  const delayedHighPriority = decisions.filter(d => {
    if (!pendingLifecycles.includes(d.lifecycle)) return false;
    const daysSince = getDaysSince(d.lastActionDate, now);
    return daysSince >= PRESSURE_DELAY_DAYS;
  });

  return { pendingCount, highRiskCount, activeCount, approvalPending, delayedHighPriority };
}

// ── Pipeline Stage Counts ───────────────────────────────────────────────

export function calculatePipelineStageCounts(
  decisions: Decision[],
  stages: Array<{ key: string }>
): PipelineStageCounts {
  return Object.fromEntries(
    stages.map(stage => [
      stage.key,
      decisions.filter(d => d.lifecycle === stage.key).length,
    ])
  );
}

// ── Impact Matrix Positioning ───────────────────────────────────────────

export function calculateMatrixPosition(decision: Decision): MatrixPosition {
  const jitter = seededJitter(decision.id);

  const riskX =
    decision.riskLevel === "high" ? 75 + jitter * 15
    : decision.riskLevel === "medium" ? 35 + jitter * 25
    : 5 + jitter * 25;

  const impactY = 100 - (decision.priorityScore + jitter * 5);

  return { riskX, impactY };
}

// ── Scenario Projection ─────────────────────────────────────────────────

export interface ScenarioPoint {
  month: number;
  best: number;
  base: number;
  worst: number;
}

export function projectDecisionScenarios(decision: Decision): ScenarioPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    best: 100 + i * (decision.priorityScore / 8) + Math.sin(i) * 10,
    base: 100 + i * (decision.priorityScore / 12),
    worst: 100 + i * (decision.priorityScore / 20) - Math.abs(Math.sin(i)) * 8,
  }));
}

// ── Decision Color ──────────────────────────────────────────────────────

export function getDecisionNodeColor(decision: Decision): string {
  if (decision.lifecycle === "approved" || decision.lifecycle === "completed") return "#34D399";
  if (decision.riskLevel === "high") return "#EF4444";
  if (decision.lifecycle === "proposed" || decision.lifecycle === "under_review") return "#F59E0B";
  return "#1E6BFF";
}

// ── Helpers ─────────────────────────────────────────────────────────────

function getDaysSince(dateStr: string, now: Date): number {
  const then = new Date(dateStr);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

/** Deterministic 0–1 float derived from a string id. */
function seededJitter(id: string): number {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 100) / 100;
}
