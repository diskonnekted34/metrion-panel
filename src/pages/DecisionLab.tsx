import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, FileDown, ChevronRight, TrendingUp, TrendingDown,
  ShieldAlert, Lightbulb, Target, AlertTriangle, Minus, Plus,
  BarChart3, DollarSign, PieChart, Activity, Zap, User, Bot, CheckCircle2
} from "lucide-react";
import { pendingDecisions, executivePositions, getModeLabel, getModeColor } from "@/data/executivePositions";
import {
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
  BarChart, Bar, ComposedChart
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── Mock Data ── */
const timeHorizons = [
  { key: "week", label: "Hafta" },
  { key: "month", label: "Ay" },
  { key: "quarter", label: "Çeyrek" },
  { key: "year", label: "Yıl" },
  { key: "5year", label: "5 Yıl" },
];

const generateTrendData = (horizon: string) => {
  const points = horizon === "week" ? 7 : horizon === "month" ? 30 : horizon === "quarter" ? 12 : horizon === "year" ? 12 : 60;
  return Array.from({ length: points }, (_, i) => ({
    period: i + 1,
    revenue: 2400 + Math.sin(i * 0.5) * 400 + i * (horizon === "5year" ? 30 : 15),
    profit: 800 + Math.sin(i * 0.7) * 200 + i * (horizon === "5year" ? 12 : 8),
    margin: 28 + Math.sin(i * 0.3) * 5 + i * 0.2,
    efficiency: 72 + Math.sin(i * 0.4) * 8 + i * 0.3,
    marketingROI: 3.2 + Math.sin(i * 0.6) * 0.8 + i * 0.05,
    cashFlow: 1200 + Math.sin(i * 0.35) * 300 + i * 10,
  }));
};

const generateForecastData = (preset: string) => {
  const multiplier = preset === "aggressive" ? 1.4 : preset === "defensive" ? 0.7 : 1.0;
  return Array.from({ length: 12 }, (_, i) => ({
    period: i + 1,
    revenue: (3000 + i * 50 * multiplier) + (Math.random() - 0.5) * 100,
    revenueHigh: (3000 + i * 50 * multiplier) * 1.15,
    revenueLow: (3000 + i * 50 * multiplier) * 0.85,
    cashPosition: (5000 + i * 80 * multiplier) + (Math.random() - 0.5) * 200,
    netMargin: 25 + i * 0.5 * multiplier + (Math.random() - 0.5) * 2,
    riskProb: Math.max(5, 30 - i * multiplier * 2 + (Math.random() - 0.5) * 5),
  }));
};

const scenarioPresets = [
  { key: "aggressive", label: "Agresif Büyüme", color: "text-emerald-400" },
  { key: "balanced", label: "Dengeli", color: "text-primary" },
  { key: "defensive", label: "Defansif", color: "text-amber-400" },
];

const reportOptions = [
  "Haftalık Yönetim Özeti",
  "Aylık Stratejik Rapor",
  "Çeyreklik Performans",
  "Yıllık Plan",
  "5 Yıllık Projeksiyon Dosyası",
];

const exportFormats = ["PDF", "Sunum Formatı", "Executive Summary"];

/* ── Glow Chart Tooltip ── */
const GlowTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0F1F]/95 border border-primary/20 rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_0_20px_rgba(30,107,255,0.15)]">
      <p className="text-[10px] text-muted-foreground mb-1.5">Dönem {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Metric Mini Card ── */
const MetricMini = ({ label, value, trend, icon: Icon }: { label: string; value: string; trend: "up" | "down" | "flat"; icon: any }) => (
  <div className="flex items-center gap-3 bg-secondary/40 border border-white/[0.04] rounded-xl px-4 py-3">
    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground truncate">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
    {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
    {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
    {trend === "flat" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
  </div>
);

/* ── Simulation Slider ── */
const SimSlider = ({ label, value, onChange, unit, min, max, step }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-bold text-foreground">{value > 0 ? "+" : ""}{value}{unit}</span>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - step))} className="h-6 w-6 rounded-lg bg-secondary border border-white/[0.06] flex items-center justify-center hover:bg-primary/20 transition-colors">
        <Minus className="h-3 w-3" />
      </button>
      <div className="flex-1 relative h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(30,107,255,0.6), rgba(30,107,255,1))",
            boxShadow: "0 0 10px rgba(30,107,255,0.4)",
          }}
          animate={{
            width: `${Math.abs(value - min) / (max - min) * 50}%`,
            x: value >= 0 ? 0 : "-100%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <button onClick={() => onChange(Math.min(max, value + step))} className="h-6 w-6 rounded-lg bg-secondary border border-white/[0.06] flex items-center justify-center hover:bg-primary/20 transition-colors">
        <Plus className="h-3 w-3" />
      </button>
    </div>
  </div>
);

/* ── Main Page ── */
const DecisionLab = () => {
  const [horizon, setHorizon] = useState("quarter");
  const [forecastPreset, setForecastPreset] = useState("balanced");
  const [reportOpen, setReportOpen] = useState(false);

  // Simulation state
  const [simMarketing, setSimMarketing] = useState(0);
  const [simPrice, setSimPrice] = useState(0);
  const [simCost, setSimCost] = useState(0);
  const [simHiring, setSimHiring] = useState(0);
  const [simInventory, setSimInventory] = useState(0);

  const trendData = generateTrendData(horizon);
  const forecastData = generateForecastData(forecastPreset);

  // Sim impact calculation
  const profitImpact = (simMarketing * -0.3 + simPrice * 2.1 + simCost * -1.5 + simHiring * -0.8 + simInventory * 0.4).toFixed(1);
  const cashImpact = (simMarketing * -0.5 + simPrice * 1.8 + simCost * -1.2 + simHiring * -1.0 + simInventory * 0.6).toFixed(1);
  const riskChange = (simMarketing * 0.1 + simPrice * 0.8 + simCost * 0.5 + simHiring * -0.2 + simInventory * -0.3).toFixed(1);
  const growthAccel = (simMarketing * 0.6 + simPrice * -0.4 + simCost * 0.1 + simHiring * 0.3 + simInventory * 0.2).toFixed(1);

  const chartAnimation = {
    initial: { opacity: 0, pathLength: 0 },
    animate: { opacity: 1, pathLength: 1 },
    transition: { duration: 1.5, ease: "easeOut" },
  };

  return (
    <AppLayout>
      <div className="min-h-screen relative" style={{ background: "#05070D" }}>
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(30,107,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(30,107,255,0.15)" }}>
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Karar</h1>
                <p className="text-xs text-muted-foreground">Stratejik Karar Değerlendirme & Simülasyon Motoru</p>
              </div>
              <span className="ml-4 text-[10px] font-medium text-primary/80 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                Analiz Kapsamı: Şirket Geneli
              </span>
            </div>

            {/* Report Button */}
            <div className="relative">
              <button
                onClick={() => setReportOpen(!reportOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-all"
                style={{ boxShadow: "0 0 15px rgba(30,107,255,0.1)" }}
              >
                <FileDown className="h-4 w-4" />
                Stratejik Rapor Üret
              </button>
              <AnimatePresence>
                {reportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-72 bg-[#0A0F1F]/95 border border-white/[0.08] rounded-xl backdrop-blur-xl p-4 space-y-3 z-50"
                    style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                  >
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rapor Türü</p>
                    {reportOptions.map((opt) => (
                      <button key={opt} className="w-full text-left text-xs text-foreground/80 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-primary/40" />
                        {opt}
                      </button>
                    ))}
                    <div className="border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Format</p>
                      <div className="flex gap-2">
                        {exportFormats.map((f) => (
                          <button key={f} className="text-[10px] px-3 py-1.5 rounded-lg border border-white/[0.08] text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SECTION 0 — PENDING DECISIONS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Değerlendirme Bekleyen Kararlar
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning">{pendingDecisions.filter(d => d.status === "pending").length}</span>
            </h2>
            <div className="space-y-2">
              {pendingDecisions.map((dec) => {
                const pos = executivePositions.find(p => p.shortTitle === dec.requiredApprovers[0]);
                const riskColor = dec.riskLevel === "high" ? "text-destructive bg-destructive/10" : dec.riskLevel === "medium" ? "text-warning bg-warning/10" : "text-success bg-success/10";
                return (
                  <div key={dec.id} className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4 hover:border-primary/15 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{dec.title}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${riskColor}`}>
                          {dec.riskLevel === "high" ? "Yüksek Risk" : dec.riskLevel === "medium" ? "Orta Risk" : "Düşük Risk"}
                        </span>
                        {dec.simulationBacked && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Simülasyon Destekli</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1.5">{dec.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>Öncelik: <strong className="text-foreground">{dec.priority}</strong></span>
                        <span>·</span>
                        <span>Etki: <strong className="text-foreground">{dec.impact}</strong></span>
                        <span>·</span>
                        <span>Kaynak: {dec.source}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5">
                        {dec.requiredApprovers.map(approver => {
                          const approverPos = executivePositions.find(p => p.shortTitle === approver);
                          return (
                            <span key={approver} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-secondary border border-border flex items-center gap-1">
                              {approverPos?.assignedHuman ? <User className="h-3 w-3 text-primary" /> : <Bot className="h-3 w-3 text-purple-400" />}
                              {approver}
                            </span>
                          );
                        })}
                      </div>
                      {pos?.assignedHuman ? (
                        <span className="text-[9px] text-primary">Final Yetki: {pos.assignedHuman.name}</span>
                      ) : (
                        <span className="text-[9px] text-purple-400">AI Otopilot Aktif</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 1 — TIME HORIZON SWITCHER */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/30 border border-white/[0.04] w-fit">
            {timeHorizons.map((h) => (
              <button
                key={h.key}
                onClick={() => setHorizon(h.key)}
                className={`relative px-5 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  horizon === h.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {horizon === h.key && (
                  <motion.div
                    layoutId="horizon-active"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    style={{ boxShadow: "0 0 15px rgba(30,107,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{h.label}</span>
              </button>
            ))}
          </div>

          {/* SECTION 2 — PERFORMANS EVRİMİ */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Performans Evrimi
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Gelir Trendi", dataKey: "revenue", color: "#1E6BFF", gradient: "url(#blueGrad)" },
                { title: "Net Kâr", dataKey: "profit", color: "#10B981", gradient: "url(#greenGrad)" },
                { title: "Katkı Marjı", dataKey: "margin", color: "#8B5CF6", gradient: "url(#purpleGrad)" },
                { title: "Operasyonel Verimlilik", dataKey: "efficiency", color: "#F59E0B", gradient: "url(#amberGrad)" },
                { title: "Pazarlama ROI", dataKey: "marketingROI", color: "#EC4899", gradient: "url(#pinkGrad)" },
                { title: "Nakit Akışı", dataKey: "cashFlow", color: "#06B6D4", gradient: "url(#cyanGrad)" },
              ].map((chart) => (
                <motion.div
                  key={chart.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-4 space-y-3"
                  style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">{chart.title}</span>
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id={`grad-${chart.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chart.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="period" hide />
                        <YAxis hide />
                        <RechartsTooltip content={<GlowTooltip />} />
                        <Area
                          type="monotone"
                          dataKey={chart.dataKey}
                          stroke={chart.color}
                          strokeWidth={2}
                          fill={`url(#grad-${chart.dataKey})`}
                          name={chart.title}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Strategic Interpretation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-5"
              style={{ boxShadow: "0 0 30px rgba(30,107,255,0.05)" }}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider">AI Stratejik Yorum</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Son 2 çeyrekte marj artışı maliyet optimizasyonundan kaynaklanıyor. Büyüme ivmesi stabil fakat kanal konsantrasyonu artıyor.
                    Pazarlama ROI'si sabit seyir izlerken operasyonel verimlilik %4.2 artış gösteriyor — bu durum maliyet yapısının sürdürülebilir olduğuna işaret ediyor.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECTION 3 — ÖNGÖRÜ MOTORU */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Öngörü Motoru
              </h2>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/30 border border-white/[0.04]">
                {scenarioPresets.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setForecastPreset(p.key)}
                    className={`px-4 py-1.5 rounded-md text-[11px] font-medium transition-all duration-300 ${
                      forecastPreset === p.key
                        ? `${p.color} bg-white/[0.06] border border-white/[0.08]`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <MetricMini label="Gelir Yörüngesi" value="₺4.2M" trend="up" icon={DollarSign} />
              <MetricMini label="Nakit Pozisyonu" value="₺8.1M" trend="up" icon={BarChart3} />
              <MetricMini label="Net Marj" value="%28.4" trend="flat" icon={PieChart} />
              <MetricMini label="Risk Olasılığı" value="%12" trend="down" icon={ShieldAlert} />
            </div>

            <div className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-5" style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E6BFF" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#1E6BFF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E6BFF" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#1E6BFF" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="period" stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 10 }} />
                    <RechartsTooltip content={<GlowTooltip />} />
                    <Area type="monotone" dataKey="revenueHigh" stroke="none" fill="url(#confidenceGrad)" name="Üst Band" animationDuration={1500} />
                    <Area type="monotone" dataKey="revenueLow" stroke="none" fill="url(#confidenceGrad)" name="Alt Band" animationDuration={1500} />
                    <Area type="monotone" dataKey="revenue" stroke="#1E6BFF" strokeWidth={2} fill="url(#forecastGrad)" name="Gelir Projeksiyonu" animationDuration={2000} animationEasing="ease-out" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3 text-center">Güven aralığı: %85 · Projeksiyon modeli: Bayesian Ensemble</p>
            </div>
          </section>

          {/* SECTION 4 — SENARYO SİMÜLASYONU */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Senaryo Simülasyonu
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-5 space-y-5" style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Değişken Girdiler</p>
                <SimSlider label="Pazarlama Bütçesi" value={simMarketing} onChange={setSimMarketing} unit="%" min={-50} max={50} step={5} />
                <SimSlider label="Fiyat Artışı" value={simPrice} onChange={setSimPrice} unit="%" min={-20} max={30} step={2} />
                <SimSlider label="Maliyet Artışı" value={simCost} onChange={setSimCost} unit="%" min={-10} max={30} step={2} />
                <SimSlider label="İstihdam Genişlemesi" value={simHiring} onChange={setSimHiring} unit=" kişi" min={-10} max={20} step={1} />
                <SimSlider label="Envanter Devir Değişimi" value={simInventory} onChange={setSimInventory} unit="%" min={-30} max={30} step={5} />
              </div>

              {/* Outputs */}
              <div className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-5 space-y-4" style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Simülasyon Çıktısı</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Kâr Etkisi", value: `${Number(profitImpact) >= 0 ? "+" : ""}${profitImpact}%`, positive: Number(profitImpact) >= 0 },
                    { label: "Nakit Etkisi", value: `${Number(cashImpact) >= 0 ? "+" : ""}${cashImpact}%`, positive: Number(cashImpact) >= 0 },
                    { label: "Risk Değişimi", value: `${Number(riskChange) >= 0 ? "+" : ""}${riskChange}%`, positive: Number(riskChange) <= 0 },
                    { label: "Büyüme İvmesi", value: `${Number(growthAccel) >= 0 ? "+" : ""}${growthAccel}%`, positive: Number(growthAccel) >= 0 },
                  ].map((out) => (
                    <motion.div
                      key={out.label}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl border p-4 text-center ${
                        out.positive
                          ? "bg-emerald-500/[0.06] border-emerald-500/20"
                          : "bg-red-500/[0.06] border-red-500/20"
                      }`}
                    >
                      <p className="text-[10px] text-muted-foreground mb-1">{out.label}</p>
                      <p className={`text-lg font-bold ${out.positive ? "text-emerald-400" : "text-red-400"}`}>
                        {out.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-primary/[0.04] border border-primary/10">
                  <p className="text-[10px] text-muted-foreground mb-1">Departmanlar Arası Etki</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Finans", "Pazarlama", "Operasyon", "Teknoloji"].map((dept) => (
                      <span key={dept} className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 border border-white/[0.04] text-muted-foreground">
                        {dept}: <span className="text-foreground font-medium">{(Math.random() * 4 - 2).toFixed(1)}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 — STRATEJİK ÖZET MOTORU */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Bu Dönemin Stratejik Özeti
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  title: "En Doğru Hamle",
                  icon: Target,
                  color: "emerald",
                  text: "Dijital kanal yatırımlarını %15 artırarak müşteri edinme maliyetini düşürmek. Mevcut operasyonel verimlilik kazanımlarını büyüme sermayesine dönüştürmek stratejik avantaj sağlayacak.",
                },
                {
                  title: "En Büyük Risk",
                  icon: AlertTriangle,
                  color: "red",
                  text: "Gelir konsantrasyonu tek kanala doğru yoğunlaşıyor. Mevcut kanalın kesintiye uğraması durumunda gelirin %40'ı risk altında. Kanal diversifikasyonu acil öncelik olmalı.",
                },
                {
                  title: "Önümüzdeki Kritik Karar",
                  icon: ShieldAlert,
                  color: "amber",
                  text: "Q2 bütçe tahsisatı onayı yaklaşıyor. Pazarlama ve teknoloji yatırımları arasındaki denge, yılın ikinci yarısındaki büyüme profilini belirleyecek.",
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-secondary/20 border border-white/[0.04] rounded-2xl p-5 space-y-3 relative overflow-hidden"
                  style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                    card.color === "emerald" ? "from-emerald-500/60 to-emerald-500/0" :
                    card.color === "red" ? "from-red-500/60 to-red-500/0" :
                    "from-amber-500/60 to-amber-500/0"
                  }`} />
                  <div className="flex items-center gap-2">
                    <card.icon className={`h-4 w-4 ${
                      card.color === "emerald" ? "text-emerald-400" :
                      card.color === "red" ? "text-red-400" :
                      "text-amber-400"
                    }`} />
                    <span className="text-xs font-semibold text-foreground">{card.title}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default DecisionLab;
