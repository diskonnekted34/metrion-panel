import { Calendar, Clock, TrendingUp, Shield, Zap, BarChart3, DollarSign, AlertTriangle, Target, Activity, Brain, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ReportTimeframe = "daily" | "weekly" | "monthly" | "quarterly" | "annual";

export interface ReportSection {
  title: string;
  type: "summary" | "score" | "metrics" | "risks" | "actions" | "snapshot" | "forecast" | "chart" | "matrix" | "notes";
  content: string;
  data?: Record<string, any>;
}

export interface IntelligenceReport {
  id: string;
  timeframe: ReportTimeframe;
  title: string;
  subtitle: string;
  date: string;
  generatedAt: string;
  agent: string;
  status: "ready" | "generating" | "scheduled";
  confidenceScore: number;
  intelligenceScore: number;
  sections: ReportSection[];
  coreMetrics: { label: string; value: string; change: number; trend: "up" | "down" | "stable" }[];
  topRisk: string;
  topOpportunity: string;
  recommendedActions: string[];
  departmentHealthScores: { dept: string; score: number }[];
  recipients: string[];
}

export const timeframeConfig: Record<ReportTimeframe, { label: string; icon: LucideIcon; color: string; frequency: string }> = {
  daily: { label: "Günlük", icon: Clock, color: "text-success", frequency: "Her gün 08:00" },
  weekly: { label: "Haftalık", icon: Calendar, color: "text-primary", frequency: "Her Pazartesi 09:00" },
  monthly: { label: "Aylık", icon: BarChart3, color: "text-warning", frequency: "Her ayın 1'i" },
  quarterly: { label: "Çeyreklik", icon: Target, color: "text-destructive", frequency: "Her çeyrek sonu" },
  annual: { label: "Yıllık", icon: TrendingUp, color: "text-primary", frequency: "31 Aralık" },
};

const baseCoreMetrics = [
  { label: "Gelir", value: "₺12.4M", change: 4.2, trend: "up" as const },
  { label: "Net Kâr", value: "₺2.1M", change: -1.8, trend: "down" as const },
  { label: "Katkı Marjı", value: "%34.2", change: 0.5, trend: "up" as const },
  { label: "Nakit Pozisyonu", value: "₺8.7M", change: 2.1, trend: "up" as const },
  { label: "Büyüme Oranı", value: "%12.4", change: 1.2, trend: "up" as const },
  { label: "CAC", value: "₺245", change: -3.1, trend: "down" as const },
  { label: "LTV/CAC", value: "3.8x", change: 0.3, trend: "up" as const },
  { label: "Operasyonel Verimlilik", value: "%87.3", change: 1.4, trend: "up" as const },
  { label: "Risk Yoğunluk Skoru", value: "32/100", change: -2.0, trend: "down" as const },
  { label: "AI Güven Endeksi", value: "%91", change: 0.8, trend: "up" as const },
];

const baseDeptHealth = [
  { dept: "Yönetim", score: 92 },
  { dept: "Finans", score: 88 },
  { dept: "Pazarlama", score: 79 },
  { dept: "Operasyon", score: 85 },
  { dept: "Teknoloji", score: 91 },
  { dept: "Kreatif", score: 76 },
  { dept: "Pazaryeri", score: 83 },
  { dept: "Hukuk", score: 90 },
];

const dailySections: ReportSection[] = [
  { title: "Günlük Yönetici Özeti", type: "summary", content: "Bugün genel iş performansı stabil seyretti. Gelirde %1.2 günlük artış, operasyonel maliyetlerde %0.3 düşüş gözlemlendi. Pazarlama kanallarında ROAS performansı hedefin %4 üzerinde gerçekleşti. Nakit pozisyonu güçlü, ancak AR aging'de 3 günlük artış dikkat gerektiriyor." },
  { title: "Günlük İstihbarat Skoru", type: "score", content: "Genel iş sağlığı ve performans endeksi", data: { score: 78, maxScore: 100, breakdown: { finansal: 82, operasyonel: 76, risk: 74, büyüme: 80 } } },
  { title: "Kritik Değişim Alanları", type: "metrics", content: "Son 24 saatte en yüksek değişim gösteren 3 metrik", data: { changes: [{ metric: "E-ticaret Dönüşüm Oranı", change: "+8.3%", direction: "up" }, { metric: "Müşteri Destek Yanıt Süresi", change: "-12%", direction: "down" }, { metric: "Stok Tükenme Riski (A-Sınıf)", change: "+15%", direction: "up" }] } },
  { title: "Tespit Edilen Riskler", type: "risks", content: "Günlük risk taraması sonuçları", data: { risks: [{ area: "Finansal", level: "medium", detail: "AR aging 3 gün arttı, tahsilat takibi gerekli" }, { area: "Operasyonel", level: "low", detail: "Depo kapasitesi %88, kritik eşiğe yaklaşıyor" }, { area: "Pazarlama", level: "high", detail: "Google Ads CPC %12 arttı, bütçe optimizasyonu gerekli" }] } },
  { title: "Günlük Anomali Tespiti", type: "metrics", content: "AI tarafından tespit edilen olağandışı hareketler", data: { anomalies: [{ title: "Anormal sipariş artışı", detail: "14:00-16:00 arası sipariş hacmi ortalamanın 2.3x üzerinde", severity: "info" }, { title: "Ödeme başarısızlık oranı", detail: "Son 6 saatte %4.2 (normal: %1.8)", severity: "warning" }] } },
  { title: "Bugün İçin Önerilen 3 Aksiyon", type: "actions", content: "AI tarafından önceliklendirilen aksiyonlar" },
  { title: "Departman Sağlık Snapshot", type: "snapshot", content: "Tüm departmanların anlık sağlık durumu" },
  { title: "Nakit & Gelir Mikro Değişimi", type: "chart", content: "Son 24 saatlik nakit ve gelir hareketleri", data: { cashChange: "+₺124K", revenueChange: "+₺312K", burnRate: "₺45K/gün" } },
  { title: "Kanal Performans Özeti", type: "metrics", content: "Satış kanallarının günlük performansı", data: { channels: [{ name: "E-ticaret", revenue: "₺4.2M", change: "+3.1%" }, { name: "Pazaryeri", revenue: "₺3.8M", change: "+1.7%" }, { name: "Kurumsal", revenue: "₺2.1M", change: "-0.4%" }, { name: "Perakende", revenue: "₺2.3M", change: "+2.8%" }] } },
  { title: "Güven Skoru", type: "score", content: "AI model güvenilirlik endeksi", data: { score: 91, factors: [{ label: "Veri tamlığı", value: 94 }, { label: "Örneklem", value: 88 }, { label: "Anomali yoğunluğu", value: 91 }] } },
];

const weeklySections: ReportSection[] = [
  { title: "Haftalık Yönetici Özeti", type: "summary", content: "Bu hafta konsolide gelir hedefin %2.4 üzerinde gerçekleşti. Net kâr marjında hafif erozyon gözlemlense de, nakit pozisyonu güçlü kalmaya devam ediyor. Pazarlama kanallarında ROAS genel ortalaması 4.2x ile hedefin üzerinde. Operasyonel verimlilik endeksinde %1.4 iyileşme kaydedildi. Risk yoğunluk skoru geçen haftaya göre 3 puan düştü. Önümüzdeki hafta için 2 kritik aksiyon öneriliyor." },
  { title: "Performans Trend Analizi", type: "chart", content: "Haftalık temel metrik trendleri", data: { trends: [{ metric: "Gelir", values: [11.8, 12.1, 12.4], unit: "M₺" }, { metric: "Net Kâr", values: [2.3, 2.2, 2.1], unit: "M₺" }, { metric: "Katkı Marjı", values: [33.8, 34.0, 34.2], unit: "%" }, { metric: "Nakit", values: [8.2, 8.5, 8.7], unit: "M₺" }] } },
  { title: "Departman Katkı Matrisi", type: "matrix", content: "Her departmanın haftalık performans katkısı" },
  { title: "Risk Haritası", type: "risks", content: "Haftalık konsolide risk değerlendirmesi", data: { riskMatrix: [{ area: "Pazar Riski", probability: "medium", impact: "high", trend: "stable" }, { area: "Operasyonel Risk", probability: "low", impact: "medium", trend: "improving" }, { area: "Finansal Risk", probability: "low", impact: "high", trend: "stable" }, { area: "Teknoloji Riski", probability: "medium", impact: "medium", trend: "worsening" }] } },
  { title: "Marj Erozyonu Analizi", type: "chart", content: "Kâr marjını etkileyen faktörlerin kırılımı", data: { erosionFactors: [{ factor: "Ham madde maliyeti", impact: -0.8 }, { factor: "Lojistik gider artışı", impact: -0.3 }, { factor: "İndirim oranı artışı", impact: -0.5 }, { factor: "Ölçek ekonomisi", impact: +0.4 }] } },
  { title: "Kanal ROI Değerlendirmesi", type: "metrics", content: "Satış ve pazarlama kanallarının ROI analizi" },
  { title: "Operasyonel Verimlilik Endeksi", type: "score", content: "Haftalık operasyonel performans özeti", data: { score: 87, subScores: [{ label: "Sipariş tamamlama", value: 92 }, { label: "Tedarik süresi", value: 84 }, { label: "Kalite oranı", value: 89 }, { label: "Kapasite kullanımı", value: 83 }] } },
  { title: "Önümüzdeki 7 Gün Tahmini", type: "forecast", content: "AI destekli haftalık projeksiyon", data: { forecast: { revenue: "₺12.8M", confidence: 87, risks: ["Mevsimsel talep düşüşü", "Tedarik zinciri gecikmesi"] } } },
  { title: "Önerilen Stratejik Aksiyonlar", type: "actions", content: "Önceliklendirilmiş haftalık aksiyon listesi" },
  { title: "AI Güven Endeksi", type: "score", content: "Haftalık model güvenilirlik değerlendirmesi", data: { score: 89 } },
  { title: "Yönetim İçin Kritik Notlar", type: "notes", content: "Bu hafta dikkat edilmesi gereken stratejik konular", data: { notes: ["AR aging'de 5 günlük artış, tahsilat takibi acil", "Rakip X'in fiyat indirimi pazar payını etkileyebilir", "Q2 bütçe revizyonu için veriler hazır"] } },
];

const monthlySections: ReportSection[] = [
  { title: "Aylık Genel Performans Özeti", type: "summary", content: "Şubat 2026 dönemi genel değerlendirmesinde, konsolide gelir ₺48.2M ile bütçenin %3.1 üzerinde gerçekleşti. Net kâr ₺8.4M, katkı marjı %34.2 olarak ölçüldü. Nakit pozisyonu ₺8.7M ile güçlü seyrederken, 90 günlük runway hesaplaması 14.2 ay olarak projekte edildi. Büyüme dinamikleri pozitif, ancak kanal konsantrasyon riski dikkat gerektiriyor." },
  { title: "Finansal Analiz", type: "chart", content: "Aylık detaylı finansal performans", data: { revenue: "₺48.2M", netProfit: "₺8.4M", contributionMargin: "34.2%", cashRunway: "14.2 ay", arAging: "32 gün" } },
  { title: "Büyüme Dinamikleri", type: "chart", content: "Büyüme kaynaklarının analizi", data: { organicGrowth: "8.2%", paidGrowth: "4.2%", retentionRate: "87%", newCustomerRate: "12.4%" } },
  { title: "Maliyet Yapısı & Erozyon", type: "chart", content: "Maliyet kalemlerinin trend analizi" },
  { title: "Risk Yoğunluk Endeksi", type: "score", content: "Aylık konsolide risk değerlendirmesi", data: { score: 32, trend: "improving", monthlyChange: -4 } },
  { title: "Departman Bazlı KPI Değerlendirme", type: "matrix", content: "Her departmanın aylık KPI performansı" },
  { title: "Kanal Konsantrasyon Analizi", type: "chart", content: "Gelir dağılımının kanal bazlı konsantrasyon riski" },
  { title: "Operasyonel Sağlık Endeksi", type: "score", content: "Aylık operasyonel verimlilik", data: { score: 85 } },
  { title: "30 Günlük Öngörü", type: "forecast", content: "Önümüzdeki ay için AI projeksiyonu" },
  { title: "Stratejik Tavsiyeler", type: "actions", content: "Board seviyesi stratejik öneriler" },
  { title: "Öncelikli Aksiyon Listesi", type: "actions", content: "Aylık önceliklendirilmiş aksiyonlar" },
];

const quarterlySections: ReportSection[] = [
  { title: "Çeyrek Genel Değerlendirme", type: "summary", content: "Q1 2026 döneminde şirket genelinde konsolide gelir ₺142.6M ile yıllık hedefin %26.2'sine ulaştı. Net kâr marjı %17.1 ile sektör ortalamasının üzerinde seyretti. Departmanlar arası sinerji endeksi 78/100 olarak ölçüldü. Likidite dayanıklılık analizi 18 aylık runway gösteriyor. Rekabet pozisyonu güçlü, ancak 2 kritik stratejik risk tespit edildi." },
  { title: "Konsolide Finansal Performans", type: "chart", content: "Çeyreklik konsolide finansal tablo" },
  { title: "Departman Katkı Haritası", type: "matrix", content: "Departmanların çeyreklik katkı analizi" },
  { title: "Stratejik Risk Analizi", type: "risks", content: "Çeyreklik risk değerlendirmesi" },
  { title: "Rekabet Konum Tahmini", type: "chart", content: "Pazar pozisyonu ve rekabet analizi" },
  { title: "Kanal Bağımlılık Riski", type: "chart", content: "Gelir kaynaklarının çeşitlilik analizi" },
  { title: "Likidite Dayanıklılık Analizi", type: "chart", content: "Nakit akışı stres testi sonuçları" },
  { title: "Senaryo Karşılaştırma Simülasyonu", type: "chart", content: "En iyi/kötü/baz senaryo karşılaştırması" },
  { title: "6 Aylık Projeksiyon", type: "forecast", content: "Yarı yıl projeksiyonu" },
  { title: "Yönetim İçin Stratejik Öncelikler", type: "actions", content: "Çeyreklik stratejik öncelik listesi" },
  { title: "AI Model Güvenirlik Endeksi", type: "score", content: "Çeyreklik model performans değerlendirmesi", data: { score: 93 } },
];

const annualSections: ReportSection[] = [
  { title: "Yılın Stratejik Özeti", type: "summary", content: "2025 mali yılında şirket, ₺580M konsolide gelir ile yıllık hedefin %104.2'sini gerçekleştirdi. Net kâr ₺98.6M olarak ölçüldü. Sermaye verimliliği skoru 82/100, karlılık stabilite endeksi 88/100 olarak hesaplandı. Organizasyonel uyum skoru 79/100 ile geçen yıla göre 6 puanlık iyileşme kaydedildi. 5 yıllık projeksiyon modeli, mevcut stratejinin sürdürülmesi halinde ₺1.2B gelir potansiyeli öngörüyor." },
  { title: "Finansal Performans Analizi", type: "chart", content: "Yıllık detaylı finansal performans" },
  { title: "Büyüme Trendleri", type: "chart", content: "Yıllık büyüme dinamikleri" },
  { title: "Risk Geçmişi & Trend", type: "chart", content: "Yıl boyunca risk yoğunluk trendi" },
  { title: "Departman Bazlı Katkı Analizi", type: "matrix", content: "Yıllık departman performans matrisi" },
  { title: "Sermaye Verimlilik Skoru", type: "score", content: "Yıllık sermaye kullanım verimliliği", data: { score: 82 } },
  { title: "Karlılık Stabilite Endeksi", type: "score", content: "Kâr marjı tutarlılık değerlendirmesi", data: { score: 88 } },
  { title: "Organizasyonel Uyum Skoru", type: "score", content: "Departmanlar arası hedef uyumu", data: { score: 79 } },
  { title: "5 Yıllık Projeksiyon", type: "forecast", content: "Uzun vadeli stratejik projeksiyon" },
  { title: "Stratejik Senaryo Simülasyonu", type: "chart", content: "Yıllık senaryo analizi" },
  { title: "Önümüzdeki Yıl İçin 12 Kritik Aksiyon", type: "actions", content: "Yıllık stratejik aksiyon planı" },
  { title: "AI Güven Endeksi & Model Şeffaflığı", type: "score", content: "Yıllık AI performans değerlendirmesi", data: { score: 94, transparency: { dataPoints: "2.4M", modelUpdates: 47, accuracy: "91.3%" } } },
];

export const mockReports: IntelligenceReport[] = [
  // Daily reports
  ...[0, 1, 2, 3, 4].map((i): IntelligenceReport => ({
    id: `daily-${i}`,
    timeframe: "daily",
    title: "Günlük Operasyon & Risk Özeti",
    subtitle: `${16 - i} Şubat 2026`,
    date: `2026-02-${String(16 - i).padStart(2, "0")}`,
    generatedAt: `${16 - i} Şubat 2026, 08:00`,
    agent: "CEO Agent",
    status: i === 0 ? "ready" : "ready",
    confidenceScore: 91 - i,
    intelligenceScore: 78 + Math.floor(Math.random() * 8),
    sections: dailySections,
    coreMetrics: baseCoreMetrics.map(m => ({ ...m, change: m.change + (Math.random() - 0.5) })),
    topRisk: "Google Ads CPC %12 artışı, pazarlama bütçesi optimizasyonu gerekli",
    topOpportunity: "E-ticaret dönüşüm oranında %8.3 artış trendi sürdürülebilir",
    recommendedActions: ["Pazarlama bütçesini yüksek ROAS kanallarına yönlendir", "AR aging için otomatik tahsilat takibi başlat", "Stok tükenme riski yüksek SKU'lar için acil tedarik başlat"],
    departmentHealthScores: baseDeptHealth,
    recipients: ["CEO", "CFO", "COO"],
  })),
  // Weekly
  ...[0, 1, 2, 3].map((i): IntelligenceReport => ({
    id: `weekly-${i}`,
    timeframe: "weekly",
    title: "Haftalık Stratejik İstihbarat Raporu",
    subtitle: `Hafta ${7 - i}, Şubat 2026`,
    date: `2026-02-${String(16 - i * 7).padStart(2, "0")}`,
    generatedAt: `${16 - i * 7} Şubat 2026, 09:00`,
    agent: "CEO Agent",
    status: "ready",
    confidenceScore: 89 - i,
    intelligenceScore: 82 + Math.floor(Math.random() * 6),
    sections: weeklySections,
    coreMetrics: baseCoreMetrics,
    topRisk: "Rakip X fiyat indirimi pazar payını tehdit edebilir",
    topOpportunity: "Katkı marjında sürdürülebilir iyileşme trendi",
    recommendedActions: ["Q2 bütçe revizyonu için departman bazlı analiz tamamla", "Rakip fiyat stratejisine karşı senaryo simülasyonu çalıştır", "Yüksek performanslı kreatif varyantları scale et"],
    departmentHealthScores: baseDeptHealth,
    recipients: ["CEO", "CFO", "CMO", "COO", "CTO"],
  })),
  // Monthly
  {
    id: "monthly-0",
    timeframe: "monthly",
    title: "Aylık Stratejik Performans Dosyası",
    subtitle: "Ocak 2026",
    date: "2026-02-01",
    generatedAt: "1 Şubat 2026, 09:00",
    agent: "CEO Agent",
    status: "ready",
    confidenceScore: 92,
    intelligenceScore: 85,
    sections: monthlySections,
    coreMetrics: baseCoreMetrics,
    topRisk: "Kanal konsantrasyon riski: E-ticaret gelir payı %42'ye ulaştı",
    topOpportunity: "Kurumsal kanal büyüme potansiyeli %18 artış öngörüyor",
    recommendedActions: ["Kanal çeşitlendirme stratejisi oluştur", "Maliyet optimizasyon programı başlat", "Q2 büyüme hedeflerini revize et"],
    departmentHealthScores: baseDeptHealth,
    recipients: ["CEO", "Board", "Department Heads"],
  },
  // Quarterly
  {
    id: "quarterly-0",
    timeframe: "quarterly",
    title: "Çeyreklik Kurumsal İstihbarat Dosyası",
    subtitle: "Q4 2025",
    date: "2026-01-05",
    generatedAt: "5 Ocak 2026, 09:00",
    agent: "CEO Agent",
    status: "ready",
    confidenceScore: 93,
    intelligenceScore: 88,
    sections: quarterlySections,
    coreMetrics: baseCoreMetrics,
    topRisk: "2 kritik stratejik risk: Pazar konsantrasyonu ve tedarik zinciri fragilitesi",
    topOpportunity: "Yeni pazar segmenti penetrasyonu ₺24M ek gelir potansiyeli",
    recommendedActions: ["Pazar çeşitlendirme stratejisi onayı", "Tedarik zinciri resilience programı", "Yeni segment için pilot program başlat"],
    departmentHealthScores: baseDeptHealth,
    recipients: ["CEO", "Board of Directors", "Investors"],
  },
  // Annual
  {
    id: "annual-0",
    timeframe: "annual",
    title: "Yıllık Stratejik Plan & Öngörü Dosyası",
    subtitle: "2025 Mali Yılı",
    date: "2026-01-15",
    generatedAt: "15 Ocak 2026, 09:00",
    agent: "CEO Agent",
    status: "ready",
    confidenceScore: 94,
    intelligenceScore: 91,
    sections: annualSections,
    coreMetrics: baseCoreMetrics,
    topRisk: "Sermaye verimliliği optimize edilmezse 2027'de büyüme yavaşlama riski",
    topOpportunity: "Mevcut strateji sürdürülürse 5 yılda ₺1.2B gelir potansiyeli",
    recommendedActions: ["2026 stratejik plan revizyonu", "Sermaye tahsis modelini güncelle", "Organizasyonel uyum programı", "Teknoloji yatırım roadmap onayı"],
    departmentHealthScores: baseDeptHealth,
    recipients: ["CEO", "Board of Directors", "Investors", "Advisory Board"],
  },
];

export const getReportsByTimeframe = (tf: ReportTimeframe) => mockReports.filter(r => r.timeframe === tf);
export const getReportById = (id: string) => mockReports.find(r => r.id === id);
