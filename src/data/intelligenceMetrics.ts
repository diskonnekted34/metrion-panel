// ─── INTELLIGENCE VIEW: UNIVERSAL METRIC DEEP-DIVE DATA ─────────────

import { DepartmentId } from "@/contexts/RBACContext";

export type MetricType = "line" | "bar" | "donut" | "radar" | "heatmap" | "gauge" | "kpi";

export interface InsightItem {
  text: string;
  type: "risk" | "opportunity" | "neutral";
}

export interface RootCause {
  description: string;
  sources: string[];
}

export interface CorrelationItem {
  metric: string;
  score: number; // -1 to 1
  direction: "positive" | "negative";
}

export interface RiskMapItem {
  factor: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  department: string;
}

export interface SimulationParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface DataSourceEvidence {
  name: string;
  lastSync: string;
  reliability: number; // 0-100
  status: "healthy" | "warning" | "error";
}

export interface SuggestedAction {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface MetricIntelligence {
  id: string;
  title: string;
  subtitle: string;
  metricType: MetricType;
  agent: string;
  departmentId: DepartmentId;
  chartData: number[];
  chartLabels: string[];
  chartData2?: number[];
  forecastData?: number[];
  confidenceScore: number;
  dataCompleteness: number;
  lastUpdated: string;
  metricBadge: string;
  insights: InsightItem[];
  rootCause: RootCause;
  impactProjection: string;
  suggestedActions: SuggestedAction[];
  correlations: CorrelationItem[];
  riskMap: RiskMapItem[];
  simulationParams: SimulationParam[];
  dataSources: DataSourceEvidence[];
  segments: { label: string; value: number; change: number }[];
  anomalies: { period: string; value: number; expected: number; description: string }[];
}

// ─── Generate metric ID from chart index ────────────────────────────
export const getMetricId = (deptId: DepartmentId, chartIndex: number): string =>
  `${deptId}-metric-${chartIndex}`;

// ─── UNIVERSAL INTELLIGENCE DATA PER DEPARTMENT ─────────────────────

const baseSimParams: SimulationParam[] = [
  { id: "cost", label: "Maliyet Değişimi", min: -20, max: 20, step: 1, defaultValue: 0, unit: "%" },
  { id: "growth", label: "Büyüme Oranı", min: -10, max: 30, step: 1, defaultValue: 5, unit: "%" },
  { id: "price", label: "Fiyat Ayarı", min: -15, max: 15, step: 1, defaultValue: 0, unit: "%" },
];

const baseSources: DataSourceEvidence[] = [
  { name: "ERP Sistemi", lastSync: "2 saat önce", reliability: 96, status: "healthy" },
  { name: "CRM Veritabanı", lastSync: "4 saat önce", reliability: 92, status: "healthy" },
  { name: "Google Analytics", lastSync: "1 saat önce", reliability: 88, status: "healthy" },
];

function buildMetric(
  id: string,
  title: string,
  subtitle: string,
  metricType: MetricType,
  agent: string,
  departmentId: DepartmentId,
  overrides: Partial<MetricIntelligence> = {}
): MetricIntelligence {
  return {
    id,
    title,
    subtitle,
    metricType,
    agent,
    departmentId,
    chartData: [320, 340, 310, 380, 400, 420, 460],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [460, 480, 510],
    confidenceScore: 82,
    dataCompleteness: 91,
    lastUpdated: "2 saat önce",
    metricBadge: "Temel KPI",
    insights: [
      { text: "Son 3 ayda %12 artış trendi gözlemleniyor.", type: "opportunity" },
      { text: "Mevsimsel etki Mart ayında belirgin düşüş yaratmış.", type: "neutral" },
      { text: "Mevcut trend devam ederse Q4 hedefi aşılabilir.", type: "opportunity" },
      { text: "Veri kaynağı güvenilirliği yüksek seviyede.", type: "neutral" },
    ],
    rootCause: {
      description: "Artışın ana sebebi yeni kanal entegrasyonları ve organik trafikteki iyileşme.",
      sources: ["Google Analytics", "ERP Sistemi", "CRM Veritabanı"],
    },
    impactProjection: "Bu trend devam ederse 3 ayda toplam gelir %8.5 artacak, marj ise %2.1 iyileşecek.",
    suggestedActions: [
      { title: "Kanal optimizasyonu başlat", description: "En yüksek performanslı kanallara bütçe kaydır.", priority: "high" },
      { title: "Maliyet analizi çalıştır", description: "Artan maliyetlerin marj etkisini değerlendir.", priority: "medium" },
      { title: "Haftalık izleme raporu oluştur", description: "Trend kırılmalarını erken tespit et.", priority: "low" },
    ],
    correlations: [
      { metric: "Reklam Harcaması", score: 0.85, direction: "positive" },
      { metric: "Müşteri Memnuniyeti", score: 0.72, direction: "positive" },
      { metric: "İade Oranı", score: -0.65, direction: "negative" },
      { metric: "Operasyonel Maliyet", score: -0.48, direction: "negative" },
      { metric: "Organik Trafik", score: 0.91, direction: "positive" },
    ],
    riskMap: [
      { factor: "Pazar doygunluğu", probability: "medium", impact: "high", department: "Pazarlama" },
      { factor: "Tedarik zinciri kesintisi", probability: "low", impact: "high", department: "Operasyon" },
      { factor: "Kur dalgalanması", probability: "high", impact: "medium", department: "Finans" },
      { factor: "Regülasyon değişikliği", probability: "low", impact: "medium", department: "Hukuk" },
    ],
    simulationParams: baseSimParams,
    dataSources: baseSources,
    segments: [
      { label: "D2C Web", value: 185, change: 12 },
      { label: "Pazaryeri", value: 142, change: 8 },
      { label: "Toptan", value: 88, change: -3 },
      { label: "Kurumsal", value: 45, change: 22 },
    ],
    anomalies: [
      { period: "Mar", value: 310, expected: 350, description: "Mevsimsel düşüş + kampanya eksikliği" },
      { period: "Tem", value: 460, expected: 420, description: "Yaz kampanyası beklenenden güçlü performans" },
    ],
    ...overrides,
  };
}

// Each department has exactly 4 metrics matching 4 hero charts
export const departmentMetrics: Record<DepartmentId, MetricIntelligence[]> = {
  executive: [
    buildMetric("executive-metric-0", "Gelir vs Net Kâr", "Aylık gelir ve kâr karşılaştırması", "line", "CEO Agent", "executive", {
      chartData: [320, 340, 310, 380, 400, 420, 460],
      chartData2: [80, 90, 70, 110, 120, 130, 150],
      metricBadge: "Finansal Performans",
      confidenceScore: 88,
    }),
    buildMetric("executive-metric-1", "Çoklu Skor Radar", "Finansal / Büyüme / Ops / Risk / Sermaye / Uyum", "radar", "CEO Agent", "executive", {
      chartData: [82, 68, 74, 55, 78, 85],
      chartLabels: ["Finans", "Büyüme", "Ops", "Risk", "Sermaye", "Uyum"],
      metricBadge: "Genel Sağlık",
      confidenceScore: 85,
    }),
    buildMetric("executive-metric-2", "Nakit Akışı & Pist Trendi", "Aylık nakit pozisyonu ve pist projeksiyonu", "line", "CEO Agent", "executive", {
      chartData: [900, 850, 780, 820, 860, 830, 900],
      chartData2: [12, 11, 10, 10.5, 11, 10.8, 11.5],
      metricBadge: "Nakit Pozisyonu",
    }),
    buildMetric("executive-metric-3", "Departmanlar Arası Risk Haritası", "Çapraz departman risk korelasyonu", "heatmap", "CEO Agent", "executive", {
      metricBadge: "Risk Haritası",
      confidenceScore: 79,
    }),
  ],
  finance: [
    buildMetric("finance-metric-0", "Katkı Marjı % Trendi", "Son 7 aylık katkı marjı evrimi", "line", "CFO Agent", "finance", {
      chartData: [32, 34, 31, 33, 36, 35, 38],
      forecastData: [39, 40, 41],
      metricBadge: "Marj Performansı",
      confidenceScore: 91,
      insights: [
        { text: "Marj son 3 ayda istikrarlı yükseliş gösteriyor.", type: "opportunity" },
        { text: "COGS optimizasyonu marjı %2 artırdı.", type: "opportunity" },
        { text: "Kur etkisi marjı %0.8 baskılıyor.", type: "risk" },
        { text: "Hedef marj (%40) mevcut trendde Q1'de yakalanabilir.", type: "opportunity" },
      ],
      rootCause: {
        description: "Marj iyileşmesinin ana kaynağı tedarikçi müzakereleri ve SKU rasyonalizasyonu.",
        sources: ["ERP Sistemi", "Tedarikçi Portalı", "Fiyatlama Motoru"],
      },
    }),
    buildMetric("finance-metric-1", "Nakit Akışı Tahmini", "30 / 60 / 90 gün projeksiyon", "bar", "CFO Agent", "finance", {
      chartData: [420, 380, 340],
      chartLabels: ["30g", "60g", "90g"],
      metricBadge: "Nakit Akış",
      confidenceScore: 76,
    }),
    buildMetric("finance-metric-2", "Maliyet Yapısı Dağılımı", "Ana maliyet kalemlerinin oransal dağılımı", "donut", "CFO Agent", "finance", {
      chartData: [42, 28, 18, 12],
      chartLabels: ["COGS", "Pazarlama", "Operasyon", "Diğer"],
      metricBadge: "Maliyet Analizi",
    }),
    buildMetric("finance-metric-3", "Kanal Kârlılığı", "Satış kanalı bazında kâr karşılaştırması", "bar", "CFO Agent", "finance", {
      chartData: [85, 62, 48, 35],
      chartLabels: ["D2C", "Amazon", "Trendyol", "HB"],
      metricBadge: "Kanal Performansı",
      confidenceScore: 87,
    }),
  ],
  marketing: [
    buildMetric("marketing-metric-0", "pROAS vs Marj Overlay", "Reklam getirisi ve marj korelasyonu", "line", "CMO Agent", "marketing", {
      chartData: [3.2, 3.5, 2.8, 3.8, 4.1, 3.9, 4.3],
      chartData2: [28, 30, 25, 32, 34, 31, 36],
      metricBadge: "Reklam Verimliliği",
      confidenceScore: 84,
    }),
    buildMetric("marketing-metric-1", "CAC & LTV Trendi", "Müşteri edinme maliyeti ve yaşam boyu değer", "line", "CMO Agent", "marketing", {
      chartData: [45, 42, 48, 40, 38, 41, 36],
      chartData2: [180, 190, 175, 200, 210, 205, 220],
      metricBadge: "Müşteri Ekonomisi",
    }),
    buildMetric("marketing-metric-2", "Kanal Verimlilik Haritası", "Kanal bazlı performans yoğunluğu", "heatmap", "CMO Agent", "marketing", {
      metricBadge: "Kanal Performansı",
      confidenceScore: 80,
    }),
    buildMetric("marketing-metric-3", "Ölçeklendirme Risk Göstergesi", "Büyüme hızı vs marj erozyon riski", "gauge", "CMO Agent", "marketing", {
      chartData: [68],
      metricBadge: "Büyüme Riski",
      confidenceScore: 73,
    }),
  ],
  operations: [
    buildMetric("operations-metric-0", "Envanter Hız Trendi", "Stok devir hızı evrimi", "line", "COO Agent", "operations", {
      chartData: [4.2, 4.5, 4.1, 4.8, 5.0, 4.7, 5.2],
      metricBadge: "Envanter Verimliliği",
      confidenceScore: 89,
    }),
    buildMetric("operations-metric-1", "Stok Tükenme Olasılığı", "En riskli ürünlerin tükenme riski", "gauge", "COO Agent", "operations", {
      chartData: [42],
      metricBadge: "Stok Riski",
      confidenceScore: 77,
    }),
    buildMetric("operations-metric-2", "Teslimat Süresi Trendi", "Ortalama teslimat süresi ve SLA bandı", "line", "COO Agent", "operations", {
      chartData: [2.8, 3.1, 2.5, 2.9, 3.2, 2.7, 2.6],
      chartData2: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
      metricBadge: "Teslimat SLA",
    }),
    buildMetric("operations-metric-3", "İade & Kargo Maliyet Trendi", "İade oranı ve kargo maliyet evrimi", "line", "COO Agent", "operations", {
      chartData: [5.2, 5.8, 4.9, 5.5, 6.1, 5.3, 5.0],
      chartData2: [12, 13, 11, 14, 15, 13, 12],
      metricBadge: "İade Maliyeti",
    }),
  ],
  technology: [
    buildMetric("technology-metric-0", "Sistem Uptime Trendi", "Aylık sistem erişilebilirlik yüzdesi", "line", "CTO Agent", "technology", {
      chartData: [99.9, 99.8, 99.95, 99.7, 99.99, 99.85, 99.92],
      metricBadge: "Uptime",
      confidenceScore: 96,
      dataSources: [
        { name: "Datadog", lastSync: "5 dk önce", reliability: 99, status: "healthy" },
        { name: "AWS CloudWatch", lastSync: "10 dk önce", reliability: 97, status: "healthy" },
        { name: "PagerDuty", lastSync: "15 dk önce", reliability: 95, status: "healthy" },
      ],
    }),
    buildMetric("technology-metric-1", "Teknik Borç Dağılımı", "Kategorilere göre teknik borç oranları", "donut", "CTO Agent", "technology", {
      chartData: [35, 40, 25],
      chartLabels: ["Altyapı", "Kod", "Test"],
      metricBadge: "Teknik Borç",
      confidenceScore: 81,
    }),
    buildMetric("technology-metric-2", "Veri Kalitesi Trendi", "Kurumsal veri kalitesi skoru evrimi", "line", "CIO Agent", "technology", {
      chartData: [72, 75, 78, 82, 85, 88, 91],
      metricBadge: "Veri Kalitesi",
      confidenceScore: 87,
    }),
    buildMetric("technology-metric-3", "SaaS Kullanım Verimliliği", "Aktif araç kullanım oranları", "bar", "CIO Agent", "technology", {
      chartData: [92, 78, 85, 65, 71, 88],
      chartLabels: ["CRM", "ERP", "PM", "BI", "HR", "Comms"],
      metricBadge: "SaaS Optimizasyonu",
    }),
  ],
  creative: [
    buildMetric("creative-metric-0", "Kreatif Performans Skor Kartı", "En iyi kreatifler ve trend analizi", "bar", "Creative Intelligence", "creative", {
      chartData: [92, 78, 85, 65],
      chartLabels: ["V1", "V2", "V3", "V4"],
      metricBadge: "Kreatif Performans",
    }),
    buildMetric("creative-metric-1", "Kreatif Yorgunluk Eğrisi", "Kreatif ömür döngüsü ve performans düşüşü", "line", "Creative Intelligence", "creative", {
      chartData: [95, 90, 82, 70, 55, 40, 28],
      chartLabels: ["H1", "H2", "H3", "H4", "H5", "H6", "H7"],
      metricBadge: "Yorgunluk Analizi",
    }),
    buildMetric("creative-metric-2", "Marka Tutarlılık Skoru", "Aylık marka tutarlılık evrimi", "line", "Creative Intelligence", "creative", {
      chartData: [72, 75, 78, 76, 80, 82, 85],
      metricBadge: "Marka Tutarlılığı",
    }),
    buildMetric("creative-metric-3", "Konsept Performans Matrisi", "Kreatif konseptlerin dağılım analizi", "heatmap", "Creative Intelligence", "creative", {
      metricBadge: "Konsept Analizi",
    }),
  ],
  marketplace: [
    buildMetric("marketplace-metric-0", "Pazaryeri Bazında Marj", "Kanal bazlı kârlılık karşılaştırması", "bar", "Marketplace Intelligence", "marketplace", {
      chartData: [18, 22, 15, 20],
      chartLabels: ["Trendyol", "HB", "Amazon", "N11"],
      metricBadge: "Kanal Marjı",
    }),
    buildMetric("marketplace-metric-1", "Komisyon Etki Analizi", "Pazaryeri komisyon yapısının kâra etkisi", "donut", "Marketplace Intelligence", "marketplace", {
      chartData: [35, 20, 15, 30],
      chartLabels: ["Komisyon", "Kargo", "İade", "Net Kâr"],
      metricBadge: "Komisyon Yapısı",
    }),
    buildMetric("marketplace-metric-2", "Listeleme Performans Trendi", "Aktif listeleme sayısı ve satış korelasyonu", "line", "Marketplace Intelligence", "marketplace", {
      chartData: [120, 135, 128, 145, 160, 155, 170],
      chartData2: [80, 95, 88, 105, 120, 112, 130],
      metricBadge: "Listeleme Verimi",
    }),
    buildMetric("marketplace-metric-3", "Envanter Dağılım Dengesi", "Stok dağılımı vs satış oranı", "bar", "Marketplace Intelligence", "marketplace", {
      chartData: [45, 30, 15, 10],
      chartLabels: ["TR", "HB", "AMZ", "N11"],
      metricBadge: "Envanter Dengesi",
    }),
  ],
  legal: [
    buildMetric("legal-metric-0", "Uyum Kuyruğu Hacmi", "Bekleyen uyum kontrol sayısı", "line", "Hukuk (Yakında)", "legal", {
      chartData: [8, 12, 10, 15, 11, 9, 7],
      metricBadge: "Uyum Kontrolü",
    }),
    buildMetric("legal-metric-1", "Risk Maruziyet Özeti", "Hukuki risk kategorileri dağılımı", "donut", "Hukuk (Yakında)", "legal", {
      chartData: [60, 25, 15],
      chartLabels: ["Düşük", "Orta", "Yüksek"],
      metricBadge: "Risk Dağılımı",
    }),
    buildMetric("legal-metric-2", "İnceleme SLA Trendi", "Ortalama inceleme süresi evrimi", "line", "Hukuk (Yakında)", "legal", {
      chartData: [5, 4.5, 6, 5.5, 4, 3.8, 4.2],
      metricBadge: "SLA Trendi",
    }),
    buildMetric("legal-metric-3", "Denetim Olayları Trendi", "Aylık denetim olayı sayısı", "bar", "Hukuk (Yakında)", "legal", {
      chartData: [3, 5, 2, 4, 6, 3, 2],
      chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
      metricBadge: "Denetim Olayları",
    }),
  ],
};

export function getMetricIntelligence(deptId: DepartmentId, metricId: string): MetricIntelligence | undefined {
  const metrics = departmentMetrics[deptId];
  if (!metrics) return undefined;
  return metrics.find(m => m.id === metricId);
}
