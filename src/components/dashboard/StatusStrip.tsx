import { motion } from "framer-motion";
import { Inbox, Radio, Plug } from "lucide-react";
import { Link } from "react-router-dom";

interface StatusStripProps {
  onInboxClick?: () => void;
}

/* ── Mini sparkline ── */
const MiniSpark = ({ data, color }: { data: number[]; color: string }) => {
  const h = 24, w = 56;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1" strokeLinejoin="round" opacity="0.65" />
    </svg>
  );
};

interface MetricBlock {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  sparkData: number[];
  sparkColor: string;
  subtitle?: string;
}

const StatusStrip = ({ onInboxClick }: StatusStripProps) => {
  const metrics: MetricBlock[] = [
    { label: "COMPANY HEALTH", value: "78", delta: "+3.2%", positive: true, sparkData: [68, 70, 72, 74, 75, 77, 78], sparkColor: "hsl(var(--primary))" },
    { label: "RISK LEVEL", value: "Medium", delta: "Score: 42", positive: false, sparkData: [50, 48, 45, 44, 43, 42, 42], sparkColor: "hsl(var(--warning))", subtitle: "Trend: ↑" },
    { label: "FINANCIAL STABILITY", value: "72", delta: "+1.8%", positive: true, sparkData: [64, 66, 68, 69, 70, 71, 72], sparkColor: "hsl(var(--success))" },
    { label: "OPERATIONAL INDEX", value: "68", delta: "-0.4%", positive: false, sparkData: [70, 69, 69, 68, 68, 68, 68], sparkColor: "hsl(var(--warning))" },
    { label: "GROWTH MOMENTUM", value: "81", delta: "+4.1%", positive: true, sparkData: [65, 68, 72, 75, 78, 80, 81], sparkColor: "hsl(var(--primary))" },
    { label: "RUNWAY", value: "9.4 ay", delta: "-0.3 vs last month", positive: false, sparkData: [8.5, 8.8, 9.0, 9.1, 9.3, 9.4, 9.4], sparkColor: "hsl(190, 100%, 50%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5"
    >
      <div
        className="flex items-stretch"
        style={{
          background: "hsl(var(--card))",
          border: "0.5px solid hsl(var(--border))",
          borderRadius: "var(--radius-card, 18px)",
        }}
      >
        {/* Metric blocks */}
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="flex-1 flex items-center gap-3 px-4 py-3"
            style={{
              borderRight: i < metrics.length - 1 ? "0.5px solid hsl(var(--border))" : "none",
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[0.55rem] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground leading-none tracking-tight">{m.value}</span>
                {m.label === "COMPANY HEALTH" && <span className="text-[0.6rem] text-muted-foreground">/ 100</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[0.6rem] font-semibold ${m.positive ? "text-success" : "text-warning"}`}>{m.delta}</span>
                {m.subtitle && <span className="text-[0.55rem] text-muted-foreground">{m.subtitle}</span>}
              </div>
            </div>
            <MiniSpark data={m.sparkData} color={m.sparkColor} />
          </div>
        ))}

        {/* Divider */}
        <div style={{ width: "0.5px", background: "hsl(var(--border))" }} />

        {/* Right: Inbox + Demo + Bağla */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0">
          {/* Inbox */}
          <button
            onClick={onInboxClick}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors"
            style={{ borderRadius: "var(--radius-inner, 12px)" }}
          >
            <div className="relative">
              <Inbox className="h-4 w-4 text-destructive" />
              <span
                className="absolute -top-1 -right-1.5 text-[0.4rem] font-bold bg-destructive text-white h-3 w-3 flex items-center justify-center"
                style={{ borderRadius: "var(--radius-pill, 999px)" }}
              >3</span>
            </div>
            <div>
              <p className="text-[0.55rem] font-semibold text-muted-foreground uppercase tracking-wider">INBOX</p>
              <p className="text-[0.65rem] font-semibold text-foreground leading-none">
                3 Bekleyen <span className="text-destructive text-[0.55rem]">(2 kritik)</span>
              </p>
            </div>
          </button>

          {/* Demo + Bağla */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-success animate-pulse" />
              <span className="text-[0.55rem] font-medium text-success/80">Demo</span>
            </div>
            <Link
              to="/data-sources"
              className="flex items-center gap-1 text-[0.55rem] font-medium px-2.5 py-1 btn-accent"
              style={{ borderRadius: "var(--radius-inner, 12px)" }}
            >
              <Plug className="h-3 w-3" />
              Bağla
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusStrip;
