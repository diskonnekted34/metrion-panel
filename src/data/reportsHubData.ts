// Reports Hub — Mock Data
// Immutable report records for company and department views

export type ReportScope = "company" | "department";
export type ReportType = "weekly" | "monthly" | "yearly";
export type ReportStatus = "sent" | "generated" | "archived";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type TimeFilter = "7d" | "30d" | "90d" | "1y" | "custom";
export type SortMode = "newest" | "oldest" | "highestImpact" | "highestRisk";

export interface ReportRow {
  id: string;
  title: string;
  scope: ReportScope;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  department?: string;
  owner?: string;
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
}

// ── Helper to generate hash ──
const hash = (i: number) => `0x${(0xA3F1B2 + i * 0x1234).toString(16).slice(0, 8)}`;

// ── Company Reports (12+) ──
const companyReports: ReportRow[] = [
  // Weekly
  ...Array.from({ length: 6 }, (_, i): ReportRow => ({
    id: `co-w-${i}`,
    title: `Haftalık Yönetici Raporu`,
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
    status: i < 2 ? "sent" : "archived",
    generatedAt: `${16 - i} Şub 2026, 09:00`,
    confidence: 89 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Analytics"],
    hash: hash(i),
    sections: 11,
    topRisk: "Pazarlama CPC artışı marj baskısı oluşturabilir",
    topOpportunity: "E-ticaret dönüşüm oranı rekor seviyede",
  })),
  // Monthly
  ...Array.from({ length: 4 }, (_, i): ReportRow => ({
    id: `co-m-${i}`,
    title: `Aylık Stratejik Performans Dosyası`,
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
    status: i === 0 ? "generated" : "sent",
    generatedAt: `1 ${["Mar", "Şub", "Oca", "Ara"][i]} ${i < 3 ? "2026" : "2025"}, 09:00`,
    confidence: 92 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Ads", "Shopify", "HubSpot"],
    hash: hash(100 + i),
    sections: 14,
    topRisk: "Kanal konsantrasyon riski artıyor",
    topOpportunity: "Kurumsal kanal büyüme potansiyeli %18",
  })),
  // Yearly
  ...Array.from({ length: 2 }, (_, i): ReportRow => ({
    id: `co-y-${i}`,
    title: `Yıllık Stratejik Plan & Öngörü Dosyası`,
    scope: "company",
    type: "yearly",
    periodStart: `1 Oca ${2025 - i}`,
    periodEnd: `31 Ara ${2025 - i}`,
    healthScore: 88 + i,
    risk: "low",
    kpiDelta: `+${(24.1 - i * 3.2).toFixed(1)}%`,
    kpiLabel: "Gelir Büyümesi",
    recipientsCount: 12,
    recipients: ["CEO", "Board", "Investors", "Advisory Board", "CFO", "CMO", "COO", "CTO"],
    status: "archived",
    generatedAt: `15 Oca ${2026 - i}, 09:00`,
    confidence: 94 - i,
    sources: ["ERP", "CRM", "Meta Ads", "Google Ads", "Shopify", "HubSpot", "GitHub"],
    hash: hash(200 + i),
    sections: 18,
    topRisk: "Sermaye verimliliği optimize edilmeli",
    topOpportunity: "5 yılda ₺1.2B gelir potansiyeli",
  })),
];

// ── Department Reports (30+) ──
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
  { name: "Müşteri Başarısı", owner: "VP CS" },
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
  "Müşteri Başarısı": { label: "NPS", delta: "+6pt" },
};

const departmentReports: ReportRow[] = [];

// 3 weekly per department = 30
departments.forEach((dept, di) => {
  for (let wi = 0; wi < 3; wi++) {
    const kpi = deptKpis[dept.name] ?? { label: "KPI", delta: "+1%" };
    departmentReports.push({
      id: `dept-${di}-w-${wi}`,
      title: `${dept.name} Haftalık Raporu`,
      scope: "department",
      type: "weekly",
      department: dept.name,
      owner: dept.owner,
      periodStart: `${3 + wi * 7} Şub 2026`,
      periodEnd: `${9 + wi * 7} Şub 2026`,
      healthScore: 72 + ((di * 3 + wi * 2) % 20),
      risk: (di + wi) % 5 === 0 ? "high" : (di + wi) % 3 === 0 ? "medium" : "low",
      kpiDelta: kpi.delta,
      kpiLabel: kpi.label,
      recipientsCount: 3,
      recipients: [dept.owner, "CEO", "COO"],
      status: wi === 0 ? "sent" : "archived",
      generatedAt: `${10 + wi * 7} Şub 2026, 09:00`,
      confidence: 85 + (di % 6),
      sources: ["ERP", "CRM"],
      hash: hash(300 + di * 10 + wi),
      sections: 8,
      topRisk: `${dept.name} departmanında operasyonel yoğunluk artıyor`,
      topOpportunity: `${dept.name} hedef üstü performans trendi`,
    });
  }
});

// 1 monthly per department (first 6) = 6
departments.slice(0, 6).forEach((dept, di) => {
  const kpi = deptKpis[dept.name] ?? { label: "KPI", delta: "+1%" };
  departmentReports.push({
    id: `dept-${di}-m-0`,
    title: `${dept.name} Aylık Performans Dosyası`,
    scope: "department",
    type: "monthly",
    department: dept.name,
    owner: dept.owner,
    periodStart: "1 Oca 2026",
    periodEnd: "31 Oca 2026",
    healthScore: 78 + (di * 2),
    risk: di % 4 === 0 ? "high" : "medium",
    kpiDelta: kpi.delta,
    kpiLabel: kpi.label,
    recipientsCount: 5,
    recipients: [dept.owner, "CEO", "CFO", "COO", "Board"],
    status: "sent",
    generatedAt: `1 Şub 2026, 09:00`,
    confidence: 91 - di,
    sources: ["ERP", "CRM", "HubSpot"],
    hash: hash(500 + di),
    sections: 12,
    topRisk: `${dept.name} bütçe sapma riski mevcut`,
    topOpportunity: `${dept.name} verimlilik artış potansiyeli`,
  });
});

export const allReports: ReportRow[] = [...companyReports, ...departmentReports];
export const companyReportsList: ReportRow[] = companyReports;
export const departmentReportsList: ReportRow[] = departmentReports;

export function getReportHubById(id: string): ReportRow | undefined {
  return allReports.find(r => r.id === id);
}
