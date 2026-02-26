import { motion } from "framer-motion";
import { Radar, TrendingDown, BarChart3, Cpu } from "lucide-react";

const bullets = [
  { icon: Radar, text: "Cross-department anomaly detection" },
  { icon: TrendingDown, text: "Strategic drift monitoring" },
  { icon: BarChart3, text: "KPI deviation tracking" },
  { icon: Cpu, text: "AI-assisted early warnings" },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const RiskRadarSection = () => {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }} className="order-2 lg:order-1">
            <div className="landing-glass-panel rounded-2xl p-1">
              <div className="rounded-xl bg-[#0a0a0f] p-6 min-h-[320px]">
                <p className="text-[10px] text-muted-foreground/40 mb-4 uppercase tracking-wider">Risk Radar</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Financial Risk", score: 72, color: "hsl(36 100% 56%)" },
                    { label: "Operational Risk", score: 45, color: "hsl(160 100% 57%)" },
                    { label: "Strategic Drift", score: 68, color: "hsl(0 100% 61%)" },
                    { label: "Compliance", score: 23, color: "hsl(160 100% 57%)" },
                  ].map(item => (
                    <div key={item.label} className="landing-glass-card rounded-lg p-4">
                      <p className="text-[9px] text-muted-foreground/40 mb-2">{item.label}</p>
                      <p className="text-2xl font-bold mb-2" style={{ color: item.color }}>{item.score}</p>
                      <div className="h-1 rounded-full bg-white/[0.06]">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.score}%` }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }} className="h-full rounded-full" style={{ background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease }} className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-foreground mb-3">Risk Radar</h2>
            <p className="text-muted-foreground text-lg mb-8">Detect structural risks before they become operational incidents.</p>
            <div className="space-y-4">
              {bullets.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div key={b.text} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                    <span className="text-sm text-foreground/80">{b.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RiskRadarSection;
