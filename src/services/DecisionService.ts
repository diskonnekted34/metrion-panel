/**
 * DecisionService — Data Access Layer
 *
 * Uses Supabase/apiClient when backend tables are available.
 * Falls back to mock data ONLY when isMockEnabled() returns true (DEV+opt-in).
 */

import type {
  Decision,
  DecisionApproval,
} from "@/contracts/v1/governance";
import type { ApiResponse } from "@/contracts/v1/api";
import type { CreateDecisionInput, ApprovalRequestInput } from "@/contracts/v1/schemas";
import { apiGet, apiPost, apiPatch, ApiError } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { isMockEnabled } from "@/lib/env";

// ── Mock data (lazy import to avoid bundling in prod) ───
import { decisions as mockDecisions } from "@/data/decisions";
import type { Decision as MockDecision } from "@/data/decisions";

// ── Mock → Contract mapper ──────────────────────────────
function mapMockToContract(d: MockDecision): Decision {
  return {
    id: d.id,
    tenantId: "tenant_001",
    title: d.title,
    description: d.description,
    state: mapLifecycleToState(d.lifecycle),
    category: d.category,
    departmentKey: d.department ?? "general",
    proposingSeat: d.responsibleSeat ?? "CEO",
    priorityScore: d.priorityScore,
    riskLevel: d.riskLevel,
    aiConfidencePct: d.aiConfidence,
    financialImpact: {
      currency: "TRY",
      estimatedValue: parseFloat(d.estimatedFinancialImpact.replace(/[^0-9.-]/g, "")) || 0,
      confidencePct: d.aiConfidence,
      timeHorizonDays: 90,
    },
    delayRisk: {
      daysThreshold: d.decisionDelayRisk.days,
      estimatedLoss: parseFloat(d.decisionDelayRisk.estimatedLoss.replace(/[^0-9.-]/g, "")) || 0,
    },
    kpiAttachments: d.kpiAttachment
      ? [
          {
            kpiKey: d.kpiAttachment.primary.name,
            kpiLabel: d.kpiAttachment.primary.name,
            baselineValue: d.kpiAttachment.primary.baseline,
            targetValue: d.kpiAttachment.primary.target,
            currentValue: d.kpiAttachment.primary.current,
            monitoringDurationDays: parseInt(d.kpiAttachment.monitoringDuration) || 30,
          },
        ]
      : [],
    aiReasoning: d.aiReasoning,
    dataSources: d.dataSources,
    scenarios: {
      best: { label: "Best", value: 0 },
      base: { label: "Base", value: 0 },
      worst: { label: "Worst", value: 0 },
    },
    requiredApprovers: d.requiredApprovers,
    overrideEvents: d.overrideEvents.map((e, i) => ({
      id: `ov-${i}`,
      seatKey: e.user,
      action: "override" as const,
      reason: e.details,
      timestamp: e.date,
    })),
    createdAt: d.createdAt,
    updatedAt: d.lastActionDate,
    decidedAt: d.approvedAt,
  };
}

function mapLifecycleToState(lc: string): Decision["state"] {
  const map: Record<string, Decision["state"]> = {
    proposed: "draft",
    under_review: "review",
    approved: "approved",
    rejected: "rejected",
    in_execution: "approved",
    monitoring: "approved",
    completed: "archived",
    failed: "rejected",
  };
  return map[lc] ?? "draft";
}

// ── Service ─────────────────────────────────────────────
export const DecisionService = {
  /* ── Sync helpers (mock-only, used by legacy UI) ── */
  getAll(): Decision[] {
    return mockDecisions.map(mapMockToContract);
  },

  getById(id: string): Decision | undefined {
    const d = mockDecisions.find((m) => m.id === id);
    return d ? mapMockToContract(d) : undefined;
  },

  async fetchAllMock(): Promise<MockDecision[]> {
    return Promise.resolve([...mockDecisions]);
  },

  async fetchMockById(id: string): Promise<MockDecision | undefined> {
    return Promise.resolve(mockDecisions.find((m) => m.id === id));
  },

  /* ── Async API methods ── */
  async fetchAll(opts?: { token?: string; signal?: AbortSignal }): Promise<Decision[]> {
    if (isMockEnabled()) return this.getAll();
    try {
      const res = await apiGet<ApiResponse<Decision[]>>(
        API_ROUTES.governance.decisions,
        opts,
      );
      return res.data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw err; // No silent mock fallback in prod
    }
  },

  async fetchById(
    id: string,
    opts?: { token?: string; signal?: AbortSignal },
  ): Promise<Decision | undefined> {
    if (isMockEnabled()) return this.getById(id);
    try {
      const res = await apiGet<ApiResponse<Decision>>(
        API_ROUTES.governance.decision(id),
        opts,
      );
      return res.data;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return undefined;
      throw err;
    }
  },

  async create(
    payload: CreateDecisionInput,
    opts?: { token?: string },
  ): Promise<Decision> {
    if (isMockEnabled()) throw new ApiError(501, "Mock mode: create not supported");
    const res = await apiPost<ApiResponse<Decision>>(
      API_ROUTES.governance.decisions,
      payload,
      opts,
    );
    return res.data;
  },

  async update(
    id: string,
    payload: Partial<CreateDecisionInput>,
    opts?: { token?: string },
  ): Promise<Decision> {
    if (isMockEnabled()) throw new ApiError(501, "Mock mode: update not supported");
    const res = await apiPatch<ApiResponse<Decision>>(
      API_ROUTES.governance.decision(id),
      payload,
      opts,
    );
    return res.data;
  },

  async approvals(
    id: string,
    opts?: { token?: string; signal?: AbortSignal },
  ): Promise<DecisionApproval[]> {
    if (isMockEnabled()) return [];
    const res = await apiGet<ApiResponse<DecisionApproval[]>>(
      API_ROUTES.governance.decisionApprovals(id),
      opts,
    );
    return res.data;
  },

  async approve(
    id: string,
    payload: ApprovalRequestInput,
    opts?: { token?: string },
  ): Promise<DecisionApproval> {
    if (isMockEnabled()) throw new ApiError(501, "Mock mode: approve not supported");
    const res = await apiPost<ApiResponse<DecisionApproval>>(
      API_ROUTES.governance.decisionApprovals(id),
      payload,
      opts,
    );
    return res.data;
  },
};
