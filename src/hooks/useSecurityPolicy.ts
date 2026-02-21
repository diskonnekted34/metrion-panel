/**
 * useSecurityPolicy — React hook for policy-driven UI behavior.
 * Provides permission checks, field redaction, and reveal tracking.
 */

import { useCallback, useMemo } from "react";
import { useRBAC } from "@/contexts/RBACContext";
import { evaluatePolicy, getPermittedActions, canPerformAction } from "@/core/security/policy/engine";
import { redactEntity, getFieldClassification, maskValue } from "@/core/security/redaction/classifier";
import { emitDataReveal } from "@/core/security/audit/events";
import type { PolicyAction, ResourceType, DataClassification } from "@/core/security/policy/types";

export function useSecurityPolicy() {
  const { currentUser } = useRBAC();

  const tenantId = "tenant-default"; // Phase 1: single tenant

  const checkPolicy = useCallback(
    (action: PolicyAction, resourceType: ResourceType, resourceState?: string) => {
      return canPerformAction(currentUser.role, action, resourceType, resourceState);
    },
    [currentUser.role]
  );

  const getPermissions = useCallback(
    (resourceType: ResourceType, resourceState?: string) => {
      return getPermittedActions(currentUser.role, resourceType, resourceState);
    },
    [currentUser.role]
  );

  const maxClassification = useMemo((): DataClassification => {
    if (currentUser.role === "owner") return "secret";
    if (["admin", "department_lead"].includes(currentUser.role)) return "sensitive";
    return "public";
  }, [currentUser.role]);

  const redact = useCallback(
    <T extends Record<string, unknown>>(entity: T, entityType: string): T => {
      return redactEntity(entity, entityType, maxClassification);
    },
    [maxClassification]
  );

  const revealField = useCallback(
    (resourceType: ResourceType, resourceId: string, fieldName: string) => {
      const classification = getFieldClassification(resourceType as string, fieldName);
      const action: PolicyAction = classification === "secret" ? "REVEAL_SECRET" : "REVEAL_SENSITIVE";

      const allowed = canPerformAction(currentUser.role, action, resourceType);
      if (!allowed) return { allowed: false, auditId: null };

      const auditId = emitDataReveal(
        tenantId,
        currentUser.id,
        resourceType,
        resourceId,
        fieldName,
        classification
      );

      return { allowed: true, auditId };
    },
    [currentUser.role, currentUser.id, tenantId]
  );

  return {
    checkPolicy,
    getPermissions,
    maxClassification,
    redact,
    revealField,
    maskValue,
    currentRole: currentUser.role,
    tenantId,
  };
}
