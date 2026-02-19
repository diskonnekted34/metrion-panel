import { Shield, TrendingUp, Zap, Brain } from "lucide-react";
import type { IntelligenceReport } from "@/data/intelligenceReports";
import { timeframeConfig } from "@/data/intelligenceReports";

const ReportSocialSummary = ({ report }: { report: IntelligenceReport }) => {
  const config = timeframeConfig[report.timeframe];

  return (
    <div className="glass-card overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(8,12,24,0.95), rgba(15,22,40,0.9))" }}>
      {/* Top gradient accent */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, rgba(30,107,255,0.8), rgba(22,199,132,0.6), rgba(30,107,255,0.4))" }} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-foreground">Yönetici Özet Kartı</h3>
              <p className="text-[9px] text-muted-foreground">LinkedIn & Sosyal Paylaşım Optimizasyonlu</p>
            </div>
          </div>
          <span className="badge-info text-[9px] px-2 py-0.5 rounded-full font-bold">{config.label}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {/* Intelligence Score */}
          <div className="text-center p-3 rounded-xl border border-primary/20" style={{ background: "rgba(30,107,255,0.08)", boxShadow: "0 0 16px rgba(30,107,255,0.1)" }}>
            <div className="text-2xl font-bold text-primary" style={{ textShadow: "0 0 12px rgba(30,107,255,0.4)" }}>{report.intelligenceScore}</div>
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-1">İstihbarat Skoru</div>
          </div>

          {/* Key metrics - compact */}
          {report.coreMetrics.slice(0, 2).map(m => (
            <div key={m.label} className="text-center p-3 rounded-xl bg-secondary/40 border border-border/40">
              <div className="text-sm font-bold text-foreground">{m.value}</div>
              <div className="text-[8px] text-muted-foreground mt-1">{m.label}</div>
            </div>
          ))}

          {/* Confidence */}
          <div className="text-center p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="text-sm font-bold text-success">%{report.confidenceScore}</div>
            <div className="text-[8px] text-muted-foreground mt-1">AI Güven</div>
          </div>

          {/* Dept count */}
          <div className="text-center p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="text-sm font-bold text-foreground">{report.departmentHealthScores.length}</div>
            <div className="text-[8px] text-muted-foreground mt-1">Departman</div>
          </div>
        </div>

        {/* Risk & Opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
            <Shield className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
            <div>
              <div className="text-[9px] font-bold text-destructive uppercase tracking-wider mb-0.5">En Kritik Risk</div>
              <p className="text-[11px] text-foreground/80 line-clamp-2">{report.topRisk}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-success/5 border border-success/15">
            <TrendingUp className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
            <div>
              <div className="text-[9px] font-bold text-success uppercase tracking-wider mb-0.5">En Büyük Fırsat</div>
              <p className="text-[11px] text-foreground/80 line-clamp-2">{report.topOpportunity}</p>
            </div>
          </div>
        </div>

        {/* 3 Actions */}
        <div className="space-y-1.5">
          {report.recommendedActions.slice(0, 3).map((a, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
              <Zap className="h-3 w-3 text-primary shrink-0" />
              <span className="text-[11px] text-foreground/80">{a}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <span className="text-[9px] text-muted-foreground/50">AI Workforce OS • {report.generatedAt}</span>
          <span className="text-[9px] text-primary/60">c-levels.ai</span>
        </div>
      </div>
    </div>
  );
};

export default ReportSocialSummary;
