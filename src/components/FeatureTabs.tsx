import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Shield, Brain, Zap } from "lucide-react";

const tabs = [
  {
    id: "workforce",
    icon: Layers,
    label: "AI İş Gücü",
    features: [
      "Departman bazlı rol eğitimli AI ajanlar",
      "Her ajan belirli yönetici fonksiyonu için eğitilmiş",
      "Entegrasyon farkındalığı ile gerçek verilerle çalışma",
      "Sürekli güncellenen ve rafine edilen istihbarat",
    ],
  },
  {
    id: "risk",
    icon: Shield,
    label: "Risk & Kontrol",
    features: [
      "Tüm eylemler taslak olarak oluşturulur — kör otomasyon yok",
      "Risk motoru her yazma eylemini değerlendirir",
      "Eskalasyon bazlı onay zincirleri",
      "Değiştirilemez denetim günlükleri",
    ],
  },
  {
    id: "intelligence",
    icon: Brain,
    label: "Sürekli İstihbarat",
    features: [
      "Ajanlar düzenli olarak rafine edilir ve güncellenir",
      "Risk modelleri gelişmiş iş zekâsıyla güçlendirilir",
      "Performans lojiği sürekli iyileştirilir",
      "Entegrasyon kapasiteleri genişletilir",
    ],
  },
  {
    id: "execution",
    icon: Zap,
    label: "Yapılandırılmış Yürütme",
    features: [
      "Haftalık yönetici ritimleri ile öngörülebilir çıktılar",
      "Proaktif uyarılar ve anomali tespiti",
      "Tek tıkla göreve dönüştürme",
      "Departmanlar arası koordineli karar altyapısı",
    ],
  },
];

const FeatureTabs = () => {
  const [active, setActive] = useState("workforce");
  const currentTab = tabs.find(t => t.id === active)!;

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Stratejik Karar Altyapısı</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Yapılandırılmış AI Operasyon Sistemi
          </h2>
        </motion.div>

        {/* Segmented control */}
        <div className="flex items-center justify-center gap-1 mb-10 p-1 rounded-2xl glass mx-auto w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                active === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "rgba(76,141,255,0.1)",
                    borderBottom: "2px solid rgba(76,141,255,0.6)",
                  }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass-bento p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <currentTab.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{currentTab.label}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {currentTab.features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeatureTabs;
