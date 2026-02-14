import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MiniMetric {
  label: string;
  score: number;
  trend: "up" | "down" | "flat";
  sparkline: number[];
}

const metrics: MiniMetric[] = [
  { label: "Revenue Stability", score: 82, trend: "up", sparkline: [40, 45, 42, 50, 55, 58, 62] },
  { label: "Profit Strength", score: 71, trend: "down", sparkline: [60, 58, 55, 52, 50, 48, 46] },
  { label: "Growth Momentum", score: 88, trend: "up", sparkline: [30, 35, 42, 50, 58, 65, 72] },
  { label: "Inventory Risk", score: 64, trend: "down", sparkline: [80, 75, 70, 68, 65, 62, 60] },
  { label: "Operational Load", score: 76, trend: "flat", sparkline: [50, 52, 48, 50, 51, 49, 50] },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 56;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const CompanyHealthScore = () => {
  const overallScore = 78;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">Company Health Score</h2>
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="relative shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="url(#scoreGradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{overallScore}</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Mini Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1 w-full">
            {metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-2xl bg-secondary/50 text-center">
                <p className="text-[11px] text-muted-foreground mb-1.5 truncate">{m.label}</p>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="text-lg font-bold text-foreground">{m.score}</span>
                  <TrendIcon trend={m.trend} />
                </div>
                <div className="flex justify-center">
                  <Sparkline data={m.sparkline} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyHealthScore;
