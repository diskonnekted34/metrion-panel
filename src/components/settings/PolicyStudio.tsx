/**
 * Policy Studio — Owner-only settings page for managing authorization.
 * Tabs: Levels, Functional Roles, Permission Matrix, Approval Rules, Classification
 */

import { useState } from "react";
import { useAuthorization } from "@/contexts/AuthorizationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Key, GitBranch, Tag,
  Check, X, Lock, Eye, Edit, Zap, Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ORG_LEVEL_LABELS,
  FUNCTIONAL_ROLE_LABELS,
  CLASSIFICATION_LABELS,
  CLASSIFICATION_SEVERITY,
  type OrgLevel,
  type FunctionalRole,
  type DataClassificationTag,
  type PermissionAction,
  type PermissionResource,
  type ApprovalRule,
} from "@/core/security/authorization/types";
import {
  LEVEL_DEFAULT_PERMISSIONS,
  FUNCTIONAL_ROLE_PERMISSIONS,
} from "@/core/security/authorization/defaults";
import PermissionMatrix from "./PermissionMatrix";

const TABS = [
  { key: "levels", label: "Seviyeler", icon: Users },
  { key: "functional", label: "Fonksiyonel Roller", icon: Key },
  { key: "permissions", label: "İzin Matrisi", icon: Shield },
  { key: "approvals", label: "Onay Kuralları", icon: GitBranch },
  { key: "classification", label: "Veri Sınıflandırma", icon: Tag },
] as const;

type TabKey = typeof TABS[number]["key"];

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "Görüntüle", create: "Oluştur", propose: "Öner", approve: "Onayla", execute: "Çalıştır", admin: "Yönet",
};

const RESOURCE_LABELS: Record<PermissionResource, string> = {
  dashboard: "Dashboard", report: "Raporlar", decision: "Kararlar", action: "Aksiyonlar",
  task: "Görevler", alert: "Uyarılar", integration: "Entegrasyonlar",
  tech_integration: "Teknik Entegrasyonlar", department: "Departmanlar",
  organization: "Organizasyon", seat: "Kadro", agent_workspace: "Ajan Alanı",
  settings: "Ayarlar", billing: "Faturalandırma", okr: "OKR", strategy: "Strateji",
  analysis: "Analiz", marketplace: "Marketplace", creative_workspace: "Kreatif Alan",
  position_history: "Pozisyon Geçmişi", approval_policy: "Onay Politikaları",
  user_roles: "Kullanıcı Rolleri",
};

export default function PolicyStudio() {
  const { profile, approvalRules, isOwner } = useAuthorization();
  const [activeTab, setActiveTab] = useState<TabKey>("permissions");

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Policy Studio</h2>
          <p className="text-xs text-muted-foreground">Yetkilendirme politikalarını yönetin</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/40 overflow-x-auto">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "levels" && <LevelsPanel />}
          {activeTab === "functional" && <FunctionalRolesPanel />}
          {activeTab === "permissions" && <PermissionMatrix />}
          {activeTab === "approvals" && <ApprovalRulesPanel rules={approvalRules} />}
          {activeTab === "classification" && <ClassificationPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Levels Panel ───────────────────────────────────────
function LevelsPanel() {
  const levels = Object.entries(ORG_LEVEL_LABELS) as [OrgLevel, string][];
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Organizasyonel seviyeler ve varsayılan izinleri</p>
      {levels.map(([level, label], i) => {
        const perms = LEVEL_DEFAULT_PERMISSIONS[level] ?? [];
        const permGroups = new Map<string, string[]>();
        perms.forEach((p) => {
          const existing = permGroups.get(p.resource) ?? [];
          existing.push(p.action);
          permGroups.set(p.resource, existing);
        });

        return (
          <motion.div
            key={level}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card/40"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">L{i}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{perms.length} varsayılan izin</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(permGroups.entries()).map(([resource, actions]) => (
                <Badge key={resource} variant="secondary" className="text-[10px] gap-1">
                  {RESOURCE_LABELS[resource as PermissionResource] ?? resource}
                  <span className="text-muted-foreground">
                    ({actions.join(", ")})
                  </span>
                </Badge>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Functional Roles Panel ─────────────────────────────
function FunctionalRolesPanel() {
  const roles = Object.entries(FUNCTIONAL_ROLE_LABELS) as [FunctionalRole, string][];
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Fonksiyonel roller ve yetki blokları — seviyeden bağımsız atanabilir</p>
      <div className="grid gap-3 md:grid-cols-2">
        {roles.map(([role, label], i) => {
          const perms = FUNCTIONAL_ROLE_PERMISSIONS[role] ?? [];
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-4 rounded-xl border border-border bg-card/40"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <Key className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-1">
                {perms.map((perm, j) => (
                  <Badge key={j} variant="outline" className="text-[10px]">
                    {perm.resource}.{perm.action}
                    {perm.scope.type !== "org" && `.${perm.scope.type}`}
                  </Badge>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Approval Rules Panel ───────────────────────────────
function ApprovalRulesPanel({ rules }: { rules: ApprovalRule[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Onay iş akışı kuralları — seviyeden bağımsız çalışır</p>
      {rules.map((rule, i) => (
        <motion.div
          key={rule.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-4 rounded-xl border border-border bg-card/40"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-warning" />
              <p className="text-sm font-semibold text-foreground">{rule.name}</p>
            </div>
            <Switch checked={rule.enabled} />
          </div>
          <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px]">
              Kaynak: {RESOURCE_LABELS[rule.condition.resource]}
            </Badge>
            {rule.condition.action && (
              <Badge variant="outline" className="text-[10px]">
                Aksiyon: {ACTION_LABELS[rule.condition.action]}
              </Badge>
            )}
            {rule.condition.tags?.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">
                {CLASSIFICATION_LABELS[t]}
              </Badge>
            ))}
            {rule.condition.riskScoreAbove != null && (
              <Badge className="text-[10px] bg-destructive/10 text-destructive border-0">
                Risk &gt; {rule.condition.riskScoreAbove}
              </Badge>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Gerekli roller:</span>
            {rule.required_roles.map((r) => (
              <Badge key={r} variant="secondary" className="text-[10px]">
                {FUNCTIONAL_ROLE_LABELS[r]}
              </Badge>
            ))}
            <span className="ml-2">Min onay: {rule.min_approvals}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Classification Panel ───────────────────────────────
function ClassificationPanel() {
  const tags = Object.entries(CLASSIFICATION_LABELS) as [DataClassificationTag, string][];
  const severityColors = ["text-success", "text-primary", "text-warning", "text-destructive", "text-destructive"];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Veri sınıflandırma etiketleri ve güvenlik seviyeleri</p>
      <div className="grid gap-3 md:grid-cols-2">
        {tags.map(([tag, label], i) => {
          const severity = CLASSIFICATION_SEVERITY[tag];
          return (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-4 rounded-xl border border-border bg-card/40"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-1.5 w-4 rounded-full ${
                        j <= severity ? "bg-current " + (severityColors[severity] ?? "text-muted-foreground") : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Severity: {severity} — {severity === 0 ? "Herkes erişebilir" : severity <= 2 ? "Yetkili roller" : "Kısıtlı erişim"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
