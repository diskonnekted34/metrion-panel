import { motion } from "framer-motion";
import { Brain, Activity, BarChart3, Clock, Shield } from "lucide-react";
import { Executive } from "@/data/experts";
import { Button } from "@/components/ui/button";

const statusLabel = (s: string) => {
  if (s === "Monitoring") return "İzleniyor";
  if (s === "Running Task") return "Görev Çalışıyor";
  if (s === "Alerting") return "Uyarı Aktif";
  return "Boşta";
};

const statusColor = (s: string) => {
  if (s === "Alerting") return "bg-destructive/20 text-destructive";
  if (s === "Running Task") return "bg-primary/20 text-primary";
  if (s === "Monitoring") return "bg-emerald-500/20 text-emerald-400";
  return "bg-muted text-muted-foreground";
};

interface ProfileHeroProps {
  agent: Executive;
}

const ProfileHero = ({ agent }: ProfileHeroProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    className="glass-bento p-8 md:p-10 relative overflow-hidden"
  >
    {/* Subtle grid background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

    <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
      {/* Icon */}
      <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 ring-4 ring-primary/10">
        <Brain className="h-10 w-10 text-primary" />
        {agent.status === "Alerting" && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{agent.role}</h1>
          <span className={`text-[10px] font-semibold px-3 py-1 rounded-full ${agent.badge === "C-Level" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
            {agent.badge}
          </span>
          <span className={`text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${statusColor(agent.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusLabel(agent.status)}
          </span>
        </div>

        <p className="text-xs text-primary/70 font-medium mb-1">{agent.intelligenceDomain || "İstihbarat Katmanı"}</p>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{agent.tagline}</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{agent.performanceScore}%</p>
              <p className="text-[10px] text-muted-foreground">Güven Motoru</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{agent.tasksCompleted.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Tamamlanan Analiz</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{agent.weekday}</p>
              <p className="text-[10px] text-muted-foreground">Teslimat Günü</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Aktif</p>
              <p className="text-[10px] text-muted-foreground">Son Güncelleme</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Button className="px-6">Analiz Başlat</Button>
          <Button variant="outline" className="px-6">Ajanı Aktifleştir</Button>
        </div>
      </div>
    </div>
  </motion.section>
);

export default ProfileHero;
