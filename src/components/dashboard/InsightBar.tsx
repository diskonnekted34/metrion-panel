import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Eye, Radio } from "lucide-react";
import { alertsData } from "@/data/alerts";
import { useRBAC, DepartmentId } from "@/contexts/RBACContext";
import { departments } from "@/contexts/RBACContext";

const agentDeptMap: Record<string, DepartmentId> = {
  ceo: "executive", cso: "executive",
  cmo: "marketing", "brand-manager": "marketing", nova: "marketing", muse: "marketing",
  cfo: "finance", atlas: "finance",
  cto: "operations",
  aria: "operations",
  legal: "legal", lexis: "legal",
};

const InsightBar = () => {
  const { viewMode } = useRBAC();

  const filtered = alertsData
    .filter(a => !a.resolved)
    .filter(a => {
      if (viewMode === "company") return true;
      const dept = agentDeptMap[a.agentId];
      return dept === viewMode;
    });

  const urgencyBorder = (u: string) => {
    if (u === "Kritik") return "border-l-destructive";
    if (u === "Yüksek") return "border-l-warning";
    return "border-l-primary";
  };

  const urgencyChip = (u: string) => {
    if (u === "Kritik") return { bg: "bg-destructive/10 text-destructive", label: "Critical" };
    if (u === "Yüksek") return { bg: "bg-warning/10 text-warning", label: "Warning" };
    return { bg: "bg-primary/10 text-primary", label: "Recommendation" };
  };

  if (filtered.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Active Insights</h2>
        <div className="glass-card p-8 flex items-center justify-center gap-3">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          <p className="text-sm text-muted-foreground">System monitoring. No critical signals detected.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">Active Insights</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {filtered.map((insight) => {
          const chip = urgencyChip(insight.urgency);
          return (
            <div key={insight.id} className={`glass-card p-5 min-w-[300px] max-w-[340px] shrink-0 border-l-[3px] ${urgencyBorder(insight.urgency)} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${
                    insight.urgency === "Kritik" ? "text-destructive" :
                    insight.urgency === "Yüksek" ? "text-warning" : "text-primary"
                  }`} />
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${chip.bg}`}>{chip.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">Confidence: {insight.confidence}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{insight.text}</p>
                <p className="text-xs text-muted-foreground mb-3">{insight.detail}</p>
                <p className="text-[10px] text-muted-foreground">{insight.agent} · {insight.timestamp}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 text-xs font-medium py-2 rounded-2xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center justify-center gap-1">
                  Convert to Task <ArrowRight className="h-3 w-3" />
                </button>
                <button className="text-xs font-medium py-2 px-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors flex items-center gap-1">
                  <Eye className="h-3 w-3" /> Analysis
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InsightBar;
