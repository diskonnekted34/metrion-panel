export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  cta: string;
  ctaVariant: "primary" | "outline" | "accent";
  features: PlanFeature[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export const plans: Plan[] = [
  {
    id: "core",
    name: "Core",
    description: "Essential intelligence for growing teams. Get started with core analytics and reporting.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    cta: "Start trial",
    ctaVariant: "outline",
    features: [
      { text: "Up to 10 team members", included: true },
      { text: "3 departments", included: true },
      { text: "Basic AI insights", included: true },
      { text: "Weekly reports", included: true },
      { text: "Email support", included: true },
      { text: "Custom integrations", included: false },
      { text: "Advanced forecasting", included: false },
      { text: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Full operational intelligence with advanced AI agents and unlimited departments.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    badge: "Most popular",
    cta: "Start trial",
    ctaVariant: "primary",
    features: [
      { text: "Up to 50 team members", included: true },
      { text: "Unlimited departments", included: true },
      { text: "Advanced AI agents", included: true },
      { text: "Real-time dashboards", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Advanced forecasting", included: true },
      { text: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Full-scale workforce OS with governance, compliance, and dedicated success team.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Talk to sales",
    ctaVariant: "accent",
    features: [
      { text: "Unlimited team members", included: true },
      { text: "Unlimited departments", included: true },
      { text: "Custom AI model training", included: true },
      { text: "Governance & compliance", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Advanced forecasting", included: true },
      { text: "Dedicated account manager", included: true },
    ],
  },
];

export const faqs: FAQ[] = [
  {
    question: "How does the free trial work?",
    answer: "Every plan includes a 14-day free trial with full access. No credit card required. Cancel anytime before the trial ends and you won't be charged.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes. You can upgrade or downgrade at any time. When upgrading, the new features are available immediately. Downgrades take effect at the next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, wire transfers for annual Enterprise plans, and invoicing for qualifying organizations.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No. All plans are self-serve with zero setup fees. Enterprise customers get a complimentary onboarding session.",
  },
  {
    question: "How does billing work for yearly plans?",
    answer: "Yearly plans are billed annually upfront and include a 20% discount compared to monthly billing. You can switch to yearly billing at any time.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. There are no long-term contracts. You can cancel your subscription at any time from the Settings page.",
  },
];
