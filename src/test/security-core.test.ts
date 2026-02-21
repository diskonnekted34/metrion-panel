/**
 * Security Core Tests
 * Tests for policy engine, redaction, secrets, and crypto adapter.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { evaluatePolicy, canPerformAction, getPermittedActions } from "@/core/security/policy/engine";
import { redactEntity, getFieldClassification, maskValue, isFieldRedacted } from "@/core/security/redaction/classifier";
import { secretsManager } from "@/core/security/secrets/manager";
import { cryptoAdapter } from "@/core/security/crypto/adapter";

// ── Policy Engine Tests ─────────────────────────────────

describe("Policy Engine", () => {
  it("allows owner to perform any action", () => {
    expect(canPerformAction("owner", "REVEAL_SECRET", "Decision")).toBe(true);
    expect(canPerformAction("owner", "MODIFY_BUDGET", "Governance")).toBe(true);
    expect(canPerformAction("owner", "ASSIGN_SEAT", "Seat")).toBe(true);
  });

  it("denies viewer from writing", () => {
    expect(canPerformAction("viewer", "WRITE", "Decision")).toBe(false);
  });

  it("allows viewer to read public data", () => {
    expect(canPerformAction("viewer", "READ", "Decision")).toBe(true);
  });

  it("denies viewer from revealing sensitive data", () => {
    const result = evaluatePolicy({
      actor: { id: "u1", role: "viewer", tenant_id: "t1" },
      resource: { type: "Decision", classification: "sensitive" },
      action: "READ",
    });
    expect(result.allowed).toBe(false);
  });

  it("denies operator from approving", () => {
    expect(canPerformAction("operator", "APPROVE", "Decision")).toBe(false);
  });

  it("allows department_lead to approve", () => {
    expect(canPerformAction("department_lead", "APPROVE", "Decision")).toBe(true);
  });

  it("denies writing to non-draft resources", () => {
    expect(canPerformAction("admin", "WRITE", "Decision", "approved")).toBe(false);
    expect(canPerformAction("admin", "WRITE", "Decision", "draft")).toBe(true);
  });

  it("denies all writes and deletes on AuditLog", () => {
    expect(canPerformAction("owner", "WRITE", "AuditLog")).toBe(false);
    expect(canPerformAction("owner", "DELETE", "AuditLog")).toBe(false);
  });

  it("getPermittedActions returns correct map", () => {
    const perms = getPermittedActions("viewer", "Decision");
    expect(perms.READ).toBe(true);
    expect(perms.WRITE).toBe(false);
    expect(perms.APPROVE).toBe(false);
  });
});

// ── Redaction Tests ─────────────────────────────────────

describe("Data Classification & Redaction", () => {
  it("classifies decision fields correctly", () => {
    expect(getFieldClassification("Decision", "title")).toBe("public");
    expect(getFieldClassification("Decision", "aiReasoning")).toBe("sensitive");
    expect(getFieldClassification("Decision", "externalReferenceTokens")).toBe("secret");
  });

  it("redacts sensitive fields for public viewers", () => {
    const entity = { title: "Test", aiReasoning: "AI says...", lifecycle: "draft" };
    const redacted = redactEntity(entity, "Decision", "public");
    expect(redacted.title).toBe("Test");
    expect(redacted.aiReasoning).toBe("[REDACTED]");
  });

  it("does not redact for sensitive-cleared viewers", () => {
    const entity = { title: "Test", aiReasoning: "AI says..." };
    const redacted = redactEntity(entity, "Decision", "sensitive");
    expect(redacted.aiReasoning).toBe("AI says...");
  });

  it("masks secret fields even for sensitive viewers", () => {
    const entity = { title: "Test", externalReferenceTokens: "tok_12345" };
    const redacted = redactEntity(entity, "Decision", "sensitive");
    expect(redacted.externalReferenceTokens).toBe("••••••••");
  });

  it("maskValue works correctly", () => {
    expect(maskValue("sk_live_abcdefgh1234")).toBe("••••1234");
    expect(maskValue("ab")).toBe("••••");
  });

  it("isFieldRedacted returns correct result", () => {
    expect(isFieldRedacted("Decision", "aiReasoning", "public")).toBe(true);
    expect(isFieldRedacted("Decision", "aiReasoning", "sensitive")).toBe(false);
    expect(isFieldRedacted("Decision", "title", "public")).toBe(false);
  });
});

// ── Secrets Manager Tests ───────────────────────────────

describe("Secrets Manager", () => {
  it("creates and masks secrets", () => {
    const entry = secretsManager.setSecret("t1", "TEST_KEY", "sk_live_abc123456789", "u1");
    expect(entry.maskedValue).toBe("****6789");
    expect(entry.key).toBe("TEST_KEY");
  });

  it("reveals secret with audit", () => {
    secretsManager.setSecret("t1", "REVEAL_TEST", "secret_value_1234", "u1");
    const result = secretsManager.revealSecret("t1", "REVEAL_TEST", "u1");
    expect(result).not.toBeNull();
    expect(result!.value).toBe("secret_value_1234");
    expect(result!.auditId).toBeTruthy();
  });

  it("rotates secret", () => {
    secretsManager.setSecret("t1", "ROTATE_TEST", "old_value_1234", "u1");
    const rotated = secretsManager.rotateSecret("t1", "ROTATE_TEST", "new_value_5678", "u1");
    expect(rotated).not.toBeNull();
    expect(rotated!.maskedValue).toBe("****5678");
    expect(rotated!.rotatedAt).toBeTruthy();
  });

  it("lists secrets without raw values", () => {
    secretsManager.setSecret("t2", "LIST_TEST", "hidden_value", "u1");
    const list = secretsManager.listSecrets("t2");
    expect(list.length).toBeGreaterThan(0);
    expect((list[0] as any)._rawValue).toBeUndefined();
  });
});

// ── Crypto Adapter Tests ────────────────────────────────

describe("Crypto Adapter (Phase 1 Mock)", () => {
  it("encrypts and decrypts roundtrip", async () => {
    const plaintext = "sensitive financial data €1,000,000";
    const encrypted = await cryptoAdapter.encrypt(plaintext, "t1");
    expect(encrypted.algorithm).toBe("mock-base64-v1");
    expect(encrypted.ciphertext).not.toBe(plaintext);

    const decrypted = await cryptoAdapter.decrypt(encrypted, "t1");
    expect(decrypted).toBe(plaintext);
  });

  it("includes metadata in encrypted payload", async () => {
    const encrypted = await cryptoAdapter.encrypt("test", "t1");
    expect(encrypted.keyId).toBe("mock-key-t1");
    expect(encrypted.encryptedAt).toBeTruthy();
  });
});
