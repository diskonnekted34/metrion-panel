import ChartCard from "./ChartCard";
import { LineChartMock, BarChartMock, DonutChartMock, AlertItem } from "./MockChart";

const costStructure = [
  { label: "COGS", value: 42, color: "hsl(220, 100%, 56%)" },
  { label: "Pazarlama", value: 22, color: "hsl(38, 92%, 50%)" },
  { label: "Lojistik", value: 18, color: "hsl(160, 76%, 44%)" },
  { label: "Genel Gider", value: 12, color: "hsl(280, 60%, 55%)" },
  { label: "Diğer", value: 6, color: "hsl(var(--muted-foreground))" },
];

const channelProfit = [
  { label: "DTC", value: 42 },
  { label: "Amazon", value: 28 },
  { label: "Trendyol", value: 18, color: "hsl(38, 92%, 50%)" },
  { label: "Toptan", value: 12, color: "hsl(160, 76%, 44%)" },
];

const FinansTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <ChartCard title="Gelir vs Net Kâr" agent="CFO Agent">
      <LineChartMock
        data={[180, 195, 210, 205, 225, 240, 250]}
        data2={[28, 32, 35, 30, 38, 42, 45]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        showArea
      />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Gelir</div>
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full" style={{ background: "hsl(160,76%,44%)" }} /> Net Kâr</div>
      </div>
    </ChartCard>

    <ChartCard title="Katkı Marjı Trendi" agent="CFO Agent">
      <LineChartMock
        data={[38.2, 39.1, 39.8, 40.5, 41.0, 41.6, 42.1]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        showArea
        color="hsl(160, 76%, 44%)"
      />
    </ChartCard>

    <ChartCard title="Maliyet Yapısı Dağılımı" agent="CFO Agent">
      <DonutChartMock segments={costStructure} centerLabel="%100" />
    </ChartCard>

    <ChartCard title="Kanal Kâr Karşılaştırması" agent="CFO Agent">
      <BarChartMock data={channelProfit} />
    </ChartCard>

    <ChartCard title="Başabaş Noktası" agent="CFO Agent">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">$185K</p>
          <p className="text-[10px] text-muted-foreground mt-1">Aylık Başabaş</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">$240K</p>
          <p className="text-[10px] text-muted-foreground mt-1">Mevcut Gelir</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">+29.7%</p>
          <p className="text-[10px] text-muted-foreground mt-1">Başabaş Üstü</p>
        </div>
      </div>
    </ChartCard>

    <ChartCard title="Nakit Akış Tahmini" agent="CFO Agent">
      <LineChartMock
        data={[890, 860, 830, 810, 790, 780, 775, 800, 830]}
        labels={["Bugün", "", "15g", "", "30g", "", "45g", "", "60g"]}
        color="hsl(38, 92%, 50%)"
        showArea
      />
    </ChartCard>

    <div className="lg:col-span-2">
      <ChartCard title="Finansal Anomali Uyarıları" agent="CFO Agent">
        <div className="space-y-2">
          <AlertItem level="warning" text="İade oranı son 14 günde %2.1 arttı — marj üzerinde $18K baskı." />
          <AlertItem level="info" text="Kargo maliyet ortalaması %4 düştü — yeni sözleşme etkisi gözlemleniyor." />
          <AlertItem level="critical" text="Indirim erozyonu: Kampanya bazlı indirimler net marjı %1.8 aşındırdı." />
        </div>
      </ChartCard>
    </div>
  </div>
);

export default FinansTab;
