import { motion } from "framer-motion";
import { ArrowRight, Shield, Brain, Building2, Zap } from "lucide-react";
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

const riskIndicator: Record<string, { color: string; label: string }> = {
  critical: { color: "#EF4444", label: "Kritik" },
  warning: { color: "#F59E0B", label: "Uyarı" },
  info: { color: "#1E6BFF", label: "Bilgi" },
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
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Intervention Panel — structured list */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-3"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[0.85rem] font-semibold text-foreground">Öncelikli Müdahale Alanları</h2>
            <p className="text-[0.6rem] text-muted-foreground/60 mt-0.5">Sistem ve AI tarafından tespit edilen kritik konular.</p>
          </div>
          <Shield className="h-3.5 w-3.5 text-muted-foreground/30" />
        </div>

        <div
          style={{
            background: "rgba(8,8,8,0.5)",
            backdropFilter: "blur(20px)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: "0.9rem",
          }}
        >
          {interventions.map((item, i) => {
            const rc = riskIndicator[item.risk];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.06 }}
                className="flex items-start gap-3 px-4 py-3.5 relative"
              >
                {/* Risk vertical bar */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                  style={{ background: rc.color, boxShadow: `0 0 6px ${rc.color}40` }}
                />
                <div className="flex-1 min-w-0 pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded ${item.type === "AI" ? "bg-primary/12 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {item.type}
                    </span>
                    <span className="text-[0.55rem] font-medium" style={{ color: rc.color }}>{rc.label}</span>
                  </div>
                  <p className="text-[0.8rem] font-semibold text-foreground mb-0.5">{item.title}</p>
                  <p className="text-[0.6rem] text-muted-foreground">
                    KPI: <span className="text-foreground/70 font-medium">{item.kpi}</span> · {item.suggestion}
                  </p>
                  <button
                    onClick={() => navigate("/decision-lab")}
                    className="flex items-center gap-1 mt-1.5 text-[0.6rem] font-medium text-primary/80 hover:text-primary transition-colors"
                  >
                    Karara Git <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
                {/* Separator line */}
                {i < interventions.length - 1 && (
                  <div className="absolute bottom-0 left-4 right-4 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }} />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Department Performance — compact */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[0.85rem] font-semibold text-foreground">Departman Performansı</h2>
          <button
            onClick={() => navigate("/organization")}
            className="text-[0.6rem] text-primary/70 hover:text-primary transition-colors"
          >
            Tümü
          </button>
        </div>

        <div className="space-y-1.5">
          {departments.map((dept, i) => {
            const rb = deptRiskBadge[dept.risk];
            return (
              <motion.button
                key={dept.name}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.03 }}
                onClick={() => navigate("/organization")}
                className="w-full text-left group hover:-translate-y-px transition-all duration-200 px-3.5 py-2.5"
                style={{
                  background: "rgba(8,8,8,0.45)",
                  backdropFilter: "blur(16px)",
                  border: "0.5px solid rgba(255,255,255,0.05)",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[0.75rem] font-semibold text-foreground">{dept.name}</span>
                      <span className={`text-[0.5rem] font-medium px-1.5 py-0.5 rounded-full ${rb.cls}`}>{rb.label}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[0.55rem] text-muted-foreground">
                      <span className="flex items-center gap-1">{occupantIcon(dept.type)} {dept.cLevel}</span>
                      <span>{dept.okrs} OKR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-bold ${dept.score >= 80 ? "text-success" : dept.score >= 70 ? "text-primary" : "text-warning"}`}>
                      {dept.score}
                    </span>
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
