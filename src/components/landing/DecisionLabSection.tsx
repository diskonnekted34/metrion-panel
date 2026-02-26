import { motion } from "framer-motion";
import { Target, AlertTriangle, Layers, GitBranch } from "lucide-react";

const bullets = [
  { icon: Target, text: "Impact scoring engine" },
  { icon: AlertTriangle, text: "Risk breakdown & scenario inputs" },
  { icon: Layers, text: "Structured assumptions" },
  { icon: GitBranch, text: "Multi-step approval routing" },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const DecisionLabSection = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-foreground mb-3">Decision Lab</h2>
            <p className="text-muted-foreground text-lg mb-8">Create decisions with quantified impact and explicit risk.</p>
            <div className="space-y-4">
              {bullets.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div key={b.text} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                    <span className="text-sm text-foreground/80">{b.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.2, ease }}>
            <div className="landing-glass-panel rounded-2xl p-1">
              <div className="rounded-xl bg-[#0a0a0f] p-6 min-h-[320px]">
                <p className="text-[10px] text-muted-foreground/40 mb-4 uppercase tracking-wider">Decision Lab</p>
                <div className="space-y-3">
                  {[
                    { name: "Q3 Market Expansion", status: "Draft", statusColor: "bg-primary/15 text-primary", impact: "8.4", risk: "6.1", riskColor: "text-destructive", conf: "74%" },
                    { name: "Vendor Consolidation", status: "Review", statusColor: "bg-warning/15 text-warning", impact: "6.8", risk: "3.2", riskColor: "text-foreground", conf: "89%" },
                  ].map(d => (
                    <div key={d.name} className="landing-glass-card rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-foreground font-medium">{d.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.statusColor}`}>{d.status}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div><p className="text-[9px] text-muted-foreground/40">Impact</p><p className="text-sm font-bold text-foreground">{d.impact}</p></div>
                        <div><p className="text-[9px] text-muted-foreground/40">Risk</p><p className={`text-sm font-bold ${d.riskColor}`}>{d.risk}</p></div>
                        <div><p className="text-[9px] text-muted-foreground/40">Confidence</p><p className="text-sm font-bold text-foreground">{d.conf}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DecisionLabSection;
