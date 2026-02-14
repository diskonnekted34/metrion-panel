import { ExtractedTask } from "@/components/workspace/SuggestedTasks";
import { allExperts } from "@/data/experts";

// Map of role keywords to agent IDs for cross-agent detection
const roleKeywords: Record<string, { id: string; name: string }> = {
  cfo: { id: "cfo", name: "AI CFO" },
  cmo: { id: "cmo", name: "AI CMO" },
  ceo: { id: "ceo", name: "AI CEO" },
  cto: { id: "cto", name: "AI CTO" },
  cso: { id: "cso", name: "AI CSO" },
  hukuk: { id: "legal", name: "Hukuk Masası" },
  legal: { id: "legal", name: "Hukuk Masası" },
  operasyon: { id: "aria", name: "AI Operasyon" },
  finans: { id: "atlas", name: "AI Finans" },
  pazarlama: { id: "cmo", name: "AI CMO" },
};

// Extract actionable tasks from agent response recommendations
export function extractTasksFromResponse(
  recommendations: string[],
  currentAgentId: string
): ExtractedTask[] {
  const currentAgent = allExperts.find(e => e.id === currentAgentId);
  const currentAgentName = currentAgent?.role || "Ajan";

  return recommendations.slice(0, 4).map((rec) => {
    // Detect cross-agent references
    let targetAgent = currentAgentName;
    let targetAgentId = currentAgentId;
    let crossAgent = false;

    for (const [keyword, info] of Object.entries(roleKeywords)) {
      if (rec.toLowerCase().includes(keyword) && info.id !== currentAgentId) {
        targetAgent = info.name;
        targetAgentId = info.id;
        crossAgent = true;
        break;
      }
    }

    // Determine priority from keywords
    let priority: "Kritik" | "Yüksek" | "Orta" = "Orta";
    const urgentKeywords = ["acil", "kritik", "hemen", "durdur", "tehlike", "kayıp"];
    const highKeywords = ["azalt", "artır", "optimize", "revize", "başlat", "müzakere"];
    
    if (urgentKeywords.some(k => rec.toLowerCase().includes(k))) {
      priority = "Kritik";
    } else if (highKeywords.some(k => rec.toLowerCase().includes(k))) {
      priority = "Yüksek";
    }

    // Extract impact if monetary values present
    const moneyMatch = rec.match(/[₺$]\d+[KM]?/);
    const percentMatch = rec.match(/%\d+/);
    const impact = moneyMatch ? moneyMatch[0] : percentMatch ? percentMatch[0] : undefined;

    return {
      action: rec,
      agent: targetAgent,
      agentId: targetAgentId,
      priority,
      impact,
      crossAgent,
    };
  });
}
