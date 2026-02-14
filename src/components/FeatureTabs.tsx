import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Bell, FileText, Shield } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const tabs = [
  {
    id: "bundle",
    icon: Crown,
    features: [
      "5 AI Executives working in coordination",
      "Weekly structured briefs (Mon–Fri rhythm)",
      "Cross-functional decision tracking",
      "Unified priority management",
    ],
  },
  {
    id: "alerts",
    icon: Bell,
    features: [
      "ROAS drop alerts from AI CMO",
      "Margin breach warnings from AI CFO",
      "System health alerts from AI CTO",
      "Contract deadline reminders from Legal Desk",
    ],
  },
  {
    id: "reports",
    icon: FileText,
    features: [
      "CEO Brief every Monday",
      "Growth Plan every Tuesday",
      "Finance Brief every Wednesday",
      "Systems & Automation Brief every Thursday",
    ],
  },
  {
    id: "legal",
    icon: Shield,
    features: [
      "Contract risk scoring (high / medium / low)",
      "GDPR/KVKK compliance checklists",
      "Advertising claim risk detection",
      "Supplier/agency contract red flags",
    ],
  },
];

const tabLabels: Record<string, { en: string; tr: string }> = {
  bundle: { en: "Executive Bundle", tr: "Yönetici Paketi" },
  alerts: { en: "Proactive Alerts", tr: "Proaktif Uyarılar" },
  reports: { en: "Weekly Reports", tr: "Haftalık Raporlar" },
  legal: { en: "Legal Desk", tr: "Hukuk Masası" },
};

const FeatureTabs = () => {
  const [active, setActive] = useState("bundle");
  const { lang } = useLanguage();
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {lang === "en" ? "What's Included" : "Neler Dahil"}
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
                {tabLabels[tab.id][lang]}
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
              <h3 className="text-xl font-semibold text-foreground">{tabLabels[active][lang]}</h3>
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
