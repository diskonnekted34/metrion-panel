import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap, Activity, TrendingUp, Clock, ChevronRight, AlertTriangle,
  ArrowRight, Shield, Calendar, Eye, Pause, Play
} from "lucide-react";
import { executives } from "@/data/experts";
import AppLayout from "@/components/AppLayout";
import CompanyHealthScore from "@/components/CompanyHealthScore";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();

  const statusColor = (s: string) => {
    if (s === "Monitoring") return "bg-success/15 text-success";
    if (s === "Running Task") return "bg-primary/15 text-primary";
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
    { text: "ROAS başa baş noktasının altına düştü", detail: "Meta kampanyalarında son 48 saatte %18 düşüş tespit edildi.", urgency: "Yüksek", confidence: "94%", agent: "AI CMO", borderColor: "border-l-warning" },
    { text: "SKU-1247 ürün marjı kritik seviyede", detail: "Katkı marjı başa baş eşiğinin altına indi, fiyat revizyonu gerekli.", urgency: "Kritik", confidence: "97%", agent: "AI CFO", borderColor: "border-l-destructive" },
    { text: "Katkı marjı haftalık %4 geriledi", detail: "Hammadde maliyetlerindeki artış marjları aşağı çekiyor.", urgency: "Orta", confidence: "89%", agent: "AI CFO", borderColor: "border-l-primary" },
    { text: "Ürün X envanteri 14 günlük stokta", detail: "Mevcut satış hızıyla 14 gün içinde stok tükenecek.", urgency: "Yüksek", confidence: "91%", agent: "AI CTO", borderColor: "border-l-warning" },
  ];

  const weeklyRhythm = [
    { day: "Pazartesi", output: "CEO Brifing", agent: "AI CEO", status: "Tamamlandı" },
    { day: "Salı", output: "Büyüme İnceleme", agent: "AI CSO", status: "Tamamlandı" },
    { day: "Çarşamba", output: "Finans İnceleme", agent: "AI CFO", status: "Bekliyor" },
    { day: "Perşembe", output: "Sistem İnceleme", agent: "AI CTO", status: "Bekliyor" },
    { day: "Cuma", output: "Haftalık Özet", agent: "AI CEO", status: "Bekliyor" },
  ];

  const tasks = [
    { title: "Q4 kampanya kreatif performansını incele", agent: "AI CMO", severity: "Yüksek", eta: "2 saat", status: "Devam Ediyor", time: "12 dk önce" },
    { title: "Nakit akışı 8 haftalık tahmin güncelle", agent: "AI CFO", severity: "Kritik", eta: "1 saat", status: "Devam Ediyor", time: "28 dk önce" },
    { title: "İlk 10 otomasyon fırsatını haritalandır", agent: "AI CTO", severity: "Orta", eta: "4 saat", status: "Devam Ediyor", time: "2 saat önce" },
    { title: "Tedarikçi sözleşme risklerini puanla", agent: "Hukuk Masası", severity: "Orta", eta: "—", status: "Tamamlandı", time: "4 saat önce" },
    { title: "Haftalık CEO brifing raporu oluştur", agent: "AI CEO", severity: "Düşük", eta: "—", status: "Tamamlandı", time: "6 saat önce" },
  ];

  const impact = [
    { label: "Gelir Etkisi", value: "$2.4M", icon: TrendingUp },
    { label: "Marj İyileştirmesi", value: "+3.2%", icon: Activity },
    { label: "Önlenen Riskler", value: "23", icon: Shield },
    { label: "Çalışan Otomasyonlar", value: "47", icon: Zap },
  ];

  const severityColor = (s: string) => {
    if (s === "Kritik") return "bg-destructive/15 text-destructive";
    if (s === "Yüksek") return "bg-warning/15 text-warning";
    if (s === "Orta") return "bg-primary/15 text-primary";
    return "bg-secondary text-muted-foreground";
  };

  // Mobile layout order: Health → Insights → Tasks → Team → Impact
  if (isMobile) {
    return (
      <AppLayout>
        <div className="p-4 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">Kontrol Merkezi</h1>
            <p className="text-sm text-muted-foreground">AI ekibiniz aktif.</p>
          </motion.div>

          {/* Health Score */}
          <CompanyHealthScore />

          {/* Critical Insights */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Kritik İçgörüler</h2>
            <div className="space-y-2.5">
              {insights.slice(0, 3).map((insight, i) => (
                <div key={i} className={`glass-card p-4 border-l-[3px] ${insight.borderColor}`}>
                  <p className="text-sm font-medium text-foreground mb-1">{insight.text}</p>
                  <p className="text-xs text-muted-foreground mb-2">{insight.detail}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{insight.agent} · Güven: {insight.confidence}</span>
                    <button className="text-xs font-medium text-accent flex items-center gap-1">
                      Göreve Dönüştür <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's Priorities */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Günün Öncelikleri</h2>
            <div className="glass-card divide-y divide-border">
              {tasks.filter(t => t.status === "Devam Ediyor").map((task, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.agent} · {task.eta}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl shrink-0 ${severityColor(task.severity)}`}>{task.severity}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team Status - Horizontal Scroll */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Ekip Durumu</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {executives.slice(0, 6).map((exec) => (
                <div key={exec.id} className="glass-card p-4 min-w-[160px] shrink-0">
                  <img src={exec.avatar} alt={exec.name} className="h-10 w-10 rounded-2xl object-cover ring-1 ring-border mb-2" />
                  <h3 className="text-xs font-bold text-primary">{exec.role}</h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-2xl mt-1 inline-block ${statusColor(exec.status)}`}>
                    {statusLabel(exec.status)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-base font-semibold text-foreground mb-3">Etki Özeti</h2>
            <div className="grid grid-cols-2 gap-3">
              {impact.map((item) => (
                <div key={item.label} className="glass-card p-4 text-center">
                  <item.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // Desktop layout
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-1">Yönetici Kontrol Merkezi</h1>
          <p className="text-muted-foreground text-sm">AI ekibiniz aktif ve izleme yapıyor.</p>
        </motion.div>

        {/* 1. Executive Insight Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Aktif İçgörüler</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {insights.map((insight, i) => (
              <div key={i} className={`glass-card p-5 min-w-[300px] max-w-[340px] shrink-0 border-l-[3px] ${insight.borderColor} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${
                      insight.urgency === "Kritik" ? "text-destructive" :
                      insight.urgency === "Yüksek" ? "text-warning" : "text-primary"
                    }`} />
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                      insight.urgency === "Kritik" ? "bg-destructive/10 text-destructive" :
                      insight.urgency === "Yüksek" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    }`}>{insight.urgency}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">Güven: {insight.confidence}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{insight.text}</p>
                  <p className="text-xs text-muted-foreground mb-3">{insight.detail}</p>
                  <p className="text-[10px] text-muted-foreground">{insight.agent}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 text-xs font-medium py-2 rounded-2xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center justify-center gap-1">
                    Göreve Dönüştür <ArrowRight className="h-3 w-3" />
                  </button>
                  <button className="text-xs font-medium py-2 px-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Analiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2. Company Health Score */}
        <CompanyHealthScore />

        {/* 3. AI Team Status Matrix */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">AI Ekip Durum Matrisi</h2>
            <Link to="/team" className="text-sm text-primary hover:underline flex items-center gap-1">
              Tümünü Gör <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {executives.slice(0, 6).map((exec, i) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className={`glass-card p-5 ${exec.status === "Alerting" ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
              >
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
                <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{exec.tagline}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{exec.performanceScore}% performans</span>
                  <span>{exec.tasksCompleted.toLocaleString()} görev</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/workspace/${exec.id}`} className="flex-1 text-center text-xs py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors">Aç</Link>
                  <button className="flex-1 text-xs py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors">Görev Ata</button>
                  <button className="text-xs py-2 px-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
                    <Pause className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. Weekly Executive Rhythm */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Haftalık Yönetici Ritmi</h2>
          <div className="glass-card p-6">
            <div className="grid grid-cols-5 gap-3">
              {weeklyRhythm.map((day, i) => (
                <div key={i} className={`text-center p-4 rounded-2xl transition-colors ${
                  day.status === "Tamamlandı" ? "bg-success/10 border border-success/20" : "bg-secondary/50 hover:bg-secondary/80"
                }`}>
                  <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground mb-1">{day.day}</p>
                  <p className="text-[11px] text-muted-foreground">{day.output}</p>
                  <p className="text-[10px] text-accent mt-1">{day.agent}</p>
                  <span className={`text-[9px] mt-2 inline-block px-1.5 py-0.5 rounded-2xl ${
                    day.status === "Tamamlandı" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                  }`}>{day.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5. Prioritized Tasks */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Öncelikli Görevler</h2>
            <Link to="/tasks" className="text-sm text-primary hover:underline flex items-center gap-1">
              Tümünü Gör <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="glass-card divide-y divide-border">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.agent} · {task.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{task.eta}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${severityColor(task.severity)}`}>{task.severity}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-2xl ${
                    task.status === "Devam Ediyor" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                  }`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 6. Impact Snapshot */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
