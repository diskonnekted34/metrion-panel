import {
  Users, Bot, User, DollarSign, Shield,
  AlertTriangle, Activity, TrendingUp
} from "lucide-react";
import type { GovernanceSummary } from "@/core/types/command";
import { CommandService } from "@/services/CommandService";

interface Props {
  summary: GovernanceSummary;
}

const riskColor = (r: string) => {
  if (r === "critical") return "text-destructive";
  if (r === "high") return "text-warning";
  if (r === "medium") return "text-primary";
  return "text-success";
};

const GovernanceMonitoringPanel = ({ summary }: Props) => {
  const metrics = [
    { label: "Toplam Koltuk", value: summary.total_seats, icon: Users, color: "text-foreground" },
    { label: "İnsan Atanmış", value: summary.human_assigned, icon: User, color: "text-primary" },
    { label: "AI Koltuk", value: summary.ai_seats, icon: Bot, color: "text-purple-400" },
    { label: "Bütçe Maruz", value: CommandService.formatCurrency(summary.total_budget_exposure), icon: DollarSign, color: "text-warning" },
    { label: "Aktif Onay", value: summary.active_approvals, icon: Shield, color: "text-primary" },
    { label: "Eskalasyon", value: summary.escalations, icon: TrendingUp, color: "text-violet-400" },
    { label: "Risk Seviyesi", value: summary.overall_risk.toUpperCase(), icon: AlertTriangle, color: riskColor(summary.overall_risk) },
    { label: "Override", value: summary.override_count, icon: Activity, color: summary.override_count > 0 ? "text-warning" : "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="glass-card p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</span>
          </div>
          <span className={`text-lg font-bold ${m.color}`}>
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GovernanceMonitoringPanel;
