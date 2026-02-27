/**
 * Enterprise Permission Matrix — Interactive checkbox grid with scope config,
 * risk coloring, search/filter, sticky headers, and safety rules.
 */

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, RotateCcw, Copy, Download, ChevronDown,
  AlertTriangle, Shield, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ORG_LEVEL_LABELS,
  FUNCTIONAL_ROLE_LABELS,
  type OrgLevel,
  type FunctionalRole,
  type SystemRole,
  type PermissionAction,
  type PermissionResource,
  type Permission,
} from "@/core/security/authorization/types";
import {
  LEVEL_DEFAULT_PERMISSIONS,
  FUNCTIONAL_ROLE_PERMISSIONS,
  SYSTEM_ROLE_PERMISSIONS,
} from "@/core/security/authorization/defaults";
import { useAuthorization } from "@/contexts/AuthorizationContext";
import { auditLogger } from "@/core/engine/audit";
import ScopeConfigModal, { type ScopeConfig } from "./ScopeConfigModal";

// ── Constants ──────────────────────────────────────────

const RESOURCES: PermissionResource[] = [
  "dashboard", "report", "decision", "action", "integration",
  "tech_integration", "agent_workspace", "organization", "department",
  "okr", "alert", "settings", "task", "strategy", "analysis",
  "marketplace", "creative_workspace", "position_history", "seat",
  "billing", "approval_policy", "user_roles",
];

const RESOURCE_LABELS: Record<string, string> = {
  dashboard: "Dashboard", report: "Raporlar", decision: "Kararlar", action: "Aksiyonlar",
  integration: "Entegrasyonlar", tech_integration: "Teknik Entegrasyon",
  agent_workspace: "Ajan Alanı", organization: "Organizasyon", department: "Departmanlar",
  okr: "OKR", alert: "Uyarılar", settings: "Ayarlar", task: "Görevler",
  strategy: "Strateji", analysis: "Analiz", marketplace: "Marketplace",
  creative_workspace: "Kreatif Alan", position_history: "Pozisyon Geçmişi",
  seat: "Kadro", billing: "Faturalandırma", approval_policy: "Onay Politikaları",
  user_roles: "Kullanıcı Rolleri",
};

const ACTIONS: PermissionAction[] = ["view", "create", "propose", "approve", "execute", "admin"];

const ACTION_COLORS: Record<PermissionAction, string> = {
  view: "text-muted-foreground",
  create: "text-primary",
  propose: "text-primary",
  approve: "text-warning",
  execute: "text-destructive",
  admin: "text-[hsl(270,80%,65%)]",
};

const ACTION_BG: Record<PermissionAction, string> = {
  view: "",
  create: "bg-primary/5",
  propose: "bg-primary/5",
  approve: "bg-warning/5",
  execute: "bg-destructive/5",
  admin: "bg-[hsl(270,80%,65%)]/5",
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "Gör", create: "Oluştur", propose: "Öner",
  approve: "Onayla", execute: "Çalıştır", admin: "Yönet",
};

type RoleType = "level" | "functional" | "system";

interface RoleRow {
  type: RoleType;
  key: string;
  label: string;
}

export interface RolePermission {
  roleType: RoleType;
  roleKey: string;
  resource: string;
  action: string;
  scope: string;
  enabled: boolean;
}

type FilterMode = "all" | "level" | "functional" | "system";

// ── Helpers ──────────────────────────────────────────

function buildInitialState(): Map<string, RolePermission> {
  const map = new Map<string, RolePermission>();

  const add = (type: RoleType, key: string, perms: Permission[]) => {
    for (const p of perms) {
      const cellKey = `${type}:${key}:${p.resource}:${p.action}`;
      map.set(cellKey, {
        roleType: type,
        roleKey: key,
        resource: p.resource,
        action: p.action,
        scope: p.scope.target ? `${p.scope.type}:${p.scope.target}` : p.scope.type,
        enabled: true,
      });
    }
  };

  for (const [level, perms] of Object.entries(LEVEL_DEFAULT_PERMISSIONS)) {
    add("level", level, perms);
  }
  for (const [role, perms] of Object.entries(FUNCTIONAL_ROLE_PERMISSIONS)) {
    add("functional", role, perms);
  }
  for (const [role, perms] of Object.entries(SYSTEM_ROLE_PERMISSIONS)) {
    add("system", role, perms);
  }

  return map;
}

function cellKey(type: RoleType, key: string, resource: string, action: string) {
  return `${type}:${key}:${resource}:${action}`;
}

const SYSTEM_ROLES: SystemRole[] = ["owner", "system_admin", "security_admin", "billing_admin"];
const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  owner: "Owner", system_admin: "System Admin",
  security_admin: "Security Admin", billing_admin: "Billing Admin",
};

// ── Component ────────────────────────────────────────

export default function PermissionMatrix() {
  const { isOwner, profile } = useAuthorization();
  const [permissions, setPermissions] = useState(() => buildInitialState());
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [scopeModal, setScopeModal] = useState<{
    open: boolean;
    type: RoleType;
    key: string;
    resource: string;
    action: string;
    roleName: string;
    initial?: ScopeConfig;
  } | null>(null);

  // Build rows
  const allRows = useMemo<RoleRow[]>(() => {
    const rows: RoleRow[] = [];

    if (filterMode === "all" || filterMode === "level") {
      for (const [k, v] of Object.entries(ORG_LEVEL_LABELS)) {
        rows.push({ type: "level", key: k, label: v });
      }
    }
    if (filterMode === "all" || filterMode === "functional") {
      for (const [k, v] of Object.entries(FUNCTIONAL_ROLE_LABELS)) {
        rows.push({ type: "functional", key: k, label: v });
      }
    }
    if (filterMode === "all" || filterMode === "system") {
      for (const k of SYSTEM_ROLES) {
        rows.push({ type: "system", key: k, label: SYSTEM_ROLE_LABELS[k] });
      }
    }

    return rows;
  }, [filterMode]);

  // Filter resources by search
  const filteredResources = useMemo(() => {
    if (!search.trim()) return RESOURCES;
    const q = search.toLowerCase();
    return RESOURCES.filter((r) => {
      const label = RESOURCE_LABELS[r] ?? r;
      return label.toLowerCase().includes(q) || r.toLowerCase().includes(q);
    });
  }, [search]);

  const isChecked = useCallback(
    (type: RoleType, key: string, resource: string, action: string) => {
      return permissions.has(cellKey(type, key, resource, action));
    },
    [permissions]
  );

  const isProtected = useCallback(
    (type: RoleType, key: string, _resource: string, _action: string): boolean => {
      // Owner cannot remove own owner/system_admin
      if (type === "system" && key === "owner") return true;
      // Non-owner cannot edit system roles
      if (type === "system" && !isOwner) return true;
      return false;
    },
    [isOwner]
  );

  const toggleCell = useCallback(
    (type: RoleType, key: string, resource: string, action: string, roleName: string) => {
      if (isProtected(type, key, resource, action)) {
        toast.error("Bu izin korumalıdır ve değiştirilemez.");
        return;
      }

      const ck = cellKey(type, key, resource, action);
      const exists = permissions.has(ck);

      if (exists) {
        // Remove
        setPermissions((prev) => {
          const next = new Map(prev);
          next.delete(ck);
          return next;
        });
        auditLogger.log({
          tenant_id: profile.tenant_id,
          user_id: profile.user_id,
          seat_key: null,
          action_type: "update",
          entity_type: "permission",
          entity_id: ck,
          reason: `Removed ${resource}.${action} from ${type}:${key}`,
        });
        toast.info(`${roleName}: ${resource}.${action} kaldırıldı`);
      } else {
        // Open scope modal
        setScopeModal({
          open: true,
          type,
          key,
          resource,
          action,
          roleName,
        });
      }
    },
    [permissions, isProtected, profile]
  );

  const handleScopeConfirm = useCallback(
    (scope: ScopeConfig) => {
      if (!scopeModal) return;
      const { type, key, resource, action, roleName } = scopeModal;
      const ck = cellKey(type, key, resource, action);
      const scopeStr = scope.targets.length
        ? `${scope.type}:${scope.targets.join(",")}`
        : scope.type;

      setPermissions((prev) => {
        const next = new Map(prev);
        next.set(ck, {
          roleType: type,
          roleKey: key,
          resource,
          action,
          scope: scopeStr,
          enabled: true,
        });
        return next;
      });

      auditLogger.log({
        tenant_id: profile.tenant_id,
        user_id: profile.user_id,
        seat_key: null,
        action_type: "update",
        entity_type: "permission",
        entity_id: ck,
        reason: `Added ${resource}.${action} to ${type}:${key} with scope ${scopeStr}`,
      });

      toast.success(`${roleName}: ${resource}.${action} [${scopeStr}] eklendi`);
      setScopeModal(null);
    },
    [scopeModal, profile]
  );

  // ── Actions ──
  const resetToDefaults = () => {
    setPermissions(buildInitialState());
    toast.success("İzinler varsayılan şablona sıfırlandı.");
    auditLogger.log({
      tenant_id: profile.tenant_id,
      user_id: profile.user_id,
      seat_key: null,
      action_type: "update",
      entity_type: "permission_matrix",
      entity_id: "all",
      reason: "Reset to default template",
    });
  };

  const duplicateTemplate = () => {
    const exported = Array.from(permissions.values());
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const name = `policy-template-copy-${Date.now()}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Şablon kopyası indirildi: ${name}`);
  };

  const exportJSON = () => {
    const exported = Array.from(permissions.values());
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policy-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Policy JSON dışa aktarıldı.");
  };

  const totalPerms = permissions.size;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kaynak ara…"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">Tümü</option>
            <option value="level">Seviyeler</option>
            <option value="functional">Fonksiyonel Roller</option>
            <option value="system">Sistem Rolleri</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        {/* Stats */}
        <Badge variant="secondary" className="text-[10px] gap-1">
          <Shield className="h-3 w-3" /> {totalPerms} izin aktif
        </Badge>

        {/* Action buttons */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium rounded-xl bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Sıfırla
          </button>
          <button
            onClick={duplicateTemplate}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium rounded-xl bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Copy className="h-3 w-3" /> Kopyala
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          >
            <Download className="h-3 w-3" /> JSON
          </button>
        </div>
      </div>

      {/* Risk legend */}
      <div className="flex items-center gap-4 text-[10px]">
        <span className="text-muted-foreground">Risk:</span>
        {ACTIONS.map((a) => (
          <span key={a} className={`flex items-center gap-1 ${ACTION_COLORS[a]}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {ACTION_LABELS[a]}
          </span>
        ))}
      </div>

      {/* Matrix table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead className="sticky top-0 z-20">
              {/* Resource headers */}
              <tr className="bg-popover border-b border-border">
                <th className="sticky left-0 z-30 bg-popover p-2 text-left text-muted-foreground font-medium min-w-[180px] border-r border-border">
                  Rol / Kaynak
                </th>
                {filteredResources.map((resource) => (
                  <th
                    key={resource}
                    colSpan={ACTIONS.length}
                    className="p-2 text-center font-medium text-foreground border-r border-border/50 whitespace-nowrap"
                  >
                    {RESOURCE_LABELS[resource] ?? resource}
                  </th>
                ))}
              </tr>
              {/* Action sub-headers */}
              <tr className="bg-popover/80 border-b border-border">
                <th className="sticky left-0 z-30 bg-popover/80 p-1 border-r border-border" />
                {filteredResources.map((resource) =>
                  ACTIONS.map((action) => (
                    <th
                      key={`${resource}-${action}`}
                      className={`p-1.5 text-center font-medium whitespace-nowrap ${ACTION_COLORS[action]} ${ACTION_BG[action]}`}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{ACTION_LABELS[action]}</span>
                        {(action === "execute" || action === "admin") && (
                          <AlertTriangle className="h-2.5 w-2.5 opacity-60" />
                        )}
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {allRows.map((row, ri) => {
                const isSystemRow = row.type === "system";
                const prevType = ri > 0 ? allRows[ri - 1].type : null;
                const showSeparator = prevType !== null && prevType !== row.type;

                return (
                  <>
                    {showSeparator && (
                      <tr key={`sep-${row.type}`}>
                        <td
                          colSpan={1 + filteredResources.length * ACTIONS.length}
                          className="sticky left-0 bg-muted/20 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-y border-border"
                        >
                          {row.type === "functional"
                            ? "Fonksiyonel Roller"
                            : row.type === "system"
                            ? "Sistem Rolleri (salt okunur)"
                            : "Seviyeler"}
                        </td>
                      </tr>
                    )}
                    <tr
                      key={`${row.type}-${row.key}`}
                      className={`border-b border-border/30 hover:bg-muted/10 transition-colors ${
                        isSystemRow ? "bg-muted/5" : ""
                      }`}
                    >
                      {/* Sticky role column */}
                      <td className="sticky left-0 z-10 bg-popover p-2.5 border-r border-border">
                        <div className="flex items-center gap-2">
                          {isSystemRow && <Lock className="h-3 w-3 text-warning shrink-0" />}
                          <div>
                            <span className="font-medium text-foreground text-xs">{row.label}</span>
                            <Badge variant="outline" className="ml-2 text-[8px] py-0">
                              {row.type === "level" ? "SEVİYE" : row.type === "functional" ? "FONKSİYONEL" : "SİSTEM"}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      {/* Permission cells */}
                      {filteredResources.map((resource) =>
                        ACTIONS.map((action) => {
                          const checked = isChecked(row.type, row.key, resource, action);
                          const locked = isProtected(row.type, row.key, resource, action);
                          const perm = permissions.get(cellKey(row.type, row.key, resource, action));
                          const isHighRisk = action === "execute" || action === "admin";

                          return (
                            <td
                              key={`${resource}-${action}`}
                              className={`p-1 text-center ${ACTION_BG[action]} ${
                                isHighRisk && checked ? "ring-1 ring-inset ring-destructive/20" : ""
                              }`}
                            >
                              <div className="flex flex-col items-center gap-0.5">
                                <Checkbox
                                  checked={checked}
                                  disabled={locked}
                                  onCheckedChange={() =>
                                    toggleCell(row.type, row.key, resource, action, row.label)
                                  }
                                  className={`${
                                    locked ? "opacity-40 cursor-not-allowed" : ""
                                  } ${
                                    isHighRisk && checked
                                      ? "border-destructive data-[state=checked]:bg-destructive"
                                      : action === "approve" && checked
                                      ? "border-warning data-[state=checked]:bg-warning"
                                      : ""
                                  }`}
                                />
                                {checked && perm && perm.scope !== "org" && (
                                  <span className="text-[8px] text-muted-foreground leading-none">
                                    {perm.scope.split(":")[0]}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scope config modal */}
      <ScopeConfigModal
        isOpen={!!scopeModal?.open}
        onClose={() => setScopeModal(null)}
        onConfirm={handleScopeConfirm}
        resource={scopeModal?.resource ?? ""}
        action={scopeModal?.action ?? ""}
        roleName={scopeModal?.roleName ?? ""}
        initialScope={undefined}
      />
    </div>
  );
}
