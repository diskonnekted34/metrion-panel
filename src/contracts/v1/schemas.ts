/**
 * V1 API Contract — Zod validation schemas for key request bodies.
 */

import { z } from "zod";

// ── Create Decision ─────────────────────────────────────
export const createDecisionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum(["operational", "strategic", "structural"]),
  departmentKey: z.string().min(1),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  financialImpact: z.object({
    currency: z.string().default("TRY"),
    estimatedValue: z.number(),
    confidencePct: z.number().min(0).max(100),
    timeHorizonDays: z.number().positive(),
  }),
  requiredApprovers: z.array(z.string()).min(1),
  kpiAttachments: z.array(z.object({
    kpiKey: z.string(),
    kpiLabel: z.string(),
    baselineValue: z.number(),
    targetValue: z.number(),
    monitoringDurationDays: z.number().positive(),
  })).optional(),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;

// ── Create Action ───────────────────────────────────────
export const createActionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  departmentKey: z.string().min(1),
  responsibleSeat: z.string().min(1),
  sourceDecisionId: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  financialImpact: z.object({
    currency: z.string().default("TRY"),
    estimatedValue: z.number(),
    confidencePct: z.number().min(0).max(100),
    timeHorizonDays: z.number().positive(),
  }),
  maxRetries: z.number().int().min(0).max(5).default(3),
});

export type CreateActionInput = z.infer<typeof createActionSchema>;

// ── Approval Request ────────────────────────────────────
export const approvalRequestSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reason: z.string().max(2000).optional(),
});

export type ApprovalRequestInput = z.infer<typeof approvalRequestSchema>;

// ── Login ───────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
