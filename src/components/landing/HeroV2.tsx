import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const HeroV2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Ambient glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[180px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse, hsl(220 100% 59% / 0.25), hsl(270 80% 50% / 0.1), transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.95] mb-6 text-foreground">
          Executive Control.
          <br />
          <span className="landing-gradient-text">Governed Decisions.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Manage the full decision lifecycle — from insight to approval to action to institutional memory — inside a single executive command system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link
            to="/pricing"
            className="landing-btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold"
          >
            Get a Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#"
            className="landing-btn-secondary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            View Sample Report (PDF)
          </a>
        </div>
      </motion.div>

      {/* Command Center Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, perspective: 1200 }}
        className="relative w-full max-w-5xl mx-auto z-10"
      >
        {/* Glow behind mockup */}
        <div className="absolute -inset-8 rounded-3xl blur-[60px] pointer-events-none opacity-40"
          style={{ background: "radial-gradient(ellipse, hsl(220 100% 59% / 0.2), hsl(270 70% 50% / 0.08), transparent 70%)" }} />

        <div className="landing-glass-panel rounded-2xl p-1 relative">
          <div className="rounded-xl bg-[#0a0a0f] p-6 md:p-8 min-h-[320px] md:min-h-[420px]">
            {/* Fake top bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/5 text-[10px] text-muted-foreground/50 font-mono">
                  command-center.metrion.app
                </div>
              </div>
            </div>

            {/* Fake dashboard grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {["Decisions Active", "Pending Approvals", "Risk Score", "KPI Coverage"].map((label, i) => (
                <div key={label} className="landing-glass-card rounded-lg p-3">
                  <p className="text-[9px] text-muted-foreground/50 mb-1">{label}</p>
                  <p className="text-lg font-bold text-foreground">{["12", "4", "72", "89%"][i]}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 landing-glass-card rounded-lg p-4 min-h-[160px]">
                <p className="text-[10px] text-muted-foreground/50 mb-3">Decision Pipeline</p>
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.6 }}
                      className="flex-1 rounded-sm"
                      style={{ background: `linear-gradient(to top, hsl(220 100% 59% / 0.6), hsl(270 70% 50% / 0.3))` }}
                    />
                  ))}
                </div>
              </div>
              <div className="landing-glass-card rounded-lg p-4">
                <p className="text-[10px] text-muted-foreground/50 mb-3">Governance Status</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Policy Compliance", val: "98%" },
                    { label: "Audit Coverage", val: "100%" },
                    { label: "Approval SLA", val: "4.2h" },
                    { label: "Active Agents", val: "6" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-[9px] text-muted-foreground/40">{item.label}</span>
                      <span className="text-[11px] font-semibold text-foreground">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroV2;
