import { motion } from "framer-motion";
import { Brain, Shield, Zap, Target, TrendingUp, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { MetricIntelligence } from "@/data/intelligenceMetrics";
import { toast } from "sonner";

interface Props {
  metric: MetricIntelligence;
  deptId: string;
}

const IntelligenceSidePanel = ({ metric, deptId }: Props) => {
  const badgeColor = (type: "risk" | "opportunity" | "neutral") => {
    if (type === "risk") return "bg-destructive/10 text-destructive";
    if (type === "opportunity") return "bg-success/10 text-success";
    return "bg-secondary text-muted-foreground";
  };
  const badgeIcon = (type: "risk" | "opportunity" | "neutral") => {
    if (type === "risk") return <AlertTriangle className="h-3 w-3" />;
    if (type === "opportunity") return <TrendingUp className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };
  const priorityColor = (p: "high" | "medium" | "low") => {
    if (p === "high") return "bg-destructive/10 text-destructive";
    if (p === "medium") return "bg-warning/10 text-warning";
    return "bg-secondary text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-4 lg:sticky lg:top-4"
    >
      {/* Agent Badge */}
      <div className="glass-card p-3 flex items-center gap-2">
        <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Analiz Eden</p>
          <p className="text-xs font-semibold text-foreground">{metric.agent}</p>
        </div>
      </div>

      {/* Insight Summary */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-primary" /> İçgörü Özeti
        </h3>
        <div className="space-y-2">
          {metric.insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 p-0.5 rounded ${badgeColor(insight.type)}`}>
                {badgeIcon(insight.type)}
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" /> Kök Neden Analizi
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{metric.rootCause.description}</p>
        <div className="flex flex-wrap gap-1">
          {metric.rootCause.sources.map(s => (
            <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{s}</span>
          ))}
        </div>
      </div>

      {/* Confidence Score */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-foreground">Güven Skoru</h3>
          <span className={`text-lg font-bold ${metric.confidenceScore >= 80 ? "text-success" : metric.confidenceScore >= 60 ? "text-warning" : "text-destructive"}`}>
            %{metric.confidenceScore}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              metric.confidenceScore >= 80 ? "bg-success" : metric.confidenceScore >= 60 ? "bg-warning" : "bg-destructive"
            }`}
            style={{ width: `${metric.confidenceScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground">
          <span>Veri Tamlığı: %{metric.dataCompleteness}</span>
          <span>{metric.dataSources.length} kaynak</span>
        </div>
      </div>

      {/* Impact Projection */}
      <div className="glass-card p-4 border-l-2 border-primary/30">
        <h3 className="text-xs font-semibold text-foreground mb-1.5">Etki Projeksiyonu</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{metric.impactProjection}</p>
      </div>

      {/* Suggested Actions */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" /> Önerilen Aksiyonlar
        </h3>
        <div className="space-y-2">
          {metric.suggestedActions.map((action, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-secondary/30 group hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-foreground">{action.title}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${priorityColor(action.priority)}`}>
                  {action.priority === "high" ? "Yüksek" : action.priority === "medium" ? "Orta" : "Düşük"}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{action.description}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => toast.success("Aksiyon planı oluşturuldu.")}
          className="w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          <Zap className="h-3.5 w-3.5" /> Plan Oluştur
        </button>
      </div>
    </motion.div>
  );
};

export default IntelligenceSidePanel;
