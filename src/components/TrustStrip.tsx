import { motion } from "framer-motion";
import { Shield, Brain, Layers, Zap, BarChart3, Lock } from "lucide-react";

const TrustStrip = () => {
  const items = [
    { icon: Brain, label: "Rol Eğitimli AI Ajanlar" },
    { icon: Shield, label: "Risk Motoru Koruması" },
    { icon: Layers, label: "Departman Bazlı İstihbarat" },
    { icon: Zap, label: "Sürekli Güncellenen Zekâ" },
    { icon: BarChart3, label: "Yapılandırılmış Karar Altyapısı" },
    { icon: Lock, label: "Kontrollü Otomasyon" },
  ];

  const doubled = [...items, ...items];

  return (
    <section className="py-8 px-6 border-y border-border overflow-hidden">
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
