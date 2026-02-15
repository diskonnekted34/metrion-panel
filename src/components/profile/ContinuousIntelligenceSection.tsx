import { motion } from "framer-motion";
import { Brain, RefreshCw, Signal, TrendingUp, Shield } from "lucide-react";

const items = [
  { icon: RefreshCw, title: "Sürekli Model İyileştirme", desc: "İşletme verileriyle düzenli olarak rafine edilen öğrenme döngüsü" },
  { icon: TrendingUp, title: "Pazar İstihbaratı Entegrasyonu", desc: "Sektörel veri ve trend sinyallerinin otomatik absorbe edilmesi" },
  { icon: Signal, title: "Risk Sinyal Güncellemeleri", desc: "Yeni risk parametrelerinin otomatik olarak modele eklenmesi" },
  { icon: Shield, title: "Güvenlik ve Doğruluk Katmanı", desc: "Her analiz çıktısı güven skoru ve kaynak referansı ile sunulur" },
];

const ContinuousIntelligenceSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
      <Brain className="h-5 w-5 text-primary" />
      Sürekli Gelişen İstihbarat
    </h2>
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 + i * 0.04 }}
          className="glass-card p-5"
        >
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <item.icon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default ContinuousIntelligenceSection;
