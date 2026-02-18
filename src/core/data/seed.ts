/**
 * Seed Data for all 13 core tables.
 * Realistic mock data for the default tenant.
 */

import { Tenant, User, Membership, Seat, SeatKey } from "../types/identity";
import { getCapabilitiesForLevel } from "../engine/seats";

export const DEFAULT_TENANT_ID = "tenant_001";

// ── Tenant ──────────────────────────────────────────────
export const seedTenant: Tenant = {
  id: DEFAULT_TENANT_ID,
  name: "Punta Visual",
  slug: "punta-visual",
  plan: "workforce",
  status: "active",
  settings: {
    default_currency: "USD",
    fiscal_year_start: 1,
    timezone: "Europe/Istanbul",
    ai_processing_credits: 5000,
    auto_top_up_enabled: true,
  },
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2026-02-01T00:00:00Z",
};

// ── Users ───────────────────────────────────────────────
export const seedUsers: User[] = [
  { id: "u1", email: "ahmet@company.com", full_name: "Ahmet Yılmaz", status: "active", created_at: "2024-01-15T00:00:00Z", last_login_at: "2026-02-18T08:00:00Z" },
  { id: "u2", email: "zeynep@company.com", full_name: "Zeynep Kaya", status: "active", created_at: "2024-02-01T00:00:00Z", last_login_at: "2026-02-17T14:00:00Z" },
  { id: "u3", email: "mehmet@company.com", full_name: "Mehmet Demir", status: "active", created_at: "2024-03-10T00:00:00Z" },
  { id: "u4", email: "elif@company.com", full_name: "Elif Öztürk", status: "active", created_at: "2024-03-15T00:00:00Z" },
  { id: "u5", email: "can@company.com", full_name: "Can Arslan", status: "active", created_at: "2024-04-01T00:00:00Z" },
  { id: "u6", email: "selin@company.com", full_name: "Selin Çelik", status: "active", created_at: "2024-05-20T00:00:00Z" },
];

// ── Memberships ─────────────────────────────────────────
export const seedMemberships: Membership[] = [
  { id: "m1", tenant_id: DEFAULT_TENANT_ID, user_id: "u1", legacy_role: "owner", joined_at: "2024-01-15T00:00:00Z" },
  { id: "m2", tenant_id: DEFAULT_TENANT_ID, user_id: "u2", legacy_role: "admin", joined_at: "2024-02-01T00:00:00Z" },
  { id: "m3", tenant_id: DEFAULT_TENANT_ID, user_id: "u3", legacy_role: "department_lead", joined_at: "2024-03-10T00:00:00Z" },
  { id: "m4", tenant_id: DEFAULT_TENANT_ID, user_id: "u4", legacy_role: "department_lead", joined_at: "2024-03-15T00:00:00Z" },
  { id: "m5", tenant_id: DEFAULT_TENANT_ID, user_id: "u5", legacy_role: "operator", joined_at: "2024-04-01T00:00:00Z" },
  { id: "m6", tenant_id: DEFAULT_TENANT_ID, user_id: "u6", legacy_role: "viewer", joined_at: "2024-05-20T00:00:00Z" },
];

// ── Seats ────────────────────────────────────────────────
function makeSeat(key: SeatKey, label: string, dept: string, authority: number, humanId: string | null, aiMode: "advisory" | "hybrid" | "autonomous" = "hybrid"): Seat {
  return {
    id: `seat_${key.toLowerCase()}`,
    tenant_id: DEFAULT_TENANT_ID,
    seat_key: key,
    label,
    department_key: dept,
    authority_level: authority,
    ai_mode: aiMode,
    human_user_id: humanId,
    capabilities: getCapabilitiesForLevel(authority),
    created_at: "2024-01-15T00:00:00Z",
  };
}

export const seedSeats: Seat[] = [
  // Executive
  makeSeat("CEO", "CEO", "executive", 100, "u1"),
  // Finance
  makeSeat("CFO", "CFO", "finance", 95, "u4"),
  makeSeat("ACCOUNTING_LEAD", "Muhasebe Lideri", "finance", 55, null, "autonomous"),
  // Technology
  makeSeat("CTO", "CTO", "technology", 90, null, "advisory"),
  makeSeat("CIO", "CIO", "technology", 85, null, "advisory"),
  // Marketing
  makeSeat("CMO", "CMO", "marketing", 90, "u3"),
  makeSeat("GROWTH_LEAD", "Büyüme Lideri", "marketing", 55, null, "autonomous"),
  // Operations
  makeSeat("COO", "COO", "operations", 90, null, "advisory"),
  makeSeat("INVENTORY_LEAD", "Envanter Lideri", "operations", 50, "u5", "hybrid"),
  // HR
  makeSeat("CHRO", "CHRO", "hr", 90, null, "advisory"),
  makeSeat("HR_ANALYTICS", "İK Analitik", "hr", 55, null, "autonomous"),
  makeSeat("TALENT_ACQUISITION", "Yetenek Kazanım", "hr", 55, null, "autonomous"),
  makeSeat("COMPENSATION_LEAD", "Ücretlendirme Lideri", "hr", 60, null, "hybrid"),
  // Sales
  makeSeat("SALES_DIRECTOR", "Satış Direktörü", "sales", 85, null, "advisory"),
  makeSeat("REVENUE_INTEL", "Gelir İstihbaratı", "sales", 55, null, "autonomous"),
  makeSeat("SALES_OPS", "Satış Operasyonları", "sales", 50, null, "autonomous"),
  makeSeat("CUSTOMER_SUCCESS", "Müşteri Başarısı", "sales", 55, null, "autonomous"),
  // Creative
  makeSeat("CREATIVE_DIRECTOR", "Kreatif Direktör", "creative", 80, null, "advisory"),
  makeSeat("GRAPHIC_DESIGNER", "Grafik Tasarımcı", "creative", 45, null, "autonomous"),
  makeSeat("ART_DIRECTOR", "Sanat Yönetmeni", "creative", 65, null, "hybrid"),
  // Marketplace
  makeSeat("MARKETPLACE_LEAD", "Pazaryeri Lideri", "marketplace", 70, null, "hybrid"),
  // Legal
  makeSeat("LEGAL_COUNSEL", "Hukuk Danışmanı", "legal", 80, null, "advisory"),
];
