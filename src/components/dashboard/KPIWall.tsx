import { useState, useId, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Percent, Banknote, TrendingUp, TrendingDown,
  Users, ShoppingCart, Target, Zap, ChevronRight, X,
} from "lucide-react";

type TimeRange = "G" | "H" | "A" | "Y";

interface KPIData {
  label: string;
  icon: React.ElementType;
  tint: string;
  datasets: Record<TimeRange, { values: number[]; value: string; delta: string; positive: boolean; min: string; avg: string; max: string; updated: string }>;
  whyChanged: string;
  comparison7d: string;
  comparison30d: string;
  suggestedAction: string;
}

const kpis: KPIData[] = [
  {
    label: "Gelir (MRR)", icon: DollarSign, tint: "30,144,255",
    datasets: {
      G: { values: [238, 240, 242, 241, 243, 244, 240], value: "$240K", delta: "+0.8%", positive: true, min: "$238K", avg: "$241K", max: "$244K", updated: "2s önce" },
      H: { values: [215, 225, 230, 235, 238, 242, 240], value: "$240K", delta: "+5.8%", positive: true, min: "$215K", avg: "$232K", max: "$242K", updated: "1s önce" },
      A: { values: [180, 195, 210, 220, 230, 235, 240], value: "$2.4M", delta: "+12.4%", positive: true, min: "$180K", avg: "$216K", max: "$240K", updated: "bugün" },
      Y: { values: [120, 140, 165, 185, 200, 220, 240], value: "$2.4M", delta: "+28.6%", positive: true, min: "$120K", avg: "$181K", max: "$240K", updated: "bugün" },
    },
    whyChanged: "Google Ads + organik kanalda %18 artış.", comparison7d: "$2.34M → $2.4M (+2.6%)", comparison30d: "$2.1M → $2.4M (+14.3%)", suggestedAction: "Premium segment bütçe artışı değerlendirin.",
  },
  {
    label: "Net Kâr", icon: DollarSign, tint: "22,199,132",
    datasets: {
      G: { values: [48, 50, 49, 51, 52, 53, 52], value: "$52K", delta: "+2.1%", positive: true, min: "$48K", avg: "$51K", max: "$53K", updated: "5s önce" },
      H: { values: [42, 44, 46, 48, 50, 51, 52], value: "$52K", delta: "+8.3%", positive: true, min: "$42K", avg: "$48K", max: "$52K", updated: "1s önce" },
      A: { values: [35, 38, 42, 45, 48, 50, 52], value: "$520K", delta: "+15.6%", positive: true, min: "$35K", avg: "$44K", max: "$52K", updated: "bugün" },
      Y: { values: [20, 28, 32, 38, 42, 48, 52], value: "$520K", delta: "+42.1%", positive: true, min: "$20K", avg: "$37K", max: "$52K", updated: "bugün" },
    },
    whyChanged: "Tedarikçi değişikliği COGS düşürdü.", comparison7d: "$50K → $52K (+4%)", comparison30d: "$45K → $52K (+15.6%)", suggestedAction: "Yeni tedarikçi sözleşmesini onaylayın.",
  },
  {
    label: "Katkı Marjı", icon: Percent, tint: "147,51,234",
    datasets: {
      G: { values: [41.8, 42, 42.1, 42, 42.2, 42.1, 42.1], value: "%42.1", delta: "+0.3pp", positive: true, min: "%41.8", avg: "%42.0", max: "%42.2", updated: "8s önce" },
      H: { values: [40.5, 41, 41.5, 41.8, 42, 42.1, 42.1], value: "%42.1", delta: "+1.6pp", positive: true, min: "%40.5", avg: "%41.6", max: "%42.1", updated: "1s önce" },
      A: { values: [38, 39, 40, 40.8, 41.2, 41.8, 42.1], value: "%42.1", delta: "+1.3pp", positive: true, min: "%38", avg: "%40.4", max: "%42.1", updated: "bugün" },
      Y: { values: [35, 36.5, 38, 39.5, 40.5, 41.5, 42.1], value: "%42.1", delta: "+3.1pp", positive: true, min: "%35", avg: "%39.0", max: "%42.1", updated: "bugün" },
    },
    whyChanged: "Operasyonel verimlilik arttı.", comparison7d: "%41.5 → %42.1", comparison30d: "%39.8 → %42.1", suggestedAction: "Ek %1pp iyileştirme potansiyeli mevcut.",
  },
  {
    label: "Cash Balance", icon: Banknote, tint: "0,229,255",
    datasets: {
      G: { values: [1.82, 1.83, 1.84, 1.85, 1.84, 1.86, 1.87], value: "$1.87M", delta: "+$12K", positive: true, min: "$1.82M", avg: "$1.84M", max: "$1.87M", updated: "3s önce" },
      H: { values: [1.6, 1.65, 1.7, 1.75, 1.8, 1.84, 1.87], value: "$1.87M", delta: "+$120K", positive: true, min: "$1.6M", avg: "$1.74M", max: "$1.87M", updated: "bugün" },
      A: { values: [1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.87], value: "$1.87M", delta: "+$270K", positive: true, min: "$1.3M", avg: "$1.60M", max: "$1.87M", updated: "bugün" },
      Y: { values: [0.8, 1.0, 1.2, 1.4, 1.6, 1.75, 1.87], value: "$1.87M", delta: "+$870K", positive: true, min: "$0.8M", avg: "$1.37M", max: "$1.87M", updated: "bugün" },
    },
    whyChanged: "Gelir artışı ve maliyet optimizasyonu.", comparison7d: "$1.84M → $1.87M", comparison30d: "$1.6M → $1.87M", suggestedAction: "Nakit rezerv politikasını 6 ay minimuma çıkarın.",
  },
  {
    label: "Runway", icon: Banknote, tint: "34,197,94",
    datasets: {
      G: { values: [9.2, 9.3, 9.3, 9.4, 9.4, 9.4, 9.4], value: "9.4 ay", delta: "+0.1 ay", positive: true, min: "9.2", avg: "9.3", max: "9.4", updated: "1dk önce" },
      H: { values: [8.5, 8.8, 9.0, 9.1, 9.2, 9.3, 9.4], value: "9.4 ay", delta: "+0.9 ay", positive: true, min: "8.5", avg: "9.0", max: "9.4", updated: "bugün" },
      A: { values: [7.2, 7.8, 8.1, 8.5, 8.9, 9.1, 9.4], value: "9.4 ay", delta: "+0.8 ay", positive: true, min: "7.2", avg: "8.4", max: "9.4", updated: "bugün" },
      Y: { values: [5.0, 5.8, 6.5, 7.2, 8.0, 8.8, 9.4], value: "9.4 ay", delta: "+2.4 ay", positive: true, min: "5.0", avg: "7.2", max: "9.4", updated: "bugün" },
    },
    whyChanged: "Nakit tamponu genişledi.", comparison7d: "9.1 → 9.4 ay", comparison30d: "8.1 → 9.4 ay", suggestedAction: "Nakit pozisyonunu koruyun.",
  },
  {
    label: "Burn Rate", icon: TrendingDown, tint: "239,68,68",
    datasets: {
      G: { values: [205, 202, 200, 198, 199, 197, 195], value: "$195K", delta: "-3.2%", positive: true, min: "$195K", avg: "$199K", max: "$205K", updated: "12s önce" },
      H: { values: [220, 215, 210, 205, 200, 198, 195], value: "$195K", delta: "-11.4%", positive: true, min: "$195K", avg: "$206K", max: "$220K", updated: "bugün" },
      A: { values: [240, 230, 220, 210, 205, 200, 195], value: "$195K/ay", delta: "-8.3%", positive: true, min: "$195K", avg: "$214K", max: "$240K", updated: "bugün" },
      Y: { values: [280, 260, 245, 230, 215, 205, 195], value: "$195K/ay", delta: "-18.2%", positive: true, min: "$195K", avg: "$233K", max: "$280K", updated: "bugün" },
    },
    whyChanged: "Maliyet azaltma programı etkili.", comparison7d: "$200K → $195K", comparison30d: "$210K → $195K", suggestedAction: "Burn azaltma momentumunu sürdürün.",
  },
  {
    label: "CAC", icon: Target, tint: "245,158,11",
    datasets: {
      G: { values: [32, 31, 30, 31, 29, 28, 28], value: "$28", delta: "-6.7%", positive: true, min: "$28", avg: "$30", max: "$32", updated: "20s önce" },
      H: { values: [38, 36, 34, 32, 30, 29, 28], value: "$28", delta: "-26.3%", positive: true, min: "$28", avg: "$32", max: "$38", updated: "bugün" },
      A: { values: [42, 38, 35, 32, 30, 29, 28], value: "$28", delta: "-14.3%", positive: true, min: "$28", avg: "$33", max: "$42", updated: "bugün" },
      Y: { values: [55, 48, 42, 38, 35, 31, 28], value: "$28", delta: "-32.7%", positive: true, min: "$28", avg: "$40", max: "$55", updated: "bugün" },
    },
    whyChanged: "Organik kanal payı arttı.", comparison7d: "$30 → $28", comparison30d: "$35 → $28", suggestedAction: "SEO yatırımını sürdürün.",
  },
  {
    label: "LTV", icon: Users, tint: "168,85,247",
    datasets: {
      G: { values: [420, 422, 425, 428, 430, 432, 435], value: "$435", delta: "+1.2%", positive: true, min: "$420", avg: "$427", max: "$435", updated: "15s önce" },
      H: { values: [390, 400, 410, 415, 420, 428, 435], value: "$435", delta: "+5.8%", positive: true, min: "$390", avg: "$414K", max: "$435", updated: "bugün" },
      A: { values: [350, 370, 385, 400, 415, 425, 435], value: "$435", delta: "+8.8%", positive: true, min: "$350", avg: "$397", max: "$435", updated: "bugün" },
      Y: { values: [280, 310, 340, 370, 395, 415, 435], value: "$435", delta: "+18.5%", positive: true, min: "$280", avg: "$364", max: "$435", updated: "bugün" },
    },
    whyChanged: "Sadakat programı churn'ü düşürdü.", comparison7d: "$428 → $435", comparison30d: "$400 → $435", suggestedAction: "Premium upsell fırsatlarını değerlendirin.",
  },
  {
    label: "ROAS", icon: Zap, tint: "30,107,255",
    datasets: {
      G: { values: [3.6, 3.7, 3.7, 3.8, 3.8, 3.9, 3.8], value: "3.8x", delta: "+0.2x", positive: true, min: "3.6x", avg: "3.76x", max: "3.9x", updated: "8s önce" },
      H: { values: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8], value: "3.8x", delta: "+0.6x", positive: true, min: "3.2x", avg: "3.57x", max: "3.8x", updated: "bugün" },
      A: { values: [2.8, 3.0, 3.2, 3.4, 3.5, 3.7, 3.8], value: "3.8x", delta: "+0.6x", positive: true, min: "2.8x", avg: "3.34x", max: "3.8x", updated: "bugün" },
      Y: { values: [2.2, 2.5, 2.8, 3.1, 3.3, 3.6, 3.8], value: "3.8x", delta: "+1.0x", positive: true, min: "2.2x", avg: "3.04x", max: "3.8x", updated: "bugün" },
    },
    whyChanged: "Kanal optimizasyonu etkili.", comparison7d: "3.6x → 3.8x", comparison30d: "3.2x → 3.8x", suggestedAction: "Google Ads bütçe kaydırma fırsatı.",
  },
  {
    label: "Aktif Kullanıcı", icon: ShoppingCart, tint: "236,72,153",
    datasets: {
      G: { values: [12400, 12500, 12550, 12600, 12650, 12700, 12780], value: "12.8K", delta: "+2.4%", positive: true, min: "12.4K", avg: "12.6K", max: "12.8K", updated: "30s önce" },
      H: { values: [11200, 11500, 11800, 12100, 12400, 12600, 12780], value: "12.8K", delta: "+7.1%", positive: true, min: "11.2K", avg: "12.1K", max: "12.8K", updated: "bugün" },
      A: { values: [9500, 10200, 10800, 11200, 11800, 12300, 12780], value: "12.8K", delta: "+12.2%", positive: true, min: "9.5K", avg: "11.2K", max: "12.8K", updated: "bugün" },
      Y: { values: [6000, 7200, 8500, 9800, 10800, 11800, 12780], value: "12.8K", delta: "+38.5%", positive: true, min: "6.0K", avg: "9.6K", max: "12.8K", updated: "bugün" },
    },
    whyChanged: "Yeni kampanya kullanıcı artırdı.", comparison7d: "12.5K → 12.8K", comparison30d: "11.4K → 12.8K", suggestedAction: "Retention stratejisini güçlendirin.",
  },
];

/* ── Sparkline Chart ── */
const NeonSparkline = ({ data, positive, uniqueId }: { data: number[]; positive: boolean; uniqueId: string }) => {
  const h = 52, w = 180;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 8) - 4,
  ]);
  const line = points.map(p => p.join(",")).join(" ");
  const area = `M0,${h} L${line} L${w},${h} Z`;
  const gradId = `kpi-${uniqueId}`;
  const colors = positive ? { from: "#00E5FF", to: "#1E6BFF" } : { from: "#FF6B6B", to: "#EF4444" };

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={`${gradId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.14" />
          <stop offset="100%" stopColor={colors.from} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gradId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId}-fill)`} />
      <polyline
        points={line}
        fill="none"
        stroke={`url(#${gradId}-line)`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${colors.from}55)` }}
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={colors.from} opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

const KPIWall = () => {
  const [ranges, setRanges] = useState<Record<number, TimeRange>>({});
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const chartId = useId();
  const timeOptions: TimeRange[] = ["G", "H", "A", "Y"];

  const getRange = (i: number): TimeRange => ranges[i] ?? "A";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Şirket Metrikleri</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        {kpis.map((kpi, i) => {
          const tr = getRange(i);
          const ds = kpi.datasets[tr];
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="group relative overflow-hidden cursor-pointer hover:-translate-y-px transition-all duration-200"
              style={{
                background: "hsl(var(--card))",
                border: "0.5px solid hsl(var(--border))",
                borderRadius: "var(--radius-card, 18px)",
              }}
            >

              <div className="p-3 pb-0 relative">
                {/* Header: icon + label + delta */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <kpi.icon className="h-4 w-4" style={{ color: `rgb(${kpi.tint})`, opacity: 0.7 }} />
                    <span className="text-[0.72rem] font-medium text-muted-foreground/70">{kpi.label}</span>
                  </div>
                  <span
                    className="text-[0.65rem] font-bold px-1.5 py-0.5"
                    style={{
                      background: ds.positive ? "rgba(22,199,132,0.12)" : "rgba(239,68,68,0.12)",
                      color: ds.positive ? "#16C784" : "#EF4444",
                      borderRadius: "var(--radius-pill, 999px)",
                    }}
                  >
                    {ds.delta}
                  </span>
                </div>

                {/* Main value */}
                <p className="text-[2rem] font-bold text-foreground leading-none tracking-tight mb-1" style={{ letterSpacing: "-0.04em" }}>
                  {ds.value}
                </p>

                {/* Time range toggle */}
                <div className="flex gap-0.5 mb-2">
                  {timeOptions.map(t => (
                    <button
                      key={t}
                      onClick={(e) => { e.stopPropagation(); setRanges(prev => ({ ...prev, [i]: t })); }}
                      className="text-[0.55rem] font-semibold px-2 py-0.5 transition-all duration-150"
                      style={{
                        borderRadius: "var(--radius-pill, 999px)",
                        background: tr === t ? "hsl(var(--primary) / 0.15)" : "transparent",
                        color: tr === t ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart area — edge to edge */}
              <div className="px-2 pb-1">
                <NeonSparkline data={ds.values} positive={ds.positive} uniqueId={`${chartId}-${i}-${tr}`} />
              </div>

              {/* Footer: min/avg/max + updated */}
              <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                <div className="flex gap-2 text-[0.55rem] text-muted-foreground/45">
                  <span>Min {ds.min}</span>
                  <span>Avg {ds.avg}</span>
                  <span>Max {ds.max}</span>
                </div>
                <span className="text-[0.5rem] text-muted-foreground/30">{ds.updated}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Why Changed Drawer */}
      <AnimatePresence>
        {openDrawer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
            onClick={() => setOpenDrawer(null)}
          >
            <div className="absolute inset-0 bg-background/60" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md h-full p-6 overflow-y-auto glass-card"
              style={{
                borderRadius: 0,
                borderLeft: "1px solid hsl(var(--border))",
              }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setOpenDrawer(null)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/[0.04]">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
              <h3 className="text-base font-semibold text-foreground mb-1">{kpis[openDrawer].label}</h3>
              <p className="text-[0.7rem] text-primary/70 mb-4">Neden Değişti?</p>
              <p className="text-[0.8rem] text-foreground/80 leading-relaxed mb-6">{kpis[openDrawer].whyChanged}</p>

              <div className="space-y-4">
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-muted-foreground/50">7 gün</span>
                  <span className="text-foreground/80">{kpis[openDrawer].comparison7d}</span>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-muted-foreground/50">30 gün</span>
                  <span className="text-foreground/80">{kpis[openDrawer].comparison30d}</span>
                </div>
                <div className="pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[0.65rem] text-muted-foreground/50 mb-1.5">Önerilen Aksiyon</p>
                  <p className="text-[0.8rem] text-primary/80">{kpis[openDrawer].suggestedAction}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KPIWall;
