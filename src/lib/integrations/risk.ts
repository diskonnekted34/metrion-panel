/**
 * Tech Connector Risk Level — Pure deterministic function.
 */
import type { TechConnector } from "@/data/techIntegrations";

export interface RiskResult {
  level: "low" | "medium" | "high" | "critical";
  reasons: string[];
}

export function computeRiskLevel(c: TechConnector): RiskResult {
  const reasons: string[] = [];
  let severity = 0;

  if (c.status === "error") {
    severity += 3;
    reasons.push("Sistem hata durumunda");
  }
  if (c.data_sensitivity === "high" && c.status !== "connected") {
    severity += 2;
    reasons.push("Yüksek hassasiyetli kaynak bağlı değil");
  }
  if (c.last_sync_status === "failed") {
    severity += 2;
    reasons.push("Son senkronizasyon başarısız");
  }
  if (c.status === "available" && ["security", "waf_edge", "iam"].includes(c.category)) {
    severity += 2;
    reasons.push("Güvenlik kategorisinde eksik bağlantı");
  }

  const level: RiskResult["level"] =
    severity >= 5 ? "critical" : severity >= 3 ? "high" : severity >= 1 ? "medium" : "low";
  return { level, reasons };
}
