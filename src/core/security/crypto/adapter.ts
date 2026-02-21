/**
 * Crypto Adapter — Phase 1: Mock implementation
 * Provides encrypt/decrypt interface for sensitive fields.
 * Phase 2: Will be replaced by BFF-backed KMS/Vault integration.
 */

export interface CryptoAdapter {
  encrypt(plaintext: string, tenantId: string): Promise<EncryptedPayload>;
  decrypt(payload: EncryptedPayload, tenantId: string): Promise<string>;
}

export interface EncryptedPayload {
  ciphertext: string;
  algorithm: string;
  keyId: string;
  iv?: string;
  tag?: string;
  /** ISO timestamp */
  encryptedAt: string;
}

/**
 * Phase 1: Mock crypto adapter.
 * Encodes to base64 (NOT real encryption — placeholder only).
 * Marks data as "encrypted" for structural compliance.
 */
class MockCryptoAdapter implements CryptoAdapter {
  async encrypt(plaintext: string, tenantId: string): Promise<EncryptedPayload> {
    // Mock: base64 encode (NOT secure — Phase 1 placeholder)
    const encoded = btoa(unescape(encodeURIComponent(plaintext)));
    return {
      ciphertext: encoded,
      algorithm: "mock-base64-v1",
      keyId: `mock-key-${tenantId}`,
      encryptedAt: new Date().toISOString(),
    };
  }

  async decrypt(payload: EncryptedPayload, _tenantId: string): Promise<string> {
    if (payload.algorithm !== "mock-base64-v1") {
      throw new Error(`Unsupported algorithm: ${payload.algorithm}. Phase 2 KMS required.`);
    }
    return decodeURIComponent(escape(atob(payload.ciphertext)));
  }
}

/** Singleton instance — swap in Phase 2 */
export const cryptoAdapter: CryptoAdapter = new MockCryptoAdapter();
