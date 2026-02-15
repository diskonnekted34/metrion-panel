export type IntegrationStatus = "not_connected" | "connected" | "syncing" | "error";
export type IntegrationCategory =
  | "commerce"
  | "advertising"
  | "finance"
  | "analytics"
  | "crm"
  | "operations"
  | "creative"
  | "social"
  | "marketplace"
  | "fulfillment"
  | "accounting"
  | "subscription"
  | "collaboration";

export interface IntegrationPermission {
  label: string;
  access: string;
  scope: "read" | "write";
}

export interface WriteCapability {
  action: string;
  label: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  draftOnly: boolean;
}

export interface DataHealth {
  syncStatus: "healthy" | "warning" | "error" | "idle";
  lastError?: string;
  apiHealth: "operational" | "degraded" | "down" | "unknown";
  tokenExpiresAt?: string;
  rateLimitPercent?: number;
}

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  comingSoon?: boolean;
  phase2?: boolean;
  permissions: IntegrationPermission[];
  writeCapabilities: WriteCapability[];
  requiredBy: string[];
  writeEnabled?: boolean;
  dataHealth: DataHealth;
  csvSupported: boolean;
}

export const categoryLabels: Record<IntegrationCategory, string> = {
  commerce: "E-Ticaret Platformları",
  advertising: "Reklam Platformları",
  finance: "Ödeme Sistemleri",
  analytics: "Analitik",
  crm: "E-posta / CRM",
  operations: "Operasyon",
  creative: "Kreatif & Tasarım",
  social: "Sosyal Medya",
  marketplace: "Pazar Yerleri",
  fulfillment: "Lojistik & Kargo",
  accounting: "Muhasebe",
  subscription: "Abonelik Yönetimi",
  collaboration: "İşbirliği & İç Araçlar",
};

export const categoryOrder: IntegrationCategory[] = [
  "commerce",
  "advertising",
  "finance",
  "analytics",
  "crm",
  "creative",
  "social",
  "marketplace",
  "fulfillment",
  "accounting",
  "subscription",
  "collaboration",
];

const defaultHealth: DataHealth = {
  syncStatus: "idle",
  apiHealth: "unknown",
};

const connectedHealth: DataHealth = {
  syncStatus: "healthy",
  apiHealth: "operational",
  rateLimitPercent: 12,
};

// ─── E-COMMERCE ────────────────────────────────
const commerceIntegrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: "commerce",
    description: "Sipariş, ürün ve envanter verilerini senkronize edin.",
    status: "not_connected",
    permissions: [
      { label: "Siparişler", access: "salt okunur", scope: "read" },
      { label: "Ürünler", access: "salt okunur", scope: "read" },
      { label: "Envanter", access: "salt okunur", scope: "read" },
      { label: "Ürün Oluşturma", access: "taslak", scope: "write" },
      { label: "Envanter Güncelleme", access: "taslak", scope: "write" },
    ],
    writeCapabilities: [
      { action: "product_create", label: "Taslak Ürün Oluştur", description: "Yeni ürün taslağı oluşturur", riskLevel: "medium", draftOnly: true },
      { action: "product_update", label: "Ürün Güncelle", description: "Mevcut ürünü günceller", riskLevel: "medium", draftOnly: true },
      { action: "inventory_adjust", label: "Envanter Ayarla", description: "Envanter miktarını günceller", riskLevel: "high", draftOnly: true },
    ],
    requiredBy: ["cfo", "product-manager", "cto"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "commerce",
    description: "WooCommerce mağaza verilerinizi bağlayın.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    category: "commerce",
    description: "BigCommerce entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "magento",
    name: "Magento",
    category: "commerce",
    description: "Magento e-ticaret mağazanızı entegre edin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── ADVERTISING ───────────────────────────────
const advertisingIntegrations: Integration[] = [
  {
    id: "meta-ads",
    name: "Meta Ads",
    category: "advertising",
    description: "Kampanya performansı, harcama ve kreatif verilerini çekin.",
    status: "not_connected",
    permissions: [
      { label: "Kampanya verileri", access: "salt okunur", scope: "read" },
      { label: "Harcama", access: "salt okunur", scope: "read" },
      { label: "Kreatif performans", access: "salt okunur", scope: "read" },
      { label: "Kampanya oluşturma", access: "taslak", scope: "write" },
      { label: "Bütçe güncelleme", access: "taslak", scope: "write" },
      { label: "Durdur/Devam", access: "taslak", scope: "write" },
    ],
    writeCapabilities: [
      { action: "campaign_create", label: "Kampanya Oluştur", description: "Yeni reklam kampanyası taslağı", riskLevel: "high", draftOnly: true },
      { action: "budget_update", label: "Bütçe Güncelle", description: "Kampanya bütçesini değiştir", riskLevel: "medium", draftOnly: true },
      { action: "pause_resume", label: "Durdur/Devam Ettir", description: "Kampanya veya reklam setini durdur/devam ettir", riskLevel: "low", draftOnly: true },
    ],
    requiredBy: ["cmo", "nova"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "google-ads",
    name: "Google Ads",
    category: "advertising",
    description: "Google Ads kampanya ve dönüşüm verilerinizi entegre edin.",
    status: "not_connected",
    permissions: [
      { label: "Kampanya verileri", access: "salt okunur", scope: "read" },
      { label: "Dönüşüm verileri", access: "salt okunur", scope: "read" },
      { label: "Kampanya oluşturma", access: "taslak", scope: "write" },
      { label: "Bütçe güncelleme", access: "taslak", scope: "write" },
    ],
    writeCapabilities: [
      { action: "campaign_create", label: "Kampanya Oluştur", description: "Yeni kampanya taslağı", riskLevel: "high", draftOnly: true },
      { action: "budget_update", label: "Bütçe Güncelle", description: "Bütçe değişikliği", riskLevel: "medium", draftOnly: true },
    ],
    requiredBy: ["cmo", "nova"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    category: "advertising",
    description: "TikTok reklam performansı entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "pinterest-ads",
    name: "Pinterest Ads",
    category: "advertising",
    description: "Pinterest reklam kampanyalarını yönetin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "snap-ads",
    name: "Snap Ads",
    category: "advertising",
    description: "Snapchat reklam verilerini entegre edin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    category: "advertising",
    description: "LinkedIn reklam kampanya verilerini çekin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── PAYMENTS ──────────────────────────────────
const financeIntegrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    category: "finance",
    description: "Ödeme, abonelik ve gelir verilerini senkronize edin.",
    status: "not_connected",
    permissions: [
      { label: "Ödemeler", access: "salt okunur", scope: "read" },
      { label: "Abonelikler", access: "salt okunur", scope: "read" },
      { label: "Faturalar", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: ["cfo", "atlas", "vega"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "shopify-payments",
    name: "Shopify Payments",
    category: "finance",
    description: "Shopify üzerinden ödeme verilerini çekin.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "finance",
    description: "PayPal işlem ve ödeme verilerini bağlayın.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "iyzico",
    name: "iyzico",
    category: "finance",
    description: "iyzico ödeme altyapısı entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "paytr",
    name: "PayTR",
    category: "finance",
    description: "PayTR ödeme sistemi entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── ANALYTICS ─────────────────────────────────
const analyticsIntegrations: Integration[] = [
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "analytics",
    description: "Web sitesi trafiği ve kullanıcı davranışı verilerini çekin.",
    status: "not_connected",
    permissions: [
      { label: "Trafik verileri", access: "salt okunur", scope: "read" },
      { label: "Dönüşüm verileri", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: ["cmo", "cso"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "gsc",
    name: "Google Search Console",
    category: "analytics",
    description: "SEO performansı ve arama verilerini entegre edin.",
    status: "not_connected",
    permissions: [
      { label: "Arama performansı", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: ["seo-specialist"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    category: "analytics",
    description: "Ürün analitik verilerini entegre edin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "amplitude",
    name: "Amplitude",
    category: "analytics",
    description: "Davranış analitik verilerini çekin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "hotjar",
    name: "Hotjar",
    category: "analytics",
    description: "Kullanıcı davranışı ısı haritaları ve kayıtları.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "clarity",
    name: "Microsoft Clarity",
    category: "analytics",
    description: "Ücretsiz kullanıcı davranışı analitiği.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── EMAIL / CRM ───────────────────────────────
const crmIntegrations: Integration[] = [
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "crm",
    description: "E-posta pazarlama ve müşteri segmentasyon verilerini bağlayın.",
    status: "not_connected",
    permissions: [
      { label: "Kampanyalar", access: "salt okunur", scope: "read" },
      { label: "Segmentler", access: "salt okunur", scope: "read" },
      { label: "Kampanya taslağı oluşturma", access: "taslak", scope: "write" },
    ],
    writeCapabilities: [
      { action: "campaign_draft", label: "Kampanya Taslağı", description: "E-posta kampanya taslağı oluştur", riskLevel: "medium", draftOnly: true },
      { action: "campaign_update", label: "Taslak Güncelle", description: "Mevcut taslağı düzenle", riskLevel: "low", draftOnly: true },
    ],
    requiredBy: ["email-marketing"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "crm",
    description: "Mailchimp kampanya ve abone verilerini çekin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    description: "HubSpot CRM ve pazarlama otomasyonu entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "activecampaign",
    name: "ActiveCampaign",
    category: "crm",
    description: "ActiveCampaign otomasyon ve CRM verileri.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "omnisend",
    name: "Omnisend",
    category: "crm",
    description: "Omnisend e-ticaret pazarlama otomasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── CREATIVE ──────────────────────────────────
const creativeIntegrations: Integration[] = [
  {
    id: "canva",
    name: "Canva",
    category: "creative",
    description: "Tasarım taslakları oluşturun, marka kitini yönetin ve şablonlara erişin.",
    status: "not_connected",
    permissions: [
      { label: "Tasarım oluşturma", access: "taslak", scope: "write" },
      { label: "Şablon düzenleme", access: "okuma/yazma", scope: "write" },
      { label: "Marka kiti erişimi", access: "salt okunur", scope: "read" },
      { label: "Tasarım dışa aktarma", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [
      { action: "design_create", label: "Tasarım Taslağı Oluştur", description: "Yeni tasarım taslağı oluşturur", riskLevel: "low", draftOnly: true },
      { action: "design_update", label: "Tasarım Taslağı Güncelle", description: "Mevcut taslağı düzenler", riskLevel: "low", draftOnly: true },
    ],
    requiredBy: ["muse", "graphic-designer", "art-director", "brand-manager"],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "figma",
    name: "Figma",
    category: "creative",
    description: "Tasarım dosyaları oluşturun, bileşen kütüphanesine erişin.",
    status: "not_connected",
    permissions: [
      { label: "Dosya oluşturma", access: "taslak", scope: "write" },
      { label: "Bileşen düzenleme", access: "okuma/yazma", scope: "write" },
      { label: "Kütüphane erişimi", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [
      { action: "file_create", label: "Tasarım Dosyası Oluştur", description: "Yeni Figma dosya taslağı", riskLevel: "low", draftOnly: true },
    ],
    requiredBy: ["graphic-designer", "art-director"],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    category: "creative",
    description: "Adobe CC API'leri ile kreatif iş akışlarını entegre edin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── SOCIAL MEDIA ──────────────────────────────
const socialIntegrations: Integration[] = [
  {
    id: "instagram-business",
    name: "Instagram Business",
    category: "social",
    description: "Instagram iş hesabı metrikleri ve içerik performansı.",
    status: "not_connected",
    permissions: [
      { label: "İçerik metrikleri", access: "salt okunur", scope: "read" },
      { label: "Kitle verileri", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: ["social-media-manager"],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "facebook-pages",
    name: "Facebook Pages",
    category: "social",
    description: "Facebook sayfa metrikleri ve etkileşim verileri.",
    status: "not_connected",
    permissions: [
      { label: "Sayfa metrikleri", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: ["social-media-manager"],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "tiktok-business",
    name: "TikTok Business",
    category: "social",
    description: "TikTok iş hesabı analitikleri.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "youtube-studio",
    name: "YouTube Studio",
    category: "social",
    description: "YouTube kanal analitikleri ve performans verileri.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── MARKETPLACES ──────────────────────────────
const marketplaceIntegrations: Integration[] = [
  {
    id: "amazon-seller",
    name: "Amazon Seller Central",
    category: "marketplace",
    description: "Amazon satıcı verilerini entegre edin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "trendyol",
    name: "Trendyol",
    category: "marketplace",
    description: "Trendyol mağaza ve sipariş verilerini çekin.",
    status: "not_connected",
    permissions: [
      { label: "Siparişler", access: "salt okunur", scope: "read" },
      { label: "Ürünler", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "hepsiburada",
    name: "Hepsiburada",
    category: "marketplace",
    description: "Hepsiburada mağaza entegrasyonu.",
    status: "not_connected",
    permissions: [
      { label: "Siparişler", access: "salt okunur", scope: "read" },
      { label: "Ürünler", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "etsy",
    name: "Etsy",
    category: "marketplace",
    description: "Etsy mağaza ve sipariş verileri.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "ebay",
    name: "eBay",
    category: "marketplace",
    description: "eBay mağaza ve satış verilerini çekin.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── FULFILLMENT / SHIPPING ────────────────────
const fulfillmentIntegrations: Integration[] = [
  {
    id: "shippo",
    name: "Shippo",
    category: "fulfillment",
    description: "Kargo takip ve gönderim yönetimi.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "shipstation",
    name: "ShipStation",
    category: "fulfillment",
    description: "ShipStation gönderim entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "easyship",
    name: "EasyShip",
    category: "fulfillment",
    description: "EasyShip uluslararası kargo yönetimi.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "dhl",
    name: "DHL",
    category: "fulfillment",
    description: "DHL kargo takip entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "ups",
    name: "UPS",
    category: "fulfillment",
    description: "UPS gönderim takip entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "fedex",
    name: "FedEx",
    category: "fulfillment",
    description: "FedEx kargo yönetimi.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "yurtici",
    name: "Yurtiçi Kargo",
    category: "fulfillment",
    description: "Yurtiçi Kargo takip ve yönetim.",
    status: "not_connected",
    permissions: [
      { label: "Gönderi takip", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "mng",
    name: "MNG Kargo",
    category: "fulfillment",
    description: "MNG Kargo entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "hepsijet",
    name: "Hepsijet",
    category: "fulfillment",
    description: "Hepsijet teslimat entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── ACCOUNTING ────────────────────────────────
const accountingIntegrations: Integration[] = [
  {
    id: "parasut",
    name: "Paraşüt",
    category: "accounting",
    description: "Paraşüt muhasebe ve faturalama entegrasyonu.",
    status: "not_connected",
    permissions: [
      { label: "Faturalar", access: "salt okunur", scope: "read" },
      { label: "Fatura taslağı oluşturma", access: "taslak", scope: "write" },
    ],
    writeCapabilities: [
      { action: "invoice_draft", label: "Fatura Taslağı", description: "Taslak fatura oluşturur", riskLevel: "medium", draftOnly: true },
      { action: "journal_draft", label: "Yevmiye Taslağı", description: "Taslak yevmiye kaydı", riskLevel: "high", draftOnly: true },
    ],
    requiredBy: ["cfo", "atlas"],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "logo",
    name: "Logo",
    category: "accounting",
    description: "Logo muhasebe yazılımı entegrasyonu.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "accounting",
    description: "Muhasebe ve finansal raporlama entegrasyonu.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "xero",
    name: "Xero",
    category: "accounting",
    description: "Xero muhasebe verilerinizi entegre edin.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "mikro",
    name: "Mikro",
    category: "accounting",
    description: "Mikro ERP muhasebe entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "netsuite",
    name: "NetSuite",
    category: "accounting",
    description: "Oracle NetSuite ERP entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
];

// ─── SUBSCRIPTION ──────────────────────────────
const subscriptionIntegrations: Integration[] = [
  {
    id: "recharge",
    name: "Recharge",
    category: "subscription",
    description: "Recharge abonelik yönetimi entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "bold-subscriptions",
    name: "Bold Subscriptions",
    category: "subscription",
    description: "Bold abonelik platformu entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── COLLABORATION ─────────────────────────────
const collaborationIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    category: "collaboration",
    description: "Slack bildirim ve kanal entegrasyonu.",
    status: "not_connected",
    permissions: [
      { label: "Mesaj gönderme", access: "bildirim", scope: "write" },
      { label: "Kanal okuma", access: "salt okunur", scope: "read" },
    ],
    writeCapabilities: [
      { action: "send_notification", label: "Bildirim Gönder", description: "Slack kanalına bildirim gönderir", riskLevel: "low", draftOnly: false },
    ],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "notion",
    name: "Notion",
    category: "collaboration",
    description: "Notion sayfa ve veritabanı entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    category: "collaboration",
    description: "Google Sheets veri senkronizasyonu.",
    status: "not_connected",
    permissions: [
      { label: "Tablo okuma", access: "salt okunur", scope: "read" },
      { label: "Tablo yazma", access: "okuma/yazma", scope: "write" },
    ],
    writeCapabilities: [
      { action: "sheet_write", label: "Tabloya Yaz", description: "Veri raporunu tabloya yazar", riskLevel: "low", draftOnly: true },
    ],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: true,
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "collaboration",
    description: "Airtable veritabanı entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    writeCapabilities: [],
    requiredBy: [],
    dataHealth: defaultHealth,
    csvSupported: false,
  },
];

// ─── AGGREGATED EXPORT ─────────────────────────
export const integrations: Integration[] = [
  ...commerceIntegrations,
  ...advertisingIntegrations,
  ...financeIntegrations,
  ...analyticsIntegrations,
  ...crmIntegrations,
  ...creativeIntegrations,
  ...socialIntegrations,
  ...marketplaceIntegrations,
  ...fulfillmentIntegrations,
  ...accountingIntegrations,
  ...subscriptionIntegrations,
  ...collaborationIntegrations,
];

/** Get agent dependency message for missing integrations */
export function getAgentIntegrationStatus(agentId: string, connectedIds: string[]): {
  status: "active" | "limited" | "inactive";
  missingIntegrations: Integration[];
  message?: string;
} {
  const required = integrations.filter(
    i => i.requiredBy.includes(agentId) && !i.comingSoon && !i.phase2
  );
  if (required.length === 0) return { status: "active", missingIntegrations: [] };

  const missing = required.filter(i => !connectedIds.includes(i.id));
  if (missing.length === 0) return { status: "active", missingIntegrations: [] };
  if (missing.length === required.length) {
    return {
      status: "inactive",
      missingIntegrations: missing,
      message: `${missing.map(i => i.name).join(", ")} bağlantısı gerekli.`,
    };
  }
  return {
    status: "limited",
    missingIntegrations: missing,
    message: `${missing.map(i => i.name).join(", ")} eksik.`,
  };
}

/** Check if integration has write capabilities */
export function hasWriteCapabilities(id: string): boolean {
  const integ = integrations.find(i => i.id === id);
  return (integ?.writeCapabilities.length ?? 0) > 0;
}

/** Get all write-capable integrations */
export function getWriteCapableIntegrations(): Integration[] {
  return integrations.filter(i => i.writeCapabilities.length > 0 && !i.comingSoon && !i.phase2);
}
