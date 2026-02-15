import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info, DollarSign, BarChart3, Activity, Shield, Zap, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ScoreCard {
  label: string;
  score: number | string;
  trend: "up" | "down" | "flat";
  sparkline: number[];
  interpretation: string;
  tooltip: string;
  icon: React.ElementType;
  isText?: boolean;
}

const scoreCards: ScoreCard[] = [
  {
    label: "Finansal Stabilite",
    score: 82,
    trend: "up",
    sparkline: [68, 72, 74, 76, 78, 80, 82],
    interpretation: "Nakit akışı güçlü, marj baskısı kontrol altında.",
    tooltip: "Gelir istikrarı, nakit pozisyonu ve maliyet yapısı değerlendirmesi.",
    icon: DollarSign,
  },
  {
    label: "Büyüme Sürdürülebilirlik",
    score: 74,
    trend: "up",
    sparkline: [60, 62, 65, 68, 70, 72, 74],
    interpretation: "Organik büyüme ivmesi artışta, kanal çeşitliliği yeterli.",
    tooltip: "Büyüme hızı, kanal sağlığı ve müşteri edinme maliyeti dengesi.",
    icon: TrendingUp,
  },
  {
    label: "Operasyonel Verimlilik",
    score: 79,
    trend: "flat",
    sparkline: [76, 78, 77, 79, 78, 79, 79],
    interpretation: "Envanter devir hızı stabil, lojistik maliyetler norm dahilinde.",
    tooltip: "Sipariş karşılama süresi, depo verimliliği ve operasyonel maliyet analizi.",
    icon: Activity,
  },
  {
    label: "Risk Maruziyeti",
    score: "Orta",
    trend: "down",
    sparkline: [45, 48, 50, 52, 55, 53, 51],
    interpretation: "Kanal yoğunlaşması ve nakit stres olasılığı izlenmeli.",
    tooltip: "Marj erozyonu, kanal konsantrasyonu ve nakit akış stresi birleşik değerlendirmesi.",
    icon: Shield,
    isText: true,
  },
  {
    label: "Sermaye Verimliliği",
    score: 71,
    trend: "up",
    sparkline: [58, 60, 63, 65, 67, 69, 71],
    interpretation: "Sermaye tahsis getirisi iyileşme trendinde.",
    tooltip: "Yatırım getirisi, sermaye dağılımı ve birim ekonomi performansı.",
    icon: Zap,
  },
  {
    label: "Organizasyonel Uyum",
    score: 86,
    trend: "up",
    sparkline: [78, 80, 82, 83, 84, 85, 86],
    interpretation: "Departmanlar arası KPI tutarlılığı yüksek.",
    tooltip: "Departmanlar arası hedef uyumu, KPI koherensı ve ekip performansı.",
    icon: Users,
  },
];

interface KeyMetric {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
}

const keyMetrics: KeyMetric[] = [
  { label: "Toplam Gelir", value: "$2.4M", delta: "+12.4%", deltaPositive: true, sparkline: [180, 195, 205, 215, 225, 235, 240] },
  { label: "Net Kâr", value: "$380K", delta: "+8.2%", deltaPositive: true, sparkline: [28, 30, 32, 33, 35, 36, 38] },
  { label: "Katkı Marjı", value: "%42.1", delta: "+1.3pp", deltaPositive: true, sparkline: [39, 40, 40.5, 41, 41.2, 41.8, 42.1] },
  { label: "Nakit Pozisyon", value: "$890K", delta: "-3.1%", deltaPositive: false, sparkline: [920, 915, 910, 905, 900, 895, 890] },
  { label: "Büyüme Oranı", value: "%18.7", delta: "+2.1pp", deltaPositive: true, sparkline: [14, 15, 15.5, 16.2, 17, 17.8, 18.7] },
  { label: "CAC", value: "$32", delta: "-$4", deltaPositive: true, sparkline: [42, 40, 38, 36, 35, 33, 32] },
  { label: "LTV/CAC", value: "4.2x", delta: "+0.6x", deltaPositive: true, sparkline: [3.2, 3.4, 3.5, 3.7, 3.9, 4.0, 4.2] },
];

const MiniSparkline = ({ data, color = "hsl(var(--primary))" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 20;
  const w = 52;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const TrendArrow = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const riskColor = (score: string | number) => {
  if (typeof score === "string") {
    if (score === "Düşük") return "text-success";
    if (score === "Orta") return "text-warning";
    return "text-destructive";
  }
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  return "text-warning";
};

const ExecutiveSummary = () => {
  return (
    <TooltipProvider>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        {/* Score Cards */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Yönetici İstihbarat Skoru</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {scoreCards.map((card) => (
            <Tooltip key={card.label}>
              <TooltipTrigger asChild>
                <div className="glass-card p-4 cursor-default group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <card.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <TrendArrow trend={card.trend} />
                  </div>
                  <p className={`text-2xl font-bold mb-1 ${riskColor(card.score)}`}>
                    {card.isText ? card.score : card.score}
                  </p>
                  <p className="text-[10px] text-muted-foreground mb-2 font-medium">{card.label}</p>
                  <MiniSparkline data={card.sparkline} />
                  <p className="text-[9px] text-muted-foreground mt-2 leading-tight opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {card.interpretation}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[240px]">
                <p className="text-xs">{card.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Key Metrics Row */}
        <div className="glass-card p-4 mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Temel Metrikler</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {keyMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className={`text-[10px] font-medium ${m.deltaPositive ? "text-success" : "text-destructive"}`}>
                    {m.delta}
                  </span>
                  <MiniSparkline data={m.sparkline} color={m.deltaPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Strip */}
        <AIInsightStrip />
      </motion.div>
    </TooltipProvider>
  );
};

interface AIInsight {
  risk: "critical" | "warning" | "info";
  text: string;
  impact: string;
  action?: string;
  agent: string;
}

const insights: AIInsight[] = [
  {
    risk: "warning",
    text: "Meta Ads ROAS son 7 günde %18 düştü — kanal doygunluk eşiğine yaklaşıyor.",
    impact: "Tahmini aylık etki: -$45K gelir kaybı",
    action: "Bütçe yeniden dağıtım taslağı oluştur",
    agent: "CMO Agent",
  },
  {
    risk: "critical",
    text: "3 SKU'da stok tükenme olasılığı %85'i aştı — 12 gün içinde stock-out riski.",
    impact: "Tahmini etki: $120K gelir riski",
    action: "Acil tedarik siparişi taslağı",
    agent: "COO Agent",
  },
  {
    risk: "info",
    text: "Katkı marjı son 4 haftada istikrarlı artışta — maliyet optimizasyonu etkili.",
    impact: "Kümülatif iyileştirme: +$67K",
    agent: "CFO Agent",
  },
];

const riskStyles: Record<string, { border: string; badge: string; dot: string }> = {
  critical: { border: "border-l-destructive", badge: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  warning: { border: "border-l-warning", badge: "bg-warning/10 text-warning", dot: "bg-warning" },
  info: { border: "border-l-primary", badge: "bg-primary/10 text-primary", dot: "bg-primary" },
};

const riskLabel: Record<string, string> = { critical: "Kritik", warning: "Uyarı", info: "Bilgi" };

const AIInsightStrip = () => (
  <div>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Öncelikli İçgörüler</p>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {insights.map((insight, i) => {
        const style = riskStyles[insight.risk];
        return (
          <div key={i} className={`glass-card p-4 border-l-[3px] ${style.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${style.dot}`} />
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>{riskLabel[insight.risk]}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{insight.agent}</span>
            </div>
            <p className="text-xs font-medium text-foreground mb-1.5 leading-relaxed">{insight.text}</p>
            <p className="text-[10px] text-muted-foreground mb-2">{insight.impact}</p>
            {insight.action && (
              <button className="text-[10px] font-medium px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {insight.action}
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ExecutiveSummary;
