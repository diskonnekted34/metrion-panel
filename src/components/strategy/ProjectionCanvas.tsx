import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { projectionData } from "@/data/strategyMock";

type TabId = "growth" | "cash" | "risk";
type TimeRange = "month" | "quarter" | "year";

const tabs: { id: TabId; label: string }[] = [
  { id: "growth", label: "Growth Projection" },
  { id: "cash", label: "Cash & Runway" },
  { id: "risk", label: "Risk & Volatility" },
];

const takeaways: Record<TabId, string[]> = {
  growth: [
    "Senaryo A, yıl sonuna kadar %12 daha yüksek ARR projeksiyonu sunuyor.",
    "Q3 sonrasında büyüme eğrileri ayrışmaya başlıyor.",
    "Agresif büyüme senaryosunda CAC baskısı kritik.",
  ],
  cash: [
    "Mevcut planda runway 9.4 ay, alternatif senaryoda 7.8 ay.",
    "Nakit pozisyonu Q3'te kritik eşiğe yaklaşıyor.",
    "COGS optimizasyonu runway'i 1.2 ay uzatabilir.",
  ],
  risk: [
    "Risk endeksi her iki senaryoda da yükseliş trendinde.",
    "Senaryo B'de volatilite %18 daha yüksek.",
    "Q4'te risk stabilizasyonu bekleniyor.",
  ],
};

const formatYAxis = (tabId: TabId) => (val: number) => {
  if (tabId === "growth") return `₺${(val / 1000000).toFixed(0)}M`;
  if (tabId === "cash") return `${val.toFixed(0)} ay`;
  return val.toFixed(0);
};

const ProjectionCanvas = () => {
  const [activeTab, setActiveTab] = useState<TabId>("growth");
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const data = activeTab === "growth" ? projectionData.growth
    : activeTab === "cash" ? projectionData.cashRunway
    : projectionData.riskVolatility;

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Projeksiyonlar</h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showA} onChange={() => setShowA(!showA)} className="w-3 h-3 rounded accent-primary" />
            Senaryo A
          </label>
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showB} onChange={() => setShowB(!showB)} className="w-3 h-3 rounded accent-primary" />
            Senaryo B
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >{t.label}</button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatYAxis(activeTab)} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} width={55} />
            <RTooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
                color: "hsl(var(--foreground))",
              }}
            />
            {showA && (
              <Area type="monotone" dataKey="scenarioA" name="Senaryo A"
                stroke="hsl(var(--primary))" strokeWidth={1.5} fill="hsl(var(--primary))" fillOpacity={0.08}
                dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
            )}
            {showB && (
              <Area type="monotone" dataKey="scenarioB" name="Senaryo B"
                stroke="hsl(var(--muted-foreground))" strokeWidth={1.2} fill="hsl(var(--muted-foreground))" fillOpacity={0.04}
                dot={false} activeDot={{ r: 3, strokeWidth: 0 }} strokeDasharray="4 4" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Takeaways */}
      <div className="mt-4 pt-3 border-t border-border space-y-1">
        {takeaways[activeTab].map((t, i) => (
          <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            {t}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProjectionCanvas;
