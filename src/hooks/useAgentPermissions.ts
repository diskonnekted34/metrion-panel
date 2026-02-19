import { useMemo } from "react";
import { useRBAC, type UserRole } from "@/contexts/RBACContext";

/**
 * Capability keys for the Agent Console permission system.
 * 
 * Layer 1 (Soft Guard): AI filters suggestions based on these.
 * Layer 2 (Hard Guard): UI disables/hides controls; backend rejects unauthorized calls.
 */
export interface AgentCapabilities {
  /** Can view agent data, KPIs, and analysis */
  "analysis.view": boolean;
  /** Can create draft actions (campaigns, budgets, etc.) */
  "action.draft.create": boolean;
  /** Can approve and publish drafts */
  "action.publish": boolean;
  /** Can create tasks from recommendations */
  "task.create": boolean;
  /** Can assign tasks to other agents/users */
  "task.assign": boolean;
  /** Can connect/disconnect integrations */
  "integration.connect": boolean;
  /** Can edit risk thresholds and budget caps */
  "settings.thresholds": boolean;
  /** Has access to the specific agent's department */
  "department.access": boolean;
}

export type CapabilityKey = keyof AgentCapabilities;

/** Maps RBAC roles to capability sets */
const roleCapabilityMap: Record<UserRole, Omit<AgentCapabilities, "department.access">> = {
  owner: {
    "analysis.view": true,
    "action.draft.create": true,
    "action.publish": true,
    "task.create": true,
    "task.assign": true,
    "integration.connect": true,
    "settings.thresholds": true,
  },
  admin: {
    "analysis.view": true,
    "action.draft.create": true,
    "action.publish": true,
    "task.create": true,
    "task.assign": true,
    "integration.connect": true,
    "settings.thresholds": true,
  },
  department_lead: {
    "analysis.view": true,
    "action.draft.create": true,
    "action.publish": false,
    "task.create": true,
    "task.assign": true,
    "integration.connect": false,
    "settings.thresholds": false,
  },
  operator: {
    "analysis.view": true,
    "action.draft.create": false,
    "action.publish": false,
    "task.create": false,
    "task.assign": false,
    "integration.connect": false,
    "settings.thresholds": false,
  },
  viewer: {
    "analysis.view": true,
    "action.draft.create": false,
    "action.publish": false,
    "task.create": false,
    "task.assign": false,
    "integration.connect": false,
    "settings.thresholds": false,
  },
};

/** Escalation risk level */
export type EscalationLevel = "none" | "standard" | "high_impact";

export interface AgentPermissionContext {
  /** Full capability map for current user + agent */
  capabilities: AgentCapabilities;
  /** Check a single capability */
  can: (cap: CapabilityKey) => boolean;
  /** Whether user has department access for this agent */
  hasDepartmentAccess: boolean;
  /** Current user's role label */
  roleLabel: string;
  /** Whether approval is required for actions (non-owner/admin) */
  requiresApproval: boolean;
  /** Get escalation level for an action risk */
  getEscalationLevel: (riskLevel: "low" | "medium" | "high") => EscalationLevel;
  /** Get permission denial message for a capability */
  getDenialMessage: (cap: CapabilityKey) => string;
  /** Get draft-first label for an action (never "Publish" for non-owners) */
  getDraftLabel: (actionVerb: string) => string;
  /** Filter AI recommendations based on permissions */
  filterRecommendations: (recommendations: string[]) => string[];
  /** Get approval status message */
  getApprovalMessage: () => string;
}

/** Action keywords that imply write/publish operations */
const publishKeywords = [
  "yayınla", "publish", "canlıya al", "push live", "execute",
  "yürüt", "uygula", "doğrudan", "hemen çalıştır",
];

/** Action keywords that imply draft creation */
const draftKeywords = [
  "oluştur", "başlat", "hazırla", "taslak", "draft",
  "kampanya", "bütçe güncelle", "düzenle", "revize",
  "durdur", "kapat", "aç",
];

/** Action keywords that imply integration management */
const integrationKeywords = [
  "bağla", "connect", "entegre", "entegrasyon",
  "kur", "yapılandır",
];

export function useAgentPermissions(agentId: string): AgentPermissionContext {
  const { currentUser, roleLabels, hasAccessToAgent } = useRBAC();

  return useMemo(() => {
    const hasDepartmentAccess = hasAccessToAgent(agentId);
    const roleCaps = roleCapabilityMap[currentUser.role];

    const capabilities: AgentCapabilities = {
      ...roleCaps,
      "department.access": hasDepartmentAccess,
    };

    const can = (cap: CapabilityKey) => capabilities[cap];

    const requiresApproval = currentUser.role !== "owner" && currentUser.role !== "admin";

    const getEscalationLevel = (riskLevel: "low" | "medium" | "high"): EscalationLevel => {
      if (riskLevel === "high") return "high_impact";
      if (riskLevel === "medium" && requiresApproval) return "standard";
      return "none";
    };

    const denialMessages: Record<CapabilityKey, string> = {
      "analysis.view": "Bu analizi görüntüleme yetkiniz yok.",
      "action.draft.create": "Taslak oluşturma yetkiniz yok. Yalnızca analiz görüntüleyebilirsiniz.",
      "action.publish": "Yayınlama yetkiniz yok. Taslak oluşturup onaya gönderin.",
      "task.create": "Görev oluşturma yetkiniz yok.",
      "task.assign": "Görev atama yetkiniz yok.",
      "integration.connect": "Entegrasyon bağlama yetkiniz yok. Çalışma alanı sahibiyle iletişime geçin.",
      "settings.thresholds": "Eşik değerlerini düzenleme yetkiniz yok.",
      "department.access": "Bu departmana erişim yetkiniz yok.",
    };

    const getDenialMessage = (cap: CapabilityKey) => denialMessages[cap];

    const getDraftLabel = (actionVerb: string): string => {
      if (can("action.publish")) return actionVerb;
      if (can("action.draft.create")) return `Taslak ${actionVerb}`;
      return actionVerb; // won't be shown anyway
    };

    const filterRecommendations = (recommendations: string[]): string[] => {
      return recommendations.filter((rec) => {
        const lower = rec.toLowerCase();

        // If user can't create drafts, remove all action suggestions
        if (!can("action.draft.create")) {
          const isAction = draftKeywords.some((k) => lower.includes(k));
          if (isAction) return false;
        }

        // Never show publish suggestions unless user can publish
        if (!can("action.publish")) {
          const isPublish = publishKeywords.some((k) => lower.includes(k));
          if (isPublish) return false;
        }

        // Remove integration suggestions if user can't connect
        if (!can("integration.connect")) {
          const isIntegration = integrationKeywords.some((k) => lower.includes(k));
          if (isIntegration) return false;
        }

        return true;
      }).map((rec) => {
        // Rewrite publish-style language to draft-first for non-publishers
        if (!can("action.publish")) {
          let rewritten = rec;
          publishKeywords.forEach((kw) => {
            const regex = new RegExp(kw, "gi");
            rewritten = rewritten.replace(regex, "taslak oluştur");
          });
          return rewritten;
        }
        return rec;
      });
    };

    const getApprovalMessage = (): string => {
      if (currentUser.role === "owner") return "Bu aksiyonu onaylayabilirsiniz.";
      if (currentUser.role === "admin") return "Bu aksiyonu onaylayabilirsiniz.";
      if (currentUser.role === "department_lead") return "Bu taslak onay gerektirecektir.";
      return "Yalnızca analiz görüntüleyebilirsiniz.";
    };

    return {
      capabilities,
      can,
      hasDepartmentAccess,
      roleLabel: roleLabels[currentUser.role],
      requiresApproval,
      getEscalationLevel,
      getDenialMessage,
      getDraftLabel,
      filterRecommendations,
      getApprovalMessage,
    };
  }, [agentId, currentUser, hasAccessToAgent, roleLabels]);
}
