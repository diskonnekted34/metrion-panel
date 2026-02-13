import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import avatar6 from "@/assets/avatar-6.jpg";

export interface Expert {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  category: string;
  tags: string[];
  description: string;
  rating: number;
  reviews: number;
  badge: "Certified" | "Pro" | "Elite";
  priceModel: string;
  tasksCompleted: number;
  about: string;
  capabilities: string[];
  industries: string[];
  tools: string[];
  skills: { name: string; level: number }[];
  pricing: {
    credits: string;
    subscription: string;
    enterprise: string;
  };
  userReviews: { name: string; rating: number; comment: string; date: string }[];
}

export const experts: Expert[] = [
  {
    id: "lexis",
    name: "Lexis",
    tagline: "AI Legal Advisor",
    avatar: avatar1,
    category: "Legal",
    tags: ["Contract Law", "Compliance", "Due Diligence"],
    description: "Expert in contract analysis, legal compliance, and regulatory frameworks.",
    rating: 4.9,
    reviews: 1247,
    badge: "Elite",
    priceModel: "Subscription",
    tasksCompleted: 18420,
    about: "Lexis is a state-of-the-art AI legal professional trained on millions of legal documents, case studies, and regulatory frameworks. Specializing in contract law, compliance auditing, and due diligence processes, Lexis provides rapid, accurate legal analysis that would traditionally take teams of lawyers days to complete.",
    capabilities: ["Contract drafting & review", "Regulatory compliance checks", "Legal risk assessment", "Due diligence automation", "Intellectual property analysis", "Employment law guidance"],
    industries: ["Technology", "Finance", "Healthcare", "Real Estate", "Manufacturing"],
    tools: ["DocuSign", "Clio", "LexisNexis", "Westlaw", "Google Workspace"],
    skills: [
      { name: "Contract Analysis", level: 98 },
      { name: "Regulatory Compliance", level: 95 },
      { name: "Risk Assessment", level: 92 },
      { name: "Legal Research", level: 97 },
      { name: "Document Drafting", level: 94 },
    ],
    pricing: { credits: "50 credits/task", subscription: "$299/mo", enterprise: "Custom" },
    userReviews: [
      { name: "Sarah K.", rating: 5, comment: "Lexis reviewed our 200-page contract in minutes. Incredible accuracy.", date: "2 weeks ago" },
      { name: "Michael R.", rating: 5, comment: "Reduced our legal review time by 80%. Game changer.", date: "1 month ago" },
      { name: "Emily T.", rating: 4, comment: "Very thorough analysis. Occasionally needs human oversight for edge cases.", date: "1 month ago" },
    ],
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "AI Growth Strategist",
    avatar: avatar2,
    category: "Marketing",
    tags: ["Growth Hacking", "SEO", "Analytics"],
    description: "Data-driven marketing strategist specializing in growth and digital campaigns.",
    rating: 4.8,
    reviews: 2103,
    badge: "Elite",
    priceModel: "Credits",
    tasksCompleted: 24150,
    about: "Nova is your AI-powered growth engine, combining advanced data analytics with creative marketing strategy. From SEO optimization to full-funnel campaign management, Nova delivers actionable insights that drive measurable results.",
    capabilities: ["SEO strategy & optimization", "Campaign performance analysis", "Content strategy planning", "Audience segmentation", "A/B testing frameworks", "Marketing automation"],
    industries: ["E-commerce", "SaaS", "Media", "Education", "Hospitality"],
    tools: ["Google Analytics", "HubSpot", "Semrush", "Meta Ads", "Mailchimp"],
    skills: [
      { name: "Growth Strategy", level: 96 },
      { name: "Data Analytics", level: 94 },
      { name: "SEO", level: 97 },
      { name: "Content Marketing", level: 91 },
      { name: "Campaign Management", level: 93 },
    ],
    pricing: { credits: "30 credits/task", subscription: "$199/mo", enterprise: "Custom" },
    userReviews: [
      { name: "David L.", rating: 5, comment: "Nova increased our organic traffic by 340% in 3 months.", date: "1 week ago" },
      { name: "Jessica M.", rating: 5, comment: "Best marketing AI I've used. Clear, actionable strategies.", date: "3 weeks ago" },
      { name: "Tom H.", rating: 4, comment: "Great for data analysis but needs human creative touch for copy.", date: "2 months ago" },
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    tagline: "AI Financial Analyst",
    avatar: avatar3,
    category: "Finance",
    tags: ["Financial Modeling", "Risk Analysis", "Forecasting"],
    description: "Advanced financial modeling and risk analysis for informed decision-making.",
    rating: 4.9,
    reviews: 891,
    badge: "Pro",
    priceModel: "Subscription",
    tasksCompleted: 12780,
    about: "Atlas brings institutional-grade financial analysis to businesses of all sizes. With deep expertise in financial modeling, risk assessment, and market forecasting, Atlas processes complex financial data and delivers clear, actionable insights.",
    capabilities: ["Financial modeling & valuation", "Risk assessment & mitigation", "Market trend forecasting", "Portfolio optimization", "Budget planning & analysis", "Revenue forecasting"],
    industries: ["Banking", "Investment", "Insurance", "Startups", "Real Estate"],
    tools: ["Bloomberg", "Excel", "Tableau", "QuickBooks", "Stripe"],
    skills: [
      { name: "Financial Modeling", level: 97 },
      { name: "Risk Analysis", level: 95 },
      { name: "Forecasting", level: 93 },
      { name: "Valuation", level: 96 },
      { name: "Data Visualization", level: 90 },
    ],
    pricing: { credits: "60 credits/task", subscription: "$349/mo", enterprise: "Custom" },
    userReviews: [
      { name: "Robert C.", rating: 5, comment: "Atlas built a financial model that took us from Series A to B.", date: "2 weeks ago" },
      { name: "Linda P.", rating: 5, comment: "Incredibly accurate forecasting. Saved us from a bad investment.", date: "1 month ago" },
    ],
  },
  {
    id: "aria",
    name: "Aria",
    tagline: "AI Operations Manager",
    avatar: avatar4,
    category: "Operations",
    tags: ["Process Optimization", "Supply Chain", "Automation"],
    description: "Streamlines operations and automates workflows for maximum efficiency.",
    rating: 4.7,
    reviews: 1567,
    badge: "Certified",
    priceModel: "Credits",
    tasksCompleted: 21340,
    about: "Aria is your AI operations powerhouse, designed to identify inefficiencies, streamline processes, and implement automation at scale. From supply chain optimization to workflow automation, Aria ensures your business runs like a well-oiled machine.",
    capabilities: ["Process mapping & optimization", "Supply chain management", "Workflow automation", "Resource allocation", "Quality assurance", "Vendor management"],
    industries: ["Manufacturing", "Logistics", "Retail", "Healthcare", "Technology"],
    tools: ["Zapier", "Monday.com", "SAP", "Slack", "Asana"],
    skills: [
      { name: "Process Optimization", level: 96 },
      { name: "Automation", level: 94 },
      { name: "Supply Chain", level: 91 },
      { name: "Project Management", level: 93 },
      { name: "Resource Planning", level: 90 },
    ],
    pricing: { credits: "25 credits/task", subscription: "$179/mo", enterprise: "Custom" },
    userReviews: [
      { name: "Karen W.", rating: 5, comment: "Reduced our operational costs by 35%. Aria found inefficiencies we never saw.", date: "1 week ago" },
      { name: "James F.", rating: 4, comment: "Great at process mapping. Automation suggestions are spot-on.", date: "3 weeks ago" },
    ],
  },
  {
    id: "muse",
    name: "Muse",
    tagline: "AI Creative Director",
    avatar: avatar5,
    category: "Copywriting",
    tags: ["Brand Strategy", "Content Creation", "UX Writing"],
    description: "Crafts compelling brand narratives and content strategies that resonate.",
    rating: 4.8,
    reviews: 1890,
    badge: "Elite",
    priceModel: "Credits",
    tasksCompleted: 31200,
    about: "Muse is the creative AI that understands the art and science of communication. From brand strategy to persuasive copy, Muse creates content that connects with audiences on an emotional level while driving measurable business outcomes.",
    capabilities: ["Brand strategy & positioning", "Copywriting & content creation", "UX writing", "Email marketing campaigns", "Social media strategy", "Tone of voice development"],
    industries: ["Advertising", "E-commerce", "Media", "Technology", "Fashion"],
    tools: ["Figma", "Notion", "Grammarly", "Canva", "Adobe Creative Suite"],
    skills: [
      { name: "Copywriting", level: 97 },
      { name: "Brand Strategy", level: 95 },
      { name: "Content Strategy", level: 94 },
      { name: "UX Writing", level: 92 },
      { name: "Creative Direction", level: 96 },
    ],
    pricing: { credits: "20 credits/task", subscription: "$149/mo", enterprise: "Custom" },
    userReviews: [
      { name: "Sophie B.", rating: 5, comment: "Muse completely transformed our brand voice. Consistent, compelling, and on-brand.", date: "5 days ago" },
      { name: "Alex N.", rating: 5, comment: "The best AI copywriter out there. Period.", date: "2 weeks ago" },
    ],
  },
  {
    id: "vega",
    name: "Vega",
    tagline: "AI Investment Advisor",
    avatar: avatar6,
    category: "Investment",
    tags: ["Portfolio Management", "Market Analysis", "Due Diligence"],
    description: "Provides institutional-grade investment insights and portfolio strategy.",
    rating: 4.9,
    reviews: 678,
    badge: "Pro",
    priceModel: "Subscription",
    tasksCompleted: 8920,
    about: "Vega combines quantitative analysis with deep market understanding to deliver investment insights that rival top-tier financial institutions. From portfolio management to deal evaluation, Vega is your AI-powered investment partner.",
    capabilities: ["Portfolio strategy & management", "Market analysis & research", "Due diligence automation", "Deal flow evaluation", "Asset allocation optimization", "Risk-adjusted return modeling"],
    industries: ["Venture Capital", "Private Equity", "Asset Management", "Family Offices", "Hedge Funds"],
    tools: ["PitchBook", "Crunchbase", "Bloomberg", "Excel", "Carta"],
    skills: [
      { name: "Market Analysis", level: 96 },
      { name: "Portfolio Management", level: 94 },
      { name: "Due Diligence", level: 97 },
      { name: "Valuation", level: 95 },
      { name: "Risk Modeling", level: 93 },
    ],
    pricing: { credits: "75 credits/task", subscription: "$449/mo", enterprise: "Custom" },
    userReviews: [
      { name: "Richard M.", rating: 5, comment: "Vega's due diligence reports are as thorough as any analyst team I've worked with.", date: "1 week ago" },
      { name: "Patricia L.", rating: 5, comment: "Exceptional market analysis. Helped us make a critical investment decision.", date: "3 weeks ago" },
    ],
  },
];

export const categories = [
  { name: "Legal", icon: "Scale", description: "Contracts, compliance & regulation", count: 24 },
  { name: "Marketing", icon: "TrendingUp", description: "Growth, SEO & digital campaigns", count: 31 },
  { name: "Finance", icon: "DollarSign", description: "Modeling, analysis & forecasting", count: 18 },
  { name: "Real Estate", icon: "Building", description: "Valuation, deals & market insights", count: 12 },
  { name: "Architecture", icon: "Layers", description: "Design systems & spatial planning", count: 9 },
  { name: "Psychology", icon: "Brain", description: "Behavioral insights & research", count: 15 },
  { name: "Operations", icon: "Settings", description: "Process optimization & automation", count: 22 },
  { name: "Investment", icon: "BarChart3", description: "Portfolio strategy & deal flow", count: 14 },
  { name: "Copywriting", icon: "Pen", description: "Brand voice & content creation", count: 27 },
];
