export interface Alert {
  id: string;
  text: string;
  detail: string;
  urgency: "Kritik" | "Yüksek" | "Orta" | "Düşük";
  confidence: string;
  agent: string;
  agentId: string;
  timestamp: string;
  category: "critical" | "recommendation" | "completed";
  resolved: boolean;
  metrics?: { label: string; value: string }[];
  whatHappened?: string;
  whyItMatters?: string;
  recommendations?: string[];
  collaboration?: string;
}

export const alertsData: Alert[] = [
  {
    id: "alert-1",
    text: "ROAS başa baş noktasının altına düştü",
    detail: "Meta kampanyalarında son 48 saatte %18 düşüş tespit edildi.",
    urgency: "Kritik",
    confidence: "94%",
    agent: "AI CMO",
    agentId: "cmo",
    timestamp: "12 dk önce",
    category: "critical",
    resolved: false,
    metrics: [
      { label: "Mevcut ROAS", value: "0.87" },
      { label: "Hedef ROAS", value: "1.20" },
      { label: "Düşüş", value: "-18%" },
      { label: "Etkilenen Bütçe", value: "$42K" },
    ],
    whatHappened: "Meta Ads platformundaki kampanyaların toplam ROAS değeri son 48 saat içinde 1.06'dan 0.87'ye düştü. Bu düşüş özellikle retargeting kampanyalarında yoğunlaştı.",
    whyItMatters: "Mevcut ROAS değeri başa baş noktasının altında, yani her harcanan reklam lirası zarar üretiyor. Müdahale edilmezse haftalık $18K kayıp bekleniyor.",
    recommendations: [
      "Düşük performanslı 3 reklam setini duraklatın",
      "Retargeting pencerelerini 7 günden 3 güne daraltın",
      "Kreatif A/B testini yeniden başlatın",
      "Haftalık bütçeyi %15 azaltın, performans düzelene kadar",
    ],
    collaboration: "CFO, kampanya bütçe etkisini marj analizi ile doğrulamalıdır.",
  },
  {
    id: "alert-2",
    text: "SKU-1247 ürün marjı kritik seviyede",
    detail: "Katkı marjı başa baş eşiğinin altına indi, fiyat revizyonu gerekli.",
    urgency: "Kritik",
    confidence: "97%",
    agent: "AI CFO",
    agentId: "cfo",
    timestamp: "28 dk önce",
    category: "critical",
    resolved: false,
    metrics: [
      { label: "Katkı Marjı", value: "2.1%" },
      { label: "Başa Baş", value: "4.5%" },
      { label: "Birim Maliyet", value: "$34.20" },
      { label: "Satış Fiyatı", value: "$34.92" },
    ],
    whatHappened: "SKU-1247 ürününün katkı marjı hammadde maliyetlerindeki artış nedeniyle %2.1'e düştü. Bu değer başa baş eşiği olan %4.5'in altında.",
    whyItMatters: "Her satılan birimde zarara giriliyor. Aylık 3,200 birim satış hacmi düşünüldüğünde $2,300/ay kayıp bekleniyor.",
    recommendations: [
      "Fiyatı %3 artırın ($36.00 hedef)",
      "Alternatif tedarikçi teklifi alın",
      "Ürünü promosyon havuzundan çıkarın",
    ],
    collaboration: "CMO, fiyat artışının talep elastikiyetine etkisini değerlendirmelidir.",
  },
  {
    id: "alert-3",
    text: "3 tedarikçi sözleşmesi 14 gün içinde sona eriyor",
    detail: "Madde incelemesi ve yenileme stratejisi önerilir.",
    urgency: "Yüksek",
    confidence: "89%",
    agent: "Hukuk Masası",
    agentId: "legal",
    timestamp: "1 saat önce",
    category: "recommendation",
    resolved: false,
    metrics: [
      { label: "Sözleşme Sayısı", value: "3" },
      { label: "Kalan Süre", value: "14 gün" },
      { label: "Toplam Değer", value: "$128K" },
    ],
    whatHappened: "Üç tedarikçi sözleşmesinin süresi 14 gün içinde doluyor. Otomatik yenileme maddesi yalnızca birinde mevcut.",
    whyItMatters: "Zamanında yenilenmeyen sözleşmeler tedarik zinciri kesintisine neden olabilir.",
    recommendations: [
      "Üç sözleşmeyi hukuk masasına taşıyın",
      "Yenileme koşullarını müzakere edin",
      "Alternatif tedarikçi listesi hazırlayın",
    ],
  },
  {
    id: "alert-4",
    text: "Instagram etkileşim oranı %12 geriledi",
    detail: "Organik erişim ve etkileşim metrikleri düşüş eğiliminde.",
    urgency: "Orta",
    confidence: "85%",
    agent: "AI CMO",
    agentId: "cmo",
    timestamp: "2 saat önce",
    category: "recommendation",
    resolved: false,
    metrics: [
      { label: "Etkileşim", value: "2.3%" },
      { label: "Önceki", value: "2.6%" },
      { label: "Erişim", value: "-8%" },
    ],
    whatHappened: "Instagram hesabının etkileşim oranı son 7 günde %2.6'dan %2.3'e düştü.",
    whyItMatters: "Organik etkileşim düşüşü reklam maliyetlerini artırabilir ve marka bilinirliğini olumsuz etkiler.",
    recommendations: [
      "İçerik formatını çeşitlendirin (Reels ağırlıklı)",
      "UGC kampanyası başlatın",
      "Paylaşım saatlerini optimize edin",
    ],
  },
  {
    id: "alert-5",
    text: "Rakip fiyat değişikliği tespit edildi — 3 SKU etkilendi",
    detail: "Rakip A, 3 ortak ürün kategorisinde fiyat düşürdü.",
    urgency: "Yüksek",
    confidence: "91%",
    agent: "AI CSO",
    agentId: "cso",
    timestamp: "3 saat önce",
    category: "recommendation",
    resolved: false,
    metrics: [
      { label: "Etkilenen SKU", value: "3" },
      { label: "Ort. Fark", value: "-7%" },
    ],
    whatHappened: "Rakip A, 3 ortak ürün kategorisinde ortalama %7 fiyat indirimi yaptı.",
    whyItMatters: "Fiyat avantajı kaybı pazar payı erozyonuna neden olabilir.",
    recommendations: [
      "Fiyat eşleştirme stratejisi değerlendirin",
      "Katma değer önerisi güçlendirin",
      "Müşteri sadakat kampanyası planlayın",
    ],
  },
  {
    id: "alert-6",
    text: "Haftalık CEO brifing raporu tamamlandı",
    detail: "Tüm departman metrikleri derlendi ve özetlendi.",
    urgency: "Düşük",
    confidence: "100%",
    agent: "AI CEO",
    agentId: "ceo",
    timestamp: "6 saat önce",
    category: "completed",
    resolved: true,
  },
  {
    id: "alert-7",
    text: "Tedarikçi sözleşme risk puanlaması tamamlandı",
    detail: "4 sözleşme incelendi, 1 yüksek risk tespit edildi.",
    urgency: "Düşük",
    confidence: "100%",
    agent: "Hukuk Masası",
    agentId: "legal",
    timestamp: "4 saat önce",
    category: "completed",
    resolved: true,
  },
];
