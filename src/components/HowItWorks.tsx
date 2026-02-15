import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Layers, Brain, Shield } from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    { 
      icon: Layers, 
      title: "Departman Bazlı AI İş Gücü", 
      desc: "Sabit departmanlar altında rol eğitimli AI ajanlarını aktifleştirin. Her ajan, belirli bir yönetici fonksiyonu için eğitilmiştir ve gerçek iş verilerinizi anlayarak çalışır.", 
      num: "01" 
    },
    { 
      icon: Brain, 
      title: "Sürekli Güncellenen Yapılandırılmış Çıktılar", 
      desc: "Her ajan, sürekli rafine edilen istihbaratla yapılandırılmış brifingler, proaktif uyarılar ve performans içgörüleri üretir. Tahminler, risk modelleri ve karar altyapısı sürekli gelişir.", 
      num: "02" 
    },
    { 
      icon: Shield, 
      title: "Kontrollü Otomasyon ile Yürütme", 
      desc: "Tüm eylemler taslak olarak oluşturulur, risk motoru tarafından değerlendirilir ve onay sürecinden geçer. Kör otomasyon değil — kontrollü otomasyon.", 
      num: "03" 
    },
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

  const previewIcons = [Layers, Brain, Shield];

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
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Stratejik Karar Altyapısı</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nasıl Çalışır</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-2">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                    activeStep === i
                      ? "glass-bento border-primary/15"
                      : "bg-transparent hover:bg-secondary"
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${
                      activeStep === i ? "text-primary" : "text-white/[0.1]"
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className={`text-sm leading-relaxed transition-all duration-500 ${
                        activeStep === i ? "text-muted-foreground max-h-24 opacity-100" : "text-muted-foreground/40 max-h-0 opacity-0 overflow-hidden"
                      }`}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

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
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Adım {step.num}</p>
                          <p className="text-lg font-semibold text-foreground">{step.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

                      <div className="mt-6 space-y-3">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="h-3 rounded-full bg-secondary" style={{ width: `${90 - j * 15}%` }} />
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
