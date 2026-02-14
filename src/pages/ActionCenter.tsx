import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ChevronDown, ChevronUp, CheckCircle2, XCircle, Send, Clock,
  AlertTriangle, Shield, ArrowRight, FileText, BarChart3, Undo2, DollarSign,
  History
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useActionMode, ActionDraft, ActionStatus, RiskLevel } from "@/contexts/ActionModeContext";
import { useRBAC } from "@/contexts/RBACContext";

const statusConfig: Record<ActionStatus, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Taslak", color: "text-muted-foreground", icon: FileText },
  pending_approval: { label: "Onay Bekliyor", color: "text-warning", icon: Clock },
  approved: { label: "Onaylandı", color: "text-success", icon: CheckCircle2 },
  published: { label: "Yayınlandı", color: "text-primary", icon: Send },
  rejected: { label: "Reddedildi", color: "text-destructive", icon: XCircle },
};

const riskColors: Record<RiskLevel, string> = {
  low: "text-success bg-success/10",
  medium: "text-warning bg-warning/10",
  high: "text-destructive bg-destructive/10",
};

type TabId = "pending" | "all" | "audit";

const ActionCard = ({ action }: { action: ActionDraft }) => {
  const [expanded, setExpanded] = useState(false);
  const { approveDraft, publishAction, rejectAction, actionTypeLabels, riskLabels } = useActionMode();
  const { currentUser, canPerform } = useRBAC();
  const isAdmin = currentUser.role === "owner" || currentUser.role === "admin";
  const isDeptLead = currentUser.role === "department_lead";
  const cfg = statusConfig[action.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-4 text-left">
        <div className="h-10 w-10 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground">{action.title}</p>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {actionTypeLabels[action.type]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusIcon className={`h-3.5 w-3.5 ${cfg.color}`} />
          <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-border space-y-4">
              {/* Changes */}
              <div className="pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Değişiklikler</span>
                </div>
                <div className="space-y-1">
                  {action.changes.map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-secondary/30">
                      <span className="text-xs text-foreground">{c.field}</span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground">{c.from}</span>
                        <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-foreground font-medium">{c.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <BarChart3 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tahmini Etki</span>
                  <p className="text-xs text-foreground mt-0.5">{action.estimatedImpact}</p>
                </div>
              </div>

              {/* Risk */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${riskColors[action.riskLevel]}`}>
                  Risk: {riskLabels[action.riskLevel]}
                </span>
                {action.riskFlags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    <span className="text-[10px] text-warning">{flag}</span>
                  </div>
                ))}
              </div>

              {/* Budget cap */}
              {action.budgetCap && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Bütçe Sınırı: ${action.budgetCap}</span>
                </div>
              )}

              {/* Rollback */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30">
                <Undo2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Geri Alma Planı</span>
                  <p className="text-xs text-foreground mt-0.5">{action.rollbackPlan}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="text-[10px] text-muted-foreground space-y-0.5">
                <p>Oluşturan: {action.createdBy} · {new Date(action.createdAt).toLocaleString("tr-TR")}</p>
                {action.approvedBy && <p>Onaylayan: {action.approvedBy} · {new Date(action.approvedAt!).toLocaleString("tr-TR")}</p>}
                {action.publishedBy && <p>Yayınlayan: {action.publishedBy} · {new Date(action.publishedAt!).toLocaleString("tr-TR")}</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {action.status === "draft" && isAdmin && (
                  <button onClick={() => approveDraft(action.id, currentUser.name)} className="btn-primary px-4 py-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1.5 inline" />
                    Taslağı Onayla
                  </button>
                )}
                {action.status === "pending_approval" && isAdmin && (
                  <button onClick={() => approveDraft(action.id, currentUser.name)} className="btn-primary px-4 py-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1.5 inline" />
                    Taslağı Onayla
                  </button>
                )}
                {action.status === "approved" && isAdmin && (
                  <button onClick={() => publishAction(action.id, currentUser.name)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                    <Send className="h-3 w-3 mr-1.5 inline" />
                    Yayınla
                  </button>
                )}
                {(action.status === "draft" || action.status === "pending_approval") && isAdmin && (
                  <button onClick={() => rejectAction(action.id, currentUser.name)} className="px-3 py-2 rounded-xl hover:bg-destructive/10 text-xs text-muted-foreground hover:text-destructive transition-colors">
                    <XCircle className="h-3 w-3 mr-1.5 inline" />
                    Reddet
                  </button>
                )}
                {!isAdmin && !isDeptLead && (
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    Aksiyon yönetimi yetkiniz bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionCenter = () => {
  const { actions, auditLog, pendingCount, draftCount } = useActionMode();
  const [activeTab, setActiveTab] = useState<TabId>("pending");

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "pending", label: "Bekleyen", count: pendingCount + draftCount },
    { id: "all", label: "Tümü" },
    { id: "audit", label: "Denetim Kaydı" },
  ];

  const filteredActions = activeTab === "pending"
    ? actions.filter(a => a.status === "draft" || a.status === "pending_approval" || a.status === "approved")
    : actions;

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-warning/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aksiyon Merkezi</h1>
              <p className="text-sm text-muted-foreground">Yapay zeka önerilerini incele, onayla ve yayınla</p>
            </div>
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/15 mt-4 mb-6">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-warning font-medium">Aksiyon Modu Uyarısı</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Onaylanan aksiyonlar harici sistemlerde değişiklik yapar ve harcama oluşturabilir. Her aksiyonu dikkatle inceleyin.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary/30 rounded-2xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-warning/15 text-warning text-[9px] font-bold">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab !== "audit" ? (
            <div className="space-y-2">
              {filteredActions.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Bekleyen aksiyon bulunmuyor.</p>
                </div>
              ) : (
                filteredActions.map(action => <ActionCard key={action.id} action={action} />)
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {auditLog.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Denetim kaydı boş.</p>
                </div>
              ) : (
                auditLog.map(entry => (
                  <div key={entry.id} className="glass-card p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{entry.event}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{entry.userName}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{entry.details}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{new Date(entry.timestamp).toLocaleString("tr-TR")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ActionCenter;
