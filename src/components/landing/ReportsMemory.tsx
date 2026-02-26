import { motion } from "framer-motion";
import { FileText, Building2, BookOpen } from "lucide-react";

const reports = [
  { icon: FileText, title: "Executive Weekly Brief", desc: "Concise intelligence summary for C-level review." },
  { icon: Building2, title: "Department Intelligence Report", desc: "Deep-dive metrics and risk analysis per department." },
  { icon: BookOpen, title: "Annual Institutional Book", desc: "Permanent record of all decisions, outcomes, and learnings." },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ReportsMemory = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease }} className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-foreground mb-4">
          Reports that become your company's memory.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.1, ease }} className="text-muted-foreground text-lg mb-16 max-w-xl mx-auto">
          Weekly, monthly, quarterly, annual — immutable, searchable, board-ready.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {reports.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease }} className="landing-glass-card rounded-2xl p-7 text-left">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5"><Icon className="h-5 w-5 text-primary" /></div>
                <h3 className="text-base font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease }} className="text-sm text-muted-foreground/50">
          All reports are archived, structured, and permanently accessible.
        </motion.p>
      </div>
    </section>
  );
};

export default ReportsMemory;
