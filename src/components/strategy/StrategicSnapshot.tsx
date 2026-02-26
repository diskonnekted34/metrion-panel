import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { miniKPIs, alignmentScore, alignmentTrend, pressurePoints, strategicAlerts } from "@/data/strategyMock";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const MiniSparkline = ({ data, color = "hsl(var(--primary))" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 16;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
};

const RadialGauge = ({ value }: { value: number }) => {
  const r = 52;
  const stroke = 5;
  const circ = 2 * Math.PI * r;
  const arc = (value / 100) * circ * 0.75;
  return (
    <svg width={120} height={100} viewBox="0 0 120 100" className="mx-auto">
      <circle cx={60} cy={60} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke}
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={0} strokeLinecap="round"
        transform="rotate(135 60 60)" />
      <circle cx={60} cy={60} r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth={stroke}
        strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={0} strokeLinecap="round"
        transform="rotate(135 60 60)" />
      <text x={60} y={56} textAnchor="middle" className="fill-foreground text-2xl font-bold" style={{ fontSize: 28, fontWeight: 700 }}>{value}</text>
      <text x={60} y={74} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>/ 100</text>
    </svg>
  );
};

const severityIcon = (s: string) => {
  if (s === "critical") return <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />;
  if (s === "warning") return <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />;
  return <Info className="h-3.5 w-3.5 text-primary shrink-0" />;
};

const StrategicSnapshot = () => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Stratejik Snapshot</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Şirketin stratejik yönü, sapmalar ve baskı haritası.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* A) Strategic Alignment Score */}
        <div className="space-y-3">
          <RadialGauge value={alignmentScore} />
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">Stratejik Uyum Skoru</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Son 7 gün trendi: <span className="text-success font-medium">{alignmentTrend}</span></p>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            {miniKPIs.map(kpi => (
              <div key={kpi.label} className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground truncate flex-1">{kpi.label}</span>
                <MiniSparkline data={kpi.sparkline} />
                <span className="text-xs font-semibold text-foreground w-8 text-right">{kpi.value}</span>
                <span className={`text-[10px] font-medium w-10 text-right ${kpi.delta >= 0 ? "text-success" : "text-destructive"}`}>
                  {kpi.delta >= 0 ? "+" : ""}{kpi.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* B) Pressure Map */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Baskı Haritası</p>
          <TooltipProvider>
            <div className="relative w-full aspect-square bg-secondary/30 rounded-xl border border-border overflow-hidden">
              {/* Axes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[1px] h-full bg-border left-1/2" />
                <div className="absolute h-[1px] w-full bg-border top-1/2" />
              </div>
              {/* Labels */}
              <span className="absolute bottom-1 left-1 text-[8px] text-muted-foreground">Efficiency</span>
              <span className="absolute bottom-1 right-1 text-[8px] text-muted-foreground">Growth</span>
              <span className="absolute top-1 left-1 text-[8px] text-muted-foreground">Risk</span>
              <span className="absolute top-1 right-1 text-[8px] text-muted-foreground">Innovation</span>

              {pressurePoints.map(p => (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)] cursor-pointer transition-transform hover:scale-150"
                      style={{ left: `${p.x * 100}%`, top: `${(1 - p.y) * 100}%`, transform: "translate(-50%,-50%)" }}
                      onMouseEnter={() => setHoveredPoint(p.id)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    <p className="font-semibold">{p.label}</p>
                    <p>Growth: {p.metrics.growth} · Risk: {p.metrics.risk}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* C) Strategic Alerts */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Stratejik Uyarılar</p>
          <div className="space-y-2">
            {strategicAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30 border border-border">
                {severityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground leading-tight">{alert.title}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {alert.chips.map(c => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{c}</span>
                    ))}
                  </div>
                </div>
                <button className="text-[10px] text-primary hover:underline shrink-0 flex items-center gap-0.5">
                  İncele <ExternalLink className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicSnapshot;
