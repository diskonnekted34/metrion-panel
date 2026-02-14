export type IntegrationStatus = "not_connected" | "connected" | "syncing" | "error";
export type IntegrationCategory = "commerce" | "advertising" | "finance" | "analytics" | "crm" | "operations";

export interface IntegrationPermission {
  label: string;
  access: string;
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
  /** Which agent IDs depend on this integration */
  requiredBy: string[];
}

export const categoryLabels: Record<IntegrationCategory, string> = {
  commerce: "Ticaret Katmanı",
  advertising: "Reklam Katmanı",
  finance: "Finans & Ödemeler",
  analytics: "Analitik",
  crm: "CRM & Müşteri Tutundurma",
  operations: "Operasyon",
};

export const categoryOrder: IntegrationCategory[] = [
  "commerce", "advertising", "finance", "analytics", "crm", "operations",
];

export const integrations: Integration[] = [
  // Commerce
  {
    id: "shopify",
    name: "Shopify",
    category: "commerce",
    description: "Sipariş, ürün ve envanter verilerini senkronize edin.",
    status: "not_connected",
    permissions: [
      { label: "Siparişler", access: "salt okunur" },
      { label: "Ürünler", access: "salt okunur" },
      { label: "Envanter", access: "salt okunur" },
    ],
    requiredBy: ["cfo", "product-manager", "cto"],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "commerce",
    description: "WooCommerce mağaza verilerinizi bağlayın.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    requiredBy: [],
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    category: "commerce",
    description: "BigCommerce entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    requiredBy: [],
  },
  // Advertising
  {
    id: "meta-ads",
    name: "Meta Ads",
    category: "advertising",
    description: "Kampanya performansı, harcama ve kreatif verilerini çekin.",
    status: "not_connected",
    permissions: [
      { label: "Kampanya verileri", access: "salt okunur" },
      { label: "Harcama", access: "salt okunur" },
      { label: "Kreatif performans", access: "salt okunur" },
    ],
    requiredBy: ["cmo", "nova"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    category: "advertising",
    description: "Google Ads kampanya ve dönüşüm verilerinizi entegre edin.",
    status: "not_connected",
    permissions: [
      { label: "Kampanya verileri", access: "salt okunur" },
      { label: "Dönüşüm verileri", access: "salt okunur" },
    ],
    requiredBy: ["cmo", "nova"],
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    category: "advertising",
    description: "TikTok reklam performansı entegrasyonu.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    requiredBy: [],
  },
  // Finance
  {
    id: "stripe",
    name: "Stripe",
    category: "finance",
    description: "Ödeme, abonelik ve gelir verilerini senkronize edin.",
    status: "not_connected",
    permissions: [
      { label: "Ödemeler", access: "salt okunur" },
      { label: "Abonelikler", access: "salt okunur" },
      { label: "Faturalar", access: "salt okunur" },
    ],
    requiredBy: ["cfo", "atlas", "vega"],
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "finance",
    description: "PayPal işlem ve ödeme verilerini bağlayın.",
    status: "not_connected",
    comingSoon: true,
    permissions: [],
    requiredBy: [],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "finance",
    description: "Muhasebe ve finansal raporlama entegrasyonu.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    requiredBy: [],
  },
  {
    id: "xero",
    name: "Xero",
    category: "finance",
    description: "Xero muhasebe verilerinizi entegre edin.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    requiredBy: [],
  },
  // Analytics
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "analytics",
    description: "Web sitesi trafiği ve kullanıcı davranışı verilerini çekin.",
    status: "not_connected",
    permissions: [
      { label: "Trafik verileri", access: "salt okunur" },
      { label: "Dönüşüm verileri", access: "salt okunur" },
    ],
    requiredBy: ["cmo", "cso"],
  },
  // CRM
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "crm",
    description: "E-posta pazarlama ve müşteri segmentasyon verilerini bağlayın.",
    status: "not_connected",
    phase2: true,
    permissions: [],
    requiredBy: [],
  },
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
