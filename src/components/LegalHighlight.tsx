import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const LegalHighlight = () => {
  const { lang } = useLanguage();

  const features = lang === "en"
    ? [
        "Contract risk scoring — high / medium / low",
        "Suggested clause revisions",
        "GDPR & KVKK compliance checklists",
        "Supplier & agency contract red flags",
        "Advertising claim risk detection",
      ]
    : [
        "Sözleşme risk puanlama — yüksek / orta / düşük",
        "Madde revizyon önerileri",
        "GDPR & KVKK uyumluluk kontrol listeleri",
        "Tedarikçi & ajans sözleşme kırmızı bayrakları",
        "Reklam iddia risk tespiti",
      ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: [0.2, 0.8, 0.2, 1] }}
          className="glass-bento p-10 md:p-14 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {lang === "en" ? "Legal Desk" : "Hukuk Masası"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "en" ? "Built-in decision-support module" : "Dahili karar destek modülü"}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{f}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-4 rounded-2xl bg-white/[0.03]">
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground italic">
              {lang === "en"
                ? "Decision-support analysis only. Not formal legal representation."
                : "Yalnızca karar destek analizi. Resmi hukuki temsil değildir."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegalHighlight;
