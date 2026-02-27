/**
 * Lightweight fetch wrapper with typed responses, auto-auth, and refresh.
 * Token is auto-read from authSession; can be overridden per-call.
 */

import { getAccessToken, tryRefresh } from "@/lib/authSession";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions {
  /** Explicit token overrides auto-read from session */
  token?: string | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Skip automatic token attachment (e.g. for login) */
  skipAuth?: boolean;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts?.headers,
  };

  // Resolve token: explicit > session > none
  const token = opts?.skipAuth
    ? null
    : (opts?.token ?? getAccessToken());

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    signal: opts?.signal,
  });

  // Auto-refresh on 401 (once)
  if (res.status === 401 && !opts?.skipAuth && !opts?.token) {
    const newToken = await tryRefresh();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body != null ? JSON.stringify(body) : undefined,
        signal: opts?.signal,
      });
    }
  }

  if (!res.ok) {
    let msg = res.statusText;
    let details: unknown;
    try {
      const json = await res.json();
      msg = (json as { message?: string }).message ?? msg;
      details = json;
    } catch {
      /* use statusText */
    }
    throw new ApiError(res.status, msg, details);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string, opts?: RequestOptions) {
  return request<T>("GET", path, undefined, opts);
}
export function apiPost<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("POST", path, body, opts);
}
export function apiPut<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("PUT", path, body, opts);
}
export function apiPatch<T>(path: string, body: unknown, opts?: RequestOptions) {
  return request<T>("PATCH", path, body, opts);
}
export function apiDelete<T>(path: string, opts?: RequestOptions) {
  return request<T>("DELETE", path, undefined, opts);
}
