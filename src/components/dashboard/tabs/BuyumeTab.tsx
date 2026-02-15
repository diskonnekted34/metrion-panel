import ChartCard from "./ChartCard";
import { LineChartMock, HeatmapMock, AlertItem, GaugeMock } from "./MockChart";

const BuyumeTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <ChartCard title="ROAS vs Kâr Overlay" agent="CMO Agent">
      <LineChartMock
        data={[3.2, 3.5, 3.8, 3.6, 3.4, 3.1, 2.9]}
        data2={[35, 38, 42, 40, 38, 35, 33]}
        labels={["H1", "H2", "H3", "H4", "H5", "H6", "H7"]}
        showArea
      />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> ROAS</div>
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full" style={{ background: "hsl(160,76%,44%)" }} /> Net Kâr ($K)</div>
      </div>
    </ChartCard>

    <ChartCard title="CAC & LTV Trendi" agent="CMO Agent">
      <LineChartMock
        data={[42, 40, 38, 36, 35, 33, 32]}
        data2={[120, 125, 128, 130, 132, 134, 135]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        color="hsl(0, 84%, 60%)"
        color2="hsl(160, 76%, 44%)"
      />
      <div className="flex gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-destructive" /> CAC</div>
        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full" style={{ background: "hsl(160,76%,44%)" }} /> LTV</div>
      </div>
    </ChartCard>

    <ChartCard title="Kanal Performans Heatmap" agent="CMO Agent">
      <HeatmapMock
        rows={["Meta", "Google", "TikTok", "Organik"]}
        cols={["ROAS", "CTR", "CPC", "CVR", "Hacim"]}
        data={[
          [78, 85, 62, 71, 90],
          [82, 70, 55, 68, 75],
          [65, 92, 80, 58, 60],
          [95, 88, 99, 82, 45],
        ]}
      />
    </ChartCard>

    <ChartCard title="Kreatif Performans Matrisi" agent="CMO Agent">
      <HeatmapMock
        rows={["Video A", "Carousel B", "Static C", "UGC D"]}
        cols={["CTR", "CVR", "CPA", "ROAS"]}
        data={[
          [88, 72, 65, 80],
          [75, 85, 78, 82],
          [60, 55, 90, 58],
          [92, 80, 70, 88],
        ]}
      />
    </ChartCard>

    <ChartCard title="Ölçekleme Risk Göstergesi" agent="CMO Agent">
      <div className="flex items-center justify-around">
        <GaugeMock value={72} label="Meta Ads" color="hsl(220, 100%, 56%)" />
        <GaugeMock value={45} label="Google Ads" color="hsl(160, 76%, 44%)" />
        <GaugeMock value={88} label="TikTok Ads" color="hsl(38, 92%, 50%)" />
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">Yüksek değer = Daha fazla doygunluk riski</p>
    </ChartCard>

    <ChartCard title="Atribüsyon İstihbarat Özeti" agent="CMO Agent">
      <div className="space-y-2">
        <AlertItem level="info" text="Organik kanallar toplam dönüşümün %28'ini sağlıyor — yatırım getirisi en yüksek kanal." />
        <AlertItem level="warning" text="Meta Ads'te son tıklama atribüsyonu gerçek etkiyi %15 abarttığı tespit edildi." />
        <AlertItem level="info" text="Cross-channel etki analizi: Google → Meta yönlendirme oranı %12 arttı." />
      </div>
    </ChartCard>
  </div>
);

export default BuyumeTab;
