export interface PackAgent {
  id: string;
  role: string;
  name: string;
}

export interface Tier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number;
  badge?: string;
  agents: PackAgent[];
  capabilities: string[];
  /** IDs of agents included cumulatively (including lower tiers) */
  cumulativeAgentIds: string[];
}

export interface Pack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number;
  type: "core" | "addon";
  department: string;
  agents: PackAgent[];
  capabilities: string[];
  requiresCore: boolean;
}

// ── TIER DEFINITIONS ──

export const tiers: Tier[] = [
  {
    id: "executive-core",
    name: "Yönetici Çekirdek",
    tagline: "Temel yönetim istihbaratı.",
    description: "Tüm departmanlarda çekirdek seviye AI yönetimi.",
    monthlyPrice: 249,
    agents: [
      { id: "ceo", role: "AI CEO", name: "Yönetici Operatör" },
      { id: "cfo", role: "AI CFO", name: "Kâr & Nakit Akışı Koruyucusu" },
      { id: "cmo", role: "AI CMO", name: "Performans & Kreatif Direktör" },
      { id: "product-manager", role: "AI Ürün Müdürü", name: "Forge" },
      { id: "cto", role: "AI Operasyon Planlayıcı", name: "Sistem & Otomasyon Lideri" },
      { id: "legal", role: "AI Hukuk Masası", name: "Hukuki Risk Analisti" },
    ],
    capabilities: [
      "Şirket Sağlık Skoru",
      "Katkı marjı izleme",
      "Kampanya gözetimi",
      "SKU analizi",
      "Envanter risk tespiti",
      "Haftalık yönetici ritmi",
      "Departmanlar arası görev orkestrasyon",
    ],
    cumulativeAgentIds: ["ceo", "cfo", "cmo", "product-manager", "cto", "legal"],
  },
  {
    id: "performance",
    name: "Performans",
    tagline: "Büyüme ve finansal optimizasyon katmanı.",
    description: "Çekirdek'teki her şey + gelişmiş büyüme ve finans yetenekleri.",
    monthlyPrice: 449,
    badge: "En Popüler",
    agents: [
      { id: "nova", role: "AI Performans Pazarlamacı", name: "Nova" },
      { id: "atlas", role: "AI Finans Analisti", name: "Atlas" },
      { id: "cso", role: "Gelişmiş Huni Optimizörü", name: "Strateji & Büyüme Mimarı" },
    ],
    capabilities: [
      "Kreatif yorulma tespiti",
      "CPA anomali tespiti",
      "Derinlemesine gider analizi",
      "Huni terk noktası teşhisi",
      "Bütçe yeniden dağıtım modellemesi",
    ],
    cumulativeAgentIds: ["ceo", "cfo", "cmo", "product-manager", "cto", "legal", "nova", "atlas", "cso"],
  },
  {
    id: "ai-workforce",
    name: "AI İş Gücü",
    tagline: "Tam AI destekli dahili ekip.",
    description: "Performans'taki her şey + tam kreatif, finans operasyonları ve otomasyon.",
    monthlyPrice: 699,
    badge: "En İyi Değer",
    agents: [
      { id: "muse", role: "Kreatif Direktör", name: "Muse" },
      { id: "art-director", role: "Sanat Yönetmeni", name: "Aura" },
      { id: "graphic-designer", role: "Grafik Tasarımcı", name: "Pixel" },
      { id: "brand-manager", role: "Marka Müdürü", name: "Prism" },
      { id: "social-media-manager", role: "Sosyal Medya Yöneticisi", name: "Echo" },
      { id: "vega", role: "Muhasebe Asistanı", name: "Vega" },
      { id: "aria", role: "Otomasyon Mimarı", name: "Aria" },
    ],
    capabilities: [
      "Tam AI kreatif departman",
      "Finansal operasyon istihbaratı",
      "Otomasyon izleme",
      "İçerik ve marka sistemleri",
    ],
    cumulativeAgentIds: [
      "ceo", "cfo", "cmo", "product-manager", "cto", "legal",
      "nova", "atlas", "cso",
      "muse", "art-director", "graphic-designer", "brand-manager", "social-media-manager", "vega", "aria",
    ],
  },
];

// ── ADD-ON PACKS ──

export const addonPacks: Pack[] = [
  {
    id: "creative-expansion",
    name: "Kreatif Genişleme Paketi",
    tagline: "AI Kreatif Departmanı",
    description: "Marka, içerik ve görsel üretim için tam dahili kreatif ekip.",
    monthlyPrice: 149,
    type: "addon",
    department: "marketing",
    requiresCore: true,
    agents: [
      { id: "muse", role: "AI Kreatif Direktör", name: "Muse" },
      { id: "art-director", role: "AI Sanat Yönetmeni", name: "Aura" },
      { id: "graphic-designer", role: "AI Grafik Tasarımcı", name: "Pixel" },
      { id: "brand-manager", role: "AI Marka Müdürü", name: "Prism" },
      { id: "social-media-manager", role: "AI Sosyal Medya Yöneticisi", name: "Echo" },
    ],
    capabilities: [
      "Kampanya konsept geliştirme",
      "Görsel yön çerçevesi",
      "Kreatif varyant üretimi",
      "Marka mesaj denetimi",
      "İçerik takvimi yönetimi",
      "Hook & başlık üretimi",
      "Etkileşim risk analizi",
    ],
  },
  {
    id: "finance-operations",
    name: "Finans Operasyon Paketi",
    tagline: "Finansal Operasyon İstihbaratı",
    description: "Detaylı finansal analiz, gider takibi ve uyumluluk izleme.",
    monthlyPrice: 99,
    type: "addon",
    department: "finance",
    requiresCore: true,
    agents: [
      { id: "atlas", role: "AI Finans Analisti", name: "Atlas" },
      { id: "vega", role: "AI Muhasebe Asistanı", name: "Vega" },
    ],
    capabilities: [
      "Detaylı gider dökümü",
      "İade kalıbı tespiti",
      "Maliyet anomali izleme",
      "Fatura & KDV takibi",
      "Aylık muhasebe özeti",
      "Departman maliyet oranları",
    ],
  },
  {
    id: "technology-automation",
    name: "Otomasyon Paketi",
    tagline: "Otomasyon & Veri Bütünlüğü Katmanı",
    description: "Sistem sağlığı izleme, otomasyon kapsamı ve veri bütünlüğü.",
    monthlyPrice: 99,
    type: "addon",
    department: "technology",
    requiresCore: true,
    agents: [
      { id: "aria", role: "AI Otomasyon Mimarı", name: "Aria" },
    ],
    capabilities: [
      "Entegrasyon sağlığı izleme",
      "Atıf bütünlüğü kontrolleri",
      "Otomasyon kapsam haritası",
      "Süreç darboğaz tespiti",
    ],
  },
];

// Legacy compat
export const corePack: Pack = {
  id: "executive-core",
  name: "E-Ticaret Yönetici Paketi",
  tagline: "AI Yönetim İşletim Sistemi",
  description: "Tüm çekirdek departmanlarda kapsamlı yönetici seviye AI yönetimi.",
  monthlyPrice: 249,
  type: "core",
  department: "executive",
  requiresCore: false,
  agents: tiers[0].agents,
  capabilities: tiers[0].capabilities,
};

export const allPacks: Pack[] = [corePack, ...addonPacks];
