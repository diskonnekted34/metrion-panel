import { motion } from "framer-motion";
import { MetricIntelligence } from "@/data/intelligenceMetrics";
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Zap } from "lucide-react";

interface Props {
  metric: MetricIntelligence;
}

// ─── BREAKDOWN CONFIG MAPPING ────────────────────────────────────────
interface BreakdownConfig {
  title: string;
  type: "revenue-sources" | "service-stability" | "sku-risk" | "channel-efficiency" | "cash-waterfall" | "platform-profitability" | "risk-distribution" | "creative-performance" | "generic";
}

function getBreakdownConfig(metric: MetricIntelligence): BreakdownConfig {
  const { departmentId, id } = metric;

  const configMap: Record<string, Record<string, BreakdownConfig>> = {
    executive: {
      "executive-metric-0": { title: "Gelir Kaynak Dağılımı", type: "revenue-sources" },
      "executive-metric-1": { title: "Skor Boyut Kırılımı", type: "generic" },
      "executive-metric-2": { title: "Nakit Akış Bileşenleri", type: "cash-waterfall" },
      "executive-metric-3": { title: "Risk Alan Dağılımı", type: "risk-distribution" },
    },
    technology: {
      "technology-metric-0": { title: "Servis Bazlı Stabilite Profili", type: "service-stability" },
      "technology-metric-1": { title: "Borç Kategori Profili", type: "generic" },
      "technology-metric-2": { title: "Veri Kalitesi Boyut Kırılımı", type: "generic" },
      "technology-metric-3": { title: "Güvenlik Risk Profili", type: "service-stability" },
    },
    marketing: {
      "marketing-metric-0": { title: "Kanal Verimlilik Matrisi", type: "channel-efficiency" },
      "marketing-metric-1": { title: "Kanal Verimlilik Matrisi", type: "channel-efficiency" },
      "marketing-metric-2": { title: "Kanal Performans Kırılımı", type: "channel-efficiency" },
      "marketing-metric-3": { title: "Ölçeklendirme Risk Kırılımı", type: "generic" },
    },
    finance: {
      "finance-metric-0": { title: "Marj Bileşen Analizi", type: "cash-waterfall" },
      "finance-metric-1": { title: "Nakit Akış Bileşenleri", type: "cash-waterfall" },
      "finance-metric-2": { title: "Maliyet Yapısı Kırılımı", type: "cash-waterfall" },
      "finance-metric-3": { title: "Kanal Kârlılık Profili", type: "platform-profitability" },
    },
    operations: {
      "operations-metric-0": { title: "SKU Hız Profili", type: "sku-risk" },
      "operations-metric-1": { title: "SKU Risk Profili", type: "sku-risk" },
      "operations-metric-2": { title: "SLA Kanal Kırılımı", type: "service-stability" },
      "operations-metric-3": { title: "Maliyet Bileşen Analizi", type: "cash-waterfall" },
    },
    creative: {
      "creative-metric-0": { title: "Kreatif Performans Profili", type: "creative-performance" },
      "creative-metric-1": { title: "Format Dayanıklılık Kırılımı", type: "creative-performance" },
      "creative-metric-2": { title: "Kanal Tutarlılık Kırılımı", type: "generic" },
      "creative-metric-3": { title: "Konsept × Metrik Matrisi", type: "creative-performance" },
    },
    marketplace: {
      "marketplace-metric-0": { title: "Platform Kârlılık Profili", type: "platform-profitability" },
      "marketplace-metric-1": { title: "Maliyet Yapısı Kırılımı", type: "cash-waterfall" },
      "marketplace-metric-2": { title: "SKU Performans Profili", type: "sku-risk" },
      "marketplace-metric-3": { title: "Envanter Denge Profili", type: "platform-profitability" },
    },
    legal: {
      "legal-metric-0": { title: "Uyum Kuyruğu Kırılımı", type: "risk-distribution" },
      "legal-metric-1": { title: "Risk Alanı Dağılımı", type: "risk-distribution" },
      "legal-metric-2": { title: "SLA Kategori Kırılımı", type: "service-stability" },
      "legal-metric-3": { title: "Olay Kategori Kırılımı", type: "risk-distribution" },
    },
  };

  return configMap[departmentId]?.[id] || { title: "Segment Kırılımı", type: "generic" };
}

// ─── REVENUE SOURCES (Stacked Horizontal Bars) ──────────────────────
const RevenueSourcesBreakdown = ({ metric }: Props) => {
  const maxVal = Math.max(...metric.segments.map(s => s.value));
  const total = metric.segments.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-2.5">
      {metric.segments.map((seg) => {
        const pct = ((seg.value / total) * 100).toFixed(1);
        const growthColor = seg.change >= 0 ? "text-success" : "text-destructive";
        const riskLevel = seg.change < -5 ? "high" : seg.change < 0 ? "medium" : "low";
        return (
          <div key={seg.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{seg.label}</span>
                {riskLevel === "high" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Yüksek Risk</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-muted-foreground">{pct}% katkı</span>
                <span className={`font-semibold ${growthColor}`}>{seg.change >= 0 ? "+" : ""}{seg.change}%</span>
              </div>
            </div>
            <div className="relative h-5 rounded-lg bg-secondary/30 overflow-hidden">
              {/* Contribution margin inner bar */}
              <div
                className="absolute inset-y-0 left-0 rounded-lg bg-primary/20 transition-all duration-500"
                style={{ width: `${(seg.value / maxVal) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-lg bg-primary/60 transition-all duration-500"
                style={{ width: `${(seg.value / maxVal) * 100 * 0.65}%` }}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <span className="text-[10px] font-bold text-foreground">{seg.value.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-1.5 border-t border-border/30 text-[10px] text-muted-foreground">
        <span>■ Katkı marjı</span>
        <span>■ Brüt gelir</span>
      </div>
    </div>
  );
};

// ─── SERVICE STABILITY (Health bars + MTTR) ─────────────────────────
const ServiceStabilityBreakdown = ({ metric }: Props) => {
  return (
    <div className="space-y-2">
      {metric.segments.map((seg) => {
        const healthColor =
          seg.value >= 99.9 ? "bg-success" :
          seg.value >= 99.5 ? "bg-warning" :
          seg.value >= 90 ? "bg-primary" :
          "bg-destructive";
        const statusLabel =
          seg.value >= 99.9 ? "Sağlıklı" :
          seg.value >= 99.5 ? "Dikkat" :
          seg.value >= 90 ? "Orta" :
          seg.value >= 5 ? "Normal" :
          "Kritik";
        const isPercentage = seg.value > 50;

        return (
          <div key={seg.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
            <div className={`h-8 w-1.5 rounded-full ${healthColor}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{seg.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    statusLabel === "Sağlıklı" ? "bg-success/10 text-success" :
                    statusLabel === "Dikkat" ? "bg-warning/10 text-warning" :
                    statusLabel === "Kritik" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${healthColor} transition-all`}
                    style={{ width: `${isPercentage ? Math.min(((seg.value - 99) / 1) * 100, 100) : Math.min(seg.value * 10, 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-foreground w-16 text-right">
                  {isPercentage ? `${seg.value}%` : seg.value}
                </span>
                <span className={`text-[10px] font-medium w-10 text-right ${seg.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {seg.change >= 0 ? "+" : ""}{seg.change}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── SKU RISK (Risk heatmap + ABC classification) ───────────────────
const SkuRiskBreakdown = ({ metric }: Props) => {
  const abcClasses = ["A", "B", "C", "D"];
  const maxVal = Math.max(...metric.segments.map(s => s.value));

  return (
    <div className="space-y-2">
      {metric.segments.map((seg, i) => {
        const abc = abcClasses[i] || "D";
        const riskLevel = seg.change > 10 ? "high" : seg.change > 0 ? "medium" : "low";
        const riskColor = riskLevel === "high" ? "bg-destructive/15 border-destructive/20" :
                          riskLevel === "medium" ? "bg-warning/10 border-warning/15" :
                          "bg-success/10 border-success/15";
        const abcColor = abc === "A" ? "bg-success text-success-foreground" :
                         abc === "B" ? "bg-primary text-primary-foreground" :
                         abc === "C" ? "bg-warning text-warning-foreground" :
                         "bg-destructive text-destructive-foreground";

        return (
          <div key={seg.label} className={`flex items-center gap-3 p-2.5 rounded-xl border ${riskColor}`}>
            <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${abcColor}`}>
              {abc}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{seg.label}</span>
                <div className="flex items-center gap-2">
                  {riskLevel === "high" && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  <span className="text-[11px] font-semibold text-foreground">{seg.value}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      riskLevel === "high" ? "bg-destructive" : riskLevel === "medium" ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: `${(seg.value / maxVal) * 100}%` }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${seg.change >= 0 ? "text-destructive" : "text-success"}`}>
                  {seg.change >= 0 ? "↑" : "↓"} {Math.abs(seg.change)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3 pt-1 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success" /> A: Yüksek Hız</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" /> B: Orta</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warning" /> C: Düşük</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-destructive" /> D: Kritik</span>
      </div>
    </div>
  );
};

// ─── CHANNEL EFFICIENCY (Bubble-like chart) ─────────────────────────
const ChannelEfficiencyBreakdown = ({ metric }: Props) => {
  const maxVal = Math.max(...metric.segments.map(s => s.value));

  return (
    <div className="space-y-3">
      {/* Axis labels */}
      <div className="flex items-center justify-between text-[9px] text-muted-foreground px-1">
        <span>Kanal</span>
        <div className="flex items-center gap-4">
          <span>Harcama Payı</span>
          <span>Verimlilik</span>
          <span>Büyüme</span>
        </div>
      </div>
      {metric.segments.map((seg) => {
        const efficiency = seg.value;
        const effColor = efficiency >= 80 ? "text-success" : efficiency >= 50 ? "text-warning" : "text-destructive";
        const bubbleSize = Math.max(16, Math.min(36, (seg.value / maxVal) * 36));
        const growthColor = seg.change >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive";

        return (
          <div key={seg.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
            {/* Bubble indicator */}
            <div
              className="rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0"
              style={{ width: bubbleSize, height: bubbleSize }}
            >
              <span className="text-[8px] font-bold text-primary">{seg.value}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-foreground">{seg.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Efficiency bar */}
              <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    efficiency >= 80 ? "bg-success" : efficiency >= 50 ? "bg-warning" : "bg-destructive"
                  }`}
                  style={{ width: `${(efficiency / maxVal) * 100}%` }}
                />
              </div>
              <span className={`text-[10px] font-semibold w-8 text-right ${effColor}`}>{efficiency}</span>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${growthColor}`}>
                {seg.change >= 0 ? "+" : ""}{seg.change}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── CASH WATERFALL ─────────────────────────────────────────────────
const CashWaterfallBreakdown = ({ metric }: Props) => {
  const total = metric.segments.reduce((a, b) => a + Math.abs(b.value), 0);
  let cumulative = 0;

  return (
    <div className="space-y-1.5">
      {metric.segments.map((seg, i) => {
        const isNegative = seg.value < 0;
        const absVal = Math.abs(seg.value);
        const pct = (absVal / total) * 100;
        cumulative += seg.value;

        return (
          <div key={seg.label} className="space-y-0.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {isNegative ? (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-success" />
                )}
                <span className="font-medium text-foreground">{seg.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-semibold ${isNegative ? "text-destructive" : "text-success"}`}>
                  {isNegative ? "-" : "+"}{absVal.toLocaleString()}
                </span>
                <span className={`text-[10px] font-medium ${seg.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {seg.change >= 0 ? "+" : ""}{seg.change}%
                </span>
              </div>
            </div>
            <div className="h-4 rounded-lg bg-secondary/20 overflow-hidden relative">
              {/* Waterfall offset */}
              <div
                className={`absolute inset-y-0 rounded-lg transition-all duration-500 ${
                  isNegative ? "bg-destructive/30" : "bg-success/30"
                }`}
                style={{
                  left: isNegative ? `${((cumulative - seg.value) / total) * 100 * 0.6}%` : `${((cumulative - seg.value) / total) * 100 * 0.6}%`,
                  width: `${pct * 0.8}%`,
                }}
              />
              <div
                className={`absolute inset-y-0 rounded-lg transition-all duration-500 ${
                  isNegative ? "bg-destructive/60" : "bg-success/60"
                }`}
                style={{
                  left: isNegative ? `${((cumulative - seg.value) / total) * 100 * 0.6}%` : `${((cumulative - seg.value) / total) * 100 * 0.6}%`,
                  width: `${pct * 0.5}%`,
                }}
              />
            </div>
          </div>
        );
      })}
      {/* Net total */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
        <span className="font-semibold text-foreground">Net Toplam</span>
        <span className={`font-bold ${cumulative >= 0 ? "text-success" : "text-destructive"}`}>
          {cumulative >= 0 ? "+" : ""}{cumulative.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ─── PLATFORM PROFITABILITY (Column bars) ───────────────────────────
const PlatformProfitabilityBreakdown = ({ metric }: Props) => {
  const maxVal = Math.max(...metric.segments.map(s => s.value));

  return (
    <div className="space-y-3">
      {/* Visual columns */}
      <div className="flex items-end justify-around gap-2 h-28 px-2">
        {metric.segments.map((seg) => {
          const height = (seg.value / maxVal) * 100;
          const barColor = seg.change >= 0 ? "bg-primary" : "bg-destructive/70";

          return (
            <div key={seg.label} className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-[10px] font-bold ${seg.change >= 0 ? "text-success" : "text-destructive"}`}>
                {seg.change >= 0 ? "+" : ""}{seg.change}%
              </span>
              <div className="w-full max-w-[48px] relative rounded-t-lg overflow-hidden bg-secondary/30" style={{ height: "100%" }}>
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${barColor} transition-all duration-500`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-semibold text-foreground block">{seg.value}%</span>
                <span className="text-[9px] text-muted-foreground">{seg.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
        <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> Komisyon + Fulfillment + İade etkisi dahil</span>
      </div>
    </div>
  );
};

// ─── RISK DISTRIBUTION (Severity donut-like) ────────────────────────
const RiskDistributionBreakdown = ({ metric }: Props) => {
  const total = metric.segments.reduce((a, b) => a + b.value, 0);
  const severityColors = [
    "bg-destructive", "bg-warning", "bg-primary", "bg-success"
  ];
  const severityLabels = ["Kritik", "Yüksek", "Orta", "Düşük"];

  return (
    <div className="space-y-3">
      {/* Donut-like visual */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {metric.segments.map((seg, i) => {
              const pct = (seg.value / total) * 100;
              const offset = metric.segments.slice(0, i).reduce((a, b) => a + (b.value / total) * 100, 0);
              const colors = ["hsl(var(--destructive))", "hsl(var(--warning, 45 93% 58%))", "hsl(var(--primary))", "hsl(160, 76%, 44%)"];
              return (
                <circle
                  key={seg.label}
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke={colors[i] || colors[3]}
                  strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={`${-offset}`}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-foreground">{total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {metric.segments.map((seg, i) => {
            const pct = ((seg.value / total) * 100).toFixed(0);
            return (
              <div key={seg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-sm ${severityColors[i] || "bg-muted"}`} />
                  <span className="text-[11px] text-foreground">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-foreground">{seg.value}</span>
                  <span className="text-[9px] text-muted-foreground">({pct}%)</span>
                  <span className={`text-[9px] font-medium ${seg.change >= 0 ? "text-destructive" : "text-success"}`}>
                    {seg.change >= 0 ? "↑" : "↓"}{Math.abs(seg.change)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── CREATIVE PERFORMANCE ───────────────────────────────────────────
const CreativePerformanceBreakdown = ({ metric }: Props) => {
  const maxVal = Math.max(...metric.segments.map(s => s.value));

  return (
    <div className="space-y-2">
      {metric.segments.map((seg) => {
        const score = seg.value;
        const tier = score >= 85 ? "Top Performer" : score >= 70 ? "Aktif" : score >= 50 ? "Zayıflıyor" : "Yorgun";
        const tierColor =
          tier === "Top Performer" ? "bg-success/10 text-success" :
          tier === "Aktif" ? "bg-primary/10 text-primary" :
          tier === "Zayıflıyor" ? "bg-warning/10 text-warning" :
          "bg-destructive/10 text-destructive";
        const barColor =
          tier === "Top Performer" ? "bg-success" :
          tier === "Aktif" ? "bg-primary" :
          tier === "Zayıflıyor" ? "bg-warning" :
          "bg-destructive";

        return (
          <div key={seg.label} className="p-2.5 rounded-xl bg-secondary/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">{seg.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tierColor}`}>{tier}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-foreground">{score}</span>
                <span className={`text-[10px] font-medium ${seg.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {seg.change >= 0 ? "+" : ""}{seg.change}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all`}
                  style={{ width: `${(score / maxVal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── GENERIC FALLBACK ───────────────────────────────────────────────
const GenericBreakdown = ({ metric }: Props) => {
  const maxVal = Math.max(...metric.segments.map(s => s.value));

  return (
    <div className="space-y-2">
      {metric.segments.map(seg => (
        <div key={seg.label} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-foreground">{seg.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min((seg.value / maxVal) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground w-12 text-right">{seg.value}</span>
            <span className={`text-[10px] font-medium w-10 text-right ${seg.change >= 0 ? "text-success" : "text-destructive"}`}>
              {seg.change >= 0 ? "+" : ""}{seg.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── ICON MAP ───────────────────────────────────────────────────────
const typeIconMap: Record<string, JSX.Element> = {
  "revenue-sources": <TrendingUp className="h-4 w-4 text-primary" />,
  "service-stability": <Shield className="h-4 w-4 text-primary" />,
  "sku-risk": <AlertTriangle className="h-4 w-4 text-warning" />,
  "channel-efficiency": <Zap className="h-4 w-4 text-primary" />,
  "cash-waterfall": <TrendingDown className="h-4 w-4 text-primary" />,
  "platform-profitability": <TrendingUp className="h-4 w-4 text-primary" />,
  "risk-distribution": <AlertTriangle className="h-4 w-4 text-destructive" />,
  "creative-performance": <Zap className="h-4 w-4 text-primary" />,
};

// ─── RENDERER MAP ───────────────────────────────────────────────────
const rendererMap: Record<string, React.FC<Props>> = {
  "revenue-sources": RevenueSourcesBreakdown,
  "service-stability": ServiceStabilityBreakdown,
  "sku-risk": SkuRiskBreakdown,
  "channel-efficiency": ChannelEfficiencyBreakdown,
  "cash-waterfall": CashWaterfallBreakdown,
  "platform-profitability": PlatformProfitabilityBreakdown,
  "risk-distribution": RiskDistributionBreakdown,
  "creative-performance": CreativePerformanceBreakdown,
  "generic": GenericBreakdown,
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────
const InsightBreakdown = ({ metric }: Props) => {
  const config = getBreakdownConfig(metric);
  const Renderer = rendererMap[config.type] || GenericBreakdown;
  const icon = typeIconMap[config.type] || <TrendingUp className="h-4 w-4 text-primary" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{config.title}</h2>
      </div>
      <Renderer metric={metric} />
    </motion.div>
  );
};

export default InsightBreakdown;
