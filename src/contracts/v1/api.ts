/**
 * V1 API Contract — Core response envelope, pagination, and error format.
 */

// ── Error ───────────────────────────────────────────────
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

// ── Meta ────────────────────────────────────────────────
export interface ApiMeta {
  requestId: string;
  timestamp: string;
  durationMs?: number;
}

// ── Envelope ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

// ── Pagination ──────────────────────────────────────────
export interface PageInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Page<T> {
  items: T[];
  pagination: PageInfo;
  meta: ApiMeta;
}

// ── Audit Log (shared) ─────────────────────────────────
export interface AuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
