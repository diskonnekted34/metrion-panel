import { useMemo } from "react";
import { alertsData } from "@/data/alerts";
import { AgentWorkspaceConfig, SnapshotKPI } from "@/data/agentModules";

interface DynamicSuggestion {
  text: string;
  urgent: boolean;
}

// Parse numeric value from KPI string (handles %, x, ₺, etc.)
const parseNumeric = (val: string): number | null => {
  const cleaned = val.replace(/[₺%xK\/a-zA-ZğüşıöçĞÜŞİÖÇ\s+\-]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

// Agent-specific condition-based suggestions
const conditionSuggestions: Record<string, (snapshot: SnapshotKPI[]) => DynamicSuggestion[]> = {
  cfo: (snapshot) => {
    const results: DynamicSuggestion[] = [];
    const margin = snapshot.find(s => s.label.includes("Marj"));
    if (margin && margin.trend.startsWith("-")) {
      results.push({ text: "Marjin düşüşünün kök nedenini analiz et.", urgent: true });
      results.push({ text: "Negatif katkılı SKU'ları belirle.", urgent: true });
    }
    const cashflow = snapshot.find(s => s.label.includes("Nakit"));
    if (cashflow) {
      const weeks = parseNumeric(cashflow.value);
      if (weeks !== null && weeks <= 6) {
        results.push({ text: "Acil nakit akışı simülasyonu çalıştır.", urgent: true });
      }
    }
    return results;
  },
  cmo: (snapshot) => {
    const results: DynamicSuggestion[] = [];
    const roas = snapshot.find(s => s.label === "ROAS");
    if (roas && roas.trend.startsWith("-")) {
      results.push({ text: "ROAS düşüşünü kampanya bazında analiz et.", urgent: true });
      results.push({ text: "Reklam harcamasını %15 azaltmayı simüle et.", urgent: true });
    }
    const ctr = snapshot.find(s => s.label === "CTR");
    if (ctr && ctr.trend.startsWith("-")) {
      results.push({ text: "En düşük performanslı kreatifi belirle.", urgent: true });
      results.push({ text: "5 yeni hook varyasyonu üret.", urgent: false });
    }
    const cvr = snapshot.find(s => s.label === "CVR");
    if (cvr && cvr.trend.startsWith("-")) {
      results.push({ text: "Checkout dönüşüm darboğazını tespit et.", urgent: true });
    }
    return results;
  },
  ceo: (snapshot) => {
    const results: DynamicSuggestion[] = [];
    const risk = snapshot.find(s => s.label.includes("Risk"));
    if (risk && (risk.trend.startsWith("+") || risk.value === "Yüksek")) {
      results.push({ text: "Kritik risk alanlarını departman bazında incele.", urgent: true });
    }
    return results;
  },
  cto: (snapshot) => {
    const results: DynamicSuggestion[] = [];
    const errors = snapshot.find(s => s.label.includes("Hata"));
    if (errors) {
      const count = parseNumeric(errors.value);
      if (count !== null && count > 10) {
        results.push({ text: "Hata oranı yüksek — kök neden analizi çalıştır.", urgent: true });
      }
    }
    return results;
  },
  aria: (snapshot) => {
    const results: DynamicSuggestion[] = [];
    const inventory = snapshot.find(s => s.label.includes("Envanter"));
    if (inventory) {
      const days = parseNumeric(inventory.value);
      if (days !== null && days < 21) {
        results.push({ text: "Stok tükenme riskini değerlendir.", urgent: true });
        results.push({ text: "Kampanya hızını envanter korumak için ayarla.", urgent: true });
      }
    }
    return results;
  },
};

export function useDynamicSuggestions(
  agentId: string,
  config: AgentWorkspaceConfig | undefined
): DynamicSuggestion[] {
  return useMemo(() => {
    if (!config) return [];

    const suggestions: DynamicSuggestion[] = [];

    // 1. Alert-driven suggestions (highest priority)
    const agentAlerts = alertsData.filter(a => a.agentId === agentId && !a.resolved);
    agentAlerts.forEach(alert => {
      if (alert.urgency === "Kritik") {
        suggestions.push({ text: `"${alert.text}" uyarısını analiz et.`, urgent: true });
      }
    });

    // 2. Condition-based suggestions from snapshot KPIs
    const condFn = conditionSuggestions[agentId];
    if (condFn) {
      suggestions.push(...condFn(config.snapshot));
    }

    // 3. Fill remaining with static suggestions (non-urgent)
    const existing = new Set(suggestions.map(s => s.text));
    for (const s of config.suggestions) {
      if (!existing.has(s) && suggestions.length < 6) {
        suggestions.push({ text: s, urgent: false });
      }
    }

    // If still no alert-driven ones, add optimization suggestions
    if (suggestions.filter(s => s.urgent).length === 0 && suggestions.length < 6) {
      const optimizations = [
        "En yüksek marjin büyüme fırsatını belirle.",
        "Paket strateji ile AOV artır.",
        "Performans denetimi çalıştır.",
      ];
      for (const o of optimizations) {
        if (!existing.has(o) && suggestions.length < 6) {
          suggestions.push({ text: o, urgent: false });
        }
      }
    }

    return suggestions.slice(0, 6);
  }, [agentId, config]);
}
