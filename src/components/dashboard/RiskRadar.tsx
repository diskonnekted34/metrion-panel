import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RiskQuadrant {
  label: string;
  score: number;
  trend: "up" | "down" | "stable";
  rootCause: string;
  tint: string;
}

const quadrants: RiskQuadrant[] = [
  { label: "Finansal Risk", score: 42, trend: "down", rootCause: "Nakit tamponu planın altında — maliyet artışı baskısı.", tint: "245,158,11" },
  { label: "Büyüme Riski", score: 35, trend: "down", rootCause: "Kanal doygunluğu %72'ye ulaştı, çeşitlendirme gerekli.", tint: "30,107,255" },
  { label: "Operasyonel Risk", score: 58, trend: "up", rootCause: "3 SKU stok tükenme eşiğinde — tedarik zinciri gecikmesi.", tint: "239,68,68" },
  { label: "Teknoloji Riski", score: 28, trend: "down", rootCause: "Altyapı kapasitesi artırıldı, uptime hedefine yaklaşıldı.", tint: "0,229,255" },
];

const severityColor = (score: number) => {
  if (score >= 70) return "#EF4444";
  if (score >= 50) return "#F59E0B";
  if (score >= 30) return "#1E6BFF";
  return "#16C784";
};

const RiskRadar = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-warning" />
          <h2 className="text-[0.85rem] font-semibold text-foreground">Risk Radarı</h2>
        </div>
        <button
          onClick={() => navigate("/alerts")}
          className="text-[0.6rem] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
        >
          Detaylı Analiz <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {quadrants.map((q, i) => {
          const sColor = severityColor(q.score);
          return (
            <motion.div
              key={q.label}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 + i * 0.04 }}
              className="group hover:-translate-y-px transition-all duration-200 cursor-pointer p-3.5"
              onClick={() => navigate("/alerts")}
              style={{
                background: `linear-gradient(135deg, rgba(${q.tint},0.04) 0%, rgba(0,0,0,0.35) 100%)`,
                backdropFilter: "blur(14px)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-card, 16px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[0.65rem] font-medium text-muted-foreground">{q.label}</p>
                {q.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-success" />
                )}
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold leading-none" style={{ color: sColor }}>{q.score}</span>
                <span className="text-[0.55rem] text-muted-foreground/50 mb-0.5">/ 100</span>
              </div>

              {/* Mini bar */}
              <div className="w-full h-1.5 rounded-full bg-white/[0.04] mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${q.score}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: sColor, boxShadow: `0 0 8px ${sColor}40` }}
                />
              </div>

              <p className="text-[0.6rem] text-muted-foreground/60 leading-relaxed line-clamp-2">
                {q.rootCause}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskRadar;
