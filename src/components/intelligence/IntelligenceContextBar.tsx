import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileDown, Zap, Clock, Brain } from "lucide-react";
import { MetricIntelligence } from "@/data/intelligenceMetrics";
import { toast } from "sonner";

interface Props {
  metric: MetricIntelligence;
  dept: { id: string; name: string; icon: string };
}

const IntelligenceContextBar = ({ metric, dept }: Props) => {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/departments/${dept.id}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Geri
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-lg">{dept.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-foreground truncate">{metric.title}</h1>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                {metric.metricBadge}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3 text-primary" /> {metric.agent}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {metric.lastUpdated}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px]">
                %{metric.dataCompleteness} veri kapsamı
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toast.info("PDF rapor oluşturuluyor…")}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" /> PDF Export
          </button>
          <button
            onClick={() => toast.success("Aksiyon taslağı oluşturuldu.")}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <Zap className="h-3.5 w-3.5" /> Aksiyon Oluştur
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelligenceContextBar;
