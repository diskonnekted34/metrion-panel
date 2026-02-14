import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pricing = () => {
  const { t } = useLanguage();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.pricing.title}</h1>
            <p className="text-lg text-muted-foreground mb-10">{t.pricing.subtitle}</p>
          </motion.div>

          {/* Toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>{t.pricing.monthlyLabel}</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>{t.pricing.annualLabel}</span>
          </motion.div>

          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">C</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.pricing.planName}</h2>
                <p className="text-sm text-muted-foreground">{t.pricing.planDesc}</p>
              </div>
            </div>

            <div className="my-8">
              <span className="text-5xl font-bold text-foreground">
                {annual ? "$14,900" : "$1,490"}
              </span>
              <span className="text-lg text-muted-foreground ml-1">
                {annual ? t.pricing.annual : t.pricing.monthly}
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {t.pricing.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <button className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99] btn-glow">
              {t.pricing.cta}
            </button>

            <p className="text-xs text-muted-foreground mt-4 text-center">{t.pricing.fairUse}</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
