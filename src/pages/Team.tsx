import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain, TrendingUp, BarChart3, Layers, Palette, ShoppingCart, FileText,
  Activity, Pause, Play, Clock, FileBarChart, ArrowRight, Zap, Shield,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { allExperts } from "@/data/experts";
import { usePacks } from "@/contexts/PackContext";

const domainIcons: Record<string, any> = {
  ceo: Brain, cmo: TrendingUp, cfo: BarChart3, coo: Layers, legal: FileText,
  "accounting-agent": BarChart3, "growth-agent": TrendingUp, "inventory-agent": Layers,
  "creative-director": Palette, "graphic-designer": Palette, "art-director": Palette,
  "marketplace-agent": ShoppingCart,
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  Monitoring: { label: "İzleniyor", color: "text-primary", icon: Activity },
  "Running Task": { label: "Görev Yürütüyor", color: "text-success", icon: Zap },
  Idle: { label: "Bekleniyor", color: "text-muted-foreground", icon: Pause },
  Alerting: { label: "Uyarı Veriyor", color: "text-warning", icon: AlertTriangle },
};

// Mock last analysis timestamps
const getLastAnalysis = (id: string) => {
  const times: Record<string, string> = {
    ceo: "12 dk önce", cmo: "3 dk önce", cfo: "28 dk önce", coo: "1 saat önce",
    legal: "3 gün önce", "accounting-agent": "45 dk önce", "growth-agent": "8 dk önce",
    "inventory-agent": "2 saat önce", "creative-director": "5 saat önce",
    "graphic-designer": "1 saat önce", "art-director": "4 saat önce",
    "marketplace-agent": "15 dk önce",
  };
  return times[id] || "1 saat önce";
};

const getReportCount = (id: string) => {
  const counts: Record<string, number> = {
    ceo: 142, cmo: 218, cfo: 186, coo: 97, legal: 34,
    "accounting-agent": 89, "growth-agent": 156, "inventory-agent": 72,
    "creative-director": 64, "graphic-designer": 112, "art-director": 48,
    "marketplace-agent": 53,
  };
  return counts[id] || 50;
};

const Team = () => {
  const { isAgentUnlocked } = usePacks();
  const [pausedAgents, setPausedAgents] = useState<Set<string>>(new Set());

  const activeAgents = allExperts.filter(a => isAgentUnlocked(a.id));

  const togglePause = (id: string) => {
    setPausedAgents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalReports = activeAgents.reduce((sum, a) => sum + getReportCount(a.id), 0);
  const activeCount = activeAgents.filter(a => !pausedAgents.has(a.id)).length;
  const alertCount = activeAgents.filter(a => a.status === "Alerting").length;

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(30,107,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">


          {/* ─── SUMMARY STATS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: "Aktif Ajan", value: activeCount, icon: Activity, accent: "text-primary" },
              { label: "Toplam Rapor", value: totalReports.toLocaleString(), icon: FileBarChart, accent: "text-success" },
              { label: "Uyarı Veren", value: alertCount, icon: AlertTriangle, accent: "text-warning" },
              { label: "Duraklatılan", value: pausedAgents.size, icon: Pause, accent: "text-muted-foreground" },
            ].map((stat, i) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </motion.div>

          {/* ─── AGENT LIST ─── */}
          <div className="space-y-3">
            {activeAgents.map((agent, i) => {
              const Icon = domainIcons[agent.id] || Brain;
              const isPaused = pausedAgents.has(agent.id);
              const status = isPaused ? { label: "Duraklatıldı", color: "text-muted-foreground", icon: Pause } : statusConfig[agent.status];
              const StatusIcon = status.icon;
              const reportCount = getReportCount(agent.id);
              const lastAnalysis = getLastAnalysis(agent.id);
              const isCLevel = agent.tier === "c-level";

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-card p-4 md:p-5 flex items-center gap-4 group transition-all duration-200 hover:border-primary/15 ${
                    isPaused ? "opacity-50" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCLevel ? "bg-primary/10" : "bg-accent/10"
                  }`}>
                    <Icon className={`h-5 w-5 ${isCLevel ? "text-primary" : "text-accent"}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-foreground truncate">{agent.role}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCLevel ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>
                        {isCLevel ? "C-Level" : "Uzman"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{agent.intelligenceDomain}</p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:flex items-center gap-1.5 min-w-[130px]">
                    <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                    <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>
                  </div>

                  {/* Last Analysis */}
                  <div className="hidden lg:flex items-center gap-1.5 min-w-[120px]">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{lastAnalysis}</span>
                  </div>

                  {/* Performance */}
                  <div className="hidden lg:flex items-center gap-1.5 min-w-[80px]">
                    <div className="h-1.5 w-10 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${agent.performanceScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{agent.performanceScore}%</span>
                  </div>

                  {/* Reports */}
                  <div className="hidden md:flex items-center gap-1.5 min-w-[80px]">
                    <FileBarChart className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{reportCount} rapor</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePause(agent.id)}
                      className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-all ${
                        isPaused
                          ? "border-success/30 text-success hover:bg-success/10"
                          : "border-border text-muted-foreground hover:text-warning hover:border-warning/30"
                      }`}
                      title={isPaused ? "Aktifleştir" : "Duraklat"}
                    >
                      {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                    </button>
                    <Link
                      to={`/workspace/${agent.id}`}
                      className="h-8 px-3 rounded-xl flex items-center gap-1 text-[11px] font-medium border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      Konsol <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Expand CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              <Shield className="h-4 w-4" />
              Ekibi Genişlet — Yeni Ajan Keşfet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
