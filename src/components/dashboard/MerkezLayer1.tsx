import { useState, useId } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, ShoppingCart, Target, BarChart3, Percent } from "lucide-react";

/* ── Radial Health Score ── */
const HealthScore = () => {
  const score = 78;
  const delta = "+3.2%";
  const r = 62;
  const circumference = 2 * Math.PI * r;
  const dashLen = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="h-full flex flex-col items-center justify-center p-8"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.35) 100%)",
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        borderRadius: "var(--radius-card, 16px)",
      }}
    >
      <p className="text-[0.65rem] font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-5">Şirket Sağlık Skoru</p>
      <div className="relative">
        <svg width={150} height={150} className="-rotate-90">
          <circle cx={75} cy={75} r={r} fill="none" stroke="#111" strokeWidth="9" />
          <circle
            cx={75} cy={75} r={r} fill="none"
            stroke="url(#healthGradNew)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
          >
            <animate attributeName="stroke-dashoffset" from={circumference.toString()} to="0" dur="1s" fill="freeze" />
          </circle>
          <circle
            cx={75} cy={75} r={r} fill="none"
            stroke="url(#sheenGrad)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={`${circumference * 0.08} ${circumference * 0.92}`}
            opacity="0.35"
          >
            <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="7s" repeatCount="indefinite" />
          </circle>
          <defs>
            <linearGradient id="healthGradNew" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E90FF" />
              <stop offset="100%" stopColor="#00E0FF" />
            </linearGradient>
            <linearGradient id="sheenGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[3rem] font-bold text-foreground leading-none" style={{ letterSpacing: "-0.03em" }}>{score}</span>
          <span className="text-[0.65rem] text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-5">
        <TrendingUp className="h-3.5 w-3.5 text-success" />
        <span className="text-xs font-semibold text-success">{delta}</span>
        <span className="text-[0.6rem] text-muted-foreground ml-1">son 30 gün</span>
      </div>
      <p className="text-[0.65rem] text-muted-foreground leading-relaxed mt-3 text-center max-w-[220px]">
        Finansal stabilite güçlü. Operasyonel verimlilik stabil.
      </p>
    </motion.div>
  );
};

/* ── Time Filter Segment ── */
const timeFilters = ["G", "H", "A", "Y"] as const;
type TF = typeof timeFilters[number];

const timeFilterData: Record<TF, Record<string, number[]>> = {
  G: {
    "Toplam Gelir": [235, 238, 232, 240, 237, 241, 240],
    "Net Kâr": [36, 37, 35, 38, 37, 38, 38],
    "Katkı Marjı": [41.8, 42, 41.5, 42.1, 41.9, 42.2, 42.1],
    "Büyüme Oranı": [18.2, 18.4, 18.1, 18.7, 18.5, 18.8, 18.7],
    "Müşteri Edinme": [34, 33, 33, 32, 33, 32, 32],
    "Aktif Kullanıcı": [12.1, 12.2, 12.1, 12.3, 12.3, 12.4, 12.4],
  },
  H: {
    "Toplam Gelir": [215, 220, 225, 230, 235, 238, 240],
    "Net Kâr": [33, 34, 35, 36, 36, 37, 38],
    "Katkı Marjı": [40.5, 41, 41.2, 41.5, 41.8, 42, 42.1],
    "Büyüme Oranı": [16.5, 17, 17.3, 17.8, 18, 18.4, 18.7],
    "Müşteri Edinme": [38, 37, 36, 35, 34, 33, 32],
    "Aktif Kullanıcı": [11.5, 11.7, 11.9, 12, 12.1, 12.3, 12.4],
  },
  A: {
    "Toplam Gelir": [180, 195, 205, 215, 225, 235, 240],
    "Net Kâr": [28, 30, 32, 33, 35, 36, 38],
    "Katkı Marjı": [39, 40, 40.5, 41, 41.2, 41.8, 42.1],
    "Büyüme Oranı": [14, 15, 15.5, 16.2, 17, 17.8, 18.7],
    "Müşteri Edinme": [42, 40, 38, 36, 35, 33, 32],
    "Aktif Kullanıcı": [10.2, 10.8, 11.1, 11.5, 11.9, 12.1, 12.4],
  },
  Y: {
    "Toplam Gelir": [120, 145, 170, 195, 215, 230, 240],
    "Net Kâr": [18, 22, 26, 30, 33, 36, 38],
    "Katkı Marjı": [35, 37, 38.5, 39.5, 40.5, 41.5, 42.1],
    "Büyüme Oranı": [8, 10, 12, 14, 16, 17.5, 18.7],
    "Müşteri Edinme": [55, 50, 45, 40, 37, 34, 32],
    "Aktif Kullanıcı": [6.5, 7.8, 9, 10, 11, 11.8, 12.4],
  },
};

const TimeFilter = ({ active, onChange }: { active: TF; onChange: (v: TF) => void }) => (
  <div className="flex gap-0.5 p-0.5" style={{ borderRadius: "var(--radius-pill, 999px)", background: "rgba(255,255,255,0.04)" }}>
    {timeFilters.map((f) => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className={`px-3 py-1 text-[0.6rem] font-medium transition-all duration-200 ${
          active === f
            ? "text-primary bg-primary/12 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        style={{
          borderRadius: "var(--radius-pill, 999px)",
          border: active === f ? "0.5px solid rgba(30,144,255,0.3)" : "0.5px solid transparent",
        }}
      >
        {f}
      </button>
    ))}
  </div>
);

/* ── KPI Chart with neon gradient & sweep ── */
const KPIChart = ({ data, positive, uniqueId }: { data: number[]; positive: boolean; uniqueId: string }) => {
  const h = 56;
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 6) - 3,
  ]);
  const line = points.map(p => p.join(",")).join(" ");
  const area = `M${points.map(p => p.join(",")).join(" L")} L${w},${h} L0,${h} Z`;
  const gradId = `kpi-${uniqueId}`;
  const colors = positive ? { from: "#00E5FF", to: "#2D7BFF" } : { from: "#FF6B6B", to: "#EF4444" };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id={`${gradId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.18" />
          <stop offset="100%" stopColor={colors.from} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gradId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
        <linearGradient id={`${gradId}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0">
            <animate attributeName="offset" values="-0.3;1.3" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="10%" stopColor="white" stopOpacity="0.5">
            <animate attributeName="offset" values="-0.2;1.4" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="20%" stopColor="white" stopOpacity="0">
            <animate attributeName="offset" values="-0.1;1.5" dur="5s" repeatCount="indefinite" />
          </stop>
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
        style={{ filter: `drop-shadow(0 0 10px ${colors.from}88)` }}
      />
      <polyline
        points={line}
        fill="none"
        stroke={`url(#${gradId}-sweep)`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={colors.from} opacity="0.9" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="6" fill={colors.from} opacity="0.12" />
    </svg>
  );
};

/* ── KPI Card Data ── */
interface KPICard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ElementType;
  min: string;
  max: string;
  avg: string;
  tint: string;
}

const kpis: KPICard[] = [
  { label: "Toplam Gelir", value: "$2.4M", delta: "+12.4%", positive: true, icon: DollarSign, min: "$1.8M", max: "$2.4M", avg: "$2.1M", tint: "30,144,255" },
  { label: "Net Kâr", value: "$380K", delta: "+8.2%", positive: true, icon: BarChart3, min: "$280K", max: "$380K", avg: "$330K", tint: "0,229,255" },
  { label: "Katkı Marjı", value: "%42.1", delta: "+1.3pp", positive: true, icon: Percent, min: "%39", max: "%42.1", avg: "%40.5", tint: "147,51,234" },
  { label: "Büyüme Oranı", value: "%18.7", delta: "+2.1pp", positive: true, icon: TrendingUp, min: "%14", max: "%18.7", avg: "%16.3", tint: "22,199,132" },
  { label: "Müşteri Edinme", value: "$32", delta: "-$4", positive: true, icon: ShoppingCart, min: "$32", max: "$42", avg: "$37", tint: "30,144,255" },
  { label: "Aktif Kullanıcı", value: "12.4K", delta: "+6.8%", positive: true, icon: Users, min: "10.2K", max: "12.4K", avg: "11.3K", tint: "0,229,255" },
];

const KPICardComponent = ({ kpi, i }: { kpi: KPICard; i: number }) => {
  const [timeFilter, setTimeFilter] = useState<TF>("H");
  const chartId = useId();
  const chartData = timeFilterData[timeFilter]?.[kpi.label] || [0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + i * 0.04 }}
      className="group transition-all duration-200 hover:-translate-y-px relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${kpi.tint},0.04) 0%, rgba(255,255,255,0.03) 30%, rgba(0,0,0,0.35) 100%)`,
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "1.2rem",
      }}
    >
      {/* 3D sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
          background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
          opacity: 0.35,
          mixBlendMode: "screen",
        }}
      />

      {/* Top row: icon + delta */}
      <div className="flex items-center justify-between mb-3 relative">
        <div
          className="h-9 w-9 flex items-center justify-center"
          style={{
            background: `rgba(${kpi.tint},0.1)`,
            borderRadius: "var(--radius-inner, 12px)",
          }}
        >
          <kpi.icon className="h-[18px] w-[18px]" style={{ color: `rgba(${kpi.tint},0.8)` }} />
        </div>
        <span className={`text-[0.7rem] font-semibold ${kpi.positive ? "text-success" : "text-destructive"}`}>
          {kpi.delta}
        </span>
      </div>

      {/* Value — primary focus */}
      <p className="text-[1.7rem] font-semibold text-foreground leading-none mb-1 relative" style={{ letterSpacing: "-0.03em" }}>
        {kpi.value}
      </p>

      {/* Label */}
      <p className="text-[0.7rem] text-muted-foreground/70 font-medium mb-3 relative">{kpi.label}</p>

      {/* Time filter */}
      <div className="mb-2 relative">
        <TimeFilter active={timeFilter} onChange={setTimeFilter} />
      </div>

      {/* Chart — full width, neon glow */}
      <motion.div
        key={timeFilter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="-mx-2 relative"
      >
        <KPIChart data={chartData} positive={kpi.positive} uniqueId={`${chartId}-${i}`} />
      </motion.div>

      {/* Summary row */}
      <div className="flex justify-between mt-2 text-[0.55rem] text-muted-foreground/60 relative">
        <span>Min: {kpi.min}</span>
        <span>Ort: {kpi.avg}</span>
        <span>Max: {kpi.max}</span>
      </div>
    </motion.div>
  );
};

const MerkezLayer1 = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-7">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[18px]">
      <div className="lg:col-span-1">
        <HealthScore />
      </div>
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-[18px]">
        {kpis.map((kpi, i) => (
          <KPICardComponent key={kpi.label} kpi={kpi} i={i} />
        ))}
      </div>
    </div>
  </motion.div>
);

export default MerkezLayer1;
