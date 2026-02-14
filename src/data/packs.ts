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
    name: "Executive Core",
    tagline: "Foundational management intelligence.",
    description: "Core executive-level AI management across all departments.",
    monthlyPrice: 249,
    agents: [
      { id: "ceo", role: "AI CEO", name: "Executive Operator" },
      { id: "cfo", role: "AI CFO", name: "Profit & Cashflow Guardian" },
      { id: "cmo", role: "AI CMO", name: "Performance & Creative Director" },
      { id: "product-manager", role: "AI Product Manager", name: "Forge" },
      { id: "cto", role: "AI Operations Planner", name: "Systems & Automation Lead" },
      { id: "legal", role: "AI Legal Desk", name: "Legal Risk Analyst" },
    ],
    capabilities: [
      "Company Health Score",
      "Contribution margin monitoring",
      "Campaign oversight",
      "SKU analysis",
      "Inventory risk detection",
      "Weekly executive rhythm",
      "Cross-department task orchestration",
    ],
    cumulativeAgentIds: ["ceo", "cfo", "cmo", "product-manager", "cto", "legal"],
  },
  {
    id: "performance",
    name: "Performance",
    tagline: "Growth and financial optimization layer.",
    description: "Everything in Core plus advanced growth and finance capabilities.",
    monthlyPrice: 449,
    badge: "Most Popular",
    agents: [
      { id: "nova", role: "AI Performance Marketer", name: "Nova" },
      { id: "atlas", role: "AI Finance Analyst", name: "Atlas" },
      { id: "cso", role: "Advanced Funnel Optimizer", name: "Strategy & Growth Architect" },
    ],
    capabilities: [
      "Creative fatigue detection",
      "CPA anomaly detection",
      "Deep expense analysis",
      "Funnel drop-off diagnostics",
      "Budget reallocation modeling",
    ],
    cumulativeAgentIds: ["ceo", "cfo", "cmo", "product-manager", "cto", "legal", "nova", "atlas", "cso"],
  },
  {
    id: "ai-workforce",
    name: "AI Workforce",
    tagline: "Full AI-powered internal team.",
    description: "Everything in Performance plus full creative, finance ops, and automation.",
    monthlyPrice: 699,
    badge: "Best Value",
    agents: [
      { id: "muse", role: "Creative Director", name: "Muse" },
      { id: "art-director", role: "Art Director", name: "Aura" },
      { id: "graphic-designer", role: "Graphic Designer", name: "Pixel" },
      { id: "brand-manager", role: "Brand Manager", name: "Prism" },
      { id: "social-media-manager", role: "Social Media Manager", name: "Echo" },
      { id: "vega", role: "Accounting Assistant", name: "Vega" },
      { id: "aria", role: "Automation Architect", name: "Aria" },
    ],
    capabilities: [
      "Full AI creative department",
      "Financial operations intelligence",
      "Automation monitoring",
      "Content and brand systems",
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
    name: "Creative Expansion Pack",
    tagline: "AI Creative Department",
    description: "Full in-house creative team for brand, content, and visual production.",
    monthlyPrice: 149,
    type: "addon",
    department: "marketing",
    requiresCore: true,
    agents: [
      { id: "muse", role: "AI Creative Director", name: "Muse" },
      { id: "art-director", role: "AI Art Director", name: "Aura" },
      { id: "graphic-designer", role: "AI Graphic Designer", name: "Pixel" },
      { id: "brand-manager", role: "AI Brand Manager", name: "Prism" },
      { id: "social-media-manager", role: "AI Social Media Manager", name: "Echo" },
    ],
    capabilities: [
      "Campaign concept development",
      "Visual direction framework",
      "Creative variant generation",
      "Brand messaging audit",
      "Content calendar management",
      "Hook & caption generation",
      "Engagement risk analysis",
    ],
  },
  {
    id: "finance-operations",
    name: "Finance Operations Pack",
    tagline: "Financial Operations Intelligence",
    description: "Detailed financial analysis, expense tracking, and compliance monitoring.",
    monthlyPrice: 99,
    type: "addon",
    department: "finance",
    requiresCore: true,
    agents: [
      { id: "atlas", role: "AI Finance Analyst", name: "Atlas" },
      { id: "vega", role: "AI Accounting Assistant", name: "Vega" },
    ],
    capabilities: [
      "Detailed expense breakdown",
      "Refund pattern detection",
      "Cost anomaly monitoring",
      "Invoice & VAT tracking",
      "Monthly bookkeeping summary",
      "Department cost ratios",
    ],
  },
  {
    id: "technology-automation",
    name: "Automation Pack",
    tagline: "Automation & Data Integrity Layer",
    description: "System health monitoring, automation coverage, and data integrity.",
    monthlyPrice: 99,
    type: "addon",
    department: "technology",
    requiresCore: true,
    agents: [
      { id: "aria", role: "AI Automation Architect", name: "Aria" },
    ],
    capabilities: [
      "Integration health monitoring",
      "Attribution integrity checks",
      "Automation coverage map",
      "Process bottleneck detection",
    ],
  },
];

// Legacy compat
export const corePack: Pack = {
  id: "executive-core",
  name: "E-Commerce Executive Bundle",
  tagline: "AI Management Operating System",
  description: "Complete executive-level AI management across all core departments.",
  monthlyPrice: 249,
  type: "core",
  department: "executive",
  requiresCore: false,
  agents: tiers[0].agents,
  capabilities: tiers[0].capabilities,
};

export const allPacks: Pack[] = [corePack, ...addonPacks];
