/**
 * Tech Connector Health Score — Pure deterministic function.
 * Reusable by both UI and future backend.
 */
import type { TechConnector } from "@/data/techIntegrations";

export interface HealthResult {
  score: number;
  state: "green" | "yellow" | "red";
  reasons: string[];
}

export function computeHealthScore(c: TechConnector): HealthResult {
  if (c.status !== "connected") return { score: 0, state: "red", reasons: ["Sistem bağlı değil"] };

  let score = 0;
  const reasons: string[] = [];

  // Auth valid (+40)
  if (c.status === "connected" && c.last_sync_status !== "failed") {
    score += 40;
  } else if (c.last_sync_status === "partial") {
    score += 20;
    reasons.push("Token süresi yaklaşıyor olabilir");
  } else {
    reasons.push("Kimlik doğrulama sorunu");
  }

  // Last sync freshness (+20)
  if (c.last_sync_at) {
    const ageMs = Date.now() - new Date(c.last_sync_at).getTime();
    const expectedMs =
      c.refresh_frequency === "realtime" ? 3_600_000 :
      c.refresh_frequency === "hourly" ? 7_200_000 :
      c.refresh_frequency === "daily" ? 172_800_000 : 604_800_000;
    if (ageMs <= expectedMs) { score += 20; }
    else if (ageMs <= expectedMs * 3) { score += 10; reasons.push("Senkronizasyon gecikmiş"); }
    else { reasons.push("Senkronizasyon çok gecikmiş"); }
  } else {
    reasons.push("Hiç senkronize edilmemiş");
  }

  // Success rate (+20)
  if (c.last_sync_status === "ok") { score += 20; }
  else if (c.last_sync_status === "partial") { score += 10; reasons.push("Kısmi senkronizasyon"); }
  else { reasons.push("Son senkronizasyon başarısız"); }

  // Scope completeness (+10)
  if (c.environment_scope_selected.length > 0) { score += 10; }
  else { reasons.push("Ortam kapsamı seçilmemiş"); }

  // General (+10)
  score += 10;

  const state: HealthResult["state"] = score >= 80 ? "green" : score >= 50 ? "yellow" : "red";
  return { score: Math.min(score, 100), state, reasons };
}
