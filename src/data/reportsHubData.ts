// Reports Hub — Full Catalog
// Metrion Corporate Intelligence Report Engine

export type ReportScope = "company" | "department" | "position";
export type ReportType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type ReportStatus = "immutable" | "draft" | "scheduled";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ConfidentialityLevel = "public" | "internal" | "executive";
export type PackageTier = "core" | "growth" | "enterprise";

export interface ReportRow {
  id: string;
  title: string;
  scope: ReportScope;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  department?: string;
  owner?: string;
  positionTitle?: string;
  healthScore: number;
  risk: RiskLevel;
  kpiDelta: string;
  kpiLabel: string;
  recipientsCount: number;
  recipients: string[];
  status: ReportStatus;
  generatedAt: string;
  confidence: number;
  sources: string[];
  hash: string;
  sections: number;
  topRisk: string;
  topOpportunity: string;
  confidentiality: ConfidentialityLevel;
  packageTier: PackageTier;
  version: string;
  aiModelVersion: string;
}

const hash = (i: number) => `0x${(0xA3F1B2 + i * 0x1234).toString(16).slice(0, 8)}`;

// ── A) GLOBAL COMPANY REPORTS ──

const companyReports: ReportRow[] = [
  // 1. Haftalık Yönetim Raporu (6 instances)
  ...Array.from({ length: 6 }, (_, i): ReportRow => ({
    id: `co-weekly-${i}`,
    title: "Haftalık Yönetim Raporu",
    scope: "company",
    type: "weekly",
    periodStart: `${10 - i} Şub 2026`,
    periodEnd: `${16 - i} Şub 2026`,
    healthScore: 82 + (i % 4),
    risk: i === 0 ? "medium" : i === 3 ? "high" : "low",
    kpiDelta: `+${(12.4 - i * 1.1).toFixed(1)}%`,
    kpiLabel: "Gelir",
    recipientsCount: 5,
    recipients: ["CEO", "CFO", "CMO", "COO", "CTO"],
    status: "immutable",
    generatedAt: `${16 - i} Şub 2026, 09:00`,
    confidence: 89 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Analytics"],
    hash: hash(i),
    sections: 11,
    topRisk: "Pazarlama CPC artışı marj baskısı oluşturabilir",
    topOpportunity: "E-ticaret dönüşüm oranı rekor seviyede",
    confidentiality: "executive",
    packageTier: "core",
    version: `1.${i}`,
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 2. Aylık Performans Raporu (4 instances)
  ...Array.from({ length: 4 }, (_, i): ReportRow => ({
    id: `co-monthly-${i}`,
    title: "Aylık Performans Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca", "Ara", "Kas"][i]} ${i < 2 ? "2026" : "2025"}`,
    periodEnd: `${[28, 31, 31, 30][i]} ${["Şub", "Oca", "Ara", "Kas"][i]} ${i < 2 ? "2026" : "2025"}`,
    healthScore: 85 + (i % 3),
    risk: i === 2 ? "high" : "medium",
    kpiDelta: `+${(8.2 - i * 0.9).toFixed(1)}%`,
    kpiLabel: "Net Kâr",
    recipientsCount: 8,
    recipients: ["CEO", "Board", "CFO", "CMO", "COO", "CTO", "CHRO", "CLO"],
    status: i === 0 ? "immutable" : "immutable",
    generatedAt: `1 ${["Mar", "Şub", "Oca", "Ara"][i]} ${i < 3 ? "2026" : "2025"}, 09:00`,
    confidence: 92 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Ads", "Shopify", "HubSpot"],
    hash: hash(100 + i),
    sections: 14,
    topRisk: "Kanal konsantrasyon riski artıyor",
    topOpportunity: "Kurumsal kanal büyüme potansiyeli %18",
    confidentiality: "executive",
    packageTier: "core",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 3. Çeyreklik Stratejik Değerlendirme (2 instances)
  ...Array.from({ length: 2 }, (_, i): ReportRow => ({
    id: `co-quarterly-${i}`,
    title: "Çeyreklik Stratejik Değerlendirme",
    scope: "company",
    type: "quarterly",
    periodStart: `1 ${i === 0 ? "Oca" : "Eki"} ${i === 0 ? "2026" : "2025"}`,
    periodEnd: `${i === 0 ? "31 Mar" : "31 Ara"} ${i === 0 ? "2026" : "2025"}`,
    healthScore: 86 + i * 2,
    risk: "medium",
    kpiDelta: `+${(18.4 - i * 3.2).toFixed(1)}%`,
    kpiLabel: "Konsolide Gelir",
    recipientsCount: 10,
    recipients: ["CEO", "Board", "Investors", "CFO", "CMO", "COO", "CTO", "CHRO", "CLO", "Advisory Board"],
    status: "immutable",
    generatedAt: `${i === 0 ? "1 Nis" : "5 Oca"} ${i === 0 ? "2026" : "2026"}, 09:00`,
    confidence: 93 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Ads", "Shopify", "HubSpot", "GitHub"],
    hash: hash(200 + i),
    sections: 18,
    topRisk: "Pazar konsantrasyonu ve tedarik zinciri fragilitesi",
    topOpportunity: "Yeni pazar segmenti penetrasyonu ₺24M ek gelir potansiyeli",
    confidentiality: "executive",
    packageTier: "enterprise",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 4. Yıllık Stratejik Plan & Öngörü Dosyası
  {
    id: "co-yearly-0",
    title: "Yıllık Stratejik Plan & Öngörü Dosyası",
    scope: "company",
    type: "yearly",
    periodStart: "1 Oca 2025",
    periodEnd: "31 Ara 2025",
    healthScore: 88,
    risk: "low",
    kpiDelta: "+24.1%",
    kpiLabel: "Gelir Büyümesi",
    recipientsCount: 12,
    recipients: ["CEO", "Board", "Investors", "Advisory Board", "CFO", "CMO", "COO", "CTO"],
    status: "immutable",
    generatedAt: "15 Oca 2026, 09:00",
    confidence: 94,
    sources: ["ERP", "CRM", "Meta Ads", "Google Ads", "Shopify", "HubSpot", "GitHub"],
    hash: hash(300),
    sections: 22,
    topRisk: "Sermaye verimliliği optimize edilmeli",
    topOpportunity: "5 yılda ₺1.2B gelir potansiyeli",
    confidentiality: "executive",
    packageTier: "enterprise",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  },

  // 5. Risk & Dayanıklılık Raporu
  ...Array.from({ length: 3 }, (_, i): ReportRow => ({
    id: `co-risk-${i}`,
    title: "Risk & Dayanıklılık Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca", "Ara"][i]} ${i < 2 ? "2026" : "2025"}`,
    periodEnd: `${[28, 31, 31][i]} ${["Şub", "Oca", "Ara"][i]} ${i < 2 ? "2026" : "2025"}`,
    healthScore: 74 + i * 3,
    risk: i === 0 ? "high" : "medium",
    kpiDelta: `${(-2.4 + i * 1.1).toFixed(1)}%`,
    kpiLabel: "Risk Skoru",
    recipientsCount: 6,
    recipients: ["CEO", "CFO", "COO", "CTO", "CLO", "Board"],
    status: "immutable",
    generatedAt: `5 ${["Mar", "Şub", "Oca"][i]} ${i < 2 ? "2026" : "2026"}, 09:00`,
    confidence: 90 - i,
    sources: ["ERP", "CRM", "Risk Engine", "Market Data"],
    hash: hash(400 + i),
    sections: 12,
    topRisk: "Kanal konsantrasyonu %58 — tek kanala bağımlılık riski",
    topOpportunity: "Tedarik zinciri çeşitlendirmesi ile COGS %2.5pp azaltılabilir",
    confidentiality: "executive",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 6. Finansal Sağlık & Runway Raporu
  ...Array.from({ length: 3 }, (_, i): ReportRow => ({
    id: `co-financial-${i}`,
    title: "Finansal Sağlık & Runway Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca", "Ara"][i]} ${i < 2 ? "2026" : "2025"}`,
    periodEnd: `${[28, 31, 31][i]} ${["Şub", "Oca", "Ara"][i]} ${i < 2 ? "2026" : "2025"}`,
    healthScore: 81 + i * 2,
    risk: i === 0 ? "medium" : "low",
    kpiDelta: `+${(3.2 + i * 0.8).toFixed(1)}%`,
    kpiLabel: "Nakit Pozisyonu",
    recipientsCount: 5,
    recipients: ["CEO", "CFO", "Board", "Investors", "COO"],
    status: "immutable",
    generatedAt: `3 ${["Mar", "Şub", "Oca"][i]} ${i < 2 ? "2026" : "2026"}, 09:00`,
    confidence: 93 - i,
    sources: ["ERP", "Banking APIs", "Financial Models"],
    hash: hash(500 + i),
    sections: 10,
    topRisk: "Nakit tamponu $1.87M ile planın %8 altında",
    topOpportunity: "Sermaye verimliliği optimizasyonu ile runway +4 ay uzatılabilir",
    confidentiality: "executive",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 7. Karar Etki Analizi Raporu
  ...Array.from({ length: 2 }, (_, i): ReportRow => ({
    id: `co-decision-${i}`,
    title: "Karar Etki Analizi Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca"][i]} 2026`,
    periodEnd: `${[28, 31][i]} ${["Şub", "Oca"][i]} 2026`,
    healthScore: 79 + i * 4,
    risk: "medium",
    kpiDelta: `+${(6.1 + i * 1.2).toFixed(1)}%`,
    kpiLabel: "Karar Başarı Oranı",
    recipientsCount: 6,
    recipients: ["CEO", "CFO", "CMO", "COO", "CTO", "Board"],
    status: "immutable",
    generatedAt: `2 ${["Mar", "Şub"][i]} 2026, 09:00`,
    confidence: 88 - i,
    sources: ["Decision Engine", "KPI Tracking", "OKR System"],
    hash: hash(600 + i),
    sections: 10,
    topRisk: "3 geciken karar tahmini ₺420K fırsat maliyeti oluşturdu",
    topOpportunity: "Otomatik karar tetikleme ile ortalama karar süresi %34 kısaltılabilir",
    confidentiality: "executive",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 8. Operasyonel Verimlilik Raporu
  ...Array.from({ length: 2 }, (_, i): ReportRow => ({
    id: `co-ops-${i}`,
    title: "Operasyonel Verimlilik Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca"][i]} 2026`,
    periodEnd: `${[28, 31][i]} ${["Şub", "Oca"][i]} 2026`,
    healthScore: 83 + i,
    risk: "low",
    kpiDelta: `+${(2.1 + i * 0.4).toFixed(1)}%`,
    kpiLabel: "Verimlilik Endeksi",
    recipientsCount: 5,
    recipients: ["CEO", "COO", "CTO", "CFO", "Directors"],
    status: "immutable",
    generatedAt: `3 ${["Mar", "Şub"][i]} 2026, 09:00`,
    confidence: 91 - i,
    sources: ["ERP", "WMS", "TMS", "HR System"],
    hash: hash(700 + i),
    sections: 10,
    topRisk: "Depo kapasitesi %88 — kritik eşiğe yaklaşıyor",
    topOpportunity: "Otomasyon ile FTE başına üretkenlik %22 artırılabilir",
    confidentiality: "internal",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 9. Büyüme & Kanal Performans Raporu
  ...Array.from({ length: 2 }, (_, i): ReportRow => ({
    id: `co-growth-${i}`,
    title: "Büyüme & Kanal Performans Raporu",
    scope: "company",
    type: "monthly",
    periodStart: `1 ${["Şub", "Oca"][i]} 2026`,
    periodEnd: `${[28, 31][i]} ${["Şub", "Oca"][i]} 2026`,
    healthScore: 80 + i * 3,
    risk: i === 0 ? "high" : "medium",
    kpiDelta: `+${(14.2 - i * 2.1).toFixed(1)}%`,
    kpiLabel: "Toplam Büyüme",
    recipientsCount: 5,
    recipients: ["CEO", "CMO", "VP Sales", "VP Marketplace", "CFO"],
    status: "immutable",
    generatedAt: `4 ${["Mar", "Şub"][i]} 2026, 09:00`,
    confidence: 87 - i,
    sources: ["CRM", "Shopify", "Meta Ads", "Google Ads", "Marketplace APIs"],
    hash: hash(800 + i),
    sections: 12,
    topRisk: "Kanal konsantrasyonu %58 — diversifikasyon acil",
    topOpportunity: "Organik kanal büyümesi %32 potansiyel",
    confidentiality: "internal",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  })),

  // 10. Kurumsal Sağlık Endeksi Raporu
  {
    id: "co-health-0",
    title: "Kurumsal Sağlık Endeksi Raporu",
    scope: "company",
    type: "monthly",
    periodStart: "1 Şub 2026",
    periodEnd: "28 Şub 2026",
    healthScore: 78,
    risk: "medium",
    kpiDelta: "+3pp",
    kpiLabel: "Sağlık Skoru",
    recipientsCount: 8,
    recipients: ["CEO", "CFO", "CMO", "COO", "CTO", "CHRO", "CLO", "Board"],
    status: "immutable",
    generatedAt: "1 Mar 2026, 09:00",
    confidence: 91,
    sources: ["All Systems", "HR", "Finance", "Operations"],
    hash: hash(900),
    sections: 14,
    topRisk: "İK bağlılık skoru düşüş trendinde",
    topOpportunity: "Teknoloji departmanı sağlık endeksi sektör ortalaması üstünde",
    confidentiality: "executive",
    packageTier: "growth",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  },

  // 11. Governance & Onay Mekanizması Raporu
  {
    id: "co-governance-0",
    title: "Governance & Onay Mekanizması Raporu",
    scope: "company",
    type: "quarterly",
    periodStart: "1 Oca 2026",
    periodEnd: "31 Mar 2026",
    healthScore: 91,
    risk: "low",
    kpiDelta: "+6pp",
    kpiLabel: "Uyum Skoru",
    recipientsCount: 6,
    recipients: ["CEO", "CLO", "CFO", "Board", "Audit Committee", "CHRO"],
    status: "immutable",
    generatedAt: "3 Nis 2026, 09:00",
    confidence: 95,
    sources: ["Audit Vault", "Decision Engine", "Approval System", "Policy Engine"],
    hash: hash(950),
    sections: 16,
    topRisk: "2 onay zincirinde SLA aşımı tespit edildi",
    topOpportunity: "Otomatik onay akışı ile ortalama süre %41 kısaltılabilir",
    confidentiality: "executive",
    packageTier: "enterprise",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  },
];

// ── B) DEPARTMENT REPORTS ──

const departments = [
  { name: "Yönetim", owner: "CEO" },
  { name: "Finans", owner: "CFO" },
  { name: "Pazarlama", owner: "CMO" },
  { name: "Operasyon", owner: "COO" },
  { name: "Teknoloji", owner: "CTO" },
  { name: "İnsan Kaynakları", owner: "CHRO" },
  { name: "Hukuk", owner: "CLO" },
  { name: "Kreatif", owner: "CCO" },
  { name: "Pazaryeri", owner: "VP Marketplace" },
  { name: "Satış", owner: "VP Sales" },
];

const deptKpis: Record<string, { label: string; delta: string }> = {
  Yönetim: { label: "Sağlık Skoru", delta: "+3pp" },
  Finans: { label: "Katkı Marjı", delta: "+1.2pp" },
  Pazarlama: { label: "ROAS", delta: "+0.8x" },
  Operasyon: { label: "Verimlilik", delta: "+2.1%" },
  Teknoloji: { label: "Uptime", delta: "+0.3%" },
  "İnsan Kaynakları": { label: "Bağlılık", delta: "+4pp" },
  Hukuk: { label: "Uyum Skoru", delta: "+2pp" },
  Kreatif: { label: "Üretim Hızı", delta: "+18%" },
  Pazaryeri: { label: "GMV", delta: "+11.4%" },
  Satış: { label: "Pipeline", delta: "+8.3%" },
};

const departmentReports: ReportRow[] = [];

// Monthly per department = 10
departments.forEach((dept, di) => {
  const kpi = deptKpis[dept.name] ?? { label: "KPI", delta: "+1%" };
  departmentReports.push({
    id: `dept-${di}-m-0`,
    title: `${dept.name} Aylık Performans Raporu`,
    scope: "department",
    type: "monthly",
    department: dept.name,
    owner: dept.owner,
    periodStart: "1 Şub 2026",
    periodEnd: "28 Şub 2026",
    healthScore: 72 + ((di * 3) % 20),
    risk: di % 5 === 0 ? "high" : di % 3 === 0 ? "medium" : "low",
    kpiDelta: kpi.delta,
    kpiLabel: kpi.label,
    recipientsCount: 3,
    recipients: [dept.owner, "CEO", "COO"],
    status: "immutable",
    generatedAt: "1 Mar 2026, 09:00",
    confidence: 85 + (di % 6),
    sources: ["ERP", "CRM", "Department Systems"],
    hash: hash(1000 + di),
    sections: 10,
    topRisk: `${dept.name} departmanında operasyonel yoğunluk artıyor`,
    topOpportunity: `${dept.name} hedef üstü performans trendi`,
    confidentiality: "internal",
    packageTier: "core",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  });
});

// Quarterly per department (first 6) = 6
departments.slice(0, 6).forEach((dept, di) => {
  const kpi = deptKpis[dept.name] ?? { label: "KPI", delta: "+1%" };
  departmentReports.push({
    id: `dept-${di}-q-0`,
    title: `${dept.name} Çeyreklik Stratejik Raporu`,
    scope: "department",
    type: "quarterly",
    department: dept.name,
    owner: dept.owner,
    periodStart: "1 Oca 2026",
    periodEnd: "31 Mar 2026",
    healthScore: 78 + (di * 2),
    risk: di % 4 === 0 ? "high" : "medium",
    kpiDelta: kpi.delta,
    kpiLabel: kpi.label,
    recipientsCount: 5,
    recipients: [dept.owner, "CEO", "CFO", "COO", "Board"],
    status: "immutable",
    generatedAt: "3 Nis 2026, 09:00",
    confidence: 91 - di,
    sources: ["ERP", "CRM", "HubSpot", "Department Systems"],
    hash: hash(1100 + di),
    sections: 14,
    topRisk: `${dept.name} bütçe sapma riski mevcut`,
    topOpportunity: `${dept.name} verimlilik artış potansiyeli`,
    confidentiality: "internal",
    packageTier: "enterprise",
    version: "1.0",
    aiModelVersion: "Metrion AI v3.2",
  });
});

// ── C) POSITION REPORTS (Enterprise) ──

const positionReports: ReportRow[] = [
  { id: "pos-ceo-0", title: "CEO Strategic Performance Report", positionTitle: "CEO", scope: "position", type: "quarterly", periodStart: "1 Oca 2026", periodEnd: "31 Mar 2026", healthScore: 92, risk: "low", kpiDelta: "+18.4%", kpiLabel: "Stratejik Skor", recipientsCount: 3, recipients: ["CEO", "Board", "Advisory"], status: "immutable", generatedAt: "5 Nis 2026, 09:00", confidence: 94, sources: ["Decision Engine", "KPI System", "OKR"], hash: hash(2000), sections: 16, topRisk: "Karar gecikme oranı %12 artış gösterdi", topOpportunity: "AI uyum skoru %91 ile sektör üstü", confidentiality: "executive", packageTier: "enterprise", version: "1.0", aiModelVersion: "Metrion AI v3.2" },
  { id: "pos-cfo-0", title: "CFO Financial Governance Report", positionTitle: "CFO", scope: "position", type: "quarterly", periodStart: "1 Oca 2026", periodEnd: "31 Mar 2026", healthScore: 88, risk: "medium", kpiDelta: "+1.3pp", kpiLabel: "Kâr Marjı", recipientsCount: 3, recipients: ["CFO", "CEO", "Board"], status: "immutable", generatedAt: "5 Nis 2026, 09:00", confidence: 93, sources: ["ERP", "Banking", "Financial Models"], hash: hash(2001), sections: 14, topRisk: "AR aging 32 güne ulaştı", topOpportunity: "Sermaye verimliliği %8 artırılabilir", confidentiality: "executive", packageTier: "enterprise", version: "1.0", aiModelVersion: "Metrion AI v3.2" },
  { id: "pos-cto-0", title: "CTO Infrastructure & Scalability Report", positionTitle: "CTO", scope: "position", type: "quarterly", periodStart: "1 Oca 2026", periodEnd: "31 Mar 2026", healthScore: 91, risk: "low", kpiDelta: "+0.3%", kpiLabel: "Uptime", recipientsCount: 3, recipients: ["CTO", "CEO", "COO"], status: "immutable", generatedAt: "5 Nis 2026, 09:00", confidence: 92, sources: ["GitHub", "AWS", "Datadog", "PagerDuty"], hash: hash(2002), sections: 14, topRisk: "Teknik borç endeksi %18 artış gösterdi", topOpportunity: "Otomasyon ile deployment süresi %45 kısaltılabilir", confidentiality: "executive", packageTier: "enterprise", version: "1.0", aiModelVersion: "Metrion AI v3.2" },
  { id: "pos-cmo-0", title: "CMO Growth Intelligence Report", positionTitle: "CMO", scope: "position", type: "quarterly", periodStart: "1 Oca 2026", periodEnd: "31 Mar 2026", healthScore: 79, risk: "high", kpiDelta: "+0.8x", kpiLabel: "ROAS", recipientsCount: 3, recipients: ["CMO", "CEO", "CFO"], status: "immutable", generatedAt: "5 Nis 2026, 09:00", confidence: 87, sources: ["Meta Ads", "Google Ads", "CRM", "Analytics"], hash: hash(2003), sections: 14, topRisk: "CPC artışı %12 — marj baskısı oluşturuyor", topOpportunity: "Organik kanal büyüme potansiyeli %32", confidentiality: "executive", packageTier: "enterprise", version: "1.0", aiModelVersion: "Metrion AI v3.2" },
  { id: "pos-coo-0", title: "COO Operational Efficiency Report", positionTitle: "COO", scope: "position", type: "quarterly", periodStart: "1 Oca 2026", periodEnd: "31 Mar 2026", healthScore: 85, risk: "medium", kpiDelta: "+2.1%", kpiLabel: "Verimlilik", recipientsCount: 3, recipients: ["COO", "CEO", "CFO"], status: "immutable", generatedAt: "5 Nis 2026, 09:00", confidence: 90, sources: ["ERP", "WMS", "TMS", "HR"], hash: hash(2004), sections: 12, topRisk: "Depo kapasitesi %88 — genişleme kararı gerekli", topOpportunity: "FTE başına üretkenlik %22 artırılabilir", confidentiality: "executive", packageTier: "enterprise", version: "1.0", aiModelVersion: "Metrion AI v3.2" },
];

export const allReports: ReportRow[] = [...companyReports, ...departmentReports, ...positionReports];
export const companyReportsList: ReportRow[] = companyReports;
export const departmentReportsList: ReportRow[] = departmentReports;
export const positionReportsList: ReportRow[] = positionReports;

export function getReportHubById(id: string): ReportRow | undefined {
  return allReports.find(r => r.id === id);
}
