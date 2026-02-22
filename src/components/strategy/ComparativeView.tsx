import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronDown, X } from "lucide-react";
import { comparisonKPIs, scenarios, benchmarks, type ComparisonKPI } from "@/data/strategyMock";

type CompareMode = "plan-vs-quarter" | "plan-vs-scenario" | "scenario-vs-scenario";
type SortKey = "name" | "delta" | "confidence";
type SortDir = "asc" | "desc";

const formatVal = (v: number, unit: string) => {
  if (unit === "₺" || unit === "₺/ay") return `₺${(v / 1000000).toFixed(1)}M`;
  if (unit === "%") return `%${v}`;
  if (unit === "ay") return `${v} ay`;
  return String(v);
};

const MiniSparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 40;
  const h = 14;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
  );
};

const ComparativeView = () => {
  const [mode, setMode] = useState<CompareMode>("plan-vs-quarter");
  const [normalize, setNormalize] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...comparisonKPIs];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "delta") cmp = Math.abs(a.scenarioA - a.scenarioB) - Math.abs(b.scenarioA - b.scenarioB);
      else cmp = a.confidence - b.confidence;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const selectedData = selectedKPI ? comparisonKPIs.find(k => k.id === selectedKPI) : null;

  const modes: { id: CompareMode; label: string }[] = [
    { id: "plan-vs-quarter", label: "Plan vs Çeyrek" },
    { id: "plan-vs-scenario", label: "Plan vs Senaryo" },
    { id: "scenario-vs-scenario", label: "Senaryo vs Senaryo" },
  ];

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Kıyas & Karşılaştırma</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Mevcut planı farklı senaryolarla yan yana kıyaslayın.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${mode === m.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >{m.label}</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setNormalize(!normalize)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${normalize ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/50 text-muted-foreground border-border"}`}
          >{normalize ? "%" : "Raw"}</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">KPI <ArrowUpDown className="h-2.5 w-2.5" /></span>
                </th>
                <th className="text-right py-2 px-2 font-medium">Senaryo A</th>
                <th className="text-right py-2 px-2 font-medium">Senaryo B</th>
                <th className="text-right py-2 px-2 font-medium cursor-pointer select-none" onClick={() => toggleSort("delta")}>
                  <span className="flex items-center justify-end gap-1">Δ <ArrowUpDown className="h-2.5 w-2.5" /></span>
                </th>
                <th className="text-right py-2 px-2 font-medium">Δ%</th>
                <th className="text-center py-2 px-2 font-medium">Trend</th>
                <th className="text-right py-2 px-2 font-medium cursor-pointer select-none" onClick={() => toggleSort("confidence")}>
                  <span className="flex items-center justify-end gap-1">Güven <ArrowUpDown className="h-2.5 w-2.5" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(kpi => {
                const delta = kpi.scenarioA - kpi.scenarioB;
                const deltaPct = kpi.scenarioB !== 0 ? ((delta / Math.abs(kpi.scenarioB)) * 100).toFixed(1) : "—";
                const isPositive = kpi.id === "cac" || kpi.id === "burn" || kpi.id === "churn" ? delta < 0 : delta > 0;
                return (
                  <tr key={kpi.id}
                    className={`border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors ${selectedKPI === kpi.id ? "bg-secondary/40" : ""}`}
                    onClick={() => setSelectedKPI(selectedKPI === kpi.id ? null : kpi.id)}
                  >
                    <td className="py-2 pr-3 font-medium text-foreground">{kpi.name}</td>
                    <td className="py-2 px-2 text-right text-foreground tabular-nums">{formatVal(kpi.scenarioA, kpi.unit)}</td>
                    <td className="py-2 px-2 text-right text-muted-foreground tabular-nums">{formatVal(kpi.scenarioB, kpi.unit)}</td>
                    <td className={`py-2 px-2 text-right font-medium tabular-nums ${isPositive ? "text-success" : "text-destructive"}`}>
                      {isPositive ? "+" : ""}{kpi.unit === "%" || kpi.unit === "ay" ? delta.toFixed(1) : formatVal(Math.abs(delta), kpi.unit)}
                    </td>
                    <td className={`py-2 px-2 text-right tabular-nums ${isPositive ? "text-success" : "text-destructive"}`}>{deltaPct}%</td>
                    <td className="py-2 px-2 flex justify-center"><MiniSparkline data={kpi.trend} /></td>
                    <td className="py-2 px-2 text-right text-muted-foreground">{kpi.confidence}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Benchmark Strip */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[9px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Sector Benchmark</p>
            <div className="flex items-center gap-6 text-[9px] text-muted-foreground">
              <span>Low: ₺{(benchmarks.low.revenue / 1000000).toFixed(0)}M · %{benchmarks.low.margin}</span>
              <span>Median: ₺{(benchmarks.median.revenue / 1000000).toFixed(0)}M · %{benchmarks.median.margin}</span>
              <span className="text-primary">Top: ₺{(benchmarks.topQuartile.revenue / 1000000).toFixed(0)}M · %{benchmarks.topQuartile.margin}</span>
            </div>
          </div>
        </div>

        {/* Detail Drawer */}
        {selectedData && (
          <div className="w-52 shrink-0 border-l border-border pl-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">{selectedData.name}</p>
              <button onClick={() => setSelectedKPI(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">{selectedData.definition}</p>
            <div className="space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">30 Gün Trend</p>
              <svg width="100%" height={40} viewBox="0 0 160 40">
                <polyline
                  points={selectedData.trend.map((v, i) => {
                    const max = Math.max(...selectedData.trend);
                    const min = Math.min(...selectedData.trend);
                    const range = max - min || 1;
                    return `${(i / (selectedData.trend.length - 1)) * 160},${40 - ((v - min) / range) * 36}`;
                  }).join(" ")}
                  fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Güven: <span className="text-foreground font-medium">{selectedData.confidence}%</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparativeView;
