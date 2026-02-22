import { useState, useCallback, useMemo } from "react";
import { RotateCcw, Save, Shield, Info } from "lucide-react";
import { simulationInputs, baseOutputs, tradeoffs, type SimulationOutput } from "@/data/strategyMock";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";

const formatCompact = (v: number, unit: string) => {
  if (unit === "₺" || unit === "₺/ay") return `₺${(v / 1000000).toFixed(1)}M`;
  if (unit === "%") return `%${v.toFixed(1)}`;
  if (unit === "ay") return `${v.toFixed(1)} ay`;
  if (unit === "/100") return `${v.toFixed(0)}`;
  return String(v);
};

const MiniSparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 44;
  const h = 16;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
  );
};

const SimulationLab = () => {
  const defaults = useMemo(() => Object.fromEntries(simulationInputs.map(s => [s.id, s.defaultValue])), []);
  const [values, setValues] = useState<Record<string, number>>(defaults);

  const updateValue = useCallback((id: string, val: number) => {
    setValues(prev => ({ ...prev, [id]: val }));
  }, []);

  const reset = () => setValues(defaults);

  const saveScenario = () => {
    toast.success("Senaryo kaydedildi", { description: "Simülasyon parametreleri başarıyla kaydedildi." });
  };

  // Mock computation: adjust outputs based on delta from default
  const outputs = useMemo<SimulationOutput[]>(() => {
    const marketingDelta = (values.marketing - defaults.marketing) / defaults.marketing;
    const hiringDelta = (values.hiring - defaults.hiring) / defaults.hiring;
    const pricingDelta = values.pricing / 100;
    const cogsDelta = values.cogs / 100;

    return baseOutputs.map(o => {
      let multiplier = 1;
      let deltaVal = 0;
      if (o.label === "Projected ARR") {
        multiplier = 1 + marketingDelta * 0.3 + pricingDelta * 0.5;
        deltaVal = o.value * (multiplier - 1);
      } else if (o.label === "Projected Margin") {
        multiplier = 1 + cogsDelta * 0.4 - hiringDelta * 0.15;
        deltaVal = o.value * (multiplier - 1);
      } else if (o.label === "Projected Burn") {
        multiplier = 1 + marketingDelta * 0.2 + hiringDelta * 0.5;
        deltaVal = o.value * (multiplier - 1);
      } else if (o.label === "Projected Runway") {
        multiplier = 1 - marketingDelta * 0.15 - hiringDelta * 0.25;
        deltaVal = o.value * (multiplier - 1);
      } else {
        multiplier = 1 + marketingDelta * 0.1 + hiringDelta * 0.2 - cogsDelta * 0.3;
        deltaVal = o.value * (multiplier - 1);
      }
      return { ...o, value: Math.round(o.value * multiplier * 100) / 100, delta: Math.round(deltaVal * 100) / 100 };
    });
  }, [values, defaults]);

  const formatInputVal = (id: string, val: number) => {
    const input = simulationInputs.find(s => s.id === id)!;
    if (input.unit === "₺") return `₺${(val / 1000000).toFixed(1)}M`;
    if (input.unit === "%") return `${val > 0 ? "+" : ""}${val}%`;
    return `${val} ${input.unit}`;
  };

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Simülasyon Laboratuvarı</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Parametreleri değiştirin, etkileri canlı izleyin.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-[10px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button onClick={saveScenario} className="text-[10px] px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all flex items-center gap-1">
            <Save className="h-3 w-3" /> Kaydet
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-5">
        {simulationInputs.map(input => (
          <div key={input.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{input.label}</span>
              <span className="text-[10px] font-medium text-foreground tabular-nums">{formatInputVal(input.id, values[input.id])}</span>
            </div>
            <Slider
              min={input.min} max={input.max} step={input.step}
              value={[values[input.id]]}
              onValueChange={([v]) => updateValue(input.id, v)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Confidence */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-secondary/30 border border-border cursor-help">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground">Model Güveni: <span className="text-foreground font-medium">%78</span></span>
              <Info className="h-2.5 w-2.5 text-muted-foreground ml-auto" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-[10px]">
            <p>Veri kapsamı: 21 kaynak</p>
            <p>Model güveni: %78</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Outputs */}
      <div className="space-y-2 mb-4">
        {outputs.map(o => (
          <div key={o.label} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
            <span className="text-[10px] text-muted-foreground flex-1">{o.label}</span>
            <MiniSparkline data={o.sparkline} />
            <span className="text-xs font-semibold text-foreground tabular-nums w-16 text-right">{formatCompact(o.value, o.unit)}</span>
            <span className={`text-[9px] font-medium w-14 text-right tabular-nums ${o.delta >= 0 ? (o.label.includes("Burn") || o.label.includes("Risk") ? "text-destructive" : "text-success") : (o.label.includes("Burn") || o.label.includes("Risk") ? "text-success" : "text-destructive")}`}>
              {o.delta >= 0 ? "+" : ""}{formatCompact(Math.abs(o.delta), o.unit)}
            </span>
          </div>
        ))}
      </div>

      {/* Tradeoff Summary */}
      <div className="mt-auto pt-3 border-t border-border">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Tradeoff Özeti</p>
        {tradeoffs.map((t, i) => (
          <p key={i} className="text-[10px] text-muted-foreground">
            <span className={t.direction === "positive" ? "text-success" : "text-warning"}>→</span>{" "}
            {t.cause} → {t.effect}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SimulationLab;
