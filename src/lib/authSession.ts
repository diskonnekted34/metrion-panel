/**
 * Auth session — token persistence with security boundaries.
 *
 * Security model:
 * - PROD: Tokens stored in MEMORY ONLY (not localStorage).
 *   This eliminates XSS-based token theft from localStorage.
 *   When backend is connected, refresh tokens should move to
 *   httpOnly secure cookies (set by the server, not JS).
 * - DEV: localStorage fallback for convenience (survives page refresh).
 *
 * The API client uses credentials: "include" for cookie-based auth
 * readiness (future BFF integration).
 */

const IS_DEV = import.meta.env.DEV;

const ACCESS_KEY = "pv_access_token";
const REFRESH_KEY = "pv_refresh_token";

// ── In-memory token store (XSS-safe in prod) ──────────
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

export function getAccessToken(): string | null {
  if (IS_DEV) {
    try {
      return localStorage.getItem(ACCESS_KEY) ?? memoryAccessToken;
    } catch {
      return memoryAccessToken;
    }
  }
  return memoryAccessToken;
}

export function getRefreshToken(): string | null {
  if (IS_DEV) {
    try {
      return localStorage.getItem(REFRESH_KEY) ?? memoryRefreshToken;
    } catch {
      return memoryRefreshToken;
    }
  }
  return memoryRefreshToken;
}

export function setTokens(accessToken: string, refreshToken: string): void {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken;

  if (IS_DEV) {
    try {
      localStorage.setItem(ACCESS_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
    } catch {
      /* storage full / private mode */
    }
  }
}

export function clearTokens(): void {
  memoryAccessToken = null;
  memoryRefreshToken = null;

  if (IS_DEV) {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* noop */
    }
  }
}

/**
 * Attempt to refresh tokens via the API.
 * Returns new access token on success, null on failure.
 *
 * When BFF is connected, this should use credentials: "include"
 * so the httpOnly refresh cookie is sent automatically.
 */
export async function tryRefresh(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;

  try {
    const { apiPost } = await import("@/lib/apiClient");
    const { API_ROUTES } = await import("@/lib/apiRoutes");
    const res = await apiPost<{
      data: { tokens: { accessToken: string; refreshToken: string } };
    }>(API_ROUTES.auth.refresh, { refreshToken: rt });

    setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    return res.data.tokens.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}
