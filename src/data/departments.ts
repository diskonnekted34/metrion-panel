/**
 * Department data — extracted from RBACContext for reuse across the app.
 * This is the single source of truth for department definitions.
 */

export type DepartmentId =
  | "executive"
  | "marketing"
  | "finance"
  | "operations"
  | "creative"
  | "marketplace"
  | "legal"
  | "technology"
  | "hr"
  | "sales";

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  agentIds: string[];
  healthScore: number;
  activeAlerts: number;
  activeTasks: number;
  trend: "up" | "down" | "stable";
  description: string;
}

export const ALL_DEPARTMENT_IDS: DepartmentId[] = [
  "executive", "marketing", "finance", "operations", "creative",
  "marketplace", "legal", "technology", "hr", "sales",
];

export const departments: Department[] = [
  { id: "executive", name: "Yönetim", icon: "🧭", agentIds: ["ceo"], healthScore: 82, activeAlerts: 1, activeTasks: 4, trend: "up", description: "Stratejik önceliklendirme, karar yönetimi ve yönetici brifingleri." },
  { id: "technology", name: "Teknoloji", icon: "🧠", agentIds: ["cto", "cio"], healthScore: 88, activeAlerts: 2, activeTasks: 6, trend: "up", description: "Teknoloji altyapısı, bilgi sistemleri ve dijital dönüşüm yönetimi." },
  { id: "marketing", name: "Pazarlama", icon: "📣", agentIds: ["cmo", "growth-agent"], healthScore: 68, activeAlerts: 3, activeTasks: 8, trend: "down", description: "Kampanya stratejisi, performans izleme ve büyüme yönetimi." },
  { id: "finance", name: "Finans", icon: "💰", agentIds: ["cfo", "accounting-agent"], healthScore: 91, activeAlerts: 1, activeTasks: 3, trend: "up", description: "Kârlılık analizi, nakit akış tahmini ve bütçe kontrolü." },
  { id: "operations", name: "Operasyon", icon: "⚙️", agentIds: ["coo", "inventory-agent"], healthScore: 74, activeAlerts: 2, activeTasks: 5, trend: "stable", description: "Tedarik zinciri, envanter yönetimi ve süreç optimizasyonu." },
  { id: "creative", name: "Kreatif", icon: "✨", agentIds: ["creative-director", "graphic-designer", "art-director"], healthScore: 79, activeAlerts: 1, activeTasks: 6, trend: "up", description: "Marka yönetimi, görsel üretim ve kreatif strateji." },
  { id: "marketplace", name: "Pazaryeri", icon: "🛒", agentIds: ["marketplace-agent"], healthScore: 76, activeAlerts: 1, activeTasks: 4, trend: "stable", description: "Çoklu pazaryeri listeleme, fiyat senkronizasyonu ve sipariş yönetimi." },
  { id: "legal", name: "Hukuk", icon: "⚖️", agentIds: ["legal"], healthScore: 85, activeAlerts: 0, activeTasks: 0, trend: "stable", description: "Sözleşme analizi, uyum denetimi ve hukuki risk değerlendirmesi." },
  { id: "hr", name: "İnsan Kaynakları", icon: "🧑‍💼", agentIds: ["chro", "hr-analytics", "talent-acquisition", "compensation-agent"], healthScore: 73, activeAlerts: 3, activeTasks: 7, trend: "down", description: "İşe alım, yetenek yönetimi, ücretlendirme ve çalışan bağlılığı." },
  { id: "sales", name: "Satış", icon: "🤝", agentIds: ["sales-director", "revenue-intel", "sales-ops", "customer-success"], healthScore: 77, activeAlerts: 2, activeTasks: 9, trend: "up", description: "Gelir yönetimi, pipeline analizi, müşteri başarısı ve satış operasyonları." },
];
