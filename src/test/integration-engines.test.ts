/**
 * Integration health/coverage/risk — deterministic tests.
 */
import { describe, it, expect } from "vitest";
import { computeHealthScore } from "@/lib/integrations/health";
import { computeRiskLevel } from "@/lib/integrations/risk";
import { calculateCoverage } from "@/lib/integrations/coverage";
import type { TechConnector } from "@/data/techIntegrations";

const makeConnector = (overrides: Partial<TechConnector>): TechConnector => ({
  id: "test",
  name_tr: "Test",
  vendor: "Test",
  category: "vcs",
  description_tr: "",
  status: "available",
  environments_supported: ["prod"],
  environment_scope_selected: [],
  data_sensitivity: "low",
  access_method: "oauth",
  refresh_frequency: "hourly",
  entities: [],
  events: [],
  required_permissions: [],
  least_privilege_notes_tr: "",
  common_failure_modes: [],
  setup_steps: [],
  coverage_impact: { metrics_covered: [], agents_impacted: [] },
  last_sync_at: null,
  last_sync_status: "never",
  error_message_tr: null,
  ui_assets: { icon_name: "Plug", badge_label_tr: "Test" },
  ...overrides,
});

describe("computeHealthScore", () => {
  it("returns red/0 for disconnected connector", () => {
    const result = computeHealthScore(makeConnector({ status: "available" }));
    expect(result.score).toBe(0);
    expect(result.state).toBe("red");
  });

  it("returns green for healthy connected connector", () => {
    const result = computeHealthScore(makeConnector({
      status: "connected",
      last_sync_at: new Date().toISOString(),
      last_sync_status: "ok",
      environment_scope_selected: ["prod"],
    }));
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.state).toBe("green");
  });

  it("returns yellow for partial sync with stale data", () => {
    const staleDate = new Date(Date.now() - 10 * 3600_000).toISOString();
    const result = computeHealthScore(makeConnector({
      status: "connected",
      last_sync_at: staleDate,
      last_sync_status: "partial",
      environment_scope_selected: ["prod"],
    }));
    expect(result.state).toBe("yellow");
  });

  it("flags stale sync as reason", () => {
    const staleDate = new Date(Date.now() - 30 * 24 * 3600_000).toISOString();
    const result = computeHealthScore(makeConnector({
      status: "connected",
      last_sync_at: staleDate,
      last_sync_status: "ok",
      environment_scope_selected: ["prod"],
    }));
    expect(result.reasons.some(r => r.includes("gecikmiş"))).toBe(true);
  });
});

describe("computeRiskLevel", () => {
  it("returns low for healthy connected connector", () => {
    const result = computeRiskLevel(makeConnector({ status: "connected" }));
    expect(result.level).toBe("low");
  });

  it("returns high for error status", () => {
    const result = computeRiskLevel(makeConnector({ status: "error" }));
    expect(result.level).toBe("high");
  });

  it("flags high-sensitivity disconnected as risk", () => {
    const result = computeRiskLevel(makeConnector({
      status: "available",
      data_sensitivity: "high",
    }));
    expect(result.level).toBe("medium");
    expect(result.reasons.some(r => r.includes("hassasiyet"))).toBe(true);
  });

  it("returns critical for error + failed sync in security category", () => {
    const result = computeRiskLevel(makeConnector({
      status: "error",
      category: "security",
      last_sync_status: "failed",
      data_sensitivity: "high",
    }));
    expect(result.level).toBe("critical");
  });
});

describe("calculateCoverage", () => {
  it("returns 0% for categories with no connected items", () => {
    const connectors = [makeConnector({ category: "vcs", status: "available" })];
    const result = calculateCoverage(connectors);
    const vcs = result.find(r => r.category === "vcs");
    expect(vcs?.percent).toBe(0);
    expect(vcs?.connected).toBe(0);
  });

  it("returns 100% when all items connected", () => {
    const connectors = [makeConnector({ category: "vcs", status: "connected" })];
    const result = calculateCoverage(connectors);
    const vcs = result.find(r => r.category === "vcs");
    expect(vcs?.percent).toBe(100);
  });

  it("filters out categories with no connectors", () => {
    const result = calculateCoverage([]);
    expect(result.length).toBe(0);
  });
});
