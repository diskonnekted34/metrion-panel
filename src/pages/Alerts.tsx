import { motion } from "framer-motion";
import { Bell, AlertTriangle, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const alerts = [
  { text: "Meta kampanyalarında ROAS son 48 saatte %18 düştü", urgency: "Yüksek", confidence: "94%", agent: "AI CMO" },
  { text: "SKU-1247 ürün marjı başa baş eşiğinin altına indi", urgency: "Kritik", confidence: "97%", agent: "AI CFO" },
  { text: "3 tedarikçi sözleşmesi 14 gün içinde sona eriyor — madde incelemesi önerilir", urgency: "Orta", confidence: "89%", agent: "Hukuk Masası" },
  { text: "Instagram etkileşim oranı %12 geriledi", urgency: "Orta", confidence: "85%", agent: "Echo" },
  { text: "Rakip fiyat değişikliği tespit edildi — 3 SKU etkilendi", urgency: "Yüksek", confidence: "91%", agent: "Nova" },
];

const Alerts = () => {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-destructive/15 flex items-center justify-center">
              <Bell className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Uyarılar</h1>
              <p className="text-sm text-muted-foreground">AI ekibinizden gelen proaktif uyarılar</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="glass-card p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`rounded-2xl p-2 shrink-0 ${
                    alert.urgency === "Kritik" ? "bg-destructive/15" : alert.urgency === "Yüksek" ? "bg-primary/15" : "bg-white/[0.06]"
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${alert.urgency === "Kritik" ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.text}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{alert.agent}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                        alert.urgency === "Kritik" ? "bg-destructive/15 text-destructive" :
                        alert.urgency === "Yüksek" ? "bg-primary/15 text-primary" :
                        "bg-white/[0.06] text-muted-foreground"
                      }`}>Aciliyet: {alert.urgency}</span>
                      <span className="text-[10px] text-muted-foreground">Güven: {alert.confidence}</span>
                    </div>
                  </div>
                </div>
                <button className="text-xs font-medium text-accent hover:underline whitespace-nowrap flex items-center gap-1">
                  Göreve Dönüştür <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Alerts;
