import { Brain, ChevronRight, FileText, Users } from "lucide-react";
import { Executive } from "@/data/experts";

interface ContextPanelProps {
  agent: Executive;
}

const ContextPanel = ({ agent }: ContextPanelProps) => {
  const collaborationLogs = agent.collaborations?.slice(0, 3) || [
    "Ajanlar arası veri paylaşımı aktif.",
  ];

  return (
    <div className="space-y-4">
      {/* Memory */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Brain className="h-3 w-3 text-primary" /> Hafıza
        </h3>
        <div className="space-y-1.5">
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Son Analiz</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">{agent.weekdayOutput} — {agent.weekday}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Uzmanlık Alanı</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">{agent.tagline}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Çıktı Formatı</p>
            <p className="text-[10px] text-secondary-foreground mt-0.5">Özet → Bulgular → Riskler → Öneriler → Sonraki Adımlar</p>
          </div>
        </div>
      </div>

      {/* Collaboration Log */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users className="h-3 w-3 text-primary" /> İşbirliği Günlüğü
        </h3>
        <div className="space-y-1.5">
          {collaborationLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="h-3 w-3 text-primary" /> Sorumluluklar
        </h3>
        <div className="space-y-1">
          {agent.responsibilities?.slice(0, 5).map((r, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <ChevronRight className="h-2.5 w-2.5 text-primary/50 mt-0.5 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextPanel;
