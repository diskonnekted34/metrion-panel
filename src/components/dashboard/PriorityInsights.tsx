import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Insight {
  priority: number;
  headline: string;
  explanation: string;
  impactSegments: number; // 1-5
  impactPercent: string;
  riskLevel: "critical" | "warning" | "info";
  agent: string;
}

const insights: Insight[] = [
  {
    priority: 1,
    headline: "3 SKU'da stok tükenme riski %85'i aştı",
    explanation: "12 gün içinde stock-out — $120K gelir riski.",
    impactSegments: 5,
    impactPercent: "-5.2%",
    riskLevel: "critical",
    agent: "COO Agent",
  },
  {
    priority: 2,
    headline: "Meta Ads ROAS son 7 günde %18 düştü",
    explanation: "Kanal doygunluk eşiğine yaklaşıyor — bütçe yeniden dağıtımı gerekebilir.",
    impactSegments: 4,
    impactPercent: "-3.8%",
    riskLevel: "warning",
    agent: "CMO Agent",
  },
  {
    priority: 3,
    headline: "Katkı marjı 4 haftadır istikrarlı artışta",
    explanation: "Maliyet optimizasyonu etkili — kümülatif iyileştirme: +$67K.",
    impactSegments: 3,
    impactPercent: "+2.8%",
    riskLevel: "info",
    agent: "CFO Agent",
  },
  {
    priority: 4,
    headline: "Kampanya bazlı indirimler net marjı %1.8 aşındırdı",
    explanation: "İndirim politikası revizyon taslağı değerlendirilmeli.",
    impactSegments: 3,
    impactPercent: "-1.8%",
    riskLevel: "warning",
    agent: "CFO Agent",
  },
];

const riskDotColor: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  info: "bg-primary",
};

const riskGlow: Record<string, string> = {
  critical: "0 0 8px rgba(239,68,68,0.4)",
  warning: "0 0 8px rgba(245,158,11,0.3)",
  info: "0 0 6px rgba(30,107,255,0.3)",
};

const ImpactBar = ({ segments }: { segments: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`h-1.5 w-3 rounded-sm ${
          i <= segments
            ? segments >= 4 ? "bg-destructive/80" : segments >= 3 ? "bg-warning/80" : "bg-primary/60"
            : "bg-secondary/60"
        }`}
      />
    ))}
  </div>
);

const PriorityInsights = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">AI Öncelikli İçgörüler</h2>
          <span className="text-[10px] text-muted-foreground">Günlük analiz döngüsü · Otomatik önceliklendirme</span>
        </div>

        <div className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight.priority}
              className="glass-card px-5 py-3.5 flex items-center gap-4"
              style={insight.riskLevel === "critical" ? { boxShadow: "inset 0 0 30px rgba(239,68,68,0.03)" } : {}}
            >
              {/* Priority index */}
              <span className="text-lg font-bold text-muted-foreground/40 w-6 text-center shrink-0">
                #{insight.priority}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight truncate">{insight.headline}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{insight.explanation}</p>
              </div>

              {/* Impact bar + percent */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <ImpactBar segments={insight.impactSegments} />
                  <p className={`text-[10px] font-bold mt-0.5 ${
                    insight.impactPercent.startsWith("-") ? "text-destructive" : "text-success"
                  }`}>
                    {insight.impactPercent}
                  </p>
                </div>

                {/* Risk dot */}
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${riskDotColor[insight.riskLevel]}`}
                      style={{ boxShadow: riskGlow[insight.riskLevel] }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{insight.agent} · {
                      insight.riskLevel === "critical" ? "Kritik" : insight.riskLevel === "warning" ? "Uyarı" : "Bilgi"
                    }</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => navigate("/intelligence/finans")}
                  className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  Detay Gör
                </button>
                <button
                  onClick={() => navigate("/intelligence/finans")}
                  className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Brain className="h-3 w-3" />
                  Analiz Başlat
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default PriorityInsights;
