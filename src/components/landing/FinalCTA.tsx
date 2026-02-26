import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-32 md:py-40 px-6 relative overflow-hidden">
      {/* Large ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[200px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(ellipse, hsl(220 100% 59% / 0.3), hsl(270 70% 50% / 0.15), transparent 60%)" }} />

      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-foreground mb-5"
        >
          Run your company like a system.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-lg text-muted-foreground mb-10"
        >
          Executive governance, structured decisions, measurable impact.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/pricing"
            className="landing-btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold"
          >
            Get a Demo <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#"
            className="landing-btn-secondary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            View Sample Report (PDF)
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
