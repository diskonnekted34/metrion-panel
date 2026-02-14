import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Settings, Cpu, Shield, Brain } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const PainPoints = () => {
  const { t } = useLanguage();

  const groups = [
    { icon: TrendingUp, title: t.painPoints.growth, items: t.painPoints.growthItems },
    { icon: DollarSign, title: t.painPoints.profitability, items: t.painPoints.profitabilityItems },
    { icon: Settings, title: t.painPoints.operations, items: t.painPoints.operationsItems },
    { icon: Cpu, title: t.painPoints.technology, items: t.painPoints.technologyItems },
    { icon: Shield, title: t.painPoints.risk, items: t.painPoints.riskItems },
    { icon: Brain, title: t.painPoints.overload, items: t.painPoints.overloadItems },
  ];

  return (
    <section className="py-24 px-6 gradient-bg">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.painPoints.title}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t.painPoints.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <group.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{group.title}</h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
