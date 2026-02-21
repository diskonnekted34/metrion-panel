import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DecisionImpactItem {
  id: string;
  title: string;
  date: string;
  linkedActions: number;
  kpiBefore: string;
  kpiAfter: string;
  roiEstimate: string;
  roiActual: string;
  confidence: number;
}

const recentDecisions: DecisionImpactItem[] = [
  {
    id: "dec-6",
    title: "Premium Fiyatlama Katmanı Oluştur",
    date: "2026-01-18",
    linkedActions: 4,
    kpiBefore: "ARPU: ₺120",
    kpiAfter: "ARPU: ₺142",
    roiEstimate: "₺1.8M/yıl",
    roiActual: "₺1.32M/yıl",
    confidence: 73,
  },
  {
    id: "dec-3",
    title: "Kubernetes Cluster Ölçeklendirme",
    date: "2026-02-16",
    linkedActions: 2,
    kpiBefore: "Uptime: %99.95",
    kpiAfter: "Uptime: %99.98",
    roiEstimate: "$120K kayıp önleme",
    roiActual: "$95K kayıp önlendi",
    confidence: 79,
  },
  {
    id: "dec-8",
    title: "Müşteri Sadakat Programı Lansman",
    date: "2026-02-07",
    linkedActions: 3,
    kpiBefore: "Churn: %5.2",
    kpiAfter: "Churn: %4.8 (devam ediyor)",
    roiEstimate: "₺960K/yıl",
    roiActual: "₺720K/yıl (tahmini)",
    confidence: 75,
  },
];

const DecisionImpact = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary/60" />
          <h2 className="text-[0.85rem] font-semibold text-foreground">Karar → Etki Takibi</h2>
        </div>
        <button
          onClick={() => navigate("/decision-lab")}
          className="text-[0.6rem] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
        >
          Tüm Kararlar <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      <div
        className="overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.35) 100%)",
          backdropFilter: "blur(14px)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-card, 16px)",
        }}
      >
        {recentDecisions.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 + i * 0.04 }}
            onClick={() => navigate("/decision-lab")}
            className="w-full text-left px-4 py-3.5 hover:bg-white/[0.02] transition-colors relative group"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-success/60 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[0.75rem] font-semibold text-foreground truncate">{d.title}</p>
                  <span className="text-[0.5rem] text-muted-foreground/40 shrink-0">
                    {new Date(d.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-[0.6rem]">
                  <div>
                    <span className="text-muted-foreground/40">Aksiyonlar</span>
                    <p className="text-foreground/70">{d.linkedActions} bağlı</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground/40">KPI</span>
                    <p className="text-foreground/70">{d.kpiBefore} → {d.kpiAfter.split(":")[1]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground/40">ROI</span>
                    <p className="text-foreground/70">{d.roiActual}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground/40">Güven</span>
                    <p className={`font-medium ${d.confidence >= 75 ? "text-success" : "text-warning"}`}>{d.confidence}%</p>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1 shrink-0" />
            </div>
            {i < recentDecisions.length - 1 && (
              <div className="absolute bottom-0 left-4 right-4 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)" }} />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DecisionImpact;
