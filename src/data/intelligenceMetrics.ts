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
  score: number;
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
  reliability: number;
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

export const getMetricId = (deptId: DepartmentId, chartIndex: number): string =>
  `${deptId}-metric-${chartIndex}`;

// ═══════════════════════════════════════════════════════════════════════
// YÖNETİM (CEO)
// ═══════════════════════════════════════════════════════════════════════

const executiveMetrics: MetricIntelligence[] = [
  {
    id: "executive-metric-0",
    title: "Gelir vs Net Kâr",
    subtitle: "Aylık gelir ve kâr karşılaştırması",
    metricType: "line",
    agent: "CEO Agent",
    departmentId: "executive",
    chartData: [2840, 3120, 2960, 3380, 3590, 3470, 3810],
    chartData2: [340, 410, 290, 480, 540, 510, 620],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [3950, 4120, 4300],
    confidenceScore: 88,
    dataCompleteness: 94,
    lastUpdated: "45 dk önce",
    metricBadge: "Finansal Performans",
    insights: [
      { text: "Gelir son 3 ayda %14.2 büyüme gösterdi; organik kanal katkısı %62'ye yükseldi.", type: "opportunity" },
      { text: "Net kâr marjı Mart'ta %9.8'e düştü; COGS artışı ana etken.", type: "risk" },
      { text: "Mevcut momentum korunursa Q4 gelir hedefi (%15 YoY) erişilebilir.", type: "opportunity" },
      { text: "Pazarlama harcama/gelir oranı %18'den %15'e optimize edildi.", type: "opportunity" },
      { text: "Kur volatilitesi net kâr üzerinde %1.2 baskı yaratıyor.", type: "risk" },
    ],
    rootCause: {
      description: "Gelir büyümesinin %58'i D2C kanalından, %24'ü pazaryeri genişlemesinden kaynaklanıyor. Kâr marjı iyileşmesi tedarikçi renegosyasyonu ve SKU rasyonalizasyonuyla sağlandı.",
      sources: ["ERP Gelir Modülü", "Google Analytics 4", "CRM Pipeline Veritabanı"],
    },
    impactProjection: "Mevcut trend devam ederse 90 gün içinde toplam gelir ₺4.3M'a, net kâr marjı %16.8'e ulaşır. Ancak COGS kontrolü sağlanamazsa marj %13.5'e gerileyebilir.",
    suggestedActions: [
      { title: "COGS optimizasyon planı başlat", description: "Tedarikçi müzakerelerini hızlandır, alternatif kaynak araştırması yap.", priority: "high" },
      { title: "D2C kanal yatırımını artır", description: "En yüksek marjlı kanal olan D2C'ye bütçe kaydır.", priority: "high" },
      { title: "Kur hedge stratejisi oluştur", description: "Döviz riskini minimize etmek için forward kontrat değerlendir.", priority: "medium" },
    ],
    correlations: [
      { metric: "Reklam Harcaması (ROAS)", score: 0.82, direction: "positive" },
      { metric: "Müşteri Edinme Maliyeti (CAC)", score: -0.74, direction: "negative" },
      { metric: "Organik Trafik", score: 0.91, direction: "positive" },
      { metric: "İade Oranı", score: -0.58, direction: "negative" },
      { metric: "Envanter Devir Hızı", score: 0.67, direction: "positive" },
    ],
    riskMap: [
      { factor: "COGS artış baskısı", probability: "high", impact: "high", department: "Operasyon" },
      { factor: "Kur dalgalanması", probability: "high", impact: "medium", department: "Finans" },
      { factor: "Pazar doygunluğu", probability: "medium", impact: "high", department: "Pazarlama" },
      { factor: "Tedarik zinciri kesintisi", probability: "low", impact: "high", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "price", label: "Fiyat Değişimi", min: -10, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "budget_cut", label: "Bütçe Kesintisi", min: 0, max: 20, step: 1, defaultValue: 0, unit: "%" },
      { id: "cogs", label: "COGS Değişimi", min: -10, max: 10, step: 1, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "ERP Gelir Modülü", lastSync: "45 dk önce", reliability: 97, status: "healthy" },
      { name: "Google Analytics 4", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
      { name: "CRM Pipeline", lastSync: "2 saat önce", reliability: 91, status: "healthy" },
      { name: "Banka API", lastSync: "30 dk önce", reliability: 99, status: "healthy" },
    ],
    segments: [
      { label: "D2C Web", value: 1520, change: 18 },
      { label: "Pazaryeri", value: 1180, change: 11 },
      { label: "Toptan B2B", value: 720, change: -4 },
      { label: "Kurumsal", value: 390, change: 28 },
    ],
    anomalies: [
      { period: "Mar", value: 2960, expected: 3200, description: "Mevsimsel düşüş + Google Ads bütçe optimizasyonu gecikmesi" },
      { period: "Tem", value: 3810, expected: 3550, description: "Yaz kampanyası ve yeni ürün lansmanı sinerjisi" },
    ],
  },
  {
    id: "executive-metric-1",
    title: "Çoklu Skor Radar",
    subtitle: "Finansal / Büyüme / Operasyon / Risk / Sermaye / Uyum",
    metricType: "radar",
    agent: "CEO Agent",
    departmentId: "executive",
    chartData: [82, 68, 74, 55, 78, 85],
    chartLabels: ["Finans", "Büyüme", "Operasyon", "Risk", "Sermaye", "Uyum"],
    confidenceScore: 85,
    dataCompleteness: 89,
    lastUpdated: "1 saat önce",
    metricBadge: "Genel Sağlık",
    insights: [
      { text: "Büyüme skoru %68 ile en zayıf alan; yeni müşteri edinme hızı yavaşlıyor.", type: "risk" },
      { text: "Uyum skoru %85 ile sektör ortalamasının (%72) üzerinde.", type: "opportunity" },
      { text: "Risk skoru %55; açık pozisyon sayısı ve tedarik bağımlılığı ana etkenler.", type: "risk" },
      { text: "Sermaye kullanım verimliliği %78 ile hedef bandında.", type: "neutral" },
    ],
    rootCause: {
      description: "Risk skorundaki düşüklük: tek tedarikçi bağımlılığı (%40 COGS) ve 3 kritik pozisyonun açık olması. Büyüme yavaşlaması: CAC'ın LTV'ye oranının %28'e çıkması.",
      sources: ["HR Sistemi", "ERP Tedarikçi Modülü", "Finans Konsolidasyonu"],
    },
    impactProjection: "Risk skoru 3 ay içinde iyileştirilmezse operasyonel marj %2.5 aşınabilir. Büyüme aksiyonları alınırsa Q1'de %75'e çıkarılabilir.",
    suggestedActions: [
      { title: "Tedarikçi çeşitlendirme programı", description: "Tek tedarikçi bağımlılığını %40'tan %25'e düşür.", priority: "high" },
      { title: "Kritik pozisyon doldurma hızlandır", description: "3 açık C-Level/Lead pozisyonunu 45 gün içinde kapat.", priority: "high" },
      { title: "CAC/LTV oranını optimize et", description: "Retention programları ile LTV'yi %15 artır.", priority: "medium" },
    ],
    correlations: [
      { metric: "Çalışan Memnuniyeti", score: 0.76, direction: "positive" },
      { metric: "Operasyonel Verimlilik", score: 0.84, direction: "positive" },
      { metric: "Tek Tedarikçi Oranı", score: -0.69, direction: "negative" },
      { metric: "Müşteri Churn", score: -0.71, direction: "negative" },
    ],
    riskMap: [
      { factor: "Tek tedarikçi bağımlılığı", probability: "high", impact: "high", department: "Operasyon" },
      { factor: "Anahtar personel kaybı", probability: "medium", impact: "high", department: "Yönetim" },
      { factor: "Müşteri churn artışı", probability: "medium", impact: "medium", department: "Pazarlama" },
      { factor: "Regülasyon değişikliği", probability: "low", impact: "medium", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "supplier_div", label: "Tedarikçi Çeşitlendirme", min: 0, max: 50, step: 5, defaultValue: 0, unit: "%" },
      { id: "hiring", label: "İşe Alım Hızı", min: -30, max: 30, step: 5, defaultValue: 0, unit: "%" },
      { id: "retention", label: "Müşteri Tutundurma", min: -10, max: 20, step: 1, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "ERP Konsolidasyon", lastSync: "1 saat önce", reliability: 95, status: "healthy" },
      { name: "HR Platformu", lastSync: "3 saat önce", reliability: 88, status: "healthy" },
      { name: "Risk Yönetim Sistemi", lastSync: "2 saat önce", reliability: 82, status: "warning" },
    ],
    segments: [
      { label: "Finans Sağlığı", value: 82, change: 4 },
      { label: "Büyüme Momentumu", value: 68, change: -6 },
      { label: "Operasyonel Verimlilik", value: 74, change: 2 },
      { label: "Risk Yönetimi", value: 55, change: -8 },
      { label: "Sermaye Verimliliği", value: 78, change: 3 },
      { label: "Uyum Skoru", value: 85, change: 5 },
    ],
    anomalies: [
      { period: "Nis", value: 55, expected: 65, description: "Risk skoru: kritik tedarikçi gecikmesi ve 2 üst düzey istifa" },
    ],
  },
  {
    id: "executive-metric-2",
    title: "Nakit Akışı & Pist Trendi",
    subtitle: "Aylık nakit pozisyonu ve pist projeksiyonu",
    metricType: "line",
    agent: "CEO Agent",
    departmentId: "executive",
    chartData: [920, 870, 810, 840, 880, 850, 910],
    chartData2: [14.2, 13.1, 12.0, 12.5, 13.4, 12.8, 14.0],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [930, 960, 990],
    confidenceScore: 83,
    dataCompleteness: 96,
    lastUpdated: "30 dk önce",
    metricBadge: "Nakit Pozisyonu",
    insights: [
      { text: "Nakit pist 14 ay ile güvenli bölgede; minimum eşik 9 ay.", type: "opportunity" },
      { text: "Mart'ta nakit ₺810K'ya düştü; büyük tedarikçi ödemesi ana etken.", type: "neutral" },
      { text: "Operasyonel nakit akışı pozitif ve iyileşme trendinde.", type: "opportunity" },
      { text: "AR aging 45+ gün olan alacaklar %12'ye yükseldi.", type: "risk" },
    ],
    rootCause: {
      description: "Nakit dalgalanması çeyrek sonu tedarikçi ödemeleri ve AR tahsilat gecikmelerinden kaynaklanıyor. Pist stabilizasyonu yeni B2B kontratlarının peşin ödeme koşullarıyla sağlandı.",
      sources: ["Banka API", "ERP Finans Modülü", "AR/AP Raporlama"],
    },
    impactProjection: "Mevcut burn rate ile nakit pist 14.5 ay. AR aging kontrol altına alınırsa 16 aya uzatılabilir. Kontrol edilmezse 11 aya düşebilir.",
    suggestedActions: [
      { title: "AR tahsilat hızlandır", description: "45+ gün aging olan ₺180K alacak için tahsilat süreci başlat.", priority: "high" },
      { title: "Ödeme vade optimizasyonu", description: "Tedarikçi ödeme vadelerini 30'dan 45 güne uzat.", priority: "medium" },
      { title: "Nakit akış tahmini otomasyonu", description: "Haftalık rolling forecast modeli kur.", priority: "low" },
    ],
    correlations: [
      { metric: "Gelir Büyüme Hızı", score: 0.79, direction: "positive" },
      { metric: "AR Aging (45+ gün)", score: -0.83, direction: "negative" },
      { metric: "Operasyonel Maliyet", score: -0.72, direction: "negative" },
      { metric: "B2B Kontrat Hacmi", score: 0.68, direction: "positive" },
    ],
    riskMap: [
      { factor: "AR tahsilat gecikmesi", probability: "high", impact: "medium", department: "Finans" },
      { factor: "Büyük tedarikçi ödemesi", probability: "medium", impact: "medium", department: "Operasyon" },
      { factor: "Beklenmeyen harcama", probability: "low", impact: "high", department: "Yönetim" },
    ],
    simulationParams: [
      { id: "revenue_change", label: "Gelir Değişimi", min: -15, max: 20, step: 1, defaultValue: 0, unit: "%" },
      { id: "opex_change", label: "Sabit Gider Değişimi", min: -10, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "ar_improvement", label: "AR Tahsilat İyileşme", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Banka API", lastSync: "30 dk önce", reliability: 99, status: "healthy" },
      { name: "ERP Finans", lastSync: "1 saat önce", reliability: 96, status: "healthy" },
      { name: "AR/AP Sistemi", lastSync: "2 saat önce", reliability: 91, status: "healthy" },
    ],
    segments: [
      { label: "Operasyonel Nakit", value: 580, change: 8 },
      { label: "Yatırım Nakit", value: 180, change: -12 },
      { label: "Finansman Nakit", value: 150, change: 3 },
    ],
    anomalies: [
      { period: "Mar", value: 810, expected: 860, description: "Çeyrek sonu tedarikçi toplu ödeme + yatırım harcaması" },
    ],
  },
  {
    id: "executive-metric-3",
    title: "Departmanlar Arası Risk Haritası",
    subtitle: "Çapraz departman risk korelasyonu",
    metricType: "heatmap",
    agent: "CEO Agent",
    departmentId: "executive",
    chartData: [85, 70, 60, 45],
    chartLabels: ["Finans", "Pazarlama", "Operasyon", "Teknoloji"],
    confidenceScore: 79,
    dataCompleteness: 86,
    lastUpdated: "2 saat önce",
    metricBadge: "Risk Haritası",
    insights: [
      { text: "Operasyon-Finans risk korelasyonu %88 ile en yüksek; envanter maliyeti ana bağlantı.", type: "risk" },
      { text: "Teknoloji risk skoru düşüyor; son 2 ayda 0 kritik incident.", type: "opportunity" },
      { text: "Pazarlama-Operasyon arasında envanter uyumsuzluğu riski artıyor.", type: "risk" },
      { text: "Hukuk riski düşük seviyede stabil.", type: "neutral" },
    ],
    rootCause: {
      description: "Çapraz departman riskleri envanter yönetimi, nakit akışı ve tedarik zinciri üzerinden birbirine bağlı. Pazarlama kampanyaları ile envanter planlaması arasındaki senkronizasyon eksikliği risk korelasyonunu artırıyor.",
      sources: ["Risk Yönetim Sistemi", "ERP Cross-Module", "Departman KPI Panelleri"],
    },
    impactProjection: "Çapraz risk yönetimi iyileştirilmezse 90 gün içinde operasyonel aksaklık olasılığı %35. Senkronizasyon sağlanırsa %12'ye düşürülebilir.",
    suggestedActions: [
      { title: "Çapraz departman risk komitesi kur", description: "Haftalık cross-functional risk review toplantısı başlat.", priority: "high" },
      { title: "Envanter-Kampanya senkronizasyonu", description: "Pazarlama ve Operasyon arasında envanter API entegrasyonu kur.", priority: "high" },
      { title: "Risk erken uyarı sistemi", description: "Otomatik threshold alert mekanizması oluştur.", priority: "medium" },
    ],
    correlations: [
      { metric: "Operasyonel Verimlilik", score: -0.78, direction: "negative" },
      { metric: "Envanter Doğruluğu", score: -0.72, direction: "negative" },
      { metric: "Departman İletişim Skoru", score: -0.65, direction: "negative" },
      { metric: "Otomasyon Oranı", score: -0.58, direction: "negative" },
    ],
    riskMap: [
      { factor: "Envanter-Kampanya uyumsuzluğu", probability: "high", impact: "high", department: "Operasyon + Pazarlama" },
      { factor: "Nakit akışı domino etkisi", probability: "medium", impact: "high", department: "Finans" },
      { factor: "Teknoloji sistem kesintisi", probability: "low", impact: "high", department: "Teknoloji" },
      { factor: "Regülasyon cascade etkisi", probability: "low", impact: "medium", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "sync_rate", label: "Departman Senkronizasyonu", min: 0, max: 100, step: 5, defaultValue: 45, unit: "%" },
      { id: "automation", label: "Otomasyon Seviyesi", min: 0, max: 100, step: 5, defaultValue: 30, unit: "%" },
      { id: "buffer", label: "Risk Buffer", min: 0, max: 30, step: 5, defaultValue: 10, unit: "%" },
    ],
    dataSources: [
      { name: "Risk Yönetim Sistemi", lastSync: "2 saat önce", reliability: 82, status: "warning" },
      { name: "ERP Cross-Module", lastSync: "1 saat önce", reliability: 90, status: "healthy" },
      { name: "Departman KPI Feed", lastSync: "3 saat önce", reliability: 85, status: "healthy" },
    ],
    segments: [
      { label: "Finans Riski", value: 85, change: -3 },
      { label: "Pazarlama Riski", value: 70, change: 5 },
      { label: "Operasyon Riski", value: 60, change: 8 },
      { label: "Teknoloji Riski", value: 45, change: -12 },
    ],
    anomalies: [
      { period: "May", value: 88, expected: 70, description: "Operasyon risk spike: tedarikçi gecikmesi + kampanya-envanter uyumsuzluğu" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// TEKNOLOJİ (CTO / CIO)
// ═══════════════════════════════════════════════════════════════════════

const technologyMetrics: MetricIntelligence[] = [
  {
    id: "technology-metric-0",
    title: "Deployment Health & Uptime",
    subtitle: "Sistem erişilebilirliği ve deployment başarı oranı",
    metricType: "line",
    agent: "CTO Agent",
    departmentId: "technology",
    chartData: [99.92, 99.85, 99.97, 99.72, 99.99, 99.88, 99.95],
    chartData2: [96, 94, 98, 91, 99, 95, 97],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [99.94, 99.96, 99.97],
    confidenceScore: 96,
    dataCompleteness: 99,
    lastUpdated: "5 dk önce",
    metricBadge: "Altyapı Sağlığı",
    insights: [
      { text: "Uptime ortalaması %99.9 ile SLA hedefinin (%99.5) üzerinde.", type: "opportunity" },
      { text: "Nisan'da %99.72'ye düşüş: DB migration sırasında 42 dk downtime.", type: "risk" },
      { text: "Deployment frequency haftada 12'ye çıktı; change failure rate %3.2.", type: "opportunity" },
      { text: "MTTR 18 dakikadan 11 dakikaya düştü; incident response iyileşti.", type: "opportunity" },
      { text: "Latency p95 değeri 280ms ile kabul sınırında; optimizasyon gerekli.", type: "risk" },
    ],
    rootCause: {
      description: "Nisan downtime'ı: production DB migration sırasında lock contention. Blue-green deployment stratejisine geçilmesiyle Mayıs'ta %99.99 yakalandı. MTTR iyileşmesi runbook otomasyonundan kaynaklanıyor.",
      sources: ["Datadog APM", "AWS CloudWatch", "PagerDuty Incident Log", "GitHub Actions"],
    },
    impactProjection: "Mevcut iyileşme devam ederse MTTR 90 gün içinde 8 dakikaya düşer. p95 latency optimize edilmezse kullanıcı deneyimi %12 kötüleşebilir.",
    suggestedActions: [
      { title: "Latency p95 optimizasyonu", description: "Yavaş endpoint'leri tespit et, query optimization ve cache stratejisi uygula.", priority: "high" },
      { title: "Blue-green deployment standardize et", description: "Tüm servislerde zero-downtime deployment zorunlu yap.", priority: "medium" },
      { title: "Chaos engineering programı başlat", description: "Aylık resilience testleri ile zayıf noktaları proaktif tespit et.", priority: "low" },
    ],
    correlations: [
      { metric: "Deployment Frequency", score: 0.72, direction: "positive" },
      { metric: "Change Failure Rate", score: -0.85, direction: "negative" },
      { metric: "MTTR", score: -0.79, direction: "negative" },
      { metric: "Müşteri Memnuniyeti", score: 0.68, direction: "positive" },
      { metric: "Latency p95", score: -0.74, direction: "negative" },
    ],
    riskMap: [
      { factor: "DB migration riski", probability: "medium", impact: "high", department: "Teknoloji" },
      { factor: "Latency threshold aşımı", probability: "high", impact: "medium", department: "Teknoloji" },
      { factor: "Tek region bağımlılığı", probability: "low", impact: "high", department: "Teknoloji" },
      { factor: "Certificate expiry", probability: "low", impact: "high", department: "Teknoloji" },
    ],
    simulationParams: [
      { id: "deploy_freq", label: "Deploy Frequency (hafta)", min: 4, max: 30, step: 2, defaultValue: 12, unit: "x" },
      { id: "cache_hit", label: "Cache Hit Rate", min: 50, max: 99, step: 1, defaultValue: 78, unit: "%" },
      { id: "auto_recovery", label: "Otomatik Recovery", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
    ],
    dataSources: [
      { name: "Datadog APM", lastSync: "5 dk önce", reliability: 99, status: "healthy" },
      { name: "AWS CloudWatch", lastSync: "10 dk önce", reliability: 97, status: "healthy" },
      { name: "PagerDuty", lastSync: "15 dk önce", reliability: 95, status: "healthy" },
      { name: "GitHub Actions", lastSync: "8 dk önce", reliability: 98, status: "healthy" },
    ],
    segments: [
      { label: "API Gateway", value: 99.99, change: 0.02 },
      { label: "Web App", value: 99.95, change: 0.05 },
      { label: "Background Jobs", value: 99.88, change: -0.03 },
      { label: "Database", value: 99.72, change: -0.15 },
    ],
    anomalies: [
      { period: "Nis", value: 99.72, expected: 99.90, description: "Planlı DB migration sırasında 42 dk unplanned downtime" },
    ],
  },
  {
    id: "technology-metric-1",
    title: "Teknik Borç Dağılımı",
    subtitle: "Kategorilere göre teknik borç oranları ve trend",
    metricType: "donut",
    agent: "CTO Agent",
    departmentId: "technology",
    chartData: [38, 35, 27],
    chartLabels: ["Altyapı", "Kod Kalitesi", "Test Coverage"],
    confidenceScore: 81,
    dataCompleteness: 87,
    lastUpdated: "3 saat önce",
    metricBadge: "Teknik Borç",
    insights: [
      { text: "Toplam teknik borç 342 saat ile son 6 ayın en yüksek seviyesinde.", type: "risk" },
      { text: "Altyapı borcu %38 ile en büyük pay; legacy monolith decomposition bekliyor.", type: "risk" },
      { text: "Test coverage %67'den %74'e yükseldi; hedef %85.", type: "opportunity" },
      { text: "Kod kalitesi borcu: 12 deprecated dependency güncelleme bekliyor.", type: "neutral" },
    ],
    rootCause: {
      description: "Teknik borç birikiminin %60'ı hızlı büyüme döneminde shortcut alınan mimari kararlardan kaynaklanıyor. Legacy monolith'in microservice'e dönüşümü planlandı ancak kaynak yetersizliği nedeniyle ertelendi.",
      sources: ["SonarQube", "GitHub Code Analysis", "Jira Tech Debt Board"],
    },
    impactProjection: "Teknik borç kontrol altına alınmazsa 6 ayda geliştirme hızı %25 düşer ve incident oranı %40 artar.",
    suggestedActions: [
      { title: "Sprint tech debt bütçesi ayır", description: "Her sprint'in %20'sini tech debt azaltmaya ayır.", priority: "high" },
      { title: "Monolith decomposition roadmap", description: "İlk 3 microservice ayrıştırma planını oluştur.", priority: "high" },
      { title: "Deprecated dependency cleanup", description: "12 kritik dependency'yi güncel versiyona çıkar.", priority: "medium" },
    ],
    correlations: [
      { metric: "Geliştirme Hızı", score: -0.82, direction: "negative" },
      { metric: "Incident Oranı", score: 0.76, direction: "positive" },
      { metric: "Developer Memnuniyeti", score: -0.71, direction: "negative" },
      { metric: "Deployment Başarı Oranı", score: -0.64, direction: "negative" },
    ],
    riskMap: [
      { factor: "Legacy monolith çökmesi", probability: "medium", impact: "high", department: "Teknoloji" },
      { factor: "Security vulnerability", probability: "high", impact: "high", department: "Teknoloji" },
      { factor: "Developer attrition", probability: "medium", impact: "medium", department: "Teknoloji" },
    ],
    simulationParams: [
      { id: "debt_sprint", label: "Sprint Tech Debt Bütçesi", min: 0, max: 40, step: 5, defaultValue: 10, unit: "%" },
      { id: "hiring", label: "Yeni Developer Sayısı", min: 0, max: 5, step: 1, defaultValue: 0, unit: "kişi" },
      { id: "automation", label: "Test Otomasyon Artışı", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "SonarQube", lastSync: "3 saat önce", reliability: 92, status: "healthy" },
      { name: "GitHub Insights", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
      { name: "Jira Board", lastSync: "2 saat önce", reliability: 88, status: "healthy" },
    ],
    segments: [
      { label: "Altyapı Borcu", value: 130, change: 12 },
      { label: "Kod Kalitesi Borcu", value: 120, change: -5 },
      { label: "Test Coverage Gap", value: 92, change: -8 },
    ],
    anomalies: [
      { period: "Haz", value: 342, expected: 280, description: "Hızlı feature release dönemi; tech debt review atlandı" },
    ],
  },
  {
    id: "technology-metric-2",
    title: "Veri Kalitesi & Yönetişim",
    subtitle: "Kurumsal veri kalitesi skoru ve yönetişim uyumu",
    metricType: "line",
    agent: "CIO Agent",
    departmentId: "technology",
    chartData: [72, 75, 78, 82, 85, 88, 91],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [93, 94, 95],
    confidenceScore: 87,
    dataCompleteness: 92,
    lastUpdated: "1 saat önce",
    metricBadge: "Veri Kalitesi",
    insights: [
      { text: "Veri kalitesi skoru %72'den %91'e yükseldi; master data cleanup etkili.", type: "opportunity" },
      { text: "Mükerrer kayıt oranı %8'den %2.1'e düştü.", type: "opportunity" },
      { text: "3 veri kaynağında schema drift tespit edildi; izleme gerekli.", type: "risk" },
      { text: "Data lineage coverage %68; hedef %90.", type: "neutral" },
    ],
    rootCause: {
      description: "Kalite iyileşmesi: otomatik data validation pipeline'ları ve master data management (MDM) implementasyonu. Schema drift: 3rd party API güncellemelerinin otomatik izlenmemesinden kaynaklanıyor.",
      sources: ["Data Catalog", "MDM Platform", "Schema Registry", "dbt Cloud"],
    },
    impactProjection: "Veri kalitesi %95'e ulaşırsa raporlama doğruluğu %18 artar ve karar alma süresi %25 kısalır.",
    suggestedActions: [
      { title: "Schema drift monitoring kur", description: "Otomatik schema change detection ve alerting sistemi implementle.", priority: "high" },
      { title: "Data lineage coverage artır", description: "Kritik 15 veri akışı için end-to-end lineage dokümante et.", priority: "medium" },
      { title: "Data quality SLA tanımla", description: "Her veri kaynağı için minimum kalite eşikleri belirle.", priority: "medium" },
    ],
    correlations: [
      { metric: "Raporlama Doğruluğu", score: 0.92, direction: "positive" },
      { metric: "Karar Alma Süresi", score: -0.78, direction: "negative" },
      { metric: "ML Model Accuracy", score: 0.84, direction: "positive" },
      { metric: "Mükerrer Kayıt Oranı", score: -0.88, direction: "negative" },
    ],
    riskMap: [
      { factor: "Schema drift", probability: "high", impact: "medium", department: "Teknoloji" },
      { factor: "Veri sızıntısı", probability: "low", impact: "high", department: "Hukuk" },
      { factor: "API breaking change", probability: "medium", impact: "medium", department: "Teknoloji" },
    ],
    simulationParams: [
      { id: "validation", label: "Validation Coverage", min: 50, max: 100, step: 5, defaultValue: 75, unit: "%" },
      { id: "lineage", label: "Lineage Coverage", min: 30, max: 100, step: 5, defaultValue: 68, unit: "%" },
      { id: "dedup", label: "Dedup Agresifliği", min: 0, max: 100, step: 10, defaultValue: 70, unit: "%" },
    ],
    dataSources: [
      { name: "Data Catalog", lastSync: "1 saat önce", reliability: 93, status: "healthy" },
      { name: "MDM Platform", lastSync: "2 saat önce", reliability: 90, status: "healthy" },
      { name: "Schema Registry", lastSync: "30 dk önce", reliability: 85, status: "warning" },
      { name: "dbt Cloud", lastSync: "45 dk önce", reliability: 96, status: "healthy" },
    ],
    segments: [
      { label: "Müşteri Verileri", value: 94, change: 8 },
      { label: "Ürün Verileri", value: 91, change: 6 },
      { label: "Finansal Veriler", value: 96, change: 3 },
      { label: "Operasyonel Veriler", value: 83, change: 12 },
    ],
    anomalies: [],
  },
  {
    id: "technology-metric-3",
    title: "Güvenlik Risk İndeksi",
    subtitle: "Kritik zafiyet ve IAM drift skorları",
    metricType: "gauge",
    agent: "CTO Agent",
    departmentId: "technology",
    chartData: [34],
    chartLabels: ["Risk Skoru"],
    confidenceScore: 90,
    dataCompleteness: 95,
    lastUpdated: "15 dk önce",
    metricBadge: "Güvenlik",
    insights: [
      { text: "Güvenlik risk skoru 34/100 ile düşük risk bandında.", type: "opportunity" },
      { text: "Kritik zafiyet sayısı 0; yüksek severity 3 adet açık.", type: "neutral" },
      { text: "IAM drift: 8 kullanıcıda gereksiz yetki tespit edildi.", type: "risk" },
      { text: "Son penetration test sonucu: 2 medium finding, tümü remediated.", type: "opportunity" },
    ],
    rootCause: {
      description: "Düşük risk skoru: otomatik vulnerability scanning ve monthly patching. IAM drift: rol-tabanlı erişim modelinin tam uygulanmamasından kaynaklanıyor.",
      sources: ["Snyk", "AWS Security Hub", "IAM Access Analyzer", "Pentest Raporu"],
    },
    impactProjection: "IAM drift düzeltilmezse 90 gün içinde risk skoru 52'ye çıkabilir. Otomatik IAM review ile 25'e düşürülebilir.",
    suggestedActions: [
      { title: "IAM access review başlat", description: "8 kullanıcının gereksiz yetkilerini kaldır, least privilege uygula.", priority: "high" },
      { title: "Otomatik IAM drift detection", description: "Haftalık otomatik IAM audit pipeline'ı kur.", priority: "medium" },
      { title: "3 yüksek severity zafiyeti kapat", description: "Önceliklendirme ile patch planı oluştur.", priority: "high" },
    ],
    correlations: [
      { metric: "Patch Freshness", score: -0.88, direction: "negative" },
      { metric: "IAM Drift Skoru", score: 0.82, direction: "positive" },
      { metric: "Incident Response Time", score: 0.65, direction: "positive" },
      { metric: "Compliance Score", score: -0.79, direction: "negative" },
    ],
    riskMap: [
      { factor: "IAM drift (gereksiz yetki)", probability: "high", impact: "medium", department: "Teknoloji" },
      { factor: "Zero-day vulnerability", probability: "low", impact: "high", department: "Teknoloji" },
      { factor: "Veri sızıntısı", probability: "low", impact: "high", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "patch_freq", label: "Patch Sıklığı (gün)", min: 1, max: 30, step: 1, defaultValue: 7, unit: "gün" },
      { id: "iam_review", label: "IAM Review Sıklığı", min: 7, max: 90, step: 7, defaultValue: 30, unit: "gün" },
      { id: "vuln_scan", label: "Scan Otomasyonu", min: 0, max: 100, step: 10, defaultValue: 70, unit: "%" },
    ],
    dataSources: [
      { name: "Snyk", lastSync: "15 dk önce", reliability: 97, status: "healthy" },
      { name: "AWS Security Hub", lastSync: "20 dk önce", reliability: 98, status: "healthy" },
      { name: "IAM Access Analyzer", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
    ],
    segments: [
      { label: "Kritik Zafiyetler", value: 0, change: -100 },
      { label: "Yüksek Severity", value: 3, change: -40 },
      { label: "IAM Drift Kullanıcı", value: 8, change: 33 },
      { label: "Açık Pentest Bulgu", value: 0, change: -100 },
    ],
    anomalies: [
      { period: "Haz", value: 8, expected: 2, description: "Yeni proje onboarding'de toplu yetki ataması; review atlandı" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// PAZARLAMA (CMO)
// ═══════════════════════════════════════════════════════════════════════

const marketingMetrics: MetricIntelligence[] = [
  {
    id: "marketing-metric-0",
    title: "pROAS & Kanal Performansı",
    subtitle: "Reklam getirisi ve marj korelasyonu",
    metricType: "line",
    agent: "CMO Agent",
    departmentId: "marketing",
    chartData: [3.2, 3.5, 2.8, 3.8, 4.1, 3.9, 4.3],
    chartData2: [28, 30, 25, 32, 34, 31, 36],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [4.5, 4.7, 4.9],
    confidenceScore: 84,
    dataCompleteness: 91,
    lastUpdated: "1 saat önce",
    metricBadge: "Reklam Verimliliği",
    insights: [
      { text: "pROAS 4.3x ile son 12 ayın en yüksek seviyesinde.", type: "opportunity" },
      { text: "Mart'ta 2.8x'e düşüş; Meta iOS attribution kayıpları etkili.", type: "risk" },
      { text: "Google Ads pROAS 5.1x ile en verimli kanal.", type: "opportunity" },
      { text: "TikTok ROAS 2.3x; incrementality testi negatif sonuç verdi.", type: "risk" },
      { text: "Marj overlay gösteriyor: yüksek ROAS ≠ her zaman yüksek marj.", type: "neutral" },
    ],
    rootCause: {
      description: "ROAS iyileşmesi: broad match + Performance Max geçişi ve creative A/B test disiplini. Mart düşüşü: iOS 17 attribution değişikliği ve SKAN gecikmeleri.",
      sources: ["Google Ads API", "Meta Ads Manager", "Northbeam (MTA)", "GA4"],
    },
    impactProjection: "Mevcut ROAS trendi devam ederse 90 gün içinde reklam kaynaklı gelir %22 artar. TikTok bütçesi optimize edilmezse %8 israf riski.",
    suggestedActions: [
      { title: "TikTok incrementality testi tekrarla", description: "Holdout test ile gerçek katkıyı ölç; negatifse bütçeyi Google'a kaydır.", priority: "high" },
      { title: "Meta SKAN optimizasyonu", description: "Conversion value schema'yı güncelle, modelled attribution aktifleştir.", priority: "high" },
      { title: "Marginal ROAS analizi çalıştır", description: "Her kanalda ek ₺1 harcamanın getirisi hesapla.", priority: "medium" },
    ],
    correlations: [
      { metric: "Creative Freshness", score: 0.78, direction: "positive" },
      { metric: "Katkı Marjı", score: 0.71, direction: "positive" },
      { metric: "CAC", score: -0.85, direction: "negative" },
      { metric: "Ad Frequency", score: -0.68, direction: "negative" },
      { metric: "Landing Page CVR", score: 0.74, direction: "positive" },
    ],
    riskMap: [
      { factor: "iOS attribution kaybı", probability: "high", impact: "medium", department: "Pazarlama" },
      { factor: "Creative fatigue", probability: "medium", impact: "medium", department: "Kreatif" },
      { factor: "CPM enflasyonu", probability: "high", impact: "medium", department: "Pazarlama" },
      { factor: "Kanal konsantrasyonu riski", probability: "medium", impact: "high", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "budget_change", label: "Toplam Bütçe Değişimi", min: -30, max: 50, step: 5, defaultValue: 0, unit: "%" },
      { id: "channel_kill", label: "TikTok Bütçe Kesintisi", min: 0, max: 100, step: 10, defaultValue: 0, unit: "%" },
      { id: "creative_refresh", label: "Creative Yenileme Sıklığı", min: 7, max: 60, step: 7, defaultValue: 21, unit: "gün" },
    ],
    dataSources: [
      { name: "Google Ads API", lastSync: "1 saat önce", reliability: 96, status: "healthy" },
      { name: "Meta Ads Manager", lastSync: "2 saat önce", reliability: 82, status: "warning" },
      { name: "Northbeam MTA", lastSync: "4 saat önce", reliability: 88, status: "healthy" },
      { name: "GA4", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
    ],
    segments: [
      { label: "Google Ads", value: 5.1, change: 15 },
      { label: "Meta", value: 3.8, change: -4 },
      { label: "TikTok", value: 2.3, change: -18 },
      { label: "Email/CRM", value: 8.2, change: 22 },
    ],
    anomalies: [
      { period: "Mar", value: 2.8, expected: 3.5, description: "iOS 17 attribution değişikliği + SKAN raporlama gecikmesi" },
    ],
  },
  {
    id: "marketing-metric-1",
    title: "CAC & LTV Trendi",
    subtitle: "Müşteri edinme maliyeti ve yaşam boyu değer",
    metricType: "line",
    agent: "CMO Agent",
    departmentId: "marketing",
    chartData: [48, 45, 52, 43, 40, 44, 38],
    chartData2: [180, 192, 178, 205, 218, 210, 235],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [36, 34, 33],
    confidenceScore: 79,
    dataCompleteness: 86,
    lastUpdated: "3 saat önce",
    metricBadge: "Müşteri Ekonomisi",
    insights: [
      { text: "LTV/CAC oranı 6.2x ile sağlıklı seviyede (hedef >3x).", type: "opportunity" },
      { text: "CAC son 6 ayda %21 düştü; organik kanal büyümesi etkili.", type: "opportunity" },
      { text: "Mart'ta CAC spike (₺52); mevsimsel CPM artışı.", type: "neutral" },
      { text: "Cohort bazlı LTV analizi: Q1 cohort'u Q4'ten %15 düşük.", type: "risk" },
    ],
    rootCause: {
      description: "CAC düşüşü: SEO yatırımlarının organik trafiği %40 artırması ve referral programının aktifleştirilmesi. LTV artışı: subscription modeline geçiş ile repeat purchase oranının %32'ye çıkması.",
      sources: ["CRM Cohort Analizi", "GA4 Attribution", "Mixpanel Retention", "Stripe Revenue Data"],
    },
    impactProjection: "CAC trendi devam ederse 90 gün içinde ₺33'e düşer. LTV Q1 cohort problemi çözülmezse ortalama LTV %8 gerileyebilir.",
    suggestedActions: [
      { title: "Q1 cohort retention analizi", description: "Düşük LTV'nin kök nedenini bul; onboarding veya ürün problemi olabilir.", priority: "high" },
      { title: "Referral programını genişlet", description: "İki taraflı incentive mekanizmasını güçlendir.", priority: "medium" },
      { title: "Payback period optimizasyonu", description: "CAC recovery süresini 90 günden 60 güne düşür.", priority: "medium" },
    ],
    correlations: [
      { metric: "Organik Trafik", score: -0.82, direction: "negative" },
      { metric: "Repeat Purchase Rate", score: 0.88, direction: "positive" },
      { metric: "Onboarding Completion", score: 0.74, direction: "positive" },
      { metric: "Churn Rate", score: -0.79, direction: "negative" },
    ],
    riskMap: [
      { factor: "CPM enflasyonu", probability: "high", impact: "medium", department: "Pazarlama" },
      { factor: "Organik trafik algoritma değişikliği", probability: "medium", impact: "high", department: "Pazarlama" },
      { factor: "Cohort quality düşüşü", probability: "medium", impact: "medium", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "organic_growth", label: "Organik Trafik Büyümesi", min: -20, max: 50, step: 5, defaultValue: 15, unit: "%" },
      { id: "cpm_change", label: "CPM Değişimi", min: -20, max: 40, step: 5, defaultValue: 5, unit: "%" },
      { id: "retention_improve", label: "Retention İyileşmesi", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "CRM Sistemi", lastSync: "3 saat önce", reliability: 90, status: "healthy" },
      { name: "GA4 Attribution", lastSync: "1 saat önce", reliability: 86, status: "healthy" },
      { name: "Mixpanel", lastSync: "2 saat önce", reliability: 92, status: "healthy" },
    ],
    segments: [
      { label: "Google Ads CAC", value: 32, change: -15 },
      { label: "Meta CAC", value: 45, change: -8 },
      { label: "Organik CAC", value: 12, change: -22 },
      { label: "Referral CAC", value: 18, change: -30 },
    ],
    anomalies: [
      { period: "Mar", value: 52, expected: 42, description: "Mevsimsel CPM spike + Ramazan döneminde düşük CVR" },
    ],
  },
  {
    id: "marketing-metric-2",
    title: "Kanal Verimlilik Haritası",
    subtitle: "Kanal × metrik performans yoğunluğu",
    metricType: "heatmap",
    agent: "CMO Agent",
    departmentId: "marketing",
    chartData: [82, 65, 70, 55],
    chartLabels: ["Google", "Meta", "TikTok", "Email"],
    confidenceScore: 80,
    dataCompleteness: 88,
    lastUpdated: "2 saat önce",
    metricBadge: "Kanal Analizi",
    insights: [
      { text: "Google Ads tüm metriklerde en dengeli performans gösteriyor.", type: "opportunity" },
      { text: "TikTok yüksek CTR (%3.2) ancak düşük CVR (%0.8); funnel problemi.", type: "risk" },
      { text: "Email kanalı en yüksek CVR (%4.5) ve en düşük CPA (₺8).", type: "opportunity" },
      { text: "Meta CPC son ayda %18 arttı; bid strategy gözden geçirilmeli.", type: "risk" },
    ],
    rootCause: {
      description: "TikTok CTR-CVR gap'i: landing page'in TikTok traffic profili ile uyumsuzluğu. Meta CPC artışı: auction density artışı ve Q2 mevsimsel rekabet.",
      sources: ["Google Ads API", "Meta Ads Manager", "TikTok Ads API", "Klaviyo"],
    },
    impactProjection: "TikTok landing page optimize edilirse CVR %1.5'e çıkabilir; bu %35 daha fazla conversion anlamına gelir.",
    suggestedActions: [
      { title: "TikTok landing page A/B testi", description: "TikTok trafiğine özel hızlı, video-first landing page dene.", priority: "high" },
      { title: "Meta bid strategy değişikliği", description: "Manual bid'den target CPA'ya geçiş test et.", priority: "medium" },
      { title: "Email segmentasyon derinleştir", description: "RFM bazlı segmentasyonla email ROI'yi %20 artır.", priority: "medium" },
    ],
    correlations: [
      { metric: "Landing Page Load Time", score: -0.72, direction: "negative" },
      { metric: "Creative Relevance Score", score: 0.84, direction: "positive" },
      { metric: "Audience Match Quality", score: 0.78, direction: "positive" },
    ],
    riskMap: [
      { factor: "TikTok funnel leak", probability: "high", impact: "medium", department: "Pazarlama" },
      { factor: "Meta CPC enflasyonu", probability: "high", impact: "medium", department: "Pazarlama" },
      { factor: "Email deliverability düşüşü", probability: "low", impact: "medium", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "tiktok_cvr", label: "TikTok CVR İyileşme", min: 0, max: 100, step: 10, defaultValue: 0, unit: "%" },
      { id: "meta_cpc", label: "Meta CPC Değişimi", min: -20, max: 30, step: 5, defaultValue: 0, unit: "%" },
      { id: "email_freq", label: "Email Gönderim Sıklığı", min: 1, max: 7, step: 1, defaultValue: 3, unit: "x/hafta" },
    ],
    dataSources: [
      { name: "Google Ads API", lastSync: "1 saat önce", reliability: 96, status: "healthy" },
      { name: "Meta Ads Manager", lastSync: "2 saat önce", reliability: 84, status: "warning" },
      { name: "TikTok Ads API", lastSync: "3 saat önce", reliability: 78, status: "warning" },
      { name: "Klaviyo", lastSync: "1 saat önce", reliability: 95, status: "healthy" },
    ],
    segments: [
      { label: "Google Ads", value: 82, change: 6 },
      { label: "Meta Ads", value: 65, change: -8 },
      { label: "TikTok Ads", value: 55, change: -12 },
      { label: "Email/CRM", value: 92, change: 14 },
    ],
    anomalies: [
      { period: "Haz", value: 55, expected: 68, description: "TikTok algoritma değişikliği; reaching quality düşüşü" },
    ],
  },
  {
    id: "marketing-metric-3",
    title: "Ölçeklendirme Risk Göstergesi",
    subtitle: "Büyüme hızı vs marj erozyon riski",
    metricType: "gauge",
    agent: "CMO Agent",
    departmentId: "marketing",
    chartData: [68],
    chartLabels: ["Risk Skoru"],
    confidenceScore: 73,
    dataCompleteness: 82,
    lastUpdated: "4 saat önce",
    metricBadge: "Büyüme Riski",
    insights: [
      { text: "Ölçeklendirme risk skoru 68/100; orta-yüksek bölgede.", type: "risk" },
      { text: "Bütçe artışının marginal getirisi azalıyor; diminishing returns sınırına yaklaşılıyor.", type: "risk" },
      { text: "Organik kanal büyümesi paid bağımlılığını azaltma potansiyeli taşıyor.", type: "opportunity" },
      { text: "Creative fatigue index yükseliyor; yeni format denemeleri gerekli.", type: "risk" },
    ],
    rootCause: {
      description: "Ölçeklendirme riski: mevcut kanalların doygunluğa yaklaşması ve her ek ₺1 harcamanın getiri eğrisinin düzleşmesi. Creative fatigue ile birleşince risk katlanıyor.",
      sources: ["Incrementality Model", "Marketing Mix Model (MMM)", "Creative Analytics"],
    },
    impactProjection: "Bütçe %20 artırılırsa mevcut yapıda ROAS 3.8x'ten 3.1x'e düşer. Kanal diversifikasyonu ile 4.0x korunabilir.",
    suggestedActions: [
      { title: "Marketing Mix Modelling çalıştır", description: "Kanal bazlı saturation curve'leri hesapla, optimal bütçe dağılımını bul.", priority: "high" },
      { title: "Yeni kanal pilot programı", description: "Pinterest, Snapchat veya podcast sponsorluğu test et.", priority: "medium" },
      { title: "Incrementality framework kur", description: "Her kanal için gerçek incremental katkıyı ölç.", priority: "high" },
    ],
    correlations: [
      { metric: "Ad Spend / Gelir Oranı", score: 0.85, direction: "positive" },
      { metric: "Creative Fatigue Index", score: 0.78, direction: "positive" },
      { metric: "Kanal Çeşitliliği", score: -0.72, direction: "negative" },
      { metric: "Organik Trafik Payı", score: -0.81, direction: "negative" },
    ],
    riskMap: [
      { factor: "Diminishing returns", probability: "high", impact: "high", department: "Pazarlama" },
      { factor: "Creative doygunluk", probability: "high", impact: "medium", department: "Kreatif" },
      { factor: "Kanal konsantrasyonu", probability: "medium", impact: "high", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "budget_increase", label: "Bütçe Artışı", min: 0, max: 50, step: 5, defaultValue: 0, unit: "%" },
      { id: "new_channel", label: "Yeni Kanal Bütçe Payı", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
      { id: "creative_refresh", label: "Creative Yenileme Hızı", min: 0, max: 100, step: 10, defaultValue: 40, unit: "%" },
    ],
    dataSources: [
      { name: "MMM Model Output", lastSync: "4 saat önce", reliability: 76, status: "warning" },
      { name: "Incrementality Engine", lastSync: "1 gün önce", reliability: 72, status: "warning" },
      { name: "Creative Analytics", lastSync: "2 saat önce", reliability: 88, status: "healthy" },
    ],
    segments: [
      { label: "Paid Search", value: 42, change: -5 },
      { label: "Paid Social", value: 72, change: 12 },
      { label: "Display/Video", value: 85, change: 18 },
      { label: "Email/Organic", value: 25, change: -15 },
    ],
    anomalies: [
      { period: "Tem", value: 68, expected: 55, description: "Yaz kampanyası bütçe artışı; marginal ROAS düşüşü belirginleşti" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FİNANS (CFO)
// ═══════════════════════════════════════════════════════════════════════

const financeMetrics: MetricIntelligence[] = [
  {
    id: "finance-metric-0",
    title: "Katkı Marjı % Trendi",
    subtitle: "Son 7 aylık katkı marjı evrimi",
    metricType: "line",
    agent: "CFO Agent",
    departmentId: "finance",
    chartData: [32.4, 34.1, 31.2, 33.8, 36.2, 35.5, 38.1],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [39.2, 40.5, 41.8],
    confidenceScore: 91,
    dataCompleteness: 97,
    lastUpdated: "1 saat önce",
    metricBadge: "Marj Performansı",
    insights: [
      { text: "Katkı marjı %32.4'ten %38.1'e yükseldi; 5.7pp iyileşme.", type: "opportunity" },
      { text: "COGS optimizasyonu marjı %2.3pp artırdı (tedarikçi renegosyasyonu).", type: "opportunity" },
      { text: "Kur etkisi marjı %0.8pp baskılıyor; USD/TRY volatilitesi yüksek.", type: "risk" },
      { text: "SKU rasyonalizasyonu: düşük marjlı 23 ürün elimine edildi.", type: "opportunity" },
      { text: "Hedef marj (%40) mevcut trendde Q1'de yakalanabilir.", type: "opportunity" },
    ],
    rootCause: {
      description: "Marj iyileşmesinin %58'i COGS azalmasından, %30'u fiyatlama optimizasyonundan, %12'si ürün mix değişiminden kaynaklanıyor.",
      sources: ["ERP Maliyet Modülü", "Fiyatlama Motoru", "Tedarikçi Portalı"],
    },
    impactProjection: "Marj %40'a ulaşırsa yıllık net kâr ₺420K artar. Kur riski hedge edilmezse marj %36'ya gerileyebilir.",
    suggestedActions: [
      { title: "Kur hedge stratejisi", description: "3 ay vadeli forward kontratlarla kur riskini sabitle.", priority: "high" },
      { title: "Dinamik fiyatlama modeli", description: "Talep ve maliyet bazlı otomatik fiyat ayarlama sistemi kur.", priority: "medium" },
      { title: "Düşük marjlı SKU analizi devam", description: "Kalan portföyde <%20 marjlı ürünleri değerlendir.", priority: "low" },
    ],
    correlations: [
      { metric: "COGS / Gelir Oranı", score: -0.94, direction: "negative" },
      { metric: "Fiyatlama Endeksi", score: 0.82, direction: "positive" },
      { metric: "USD/TRY Kuru", score: -0.71, direction: "negative" },
      { metric: "Ürün Mix Kalite Skoru", score: 0.76, direction: "positive" },
    ],
    riskMap: [
      { factor: "Kur dalgalanması", probability: "high", impact: "high", department: "Finans" },
      { factor: "Hammadde fiyat artışı", probability: "medium", impact: "high", department: "Operasyon" },
      { factor: "Fiyat rekabeti baskısı", probability: "medium", impact: "medium", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "cogs_change", label: "COGS Değişimi", min: -15, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "price_adjust", label: "Fiyat Ayarı", min: -10, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "fx_impact", label: "Kur Etkisi", min: -10, max: 10, step: 1, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "ERP Maliyet Modülü", lastSync: "1 saat önce", reliability: 98, status: "healthy" },
      { name: "Fiyatlama Motoru", lastSync: "30 dk önce", reliability: 95, status: "healthy" },
      { name: "Tedarikçi Portalı", lastSync: "4 saat önce", reliability: 89, status: "healthy" },
    ],
    segments: [
      { label: "D2C Marjı", value: 48.2, change: 4.1 },
      { label: "Pazaryeri Marjı", value: 28.5, change: 2.8 },
      { label: "Toptan Marjı", value: 22.1, change: -1.5 },
      { label: "Kurumsal Marjı", value: 42.8, change: 6.3 },
    ],
    anomalies: [
      { period: "Mar", value: 31.2, expected: 34.0, description: "Kur şoku + mevsimsel COGS artışı + indirim kampanyası" },
    ],
  },
  {
    id: "finance-metric-1",
    title: "Nakit Akışı & Pist Tahmini",
    subtitle: "30/60/90 gün nakit projeksiyon ve burn rate",
    metricType: "bar",
    agent: "CFO Agent",
    departmentId: "finance",
    chartData: [440, 395, 355],
    chartLabels: ["30 gün", "60 gün", "90 gün"],
    confidenceScore: 76,
    dataCompleteness: 90,
    lastUpdated: "2 saat önce",
    metricBadge: "Nakit Akış",
    insights: [
      { text: "30 gün nakit projeksiyonu ₺440K; güvenli bölge.", type: "opportunity" },
      { text: "90 günde ₺355K'ya düşüş bekleniyor; büyük yatırım ödemesi planlanmış.", type: "neutral" },
      { text: "Burn rate aylık ₺85K; son 3 ayda %12 arttı.", type: "risk" },
      { text: "AR tahsilat oranı %82; hedef %90.", type: "risk" },
    ],
    rootCause: {
      description: "Burn rate artışı: yeni personel alımları ve altyapı yatırımı. 90 gün projeksiyondaki düşüş: planlı teknoloji yatırımı (₺120K).",
      sources: ["Banka API", "ERP Cash Flow", "AR Aging Raporu", "Bütçe Planlama"],
    },
    impactProjection: "AR tahsilat %90'a çıkarılırsa nakit pozisyonu ₺65K iyileşir. Burn rate kontrol edilmezse pist 14 aydan 10 aya düşer.",
    suggestedActions: [
      { title: "AR tahsilat aksiyonu", description: "30+ gün gecikmiş ₺92K alacak için otomatik hatırlatma başlat.", priority: "high" },
      { title: "Opex review toplantısı", description: "Burn rate artışının kalemlerini analiz et; gereksiz harcamaları kes.", priority: "medium" },
      { title: "Rolling cash forecast otomasyonu", description: "Haftalık otomatik nakit akış tahmini modeli kur.", priority: "low" },
    ],
    correlations: [
      { metric: "Gelir Büyüme Hızı", score: 0.76, direction: "positive" },
      { metric: "AR Aging", score: -0.84, direction: "negative" },
      { metric: "Opex Büyüme Hızı", score: -0.79, direction: "negative" },
      { metric: "Müşteri Ödeme Süresi", score: -0.72, direction: "negative" },
    ],
    riskMap: [
      { factor: "AR tahsilat gecikmesi", probability: "high", impact: "medium", department: "Finans" },
      { factor: "Plansız büyük harcama", probability: "low", impact: "high", department: "Yönetim" },
      { factor: "Gelir düşüşü", probability: "medium", impact: "high", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "revenue_drop", label: "Gelir Değişimi", min: -20, max: 20, step: 5, defaultValue: 0, unit: "%" },
      { id: "opex_change", label: "Sabit Gider Değişimi", min: -15, max: 20, step: 5, defaultValue: 0, unit: "%" },
      { id: "ar_improve", label: "AR Tahsilat İyileşme", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Banka API", lastSync: "30 dk önce", reliability: 99, status: "healthy" },
      { name: "ERP Cash Flow", lastSync: "2 saat önce", reliability: 95, status: "healthy" },
      { name: "AR Aging Sistemi", lastSync: "3 saat önce", reliability: 88, status: "healthy" },
    ],
    segments: [
      { label: "Operasyonel Nakit", value: 280, change: 5 },
      { label: "Yatırım Çıkışı", value: -120, change: 40 },
      { label: "AR Bekleyen", value: 92, change: -8 },
    ],
    anomalies: [],
  },
  {
    id: "finance-metric-2",
    title: "Maliyet Yapısı Dağılımı",
    subtitle: "Ana maliyet kalemlerinin oransal dağılımı",
    metricType: "donut",
    agent: "CFO Agent",
    departmentId: "finance",
    chartData: [42, 26, 18, 14],
    chartLabels: ["COGS", "Pazarlama", "Operasyon", "G&A"],
    confidenceScore: 93,
    dataCompleteness: 98,
    lastUpdated: "1 saat önce",
    metricBadge: "Maliyet Analizi",
    insights: [
      { text: "COGS %42 ile en büyük maliyet kalemi; sektör ortalaması %38.", type: "risk" },
      { text: "Pazarlama harcama oranı %26; gelir artışıyla orantılı.", type: "neutral" },
      { text: "G&A %14; otomasyon ile %11'e düşürülebilir.", type: "opportunity" },
      { text: "Operasyon maliyeti %18; lojistik optimizasyonu ile %15 hedeflenebilir.", type: "opportunity" },
    ],
    rootCause: {
      description: "COGS yüksekliği: ithal hammadde bağımlılığı (%60) ve tek tedarikçi konsantrasyonu. G&A yüksekliği: manuel süreçlerin otomasyon eksikliği.",
      sources: ["ERP Maliyet Merkezi", "AP Detay Raporu", "Bütçe vs Gerçekleşme"],
    },
    impactProjection: "COGS %38'e düşürülürse yıllık ₺380K tasarruf. G&A otomasyonu ile ek ₺120K tasarruf potansiyeli.",
    suggestedActions: [
      { title: "COGS benchmarking çalışması", description: "Sektör ortalamasıyla karşılaştır, %38 hedefine roadmap oluştur.", priority: "high" },
      { title: "G&A otomasyon projesi", description: "Muhasebe, HR ve procurement süreçlerini otomasyonla %20 azalt.", priority: "medium" },
      { title: "Lojistik maliyet optimizasyonu", description: "3PL karşılaştırması yap, route optimization implementle.", priority: "medium" },
    ],
    correlations: [
      { metric: "Katkı Marjı", score: -0.92, direction: "negative" },
      { metric: "Otomasyon Oranı", score: -0.74, direction: "negative" },
      { metric: "Tedarikçi Sayısı", score: -0.65, direction: "negative" },
      { metric: "Gelir Büyümesi", score: 0.58, direction: "positive" },
    ],
    riskMap: [
      { factor: "Hammadde fiyat artışı", probability: "high", impact: "high", department: "Operasyon" },
      { factor: "Kur etkisiyle COGS artışı", probability: "high", impact: "high", department: "Finans" },
      { factor: "Pazarlama over-spend", probability: "medium", impact: "medium", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "cogs_reduction", label: "COGS Azaltma", min: 0, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "ga_automation", label: "G&A Otomasyon Oranı", min: 0, max: 50, step: 5, defaultValue: 10, unit: "%" },
      { id: "logistics_opt", label: "Lojistik Optimizasyon", min: 0, max: 25, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "ERP Maliyet Merkezi", lastSync: "1 saat önce", reliability: 97, status: "healthy" },
      { name: "AP Sistemi", lastSync: "2 saat önce", reliability: 94, status: "healthy" },
      { name: "Bütçe Modülü", lastSync: "3 saat önce", reliability: 92, status: "healthy" },
    ],
    segments: [
      { label: "COGS", value: 42, change: -2 },
      { label: "Pazarlama", value: 26, change: 3 },
      { label: "Operasyon", value: 18, change: -1 },
      { label: "G&A", value: 14, change: 0 },
    ],
    anomalies: [],
  },
  {
    id: "finance-metric-3",
    title: "Kanal Kârlılığı Analizi",
    subtitle: "Satış kanalı bazında net kâr karşılaştırması",
    metricType: "bar",
    agent: "CFO Agent",
    departmentId: "finance",
    chartData: [22.5, 14.8, 11.2, 8.4],
    chartLabels: ["D2C", "Amazon", "Trendyol", "HB"],
    confidenceScore: 87,
    dataCompleteness: 93,
    lastUpdated: "2 saat önce",
    metricBadge: "Kanal Performansı",
    insights: [
      { text: "D2C en yüksek net marjlı kanal (%22.5); pazaryerilerin 1.5-2.7x üzerinde.", type: "opportunity" },
      { text: "HB net marjı %8.4 ile breakeven sınırına yakın; komisyon artışı riski.", type: "risk" },
      { text: "Amazon FBA maliyetleri net marjı %3.2 baskılıyor.", type: "risk" },
      { text: "Kanal mix D2C ağırlığına kaydırılırsa toplam marj %4.5pp artar.", type: "opportunity" },
    ],
    rootCause: {
      description: "D2C marj avantajı: komisyon yok, müşteri verisi kontrolü, upsell imkanı. Pazaryeri marj baskısı: %15-25 komisyon + fulfillment maliyetleri + iade oranı farkı.",
      sources: ["ERP Kanal Raporlama", "Pazaryeri Panelleri", "Muhasebe Konsolidasyon"],
    },
    impactProjection: "D2C payı %40'tan %55'e çıkarılırsa toplam net kâr %18 artar. HB komisyon artışı gerçekleşirse marj %5.8'e düşer.",
    suggestedActions: [
      { title: "D2C yatırım planı", description: "D2C kanal payını %55'e çıkarmak için pazarlama ve UX yatırımı.", priority: "high" },
      { title: "HB kârlılık değerlendirmesi", description: "Breakeven analizi yap; gerekirse SKU bazında çekilme planla.", priority: "high" },
      { title: "Amazon FBA maliyet optimizasyonu", description: "FBM vs FBA karşılaştırması; düşük devir ürünlerde FBM'e geç.", priority: "medium" },
    ],
    correlations: [
      { metric: "Komisyon Oranı", score: -0.91, direction: "negative" },
      { metric: "D2C Trafik Payı", score: 0.86, direction: "positive" },
      { metric: "İade Oranı", score: -0.73, direction: "negative" },
      { metric: "Ortalama Sipariş Değeri", score: 0.68, direction: "positive" },
    ],
    riskMap: [
      { factor: "Pazaryeri komisyon artışı", probability: "high", impact: "high", department: "Finans" },
      { factor: "D2C trafik maliyeti artışı", probability: "medium", impact: "medium", department: "Pazarlama" },
      { factor: "Pazaryeri policy değişikliği", probability: "medium", impact: "medium", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "d2c_share", label: "D2C Kanal Payı", min: 30, max: 70, step: 5, defaultValue: 40, unit: "%" },
      { id: "commission_change", label: "Komisyon Değişimi", min: -5, max: 10, step: 1, defaultValue: 0, unit: "pp" },
      { id: "aov_change", label: "Ort. Sipariş Değeri Değişimi", min: -15, max: 20, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "ERP Kanal Raporlama", lastSync: "2 saat önce", reliability: 95, status: "healthy" },
      { name: "Amazon Seller Central", lastSync: "3 saat önce", reliability: 90, status: "healthy" },
      { name: "Trendyol Partner Panel", lastSync: "4 saat önce", reliability: 87, status: "healthy" },
      { name: "HB Satıcı Paneli", lastSync: "4 saat önce", reliability: 85, status: "healthy" },
    ],
    segments: [
      { label: "D2C Web", value: 22.5, change: 3.2 },
      { label: "Amazon", value: 14.8, change: -1.5 },
      { label: "Trendyol", value: 11.2, change: 0.8 },
      { label: "HB", value: 8.4, change: -2.1 },
    ],
    anomalies: [
      { period: "May", value: 8.4, expected: 12.0, description: "HB komisyon artışı + kargo ücreti değişikliği" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// OPERASYON (COO)
// ═══════════════════════════════════════════════════════════════════════

const operationsMetrics: MetricIntelligence[] = [
  {
    id: "operations-metric-0",
    title: "Envanter Devir Hızı",
    subtitle: "Stok devir hızı evrimi ve hedef karşılaştırması",
    metricType: "line",
    agent: "COO Agent",
    departmentId: "operations",
    chartData: [4.2, 4.5, 4.1, 4.8, 5.0, 4.7, 5.2],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [5.4, 5.6, 5.8],
    confidenceScore: 89,
    dataCompleteness: 95,
    lastUpdated: "1 saat önce",
    metricBadge: "Envanter Verimliliği",
    insights: [
      { text: "Devir hızı 4.2x'ten 5.2x'e yükseldi; sektör ortalaması 4.8x.", type: "opportunity" },
      { text: "Holding cost %18 azaldı; dead stock %8'den %4'e düştü.", type: "opportunity" },
      { text: "3 SKU'da stockout riski; demand forecast accuracy iyileştirilmeli.", type: "risk" },
      { text: "Slow-moving inventory 45 günden 32 güne düştü.", type: "opportunity" },
    ],
    rootCause: {
      description: "Devir hızı iyileşmesi: ABC analizi uygulanması, dead stock likidasyonu ve demand planning otomasyonu. Stockout riski: lead time varyansının yüksek olduğu 3 tedarikçiden kaynaklı.",
      sources: ["WMS (Warehouse Management)", "ERP Envanter", "Demand Planning Tool"],
    },
    impactProjection: "Devir hızı 6x'e ulaşırsa yıllık holding cost ₺180K azalır. Stockout'lar çözülmezse ₺95K kayıp satış riski.",
    suggestedActions: [
      { title: "Stockout risk mitigation", description: "3 riskli SKU için safety stock seviyesini yeniden hesapla.", priority: "high" },
      { title: "Demand forecast accuracy artır", description: "ML-based demand forecasting implementle; MAPE'yi %15'ten %10'a düşür.", priority: "high" },
      { title: "Slow-moving inventory programı", description: "32 günlük slow-movers için otomatik markdown/bundle öner.", priority: "medium" },
    ],
    correlations: [
      { metric: "Demand Forecast Accuracy", score: 0.87, direction: "positive" },
      { metric: "Lead Time Varyansı", score: -0.79, direction: "negative" },
      { metric: "Holding Cost", score: -0.91, direction: "negative" },
      { metric: "Satış Hızı", score: 0.83, direction: "positive" },
    ],
    riskMap: [
      { factor: "Tedarik gecikmesi", probability: "medium", impact: "high", department: "Operasyon" },
      { factor: "Talep tahmini hatası", probability: "high", impact: "medium", department: "Operasyon" },
      { factor: "Depo kapasite sınırı", probability: "low", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "demand_spike", label: "Talep Artışı", min: -20, max: 50, step: 5, defaultValue: 0, unit: "%" },
      { id: "lead_time", label: "Lead Time Değişimi", min: -30, max: 30, step: 5, defaultValue: 0, unit: "%" },
      { id: "safety_stock", label: "Safety Stock Artışı", min: 0, max: 50, step: 5, defaultValue: 15, unit: "%" },
    ],
    dataSources: [
      { name: "WMS", lastSync: "30 dk önce", reliability: 96, status: "healthy" },
      { name: "ERP Envanter", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
      { name: "Demand Planning Tool", lastSync: "2 saat önce", reliability: 88, status: "healthy" },
    ],
    segments: [
      { label: "A Sınıfı SKU", value: 8.2, change: 15 },
      { label: "B Sınıfı SKU", value: 5.1, change: 8 },
      { label: "C Sınıfı SKU", value: 2.8, change: -5 },
      { label: "Dead Stock", value: 0.4, change: -50 },
    ],
    anomalies: [
      { period: "Mar", value: 4.1, expected: 4.6, description: "Liman grevi nedeniyle tedarik gecikmesi; stok birikimi" },
    ],
  },
  {
    id: "operations-metric-1",
    title: "Stok Tükenme Olasılığı",
    subtitle: "En riskli ürünlerin tükenme riski skoru",
    metricType: "gauge",
    agent: "COO Agent",
    departmentId: "operations",
    chartData: [42],
    chartLabels: ["Risk Skoru"],
    confidenceScore: 77,
    dataCompleteness: 85,
    lastUpdated: "2 saat önce",
    metricBadge: "Stok Riski",
    insights: [
      { text: "Stok tükenme riski 42/100; orta seviyede dikkat gerekli.", type: "risk" },
      { text: "3 hero SKU'da 2 hafta içinde stockout riski var.", type: "risk" },
      { text: "Otomatik reorder point aktif SKU'larda risk %60 daha düşük.", type: "opportunity" },
      { text: "Tedarikçi lead time varyansı %22 ile hedefin (%15) üzerinde.", type: "risk" },
    ],
    rootCause: {
      description: "Stockout riski: 3 tedarikçinin lead time'ı ortalama 8 gün uzadı + mevsimsel talep artışı planlanandan %15 yüksek gerçekleşti.",
      sources: ["WMS Real-time", "Tedarikçi Performans Sistemi", "Satış Tahmin Modeli"],
    },
    impactProjection: "3 hero SKU stockout olursa 2 haftalık kayıp satış ₺95K. Acil sipariş ile maliyet ₺12K artar ancak satış korunur.",
    suggestedActions: [
      { title: "Acil sipariş ver", description: "3 hero SKU için express tedarik siparişi oluştur.", priority: "high" },
      { title: "Reorder point otomasyonu genişlet", description: "Tüm A-sınıfı SKU'lara otomatik reorder point uygula.", priority: "medium" },
      { title: "Alternatif tedarikçi aktifleştir", description: "Yüksek lead time varyansı olan tedarikçilere yedek kaynak bul.", priority: "medium" },
    ],
    correlations: [
      { metric: "Tedarikçi Lead Time", score: 0.85, direction: "positive" },
      { metric: "Demand Forecast Error", score: 0.78, direction: "positive" },
      { metric: "Safety Stock Coverage", score: -0.82, direction: "negative" },
      { metric: "Reorder Automation Oranı", score: -0.74, direction: "negative" },
    ],
    riskMap: [
      { factor: "Hero SKU stockout", probability: "high", impact: "high", department: "Operasyon" },
      { factor: "Tedarikçi kapanması", probability: "low", impact: "high", department: "Operasyon" },
      { factor: "Mevsimsel talep spike", probability: "medium", impact: "medium", department: "Pazarlama" },
    ],
    simulationParams: [
      { id: "demand_surge", label: "Talep Artışı", min: 0, max: 50, step: 5, defaultValue: 15, unit: "%" },
      { id: "lead_delay", label: "Tedarik Gecikmesi", min: 0, max: 14, step: 1, defaultValue: 3, unit: "gün" },
      { id: "safety_buffer", label: "Safety Stock Buffer", min: 0, max: 40, step: 5, defaultValue: 15, unit: "%" },
    ],
    dataSources: [
      { name: "WMS Real-time", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
      { name: "Tedarikçi Portal", lastSync: "4 saat önce", reliability: 82, status: "warning" },
      { name: "Satış Tahmin Modeli", lastSync: "2 saat önce", reliability: 79, status: "warning" },
    ],
    segments: [
      { label: "A Sınıfı (Hero)", value: 68, change: 15 },
      { label: "B Sınıfı", value: 35, change: 5 },
      { label: "C Sınıfı", value: 18, change: -8 },
    ],
    anomalies: [
      { period: "Tem", value: 68, expected: 40, description: "3 hero SKU'da beklenmedik talep artışı + tedarikçi gecikmesi" },
    ],
  },
  {
    id: "operations-metric-2",
    title: "Teslimat Süresi & SLA",
    subtitle: "Ortalama teslimat süresi ve SLA uyumu",
    metricType: "line",
    agent: "COO Agent",
    departmentId: "operations",
    chartData: [2.8, 3.1, 2.5, 2.9, 3.2, 2.7, 2.6],
    chartData2: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [2.5, 2.4, 2.3],
    confidenceScore: 86,
    dataCompleteness: 93,
    lastUpdated: "45 dk önce",
    metricBadge: "Teslimat SLA",
    insights: [
      { text: "SLA compliance %91; hedef %95. Mayıs'ta SLA breach %12.", type: "risk" },
      { text: "Ortalama teslimat 2.6 gün ile iyileşme trendinde.", type: "opportunity" },
      { text: "İstanbul bölgesi 1.8 gün ile en hızlı; Doğu bölgesi 4.2 gün.", type: "neutral" },
      { text: "Same-day delivery pilot'u NPS'i 12 puan artırdı.", type: "opportunity" },
    ],
    rootCause: {
      description: "Mayıs SLA breach: kargo firması geçiş dönemi + bayram yoğunluğu. Genel iyileşme: depo operasyonu optimizasyonu ve pick-pack süresinin %30 azalması.",
      sources: ["Kargo API'ları", "WMS Operasyon", "Müşteri Şikayet Sistemi"],
    },
    impactProjection: "Teslimat süresi 2.3 güne düşürülürse müşteri memnuniyeti %8 artar ve repeat purchase %5 iyileşir.",
    suggestedActions: [
      { title: "Doğu bölgesi lojistik partneri değişikliği", description: "4.2 gün ortalamasını 3.0 güne düşürmek için yeni 3PL değerlendir.", priority: "high" },
      { title: "Same-day delivery genişletme", description: "Pilot'u İstanbul dışında Ankara ve İzmir'e yay.", priority: "medium" },
      { title: "SLA monitoring dashboard", description: "Gerçek zamanlı SLA tracking ve otomatik alert sistemi kur.", priority: "low" },
    ],
    correlations: [
      { metric: "Müşteri Memnuniyeti (NPS)", score: -0.84, direction: "negative" },
      { metric: "Repeat Purchase Rate", score: -0.76, direction: "negative" },
      { metric: "İade Oranı", score: 0.62, direction: "positive" },
      { metric: "Pick-Pack Süresi", score: 0.88, direction: "positive" },
    ],
    riskMap: [
      { factor: "Kargo firması performans düşüşü", probability: "medium", impact: "high", department: "Operasyon" },
      { factor: "Bayram/sezon yoğunluğu", probability: "high", impact: "medium", department: "Operasyon" },
      { factor: "Depo kapasite aşımı", probability: "low", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "volume_increase", label: "Sipariş Hacmi Artışı", min: 0, max: 50, step: 5, defaultValue: 0, unit: "%" },
      { id: "carrier_perf", label: "Kargo Performans Değişimi", min: -20, max: 20, step: 5, defaultValue: 0, unit: "%" },
      { id: "warehouse_capacity", label: "Depo Kapasite Kullanımı", min: 50, max: 100, step: 5, defaultValue: 75, unit: "%" },
    ],
    dataSources: [
      { name: "Kargo API (Aras/MNG/Yurtiçi)", lastSync: "30 dk önce", reliability: 92, status: "healthy" },
      { name: "WMS Operasyon", lastSync: "15 dk önce", reliability: 96, status: "healthy" },
      { name: "Müşteri Deneyim Platformu", lastSync: "1 saat önce", reliability: 89, status: "healthy" },
    ],
    segments: [
      { label: "İstanbul", value: 1.8, change: -12 },
      { label: "Ankara/İzmir", value: 2.4, change: -8 },
      { label: "Anadolu", value: 3.5, change: -3 },
      { label: "Doğu", value: 4.2, change: 5 },
    ],
    anomalies: [
      { period: "May", value: 3.2, expected: 2.8, description: "Kargo firması geçişi + bayram yoğunluğu" },
    ],
  },
  {
    id: "operations-metric-3",
    title: "İade & Lojistik Maliyet",
    subtitle: "İade oranı ve kargo maliyet evrimi",
    metricType: "line",
    agent: "COO Agent",
    departmentId: "operations",
    chartData: [5.2, 5.8, 4.9, 5.5, 6.1, 5.3, 5.0],
    chartData2: [12.4, 13.1, 11.8, 14.2, 15.0, 13.5, 12.8],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [4.8, 4.6, 4.4],
    confidenceScore: 82,
    dataCompleteness: 90,
    lastUpdated: "2 saat önce",
    metricBadge: "İade Analizi",
    insights: [
      { text: "İade oranı %5.0 ile düşüş trendinde; hedef %4.0.", type: "opportunity" },
      { text: "Mayıs'ta %6.1'e spike: beden uyumsuzluğu (%42 neden).", type: "risk" },
      { text: "Kargo maliyeti sipariş başına ₺12.8; sektör ort. ₺11.5.", type: "risk" },
      { text: "Ücretsiz iade kaldırılan kategorilerde iade %35 azaldı.", type: "opportunity" },
    ],
    rootCause: {
      description: "İade spike: yeni ürün kategorisinde beden tablosu eksikliği. Kargo maliyet yüksekliği: hacim kontratının yenilenmemesi ve fuel surcharge artışı.",
      sources: ["İade Yönetim Sistemi", "Kargo Fatura Analizi", "Müşteri Feedback"],
    },
    impactProjection: "İade %4'e düşürülürse yıllık ₺240K tasarruf. Kargo kontratı renegosyasyonuyla ek ₺80K tasarruf.",
    suggestedActions: [
      { title: "Beden tablosu iyileştirmesi", description: "Yeni kategoriye AR-based fit tool ve detaylı ölçü rehberi ekle.", priority: "high" },
      { title: "Kargo kontrat renegosyasyonu", description: "Hacim artışını leverage et; birim fiyat %8 indirim hedefle.", priority: "high" },
      { title: "İade nedenlerini analiz et", description: "Top 5 iade nedenini RCA ile çöz; ürün kalite kontrolü sıkılaştır.", priority: "medium" },
    ],
    correlations: [
      { metric: "Ürün Açıklama Kalitesi", score: -0.78, direction: "negative" },
      { metric: "Müşteri Memnuniyeti", score: -0.72, direction: "negative" },
      { metric: "Kâr Marjı", score: -0.85, direction: "negative" },
      { metric: "Ürün Fotoğraf Kalitesi", score: -0.65, direction: "negative" },
    ],
    riskMap: [
      { factor: "İade oranı artışı", probability: "medium", impact: "high", department: "Operasyon" },
      { factor: "Kargo maliyet enflasyonu", probability: "high", impact: "medium", department: "Finans" },
      { factor: "Ürün kalite problemi", probability: "medium", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "return_reduction", label: "İade Azaltma", min: 0, max: 40, step: 5, defaultValue: 0, unit: "%" },
      { id: "shipping_cost", label: "Kargo Birim Fiyat Değişimi", min: -15, max: 15, step: 1, defaultValue: 0, unit: "%" },
      { id: "free_return_limit", label: "Ücretsiz İade Limiti", min: 0, max: 500, step: 50, defaultValue: 150, unit: "₺" },
    ],
    dataSources: [
      { name: "İade Yönetim Sistemi", lastSync: "2 saat önce", reliability: 91, status: "healthy" },
      { name: "Kargo Fatura Sistemi", lastSync: "1 gün önce", reliability: 86, status: "warning" },
      { name: "Müşteri Feedback", lastSync: "3 saat önce", reliability: 84, status: "healthy" },
    ],
    segments: [
      { label: "Beden Uyumsuzluğu", value: 42, change: 8 },
      { label: "Ürün Hasarı", value: 18, change: -5 },
      { label: "Yanlış Ürün", value: 12, change: -15 },
      { label: "Fikir Değişikliği", value: 28, change: 3 },
    ],
    anomalies: [
      { period: "May", value: 6.1, expected: 5.0, description: "Yeni kategori lansmanı; beden tablosu eksik" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// KREATİF
// ═══════════════════════════════════════════════════════════════════════

const creativeMetrics: MetricIntelligence[] = [
  {
    id: "creative-metric-0",
    title: "Kreatif Performans Skor Kartı",
    subtitle: "En iyi kreatifler ve varyant bazlı performans",
    metricType: "bar",
    agent: "Creative Intelligence",
    departmentId: "creative",
    chartData: [92, 78, 85, 65],
    chartLabels: ["V1-Lifestyle", "V2-Product", "V3-UGC", "V4-Brand"],
    confidenceScore: 81,
    dataCompleteness: 88,
    lastUpdated: "2 saat önce",
    metricBadge: "Kreatif Performans",
    insights: [
      { text: "Lifestyle varyantı (V1) %92 ile en yüksek composite score.", type: "opportunity" },
      { text: "Brand varyantı (V4) %65 ile düşük; audience-creative mismatch.", type: "risk" },
      { text: "UGC formatı (V3) en düşük CPA ve en yüksek engagement.", type: "opportunity" },
      { text: "Video kreatifler statik görsellere göre %38 daha iyi CTR.", type: "opportunity" },
    ],
    rootCause: {
      description: "V1 başarısı: hedef kitleyle duygusal bağ ve sosyal proof kullanımı. V4 düşüklüğü: marka mesajının ürün avantajına dönüşmemesi.",
      sources: ["Creative Analytics Platform", "Meta Creative Reporting", "Eye-tracking Data"],
    },
    impactProjection: "V4 optimize edilirse overall ROAS %8 artar. V1-V3 mix'ine odaklanılırsa CAC %12 düşer.",
    suggestedActions: [
      { title: "V4 creative brief yenile", description: "Marka mesajını ürün avantajıyla birleştiren yeni brief oluştur.", priority: "high" },
      { title: "UGC programını ölçeklendir", description: "Creator sayısını 5'ten 15'e çıkar; UGC library genişlet.", priority: "high" },
      { title: "Video-first creative strategy", description: "Statik görsellerin %50'sini video formatına dönüştür.", priority: "medium" },
    ],
    correlations: [
      { metric: "ROAS", score: 0.88, direction: "positive" },
      { metric: "CTR", score: 0.82, direction: "positive" },
      { metric: "Creative Fatigue Index", score: -0.71, direction: "negative" },
      { metric: "Production Cost", score: 0.45, direction: "positive" },
    ],
    riskMap: [
      { factor: "Creative fatigue", probability: "high", impact: "medium", department: "Kreatif" },
      { factor: "UGC creator bağımlılığı", probability: "medium", impact: "medium", department: "Kreatif" },
      { factor: "Marka tutarsızlığı", probability: "low", impact: "high", department: "Kreatif" },
    ],
    simulationParams: [
      { id: "ugc_share", label: "UGC İçerik Payı", min: 10, max: 80, step: 5, defaultValue: 25, unit: "%" },
      { id: "video_ratio", label: "Video / Statik Oranı", min: 20, max: 80, step: 10, defaultValue: 40, unit: "%" },
      { id: "refresh_cycle", label: "Creative Yenileme Döngüsü", min: 7, max: 45, step: 7, defaultValue: 21, unit: "gün" },
    ],
    dataSources: [
      { name: "Creative Analytics", lastSync: "2 saat önce", reliability: 89, status: "healthy" },
      { name: "Meta Creative Hub", lastSync: "3 saat önce", reliability: 85, status: "healthy" },
      { name: "Performance Dashboard", lastSync: "1 saat önce", reliability: 92, status: "healthy" },
    ],
    segments: [
      { label: "V1-Lifestyle", value: 92, change: 5 },
      { label: "V2-Product", value: 78, change: -3 },
      { label: "V3-UGC", value: 85, change: 12 },
      { label: "V4-Brand", value: 65, change: -8 },
    ],
    anomalies: [],
  },
  {
    id: "creative-metric-1",
    title: "Kreatif Yorgunluk Eğrisi",
    subtitle: "Kreatif ömür döngüsü ve performans bozulması",
    metricType: "line",
    agent: "Creative Intelligence",
    departmentId: "creative",
    chartData: [95, 90, 82, 70, 55, 40, 28],
    chartLabels: ["H1", "H2", "H3", "H4", "H5", "H6", "H7"],
    confidenceScore: 78,
    dataCompleteness: 86,
    lastUpdated: "3 saat önce",
    metricBadge: "Yorgunluk Analizi",
    insights: [
      { text: "Ortalama kreatif ömrü 4.2 hafta; sonrasında %50+ performans kaybı.", type: "risk" },
      { text: "UGC içerikler 6 hafta, branded içerikler 3 hafta dayanıyor.", type: "neutral" },
      { text: "Frequency cap 3x üzerine çıktığında decay hızlanıyor.", type: "risk" },
      { text: "A/B test ile early fatigue detection %70 doğrulukla yapılabiliyor.", type: "opportunity" },
    ],
    rootCause: {
      description: "Kreatif yorgunluk: hedef kitle doygunluğu, frequency cap aşımı ve format tekrarı. UGC'nin daha uzun sürmesi: sosyal kanıt etkisi ve otantiklik algısı.",
      sources: ["Creative Lifecycle Tracker", "Ad Platform Frequency Data", "A/B Test Results"],
    },
    impactProjection: "Creative refresh döngüsü 3 haftaya çekilirse ortalama ROAS %15 artar. Mevcut durumda H5+ kreatifler ₺45K/ay israf.",
    suggestedActions: [
      { title: "Auto-pause threshold kur", description: "ROAS %30 düştüğünde kreatifleri otomatik durdur.", priority: "high" },
      { title: "Creative pipeline hızlandır", description: "Her hafta 3 yeni varyant üretim kapasitesi oluştur.", priority: "high" },
      { title: "Dynamic Creative Optimization", description: "Element bazlı otomatik kombinasyon testi (DCO) aktifleştir.", priority: "medium" },
    ],
    correlations: [
      { metric: "Ad Frequency", score: 0.89, direction: "positive" },
      { metric: "ROAS", score: -0.84, direction: "negative" },
      { metric: "Audience Size", score: -0.72, direction: "negative" },
      { metric: "Creative Variety Score", score: -0.78, direction: "negative" },
    ],
    riskMap: [
      { factor: "Pipeline yetersizliği", probability: "high", impact: "high", department: "Kreatif" },
      { factor: "Format tekrarı", probability: "medium", impact: "medium", department: "Kreatif" },
      { factor: "Brand dilution", probability: "low", impact: "high", department: "Kreatif" },
    ],
    simulationParams: [
      { id: "refresh_freq", label: "Yenileme Sıklığı", min: 7, max: 42, step: 7, defaultValue: 21, unit: "gün" },
      { id: "variant_count", label: "Haftalık Yeni Varyant", min: 1, max: 10, step: 1, defaultValue: 2, unit: "adet" },
      { id: "freq_cap", label: "Frequency Cap", min: 1, max: 7, step: 1, defaultValue: 3, unit: "x" },
    ],
    dataSources: [
      { name: "Creative Lifecycle Tracker", lastSync: "3 saat önce", reliability: 84, status: "healthy" },
      { name: "Ad Platform Data", lastSync: "1 saat önce", reliability: 91, status: "healthy" },
      { name: "A/B Test Engine", lastSync: "4 saat önce", reliability: 87, status: "healthy" },
    ],
    segments: [
      { label: "Video Ads", value: 5.8, change: -10 },
      { label: "Static Image", value: 3.2, change: -5 },
      { label: "UGC Content", value: 6.4, change: 8 },
      { label: "Carousel", value: 4.1, change: -3 },
    ],
    anomalies: [],
  },
  {
    id: "creative-metric-2",
    title: "Marka Tutarlılık Skoru",
    subtitle: "Kanal bazlı marka tutarlılık evrimi",
    metricType: "line",
    agent: "Creative Intelligence",
    departmentId: "creative",
    chartData: [72, 75, 78, 76, 80, 82, 85],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [87, 89, 90],
    confidenceScore: 75,
    dataCompleteness: 80,
    lastUpdated: "4 saat önce",
    metricBadge: "Marka Tutarlılığı",
    insights: [
      { text: "Marka tutarlılığı %72'den %85'e yükseldi; brand guideline adoption etkili.", type: "opportunity" },
      { text: "Pazaryeri kanalları en düşük tutarlılık (%68); template eksikliği.", type: "risk" },
      { text: "Sosyal medya tutarlılığı %92 ile en yüksek.", type: "opportunity" },
      { text: "Hedef %90; mevcut trendde 3 ay içinde erişilebilir.", type: "neutral" },
    ],
    rootCause: {
      description: "Tutarlılık iyileşmesi: otomatik brand compliance checker ve template library implementasyonu. Pazaryeri düşüklüğü: her platformun farklı format gereksinimleri ve manuel upload süreci.",
      sources: ["Brand Compliance Tool", "DAM (Digital Asset Management)", "Kanal Audit Raporları"],
    },
    impactProjection: "Tutarlılık %90'a ulaşırsa brand recall %22 artar ve paid performance %8 iyileşir.",
    suggestedActions: [
      { title: "Pazaryeri template oluştur", description: "Her platform için otomatik resize/format template library kur.", priority: "high" },
      { title: "Brand compliance otomasyon", description: "Upload öncesi otomatik brand check zorunlu yap.", priority: "medium" },
      { title: "Aylık brand audit", description: "Tüm kanallarda aylık marka tutarlılık auditi başlat.", priority: "low" },
    ],
    correlations: [
      { metric: "Brand Recall", score: 0.84, direction: "positive" },
      { metric: "Ad Performance", score: 0.72, direction: "positive" },
      { metric: "Template Adoption", score: 0.88, direction: "positive" },
      { metric: "Manual Override Oranı", score: -0.76, direction: "negative" },
    ],
    riskMap: [
      { factor: "Kanal bazlı tutarsızlık", probability: "medium", impact: "medium", department: "Kreatif" },
      { factor: "Yetkisiz brand kullanımı", probability: "low", impact: "high", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "template_adoption", label: "Template Kullanım Oranı", min: 30, max: 100, step: 5, defaultValue: 65, unit: "%" },
      { id: "auto_check", label: "Otomatik Check Coverage", min: 0, max: 100, step: 10, defaultValue: 40, unit: "%" },
      { id: "audit_freq", label: "Audit Sıklığı", min: 1, max: 12, step: 1, defaultValue: 3, unit: "ay" },
    ],
    dataSources: [
      { name: "Brand Compliance Tool", lastSync: "4 saat önce", reliability: 78, status: "warning" },
      { name: "DAM Platform", lastSync: "2 saat önce", reliability: 85, status: "healthy" },
      { name: "Kanal Audit Log", lastSync: "1 gün önce", reliability: 72, status: "warning" },
    ],
    segments: [
      { label: "Sosyal Medya", value: 92, change: 5 },
      { label: "D2C Web", value: 88, change: 8 },
      { label: "Email/CRM", value: 84, change: 6 },
      { label: "Pazaryeri", value: 68, change: -2 },
    ],
    anomalies: [],
  },
  {
    id: "creative-metric-3",
    title: "Konsept Performans Matrisi",
    subtitle: "Kreatif konsept × metrik performans haritası",
    metricType: "heatmap",
    agent: "Creative Intelligence",
    departmentId: "creative",
    chartData: [80, 65, 70, 85],
    chartLabels: ["Lifestyle", "Product", "UGC", "Brand"],
    confidenceScore: 76,
    dataCompleteness: 83,
    lastUpdated: "3 saat önce",
    metricBadge: "Konsept Analizi",
    insights: [
      { text: "UGC konsepti en yüksek CTR (%3.2) ancak düşük brand lift.", type: "neutral" },
      { text: "Lifestyle en dengeli performans: yüksek CTR + CVR + ROAS.", type: "opportunity" },
      { text: "Product konsepti en yüksek CVR (%2.8) ancak düşük reach.", type: "neutral" },
      { text: "Brand konsepti uzun vadeli brand metric'lere katkı sağlıyor.", type: "opportunity" },
    ],
    rootCause: {
      description: "Performans farklılıkları: her konsept farklı funnel aşamasına hitap ediyor. Lifestyle awareness+conversion, Product conversion, UGC engagement, Brand awareness+recall.",
      sources: ["Multi-touch Attribution", "Brand Lift Study", "Creative Analytics"],
    },
    impactProjection: "Funnel aşamasına göre konsept mix optimize edilirse overall CVR %18, ROAS %12 artar.",
    suggestedActions: [
      { title: "Funnel-based creative allocation", description: "ToFu: UGC+Brand, MoFu: Lifestyle, BoFu: Product stratejisi uygula.", priority: "high" },
      { title: "Cross-concept A/B test", description: "Her funnel aşamasında 2 konsepti karşılaştıran test çalıştır.", priority: "medium" },
      { title: "Creative brief framework", description: "Her konsept için standart brief şablonu ve success metrics tanımla.", priority: "low" },
    ],
    correlations: [
      { metric: "Funnel Stage Match", score: 0.85, direction: "positive" },
      { metric: "Audience Relevance", score: 0.79, direction: "positive" },
      { metric: "Creative Complexity", score: -0.52, direction: "negative" },
    ],
    riskMap: [
      { factor: "Konsept doygunluğu", probability: "medium", impact: "medium", department: "Kreatif" },
      { factor: "Format uyumsuzluğu", probability: "low", impact: "medium", department: "Kreatif" },
    ],
    simulationParams: [
      { id: "lifestyle_share", label: "Lifestyle Konsept Payı", min: 10, max: 60, step: 5, defaultValue: 30, unit: "%" },
      { id: "ugc_share", label: "UGC Konsept Payı", min: 10, max: 50, step: 5, defaultValue: 25, unit: "%" },
      { id: "production_budget", label: "Üretim Bütçe Değişimi", min: -30, max: 50, step: 10, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Creative Analytics", lastSync: "3 saat önce", reliability: 86, status: "healthy" },
      { name: "MTA Platform", lastSync: "4 saat önce", reliability: 80, status: "healthy" },
      { name: "Brand Lift Study", lastSync: "1 hafta önce", reliability: 74, status: "warning" },
    ],
    segments: [
      { label: "Lifestyle", value: 80, change: 5 },
      { label: "Product Shot", value: 65, change: -2 },
      { label: "UGC", value: 85, change: 15 },
      { label: "Brand Story", value: 70, change: 3 },
    ],
    anomalies: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// PAZARYERİ
// ═══════════════════════════════════════════════════════════════════════

const marketplaceMetrics: MetricIntelligence[] = [
  {
    id: "marketplace-metric-0",
    title: "Platform Bazlı Net Marj",
    subtitle: "Kanal bazlı kârlılık ve komisyon etkisi",
    metricType: "bar",
    agent: "Marketplace Intelligence",
    departmentId: "marketplace",
    chartData: [18.5, 22.1, 14.8, 19.4],
    chartLabels: ["Trendyol", "HB", "Amazon", "N11"],
    confidenceScore: 84,
    dataCompleteness: 91,
    lastUpdated: "2 saat önce",
    metricBadge: "Kanal Kârlılığı",
    insights: [
      { text: "HB en yüksek net marj (%22.1); düşük komisyon + yüksek AOV.", type: "opportunity" },
      { text: "Amazon en düşük (%14.8); FBA maliyet + yüksek iade oranı.", type: "risk" },
      { text: "Trendyol komisyon artışı uyarısı: Ağustos'ta +2pp bekleniyor.", type: "risk" },
      { text: "N11 buy box ownership %72 ile iyileşme trendinde.", type: "opportunity" },
    ],
    rootCause: {
      description: "HB marj avantajı: düşük komisyon oranı (%12 vs %18 Trendyol) ve premium segment odağı. Amazon düşüklüğü: FBA depolama maliyetleri ve %8.5 iade oranı.",
      sources: ["Pazaryeri Panelleri", "ERP Kanal Raporlama", "Komisyon Analiz Tablosu"],
    },
    impactProjection: "Trendyol komisyon artışı gerçekleşirse yıllık net kâr ₺85K azalır. Amazon FBA optimizasyonu ile ₺45K tasarruf mümkün.",
    suggestedActions: [
      { title: "Amazon FBA → FBM geçiş analizi", description: "Düşük devir ürünlerde FBM'e geçişle depolama maliyetini düşür.", priority: "high" },
      { title: "Trendyol komisyon müzakeresi", description: "Hacim bazlı komisyon indirimi için category manager ile görüş.", priority: "high" },
      { title: "SKU bazlı kârlılık analizi", description: "Her platformda kârsız SKU'ları tespit et; çekilme veya fiyat artışı planla.", priority: "medium" },
    ],
    correlations: [
      { metric: "Komisyon Oranı", score: -0.92, direction: "negative" },
      { metric: "Buy Box Ownership", score: 0.78, direction: "positive" },
      { metric: "İade Oranı", score: -0.74, direction: "negative" },
      { metric: "Ortalama Sipariş Değeri", score: 0.68, direction: "positive" },
    ],
    riskMap: [
      { factor: "Komisyon artışı", probability: "high", impact: "high", department: "Pazaryeri" },
      { factor: "Buy box kaybı", probability: "medium", impact: "high", department: "Pazaryeri" },
      { factor: "Platform policy değişikliği", probability: "medium", impact: "medium", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "commission_change", label: "Komisyon Değişimi", min: -5, max: 10, step: 1, defaultValue: 0, unit: "pp" },
      { id: "return_rate", label: "İade Oranı Değişimi", min: -5, max: 5, step: 1, defaultValue: 0, unit: "pp" },
      { id: "aov_change", label: "AOV Değişimi", min: -15, max: 20, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Trendyol Partner Panel", lastSync: "2 saat önce", reliability: 90, status: "healthy" },
      { name: "HB Satıcı Paneli", lastSync: "3 saat önce", reliability: 87, status: "healthy" },
      { name: "Amazon Seller Central", lastSync: "2 saat önce", reliability: 92, status: "healthy" },
      { name: "N11 Partner Portal", lastSync: "4 saat önce", reliability: 84, status: "healthy" },
    ],
    segments: [
      { label: "Trendyol", value: 18.5, change: -1.5 },
      { label: "HB", value: 22.1, change: 2.3 },
      { label: "Amazon", value: 14.8, change: -0.8 },
      { label: "N11", value: 19.4, change: 1.2 },
    ],
    anomalies: [],
  },
  {
    id: "marketplace-metric-1",
    title: "Komisyon & Maliyet Yapısı",
    subtitle: "Platform maliyet kalemlerinin dağılımı",
    metricType: "donut",
    agent: "Marketplace Intelligence",
    departmentId: "marketplace",
    chartData: [38, 22, 12, 28],
    chartLabels: ["Komisyon", "Kargo/Fulfillment", "İade Maliyeti", "Net Kâr"],
    confidenceScore: 86,
    dataCompleteness: 93,
    lastUpdated: "1 saat önce",
    metricBadge: "Maliyet Yapısı",
    insights: [
      { text: "Komisyon toplam maliyetin %38'i; sektör ort. %32.", type: "risk" },
      { text: "Kargo/fulfillment %22; 3PL optimizasyonu ile %18'e düşürülebilir.", type: "opportunity" },
      { text: "İade maliyeti %12; pazaryeri ortalamasının (%10) üzerinde.", type: "risk" },
      { text: "Net kâr payı %28; hedef %35.", type: "neutral" },
    ],
    rootCause: {
      description: "Yüksek komisyon: Trendyol'un kategori komisyon artışı + Amazon FBA premium. İade yüksekliği: marketplace'lerde iade koşullarının daha liberal olması.",
      sources: ["Komisyon Analiz Tablosu", "3PL Fatura Sistemi", "İade Analiz Motoru"],
    },
    impactProjection: "Maliyet optimizasyonu ile net kâr payı %35'e çıkarılabilir; yıllık ₺210K ek kâr.",
    suggestedActions: [
      { title: "3PL konsolidasyon", description: "Tüm platformlar için tek 3PL partnerla hacim indirimi al.", priority: "high" },
      { title: "İade azaltma programı", description: "Marketplace'lerde ürün açıklama ve görsel kalitesini standardize et.", priority: "medium" },
      { title: "Komisyon monitoring sistemi", description: "Platform komisyon değişikliklerini otomatik takip et.", priority: "low" },
    ],
    correlations: [
      { metric: "Platform Satış Hacmi", score: -0.65, direction: "negative" },
      { metric: "Ürün Açıklama Kalitesi", score: -0.58, direction: "negative" },
      { metric: "Fulfillment Hızı", score: -0.72, direction: "negative" },
    ],
    riskMap: [
      { factor: "Komisyon artışı", probability: "high", impact: "high", department: "Pazaryeri" },
      { factor: "3PL fiyat artışı", probability: "medium", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "commission_opt", label: "Komisyon İndirimi", min: 0, max: 10, step: 1, defaultValue: 0, unit: "pp" },
      { id: "fulfillment_opt", label: "Fulfillment Optimizasyon", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
      { id: "return_reduction", label: "İade Azaltma", min: 0, max: 30, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Komisyon Tracker", lastSync: "1 saat önce", reliability: 93, status: "healthy" },
      { name: "3PL Sistemi", lastSync: "3 saat önce", reliability: 88, status: "healthy" },
      { name: "İade Analiz Motoru", lastSync: "2 saat önce", reliability: 86, status: "healthy" },
    ],
    segments: [
      { label: "Komisyon", value: 38, change: 3 },
      { label: "Kargo/Fulfillment", value: 22, change: -2 },
      { label: "İade Maliyeti", value: 12, change: 1 },
      { label: "Net Kâr", value: 28, change: -2 },
    ],
    anomalies: [],
  },
  {
    id: "marketplace-metric-2",
    title: "SKU Performans Dağılımı",
    subtitle: "Listeleme performansı ve satış korelasyonu",
    metricType: "line",
    agent: "Marketplace Intelligence",
    departmentId: "marketplace",
    chartData: [120, 135, 128, 145, 160, 155, 170],
    chartData2: [80, 95, 88, 105, 120, 112, 130],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [178, 185, 192],
    confidenceScore: 80,
    dataCompleteness: 87,
    lastUpdated: "3 saat önce",
    metricBadge: "SKU Performansı",
    insights: [
      { text: "Aktif listeleme 120'den 170'e çıktı; satış oranı %76 ile stabil.", type: "opportunity" },
      { text: "Top %20 SKU toplam gelirin %72'sini oluşturuyor; yüksek konsantrasyon.", type: "risk" },
      { text: "Rating ortalaması 4.3/5; 4.0 altı 8 SKU var.", type: "neutral" },
      { text: "Buy box kaybı yaşanan 12 SKU'da %35 satış düşüşü.", type: "risk" },
    ],
    rootCause: {
      description: "SKU konsantrasyonu: hero product stratejisi ile az sayıda ürüne odaklanılması. Buy box kaybı: rakip fiyat agresifliği ve stok kırılması.",
      sources: ["Pazaryeri Analytics", "SKU Performance Dashboard", "Competitor Price Tracker"],
    },
    impactProjection: "SKU diversifikasyonu ile gelir riski %30 azalır. Buy box recovery 12 SKU'da ₺65K/ay ek gelir sağlar.",
    suggestedActions: [
      { title: "Buy box recovery planı", description: "12 SKU için fiyat ve stok stratejisi optimize et.", priority: "high" },
      { title: "Long-tail SKU genişletme", description: "Konsantrasyon riskini azaltmak için 20 yeni SKU planla.", priority: "medium" },
      { title: "Rating iyileştirme programı", description: "4.0 altı 8 SKU'da müşteri deneyimi ve ürün kalitesi aksiyonu al.", priority: "medium" },
    ],
    correlations: [
      { metric: "Buy Box Ownership", score: 0.86, direction: "positive" },
      { metric: "Rating Ortalaması", score: 0.79, direction: "positive" },
      { metric: "SKU Konsantrasyon Oranı", score: -0.71, direction: "negative" },
      { metric: "Rakip Fiyat Farkı", score: -0.76, direction: "negative" },
    ],
    riskMap: [
      { factor: "Hero SKU bağımlılığı", probability: "high", impact: "high", department: "Pazaryeri" },
      { factor: "Rakip fiyat savaşı", probability: "medium", impact: "high", department: "Pazarlama" },
      { factor: "Rating düşüşü", probability: "medium", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "new_skus", label: "Yeni SKU Sayısı", min: 0, max: 50, step: 5, defaultValue: 0, unit: "adet" },
      { id: "buybox_recovery", label: "Buy Box Recovery", min: 0, max: 100, step: 10, defaultValue: 0, unit: "%" },
      { id: "price_adjust", label: "Fiyat Ayarı", min: -10, max: 10, step: 1, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Multi-channel SKU Tracker", lastSync: "3 saat önce", reliability: 85, status: "healthy" },
      { name: "Competitor Price API", lastSync: "1 saat önce", reliability: 82, status: "healthy" },
      { name: "Rating Monitor", lastSync: "6 saat önce", reliability: 79, status: "warning" },
    ],
    segments: [
      { label: "Top %20 SKU", value: 72, change: -3 },
      { label: "Mid %30 SKU", value: 18, change: 5 },
      { label: "Long-tail %50 SKU", value: 10, change: 8 },
    ],
    anomalies: [
      { period: "Haz", value: 155, expected: 162, description: "12 SKU'da buy box kaybı; rakip fiyat indirimi" },
    ],
  },
  {
    id: "marketplace-metric-3",
    title: "Platform Risk Skoru",
    subtitle: "Platform bazlı policy ve operasyonel risk",
    metricType: "bar",
    agent: "Marketplace Intelligence",
    departmentId: "marketplace",
    chartData: [45, 32, 58, 28],
    chartLabels: ["Trendyol", "HB", "Amazon", "N11"],
    confidenceScore: 74,
    dataCompleteness: 82,
    lastUpdated: "4 saat önce",
    metricBadge: "Platform Riski",
    insights: [
      { text: "Amazon en yüksek risk (58/100); policy enforcement sıkılaşıyor.", type: "risk" },
      { text: "N11 en düşük risk (28/100); esnek policy ve düşük rekabet.", type: "opportunity" },
      { text: "Trendyol'da 2 policy violation uyarısı; listing suspension riski.", type: "risk" },
      { text: "HB performans metrikleri stabil; risk düşük seviyede.", type: "opportunity" },
    ],
    rootCause: {
      description: "Amazon yüksek risk: sıkı A+ content kuralları, IP complaint riski ve account health dashboard kısıtlamaları. Trendyol uyarıları: ürün açıklama guideline değişikliğine uyum gecikmesi.",
      sources: ["Platform Health Dashboards", "Policy Compliance Tracker", "Risk Assessment Matrix"],
    },
    impactProjection: "Trendyol listing suspension gerçekleşirse aylık ₺120K gelir kaybı. Amazon account health düzeltilmezse %15 visibility kaybı.",
    suggestedActions: [
      { title: "Trendyol policy compliance fix", description: "2 violation uyarısını 48 saat içinde çöz.", priority: "high" },
      { title: "Amazon account health iyileştirme", description: "ODR, late shipment ve cancellation rate'leri hedef altına çek.", priority: "high" },
      { title: "Platform risk monitoring otomasyonu", description: "Tüm platformlarda policy değişikliklerini otomatik takip et.", priority: "medium" },
    ],
    correlations: [
      { metric: "Policy Violation Sayısı", score: 0.89, direction: "positive" },
      { metric: "Account Health Score", score: -0.85, direction: "negative" },
      { metric: "Gelir Konsantrasyonu", score: 0.72, direction: "positive" },
    ],
    riskMap: [
      { factor: "Account suspension", probability: "low", impact: "high", department: "Pazaryeri" },
      { factor: "Policy violation cezası", probability: "medium", impact: "medium", department: "Pazaryeri" },
      { factor: "Platform algorithm değişikliği", probability: "high", impact: "medium", department: "Pazaryeri" },
    ],
    simulationParams: [
      { id: "compliance_rate", label: "Compliance İyileşme", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
      { id: "diversification", label: "Platform Çeşitlendirme", min: 0, max: 50, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Platform Health Dashboards", lastSync: "4 saat önce", reliability: 82, status: "warning" },
      { name: "Policy Compliance Tracker", lastSync: "6 saat önce", reliability: 76, status: "warning" },
      { name: "Risk Matrix Tool", lastSync: "1 gün önce", reliability: 70, status: "warning" },
    ],
    segments: [
      { label: "Trendyol", value: 45, change: 8 },
      { label: "HB", value: 32, change: -5 },
      { label: "Amazon", value: 58, change: 12 },
      { label: "N11", value: 28, change: -3 },
    ],
    anomalies: [
      { period: "Tem", value: 58, expected: 42, description: "Amazon policy enforcement sıkılaşması + 1 IP complaint" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HUKUK
// ═══════════════════════════════════════════════════════════════════════

const legalMetrics: MetricIntelligence[] = [
  {
    id: "legal-metric-0",
    title: "Uyum Risk Skoru",
    subtitle: "Regülasyon uyum durumu ve bekleyen kontroller",
    metricType: "line",
    agent: "Hukuk Intelligence",
    departmentId: "legal",
    chartData: [72, 75, 78, 74, 80, 83, 86],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [88, 90, 91],
    confidenceScore: 82,
    dataCompleteness: 88,
    lastUpdated: "3 saat önce",
    metricBadge: "Uyum Kontrolü",
    insights: [
      { text: "Uyum skoru %72'den %86'ya yükseldi; KVKK compliance tamamlandı.", type: "opportunity" },
      { text: "7 bekleyen uyum kontrolü; 2'si yüksek öncelikli.", type: "risk" },
      { text: "E-ticaret regülasyonu değişikliği bekleniyor; hazırlık gerekli.", type: "risk" },
      { text: "GDPR cross-border compliance %94 ile AB standartlarını karşılıyor.", type: "opportunity" },
    ],
    rootCause: {
      description: "Uyum iyileşmesi: KVKK compliance projesi tamamlanması ve otomatik compliance checklist implementasyonu. Bekleyen kontroller: yeni e-ticaret yönetmeliği ve mesafeli satış sözleşmesi güncellemeleri.",
      sources: ["Compliance Management System", "KVKK Platform", "Regülasyon Takip Servisi"],
    },
    impactProjection: "Bekleyen 2 yüksek öncelikli kontrol tamamlanmazsa ₺50K-200K arası idari para cezası riski.",
    suggestedActions: [
      { title: "Yüksek öncelikli uyum kontrolleri", description: "2 kritik compliance item'ı 2 hafta içinde tamamla.", priority: "high" },
      { title: "E-ticaret yönetmelik hazırlığı", description: "Beklenen regülasyon değişikliği için gap analizi başlat.", priority: "high" },
      { title: "Uyum otomasyon genişletme", description: "Manuel kontrol süreçlerini %30 azaltacak otomasyon kur.", priority: "medium" },
    ],
    correlations: [
      { metric: "İdari Ceza Riski", score: -0.88, direction: "negative" },
      { metric: "Müşteri Güveni", score: 0.74, direction: "positive" },
      { metric: "Otomasyon Oranı", score: 0.82, direction: "positive" },
    ],
    riskMap: [
      { factor: "KVKK ihlali", probability: "low", impact: "high", department: "Hukuk" },
      { factor: "E-ticaret regülasyonu", probability: "high", impact: "medium", department: "Hukuk" },
      { factor: "Tüketici şikayeti", probability: "medium", impact: "medium", department: "Operasyon" },
    ],
    simulationParams: [
      { id: "compliance_items", label: "Tamamlanan Kontrol Sayısı", min: 0, max: 7, step: 1, defaultValue: 0, unit: "adet" },
      { id: "automation_rate", label: "Otomasyon Oranı", min: 20, max: 80, step: 10, defaultValue: 40, unit: "%" },
    ],
    dataSources: [
      { name: "Compliance Management", lastSync: "3 saat önce", reliability: 90, status: "healthy" },
      { name: "KVKK Platform", lastSync: "1 gün önce", reliability: 85, status: "healthy" },
      { name: "Regülasyon Tracker", lastSync: "6 saat önce", reliability: 78, status: "warning" },
    ],
    segments: [
      { label: "KVKK", value: 94, change: 8 },
      { label: "E-Ticaret", value: 78, change: 5 },
      { label: "Tüketici Hakları", value: 86, change: 3 },
      { label: "İş Hukuku", value: 82, change: 2 },
    ],
    anomalies: [
      { period: "Nis", value: 74, expected: 80, description: "Yeni yönetmelik yayınlanması; gap assessment gecikmesi" },
    ],
  },
  {
    id: "legal-metric-1",
    title: "Sözleşme Risk Maruziyet",
    subtitle: "Aktif sözleşmelerin risk dağılımı",
    metricType: "donut",
    agent: "Hukuk Intelligence",
    departmentId: "legal",
    chartData: [55, 30, 15],
    chartLabels: ["Düşük Risk", "Orta Risk", "Yüksek Risk"],
    confidenceScore: 79,
    dataCompleteness: 84,
    lastUpdated: "4 saat önce",
    metricBadge: "Sözleşme Riski",
    insights: [
      { text: "42 aktif sözleşmenin %15'i (6 adet) yüksek risk kategorisinde.", type: "risk" },
      { text: "3 sözleşmede auto-renewal riski; 30 gün içinde iptal window kapanıyor.", type: "risk" },
      { text: "Tedarikçi sözleşmelerinin %80'inde SLA koruması var.", type: "opportunity" },
      { text: "Sözleşme standartlaştırma oranı %65; hedef %85.", type: "neutral" },
    ],
    rootCause: {
      description: "Yüksek riskli sözleşmeler: eski dönemden kalan sınırsız sorumluluk maddeleri, belirsiz SLA terimleri ve yetersiz IP koruma klozları.",
      sources: ["Sözleşme Yönetim Sistemi (CLM)", "Risk Assessment Tool", "Legal Review Log"],
    },
    impactProjection: "6 yüksek riskli sözleşme renegosyasyonu ile potansiyel maruziyet ₺500K azalır. Auto-renewal kaçırılırsa yıllık ₺120K gereksiz maliyet.",
    suggestedActions: [
      { title: "Auto-renewal sözleşmeleri iptal/yenile", description: "3 sözleşmede 30 gün içinde karar ver.", priority: "high" },
      { title: "Yüksek risk sözleşme renegosyasyonu", description: "6 sözleşmede sorumluluk sınırı ve SLA maddelerini güncelle.", priority: "high" },
      { title: "Sözleşme template standardizasyonu", description: "Standart şablonları tüm departmanlara yaygınlaştır.", priority: "medium" },
    ],
    correlations: [
      { metric: "Sözleşme Standardizasyon Oranı", score: -0.81, direction: "negative" },
      { metric: "Hukuki Maruziyet Tutarı", score: 0.88, direction: "positive" },
      { metric: "Sözleşme İnceleme Süresi", score: 0.65, direction: "positive" },
    ],
    riskMap: [
      { factor: "Sınırsız sorumluluk maddesi", probability: "low", impact: "high", department: "Hukuk" },
      { factor: "Auto-renewal kaçırma", probability: "medium", impact: "medium", department: "Finans" },
      { factor: "IP ihlali riski", probability: "low", impact: "high", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "renegotiation", label: "Renegosyasyon Tamamlama", min: 0, max: 6, step: 1, defaultValue: 0, unit: "sözleşme" },
      { id: "standardization", label: "Standardizasyon Oranı", min: 50, max: 100, step: 5, defaultValue: 65, unit: "%" },
    ],
    dataSources: [
      { name: "CLM Sistemi", lastSync: "4 saat önce", reliability: 87, status: "healthy" },
      { name: "Risk Assessment Tool", lastSync: "1 gün önce", reliability: 80, status: "healthy" },
      { name: "Calendar/Deadline Tracker", lastSync: "2 saat önce", reliability: 92, status: "healthy" },
    ],
    segments: [
      { label: "Tedarikçi Sözleşmeleri", value: 18, change: -5 },
      { label: "Platform Sözleşmeleri", value: 8, change: 12 },
      { label: "Müşteri Sözleşmeleri", value: 12, change: 0 },
      { label: "İş Ortağı Sözleşmeleri", value: 4, change: -20 },
    ],
    anomalies: [],
  },
  {
    id: "legal-metric-2",
    title: "Hukuki İnceleme SLA",
    subtitle: "Ortalama inceleme süresi ve SLA uyumu",
    metricType: "line",
    agent: "Hukuk Intelligence",
    departmentId: "legal",
    chartData: [5.2, 4.8, 6.1, 5.5, 4.2, 3.8, 4.0],
    chartLabels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"],
    forecastData: [3.6, 3.4, 3.2],
    confidenceScore: 84,
    dataCompleteness: 91,
    lastUpdated: "2 saat önce",
    metricBadge: "İnceleme SLA",
    insights: [
      { text: "Ortalama inceleme süresi 5.2 günden 4.0 güne düştü; hedef 3.0 gün.", type: "opportunity" },
      { text: "Mart'ta 6.1 güne spike: yoğun M&A due diligence dönemi.", type: "neutral" },
      { text: "Standart sözleşme incelemeleri 2.1 gün ile SLA dahilinde.", type: "opportunity" },
      { text: "Kompleks incelemeler 8.5 gün ile SLA dışında.", type: "risk" },
    ],
    rootCause: {
      description: "SLA iyileşmesi: sözleşme template'leri ve otomatik clause extraction. Mart spike: 2 eşzamanlı M&A dosyası tüm kapasiteyi bağladı.",
      sources: ["Legal Operations Dashboard", "CLM Workflow", "Capacity Planning Tool"],
    },
    impactProjection: "SLA 3.0 güne düşürülürse iş birimlerinin hukuk beklemesi %40 azalır; deal closing hızı %15 artar.",
    suggestedActions: [
      { title: "Kompleks inceleme triajı", description: "Kompleks dosyalar için risk-bazlı önceliklendirme kur.", priority: "high" },
      { title: "AI-assisted contract review", description: "Standart kloları otomatik inceleyen AI tool pilot'u başlat.", priority: "medium" },
      { title: "Kapasite planlama modeli", description: "Mevsimsel yoğunluk dönemleri için dış kaynak planı oluştur.", priority: "low" },
    ],
    correlations: [
      { metric: "Template Kullanım Oranı", score: -0.82, direction: "negative" },
      { metric: "Kompleks Dosya Oranı", score: 0.88, direction: "positive" },
      { metric: "Deal Closing Hızı", score: -0.76, direction: "negative" },
      { metric: "Hukuk Ekip Kapasitesi", score: -0.79, direction: "negative" },
    ],
    riskMap: [
      { factor: "Kapasite aşımı", probability: "medium", impact: "medium", department: "Hukuk" },
      { factor: "SLA breach", probability: "medium", impact: "medium", department: "Hukuk" },
      { factor: "Eksik inceleme riski", probability: "low", impact: "high", department: "Hukuk" },
    ],
    simulationParams: [
      { id: "template_usage", label: "Template Kullanım Oranı", min: 30, max: 90, step: 5, defaultValue: 55, unit: "%" },
      { id: "ai_assist", label: "AI Assist Coverage", min: 0, max: 80, step: 10, defaultValue: 0, unit: "%" },
      { id: "outsource", label: "Dış Kaynak Oranı", min: 0, max: 40, step: 5, defaultValue: 10, unit: "%" },
    ],
    dataSources: [
      { name: "Legal Ops Dashboard", lastSync: "2 saat önce", reliability: 91, status: "healthy" },
      { name: "CLM Workflow Engine", lastSync: "1 saat önce", reliability: 94, status: "healthy" },
      { name: "Capacity Planning", lastSync: "1 gün önce", reliability: 82, status: "healthy" },
    ],
    segments: [
      { label: "Standart Sözleşme", value: 2.1, change: -18 },
      { label: "Kompleks Sözleşme", value: 8.5, change: -8 },
      { label: "Regülasyon İnceleme", value: 5.2, change: -12 },
      { label: "M&A Due Diligence", value: 15.0, change: 5 },
    ],
    anomalies: [
      { period: "Mar", value: 6.1, expected: 4.5, description: "2 eşzamanlı M&A due diligence; kapasite aşımı" },
    ],
  },
  {
    id: "legal-metric-3",
    title: "Regülasyon Etki Endeksi",
    subtitle: "Yaklaşan regülasyonların iş etkisi tahmini",
    metricType: "bar",
    agent: "Hukuk Intelligence",
    departmentId: "legal",
    chartData: [82, 65, 45, 30],
    chartLabels: ["E-Ticaret Yön.", "KVKK Güncelleme", "İş Hukuku", "Gümrük Reg."],
    confidenceScore: 71,
    dataCompleteness: 78,
    lastUpdated: "6 saat önce",
    metricBadge: "Regülasyon Etkisi",
    insights: [
      { text: "Yeni e-ticaret yönetmeliği en yüksek etki (82/100); 6 ay içinde yürürlüğe girecek.", type: "risk" },
      { text: "KVKK güncelleme taslağı yayınlandı; mevcut uyum %65 karşılıyor.", type: "risk" },
      { text: "İş hukuku değişiklikleri orta etki; uzaktan çalışma düzenlemeleri.", type: "neutral" },
      { text: "Gümrük regülasyonları düşük etki; mevcut süreçler uyumlu.", type: "opportunity" },
    ],
    rootCause: {
      description: "E-ticaret yönetmeliği: iade koşulları, bilgilendirme yükümlülükleri ve platform sorumlulukları değişiyor. KVKK güncelleme: cross-border data transfer kuralları sıkılaşıyor.",
      sources: ["Resmi Gazete Taraması", "Sektör Derneği Bülteni", "Hukuk Danışmanı Raporları"],
    },
    impactProjection: "E-ticaret yönetmeliğine uyum sağlanamazsa ₺100K-500K arası ceza riski. Zamanında hazırlık ile rekabet avantajı sağlanabilir.",
    suggestedActions: [
      { title: "E-ticaret yönetmelik gap analizi", description: "Yeni yönetmeliğin her maddesini mevcut süreçlerle karşılaştır.", priority: "high" },
      { title: "KVKK güncelleme hazırlığı", description: "Cross-border data flow audit başlat.", priority: "high" },
      { title: "Regülasyon takvimi oluştur", description: "Tüm beklenen değişiklikleri timeline'a ekle.", priority: "medium" },
    ],
    correlations: [
      { metric: "Uyum Hazırlık Süresi", score: -0.85, direction: "negative" },
      { metric: "Hukuk Bütçe İhtiyacı", score: 0.78, direction: "positive" },
      { metric: "İş Süreci Değişiklik Kapsamı", score: 0.82, direction: "positive" },
    ],
    riskMap: [
      { factor: "E-ticaret yönetmeliği uyumsuzluk", probability: "medium", impact: "high", department: "Hukuk" },
      { factor: "KVKK veri transfer ihlali", probability: "low", impact: "high", department: "Teknoloji" },
      { factor: "İş hukuku uyum gecikmesi", probability: "low", impact: "medium", department: "Yönetim" },
    ],
    simulationParams: [
      { id: "prep_time", label: "Hazırlık Süresi", min: 1, max: 12, step: 1, defaultValue: 3, unit: "ay" },
      { id: "legal_budget", label: "Hukuk Bütçe Artışı", min: 0, max: 50, step: 5, defaultValue: 0, unit: "%" },
    ],
    dataSources: [
      { name: "Resmi Gazete Tarama", lastSync: "6 saat önce", reliability: 95, status: "healthy" },
      { name: "Sektör Derneği", lastSync: "1 gün önce", reliability: 72, status: "warning" },
      { name: "Hukuk Danışmanı", lastSync: "2 gün önce", reliability: 88, status: "healthy" },
    ],
    segments: [
      { label: "E-Ticaret Yönetmeliği", value: 82, change: 15 },
      { label: "KVKK Güncelleme", value: 65, change: 10 },
      { label: "İş Hukuku", value: 45, change: 5 },
      { label: "Gümrük Regülasyonu", value: 30, change: -5 },
    ],
    anomalies: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// MASTER MAP
// ═══════════════════════════════════════════════════════════════════════

export const departmentMetrics: Record<DepartmentId, MetricIntelligence[]> = {
  executive: executiveMetrics,
  technology: technologyMetrics,
  marketing: marketingMetrics,
  finance: financeMetrics,
  operations: operationsMetrics,
  creative: creativeMetrics,
  marketplace: marketplaceMetrics,
  legal: legalMetrics,
};

export function getMetricIntelligence(deptId: DepartmentId, metricId: string): MetricIntelligence | undefined {
  const metrics = departmentMetrics[deptId];
  if (!metrics) return undefined;
  return metrics.find(m => m.id === metricId);
}
