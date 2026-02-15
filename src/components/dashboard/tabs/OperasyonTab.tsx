import ChartCard from "./ChartCard";
import { LineChartMock, GaugeMock, BarChartMock, AlertItem } from "./MockChart";

const OperasyonTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <ChartCard title="Envanter Devir Hızı" agent="COO Agent">
      <LineChartMock
        data={[4.2, 4.5, 4.3, 4.8, 5.1, 4.9, 5.2]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        showArea
        color="hsl(160, 76%, 44%)"
      />
    </ChartCard>

    <ChartCard title="Stok Tükenme Olasılığı" agent="COO Agent">
      <div className="flex items-center justify-around">
        <GaugeMock value={85} label="SKU-A142" color="hsl(0, 84%, 60%)" />
        <GaugeMock value={62} label="SKU-B087" color="hsl(38, 92%, 50%)" />
        <GaugeMock value={23} label="SKU-C215" color="hsl(160, 76%, 44%)" />
      </div>
    </ChartCard>

    <ChartCard title="Kargo Maliyet Trendi" agent="COO Agent">
      <LineChartMock
        data={[8.2, 8.5, 8.1, 7.9, 7.6, 7.4, 7.2]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        color="hsl(38, 92%, 50%)"
        showArea
      />
      <p className="text-[10px] text-success mt-2">▼ $1.0 düşüş (son 6 ay)</p>
    </ChartCard>

    <ChartCard title="İade Oranı Trendi" agent="COO Agent">
      <LineChartMock
        data={[3.8, 3.5, 3.9, 4.2, 4.5, 4.8, 5.1]}
        labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]}
        color="hsl(0, 84%, 60%)"
        showArea
      />
      <p className="text-[10px] text-destructive mt-2">▲ %1.3 artış — dikkat gerekli</p>
    </ChartCard>

    <ChartCard title="Sipariş Karşılama Süresi" agent="COO Agent">
      <BarChartMock data={[
        { label: "Sipariş", value: 2, color: "hsl(220, 100%, 56%)" },
        { label: "Hazırlık", value: 4, color: "hsl(38, 92%, 50%)" },
        { label: "Kargo", value: 8, color: "hsl(160, 76%, 44%)" },
        { label: "Teslim", value: 3, color: "hsl(280, 60%, 55%)" },
      ]} />
      <p className="text-[10px] text-muted-foreground mt-2 text-center">Ortalama toplam: 17 saat</p>
    </ChartCard>

    <ChartCard title="Kapasite & Verimlilik" agent="COO Agent">
      <div className="flex items-center justify-around mb-3">
        <GaugeMock value={74} label="Depo Kapasitesi" color="hsl(220, 100%, 56%)" />
        <GaugeMock value={68} label="Operasyonel Verimlilik" color="hsl(160, 76%, 44%)" />
      </div>
    </ChartCard>

    <div className="lg:col-span-2">
      <ChartCard title="Operasyonel Marj Erozyonu Uyarıları" agent="COO Agent">
        <div className="space-y-2">
          <AlertItem level="critical" text="3 SKU'da stok tükenme olasılığı %85'i aştı — acil tedarik gerekli." />
          <AlertItem level="warning" text="İade oranı %5.1'e yükseldi — ürün kalite kontrolü önerilir." />
          <AlertItem level="info" text="Yeni kargo sözleşmesi ile birim maliyet %12 düştü." />
        </div>
      </ChartCard>
    </div>
  </div>
);

export default OperasyonTab;
