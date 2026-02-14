// Role-specific workspace modules and KPI snapshots for all agents

export interface SnapshotKPI {
  label: string;
  value: string;
  trend: string;
}

export interface AnalysisModule {
  title: string;
  kpis: SnapshotKPI[];
  recommendations: string[];
}

export interface AgentWorkspaceConfig {
  snapshot: SnapshotKPI[];
  modules: AnalysisModule[];
  suggestions: string[];
}

export const agentWorkspaceConfigs: Record<string, AgentWorkspaceConfig> = {
  // ==================== EXECUTIVE LAYER ====================
  ceo: {
    snapshot: [
      { label: "Şirket Sağlık Skoru", value: "78", trend: "+3" },
      { label: "Risk Endeksi", value: "Orta", trend: "-1" },
      { label: "Stratejik Öncelik Skoru", value: "84%", trend: "+5%" },
    ],
    modules: [
      {
        title: "Öncelik Matrisi (Etki × Aciliyet)",
        kpis: [
          { label: "Öncelik Tamamlama", value: "67%", trend: "+12%" },
          { label: "Karar Bekleniyor", value: "3", trend: "" },
          { label: "Kritik Öncelik", value: "2", trend: "-1" },
        ],
        recommendations: [
          "Fiyatlama kararı bu hafta tamamlanmalı",
          "Q1 OKR revizyonu gerekli — strateji toplantısı planla",
          "Pazarlama bütçe onayı CEO onayına alınmalı",
        ],
      },
      {
        title: "Karar Günlüğü",
        kpis: [
          { label: "Haftalık Karar", value: "8", trend: "+2" },
          { label: "Ortalama Karar Süresi", value: "1.4 gün", trend: "-0.3 gün" },
        ],
        recommendations: [
          "Tedarikçi seçim kararı 48 saat içinde tamamlanmalı",
          "Ürün lansmanı onayı ertelendi — darboğazı gider",
        ],
      },
      {
        title: "Haftalık Odak Haritası",
        kpis: [
          { label: "Tamamlanan Odak", value: "4/6", trend: "" },
          { label: "Geciken", value: "1", trend: "" },
        ],
        recommendations: [
          "Çarşamba finans brifingi hazırlığını tamamla",
          "Cuma haftalık özet için tüm departman verilerini topla",
        ],
      },
      {
        title: "Stratejik Risk Genel Bakışı",
        kpis: [
          { label: "Aktif Riskler", value: "4", trend: "+1" },
          { label: "Azaltılan", value: "6", trend: "+2" },
        ],
        recommendations: [
          "Tedarik zinciri gecikmesi operasyonu etkiliyor",
          "Pazar payı riski — rakip agresif fiyatlama yapıyor",
        ],
      },
      {
        title: "Departman Performans Özeti",
        kpis: [
          { label: "En Yüksek Performans", value: "Finans", trend: "" },
          { label: "İyileştirme Gerekli", value: "Operasyon", trend: "" },
        ],
        recommendations: [
          "Pazarlama-satış alignment toplantısı planla",
          "Operasyon departmanı darboğaz analizi başlat",
        ],
      },
    ],
    suggestions: [
      "Haftalık öncelik sıralamasını güncelle.",
      "Departman performans karşılaştırmasını çalıştır.",
      "Stratejik risk özetini hazırla.",
      "OKR ilerleme durumunu kontrol et.",
      "Karar darboğazlarını tespit et.",
    ],
  },

  cfo: {
    snapshot: [
      { label: "Katkı Marjı", value: "12.4%", trend: "+1.2%" },
      { label: "Başa Baş ROAS", value: "2.8x", trend: "stabil" },
      { label: "Nakit Akışı Vadesi", value: "8 hafta", trend: "+1 hafta" },
      { label: "Envanter Riski", value: "Düşük", trend: "" },
    ],
    modules: [
      {
        title: "Ürün Bazlı Marjin Kırılımı",
        kpis: [
          { label: "Net Marjin", value: "12.4%", trend: "+1.2%" },
          { label: "Brüt Marjin", value: "38.7%", trend: "-0.5%" },
          { label: "En Düşük Marjin Ürün", value: "SKU-142", trend: "" },
        ],
        recommendations: [
          "Düşük marjinli 3 ürünü fiyat revizyonuna al",
          "Tedarikçi B ile yeniden müzakere başlat",
          "Paket satış stratejisi ile marjin artışı hedefle",
        ],
      },
      {
        title: "Başa Baş Analizörü",
        kpis: [
          { label: "Başa Baş ROAS", value: "2.8x", trend: "stabil" },
          { label: "Başa Baş CPA", value: "₺142", trend: "+₺8" },
        ],
        recommendations: [
          "CPA ₺150 üzerine çıkarsa kampanya C'yi durdur",
          "ROAS hedefini 3.0x'e yükselt",
        ],
      },
      {
        title: "İndirim Simülatörü",
        kpis: [
          { label: "Mevcut İndirim Oranı", value: "%12", trend: "+2%" },
          { label: "Marjin Etkisi", value: "-₺34K", trend: "" },
        ],
        recommendations: [
          "%15 üzeri indirim marjini tehlikeli bölgeye taşıyor",
          "Hacim bazlı indirim modeline geçiş test et",
        ],
      },
      {
        title: "Nakit Akışı Tahmini",
        kpis: [
          { label: "4 Hafta Tahmini", value: "₺2.4M", trend: "+₺180K" },
          { label: "Nakit Döngüsü", value: "34 gün", trend: "-2 gün" },
        ],
        recommendations: [
          "Hafta 3'te nakit sıkışıklığı riski — erken tahsilat başlat",
          "Tedarikçi ödeme vadelerini yeniden müzakere et",
        ],
      },
      {
        title: "İade & Maliyet Risk Monitörü",
        kpis: [
          { label: "İade Oranı", value: "%4.2", trend: "+0.3%" },
          { label: "Maliyet Artışı", value: "+₺18K", trend: "" },
        ],
        recommendations: [
          "SKU-089 iade oranı %8 — ürün kalite incelemesi başlat",
          "Lojistik maliyet artışı tedarikçi değişikliğinden kaynaklanıyor",
        ],
      },
    ],
    suggestions: [
      "Kampanya B'nin marjin etkisini analiz et.",
      "Ürün X'e %10 indirim simüle et.",
      "En yüksek iade riskli SKU'yu belirle.",
      "6 haftalık nakit akışı tahmini oluştur.",
      "Başa baş ROAS eşiğini hesapla.",
    ],
  },

  cmo: {
    snapshot: [
      { label: "ROAS", value: "3.2x", trend: "-0.4x" },
      { label: "CPA", value: "₺98", trend: "+₺12" },
      { label: "CTR", value: "2.8%", trend: "+0.3%" },
      { label: "CVR", value: "1.8%", trend: "-0.2%" },
      { label: "Gelir Hızı", value: "₺142K/hafta", trend: "+₺8K" },
    ],
    modules: [
      {
        title: "Kampanya Kırılım Tablosu",
        kpis: [
          { label: "Aktif Kampanya", value: "12", trend: "" },
          { label: "En İyi ROAS", value: "Meta - Retarget", trend: "4.8x" },
          { label: "En Düşük", value: "Google - Search B", trend: "1.2x" },
        ],
        recommendations: [
          "Google Search B kampanyasını optimize et veya durdur",
          "Meta Retarget bütçesini %20 artır",
          "TikTok kanalı test bütçesi ekle",
        ],
      },
      {
        title: "Kreatif Performans Haritası",
        kpis: [
          { label: "Aktif Kreatif", value: "24", trend: "" },
          { label: "Yorulan", value: "6", trend: "+2" },
          { label: "En İyi CTR", value: "Video-A3", trend: "4.1%" },
        ],
        recommendations: [
          "Kreatif A yorulma sinyali — yeni varyasyon üret",
          "UGC tarzı kreatifler %40 daha yüksek CVR gösteriyor",
          "Video formatına geçiş test et",
        ],
      },
      {
        title: "Funnel Düşüş Analizi",
        kpis: [
          { label: "Üst Funnel CVR", value: "4.2%", trend: "+0.5%" },
          { label: "Alt Funnel CVR", value: "1.8%", trend: "-0.2%" },
          { label: "Sepet Terk Oranı", value: "68%", trend: "+3%" },
        ],
        recommendations: [
          "Checkout sayfası optimizasyonu öncelikli",
          "Retargeting segmentini güncelle",
          "Sepet hatırlatma e-postası akışını aktifleştir",
        ],
      },
      {
        title: "Bütçe Tahsis Optimizatörü",
        kpis: [
          { label: "Toplam Bütçe", value: "₺420K", trend: "" },
          { label: "Meta Payı", value: "%52", trend: "" },
          { label: "Önerilen Kayma", value: "-₺35K Meta → TikTok", trend: "" },
        ],
        recommendations: [
          "Meta bütçesinin %15'ini TikTok'a kaydır",
          "Google Display ağını kapat — ROI negatif",
        ],
      },
      {
        title: "Büyüme Planı Üreteci",
        kpis: [
          { label: "Test Sayısı", value: "8", trend: "" },
          { label: "Kazanan", value: "5", trend: "" },
        ],
        recommendations: [
          "A/B test hızını artır — haftalık 3 test hedefle",
          "Yeni kanal testi: Pinterest reklamları",
        ],
      },
    ],
    suggestions: [
      "Mevcut bütçe tahsisini optimize et.",
      "En düşük performanslı kreatifi belirle.",
      "Agresif büyüme planı tasarla.",
      "Checkout dönüşüm oranını iyileştir.",
      "Kanal bazında ROAS karşılaştırması çalıştır.",
    ],
  },

  cto: {
    snapshot: [
      { label: "Entegrasyon Sağlığı", value: "96%", trend: "+1%" },
      { label: "Senkronizasyon Durumu", value: "Aktif", trend: "" },
      { label: "Hata Sayısı", value: "12", trend: "-4" },
      { label: "Otomasyon Kapsama", value: "68%", trend: "+5%" },
    ],
    modules: [
      {
        title: "Otomasyon Haritası",
        kpis: [
          { label: "Otomasyon Fırsatı", value: "14", trend: "+3" },
          { label: "Uygulanan", value: "8", trend: "+2" },
          { label: "Tasarruf Edilen Saat/Hafta", value: "42", trend: "+6" },
        ],
        recommendations: [
          "Fatura işleme otomasyonu en yüksek ROI",
          "CRM entegrasyonu tamamlanmalı",
          "E-posta pazarlama akışı otomasyona alınabilir",
        ],
      },
      {
        title: "Veri Tutarsızlık Monitörü",
        kpis: [
          { label: "Tutarsızlık", value: "3", trend: "-1" },
          { label: "Kritik", value: "1", trend: "" },
        ],
        recommendations: [
          "CRM-ERP sipariş sayısı uyuşmazlığı — senkronizasyonu kontrol et",
          "Stok verileri 2 saatlik gecikmeyle güncelleniyor",
        ],
      },
      {
        title: "Takip Bütünlüğü Denetimi",
        kpis: [
          { label: "Pixel Sağlığı", value: "94%", trend: "+2%" },
          { label: "Dönüşüm Takibi", value: "Aktif", trend: "" },
        ],
        recommendations: [
          "Facebook Pixel sunucu tarafı takibe geçirilmeli",
          "GA4 e-ticaret olayları eksik — yapılandırmayı tamamla",
        ],
      },
      {
        title: "Sistem Darboğaz Dedektörü",
        kpis: [
          { label: "Uptime", value: "99.7%", trend: "" },
          { label: "Ortalama Yanıt Süresi", value: "280ms", trend: "+40ms" },
          { label: "Hata Oranı", value: "0.3%", trend: "-0.1%" },
        ],
        recommendations: [
          "API yanıt süresi optimize edilmeli — önbellek ekle",
          "Yedekleme politikası güncellenmeli",
          "Veritabanı sorguları optimize edilmeli",
        ],
      },
    ],
    suggestions: [
      "En yüksek ROI otomasyon fırsatını belirle.",
      "Veri tutarsızlıklarını kontrol et.",
      "Sistem darboğazlarını analiz et.",
      "Takip bütünlüğü denetimi çalıştır.",
      "Entegrasyon sağlık raporunu oluştur.",
    ],
  },

  cso: {
    snapshot: [
      { label: "Büyüme Momentumu", value: "72", trend: "+8" },
      { label: "Pazar Genişleme Skoru", value: "65", trend: "+4" },
      { label: "Fırsat Endeksi", value: "84", trend: "+12" },
    ],
    modules: [
      {
        title: "30/60/90 Büyüme Planı",
        kpis: [
          { label: "30 Gün Hedef", value: "CAC %10 düşüş", trend: "" },
          { label: "60 Gün Hedef", value: "Yeni kanal lansmanı", trend: "" },
          { label: "90 Gün Hedef", value: "LTV/CAC 5.0x", trend: "" },
        ],
        recommendations: [
          "İlk 30 gün: Onboarding optimizasyonu ile retention artır",
          "60 gün: LinkedIn organik büyüme kanalını başlat",
          "90 gün: Referans programı tam ölçekte çalıştır",
        ],
      },
      {
        title: "Genişleme Senaryo Oluşturucu",
        kpis: [
          { label: "Senaryo Sayısı", value: "4", trend: "" },
          { label: "En Yüksek ROI", value: "B2B genişleme", trend: "" },
        ],
        recommendations: [
          "B2B satış kanalı en yüksek potansiyele sahip",
          "Uluslararası genişleme risk analizi tamamlanmalı",
        ],
      },
      {
        title: "AOV & LTV Strateji Oluşturucu",
        kpis: [
          { label: "AOV", value: "₺340", trend: "+₺22" },
          { label: "LTV", value: "₺1,420", trend: "+₺85" },
          { label: "LTV/CAC", value: "4.2x", trend: "+0.3x" },
        ],
        recommendations: [
          "Çapraz satış stratejisi AOV'yi %15 artırabilir",
          "Sadakat programı LTV'yi uzun vadede yükseltir",
        ],
      },
      {
        title: "Rekabet Pozisyonlama Modeli",
        kpis: [
          { label: "Pazar Payı", value: "%8.4", trend: "+0.6%" },
          { label: "Rakip Sayısı", value: "7", trend: "" },
        ],
        recommendations: [
          "Ana rakip agresif fiyatlama yapıyor — farklılaşma stratejisi güçlendir",
          "Niş segment fırsatı tespit edildi",
        ],
      },
    ],
    suggestions: [
      "30/60/90 büyüme planını güncelle.",
      "AOV artırma stratejisi öner.",
      "Rekabet pozisyonlama analizi çalıştır.",
      "LTV/CAC oranını optimize et.",
      "Yeni genişleme senaryosu oluştur.",
    ],
  },

  legal: {
    snapshot: [
      { label: "Uyumluluk Risk Skoru", value: "Orta", trend: "" },
      { label: "Aktif Hukuki Bayraklar", value: "3", trend: "+1" },
    ],
    modules: [
      {
        title: "Sözleşme Risk Analizörü",
        kpis: [
          { label: "Açık Sözleşme", value: "5", trend: "" },
          { label: "Yüksek Risk", value: "2", trend: "+1" },
          { label: "Süre Dolacak", value: "1", trend: "" },
        ],
        recommendations: [
          "Tedarikçi A sözleşmesi yenileme öncesi revizyon gerekli",
          "Sorumluluk maddesi risk oluşturuyor — hukuk danışmanına yönlendir",
        ],
      },
      {
        title: "Önerilen Madde Revizyonları",
        kpis: [
          { label: "Revizyon Önerisi", value: "8", trend: "+3" },
          { label: "Uygulanan", value: "5", trend: "" },
        ],
        recommendations: [
          "Fesih maddesi karşılıklı fesih hakkı içermiyor",
          "Tazminat üst limiti belirlenmeli",
          "Gizlilik süresi 3 yıla uzatılmalı",
        ],
      },
      {
        title: "KVKK/GDPR Kontrol Listesi",
        kpis: [
          { label: "Uyumluluk Oranı", value: "%87", trend: "+4%" },
          { label: "Eksik Madde", value: "3", trend: "-1" },
        ],
        recommendations: [
          "Veri işleme envanteri güncellenmeli",
          "Açık rıza metinleri revize edilmeli",
          "Veri ihlal prosedürü test edilmeli",
        ],
      },
      {
        title: "Reklam İddia Risk Dedektörü",
        kpis: [
          { label: "Riskli İddia", value: "4", trend: "+2" },
          { label: "Onaylanan", value: "12", trend: "" },
        ],
        recommendations: [
          "\"En iyi\" ifadesi kanıtlanabilir değil — kaldır veya revize et",
          "Fiyat karşılaştırma iddiası belgelendirilmeli",
        ],
      },
      {
        title: "Eskalasyon Göstergesi",
        kpis: [
          { label: "Eskalasyon Gerekli", value: "1", trend: "" },
          { label: "Bekleyen", value: "2", trend: "" },
        ],
        recommendations: [
          "Tedarikçi A sözleşme ihtilafı — profesyonel hukuk danışmanına yönlendir",
          "KVKK denetim bildirimi alındı — acil eylem planı oluştur",
        ],
      },
    ],
    suggestions: [
      "Açık sözleşmelerin risk özetini çıkar.",
      "KVKK uyumluluk durumunu kontrol et.",
      "Reklam iddia risklerini tara.",
      "Eskalasyon gerektiren konuları listele.",
      "Sözleşme madde revizyon önerileri oluştur.",
    ],
  },

  // ==================== MARKETING & CREATIVE AGENTS ====================
  "brand-manager": {
    snapshot: [
      { label: "Marka Tutarlılık Skoru", value: "86", trend: "+4" },
      { label: "Mesaj Uyum Endeksi", value: "91%", trend: "+2%" },
      { label: "Kampanya Uyumu", value: "88%", trend: "+5%" },
    ],
    modules: [
      {
        title: "Mesaj Sütunları",
        kpis: [
          { label: "Aktif Sütun", value: "4", trend: "" },
          { label: "Tutarlılık Skoru", value: "%91", trend: "+2%" },
        ],
        recommendations: [
          "Ana değer önerisi mesajını güncelle — pazar değişimi algılandı",
          "Hedef kitle segmentine göre mesaj varyasyonları oluştur",
        ],
      },
      {
        title: "Ses Tonu Monitörü",
        kpis: [
          { label: "Ton Uyumu", value: "%88", trend: "+3%" },
          { label: "Sapma Tespit", value: "3", trend: "-1" },
        ],
        recommendations: [
          "Sosyal medya tonunda tutarsızlık — stil rehberi güncelle",
          "E-posta iletişiminde daha profesyonel ton kullanılmalı",
        ],
      },
      {
        title: "Değer Önerisi İyileştirmesi",
        kpis: [
          { label: "A/B Test Sonucu", value: "Varyant B %18 üstün", trend: "" },
          { label: "Dönüşüm Etkisi", value: "+₺24K/ay", trend: "" },
        ],
        recommendations: [
          "Varyant B'yi tüm kanallarda uygula",
          "Fayda odaklı mesajlama özellik odaklıdan %30 daha etkili",
        ],
      },
      {
        title: "Web Sitesi Başlık Optimizasyonu",
        kpis: [
          { label: "Hero Başlık CVR", value: "3.4%", trend: "+0.6%" },
          { label: "CTA Tıklama Oranı", value: "7.2%", trend: "+1.1%" },
        ],
        recommendations: [
          "Alt sayfalar için başlık testi başlat",
          "CTA metni \"Hemen Başla\" yerine \"Ücretsiz Dene\" daha etkili",
        ],
      },
      {
        title: "Marka Risk Bayrakları",
        kpis: [
          { label: "Aktif Risk", value: "2", trend: "" },
          { label: "İzlenen", value: "5", trend: "" },
        ],
        recommendations: [
          "Rakip benzer marka ismi kullanıyor — izle",
          "Olumsuz marka algısı sosyal medyada tespit edildi — müdahale planı oluştur",
        ],
      },
    ],
    suggestions: [
      "Marka tutarlılık raporunu oluştur.",
      "Ses tonu sapmalarını kontrol et.",
      "Değer önerisi A/B test sonuçlarını analiz et.",
      "Web sitesi başlık optimizasyonu öner.",
      "Marka risk bayraklarını listele.",
    ],
  },

  "art-director": {
    snapshot: [
      { label: "Kampanya Konsept Sağlığı", value: "92", trend: "+3" },
      { label: "Görsel Tutarlılık Skoru", value: "88%", trend: "+4%" },
    ],
    modules: [
      {
        title: "Kampanya Konsept Oluşturucu",
        kpis: [
          { label: "Aktif Konsept", value: "3", trend: "" },
          { label: "Onay Bekleyen", value: "1", trend: "" },
        ],
        recommendations: [
          "Q2 kampanyası için minimalist konsept en yüksek puan aldı",
          "Sezonsal konsept hazırlığını 2 hafta öncesinden başlat",
        ],
      },
      {
        title: "Moodboard Üreteci",
        kpis: [
          { label: "Aktif Moodboard", value: "6", trend: "+2" },
          { label: "Onaylanan", value: "4", trend: "" },
        ],
        recommendations: [
          "Yeni sezon moodboard'u için trend araştırması tamamlandı",
          "Mevcut moodboard'u marka rehberine uyumlu hale getir",
        ],
      },
      {
        title: "Görsel Yön Brifingi",
        kpis: [
          { label: "Aktif Brifing", value: "5", trend: "" },
          { label: "Tamamlanan", value: "12", trend: "+3" },
        ],
        recommendations: [
          "Fotoğraf çekimi için görsel yön brifingini güncelle",
          "Video içerik için ayrı görsel dil oluştur",
        ],
      },
      {
        title: "Sezonsal Konsept Haritası",
        kpis: [
          { label: "Planlanan Sezon", value: "3", trend: "" },
          { label: "Hazır Konsept", value: "2", trend: "" },
        ],
        recommendations: [
          "Yaz kampanyası konseptini erken başlat",
          "Özel gün konseptlerini takvime ekle",
        ],
      },
    ],
    suggestions: [
      "Q2 kampanya konseptini oluştur.",
      "Görsel yön brifingi hazırla.",
      "Sezonsal konsept haritası çıkar.",
      "Moodboard alternatifleri öner.",
      "Görsel tutarlılık denetimi çalıştır.",
    ],
  },

  "graphic-designer": {
    snapshot: [
      { label: "Kreatif Üretim Hacmi", value: "48/hafta", trend: "+12" },
      { label: "Kreatif Performans Endeksi", value: "84", trend: "+6" },
    ],
    modules: [
      {
        title: "Reklam Düzeni Üreteci",
        kpis: [
          { label: "Üretilen Düzen", value: "32", trend: "+8" },
          { label: "A/B Test Kazanan", value: "12", trend: "+4" },
        ],
        recommendations: [
          "Dikey format mobilde %35 daha yüksek etkileşim",
          "Metin-görsel oranını %30/%70 olarak optimize et",
        ],
      },
      {
        title: "Carousel Storyboard Oluşturucu",
        kpis: [
          { label: "Aktif Carousel", value: "8", trend: "+3" },
          { label: "Ortalama Swipe Oranı", value: "62%", trend: "+5%" },
        ],
        recommendations: [
          "Hook slaytını daha dikkat çekici yap",
          "CTA slaytını 4. kareye taşı — daha yüksek dönüşüm",
        ],
      },
      {
        title: "Banner Varyantları",
        kpis: [
          { label: "Aktif Varyant", value: "16", trend: "" },
          { label: "En İyi CTR", value: "Banner-D2", trend: "3.8%" },
        ],
        recommendations: [
          "Koyu arka plan varyantları %22 daha yüksek CTR",
          "Animasyonlu banner testi başlat",
        ],
      },
      {
        title: "Thumbnail Optimizatörü",
        kpis: [
          { label: "Test Edilen", value: "24", trend: "+6" },
          { label: "Kazanan Oran", value: "%58", trend: "+8%" },
        ],
        recommendations: [
          "Yüz içeren thumbnail'ler %40 daha yüksek tıklama",
          "Kontrast renk çerçeve ekle",
        ],
      },
      {
        title: "Görsel Test Varyantları",
        kpis: [
          { label: "Aktif Test", value: "6", trend: "+2" },
          { label: "Sonuçlanan", value: "14", trend: "+4" },
        ],
        recommendations: [
          "Renk paleti A ile B arasında %18 fark — A'yı kullan",
          "Tipografi testi: Sans-serif %12 daha yüksek okunabilirlik",
        ],
      },
    ],
    suggestions: [
      "Reklam varyasyonları üret.",
      "Carousel storyboard oluştur.",
      "Banner optimizasyonu öner.",
      "Thumbnail A/B test varyantları hazırla.",
      "Haftalık kreatif üretim raporunu çıkar.",
    ],
  },

  "social-media-manager": {
    snapshot: [
      { label: "Etkileşim Oranı", value: "4.8%", trend: "+0.6%" },
      { label: "İçerik Sıklığı", value: "5/gün", trend: "+1" },
      { label: "Büyüme Hızı", value: "+2.4K/hafta", trend: "+400" },
    ],
    modules: [
      {
        title: "İçerik Takvimi",
        kpis: [
          { label: "Planlanan İçerik", value: "35", trend: "+8" },
          { label: "Yayınlanan", value: "28", trend: "+5" },
          { label: "Geciken", value: "2", trend: "-1" },
        ],
        recommendations: [
          "Cuma video içeriği için hazırlığı Çarşamba tamamla",
          "Hafta sonu planlamasını otomatikleştir",
        ],
      },
      {
        title: "Hook Üreteci",
        kpis: [
          { label: "Üretilen Hook", value: "24", trend: "+6" },
          { label: "En Yüksek Kaydetme", value: "Hook-7", trend: "%8.2" },
        ],
        recommendations: [
          "Soru formatı hook'lar %45 daha yüksek etkileşim",
          "İstatistik ile başlayan hook'ları artır",
        ],
      },
      {
        title: "Açıklama Varyantları",
        kpis: [
          { label: "Test Edilen", value: "18", trend: "" },
          { label: "En İyi Format", value: "Liste formatı", trend: "" },
        ],
        recommendations: [
          "Kısa açıklamalar (< 125 karakter) %20 daha yüksek erişim",
          "CTA içeren açıklamalar daha yüksek kaydetme oranı",
        ],
      },
      {
        title: "Topluluk Yanıt Stratejisi",
        kpis: [
          { label: "Yanıt Süresi", value: "18 dk", trend: "-4 dk" },
          { label: "Yanıt Oranı", value: "%94", trend: "+2%" },
        ],
        recommendations: [
          "Negatif yorumlara 30 dakika içinde yanıt ver",
          "Sık sorulan sorular için şablon yanıtlar oluştur",
        ],
      },
      {
        title: "Etkileşim Risk Monitörü",
        kpis: [
          { label: "Düşüş Sinyali", value: "1", trend: "" },
          { label: "Platform", value: "Twitter/X", trend: "-12%" },
        ],
        recommendations: [
          "Twitter/X etkileşimi düşüyor — içerik formatını değiştir",
          "Instagram Reels performansı artıyor — bütçe kaydır",
        ],
      },
    ],
    suggestions: [
      "Haftalık içerik takvimini oluştur.",
      "Hook varyasyonları üret.",
      "Etkileşim risk monitörünü kontrol et.",
      "Topluluk yanıt stratejisi öner.",
      "En iyi performans gösteren içeriği analiz et.",
    ],
  },

  // ==================== OPERATIONS & PRODUCT AGENTS ====================
  "product-manager": {
    snapshot: [
      { label: "SKU Performans Skoru", value: "82", trend: "+4" },
      { label: "Paket Fırsat Endeksi", value: "76", trend: "+8" },
      { label: "AOV Etki Skoru", value: "88", trend: "+3" },
    ],
    modules: [
      {
        title: "SKU Analiz Tablosu",
        kpis: [
          { label: "Toplam SKU", value: "148", trend: "+12" },
          { label: "En İyi Performans", value: "SKU-042", trend: "" },
          { label: "Düşük Performans", value: "8 SKU", trend: "+2" },
        ],
        recommendations: [
          "Düşük performanslı 8 SKU'yu fiyat veya paket revizyonuna al",
          "Top 10 SKU stok seviyesini izle — talebi karşılayamama riski",
        ],
      },
      {
        title: "Paket Strateji Oluşturucu",
        kpis: [
          { label: "Aktif Paket", value: "6", trend: "+2" },
          { label: "Paket AOV Artışı", value: "+₺85", trend: "+₺12" },
        ],
        recommendations: [
          "Tamamlayıcı ürün paketi oluştur — AOV %25 artış potansiyeli",
          "Sezonsal paket kampanyası planla",
        ],
      },
      {
        title: "Fiyat Optimizasyon Modeli",
        kpis: [
          { label: "Fiyat Elastikiyeti", value: "Orta", trend: "" },
          { label: "Optimal Fiyat Noktası", value: "₺299", trend: "+₺19" },
        ],
        recommendations: [
          "%5 fiyat artışı talebi %2'den az etkiler — uygula",
          "Rakip fiyat hareketi izleniyor",
        ],
      },
      {
        title: "Ürün Genişleme Senaryosu",
        kpis: [
          { label: "Fırsat", value: "3 kategori", trend: "" },
          { label: "En Yüksek Potansiyel", value: "Aksesuar", trend: "" },
        ],
        recommendations: [
          "Aksesuar kategorisi mevcut müşteri tabanı ile uyumlu",
          "Minimum sipariş miktarı analizi tamamlanmalı",
        ],
      },
    ],
    suggestions: [
      "SKU performans tablosunu analiz et.",
      "Paket stratejisi öner.",
      "Fiyat optimizasyon modeli çalıştır.",
      "Ürün genişleme senaryosu oluştur.",
      "AOV etkisi simülasyonu yap.",
    ],
  },

  // Operations Planner = aria
  aria: {
    snapshot: [
      { label: "Envanter Günü", value: "22 gün", trend: "-3 gün" },
      { label: "Karşılama Riski", value: "Düşük", trend: "" },
      { label: "Operasyonel Yük", value: "68%", trend: "-4%" },
    ],
    modules: [
      {
        title: "Envanter Risk Haritası",
        kpis: [
          { label: "Kritik Stok", value: "3 SKU", trend: "+1" },
          { label: "Aşırı Stok", value: "5 SKU", trend: "-2" },
          { label: "Optimal", value: "140 SKU", trend: "" },
        ],
        recommendations: [
          "SKU-089 14 gün içinde tükenecek — yeniden sipariş başlat",
          "Aşırı stoklu ürünlerde kampanya indirim stratejisi uygula",
        ],
      },
      {
        title: "Tedarik Risk Tahmincisi",
        kpis: [
          { label: "Riskli Tedarikçi", value: "2", trend: "+1" },
          { label: "Ortalama Teslim Süresi", value: "12 gün", trend: "+2 gün" },
        ],
        recommendations: [
          "Tedarikçi A teslimat gecikmesi artıyor — alternatif tedarikçi araştır",
          "Yedek tedarikçi havuzunu genişlet",
        ],
      },
      {
        title: "Lojistik Maliyet Analizörü",
        kpis: [
          { label: "Birim Lojistik Maliyeti", value: "₺18.40", trend: "+₺1.20" },
          { label: "Toplam Lojistik/Gelir", value: "%6.8", trend: "+0.4%" },
        ],
        recommendations: [
          "Kargo anlaşması yenilenmeli — %8 indirim potansiyeli",
          "Depo konsolidasyonu ₺24K/ay tasarruf sağlayabilir",
        ],
      },
      {
        title: "Karşılama Verimlilik Raporu",
        kpis: [
          { label: "Zamanında Teslimat", value: "%94", trend: "+1%" },
          { label: "İade İşleme Süresi", value: "2.4 gün", trend: "-0.3 gün" },
        ],
        recommendations: [
          "Paketleme sürecini optimize et — günlük kapasite %15 artabilir",
          "İade süreci dijitalleştirilmeli",
        ],
      },
    ],
    suggestions: [
      "Envanter risk haritasını güncelle.",
      "Tedarik riski tahminini çalıştır.",
      "Lojistik maliyet analizi yap.",
      "Fulfillment verimlilik raporunu oluştur.",
      "Operasyonel darboğazları belirle.",
    ],
  },

  // Finance Analyst = atlas
  atlas: {
    snapshot: [
      { label: "Maliyet Kırılım Doğruluğu", value: "96%", trend: "+2%" },
      { label: "Gider Büyüme Oranı", value: "+8%", trend: "+1%" },
    ],
    modules: [
      {
        title: "Detaylı Gider Tablosu",
        kpis: [
          { label: "Toplam Gider", value: "₺1.8M", trend: "+₺120K" },
          { label: "En Büyük Kalem", value: "Pazarlama", trend: "₺420K" },
          { label: "En Hızlı Artış", value: "Lojistik", trend: "+18%" },
        ],
        recommendations: [
          "Lojistik giderleri beklentinin üzerinde artıyor — analiz et",
          "Sabit gider kalemlerini üç ayda bir gözden geçir",
        ],
      },
      {
        title: "Maliyet Optimizasyon Önerileri",
        kpis: [
          { label: "Tasarruf Fırsatı", value: "₺145K/ay", trend: "" },
          { label: "Uygulanan", value: "3/7", trend: "" },
        ],
        recommendations: [
          "SaaS abonelik konsolidasyonu ile ₺18K/ay tasarruf",
          "Tedarikçi konsolidasyonu %12 maliyet düşüşü sağlayabilir",
        ],
      },
      {
        title: "İade Kalıp Analizi",
        kpis: [
          { label: "İade Oranı", value: "%4.2", trend: "+0.3%" },
          { label: "İade Maliyeti", value: "₺68K/ay", trend: "+₺8K" },
        ],
        recommendations: [
          "Beden uyumsuzluğu en sık iade nedeni — beden rehberi güncelle",
          "Tekrarlayan iade yapan müşterileri segmentle",
        ],
      },
      {
        title: "Genel Gider Risk Dedektörü",
        kpis: [
          { label: "Genel Gider/Gelir", value: "%14", trend: "+1%" },
          { label: "Risk Seviyesi", value: "Orta", trend: "" },
        ],
        recommendations: [
          "Personel maliyeti planın %8 üzerinde — kapasite planlamasını gözden geçir",
          "Ofis giderleri hibrit çalışma ile optimize edilebilir",
        ],
      },
    ],
    suggestions: [
      "Detaylı gider tablosunu oluştur.",
      "Maliyet optimizasyon önerileri sun.",
      "İade kalıp analizi çalıştır.",
      "Genel gider risk raporu hazırla.",
      "Bütçe sapma analizini güncelle.",
    ],
  },

  // Creative Director = muse
  muse: {
    snapshot: [
      { label: "İçerik Etkileşim Oranı", value: "5.2%", trend: "+0.8%" },
      { label: "Marka Tutarlılık Skoru", value: "90%", trend: "+3%" },
      { label: "Kreatif Çıktı Hızı", value: "18/hafta", trend: "+4" },
    ],
    modules: [
      {
        title: "Marka Anlatı Geliştirme",
        kpis: [
          { label: "Aktif Anlatı", value: "3", trend: "" },
          { label: "Uyum Skoru", value: "%90", trend: "+3%" },
        ],
        recommendations: [
          "Ana marka hikayesini Q2 stratejisine göre güncelle",
          "Müşteri başarı hikayeleri serisini başlat",
        ],
      },
      {
        title: "İçerik Strateji Planlaması",
        kpis: [
          { label: "Planlanan İçerik", value: "42", trend: "+8" },
          { label: "Platform Çeşitliliği", value: "5 platform", trend: "" },
        ],
        recommendations: [
          "Video içerik oranını %40'a çıkar",
          "Uzun form içerik SEO etkisi güçlü — blog serisini sürdür",
        ],
      },
      {
        title: "UX Metin ve Mikrokopi",
        kpis: [
          { label: "Optimize Edilen", value: "24 nokta", trend: "+6" },
          { label: "Dönüşüm Etkisi", value: "+%8", trend: "" },
        ],
        recommendations: [
          "Checkout mikrokopisi güncellenmeli — güven mesajları ekle",
          "Hata mesajlarını kullanıcı dostu hale getir",
        ],
      },
      {
        title: "Kreatif Kampanya İdeasyonu",
        kpis: [
          { label: "Aktif Kampanya Fikri", value: "8", trend: "+3" },
          { label: "Onaylanan", value: "5", trend: "" },
        ],
        recommendations: [
          "Sezonsal kampanya konseptlerini erkenden hazırla",
          "Kullanıcı üretimi içerik (UGC) kampanyası test et",
        ],
      },
    ],
    suggestions: [
      "İçerik stratejisi brifingi oluştur.",
      "Marka hikaye çerçevesi tasarla.",
      "Kampanya narratif varyasyonları üret.",
      "Hedef kitle mesaj haritası çıkar.",
      "İçerik performans analizi çalıştır.",
    ],
  },

  // Growth Strategist = nova
  nova: {
    snapshot: [
      { label: "Organik Trafik Büyümesi", value: "+34%", trend: "+8%" },
      { label: "Dönüşüm Oranı", value: "3.2%", trend: "+0.4%" },
      { label: "Deney Kazanma Oranı", value: "62%", trend: "+5%" },
    ],
    modules: [
      {
        title: "Büyüme Deney Portföyü",
        kpis: [
          { label: "Aktif Deney", value: "8", trend: "+2" },
          { label: "Kazanan", value: "5", trend: "+1" },
          { label: "Öğrenme", value: "2", trend: "" },
        ],
        recommendations: [
          "Onboarding A/B testi istatistiksel anlamlılığa ulaştı — Varyant B uygula",
          "Fiyatlama sayfası testi başlat",
        ],
      },
      {
        title: "SEO Denetim Raporu",
        kpis: [
          { label: "Anahtar Kelime Sıralaması", value: "Top 10: 24", trend: "+6" },
          { label: "Organik Trafik", value: "42K/ay", trend: "+8K" },
        ],
        recommendations: [
          "Uzun kuyruk anahtar kelimelerde fırsat tespit edildi",
          "Teknik SEO hataları giderilmeli — 12 kırık bağlantı",
        ],
      },
      {
        title: "Kanal Performans Panosu",
        kpis: [
          { label: "En İyi Kanal", value: "Organik Arama", trend: "" },
          { label: "En Hızlı Büyüyen", value: "Referans", trend: "+45%" },
        ],
        recommendations: [
          "Referans kanalını güçlendir — referans programı oluştur",
          "E-posta kanalı yeniden aktifleştir — otomasyon serisi kur",
        ],
      },
      {
        title: "Kampanya ROI Analizi",
        kpis: [
          { label: "Toplam Kampanya ROI", value: "3.4x", trend: "+0.2x" },
          { label: "En İyi ROI", value: "E-posta Otomasyonu", trend: "8.2x" },
        ],
        recommendations: [
          "E-posta otomasyon serisini genişlet — en yüksek ROI kanalı",
          "Düşük performanslı kampanyaları revize et veya kapat",
        ],
      },
    ],
    suggestions: [
      "Büyüme deney backlogunu güncelle.",
      "SEO denetim raporunu oluştur.",
      "Kanal performans matrisini analiz et.",
      "Kampanya ROI karşılaştırması çalıştır.",
      "Organik trafik büyüme planı öner.",
    ],
  },

  // Investment Advisor = vega
  vega: {
    snapshot: [
      { label: "Portföy Getiri", value: "+12.4%", trend: "+1.8%" },
      { label: "Risk Ayarlı Performans", value: "1.34 Sharpe", trend: "+0.08" },
      { label: "Due Diligence Tamamlama", value: "94%", trend: "+4%" },
    ],
    modules: [
      {
        title: "Portföy Performans Raporu",
        kpis: [
          { label: "YTD Getiri", value: "+12.4%", trend: "+1.8%" },
          { label: "Benchmark Farkı", value: "+2.1%", trend: "" },
        ],
        recommendations: [
          "Sektör rotasyonu fırsatı tespit edildi — teknoloji ağırlığını artır",
          "Riskli pozisyonları azalt — makro belirsizlik yüksek",
        ],
      },
      {
        title: "Pazar İstihbarat Brifingi",
        kpis: [
          { label: "Pazar Volatilitesi", value: "Orta", trend: "" },
          { label: "Fırsat Sinyali", value: "3", trend: "+1" },
        ],
        recommendations: [
          "Gelişen pazar fırsatı — detaylı analiz gerekli",
          "Faiz oranı değişikliği bekleniyor — tahvil pozisyonunu gözden geçir",
        ],
      },
      {
        title: "Due Diligence Skor Kartı",
        kpis: [
          { label: "Değerlendirilen", value: "8", trend: "+2" },
          { label: "Onaylanan", value: "5", trend: "+1" },
        ],
        recommendations: [
          "Hedef şirket B finansal sağlık skoru düşük — dikkatli yaklaş",
          "Sektör analizi tamamlanmalı",
        ],
      },
      {
        title: "Yatırım Tezi Dokümanı",
        kpis: [
          { label: "Aktif Tez", value: "4", trend: "+1" },
          { label: "Doğrulanan", value: "3", trend: "" },
        ],
        recommendations: [
          "Tez A revizyon gerektirir — pazar koşulları değişti",
          "Yeni tez oluştur: SaaS sektörü konsolidasyonu",
        ],
      },
    ],
    suggestions: [
      "Portföy performans özetini çıkar.",
      "Yatırım tezi doğrulaması çalıştır.",
      "Risk-getiri analizi güncelle.",
      "Sektör fırsat taraması yap.",
      "Senaryo bazlı getiri simülasyonu oluştur.",
    ],
  },

  // Legal Advisor = lexis
  lexis: {
    snapshot: [
      { label: "Analiz Edilen Sözleşme", value: "42", trend: "+8" },
      { label: "Uyumluluk Kapsama", value: "91%", trend: "+3%" },
      { label: "Risk Tespit Oranı", value: "96%", trend: "+1%" },
    ],
    modules: [
      {
        title: "Sözleşme Risk Skor Kartı",
        kpis: [
          { label: "Analiz Edilen", value: "42", trend: "+8" },
          { label: "Yüksek Risk", value: "4", trend: "+1" },
          { label: "Düşük Risk", value: "38", trend: "" },
        ],
        recommendations: [
          "4 yüksek riskli sözleşme acil revizyon gerektirir",
          "Otomatik risk puanlama eşiklerini güncelle",
        ],
      },
      {
        title: "Uyumluluk Kontrol Listesi",
        kpis: [
          { label: "Kapsama", value: "%91", trend: "+3%" },
          { label: "Eksik Alan", value: "3", trend: "-1" },
        ],
        recommendations: [
          "Veri koruma uyumluluğu güncellemesi gerekli",
          "Yeni düzenleme değişikliklerini takip et",
        ],
      },
      {
        title: "Due Diligence Özeti",
        kpis: [
          { label: "Tamamlanan", value: "12", trend: "+3" },
          { label: "Devam Eden", value: "2", trend: "" },
        ],
        recommendations: [
          "Hedef şirket hukuki incelemesi bu hafta tamamlanmalı",
          "Fikri mülkiyet hakları doğrulaması gerekli",
        ],
      },
      {
        title: "Madde Revizyon Önerileri",
        kpis: [
          { label: "Öneri", value: "18", trend: "+5" },
          { label: "Kabul Edilen", value: "14", trend: "+3" },
        ],
        recommendations: [
          "Standart fesih maddesi şablonunu güncelle",
          "Gizlilik maddesi kapsamını genişlet",
        ],
      },
    ],
    suggestions: [
      "Sözleşme risk skor kartını güncelle.",
      "Uyumluluk kontrol listesini çalıştır.",
      "Due diligence özetini hazırla.",
      "Madde revizyon önerilerini listele.",
      "Hukuki risk taraması başlat.",
    ],
  },
};
