import { motion } from "framer-motion";
import { categories } from "@/data/experts";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Scale, TrendingUp, DollarSign, Building,
  Layers, Brain, Settings, BarChart3, Pen,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Scale, TrendingUp, DollarSign, Building,
  Layers, Brain, Settings, BarChart3, Pen,
};

const Categories = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t.categories.subtitle}
          </p>
        </motion.div>

        {/* Creative horizontal scrolling ribbon layout */}
        <div className="relative">
          {/* Top row - flows left */}
          <div className="flex gap-4 mb-4 overflow-hidden">
            {categories.slice(0, 5).map((cat, i) => {
              const Icon = iconMap[cat.icon] || Layers;
              const catName = t.categoryNames[cat.name as keyof typeof t.categoryNames] || cat.name;
              const catDesc = t.categoryDescriptions[cat.name as keyof typeof t.categoryDescriptions] || cat.description;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group cursor-pointer flex-shrink-0"
                >
                  <div className="relative glass-card px-6 py-5 flex items-center gap-4 min-w-[260px] overflow-hidden">
                    {/* Accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                    <div className="rounded-lg bg-primary/10 p-2.5 transition-all group-hover:bg-primary/20 group-hover:scale-110 duration-300">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-foreground text-sm">{catName}</h3>
                        <span className="text-[10px] text-muted-foreground ml-2 tabular-nums">{cat.count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{catDesc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom row - offset, flows right */}
          <div className="flex gap-4 pl-16 overflow-hidden">
            {categories.slice(5).map((cat, i) => {
              const Icon = iconMap[cat.icon] || Layers;
              const catName = t.categoryNames[cat.name as keyof typeof t.categoryNames] || cat.name;
              const catDesc = t.categoryDescriptions[cat.name as keyof typeof t.categoryDescriptions] || cat.description;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="group cursor-pointer flex-shrink-0"
                >
                  <div className="relative glass-card px-6 py-5 flex items-center gap-4 min-w-[260px] overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                    <div className="rounded-lg bg-primary/10 p-2.5 transition-all group-hover:bg-primary/20 group-hover:scale-110 duration-300">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-foreground text-sm">{catName}</h3>
                        <span className="text-[10px] text-muted-foreground ml-2 tabular-nums">{cat.count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{catDesc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
