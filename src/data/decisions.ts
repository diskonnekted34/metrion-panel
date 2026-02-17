// Decision Operating Engine — Data Model

export type DecisionLifecycle = 
  | "proposed" 
  | "under_review" 
  | "approved" 
  | "rejected" 
  | "in_execution" 
  | "monitoring" 
  | "completed" 
  | "failed";

export type StrategicCategory = "operational" | "strategic" | "structural";
export type RiskLevel = "low" | "medium" | "high";
export type MonitoringDuration = "7d" | "14d" | "30d" | "90d";

export interface KPIAttachment {
  primary: {
    name: string;
    baseline: number;
    target: number;
    current?: number;
    unit: string;
  };
  secondary?: {
    name: string;
    baseline: number;
    target: number;
    current?: number;
    unit: string;
  };
  monitoringDuration: MonitoringDuration;
}

export interface DecisionPerformanceReport {
  expectedImpact: string;
  actualImpact: string;
  variancePercent: number;
  aiPredictionAccuracy: number;
  financialOutcome: string;
  strategicOutcome: string;
  riskOutcome: string;
  overrideEffectAnalysis?: string;
  status: "successful" | "partially_successful" | "failed";
}

export interface MonitoringEntry {
  date: string;
  primaryKPIValue: number;
  projectedValue: number;
  deviation: number;
  aiComment?: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: StrategicCategory;
  lifecycle: DecisionLifecycle;
  priorityScore: number;
  riskLevel: RiskLevel;
  aiConfidence: number;
  simulationStrength: number; // 0-100
  humanOverrideRisk: RiskLevel;
  estimatedFinancialImpact: string;
  estimatedKPIImpact: string;
  timeSensitivity: "low" | "medium" | "high" | "critical";
  decisionDelayRisk: {
    days: number;
    estimatedLoss: string;
  };
  requiredApprovers: string[];
  finalAuthority: string;
  source: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  aiCounterArgument?: string;
  responsibleSeat?: string;
  kpiAttachment?: KPIAttachment;
  monitoringData?: MonitoringEntry[];
  performanceReport?: DecisionPerformanceReport;
  // Detail page
  aiReasoning: string;
  dataSources: string[];
  modelReasoning: string;
  overrideEvents: { date: string; user: string; details: string }[];
  // Pressure system
  lastActionDate: string;
}

export interface ExecutiveDecisionRecord {
  seatId: string;
  name: string;
  totalDecisions: number;
  successRate: number;
  avgVariance: number;
  overrideFrequency: number;
  aiAlignmentScore: number;
}

// ── Lifecycle Config ──
export const lifecycleConfig: Record<DecisionLifecycle, { label: string; color: string; bg: string }> = {
  proposed: { label: "Önerilen", color: "text-primary", bg: "bg-primary/10" },
  under_review: { label: "İncelemede", color: "text-amber-400", bg: "bg-amber-400/10" },
  approved: { label: "Onaylandı", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  rejected: { label: "Reddedildi", color: "text-destructive", bg: "bg-destructive/10" },
  in_execution: { label: "Yürütülüyor", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  monitoring: { label: "İzlemede", color: "text-violet-400", bg: "bg-violet-400/10" },
  completed: { label: "Tamamlandı", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  failed: { label: "Başarısız", color: "text-destructive", bg: "bg-destructive/10" },
};

export const categoryLabels: Record<StrategicCategory, string> = {
  operational: "Operasyonel",
  strategic: "Stratejik",
  structural: "Yapısal",
};

export const timeSensitivityLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Düşük", color: "text-muted-foreground" },
  medium: { label: "Orta", color: "text-amber-400" },
  high: { label: "Yüksek", color: "text-orange-400" },
  critical: { label: "Kritik", color: "text-destructive" },
};

// ── Mock Decisions ──
export const decisions: Decision[] = [
  {
    id: "dec-1",
    title: "Q2 Pazarlama Bütçesini %20 Artır",
    description: "ROAS trendi ve kanal doygunluk analizi doğrultusunda pazarlama bütçesinin artırılması öneriliyor.",
    category: "strategic",
    lifecycle: "proposed",
    priorityScore: 95,
    riskLevel: "medium",
    aiConfidence: 87,
    simulationStrength: 82,
    humanOverrideRisk: "low",
    estimatedFinancialImpact: "Gelirde tahmini ₺1.2M artış",
    estimatedKPIImpact: "ROAS: 3.2 → 3.8 · CAC: ₺45 → ₺38",
    timeSensitivity: "high",
    decisionDelayRisk: { days: 30, estimatedLoss: "$82,000" },
    requiredApprovers: ["CEO", "CFO"],
    finalAuthority: "CEO",
    source: "CMO Agent",
    createdAt: "2026-02-14T08:30:00Z",
    lastActionDate: "2026-02-14T08:30:00Z",
    kpiAttachment: {
      primary: { name: "ROAS", baseline: 3.2, target: 3.8, unit: "x" },
      secondary: { name: "CAC", baseline: 45, target: 38, unit: "₺" },
      monitoringDuration: "14d",
    },
    aiReasoning: "Son 3 aydaki ROAS trendi pozitif seyrediyor. Kanal doygunluk analizi ek bütçe için uygun ortam olduğunu gösteriyor. Rakip harcamaları %15 artış gösterirken mevcut bütçeyle market share kaybı riski bulunuyor.",
    dataSources: ["Google Ads API", "Meta Ads API", "Internal CRM", "Rakip Analiz Modülü"],
    modelReasoning: "Bayesian Ensemble modeli %87 güvenle gelir artışı öngörüyor. Monte Carlo simülasyonu 10,000 iterasyonda %82 başarı olasılığı gösteriyor.",
    overrideEvents: [],
  },
  {
    id: "dec-2",
    title: "Yeni Tedarikçi Sözleşmesi Onayı",
    description: "Mevcut tedarikçi fiyatlarında %8 artış nedeniyle alternatif tedarikçi geçişi değerlendirilmeli.",
    category: "operational",
    lifecycle: "under_review",
    priorityScore: 88,
    riskLevel: "low",
    aiConfidence: 92,
    simulationStrength: 78,
    humanOverrideRisk: "low",
    estimatedFinancialImpact: "Yıllık maliyet tasarrufu: ₺240K",
    estimatedKPIImpact: "COGS: %32 → %29.5",
    timeSensitivity: "medium",
    decisionDelayRisk: { days: 14, estimatedLoss: "$28,000" },
    requiredApprovers: ["COO", "CFO"],
    finalAuthority: "CFO",
    source: "COO Agent",
    createdAt: "2026-02-13T14:00:00Z",
    lastActionDate: "2026-02-15T10:00:00Z",
    kpiAttachment: {
      primary: { name: "COGS Oranı", baseline: 32, target: 29.5, unit: "%" },
      monitoringDuration: "30d",
    },
    aiReasoning: "Tedarikçi benchmark analizi 47 alternatif arasından en uygun 3 adayı belirledi. Kalite skorları mevcut tedarikçiyle eşdeğer.",
    dataSources: ["Tedarikçi Veritabanı", "Kalite Kontrol Raporları", "Piyasa Fiyat Endeksi"],
    modelReasoning: "Regresyon analizi %92 güvenle maliyet düşüşü öngörüyor. Geçiş riski düşük.",
    overrideEvents: [],
  },
  {
    id: "dec-3",
    title: "Kubernetes Cluster Ölçeklendirme",
    description: "Artan trafik yükü nedeniyle infrastructure kapasitesinin 2x artırılması gerekiyor.",
    category: "structural",
    lifecycle: "approved",
    priorityScore: 82,
    riskLevel: "medium",
    aiConfidence: 78,
    simulationStrength: 65,
    humanOverrideRisk: "medium",
    estimatedFinancialImpact: "Aylık ek maliyet: ₺45K · Downtime riski azalır",
    estimatedKPIImpact: "Uptime: %99.95 → %99.99",
    timeSensitivity: "critical",
    decisionDelayRisk: { days: 7, estimatedLoss: "$120,000" },
    requiredApprovers: ["CTO"],
    finalAuthority: "CTO",
    source: "CTO Agent",
    createdAt: "2026-02-15T06:00:00Z",
    approvedAt: "2026-02-16T09:00:00Z",
    lastActionDate: "2026-02-16T09:00:00Z",
    responsibleSeat: "CTO",
    kpiAttachment: {
      primary: { name: "Uptime", baseline: 99.95, target: 99.99, unit: "%" },
      secondary: { name: "Response Time", baseline: 280, target: 150, unit: "ms" },
      monitoringDuration: "7d",
    },
    aiReasoning: "Trafik artış trendi %35/ay seviyesinde. Mevcut kapasite 2 hafta içinde kritik eşiğe ulaşacak.",
    dataSources: ["Prometheus Metrics", "Cloud Provider API", "Trafik Analitik"],
    modelReasoning: "Kapasite planlama modeli %78 güvenle ölçeklendirme gereksinimini doğruluyor.",
    overrideEvents: [
      { date: "2026-02-16T08:30:00Z", user: "Can Arslan", details: "Bütçe miktarı ₺45K'dan ₺38K'ya revize edildi." },
    ],
  },
  {
    id: "dec-4",
    title: "Nakit Rezerv Politikası Güncelleme",
    description: "Mevcut burn rate'e göre nakit tampon süresinin 4 aydan 6 aya çıkarılması öneriliyor.",
    category: "strategic",
    lifecycle: "proposed",
    priorityScore: 91,
    riskLevel: "high",
    aiConfidence: 94,
    simulationStrength: 90,
    humanOverrideRisk: "high",
    estimatedFinancialImpact: "₺2.4M nakit kilitleme · Likidite güvenliği sağlanır",
    estimatedKPIImpact: "Cash Runway: 4 ay → 6 ay",
    timeSensitivity: "high",
    decisionDelayRisk: { days: 15, estimatedLoss: "$195,000" },
    requiredApprovers: ["CEO", "CFO"],
    finalAuthority: "CEO",
    source: "CFO Agent",
    createdAt: "2026-02-15T09:00:00Z",
    lastActionDate: "2026-02-15T09:00:00Z",
    kpiAttachment: {
      primary: { name: "Cash Runway", baseline: 4, target: 6, unit: "ay" },
      monitoringDuration: "90d",
    },
    aiReasoning: "Makroekonomik göstergeler belirsizlik artışına işaret ediyor. Sektörde 3 büyük oyuncu nakit rezervlerini artırdı. Tarihsel analiz, 6 aylık tamponun optimal olduğunu gösteriyor.",
    dataSources: ["Internal Financials", "Makroekonomik Veri", "Sektör Benchmark", "Rakip Analizi"],
    modelReasoning: "Monte Carlo simülasyonu %94 güvenle 6 aylık tamponun optimal olduğunu gösteriyor. Worst-case senaryoda bile likidite korunuyor.",
    overrideEvents: [],
  },
  {
    id: "dec-5",
    title: "Kreatif Varyant A/B Test Başlat",
    description: "Mevcut kreatif materyallerde doygunluk tespit edildi. Yeni varyant testi öneriliyor.",
    category: "operational",
    lifecycle: "monitoring",
    priorityScore: 72,
    riskLevel: "low",
    aiConfidence: 84,
    simulationStrength: 70,
    humanOverrideRisk: "low",
    estimatedFinancialImpact: "Tahmini CTR artışıyla ₺80K ek gelir",
    estimatedKPIImpact: "CTR: %1.8 → %2.1",
    timeSensitivity: "medium",
    decisionDelayRisk: { days: 45, estimatedLoss: "$35,000" },
    requiredApprovers: ["CMO"],
    finalAuthority: "CMO",
    source: "Kreatif Direktör Agent",
    createdAt: "2026-02-10T10:00:00Z",
    approvedAt: "2026-02-11T14:00:00Z",
    lastActionDate: "2026-02-16T06:00:00Z",
    responsibleSeat: "CMO",
    kpiAttachment: {
      primary: { name: "CTR", baseline: 1.8, target: 2.1, current: 1.95, unit: "%" },
      secondary: { name: "CPC", baseline: 2.4, target: 2.0, current: 2.15, unit: "₺" },
      monitoringDuration: "14d",
    },
    monitoringData: [
      { date: "2026-02-12", primaryKPIValue: 1.82, projectedValue: 1.85, deviation: -1.6, aiComment: "İlk gün — henüz erken." },
      { date: "2026-02-13", primaryKPIValue: 1.88, projectedValue: 1.90, deviation: -1.1 },
      { date: "2026-02-14", primaryKPIValue: 1.91, projectedValue: 1.95, deviation: -2.1, aiComment: "Hafif gecikme, trend pozitif." },
      { date: "2026-02-15", primaryKPIValue: 1.93, projectedValue: 2.00, deviation: -3.5 },
      { date: "2026-02-16", primaryKPIValue: 1.95, projectedValue: 2.02, deviation: -3.5, aiComment: "İyileşme devam ediyor ama projeksiyonun altında." },
    ],
    aiReasoning: "Kreatif frekans skoru %72 doygunluğa ulaşmış. Yeni varyantlar test edilmeli.",
    dataSources: ["Meta Ads API", "Creative Analytics", "A/B Test Platformu"],
    modelReasoning: "Bayesian A/B analizi %84 güvenle CTR artışı öngörüyor.",
    overrideEvents: [],
  },
  {
    id: "dec-6",
    title: "Premium Fiyatlama Katmanı Oluştur",
    description: "Mevcut müşteri segmentasyonu premium katman için yeterli talep olduğunu gösteriyor.",
    category: "strategic",
    lifecycle: "completed",
    priorityScore: 85,
    riskLevel: "medium",
    aiConfidence: 88,
    simulationStrength: 85,
    humanOverrideRisk: "medium",
    estimatedFinancialImpact: "ARPU artışı: %25 · Yıllık ek gelir: ₺1.8M",
    estimatedKPIImpact: "ARPU: ₺120 → ₺150",
    timeSensitivity: "low",
    decisionDelayRisk: { days: 60, estimatedLoss: "$150,000" },
    requiredApprovers: ["CEO", "CMO"],
    finalAuthority: "CEO",
    source: "Growth Lead Agent",
    createdAt: "2026-01-15T10:00:00Z",
    approvedAt: "2026-01-18T09:00:00Z",
    lastActionDate: "2026-02-15T10:00:00Z",
    responsibleSeat: "CMO",
    kpiAttachment: {
      primary: { name: "ARPU", baseline: 120, target: 150, current: 142, unit: "₺" },
      monitoringDuration: "30d",
    },
    performanceReport: {
      expectedImpact: "ARPU %25 artış",
      actualImpact: "ARPU %18.3 artış",
      variancePercent: -6.7,
      aiPredictionAccuracy: 73,
      financialOutcome: "Yıllık bazda ₺1.32M ek gelir (hedefin %73'ü)",
      strategicOutcome: "Premium segment başarıyla oluşturuldu. Churn oranı hedefin üzerinde.",
      riskOutcome: "Orta risk gerçekleşmedi. Müşteri kaybı beklenenin altında.",
      status: "partially_successful",
    },
    aiReasoning: "Willingness-to-pay analizi premium katman için yeterli talep olduğunu gösterdi.",
    dataSources: ["CRM Data", "Müşteri Anket", "Piyasa Araştırması", "Rakip Fiyatlama"],
    modelReasoning: "Conjoint analizi %88 güvenle fiyatlama aralığını doğruluyor.",
    overrideEvents: [
      { date: "2026-01-17T14:00:00Z", user: "Ahmet Yılmaz", details: "Fiyat ₺180 yerine ₺150 olarak revize edildi." },
    ],
  },
  {
    id: "dec-7",
    title: "Lojistik Otomasyon Yatırımı",
    description: "Depo operasyonlarında otomasyon sistemi kurulması değerlendirilmeli.",
    category: "structural",
    lifecycle: "rejected",
    priorityScore: 68,
    riskLevel: "high",
    aiConfidence: 71,
    simulationStrength: 55,
    humanOverrideRisk: "high",
    estimatedFinancialImpact: "Yatırım: ₺3.2M · ROI süresi: 18 ay",
    estimatedKPIImpact: "İşlem hızı: %40 artış",
    timeSensitivity: "low",
    decisionDelayRisk: { days: 90, estimatedLoss: "$45,000" },
    requiredApprovers: ["CEO", "COO", "CFO"],
    finalAuthority: "CEO",
    source: "COO Agent",
    createdAt: "2026-02-01T10:00:00Z",
    rejectedAt: "2026-02-08T16:00:00Z",
    rejectionReason: "Mevcut nakit pozisyonu bu ölçekte yatırım için uygun değil. Q3'te yeniden değerlendirilecek.",
    aiCounterArgument: "Erteleme, operasyonel verimsizlik maliyetinin devam etmesine neden olacak. 6 aylık ertelemenin tahmini ek maliyeti ₺280K. Alternatif: Modüler otomasyon ile fazlara bölünmüş yatırım planı öneriliyor.",
    lastActionDate: "2026-02-08T16:00:00Z",
    aiReasoning: "Depo operasyonlarında hata oranı ve gecikme trendleri yukarı yönlü. Otomasyon uzun vadede kaçınılmaz.",
    dataSources: ["WMS Data", "İşgücü Maliyetleri", "Hata Raporları", "Benchmark Verileri"],
    modelReasoning: "NPV analizi %71 güvenle pozitif ROI öngörüyor ama payback süresi uzun.",
    overrideEvents: [
      { date: "2026-02-08T16:00:00Z", user: "Ahmet Yılmaz", details: "CEO tarafından reddedildi. Nakit pozisyonu gerekçesiyle." },
    ],
  },
  {
    id: "dec-8",
    title: "Müşteri Sadakat Programı Lansman",
    description: "Churn oranını düşürmek için kapsamlı sadakat programı başlatılması öneriliyor.",
    category: "strategic",
    lifecycle: "in_execution",
    priorityScore: 79,
    riskLevel: "low",
    aiConfidence: 86,
    simulationStrength: 75,
    humanOverrideRisk: "low",
    estimatedFinancialImpact: "Churn azalmasıyla yıllık ₺960K tasarruf",
    estimatedKPIImpact: "Churn: %5.2 → %3.8",
    timeSensitivity: "medium",
    decisionDelayRisk: { days: 30, estimatedLoss: "$52,000" },
    requiredApprovers: ["CMO", "CEO"],
    finalAuthority: "CEO",
    source: "Growth Lead Agent",
    createdAt: "2026-02-05T10:00:00Z",
    approvedAt: "2026-02-07T11:00:00Z",
    lastActionDate: "2026-02-16T08:00:00Z",
    responsibleSeat: "CMO",
    kpiAttachment: {
      primary: { name: "Churn Rate", baseline: 5.2, target: 3.8, unit: "%" },
      secondary: { name: "NPS", baseline: 42, target: 55, unit: "puan" },
      monitoringDuration: "30d",
    },
    aiReasoning: "Cohort analizi son 6 ayda churn artış trendi gösteriyor. Sadakat programı bu trendi kırmak için en etkin araç.",
    dataSources: ["CRM Analytics", "Cohort Analizi", "Müşteri Anketleri", "Sektör Benchmark"],
    modelReasoning: "Survival analizi %86 güvenle churn düşüşü öngörüyor.",
    overrideEvents: [],
  },
];

// ── Executive Decision Records (Karar Sicili) ──
export const executiveDecisionRecords: ExecutiveDecisionRecord[] = [
  {
    seatId: "pos-ceo",
    name: "Ahmet Yılmaz (CEO)",
    totalDecisions: 47,
    successRate: 78,
    avgVariance: -4.2,
    overrideFrequency: 12,
    aiAlignmentScore: 82,
  },
  {
    seatId: "pos-cfo",
    name: "Elif Öztürk (CFO)",
    totalDecisions: 31,
    successRate: 85,
    avgVariance: -2.8,
    overrideFrequency: 6,
    aiAlignmentScore: 91,
  },
  {
    seatId: "pos-cto",
    name: "Can Arslan (CTO)",
    totalDecisions: 22,
    successRate: 72,
    avgVariance: -6.1,
    overrideFrequency: 18,
    aiAlignmentScore: 74,
  },
  {
    seatId: "pos-cmo",
    name: "CMO (Otopilot)",
    totalDecisions: 38,
    successRate: 81,
    avgVariance: -3.5,
    overrideFrequency: 0,
    aiAlignmentScore: 100,
  },
  {
    seatId: "pos-coo",
    name: "COO (Otopilot)",
    totalDecisions: 19,
    successRate: 89,
    avgVariance: -1.9,
    overrideFrequency: 0,
    aiAlignmentScore: 100,
  },
];

// Helper: get days since last action
export const getDaysSinceAction = (lastActionDate: string): number => {
  const now = new Date("2026-02-17T12:00:00Z"); // current date mock
  const last = new Date(lastActionDate);
  return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
};

// Helper: get pressure level
export const getPressureLevel = (days: number): "none" | "low" | "medium" | "high" => {
  if (days >= 3) return "high";
  if (days >= 1) return "medium";
  if (days > 0) return "low";
  return "none";
};
