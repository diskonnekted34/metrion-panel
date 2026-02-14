import { Clock, History, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Executive } from "@/data/experts";

const severityColor = (s: string) => {
  if (s === "critical") return "border-l-destructive";
  if (s === "high") return "border-l-warning";
  return "border-l-primary";
};

const severityChip = (s: string) => {
  if (s === "critical") return "bg-destructive/15 text-destructive";
  if (s === "high") return "bg-warning/15 text-warning";
  return "bg-primary/15 text-primary";
};

const statusLabel = (s: string) => {
  if (s === "Monitoring") return "İzleniyor";
  if (s === "Running Task") return "Görev Çalışıyor";
  if (s === "Alerting") return "Uyarı";
  return "Boşta";
};

const statusStyle = (s: string) => {
  if (s === "Alerting") return "text-destructive";
  if (s === "Running Task") return "text-accent";
  if (s === "Monitoring") return "text-primary";
  return "text-muted-foreground";
};

const taskTimeline = [
  { title: "ROAS düşüşü analizi", severity: "critical", status: "Aktif", eta: "2 saat", source: "İçgörü" },
  { title: "Q4 bütçe revizyonu", severity: "high", status: "Planlandı", eta: "4 saat", source: "Manuel" },
  { title: "Haftalık performans raporu", severity: "medium", status: "Aktif", eta: "1 saat", source: "Ajan" },
  { title: "Kreatif A/B test sonuçları", severity: "medium", status: "Tamamlandı", eta: "—", source: "Ajan" },
];

interface IdentityPanelProps {
  agent: Executive;
  onNewTask: () => void;
}

const IdentityPanel = ({ agent, onNewTask }: IdentityPanelProps) => (
  <div className="space-y-4">
    {/* Agent Identity */}
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img src={agent.avatar} alt={agent.role} className="h-12 w-12 rounded-xl object-cover" />
          {agent.status === "Alerting" && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{agent.role}</h2>
          <span className={`text-[10px] font-medium ${statusStyle(agent.status)}`}>{statusLabel(agent.status)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Skor: {agent.performanceScore}</span>
        <span>•</span>
        <span>{agent.tasksCompleted} görev</span>
      </div>
    </div>

    {/* Capabilities */}
    <div className="glass-card p-4 space-y-2">
      <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
        <Zap className="h-3 w-3 text-primary" /> Yetenekler
      </h3>
      <div className="space-y-1.5">
        {agent.skills?.slice(0, 5).map((skill, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[10px] text-secondary-foreground">{skill.name}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${skill.level}%` }} />
              </div>
              <span className="text-[9px] text-muted-foreground w-6 text-right">{skill.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Tasks */}
    <div className="glass-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <History className="h-3 w-3 text-primary" /> Son Görevler
        </h3>
        <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-primary" onClick={onNewTask}>
          <Plus className="h-3 w-3" /> Yeni
        </Button>
      </div>
      <div className="space-y-1.5">
        {taskTimeline.map((t, i) => (
          <div key={i} className={`p-2.5 rounded-xl border-l-2 bg-white/[0.02] ${severityColor(t.severity)}`}>
            <p className="text-[10px] font-medium text-foreground leading-tight">{t.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[8px] px-1.5 py-0.5 rounded-lg ${severityChip(t.severity)}`}>{t.status}</span>
              {t.eta !== "—" && <span className="text-[8px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2 w-2" />{t.eta}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default IdentityPanel;
