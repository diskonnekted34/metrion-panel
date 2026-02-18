import { motion } from "framer-motion";
import { toast } from "sonner";
import { Layers, ExternalLink } from "lucide-react";
import { Executive } from "@/data/experts";

interface CompetencyMatrixProps {
  agent: Executive;
}

const CompetencyMatrix = ({ agent }: CompetencyMatrixProps) => {
  const capabilities = agent.capabilities || agent.responsibilities;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        Yetkinlik Matrisi
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.03 }}
            className="glass-card p-4 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">{cap}</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Veri destekli analiz ve sürekli izleme ile operasyonel içgörü üretir.
                </p>
              </div>
              <button onClick={() => toast.info("Örnek görüntüleniyor.")} className="text-[9px] text-primary/60 hover:text-primary flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                <ExternalLink className="h-2.5 w-2.5" />
                Örnek
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CompetencyMatrix;
