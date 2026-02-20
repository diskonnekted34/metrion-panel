import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, BarChart3, Percent } from "lucide-react";

/* ── Radial Health Score ── */
const HealthScore = () => {
  const score = 78;
  const delta = "+3.2%";
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dashLen = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="h-full flex flex-col justify-center p-6"
      style={{
        background: "rgba(8,8,8,0.55)",
        backdropFilter: "blur(20px)",
        border: "0.5px solid",
        borderImage: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%) 1",
        borderRadius: "1rem",
      }}
    >
      <p className="text-[0.6rem] font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-5">Şirket Sağlık Skoru</p>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width={124} height={124} className="-rotate-90">
            <circle cx={62} cy={62} r={r} fill="none" stroke="#111" strokeWidth="8" />
            <circle
              cx={62} cy={62} r={r} fill="none"
              stroke="url(#healthGradNew)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            >
              <animate attributeName="stroke-dashoffset" from={circumference.toString()} to="0" dur="1s" fill="freeze" />
            </circle>
            {/* Moving sheen */}
            <circle
              cx={62} cy={62} r={r} fill="none"
              stroke="url(#sheenGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.08} ${circumference * 0.92}`}
              opacity="0.4"
            >
              <animateTransform attributeName="transform" type="rotate" from="0 62 62" to="360 62 62" dur="3s" repeatCount="indefinite" />
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
            <span className="text-[2.5rem] font-bold text-foreground leading-none tracking-tight">{score}</span>
            <span className="text-[0.55rem] text-muted-foreground mt-0.5">/ 100</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-xs font-semibold text-success">{delta}</span>
            <span className="text-[0.6rem] text-muted-foreground ml-1">son 30 gün</span>
          </div>
          <p className="text-[0.6rem] text-muted-foreground leading-relaxed">
            Finansal stabilite güçlü. Operasyonel verimlilik stabil.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Time Filter Segment ── */
const timeFilters = ["G", "H", "A", "Y"] as const;
const timeLabels = { G: "Günlük", H: "Haftalık", A: "Aylık", Y: "Yıllık" };

const TimeFilter = ({ active, onChange }: { active: string; onChange: (v: string) => void }) => (
  <div className="flex gap-1">
    {timeFilters.map((f) => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className={`px-2 py-0.5 rounded text-[0.55rem] font-medium transition-all ${
          active === f
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground"
        }`}
        style={active === f ? { border: "0.5px solid rgba(30,107,255,0.3)" } : { border: "0.5px solid transparent" }}
      >
        {f}
      </button>
    ))}
  </div>
);

/* ── KPI Chart ── */
const KPIChart = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const h = 40;
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const line = points.map(p => p.join(",")).join(" ");
  const area = `M${points.map(p => p.join(",")).join(" L")} L${w},${h} L0,${h} Z`;
  const gradId = `kpi-${data[0]}-${data.length}`;
  const strokeColor = positive ? "#1E90FF" : "#EF4444";
  const gradColor = positive ? "30,144,255" : "239,68,68";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${gradColor},0.06)`} />
          <stop offset="100%" stopColor={`rgba(${gradColor},0)`} />
        </linearGradient>
        <linearGradient id={`${gradId}-line`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="100%" stopColor={positive ? "#00E0FF" : "#FF6B6B"} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={`url(#${gradId}-line)`}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last point glow */}
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={strokeColor} opacity="0.8" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="5" fill={strokeColor} opacity="0.15" />
    </svg>
  );
};

/* ── KPI Card Data ── */
interface KPICard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  sparkline: number[];
  icon: React.ElementType;
  min: string;
  max: string;
  avg: string;
}

const kpis: KPICard[] = [
  { label: "Toplam Gelir", value: "$2.4M", delta: "+12.4%", positive: true, sparkline: [180,195,205,215,225,235,240], icon: DollarSign, min: "$1.8M", max: "$2.4M", avg: "$2.1M" },
  { label: "Net Kâr", value: "$380K", delta: "+8.2%", positive: true, sparkline: [28,30,32,33,35,36,38], icon: BarChart3, min: "$280K", max: "$380K", avg: "$330K" },
  { label: "Katkı Marjı", value: "%42.1", delta: "+1.3pp", positive: true, sparkline: [39,40,40.5,41,41.2,41.8,42.1], icon: Percent, min: "%39", max: "%42.1", avg: "%40.5" },
  { label: "Büyüme Oranı", value: "%18.7", delta: "+2.1pp", positive: true, sparkline: [14,15,15.5,16.2,17,17.8,18.7], icon: TrendingUp, min: "%14", max: "%18.7", avg: "%16.3" },
  { label: "Müşteri Edinme", value: "$32", delta: "-$4", positive: true, sparkline: [42,40,38,36,35,33,32], icon: ShoppingCart, min: "$32", max: "$42", avg: "$37" },
  { label: "Aktif Kullanıcı", value: "12.4K", delta: "+6.8%", positive: true, sparkline: [10.2,10.8,11.1,11.5,11.9,12.1,12.4], icon: Users, min: "10.2K", max: "12.4K", avg: "11.3K" },
];

const KPICardComponent = ({ kpi, i }: { kpi: KPICard; i: number }) => {
  const [timeFilter, setTimeFilter] = useState("A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + i * 0.04 }}
      className="group transition-all duration-200 hover:-translate-y-px p-4"
      style={{
        background: "rgba(8,8,8,0.55)",
        backdropFilter: "blur(20px)",
        border: "0.5px solid",
        borderImage: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%) 1",
        borderRadius: "0.9rem",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="h-7 w-7 rounded-lg bg-primary/8 flex items-center justify-center">
          <kpi.icon className="h-3.5 w-3.5 text-primary/70" />
        </div>
        <span className={`text-[0.6rem] font-semibold ${kpi.positive ? "text-success" : "text-destructive"}`}>
          {kpi.delta}
        </span>
      </div>
      <p className="text-[1.35rem] font-bold text-foreground leading-none mb-0.5 tracking-tight">{kpi.value}</p>
      <p className="text-[0.6rem] text-muted-foreground font-medium mb-3">{kpi.label}</p>

      <div className="flex items-center justify-between mb-2">
        <TimeFilter active={timeFilter} onChange={setTimeFilter} />
      </div>

      <KPIChart data={kpi.sparkline} positive={kpi.positive} />

      <div className="flex justify-between mt-2 text-[0.5rem] text-muted-foreground">
        <span>Min: {kpi.min}</span>
        <span>Ort: {kpi.avg}</span>
        <span>Max: {kpi.max}</span>
      </div>
    </motion.div>
  );
};

const MerkezLayer1 = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
    {/* Health Score + KPI Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div className="lg:col-span-1">
        <HealthScore />
      </div>
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map((kpi, i) => (
          <KPICardComponent key={kpi.label} kpi={kpi} i={i} />
        ))}
      </div>
    </div>
  </motion.div>
);

export default MerkezLayer1;
