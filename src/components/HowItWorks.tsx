import { motion } from "framer-motion";
import { Database, Brain, CheckSquare } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Database, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, num: "01" },
    { icon: Brain, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, num: "02" },
    { icon: CheckSquare, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, num: "03" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.howItWorks.title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="text-4xl font-bold text-primary/20 mb-4">{step.num}</div>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
