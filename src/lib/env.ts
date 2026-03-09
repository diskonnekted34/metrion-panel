/**
 * Environment helpers — single source of truth for runtime mode detection.
 */

export const IS_DEV = import.meta.env.DEV;

/**
 * Mock mode is allowed ONLY in development builds with explicit opt-in.
 * Production builds NEVER fall back to mock data regardless of env vars.
 */
export function isMockEnabled(): boolean {
  return IS_DEV && import.meta.env.VITE_USE_MOCK === "true";
}
