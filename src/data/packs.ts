export interface PackAgent {
  id: string;
  role: string;
  name: string;
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

export const corePack: Pack = {
  id: "executive-bundle",
  name: "E-Commerce Executive Bundle",
  tagline: "AI Management Operating System",
  description: "Complete executive-level AI management across all core departments.",
  monthlyPrice: 1490,
  type: "core",
  department: "executive",
  requiresCore: false,
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
    "Cross-department coordination",
    "Contribution margin monitoring",
    "Campaign performance oversight",
    "SKU analysis",
    "Inventory risk detection",
    "Legal compliance alerts",
    "Task orchestration",
    "Weekly Executive Rhythm",
  ],
};

export const addonPacks: Pack[] = [
  {
    id: "growth-performance",
    name: "Growth Performance Pack",
    tagline: "Performance Acceleration Layer",
    description: "Advanced growth analytics, funnel optimization, and budget modeling.",
    monthlyPrice: 490,
    type: "addon",
    department: "marketing",
    requiresCore: true,
    agents: [
      { id: "nova", role: "AI Performance Marketer", name: "Nova" },
      { id: "cso", role: "Advanced Funnel Optimizer", name: "Strategy & Growth Architect" },
    ],
    capabilities: [
      "Creative fatigue detection",
      "Ad-level CPA anomaly detection",
      "Funnel drop-off deep analysis",
      "Budget reallocation modeling",
      "Growth experimentation planning",
    ],
  },
  {
    id: "finance-operations",
    name: "Finance Operations Pack",
    tagline: "Financial Operations Intelligence",
    description: "Detailed financial analysis, expense tracking, and compliance monitoring.",
    monthlyPrice: 390,
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
    id: "creative-expansion",
    name: "Creative Expansion Pack",
    tagline: "AI Creative Department",
    description: "Full in-house creative team for brand, content, and visual production.",
    monthlyPrice: 590,
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
    id: "technology-automation",
    name: "Technology & Automation Pack",
    tagline: "Automation & Data Integrity Layer",
    description: "System health monitoring, automation coverage, and data integrity.",
    monthlyPrice: 290,
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

export const allPacks: Pack[] = [corePack, ...addonPacks];
