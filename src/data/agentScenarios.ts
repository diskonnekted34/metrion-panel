// Real business scenario examples per agent
export interface AgentScenario {
  title: string;
  trigger: string;
  response: string;
  outcome: string;
}

export const agentScenarios: Record<string, AgentScenario[]> = {
  ceo: [
    { title: "Departmanlar Arası Bütçe Çatışması", trigger: "Pazarlama ve Operasyon bütçe artışı talep etti", response: "Çapraz etki analizi ile sermaye tahsis senaryoları oluşturuldu", outcome: "Optimal dağılım belirlendi, karar süresi %60 kısaldı" },
    { title: "Büyüme-Kârlılık Dengesizliği", trigger: "Gelir artarken net marjin düşmeye başladı", response: "Birim ekonomisi kırılımı ve kanal bazlı kârlılık analizi", outcome: "Kârsız kanallar tespit edildi, marjin %8 iyileşti" },
    { title: "Stratejik Yön Değerlendirmesi", trigger: "Pazar koşullarında hızlı değişim sinyalleri", response: "3 farklı senaryo simülasyonu ve risk haritası", outcome: "Proaktif strateji değişikliği ile risk minimize edildi" },
  ],
  cmo: [
    { title: "ROAS Düşüş Krizi", trigger: "Facebook ROAS son 2 haftada %30 düştü", response: "Kreatif yorgunluk tespiti ve kanal bazlı incrementality analizi", outcome: "Yeni kreatif seti %45 daha yüksek ROAS ile başladı" },
    { title: "Bütçe Ölçekleme Kararı", trigger: "Google Ads bütçesi %50 artırılmak isteniyor", response: "Marjinal ROAS eğrisi ve doygunluk analizi", outcome: "%30 artış optimal bulundu, aşırı harcama engellendi" },
    { title: "Kanal Konsantrasyon Riski", trigger: "Toplam gelirin %70'i tek kanaldan geliyor", response: "Kanal risk matrisi ve diversifikasyon senaryoları", outcome: "3 ay içinde kanal bağımlılığı %55'e düşürüldü" },
  ],
  cfo: [
    { title: "Nakit Akışı Şok Senaryosu", trigger: "Büyük müşteri ödemesinde 45 gün gecikme sinyali", response: "Nakit pisti simülasyonu ve acil likidite planı", outcome: "Alternatif finansman 2 hafta önceden aktive edildi" },
    { title: "Marjin Erozyonu Tespiti", trigger: "Ürün bazlı kârlılıkta açıklanamayan düşüş", response: "Dinamik katkı marjı modeli ve maliyet merkezi analizi", outcome: "Gizli maliyet kaçağı tespit edildi, yıllık ₺1.2M tasarruf" },
    { title: "Vergi Maruziyet Projeksiyonu", trigger: "Çeyrek sonu yaklaşırken KDV pozisyonu belirsiz", response: "Senaryo bazlı KDV projeksiyonu ve iade etki tahmini", outcome: "Proaktif vergi planlaması ile sürpriz yükümlülük engellendi" },
  ],
  coo: [
    { title: "Tedarik Zinciri Kırılması", trigger: "Ana tedarikçiden teslimat gecikmesi sinyali", response: "Alternatif tedarikçi analizi ve stok tükenmesi olasılık tahmini", outcome: "Stok-out engellendi, alternatif tedarikçi 48 saatte aktive edildi" },
    { title: "Depo Kapasite Krizi", trigger: "Sezon öncesi envanter seviyesi depo kapasitesinin %90'ına ulaştı", response: "Kapasite stres analizi ve envanter hız modelleme", outcome: "Ek depo ihtiyacı 3 hafta önceden planlandı" },
    { title: "Kargo Maliyet Anomalisi", trigger: "Kargo maliyetlerinde açıklanamayan %20 artış", response: "Lojistik maliyet trend modelleme ve anomali tespiti", outcome: "Fiyat hatası tespit edildi, ₺180K geri kazanıldı" },
  ],
  cto: [
    { title: "Kritik Sistem Kesintisi Riski", trigger: "Ana veritabanı sunucusunda performans degradasyonu tespit edildi", response: "Sistem güvenilirlik analizi ve failover senaryosu simülasyonu", outcome: "Proaktif geçiş ile kesinti süresi sıfırlandı, %99.99 uptime korundu" },
    { title: "Siber Güvenlik Açığı Tespiti", trigger: "Üçüncü parti kütüphanede kritik güvenlik açığı yayınlandı", response: "Bağımlılık haritası çıkarılarak etki analizi ve yama önceliklendirmesi", outcome: "24 saat içinde tüm sistemler güncellendi, sıfır ihlal" },
    { title: "Bulut Maliyet Patlaması", trigger: "AWS faturası son 3 ayda %40 arttı, neden belirsiz", response: "Kaynak kullanım analizi ve bulut maliyet optimizasyon modelleme", outcome: "Gereksiz kaynaklar tespit edildi, aylık $12K tasarruf sağlandı" },
  ],
  cio: [
    { title: "Veri Kalitesi Krizi", trigger: "CRM ve ERP arasında müşteri verisi uyumsuzluğu %15'e çıktı", response: "Departmanlar arası veri akış haritalama ve kalite puanlama", outcome: "Veri tutarsızlığı 4 haftada %2'ye düşürüldü" },
    { title: "SaaS Portföy Şişmesi", trigger: "Aktif SaaS araç sayısı 45'e ulaştı, örtüşen fonksiyonlar var", response: "SaaS portföy optimizasyon analizi ve konsolidasyon önerisi", outcome: "12 araç konsolide edildi, yıllık ₺380K tasarruf" },
    { title: "Dijital Dönüşüm Darboğazı", trigger: "Manuel süreçler departman verimliliğini düşürüyor", response: "Otomasyon fırsat tespiti ve ROI bazlı önceliklendirme", outcome: "İlk 5 otomasyon projesi ile haftalık 120 adam-saat tasarruf" },
  ],
  legal: [
    { title: "Riskli Sözleşme Tespiti", trigger: "Yeni tedarikçi sözleşmesinde sorumluluk maddesi belirsiz", response: "Sözleşme risk puanlama ve madde revizyon önerileri", outcome: "3 kritik madde revize edildi, hukuki risk minimize edildi" },
    { title: "KVKK Uyumluluk Kontrolü", trigger: "Yeni pazarlama kampanyası veri toplama içeriyor", response: "GDPR/KVKK uyumluluk kontrol listesi", outcome: "Uyumluluk boşlukları kampanya öncesi kapatıldı" },
    { title: "Reklam İddia Riski", trigger: "Kampanya metni agresif performans vaatleri içeriyor", response: "Reklam iddia risk tespiti ve alternatif metin önerileri", outcome: "Hukuki risk olmadan etkili mesaj formüle edildi" },
  ],
  "accounting-agent": [
    { title: "Bütçe Sapma Uyarısı", trigger: "Q3 harcamaları bütçenin %15 üzerinde seyrediyor", response: "Maliyet merkezi bazlı sapma analizi ve düzeltme senaryoları", outcome: "Düzeltici aksiyonlar ile Q4 bütçe hedefine geri dönüldü" },
    { title: "Yatırım Analizi Desteği", trigger: "Yeni ürün hattı yatırımı değerlendiriliyor", response: "NPV, IRR ve payback analizi ile senaryo modelleme", outcome: "Veri bazlı karar ile optimal yatırım büyüklüğü belirlendi" },
    { title: "Nakit Pozisyon İzleme", trigger: "Haftalık nakit pozisyonu hedefin altına düştü", response: "Dinamik nakit akışı tahminleme ve erken uyarı", outcome: "Likidite sıkışıklığı 10 gün önceden tespit edildi" },
  ],
  "growth-agent": [
    { title: "Organik Trafik Düşüşü", trigger: "Organik trafik son 30 günde %25 azaldı", response: "SEO denetim raporu ve algoritma değişikliği etki analizi", outcome: "Teknik SEO düzeltmeleri ile trafik 6 haftada toparlandı" },
    { title: "Dönüşüm Oranı Optimizasyonu", trigger: "Landing page dönüşüm oranı sektör ortalamasının altında", response: "A/B test çerçevesi tasarımı ve deney backlogu", outcome: "Sistematik testlerle dönüşüm oranı %35 artırıldı" },
    { title: "Yeni Kanal Değerlendirmesi", trigger: "TikTok reklamları test edilmek isteniyor", response: "Kanal performans benchmarkı ve test bütçe modelleme", outcome: "Kontrollü test ile kanal potansiyeli 4 haftada belirlendi" },
  ],
  "inventory-agent": [
    { title: "Stok Tükenmesi Riski", trigger: "En çok satan 3 üründe stok 2 haftalık seviyeye düştü", response: "Stok tükenmesi olasılık tahmini ve acil sipariş analizi", outcome: "Proaktif sipariş ile stok-out engellendi" },
    { title: "Ölü Stok Tespiti", trigger: "Envanter yaşlanma analizi talep edildi", response: "SKU bazlı hareket hızı analizi ve likidite önerileri", outcome: "₺450K değerinde ölü stok tasfiye planı oluşturuldu" },
    { title: "Sezonluk Tahminleme", trigger: "Yılbaşı sezonu envanter planlaması", response: "Geçmiş veri bazlı sezonluk talep tahmini", outcome: "Stok seviyesi %95 doğrulukla planlandı" },
  ],
  "creative-director": [
    { title: "Kreatif Yorgunluk Tespiti", trigger: "Kampanya görselleri 3 aydır değişmedi, performans düşüyor", response: "Görsel yorgunluk skoru ve yenileme önerileri", outcome: "Yeni kreatif seti CTR'ı %40 artırdı" },
    { title: "Marka Tutarsızlık Uyarısı", trigger: "Farklı kanallarda farklı marka tonu kullanılıyor", response: "Çok kanallı marka uyumu puanlama ve düzeltme rehberi", outcome: "Tüm kanallarda marka tutarlılığı %92'ye çıktı" },
    { title: "Kampanya Estetik Değerlendirmesi", trigger: "Yeni kampanya konsepti onay bekliyor", response: "Konsept performans tahmini ve hedef kitle uyum analizi", outcome: "Veri bazlı kreatif yön kararı alındı" },
  ],
  "graphic-designer": [
    { title: "Toplu Görsel Üretim", trigger: "50 ürün için pazaryeri görseli gerekiyor", response: "Şablon bazlı toplu üretim ve marka uyumluluk kontrolü", outcome: "48 saat içinde tüm görseller üretildi ve onaylandı" },
    { title: "Tasarım Sistemi Uyumsuzluğu", trigger: "Yeni bileşenler mevcut tasarım sistemine uymuyor", response: "Tasarım sistemi denetimi ve uyum rehberi", outcome: "Bileşen kütüphanesi standardize edildi" },
    { title: "Format Dönüşüm İhtiyacı", trigger: "Aynı kreatif 12 farklı formatta gerekiyor", response: "Çoklu format üretim planı ve otomasyon", outcome: "Manuel iş %80 azaltıldı" },
  ],
  "art-director": [
    { title: "Kreatif Yön Belirleme", trigger: "Yeni sezon kampanyası için görsel strateji gerekiyor", response: "Mood board analizi ve 3 farklı kreatif yön önerisi", outcome: "Veri destekli kreatif yön 2 günde belirlendi" },
    { title: "Görsel Kalite Kontrolü", trigger: "Üretilen görsellerin kalite standartları sorgulanıyor", response: "Kreatif kalite analizi ve iyileştirme rehberi", outcome: "Görsel kalite skoru %30 artırıldı" },
    { title: "Trend Adaptasyonu", trigger: "Sektörde yeni görsel trendler ortaya çıktı", response: "Trend sinyal analizi ve marka uyum değerlendirmesi", outcome: "Marka kimliğine uygun trend adaptasyonu yapıldı" },
  ],
  "marketplace-agent": [
    { title: "Buy Box Kaybı", trigger: "Ana ürünlerde buy box oranı %40'a düştü", response: "Rekabet fiyat analizi ve buy box optimizasyon stratejisi", outcome: "Buy box oranı 2 haftada %75'e çıkarıldı" },
    { title: "Kanal Kârlılık Sorgulaması", trigger: "Hangi pazaryeri gerçekten kârlı, belirsiz", response: "Kanal bazlı gerçek kârlılık analizi (tüm ücretler dahil)", outcome: "Kârsız kanal tespit edildi, kaynak yeniden dağıtıldı" },
    { title: "Listing Performans Düşüşü", trigger: "Top 20 listing'de dönüşüm oranı düşüyor", response: "Listing diagnostiği ve optimizasyon önerileri", outcome: "SEO ve içerik güncellemesi ile dönüşüm %25 arttı" },
  ],
};
