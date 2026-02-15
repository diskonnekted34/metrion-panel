/**
 * Reusable mock chart components for intelligence tabs.
 * Uses SVG for premium, clean look matching the dark executive OS aesthetic.
 */

interface LineChartMockProps {
  data: number[];
  data2?: number[];
  color?: string;
  color2?: string;
  height?: number;
  labels?: string[];
  showArea?: boolean;
}

export const LineChartMock = ({
  data,
  data2,
  color = "hsl(220, 100%, 56%)",
  color2 = "hsl(160, 76%, 44%)",
  height = 120,
  labels,
  showArea = false,
}: LineChartMockProps) => {
  const w = 320;
  const max = Math.max(...data, ...(data2 || []));
  const min = Math.min(...data, ...(data2 || []));
  const range = max - min || 1;
  const pad = 8;

  const toPoints = (d: number[]) =>
    d.map((v, i) => `${pad + (i / (d.length - 1)) * (w - pad * 2)},${pad + (1 - (v - min) / range) * (height - pad * 2)}`).join(" ");

  const areaPath = (d: number[]) => {
    const pts = d.map((v, i) => [
      pad + (i / (d.length - 1)) * (w - pad * 2),
      pad + (1 - (v - min) / range) * (height - pad * 2),
    ]);
    return `M${pts.map(p => p.join(",")).join(" L")} L${pts[pts.length - 1][0]},${height - pad} L${pts[0][0]},${height - pad} Z`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line
          key={r}
          x1={pad} y1={pad + r * (height - pad * 2)} x2={w - pad} y2={pad + r * (height - pad * 2)}
          stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"
        />
      ))}
      {showArea && <path d={areaPath(data)} fill={color} opacity="0.08" />}
      <polyline points={toPoints(data)} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data2 && <polyline points={toPoints(data2)} fill="none" stroke={color2} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
      {/* Labels */}
      {labels && labels.map((l, i) => (
        <text key={i} x={pad + (i / (labels.length - 1)) * (w - pad * 2)} y={height - 1} textAnchor="middle" className="fill-muted-foreground" fontSize="8">{l}</text>
      ))}
    </svg>
  );
};

interface BarChartMockProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export const BarChartMock = ({ data, height = 120 }: BarChartMockProps) => {
  const max = Math.max(...data.map(d => d.value));
  const w = 320;
  const barW = (w - 40) / data.length - 8;
  const pad = 20;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - pad * 2);
        const x = pad + i * (barW + 8);
        const y = height - pad - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={d.color || "hsl(220, 100%, 56%)"} opacity="0.8" />
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" className="fill-muted-foreground" fontSize="7">{d.label}</text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-foreground" fontSize="7" fontWeight="600">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
};

interface DonutChartMockProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
}

export const DonutChartMock = ({ segments, size = 120, centerLabel }: DonutChartMockProps) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg, i) => {
          const dashLen = (seg.value / total) * circumference;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              opacity="0.85"
            />
          );
          offset += dashLen;
          return el;
        })}
        {centerLabel && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-foreground rotate-90 origin-center" fontSize="14" fontWeight="700">{centerLabel}</text>
        )}
      </svg>
      <div className="flex flex-col gap-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
            <span className="text-[10px] text-muted-foreground">{seg.label}</span>
            <span className="text-[10px] font-medium text-foreground ml-auto">%{Math.round(seg.value / total * 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface GaugeMockProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
  size?: number;
}

export const GaugeMock = ({ value, max = 100, label, color = "hsl(220, 100%, 56%)", size = 100 }: GaugeMockProps) => {
  const r = (size - 16) / 2;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const halfCirc = Math.PI * r;
  const dashLen = (value / max) * halfCirc;

  return (
    <div className="text-center">
      <svg width={size} height={size * 0.65} className="mx-auto">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dashLen} ${halfCirc}`}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground" fontSize="16" fontWeight="700">{value}%</text>
      </svg>
      <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

interface HeatmapMockProps {
  rows: string[];
  cols: string[];
  data: number[][];
}

export const HeatmapMock = ({ rows, cols, data }: HeatmapMockProps) => {
  const maxVal = Math.max(...data.flat());
  const cellColor = (v: number) => {
    const ratio = v / maxVal;
    if (ratio > 0.8) return "bg-success/40";
    if (ratio > 0.6) return "bg-primary/30";
    if (ratio > 0.4) return "bg-primary/15";
    if (ratio > 0.2) return "bg-warning/15";
    return "bg-destructive/15";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            <th className="p-1 text-left text-muted-foreground font-medium" />
            {cols.map((c) => (
              <th key={c} className="p-1 text-center text-muted-foreground font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td className="p-1 text-muted-foreground font-medium whitespace-nowrap">{r}</td>
              {cols.map((c, ci) => (
                <td key={c} className="p-1">
                  <div className={`rounded-md h-7 flex items-center justify-center font-medium text-foreground ${cellColor(data[ri][ci])}`}>
                    {data[ri][ci]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const AlertItem = ({ level, text }: { level: "critical" | "warning" | "info"; text: string }) => {
  const styles: Record<string, string> = {
    critical: "border-l-destructive bg-destructive/5",
    warning: "border-l-warning bg-warning/5",
    info: "border-l-primary bg-primary/5",
  };
  const dots: Record<string, string> = {
    critical: "bg-destructive",
    warning: "bg-warning",
    info: "bg-primary",
  };
  return (
    <div className={`border-l-2 rounded-r-lg p-2.5 ${styles[level]}`}>
      <div className="flex items-start gap-2">
        <div className={`h-1.5 w-1.5 rounded-full mt-1 ${dots[level]}`} />
        <p className="text-[11px] text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
};
