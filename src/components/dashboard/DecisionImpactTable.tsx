import { useState, useId } from "react";
import { motion } from "framer-motion";
import { GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DecisionImpact {
  id: string;
  title: string;
  date: string;
  linkedActions: number;
  kpiBefore: string;
  kpiAfter: string;
  kpiDelta: string;
  confidence: number;
  status: "Planlandı" | "Uygulandı" | "İzlemede";
  owner: string;
  sparkData: number[];
}

const decisions: DecisionImpact[] = [
  {
    id: "d1", title: "Premium Fiyatlama Katmanı", date: "2026-01-18",
    linkedActions: 4, kpiBefore: "ARPU ₺120", kpiAfter: "ARPU ₺142", kpiDelta: "+18.3%",
    confidence: 73, status: "İzlemede", owner: "CMO",
    sparkData: [120, 125, 128, 132, 136, 140, 142],
  },
  {
    id: "d2", title: "K8s Cluster Ölçeklendirme", date: "2026-02-16",
    linkedActions: 2, kpiBefore: "Uptime %99.95", kpiAfter: "%99.98", kpiDelta: "+0.03pp",
    confidence: 79, status: "Uygulandı", owner: "CTO",
    sparkData: [99.94, 99.95, 99.96, 99.96, 99.97, 99.98, 99.98],
  },
  {
    id: "d3", title: "Müşteri Sadakat Programı", date: "2026-02-07",
    linkedActions: 3, kpiBefore: "Churn %5.2", kpiAfter: "%4.8", kpiDelta: "-0.4pp",
    confidence: 75, status: "İzlemede", owner: "CMO",
    sparkData: [5.2, 5.15, 5.1, 5.0, 4.95, 4.85, 4.8],
  },
  {
    id: "d4", title: "Tedarikçi Değişikliği", date: "2026-01-25",
    linkedActions: 2, kpiBefore: "COGS %58", kpiAfter: "%55.5", kpiDelta: "-2.5pp",
    confidence: 82, status: "Uygulandı", owner: "COO",
    sparkData: [58, 57.5, 57, 56.5, 56, 55.8, 55.5],
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  "Planlandı": { bg: "rgba(30,107,255,0.12)", text: "#1E90FF" },
  "Uygulandı": { bg: "rgba(22,199,132,0.12)", text: "#16C784" },
  "İzlemede": { bg: "rgba(245,158,11,0.12)", text: "#F59E0B" },
};

const MiniImpactChart = ({ data, uniqueId }: { data: number[]; uniqueId: string }) => {
  const h = 24, w = 60;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke="#1E90FF" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
};

const DecisionImpactTable = () => {
  const navigate = useNavigate();
  const chartId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary/60" />
          <h2 className="text-lg font-semibold text-foreground">Karar → Etki Takibi</h2>
        </div>
        <button
          onClick={() => navigate("/decision-lab")}
          className="text-[0.65rem] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
        >
          Tüm Kararlar <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-hidden glass-card" style={{ padding: 0 }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[0.6rem] font-semibold text-muted-foreground/50 uppercase tracking-wider border-b border-black">
          <div className="col-span-3">Karar</div>
          <div className="col-span-2">KPI Etki</div>
          <div className="col-span-1">Δ</div>
          <div className="col-span-1">Güven</div>
          <div className="col-span-2">Durum</div>
          <div className="col-span-1">Sahip</div>
          <div className="col-span-1">Trend</div>
          <div className="col-span-1">Aksiyon</div>
        </div>

        {decisions.map((d) => {
          const sc = statusColors[d.status];
          return (
            <button
              key={d.id}
              onClick={() => navigate("/decision-lab")}
              className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-left hover:bg-secondary/30 transition-colors items-center group border-b border-black"
            >
              <div className="col-span-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-success/50 shrink-0" />
                  <span className="text-[0.72rem] font-medium text-foreground truncate">{d.title}</span>
                </div>
                <span className="text-[0.5rem] text-muted-foreground/30 ml-4.5">
                  {new Date(d.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="col-span-2 text-[0.65rem] text-muted-foreground/60">
                {d.kpiBefore} → {d.kpiAfter.split(" ").pop()}
              </div>
              <div className="col-span-1">
                <span className="text-[0.65rem] font-bold text-success">{d.kpiDelta}</span>
              </div>
              <div className="col-span-1">
                <span
                  className="text-[0.6rem] font-bold px-1.5 py-0.5"
                  style={{
                    background: d.confidence >= 75 ? "rgba(22,199,132,0.12)" : "rgba(245,158,11,0.12)",
                    color: d.confidence >= 75 ? "#16C784" : "#F59E0B",
                    borderRadius: "var(--radius-pill, 999px)",
                  }}
                >
                  %{d.confidence}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className="text-[0.6rem] font-semibold px-2 py-0.5"
                  style={{ background: sc.bg, color: sc.text, borderRadius: "var(--radius-pill, 999px)" }}
                >
                  {d.status}
                </span>
              </div>
              <div className="col-span-1 text-[0.65rem] text-muted-foreground/50">{d.owner}</div>
              <div className="col-span-1">
                <MiniImpactChart data={d.sparkData} uniqueId={`${chartId}-${d.id}`} />
              </div>
              <div className="col-span-1">
                <span className="text-[0.6rem] text-primary/60 group-hover:text-primary transition-colors">{d.linkedActions} bağlı</span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DecisionImpactTable;
