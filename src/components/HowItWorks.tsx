import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Database, Brain, CheckSquare, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    { icon: Database, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, num: "01" },
    { icon: Brain, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, num: "02" },
    { icon: CheckSquare, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, num: "03" },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const step = Math.min(2, Math.floor(progress * 3));
      setActiveStep(step);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const previewIcons = [Database, Brain, CheckSquare];

  return (
    <section ref={sectionRef} className="relative py-0" style={{ minHeight: "200vh" }}>
      <div className="sticky top-0 min-h-screen flex items-center py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.howItWorks.title}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Steps */}
            <div className="space-y-2">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`p-6 rounded-[20px] cursor-pointer transition-all duration-500 ${
                    activeStep === i
                      ? "glass-bento border-mint-300/40"
                      : "bg-transparent hover:bg-white/30"
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${
                      activeStep === i ? "text-mint-400" : "text-border"
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className={`text-sm leading-relaxed transition-all duration-500 ${
                        activeStep === i ? "text-muted-foreground max-h-20 opacity-100" : "text-muted-foreground/60 max-h-0 opacity-0 overflow-hidden"
                      }`}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Preview card */}
            <div className="hidden md:block">
              <div className="glass-bento p-10 relative overflow-hidden" style={{ minHeight: 300 }}>
                {steps.map((step, i) => {
                  const Icon = previewIcons[i];
                  return (
                    <motion.div
                      key={step.num}
                      initial={false}
                      animate={{
                        opacity: activeStep === i ? 1 : 0,
                        y: activeStep === i ? 0 : 20,
                      }}
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      className={`${activeStep === i ? "block" : "hidden"}`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-mint-200/40 to-mint-400/30 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-mint-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {step.num}</p>
                          <p className="text-lg font-semibold text-foreground">{step.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

                      {/* Mock UI elements */}
                      <div className="mt-6 space-y-3">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="h-3 rounded-full bg-muted" style={{ width: `${90 - j * 15}%` }} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
