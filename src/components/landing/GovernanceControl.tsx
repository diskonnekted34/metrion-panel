import { motion } from "framer-motion";
import { ShieldCheck, GitPullRequest, ScrollText, EyeOff } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Policy-driven authorization", desc: "Every action passes through configurable policy gates." },
  { icon: GitPullRequest, title: "Conditional approval workflows", desc: "Multi-level routing based on risk, impact, and role." },
  { icon: ScrollText, title: "Immutable audit logs", desc: "Full traceability of every decision, action, and override." },
  { icon: EyeOff, title: "Sensitive data redaction & isolation", desc: "Automatic classification and controlled exposure of sensitive fields." },
];

const GovernanceControl = () => {
  return (
    <section className="py-28 md:py-36 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, hsl(220 100% 59% / 0.3), hsl(270 70% 50% / 0.15), transparent 70%)" }} />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-foreground mb-16 text-center"
        >
          Governance is not optional.
        </motion.h2>

        <div className="space-y-0">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex items-start gap-5 py-7 border-b border-white/[0.06] last:border-0"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GovernanceControl;
