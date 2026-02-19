import {
  Users, Bot, User, Shield, AlertTriangle, Activity
} from "lucide-react";
import type { GovernanceSummary } from "@/core/types/command";

interface Props {
  summary: GovernanceSummary;
}

const riskColor = (r: string) => {
  if (r === "critical") return "text-destructive";
  if (r === "high") return "text-warning";
  if (r === "medium") return "text-primary";
  return "text-muted-foreground";
};

const GovernanceMonitoringPanel = ({ summary }: Props) => {
  const items = [
    { icon: Users, label: "Koltuk", value: summary.total_seats },
    { icon: User, label: "İnsan", value: summary.human_assigned },
    { icon: Bot, label: "AI", value: summary.ai_seats },
    { icon: Shield, label: "Onay", value: summary.active_approvals },
    { icon: AlertTriangle, label: "Risk", value: summary.overall_risk.toUpperCase(), color: riskColor(summary.overall_risk) },
    { icon: Activity, label: "Override", value: summary.override_count },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap text-[10px]">
      {items.map(m => (
        <div key={m.label} className="flex items-center gap-1.5">
          <m.icon className={`h-3 w-3 ${m.color ?? "text-muted-foreground"}`} />
          <span className="text-muted-foreground">{m.label}</span>
          <span className={`font-semibold ${m.color ?? "text-foreground"}`}>{m.value}</span>
        </div>
      ))}
    </div>
  );
};

export default GovernanceMonitoringPanel;
