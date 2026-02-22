import { motion } from "framer-motion";
import { Activity, AlertTriangle, Banknote, Inbox, Sparkles, Radio, Plug } from "lucide-react";
import { Link } from "react-router-dom";

interface StatusStripProps {
  onInboxClick?: () => void;
}

const StatusStrip = ({ onInboxClick }: StatusStripProps) => {
  const healthScore = 78;
  const healthDelta = +3.2;
  const riskLevel = "Medium";
  const runway = 9.4;
  const inboxCount = 3;
  const criticalCount = 2;

  // Mini sparkline for cash trend
  const cashData = [6.2, 6.8, 7.1, 7.8, 8.5, 9.0, 9.4];
  const h = 20, w = 60;
  const max = Math.max(...cashData), min = Math.min(...cashData), range = max - min || 1;
  const pts = cashData.map((v, i) => `${(i / (cashData.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");

  const riskChips = [
    { label: "Fin", score: 42, color: "#F59E0B" },
    { label: "Op", score: 58, color: "#EF4444" },
    { label: "Grw", score: 35, color: "#1E6BFF" },
    { label: "Tch", score: 28, color: "#00E5FF" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5"
    >
      <div
        className="flex items-center gap-1 px-3 py-2"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.5) 100%)",
          backdropFilter: "blur(20px)",
          border: "0.5px solid rgba(255,255,255,0.06)",
          borderRadius: "var(--radius-card, 16px)",
          height: "72px",
        }}
      >
        {/* Health Score */}
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <div className="relative h-10 w-10 flex items-center justify-center">
            <svg width={40} height={40} className="-rotate-90">
              <circle cx={20} cy={20} r={16} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <circle
                cx={20} cy={20} r={16} fill="none"
                stroke="url(#stripHealthGrad)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 100.5} ${100.5 - (healthScore / 100) * 100.5}`}
              />
              <defs>
                <linearGradient id="stripHealthGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E90FF" />
                  <stop offset="100%" stopColor="#00E0FF" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-[0.7rem] font-bold text-foreground">{healthScore}</span>
          </div>
          <div>
            <p className="text-[0.5rem] text-muted-foreground/50 font-medium uppercase tracking-wider">Health</p>
            <p className="text-[0.65rem] font-semibold text-success leading-none">+{healthDelta}%</p>
          </div>
        </div>

        <div className="h-8 w-px bg-white/[0.04]" />

        {/* Risk Level */}
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <div>
            <p className="text-[0.5rem] text-muted-foreground/50 font-medium uppercase tracking-wider">Risk</p>
            <p className="text-[0.7rem] font-semibold text-warning leading-none">{riskLevel}</p>
          </div>
          <div className="flex gap-1 ml-1">
            {riskChips.map(c => (
              <span
                key={c.label}
                className="text-[0.45rem] font-bold px-1.5 py-0.5"
                style={{
                  background: `${c.color}18`,
                  color: c.color,
                  borderRadius: "var(--radius-pill, 999px)",
                }}
              >
                {c.label} {c.score}
              </span>
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-white/[0.04]" />

        {/* Runway */}
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <Banknote className="h-4 w-4" style={{ color: "#00E5FF" }} />
          <div>
            <p className="text-[0.5rem] text-muted-foreground/50 font-medium uppercase tracking-wider">Runway</p>
            <p className="text-[0.7rem] font-semibold text-foreground leading-none">{runway} ay</p>
          </div>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="ml-1">
            <polyline points={pts} fill="none" stroke="#00E5FF" strokeWidth="1" strokeLinejoin="round" opacity="0.7" />
          </svg>
        </div>

        <div className="h-8 w-px bg-white/[0.04]" />

        {/* Inbox */}
        <button onClick={onInboxClick} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/[0.03] transition-colors" style={{ borderRadius: "var(--radius-inner, 12px)" }}>
          <div className="relative">
            <Inbox className="h-4 w-4 text-destructive" />
            <span className="absolute -top-1 -right-1.5 text-[0.4rem] font-bold bg-destructive text-white h-3 w-3 flex items-center justify-center" style={{ borderRadius: "var(--radius-pill, 999px)" }}>
              {inboxCount}
            </span>
          </div>
          <div>
            <p className="text-[0.5rem] text-muted-foreground/50 font-medium uppercase tracking-wider">Inbox</p>
            <p className="text-[0.7rem] font-semibold text-foreground leading-none">
              {inboxCount} bekleyen <span className="text-destructive text-[0.55rem]">({criticalCount} kritik)</span>
            </p>
          </div>
        </button>

        <div className="h-8 w-px bg-white/[0.04]" />

        {/* Live/Demo + Data Source */}
        <div className="flex items-center gap-2 px-3 py-1.5 ml-auto">
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
    </motion.div>
  );
};

export default StatusStrip;
