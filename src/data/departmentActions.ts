import { DepartmentId } from "@/contexts/RBACContext";
import type { LucideIcon } from "lucide-react";
import { Zap, Shield, TrendingUp, DollarSign, Users, AlertTriangle, Target, Activity, Package, Layers, FileText, BarChart3, ShoppingCart, Palette, Database, Brain } from "lucide-react";

export type RiskLevel = "Düşük" | "Orta" | "Yüksek";
export type ActionStatus = "draft" | "pending" | "approved" | "rejected";
export type EffortLevel = "Düşük Efor" | "Orta Efor" | "Yüksek Efor";

export interface ActionTemplate {
  id: string;
  title: string;
  description: string;
  risk: RiskLevel;
  approvers: string[];
  effort: EffortLevel;
  icon: LucideIcon;
  inputs: string[];
}

export interface ActionHistoryItem {
  id: string;
  templateId: string;
  title: string;
  status: ActionStatus;
  createdAt: string;
  updatedBy: string;
}

const baseActions: Record<DepartmentId, ActionTemplate[]> = {
  executive: [
    { id: "ea-1", title: "Stratejik Yeniden Önceliklendirme", description: "Şirket geneli OKR ve stratejik hedefleri yeniden sırala.", risk: "Yüksek", approvers: ["CEO"], effort: "Yüksek Efor", icon: Target, inputs: ["Mevcut Hedef Listesi", "Yeni Öncelik Gerekçesi"] },
    { id: "ea-2", title: "Yönetim Kurulu Brifing Hazırla", description: "Board toplantısı için kapsamlı brifing dokümanı oluştur.", risk: "Düşük", approvers: ["CEO"], effort: "Orta Efor", icon: FileText, inputs: ["Dönem", "Kapsam Alanları"] },
    { id: "ea-3", title: "Departman Performans Değerlendirmesi", description: "Belirli departmanın çeyreklik performans değerlendirmesini başlat.", risk: "Orta", approvers: ["CEO", "CHRO"], effort: "Orta Efor", icon: BarChart3, inputs: ["Departman", "Değerlendirme Kriterleri"] },
    { id: "ea-4", title: "Kriz Müdahale Planı Aktive Et", description: "Belirli bir kriz senaryosu için müdahale planını devreye al.", risk: "Yüksek", approvers: ["CEO", "COO"], effort: "Yüksek Efor", icon: AlertTriangle, inputs: ["Kriz Türü", "Etki Alanı", "Aciliyet Seviyesi"] },
    { id: "ea-5", title: "Stratejik Ortaklık Değerlendirmesi", description: "Potansiyel iş ortaklığı fırsatını analiz et ve raporla.", risk: "Orta", approvers: ["CEO", "CFO"], effort: "Yüksek Efor", icon: Users, inputs: ["Ortak Adayı", "İş Birliği Alanı"] },
    { id: "ea-6", title: "Bütçe Dondurma Talebi", description: "Belirli kalemler için harcama dondurma kararı al.", risk: "Yüksek", approvers: ["CEO", "CFO"], effort: "Düşük Efor", icon: DollarSign, inputs: ["Kalem Listesi", "Süre", "Gerekçe"] },
    { id: "ea-7", title: "Yeni Pazar Giriş Onayı", description: "Yeni pazara giriş kararı için onay sürecini başlat.", risk: "Yüksek", approvers: ["CEO", "CFO", "CMO"], effort: "Yüksek Efor", icon: TrendingUp, inputs: ["Hedef Pazar", "Yatırım Planı"] },
    { id: "ea-8", title: "Organizasyonel Değişiklik Planı", description: "Yapısal değişiklik veya reorganizasyon planla.", risk: "Yüksek", approvers: ["CEO", "CHRO"], effort: "Yüksek Efor", icon: Layers, inputs: ["Değişiklik Kapsamı", "Etkilenen Birimler"] },
    { id: "ea-9", title: "Yatırımcı Sunum Hazırla", description: "Yatırımcı toplantısı için sunum ve veri paketi hazırla.", risk: "Düşük", approvers: ["CEO", "CFO"], effort: "Orta Efor", icon: FileText, inputs: ["Sunum Tarihi", "Hedef Kitle"] },
    { id: "ea-10", title: "Sürdürülebilirlik Hedefi Belirle", description: "ESG çerçevesinde yeni sürdürülebilirlik hedefi koy.", risk: "Orta", approvers: ["CEO"], effort: "Orta Efor", icon: Shield, inputs: ["Hedef Alanı", "Zaman Çerçevesi"] },
  ],
  finance: [
    { id: "fa-1", title: "Bütçe Revizyon Talebi", description: "Departman bütçesinde revizyon talep et.", risk: "Orta", approvers: ["CFO"], effort: "Orta Efor", icon: DollarSign, inputs: ["Departman", "Revizyon Tutarı", "Gerekçe"] },
    { id: "fa-2", title: "Nakit Akış Acil Müdahale", description: "Likidite sıkışıklığında acil müdahale planı oluştur.", risk: "Yüksek", approvers: ["CFO", "CEO"], effort: "Yüksek Efor", icon: AlertTriangle, inputs: ["Aciliyet", "Beklenen Açık", "Süre"] },
    { id: "fa-3", title: "Maliyet Azaltma Programı", description: "Sistematik maliyet azaltma aksiyonları planla.", risk: "Orta", approvers: ["CFO"], effort: "Yüksek Efor", icon: Target, inputs: ["Hedef Tasarruf", "Kapsam"] },
    { id: "fa-4", title: "Fiyatlama Stratejisi Güncelleme", description: "Ürün/hizmet fiyatlandırma stratejisini revize et.", risk: "Yüksek", approvers: ["CFO", "CMO"], effort: "Orta Efor", icon: TrendingUp, inputs: ["Ürün Grubu", "Fiyat Değişikliği"] },
    { id: "fa-5", title: "Vergi Optimizasyon Planı", description: "Yasal çerçevede vergi optimizasyonu aksiyonları belirle.", risk: "Orta", approvers: ["CFO"], effort: "Yüksek Efor", icon: Shield, inputs: ["Dönem", "Hedef Alan"] },
    { id: "fa-6", title: "Yatırım Kararı Onayı", description: "Yeni yatırım için fizibilite ve onay süreci başlat.", risk: "Yüksek", approvers: ["CFO", "CEO"], effort: "Yüksek Efor", icon: BarChart3, inputs: ["Yatırım Detayı", "Beklenen ROI"] },
    { id: "fa-7", title: "Alacak Tahsilat Aksiyonu", description: "Gecikmiş alacaklar için tahsilat aksiyonu başlat.", risk: "Düşük", approvers: ["CFO"], effort: "Orta Efor", icon: Zap, inputs: ["Müşteri Listesi", "Vade Durumu"] },
    { id: "fa-8", title: "Kredi Limiti Değerlendirmesi", description: "Müşteri/tedarikçi kredi limitlerini gözden geçir.", risk: "Orta", approvers: ["CFO"], effort: "Düşük Efor", icon: Users, inputs: ["Değerlendirme Kapsamı"] },
    { id: "fa-9", title: "Döviz Riski Hedge Planı", description: "Kur riski için hedge stratejisi oluştur.", risk: "Yüksek", approvers: ["CFO", "CEO"], effort: "Yüksek Efor", icon: Shield, inputs: ["Pozisyon", "Enstrüman", "Vade"] },
    { id: "fa-10", title: "Finansal Raporlama İyileştirmesi", description: "Raporlama süreçleri ve formatlarını optimize et.", risk: "Düşük", approvers: ["CFO"], effort: "Orta Efor", icon: FileText, inputs: ["İyileştirme Alanı", "Hedef Format"] },
  ],
  marketing: [
    { id: "ma-1", title: "Kampanya Bütçe Kaydırma", description: "Düşük performanslı kanaldan yüksek performanslıya bütçe aktar.", risk: "Orta", approvers: ["CMO"], effort: "Düşük Efor", icon: DollarSign, inputs: ["Kaynak Kanal", "Hedef Kanal", "Tutar"] },
    { id: "ma-2", title: "Acil Kampanya Durdurma", description: "Negatif ROI gösteren kampanyayı acil durdur.", risk: "Düşük", approvers: ["CMO"], effort: "Düşük Efor", icon: AlertTriangle, inputs: ["Kampanya ID", "Durdurma Gerekçesi"] },
    { id: "ma-3", title: "Yeni Kanal Pilot Lansmanı", description: "Yeni pazarlama kanalında pilot çalışma başlat.", risk: "Orta", approvers: ["CMO", "CFO"], effort: "Orta Efor", icon: Zap, inputs: ["Kanal", "Test Bütçesi", "KPI'lar"] },
    { id: "ma-4", title: "Marka Yenileme Projesi", description: "Marka kimliği güncelleme projesini başlat.", risk: "Yüksek", approvers: ["CMO", "CEO"], effort: "Yüksek Efor", icon: Palette, inputs: ["Kapsam", "Zaman Planı"] },
    { id: "ma-5", title: "İnfluencer İş Birliği Onayı", description: "Yeni influencer iş birliği anlaşmasını onayla.", risk: "Düşük", approvers: ["CMO"], effort: "Düşük Efor", icon: Users, inputs: ["Influencer", "Bütçe", "Kampanya Detayı"] },
    { id: "ma-6", title: "Fiyat Promosyonu Başlat", description: "Belirli ürün grubu için indirim kampanyası planla.", risk: "Orta", approvers: ["CMO", "CFO"], effort: "Orta Efor", icon: Target, inputs: ["Ürün Grubu", "İndirim Oranı", "Süre"] },
    { id: "ma-7", title: "CRM Segmentasyon Güncellemesi", description: "Müşteri segmentasyonunu yeniden yapılandır.", risk: "Düşük", approvers: ["CMO"], effort: "Orta Efor", icon: Database, inputs: ["Segmentasyon Kriteri", "Hedef Segment"] },
    { id: "ma-8", title: "İçerik Takvimi Revizyon", description: "İçerik üretim takvimini güncel stratejiye göre revize et.", risk: "Düşük", approvers: ["CMO"], effort: "Düşük Efor", icon: FileText, inputs: ["Dönem", "Tema Değişiklikleri"] },
    { id: "ma-9", title: "A/B Test Sonuçlarına Göre Aksiyon", description: "Tamamlanan A/B testinin kazanan varyantını uygula.", risk: "Düşük", approvers: ["CMO"], effort: "Düşük Efor", icon: Activity, inputs: ["Test ID", "Kazanan Varyant"] },
    { id: "ma-10", title: "Pazarlama Otomasyonu Genişletme", description: "Mevcut otomasyon akışlarına yeni senaryolar ekle.", risk: "Orta", approvers: ["CMO", "CTO"], effort: "Orta Efor", icon: Layers, inputs: ["Senaryo Detayı", "Hedef Segment"] },
  ],
  operations: [
    { id: "oa-1", title: "Tedarikçi Değişikliği", description: "Düşük performanslı tedarikçiden alternatife geçiş planla.", risk: "Yüksek", approvers: ["COO", "CFO"], effort: "Yüksek Efor", icon: Package, inputs: ["Mevcut Tedarikçi", "Alternatif", "Geçiş Planı"] },
    { id: "oa-2", title: "Acil Stok Siparişi", description: "Tükenme riski olan ürünler için acil sipariş oluştur.", risk: "Orta", approvers: ["COO"], effort: "Düşük Efor", icon: AlertTriangle, inputs: ["Ürün Listesi", "Miktar", "Tedarikçi"] },
    { id: "oa-3", title: "Süreç Otomasyonu Başlat", description: "Manuel sürecin otomasyonu için proje başlat.", risk: "Orta", approvers: ["COO", "CTO"], effort: "Yüksek Efor", icon: Zap, inputs: ["Süreç Adı", "Otomasyon Kapsamı"] },
    { id: "oa-4", title: "Kapasite Artırım Planı", description: "Üretim veya depolama kapasitesini artırma planı oluştur.", risk: "Yüksek", approvers: ["COO", "CFO"], effort: "Yüksek Efor", icon: TrendingUp, inputs: ["Alan", "Hedef Kapasite", "Yatırım Tahmini"] },
    { id: "oa-5", title: "Kalite Standart Güncelleme", description: "Üretim kalite standartlarını revize et.", risk: "Orta", approvers: ["COO"], effort: "Orta Efor", icon: Shield, inputs: ["Standart Alanı", "Yeni Kriter"] },
    { id: "oa-6", title: "Rota Optimizasyonu", description: "Dağıtım ve teslimat rotalarını optimize et.", risk: "Düşük", approvers: ["COO"], effort: "Orta Efor", icon: Target, inputs: ["Bölge", "Optimizasyon Kriteri"] },
    { id: "oa-7", title: "Bakım Planı Güncelleme", description: "Önleyici bakım takvimini revize et.", risk: "Düşük", approvers: ["COO"], effort: "Düşük Efor", icon: Activity, inputs: ["Ekipman Listesi", "Yeni Periyot"] },
    { id: "oa-8", title: "İSG Denetim Aksiyonu", description: "İSG denetim bulgularını aksiyona dönüştür.", risk: "Yüksek", approvers: ["COO", "CEO"], effort: "Orta Efor", icon: AlertTriangle, inputs: ["Bulgu Listesi", "Aciliyet"] },
    { id: "oa-9", title: "Envanter Sayım Başlat", description: "Fiziksel envanter sayımı organize et.", risk: "Düşük", approvers: ["COO"], effort: "Orta Efor", icon: Database, inputs: ["Depo", "Kapsam", "Tarih"] },
    { id: "oa-10", title: "Enerji Verimliliği Projesi", description: "Enerji tüketimi azaltma projesi başlat.", risk: "Orta", approvers: ["COO", "CFO"], effort: "Yüksek Efor", icon: Zap, inputs: ["Tesis", "Hedef Tasarruf"] },
  ],
  technology: [
    { id: "ta-1", title: "Güvenlik Yamasi Uygula", description: "Kritik güvenlik güncellemelerini acil dağıt.", risk: "Yüksek", approvers: ["CTO"], effort: "Orta Efor", icon: Shield, inputs: ["Sistem", "Yama Detayı", "Planlanan Süre"] },
    { id: "ta-2", title: "Sistem Kapasitesi Artır", description: "Altyapı kaynaklarını ölçeklendir.", risk: "Orta", approvers: ["CTO"], effort: "Orta Efor", icon: TrendingUp, inputs: ["Kaynak Türü", "Hedef Kapasite"] },
    { id: "ta-3", title: "Yeni Entegrasyon Başlat", description: "Üçüncü parti sistem entegrasyonu projesini başlat.", risk: "Orta", approvers: ["CTO", "COO"], effort: "Yüksek Efor", icon: Layers, inputs: ["Sistem", "Entegrasyon Kapsamı", "API Bilgisi"] },
    { id: "ta-4", title: "Veritabanı Migrasyon Planı", description: "Veritabanı migrasyon veya yükseltme planı oluştur.", risk: "Yüksek", approvers: ["CTO"], effort: "Yüksek Efor", icon: Database, inputs: ["Mevcut Sistem", "Hedef Sistem", "Veri Boyutu"] },
    { id: "ta-5", title: "Felaket Kurtarma Testi", description: "DR planını test et ve sonuçları raporla.", risk: "Düşük", approvers: ["CTO"], effort: "Orta Efor", icon: AlertTriangle, inputs: ["Test Senaryosu", "Planlanan Tarih"] },
    { id: "ta-6", title: "Yeni Teknoloji PoC Başlat", description: "Yeni teknoloji için proof of concept çalışması başlat.", risk: "Düşük", approvers: ["CTO"], effort: "Orta Efor", icon: Zap, inputs: ["Teknoloji", "Kullanım Alanı", "Bütçe"] },
    { id: "ta-7", title: "Lisans Optimizasyonu", description: "Yazılım lisanslarını gözden geçir ve optimize et.", risk: "Düşük", approvers: ["CTO", "CFO"], effort: "Düşük Efor", icon: DollarSign, inputs: ["Lisans Kategorisi"] },
    { id: "ta-8", title: "API Rate Limit Güncelleme", description: "API kullanım limitlerini ihtiyaca göre ayarla.", risk: "Orta", approvers: ["CTO"], effort: "Düşük Efor", icon: Activity, inputs: ["API", "Yeni Limit"] },
    { id: "ta-9", title: "Kod Kalite İyileştirmesi", description: "Teknik borç azaltma sprintini başlat.", risk: "Düşük", approvers: ["CTO"], effort: "Yüksek Efor", icon: Target, inputs: ["Modül", "Hedef Metrik"] },
    { id: "ta-10", title: "Monitoring Altyapısı Güncelle", description: "İzleme ve uyarı sistemini genişlet.", risk: "Düşük", approvers: ["CTO"], effort: "Orta Efor", icon: BarChart3, inputs: ["Kapsam", "Yeni Metrikler"] },
  ],
  creative: [
    { id: "ca-1", title: "Marka Yönergesi Güncelleme", description: "Brand guidelines dokümanını revize et.", risk: "Orta", approvers: ["Kreatif Direktör", "CMO"], effort: "Orta Efor", icon: Palette, inputs: ["Güncelleme Alanı", "Versiyon"] },
    { id: "ca-2", title: "Kampanya Kreatif Üretimi", description: "Yeni kampanya için görsel ve metin üretimi başlat.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Orta Efor", icon: Layers, inputs: ["Kampanya Brief", "Format Listesi"] },
    { id: "ca-3", title: "Video İçerik Projesi", description: "Yeni video içerik üretim projesini başlat.", risk: "Orta", approvers: ["Kreatif Direktör", "CMO"], effort: "Yüksek Efor", icon: Activity, inputs: ["Konsept", "Bütçe", "Süre"] },
    { id: "ca-4", title: "Tasarım Sistemi Genişletme", description: "Yeni komponentler ve pattern'ler ekle.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Orta Efor", icon: Database, inputs: ["Komponent Listesi", "Kullanım Alanı"] },
    { id: "ca-5", title: "UX Araştırma Başlat", description: "Kullanıcı araştırması ve test planlama.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Orta Efor", icon: Users, inputs: ["Araştırma Konusu", "Hedef Kitle"] },
    { id: "ca-6", title: "Ambalaj Tasarım Güncelleme", description: "Ürün ambalajı yeniden tasarım projesi.", risk: "Yüksek", approvers: ["Kreatif Direktör", "CMO", "COO"], effort: "Yüksek Efor", icon: Package, inputs: ["Ürün Grubu", "Konsept"] },
    { id: "ca-7", title: "Sosyal Medya Kreatif Planı", description: "Aylık sosyal medya görsel ve içerik planı oluştur.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Düşük Efor", icon: Target, inputs: ["Dönem", "Tema"] },
    { id: "ca-8", title: "Fotoğraf Çekimi Organize Et", description: "Ürün veya kurumsal fotoğraf çekimi planla.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Orta Efor", icon: Palette, inputs: ["Çekim Türü", "Tarih", "Konum"] },
    { id: "ca-9", title: "Marka İş Birliği Kreatif Planı", description: "Co-branding projesi için kreatif strateji oluştur.", risk: "Orta", approvers: ["Kreatif Direktör", "CMO"], effort: "Orta Efor", icon: Zap, inputs: ["Partner Marka", "Proje Kapsamı"] },
    { id: "ca-10", title: "DAM Temizlik ve Organizasyon", description: "Dijital varlık arşivini düzenle ve optimize et.", risk: "Düşük", approvers: ["Kreatif Direktör"], effort: "Düşük Efor", icon: FileText, inputs: ["Kapsam", "Sınıflandırma Kuralları"] },
  ],
  marketplace: [
    { id: "mpa-1", title: "Fiyat Güncelleme Aksiyonu", description: "Rekabet analizine göre toplu fiyat güncelleme yap.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "CFO"], effort: "Düşük Efor", icon: DollarSign, inputs: ["Ürün Grubu", "Fiyat Stratejisi"] },
    { id: "mpa-2", title: "Yeni Platform Entegrasyonu", description: "Yeni pazaryeri platformuna entegrasyon başlat.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "CTO"], effort: "Yüksek Efor", icon: Layers, inputs: ["Platform", "Ürün Kapsamı"] },
    { id: "mpa-3", title: "Listeleme Optimizasyonu", description: "Düşük performanslı ürün listelerini optimize et.", risk: "Düşük", approvers: ["Pazaryeri Yöneticisi"], effort: "Orta Efor", icon: Target, inputs: ["Ürün Listesi", "Optimizasyon Alanı"] },
    { id: "mpa-4", title: "Kampanya Dönem Hazırlığı", description: "Özel kampanya dönemi için stok ve fiyat hazırlığı yap.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "COO"], effort: "Orta Efor", icon: ShoppingCart, inputs: ["Kampanya Tarihi", "Ürün Grubu"] },
    { id: "mpa-5", title: "İade Politikası Revizyon", description: "Platform bazlı iade politikalarını güncelle.", risk: "Düşük", approvers: ["Pazaryeri Yöneticisi"], effort: "Düşük Efor", icon: Shield, inputs: ["Platform", "Yeni Politika"] },
    { id: "mpa-6", title: "Ürün Çekim Talebi", description: "Listeleme kalitesi için yeni ürün fotoğrafları talep et.", risk: "Düşük", approvers: ["Pazaryeri Yöneticisi"], effort: "Düşük Efor", icon: Palette, inputs: ["Ürün Listesi"] },
    { id: "mpa-7", title: "Reklam Bütçesi Optimizasyonu", description: "Platform içi reklam harcamalarını optimize et.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "CMO"], effort: "Orta Efor", icon: BarChart3, inputs: ["Platform", "Bütçe Dağılımı"] },
    { id: "mpa-8", title: "Stok Dengeleme Aksiyonu", description: "Platformlar arası stok tahsisini yeniden dengele.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "COO"], effort: "Orta Efor", icon: Database, inputs: ["Ürün Grubu", "Tahsis Stratejisi"] },
    { id: "mpa-9", title: "Müşteri Yorum Yönetimi", description: "Negatif yorumlara yanıt ve iyileştirme aksiyonu başlat.", risk: "Düşük", approvers: ["Pazaryeri Yöneticisi"], effort: "Düşük Efor", icon: Users, inputs: ["Platform", "Ürün"] },
    { id: "mpa-10", title: "Yeni Ürün Lansman Planı", description: "Yeni ürünün pazaryeri lansman planını oluştur.", risk: "Orta", approvers: ["Pazaryeri Yöneticisi", "CMO"], effort: "Orta Efor", icon: Zap, inputs: ["Ürün Detayı", "Lansman Tarihi"] },
  ],
  legal: [
    { id: "la-1", title: "Sözleşme Revizyon Talebi", description: "Mevcut sözleşmeyi revize et ve onay sürecini başlat.", risk: "Orta", approvers: ["Hukuk Direktörü"], effort: "Orta Efor", icon: FileText, inputs: ["Sözleşme No", "Revizyon Detayı"] },
    { id: "la-2", title: "KVKK Uyum Aksiyonu", description: "KVKK denetim bulgularını aksiyona dönüştür.", risk: "Yüksek", approvers: ["Hukuk Direktörü", "CEO"], effort: "Yüksek Efor", icon: Shield, inputs: ["Bulgu Listesi", "Düzeltme Planı"] },
    { id: "la-3", title: "Hukuki Risk Değerlendirmesi", description: "Yeni iş faaliyeti için hukuki risk analizi yap.", risk: "Orta", approvers: ["Hukuk Direktörü"], effort: "Orta Efor", icon: AlertTriangle, inputs: ["Faaliyet Detayı", "Kapsam"] },
    { id: "la-4", title: "Marka Tescil Başvurusu", description: "Yeni marka veya ürün için tescil başvurusu başlat.", risk: "Düşük", approvers: ["Hukuk Direktörü"], effort: "Orta Efor", icon: Shield, inputs: ["Marka/Ürün Adı", "Sınıf"] },
    { id: "la-5", title: "İhlal Bildirim Aksiyonu", description: "Veri ihlali bildirimi ve müdahale planını aktive et.", risk: "Yüksek", approvers: ["Hukuk Direktörü", "CEO", "CTO"], effort: "Yüksek Efor", icon: AlertTriangle, inputs: ["İhlal Detayı", "Etki Kapsamı"] },
    { id: "la-6", title: "Tedarikçi Sözleşme Şablonu", description: "Yeni tedarikçi sözleşme şablonunu hazırla.", risk: "Düşük", approvers: ["Hukuk Direktörü"], effort: "Orta Efor", icon: FileText, inputs: ["Şablon Türü", "Kapsam"] },
    { id: "la-7", title: "Uyum Eğitimi Organize Et", description: "Çalışanlara yönelik mevzuat uyum eğitimi planla.", risk: "Düşük", approvers: ["Hukuk Direktörü", "CHRO"], effort: "Düşük Efor", icon: Users, inputs: ["Eğitim Konusu", "Hedef Kitle"] },
    { id: "la-8", title: "Düzenleyici Rapor Hazırla", description: "Otoriteye sunulacak düzenleyici raporu hazırla.", risk: "Yüksek", approvers: ["Hukuk Direktörü", "CEO"], effort: "Yüksek Efor", icon: BarChart3, inputs: ["Otorite", "Rapor Türü", "Son Tarih"] },
    { id: "la-9", title: "Gizlilik Politikası Güncelleme", description: "Web sitesi gizlilik politikasını güncelle.", risk: "Orta", approvers: ["Hukuk Direktörü"], effort: "Düşük Efor", icon: Shield, inputs: ["Güncelleme Alanı"] },
    { id: "la-10", title: "Dava Strateji Değerlendirmesi", description: "Aktif dava stratejisini gözden geçir ve güncelle.", risk: "Yüksek", approvers: ["Hukuk Direktörü", "CEO"], effort: "Yüksek Efor", icon: Target, inputs: ["Dava No", "Strateji Seçenekleri"] },
  ],
  hr: [
    { id: "hra-1", title: "Acil İşe Alım Başlat", description: "Kritik pozisyon için hızlandırılmış işe alım süreci.", risk: "Orta", approvers: ["CHRO"], effort: "Yüksek Efor", icon: Users, inputs: ["Pozisyon", "Departman", "Aciliyet"] },
    { id: "hra-2", title: "Retention Paketi Aktive Et", description: "Yüksek risk çalışanlar için özel paket uygula.", risk: "Orta", approvers: ["CHRO", "CFO"], effort: "Orta Efor", icon: Shield, inputs: ["Çalışan Listesi", "Paket Detayı"] },
    { id: "hra-3", title: "Performans İyileştirme Planı", description: "PIP süreci başlat.", risk: "Yüksek", approvers: ["CHRO", "CEO"], effort: "Orta Efor", icon: Target, inputs: ["Çalışan", "Hedefler"] },
    { id: "hra-4", title: "Ücret Bant Revizyonu", description: "Departman bazlı ücret bandı güncellemesi.", risk: "Yüksek", approvers: ["CHRO", "CFO", "CEO"], effort: "Yüksek Efor", icon: DollarSign, inputs: ["Departman", "Yeni Bantlar"] },
    { id: "hra-5", title: "Eğitim Programı Başlat", description: "Yeni eğitim programı organize et.", risk: "Düşük", approvers: ["CHRO"], effort: "Orta Efor", icon: Brain, inputs: ["Program Adı", "Hedef Kitle"] },
    { id: "hra-6", title: "Çalışan Anket Başlat", description: "Çalışan bağlılığı veya memnuniyet anketi başlat.", risk: "Düşük", approvers: ["CHRO"], effort: "Düşük Efor", icon: BarChart3, inputs: ["Anket Türü", "Kapsam"] },
    { id: "hra-7", title: "Organizasyon Yeniden Yapılanma", description: "Departman yapısını yeniden düzenle.", risk: "Yüksek", approvers: ["CHRO", "CEO"], effort: "Yüksek Efor", icon: Layers, inputs: ["Kapsam", "Gerekçe"] },
    { id: "hra-8", title: "İşten Çıkarma Süreci", description: "Sözleşme feshi süreci başlat.", risk: "Yüksek", approvers: ["CHRO", "CEO"], effort: "Yüksek Efor", icon: AlertTriangle, inputs: ["Çalışan", "Gerekçe", "Kıdem"] },
    { id: "hra-9", title: "Stajyer Alım Programı", description: "Dönemsel stajyer alım programı başlat.", risk: "Düşük", approvers: ["CHRO"], effort: "Orta Efor", icon: Users, inputs: ["Kontenjan", "Departmanlar"] },
    { id: "hra-10", title: "Wellbeing Programı Aktive Et", description: "Çalışan sağlığı ve wellbeing programı başlat.", risk: "Düşük", approvers: ["CHRO"], effort: "Düşük Efor", icon: Activity, inputs: ["Program Türü", "Bütçe"] },
  ],
  sales: [
    { id: "sa-1", title: "Fiyat Artışı Uygula", description: "Segment bazlı fiyat artışı aktive et.", risk: "Yüksek", approvers: ["Sales Director", "CFO"], effort: "Yüksek Efor", icon: DollarSign, inputs: ["Segment", "Artış Oranı"] },
    { id: "sa-2", title: "Kampanya Başlat", description: "Satış kampanyası başlat.", risk: "Orta", approvers: ["Sales Director"], effort: "Orta Efor", icon: Zap, inputs: ["Kampanya Adı", "Kapsam", "Süre"] },
    { id: "sa-3", title: "Pipeline Temizliği", description: "Düşük kalite deal'leri pipeline'dan çıkar.", risk: "Düşük", approvers: ["Sales Director"], effort: "Düşük Efor", icon: Target, inputs: ["Kalite Eşiği", "Kapsam"] },
    { id: "sa-4", title: "Territory Yeniden Dağılım", description: "Satış bölgelerini yeniden düzenle.", risk: "Orta", approvers: ["Sales Director"], effort: "Orta Efor", icon: Layers, inputs: ["Bölgeler", "AE Atamaları"] },
    { id: "sa-5", title: "Discount Approval Override", description: "Standart dışı indirim onayı ver.", risk: "Yüksek", approvers: ["Sales Director", "CFO"], effort: "Düşük Efor", icon: Shield, inputs: ["Deal", "İndirim Oranı", "Gerekçe"] },
    { id: "sa-6", title: "Partner Onboarding", description: "Yeni kanal partner'ını sisteme ekle.", risk: "Orta", approvers: ["Sales Director"], effort: "Orta Efor", icon: Users, inputs: ["Partner Adı", "Sözleşme"] },
    { id: "sa-7", title: "Win/Loss Analiz Başlat", description: "Belirli dönem için kapsamlı win/loss analizi.", risk: "Düşük", approvers: ["Sales Director"], effort: "Orta Efor", icon: BarChart3, inputs: ["Dönem", "Segment"] },
    { id: "sa-8", title: "Sales Playbook Güncelle", description: "Satış rehberini güncelle.", risk: "Düşük", approvers: ["Sales Director"], effort: "Orta Efor", icon: FileText, inputs: ["Bölüm", "Güncelleme"] },
    { id: "sa-9", title: "Forecast Override", description: "Dönemsel forecast'u manuel revize et.", risk: "Yüksek", approvers: ["Sales Director", "CFO"], effort: "Düşük Efor", icon: AlertTriangle, inputs: ["Dönem", "Yeni Hedef", "Gerekçe"] },
    { id: "sa-10", title: "Customer Expansion Plan", description: "Mevcut müşteri genişletme planı oluştur.", risk: "Düşük", approvers: ["Sales Director"], effort: "Orta Efor", icon: TrendingUp, inputs: ["Müşteri", "Fırsat", "Hedef"] },
  ],
};

const baseHistory: ActionHistoryItem[] = [
  { id: "h1", templateId: "fa-1", title: "Q4 Bütçe Revizyonu", status: "approved", createdAt: "2 gün önce", updatedBy: "CFO" },
  { id: "h2", templateId: "ma-2", title: "Google Ads Kampanya Durdurma", status: "approved", createdAt: "3 gün önce", updatedBy: "CMO" },
  { id: "h3", templateId: "oa-2", title: "Acil Ambalaj Siparişi", status: "pending", createdAt: "1 gün önce", updatedBy: "COO" },
  { id: "h4", templateId: "ea-4", title: "Tedarik Zinciri Kriz Planı", status: "draft", createdAt: "4 saat önce", updatedBy: "CEO" },
  { id: "h5", templateId: "ta-1", title: "Log4j Güvenlik Yaması", status: "approved", createdAt: "1 hafta önce", updatedBy: "CTO" },
  { id: "h6", templateId: "fa-3", title: "Operasyonel Maliyet Azaltma", status: "rejected", createdAt: "1 hafta önce", updatedBy: "CFO" },
];

export const getDepartmentActions = (deptId: DepartmentId): ActionTemplate[] => {
  return baseActions[deptId] || baseActions.executive;
};

export const getActionHistory = (): ActionHistoryItem[] => baseHistory;
