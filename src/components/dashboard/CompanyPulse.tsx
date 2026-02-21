import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Percent, Banknote, TrendingUp, X, ArrowRight } from "lucide-react";

/* ── KPI Chart (reused neon gradient) ── */
const KPIChart = ({ data, positive, uniqueId }: { data: number[]; positive: boolean; uniqueId: string }) => {
  const h = 48;
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 6) - 3,
  ]);
  const line = points.map(p => p.join(",")).join(" ");
  const area = `M${line} L${w},${h} L0,${h} Z`;
  const gradId = `pulse-${uniqueId}`;
  const colors = positive ? { from: "#00E5FF", to: "#2D7BFF" } : { from: "#FF6B6B", to: "#EF4444" };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id={`${gradId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.from} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gradId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId}-fill)`} />
      <polyline points={line} fill="none" stroke={`url(#${gradId}-line)`} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${colors.from}66)` }} />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2" fill={colors.from} opacity="0.9" />
    </svg>
  );
};

interface PulseKPI {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ElementType;
  tint: string;
  data: number[];
  whyChanged: string;
  comparison7d: string;
  comparison30d: string;
  suggestedAction: string;
}

const kpis: PulseKPI[] = [
  {
    label: "Gelir", value: "$2.4M", delta: "+12.4%", positive: true,
    icon: DollarSign, tint: "30,144,255",
    data: [215, 220, 225, 230, 235, 238, 240],
    whyChanged: "Google Ads ve organik kanalda %18 artış. Premium segment katkısı başladı.",
    comparison7d: "$2.34M → $2.4M (+2.6%)", comparison30d: "$2.1M → $2.4M (+14.3%)",
    suggestedAction: "Premium segmenti hızlandırmak için bütçe artışı değerlendirin.",
  },
  {
    label: "Marj", value: "%42.1", delta: "+1.3pp", positive: true,
    icon: Percent, tint: "147,51,234",
    data: [40.5, 41, 41.2, 41.5, 41.8, 42, 42.1],
    whyChanged: "Tedarikçi değişikliği COGS'u %2.5 düşürdü. Operasyonel verimlilik arttı.",
    comparison7d: "%41.5 → %42.1 (+0.6pp)", comparison30d: "%39.8 → %42.1 (+2.3pp)",
    suggestedAction: "Yeni tedarikçi sözleşmesini onaylayarak ek %1pp iyileştirme sağlayın.",
  },
  {
    label: "Runway", value: "9.4 ay", delta: "+0.8 ay", positive: true,
    icon: Banknote, tint: "0,229,255",
    data: [7.2, 7.8, 8.1, 8.5, 8.9, 9.1, 9.4],
    whyChanged: "Gelir artışı ve maliyet optimizasyonu nakit tamponunu genişletti.",
    comparison7d: "9.1 ay → 9.4 ay", comparison30d: "8.1 ay → 9.4 ay",
    suggestedAction: "Nakit rezerv politikasını 6 ay minimuma çıkarmayı onaylayın.",
  },
  {
    label: "Büyüme Verimliliği", value: "%18.7", delta: "+2.1pp", positive: true,
    icon: TrendingUp, tint: "22,199,132",
    data: [14, 15, 15.5, 16.2, 17, 17.8, 18.7],
    whyChanged: "CAC düşüşü ve LTV artışı büyüme oranını iyileştirdi.",
    comparison7d: "%18.0 → %18.7 (+0.7pp)", comparison30d: "%15.5 → %18.7 (+3.2pp)",
    suggestedAction: "Kanal çeşitlendirme stratejisi ile sürdürülebilirliği artırın.",
  },
];

const CompanyPulse = () => {
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const chartId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <h2 className="text-[0.85rem] font-semibold text-foreground mb-3">Şirket Nabzı</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 + i * 0.04 }}
            className="group hover:-translate-y-px transition-all duration-200 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${kpi.tint},0.04) 0%, rgba(0,0,0,0.35) 100%)`,
              backdropFilter: "blur(14px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "var(--radius-card, 16px)",
              padding: "1rem",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="h-7 w-7 flex items-center justify-center"
                style={{ background: `rgba(${kpi.tint},0.1)`, borderRadius: "var(--radius-inner, 12px)" }}
              >
                <kpi.icon className="h-3.5 w-3.5" style={{ color: `rgba(${kpi.tint},0.8)` }} />
              </div>
              <span className={`text-[0.65rem] font-semibold ${kpi.positive ? "text-success" : "text-destructive"}`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-[1.4rem] font-semibold text-foreground leading-none mb-0.5" style={{ letterSpacing: "-0.03em" }}>
              {kpi.value}
            </p>
            <p className="text-[0.65rem] text-muted-foreground/60 mb-2">{kpi.label}</p>

            <KPIChart data={kpi.data} positive={kpi.positive} uniqueId={`${chartId}-${i}`} />

            <button
              onClick={() => setOpenDrawer(i)}
              className="mt-2 text-[0.55rem] font-medium text-primary/60 hover:text-primary transition-colors flex items-center gap-0.5"
            >
              Neden değişti? <ArrowRight className="h-2 w-2" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* "Why Changed?" Drawer Overlay */}
      <AnimatePresence>
        {openDrawer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={() => setOpenDrawer(null)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg mx-4 mb-4 p-5"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(5,5,5,0.99) 100%)",
                border: "0.5px solid rgba(255,255,255,0.10)",
                borderRadius: "var(--radius-card, 16px)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setOpenDrawer(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/[0.04]">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
              <h3 className="text-sm font-semibold text-foreground mb-1">{kpis[openDrawer].label} — Neden Değişti?</h3>
              <p className="text-[0.7rem] text-muted-foreground/70 mb-4">{kpis[openDrawer].whyChanged}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-[0.65rem]">
                  <span className="text-muted-foreground/50">7 gün karşılaştırma</span>
                  <span className="text-foreground/80">{kpis[openDrawer].comparison7d}</span>
                </div>
                <div className="flex justify-between text-[0.65rem]">
                  <span className="text-muted-foreground/50">30 gün karşılaştırma</span>
                  <span className="text-foreground/80">{kpis[openDrawer].comparison30d}</span>
                </div>
                <div className="pt-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[0.6rem] text-muted-foreground/50 mb-1">Önerilen Aksiyon</p>
                  <p className="text-[0.7rem] text-primary/80">{kpis[openDrawer].suggestedAction}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompanyPulse;
