import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.2, 0.8, 0.2, 1] }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.pricing.title}</h1>
            <p className="text-lg text-muted-foreground">{t.pricing.subtitle}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>{t.pricing.monthlyLabel}</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-mint-400" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>{t.pricing.annualLabel}</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-card p-10 text-left"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-[20px] bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.pricing.individualTitle}</h2>
                  <p className="text-sm text-muted-foreground">{t.pricing.individualDesc}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">{t.pricing.individualPrice}</span>
                <span className="text-lg text-muted-foreground ml-1">{t.pricing.individualPer}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {t.pricing.individualIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/marketplace" className="block w-full text-center rounded-[20px] border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.99]">
                {t.pricing.individualCta}
              </Link>
            </motion.div>

            {/* Bundle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-bento p-10 text-left relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-mint-200 to-mint-400 text-foreground uppercase tracking-wider">
                  {t.pricing.bundleBadge}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-mint-200/40 to-mint-400/30 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-mint-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.pricing.bundleTitle}</h2>
                  <p className="text-sm text-muted-foreground">{t.pricing.bundleDesc}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">
                  {annual ? t.pricing.bundleAnnual : t.pricing.bundlePrice}
                </span>
                <span className="text-lg text-muted-foreground ml-1">
                  {annual ? t.pricing.bundleAnnualPer : t.pricing.bundlePer}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {t.pricing.bundleIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-mint-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full rounded-[20px] btn-glow px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2">
                {t.pricing.bundleCta} <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-xs text-muted-foreground mt-4 text-center">{t.pricing.fairUse}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
