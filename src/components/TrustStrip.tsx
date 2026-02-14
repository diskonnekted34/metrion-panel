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

  const doubled = [...items, ...items];

  return (
    <section className="py-8 px-6 border-y border-border/60 overflow-hidden bg-white/40">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-12 marquee"
          style={{ width: "max-content" }}
        >
          {doubled.map((item, i) => (
            <div key={`${item.label}-${i}`} className="flex items-center gap-2.5 text-sm text-muted-foreground whitespace-nowrap">
              <item.icon className="h-4 w-4 text-mint-400" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStrip;
