import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, Shield, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const Reports = () => {
  const impact = [
    { label: "Gelir Etkisi", value: "$2.4M", icon: TrendingUp },
    { label: "Kazanılan Saat", value: "186 saat", icon: Clock },
    { label: "Azaltılan Riskler", value: "23", icon: Shield },
    { label: "Çalışan Otomasyonlar", value: "47", icon: Zap },
  ];

  const weeklyReports = [
    { title: "CEO Haftalık Brifing", agent: "AI CEO", date: "10 Şubat 2026", status: "Hazır" },
    { title: "Büyüme Raporu", agent: "AI CSO", date: "11 Şubat 2026", status: "Hazır" },
    { title: "Finansal Brifing", agent: "AI CFO", date: "12 Şubat 2026", status: "Hazır" },
    { title: "Sistem Sağlık Raporu", agent: "AI CTO", date: "13 Şubat 2026", status: "Hazırlanıyor" },
    { title: "Haftalık Özet", agent: "AI CEO", date: "14 Şubat 2026", status: "Bekliyor" },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Raporlar</h1>
              <p className="text-sm text-muted-foreground">Haftalık çıktılar ve etki analizi</p>
            </div>
          </div>

          {/* Impact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {impact.map((item, i) => (
              <div key={item.label} className={`${i === 0 || i === 3 ? "glass-bento" : "glass-card"} p-5 text-center`}>
                <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly reports */}
          <h2 className="text-lg font-semibold text-foreground mb-4">Haftalık Raporlar</h2>
          <div className="glass-card divide-y divide-white/[0.06]">
            {weeklyReports.map((report, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.agent} · {report.date}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                  report.status === "Hazır" ? "bg-accent/15 text-accent" :
                  report.status === "Hazırlanıyor" ? "bg-primary/15 text-primary" :
                  "bg-white/[0.06] text-muted-foreground"
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Reports;
