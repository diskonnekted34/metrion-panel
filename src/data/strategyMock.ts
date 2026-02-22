// Strategy Lab — Mock Data

export interface StrategyScenario {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface MiniKPI {
  label: string;
  value: number;
  delta: number;
  sparkline: number[];
}

export interface StrategicAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  chips: string[];
}

export interface DecisionDraft {
  id: string;
  title: string;
  tags: string[];
  confidence: number;
  lastEdited: string;
  owner: string;
  status: "draft" | "review" | "ready";
}

export interface ComparisonKPI {
  id: string;
  name: string;
  scenarioA: number;
  scenarioB: number;
  unit: string;
  confidence: number;
  trend: number[];
  definition: string;
}

export interface SimulationInput {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface SimulationOutput {
  label: string;
  value: number;
  delta: number;
  unit: string;
  confidence: number;
  sparkline: number[];
}

export const scenarios: StrategyScenario[] = [
  { id: "current", name: "Mevcut Plan", isDefault: true },
  { id: "aggressive", name: "Agresif Büyüme" },
  { id: "conservative", name: "Tutucu Senaryo" },
  { id: "q3-2024", name: "Q3 2024 Planı" },
];

export const alignmentScore = 82;
export const alignmentTrend = "+2.1";

export const miniKPIs: MiniKPI[] = [
  { label: "Revenue Alignment", value: 87, delta: 1.3, sparkline: [72, 75, 78, 80, 83, 85, 87] },
  { label: "Cost Discipline", value: 74, delta: -0.8, sparkline: [80, 78, 76, 75, 74, 74, 74] },
  { label: "Execution Stability", value: 91, delta: 2.5, sparkline: [84, 85, 87, 88, 89, 90, 91] },
  { label: "Market Expansion", value: 68, delta: 3.1, sparkline: [55, 58, 60, 62, 64, 66, 68] },
];

export const pressurePoints = [
  { id: "growth", label: "Büyüme Baskısı", x: 0.7, y: 0.3, metrics: { growth: 72, risk: 35 } },
  { id: "efficiency", label: "Verimlilik", x: 0.3, y: 0.4, metrics: { growth: 45, risk: 28 } },
  { id: "innovation", label: "İnovasyon", x: 0.6, y: 0.75, metrics: { growth: 65, risk: 55 } },
  { id: "cost", label: "Maliyet Baskısı", x: 0.25, y: 0.65, metrics: { growth: 30, risk: 62 } },
];

export const strategicAlerts: StrategicAlert[] = [
  { id: "1", severity: "critical", title: "Runway 9.4 → 7.8 ay riski", chips: ["Nakit", "Burn Rate"] },
  { id: "2", severity: "warning", title: "CAC artış eğilimi +%12", chips: ["Pazarlama", "LTV"] },
  { id: "3", severity: "info", title: "COGS baskısı marjı düşürüyor", chips: ["Marj", "COGS"] },
];

export const decisionDrafts: DecisionDraft[] = [
  { id: "d1", title: "Q2 Pazarlama bütçesi artışı", tags: ["Revenue", "Cost"], confidence: 72, lastEdited: "12 dk önce", owner: "Ahmet Yılmaz", status: "draft" },
  { id: "d2", title: "Mühendislik takım genişletme", tags: ["Hiring", "Risk"], confidence: 85, lastEdited: "2 saat önce", owner: "Elif Demir", status: "review" },
  { id: "d3", title: "Fiyat optimizasyonu pilot", tags: ["Revenue", "Pricing"], confidence: 64, lastEdited: "1 gün önce", owner: "Mehmet Kaya", status: "draft" },
];

export const comparisonKPIs: ComparisonKPI[] = [
  { id: "revenue", name: "Revenue / ARR", scenarioA: 24500000, scenarioB: 22100000, unit: "₺", confidence: 88, trend: [18, 19.5, 21, 22, 23, 24.5], definition: "Yıllık tekrarlayan gelir toplamı." },
  { id: "net-profit", name: "Net Profit", scenarioA: 3200000, scenarioB: 2800000, unit: "₺", confidence: 76, trend: [2.1, 2.4, 2.6, 2.9, 3.0, 3.2], definition: "Tüm giderler düşüldükten sonra kalan kâr." },
  { id: "margin", name: "Contribution Margin", scenarioA: 42, scenarioB: 38, unit: "%", confidence: 82, trend: [35, 36, 38, 39, 40, 42], definition: "Gelirden değişken maliyetler çıktıktan sonraki oran." },
  { id: "cac", name: "CAC", scenarioA: 1250, scenarioB: 1480, unit: "₺", confidence: 71, trend: [1100, 1150, 1200, 1220, 1240, 1250], definition: "Müşteri edinme maliyeti." },
  { id: "ltv", name: "LTV", scenarioA: 18500, scenarioB: 16200, unit: "₺", confidence: 79, trend: [14, 15.2, 16, 17, 17.8, 18.5], definition: "Müşteri yaşam boyu değeri." },
  { id: "runway", name: "Runway", scenarioA: 9.4, scenarioB: 7.8, unit: "ay", confidence: 85, trend: [12, 11, 10.5, 10, 9.8, 9.4], definition: "Mevcut nakit ile faaliyete devam edilebilecek süre." },
  { id: "burn", name: "Burn Rate", scenarioA: 2100000, scenarioB: 2400000, unit: "₺/ay", confidence: 90, trend: [1.8, 1.9, 1.95, 2.0, 2.05, 2.1], definition: "Aylık nakit yakma hızı." },
  { id: "churn", name: "Churn", scenarioA: 3.2, scenarioB: 4.1, unit: "%", confidence: 74, trend: [4.5, 4.2, 3.9, 3.6, 3.4, 3.2], definition: "Aylık müşteri kaybı oranı." },
  { id: "conversion", name: "Conversion Rate", scenarioA: 12.8, scenarioB: 11.2, unit: "%", confidence: 80, trend: [9, 9.8, 10.5, 11, 12, 12.8], definition: "Dönüşüm oranı." },
];

export const simulationInputs: SimulationInput[] = [
  { id: "marketing", label: "Pazarlama Bütçesi", min: 0, max: 5000000, step: 100000, defaultValue: 2000000, unit: "₺" },
  { id: "hiring", label: "İşe Alım Planı", min: 0, max: 50, step: 1, defaultValue: 12, unit: "kişi" },
  { id: "pricing", label: "Fiyat Değişimi", min: -30, max: 30, step: 1, defaultValue: 0, unit: "%" },
  { id: "cogs", label: "COGS Optimizasyonu", min: -20, max: 20, step: 1, defaultValue: 0, unit: "%" },
  { id: "infra", label: "Altyapı Maliyeti", min: 0, max: 3000000, step: 50000, defaultValue: 800000, unit: "₺" },
  { id: "rnd", label: "Ar-Ge Harcaması", min: 0, max: 4000000, step: 100000, defaultValue: 1500000, unit: "₺" },
];

export const baseOutputs: SimulationOutput[] = [
  { label: "Projected ARR", value: 24500000, delta: 0, unit: "₺", confidence: 82, sparkline: [20, 21, 22, 23, 24, 24.5] },
  { label: "Projected Margin", value: 42, delta: 0, unit: "%", confidence: 78, sparkline: [36, 37, 38, 39, 40, 42] },
  { label: "Projected Burn", value: 2100000, delta: 0, unit: "₺/ay", confidence: 88, sparkline: [1.8, 1.9, 2.0, 2.0, 2.05, 2.1] },
  { label: "Projected Runway", value: 9.4, delta: 0, unit: "ay", confidence: 85, sparkline: [12, 11.5, 11, 10.5, 10, 9.4] },
  { label: "Risk Index", value: 34, delta: 0, unit: "/100", confidence: 76, sparkline: [28, 29, 30, 31, 32, 34] },
];

export const projectionData = {
  growth: Array.from({ length: 12 }, (_, i) => ({
    month: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][i],
    scenarioA: 18000000 + i * 600000 + Math.random() * 200000,
    scenarioB: 17000000 + i * 450000 + Math.random() * 200000,
  })),
  cashRunway: Array.from({ length: 12 }, (_, i) => ({
    month: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][i],
    scenarioA: 12 - i * 0.22 + Math.random() * 0.3,
    scenarioB: 12 - i * 0.35 + Math.random() * 0.3,
  })),
  riskVolatility: Array.from({ length: 12 }, (_, i) => ({
    month: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][i],
    scenarioA: 25 + i * 0.8 + Math.random() * 5,
    scenarioB: 28 + i * 1.2 + Math.random() * 5,
  })),
};

export const benchmarks = {
  low: { revenue: 15000000, margin: 28, cac: 2200, churn: 6.5 },
  median: { revenue: 22000000, margin: 36, cac: 1400, churn: 4.0 },
  topQuartile: { revenue: 32000000, margin: 48, cac: 900, churn: 2.1 },
};

export const tradeoffs = [
  { cause: "Artan büyüme", effect: "azalan runway", direction: "negative" as const },
  { cause: "Marj iyileşmesi", effect: "düşük risk", direction: "positive" as const },
  { cause: "İşe alım artışı", effect: "artan burn rate", direction: "negative" as const },
];
