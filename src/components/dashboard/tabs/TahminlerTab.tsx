import ChartCard from "./ChartCard";
import { LineChartMock, BarChartMock } from "./MockChart";

const TahminlerTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <ChartCard title="30 Günlük Kâr Tahmini" agent="CFO Agent">
      <LineChartMock
        data={[38, 40, 42, 41, 43, 45, 44, 46, 48, 47]}
        labels={["1g", "", "7g", "", "14g", "", "21g", "", "28g", "30g"]}
        showArea
        color="hsl(160, 76%, 44%)"
      />
      <div className="flex justify-between mt-2 text-[10px]">
        <span className="text-muted-foreground">Baz senaryo</span>
        <span className="text-success font-medium">Tahmini: $470K</span>
      </div>
    </ChartCard>

    <ChartCard title="60 Günlük Nakit Projeksiyonu" agent="CFO Agent">
      <LineChartMock
        data={[890, 860, 840, 820, 800, 790, 785, 795, 810, 830, 850, 870]}
        labels={["Bugün", "", "10g", "", "20g", "", "30g", "", "40g", "", "50g", "60g"]}
        color="hsl(38, 92%, 50%)"
        showArea
      />
      <div className="flex justify-between mt-2 text-[10px]">
        <span className="text-muted-foreground">Minimum nokta: 30. gün</span>
        <span className="text-warning font-medium">$785K (dikkat)</span>
      </div>
    </ChartCard>

    <ChartCard title="Senaryo Simülasyon Paneli" agent="CEO Agent">
      <div className="space-y-3">
        {[
          { label: "Baz Senaryo", revenue: "$2.4M", profit: "$380K", color: "bg-primary" },
          { label: "İyimser (+%15)", revenue: "$2.76M", profit: "$465K", color: "bg-success" },
          { label: "Kötümser (-%10)", revenue: "$2.16M", profit: "$285K", color: "bg-destructive" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
            <div className={`h-2 w-2 rounded-full ${s.color}`} />
            <span className="text-xs font-medium text-foreground flex-1">{s.label}</span>
            <span className="text-xs text-muted-foreground">{s.revenue}</span>
            <span className="text-xs font-semibold text-foreground">{s.profit}</span>
          </div>
        ))}
      </div>
    </ChartCard>

    <ChartCard title="Büyüme Sürdürülebilirlik Projeksiyonu" agent="CEO Agent">
      <LineChartMock
        data={[18.7, 19.2, 19.8, 20.1, 20.5, 20.8, 21.0]}
        data2={[18.7, 18.5, 18.0, 17.2, 16.5, 15.8, 15.0]}
        labels={["Bugün", "Q2", "Q3", "Q4", "Q1'26", "Q2'26", "Q3'26"]}
      />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Sürdürülebilir</div>
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full" style={{ background: "hsl(160,76%,44%)" }} /> Agresif (riskli)</div>
      </div>
    </ChartCard>

    <ChartCard title="Sermaye Tahsis Etki Modeli" agent="CFO Agent">
      <BarChartMock data={[
        { label: "Pazarlama", value: 32, color: "hsl(220, 100%, 56%)" },
        { label: "Envanter", value: 28, color: "hsl(38, 92%, 50%)" },
        { label: "Ürün", value: 22, color: "hsl(160, 76%, 44%)" },
        { label: "Ekip", value: 18, color: "hsl(280, 60%, 55%)" },
      ]} />
      <p className="text-[10px] text-muted-foreground text-center mt-2">Önerilen tahsis oranları (% bazında)</p>
    </ChartCard>

    <ChartCard title="Hassasiyet Analizi" agent="CEO Agent">
      <div className="space-y-3">
        {[
          { factor: "COGS +%5", impact: "-$95K kâr", severity: 75 },
          { factor: "CAC +%20", impact: "-$62K kâr", severity: 55 },
          { factor: "Hacim -%10", impact: "-$140K gelir", severity: 82 },
          { factor: "Fiyat +%3", impact: "+$72K kâr", severity: 30 },
        ].map((f) => (
          <div key={f.factor} className="flex items-center gap-3">
            <span className="text-[11px] text-foreground w-24 font-medium">{f.factor}</span>
            <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${f.severity}%`,
                  background: f.severity > 70 ? "hsl(0, 84%, 60%)" : f.severity > 50 ? "hsl(38, 92%, 50%)" : "hsl(160, 76%, 44%)",
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground w-20 text-right">{f.impact}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  </div>
);

export default TahminlerTab;
