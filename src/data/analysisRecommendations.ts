import { TrendingUp, Brain, Shield, DollarSign, BarChart3, Users, Target, Layers, Activity, PieChart, Briefcase, LineChart, Gauge, GitBranch, Lightbulb, Shuffle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AnalysisRecommendation {
  id: string;
  title: string;
  description: string;
  category: "Finans" | "Büyüme" | "Operasyon" | "Risk" | "Strateji";
  icon: LucideIcon;
  usageScore: number;
  weeklyPriorityGroup: 1 | 2 | 3 | 4;
  isCore: boolean;
  clusterId: string;
}

export const recommendations: AnalysisRecommendation[] = [
  // Core (isCore: true)
  { id: "finans-derin-analiz", title: "Finans Derin Analiz", description: "Gelir yapısı, maliyet dağılımı ve nakit akış projeksiyonlarını detaylı modelle.", category: "Finans", icon: TrendingUp, usageScore: 94, weeklyPriorityGroup: 1, isCore: true, clusterId: "finans" },
  { id: "performans-simulasyonu", title: "Performans Simülasyonu", description: "Kanal bazlı büyüme senaryolarını modelleyerek optimal bütçe dağılımını hesapla.", category: "Büyüme", icon: Brain, usageScore: 91, weeklyPriorityGroup: 1, isCore: true, clusterId: "buyume" },
  { id: "operasyonel-risk-taramasi", title: "Operasyonel Risk Taraması", description: "Tedarik zinciri, stok ve süreç darboğazlarını proaktif olarak tespit et.", category: "Operasyon", icon: Shield, usageScore: 89, weeklyPriorityGroup: 1, isCore: true, clusterId: "operasyon" },
  { id: "karlilik-analizi", title: "Kârlılık Analizi", description: "Ürün ve kanal bazlı kârlılık oranlarını karşılaştırmalı olarak değerlendir.", category: "Finans", icon: DollarSign, usageScore: 87, weeklyPriorityGroup: 1, isCore: true, clusterId: "finans" },

  // Weekly Group 1
  { id: "nakit-akis-stres-testi", title: "Nakit Akışı Stres Testi", description: "Farklı senaryolarda nakit pozisyonu dayanıklılığını simüle et.", category: "Finans", icon: Activity, usageScore: 82, weeklyPriorityGroup: 1, isCore: false, clusterId: "finans" },
  { id: "gelir-konsantrasyon", title: "Gelir Konsantrasyon Riski", description: "Müşteri ve kanal bazlı gelir yoğunlaşma risklerini haritalandır.", category: "Risk", icon: PieChart, usageScore: 78, weeklyPriorityGroup: 1, isCore: false, clusterId: "finans" },
  { id: "tedarik-zinciri-analiz", title: "Tedarik Zinciri Analizi", description: "Tedarikçi performansı, teslim süreleri ve maliyet verimliliğini analiz et.", category: "Operasyon", icon: GitBranch, usageScore: 75, weeklyPriorityGroup: 1, isCore: false, clusterId: "operasyon" },
  { id: "pazar-penetrasyon", title: "Pazar Penetrasyon Analizi", description: "Hedef pazarlardaki büyüme fırsatlarını ve rekabet pozisyonunu değerlendir.", category: "Büyüme", icon: Target, usageScore: 73, weeklyPriorityGroup: 1, isCore: false, clusterId: "buyume" },

  // Weekly Group 2
  { id: "musteri-yasam-boyu", title: "Müşteri Yaşam Boyu Değeri", description: "Segment bazlı müşteri değerini ve retention metriklerini derinlemesine analiz et.", category: "Büyüme", icon: Users, usageScore: 80, weeklyPriorityGroup: 2, isCore: false, clusterId: "buyume" },
  { id: "marj-optimizasyonu", title: "Marj Optimizasyonu", description: "Ürün grubu bazında marj iyileştirme fırsatlarını tespit et.", category: "Finans", icon: BarChart3, usageScore: 77, weeklyPriorityGroup: 2, isCore: false, clusterId: "finans" },
  { id: "organizasyonel-uyum", title: "Organizasyonel Uyum Skoru", description: "Departmanlar arası hedef uyumu ve iş birliği verimliliğini ölç.", category: "Strateji", icon: Layers, usageScore: 72, weeklyPriorityGroup: 2, isCore: false, clusterId: "operasyon" },
  { id: "rekabet-istihbarati", title: "Rekabet İstihbaratı", description: "Rakip hareketlerini, fiyatlama stratejilerini ve pazar trendlerini izle.", category: "Strateji", icon: Briefcase, usageScore: 70, weeklyPriorityGroup: 2, isCore: false, clusterId: "buyume" },

  // Weekly Group 3
  { id: "sermaye-verimliligi", title: "Sermaye Verimliliği", description: "Yatırım getirisi ve sermaye kullanım etkinliğini çok boyutlu analiz et.", category: "Finans", icon: LineChart, usageScore: 76, weeklyPriorityGroup: 3, isCore: false, clusterId: "finans" },
  { id: "verimlilik-endeksi", title: "Operasyonel Verimlilik", description: "Süreç darboğazları ve kaynak kullanım oranlarını optimize et.", category: "Operasyon", icon: Gauge, usageScore: 74, weeklyPriorityGroup: 3, isCore: false, clusterId: "operasyon" },
  { id: "inovasyon-pipeline", title: "İnovasyon Pipeline Analizi", description: "Yeni ürün ve hizmet geliştirme süreçlerinin ROI potansiyelini değerlendir.", category: "Strateji", icon: Lightbulb, usageScore: 68, weeklyPriorityGroup: 3, isCore: false, clusterId: "buyume" },
  { id: "senaryo-karsilastirma", title: "Senaryo Karşılaştırması", description: "Alternatif iş stratejilerini yan yana modelleyerek en optimal yolu belirle.", category: "Strateji", icon: Shuffle, usageScore: 65, weeklyPriorityGroup: 3, isCore: false, clusterId: "finans" },
];

export function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.floor(diff / oneWeek) + 1;
}

export function getDisplayedRecommendations(): AnalysisRecommendation[] {
  const weekNum = getCurrentWeekNumber();
  const currentGroup = ((weekNum % 4) + 1) as 1 | 2 | 3 | 4;

  const core = recommendations.filter(r => r.isCore).sort((a, b) => b.usageScore - a.usageScore);
  const weekly = recommendations.filter(r => !r.isCore && r.weeklyPriorityGroup === currentGroup).sort((a, b) => b.usageScore - a.usageScore);

  // Core fills first, weekly completes to 4
  const result: AnalysisRecommendation[] = [...core.slice(0, 4)];
  const remaining = 4 - result.length;
  if (remaining > 0) {
    result.push(...weekly.slice(0, remaining));
  }
  return result;
}

export const categoryOptions = ["Tümü", "Finans", "Büyüme", "Operasyon", "Risk", "Strateji"] as const;
