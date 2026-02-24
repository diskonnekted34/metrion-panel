import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface ScoreDriver {
  label: string;
  positive: boolean;
  detail: string;
}

interface HealthComponent {
  label: string;
  weight: string;
  score: number;
  tint: string;
}

const positiveDrivers: ScoreDriver[] = [
  { label: "Katkı marjı iyileşiyor", positive: true, detail: "+1.3pp son 30 gün" },
  { label: "Reklam verimliliği artıyor", positive: true, detail: "ROAS 3.2 → 3.8" },
  { label: "Nakit varyansı planın üzerinde", positive: true, detail: "+$45K hedef üstü" },
];

const negativeDrivers: ScoreDriver[] = [
  { label: "Ops backlog artışta", positive: false, detail: "3 kritik görev bloke" },
  { label: "Tedarik zinciri gecikmesi", positive: false, detail: "Ortalama +2.3 gün" },
  { label: "Kanal konsantrasyonu yüksek", positive: false, detail: "%58 tek kanala bağlı" },
];

const healthComponents: HealthComponent[] = [
  { label: "Finansal", weight: "35%", score: 82, tint: "30,144,255" },
  { label: "Büyüme", weight: "25%", score: 74, tint: "22,199,132" },
  { label: "Operasyonel", weight: "20%", score: 71, tint: "245,158,11" },
  { label: "Teknoloji", weight: "20%", score: 85, tint: "0,229,255" },
];

const ExecutiveHealth = () => {
  const [expanded, setExpanded] = useState(false);
  const score = 78;
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dashLen = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="glass-card p-5">
        {/* Score + Drivers Row */}
        <div className="flex items-start gap-5">
          {/* Radial gauge */}
          <div className="flex flex-col items-center shrink-0">
            <p className="text-[0.6rem] font-semibold text-muted-foreground tracking-[0.12em] uppercase mb-3">Sağlık Skoru</p>
            <div className="relative">
              <svg width={124} height={124} className="-rotate-90">
                <circle cx={62} cy={62} r={r} fill="none" stroke="#111" strokeWidth="8" />
                <circle
                  cx={62} cy={62} r={r} fill="none"
                  stroke="url(#healthGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                >
                  <animate attributeName="stroke-dashoffset" from={circumference.toString()} to="0" dur="1s" fill="freeze" />
                </circle>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1E90FF" />
                    <stop offset="100%" stopColor="#00E0FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[2.2rem] font-bold text-foreground leading-none" style={{ letterSpacing: "-0.03em" }}>{score}</span>
                <span className="text-[0.55rem] text-muted-foreground mt-0.5">/ 100</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-[0.65rem] font-semibold text-success">+3.2%</span>
            </div>
          </div>

          {/* Score Drivers */}
          <div className="flex-1 min-w-0">
            <p className="text-[0.65rem] font-semibold text-muted-foreground mb-2">Skor Etkenleri</p>
            <div className="space-y-1.5 mb-3">
              {positiveDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TrendingUp className="h-2.5 w-2.5 text-success shrink-0" />
                  <span className="text-[0.65rem] text-foreground/80">{d.label}</span>
                  <span className="text-[0.55rem] text-muted-foreground/50 ml-auto">{d.detail}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {negativeDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TrendingDown className="h-2.5 w-2.5 text-destructive shrink-0" />
                  <span className="text-[0.65rem] text-foreground/80">{d.label}</span>
                  <span className="text-[0.55rem] text-muted-foreground/50 ml-auto">{d.detail}</span>
                </div>
              ))}
            </div>

            {/* Simulation hint */}
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/5 rounded-xl">
              <Sparkles className="h-3 w-3 text-primary/60 shrink-0" />
              <span className="text-[0.6rem] text-primary/70">
                Bütçe X onaylanırsa → tahmini +3 sağlık skoru
              </span>
            </div>
          </div>
        </div>

        {/* Expand breakdown */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 mt-4 pt-3 text-[0.6rem] font-medium text-muted-foreground/60 hover:text-foreground transition-colors border-t border-border/30"
        >
          {expanded ? "Detayları Gizle" : "Ağırlıklı Bileşenleri Göster"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2.5">
                {healthComponents.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="text-[0.65rem] text-foreground/70 w-20">{c.label}</span>
                    <span className="text-[0.55rem] text-muted-foreground/50 w-8">{c.weight}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${c.score}%`,
                          background: `rgb(${c.tint})`,
                          boxShadow: `0 0 6px rgba(${c.tint},0.3)`,
                        }}
                      />
                    </div>
                    <span className="text-[0.7rem] font-semibold text-foreground w-8 text-right">{c.score}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExecutiveHealth;
