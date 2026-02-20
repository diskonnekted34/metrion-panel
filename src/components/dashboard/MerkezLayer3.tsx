import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Lightbulb, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Premium Chart Component ── */
const PremiumChart = ({ data, labels, color, title }: { data: number[]; labels: string[]; color: string; title: string }) => {
  const h = 140;
  const w = 320;
  const pad = 12;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const gradId = `chart-${title.replace(/\s/g, "")}`;

  const points = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / range) * (h - pad * 2 - 16),
  ]);
  const line = points.map(p => p.join(",")).join(" ");
  const area = `M${points.map(p => p.join(",")).join(" L")} L${points[points.length - 1][0]},${h - pad - 16} L${points[0][0]},${h - pad - 16} Z`;

  return (
    <div
      className="p-4"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.35) 100%)",
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        borderRadius: "var(--radius-card, 16px)",
      }}
    >
      <p className="text-[0.7rem] font-medium text-foreground mb-3">{title}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gradId}-stroke`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1={pad} y1={pad + r * (h - pad * 2 - 16)} x2={w - pad} y2={pad + r * (h - pad * 2 - 16)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        <path d={area} fill={`url(#${gradId})`} />
        <polyline points={line} fill="none" stroke={`url(#${gradId}-stroke)`} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="0.6s" fill="freeze" />
        </polyline>
        {/* Last point */}
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={color} opacity="0.8" />
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="5" fill={color} opacity="0.12" />
        {/* Labels */}
        {labels.map((l, i) => l && (
          <text key={i} x={pad + (i / (labels.length - 1)) * (w - pad * 2)} y={h - 2} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7">{l}</text>
        ))}
      </svg>
    </div>
  );
};

/* ── AI CEO Briefing ── */
const briefingItems = [
  { icon: AlertTriangle, type: "critical" as const, text: "Stok tükenme riski 3 SKU'da kritik seviyeye ulaştı — $120K gelir riski." },
  { icon: Lightbulb, type: "opportunity" as const, text: "Google Ads ROAS artış trendinde — bütçe kaydırma fırsatı mevcut." },
  { icon: TrendingUp, type: "positive" as const, text: "Katkı marjı 4 haftadır istikrarlı artışta — kümülatif iyileştirme: +$67K." },
];

const briefingColors: Record<string, string> = {
  critical: "#EF4444",
  opportunity: "#1E6BFF",
  positive: "#16C784",
};

const MerkezLayer3 = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* Trend Charts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-5"
      >
        <h2 className="text-[0.85rem] font-semibold text-foreground mb-3">Trend & Analiz</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <PremiumChart
            title="Gelir Trendi (3 Ay)"
            data={[180, 195, 210, 205, 225, 240, 250, 245, 260, 275, 285, 290]}
            labels={["Oca", "", "Mar", "", "May", "", "Tem", "", "Eyl", "", "Kas", ""]}
            color="#1E90FF"
          />
          <PremiumChart
            title="Departman Katkı Dağılımı"
            data={[42, 28, 18, 8, 4]}
            labels={["Finans", "Paz.", "Ops.", "Tek.", "Diğer"]}
            color="#00E0FF"
          />
          <PremiumChart
            title="Risk Trendi"
            data={[45, 48, 52, 55, 53, 50, 48, 51, 49, 47]}
            labels={["H1", "", "H3", "", "H5", "", "H7", "", "H9", ""]}
            color="#F59E0B"
          />
        </div>
      </motion.div>

      {/* AI CEO Briefing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[0.85rem] font-semibold text-foreground">AI CEO — Günlük Brifing</h2>
          <button
            onClick={() => navigate("/strategy")}
            className="flex items-center gap-1 text-[0.6rem] font-medium text-primary/70 hover:text-primary transition-colors"
          >
            Tam Raporu Gör <ArrowRight className="h-2.5 w-2.5" />
          </button>
        </div>

        <div
          className="p-4"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.35) 100%)",
            backdropFilter: "blur(14px)",
            border: "0.5px solid rgba(255,255,255,0.10)",
            borderRadius: "var(--radius-card, 16px)",
          }}
        >
          <div className="space-y-0">
            {briefingItems.map((item, i) => {
              const color = briefingColors[item.type];
              return (
                <div key={i} className="flex items-start gap-3 py-3 relative">
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full" style={{ background: color, opacity: 0.5 }} />
                  <item.icon className="h-3.5 w-3.5 mt-0.5 shrink-0 ml-3" style={{ color }} />
                  <p className="text-[0.75rem] text-foreground/90 leading-relaxed">{item.text}</p>
                  {i < briefingItems.length - 1 && (
                    <div className="absolute bottom-0 left-3 right-3 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)" }} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
            <FileText className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[0.55rem] text-muted-foreground/60">Oluşturulma: Bugün 09:00 · Güven: %92 · Kaynak: 14 veri noktası</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MerkezLayer3;
