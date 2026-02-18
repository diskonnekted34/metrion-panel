/**
 * Usage & Billing Engine
 * Tracks AI processing credits, enforces plan limits, supports overage.
 */

import { UsageLog, UsageCategory } from "../types/infrastructure";
import { Tenant } from "../types/identity";

interface PlanLimits {
  monthly_credits: number;
  overage_allowed: boolean;
  overage_rate_per_unit: number;
}

const PLAN_LIMITS: Record<Tenant["plan"], PlanLimits> = {
  core: { monthly_credits: 500, overage_allowed: false, overage_rate_per_unit: 0 },
  performance: { monthly_credits: 2000, overage_allowed: true, overage_rate_per_unit: 0.05 },
  workforce: { monthly_credits: 5000, overage_allowed: true, overage_rate_per_unit: 0.04 },
  enterprise: { monthly_credits: 50000, overage_allowed: true, overage_rate_per_unit: 0.03 },
};

class UsageEngine {
  private logs: UsageLog[] = [];
  private idCounter = 0;

  /** Record usage */
  consume(entry: {
    tenant_id: string;
    user_id: string;
    seat_key?: string;
    category: UsageCategory;
    units: number;
    description: string;
    entity_type?: string;
    entity_id?: string;
  }): UsageLog {
    const log: UsageLog = {
      id: `usg_${++this.idCounter}_${Date.now()}`,
      tenant_id: entry.tenant_id,
      user_id: entry.user_id,
      seat_key: entry.seat_key as any,
      category: entry.category,
      units_consumed: entry.units,
      description: entry.description,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      created_at: new Date().toISOString(),
    };
    this.logs.push(log);
    return log;
  }

  /** Get total consumed this month */
  getMonthlyUsage(tenantId: string): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return this.logs
      .filter(l => l.tenant_id === tenantId && l.created_at >= monthStart)
      .reduce((sum, l) => sum + l.units_consumed, 0);
  }

  /** Check if tenant can consume more */
  checkLimit(tenantId: string, plan: Tenant["plan"]): {
    used: number;
    limit: number;
    remaining: number;
    overage: boolean;
    throttled: boolean;
  } {
    const limits = PLAN_LIMITS[plan];
    const used = this.getMonthlyUsage(tenantId);
    const remaining = Math.max(0, limits.monthly_credits - used);
    const overage = used > limits.monthly_credits;
    const throttled = overage && !limits.overage_allowed;
    return { used, limit: limits.monthly_credits, remaining, overage, throttled };
  }

  /** Query logs */
  query(tenantId: string, limit?: number): UsageLog[] {
    let result = this.logs.filter(l => l.tenant_id === tenantId);
    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (limit) result = result.slice(0, limit);
    return result;
  }
}

export const usageEngine = new UsageEngine();
