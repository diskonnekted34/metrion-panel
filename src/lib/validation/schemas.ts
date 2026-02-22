/**
 * Zod schemas for write-path payload validation.
 * Only used for create/update mutations — NOT for read queries.
 */
import { z } from "zod";

export const DecisionCreateSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  category: z.enum(["Revenue", "Cost", "Risk", "Growth", "Ops"]),
  impactScore: z.number().min(1).max(10),
  ownerRole: z.string().min(2),
});

export const IntegrationConnectSchema = z.object({
  provider: z.enum(["Shopify", "MetaAds", "GoogleAds", "HubSpot", "GitHub"]),
  accountId: z.string().min(2, "Hesap ID gerekli"),
});

export type DecisionCreateInput = z.infer<typeof DecisionCreateSchema>;
export type IntegrationConnectInput = z.infer<typeof IntegrationConnectSchema>;
