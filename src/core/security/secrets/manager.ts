/**
 * Secrets Manager — Phase 1: In-memory mock store
 * Phase 2: Vault/KMS-backed secret storage.
 * 
 * Rules:
 * - Secrets never returned in full after initial set
 * - UI only sees masked versions
 * - Every reveal triggers audit event
 */

import { auditLogger } from "@/core/engine/audit";

export interface SecretEntry {
  id: string;
  tenantId: string;
  key: string;
  /** Masked display value, e.g. "****1234" */
  maskedValue: string;
  /** Internal store — Phase 1 only. Phase 2: removed, stored in Vault */
  _rawValue: string;
  createdAt: string;
  rotatedAt?: string;
  lastAccessedAt?: string;
  createdBy: string;
}

export interface SecretRevealResult {
  value: string;
  auditId: string;
}

class SecretsManager {
  private store: Map<string, SecretEntry> = new Map();
  private idCounter = 0;

  private makeKey(tenantId: string, key: string): string {
    return `${tenantId}::${key}`;
  }

  private mask(value: string): string {
    if (value.length <= 4) return "****";
    return "****" + value.slice(-4);
  }

  setSecret(tenantId: string, key: string, value: string, actorId: string): SecretEntry {
    const compositeKey = this.makeKey(tenantId, key);
    const entry: SecretEntry = {
      id: `sec_${++this.idCounter}_${Date.now()}`,
      tenantId,
      key,
      maskedValue: this.mask(value),
      _rawValue: value,
      createdAt: new Date().toISOString(),
      createdBy: actorId,
    };
    this.store.set(compositeKey, entry);

    auditLogger.log({
      tenant_id: tenantId,
      user_id: actorId,
      seat_key: null,
      entity_type: "Secret",
      entity_id: entry.id,
      action_type: "create",
      before_snapshot: null,
      after_snapshot: { key, maskedValue: entry.maskedValue } as Record<string, unknown>,
      reason: `Secret '${key}' created`,
    });

    return entry;
  }

  getSecret(tenantId: string, key: string): SecretEntry | null {
    return this.store.get(this.makeKey(tenantId, key)) || null;
  }

  /**
   * Reveal full secret value — triggers audit event.
   * Should only be called after policy check.
   */
  revealSecret(tenantId: string, key: string, actorId: string): SecretRevealResult | null {
    const entry = this.store.get(this.makeKey(tenantId, key));
    if (!entry) return null;

    entry.lastAccessedAt = new Date().toISOString();

    const audit = auditLogger.log({
      tenant_id: tenantId,
      user_id: actorId,
      seat_key: null,
      entity_type: "Secret",
      entity_id: entry.id,
      action_type: "override",
      before_snapshot: { maskedValue: entry.maskedValue } as Record<string, unknown>,
      after_snapshot: { revealed: true } as Record<string, unknown>,
      reason: `Secret '${key}' revealed by ${actorId}`,
    });

    return { value: entry._rawValue, auditId: audit.id };
  }

  rotateSecret(tenantId: string, key: string, newValue: string, actorId: string): SecretEntry | null {
    const compositeKey = this.makeKey(tenantId, key);
    const existing = this.store.get(compositeKey);
    if (!existing) return null;

    const oldMasked = existing.maskedValue;
    existing._rawValue = newValue;
    existing.maskedValue = this.mask(newValue);
    existing.rotatedAt = new Date().toISOString();

    auditLogger.log({
      tenant_id: tenantId,
      user_id: actorId,
      seat_key: null,
      entity_type: "Secret",
      entity_id: existing.id,
      action_type: "update",
      before_snapshot: { maskedValue: oldMasked } as Record<string, unknown>,
      after_snapshot: { maskedValue: existing.maskedValue, rotatedAt: existing.rotatedAt } as Record<string, unknown>,
      reason: `Secret '${key}' rotated`,
    });

    return existing;
  }

  listSecrets(tenantId: string): Array<Omit<SecretEntry, "_rawValue">> {
    const results: Array<Omit<SecretEntry, "_rawValue">> = [];
    for (const entry of this.store.values()) {
      if (entry.tenantId === tenantId) {
        const { _rawValue, ...safe } = entry;
        results.push(safe);
      }
    }
    return results;
  }
}

export const secretsManager = new SecretsManager();
