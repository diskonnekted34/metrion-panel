import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DepartmentId } from "@/contexts/RBACContext";
import { LineChartMock, BarChartMock, DonutChartMock, GaugeMock, HeatmapMock } from "@/components/dashboard/tabs/MockChart";
// getMetricId removed — unused

interface ChartDef {
  title: string;
  subtitle: string;
  agent: string;
  render: () => JSX.Element;
}

const chartSets: Record<DepartmentId, ChartDef[]> = {
  executive: [
    {
      title: "Gelir vs Net Kâr",
      subtitle: "Aylık gelir ve kâr karşılaştırması",
      agent: "CEO Agent",
      render: () => <LineChartMock data={[320, 340, 310, 380, 400, 420, 460]} data2={[80, 90, 70, 110, 120, 130, 150]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />,
    },
    {
      title: "Çoklu Skor Radar",
      subtitle: "Finansal / Büyüme / Ops / Risk / Sermaye / Uyum",
      agent: "CEO Agent",
      render: () => <RadarMock />,
    },
    {
      title: "Nakit Akışı & Pist Trendi",
      subtitle: "Aylık nakit pozisyonu ve pist projeksiyonu",
      agent: "CEO Agent",
      render: () => <LineChartMock data={[900, 850, 780, 820, 860, 830, 900]} data2={[12, 11, 10, 10.5, 11, 10.8, 11.5]} color="hsl(220, 100%, 56%)" color2="hsl(45, 93%, 58%)" labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} />,
    },
    {
      title: "Departmanlar Arası Risk Haritası",
      subtitle: "Çapraz departman risk korelasyonu",
      agent: "CEO Agent",
      render: () => <HeatmapMock rows={["Finans", "Pazarlama", "Operasyon", "Kreatif"]} cols={["Marj", "Nakit", "Büyüme", "Envanter"]} data={[[85, 70, 60, 45], [40, 55, 90, 30], [60, 45, 50, 88], [35, 40, 65, 42]]} />,
    },
  ],
  finance: [
    {
      title: "Katkı Marjı % Trendi",
      subtitle: "Son 7 aylık katkı marjı evrimi",
      agent: "CFO Agent",
      render: () => <LineChartMock data={[32, 34, 31, 33, 36, 35, 38]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />,
    },
    {
      title: "Nakit Akışı Tahmini",
      subtitle: "30 / 60 / 90 gün projeksiyon",
      agent: "CFO Agent",
      render: () => <BarChartMock data={[{ label: "30g", value: 420, color: "hsl(220, 100%, 56%)" }, { label: "60g", value: 380, color: "hsl(220, 80%, 50%)" }, { label: "90g", value: 340, color: "hsl(220, 60%, 44%)" }]} />,
    },
    {
      title: "Maliyet Yapısı Dağılımı",
      subtitle: "Ana maliyet kalemlerinin oransal dağılımı",
      agent: "CFO Agent",
      render: () => <DonutChartMock segments={[{ label: "COGS", value: 42, color: "hsl(220, 100%, 56%)" }, { label: "Pazarlama", value: 28, color: "hsl(160, 76%, 44%)" }, { label: "Operasyon", value: 18, color: "hsl(45, 93%, 58%)" }, { label: "Diğer", value: 12, color: "hsl(280, 60%, 55%)" }]} centerLabel="100%" />,
    },
    {
      title: "Kanal Kârlılığı",
      subtitle: "Satış kanalı bazında kâr karşılaştırması",
      agent: "CFO Agent",
      render: () => <BarChartMock data={[{ label: "D2C", value: 85 }, { label: "Amazon", value: 62 }, { label: "Trendyol", value: 48 }, { label: "HB", value: 35 }]} />,
    },
  ],
  marketing: [
    {
      title: "pROAS vs Marj Overlay",
      subtitle: "Reklam getirisi ve marj korelasyonu",
      agent: "CMO Agent",
      render: () => <LineChartMock data={[3.2, 3.5, 2.8, 3.8, 4.1, 3.9, 4.3]} data2={[28, 30, 25, 32, 34, 31, 36]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />,
    },
    {
      title: "CAC & LTV Trendi",
      subtitle: "Müşteri edinme maliyeti ve yaşam boyu değer",
      agent: "CMO Agent",
      render: () => <LineChartMock data={[45, 42, 48, 40, 38, 41, 36]} data2={[180, 190, 175, 200, 210, 205, 220]} color="hsl(0, 72%, 51%)" color2="hsl(160, 76%, 44%)" labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} />,
    },
    {
      title: "Kanal Verimlilik Haritası",
      subtitle: "Kanal bazlı performans yoğunluğu",
      agent: "CMO Agent",
      render: () => <HeatmapMock rows={["Google", "Meta", "TikTok", "Email"]} cols={["ROAS", "CPC", "CTR", "CVR"]} data={[[82, 65, 70, 55], [75, 58, 80, 62], [60, 72, 85, 48], [90, 85, 45, 78]]} />,
    },
    {
      title: "Ölçeklendirme Risk Göstergesi",
      subtitle: "Büyüme hızı vs marj erozyon riski",
      agent: "CMO Agent",
      render: () => <GaugeMock value={68} label="Ölçeklendirme Riski" color="hsl(45, 93%, 58%)" size={120} />,
    },
  ],
  operations: [
    {
      title: "Envanter Hız Trendi",
      subtitle: "Stok devir hızı evrimi",
      agent: "COO Agent",
      render: () => <LineChartMock data={[4.2, 4.5, 4.1, 4.8, 5.0, 4.7, 5.2]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />,
    },
    {
      title: "Stok Tükenme Olasılığı",
      subtitle: "En riskli ürünlerin tükenme riski",
      agent: "COO Agent",
      render: () => <GaugeMock value={42} label="Stok Tükenme Riski" color="hsl(0, 72%, 51%)" size={120} />,
    },
    {
      title: "Teslimat Süresi Trendi",
      subtitle: "Ortalama teslimat süresi ve SLA bandı",
      agent: "COO Agent",
      render: () => <LineChartMock data={[2.8, 3.1, 2.5, 2.9, 3.2, 2.7, 2.6]} data2={[3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0]} color="hsl(220, 100%, 56%)" color2="hsl(0, 72%, 51%)" labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} />,
    },
    {
      title: "İade & Kargo Maliyet Trendi",
      subtitle: "İade oranı ve kargo maliyet evrimi",
      agent: "COO Agent",
      render: () => <LineChartMock data={[5.2, 5.8, 4.9, 5.5, 6.1, 5.3, 5.0]} data2={[12, 13, 11, 14, 15, 13, 12]} color="hsl(0, 72%, 51%)" color2="hsl(45, 93%, 58%)" labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} />,
    },
  ],
  creative: [
    {
      title: "Kreatif Performans Skor Kartı",
      subtitle: "En iyi kreatifler ve trend analizi",
      agent: "Creative Intelligence",
      render: () => <BarChartMock data={[{ label: "V1", value: 92, color: "hsl(220, 100%, 56%)" }, { label: "V2", value: 78, color: "hsl(160, 76%, 44%)" }, { label: "V3", value: 85, color: "hsl(280, 60%, 55%)" }, { label: "V4", value: 65, color: "hsl(45, 93%, 58%)" }]} />,
    },
    {
      title: "Kreatif Yorgunluk / Bozulma Eğrisi",
      subtitle: "Kreatif ömür döngüsü ve performans düşüşü",
      agent: "Creative Intelligence",
      render: () => <LineChartMock data={[95, 90, 82, 70, 55, 40, 28]} labels={["H1", "H2", "H3", "H4", "H5", "H6", "H7"]} showArea color="hsl(0, 72%, 51%)" />,
    },
    {
      title: "Marka Tutarlılık Skoru",
      subtitle: "Aylık marka tutarlılık evrimi",
      agent: "Creative Intelligence",
      render: () => <LineChartMock data={[72, 75, 78, 76, 80, 82, 85]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea color="hsl(160, 76%, 44%)" />,
    },
    {
      title: "Konsept Performans Matrisi",
      subtitle: "Kreatif konseptlerin dağılım analizi",
      agent: "Creative Intelligence",
      render: () => <HeatmapMock rows={["Lifestyle", "Product", "UGC", "Brand"]} cols={["CTR", "CVR", "CPA", "ROAS"]} data={[[80, 65, 70, 85], [60, 80, 55, 72], [90, 75, 80, 68], [55, 50, 65, 60]]} />,
    },
  ],
  marketplace: [
    {
      title: "Pazaryeri Bazında Marj",
      subtitle: "Kanal bazlı kârlılık karşılaştırması",
      agent: "Marketplace Intelligence",
      render: () => <BarChartMock data={[{ label: "Trendyol", value: 18 }, { label: "HB", value: 22 }, { label: "Amazon", value: 15 }, { label: "N11", value: 20 }]} />,
    },
    {
      title: "Komisyon Etki Analizi",
      subtitle: "Pazaryeri komisyon yapısının kâra etkisi",
      agent: "Marketplace Intelligence",
      render: () => <DonutChartMock segments={[{ label: "Komisyon", value: 35, color: "hsl(0, 72%, 51%)" }, { label: "Kargo", value: 20, color: "hsl(45, 93%, 58%)" }, { label: "İade", value: 15, color: "hsl(280, 60%, 55%)" }, { label: "Net Kâr", value: 30, color: "hsl(160, 76%, 44%)" }]} centerLabel="Yapı" />,
    },
    {
      title: "Listeleme Performans Trendi",
      subtitle: "Aktif listeleme sayısı ve satış korelasyonu",
      agent: "Marketplace Intelligence",
      render: () => <LineChartMock data={[120, 135, 128, 145, 160, 155, 170]} data2={[80, 95, 88, 105, 120, 112, 130]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea />,
    },
    {
      title: "Envanter Dağılım Dengesi",
      subtitle: "Stok dağılımı vs satış oranı",
      agent: "Marketplace Intelligence",
      render: () => <BarChartMock data={[{ label: "TR", value: 45, color: "hsl(220, 100%, 56%)" }, { label: "HB", value: 30, color: "hsl(160, 76%, 44%)" }, { label: "AMZ", value: 15, color: "hsl(45, 93%, 58%)" }, { label: "N11", value: 10, color: "hsl(280, 60%, 55%)" }]} />,
    },
  ],
  legal: [
    {
      title: "Uyum Kuyruğu Hacmi",
      subtitle: "Bekleyen uyum kontrol sayısı",
      agent: "Hukuk (Yakında)",
      render: () => <LineChartMock data={[8, 12, 10, 15, 11, 9, 7]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea color="hsl(220, 60%, 44%)" />,
    },
    {
      title: "Risk Maruziyet Özeti",
      subtitle: "Hukuki risk kategorileri dağılımı",
      agent: "Hukuk (Yakında)",
      render: () => <DonutChartMock segments={[{ label: "Düşük", value: 60, color: "hsl(160, 76%, 44%)" }, { label: "Orta", value: 25, color: "hsl(45, 93%, 58%)" }, { label: "Yüksek", value: 15, color: "hsl(0, 72%, 51%)" }]} centerLabel="Risk" />,
    },
    {
      title: "İnceleme SLA Trendi",
      subtitle: "Ortalama inceleme süresi evrimi",
      agent: "Hukuk (Yakında)",
      render: () => <LineChartMock data={[5, 4.5, 6, 5.5, 4, 3.8, 4.2]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(45, 93%, 58%)" />,
    },
    {
      title: "Denetim Olayları Trendi",
      subtitle: "Aylık denetim olayı sayısı",
      agent: "Hukuk (Yakında)",
      render: () => <BarChartMock data={[{ label: "Oca", value: 3 }, { label: "Şub", value: 5 }, { label: "Mar", value: 2 }, { label: "Nis", value: 4 }, { label: "May", value: 6 }, { label: "Haz", value: 3 }, { label: "Tem", value: 2 }]} />,
    },
  ],
  hr: [
    { title: "Headcount Trendi", subtitle: "Aylık toplam çalışan sayısı", agent: "CHRO Agent", render: () => <LineChartMock data={[118, 120, 122, 125, 124, 126, 128]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea color="hsl(210, 76%, 52%)" /> },
    { title: "Turnover Dağılımı", subtitle: "Departman bazlı turnover oranları", agent: "HR Analytics Agent", render: () => <DonutChartMock segments={[{ label: "Teknoloji", value: 18, color: "hsl(0, 72%, 51%)" }, { label: "Satış", value: 12, color: "hsl(45, 93%, 58%)" }, { label: "Diğer", value: 6, color: "hsl(160, 76%, 44%)" }]} centerLabel="Turnover" /> },
    { title: "eNPS Trendi", subtitle: "Çalışan tavsiye skoru evrimi", agent: "CHRO Agent", render: () => <LineChartMock data={[28, 30, 32, 35, 38, 36, 42]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(160, 76%, 44%)" /> },
    { title: "İşe Alım Hızı", subtitle: "Aylık ortalama time-to-fill", agent: "Talent Acquisition Agent", render: () => <BarChartMock data={[{ label: "Oca", value: 48 }, { label: "Şub", value: 45 }, { label: "Mar", value: 42 }, { label: "Nis", value: 40 }, { label: "May", value: 38 }, { label: "Haz", value: 35 }, { label: "Tem", value: 33 }]} /> },
  ],
  sales: [
    { title: "MRR Trendi", subtitle: "Aylık tekrarlayan gelir", agent: "Revenue Intelligence Agent", render: () => <LineChartMock data={[1.2, 1.28, 1.35, 1.42, 1.48, 1.55, 1.62]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea color="hsl(160, 76%, 44%)" /> },
    { title: "Pipeline Dağılımı", subtitle: "Stage bazlı pipeline hacmi", agent: "Sales Ops Agent", render: () => <DonutChartMock segments={[{ label: "Discovery", value: 30, color: "hsl(210, 76%, 52%)" }, { label: "Proposal", value: 25, color: "hsl(45, 93%, 58%)" }, { label: "Negotiation", value: 20, color: "hsl(160, 76%, 44%)" }, { label: "Closing", value: 15, color: "hsl(280, 60%, 55%)" }]} centerLabel="Pipeline" /> },
    { title: "Win Rate Trendi", subtitle: "Aylık deal kazanma oranı", agent: "Sales Intelligence Agent", render: () => <LineChartMock data={[26, 27, 28, 29, 30, 29, 31]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(45, 93%, 58%)" /> },
    { title: "AE Performans", subtitle: "Temsilci bazlı quota attainment", agent: "Sales Ops Agent", render: () => <BarChartMock data={[{ label: "AE1", value: 112 }, { label: "AE2", value: 98 }, { label: "AE3", value: 85 }, { label: "AE4", value: 76 }, { label: "AE5", value: 92 }, { label: "AE6", value: 104 }, { label: "AE7", value: 88 }]} /> },
  ],
  technology: [
    {
      title: "Sistem Uptime Trendi",
      subtitle: "Aylık sistem erişilebilirlik yüzdesi",
      agent: "CTO Agent",
      render: () => <LineChartMock data={[99.9, 99.8, 99.95, 99.7, 99.99, 99.85, 99.92]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} showArea color="hsl(210, 76%, 52%)" />,
    },
    {
      title: "Teknik Borç Dağılımı",
      subtitle: "Kategorilere göre teknik borç oranları",
      agent: "CTO Agent",
      render: () => <DonutChartMock segments={[{ label: "Altyapı", value: 35, color: "hsl(210, 76%, 52%)" }, { label: "Kod", value: 40, color: "hsl(45, 93%, 58%)" }, { label: "Test", value: 25, color: "hsl(160, 76%, 44%)" }]} centerLabel="Borç" />,
    },
    {
      title: "Veri Kalitesi Trendi",
      subtitle: "Kurumsal veri kalitesi skoru evrimi",
      agent: "CIO Agent",
      render: () => <LineChartMock data={[72, 75, 78, 82, 85, 88, 91]} labels={["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"]} color="hsl(280, 60%, 52%)" />,
    },
    {
      title: "SaaS Kullanım Verimliliği",
      subtitle: "Aktif araç kullanım oranları",
      agent: "CIO Agent",
      render: () => <BarChartMock data={[{ label: "CRM", value: 92 }, { label: "ERP", value: 78 }, { label: "PM", value: 85 }, { label: "BI", value: 65 }, { label: "HR", value: 71 }, { label: "Comms", value: 88 }]} />,
    },
  ],
};

/** Simple SVG Radar for executive multi-score */
const RadarMock = () => {
  const labels = ["Finans", "Büyüme", "Ops", "Risk", "Sermaye", "Uyum"];
  const values = [82, 68, 74, 55, 78, 85];
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 50;
  const angleStep = (2 * Math.PI) / labels.length;

  const getPoint = (i: number, val: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };

  const polyPoints = values.map((v, i) => getPoint(i, v).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" style={{ height: 140 }}>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={labels.map((_, i) => getPoint(i, s * 100).join(",")).join(" ")}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100)[0]} y2={getPoint(i, 100)[1]} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
      ))}
      <polygon points={polyPoints} fill="hsl(220, 100%, 56%)" fillOpacity="0.15" stroke="hsl(220, 100%, 56%)" strokeWidth="1.5" />
      {values.map((v, i) => {
        const [px, py] = getPoint(i, v);
        return <circle key={i} cx={px} cy={py} r="2.5" fill="hsl(220, 100%, 56%)" />;
      })}
      {labels.map((label, i) => {
        const [lx, ly] = getPoint(i, 120);
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" fontSize="7">{label}</text>;
      })}
    </svg>
  );
};

interface DepartmentHeroChartsProps {
  departmentId: DepartmentId;
}

const DepartmentHeroCharts = ({ departmentId }: DepartmentHeroChartsProps) => {
  const charts = chartSets[departmentId] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {charts.map((chart, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="glass-card p-5 relative group"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">{chart.title}</h3>
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{chart.agent}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">{chart.subtitle}</p>
          {chart.render()}
          <Link
            to={`/departments/${departmentId}/intelligence/${departmentId}-metric-${i}`}
            className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
          >
            Intelligence View Aç <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default DepartmentHeroCharts;