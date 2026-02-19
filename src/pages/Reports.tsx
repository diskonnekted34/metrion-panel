import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, Clock, TrendingUp, Target, Shield, Zap, Mail, Filter, ChevronRight, Brain, Eye, Star } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { mockReports, timeframeConfig, type ReportTimeframe, type IntelligenceReport } from "@/data/intelligenceReports";

const timeframes: ReportTimeframe[] = ["daily", "weekly", "monthly", "quarterly", "annual"];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "ready") return <span className="badge-success text-[10px] px-2 py-0.5 rounded-full font-medium">Hazır</span>;
  if (status === "generating") return <span className="badge-warning text-[10px] px-2 py-0.5 rounded-full font-medium animate-pulse">Hazırlanıyor</span>;
  return <span className="badge-neutral text-[10px] px-2 py-0.5 rounded-full font-medium">Planlandı</span>;
};

const ScoreBadge = ({ score, label }: { score: number; label: string }) => {
  const color = score >= 85 ? "text-success" : score >= 70 ? "text-primary" : "text-warning";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-lg font-bold ${color}`}>{score}</div>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
};

const ReportCard = ({ report }: { report: IntelligenceReport }) => {
  const config = timeframeConfig[report.timeframe];
  const Icon = config.icon;

  return (
    <Link to={`/reports/${report.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className={`h-4.5 w-4.5 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-white transition-colors leading-tight">{report.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{report.subtitle}</p>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* Scores row */}
        <div className="flex items-center gap-6 py-3 border-y border-border/40">
          <ScoreBadge score={report.intelligenceScore} label="İstihbarat" />
          <ScoreBadge score={report.confidenceScore} label="Güven" />
          <div className="flex-1" />
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">Bölüm</div>
            <div className="text-sm font-semibold text-foreground">{report.sections.length}</div>
          </div>
        </div>

        {/* Key insights */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-start gap-2">
            <Shield className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground line-clamp-1">{report.topRisk}</p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="h-3 w-3 text-success mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground line-clamp-1">{report.topOpportunity}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Clock className="h-2.5 w-2.5" />
            <span>{report.generatedAt}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Raporu Aç</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Reports = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<ReportTimeframe | "all">("all");

  const filteredReports = activeTimeframe === "all"
    ? mockReports
    : mockReports.filter(r => r.timeframe === activeTimeframe);

  // Stats
  const totalReports = mockReports.length;
  const readyCount = mockReports.filter(r => r.status === "ready").length;
  const avgConfidence = Math.round(mockReports.reduce((s, r) => s + r.confidenceScore, 0) / totalReports);

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Stats strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Toplam Rapor", value: totalReports, icon: BarChart3 },
            { label: "Hazır", value: readyCount, icon: Eye },
            { label: "Ort. Güven", value: `%${avgConfidence}`, icon: Brain },
            { label: "Otomatik Gönderim", value: "Aktif", icon: Mail },
          ].map((s, i) => (
            <div key={s.label} className="glass-card p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Timeframe filter */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTimeframe("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTimeframe === "all"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-secondary/60 text-muted-foreground border border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            Tümü
          </button>
          {timeframes.map(tf => {
            const config = timeframeConfig[tf];
            return (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTimeframe === tf
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/60 text-muted-foreground border border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <config.icon className="h-3 w-3" />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Email schedule strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Otomatik Gönderim Takvimi</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {timeframes.map(tf => {
              const config = timeframeConfig[tf];
              return (
                <div key={tf} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <div className={`h-1.5 w-1.5 rounded-full bg-success`} />
                  <span className="font-medium text-foreground">{config.label}:</span>
                  <span>{config.frequency}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ReportCard report={report} />
            </motion.div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Bu kategoride rapor bulunamadı.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
