import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export type ActionStatus = "draft" | "pending_approval" | "approved" | "published" | "rejected";
export type ActionType = "campaign_create" | "budget_update" | "pause_resume" | "adset_edit" | "ad_create";
export type RiskLevel = "low" | "medium" | "high";

export interface ActionDraft {
  id: string;
  integrationId: string;
  type: ActionType;
  title: string;
  description: string;
  status: ActionStatus;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedBy?: string;
  publishedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  estimatedImpact: string;
  riskLevel: RiskLevel;
  riskFlags: string[];
  budgetCap?: number;
  rollbackPlan: string;
  changes: { field: string; from: string; to: string }[];
}

export interface BudgetCaps {
  dailySpendLimit: number;
  weeklySpendLimit: number;
  maxBudgetChangePercent: number;
  allowedObjectives: string[];
}

export interface AuditLogEntry {
  id: string;
  actionId: string;
  event: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
}

const actionTypeLabels: Record<ActionType, string> = {
  campaign_create: "Kampanya Oluşturma",
  budget_update: "Bütçe Güncelleme",
  pause_resume: "Durdur/Devam Ettir",
  adset_edit: "Reklam Seti Düzenleme",
  ad_create: "Reklam Oluşturma",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

// Mock data
const mockActions: ActionDraft[] = [
  {
    id: "act-1",
    integrationId: "meta-ads",
    type: "campaign_create",
    title: "Yaz Kampanyası — Dönüşüm Odaklı",
    description: "Yaz sezonu için yeni dönüşüm kampanyası oluşturma. Hedef kitle: 25-45 yaş, ilgi alanı: e-ticaret.",
    status: "pending_approval",
    createdBy: "AI CMO",
    createdAt: "2026-02-14T09:30:00Z",
    estimatedImpact: "Tahmini ROAS: 3.2x · Günlük erişim: ~15,000",
    riskLevel: "medium",
    riskFlags: ["Yeni hedef kitle segmenti", "Bütçe eşiğine yakın"],
    budgetCap: 500,
    rollbackPlan: "Kampanya 24 saat içinde performans eşiğini karşılamazsa otomatik durdurulur.",
    changes: [
      { field: "Kampanya Adı", from: "—", to: "Yaz 2026 — Dönüşüm" },
      { field: "Günlük Bütçe", from: "—", to: "$500" },
      { field: "Hedef", from: "—", to: "Dönüşüm" },
    ],
  },
  {
    id: "act-2",
    integrationId: "meta-ads",
    type: "budget_update",
    title: "Ana Kampanya Bütçe Artışı",
    description: "Yüksek performanslı ana kampanyanın günlük bütçesini %15 artırma önerisi.",
    status: "draft",
    createdBy: "AI Performance Marketer",
    createdAt: "2026-02-14T10:15:00Z",
    estimatedImpact: "Tahmini ek harcama: $75/gün · Beklenen ROAS artışı: +0.4x",
    riskLevel: "low",
    riskFlags: [],
    budgetCap: 575,
    rollbackPlan: "Önceki bütçe seviyesine ($500) geri alınabilir.",
    changes: [
      { field: "Günlük Bütçe", from: "$500", to: "$575" },
    ],
  },
  {
    id: "act-3",
    integrationId: "meta-ads",
    type: "pause_resume",
    title: "Düşük Performanslı Reklam Seti Durdurma",
    description: "CPA eşiğini 3 gün üst üste aşan reklam setinin durdurulması.",
    status: "pending_approval",
    createdBy: "AI CMO",
    createdAt: "2026-02-13T16:45:00Z",
    estimatedImpact: "Tahmini günlük tasarruf: $120 · ROAS etkisi: nötr",
    riskLevel: "low",
    riskFlags: [],
    rollbackPlan: "Reklam seti istenen zaman yeniden etkinleştirilebilir.",
    changes: [
      { field: "Durum", from: "Aktif", to: "Duraklatıldı" },
    ],
  },
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "log-1",
    actionId: "act-0",
    event: "Taslak Onaylandı",
    userId: "u1",
    userName: "Ahmet Yılmaz",
    timestamp: "2026-02-13T14:00:00Z",
    details: "Retargeting kampanyası oluşturma taslağı onaylandı.",
  },
  {
    id: "log-2",
    actionId: "act-0",
    event: "Yayınlandı",
    userId: "u1",
    userName: "Ahmet Yılmaz",
    timestamp: "2026-02-13T14:05:00Z",
    details: "Retargeting kampanyası Meta Ads'e yayınlandı.",
  },
];

interface ActionModeContextType {
  // Action mode per integration
  actionModeEnabled: Record<string, boolean>;
  toggleActionMode: (integrationId: string, enabled: boolean) => void;
  isActionModeEnabled: (integrationId: string) => boolean;

  // Actions
  actions: ActionDraft[];
  createDraft: (draft: Omit<ActionDraft, "id" | "status" | "createdAt">) => void;
  approveDraft: (actionId: string, userName: string) => void;
  publishAction: (actionId: string, userName: string) => void;
  rejectAction: (actionId: string, userName: string) => void;

  // Budget caps
  budgetCaps: BudgetCaps;
  updateBudgetCaps: (caps: Partial<BudgetCaps>) => void;

  // Audit log
  auditLog: AuditLogEntry[];

  // Labels
  actionTypeLabels: Record<ActionType, string>;
  riskLabels: Record<RiskLevel, string>;

  // Counts
  pendingCount: number;
  draftCount: number;
}

const ActionModeContext = createContext<ActionModeContextType | null>(null);

export const useActionMode = () => {
  const ctx = useContext(ActionModeContext);
  if (!ctx) throw new Error("useActionMode must be used within ActionModeProvider");
  return ctx;
};

export const ActionModeProvider = ({ children }: { children: ReactNode }) => {
  const [actionModeEnabled, setActionModeEnabled] = useState<Record<string, boolean>>({});
  const [actions, setActions] = useState<ActionDraft[]>(mockActions);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [budgetCaps, setBudgetCaps] = useState<BudgetCaps>({
    dailySpendLimit: 1000,
    weeklySpendLimit: 5000,
    maxBudgetChangePercent: 20,
    allowedObjectives: ["Dönüşüm", "Trafik", "Marka Bilinirliği", "Etkileşim"],
  });

  const toggleActionMode = useCallback((integrationId: string, enabled: boolean) => {
    setActionModeEnabled(prev => ({ ...prev, [integrationId]: enabled }));
    toast[enabled ? "warning" : "info"](
      enabled
        ? "Aksiyon Modu etkinleştirildi. Yazma erişimi aktif."
        : "Aksiyon Modu devre dışı. Salt okunur moda dönüldü."
    );
  }, []);

  const isActionModeEnabled = useCallback((integrationId: string) => {
    return actionModeEnabled[integrationId] ?? false;
  }, [actionModeEnabled]);

  const addAuditEntry = (actionId: string, event: string, userName: string, details: string) => {
    setAuditLog(prev => [{
      id: `log-${Date.now()}`,
      actionId,
      event,
      userId: "current",
      userName,
      timestamp: new Date().toISOString(),
      details,
    }, ...prev]);
  };

  const createDraft = useCallback((draft: Omit<ActionDraft, "id" | "status" | "createdAt">) => {
    const newAction: ActionDraft = {
      ...draft,
      id: `act-${Date.now()}`,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setActions(prev => [newAction, ...prev]);
    addAuditEntry(newAction.id, "Taslak Oluşturuldu", draft.createdBy, `${draft.title} taslağı oluşturuldu.`);
    toast.success("Aksiyon taslağı oluşturuldu.");
  }, []);

  const approveDraft = useCallback((actionId: string, userName: string) => {
    setActions(prev => prev.map(a =>
      a.id === actionId ? { ...a, status: "approved" as ActionStatus, approvedBy: userName, approvedAt: new Date().toISOString() } : a
    ));
    addAuditEntry(actionId, "Taslak Onaylandı", userName, "Aksiyon taslağı onaylandı.");
    toast.success("Taslak onaylandı. Yayınlanmaya hazır.");
  }, []);

  const publishAction = useCallback((actionId: string, userName: string) => {
    setActions(prev => prev.map(a =>
      a.id === actionId ? { ...a, status: "published" as ActionStatus, publishedBy: userName, publishedAt: new Date().toISOString() } : a
    ));
    addAuditEntry(actionId, "Yayınlandı", userName, "Aksiyon harici sisteme yayınlandı.");
    toast.success("Aksiyon başarıyla yayınlandı.");
  }, []);

  const rejectAction = useCallback((actionId: string, userName: string) => {
    setActions(prev => prev.map(a =>
      a.id === actionId ? { ...a, status: "rejected" as ActionStatus, rejectedBy: userName, rejectedAt: new Date().toISOString() } : a
    ));
    addAuditEntry(actionId, "Reddedildi", userName, "Aksiyon reddedildi.");
    toast.info("Aksiyon reddedildi.");
  }, []);

  const updateBudgetCaps = useCallback((caps: Partial<BudgetCaps>) => {
    setBudgetCaps(prev => ({ ...prev, ...caps }));
    toast.success("Bütçe limitleri güncellendi.");
  }, []);

  const pendingCount = actions.filter(a => a.status === "pending_approval").length;
  const draftCount = actions.filter(a => a.status === "draft").length;

  return (
    <ActionModeContext.Provider value={{
      actionModeEnabled,
      toggleActionMode,
      isActionModeEnabled,
      actions,
      createDraft,
      approveDraft,
      publishAction,
      rejectAction,
      budgetCaps,
      updateBudgetCaps,
      auditLog,
      actionTypeLabels,
      riskLabels,
      pendingCount,
      draftCount,
    }}>
      {children}
    </ActionModeContext.Provider>
  );
};
