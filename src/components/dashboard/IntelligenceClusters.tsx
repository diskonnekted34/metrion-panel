import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, BarChart3, TrendingUp, Settings2, Shield, LineChart, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClusterSummary {
  id: string;
  label: string;
  icon: React.ElementType;
  agent: string;
  summaryMetrics: { label: string; value: string; delta?: string; positive?: boolean }[];
  previewText: string;
  alertCount?: number;
}

const clusters: ClusterSummary[] = [
  {
    id: "finans",
    label: "Finans",
    icon: BarChart3,
    agent: "CFO Agent",
    summaryMetrics: [
      { label: "Gelir", value: "$2.4M", delta: "+12.4%", positive: true },
      { label: "Net Kâr", value: "$380K", delta: "+8.2%", positive: true },
      { label: "Marj", value: "%42.1", delta: "+1.3pp", positive: true },
    ],
    previewText: "Nakit akışı stabil. Kargo maliyetleri düşüşte. İade oranı izleniyor.",
    alertCount: 1,
  },
  {
    id: "buyume",
    label: "Büyüme",
    icon: TrendingUp,
    agent: "CMO Agent",
    summaryMetrics: [
      { label: "ROAS", value: "3.2x", delta: "-0.4x", positive: false },
      { label: "CAC", value: "$32", delta: "-$4", positive: true },
      { label: "LTV/CAC", value: "4.2x", delta: "+0.6x", positive: true },
    ],
    previewText: "Meta Ads doygunluk eşiğinde. Google Ads performans artışı devam ediyor.",
    alertCount: 2,
  },
  {
    id: "operasyon",
    label: "Operasyon",
    icon: Settings2,
    agent: "COO Agent",
    summaryMetrics: [
      { label: "Karşılama", value: "1.8gün", delta: "-0.3g", positive: true },
      { label: "İade", value: "%4.2", delta: "+0.3pp", positive: false },
      { label: "Kapasite", value: "%78", delta: "+2pp", positive: true },
    ],
    previewText: "3 SKU stok tükenme riski. Lojistik maliyetlerde iyileşme trendi.",
    alertCount: 1,
  },
  {
    id: "risk",
    label: "Risk",
    icon: Shield,
    agent: "CEO Agent",
    summaryMetrics: [
      { label: "Genel Risk", value: "Orta" },
      { label: "Marj Riski", value: "Düşük" },
      { label: "Kanal Riski", value: "Yüksek" },
    ],
    previewText: "Kanal konsantrasyonu ana risk faktörü. Nakit stres olasılığı %18.",
  },
  {
    id: "tahminler",
    label: "Tahminler",
    icon: LineChart,
    agent: "CEO Agent",
    summaryMetrics: [
      { label: "30g Kâr", value: "$410K", delta: "+7.9%", positive: true },
      { label: "60g Nakit", value: "$830K", delta: "-6.7%", positive: false },
      { label: "Büyüme", value: "%19.2", delta: "+0.5pp", positive: true },
    ],
    previewText: "Kârlılık projeksiyonu pozitif. Nakit pozisyon düşüş eğiliminde.",
  },
];

const riskTextColor = (val: string) => {
  if (val === "Düşük") return "text-success";
  if (val === "Orta") return "text-warning";
  if (val === "Yüksek") return "text-destructive";
  return "text-foreground";
};

const IntelligenceClusters = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const openFullView = (clusterId: string) => {
    navigate(`/intelligence/${clusterId}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">İstihbarat Kümeleri</h2>
        <span className="text-[10px] text-muted-foreground">Genişlet → Önizle → Tam Analiz Aç</span>
      </div>

      <div className="space-y-2">
        {clusters.map((cluster) => {
          const isOpen = expanded[cluster.id] ?? false;
          return (
            <div key={cluster.id} className="glass-card overflow-hidden">
              {/* Collapsed header */}
              <button
                onClick={() => toggle(cluster.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <cluster.icon className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{cluster.label}</span>
                    <span className="text-[9px] text-muted-foreground">{cluster.agent}</span>
                    {cluster.alertCount && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-warning/15 text-warning">
                        {cluster.alertCount} uyarı
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary metrics in collapsed view */}
                <div className="hidden md:flex items-center gap-6">
                  {cluster.summaryMetrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <p className="text-[9px] text-muted-foreground">{m.label}</p>
                      <p className={`text-sm font-bold ${m.label.includes("Risk") ? riskTextColor(m.value) : "text-foreground"}`}>{m.value}</p>
                      {m.delta && (
                        <span className={`text-[9px] font-medium ${m.positive ? "text-success" : "text-destructive"}`}>
                          {m.delta}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {isOpen
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                }
              </button>

              {/* Expanded preview */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0 border-t border-border">
                      {/* Mobile metrics */}
                      <div className="flex md:hidden items-center gap-4 pt-3 mb-3">
                        {cluster.summaryMetrics.map((m) => (
                          <div key={m.label} className="text-center">
                            <p className="text-[9px] text-muted-foreground">{m.label}</p>
                            <p className={`text-sm font-bold ${m.label.includes("Risk") ? riskTextColor(m.value) : "text-foreground"}`}>{m.value}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 mb-4 leading-relaxed">{cluster.previewText}</p>

                      <button
                        onClick={() => openFullView(cluster.id)}
                        className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Tam İstihbarat Görünümünü Aç
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default IntelligenceClusters;
