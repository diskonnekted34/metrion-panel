import { DepartmentId } from "@/contexts/RBACContext";
import type { LucideIcon } from "lucide-react";
import { Brain, TrendingUp, Shield, Target, Activity, Zap, BarChart3, Users, DollarSign, Layers, FileText, Database, Package, ShoppingCart, Palette, AlertTriangle } from "lucide-react";

export type ModuleStatus = "enabled" | "available" | "coming_soon";
export type ModuleFilter = "Tümü" | "Aktif" | "Mevcut" | "Yakında";
export type RoadmapQuarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface DepartmentModule {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  requiredSources: string[];
  icon: LucideIcon;
  quarter?: RoadmapQuarter;
}

const baseModules: Record<DepartmentId, DepartmentModule[]> = {
  executive: [
    { id: "em-1", title: "Stratejik Karar Motoru", description: "AI destekli stratejik karar önerileri ve simülasyonları.", status: "enabled", requiredSources: ["ERP", "CRM"], icon: Brain },
    { id: "em-2", title: "Yönetici Brifing Otoması", description: "Otomatik haftalık yönetici brifing dokümanları.", status: "enabled", requiredSources: ["Tüm Sistemler"], icon: FileText },
    { id: "em-3", title: "Risk Radar", description: "Şirket geneli gerçek zamanlı risk izleme ve erken uyarı.", status: "enabled", requiredSources: ["ERP", "Finans"], icon: AlertTriangle },
    { id: "em-4", title: "OKR Takip Motoru", description: "Hedef ilerleme ve performans takibi.", status: "available", requiredSources: ["Proje Yönetimi"], icon: Target },
    { id: "em-5", title: "Board Raporlama", description: "Yönetim kurulu için otomatik rapor paketi.", status: "available", requiredSources: ["Finans", "HR"], icon: BarChart3 },
    { id: "em-6", title: "Senaryo Simülatörü", description: "What-if senaryoları ile stratejik planlama.", status: "available", requiredSources: ["ERP", "Finans"], icon: Activity },
    { id: "em-7", title: "Rekabet İstihbaratı", description: "Rakip hareketleri ve pazar dinamikleri izleme.", status: "coming_soon", requiredSources: ["Web Data"], icon: Shield, quarter: "Q2" },
    { id: "em-8", title: "M&A Değerlendirme", description: "Birleşme ve satın alma fırsat değerlendirmesi.", status: "coming_soon", requiredSources: ["Finans", "Pazar"], icon: TrendingUp, quarter: "Q4" },
  ],
  finance: [
    { id: "fm-1", title: "Gerçek Zamanlı P&L", description: "Anlık kâr-zarar hesaplama ve izleme.", status: "enabled", requiredSources: ["ERP", "Muhasebe"], icon: DollarSign },
    { id: "fm-2", title: "Nakit Akış Tahmin Motoru", description: "AI destekli nakit akış projeksiyonları.", status: "enabled", requiredSources: ["Banka", "ERP"], icon: TrendingUp },
    { id: "fm-3", title: "Bütçe Kontrol Paneli", description: "Departman bazlı bütçe takibi ve uyarı.", status: "enabled", requiredSources: ["ERP"], icon: Target },
    { id: "fm-4", title: "Alacak Risk Motoru", description: "Müşteri bazlı alacak riski tahminleme.", status: "available", requiredSources: ["CRM", "Muhasebe"], icon: AlertTriangle },
    { id: "fm-5", title: "Maliyet Optimizatör", description: "AI destekli maliyet azaltma önerileri.", status: "available", requiredSources: ["ERP"], icon: Zap },
    { id: "fm-6", title: "Vergi Optimizasyonu", description: "Yasal çerçevede vergi planlaması.", status: "available", requiredSources: ["Muhasebe"], icon: Shield },
    { id: "fm-7", title: "Konsolidasyon Motoru", description: "Çoklu şirket finansal konsolidasyonu.", status: "coming_soon", requiredSources: ["Muhasebe"], icon: Layers, quarter: "Q3" },
    { id: "fm-8", title: "Treasury Yönetimi", description: "Hazine ve likidite yönetim modülü.", status: "coming_soon", requiredSources: ["Banka"], icon: Database, quarter: "Q4" },
  ],
  marketing: [
    { id: "mm-1", title: "Kampanya Optimizatör", description: "AI destekli bütçe dağılımı ve kanal optimizasyonu.", status: "enabled", requiredSources: ["Google Ads", "Meta"], icon: Target },
    { id: "mm-2", title: "Müşteri Segmentasyon Motoru", description: "Gelişmiş müşteri segmentasyonu ve hedefleme.", status: "enabled", requiredSources: ["CRM", "Analytics"], icon: Users },
    { id: "mm-3", title: "İçerik Performans Analizcisi", description: "İçerik bazlı ROI ve etkileşim analizi.", status: "enabled", requiredSources: ["CMS", "Analytics"], icon: BarChart3 },
    { id: "mm-4", title: "Attribution Motoru", description: "Çoklu dokunma noktası atıf modelleme.", status: "available", requiredSources: ["Analytics", "CRM"], icon: Layers },
    { id: "mm-5", title: "Predictive Lead Scoring", description: "AI destekli potansiyel müşteri puanlama.", status: "available", requiredSources: ["CRM"], icon: Brain },
    { id: "mm-6", title: "Sosyal Dinleme", description: "Marka ve sektör sosyal medya izleme.", status: "available", requiredSources: ["Sosyal Medya API"], icon: Activity },
    { id: "mm-7", title: "Kişiselleştirme Motoru", description: "Gerçek zamanlı web ve e-posta kişiselleştirme.", status: "coming_soon", requiredSources: ["CDP"], icon: Zap, quarter: "Q2" },
    { id: "mm-8", title: "Kreatif AI Asistan", description: "AI destekli reklam metni ve görsel üretimi.", status: "coming_soon", requiredSources: ["DAM"], icon: Palette, quarter: "Q3" },
  ],
  operations: [
    { id: "om-1", title: "Talep Tahmin Motoru", description: "AI destekli talep tahmini ve stok planlaması.", status: "enabled", requiredSources: ["ERP", "Satış"], icon: TrendingUp },
    { id: "om-2", title: "Tedarik Zinciri İzleme", description: "Uçtan uca tedarik zinciri görünürlüğü.", status: "enabled", requiredSources: ["ERP", "Lojistik"], icon: Package },
    { id: "om-3", title: "Kalite Kontrol Otoması", description: "Otomatik kalite kontrol ve anomali tespiti.", status: "enabled", requiredSources: ["QC", "IoT"], icon: Shield },
    { id: "om-4", title: "Bakım Öngörüsü", description: "Prediktif bakım ve arıza tahmini.", status: "available", requiredSources: ["IoT", "CMMS"], icon: Activity },
    { id: "om-5", title: "Rota Optimizatör", description: "AI destekli dağıtım ve teslimat rota optimizasyonu.", status: "available", requiredSources: ["Lojistik"], icon: Target },
    { id: "om-6", title: "Tedarikçi Risk Motoru", description: "Tedarikçi bazlı risk değerlendirmesi.", status: "available", requiredSources: ["ERP"], icon: AlertTriangle },
    { id: "om-7", title: "Dijital İkiz", description: "Üretim hattı dijital ikiz simülasyonu.", status: "coming_soon", requiredSources: ["IoT", "MES"], icon: Brain, quarter: "Q3" },
    { id: "om-8", title: "Otonom Planlama", description: "Kendini optimize eden üretim planlaması.", status: "coming_soon", requiredSources: ["MES", "ERP"], icon: Zap, quarter: "Q4" },
  ],
  technology: [
    { id: "tm-1", title: "Altyapı İzleme", description: "Gerçek zamanlı sistem sağlığı ve performans izleme.", status: "enabled", requiredSources: ["APM", "Monitoring"], icon: Activity },
    { id: "tm-2", title: "Güvenlik Operasyon Merkezi", description: "Siber güvenlik tehdit tespiti ve müdahale.", status: "enabled", requiredSources: ["SIEM", "Firewall"], icon: Shield },
    { id: "tm-3", title: "DevOps Otomasyonu", description: "CI/CD pipeline yönetimi ve optimizasyonu.", status: "enabled", requiredSources: ["GitHub", "Jenkins"], icon: Zap },
    { id: "tm-4", title: "Maliyet FinOps", description: "Cloud maliyet optimizasyonu ve takibi.", status: "available", requiredSources: ["Cloud Platformları"], icon: DollarSign },
    { id: "tm-5", title: "API Yönetim Platformu", description: "API yaşam döngüsü yönetimi.", status: "available", requiredSources: ["API Gateway"], icon: Layers },
    { id: "tm-6", title: "Veri Kalite Motoru", description: "Otomatik veri kalitesi izleme ve düzeltme.", status: "available", requiredSources: ["Veritabanları"], icon: Database },
    { id: "tm-7", title: "AI Model Ops", description: "AI model eğitimi, deployment ve izleme.", status: "coming_soon", requiredSources: ["ML Platform"], icon: Brain, quarter: "Q2" },
    { id: "tm-8", title: "Sıfır Güven Güvenlik", description: "Zero-trust güvenlik mimarisi.", status: "coming_soon", requiredSources: ["IAM"], icon: Shield, quarter: "Q3" },
  ],
  creative: [
    { id: "cm-1", title: "DAM Yönetimi", description: "Dijital varlık arşivleme ve dağıtım.", status: "enabled", requiredSources: ["DAM"], icon: Database },
    { id: "cm-2", title: "Brand Consistency Checker", description: "Marka uyumu otomatik kontrol.", status: "enabled", requiredSources: ["DAM", "Web"], icon: Palette },
    { id: "cm-3", title: "Kreatif Brief Yönetimi", description: "Brief oluşturma, takip ve onay akışı.", status: "enabled", requiredSources: ["Proje Yönetimi"], icon: FileText },
    { id: "cm-4", title: "Görsel Performans Analizi", description: "Kreatif varlık performans karşılaştırması.", status: "available", requiredSources: ["Analytics", "Reklam"], icon: BarChart3 },
    { id: "cm-5", title: "Tasarım Sistemi Manager", description: "Tasarım sistemi versiyon ve komponent yönetimi.", status: "available", requiredSources: ["Figma"], icon: Layers },
    { id: "cm-6", title: "Video Otomasyonu", description: "Şablon bazlı otomatik video üretimi.", status: "available", requiredSources: ["DAM"], icon: Activity },
    { id: "cm-7", title: "AI Görsel Üretim", description: "AI destekli görsel ve illüstrasyon üretimi.", status: "coming_soon", requiredSources: ["AI Platform"], icon: Brain, quarter: "Q2" },
    { id: "cm-8", title: "3D Ürün Görselleme", description: "3D ürün fotoğrafı ve AR deneyimi.", status: "coming_soon", requiredSources: ["3D Platform"], icon: Zap, quarter: "Q4" },
  ],
  marketplace: [
    { id: "mpm-1", title: "Çoklu Platform Yönetimi", description: "Tüm pazaryerlerini tek panelden yönet.", status: "enabled", requiredSources: ["Pazaryeri API"], icon: ShoppingCart },
    { id: "mpm-2", title: "Fiyat İstihbaratı", description: "Rekabet bazlı otomatik fiyatlandırma.", status: "enabled", requiredSources: ["Scraping", "API"], icon: DollarSign },
    { id: "mpm-3", title: "Listeleme Optimizatör", description: "Ürün listeleme kalitesi analizi ve önerileri.", status: "enabled", requiredSources: ["Pazaryeri"], icon: Target },
    { id: "mpm-4", title: "Stok Senkronizasyonu", description: "Platformlar arası otomatik stok eşitleme.", status: "available", requiredSources: ["ERP", "Pazaryeri"], icon: Database },
    { id: "mpm-5", title: "Reklam Yönetimi", description: "Pazaryeri içi reklam kampanya yönetimi.", status: "available", requiredSources: ["Pazaryeri Reklam"], icon: BarChart3 },
    { id: "mpm-6", title: "Yorum ve Puan Yönetimi", description: "Müşteri yorum izleme ve yanıt otomasyonu.", status: "available", requiredSources: ["Pazaryeri"], icon: Users },
    { id: "mpm-7", title: "Talep Öngörüsü", description: "Pazaryeri bazlı talep tahmini.", status: "coming_soon", requiredSources: ["Pazaryeri", "ERP"], icon: TrendingUp, quarter: "Q2" },
    { id: "mpm-8", title: "Uluslararası Pazaryeri", description: "Cross-border e-ticaret yönetimi.", status: "coming_soon", requiredSources: ["Uluslararası API"], icon: Layers, quarter: "Q4" },
  ],
  legal: [
    { id: "lm-1", title: "Sözleşme Yönetimi", description: "Sözleşme yaşam döngüsü ve vade takibi.", status: "enabled", requiredSources: ["CLM"], icon: FileText },
    { id: "lm-2", title: "KVKK Uyum Motoru", description: "Kişisel veri işleme uyum izleme.", status: "enabled", requiredSources: ["KVKK Platformu"], icon: Shield },
    { id: "lm-3", title: "Regülasyon Takibi", description: "Mevzuat değişikliklerinin otomatik takibi.", status: "enabled", requiredSources: ["Mevzuat DB"], icon: Activity },
    { id: "lm-4", title: "Dava Yönetimi", description: "Hukuki süreç ve dava takip modülü.", status: "available", requiredSources: ["Hukuk Sistemi"], icon: AlertTriangle },
    { id: "lm-5", title: "Sözleşme AI Analizci", description: "AI destekli sözleşme risk analizi.", status: "available", requiredSources: ["CLM"], icon: Brain },
    { id: "lm-6", title: "Uyum Eğitim Platformu", description: "Çalışan uyum eğitimi ve sertifika takibi.", status: "available", requiredSources: ["HR", "LMS"], icon: Users },
    { id: "lm-7", title: "E-İmza Entegrasyonu", description: "Dijital imza ve onay akışı.", status: "coming_soon", requiredSources: ["E-İmza"], icon: Zap, quarter: "Q2" },
    { id: "lm-8", title: "IP Portföy Yönetimi", description: "Fikri mülkiyet portföy takibi.", status: "coming_soon", requiredSources: ["IP DB"], icon: Shield, quarter: "Q3" },
  ],
  hr: [
    { id: "hrm-1", title: "İşgücü Planlama", description: "Headcount planlama ve simülasyon.", status: "enabled", requiredSources: ["HRIS"], icon: Users },
    { id: "hrm-2", title: "Retention Engine", description: "Flight risk tespiti ve retention optimizasyonu.", status: "enabled", requiredSources: ["HRIS", "Anket"], icon: Shield },
    { id: "hrm-3", title: "Compensation Intelligence", description: "Ücret benchmark ve pay equity analizi.", status: "enabled", requiredSources: ["HRIS", "Benchmark"], icon: DollarSign },
    { id: "hrm-4", title: "Talent Acquisition AI", description: "AI destekli aday eleme ve matching.", status: "available", requiredSources: ["ATS"], icon: Brain },
    { id: "hrm-5", title: "People Analytics", description: "Gelişmiş çalışan analitikleri.", status: "available", requiredSources: ["HRIS"], icon: BarChart3 },
    { id: "hrm-6", title: "D&I Tracker", description: "Çeşitlilik ve kapsayıcılık takip.", status: "available", requiredSources: ["HRIS"], icon: Users },
    { id: "hrm-7", title: "Workforce Simulation", description: "Kadro senaryosu simülatörü.", status: "coming_soon", requiredSources: ["HRIS"], icon: Activity, quarter: "Q2" },
    { id: "hrm-8", title: "AI Career Pathing", description: "AI destekli kariyer yolu planlama.", status: "coming_soon", requiredSources: ["HRIS", "LMS"], icon: Zap, quarter: "Q3" },
  ],
  sales: [
    { id: "sm-1", title: "Revenue Intelligence", description: "Gelir tahmini ve pipeline analizi.", status: "enabled", requiredSources: ["CRM"], icon: DollarSign },
    { id: "sm-2", title: "Deal Intelligence", description: "Deal kalite skorlama ve öneriler.", status: "enabled", requiredSources: ["CRM"], icon: Target },
    { id: "sm-3", title: "Forecast Engine", description: "AI destekli gelir tahmini.", status: "enabled", requiredSources: ["CRM", "Billing"], icon: BarChart3 },
    { id: "sm-4", title: "Customer Health", description: "Müşteri sağlık skoru ve risk tespiti.", status: "available", requiredSources: ["CRM", "Product"], icon: Activity },
    { id: "sm-5", title: "Competitive Intel", description: "Rakip izleme ve battlecard.", status: "available", requiredSources: ["Market Intel"], icon: Shield },
    { id: "sm-6", title: "Revenue Simulation", description: "Gelir senaryosu simülatörü.", status: "available", requiredSources: ["CRM"], icon: Brain },
    { id: "sm-7", title: "AI Sales Coach", description: "AI destekli satış koçluğu.", status: "coming_soon", requiredSources: ["CRM", "Calls"], icon: Zap, quarter: "Q2" },
    { id: "sm-8", title: "Partner Analytics", description: "Kanal partner performans analizi.", status: "coming_soon", requiredSources: ["Partner Portal"], icon: Users, quarter: "Q3" },
  ],
};

export const getDepartmentModules = (deptId: DepartmentId): DepartmentModule[] => {
  return baseModules[deptId] || baseModules.executive;
};

export const filterModules = (modules: DepartmentModule[], filter: ModuleFilter): DepartmentModule[] => {
  if (filter === "Aktif") return modules.filter(m => m.status === "enabled");
  if (filter === "Mevcut") return modules.filter(m => m.status === "available");
  if (filter === "Yakında") return modules.filter(m => m.status === "coming_soon");
  return modules;
};
