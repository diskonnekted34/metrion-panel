import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, BarChart3, Percent } from "lucide-react";

/* ── Radial Health Score ── */
const HealthScore = () => {
  const score = 78;
  const delta = "+3.2%";
  const r = 58;
  const circumference = 2 * Math.PI * r;
  const dashLen = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 flex items-center gap-6"
    >
      <div className="relative shrink-0">
        <svg width={140} height={140} className="-rotate-90">
          <circle cx={70} cy={70} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="10" opacity="0.3" />
          <circle
            cx={70} cy={70} r={r} fill="none"
            stroke="url(#healthGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            className="drop-shadow-[0_0_8px_rgba(30,107,255,0.3)]"
          >
            <animate attributeName="stroke-dashoffset" from={circumference.toString()} to="0" dur="1.2s" fill="freeze" />
          </circle>
          <defs>
            <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(220, 100%, 56%)" />
              <stop offset="100%" stopColor="hsl(160, 76%, 44%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[2.8rem] font-bold text-foreground leading-none">{score}</span>
          <span className="text-[0.6rem] text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Şirket Sağlık Skoru</h3>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium text-success">{delta}</span>
          <span className="text-[0.65rem] text-muted-foreground ml-1">son 30 gün</span>
        </div>
        <p className="text-[0.65rem] text-muted-foreground mt-2 max-w-[200px] leading-relaxed">
          Finansal stabilite güçlü, operasyonel verimlilik stabil. Kanal konsantrasyon riski izleniyor.
        </p>
      </div>
    </motion.div>
  );
};

/* ── KPI Snapshot Cards ── */
interface KPICard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  sparkline: number[];
  icon: React.ElementType;
}

const kpis: KPICard[] = [
  { label: "Toplam Gelir", value: "$2.4M", delta: "+12.4%", positive: true, sparkline: [180,195,205,215,225,235,240], icon: DollarSign },
  { label: "Net Kâr", value: "$380K", delta: "+8.2%", positive: true, sparkline: [28,30,32,33,35,36,38], icon: BarChart3 },
  { label: "Katkı Marjı", value: "%42.1", delta: "+1.3pp", positive: true, sparkline: [39,40,40.5,41,41.2,41.8,42.1], icon: Percent },
  { label: "Büyüme Oranı", value: "%18.7", delta: "+2.1pp", positive: true, sparkline: [14,15,15.5,16.2,17,17.8,18.7], icon: TrendingUp },
  { label: "Müşteri Edinme", value: "$32", delta: "-$4", positive: true, sparkline: [42,40,38,36,35,33,32], icon: ShoppingCart },
  { label: "Aktif Kullanıcı", value: "12.4K", delta: "+6.8%", positive: true, sparkline: [10.2,10.8,11.1,11.5,11.9,12.1,12.4], icon: Users },
];

const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 72;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const gradId = `spark-${data[0]}`;
  const areaPath = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`);
  const area = `M${areaPath.join(" L")} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} className="opacity-80">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "hsl(160,76%,44%)" : "hsl(0,84%,60%)"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "hsl(160,76%,44%)" : "hsl(0,84%,60%)"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={positive ? "hsl(160,76%,44%)" : "hsl(0,84%,60%)"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const KPICardComponent = ({ kpi, i }: { kpi: KPICard; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 + i * 0.05 }}
    className="glass-card p-5 group hover:-translate-y-0.5 transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <kpi.icon className="h-4 w-4 text-primary" />
      </div>
      <span className={`text-[0.7rem] font-semibold ${kpi.positive ? "text-success" : "text-destructive"}`}>
        {kpi.delta}
      </span>
    </div>
    <p className="text-[1.65rem] font-bold text-foreground leading-none mb-1">{kpi.value}</p>
    <p className="text-[0.65rem] text-muted-foreground font-medium mb-3">{kpi.label}</p>
    <MiniSparkline data={kpi.sparkline} positive={kpi.positive} />
  </motion.div>
);

const MerkezLayer1 = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-[1.75rem] font-semibold text-foreground tracking-tight">Merkez</h1>
      <p className="text-sm text-muted-foreground/80 mt-1">
        Şirketin anlık durumu ve öncelikli müdahale alanları.
      </p>
    </div>

    {/* Health Score + KPI Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-1">
        <HealthScore />
      </div>
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <KPICardComponent key={kpi.label} kpi={kpi} i={i} />
        ))}
      </div>
    </div>
  </motion.div>
);

export default MerkezLayer1;
