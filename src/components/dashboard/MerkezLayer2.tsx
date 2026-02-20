import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, Zap, Brain, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Intervention Items ── */
interface Intervention {
  type: "AI" | "Sistem";
  title: string;
  kpi: string;
  risk: "critical" | "warning" | "info";
  suggestion: string;
}

const interventions: Intervention[] = [
  {
    type: "AI",
    title: "3 SKU'da stok tükenme riski %85'i aştı",
    kpi: "Envanter Devir Hızı",
    risk: "critical",
    suggestion: "Acil sipariş tetiklenmeli — tahmini kayıp $120K.",
  },
  {
    type: "Sistem",
    title: "Meta Ads ROAS son 7 günde %18 düştü",
    kpi: "Pazarlama ROAS",
    risk: "warning",
    suggestion: "Bütçe yeniden dağıtımı değerlendirilmeli.",
  },
  {
    type: "AI",
    title: "Kanal konsantrasyonu gelirin %58'ine ulaştı",
    kpi: "Gelir Çeşitliliği",
    risk: "warning",
    suggestion: "Çeşitlendirme stratejisi önerildi.",
  },
];

const riskColors: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  critical: { bg: "bg-destructive/8", text: "text-destructive", dot: "bg-destructive", glow: "0 0 12px rgba(239,68,68,0.25)" },
  warning: { bg: "bg-warning/8", text: "text-warning", dot: "bg-warning", glow: "0 0 10px rgba(245,158,11,0.2)" },
  info: { bg: "bg-primary/8", text: "text-primary", dot: "bg-primary", glow: "0 0 8px rgba(30,107,255,0.2)" },
};

/* ── Department Cards ── */
const departments = [
  { name: "Finans", score: 82, risk: "low" as const, cLevel: "CFO", type: "AI" as const, okrs: 4 },
  { name: "Pazarlama", score: 74, risk: "medium" as const, cLevel: "CMO", type: "Human" as const, okrs: 3 },
  { name: "Operasyon", score: 79, risk: "low" as const, cLevel: "COO", type: "AI" as const, okrs: 5 },
  { name: "Teknoloji", score: 85, risk: "low" as const, cLevel: "CTO", type: "Hybrid" as const, okrs: 3 },
  { name: "Satış", score: 71, risk: "high" as const, cLevel: "CSO", type: "Human" as const, okrs: 2 },
  { name: "Hukuk", score: 88, risk: "low" as const, cLevel: "CLO", type: "AI" as const, okrs: 2 },
];

const deptRiskBadge: Record<string, { cls: string; label: string }> = {
  low: { cls: "badge-success", label: "Düşük" },
  medium: { cls: "badge-warning", label: "Orta" },
  high: { cls: "badge-error", label: "Yüksek" },
};

const occupantIcon = (type: string) => {
  if (type === "AI") return <Brain className="h-3 w-3 text-primary" />;
  if (type === "Hybrid") return <Zap className="h-3 w-3 text-warning" />;
  return <Building2 className="h-3 w-3 text-muted-foreground" />;
};

const MerkezLayer2 = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Intervention Panel — 3 cols */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-3"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Öncelikli Müdahale Alanları</h2>
            <p className="text-[0.65rem] text-muted-foreground/70 mt-0.5">Sistem ve AI tarafından tespit edilen kritik konular.</p>
          </div>
          <Shield className="h-4 w-4 text-muted-foreground/40" />
        </div>

        <div className="space-y-3">
          {interventions.map((item, i) => {
            const rc = riskColors[item.risk];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className={`glass-card p-5 ${item.risk === "critical" ? "animate-[glow-pulse_3s_ease-in-out_1]" : ""}`}
                style={item.risk === "critical" ? { boxShadow: "inset 0 0 40px rgba(239,68,68,0.03)" } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${rc.dot}`} style={{ boxShadow: rc.glow }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${item.type === "AI" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {item.type}
                      </span>
                      <span className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full ${rc.bg} ${rc.text}`}>
                        {item.risk === "critical" ? "Kritik" : item.risk === "warning" ? "Uyarı" : "Bilgi"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-[0.7rem] text-muted-foreground mb-2">
                      KPI: <span className="text-foreground/80 font-medium">{item.kpi}</span> · {item.suggestion}
                    </p>
                    <button
                      onClick={() => navigate("/decision-lab")}
                      className="flex items-center gap-1.5 text-[0.7rem] font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Karara Git <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Department Performance — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Departman Performansı</h2>
          <button
            onClick={() => navigate("/organization")}
            className="text-[0.65rem] text-primary hover:underline"
          >
            Tümü
          </button>
        </div>

        <div className="space-y-2.5">
          {departments.map((dept, i) => {
            const rb = deptRiskBadge[dept.risk];
            return (
              <motion.button
                key={dept.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                onClick={() => navigate("/organization")}
                className="glass-card p-4 w-full text-left group hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{dept.name}</span>
                      <span className={`text-[0.55rem] font-medium px-1.5 py-0.5 rounded-full ${rb.cls}`}>{rb.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.65rem] text-muted-foreground">
                      <span className="flex items-center gap-1">{occupantIcon(dept.type)} {dept.cLevel}</span>
                      <span>{dept.okrs} OKR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${dept.score >= 80 ? "text-success" : dept.score >= 70 ? "text-primary" : "text-warning"}`}>
                      {dept.score}
                    </span>
                    <p className="text-[0.55rem] text-muted-foreground">Skor</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MerkezLayer2;
