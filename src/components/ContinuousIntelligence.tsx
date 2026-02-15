import { motion } from "framer-motion";
import { Brain, RefreshCw, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  { icon: RefreshCw, title: "Düzenli Güncelleme", desc: "İstihbarat modülleri düzenli olarak rafine edilir — yeni iş mantığı ve analiz modelleri eklenir." },
  { icon: TrendingUp, title: "Gelişen Risk Modelleri", desc: "Risk değerlendirme modelleri modern iş gerçekliklerini yansıtacak şekilde güçlendirilir." },
  { icon: Shield, title: "İyileştirilen Raporlama", desc: "Raporlama lojiği ve analiz altyapısı sürekli olarak optimize edilir." },
  { icon: Zap, title: "Genişleyen Veri Katmanları", desc: "Yeni veri ve aksiyon katmanları eklenerek istihbarat kapsamı genişletilir." },
];

const ContinuousIntelligence = () => {
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
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sürekli Gelişen Zekâ</h2>
              <p className="text-sm text-muted-foreground">Gelişen iş zekâsıyla sürekli rafine edilen istihbarat modülleri</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Kurumsal istihbarat sisteminiz statik bir araç değildir. Her modül, modern iş gerçekliklerini yansıtacak şekilde sürekli olarak güncellenir, rafine edilir ve güçlendirilir. Analitik modeller, raporlama lojiği ve veri katmanı kapasiteleri düzenli olarak genişletilir.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-secondary"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subtle glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(76,141,255,0.06)" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ContinuousIntelligence;
