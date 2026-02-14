import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Activity, TrendingUp, Clock, ChevronRight, AlertTriangle, ArrowRight, Shield, Calendar } from "lucide-react";
import { executives } from "@/data/experts";
import AppLayout from "@/components/AppLayout";

const Dashboard = () => {
  const statusColor = (s: string) => {
    if (s === "Monitoring") return "bg-success/15 text-success";
    if (s === "Running Task") return "bg-secondary text-muted-foreground";
    if (s === "Alerting") return "bg-destructive/15 text-destructive";
    return "bg-secondary text-muted-foreground";
  };

  const statusLabel = (s: string) => {
    if (s === "Monitoring") return "İzleniyor";
    if (s === "Running Task") return "Görev Çalışıyor";
    if (s === "Alerting") return "Uyarı Veriyor";
    return "Boşta";
  };

  const insights = [
    { text: "Meta kampanyalarında ROAS son 48 saatte %18 düştü", urgency: "Yüksek", confidence: "94%", agent: "AI CMO", borderColor: "border-l-warning" },
    { text: "SKU-1247 ürün marjı başa baş eşiğinin altına indi", urgency: "Kritik", confidence: "97%", agent: "AI CFO", borderColor: "border-l-destructive" },
    { text: "3 tedarikçi sözleşmesi 14 gün içinde sona eriyor", urgency: "Orta", confidence: "89%", agent: "Hukuk Masası", borderColor: "border-l-primary" },
  ];

  const weeklyRhythm = [
    { day: "Pazartesi", output: "CEO Brifing", agent: "AI CEO" },
    { day: "Salı", output: "Büyüme Planı", agent: "AI CSO" },
    { day: "Çarşamba", output: "Finans Brifing", agent: "AI CFO" },
    { day: "Perşembe", output: "Sistem Brifing", agent: "AI CTO" },
    { day: "Cuma", output: "Haftalık Özet", agent: "AI CEO" },
  ];

  const tasks = [
    { title: "Q4 kampanya kreatif performansını incele", agent: "AI CMO", status: "Devam Ediyor", time: "12 dk önce" },
    { title: "Nakit akışı tahminini güncelle", agent: "AI CFO", status: "Tamamlandı", time: "1 saat önce" },
    { title: "İlk 10 otomasyon fırsatını haritalandır", agent: "AI CTO", status: "Devam Ediyor", time: "2 saat önce" },
    { title: "Tedarikçi sözleşme risklerini puanla", agent: "Hukuk Masası", status: "Tamamlandı", time: "4 saat önce" },
  ];

  const impact = [
    { label: "Gelir Etkisi", value: "$2.4M", icon: TrendingUp },
    { label: "Kazanılan Saat", value: "186 saat", icon: Clock },
    { label: "Azaltılan Riskler", value: "23", icon: Shield },
    { label: "Çalışan Otomasyonlar", value: "47", icon: Zap },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Yönetici Kontrol Merkezi</h1>
          <p className="text-muted-foreground">AI ekibiniz aktif ve izleme yapıyor.</p>
        </motion.div>

        {/* Insights with severity border strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Aktif İçgörüler</h2>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`glass-card p-5 flex items-center justify-between gap-4 border-l-[3px] ${insight.borderColor}`}>
                <div className="flex items-start gap-3 flex-1">
                  <div className={`rounded-2xl p-2 shrink-0 ${insight.urgency === "Kritik" ? "bg-destructive/10" : insight.urgency === "Yüksek" ? "bg-warning/10" : "bg-primary/10"}`}>
                    <AlertTriangle className={`h-4 w-4 ${insight.urgency === "Kritik" ? "text-destructive" : insight.urgency === "Yüksek" ? "text-warning" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{insight.text}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{insight.agent}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                        insight.urgency === "Kritik" ? "bg-destructive/10 text-destructive" :
                        insight.urgency === "Yüksek" ? "bg-warning/10 text-warning" :
                        "bg-primary/10 text-primary"
                      }`}>Aciliyet: {insight.urgency}</span>
                      <span className="text-[10px] text-muted-foreground">Güven: {insight.confidence}</span>
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

        {/* Team Status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">AI Ekip Durumu</h2>
            <Link to="/team" className="text-sm text-primary hover:underline flex items-center gap-1">
              AI Ekibim <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {executives.slice(0, 6).map((exec, i) => (
              <motion.div key={exec.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={exec.avatar} alt={exec.name} className="h-11 w-11 rounded-2xl object-cover ring-1 ring-border" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary text-sm">{exec.role}</h3>
                    <p className="text-xs text-muted-foreground truncate">{exec.name}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${statusColor(exec.status)}`}>
                    {statusLabel(exec.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{exec.performanceScore}% performans</span>
                  <span>{exec.tasksCompleted.toLocaleString()} görev</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/expert/${exec.id}`} className="flex-1 text-center text-xs py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors">Aç</Link>
                  <button className="flex-1 text-xs py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors">Ata</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Rhythm */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Haftalık Yönetici Ritmi</h2>
          <div className="glass-bento p-6">
            <div className="grid grid-cols-5 gap-3">
              {weeklyRhythm.map((day, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors">
                  <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground mb-1">{day.day}</p>
                  <p className="text-[11px] text-muted-foreground">{day.output}</p>
                  <p className="text-[10px] text-accent mt-1">{day.agent}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Öncelikli Görevler</h2>
          <div className="glass-card divide-y divide-border">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                  task.status === "Devam Ediyor" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                }`}>{task.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Etki Özeti</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impact.map((item) => (
              <div key={item.label} className="glass-card p-5 text-center">
                <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
                <div className="w-6 h-[2px] bg-primary/50 mx-auto mb-2 rounded-full" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
