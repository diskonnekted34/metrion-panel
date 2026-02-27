/**
 * Lightweight fetch wrapper with typed responses and auth token support.
 * Token is injected per-call (not stored globally) so the module stays pure.
 */

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

interface RequestOptions {
  token?: string | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
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
  if (opts?.token) {
    headers["Authorization"] = `Bearer ${opts.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    signal: opts?.signal,
  });

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
