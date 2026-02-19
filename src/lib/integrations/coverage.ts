/**
 * Tech Connector Coverage — Pure deterministic function.
 */
import type { TechConnector, TechConnectorCategory } from "@/data/techIntegrations";
import { techCategories } from "@/data/techIntegrations";

export interface CoverageResult {
  category: TechConnectorCategory;
  category_name_tr: string;
  total: number;
  connected: number;
  percent: number;
}

export function calculateCoverage(connectors: TechConnector[]): CoverageResult[] {
  return techCategories.map(cat => {
    const items = connectors.filter(c => c.category === cat.id);
    const connected = items.filter(c => c.status === "connected").length;
    return {
      category: cat.id,
      category_name_tr: cat.name_tr,
      total: items.length,
      connected,
      percent: items.length > 0 ? Math.round((connected / items.length) * 100) : 0,
    };
  }).filter(r => r.total > 0);
}

export function getCTOImpact(connectors: TechConnector[]): { covered: number; total: number } {
  const ctoCategories: TechConnectorCategory[] = ["vcs", "issue_tracking", "cicd", "error_tracking"];
  const relevant = connectors.filter(c => ctoCategories.includes(c.category));
  const connected = relevant.filter(c => c.status === "connected").length;
  return { covered: connected, total: relevant.length };
}

export function getCIOImpact(connectors: TechConnector[]): { covered: number; total: number } {
  const cioCategories: TechConnectorCategory[] = ["cloud", "observability", "logging", "iam", "security", "waf_edge", "finops", "incident"];
  const relevant = connectors.filter(c => cioCategories.includes(c.category));
  const connected = relevant.filter(c => c.status === "connected").length;
  return { covered: connected, total: relevant.length };
}
