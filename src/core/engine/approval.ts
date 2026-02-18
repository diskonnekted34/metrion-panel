/**
 * Approval Engine
 * Centralized policy-based approval logic.
 * Determines required approvers and validates approval completeness.
 */

import { SeatKey } from "../types/identity";
import { ApprovalPolicy, RiskLevel, DecisionApproval, ActionApproval } from "../types/governance";

// ── Default Policies ────────────────────────────────────
const DEFAULT_POLICIES: Omit<ApprovalPolicy, "id" | "tenant_id">[] = [
  // Global high risk
  {
    entity_type: "decision",
    risk_level: "critical",
    required_seats: ["CEO", "CFO"],
    minimum_approval_count: 2,
    description: "Critical decisions require CEO + CFO",
  },
  {
    entity_type: "decision",
    risk_level: "high",
    required_seats: ["CEO"],
    minimum_approval_count: 1,
    description: "High risk decisions require CEO",
  },
  {
    entity_type: "action",
    risk_level: "critical",
    required_seats: ["CEO", "CFO"],
    minimum_approval_count: 2,
    description: "Critical actions require CEO + CFO",
  },
  {
    entity_type: "action",
    risk_level: "high",
    required_seats: ["CEO"],
    minimum_approval_count: 1,
    description: "High risk actions require CEO",
  },
  // HR-specific
  {
    entity_type: "decision",
    department_key: "hr",
    risk_level: "high",
    required_seats: ["CHRO", "CEO"],
    minimum_approval_count: 2,
    description: "HR high-risk requires CHRO + CEO",
  },
  // Sales-specific
  {
    entity_type: "decision",
    department_key: "sales",
    risk_level: "high",
    required_seats: ["SALES_DIRECTOR", "CFO"],
    minimum_approval_count: 2,
    description: "Sales pricing/discount requires Sales Director + CFO",
  },
  // Finance
  {
    entity_type: "decision",
    department_key: "finance",
    risk_level: "high",
    financial_threshold: 100000,
    required_seats: ["CFO", "CEO"],
    minimum_approval_count: 2,
    description: "Finance >$100k requires CFO + CEO",
  },
];

export interface ApprovalRequirement {
  required_seats: SeatKey[];
  minimum_count: number;
  policy_description: string;
}

/** Resolve which approval policy applies */
export function resolveApprovalRequirement(
  entityType: "decision" | "action",
  riskLevel: RiskLevel,
  departmentKey: string,
  financialImpact?: number,
  customPolicies?: ApprovalPolicy[]
): ApprovalRequirement {
  const policies = customPolicies?.map(p => ({
    entity_type: p.entity_type,
    department_key: p.department_key,
    risk_level: p.risk_level,
    financial_threshold: p.financial_threshold,
    required_seats: p.required_seats,
    minimum_approval_count: p.minimum_approval_count,
    description: p.description,
  })) || DEFAULT_POLICIES;

  // Priority: department-specific + risk match > global risk match > fallback
  const riskOrder: RiskLevel[] = ["critical", "high", "medium", "low"];
  const riskIdx = riskOrder.indexOf(riskLevel);

  // Try department-specific first
  for (let i = riskIdx; i >= 0; i--) {
    const match = policies.find(
      p =>
        p.entity_type === entityType &&
        p.department_key === departmentKey &&
        p.risk_level === riskOrder[i] &&
        (!p.financial_threshold || (financialImpact && financialImpact >= p.financial_threshold))
    );
    if (match) {
      return {
        required_seats: match.required_seats,
        minimum_count: match.minimum_approval_count,
        policy_description: match.description,
      };
    }
  }

  // Try global
  for (let i = riskIdx; i >= 0; i--) {
    const match = policies.find(
      p =>
        p.entity_type === entityType &&
        !p.department_key &&
        p.risk_level === riskOrder[i]
    );
    if (match) {
      return {
        required_seats: match.required_seats,
        minimum_count: match.minimum_approval_count,
        policy_description: match.description,
      };
    }
  }

  // Fallback: low risk, single approval by any seat
  return {
    required_seats: [],
    minimum_count: 1,
    policy_description: "Standard single approval",
  };
}

/** Check if approval is complete */
export function isApprovalComplete(
  approvals: (DecisionApproval | ActionApproval)[],
  requirement: ApprovalRequirement
): { complete: boolean; approved_count: number; rejected: boolean } {
  const approved = approvals.filter(a => a.status === "approved");
  const rejected = approvals.some(a => a.status === "rejected" && requirement.required_seats.includes(a.seat_key));

  // Check required seats
  const requiredMet = requirement.required_seats.length === 0 ||
    requirement.required_seats.every(seat =>
      approved.some(a => a.seat_key === seat)
    );

  return {
    complete: requiredMet && approved.length >= requirement.minimum_count && !rejected,
    approved_count: approved.length,
    rejected,
  };
}
