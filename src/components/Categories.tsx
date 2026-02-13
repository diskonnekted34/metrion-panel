import { motion } from "framer-motion";
import { categories } from "@/data/experts";
import {
  Scale, TrendingUp, DollarSign, Building,
  Layers, Brain, Settings, BarChart3, Pen,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Scale, TrendingUp, DollarSign, Building,
  Layers, Brain, Settings, BarChart3, Pen,
};

const Categories = () => {
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
            Explore by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find the right AI professional for your specific industry and needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Layers;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-6 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                      <span className="text-xs text-muted-foreground">{cat.count} experts</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
