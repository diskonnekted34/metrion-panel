/**
 * Audit Logger
 * Records every write operation with before/after snapshots.
 */

import { AuditLog, AuditActionType } from "../types/infrastructure";
import { SeatKey } from "../types/identity";

class AuditLogger {
  private logs: AuditLog[] = [];
  private idCounter = 0;

  log(entry: {
    tenant_id: string;
    user_id: string;
    seat_key: SeatKey | null;
    entity_type: string;
    entity_id: string;
    action_type: AuditActionType;
    before_snapshot?: Record<string, unknown> | null;
    after_snapshot?: Record<string, unknown> | null;
    reason?: string;
  }): AuditLog {
    const auditLog: AuditLog = {
      id: `aud_${++this.idCounter}_${Date.now()}`,
      tenant_id: entry.tenant_id,
      user_id: entry.user_id,
      seat_key: entry.seat_key,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      action_type: entry.action_type,
      before_snapshot: entry.before_snapshot || null,
      after_snapshot: entry.after_snapshot || null,
      reason: entry.reason,
      created_at: new Date().toISOString(),
    };
    this.logs.push(auditLog);
    return auditLog;
  }

  query(tenantId: string, filters?: {
    entity_type?: string;
    entity_id?: string;
    user_id?: string;
    seat_key?: SeatKey;
    action_type?: AuditActionType;
    limit?: number;
  }): AuditLog[] {
    let result = this.logs.filter(l => l.tenant_id === tenantId);
    if (filters?.entity_type) result = result.filter(l => l.entity_type === filters.entity_type);
    if (filters?.entity_id) result = result.filter(l => l.entity_id === filters.entity_id);
    if (filters?.user_id) result = result.filter(l => l.user_id === filters.user_id);
    if (filters?.seat_key) result = result.filter(l => l.seat_key === filters.seat_key);
    if (filters?.action_type) result = result.filter(l => l.action_type === filters.action_type);
    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (filters?.limit) result = result.slice(0, filters.limit);
    return result;
  }

  count(tenantId: string): number {
    return this.logs.filter(l => l.tenant_id === tenantId).length;
  }
}

export const auditLogger = new AuditLogger();
