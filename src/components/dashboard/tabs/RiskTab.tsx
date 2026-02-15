import ChartCard from "./ChartCard";
import { LineChartMock, HeatmapMock, GaugeMock, AlertItem } from "./MockChart";

const RiskTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <ChartCard title="Marj Erozyonu Riski" agent="CEO Agent">
      <LineChartMock
        data={[42, 41.5, 41, 40.8, 40.2, 39.8, 39.5]}
        labels={["H1", "H2", "H3", "H4", "H5", "H6", "H7"]}
        color="hsl(0, 84%, 60%)"
        showArea
      />
      <p className="text-[10px] text-destructive mt-2">Katkı marjı 7 haftadır düşüş trendinde</p>
    </ChartCard>

    <ChartCard title="Kanal Yoğunlaşma Riski" agent="CEO Agent">
      <div className="flex items-center justify-around">
        <GaugeMock value={62} label="Meta Bağımlılığı" color="hsl(0, 84%, 60%)" />
        <GaugeMock value={28} label="Google" color="hsl(38, 92%, 50%)" />
        <GaugeMock value={10} label="Organik" color="hsl(160, 76%, 44%)" />
      </div>
      <p className="text-[10px] text-warning text-center mt-2">Meta kanalı gelirin %62'sini oluşturuyor — yüksek konsantrasyon</p>
    </ChartCard>

    <ChartCard title="Nakit Akış Stres Olasılığı" agent="CFO Agent">
      <LineChartMock
        data={[15, 18, 22, 25, 28, 32, 35]}
        labels={["H1", "H2", "H3", "H4", "H5", "H6", "H7"]}
        color="hsl(38, 92%, 50%)"
        showArea
      />
      <p className="text-[10px] text-warning mt-2">Stres olasılığı %35'e yükseldi — nakit tampon azalıyor</p>
    </ChartCard>

    <ChartCard title="Maliyet Artış Tespiti" agent="CFO Agent">
      <div className="space-y-2">
        <AlertItem level="critical" text="Hammadde maliyetleri son ayda %8.5 arttı — COGS baskısı oluşuyor." />
        <AlertItem level="warning" text="Reklam CPC ortalaması %12 yükseldi — bütçe verimliliği düşüyor." />
        <AlertItem level="info" text="Personel maliyeti stabil — yıllık artış oranı beklenti dahilinde." />
      </div>
    </ChartCard>

    <ChartCard title="Envanter Tükenme Risk Haritası" agent="COO Agent">
      <HeatmapMock
        rows={["Kategori A", "Kategori B", "Kategori C", "Kategori D"]}
        cols={["Stok", "Hız", "Tedarik", "Talep", "Risk"]}
        data={[
          [25, 82, 60, 88, 85],
          [65, 55, 78, 42, 45],
          [40, 70, 50, 75, 65],
          [80, 30, 85, 35, 22],
        ]}
      />
    </ChartCard>

    <ChartCard title="Risk Heatmap Matrisi" agent="CEO Agent">
      <HeatmapMock
        rows={["Finans", "Pazarlama", "Operasyon", "Kreatif"]}
        cols={["Marj", "Nakit", "Büyüme", "Ops", "Genel"]}
        data={[
          [72, 65, 80, 85, 75],
          [58, 82, 45, 78, 62],
          [80, 70, 75, 42, 68],
          [90, 88, 82, 92, 88],
        ]}
      />
    </ChartCard>

    <div className="lg:col-span-2">
      <ChartCard title="Departmanlar Arası Risk Korelasyonu" agent="CEO Agent">
        <LineChartMock
          data={[55, 58, 62, 60, 65, 68, 70]}
          data2={[40, 42, 45, 48, 50, 52, 55]}
          labels={["H1", "H2", "H3", "H4", "H5", "H6", "H7"]}
          height={100}
        />
        <div className="flex gap-4 mt-2 text-[10px]">
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Finans-Operasyon</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full" style={{ background: "hsl(160,76%,44%)" }} /> Pazarlama-Finans</div>
        </div>
      </ChartCard>
    </div>
  </div>
);

export default RiskTab;
