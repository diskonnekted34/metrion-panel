import { motion } from "framer-motion";
import { Calendar, Bell, BarChart3, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const TrustStrip = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Calendar, label: t.trustStrip.item1 },
    { icon: Bell, label: t.trustStrip.item2 },
    { icon: BarChart3, label: t.trustStrip.item3 },
    { icon: Zap, label: t.trustStrip.item4 },
    { icon: Shield, label: t.trustStrip.item5 },
  ];

  return (
    <section className="py-12 px-6 border-y border-white/[0.06]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <item.icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStrip;
