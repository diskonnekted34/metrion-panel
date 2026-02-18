import { useParams, Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Mail, Clock, Brain, Shield, TrendingUp, TrendingDown, AlertTriangle, Zap, Target, ChevronRight, BarChart3, Activity, Eye, Star, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { getReportById, timeframeConfig } from "@/data/intelligenceReports";
import type { ReportSection, IntelligenceReport } from "@/data/intelligenceReports";
import ReportSocialSummary from "@/components/reports/ReportSocialSummary";

/* ── Section Renderers ── */
const SummarySection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
    <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
  </div>
);

const ScoreSection = ({ section }: { section: ReportSection }) => {
  const score = section.data?.score ?? 0;
  const color = score >= 85 ? "text-success" : score >= 70 ? "text-primary" : "text-warning";
  const glowColor = score >= 85 ? "rgba(22,199,132,0.3)" : score >= 70 ? "rgba(30,107,255,0.3)" : "rgba(245,158,11,0.3)";
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className={`text-4xl font-bold ${color}`} style={{ textShadow: `0 0 20px ${glowColor}` }}>
            {score}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">/ 100</div>
        </div>
        {section.data?.factors && (
          <div className="flex-1 space-y-2">
            {section.data.factors.map((f: any) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-28">{f.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${f.value}%` }} />
                </div>
                <span className="text-[10px] text-foreground font-medium w-8 text-right">{f.value}</span>
              </div>
            ))}
          </div>
        )}
        {section.data?.breakdown && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            {Object.entries(section.data.breakdown).map(([key, val]) => (
              <div key={key} className="text-center p-2 rounded-xl bg-secondary/50">
                <div className="text-sm font-bold text-foreground">{val as number}</div>
                <div className="text-[9px] text-muted-foreground capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}
        {section.data?.subScores && (
          <div className="flex-1 space-y-2">
            {section.data.subScores.map((s: any) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-32">{s.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${s.value}%` }} />
                </div>
                <span className="text-[10px] text-foreground font-medium w-8 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{section.content}</p>
    </div>
  );
};

const MetricsSection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{section.content}</p>
    {section.data?.changes && (
      <div className="space-y-2">
        {section.data.changes.map((c: any) => (
          <div key={c.metric} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs font-medium text-foreground">{c.metric}</span>
            <span className={`text-xs font-bold ${c.direction === "up" ? "text-success" : "text-destructive"}`}>{c.change}</span>
          </div>
        ))}
      </div>
    )}
    {section.data?.channels && (
      <div className="space-y-2">
        {section.data.channels.map((c: any) => (
          <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs font-medium text-foreground">{c.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground font-semibold">{c.revenue}</span>
              <span className={`text-[10px] font-bold ${c.change.startsWith("+") ? "text-success" : "text-destructive"}`}>{c.change}</span>
            </div>
          </div>
        ))}
      </div>
    )}
    {section.data?.anomalies && (
      <div className="space-y-2">
        {section.data.anomalies.map((a: any) => (
          <div key={a.title} className={`p-3 rounded-xl border ${a.severity === "warning" ? "bg-warning/5 border-warning/20" : "bg-primary/5 border-primary/20"}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`h-3 w-3 ${a.severity === "warning" ? "text-warning" : "text-primary"}`} />
              <span className="text-xs font-semibold text-foreground">{a.title}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{a.detail}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const RisksSection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
      <Shield className="h-4 w-4 text-destructive" />
      {section.title}
    </h3>
    {section.data?.risks && (
      <div className="space-y-2">
        {section.data.risks.map((r: any) => {
          const levelColor = r.level === "high" ? "badge-error" : r.level === "medium" ? "badge-warning" : "badge-success";
          return (
            <div key={r.area} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
              <span className={`${levelColor} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 mt-0.5`}>{r.level}</span>
              <div>
                <span className="text-xs font-semibold text-foreground">{r.area}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{r.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
    {section.data?.riskMatrix && (
      <div className="space-y-2">
        {section.data.riskMatrix.map((r: any) => {
          const trendIcon = r.trend === "improving" ? <TrendingDown className="h-3 w-3 text-success" /> : r.trend === "worsening" ? <TrendingUp className="h-3 w-3 text-destructive" /> : <Activity className="h-3 w-3 text-muted-foreground" />;
          return (
            <div key={r.area} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
              <span className="text-xs font-medium text-foreground">{r.area}</span>
              <div className="flex items-center gap-3">
                <span className="badge-warning text-[9px] px-1.5 py-0.5 rounded-full">P: {r.probability}</span>
                <span className="badge-error text-[9px] px-1.5 py-0.5 rounded-full">I: {r.impact}</span>
                {trendIcon}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const ActionsSection = ({ section, actions }: { section: ReportSection; actions: string[] }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
      <Zap className="h-4 w-4 text-warning" />
      {section.title}
    </h3>
    <div className="space-y-2">
      {actions.map((a, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-primary">{i + 1}</span>
          </div>
          <p className="text-xs text-foreground">{a}</p>
        </div>
      ))}
    </div>
  </div>
);

const SnapshotSection = ({ section, deptScores }: { section: ReportSection; deptScores: { dept: string; score: number }[] }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {deptScores.map(d => {
        const color = d.score >= 85 ? "text-success" : d.score >= 70 ? "text-primary" : "text-warning";
        return (
          <div key={d.dept} className="text-center p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className={`text-lg font-bold ${color}`}>{d.score}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{d.dept}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const ChartSection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{section.content}</p>
    {section.data && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(section.data).filter(([k]) => typeof section.data![k] === "string").map(([key, val]) => (
          <div key={key} className="text-center p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="text-sm font-bold text-foreground">{val as string}</div>
            <div className="text-[9px] text-muted-foreground capitalize mt-0.5">{key.replace(/([A-Z])/g, " $1").trim()}</div>
          </div>
        ))}
      </div>
    )}
    {section.data?.erosionFactors && (
      <div className="space-y-2 mt-3">
        {section.data.erosionFactors.map((f: any) => (
          <div key={f.factor} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs text-foreground">{f.factor}</span>
            <span className={`text-xs font-bold ${f.impact > 0 ? "text-success" : "text-destructive"}`}>{f.impact > 0 ? "+" : ""}{f.impact}%</span>
          </div>
        ))}
      </div>
    )}
    {section.data?.trends && (
      <div className="space-y-3 mt-3">
        {section.data.trends.map((t: any) => (
          <div key={t.metric} className="p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">{t.metric}</span>
              <span className="text-xs text-primary font-bold">{t.values[t.values.length - 1]} {t.unit}</span>
            </div>
            <div className="flex gap-1 h-6 items-end">
              {t.values.map((v: number, i: number) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/40" style={{ height: `${(v / Math.max(...t.values)) * 100}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ForecastSection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
      <Eye className="h-4 w-4 text-primary" />
      {section.title}
    </h3>
    <p className="text-xs text-muted-foreground mb-3">{section.content}</p>
    {section.data?.forecast && (
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/8 border border-primary/20">
            <div className="text-lg font-bold text-primary">{section.data.forecast.revenue}</div>
            <div className="text-[9px] text-muted-foreground">Projeksiyon Gelir</div>
          </div>
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="text-lg font-bold text-foreground">%{section.data.forecast.confidence}</div>
            <div className="text-[9px] text-muted-foreground">Güven</div>
          </div>
        </div>
        {section.data.forecast.risks && (
          <div className="space-y-1.5">
            {section.data.forecast.risks.map((r: string) => (
              <div key={r} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <AlertTriangle className="h-2.5 w-2.5 text-warning shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

const MatrixSection = ({ section, deptScores }: { section: ReportSection; deptScores: { dept: string; score: number }[] }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{section.content}</p>
    <div className="space-y-2">
      {deptScores.map(d => {
        const color = d.score >= 85 ? "bg-success/60" : d.score >= 70 ? "bg-primary/60" : "bg-warning/60";
        return (
          <div key={d.dept} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24">{d.dept}</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${d.score}%` }} />
            </div>
            <span className="text-xs font-bold text-foreground w-8 text-right">{d.score}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const NotesSection = ({ section }: { section: ReportSection }) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
    {section.data?.notes && (
      <div className="space-y-2">
        {section.data.notes.map((n: string, i: number) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-warning/5 border border-warning/15">
            <AlertTriangle className="h-3 w-3 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-foreground">{n}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const renderSection = (section: ReportSection, report: IntelligenceReport) => {
  switch (section.type) {
    case "summary": return <SummarySection section={section} />;
    case "score": return <ScoreSection section={section} />;
    case "metrics": return <MetricsSection section={section} />;
    case "risks": return <RisksSection section={section} />;
    case "actions": return <ActionsSection section={section} actions={report.recommendedActions} />;
    case "snapshot": return <SnapshotSection section={section} deptScores={report.departmentHealthScores} />;
    case "chart": return <ChartSection section={section} />;
    case "forecast": return <ForecastSection section={section} />;
    case "matrix": return <MatrixSection section={section} deptScores={report.departmentHealthScores} />;
    case "notes": return <NotesSection section={section} />;
    default: return <SummarySection section={section} />;
  }
};

const ReportViewer = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const report = reportId ? getReportById(reportId) : null;

  if (!report) return <Navigate to="/reports" />;

  const config = timeframeConfig[report.timeframe];
  const Icon = config.icon;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back nav */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/reports" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
            <ArrowLeft className="h-4 w-4" /> Raporlar
          </Link>
        </motion.div>

        {/* Report header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className="glass-card p-6 mb-6" style={{ borderImage: "linear-gradient(135deg, rgba(30,107,255,0.3), transparent) 1" }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center" style={{ boxShadow: "0 0 24px rgba(30,107,255,0.2)" }}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full badge-info uppercase`}>{config.label}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">{report.agent}</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">{report.title}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{report.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info("PDF indiriliyor.")} className="btn-accent px-3 py-2 text-xs flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
              <button onClick={() => toast.info("Paylaşım bağlantısı kopyalandı.")} className="btn-accent px-3 py-2 text-xs flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Paylaş
              </button>
              <button onClick={() => toast.info("Rapor e-posta ile gönderiliyor.")} className="btn-accent px-3 py-2 text-xs flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Gönder
              </button>
            </div>
          </div>

          {/* Meta strip */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-border/40 flex-wrap">
            <div className="flex items-center gap-2">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground">İstihbarat:</span>
              <span className="text-xs font-bold text-foreground">{report.intelligenceScore}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-success" />
              <span className="text-[11px] text-muted-foreground">Güven:</span>
              <span className="text-xs font-bold text-foreground">%{report.confidenceScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{report.generatedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{report.recipients.join(", ")}</span>
            </div>
          </div>
        </motion.div>

        {/* Core Metrics Strip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Temel Metrikler</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {report.coreMetrics.map(m => (
              <div key={m.label} className="glass-card p-3 text-center">
                <div className="text-sm font-bold text-foreground">{m.value}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{m.label}</div>
                <div className={`text-[10px] font-bold mt-1 ${m.change > 0 ? "text-success" : "text-destructive"}`}>
                  {m.change > 0 ? "+" : ""}{m.change.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Summary Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-6">
          <ReportSocialSummary report={report} />
        </motion.div>

        {/* Report sections */}
        <div className="space-y-4">
          {report.sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.02 }}>
              {renderSection(section, report)}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 glass-card p-5 text-center">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1">AI Workforce OS</p>
          <p className="text-[10px] text-muted-foreground/40">Bu rapor AI istihbarat katmanları tarafından otomatik olarak üretilmiştir.</p>
          <p className="text-[10px] text-muted-foreground/40 mt-1">Güven Endeksi: %{report.confidenceScore} • {report.generatedAt}</p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ReportViewer;
