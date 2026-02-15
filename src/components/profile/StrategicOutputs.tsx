import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Executive } from "@/data/experts";

interface StrategicOutputsProps {
  agent: Executive;
}

const StrategicOutputs = ({ agent }: StrategicOutputsProps) => {
  const reports = agent.reports || agent.outputs;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Üretebildiği Raporlar
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reports.map((report, i) => (
          <motion.div
            key={report}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.17 + i * 0.04 }}
            className="glass-bento p-5 group cursor-pointer hover:border-primary/20 transition-all"
          >
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{report}</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Otomatik üretim ve periyodik teslimat</p>
            <span className="text-[9px] text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Rapor Önizle <ArrowRight className="h-2.5 w-2.5" />
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default StrategicOutputs;
