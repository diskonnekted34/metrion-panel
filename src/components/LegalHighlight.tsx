import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

const features = [
  "Sözleşme risk puanlama — yüksek / orta / düşük",
  "Madde revizyon önerileri",
  "GDPR & KVKK uyumluluk kontrol listeleri",
  "Tedarikçi & ajans sözleşme kırmızı bayrakları",
  "Reklam iddia risk tespiti",
];

const LegalHighlight = () => {
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Hukuk Masası</h2>
              <p className="text-sm text-muted-foreground">Rol eğitimli hukuki karar destek modülü</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60 mb-6 flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Kontrollü otomasyon — tüm eylemler taslak olarak oluşturulur
          </p>

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

          <div className="flex items-start gap-2 p-4 rounded-2xl bg-secondary">
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground italic">
              Yalnızca karar destek analizi. Resmi hukuki temsil değildir. Sürekli güncellenen hukuki istihbarat ile rafine edilir.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegalHighlight;
