/**
 * Auth session — token persistence helpers.
 * Tokens are stored in localStorage; no sensitive data beyond JWTs.
 */

const ACCESS_KEY = "pv_access_token";
const REFRESH_KEY = "pv_refresh_token";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  } catch {
    /* storage full / private mode — silently fail */
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Attempt to refresh tokens via the API.
 * Returns new access token on success, null on failure.
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
