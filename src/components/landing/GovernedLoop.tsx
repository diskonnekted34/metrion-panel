import { motion } from "framer-motion";

const nodes = ["Signal", "Insight", "Decision", "Approval", "Action", "KPI", "Report", "Archive"];
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const GovernedLoop = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-foreground mb-4"
        >
          The Governed Operating Loop
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="text-muted-foreground text-lg mb-16 max-w-xl mx-auto"
        >
          A structured decision engine — not another dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-0 mb-12"
        >
          {nodes.map((node, i) => (
            <div key={node} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, hsl(220 100% 59% / 0.3), hsl(270 70% 50% / 0.2))" }} />
                <div className="relative px-4 py-2.5 rounded-xl landing-glass-card text-sm font-medium text-foreground hover:text-primary transition-colors cursor-default">
                  {node}
                </div>
              </motion.div>
              {i < nodes.length - 1 && (
                <div className="hidden md:block w-8 h-px bg-gradient-to-r from-primary/30 to-primary/10 mx-1" />
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="text-sm text-muted-foreground/60 max-w-lg mx-auto"
        >
          Every decision becomes measurable, approved, executed, audited, and archived.
        </motion.p>
      </div>
    </section>
  );
};

export default GovernedLoop;
