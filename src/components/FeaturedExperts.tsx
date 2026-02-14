import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { executives } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturedExperts = () => {
  const { t } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="experts" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.marketplace.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t.marketplace.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-mint-500 bg-mint-200/20 px-4 py-2 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.marketplace.banner}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executives.map((exec, i) => (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              onMouseEnter={() => setHoveredId(exec.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link to={`/expert/${exec.id}`} className="block glass-card p-6 h-full group">
                <div className="flex items-start gap-4 mb-4">
                  <img src={exec.avatar} alt={exec.name} className="h-14 w-14 rounded-[18px] object-cover ring-2 ring-border" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-foreground text-sm">{exec.role}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[10px] ${
                        exec.badge === "C-Level" ? "bg-mint-200/30 text-mint-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {exec.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{exec.name}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exec.tagline}</p>

                <div className="space-y-1.5 mb-4">
                  {exec.outputs.slice(0, 2).map((output) => (
                    <div key={output} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-mint-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{output}</span>
                    </div>
                  ))}
                </div>

                {/* Hover expand: example output */}
                <motion.div
                  initial={false}
                  animate={{ height: hoveredId === exec.id ? "auto" : 0, opacity: hoveredId === exec.id ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-[14px] bg-muted/50 mb-4">
                    <p className="text-[11px] text-muted-foreground italic">"{exec.outputs[2] || exec.tagline}"</p>
                  </div>
                </motion.div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{exec.performanceScore}%</span>
                    <span className="text-xs text-muted-foreground">performance</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-[10px] bg-mint-200/20 text-mint-500">
                    KPI: {exec.kpis[0]}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-mint-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.marketplace.viewRole} <ArrowRight className="h-3.5 w-3.5" />
                </div>

                {exec.id === "legal" && (
                  <p className="mt-3 text-[10px] text-muted-foreground italic">{t.marketplace.legalDisclaimer}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;
