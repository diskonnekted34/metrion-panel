import { motion } from "framer-motion";
import { ShieldCheck, Eye, Users, Database } from "lucide-react";

const trustItems = [
  { icon: Eye, title: "Anlık Görüntü Analizi", desc: "Her çıktı, belirli bir zaman diliminin anlık görüntüsüne dayalıdır. Geçmiş referansları korunur." },
  { icon: Database, title: "Denetim Günlükleri", desc: "Tüm analiz çalıştırmaları, parametreleri ve sonuçları tam kayıt altındadır." },
  { icon: Users, title: "Çoklu Onay Sistemi", desc: "Kritik kararlar için çift onay mekanizması. Yüksek riskli işlemler kurucu onayı gerektirir." },
  { icon: ShieldCheck, title: "Veri Bütünlüğü Güvencesi", desc: "Girdi verileri doğrulama katmanından geçirilir. Anomalili veriler işaretlenir." },
];

const TrustLayer = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
  >
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-primary" />
      Güven Katmanı
    </h2>
    <div className="grid sm:grid-cols-2 gap-3">
      {trustItems.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.37 + i * 0.04 }}
          className="glass-bento p-5"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default TrustLayer;
