import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Clock, Sparkles } from "lucide-react";

interface BriefingLine {
  icon: React.ElementType;
  type: "risk" | "opportunity" | "approval" | "strategy";
  text: string;
}

const lines: BriefingLine[] = [
  { icon: AlertTriangle, type: "risk", text: "Stok tükenme riski 3 SKU'da $120K gelir tehdidi." },
  { icon: AlertTriangle, type: "risk", text: "Kanal konsantrasyonu %58 — çeşitlendirme kritik." },
  { icon: Lightbulb, type: "opportunity", text: "Google Ads ROAS artış trendinde — bütçe kaydırma fırsatı." },
  { icon: Lightbulb, type: "opportunity", text: "Premium segment talebi beklenenin üzerinde." },
  { icon: Clock, type: "approval", text: "Q2 bütçe artışı ve nakit rezerv politikası onay bekliyor." },
  { icon: Sparkles, type: "strategy", text: "Tedarikçi geçişi ile yıllık ₺240K tasarruf sağlanabilir." },
];

const typeColors: Record<string, string> = {
  risk: "#EF4444",
  opportunity: "#16C784",
  approval: "#F59E0B",
  strategy: "#1E6BFF",
};

const AIBriefingPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.18 }}
  >
    <div
      className="p-4"
      style={{
        background: "linear-gradient(135deg, rgba(30,107,255,0.04) 0%, rgba(0,0,0,0.35) 100%)",
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(30,107,255,0.12)",
        borderRadius: "var(--radius-card, 16px)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <h3 className="text-[0.75rem] font-semibold text-foreground">Günlük Yönetici Brifing</h3>
      </div>

      <div className="space-y-0">
        {lines.map((line, i) => {
          const color = typeColors[line.type];
          return (
            <div key={i} className="flex items-start gap-2.5 py-1.5 relative">
              <div className="absolute left-0 top-2 bottom-2 w-[1.5px] rounded-full" style={{ background: color, opacity: 0.4 }} />
              <line.icon className="h-3 w-3 mt-0.5 shrink-0 ml-2.5" style={{ color }} />
              <p className="text-[0.65rem] text-foreground/80 leading-relaxed">{line.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 flex items-center gap-1.5" style={{ borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[0.5rem] text-muted-foreground/40">Bugün 09:00 · Güven: %92 · 14 veri noktası</span>
      </div>
    </div>
  </motion.div>
);

export default AIBriefingPanel;
