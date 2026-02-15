export interface PackAgent {
  id: string;
  role: string;
  name: string;
}

export interface TierIntegration {
  name: string;
  note?: string;
}

export interface Tier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number;
  badge?: string;
  agents: PackAgent[];
  departments: string[];
  features: string[];
  integrations: TierIntegration[];
  teamMembers: string;
  approvalModel: string;
  aiProcessing: string;
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

export interface CreditPack {
  id: string;
  name: string;
  price: number;
  description: string;
}

// ── CREDIT BOOST PACKS ──

export const creditPacks: CreditPack[] = [
  { id: "small-boost", name: "Small Boost", price: 49, description: "Hafif işlem yükleri için ek AI işlem kapasitesi." },
  { id: "growth-boost", name: "Growth Boost", price: 149, description: "Büyüyen ekipler için orta düzey AI işlem kapasitesi." },
  { id: "scale-boost", name: "Scale Boost", price: 399, description: "Yoğun analiz ve tahminleme için maksimum AI işlem kapasitesi." },
];

// ── TIER DEFINITIONS ──

export const tiers: Tier[] = [
  {
    id: "core",
    name: "Core",
    tagline: "Temel yönetim istihbaratı.",
    description: "Yönetici, pazarlama ve finans departmanlarında çekirdek AI yönetimi.",
    monthlyPrice: 349,
    departments: ["Yönetici", "Pazarlama", "Finans"],
    agents: [
      { id: "ceo", role: "AI CEO", name: "CEO Agent" },
      { id: "cmo", role: "AI CMO", name: "CMO Agent" },
      { id: "cfo", role: "AI CFO", name: "CFO Agent" },
      { id: "accounting", role: "AI Muhasebe", name: "Accounting Agent" },
    ],
    features: [
      "Draft-first yazma otomasyonu",
      "Risk Engine (varsayılan eşikler)",
      "Tek onay iş akışı",
      "Aksiyon Merkezi",
      "Denetim günlükleri",
      "Dinamik RBAC",
      "5 ekip üyesi",
      "Sınırsız AI desteği (fair use)",
      "Temel AI İşlem kapasitesi",
    ],
    integrations: [
      { name: "Shopify" },
      { name: "Meta Ads" },
      { name: "Stripe" },
      { name: "Muhasebe Sağlayıcı", note: "1 adet" },
      { name: "GA4" },
      { name: "Canva", note: "taslak seviye" },
    ],
    teamMembers: "5",
    approvalModel: "Tek onay iş akışı",
    aiProcessing: "Temel",
    capabilities: [
      "Şirket Sağlık Skoru",
      "Katkı marjı izleme",
      "Kampanya gözetimi",
      "Draft-first otomasyon",
      "Denetim günlükleri",
    ],
    cumulativeAgentIds: ["ceo", "cmo", "cfo", "accounting"],
  },
  {
    id: "performance",
    name: "Performance",
    tagline: "Büyüme ve operasyonel optimizasyon.",
    description: "Core'daki her şey + Operasyon departmanı ve gelişmiş büyüme yetenekleri.",
    monthlyPrice: 599,
    badge: "Önerilen",
    departments: ["Yönetici", "Pazarlama", "Finans", "Operasyon"],
    agents: [
      { id: "coo", role: "AI COO", name: "COO Agent" },
      { id: "inventory", role: "AI Envanter Yöneticisi", name: "Inventory Agent" },
    ],
    features: [
      "Core'daki tüm özellikler",
      "Operasyon departmanı açık",
      "Özel risk eşikleri",
      "Eskalasyon bazlı onay",
      "Opsiyonel ikinci onay",
      "15 ekip üyesi",
      "Daha hızlı senkronizasyon",
      "Yüksek AI İşlem kapasitesi",
    ],
    integrations: [
      { name: "Core entegrasyonlar" },
      { name: "Google Ads" },
      { name: "TikTok Ads" },
      { name: "Shippo / ShipStation" },
      { name: "HubSpot" },
    ],
    teamMembers: "15",
    approvalModel: "Eskalasyon bazlı onay",
    aiProcessing: "Yüksek",
    capabilities: [
      "Core'daki tüm yetenekler",
      "Özel risk eşikleri",
      "Huni terk noktası teşhisi",
      "Envanter risk tespiti",
      "Bütçe yeniden dağıtım modellemesi",
    ],
    cumulativeAgentIds: ["ceo", "cmo", "cfo", "accounting", "coo", "inventory"],
  },
  {
    id: "workforce",
    name: "Workforce",
    tagline: "Tam AI destekli dahili ekip.",
    description: "Tüm departmanlar, tüm ajanlar, sınırsız ekip.",
    monthlyPrice: 899,
    badge: "En Kapsamlı",
    departments: ["Yönetici", "Pazarlama", "Finans", "Operasyon", "Kreatif", "Hukuk"],
    agents: [
      { id: "creative-director", role: "AI Kreatif Direktör", name: "Creative Director" },
      { id: "graphic-designer", role: "AI Grafik Tasarımcı", name: "Graphic Designer" },
      { id: "art-director", role: "AI Sanat Yönetmeni", name: "Art Director" },
    ],
    features: [
      "Performance'daki tüm özellikler",
      "Kreatif departmanı açık",
      "Hukuk departmanı (placeholder)",
      "Sınırsız ekip üyesi",
      "Çok seviyeli onay zinciri",
      "Öncelikli senkronizasyon",
      "Gelişmiş tahminleme",
      "Gelişmiş denetim dışa aktarımı",
      "En yüksek AI İşlem kapasitesi",
    ],
    integrations: [
      { name: "Tüm Performance entegrasyonları" },
      { name: "Figma" },
      { name: "Adobe Creative Cloud" },
      { name: "Trendyol / Hepsiburada" },
      { name: "Slack / Notion" },
    ],
    teamMembers: "Sınırsız",
    approvalModel: "Çok seviyeli onay zinciri",
    aiProcessing: "En Yüksek",
    capabilities: [
      "Performance'daki tüm yetenekler",
      "Tam AI kreatif departman",
      "Gelişmiş tahminleme",
      "Çok seviyeli onay zinciri",
      "Gelişmiş denetim dışa aktarımı",
    ],
    cumulativeAgentIds: [
      "ceo", "cmo", "cfo", "accounting",
      "coo", "inventory",
      "creative-director", "graphic-designer", "art-director",
    ],
  },
];

// ── ADD-ON PACKS ──

export const addonPacks: Pack[] = [
  {
    id: "creative-pack",
    name: "Kreatif Paketi",
    tagline: "AI Kreatif Departmanı",
    description: "Marka, içerik ve görsel üretim için tam dahili kreatif ekip.",
    monthlyPrice: 149,
    type: "addon",
    department: "creative",
    requiresCore: true,
    agents: [
      { id: "creative-director", role: "AI Kreatif Direktör", name: "Muse" },
      { id: "art-director", role: "AI Sanat Yönetmeni", name: "Aura" },
      { id: "graphic-designer", role: "AI Grafik Tasarımcı", name: "Pixel" },
    ],
    capabilities: [
      "Kampanya konsept geliştirme",
      "Görsel yön çerçevesi",
      "Kreatif varyant üretimi",
      "Marka mesaj denetimi",
      "İçerik takvimi yönetimi",
    ],
  },
  {
    id: "marketplace-pack",
    name: "Pazaryeri Paketi",
    tagline: "Çoklu Pazar Yeri Yönetimi",
    description: "Trendyol, Hepsiburada, Amazon ve Etsy entegrasyonları.",
    monthlyPrice: 99,
    type: "addon",
    department: "operations",
    requiresCore: true,
    agents: [
      { id: "marketplace-manager", role: "AI Pazaryeri Yöneticisi", name: "Nexus" },
    ],
    capabilities: [
      "Çoklu pazaryeri listeleme",
      "Fiyat senkronizasyonu",
      "Sipariş birleştirme",
      "Performans karşılaştırması",
    ],
  },
  {
    id: "advanced-accounting",
    name: "Gelişmiş Muhasebe",
    tagline: "Kapsamlı Finansal Operasyonlar",
    description: "Çoklu muhasebe sağlayıcı desteği ve gelişmiş raporlama.",
    monthlyPrice: 129,
    type: "addon",
    department: "finance",
    requiresCore: true,
    agents: [
      { id: "senior-accountant", role: "AI Kıdemli Muhasebeci", name: "Ledger" },
    ],
    capabilities: [
      "Çoklu muhasebe entegrasyonu",
      "Gelişmiş gider analizi",
      "Otomatik mutabakat",
      "KDV/vergi optimizasyonu",
    ],
  },
];

// Legacy compat
export const corePack: Pack = {
  id: "core",
  name: "Core Plan",
  tagline: "AI Yönetim İşletim Sistemi",
  description: "Çekirdek departmanlarda AI yönetimi.",
  monthlyPrice: 349,
  type: "core",
  department: "executive",
  requiresCore: false,
  agents: tiers[0].agents,
  capabilities: tiers[0].capabilities,
};

export const allPacks: Pack[] = [corePack, ...addonPacks];

// ── COMPARISON FEATURES ──

export interface ComparisonRow {
  label: string;
  category: string;
  core: string | boolean;
  performance: string | boolean;
  workforce: string | boolean;
}

export const comparisonData: ComparisonRow[] = [
  // Departments
  { label: "Yönetici Departmanı", category: "Departmanlar", core: true, performance: true, workforce: true },
  { label: "Pazarlama Departmanı", category: "Departmanlar", core: true, performance: true, workforce: true },
  { label: "Finans Departmanı", category: "Departmanlar", core: true, performance: true, workforce: true },
  { label: "Operasyon Departmanı", category: "Departmanlar", core: false, performance: true, workforce: true },
  { label: "Kreatif Departmanı", category: "Departmanlar", core: false, performance: false, workforce: true },
  { label: "Hukuk Departmanı", category: "Departmanlar", core: false, performance: false, workforce: "Placeholder" },
  // Agents
  { label: "CEO Agent", category: "Ajanlar", core: true, performance: true, workforce: true },
  { label: "CMO Agent", category: "Ajanlar", core: true, performance: true, workforce: true },
  { label: "CFO Agent", category: "Ajanlar", core: true, performance: true, workforce: true },
  { label: "Accounting Agent", category: "Ajanlar", core: true, performance: true, workforce: true },
  { label: "COO Agent", category: "Ajanlar", core: false, performance: true, workforce: true },
  { label: "Inventory Agent", category: "Ajanlar", core: false, performance: true, workforce: true },
  { label: "Creative Director", category: "Ajanlar", core: false, performance: false, workforce: true },
  { label: "Graphic Designer", category: "Ajanlar", core: false, performance: false, workforce: true },
  { label: "Art Director", category: "Ajanlar", core: false, performance: false, workforce: true },
  // Capabilities
  { label: "Draft-first yazma otomasyonu", category: "Özellikler", core: true, performance: true, workforce: true },
  { label: "Risk Engine", category: "Özellikler", core: "Varsayılan eşikler", performance: "Özel eşikler", workforce: "Özel eşikler" },
  { label: "Onay iş akışı", category: "Özellikler", core: "Tek onay", performance: "Eskalasyon bazlı", workforce: "Çok seviyeli zincir" },
  { label: "Aksiyon Merkezi", category: "Özellikler", core: true, performance: true, workforce: true },
  { label: "Denetim günlükleri", category: "Özellikler", core: true, performance: true, workforce: "Gelişmiş dışa aktarım" },
  { label: "Dinamik RBAC", category: "Özellikler", core: true, performance: true, workforce: true },
  { label: "Gelişmiş tahminleme", category: "Özellikler", core: false, performance: false, workforce: true },
  // Team
  { label: "Ekip üyesi limiti", category: "Ekip", core: "5", performance: "15", workforce: "Sınırsız" },
  // AI Processing
  { label: "AI İşlem kapasitesi", category: "AI İşlem", core: "Temel", performance: "Yüksek", workforce: "En Yüksek" },
  { label: "Senkronizasyon hızı", category: "AI İşlem", core: "Standart", performance: "Hızlı", workforce: "Öncelikli" },
  { label: "Sınırsız AI desteği (fair use)", category: "AI İşlem", core: true, performance: true, workforce: true },
];
