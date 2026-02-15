import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, GitCompare, Shield, SlidersHorizontal, Database, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricIntelligence } from "@/data/intelligenceMetrics";
import { Slider } from "@/components/ui/slider";

interface Props {
  metric: MetricIntelligence;
}

const IntelligenceDeepTabs = ({ metric }: Props) => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6">
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="bg-secondary/30 border border-border/30 p-1 rounded-xl w-full flex">
          <TabsTrigger value="time" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Clock className="h-3 w-3 mr-1.5" /> Zaman Analizi
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <GitCompare className="h-3 w-3 mr-1.5" /> Korelasyon
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Shield className="h-3 w-3 mr-1.5" /> Risk Haritası
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <SlidersHorizontal className="h-3 w-3 mr-1.5" /> Simülasyon
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex-1 text-[11px] rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Database className="h-3 w-3 mr-1.5" /> Veri Kanıtı
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="time">
            <TimeAnalysisTab metric={metric} />
          </TabsContent>
          <TabsContent value="correlation">
            <CorrelationTab metric={metric} />
          </TabsContent>
          <TabsContent value="risk">
            <RiskMapTab metric={metric} />
          </TabsContent>
          <TabsContent value="simulation">
            <SimulationTab metric={metric} />
          </TabsContent>
          <TabsContent value="evidence">
            <EvidenceTab metric={metric} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

// ── TAB 1: Zaman Analizi ───────────────────────────────────
const TimeAnalysisTab = ({ metric }: { metric: MetricIntelligence }) => {
  const avg = metric.chartData.reduce((a, b) => a + b, 0) / metric.chartData.length;
  const movingAvg = metric.chartData.map((_, i) => {
    const slice = metric.chartData.slice(Math.max(0, i - 2), i + 1);
    return +(slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(1);
  });

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Trend Ayrıştırma</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-secondary/30 text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Ortalama</p>
          <p className="text-lg font-bold text-foreground">{avg.toFixed(1)}</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/30 text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Min / Max</p>
          <p className="text-lg font-bold text-foreground">{Math.min(...metric.chartData)} / {Math.max(...metric.chartData)}</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/30 text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Volatilite</p>
          <p className="text-lg font-bold text-foreground">
            {(Math.sqrt(metric.chartData.reduce((s, v) => s + (v - avg) ** 2, 0) / metric.chartData.length)).toFixed(1)}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground">Hareketli Ortalama (3 periyot)</p>
        <div className="flex items-end gap-1 h-16">
          {movingAvg.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t bg-primary/30"
                style={{ height: `${(v / Math.max(...movingAvg)) * 48}px` }}
              />
              <span className="text-[8px] text-muted-foreground">{metric.chartLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── TAB 2: Korelasyon ──────────────────────────────────────
const CorrelationTab = ({ metric }: { metric: MetricIntelligence }) => {
  const sorted = [...metric.correlations].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Korelasyon Analizi</h3>
      <div className="space-y-2">
        {sorted.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <div className="shrink-0">
              {c.direction === "positive" ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{c.metric}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c.direction === "positive" ? "bg-success" : "bg-destructive"}`}
                  style={{ width: `${Math.abs(c.score) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-bold w-10 text-right ${c.direction === "positive" ? "text-success" : "text-destructive"}`}>
                {c.score > 0 ? "+" : ""}{c.score.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── TAB 3: Risk Haritası ───────────────────────────────────
const RiskMapTab = ({ metric }: { metric: MetricIntelligence }) => {
  const levelColor = (level: "low" | "medium" | "high") => {
    if (level === "high") return "bg-destructive/15 text-destructive";
    if (level === "medium") return "bg-warning/15 text-warning";
    return "bg-success/15 text-success";
  };
  const levelLabel = (level: "low" | "medium" | "high") => {
    if (level === "high") return "Yüksek";
    if (level === "medium") return "Orta";
    return "Düşük";
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Risk Matrisi</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 text-muted-foreground font-medium">Risk Faktörü</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Olasılık</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Etki</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Departman</th>
            </tr>
          </thead>
          <tbody>
            {metric.riskMap.map((r, i) => (
              <tr key={i} className="border-b border-border/10">
                <td className="py-2.5 font-medium text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  {r.factor}
                </td>
                <td className="py-2.5 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelColor(r.probability)}`}>
                    {levelLabel(r.probability)}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelColor(r.impact)}`}>
                    {levelLabel(r.impact)}
                  </span>
                </td>
                <td className="py-2.5 text-right text-muted-foreground">{r.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── TAB 4: Simülasyon ──────────────────────────────────────
const SimulationTab = ({ metric }: { metric: MetricIntelligence }) => {
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(metric.simulationParams.map(p => [p.id, p.defaultValue]))
  );

  const baseValue = metric.chartData[metric.chartData.length - 1];
  const simulatedChange = Object.entries(params).reduce((acc, [, val]) => acc + val * 0.3, 0);
  const simulatedValue = +(baseValue * (1 + simulatedChange / 100)).toFixed(1);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Senaryo Simülasyonu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {metric.simulationParams.map(p => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-foreground">{p.label}</span>
                <span className="text-[11px] font-bold text-primary">{params[p.id]}{p.unit}</span>
              </div>
              <Slider
                value={[params[p.id]]}
                min={p.min}
                max={p.max}
                step={p.step}
                onValueChange={([val]) => setParams(prev => ({ ...prev, [p.id]: val }))}
                className="w-full"
              />
              <div className="flex justify-between mt-0.5 text-[9px] text-muted-foreground">
                <span>{p.min}{p.unit}</span>
                <span>{p.max}{p.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/20 border border-border/20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Simüle Edilen Sonuç</p>
          <p className={`text-3xl font-bold ${simulatedChange >= 0 ? "text-success" : "text-destructive"}`}>
            {simulatedValue}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Baz: {baseValue} → Değişim: {simulatedChange >= 0 ? "+" : ""}{simulatedChange.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

// ── TAB 5: Veri Kanıtı ─────────────────────────────────────
const EvidenceTab = ({ metric }: { metric: MetricIntelligence }) => {
  const statusColor = (s: "healthy" | "warning" | "error") => {
    if (s === "healthy") return "bg-success";
    if (s === "warning") return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Veri Kaynakları & Güvenilirlik</h3>
      <div className="space-y-2">
        {metric.dataSources.map((ds, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${statusColor(ds.status)}`} />
              <div>
                <p className="text-xs font-medium text-foreground">{ds.name}</p>
                <p className="text-[10px] text-muted-foreground">Son sync: {ds.lastSync}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${ds.reliability}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground w-8 text-right">%{ds.reliability}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntelligenceDeepTabs;
