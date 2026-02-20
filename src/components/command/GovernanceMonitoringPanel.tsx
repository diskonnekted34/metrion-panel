import {
  Users, Bot, User, Shield, AlertTriangle, Activity, Target, TrendingDown, Gauge
} from "lucide-react";
import type { GovernanceSummary } from "@/core/types/command";

interface IntelligenceStats {
  avg_governance_score: number;
  high_risk_seats: number;
  strategic_inactive: number;
  misaligned_seats: number;
  seats_without_okr: number;
  total_seats: number;
}

interface Props {
  summary: GovernanceSummary;
  intelligenceStats?: IntelligenceStats;
}

const riskColor = (r: string) => {
  if (r === "critical") return "text-destructive";
  if (r === "high") return "text-warning";
  if (r === "medium") return "text-primary";
  return "text-muted-foreground";
};

const GovernanceMonitoringPanel = ({ summary, intelligenceStats }: Props) => {
  const items = [
    { icon: Users, label: "Koltuk", value: summary.total_seats },
    { icon: User, label: "İnsan", value: summary.human_assigned },
    { icon: Bot, label: "AI", value: summary.ai_seats },
    { icon: Shield, label: "Onay", value: summary.active_approvals },
    { icon: AlertTriangle, label: "Risk", value: summary.overall_risk.toUpperCase(), color: riskColor(summary.overall_risk) },
    { icon: Activity, label: "Override", value: summary.override_count },
  ];

  const intelItems = intelligenceStats ? [
    { icon: Gauge, label: "Governance", value: `%${intelligenceStats.avg_governance_score}`, color: intelligenceStats.avg_governance_score >= 60 ? "text-emerald-400" : "text-warning" },
    { icon: AlertTriangle, label: "Yüksek Risk", value: intelligenceStats.high_risk_seats, color: intelligenceStats.high_risk_seats > 0 ? "text-warning" : "text-muted-foreground" },
    { icon: TrendingDown, label: "İnaktif", value: intelligenceStats.strategic_inactive, color: intelligenceStats.strategic_inactive > 0 ? "text-amber-400" : "text-muted-foreground" },
    { icon: Target, label: "OKR'sız", value: intelligenceStats.seats_without_okr, color: intelligenceStats.seats_without_okr > 0 ? "text-amber-400" : "text-muted-foreground" },
  ] : [];

  return (
    <div className="flex items-center gap-4 flex-wrap text-[10px]">
      {items.map(m => (
        <div key={m.label} className="flex items-center gap-1.5">
          <m.icon className={`h-3 w-3 ${m.color ?? "text-muted-foreground"}`} />
          <span className="text-muted-foreground">{m.label}</span>
          <span className={`font-semibold ${m.color ?? "text-foreground"}`}>{m.value}</span>
        </div>
      ))}
      {intelItems.length > 0 && (
        <>
          <div className="w-px h-3 bg-border/40" />
          {intelItems.map(m => (
            <div key={m.label} className="flex items-center gap-1.5">
              <m.icon className={`h-3 w-3 ${m.color}`} />
              <span className="text-muted-foreground">{m.label}</span>
              <span className={`font-semibold ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GovernanceMonitoringPanel;
