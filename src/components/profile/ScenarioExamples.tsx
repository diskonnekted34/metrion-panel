import { motion } from "framer-motion";
import { Zap, ArrowRight, AlertTriangle } from "lucide-react";
import { agentScenarios } from "@/data/agentScenarios";

interface ScenarioExamplesProps {
  agentId: string;
}

const ScenarioExamples = ({ agentId }: ScenarioExamplesProps) => {
  const scenarios = agentScenarios[agentId] || [];
  if (scenarios.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        Gerçek Senaryo Örnekleri
      </h2>
      <div className="space-y-3">
        {scenarios.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 + i * 0.05 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              {s.title}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tetikleyici</p>
                <p className="text-xs text-foreground/80">{s.trigger}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowRight className="h-2.5 w-2.5" /> Ajan Yanıtı
                </p>
                <p className="text-xs text-foreground/80">{s.response}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">Sonuç</p>
                <p className="text-xs text-foreground/80">{s.outcome}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ScenarioExamples;
