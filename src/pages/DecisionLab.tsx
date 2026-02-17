import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, ChevronRight, TrendingUp, TrendingDown,
  ShieldAlert, Target, AlertTriangle, Minus,
  BarChart3, DollarSign, Activity, Zap, User, Bot, CheckCircle2,
  XCircle, Clock, Eye, RotateCcw, ArrowRight, Brain, Timer,
  Gauge, LineChart as LineChartIcon, Award, History, X, MessageSquare,
  CalendarClock, Crosshair, Layers, Shield, CircleDot
} from "lucide-react";
import { executivePositions } from "@/data/executivePositions";
import {
  decisions as allDecisions,
  executiveDecisionRecords,
  lifecycleConfig,
  categoryLabels,
  timeSensitivityLabels,
  getDaysSinceAction,
  getPressureLevel,
  type Decision,
  type DecisionLifecycle,
} from "@/data/decisions";
import {
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";

/* ── Tab Definition ── */
type TabId = "pending" | "monitoring" | "completed" | "rejected" | "performance";
const tabs: { id: TabId; label: string; lifecycles: DecisionLifecycle[] }[] = [
  { id: "pending", label: "Bekleyen Kararlar", lifecycles: ["proposed", "under_review", "approved", "in_execution"] },
  { id: "monitoring", label: "İzlemede", lifecycles: ["monitoring"] },
  { id: "completed", label: "Tamamlanan", lifecycles: ["completed"] },
  { id: "rejected", label: "Reddedilen", lifecycles: ["rejected", "failed"] },
  { id: "performance", label: "Performans Analizi", lifecycles: [] },
];

const timeFilters = [
  { key: "week", label: "Hafta" },
  { key: "month", label: "Ay" },
  { key: "quarter", label: "Çeyrek" },
  { key: "year", label: "Yıl" },
  { key: "5year", label: "5 Yıl" },
];

/* ── Pipeline stages ── */
const pipelineStages: { key: DecisionLifecycle; label: string }[] = [
  { key: "proposed", label: "Taslak" },
  { key: "under_review", label: "Onay Bekliyor" },
  { key: "approved", label: "Onaylandı" },
  { key: "monitoring", label: "İzleniyor" },
  { key: "completed", label: "Tamamlandı" },
];

/* ── Glow Tooltip ── */
const GlowTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0F1F]/95 border border-primary/20 rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_0_20px_rgba(30,107,255,0.15)]">
      <p className="text-[10px] text-muted-foreground mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Pressure Badge ── */
const PressureBadge = ({ lastActionDate }: { lastActionDate: string }) => {
  const days = getDaysSinceAction(lastActionDate);
  const level = getPressureLevel(days);
  if (level === "none") return null;
  const styles = {
    low: "bg-amber-500/5 border-amber-500/15 text-amber-400/70",
    medium: "bg-amber-500/10 border-amber-500/25 text-amber-400",
    high: "bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse",
  };
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${styles[level]}`}>
      <Timer className="h-2.5 w-2.5 inline mr-0.5" />{days}g
    </span>
  );
};

/* ── Decision Health Score ── */
const DecisionHealthScore = ({ decisions }: { decisions: Decision[] }) => {
  const total = decisions.length || 1;
  const completed = decisions.filter(d => d.lifecycle === "completed").length;
  const successful = decisions.filter(d => d.performanceReport?.status === "successful").length;
  const avgConfidence = Math.round(decisions.reduce((s, d) => s + d.aiConfidence, 0) / total);
  const score = Math.round((completed / total) * 30 + (successful / Math.max(completed, 1)) * 40 + (avgConfidence / 100) * 30);
  const color = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-destructive";
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="18" cy="18" r="16" fill="none" stroke={score >= 75 ? "#34D399" : score >= 50 ? "#F59E0B" : "#EF4444"} strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground">Karar Sağlık Skoru</p>
        <p className={`text-lg font-bold ${color}`}>{score}/100</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">Tamamlanma, başarı ve AI güven ortalaması</p>
      </div>
    </div>
  );
};

/* ── Impact Matrix (2D) ── */
const ImpactMatrix = ({ decisions, onSelect }: { decisions: Decision[]; onSelect: (d: Decision) => void }) => {
  const getNodeColor = (d: Decision) => {
    if (d.lifecycle === "approved" || d.lifecycle === "completed") return "#34D399";
    if (d.riskLevel === "high") return "#EF4444";
    if (d.lifecycle === "proposed" || d.lifecycle === "under_review") return "#F59E0B";
    return "#1E6BFF";
  };
  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
        <CircleDot className="h-3.5 w-3.5 text-primary" /> Stratejik Etki Matrisi
      </h3>
      <div className="relative h-[240px] border border-white/[0.04] rounded-xl bg-[#060A14]" style={{ backgroundImage: "linear-gradient(rgba(30,107,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
        {/* Axis labels */}
        <span className="absolute -left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-muted-foreground tracking-wider">ETKİ ↑</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground tracking-wider mb-0.5">RİSK →</span>
        {decisions.slice(0, 20).map((d) => {
          const riskX = d.riskLevel === "high" ? 75 + Math.random() * 15 : d.riskLevel === "medium" ? 35 + Math.random() * 25 : 5 + Math.random() * 25;
          const impactY = 100 - (d.priorityScore + Math.random() * 5);
          const color = getNodeColor(d);
          return (
            <motion.button
              key={d.id}
              className="absolute h-4 w-4 rounded-full cursor-pointer z-10 group"
              style={{ left: `${riskX}%`, top: `${impactY}%`, background: color, boxShadow: `0 0 10px ${color}60` }}
              whileHover={{ scale: 1.8 }}
              onClick={() => onSelect(d)}
              title={d.title}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] bg-background/90 px-1.5 py-0.5 rounded border border-white/10 text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{d.title.slice(0, 30)}</span>
            </motion.button>
          );
        })}
        {/* Quadrant labels */}
        <span className="absolute top-2 left-3 text-[8px] text-emerald-400/40">Yüksek Etki / Düşük Risk</span>
        <span className="absolute top-2 right-3 text-[8px] text-destructive/40">Yüksek Etki / Yüksek Risk</span>
        <span className="absolute bottom-2 left-3 text-[8px] text-muted-foreground/30">Düşük Etki / Düşük Risk</span>
        <span className="absolute bottom-2 right-3 text-[8px] text-amber-400/40">Düşük Etki / Yüksek Risk</span>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.04]" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.04]" />
      </div>
    </div>
  );
};

/* ── Pipeline View ── */
const PipelineView = ({ decisions }: { decisions: Decision[] }) => (
  <div className="glass-card p-5">
    <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
      <Layers className="h-3.5 w-3.5 text-primary" /> Karar Pipeline
    </h3>
    <div className="flex gap-2">
      {pipelineStages.map((stage, i) => {
        const count = decisions.filter(d => d.lifecycle === stage.key).length;
        const lc = lifecycleConfig[stage.key];
        return (
          <div key={stage.key} className="flex-1 relative">
            <div className="glass-card p-3 text-center border border-white/[0.04]" style={{ boxShadow: count > 0 ? `inset 0 -2px 0 ${count > 3 ? "rgba(245,158,11,0.4)" : "rgba(30,107,255,0.3)"}` : "none" }}>
              <p className={`text-lg font-bold ${lc.color}`}>{count}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{stage.label}</p>
            </div>
            {i < pipelineStages.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Decision Card (compact) ── */
const DecisionCard = ({ decision, onSelect }: { decision: Decision; onSelect: () => void }) => {
  const lc = lifecycleConfig[decision.lifecycle];
  const riskColor = decision.riskLevel === "high" ? "text-destructive bg-destructive/10" : decision.riskLevel === "medium" ? "text-warning bg-warning/10" : "text-emerald-400 bg-emerald-400/10";
  const isHighRisk = decision.riskLevel === "high";
  const days = getDaysSinceAction(decision.lastActionDate);
  const pressureLevel = getPressureLevel(days);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`glass-card p-4 cursor-pointer group relative overflow-hidden ${isHighRisk ? "border-destructive/15" : ""} ${pressureLevel === "high" ? "shadow-[0_0_20px_rgba(245,158,11,0.08)]" : ""}`}
      style={isHighRisk ? { boxShadow: "0 0 15px rgba(239,68,68,0.06), inset 0 0 0 1px rgba(239,68,68,0.08)" } : undefined}
    >
      {isHighRisk && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-destructive/40 to-transparent" />}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">{decision.title}</h3>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lc.bg} ${lc.color}`}>{lc.label}</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${riskColor}`}>{decision.riskLevel === "high" ? "Yüksek Risk" : decision.riskLevel === "medium" ? "Orta Risk" : "Düşük Risk"}</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{categoryLabels[decision.category]}</span>
            {decision.department && <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/70 border border-primary/10">{decision.department.toUpperCase()}</span>}
            <PressureBadge lastActionDate={decision.lastActionDate} />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{decision.description}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Crosshair className="h-3 w-3" />P: <strong className="text-foreground">{decision.priorityScore}</strong></span>
            <span>·</span>
            <span className="flex items-center gap-1"><Brain className="h-3 w-3" />AI: <strong className={decision.aiConfidence >= 85 ? "text-emerald-400" : "text-primary"}>{decision.aiConfidence}%</strong></span>
            <span>·</span>
            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-emerald-400" />{decision.estimatedFinancialImpact.split("·")[0].trim().slice(0, 30)}</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-warning/5 border border-warning/10">
            <AlertTriangle className="h-2.5 w-2.5 text-warning shrink-0" />
            <span className="text-[9px] text-warning">
              {decision.decisionDelayRisk.days}g içinde kayıp: <strong>{decision.decisionDelayRisk.estimatedLoss}</strong>
            </span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5 min-w-[100px]">
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${decision.aiConfidence >= 90 ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : decision.aiConfidence >= 75 ? "bg-primary/10 text-primary border-primary/20" : "bg-warning/10 text-warning border-warning/20"}`}>
            AI %{decision.aiConfidence}
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {decision.requiredApprovers.slice(0, 2).map(a => (
              <span key={a} className="text-[8px] font-medium px-1.5 py-0.5 rounded-lg bg-secondary border border-border">{a}</span>
            ))}
            {decision.requiredApprovers.length > 2 && <span className="text-[8px] text-muted-foreground">+{decision.requiredApprovers.length - 2}</span>}
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
};

/* ── Decision Detail Drawer ── */
const DecisionDetailView = ({ decision, onBack }: { decision: Decision; onBack: () => void }) => {
  const [activeSection, setActiveSection] = useState<"context" | "simulation" | "approval" | "monitoring" | "outcome">("context");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const lc = lifecycleConfig[decision.lifecycle];
  const ts = timeSensitivityLabels[decision.timeSensitivity];

  const sections = [
    { id: "context" as const, label: "Stratejik Bağlam", icon: Brain },
    { id: "simulation" as const, label: "Simülasyon", icon: LineChartIcon },
    { id: "approval" as const, label: "Onay Akışı", icon: CheckCircle2 },
    { id: "monitoring" as const, label: "İzleme", icon: Activity },
    { id: "outcome" as const, label: "Sonuç", icon: Award },
  ];

  const scenarioData = Array.from({ length: 12 }, (_, i) => ({
    month: `Ay ${i + 1}`,
    best: 100 + i * (decision.priorityScore / 8) + Math.sin(i) * 10,
    base: 100 + i * (decision.priorityScore / 12),
    worst: 100 + i * (decision.priorityScore / 20) - Math.abs(Math.sin(i)) * 8,
  }));

  return (
    <div className="min-h-screen relative" style={{ background: "#05070D" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(30,107,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative z-10 px-6 py-6 max-w-[1200px] mx-auto space-y-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight className="h-3 w-3 rotate-180" /> Kararlara Dön
        </button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${lc.bg} ${lc.color}`}>{lc.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{categoryLabels[decision.category]}</span>
              {decision.department && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">{decision.department.toUpperCase()}</span>}
            </div>
            <h1 className="text-xl font-bold text-foreground">{decision.title}</h1>
            <p className="text-sm text-muted-foreground">{decision.description}</p>
          </div>
          {(decision.lifecycle === "proposed" || decision.lifecycle === "under_review") && (
            <div className="flex gap-2 shrink-0">
              <button className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Onayla</button>
              <button className="px-3 py-2 rounded-xl border border-primary/30 text-xs text-primary hover:bg-primary/10 transition-colors"><RotateCcw className="h-3.5 w-3.5" /></button>
              <button className="px-3 py-2 rounded-xl border border-warning/30 text-xs text-warning hover:bg-warning/10 transition-colors"><Clock className="h-3.5 w-3.5" /></button>
              <button onClick={() => setShowRejectModal(true)} className="px-3 py-2 rounded-xl border border-destructive/30 text-xs text-destructive hover:bg-destructive/10 transition-colors"><XCircle className="h-3.5 w-3.5" /></button>
            </div>
          )}
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-6 gap-2">
          {[
            { label: "Öncelik", value: `${decision.priorityScore}`, icon: Crosshair },
            { label: "AI Güven", value: `%${decision.aiConfidence}`, icon: Brain },
            { label: "Simülasyon", value: `%${decision.simulationStrength}`, icon: Gauge },
            { label: "Finansal Etki", value: decision.estimatedFinancialImpact.split("·")[0].trim().slice(0, 18), icon: DollarSign },
            { label: "Hassasiyet", value: ts.label, icon: CalendarClock },
            { label: "Gecikme Riski", value: decision.decisionDelayRisk.estimatedLoss, icon: AlertTriangle },
          ].map(m => (
            <div key={m.label} className="glass-card p-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                <m.icon className="h-3 w-3 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-muted-foreground">{m.label}</p>
                <p className="text-[11px] font-bold text-foreground truncate">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary/30 border border-white/[0.04]">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${activeSection === s.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"}`}
            >
              <s.icon className="h-3 w-3" />{s.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {activeSection === "context" && (
              <div className="space-y-4">
                <div className="glass-card p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> AI Gerekçesi</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{decision.aiReasoning}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5 space-y-3">
                    <h3 className="text-xs font-semibold text-foreground">Veri Kaynakları</h3>
                    <div className="flex flex-wrap gap-2">
                      {decision.dataSources.map(ds => (
                        <span key={ds} className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary">{ds}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-5 space-y-3">
                    <h3 className="text-xs font-semibold text-foreground">Model Gerekçesi</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{decision.modelReasoning}</p>
                  </div>
                </div>
                {decision.kpiAttachment && (
                  <div className="glass-card p-4">
                    <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">KPI Bağlantısı</h3>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="text-foreground font-medium">{decision.kpiAttachment.primary.name}</span>
                      <span className="text-muted-foreground">Baz: <strong className="text-foreground">{decision.kpiAttachment.primary.baseline}{decision.kpiAttachment.primary.unit}</strong></span>
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Hedef: <strong className="text-emerald-400">{decision.kpiAttachment.primary.target}{decision.kpiAttachment.primary.unit}</strong></span>
                      <span className="text-muted-foreground">· İzleme: <strong className="text-foreground">{decision.kpiAttachment.monitoringDuration}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "simulation" && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-foreground">3 Senaryo Karşılaştırma</h3>
                    <span className="text-[9px] text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/15">Güven: %{decision.simulationStrength}</span>
                  </div>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={scenarioData}>
                        <defs>
                          <linearGradient id="bestGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34D399" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9 }} />
                        <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9 }} />
                        <RechartsTooltip content={<GlowTooltip />} />
                        <Area type="monotone" dataKey="best" stroke="#34D399" strokeWidth={2} fill="url(#bestGrad)" name="En İyi" />
                        <Area type="monotone" dataKey="base" stroke="#1E6BFF" strokeWidth={2} fill="none" name="Temel" />
                        <Area type="monotone" dataKey="worst" stroke="#EF4444" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="En Kötü" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-4 text-center border-t-2 border-emerald-400/30">
                    <p className="text-[9px] text-muted-foreground mb-1">En İyi Senaryo</p>
                    <p className="text-sm font-bold text-emerald-400">{decision.estimatedFinancialImpact.split("·")[0].trim()}</p>
                  </div>
                  <div className="glass-card p-4 text-center border-t-2 border-primary/30">
                    <p className="text-[9px] text-muted-foreground mb-1">Temel Senaryo</p>
                    <p className="text-sm font-bold text-primary">{decision.estimatedKPIImpact.split("·")[0].trim()}</p>
                  </div>
                  <div className="glass-card p-4 text-center border-t-2 border-destructive/30">
                    <p className="text-[9px] text-muted-foreground mb-1">En Kötü Senaryo</p>
                    <p className="text-sm font-bold text-destructive">Kayıp: {decision.decisionDelayRisk.estimatedLoss}</p>
                  </div>
                </div>
                <button className="w-full glass-card p-3 text-xs text-primary font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                  <Gauge className="h-3.5 w-3.5" /> Simülasyona Gönder
                </button>
              </div>
            )}

            {activeSection === "approval" && (
              <div className="space-y-4">
                <div className="glass-card p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-foreground">Gerekli Onaylar</h3>
                  <div className="flex gap-3">
                    {decision.requiredApprovers.map(approver => {
                      const pos = executivePositions.find(p => p.shortTitle === approver);
                      return (
                        <div key={approver} className="glass-card p-3 flex items-center gap-3 flex-1">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            {pos?.assignedHuman ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-purple-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{approver}</p>
                            <p className="text-[10px] text-muted-foreground">{pos?.assignedHuman ? pos.assignedHuman.name : "Otopilot"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {decision.overrideEvents.length > 0 && (
                  <div className="glass-card p-5 space-y-3">
                    <h3 className="text-xs font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Override Olayları</h3>
                    {decision.overrideEvents.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/10">
                        <Clock className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-warning font-medium">{ev.user} · {new Date(ev.date).toLocaleDateString("tr-TR")}</p>
                          <p className="text-[10px] text-muted-foreground">{ev.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "monitoring" && (
              <div className="space-y-4">
                {decision.monitoringData && decision.monitoringData.length > 0 ? (
                  <>
                    <div className="glass-card p-5">
                      <h3 className="text-xs font-semibold text-foreground mb-4">KPI Değişim Grafiği</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={decision.monitoringData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9 }} />
                            <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9 }} />
                            <RechartsTooltip content={<GlowTooltip />} />
                            <Line type="monotone" dataKey="primaryKPIValue" stroke="#1E6BFF" strokeWidth={2} dot={{ fill: "#1E6BFF", r: 3 }} name="Gerçekleşen" />
                            <Line type="monotone" dataKey="projectedValue" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Projeksiyon" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {decision.monitoringData.filter(m => m.aiComment).map((m, i) => (
                        <div key={i} className="glass-card p-3 flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-foreground font-medium">{m.date} · Sapma: {m.deviation.toFixed(1)}%</p>
                            <p className="text-[10px] text-muted-foreground">{m.aiComment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">İzleme verisi henüz mevcut değil.</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === "outcome" && (
              <div className="space-y-4">
                {decision.performanceReport ? (
                  <>
                    <div className="glass-card p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xs font-semibold text-foreground">Karar Performans Raporu</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${decision.performanceReport.status === "successful" ? "bg-emerald-400/10 text-emerald-400" : decision.performanceReport.status === "partially_successful" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                          {decision.performanceReport.status === "successful" ? "Başarılı" : decision.performanceReport.status === "partially_successful" ? "Kısmen Başarılı" : "Başarısız"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><p className="text-[9px] text-muted-foreground">Beklenen Etki</p><p className="text-xs text-foreground">{decision.performanceReport.expectedImpact}</p></div>
                        <div className="space-y-1"><p className="text-[9px] text-muted-foreground">Gerçekleşen</p><p className="text-xs text-foreground">{decision.performanceReport.actualImpact}</p></div>
                        <div className="space-y-1"><p className="text-[9px] text-muted-foreground">Sapma</p><p className={`text-xs font-bold ${decision.performanceReport.variancePercent <= 0 ? "text-warning" : "text-emerald-400"}`}>{decision.performanceReport.variancePercent > 0 ? "+" : ""}{decision.performanceReport.variancePercent}%</p></div>
                        <div className="space-y-1"><p className="text-[9px] text-muted-foreground">AI Tahmin Doğruluğu</p><p className="text-xs font-bold text-primary">%{decision.performanceReport.aiPredictionAccuracy}</p></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="glass-card p-3 space-y-1"><p className="text-[9px] text-muted-foreground">Finansal</p><p className="text-[10px] text-foreground">{decision.performanceReport.financialOutcome}</p></div>
                      <div className="glass-card p-3 space-y-1"><p className="text-[9px] text-muted-foreground">Stratejik</p><p className="text-[10px] text-foreground">{decision.performanceReport.strategicOutcome}</p></div>
                      <div className="glass-card p-3 space-y-1"><p className="text-[9px] text-muted-foreground">Risk</p><p className="text-[10px] text-foreground">{decision.performanceReport.riskOutcome}</p></div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Performans raporu henüz oluşturulmadı.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {decision.aiCounterArgument && (
          <div className="glass-card p-5 border-warning/20 space-y-2" style={{ boxShadow: "0 0 20px rgba(245,158,11,0.08)" }}>
            <h3 className="text-xs font-semibold text-warning flex items-center gap-2"><Brain className="h-4 w-4" /> AI Karşı Argüman</h3>
            <p className="text-[11px] text-foreground/80 leading-relaxed">{decision.aiCounterArgument}</p>
          </div>
        )}

        {decision.rejectionReason && (
          <div className="glass-card p-5 border-destructive/20 space-y-2">
            <h3 className="text-xs font-semibold text-destructive flex items-center gap-2"><XCircle className="h-4 w-4" /> Red Gerekçesi</h3>
            <p className="text-[11px] text-muted-foreground">{decision.rejectionReason}</p>
          </div>
        )}

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#0A0F1F] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Karar Reddi</h3>
                  <button onClick={() => setShowRejectModal(false)} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                {decision.riskLevel === "high" && (
                  <div className="p-3 rounded-xl bg-warning/5 border border-warning/15">
                    <p className="text-[10px] text-warning flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> Yüksek riskli karar. AI karşı argüman oluşturulacak.</p>
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1.5 block">Red Gerekçesi (Zorunlu)</label>
                  <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full h-24 bg-secondary/50 border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/30" placeholder="Kararı neden reddettiğinizi açıklayın..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors">İptal</button>
                  <button disabled={!rejectReason.trim()} className="btn-primary px-4 py-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" /> Reddet
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Karar Sicili (Executive Decision Records) ── */
const KararSicili = () => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
      <Award className="h-4 w-4 text-primary" /> Karar Sicili
    </h3>
    <div className="space-y-2">
      {executiveDecisionRecords.map(rec => (
        <div key={rec.seatId} className="glass-card p-4 flex items-center gap-4">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">{rec.name}</p>
            <p className="text-[10px] text-muted-foreground">{rec.totalDecisions} karar · %{rec.successRate} başarı</p>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="text-center"><p className="text-muted-foreground">Sapma</p><p className={`font-bold ${rec.avgVariance <= -5 ? "text-warning" : "text-foreground"}`}>{rec.avgVariance}%</p></div>
            <div className="text-center"><p className="text-muted-foreground">Override</p><p className={`font-bold ${rec.overrideFrequency > 10 ? "text-warning" : "text-foreground"}`}>{rec.overrideFrequency}%</p></div>
            <div className="text-center"><p className="text-muted-foreground">AI Uyum</p><p className={`font-bold ${rec.aiAlignmentScore >= 85 ? "text-emerald-400" : rec.aiAlignmentScore >= 70 ? "text-primary" : "text-warning"}`}>%{rec.aiAlignmentScore}</p></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Pressure Banner ── */
const PressureBanner = ({ decisions }: { decisions: Decision[] }) => {
  const delayedHigh = decisions.filter(d => (d.lifecycle === "proposed" || d.lifecycle === "under_review") && getDaysSinceAction(d.lastActionDate) >= 3);
  if (delayedHigh.length === 0) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/15 animate-pulse">
      <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
      <p className="text-xs text-warning font-medium">{delayedHigh.length} yüksek etkili karar 3+ gündür bekliyor</p>
    </div>
  );
};

/* ════════════════════════ MAIN PAGE ════════════════════════ */
const DecisionLab = () => {
  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const [timeFilter, setTimeFilter] = useState("quarter");
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const pendingCount = allDecisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review").length;
  const highRiskCount = allDecisions.filter(d => d.riskLevel === "high" && (d.lifecycle === "proposed" || d.lifecycle === "under_review")).length;
  const activeCount = allDecisions.filter(d => !["completed", "rejected", "failed"].includes(d.lifecycle)).length;
  const approvalPending = allDecisions.filter(d => d.lifecycle === "proposed" || d.lifecycle === "under_review").length;
  const totalFinancialImpact = "₺12.8M";

  if (selectedDecision) {
    return (
      <AppLayout>
        <DecisionDetailView decision={selectedDecision} onBack={() => setSelectedDecision(null)} />
      </AppLayout>
    );
  }

  const filteredDecisions = activeTab === "performance" ? [] : allDecisions.filter(d => tabs.find(t => t.id === activeTab)?.lifecycles.includes(d.lifecycle));

  return (
    <AppLayout>
      <div className="min-h-screen relative" style={{ background: "#05070D" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(30,107,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 px-6 py-6 space-y-4 max-w-[1400px] mx-auto">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center" style={{ boxShadow: "0 0 24px rgba(30,107,255,0.2)" }}>
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground tracking-tight">Karar</h1>
                  <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold flex items-center justify-center border border-warning/30" style={{ boxShadow: "0 0 8px rgba(245,158,11,0.25)" }}>{pendingCount}</span>
                  {highRiskCount > 0 && (
                    <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold flex items-center justify-center border border-destructive/30" style={{ boxShadow: "0 0 8px rgba(239,68,68,0.25)" }}>{highRiskCount}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Stratejik Karar Yönetim Alanı</p>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/30 border border-white/[0.04]">
              {timeFilters.map(tf => (
                <button key={tf.key} onClick={() => setTimeFilter(tf.key)} className={`relative px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${timeFilter === tf.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {timeFilter === tf.key && <motion.div layoutId="time-filter-active" className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20" style={{ boxShadow: "0 0 12px rgba(30,107,255,0.12)" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative z-10">{tf.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── DECISION CONTROL PANEL ── */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Aktif Karar", value: activeCount.toString(), icon: Scale, accent: "text-primary" },
              { label: "Onay Bekleyen", value: approvalPending.toString(), icon: Clock, accent: "text-warning" },
              { label: "Yüksek Riskli", value: highRiskCount.toString(), icon: ShieldAlert, accent: "text-destructive" },
              { label: "Tahmini Finansal Etki", value: totalFinancialImpact, icon: DollarSign, accent: "text-emerald-400" },
            ].map(m => (
              <div key={m.label} className="glass-card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(30,107,255,0.08)" }}>
                  <m.icon className={`h-4 w-4 ${m.accent}`} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className={`text-lg font-bold ${m.accent}`}>{m.value}</p>
                </div>
              </div>
            ))}
            <DecisionHealthScore decisions={allDecisions} />
          </div>

          {/* ── IMPACT MATRIX + PIPELINE ── */}
          <div className="grid grid-cols-2 gap-4">
            <ImpactMatrix decisions={allDecisions} onSelect={setSelectedDecision} />
            <PipelineView decisions={allDecisions} />
          </div>

          {/* ── PRESSURE BANNER ── */}
          <PressureBanner decisions={allDecisions} />

          {/* ── TABS ── */}
          <div className="flex gap-1 p-1 rounded-xl bg-secondary/30 border border-white/[0.04]">
            {tabs.map(tab => {
              const count = tab.id === "pending" ? pendingCount : tab.id === "performance" ? 0 : allDecisions.filter(d => tab.lifecycles.includes(d.lifecycle)).length;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab.label}
                  {count > 0 && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${tab.id === "pending" ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground"}`}>{count}</span>}
                </button>
              );
            })}
          </div>

          {/* ── CONTENT ── */}
          {activeTab === "performance" ? (
            <KararSicili />
          ) : (
            <div className="space-y-2">
              {filteredDecisions.length === 0 ? (
                <div className="text-center py-16">
                  <Scale className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Bu kategoride karar bulunmuyor.</p>
                </div>
              ) : (
                filteredDecisions
                  .sort((a, b) => b.priorityScore - a.priorityScore)
                  .map(dec => (
                    <DecisionCard key={dec.id} decision={dec} onSelect={() => setSelectedDecision(dec)} />
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DecisionLab;
