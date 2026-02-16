import { DepartmentId } from "@/contexts/RBACContext";

export type PositionMode = "autopilot" | "advisory" | "hybrid";

export interface ExecutivePosition {
  id: string;
  title: string;
  shortTitle: string;
  departmentId: DepartmentId;
  agentId: string;
  assignedHuman?: {
    name: string;
    email: string;
    avatar?: string;
  };
  mode: PositionMode;
  readScope: "department" | "global";
  writeScope: "department" | "global" | "none";
  approvalAuthority: boolean;
  escalationAuthority: boolean;
  autoExecutionScope: string[];
  decisionRights: string[];
  approvalLimit: string;
}

export const executivePositions: ExecutivePosition[] = [
  {
    id: "pos-ceo",
    title: "Chief Executive Officer",
    shortTitle: "CEO",
    departmentId: "executive",
    agentId: "ceo",
    assignedHuman: { name: "Ahmet Yılmaz", email: "ahmet@company.com" },
    mode: "advisory",
    readScope: "global",
    writeScope: "global",
    approvalAuthority: true,
    escalationAuthority: true,
    autoExecutionScope: ["report.generate", "alert.acknowledge"],
    decisionRights: ["Stratejik yatırım kararları", "Departmanlar arası bütçe tahsisi", "Kritik risk müdahalesi"],
    approvalLimit: "Sınırsız",
  },
  {
    id: "pos-cfo",
    title: "Chief Financial Officer",
    shortTitle: "CFO",
    departmentId: "finance",
    agentId: "cfo",
    assignedHuman: { name: "Elif Öztürk", email: "elif@company.com" },
    mode: "advisory",
    readScope: "global",
    writeScope: "department",
    approvalAuthority: true,
    escalationAuthority: true,
    autoExecutionScope: ["report.generate", "forecast.update"],
    decisionRights: ["Bütçe onay", "Nakit akış yönetimi", "Maliyet optimizasyonu"],
    approvalLimit: "₺500.000",
  },
  {
    id: "pos-cmo",
    title: "Chief Marketing Officer",
    shortTitle: "CMO",
    departmentId: "marketing",
    agentId: "cmo",
    mode: "autopilot",
    readScope: "global",
    writeScope: "department",
    approvalAuthority: true,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate", "campaign.draft", "alert.acknowledge"],
    decisionRights: ["Kampanya bütçe dağılımı", "Kanal stratejisi", "Kreatif onay"],
    approvalLimit: "₺100.000",
  },
  {
    id: "pos-coo",
    title: "Chief Operations Officer",
    shortTitle: "COO",
    departmentId: "operations",
    agentId: "coo",
    mode: "autopilot",
    readScope: "global",
    writeScope: "department",
    approvalAuthority: true,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate", "inventory.reorder_draft"],
    decisionRights: ["Tedarik zinciri optimizasyonu", "SLA yönetimi", "Kapasite planlama"],
    approvalLimit: "₺200.000",
  },
  {
    id: "pos-cto",
    title: "Chief Technology Officer",
    shortTitle: "CTO",
    departmentId: "technology",
    agentId: "cto",
    assignedHuman: { name: "Can Arslan", email: "can@company.com" },
    mode: "advisory",
    readScope: "global",
    writeScope: "department",
    approvalAuthority: true,
    escalationAuthority: true,
    autoExecutionScope: ["report.generate", "deployment.monitor"],
    decisionRights: ["Teknoloji yatırım kararları", "Altyapı değişiklikleri", "Güvenlik politikaları"],
    approvalLimit: "₺300.000",
  },
  {
    id: "pos-cio",
    title: "Chief Information Officer",
    shortTitle: "CIO",
    departmentId: "technology",
    agentId: "cio",
    mode: "autopilot",
    readScope: "global",
    writeScope: "department",
    approvalAuthority: false,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate", "compliance.check"],
    decisionRights: ["Veri yönetişimi", "Bilgi güvenliği stratejisi"],
    approvalLimit: "₺150.000",
  },
  {
    id: "pos-creative",
    title: "Creative Director",
    shortTitle: "Kreatif Direktör",
    departmentId: "creative",
    agentId: "creative-director",
    mode: "autopilot",
    readScope: "department",
    writeScope: "department",
    approvalAuthority: false,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate"],
    decisionRights: ["Marka yönetimi", "Görsel strateji"],
    approvalLimit: "₺50.000",
  },
  {
    id: "pos-marketplace",
    title: "Marketplace Director",
    shortTitle: "Pazaryeri Direktör",
    departmentId: "marketplace",
    agentId: "marketplace-agent",
    mode: "autopilot",
    readScope: "department",
    writeScope: "department",
    approvalAuthority: false,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate", "listing.sync"],
    decisionRights: ["Platform stratejisi", "Fiyat senkronizasyonu"],
    approvalLimit: "₺75.000",
  },
  {
    id: "pos-legal",
    title: "Legal Counsel",
    shortTitle: "Hukuk Danışmanı",
    departmentId: "legal",
    agentId: "legal",
    mode: "autopilot",
    readScope: "global",
    writeScope: "none",
    approvalAuthority: false,
    escalationAuthority: false,
    autoExecutionScope: ["report.generate", "compliance.scan"],
    decisionRights: ["Uyum denetimi", "Sözleşme analizi"],
    approvalLimit: "Salt okunur",
  },
];

// Mock pending decisions
export const pendingDecisions = [
  {
    id: "dec-1",
    title: "Q2 Pazarlama Bütçesini %20 Artır",
    description: "ROAS trendi ve kanal doygunluk analizi doğrultusunda pazarlama bütçesinin artırılması öneriliyor.",
    priority: 95,
    impact: "Gelirde tahmini %12 artış",
    requiredApprovers: ["CEO", "CFO"],
    status: "pending" as const,
    source: "CMO Agent",
    riskLevel: "medium" as const,
    createdAt: "2026-02-16T08:30:00Z",
    simulationBacked: true,
  },
  {
    id: "dec-2",
    title: "Yeni Tedarikçi Sözleşmesi Onayı",
    description: "Mevcut tedarikçi fiyatlarında %8 artış nedeniyle alternatif tedarikçi geçişi değerlendirilmeli.",
    priority: 88,
    impact: "Maliyet tasarrufu: ₺240K/yıl",
    requiredApprovers: ["COO", "CFO"],
    status: "pending" as const,
    source: "COO Agent",
    riskLevel: "low" as const,
    createdAt: "2026-02-15T14:00:00Z",
    simulationBacked: true,
  },
  {
    id: "dec-3",
    title: "Kubernetes Cluster Ölçeklendirme",
    description: "Artan trafik yükü nedeniyle infrastructure kapasitesinin 2x artırılması gerekiyor.",
    priority: 82,
    impact: "Uptime garanti: %99.95 → %99.99",
    requiredApprovers: ["CTO"],
    status: "pending" as const,
    source: "CTO Agent",
    riskLevel: "medium" as const,
    createdAt: "2026-02-16T06:00:00Z",
    simulationBacked: false,
  },
  {
    id: "dec-4",
    title: "Kreatif Varyant A/B Test Başlat",
    description: "Mevcut kreatif materyallerde doygunluk tespit edildi. Yeni varyant testi öneriliyor.",
    priority: 72,
    impact: "CTR tahmini %18 iyileşme",
    requiredApprovers: ["CMO"],
    status: "evaluated" as const,
    source: "Kreatif Direktör Agent",
    riskLevel: "low" as const,
    createdAt: "2026-02-14T10:00:00Z",
    simulationBacked: true,
  },
  {
    id: "dec-5",
    title: "Nakit Rezerv Politikası Güncelleme",
    description: "Mevcut burn rate'e göre nakit tampon süresinin 4 aydan 6 aya çıkarılması öneriliyor.",
    priority: 91,
    impact: "Risk azaltma: Likidite güvenliği",
    requiredApprovers: ["CEO", "CFO"],
    status: "pending" as const,
    source: "CFO Agent",
    riskLevel: "high" as const,
    createdAt: "2026-02-16T09:00:00Z",
    simulationBacked: true,
  },
];

export const getModeLabel = (mode: PositionMode): string => {
  switch (mode) {
    case "autopilot": return "AI Otopilot";
    case "advisory": return "Danışman AI";
    case "hybrid": return "Hibrit";
  }
};

export const getModeColor = (mode: PositionMode): string => {
  switch (mode) {
    case "autopilot": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "advisory": return "text-primary bg-primary/10 border-primary/20";
    case "hybrid": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  }
};
