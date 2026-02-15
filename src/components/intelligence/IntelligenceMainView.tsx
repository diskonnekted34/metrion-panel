import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, BarChart3, Layers, Eye } from "lucide-react";
import { MetricIntelligence } from "@/data/intelligenceMetrics";
import { LineChartMock, BarChartMock, DonutChartMock, GaugeMock, HeatmapMock } from "@/components/dashboard/tabs/MockChart";

interface Props {
  metric: MetricIntelligence;
}

const timeRanges = ["Günlük", "Haftalık", "Aylık"] as const;

const IntelligenceMainView = ({ metric }: Props) => {
  const [range, setRange] = useState<string>("Aylık");
  const [showForecast, setShowForecast] = useState(true);

  const renderExpandedChart = () => {
    switch (metric.metricType) {
      case "line":
        return (
          <LineChartMock
            data={metric.chartData}
            data2={metric.chartData2}
            labels={metric.chartLabels}
            showArea
          />
        );
      case "bar":
        return (
          <BarChartMock
            data={metric.chartData.map((v, i) => ({
              label: metric.chartLabels[i] || `#${i + 1}`,
              value: v,
            }))}
          />
        );
      case "donut":
        return (
          <DonutChartMock
            segments={metric.chartData.map((v, i) => ({
              label: metric.chartLabels[i] || `Segment ${i + 1}`,
              value: v,
              color: [`hsl(220, 100%, 56%)`, `hsl(160, 76%, 44%)`, `hsl(45, 93%, 58%)`, `hsl(280, 60%, 55%)`, `hsl(0, 72%, 51%)`][i % 5],
            }))}
            centerLabel={`${metric.chartData.reduce((a, b) => a + b, 0)}`}
          />
        );
      case "gauge":
        return <GaugeMock value={metric.chartData[0]} label={metric.title} size={160} />;
      case "heatmap":
        return (
          <HeatmapMock
            rows={["Seg A", "Seg B", "Seg C", "Seg D"]}
            cols={["M1", "M2", "M3", "M4"]}
            data={[[85, 70, 60, 45], [40, 55, 90, 30], [60, 45, 50, 88], [35, 40, 65, 42]]}
          />
        );
      default:
        return (
          <LineChartMock
            data={metric.chartData}
            labels={metric.chartLabels}
            showArea
          />
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
      {/* Expanded Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Genişletilmiş Grafik</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {timeRanges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-[10px] px-2.5 py-1 rounded-lg transition-colors ${
                  range === r ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
            {metric.forecastData && (
              <>
                <div className="h-3 w-px bg-border mx-1" />
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    showForecast ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Tahmin
                </button>
              </>
            )}
          </div>
        </div>
        <div className="min-h-[200px]">
          {renderExpandedChart()}
        </div>
        {showForecast && metric.forecastData && (
          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="h-0.5 w-6 bg-primary/40 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--primary)) 0 4px, transparent 4px 8px)" }} />
            <span>30/60/90 gün tahmin: {metric.forecastData.join(" → ")}</span>
          </div>
        )}
      </div>

      {/* Segment Breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Segment Kırılımı</h2>
        </div>
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
                    style={{ width: `${Math.min((seg.value / Math.max(...metric.segments.map(s => s.value))) * 100, 100)}%` }}
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
      </div>

      {/* Anomaly Highlights */}
      {metric.anomalies.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground">Anomali Tespitleri</h2>
          </div>
          <div className="space-y-2">
            {metric.anomalies.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/10">
                <div className="shrink-0 mt-0.5">
                  {a.value > a.expected ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-foreground">{a.period}</span>
                    <span className="text-muted-foreground">Gerçek: {a.value}</span>
                    <span className="text-muted-foreground">Beklenen: {a.expected}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IntelligenceMainView;
